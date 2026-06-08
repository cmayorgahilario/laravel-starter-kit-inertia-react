---
title: Security domain
description: The Security bounded-context — users, authentication, passkeys, API tokens and sessions.
---

# Security domain

## Overview

`Security` is the only bounded-context today. It owns everything about identity: users, authentication,
two-factor, passkeys, API tokens and sessions. Its code lives under the `Security` namespace across all
layers, and its tables use the `security_` prefix
(see [../architecture/code-organization.md](../architecture/code-organization.md)).

This page maps the domain's code. The behavior of each capability is documented in its own section:
[../authentication/index.md](../authentication/index.md) and [../admin-panel/index.md](../admin-panel/index.md).

## Models

| Model                                     | Table                             | Notes                                                                                                                                                                   |
| ----------------------------------------- | --------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `App\Models\Security\User`                | `security_users`                  | Implements `FilamentUser`, `HasAvatar`, `MustVerifyEmail`, `PasskeyUser`; uses `HasApiTokens`, `TwoFactorAuthenticatable`, `PasskeyAuthenticatable`, `HasProfilePhoto`. |
| `App\Models\Security\Passkey`             | `security_passkeys`               | Extends `Laravel\Passkeys\Passkey`.                                                                                                                                     |
| `App\Models\Security\PersonalAccessToken` | `security_personal_access_tokens` | Extends Sanctum's token model.                                                                                                                                          |

The `HasProfilePhoto` trait (`app/Models/Security/Concerns/`) handles avatar upload/delete and the
fallback URL (see [../services/storage.md](../services/storage.md)).

## Other layers

| Layer             | Location                                                                                          |
| ----------------- | ------------------------------------------------------------------------------------------------- |
| Fortify actions   | `app/Actions/Security/` (see [../authentication/actions.md](../authentication/actions.md))        |
| Controllers       | `app/Http/Controllers/Security/` (UCP: profile, password, security, sessions, account, photo)     |
| Filament resource | `app/Filament/Resources/Security/Users/` (see [../admin-panel/index.md](../admin-panel/index.md)) |
| Factory / Seeder  | `database/factories/Security/UserFactory.php`, `database/seeders/Security/UserSeeder.php`         |

## Tests

Domain tests mirror this structure:

```text
tests/Unit/Models/Security/
tests/Feature/Http/Controllers/Security/
tests/Feature/Filament/Resources/Security/Users/
```
