---
title: Queue
description: Redis-backed queue infrastructure for the React Starter Kit — configuration, schema, worker command, and the explicit absence of domain jobs.
---

# Queue

## Overview

The starter kit ships a fully wired Redis queue. `QUEUE_CONNECTION=redis` is set in `.env.example` (line 38) and the `redis` service is declared in `compose.yaml`:

```yaml
# compose.yaml (excerpt)
redis:
  image: 'redis:alpine'
  ports:
    - '6379:6379'
```

```ini
# .env.example (excerpt)
QUEUE_CONNECTION=redis
```

The queue worker is included in the `composer run dev` concurrency group so it starts automatically during local development alongside the HTTP server, log tail, and Vite.

## Configuration

`config/queue.php` declares the default connection and all supported drivers:

```php
// config/queue.php
'default' => env('QUEUE_CONNECTION', 'database'),
```

> In this project `.env.example` overrides the fallback — `QUEUE_CONNECTION=redis` is active in all Sail environments.

**Available connections** (all declared in `config/queue.php`):

| Connection   | Driver         | Notes                                          |
| ------------ | -------------- | ---------------------------------------------- |
| `sync`       | `sync`         | Executes jobs immediately in-process           |
| `database`   | `database`     | Reads from the `jobs` table (`DB_QUEUE_TABLE`) |
| `beanstalkd` | `beanstalkd`   | Beanstalkd broker                              |
| `sqs`        | `sqs`          | AWS SQS                                        |
| `redis`      | `redis`        | **Active** — uses the `default` Redis connection |
| `deferred`   | `deferred`     | Laravel deferred dispatch                      |
| `background` | `background`   | Background execution driver                    |
| `failover`   | `failover`     | Falls back through `database` → `deferred`     |

**Batching** (`config/queue.php`):

```php
'batching' => [
    'database' => env('DB_CONNECTION', 'sqlite'),
    'table'    => 'job_batches',
],
```

**Failed jobs** (`config/queue.php`):

```php
'failed' => [
    'driver'   => env('QUEUE_FAILED_DRIVER', 'database-uuids'),
    'database' => env('DB_CONNECTION', 'sqlite'),
    'table'    => 'failed_jobs',
],
```

The `database-uuids` driver persists failed jobs to the `failed_jobs` table with UUID identifiers, enabling `artisan queue:retry <uuid>` and `artisan queue:forget <uuid>`.

## Redis Connection

The `redis` queue connection uses `REDIS_QUEUE_CONNECTION=default` (`config/queue.php`), which resolves to the `default` Redis logical database (db index `0`) declared in `config/database.php`:

```php
// config/database.php — redis.default
'default' => [
    'host'     => env('REDIS_HOST', '127.0.0.1'),
    'port'     => env('REDIS_PORT', '6379'),
    'database' => env('REDIS_DB', '0'),
],
```

Sessions also use db 0, so queue keys and session keys share the same Redis instance and are distinguished by their key prefixes. For the full Redis connection explanation — client driver, cluster mode, backoff options — see [Database → Redis Connections](../database/index.md#redis-connections).

## Schema

`database/migrations/0001_01_01_000002_create_jobs_table.php` ships three tables:

| Table        | Purpose                                                    |
| ------------ | ---------------------------------------------------------- |
| `jobs`       | Fallback storage for the `database` queue driver           |
| `job_batches`| Batch tracking for `Bus::batch([...])->dispatch()`         |
| `failed_jobs`| Persistent record of jobs that exhausted their retry limit |

These tables are created even though `QUEUE_CONNECTION=redis` is active. They serve two purposes:

1. **Fallback** — switching `QUEUE_CONNECTION=database` in `.env` makes the database driver immediately available without a new migration.
2. **Introspection** — failed jobs land in `failed_jobs` regardless of the active driver; `job_batches` is always database-backed.

## Running the Queue

The `dev` script in `composer.json` starts the queue worker as part of the local concurrency group:

```json
// composer.json — scripts.dev
"php artisan queue:listen --tries=1 --timeout=0"
```

`--tries=1` means a job that fails is immediately moved to `failed_jobs` without retrying. `--timeout=0` disables the process-level timeout, letting long-running jobs complete uninterrupted.

To run the worker in isolation:

```bash
vendor/bin/sail artisan queue:listen
```

To inspect or retry failed jobs:

```bash
vendor/bin/sail artisan queue:failed
vendor/bin/sail artisan queue:retry <uuid>
```

## No Custom Jobs Yet

`app/Jobs/` does not exist in this starter kit. The queue infrastructure (Redis driver, worker script, migration tables) is fully provisioned, but no domain jobs have been written. When you add your first job:

```bash
vendor/bin/sail artisan make:job ProcessSomething
```

Artisan will create `app/Jobs/ProcessSomething.php`. The worker process picks it up automatically without any configuration change.

## Cross-links

- [Database](../database/index.md) — PostgreSQL / Redis connection details, full migration inventory.
- [Architecture](../architecture/index.md) — Docker service topology, all environment driver settings.
