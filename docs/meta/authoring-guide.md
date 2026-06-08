---
title: Authoring guide
description: Frontmatter, source-first, headings, internal links and folder-promotion rules.
---

# Authoring guide

## Overview

These are the non-negotiable rules for writing any page under `docs/`. They keep the docs accurate,
single-sourced and easy for both agents and humans to read.

## Non-negotiable rules

- **Source-first.** Every technical fact must be verifiable against a repo file. Cite it in backticks
  (use `file:line` for a concrete line). If something cannot be verified, omit it — speculation is worse
  than a gap.
- **No filler.** No stubs, TODO/WIP markers or dummy prose. A page that is not ready must not exist.
- **Single source.** Each fact lives in exactly one canonical page; everywhere else links to it. Never
  paste the same fact in two places.
- **Commands with the runner.** This project runs through Sail, so every command is written with its
  prefix: `./vendor/bin/sail …`.
- **Colleague tone.** Write for someone capable but new to this project; explain the why, not just the
  what.
- **Docs alongside code.** When a change touches a service/route/behavior, update its doc in the same
  change. The language for all docs is **English**.

## Format conventions

- **Frontmatter on every page.** Exactly two `---` lines (open and close) with at least `title`
  (< 60 chars) and a specific `description`.
- **Headings: only `##` (H2) and `###` (H3).** H4+ is forbidden. If you need more nesting, promote the
  page to a folder with sub-pages.
- **No `---` as a horizontal rule** in the body (it would collide with the frontmatter). Use `***` if
  you ever need a visual separator.
- **Internal links** are relative paths to real `.md` files (e.g. `../services/index.md`). After moving
  or renaming a page, grep and update every link.
- **Evidence of absence.** To document something the project does not have yet, do not silently omit it:
  use a `> [!WARNING]` callout that cites the reviewed paths, so the gap looks intentional and verified
  (see `../services/search.md` and `../services/broadcasting.md`).

## Folder-promotion

When a flat page grows beyond comfortable H2/H3 nesting:

1. `git mv docs/x.md docs/x/index.md` (preserves history).
2. Create the sub-pages, each with its own frontmatter and (for the new `index.md`) the "Why it exists"
   block.
3. Update all cross-links to the old path (grep first).

## Validation

Before finishing any docs change, verify: valid frontmatter everywhere, no H4+ or body `---`, every
`index.md` has its "Why it exists / Covers / Does not cover" block, no broken internal links, `CLAUDE.md`
is exactly `@AGENTS.md`, and no fact is duplicated across pages.
