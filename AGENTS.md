# Project Context

## MCP Servers

Servers declared in `.mcp.json`: `laravel-boost`, `context7`, `tavily`, `jina`. Only `laravel-boost` is guaranteed to be available in every session — the other three require API keys exported in the user's shell and may be disconnected.

**Usage rule:** Before calling any external MCP tool (`context7`, `tavily`, `jina`), confirm the server is connected. If a call fails with a connection, auth, or `tool not found` error, do not retry the same server — fall back per the priority table in `docs/mcp-servers.md`. If no fallback produces equivalent output (scholarly search, screenshots, PDF extraction, site crawling), surface the limitation to the user rather than silently degrading.

**Priority when choosing an MCP:**

1. **This app's runtime state or Laravel-ecosystem docs** → `laravel-boost` first, always.
2. **Third-party library / framework API docs** → `context7` first, then `tavily`/`jina` against the official docs site.
3. **General web search** → `tavily` first, `jina/search_web` as fallback.
4. **Read a specific URL** → `jina/read_url` first, `tavily/tavily_extract` as fallback.
5. **Scholarly / PDF / screenshots / image work** → `jina` only (no fallback).
6. **Site crawl / sitemap** → `tavily` only (no fallback).

See `docs/mcp-servers.md` for the full decision matrix, combined-usage patterns, and quota-exhaustion fallback order.

### Laravel Boost Tools (always available when Sail is up)

MCP server command (`.mcp.json`): `vendor/bin/sail artisan boost:mcp`

Use these over manual alternatives:

- **`search-docs`** — Search version-specific Laravel docs before making code changes. Pass a `packages` array to scope results. Use multiple broad queries; package names are already scoped automatically.
- **`database-query`** — Run read-only SQL against the live database instead of tinker.
- **`database-schema`** — Inspect table structure before writing migrations or models.
- **`get-absolute-url`** — Resolve the correct scheme, domain, and port for project URLs. Always call before sharing a URL with the user.
- **`browser-logs`** — Read recent browser console logs, JS errors, and exceptions.
- **`last-error`** — Fetch the most recent backend exception and stack trace.
- **`read-log-entries`** — Read surrounding context from `storage/logs/laravel.log`.
- **`application-info`** — PHP / Laravel version and installed package versions for this project.

**CRITICAL: Always use `search-docs` before writing or modifying Laravel code. Never rely on training data for Laravel APIs — query the docs first.**

### Optional MCPs (only if connected)

- **`context7`** — Version-pinned library docs. Flow: `resolve-library-id` → `query-docs`. Use for anything _not_ covered by `laravel-boost/search-docs` (React, Vue, Next.js, cloud SDKs, etc.).
- **`tavily`** — Web search and content tooling: `tavily_search`, `tavily_extract`, `tavily_crawl`, `tavily_map`, `tavily_research`. Prefer for current-events queries (`time_range` controls freshness).
- **`jina`** — Broad web access: `search_web`, `read_url`, `parallel_read_url`, `capture_screenshot_url`, `extract_pdf`, `search_arxiv`, `search_ssrn`, `search_bibtex`, `classify_text`, `sort_by_relevance`, `deduplicate_strings`. Only source for scholarly, PDF, image, and screenshot work.

Skills published by Boost (`boost.json`): `laravel-best-practices`, `tailwindcss-development`. Activate the relevant skill whenever working in those domains.

## Project Infrastructure

**Runtime:** PHP 8.5 / Laravel 13 inside Laravel Sail Docker containers. All commands must be prefixed with `vendor/bin/sail`.

**Docker services** (`compose.yaml`):

| Service   | Image                        | Default Port(s)           | Purpose                              |
| --------- | ---------------------------- | ------------------------- | ------------------------------------ |
| pgsql     | postgres:18-alpine           | 5432                      | Primary database                     |
| redis     | redis:alpine                 | 6379                      | Sessions, queues (phpredis)          |
| typesense | typesense/typesense:27.1     | 8108                      | Full-text search (Scout driver)      |
| rustfs    | rustfs/rustfs:latest         | 9000 (API), 9001 (UI)     | S3-compatible object storage         |
| mailpit   | axllent/mailpit:latest       | 1025 (SMTP), 8025 (UI)    | Local mail capture                   |
| soketi    | quay.io/soketi/soketi:latest | 6001 (WS), 9601 (metrics) | WebSocket server (Pusher-compatible) |

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
