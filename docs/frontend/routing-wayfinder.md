---
title: Typed routing with Wayfinder
description: How @/routes and @/actions are generated and consumed instead of hardcoded URLs.
---

# Typed routing with Wayfinder

## Overview

The frontend never hardcodes backend URLs. **Laravel Wayfinder** generates typed TypeScript functions
from the Laravel routes and controllers, into two folders under `resources/js/`:

| Folder     | Contents                                                                        |
| ---------- | ------------------------------------------------------------------------------- |
| `routes/`  | One typed function per named route (e.g. `login()`, `dashboard()`, `logout()`). |
| `actions/` | A mirror of the controllers (e.g. `App/Http/Controllers/Security/...`).         |

The Vite plugin (`@laravel/vite-plugin-wayfinder`, configured in `vite.config.ts` with form variants)
regenerates these on build/dev. They can also be regenerated manually:

```bash
./vendor/bin/sail artisan wayfinder:generate
```

## Consuming routes

Each route function returns a definition with helpers:

| Helper                        | Returns                    |
| ----------------------------- | -------------------------- |
| `route()`                     | `{ url, method }`          |
| `route.url()`                 | the URL string             |
| `route.get()` / `.post()` / … | typed by HTTP method       |
| `route.form`                  | props for an HTML `<form>` |

Typical usage in components:

```tsx
import { dashboard } from '@/routes';
<Link href={dashboard()}>Dashboard</Link>;
```

## What NOT to do

> [!WARNING]
> `resources/js/actions/` and `resources/js/routes/` are **generated code**. Reviewed: they are listed
> among the ESLint ignores in `eslint.config.js`. Do not edit them by hand and do not import URLs as
> string literals — change the backend route and regenerate. Edits would be overwritten on the next
> `wayfinder:generate`.
