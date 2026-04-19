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

Vite 8 is the bundler. The plugin order in `vite.config.ts` is fixed and meaningful — each plugin modifies the Vite pipeline in sequence:

```ts
plugins: [
    laravel({ input: 'resources/js/app.tsx', ssr: 'resources/js/ssr.tsx', refresh: true }),
    inertia(),
    react(),
    tailwindcss(),
];
```

| Position | Plugin          | Package                | Purpose                                                                             |
| -------- | --------------- | ---------------------- | ----------------------------------------------------------------------------------- |
| 1        | `laravel()`     | `laravel-vite-plugin`  | Sets public/build as output, injects asset manifest, enables HMR over the Sail port |
| 2        | `inertia()`     | `@inertiajs/vite`      | Registers Inertia's SSR Vite plugin; handles the `--ssr` build flag                 |
| 3        | `react()`       | `@vitejs/plugin-react` | JSX transform and React Fast Refresh                                                |
| 4        | `tailwindcss()` | `@tailwindcss/vite`    | CSS-first Tailwind — scans all project files automatically                          |

`@tailwindcss/vite` uses CSS-first mode: `resources/css/app.css` contains `@import 'tailwindcss'` and no configuration file is needed. The plugin resolves content paths automatically from the project root.

**vite-plus evaluated and reverted (D040):** `vite-plus` was tested as a rolldown-backed drop-in replacement. It installed successfully but failed at build time because its bundled rolldown requires platform-native binaries not available in the Sail Docker container. It also ships no `bin` entry suitable for CLI use. Stock Vite 8 provides an identical API surface with no native binary requirements.

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

`resources/js/app.tsx` resolves page components via Vite's `import.meta.glob`:

```ts
const pages = import.meta.glob('./pages/**/*.tsx', { eager: true });
return pages[`./pages/${name}.tsx`];
```

`{ eager: true }` means all page modules are bundled at compile time, not lazily imported at runtime. Inertia passes the page component name (e.g., `Welcome`) and the resolver maps it to the file path.

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
