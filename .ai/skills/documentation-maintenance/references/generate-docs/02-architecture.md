# §2 — Docs system architecture (which files you produce)

## A) AGENTS.md (canonical root file)

The MINIMAL first-turn file. Only what an agent must apply from turn 1; everything else is delegated to
docs/ by link. Target: ~120-180 lines. SUMMARIZE AND LINK: never duplicate the docs/ detail here; put
the essentials and a pointer.

HEADER: open with an H1 `# Agent Brief` and a first line stating it is the minimal summary for AI agents
and that all the detail lives in docs/.

FIXED SKELETON (these H2s, in this order):

- `## Runtime / Environment` — how EVERYTHING runs (e.g. Docker/Sail) and the non-negotiable command
  prefix rule. Link to docs/getting-started/ and docs/architecture/.
- `## Essential commands` — dev/build, tests (incl. how to run ONE test), lint/format/analysis. Dense
  tables. Link to the detail in docs/.
- `## Critical rules` — what must NOT be forgotten, inline even if it costs tokens: do not edit generated
  code, domain boundaries, mandatory hooks, security conventions. One line per rule + link.
- `## (Optional) Tooling / MCP / skills` — only if it applies and is first-turn.
- `## Where to find more` — table (Topic → docs/... path), and "start with docs/index.md".

## A2) CLAUDE.md (stub)

A one-line file whose entire content is:

```text
@AGENTS.md
```

No H1, no frontmatter, nothing else. It makes Claude Code load the canonical AGENTS.md. Do not duplicate
content here.

## B) docs/

The full reference, organized by a BLUEPRINT (see [§3](03-blueprint.md)). Read on demand.

> [!WARNING]
> Do NOT use @import to pull the docs/ detail into the root file: it would load entirely every turn and
> kill the savings. Reference the docs by PATH in plain text (on-demand reading). The ONLY exception to
> @import is the CLAUDE.md stub → @AGENTS.md (A2): there you import the minimal root file itself, which
> you want loaded always anyway; that is deduplication, not loading detail.

## C) docs/meta/

The conventions that govern the docs themselves (see [§6](06-authoring.md)): structure-guide.md and
authoring-guide.md. These REPLACE any "how to maintain this document" section of the root file.

## D) docs/ format

By DEFAULT, clean standalone .md files organized in folders. It is optimal when the primary consumer is
AI agents (they read the raw file, no noise), zero dependencies, zero build, git-friendly, and renders
on GitHub. Do NOT set up a site generator unless the repo already uses one or the user asks for it.

(Optional) If a human-navigable site is also wanted (search, sidebar): use VitePress, NOT Docusaurus.
VitePress is markdown-first and sits ON TOP of the same .md files without altering them, so the agent
keeps reading clean files; Docusaurus pushes toward MDX (JSX embedded in the .md), which pollutes
reading by agents. In any case the site is a DECOUPLED layer: it never forces polluting the markdown nor
adding non-portable syntax. Keep the .md files valid on their own.

Next: [§3 blueprint](03-blueprint.md).
