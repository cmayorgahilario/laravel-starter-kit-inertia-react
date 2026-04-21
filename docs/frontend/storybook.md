---
title: Storybook
description: How Storybook is wired into the React Starter Kit — running it under Sail, the alias-based Inertia and Wayfinder mocks, the dark-mode decorator, the curated story set, and the conventions for adding new stories.
---

# Storybook

## Overview

Storybook 10 is wired into this project to render isolated previews of UI primitives and the application shell. The configuration lives in `.storybook/`, story files live in `resources/js/stories/`, and the dev server is exposed inside the Sail container on port 6006 (`compose.yaml:14`).

The story set is intentionally curated:

- **`resources/js/components/ui/`** (55 shadcn primitives) is _not_ documented in Storybook — the upstream [shadcn/ui docs](https://ui.shadcn.com) already covers each component with live examples. Only `Button.stories.tsx` is kept as a representative reference.
- **`resources/js/components/`** (project-owned components) is where Storybook adds value. Two stories ship today: `AppSidebar.stories.tsx` and `AppHeader.stories.tsx` — both render the full layout shells used by `app-sidebar-layout.tsx` and `app-header-layout.tsx`.

Anything that depends on Inertia (`Link`, `Form`, `usePage`, `router`, `Head`) or Wayfinder (`@/routes/*`, `@/actions/*`) cannot run inside the Storybook iframe without help — the runtime context that Inertia and Wayfinder rely on simply does not exist there. The fix is a set of alias-redirected mock modules under `.storybook/mocks/` (described below).

## Running Storybook

The npm scripts in `package.json` are:

| Script              | Command                          | Purpose                                                    |
| ------------------- | -------------------------------- | ---------------------------------------------------------- |
| `storybook`         | `storybook dev -p 6006 --host 0.0.0.0` | Start the Storybook dev server inside the Sail container    |
| `storybook:build`   | `storybook build`                | Produce a static `storybook-static/` site for hosting      |

To start the dev server:

```bash
vendor/bin/sail bun run storybook
```

Open <http://localhost:6006> on the host. The `--host 0.0.0.0` flag is required — without it the server binds to `127.0.0.1` inside the container and the host port mapping is unreachable.

To produce the static build:

```bash
vendor/bin/sail bun run storybook:build
```

The output lands in `storybook-static/` (gitignored). Serve it with any static host; only the dev port (6006) needs to be exposed for live work.

## Project layout

```
.storybook/
  main.ts             ← framework, story glob, addons, alias array
  preview.ts          ← global decorators (theme, color-scheme), tags, parameters
  tsconfig.json       ← Storybook-only TS config
  mocks/              ← stub modules aliased into story builds
    inertia-react.tsx ← Link / Form / usePage / router / Head / WhenVisible stubs
    wayfinder-helpers.ts ← makeRoute() / makeAction() factories
    routes/           ← stubs that mirror @/routes/* generated files
    actions/          ← stubs that mirror @/actions/* generated files

resources/js/stories/
  ui/                  ← shadcn primitives (one reference: Button)
    Button.stories.tsx
  layouts/             ← application shells (AppSidebar, AppHeader)
    AppSidebar.stories.tsx
    AppHeader.stories.tsx
```

The story glob `../resources/js/stories/**/*.stories.@(ts|tsx)` in `.storybook/main.ts` is recursive, so nested folders are picked up automatically. Story files _must_ live under `resources/js/stories/` — colocating stories next to components is not configured.

The folder hierarchy mirrors the story `title` prefix (`stories/ui/Button.stories.tsx` → `title: 'UI/Button'`, `stories/layouts/AppSidebar.stories.tsx` → `title: 'Layouts/AppSidebar'`). Keeping the filesystem and the sidebar in sync makes stories easier to find as the catalogue grows — create a new subfolder whenever you introduce a new top-level group (e.g., `stories/forms/`, `stories/navigation/`).

## Vite integration

Storybook reuses the project Vite config, but several plugins must be stripped because they require runtime context (`.storybook/main.ts`):

```ts
const STRIP_PLUGINS = new Set([
    'laravel-vite-plugin',
    'inertia',
    'wayfinder',
    'vite:react-compiler-babel',
    '@rolldown/plugin-babel',
]);
```

`viteFinal()` flattens `cfg.plugins` (because `mergeConfig` concatenates plugin arrays and would duplicate them), then filters by plugin `name`. Substring guards (`startsWith('vite-plugin-laravel')`, `startsWith('inertia')`, `startsWith('wayfinder')`) catch any version-suffixed names. After filtering, the alias array redirects `@inertiajs/react`, `@/routes`, and `@/actions` to the mock modules.

The `@/` catch-all alias (`@ → resources/js`) is registered last so the more specific Inertia and Wayfinder rules win on first match.

## Theming and dark mode

`preview.ts` registers `withThemeByClassName` from `@storybook/addon-themes` and a small inline decorator that mirrors the DOM-write half of `use-appearance.ts`:

```ts
withThemeByClassName({
    themes: { light: '', dark: 'dark' },
    defaultTheme: 'light',
    parentSelector: 'html',
}),
(Story, { globals }) => {
    document.documentElement.style.colorScheme =
        globals.theme === 'dark' ? 'dark' : 'light';
    return Story();
},
```

`parentSelector: 'html'` is non-default and required. Tailwind v4 `dark:` variants in this project target `html.dark` (because `applyTheme` writes the class to `document.documentElement`). The addon defaults to `body`, which leaves `html.dark` unset and silently breaks every dark mode style.

The toolbar gains a Light/Dark switcher automatically. `app.css` is imported at the top of `preview.ts` so all Tailwind utilities resolve in the iframe.

***

## Mocking Inertia and Wayfinder

Components like `AppSidebar` and `AppHeader` import `Link` from `@inertiajs/react`, read `auth.user` from `usePage()`, and call generated route helpers like `home()` and `login()` from `@/routes`. Inside the Storybook iframe none of those resolve — there is no Inertia provider, no shared page object, and the Wayfinder-generated files are gitignored.

The `.storybook/mocks/` directory provides drop-in replacements that the alias array in `main.ts` redirects every Inertia/Wayfinder import to.

### `inertia-react.tsx`

A flat module that re-exports the names imported by application code:

| Export       | Behavior                                                                                            |
| ------------ | --------------------------------------------------------------------------------------------------- |
| `Link`       | Renders an `<a>` with `event.preventDefault()` on click. Resolves Wayfinder `{ url, method }` objects to the `url` string. |
| `Form`       | Renders a `<form>` that calls `event.preventDefault()`. Supports both ReactNode children and the children-as-function pattern with the full `FormRenderState` (`processing`, `errors`, `wasSuccessful`, `recentlySuccessful`, `resetAndClearErrors`, `reset`, `clearErrors`, `setError`). |
| `usePage<T>` | Returns a memoised page shape with a default `auth.user` (Ada Lovelace), `app.name = 'Storybook'`, and empty `breadcrumbs` / `flash`. |
| `router`     | An object exposing every method (`visit`, `get`, `post`, ..., `on`) as a no-op.                     |
| `Head`       | Renders children inside a `<Fragment>` so nothing leaks into the iframe `<head>`.                  |
| `WhenVisible`| Always renders children — the IntersectionObserver gate is not relevant in stories.                 |

To override the page shape from a story, set `window.__STORYBOOK_INERTIA_PAGE__` before the story renders (a decorator is the natural place). `usePage()` deep-merges the override over `defaultPage`, so a story can change just `auth.user` without rebuilding the entire page object.

### Wayfinder mocks

Wayfinder generates one TS module per controller and route group. The mocks in `.storybook/mocks/routes/` and `.storybook/mocks/actions/` mirror the same shape using the `makeRoute()` / `makeAction()` factories from `wayfinder-helpers.ts`:

```ts
export type RouteFn = {
    (...args: unknown[]): RouteBinding;
    url: (...args: unknown[]) => string;
    form: (...args: unknown[]) => RouteBinding;
    get: (...args: unknown[]) => RouteBinding;
    post: (...args: unknown[]) => RouteBinding;
    put: (...args: unknown[]) => RouteBinding;
    patch: (...args: unknown[]) => RouteBinding;
    delete: (...args: unknown[]) => RouteBinding;
};
```

A `RouteFn` is callable (returns the binding) and exposes the `.url()`, `.form()`, and HTTP-method helpers used across the codebase. The returned binding has `{ url, method, action }` so anything that destructures it keeps working.

Today the mock tree covers what the active stories need:

```
.storybook/mocks/
  routes/
    index.ts                     ← login, logout, register, home, dashboard
    two-factor.ts                ← confirm, qrCode, secretKey, recoveryCodes, enable, disable, regenerateRecoveryCodes
    settings/
      profile.ts                 ← edit, update
  actions/
    App/Http/Controllers/Settings/
      ProfileController.ts       ← destroy, update
```

If you add a story that imports a route or action not covered above, you need to extend this tree (see [Adding a Wayfinder mock](#adding-a-wayfinder-mock) below).

## Adding a new story

The shape of a story file is the standard CSF3 form, with `Meta` and `StoryObj` imported from `@storybook/react-vite` (not `@storybook/react`):

```tsx
import type { Meta, StoryObj } from '@storybook/react-vite';
import { MyComponent } from '@/components/my-component';

const meta: Meta<typeof MyComponent> = {
    title: 'Components/MyComponent',
    component: MyComponent,
    argTypes: {
        // describe props the user can edit in the Controls panel
    },
    args: {
        // sensible defaults for the playground
    },
    parameters: {
        layout: 'centered', // or 'fullscreen' for layout shells
    },
};

export default meta;

type Story = StoryObj<typeof MyComponent>;

export const Default: Story = {};
```

Conventions to follow:

- File path: `resources/js/stories/<group>/<PascalName>.stories.tsx`. The `<group>` folder mirrors the `title` prefix — today `ui/` and `layouts/`; add new groups as needed. Use `PascalCase` for the filename even when the component file is `kebab-case` (e.g., `AppSidebar.stories.tsx` for `app-sidebar.tsx`).
- `title`: `'<Group>/<PascalName>'` — `UI/` for shadcn primitives, `Layouts/` for application shells, etc. The group segment must match the parent folder so the sidebar and filesystem stay in sync.
- Imports use the `@/` alias only — never relative paths.
- Lucide icons must use the `*Icon` suffix exports (`SendIcon`, not `Send`) — same rule as the rest of `resources/js/`.
- Do _not_ import `use-appearance` or any Inertia hook directly in a story — the dark-mode decorator and the Inertia mocks already handle both.

`tags: ['autodocs']` is set globally in `preview.ts`, so every story automatically gets a Docs tab populated by `@storybook/addon-docs`. Override per-story with `tags: []` if needed.

### Layout-shell stories

`AppSidebar` and `AppHeader` are the two existing layout-shell stories. They need a wrapper decorator so the surrounding layout context exists:

- `AppSidebar` is wrapped in `<SidebarProvider>` plus a `<SidebarInset>` content area (`AppSidebar.stories.tsx`).
- `AppHeader` is wrapped in a flex column with a placeholder `<main>` underneath (`AppHeader.stories.tsx`).

Both use `parameters.layout: 'fullscreen'` so Storybook gives the iframe the full width.

If you add another layout-shell story:

1. Pick the appropriate provider wrapper (`SidebarProvider`, `TooltipProvider`, etc. — shadcn primitives that need providers will fail silently without one).
2. Set `layout: 'fullscreen'`.
3. Include a placeholder content area so the demo communicates that the shell wraps page content.

### Adding a Wayfinder mock

If a new story imports a route or action that does not yet have a mock:

1. Decide whether it is a route (`@/routes/...`) or an action (`@/actions/...`).
2. Mirror the file path under `.storybook/mocks/routes/` or `.storybook/mocks/actions/` respectively. Use the same nested folder structure that Wayfinder generates.
3. Export each helper using `makeRoute(method, url)` or `makeAction(method)` from `../wayfinder-helpers` (adjust the relative path to the depth of the new file).
4. The alias array in `.storybook/main.ts` already redirects `^@/routes/(.*)$` and `^@/actions/(.*)$` to these directories — no config change is needed for new files.

Example: a story importing `from '@/routes/teams'` requires `.storybook/mocks/routes/teams.ts` containing the same export names that the generated module exposes.

### Adding an Inertia prop the story needs

If a component reads a prop from `usePage().props.<something>` that is not in the default page shape, set it before rendering. The simplest place is a per-story decorator:

```tsx
export const WithCustomUser: Story = {
    decorators: [
        (Story) => {
            window.__STORYBOOK_INERTIA_PAGE__ = {
                props: { auth: { user: { /* ... */ } } },
            };
            return <Story />;
        },
    ],
};
```

The `usePage()` mock deep-merges `props`, so partial overrides work. Reset between stories with a global decorator in `preview.ts` if cross-story leakage becomes a problem.

## Gotchas

- **`__dirname` does not exist in `.storybook/main.ts`.** The file loads as ESM, so the standard CommonJS `__dirname` is `undefined`. The pattern at the top of `main.ts` (`fileURLToPath(import.meta.url)` + `dirname(...)`) is the workaround — keep it when editing.
- **Plugin name matching is exact, not loose.** `@rolldown/plugin-babel` registers under the name `@rolldown/plugin-babel`, not `babel`. The `STRIP_PLUGINS` set in `main.ts` reflects this — verify a plugin's actual `.name` if you add a new strip entry.
- **Do not use `mergeConfig` in `viteFinal`.** `mergeConfig` _concatenates_ plugin arrays, which means the stripped plugins re-appear in the second copy. Assigning directly to `cfg.plugins` after filtering is the correct approach.
- **`parentSelector` defaults to `body` and breaks Tailwind v4 dark mode.** The decorator in `preview.ts` overrides to `'html'` to match `applyTheme()` writing the class to `document.documentElement`.
- **`--host 0.0.0.0` is required in the `storybook` script.** Without it the dev server binds to `127.0.0.1` _inside the container_, so the `6006:6006` port mapping in `compose.yaml` does not reach it from the host.
- **Sail must be restarted after adding the `6006:6006` port mapping.** Editing `compose.yaml` does not take effect until `vendor/bin/sail down && vendor/bin/sail up -d` recreates the container with the new port binding.
