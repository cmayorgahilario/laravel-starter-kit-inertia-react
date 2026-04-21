---
title: Authentication
description: Fortify-based authentication stack — service provider wiring, Inertia view closures, Actions, 2FA, rate limiting, and post-login account management.
---

# Authentication

## Overview

Authentication is handled by **Laravel Fortify** (`laravel/fortify: ^1.36`, declared in `composer.json`). Fortify is a frontend-agnostic authentication back-end: it registers all auth routes and their controllers internally. This application customizes only three things:

1. **View closures** — binds Inertia React components to each Fortify route.
2. **Actions** — four replaceable classes that implement user creation, profile updates, password changes, and password resets.
3. **Rate limiters** — two named limiters for login and 2FA challenge endpoints.

All customizations live in `app/Providers/FortifyServiceProvider.php`, which is loaded automatically via Laravel's service-provider auto-discovery.

## Configuration

Two config files govern the auth stack.

### `config/fortify.php`

| Key | Value | Effect |
| --- | ----- | ------ |
| `guard` | `web` | Session-based authentication |
| `username` | `email` | Login credential field |
| `lowercase_usernames` | `true` | Emails are lowercased before DB lookup |
| `home` | `/dashboard` | Redirect target after successful login/register |
| `limiters.login` | `'login'` | Named rate limiter for login endpoint |
| `limiters.two-factor` | `'two-factor'` | Named rate limiter for 2FA challenge endpoint |

**Enabled features:**

```php
// config/fortify.php
'features' => [
    Features::registration(),
    Features::resetPasswords(),
    Features::emailVerification(),
    Features::updateProfileInformation(),
    Features::updatePasswords(),
    Features::twoFactorAuthentication([
        'confirm' => true,
        'confirmPassword' => true,
    ]),
],
```

### `config/auth.php`

| Key | Value |
| --- | ----- |
| Default guard | `web` (session driver) |
| User provider | `eloquent` → `App\Models\Security\User` |
| Password reset table | `password_reset_tokens` |
| Password confirmation timeout | `10800` seconds (3 hours) |

The `AUTH_MODEL`, `AUTH_GUARD`, `AUTH_PASSWORD_BROKER`, and `AUTH_PASSWORD_RESET_TOKEN_TABLE` env vars can override all of these values without touching the file.

## Inertia View Closures

Fortify calls each registered closure when rendering its view routes. The 7 closures in `app/Providers/FortifyServiceProvider.php` map Fortify's route names to Inertia React pages:

| Fortify method | Inertia component | Notes |
| -------------- | ----------------- | ----- |
| `Fortify::loginView()` | `auth/login` | — |
| `Fortify::registerView()` | `auth/register` | — |
| `Fortify::requestPasswordResetLinkView()` | `auth/forgot-password` | — |
| `Fortify::resetPasswordView()` | `auth/reset-password` | Passes `token` and `email` as props |
| `Fortify::verifyEmailView()` | `auth/verify-email` | — |
| `Fortify::confirmPasswordView()` | `auth/confirm-password` | — |
| `Fortify::twoFactorChallengeView()` | `auth/two-factor-challenge` | — |

The React components for these pages live under `resources/js/pages/auth/`. See the frontend section for their implementation.

## Actions

Fortify delegates the four mutating operations to swappable Action classes, bound in `app/Providers/FortifyServiceProvider.php`:

| Action class | Fortify binding | Purpose |
| ------------ | --------------- | ------- |
| `app/Actions/Fortify/CreateNewUser.php` | `Fortify::createUsersUsing()` | Validates name/email/password and creates a new `security_users` row |
| `app/Actions/Fortify/UpdateUserProfileInformation.php` | `Fortify::updateUserProfileInformationUsing()` | Updates name/email; re-sends verification email if email changes |
| `app/Actions/Fortify/UpdateUserPassword.php` | `Fortify::updateUserPasswordsUsing()` | Validates `current_password` then hashes and saves the new password |
| `app/Actions/Fortify/ResetUserPassword.php` | `Fortify::resetUserPasswordsUsing()` | Validates and stores a new password after a password-reset token flow |

All four classes use the `PasswordValidationRules` trait (`app/Actions/Fortify/PasswordValidationRules.php`) for consistent password validation rules.

## Two-Factor Authentication

2FA is enabled with the `confirm` and `confirmPassword` options (see `config/fortify.php` above). The `TwoFactorAuthenticatable` trait is mixed into `app/Models/Security/User.php`:

```php
// app/Models/Security/User.php
use Laravel\Fortify\TwoFactorAuthenticatable;

class User extends Authenticatable implements MustVerifyEmail
{
    use TwoFactorAuthenticatable;
    // ...
}
```

The migration `database/migrations/0001_01_01_000000_create_security_users_table.php` adds three 2FA columns to `security_users`:

| Column | Type | Purpose |
| ------ | ---- | ------- |
| `two_factor_secret` | `text` (nullable) | Encrypted TOTP secret |
| `two_factor_recovery_codes` | `text` (nullable) | JSON-encoded recovery codes |
| `two_factor_confirmed_at` | `timestamp` (nullable) | Set when user confirms TOTP device; `null` means 2FA not yet confirmed |

The `#[Hidden]` attribute on the model class suppresses `two_factor_secret` and `two_factor_recovery_codes` from serialization:

```php
#[Hidden(['password', 'remember_token', 'two_factor_secret', 'two_factor_recovery_codes'])]
class User extends Authenticatable implements MustVerifyEmail
```

## Rate Limiting

Two named rate limiters are registered in `app/Providers/FortifyServiceProvider.php` and referenced by `config/fortify.php` under `limiters`:

```php
// app/Providers/FortifyServiceProvider.php
RateLimiter::for('login', function (Request $request) {
    $usernameInput = $request->input(Fortify::username());
    $throttleKey = Str::transliterate(
        Str::lower(is_string($usernameInput) ? $usernameInput : '') . '|' . $request->ip()
    );
    return Limit::perMinute(5)->by($throttleKey);
});

RateLimiter::for('two-factor', function (Request $request) {
    return Limit::perMinute(5)->by($request->session()->get('login.id'));
});
```

- **`login`** — 5 attempts per minute, keyed by `lowercase(email)|ip`. Prevents brute-force per email-IP pair.
- **`two-factor`** — 5 attempts per minute, keyed by the `login.id` session value set during the first authentication step.

## User Model & Shared Props

`app/Models/Security/User.php` is the Eloquent model that backs the `security_users` table:

| Property | Value |
| -------- | ----- |
| `$table` | `security_users` |
| Implements | `MustVerifyEmail` |
| Traits | `HasFactory`, `Notifiable`, `TwoFactorAuthenticatable` |
| Fillable | `name`, `email`, `password`, `notification_preferences` |
| Hidden (serialization) | `password`, `remember_token`, `two_factor_secret`, `two_factor_recovery_codes` |

`app/Http/Middleware/HandleInertiaRequests.php` exposes the authenticated user on every Inertia response via the `auth` shared prop:

```php
// app/Http/Middleware/HandleInertiaRequests.php
'auth' => fn () => [
    'user' => $user ? [
        'id'                      => $user->id,
        'name'                    => $user->name,
        'email'                   => $user->email,
        'avatar'                  => $user->avatar,
        'email_verified_at'       => $user->email_verified_at?->toISOString(),
        'two_factor_confirmed_at' => $user->two_factor_confirmed_at?->toISOString(),
    ] : null,
],
```

React pages read `usePage().props.auth.user` to determine login state, email verification status, and whether 2FA is confirmed.

## Post-Login Account Management

After login, three Settings controllers handle profile and security operations. All settings routes require the `auth` middleware; the `/dashboard` route additionally requires `verified` (`routes/web.php:12`):

```php
// routes/web.php
Route::get('/dashboard', fn () => Inertia::render('dashboard'))
    ->middleware(['auth', 'verified'])
    ->name('dashboard');
```

| Controller | Key operations |
| ---------- | -------------- |
| `app/Http/Controllers/Settings/ProfileController.php` | Edit/update name and email; destroy account (calls `Auth::logout()`, deletes the user row, invalidates session) |
| `app/Http/Controllers/Settings/PasswordController.php` | Edit/update password via `UpdateUserPassword` action; conditionally requires `password.confirm` middleware when 2FA `confirmPassword` is enabled |
| `app/Http/Controllers/Settings/SessionController.php` | Lists active sessions from the `sessions` table (ordered by `last_activity`); revokes other devices via `Auth::logoutOtherDevices()` |

Session records are stored in the `sessions` table created by the same migration as `security_users` (`database/migrations/0001_01_01_000000_create_security_users_table.php`).

## Cross-links

- [Testing](../testing/index.md) — authentication feature tests, including login, registration, and 2FA flows.
- [Tooling — Static Analysis](../tooling/static-analysis.md) — PHPStan rules that enforce type safety on auth-related code.
- [Database](../database/index.md) — `security_users` table schema and the migration inventory.
