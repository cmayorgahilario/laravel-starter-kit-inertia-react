---
title: Frontend Pipeline
description: Vite 8 build toolchain, Inertia v3 setup, TypeScript strict configuration, and SSR architecture for the React Starter Kit.
---

# Frontend Pipeline

## Overview

The frontend is a React 19 single-page application driven by Inertia v3. Inertia handles routing on the server — Laravel returns an Inertia response instead of a full HTML page, and the client re-renders the matching React page component without a full reload. TypeScript strict mode is enabled throughout. The SSR entry point is wired up but CSR (client-side rendering) is the default; SSR requires an active Node.js server running the `bootstrap/ssr/ssr.js` output.

| Technology   | Version                        | Role                                      |
| ------------ | ------------------------------ | ----------------------------------------- |
| React        | 19                             | UI rendering                              |
| Inertia      | v3 (`@inertiajs/react ^3.0.0`) | Server-driven SPA adapter                 |
| TypeScript   | 5 (`strict: true`)             | Type safety                               |
| Vite         | 8                              | Dev server and production bundler         |
| Tailwind CSS | v4                             | Utility-first CSS via `@tailwindcss/vite` |

## Build Toolchain

Vite 8 (via `vite-plus`, a rolldown-backed drop-in) is the bundler. The plugin order in `vite.config.ts` is fixed and meaningful — each plugin modifies the Vite pipeline in sequence:

```ts
plugins: [
    laravel({ input: ['resources/css/app.css', 'resources/js/app.tsx'], ssr: 'resources/js/ssr.tsx', refresh: true }),
    inertia(),
    react(),
    tailwindcss(),
    wayfinder({ formVariants: true }),
    babel({ presets: [reactCompilerPreset({ target: '19' })] }),
];
```

| Position | Plugin          | Package                       | Purpose                                                                             |
| -------- | --------------- | ----------------------------- | ----------------------------------------------------------------------------------- |
| 1        | `laravel()`     | `laravel-vite-plugin`         | Sets public/build as output, injects asset manifest, enables HMR over the Sail port |
| 2        | `inertia()`     | `@inertiajs/vite`             | Auto-injects the page resolver, configures the SSR build, exposes the dev SSR endpoint |
| 3        | `react()`       | `@vitejs/plugin-react`        | JSX transform and React Fast Refresh                                                |
| 4        | `tailwindcss()` | `@tailwindcss/vite`           | CSS-first Tailwind — scans all project files automatically                          |
| 5        | `wayfinder()`   | `@laravel/vite-plugin-wayfinder` | Generates typed TS functions for Laravel routes/actions; `formVariants: true` adds `.form()` helpers |
| 6        | `babel()`       | `@rolldown/plugin-babel` + `babel-plugin-react-compiler` | Runs the React Compiler to auto-memoize components and hooks at build time |

`@tailwindcss/vite` uses CSS-first mode: `resources/css/app.css` contains `@import 'tailwindcss'` and no configuration file is needed. The plugin resolves content paths automatically from the project root.

**vite-plus runtime (D044):** the project runs on `vite-plus` (`@voidzero-dev/vite-plus-core`), a rolldown-backed Vite-compatible bundler that adds `vp lint` and `vp fmt` commands. The `package.json` aliases `vite` to `@voidzero-dev/vite-plus-core` so existing tooling (plugins, configs) keeps working unchanged. The earlier blocker about platform-native binaries (D040) was resolved upstream.

## Inertia v3 Setup

### Root Template

`resources/views/app.blade.php` uses the Inertia v3 Blade component syntax (D039 — verified available in `inertiajs/inertia-laravel` v3):

```html
<x-inertia::head />
<!-- renders page <title> and <meta> tags -->
<x-inertia::app />
<!-- renders the Inertia root div with page data -->
```

These replace the older `@inertia` / `@inertiaHead` directive syntax. Both ship with the same package; component syntax is preferred in v3.

### Shared Props Middleware

`app/Http/Middleware/HandleInertiaRequests.php` defines props shared with every page. Lazy closures (`fn () =>`) defer evaluation until Inertia serializes the response — avoiding unnecessary database calls on non-Inertia requests:

```php
public function share(Request $request): array
{
    return array_merge(parent::share($request), [
        'auth' => fn () => [
            'user' => $request->user() ? [
                'id'    => $request->user()->id,
                'name'  => $request->user()->name,
                'email' => $request->user()->email,
            ] : null,
        ],
        'app' => fn () => [
            'name' => config('app.name'),
        ],
    ]);
}
```

### Page Resolution

`resources/js/app.tsx` calls `createInertiaApp({ ... })` without a `pages:` or `resolve:` property. The `@inertiajs/vite` plugin parses the call via AST and **auto-injects** a resolver at build time that expands to:

```ts
resolve: async (name, page) => {
    const pages = import.meta.glob(
        ['./pages/**/*.{tsx,jsx}', './Pages/**/*.{tsx,jsx}'],
        { eager: false },
    );
    const module = await pages[`./pages/${name}.tsx`]?.();
    if (!module) throw new Error(`Page not found: ${name}`);
    return module.default ?? module;
};
```

The generated resolver uses **lazy globs** (`eager: false`), so each page becomes its own dynamic `import()` → rolldown emits one chunk per page and loads them on-demand. This is why `public/build/assets/` contains separate `dashboard-*.js`, `login-*.js`, `welcome-*.js`, etc., instead of one monolithic bundle.

Do not add a manual `pages:` or `resolve:` to `createInertiaApp()` unless you need a non-default directory. The plugin only injects when neither property is present.

## TypeScript Configuration

`tsconfig.json` enforces strict mode across the entire codebase:

```json
{
    "compilerOptions": {
        "strict": true,
        "allowJs": true,
        "target": "ESNext",
        "module": "ESNext",
        "moduleResolution": "bundler",
        "jsx": "react-jsx",
        "paths": {
            "@/*": ["./resources/js/*"]
        },
        "noEmit": true
    }
}
```

| Option             | Value                    | Reason                                                                     |
| ------------------ | ------------------------ | -------------------------------------------------------------------------- |
| `strict`           | `true`                   | Full strict-mode checks — no implicit `any`, strict null checks, etc.      |
| `allowJs`          | `true`                   | Gradual migration — `.js` files are accepted alongside `.ts`/`.tsx`        |
| `moduleResolution` | `bundler`                | Matches Vite's module resolution; avoids `node` resolution quirks with ESM |
| `noEmit`           | `true`                   | TypeScript is type-checker only; Vite handles transpilation                |
| `paths`            | `@/* → ./resources/js/*` | Short import alias for application code                                    |

**Type definitions (D041):** React 19's npm package ships no `.d.ts` files. `@types/react@19` and `@types/react-dom@19` must be installed explicitly in `devDependencies`. Without them, `tsc --noEmit` fails even with `skipLibCheck: true`.

**Module augmentation (D042):** `resources/js/types/global.d.ts` augments `@inertiajs/core` (not `@inertiajs/react`) to extend `PageProps` with shared prop types:

```ts
declare module '@inertiajs/core' {
    interface PageProps {
        auth: { user: { id: number; name: string; email: string } | null };
        app: { name: string };
    }
}
```

`usePage()` in Inertia React v3 resolves types from `@inertiajs/core`'s `PageProps`. Augmenting `@inertiajs/react` has no effect.

## SSR Architecture

Inertia v3 SSR uses a Node.js HTTP server that Laravel pings for each server-rendered request. The entry point is `resources/js/ssr.tsx`:

```ts
import createServer from '@inertiajs/react/server';
import { renderToString } from 'react-dom/server';

createServer((page) =>
    createInertiaApp({
        page,
        render: renderToString,
        resolve: (name) => { /* same glob pattern as app.tsx */ },
        setup: ({ App, props }) => <App {...props} />,
    }),
);
```

`createServer` starts an HTTP server (default port 13714) that Laravel's Inertia middleware calls for server rendering. The `build:ssr` script compiles this to `bootstrap/ssr/ssr.js`.

**Client entry uses `createRoot`, not `hydrateRoot` (D043):** `hydrateRoot` requires pre-rendered HTML from the SSR server. Without an active SSR server (local dev without SSR, test environments), `hydrateRoot` throws React error #418 (hydration mismatch). `app.tsx` uses `createRoot` for pure CSR; SSR is opt-in at the infrastructure level.

### Build outputs

| Script       | Command            | Output                 |
| ------------ | ------------------ | ---------------------- |
| Client build | `vite build`       | `public/build/`        |
| SSR build    | `vite build --ssr` | `bootstrap/ssr/ssr.js` |

## What `inertia()` Actually Does

The `@inertiajs/vite` plugin is **not optional cosmetic tooling** — the app depends on it to function. Removing it produces a build that compiles but breaks at runtime. Measured impact on this project's build:

| Build signal                | Without `inertia()`                          | With `inertia()`                                                |
| --------------------------- | -------------------------------------------- | --------------------------------------------------------------- |
| Client modules transformed  | 2549                                         | 2598 (+49 pages)                                                |
| Client chunks emitted       | 1 monolithic `app-*.js` ~602 kB              | ~41 chunks code-split per page                                  |
| `public/build/manifest.json` | 0.33 kB (one entry)                         | ~12.7 kB (one entry per page)                                   |
| Client build warnings       | `chunks > 500 kB`                            | `[PLUGIN_TIMINGS] @inertiajs/vite (~85%)` (expected — AST work) |
| SSR log line                | absent                                       | `Inertia SSR entry: resources/js/ssr.tsx`                       |
| SSR sourcemap               | not emitted                                  | `bootstrap/ssr/ssr.js.map` ~296 kB                              |

Four distinct hooks in the plugin cause these changes:

1. **Page resolver injection** (`transform` hook) — parses every `.js`/`.ts`/`.jsx`/`.tsx` module; when it finds `createInertiaApp(...)` without a `pages` or `resolve` property, it rewrites the AST to inject a lazy `import.meta.glob` resolver (`pages/**/*.{tsx,jsx}`). The lazy globs are what produce per-page chunks. Early-return check `if (!code.includes("InertiaApp")) return null` keeps non-Inertia modules untouched.
2. **SSR entry detection** (`configResolved` hook) — walks `SSR_ENTRY_CANDIDATES` (`resources/js/ssr.{ts,tsx,js,jsx}`, then `src/ssr.*`, then app fallbacks) and logs `Inertia SSR entry: <path>` when `config.build.ssr === true`.
3. **SSR build configuration** (`config` hook, only runs when `env.isSsrBuild`) — forces `build.sourcemap: true` (unless the user sets `ssr.sourcemap: false`) and wires the resolved SSR entry into `rollupOptions.input` if no input is set.
4. **SSR bootstrap wrap** (`transform` hook, SSR pass only) — finds the bare `createInertiaApp(...)` in `ssr.tsx` and wraps it with `createServer(...)` plus the framework-specific render function (`renderToString` from `react-dom/server`). This is why `ssr.tsx` does not import `createServer` directly.

**Consequence:** without the plugin, `resources/js/pages/*` files are never reached by the build (no import chain references them), the client bundle contains only the shell, and the first navigation fails with `Page not found: <name>`. The `[PLUGIN_TIMINGS] @inertiajs/vite (85%)` warning reflects AST parsing cost and is expected — not a regression.

## React Compiler

`babel({ presets: [reactCompilerPreset({ target: '19' })] })` runs `babel-plugin-react-compiler` at build time. The compiler rewrites React components and hooks to **auto-memoize** intermediate values across renders via the `react/compiler-runtime` module — mechanically equivalent to hand-written `useMemo` / `useCallback` / `React.memo`, but applied uniformly without developer intervention.

`target: '19'` is correct here: this project pins `react@19`, so the compiler emits code without the React 17/18 compatibility shim and skips a small amount of runtime bytes.

### Measured cost

| Metric                      | Without compiler                              | With compiler                                 | Delta                       |
| --------------------------- | --------------------------------------------- | --------------------------------------------- | --------------------------- |
| Client build time           | 1.94s                                         | 4.48s                                         | ~2.3× slower                |
| `app-*.js`                  | 175.24 kB / 54.26 kB gzip                     | 193.80 kB / 59.74 kB gzip                     | +18.5 kB raw / +5.5 kB gzip |
| `password-*.js`             | 16.86 kB                                      | 22.41 kB                                      | +5.5 kB                     |
| Plugin timings warning      | absent                                        | `@rolldown/plugin-babel (~8%)`                | —                           |
| Client modules transformed  | 2596                                          | 2598 (+2: `react/compiler-runtime` + helpers) | +2 modules                  |

### Measured benefit

Verified with React DevTools Profiler: with the compiler active, the auth/shell interactions (sidebar navigation, theme toggle, layout changes) produce **fewer commits and fewer yellow/re-rendering components per commit**. In DevTools, compiled components display a ✨ marker in the Components tab and the `Memo` + auto-memoization badge; hovering shows `This component has been auto-memoized by the React Compiler`. "Why did this render?" reliably reports real prop/state changes, not parent-bubbled re-renders.

The gain is concrete for this repo because the sidebar creates `item` objects inline per render; without the compiler, every navigation triggers a full re-render of every `NavLeaf`. With the compiler, only the `NavLeaf` whose `isCurrentUrl` actually flipped re-renders.

### Recommendation

**Keep the compiler enabled** on this project. The ~5.5 kB gzip cost is small, the +2.5s build is tolerable (still under 5s total), and the runtime benefit is measurable in the sidebar and layout hot paths.

Trade-offs to revisit later:

- If dev builds become painful on slower hardware, consider gating the plugin to production only: `mode === 'production' && babel({ ... })`. Do not do this pre-emptively — dev/prod parity in render behavior is valuable while building new pages.
- Do not combine with hand-written `useMemo` / `useCallback` everywhere — that is now redundant. Use those hooks only for semantic caching (expensive computation, stable identity required for dependency arrays of non-React APIs).
- If you add a component that misbehaves (rare — typically only ones that rely on intentional re-render side effects), opt out with the `'use no memo'` directive at the top of the file rather than removing the preset globally.

### Validating the trade-off yourself

To regenerate the comparison on this repo:

1. Run `vendor/bin/sail bun run build` with the `babel(...)` plugin in `vite.config.ts` and record the `✓ built in Xs` line plus the `app-*.js` size.
2. Comment out the `babel(...)` line, run the same command, and compare.
3. For runtime impact, serve the build, open React DevTools → Profiler → enable **"Record why each component rendered"** and **"Highlight updates"**, then profile the same interaction twice (with and without the plugin). Compare commit count and total render duration.

## Development Commands

All commands must be prefixed with `vendor/bin/sail` when running inside the Docker environment.

| Command             | Full form                           | Purpose                                          |
| ------------------- | ----------------------------------- | ------------------------------------------------ |
| `bun run dev`       | `vendor/bin/sail bun run dev`       | Start Vite dev server with HMR on port 5173      |
| `bun run build`     | `vendor/bin/sail bun run build`     | Production client build to `public/build/`       |
| `bun run build:ssr` | `vendor/bin/sail bun run build:ssr` | SSR build to `bootstrap/ssr/ssr.js`              |
| `bunx tsc --noEmit` | `vendor/bin/sail bunx tsc --noEmit` | Type-check without emitting files                |
| `composer run dev`  | `vendor/bin/sail composer run dev`  | Start server, queue, Pail, and Vite concurrently |

To start a full development environment in one command:

```bash
vendor/bin/sail composer run dev
```

This runs `php artisan serve`, `php artisan queue:listen`, `php artisan pail`, and `bun run dev` concurrently via the `concurrently` package.
