---
title: Authentication
description: Fortify + Sanctum with 2FA and passkeys, the enabled features and the user control panel.
---

# Authentication

**Why it exists:** explain how identity works end to end — login, registration, email verification,
password reset, two-factor authentication, passkeys and API tokens.
**Covers:** the Fortify configuration, its enabled features, the Inertia views, rate limiters, Sanctum,
passkeys and the user control panel (UCP).
**Does not cover:** the detail of the Fortify actions (see [actions.md](actions.md)) or who can access
the admin panel (that authorization is in [../admin-panel/index.md](../admin-panel/index.md)).

## Overview

Authentication runs on **Laravel Fortify** (frontend-agnostic backend), wired in
`App\Providers\FortifyServiceProvider`. The auth views are rendered as **Inertia** pages, the API uses
**Sanctum** in SPA mode, and the credentials extend to **passkeys** (WebAuthn) and **TOTP 2FA**.

## Enabled Fortify features

`config/fortify.php` enables seven features (guard `web`, broker `users`):

| Feature                    | Notes                                    |
| -------------------------- | ---------------------------------------- |
| Registration               | New user sign-up.                        |
| Reset passwords            | "Forgot my password" flow.               |
| Email verification         | `User` implements `MustVerifyEmail`.     |
| Update profile information | Name, email and avatar.                  |
| Update passwords           | Password change.                         |
| Two-factor authentication  | `confirm` and `confirmPassword` enabled. |
| Passkeys                   | `confirmPassword` enabled.               |

## Inertia views

`FortifyServiceProvider` maps each Fortify view to an Inertia page under `resources/js/pages/auth/`:

| Fortify view         | Inertia page                |
| -------------------- | --------------------------- |
| login                | `auth/login`                |
| register             | `auth/register`             |
| forgot-password      | `auth/forgot-password`      |
| reset-password       | `auth/reset-password`       |
| verify-email         | `auth/verify-email`         |
| confirm-password     | `auth/confirm-password`     |
| two-factor-challenge | `auth/two-factor-challenge` |

## Rate limiters

Defined in `FortifyServiceProvider`:

| Limiter    | Limit                 |
| ---------- | --------------------- |
| login      | 5/min per email + IP  |
| two-factor | 5/min per user        |
| passkeys   | 10/min per credential |

## Sanctum and API

Sanctum runs in SPA mode (`statefulApi()` in `bootstrap/app.php`). The API token model is
`App\Models\Security\PersonalAccessToken` (table `security_personal_access_tokens`), registered in
`AppServiceProvider`. The only API route is `GET /user` (`routes/api.php`), guarded by `auth:sanctum`.

## Passkeys

The `User` model uses `PasskeyAuthenticatable` and the `Passkey` model
(`App\Models\Security\Passkey`, table `security_passkeys`) extends `Laravel\Passkeys\Passkey`. The
models are registered with the Passkeys package in `AppServiceProvider`. On the frontend, registration
and management use the `@laravel/passkeys` package (see
[../frontend/ui-and-styling.md](../frontend/ui-and-styling.md)).

## User control panel (UCP)

Authenticated users manage their account under `/ucp` (`routes/web.php`):

| Route                        | Controller / page                         | Purpose                                         |
| ---------------------------- | ----------------------------------------- | ----------------------------------------------- |
| `GET /ucp/profile`           | Inertia `ucp/profile`                     | Name, email, avatar.                            |
| `GET /ucp/password`          | Inertia `ucp/password`                    | Password change.                                |
| `GET /ucp/security`          | `SecuritySettingsController@show`         | 2FA and passkeys (requires `password.confirm`). |
| `GET /ucp/sessions`          | `BrowserSessionsController@index`         | Active sessions.                                |
| `DELETE /ucp/sessions`       | `BrowserSessionsController@destroyOthers` | Log out other devices.                          |
| `DELETE /ucp/account`        | `DeleteAccountController@destroy`         | Delete account.                                 |
| `DELETE /user/profile-photo` | `ProfilePhotoController@destroy`          | Remove avatar.                                  |

The `/dashboard` and `/ucp` routes require the `auth` and `verified` middleware; `/ucp/security`
additionally requires `password.confirm`.

> [!NOTE]
> Authorization is minimal at the moment. There are no roles/permissions packages or policies in the
> repository: access control comes from route middleware (`auth`, `verified`, `password.confirm`) and,
> for the admin panel, the `FilamentUser::canAccessPanel()` gate on the `User` model
> (see [../admin-panel/index.md](../admin-panel/index.md)).
