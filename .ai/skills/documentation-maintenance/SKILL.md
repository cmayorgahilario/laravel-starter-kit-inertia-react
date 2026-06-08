---
name: documentation-maintenance
description: 'Generates and maintains the project documentation system: the canonical AGENTS.md (minimal agent root file), the CLAUDE.md stub (@AGENTS.md), and the docs/ folder. Use it in INIT mode when the whole documentation must be created from scratch, and in SYNC mode when code changed and AGENTS.md and/or docs/ must be updated to keep mirroring the repo. Use BOOST-SYNC mode after installing/updating a Composer dependency, when Laravel Boost re-injects its auto-generated <laravel-boost-guidelines> block: distill what is new and important into AGENTS.md/docs and keep the curated files clean. Trigger it when the user says "generate/create/update/sync the documentation", "update AGENTS.md or docs", "the docs are stale", "document this project", "the boost guidelines changed/grew", or after changes to services, commands, architecture, dependencies, routes, or conventions that leave the docs out of date. It also covers validating that the docs follow the conventions (frontmatter, no H4/---, no dead links, single source of truth). Stack-agnostic: works for Laravel, Spring/Java, .NET, Angular/Node, Python, Go, etc.'
license: MIT
metadata:
    author: project
---

# Documentation Maintenance

Maintains the agent documentation system of this (or any) project:

- **`AGENTS.md`** — canonical, minimal root file (~120-180 lines), agent-agnostic.
- **`CLAUDE.md`** — one-line stub: `@AGENTS.md` (so Claude Code loads the canonical file).
- **`docs/`** — the full blueprint-organized reference, read on demand.
- **`docs/meta/`** — the authoring conventions that govern the docs themselves.

The full specification (structure, blueprint, anti-overlap, page types, conventions, per-stack
adaptation) lives in `references/generate-docs/` — one file per section (§0–§9), starting at
`references/generate-docs/index.md`. **Always read it before generating or editing documentation** — it
is the source of truth for this system.

## When to use each mode

- **INIT** — `AGENTS.md`/`docs/` do not exist, or must be regenerated from scratch.
- **SYNC** — they already exist and the code changed; update what is affected without rewriting everything.
- **BOOST-SYNC** — a dependency was installed/updated and Laravel Boost regenerated its
  `<laravel-boost-guidelines>` block; distill the new/important parts into the curated docs.
- **VALIDATE** — only check that the docs follow the conventions (manual checklist).

## INIT mode

1. Read `references/generate-docs/index.md` and its sections (§0–§9) in order.
2. Follow that spec to the letter: detect the stack by reading the repo, derive the blueprint, and
   generate `AGENTS.md` + `CLAUDE.md` (stub `@AGENTS.md`) + `docs/` + `docs/meta/`.
3. The source of truth is ALWAYS the repo code; verify every fact against the real file.
4. When done, run VALIDATE mode and fix whatever fails.

## SYNC mode

To keep the docs aligned after code changes:

1. Read `references/generate-docs/` (the conventions apply just the same when editing).
2. Compute what changed **on `develop`**: `bash .ai/skills/documentation-maintenance/scripts/docs-delta.sh`
   (the script only runs on `develop`; the first time, the delta is from the start of the repo).
   **Idempotence guard: if the delta is empty, report "no changes — docs already in sync" and STOP. Do
   not touch any file (not even `--mark`).** Otherwise, map each code file to the `docs/` page that
   documents it (use the blueprint and the "Why it exists / Covers / Does not cover" blocks of each
   `index.md` to locate the canonical doc).
3. For each affected fact (a port, a command, a driver, a route, a convention, a dependency version, a
   new/removed service): update **only** the canonical page where that fact lives (single source). Its
   mentions in other pages are links, not copies — do not duplicate them.
4. If a new capability/service/domain appears: add its section following the blueprint and the correct
   page type (§5 of the prompt). If something was removed: delete its doc and the links pointing to it.
5. Reflect in `AGENTS.md` only the first-turn essentials (runtime, essential commands, critical rules,
   "Where to find more" table). The detail goes to `docs/`.
6. Honor R6: the docs update ships in the SAME change as the code.
7. When done, run VALIDATE mode and fix whatever fails.
8. Mark the review point (while on `develop`):
   `bash .ai/skills/documentation-maintenance/scripts/docs-delta.sh --mark`. The script only runs on
   `develop`; on feature branches it aborts (see `references/validation.md` → "Recommended flow").

## BOOST-SYNC mode

Laravel Boost auto-generates a `<laravel-boost-guidelines>` block and re-injects it on every
`boost:update` (Composer's `post-update-cmd`), so it changes whenever a dependency is installed/updated
and **grows with the dependencies** (one `=== <key> rules ===` section per package/topic). It is an
input to distill, never final documentation.

1. Read `references/boost-sync.md` (the full flow, the redirect setup and the state format) and
   `references/generate-docs/` (the authoring conventions still apply).
2. Compute which sections are new/changed (incremental, token-cheap):
   `bash .ai/skills/documentation-maintenance/scripts/boost-delta.sh`.
   **Idempotence guard: if the output is empty, report "no changes — Boost guidelines already
   distilled" and STOP. Do not touch any file (not even `.boost-state.json`).** Otherwise, process ONLY
   the listed sections.
3. For each new/changed section, distill: integrate a fact into its canonical page (`docs/...`, or
   `AGENTS.md` if first-turn) only if it is useful here AND not yet documented; otherwise discard it
   (generic framework guidance covered by a Boost skill, already documented, or style enforced by the
   formatters). Keep the curated files clean — never paste the Boost block into AGENTS.md/CLAUDE.md.
4. Update the state with the new hashes + decisions in
   `.ai/skills/documentation-maintenance/.boost-state.json`.
5. When done, run VALIDATE mode and fix whatever fails.

## VALIDATE mode

Manually verify the docs meet the checklist (there is no script: it is direct reading):

- `AGENTS.md` exists and `CLAUDE.md` is exactly `@AGENTS.md` (one line).
- Every `.md` under `docs/` has valid frontmatter (exactly two `---`).
- No page uses H4+ (`####`) nor `---` as a horizontal rule in the body.
- No broken internal `.md` links; every `index.md` has its "Why it exists / Covers / Does not cover" block.

Full criteria in `references/validation.md`; the source of truth is `references/generate-docs/`
(§6 authoring and §8 output).

## Non-negotiable rules (summary — see the prompt for the detail)

- Source-first: every fact verifiable against a repo file; if it cannot be verified, omit it.
- Single source: each fact in ONE canonical file; the rest link, never recopy.
- Only H2/H3 (H4 → folder-promotion). Frontmatter on every page. Commands with the environment runner.
- Single, consistent language (the project's).
