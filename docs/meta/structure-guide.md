---
title: Structure guide
description: The section blueprint of docs/, why each section exists and how to add a new one.
---

# Structure guide

## Overview

`docs/` is organized by a blueprint derived from the real stack: one section per real orchestration
service, one section per cross-cutting capability/layer, plus a domain catalog and this meta-section.
Each top-level section maps to something that actually exists in the repository.

## The sections and why

| Section                   | Why it exists                                                                    |
| ------------------------- | -------------------------------------------------------------------------------- |
| `getting-started/`        | The first thing a newcomer needs: get it running.                                |
| `architecture/`           | How the app is wired (bootstrap, providers, middleware) and organized (domains). |
| `services/`               | One page per `compose.yaml` service, with the "available vs active" truth.       |
| `authentication/`         | Identity is a large, central capability (Fortify/Sanctum/2FA/passkeys).          |
| `admin-panel/`            | Filament is a separate UI surface with its own rules.                            |
| `frontend/`               | The Inertia + React SPA is large enough to warrant its own section.              |
| `testing/`                | Cross-cutting test conventions and commands.                                     |
| `tooling/`                | Local quality tooling and git hooks.                                             |
| `continuous-integration/` | The cloud pipeline and deployment.                                               |
| `ai-tooling/`             | The Boost/MCP integration shipped with the repo.                                 |
| `domains/`                | Catalog of bounded-contexts (the business map).                                  |
| `meta/`                   | These conventions.                                                               |

## Boundaries

Each `index.md` opens with a "Why it exists / Covers / Does not cover" block. That block is the boundary
contract: before writing a fact, decide which section owns it. When a fact fits two sections, it goes in
the most specific one and the other links.

Notable boundaries in this project:

- `authentication/` (who you are) vs `admin-panel/` access gate (a specific authorization rule, kept
  with the panel it guards).
- `tooling/` (local hooks + quality) vs `continuous-integration/` (the cloud pipeline that re-runs the
  same tools).
- `services/` documents a service's role and config; a capability that uses it (e.g. sessions feeding
  "active sessions") links across.

## Adding a new section

1. Confirm it maps to something real in the repo (a new service, layer or domain).
2. Create `docs/<section>/index.md` with the "Why it exists / Covers / Does not cover" block and a
   navigation table.
3. Add the section to `docs/index.md` and to `AGENTS.md` → "Where to find more".
4. Follow the [authoring-guide.md](authoring-guide.md) for every page.
