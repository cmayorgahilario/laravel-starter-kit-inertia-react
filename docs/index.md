---
title: Laravel Starter Kit documentation
description: Entry map to the project documentation, with the verified stack and quick links.
---

# Laravel Starter Kit documentation

Full project reference, organized by section and meant to be read on demand. The first-turn summary
lives in `../AGENTS.md`; the detail is here. The source of truth is always the repository code.

Laravel Starter Kit is a **Laravel 13 / PHP 8.5** application with a **Filament 5** admin panel and an
**Inertia.js v3 + React 19 + TypeScript** SPA. Authentication runs on **Fortify + Sanctum**, with 2FA
(TOTP) and passkeys (WebAuthn). The whole development environment is orchestrated with **Laravel Sail**
(Docker).

## Verified stack

| Layer / Service     | Technology             | Version                 | Verified in                       |
| ------------------- | ---------------------- | ----------------------- | --------------------------------- |
| Language            | PHP                    | `^8.5`                  | `composer.json`                   |
| Framework           | Laravel                | `^13.8`                 | `composer.json`                   |
| Admin panel         | Filament               | `^5.0`                  | `composer.json`                   |
| Auth backend        | Laravel Fortify        | `^1.37`                 | `composer.json`                   |
| API tokens / SPA    | Laravel Sanctum        | `^4.0`                  | `composer.json`                   |
| Passkeys (WebAuthn) | `@laravel/passkeys`    | `^0.2.0`                | `package.json`                    |
| Typed routes        | Laravel Wayfinder      | `^0.1.20`               | `composer.json`                   |
| Frontend            | Inertia.js + React     | `^3.3.1` / `^19.2.7`    | `package.json`                    |
| UI                  | shadcn/ui on Base UI   | `@base-ui/react ^1.5.0` | `package.json`, `components.json` |
| Styling             | Tailwind CSS           | `^4.3.0`                | `package.json`                    |
| Build               | Vite                   | `^8.0.0`                | `package.json`, `vite.config.ts`  |
| Database            | PostgreSQL             | `18-alpine`             | `compose.yaml`                    |
| Cache / Valkey      | `valkey/valkey:alpine` | latest                  | `compose.yaml`                    |
| Search              | Meilisearch            | latest                  | `compose.yaml`                    |
| S3 storage          | RustFS                 | latest                  | `compose.yaml`                    |
| Mail (dev)          | Mailpit                | latest                  | `compose.yaml`                    |
| WebSockets          | Soketi                 | `latest-16-alpine`      | `compose.yaml`                    |
| Tests               | Pest                   | `^4.7`                  | `composer.json`                   |
| Local runtime       | Laravel Sail           | `^1.62`                 | `composer.json`                   |

> [!NOTE]
> `compose.yaml` provisions all the services above, but the app does not use all of them by default:
> cache, queue and session go to `database`; the disk is `local`; broadcast is `log`; and Scout is not
> installed. The "available vs. active" caveats are in `services/index.md`.

## Sections

| Section                                                   | What it covers                                                                      |
| --------------------------------------------------------- | ----------------------------------------------------------------------------------- |
| [getting-started](getting-started/index.md)               | Clone, configure the environment and start the app with Sail.                       |
| [architecture](architecture/index.md)                     | Topology, bootstrap, providers, middleware and code organization.                   |
| [services](services/index.md)                             | `compose.yaml` services: DB, cache/queue/session, storage, mail, search, broadcast. |
| [authentication](authentication/index.md)                 | Fortify, Sanctum, 2FA, passkeys and the security actions.                           |
| [admin-panel](admin-panel/index.md)                       | The Filament panel at `/admin` and its resources.                                   |
| [frontend](frontend/index.md)                             | The Inertia + React SPA: structure, routing, UI and styling.                        |
| [testing](testing/index.md)                               | Pest: suites, helpers, commands and test organization.                              |
| [tooling](tooling/index.md)                               | Git hooks and local quality tooling.                                                |
| [continuous-integration](continuous-integration/index.md) | The GitHub Actions workflows.                                                       |
| [ai-tooling](ai-tooling/index.md)                         | Laravel Boost, the MCP server and the skills.                                       |
| [domains](domains/index.md)                               | Catalog of the code's bounded-contexts.                                             |
| [meta](meta/index.md)                                     | Conventions that govern this documentation.                                         |
