---
title: Domain Namespaces
description: How models, factories, and migrations are organized into domain sub-namespaces under App\Models.
---

# Domain Namespaces

## Overview

Domain namespaces group related Eloquent models into sub-namespaces under `App\Models\{Domain}` rather than placing all models flat in `App\Models`. This keeps the model directory readable as the application grows and makes the ownership of each table explicit.

The first domain established in this project is **Security**, which owns user authentication data. The pattern is intentionally minimal — not every model needs a domain prefix, and framework-managed tables are deliberately excluded (see [What NOT to Namespace](#what-not-to-namespace)).

## Naming Rules

| Concern | Convention | Example |
|---|---|---|
| Model class | `App\Models\{Domain}\{Model}` | `App\Models\Security\User` |
| Table name | `{domain}_{models}` (snake_case, plural) | `security_users` |
| Factory class | `Database\Factories\{Domain}\{ModelFactory}` | `Database\Factories\Security\UserFactory` |
| Factory binding | Explicit `newFactory()` override on the model | returns `Security\UserFactory::new()` |
| Factory `$model` | Explicit `$model` property on the factory | `App\Models\Security\User::class` |
| Migration | Creates the prefixed table directly | `create_security_users_table.php` |

**Why explicit over magic?** Laravel can auto-resolve a factory at `Database\Factories\Security\UserFactory` for a model at `App\Models\Security\User` without any override. We still add the explicit `newFactory()` and `$model` property so a developer reading the code sees the binding immediately, without needing to know the auto-resolution algorithm (Decision D037).

## Worked Example: Security\User

### Model — `app/Models/Security/User.php`

```php
<?php

declare(strict_types=1);

namespace App\Models\Security;

use Database\Factories\Security\UserFactory;
use Illuminate\Database\Eloquent\Attributes\Hidden;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

#[Hidden(['password', 'remember_token'])]
class User extends Authenticatable
{
    /** @use HasFactory<UserFactory> */
    use HasFactory;

    use Notifiable;

    protected $table = 'security_users';

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    /**
     * @return Factory<User>
     */
    protected static function newFactory(): Factory
    {
        return UserFactory::new();
    }
}
```

Key points:
- `$table = 'security_users'` — explicit table name; Laravel's default would derive `users` from the class name.
- `newFactory()` returns `UserFactory::new()` — the explicit binding described in Decision D037.

### Factory — `database/factories/Security/UserFactory.php`

```php
<?php

declare(strict_types=1);

namespace Database\Factories\Security;

use App\Models\Security\User;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

/**
 * @extends Factory<User>
 */
class UserFactory extends Factory
{
    /** @var class-string<User> */
    protected $model = User::class;

    public function definition(): array
    {
        return [
            'name' => fake()->name(),
            'email' => fake()->unique()->safeEmail(),
            'email_verified_at' => now(),
            'password' => static::$password ??= Hash::make('password'),
            'remember_token' => Str::random(10),
        ];
    }

    public function unverified(): static
    {
        return $this->state(fn (array $attributes): array => [
            'email_verified_at' => null,
        ]);
    }
}
```

Key points:
- `protected $model = User::class` — explicit `$model` prevents the factory from resolving to the wrong model if the auto-resolution algorithm ever changes.
- Namespace mirrors the model path: `Database\Factories\Security\` matches `App\Models\Security\`.

### Migration

The migration file is named `0001_01_01_000000_create_security_users_table.php` and creates the `security_users` table directly. A separate rename migration (`2026_04_18_014454_rename_users_table_to_security_users.php`) handles existing databases that already have a `users` table — it renames the table and updates the `migrations` record so `migrate:status` stays clean (Decision D035).

## Adding a New Domain Model

Follow these steps when introducing a model that belongs to a domain other than the root `App\Models` namespace.

1. **Decide whether a domain prefix is warranted.** A domain prefix is appropriate when the model represents an entity owned by a clear bounded context (e.g. `Billing`, `Reporting`). Generic utility models can remain at `App\Models` directly.

2. **Create the model** in the correct sub-namespace:
   ```
   vendor/bin/sail artisan make:model Models/Security/MyModel --no-interaction
   ```
   Move the generated file to `app/Models/Security/MyModel.php` if Artisan places it elsewhere, and update the `namespace` declaration.

3. **Set the explicit table name** on the model:
   ```php
   protected $table = 'security_my_models';
   ```

4. **Add the `newFactory()` override**:
   ```php
   protected static function newFactory(): Factory
   {
       return \Database\Factories\Security\MyModelFactory::new();
   }
   ```

5. **Create the factory** at `database/factories/Security/MyModelFactory.php` with namespace `Database\Factories\Security` and set `protected $model = MyModel::class`.

6. **Create the migration** that creates the prefixed table directly:
   ```
   vendor/bin/sail artisan make:migration create_security_my_models_table --no-interaction
   ```

7. **Update import sites.** Any place that previously imported `App\Models\MyModel` must be updated to `App\Models\Security\MyModel`. Check with:
   ```bash
   grep -r 'App\\Models\\MyModel' app/ config/ routes/ tests/
   ```

8. **Run tests** to confirm nothing is broken:
   ```
   vendor/bin/sail artisan test --compact
   ```

## What NOT to Namespace

The following framework-managed tables **must not** receive a domain prefix because they are referenced by Laravel internals using hard-coded or convention-based names.

| Table | Managed by | Reason to leave unchanged |
|---|---|---|
| `sessions` | `SessionServiceProvider` | Session driver references this table by name from config |
| `password_reset_tokens` | `PasswordResetServiceProvider` | Auth scaffolding references this table by convention |
| `cache` | Cache database driver | Referenced by the cache store configuration |
| `jobs` / `failed_jobs` | Queue worker | Queue driver references these tables by name |
| `migrations` | Artisan `migrate` command | Framework internal — must never be renamed |

Renaming these tables adds complexity without value and risks breaking framework behavior (Decision D036).
