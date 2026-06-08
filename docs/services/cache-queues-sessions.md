---
title: Cache, queues and sessions
description: All three use the database driver by default; Valkey is available as an alternative.
---

# Cache, queues and sessions

## Overview

Cache, queues and sessions share the same default driver: **`database`**. This means state lives in
Postgres tables (`cache`, `jobs`, `sessions`), not in Valkey/Redis, even though the `valkey` container
is available in `compose.yaml`.

| Subsystem | Variable           | Default (`.env.example`) | Config               |
| --------- | ------------------ | ------------------------ | -------------------- |
| Cache     | `CACHE_STORE`      | `database`               | `config/cache.php`   |
| Queue     | `QUEUE_CONNECTION` | `database`               | `config/queue.php`   |
| Session   | `SESSION_DRIVER`   | `database`               | `config/session.php` |

The Redis connection (`phpredis` client, host `valkey`) is configured in `config/database.php` and
ready to use by switching the environment values to `redis`, but it is **not the default**.

## Queues

- `database` driver, `jobs` table, `retry_after` 90s (`config/queue.php`).
- Failed jobs use `database-uuids` over the `failed_jobs` table.
- Worker in development:

    ```bash
    ./vendor/bin/sail artisan queue:listen
    ```

## Sessions

- `database` driver, `sessions` table, 120-minute lifetime (`config/session.php`).
- Each session stores `user_agent` and `ip_address`, which feeds the "active sessions" screen of the
  user control panel (see [../authentication/index.md](../authentication/index.md)).
- That screen only works with the `database` driver. With any other driver the `features.browserSessions`
  shared prop is `false`, the UCP hides the Sessions entry and `GET /ucp/sessions` returns 404
  (`BrowserSessionsController@index`).

## In tests

`phpunit.xml` forces in-memory drivers for tests: `CACHE_STORE=array`, `QUEUE_CONNECTION=sync`,
`SESSION_DRIVER=array`. See [../testing/index.md](../testing/index.md).
