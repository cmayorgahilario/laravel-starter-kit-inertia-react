# Generate the documentation system (CLAUDE.md / AGENTS.md + docs/)

Reference spec to generate, in any project, a professional-grade documentation system: a canonical,
minimal **`AGENTS.md`** (agnostic — read by Claude Code, Cursor, Copilot, Codex…) that loads every turn

- a one-line **`CLAUDE.md`** that imports it + a navigable **`docs/`** folder with all the detail +
  **`docs/meta/`** with the authoring conventions.

It is modeled on a proven reference system (root file + blueprint-organized `docs/` + meta-guides +
source-first + folder-promotion, with an optional static site on top). Optimized for: zero
hallucination, zero information loss, a small root file, and a `docs/` that scales without overlapping
or getting confused as the project grows.

This spec is split into one file per section. **Read the sections in order**; each is self-contained but
they build on each other. The fixed rules below apply across all of them.

## Reading order

| #   | Section                            | What it covers                                           |
| --- | ---------------------------------- | -------------------------------------------------------- |
| §0  | [sources](00-sources.md)           | Sources and their trust hierarchy                        |
| §1  | [verification](01-verification.md) | Mandatory verification before writing any fact           |
| §2  | [architecture](02-architecture.md) | Which files you produce (AGENTS.md, stub, docs/, format) |
| §3  | [blueprint](03-blueprint.md)       | The docs/ blueprint, derived from the real stack         |
| §4  | [anti-overlap](04-anti-overlap.md) | Keeping docs/ scalable without overlap                   |
| §5  | [page-types](05-page-types.md)     | Page types and their mold                                |
| §6  | [authoring](06-authoring.md)       | Authoring conventions (R1–R6 + format rules)             |
| §7  | [sizing](07-sizing.md)             | Size, scaling, and fragmentation threshold               |
| §8  | [output](08-output.md)             | Output and final validation checklist                    |
| §9  | [per-stack](09-per-stack.md)       | Per-stack adaptation table                               |

## Primary source

The primary source is the repository **code**. Optional inputs (accelerators, not requirements): if a
drafts folder or previous documentation exists, use them **only as a starting point and structure/
convention template, never as a source of facts**. This spec works just as well without them: in that
case generate everything by reading the repo.

## Fixed rule: root file and stub (not a choice)

- AGENTS.md is the ONLY canonical root file, with the whole structure of [§2](02-architecture.md). It is
  agnostic: read by Claude Code, Cursor, Copilot, Codex, etc. Here, "the root file" = AGENTS.md.
- CLAUDE.md is a one-line STUB that imports the canonical file, so Claude Code loads it:

    ```text
    @AGENTS.md
    ```

    (Claude Code import syntax: one `@` + the path. It is NOT `@import`. Nothing else in the file.)

- DO NOT duplicate content: everything lives in AGENTS.md; CLAUDE.md only imports it.

## Fixed rule: language

All documentation (root file + docs/) uses ONE single, consistent language, the project's. If the repo
already documents/comments in a language, respect it; otherwise use English. Do not mix languages within
a page.

## Fixed rule: stack-agnostic

This spec works for ANY project — backend/API (Laravel, Spring/Java, ASP.NET, Express/Nest, Django/
FastAPI, Rails, Go…), frontend (Angular, React, Vue, Svelte…), mobile, CLI, library, or monorepo. Do
NOT assume any framework. First DETECT the stack by reading the repo (dependency manifests, folder
structure, build/CI files) and DERIVE all the documentation from what you find. The concrete names
appearing throughout (Sail, artisan, providers, etc.) are only EXAMPLES of one ecosystem; translate
each concept to the real project's using the table in [§9](09-per-stack.md).
