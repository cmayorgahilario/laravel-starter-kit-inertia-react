---
title: Authoring Guide
description: How to add pages, edit sections, and respect the writing conventions established in this documentation — frontmatter discipline, source-first facts, heading rules, and the folder-promotion flow.
---

# Authoring Guide

This guide is for contributors who want to add a new page, expand an existing section, or edit prose in `docs/`. It explains the mechanics and conventions that keep the documentation internally consistent and trustworthy. Read it before opening a PR that touches `docs/`.

## Audience and scope

**This guide is for:** anyone adding a new markdown page to `docs/`, editing the content of an existing section, restructuring a flat file into a folder, or updating a page to reflect a code change.

**This guide is not for:** setting up VitePress for the first time, running the local docs preview server, configuring the build pipeline, or deploying the docs site. Those topics belong to future milestones (tracked under R117 and R118) and are intentionally left out here to avoid documenting infrastructure that does not yet exist.

If you are new to the project's documentation structure — what each of the 16 sections covers and why they are ordered the way they are — start with the [Structure Guide](./structure-guide.md) first, then return here.

## Frontmatter discipline

Every `.md` file under `docs/` (excluding anything inside `docs/.vitepress/`) must open with a valid YAML frontmatter block. VitePress uses `title` for the `<title>` tag and `description` for `<meta name="description">`. Without them, pages degrade in both the local search index and external search engines.

The invariant is mechanical: a file must contain **exactly two** lines that are `---` alone on the line — one opening the block and one closing it. An automated check enforces this across all committed docs files.

**Correct** — both required fields present:

    title: Queue & Jobs
    description: Redis-backed job queue configuration, dispatching jobs, and running the worker.

(Wrap that block with the opening and closing delimiter lines to form the complete frontmatter block before the H1 heading.)

**Incorrect — missing `description`:** A block that contains only `title` will fail the docs linter. Search engines and VitePress's local index both rely on the description field.

**Incorrect — no frontmatter at all:** A page that opens directly with a heading has no title or description metadata. VitePress falls back to the filename, which is rarely useful as a page title.

Keep `title` short (under 60 characters) and `description` specific enough that it reads well in a search result snippet. Do not copy the H1 verbatim as the title — they can match, but you should consider whether a slightly different phrasing serves the meta tag better.

## Source-first rule

Every technical claim in the docs must be traceable to a file in the repository. If you write that the cache driver is `database`, you must have confirmed `CACHE_STORE=database` in `.env.example`. If you state that Typesense listens on port 8108, confirm it in `compose.yaml`. Speculation — even accurate-sounding speculation — is worse than a gap, because it actively misleads future readers and maintainers.

This convention is captured in D078: cite the source path in backticks. When the claim is tied to a specific line, use the `file:line` form. When the claim covers a section of a file, citing just the path is sufficient.

**Before (speculative):**

> Sessions are stored in Redis for performance reasons.

**After (source-cited):**

> Sessions are stored in Redis (`SESSION_DRIVER=redis` in `.env.example`). The database driver was not chosen because it does not support the concurrent session reads required under load — the rationale is in `config/session.php`.

The discipline pays off during maintenance: when a driver or port changes, a grep for the old value across `docs/` shows every page that needs updating. Vague prose leaves no such trail.

## Heading conventions and the `---` horizontal-rule ban

Use H2 (`##`) and H3 (`###`) to divide a page into sections. Do not use H4 or deeper — if content requires that level of nesting, the page probably should become a folder with sub-pages.

**Never use `---` as a body horizontal rule.** A bare `---` line in a markdown body is visually identical to a YAML frontmatter delimiter. The invariant checker counts `^---$` occurrences and expects exactly two per file. A `---` rule in the body produces a count of three (or more), which will fail the check.

If you genuinely need a visual break between two sections that H2/H3 headings cannot express, use `***` instead — the asterisk rule renders as a horizontal line in VitePress but does not collide with the frontmatter delimiter pattern. This precedent is established in `docs/tooling/developer-tools.md`, where `***` separates the Telescope and IDE Helper sections.

## Evidence-of-absence callouts

When documenting a capability the project has not yet built, do not simply omit the section — document the absence explicitly so readers know the gap is intentional and checked, not overlooked.

Use a VitePress `::: warning` block with a descriptive title and bullet points that cite the paths you checked. This pattern is established in `docs/authorization/index.md` and `docs/deployment/index.md`.

**Example:**

```md
::: warning Search indexing not yet configured

No models implement the `Searchable` trait. The following were checked at HEAD:

- `app/Models/` — no `use Searchable` imports found
- `config/scout.php` — driver set to `typesense` but no indexed models registered

A future milestone will wire up Scout indexing. No model or index schema has been decided yet.

:::
```

The bulleted paths give future contributors a concrete starting point when they return to implement the feature. Without them, "not yet implemented" is just noise.

## Promoting a flat file to a folder

Some sections start as a single flat file (`docs/search.md`) and later grow into a folder with sub-pages (`docs/search/index.md`, `docs/search/indexing.md`). The mechanical steps for this promotion are:

1. **Move the flat file** with `git mv docs/search.md docs/search/index.md`. Git preserves blame history through the rename.

2. **Author or move sub-pages** into the new folder. Each sub-page needs its own frontmatter and must follow all conventions in this guide.

3. **Update `docs/.vitepress/config.ts`** to reflect the new structure. A folder section typically changes from a flat `link` entry to an object with `text`, `items`, and optionally `collapsed`. See the sidebar in `docs/.vitepress/config.ts` for the current pattern.

4. **Update cross-links.** Any page that linked to the old flat path (e.g., `[Search](../search.md)`) must be updated to the new folder path (e.g., `[Search](../search/index.md)`). Grep for the old path across `docs/` before marking the work done.

This flow follows D076 (folder-first structure) and is the same pattern used in S01 when several initially-flat doc files were promoted to directories. The key discipline is step 4 — broken cross-links are silent in development but surface as 404s in the rendered site.
