---
title: API Surface
description: The HTTP contract for the React Starter Kit — Inertia-driven server responses, Wayfinder-generated TypeScript route clients, and the full route inventory. No REST API exists.
---

# API Surface

## Overview

This starter kit has **no REST API**. There is no `routes/api.php` and no `app/Http/Controllers/Api/` directory. The HTTP contract is [Inertia.js](https://inertiajs.com): the server renders page components by name, shares props on every response, and the client navigates without full page reloads.

The two packages that define this surface are declared in `composer.json`:

```json
// composer.json (lines 14, 18)
"inertiajs/inertia-laravel": "^3.0",
"laravel/wayfinder": "^0.1.16",
```

## Surface Shape

`app/Http/Middleware/HandleInertiaRequests.php` is the central integration point. It extends `Inertia\Middleware` and sets `$rootView = 'app'`, which tells Inertia to hydrate into the `resources/views/app.blade.php` shell on the first full-page load. Subsequent navigations receive JSON-encoded page objects — no HTML, no REST response bodies.

```php
// app/Http/Middleware/HandleInertiaRequests.php
class HandleInertiaRequests extends Middleware
{
    protected $rootView = 'app';
    // ...
}
```

Every Inertia response carries the shared props defined in `share()`. These are lazy closures evaluated only when Inertia actually sends a response.

## Shared Props

`HandleInertiaRequests::share()` merges three top-level keys into every page response:

| Prop key       | Type / shape                                                                 |
| -------------- | ---------------------------------------------------------------------------- |
| `auth.user`    | `null` (guest) or `{id, name, email, avatar, email_verified_at, two_factor_confirmed_at}` |
| `app.name`     | `string` — value of `config('app.name')`                                    |
| `flash.status` | `string \| null` — one-time session status message                          |

The `auth.user` shape surfaces `email_verified_at` and `two_factor_confirmed_at` as ISO 8601 strings (or `null`) so the React client can gate routes without a separate API call. For the full authentication flow — Fortify actions, 2FA columns, rate limiters — see [Authentication](../authentication/index.md).

```php
// app/Http/Middleware/HandleInertiaRequests.php — share()
return array_merge(parent::share($request), [
    'auth' => fn () => [
        'user' => $user ? [
            'id'                       => $user->id,
            'name'                     => $user->name,
            'email'                    => $user->email,
            'avatar'                   => $user->avatar,
            'email_verified_at'        => $user->email_verified_at?->toISOString(),
            'two_factor_confirmed_at'  => $user->two_factor_confirmed_at?->toISOString(),
        ] : null,
    ],
    'app'   => fn () => ['name' => config('app.name')],
    'flash' => fn () => ['status' => $request->session()->get('status')],
]);
```

## Web Routes

`routes/web.php` contains exactly two routes:

```php
// routes/web.php
Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::get('/dashboard', fn () => Inertia::render('dashboard'))
    ->middleware(['auth', 'verified'])
    ->name('dashboard');
```

`/` is public. `/dashboard` requires both authentication (`auth`) and a verified email address (`verified`). No resource routes, no API routes, no catch-all.

## Settings Route Group

`routes/settings.php` defines 11 routes under the `settings.*` name prefix, all behind `['auth', 'verified']` middleware:

| Method   | URI                     | Name                      | Controller                          |
| -------- | ----------------------- | ------------------------- | ----------------------------------- |
| `GET`    | `/settings/profile`     | `settings.profile.edit`   | `ProfileController@edit`            |
| `PATCH`  | `/settings/profile`     | `settings.profile.update` | `ProfileController@update`          |
| `DELETE` | `/settings/profile`     | `settings.profile.destroy`| `ProfileController@destroy`         |
| `GET`    | `/settings/password`    | `settings.password.edit`  | `PasswordController@edit`           |
| `PUT`    | `/settings/password`    | `settings.password.update`| `PasswordController@update`         |
| `GET`    | `/settings/appearance`  | `settings.appearance.edit`| `AppearanceController@edit`         |
| `GET`    | `/settings/sessions`    | `settings.sessions.index` | `SessionController@index`           |
| `DELETE` | `/settings/sessions`    | `settings.sessions.destroy`| `SessionController@destroy`        |
| `GET`    | `/settings/notifications`| `settings.notifications.edit`| `NotificationController@edit`   |
| `PATCH`  | `/settings/notifications`| `settings.notifications.update`| `NotificationController@update`|

All settings controllers live in `app/Http/Controllers/Settings/`. Each returns an `Inertia::render(...)` response — no JSON, no API contract.

## Wayfinder-Generated TypeScript Clients

The Vite build generates typed TypeScript functions from every named Laravel route. `vite.config.ts` line 71 configures the plugin:

```ts
// vite.config.ts
wayfinder({
    formVariants: true,
}),
```

The generated output is written to three directories that are git-tracked but excluded from the linter:

| Directory                      | Contents                                         |
| ------------------------------ | ------------------------------------------------ |
| `resources/js/wayfinder/`      | Low-level route helper utilities                 |
| `resources/js/actions/`        | Per-controller action functions (e.g. `settings.profile.update()`) |
| `resources/js/routes/`         | Per-name route URL functions (e.g. `route('dashboard')`) |

`formVariants: true` generates `*.form.ts` companions that return `method + url` tuples suitable for passing directly to Inertia's `useForm` hook. For the full frontend integration — component entry point, Inertia adapter, React Router absence — see [Frontend](../frontend/index.md).

## What Is NOT Present

This starter kit intentionally ships **no REST layer**. The following do not exist and are not planned:

- **`routes/api.php`** — No REST API routes file.
- **`app/Http/Controllers/Api/`** — No API controller namespace.
- **Sanctum / Passport tokens** — No token-based authentication. Session cookies are the only credential.
- **REST resource controllers** — No `index / show / store / update / destroy` patterns.
- **API versioning** — No `/api/v1/` prefix or version negotiation.
- **Rate-limit policies on API routes** — The `throttle:api` middleware alias exists in Laravel but is not applied to any route here.

If you are building a REST API on top of this starter kit, add `routes/api.php`, enable the `api` middleware group in `bootstrap/app.php`, and add Sanctum for token auth. None of that scaffolding is pre-installed.

## Cross-links

- [Frontend](../frontend/index.md) — Inertia React adapter, Vite config, Wayfinder usage in components.
- [Authentication](../authentication/index.md) — Fortify service provider, auth routes, 2FA, and the `auth.user` prop shape.
