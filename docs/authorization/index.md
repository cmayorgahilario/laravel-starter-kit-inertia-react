---
title: Authorization
description: Current authorization posture — what is and is not in place. Policies, gates, and roles are not yet implemented.
---

# Authorization

## Overview

This section covers **authorization** — what users are allowed to do once they are authenticated. It is distinct from *authentication* (who you are), which is handled by Laravel Fortify and documented in [Authentication](../authentication/index.md).

Authorization covers policies, gates, roles, abilities, and any mechanism that checks whether a particular user may perform a particular action. **None of those mechanisms are implemented in this application today.** This page documents that posture honestly so that future milestones can build on an accurate baseline.

## Current State

The following checks were run against `HEAD` to establish the current authorization baseline.

### No policy classes

`app/Policies/` does not exist. No Eloquent model policies have been generated or registered.

### No custom Gate definitions

A single `Gate::define` call exists in the codebase, in `app/Providers/TelescopeServiceProvider.php`:

```php
// app/Providers/TelescopeServiceProvider.php
Gate::define('viewTelescope', fn (User $user): bool => in_array($user->email, [
    // ...
]));
```

This gate is internal to Laravel Telescope's dashboard access. It is not a general-purpose authorization gate for application resources.

No other `Gate::define`, `Gate::policy`, or `Gate::before`/`Gate::after` calls exist in the codebase.

### No controller-level authorization

A search of `app/Http/` finds zero calls to:

- `$this->authorize()`
- `$request->user()->can()`
- `->can(` or `->cannot(` on any `User` instance
- `Policy` type-hints in any controller constructor or method

All controllers operate without authorization checks beyond the `auth` middleware guard (session authentication).

### No authorization packages

`composer.json` does not declare:

- `spatie/laravel-permission` (roles and permissions)
- `laravel/sanctum` (API token abilities)
- `laravel/passport` (OAuth2 scopes)

The only authentication-adjacent package is `laravel/fortify`, which handles login flows and is not an authorization library.

## What Is in Place

Authentication — establishing who a user is — is fully wired up through Laravel Fortify:

| File | Purpose |
| ---- | ------- |
| `config/fortify.php` | Fortify configuration: guard, username field, enabled features, rate limiter names |
| `app/Providers/FortifyServiceProvider.php` | Registers Inertia view closures, Action bindings, and rate limiters |
| `app/Actions/Fortify/` | Four replaceable Action classes (create user, update profile, update password, reset password) |
| `app/Models/Security/User.php` | Eloquent `User` model; implements `MustVerifyEmail`; mixes in `TwoFactorAuthenticatable` |

The authenticated user is exposed to every Inertia page via the `auth.user` shared prop in `app/Http/Middleware/HandleInertiaRequests.php`. React pages read `usePage().props.auth.user` to check login state.

For the full authentication stack — Fortify features, 2FA, rate limiting, session management — see [Authentication](../authentication/index.md).

## Not Yet Implemented

::: warning Authorization is not yet implemented

This application has no policies, gates (beyond the internal Telescope dashboard gate), roles, or permission checks on application resources. All authenticated users have the same effective access to every route.

A future milestone will introduce an authorization layer. The specific package and pattern have not been decided — no assumptions should be made about which approach will be used.

:::

## Choosing a Package

When the authorization milestone begins, the first decision is which package to adopt. The two realistic candidates are `spatie/laravel-permission` and `silber/bouncer`. The trade-offs specific to **this repo** — the `App\Models\Security\User` namespace, the arch test constraints, the `security_users` table rename, the Inertia shared-prop integration, and the test-suite cache gotchas — are documented in [Choosing an Authorization Package](./package-comparison.md). Read it before picking.
