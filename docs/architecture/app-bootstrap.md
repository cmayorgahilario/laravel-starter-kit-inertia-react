---
title: Bootstrap, providers and middleware
description: What bootstrap/app.php wires up, which providers register and the web middleware stack.
---

# Bootstrap, providers and middleware

## Overview

The application boot is configured in `bootstrap/app.php` (routing, middleware and exception handling)
and the provider list in `bootstrap/providers.php`. This page is the single source for what gets wired
at startup.

## Routing and health

`bootstrap/app.php` registers the routes and a health endpoint:

| Concept          | Value                |
| ---------------- | -------------------- |
| Web routes       | `routes/web.php`     |
| API routes       | `routes/api.php`     |
| Console commands | `routes/console.php` |
| Health check     | `/up`                |

The authentication routes (login, register, 2FA, passkeys, etc.) are not in `routes/`: Fortify
registers them. See [../authentication/index.md](../authentication/index.md).

## Web middleware

The web stack is tuned in `bootstrap/app.php`:

- `statefulApi()` — enables Sanctum's SPA mode (session cookies for same-origin API calls).
- `encryptCookies(except: ['appearance'])` — the `appearance` cookie (light/dark/system theme) is left
  unencrypted so it can be read client-side.
- Appended to the `web` group:
    - `App\Http\Middleware\HandleAppearance` — shares the theme with the view before render to avoid the
      wrong-theme flash.
    - `App\Http\Middleware\HandleInertiaRequests` — defines the root view (`app`) and Inertia's shared
      props.
    - `AddLinkHeadersForPreloadedAssets` — asset preload headers.

Inertia's shared props (`HandleInertiaRequests`) include `name` (app name), `auth` (user data: id,
name, email, verification, `avatar_url`, 2FA, `can_access_admin`), `features` (config-derived feature
flags, currently `browserSessions` — whether the session driver is `database`) and `flash.toast`.
Their consumption on the frontend is in [../frontend/index.md](../frontend/index.md).

## Exception handling

`bootstrap/app.php` only decides when errors are JSON: requests to `api/*` or with
`Accept: application/json` get JSON responses (`shouldRenderJsonWhen`).

The Inertia error pages are configured in `App\Providers\AppServiceProvider` via
`Inertia::handleExceptionsUsing()` (not in `bootstrap/app.php`). This routes errors through Inertia's
own exception pipeline, so the asset version, root view and shared data are set correctly — a plain
`Inertia::render()->toResponse()` in the exception handler produces an incomplete page that fails to
mount in production (blank screen).

- The `403`, `404`, `419`, `429`, `500` and `503` codes render Inertia components
  (`resources/js/pages/errors/`).
- On `500`/`503` the stack trace is left to Laravel (Ignition) only when `APP_DEBUG=true`; the rest
  always render Inertia.

## Registered providers

`bootstrap/providers.php` registers, in order:

| Provider                                      | What it configures                                                                                                        |
| --------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------- |
| `App\Providers\AppServiceProvider`            | Registers the Sanctum model (`PersonalAccessToken`), the Passkeys models (`User`, `Passkey`) and the Inertia error pages. |
| `App\Providers\Filament\IconServiceProvider`  | Maps the Lucide icons used across the Filament UI.                                                                        |
| `App\Providers\Filament\PanelServiceProvider` | Defines the admin panel (`/admin`). See [../admin-panel/index.md](../admin-panel/index.md).                               |
| `App\Providers\FortifyServiceProvider`        | Wires the auth actions, Inertia views and rate limiters. See [../authentication/index.md](../authentication/index.md).    |

## What NOT to do

- Do not register authentication routes by hand in `routes/`: Fortify manages them.
- Do not encrypt the `appearance` cookie by adding it to the encrypted group; the frontend reads it
  client-side.
