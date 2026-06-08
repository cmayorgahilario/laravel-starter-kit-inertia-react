# §8 — Output and final validation

## Produce

- Canonical AGENTS.md (~120-180 lines) with the skeleton and header of [§2.A](02-architecture.md).
- One-line CLAUDE.md stub: `@AGENTS.md` ([§2.A2](02-architecture.md)).
- docs/ populated ONLY with real stack sections, each page meeting [§3](03-blueprint.md)–
  [§6](06-authoring.md). Do not create pages that would be empty (R2): if a blueprint section does not
  apply yet, omit it or document its absence with a callout (evidence-of-absence) — never a stub.
- docs/index.md as the entry map (overview + verified stack table + quick links).
- docs/meta/structure-guide.md and docs/meta/authoring-guide.md with the [§6](06-authoring.md)
  conventions, written for THIS project.
- By default: clean standalone .md files only (no site generator). (Optional) if a site was requested,
  docs/.vitepress/config.ts with sidebar and local search — VitePress, not Docusaurus.

## Validate before finishing (and fix whatever fails)

- ✓ Every .md under docs/ has valid frontmatter (exactly two `---`).
- ✓ No page uses H4+ nor `---` in the body.
- ✓ Every index.md has its "Why it exists / Covers / Does not cover" block.
- ✓ No broken internal links (each relative path points to an existing .md).
- ✓ CLAUDE.md contains EXACTLY `@AGENTS.md` and nothing else; all the content lives in AGENTS.md.
- ✓ AGENTS.md links to all the top-level sections of docs/ ("Where to find more").
- ✓ No fact is duplicated between two pages (single source); the repetitions are links.
- ✓ Single, consistent language throughout.

## Report

Do not touch the optional inputs (drafts folder or previous documentation). When done, report: which
sections you created, which you omitted as not applicable (with the evidence), which contradictions
between inputs you resolved against the repo, and the result of the validation checklist.

Next: [§9 per-stack](09-per-stack.md).
