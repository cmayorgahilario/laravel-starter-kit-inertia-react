<p align="center">
    <a href="https://laravel.com" target="_blank">
        <img src="https://raw.githubusercontent.com/laravel/art/master/logo-lockup/5%20SVG/2%20CMYK/1%20Full%20Color/laravel-logolockup-cmyk-red.svg" width="320" alt="Laravel Logo">
    </a>
</p>

<p align="center">
    <a href="https://packagist.org/packages/laravel/framework"><img src="https://img.shields.io/packagist/v/laravel/framework?label=laravel" alt="Laravel Version"></a>
    <a href="https://www.php.net/"><img src="https://img.shields.io/badge/php-8.5-777bb4" alt="PHP 8.5"></a>
    <a href="https://react.dev/"><img src="https://img.shields.io/badge/react-19-61dafb" alt="React 19"></a>
    <a href="https://inertiajs.com/"><img src="https://img.shields.io/badge/inertia-v3-9553e9" alt="Inertia v3"></a>
    <a href="https://tailwindcss.com/"><img src="https://img.shields.io/badge/tailwind-v4-38bdf8" alt="Tailwind v4"></a>
    <a href="https://opensource.org/licenses/MIT"><img src="https://img.shields.io/badge/license-MIT-green" alt="License MIT"></a>
</p>

# React Starter Kit

A Laravel 13 + React 19 starter kit with a full local service stack — PostgreSQL, Redis, Typesense, RustFS, Mailpit, and Soketi — all orchestrated via Docker Compose and Laravel Sail. Typed frontend with Inertia v3, Wayfinder, shadcn/ui, Tailwind v4, and React Compiler enabled out of the box.

## Stack

| Layer           | Tech                                                                                                      |
| --------------- | --------------------------------------------------------------------------------------------------------- |
| Runtime         | PHP 8.5 · Laravel 13 · Laravel Sail (Docker)                                                              |
| Frontend        | React 19 · Inertia v3 · TypeScript strict · Vite 8 (`vite-plus`/rolldown) · React Compiler                |
| UI              | Tailwind CSS v4 (CSS-first) · shadcn/ui (55 components, `base-nova` preset) · Lucide icons · Storybook 10 |
| Routes ↔ client | [Wayfinder](https://github.com/laravel/wayfinder) — typed TS functions for Laravel routes/actions         |
| Auth            | [Laravel Fortify](https://laravel.com/docs/fortify) (email/password, email verification, 2FA, resets)     |
| Database        | PostgreSQL 18                                                                                             |
| Cache           | Database (Postgres)                                                                                       |
| Sessions/Queues | Redis                                                                                                     |
| Search          | Typesense 27.1 (via Laravel Scout)                                                                        |
| Object storage  | RustFS (S3-compatible) via `league/flysystem-aws-s3-v3`                                                   |
| Mail            | Mailpit (local capture)                                                                                   |
| WebSockets      | Soketi (Pusher-compatible)                                                                                |
| Testing         | Pest 4 (Feature, Unit, Arch, Browser) · Larastan · Rector · Pint                                          |
| Dev tooling     | Telescope · IDE Helper · Laravel Boost (MCP) · Lefthook (git hooks) · Commitlint                          |

## Quickstart

Prerequisites: Docker Desktop (or Docker Engine + Compose) and Git. No local PHP or Node install needed — everything runs inside Sail.

```bash
git clone <repo-url> laravel-react-starter-kit
cd laravel-react-starter-kit

# Bootstrap PHP dependencies without a local PHP install
docker run --rm \
    -u "$(id -u):$(id -g)" \
    -v "$(pwd):/var/www/html" \
    -w /var/www/html \
    laravelsail/php85-composer:latest \
    composer install --ignore-platform-reqs

cp .env.example .env
vendor/bin/sail up -d
vendor/bin/sail artisan key:generate
vendor/bin/sail artisan migrate
vendor/bin/sail bun install
vendor/bin/sail bun run dev
```

Open <http://localhost> for the app and <http://localhost:8025> for Mailpit.

For the full guide (git hooks install, service health checks, Storybook, SSR) see [`docs/getting-started/`](./docs/getting-started/index.md).

## Useful Commands

All commands are prefixed with `vendor/bin/sail` so they execute inside the container.

```bash
# Everything concurrently: server + queue + pail (log tail) + vite
vendor/bin/sail composer run dev

# Tests
vendor/bin/sail composer test              # compact output
vendor/bin/sail composer test:coverage     # enforces 100% code coverage
vendor/bin/sail composer test:types        # enforces 100% type coverage

# Quality gates (lint + refactor dry-run + types + tests)
vendor/bin/sail composer check-all

# Frontend
vendor/bin/sail bun run dev                # Vite dev server (HMR)
vendor/bin/sail bun run build              # production build
vendor/bin/sail bun run storybook          # Storybook on port 6006
```

## Documentation

Full documentation lives in [`docs/`](./docs/index.md) and is published as a VitePress site. Key sections:

- [Getting Started](./docs/getting-started/index.md) — clone, boot, verify services
- [Architecture](./docs/architecture/index.md) — service topology, ports, env drivers, directory layout
    - [App Configuration](./docs/architecture/app-configuration.md) — what `AppServiceProvider::boot()` wires up
    - [Domain Namespaces](./docs/architecture/domain-namespaces.md) — `App\Models\{Domain}` conventions
- [Frontend Pipeline](./docs/frontend/index.md) — Vite plugins, Inertia resolver, SSR, React Compiler
    - [shadcn/ui](./docs/frontend/shadcn.md) · [Storybook](./docs/frontend/storybook.md) · [Theming](./docs/frontend/theming.md)
- [Authentication](./docs/authentication/index.md) — Fortify wiring, Actions, rate limiters, 2FA
- [Authorization](./docs/authorization/index.md) · [API](./docs/api/index.md) · [Database](./docs/database/index.md)
- [Queue](./docs/queue/index.md) · [Search](./docs/search/index.md) · [File Storage](./docs/file-storage/index.md) · [Realtime](./docs/realtime/index.md) · [Mail](./docs/mail/index.md)
- [Testing](./docs/testing/index.md) — Pest 4 layout, datasets, browser tests, coverage
- [Tooling](./docs/tooling/index.md) — [MCP Servers](./docs/tooling/mcp-servers.md), [Developer Tools](./docs/tooling/developer-tools.md), [Git Hooks](./docs/tooling/git-hooks.md), [Static Analysis](./docs/tooling/static-analysis.md), [Recommended Packages](./docs/tooling/recommended-packages.md)
- [Deployment](./docs/deployment/index.md)

To run the docs locally:

```bash
cd docs
bun install
bun run docs:dev
```

## Agentic Development

This repo is tuned for AI coding agents (Claude Code, Cursor, Copilot). [`AGENTS.md`](./AGENTS.md) is the minimal brief agents should load at session start; anything deeper lives in [`docs/`](./docs/index.md). MCP servers wired via `.mcp.json`:

- `laravel-boost` — project-specific tools (`search-docs`, `database-schema`, `last-error`, `browser-logs`, …). Always available when Sail is up.
- `context7` · `tavily` · `jina` — optional external MCPs for library docs, web search, and reader-mode URL extraction. See [`docs/tooling/mcp-servers.md`](./docs/tooling/mcp-servers.md).

## License

This starter kit, like the Laravel framework, is open-sourced software licensed under the [MIT license](https://opensource.org/licenses/MIT).
