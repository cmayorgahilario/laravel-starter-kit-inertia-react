---
title: Database
description: PostgreSQL 18 as the default connection, domain-prefixed migrations and one-time operations.
---

# Database

## Overview

The default connection is **PostgreSQL** (`DB_CONNECTION=pgsql` in `.env.example`), served by the
`pgsql` container (`postgres:18-alpine`) in `compose.yaml`. The connection is defined in
`config/database.php`.

| Variable        | Default (`.env.example`) |
| --------------- | ------------------------ |
| `DB_CONNECTION` | `pgsql`                  |
| `DB_HOST`       | `pgsql`                  |
| `DB_PORT`       | `5432`                   |
| `DB_DATABASE`   | `laravel`                |
| `DB_USERNAME`   | `sail`                   |
| `DB_PASSWORD`   | `password`               |

> [!NOTE]
> The default in `config/database.php` is `sqlite`, but `.env.example` overrides it to `pgsql`. The
> operational truth of the project is **Postgres**.

## Migrations

Migrations live in `database/migrations/`. Laravel's infrastructure tables (`cache`, `cache_locks`,
`jobs`, `job_batches`, `failed_jobs`, `sessions`, `password_reset_tokens`) exist because cache, queue
and session use the `database` driver (see [cache-queues-sessions.md](cache-queues-sessions.md)).

Domain tables carry the bounded-context prefix:

| Table                                    | Migration                                                              |
| ---------------------------------------- | ---------------------------------------------------------------------- |
| `security_users`                         | `0001_01_01_000000_create_security_users_table.php`                    |
| `security_personal_access_tokens`        | `2026_06_05_192956_create_security_personal_access_tokens_table.php`   |
| `security_passkeys`                      | `2026_06_05_193039_create_security_passkeys_table.php`                 |
| 2FA columns on `security_users`          | `2026_06_05_193038_add_two_factor_columns_to_security_users_table.php` |
| `avatar_path` column on `security_users` | `2026_06_05_200429_add_avatar_path_to_security_users_table.php`        |

The prefix convention is in [../architecture/code-organization.md](../architecture/code-organization.md).

## One-time operations

The project uses `timokoerber/laravel-one-time-operations` for tasks that must run exactly once (they
are not schema migrations). They live in `operations/`:

```text
operations/2026_06_05_125203_user_founder_operation.php
```

Run them with:

```bash
./vendor/bin/sail artisan operations:process
```

### Founder user operation

`user_founder_operation.php` creates (or updates) the primary administrative user — the "founder". It
reads the credentials from `config('auth.founder')` (`config/auth.php`), which in turn come from three
environment variables:

| Variable                | Maps to                 |
| ----------------------- | ----------------------- |
| `AUTH_FOUNDER_NAME`     | `auth.founder.name`     |
| `AUTH_FOUNDER_EMAIL`    | `auth.founder.email`    |
| `AUTH_FOUNDER_PASSWORD` | `auth.founder.password` |

These are **empty in `.env.example`** and must be filled in before running the operation. If any is
blank, the operation throws a `RuntimeException` ("Founder credentials are not configured…") and no user
is created. When set, it `firstOrNew` by email, sets name and password, and marks the email as verified
(so the founder can immediately access the admin panel — see
[../admin-panel/index.md](../admin-panel/index.md)).

> [!NOTE]
> This is the canonical way to bootstrap the initial admin user. The `db:seed`/`UserSeeder` path creates
> a sample user for local development only.

## Commands

```bash
./vendor/bin/sail artisan migrate              # apply migrations
./vendor/bin/sail artisan migrate:fresh --seed # recreate and seed
./vendor/bin/sail artisan db:seed              # seeders only
```

Factories and seeders live under `database/factories/Security/` and `database/seeders/Security/`.
