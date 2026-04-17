# Project Context

## Laravel Boost MCP Tools

MCP server command (`.mcp.json`): `vendor/bin/sail artisan boost:mcp`

Available tools — use these over manual alternatives:

- **`search-docs`** — Search version-specific Laravel docs before making code changes. Pass a `packages` array to scope results. Use multiple broad queries; package names are already scoped automatically.
- **`database-query`** — Run read-only SQL against the live database instead of tinker.
- **`database-schema`** — Inspect table structure before writing migrations or models.
- **`get-absolute-url`** — Resolve the correct scheme, domain, and port for project URLs. Always call before sharing a URL with the user.
- **`browser-logs`** — Read recent browser console logs, JS errors, and exceptions.

**CRITICAL: Always use `search-docs` before writing or modifying code. Never rely on training data for Laravel APIs — query the docs first.**

Skills published by Boost (`boost.json`): `laravel-best-practices`, `tailwindcss-development`. Activate the relevant skill whenever working in those domains.

## Project Infrastructure

**Runtime:** PHP 8.5 / Laravel 13 inside Laravel Sail Docker containers. All commands must be prefixed with `vendor/bin/sail`.

**Docker services** (`compose.yaml`):

| Service    | Image                          | Default Port(s)       | Purpose                         |
|------------|--------------------------------|-----------------------|---------------------------------|
| pgsql      | postgres:18-alpine             | 5432                  | Primary database                |
| redis      | redis:alpine                   | 6379                  | Sessions, queues (phpredis)     |
| typesense  | typesense/typesense:27.1       | 8108                  | Full-text search (Scout driver) |
| rustfs     | rustfs/rustfs:latest           | 9000 (API), 9001 (UI) | S3-compatible object storage    |
| mailpit    | axllent/mailpit:latest         | 1025 (SMTP), 8025 (UI)| Local mail capture              |
| soketi     | quay.io/soketi/soketi:latest   | 6001 (WS), 9601 (metrics) | WebSocket server (Pusher-compatible) |

**Environment** (`.env`):

- `DB_CONNECTION=pgsql` — PostgreSQL 18
- `CACHE_STORE=database` — Cache stored in DB, not Redis
- `QUEUE_CONNECTION=redis` — Jobs run from Redis queue
- `SESSION_DRIVER=redis` — Sessions in Redis
- `FILESYSTEM_DISK=s3` → rustfs via `AWS_ENDPOINT=http://rustfs:9000`
- `BROADCAST_CONNECTION=log` — Broadcasting is log-only by default
- `SCOUT_DRIVER=typesense` — Full-text search via Typesense

**PHP dependencies** (`composer.json`):

- `laravel/framework ^13.0`
- `laravel/boost ^2.4` (dev)
- `laravel/sail ^1.57` (dev)
- `laravel/pint ^1.27` (dev) — run `vendor/bin/sail bin pint --dirty` after PHP changes
- `phpunit/phpunit ^12.5.12` (dev)
- `league/flysystem-aws-s3-v3 ^3.0` — S3/rustfs driver

**Useful Artisan commands:**

- `vendor/bin/sail artisan migrate` — run migrations
- `vendor/bin/sail artisan test --compact` — run test suite
- `vendor/bin/sail artisan route:list --except-vendor` — inspect routes
- `vendor/bin/sail artisan config:show database.default` — verify active driver

## Frontend Stack

**Bundler:** Vite 8 (`package.json: "vite": "^8.0.0"`)
**CSS:** Tailwind CSS v4 (`"tailwindcss": "^4.0.0"`, `"@tailwindcss/vite": "^4.0.0"`)
**Runtime:** bun (used as the package runner via `vendor/bin/sail bun`)
**Entry point:** `resources/js/app.js` (minimal — starter kit is pre-React scaffold)
**Routes:** `routes/web.php` — single `/` route returning the `welcome` view

**Frontend commands:**

- `vendor/bin/sail bun run dev` — start Vite dev server with HMR
- `vendor/bin/sail bun run build` — production build
- `vendor/bin/sail composer run dev` — start all services concurrently (server, queue, pail, vite)

> If a frontend change isn't visible, the user may need to run one of the build commands above.
