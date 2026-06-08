---
title: Code organization by domains
description: The bounded-context convention in app/ and how tests mirror that structure.
---

# Code organization by domains

## Overview

Code is not organized by flat technical type (all models together, all controllers together) but by
**bounded-context**. Today there is a single domain, `Security`, which groups everything related to
users, authentication and sessions. Each technical layer lives inside its domain.

This keeps what changes together cohesive and leaves room to add new domains without reorganizing. The
domain catalog is in [../domains/index.md](../domains/index.md).

## Naming rules

| Concern            | Convention                                            | Real example                                               |
| ------------------ | ----------------------------------------------------- | ---------------------------------------------------------- |
| Models             | `App\Models\<Domain>\<Model>`                         | `App\Models\Security\User`                                 |
| Actions            | `App\Actions\<Domain>\<Action>`                       | `App\Actions\Security\CreateNewUser`                       |
| Controllers        | `App\Http\Controllers\<Domain>\<Controller>`          | `App\Http\Controllers\Security\SecuritySettingsController` |
| Support / VOs      | `App\Support\<Domain>\<Class>`                        | `App\Support\Security\UserAgent`                           |
| Filament resources | `App\Filament\Resources\<Domain>\<Plural>\<Resource>` | `App\Filament\Resources\Security\Users\UserResource`       |
| Factories          | `Database\Factories\<Domain>\<Factory>`               | `Database\Factories\Security\UserFactory`                  |
| Seeders            | `Database\Seeders\<Domain>\<Seeder>`                  | `Database\Seeders\Security\UserSeeder`                     |
| DB tables          | `<domain>_<plural>`                                   | `security_users`, `security_passkeys`                      |

## Worked example

The `User` model and its whole context live under `Security`:

```text
app/Models/Security/User.php
app/Models/Security/Passkey.php
app/Models/Security/PersonalAccessToken.php
app/Models/Security/Concerns/HasProfilePhoto.php
app/Actions/Security/CreateNewUser.php
app/Http/Controllers/Security/SecuritySettingsController.php
app/Filament/Resources/Security/Users/UserResource.php
```

And the matching table is `security_users` (see
`database/migrations/0001_01_01_000000_create_security_users_table.php`).

**Key points:**

- The table prefix (`security_`) follows the domain namespace.
- `Concerns/` (traits) live inside the domain that uses them, not in a global folder.

## Tests mirror app/

Tests replicate the `app/` structure under `tests/Unit` and `tests/Feature`:

```text
tests/Unit/Models/Security/
tests/Unit/Support/Security/
tests/Feature/Http/Controllers/Security/
tests/Feature/Filament/Resources/Security/Users/
```

The Arch and Browser suites have their own organization. Detail in
[../testing/index.md](../testing/index.md).

## Adding a new X

To add a new domain (e.g. `Catalog`):

1. Create the classes under the domain namespace. With scaffolding:

    ```bash
    ./vendor/bin/sail artisan make:model Catalog/Product
    ./vendor/bin/sail artisan make:controller Catalog/ProductController
    ```

2. Name the table with the domain prefix (`catalog_products`) in its migration.
3. Mirror the structure under `tests/Unit` and `tests/Feature`.
4. Add the domain entry in [../domains/index.md](../domains/index.md).
5. If there are boundary rules, check the [../testing/index.md](../testing/index.md) → Arch suite
   (`tests/Arch/Boundaries/`).

## What NOT to do

- Do not place models/controllers at the root of `app/Models` or `app/Http/Controllers` without a
  domain.
- Do not mix two domains in the same folder; each bounded-context is independent.
