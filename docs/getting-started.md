---
title: Getting Started
description: Clone the repo, start the Docker stack with Laravel Sail, and verify all services are healthy.
---

# Getting Started

## Prerequisites

- **Docker Desktop** (or Docker Engine + Compose) — all services run in containers.
- **Git** — to clone the repository.

No local PHP or Node installation is required. All commands run inside the Sail container.

## Clone and Install

```bash
git clone <repo-url> laravel-react-starter-kit
cd laravel-react-starter-kit
```

Bootstrap PHP dependencies using the Sail helper (no local PHP needed):

```bash
docker run --rm \
  -u "$(id -u):$(id -g)" \
  -v "$(pwd):/var/www/html" \
  -w /var/www/html \
  laravelsail/php85-composer:latest \
  composer install --ignore-platform-reqs
```

Copy the environment file and generate the application key:

```bash
cp .env.example .env
vendor/bin/sail artisan key:generate
```

## Start the Stack

```bash
vendor/bin/sail up -d
```

This starts all six Docker services: `pgsql`, `redis`, `typesense`, `rustfs`, `mailpit`, and `soketi`.

## Run Migrations

```bash
vendor/bin/sail artisan migrate
```

## Start the Frontend Dev Server

```bash
vendor/bin/sail bun run dev
```

Or start all services (server, queue worker, log watcher, Vite) concurrently:

```bash
vendor/bin/sail composer run dev
```

## Verify Services Are Running

Check that all containers are healthy:

```bash
vendor/bin/sail ps
```

Spot-check individual services:

| Service    | Check                                                            |
| ---------- | ---------------------------------------------------------------- |
| App        | `curl http://localhost`                                          |
| PostgreSQL | `vendor/bin/sail artisan config:show database.default` → `pgsql` |
| Redis      | `vendor/bin/sail exec redis redis-cli ping` → `PONG`             |
| Typesense  | `curl http://localhost:8108/health` → `{"ok":true}`              |
| RustFS     | `curl http://localhost:9000/health`                              |
| Mailpit UI | Open `http://localhost:8025` in a browser                        |
| Soketi     | `curl http://localhost:9601/usage`                               |

## Run Tests

```bash
vendor/bin/sail artisan test --compact
```
