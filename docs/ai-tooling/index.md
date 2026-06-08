---
title: AI tooling
description: Laravel Boost, the MCP server and the skills configured for AI agents in this repo.
---

# AI tooling

**Why it exists:** document the AI-assistant integration shipped with the repo — Laravel Boost, the MCP
server and the skills — so agents and humans know what is available.
**Covers:** `boost.json`, `.mcp.json`/`opencode.json`, the MCP server command and the configured skills.
**Does not cover:** the documentation system itself (see [../meta/index.md](../meta/index.md)).

## Overview

The project ships with **Laravel Boost** (`laravel/boost`, dev dependency), which exposes a Model
Context Protocol (MCP) server. Agents can use it for semantic documentation search, database schema
introspection and log access — all through Sail.

## MCP server

The MCP server is declared identically in `.mcp.json` (Claude Code) and `opencode.json` (OpenCode):

```json
{
    "command": "vendor/bin/sail",
    "args": ["artisan", "boost:mcp"]
}
```

So the server runs inside Sail (`./vendor/bin/sail artisan boost:mcp`), consistent with the rest of the
project's command convention.

## MCP tools

The Boost MCP server exposes tools that agents should prefer over manual shell commands or raw SQL:

| Tool               | Use                                                                                                                                         |
| ------------------ | ------------------------------------------------------------------------------------------------------------------------------------------- |
| `search-docs`      | Version-specific docs for the installed packages. Use it **before** code changes; pass a `packages` array to scope and broad topic queries. |
| `database-query`   | Run read-only queries instead of raw SQL in tinker.                                                                                         |
| `database-schema`  | Inspect table structure before writing migrations or models.                                                                                |
| `get-absolute-url` | Resolve the correct scheme/domain/port for a project URL before sharing it.                                                                 |
| `browser-logs`     | Read recent browser logs, errors and exceptions.                                                                                            |

> [!NOTE]
> These guidelines come from Laravel Boost's auto-generated block. That block is redirected out of the
> curated files — see [Auto-generated guidelines](#auto-generated-guidelines) below.

## Boost configuration

`boost.json` configures Boost:

| Key      | Value                                       |
| -------- | ------------------------------------------- |
| Agents   | `junie`, `claude_code`, `codex`, `opencode` |
| MCP      | enabled                                     |
| Sail     | `true` (commands run through Sail)          |
| Packages | `filament/filament`                         |

## Skills

`boost.json` lists the skills relevant to this stack, which agents can use:

- `fortify-development`
- `laravel-best-practices`
- `wayfinder-development`
- `pest-testing`
- `inertia-react-development`
- `tailwindcss-development`
- `documentation-maintenance`

The skill definitions live under the per-agent skill folders (`.claude/`, `.junie/`, `.codex/`,
`.agents/`).

## Auto-generated guidelines

Boost auto-generates a guidelines block (wrapped in `<laravel-boost-guidelines>…</laravel-boost-guidelines>`)
on every `boost:update` — which Composer runs via `post-update-cmd`, i.e. **every time a dependency is
installed or updated**. The block grows as packages are added (one `=== <key> rules ===` section per
package/topic).

By default Boost writes that block into each agent's root file (`CLAUDE.md`, `AGENTS.md`), which would
collide with this curated documentation system. To keep the curated files clean, every agent's
`guidelines_path` is redirected to a single dedicated, gitignored file:

| Setting         | Value                                           |
| --------------- | ----------------------------------------------- |
| Redirect target | `.ai/boost-guidelines.md`                       |
| Configured in   | `config/boost.php` → `agents.*.guidelines_path` |
| Git             | gitignored (`.gitignore`)                       |

The `documentation-maintenance` skill has a **BOOST-SYNC** mode that reads that file, distills what is
new and important (and not yet documented), folds it into `AGENTS.md`/`docs/`, and ignores the generic
or already-covered guidance. It works incrementally per `=== <key> rules ===` section, so a growing
block does not mean reprocessing everything. See
`.ai/skills/documentation-maintenance/references/boost-sync.md`.

> [!WARNING]
> Do not paste the Boost block back into `AGENTS.md` or `CLAUDE.md`, and keep `CLAUDE.md` as the
> one-line `@AGENTS.md` stub. If a future Boost version re-injects the block into the root files anyway,
> re-run the redirect (the `config/boost.php` setting) and BOOST-SYNC.
