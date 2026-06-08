---
title: Services
description: compose.yaml services and what the application actually uses by default (available vs active).
---

# Services

**Why it exists:** document the infrastructure orchestrated by `compose.yaml` and, above all,
distinguish what is **available** in the development environment from what is **active** per the app
configuration.
**Covers:** database, cache/queue/session, storage, mail, search and broadcasting.
**Does not cover:** middleware bootstrap (see [../architecture/app-bootstrap.md](../architecture/app-bootstrap.md))
or authentication (see [../authentication/index.md](../authentication/index.md)).

## Available vs. active

`compose.yaml` provisions six support services. The app's default configuration (resolved from
`.env.example` and `config/`) **does not use all of them**. This is the real picture:

| Service     | Image                                    | Port(s)     | Default state                                                |
| ----------- | ---------------------------------------- | ----------- | ------------------------------------------------------------ |
| PostgreSQL  | `postgres:18-alpine`                     | 5432        | **Active** — `pgsql` connection.                             |
| Valkey      | `valkey/valkey:alpine`                   | 6379        | Available — the app uses `database` for cache/queue/session. |
| Meilisearch | `getmeili/meilisearch:latest`            | 7700        | Available — Scout is not installed.                          |
| RustFS (S3) | `rustfs/rustfs:latest`                   | 9000 / 9001 | Available — default disk is `local`.                         |
| Mailpit     | `axllent/mailpit:latest`                 | 1025 / 8025 | **Active** in dev — SMTP mailer.                             |
| Soketi      | `quay.io/soketi/soketi:latest-16-alpine` | 6001 / 9601 | Available — default broadcast is `log`.                      |

The ports are the `FORWARD_*`/defaults from `compose.yaml`; they can change via environment variables.

## Sub-pages

| Topic                                       | Link                                                 |
| ------------------------------------------- | ---------------------------------------------------- |
| Database (Postgres, migrations, operations) | [database.md](database.md)                           |
| Cache, queues and sessions                  | [cache-queues-sessions.md](cache-queues-sessions.md) |
| File storage and avatars                    | [storage.md](storage.md)                             |
| Mail                                        | [mail.md](mail.md)                                   |
| Search                                      | [search.md](search.md)                               |
| Broadcasting / WebSockets                   | [broadcasting.md](broadcasting.md)                   |
