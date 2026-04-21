---
title: Database
description: PostgreSQL 18 primary store, Redis session/queue backend, cache driver gotcha, and the full migration inventory for the React Starter Kit.
---

# Database

## Overview

The starter kit uses **PostgreSQL 18** as its primary data store and **Redis** for sessions and queues. Both services are declared in `compose.yaml` and wired via `.env.example`:

```yaml
# compose.yaml (excerpt)
pgsql:   # postgres:18-alpine  — port 5432
redis:   # redis:alpine         — port 6379
```

```ini
# .env.example (excerpt)
DB_CONNECTION=pgsql
SESSION_DRIVER=redis
QUEUE_CONNECTION=redis
CACHE_STORE=database   # ← cache goes to Postgres, not Redis (see below)
```

## PostgreSQL Configuration

The `pgsql` connection block in `config/database.php` sets two notable options beyond the usual host/port/credentials:

```php
// config/database.php — pgsql connection
'search_path' => 'public',
'sslmode'     => env('DB_SSLMODE', 'prefer'),
```

- **`search_path=public`** — queries resolve unqualified table names in the `public` schema, which is the PostgreSQL default. Explicit if you ever add a second schema.
- **`sslmode=prefer`** — TLS is attempted but not required; the connection falls back to plaintext if the server doesn't offer SSL. Override `DB_SSLMODE=require` in production.

## Redis Connections

`config/database.php` declares two Redis logical databases:

| Connection | Env var          | DB index | Used for                  |
| ---------- | ---------------- | -------- | ------------------------- |
| `default`  | `REDIS_DB=0`     | 0        | Sessions, queue jobs      |
| `cache`    | `REDIS_CACHE_DB=1` | 1      | Available but not active  |

> **Gotcha — `CACHE_STORE=database` means cache hits Postgres, not Redis.**
> The `cache` Redis connection (db 1) exists in `config/database.php` but is never activated because `.env.example` sets `CACHE_STORE=database`. Laravel's database cache driver writes to the `cache` table in PostgreSQL. Developers expecting Redis-backed caching should set `CACHE_STORE=redis` and verify `REDIS_CACHE_DB` is set.

## Schema & Migrations

Six migrations ship with the starter kit, run in timestamp order:

| Migration file | Creates / modifies |
| -------------- | ------------------ |
| `0001_01_01_000000_create_security_users_table.php` | `security_users` table (users with domain prefix) |
| `0001_01_01_000001_create_cache_table.php` | `cache` table for database cache driver |
| `0001_01_01_000002_create_jobs_table.php` | `jobs` and `failed_jobs` tables for queue worker |
| `2026_04_17_201711_create_telescope_entries_table.php` | Telescope monitoring tables |
| `2026_04_17_225537_add_notification_preferences_to_security_users_table.php` | Adds `notification_preferences` JSON column to `security_users` |
| `2026_04_18_014454_rename_users_table_to_security_users.php` | Renames legacy `users` table for existing databases |

### The `users` → `security_users` rename

New installations use `create_security_users_table.php` and never create a `users` table. The rename migration (`rename_users_table_to_security_users.php`) exists only for databases that were bootstrapped before the domain-namespace refactor — it renames the table and patches the `migrations` history record so `migrate:status` stays clean.

For the rationale behind the `security_` prefix see [Domain Namespaces](../architecture/domain-namespaces.md).

## Cross-links

- [Architecture](../architecture/index.md) — full Docker service topology and environment driver table.
- [Domain Namespaces](../architecture/domain-namespaces.md) — why the `security_users` table is named the way it is and the rules for adding future domain models.
