---
title: Structure Guide
description: The 16-section documentation blueprint for this project — what each section covers, six writing rules every contributor should follow, and the process for adding a new section.
---

# Structure Guide

This guide explains how the documentation is organized, why it is organized that way, and what a contributor needs to know before adding or editing pages. The goal is not rigid uniformity — every contributor brings their own voice — but coherent structure that makes the docs navigable and trustworthy.

## The 16-Section Blueprint

These sections map directly to the project's actual stack and workflow. Not every section has full content yet; the blueprint defines the target shape.

### 1. Overview / Landing

The entry point (`docs/index.md`). A hero section and a quick-reference table of every service in the stack (runtime, framework, bundler, CSS, database, cache, sessions, queues, search, storage, mail, WebSockets). Links to the two most common next steps: Getting Started and Architecture. Readers should understand what the project is in under 30 seconds.

### 2. Getting Started

Step-by-step instructions for cloning the repository, copying `.env.example`, running `vendor/bin/sail up -d`, executing migrations, and verifying the stack is healthy. Covers both first-time setup and day-to-day development workflow. Every command must be tested against the real repository before it appears here.

### 3. Architecture

Service topology: how Docker Compose wires together the application container, PostgreSQL 18, Redis, Typesense 27.1, RustFS, Mailpit, and Soketi. Includes the port map and explains which environment variable controls each driver (session, cache, queue, search, storage, broadcast). Diagrams are encouraged but not required.

### 4. Database

PostgreSQL 18 via `postgres:18-alpine`. Covers Eloquent models, migrations with `vendor/bin/sail artisan migrate`, the `pgsql` driver in `DB_CONNECTION`, and query patterns common in this project. Includes guidance on inspecting the live schema with the `database-schema` MCP tool.

### 5. Authentication

How authentication works end-to-end in Laravel 13. Session storage driver (`SESSION_DRIVER=redis`), guards, middleware, and any starter-kit auth scaffolding. Documents the session configuration so contributors understand why Redis is chosen over the database driver for sessions.

### 6. Authorization

Gates, policies, and how they are applied to routes and controllers in this project. Includes examples grounded in actual model classes — no hypothetical User/Post examples that don't reflect the real codebase.

### 7. API

Route definitions in `routes/web.php` and `routes/api.php` (if present). Documents route naming conventions, middleware groups, and how to inspect the full route list with `vendor/bin/sail artisan route:list --except-vendor`. Updated whenever a significant new route group is added.

### 8. Frontend

Vite 8 with `@tailwindcss/vite` and Tailwind CSS v4. Entry point at `resources/js/app.js`. Explains the dev workflow (`vendor/bin/sail bun run dev`), production build (`vendor/bin/sail bun run build`), and the `vendor/bin/sail composer run dev` shortcut that starts all services concurrently. Covers how Tailwind v4 differs from v3 (utility-first CSS-in-CSS, no `tailwind.config.js` by default).

### 9. Testing

PHPUnit 12 via `vendor/bin/sail artisan test --compact`. Documents test directory structure, how to write feature tests that hit the live PostgreSQL database (no mocked DB — see project decisions), and how to run the full suite in CI.

### 10. Queue & Jobs

Queue connection is Redis (`QUEUE_CONNECTION=redis`). Covers defining jobs, dispatching, running the worker with `vendor/bin/sail artisan queue:work`, and monitoring via Laravel Horizon (if installed). Documents the rationale for Redis over the database driver for queue workloads.

### 11. Search

Full-text search via Typesense 27.1 (`SCOUT_DRIVER=typesense`, port 8108). Covers Scout model setup, indexing, and querying. Explains how to verify the Typesense service is healthy from inside the Sail containers.

### 12. File Storage

RustFS (`rustfs/rustfs:latest`) running as an S3-compatible object store on port 9000 (API) and 9001 (UI). `FILESYSTEM_DISK=s3` with `AWS_ENDPOINT=http://rustfs:9000`. Covers Laravel's `Storage` facade, how to configure bucket creation on first run, and the `league/flysystem-aws-s3-v3` dependency.

### 13. Real-time / WebSockets

Soketi (`quay.io/soketi/soketi:latest-16-alpine`) on port 6001 (WebSocket) and 9601 (metrics). `BROADCAST_CONNECTION=log` by default; documents the steps to switch to the Soketi driver for local development. Covers Laravel Echo, Pusher-compatible events, and the channel authorization flow.

### 14. Mail

Mailpit (`axllent/mailpit:latest`) captures all outbound mail locally. SMTP on port 1025, web UI on port 8025. Documents Laravel's `Mail` facade, how to configure `MAIL_HOST=mailpit` in `.env`, and how to inspect captured messages in the Mailpit UI during development.

### 15. Deployment

How to move from local Sail development to a production host. Covers environment variable differences, running migrations safely, compiling frontend assets with `vendor/bin/sail bun run build`, and any deployment-specific Artisan commands. Updated whenever the deployment target changes.

### 16. Meta

This section (you are here). Documents the documentation itself: section structure, writing rules, and the process for adding new sections. The last section by convention so it does not clutter the primary navigation.

## Six Rules for Writing Documentation

These rules exist because each one prevents a specific class of documentation failure that has caused real confusion in real projects. Contributors will bring their own style — that is welcome — but these rules are non-negotiable.

### Rule 1: Source-first content

Every fact in the docs must be verifiable against the repository. If you claim the cache driver is `database`, confirm `CACHE_STORE=database` in `.env.example`. If you list a service port, confirm it in `compose.yaml`. Undocumented speculation is worse than a gap — it actively misleads readers.

### Rule 2: No stand-in text

Do not commit pages that contain filler text of any kind — unfinished action markers, dummy prose, or any text that signals work-in-progress rather than finished content. A page that is not ready should not exist yet. A stub page with dummy content is a lie — it makes the docs appear more complete than they are and trains readers to stop trusting them. Write the real content or do not create the page.

### Rule 3: Frontmatter on every page

Every `.md` file must open with a YAML frontmatter block containing at minimum `title` and `description`. VitePress uses these for the `<title>` tag and `<meta name="description">`. Missing frontmatter degrades SEO and makes the page harder to find in the local search index.

### Rule 4: Sail-prefixed commands

All shell commands that interact with the application must use the `vendor/bin/sail` prefix. Never document bare `php artisan`, `composer`, `npm`, or `bun` commands — those run against the host machine, not the Docker container, and will fail or produce unexpected results on most contributor setups.

### Rule 5: Contributor tone

Write as if you are explaining to a colleague who is smart but new to this specific project. Explain *why* a configuration exists, not just *what* it is. "Sessions use Redis because the database driver does not support concurrent session reads under high load" is more useful than "Sessions use Redis." Acknowledge that the reader will adapt the pattern to their own context.

### Rule 6: Update docs with the code

When a PR changes a service, driver, port, or significant behavior, the relevant documentation section must be updated in the same PR. Docs written after the fact, from memory, are less accurate and less likely to happen at all.

## Adding a New Section

Follow this process when the 16-section blueprint does not cover something the project needs to document.

1. **Check the blueprint first.** Read each of the 16 sections above. The new content may belong inside an existing section rather than as a standalone page.

2. **Create the directory and index.** New top-level sections live at `docs/<section-name>/index.md`. Use kebab-case. Add YAML frontmatter with `title` and `description` before writing any body content.

3. **Register the section in the sidebar.** Open `docs/.vitepress/config.ts` and add a new entry under `themeConfig.sidebar`. Give it a human-readable `text` label and set `link` to the correct path (e.g., `/deployment/`).

4. **Write from sources.** Open the relevant files (`compose.yaml`, `.env.example`, `config/*.php`, `routes/*.php`) and write content that reflects what is actually there. Do not describe features that have not been implemented yet.

5. **Apply all six rules.** Before opening a PR, verify: source-backed claims, no stand-in text, frontmatter present, `vendor/bin/sail` prefix on every command, contributor tone, and docs updated alongside code.

6. **Update this guide.** If the new section is permanent and belongs in the standard blueprint, add it as a 17th entry here and open a discussion about whether one of the existing 16 should be merged or removed to keep the count meaningful.
