# §6 — Authoring conventions

Write these in docs/meta/ and HONOR them when generating.

- structure-guide.md documents: the section blueprint (what each covers and WHY that set and that
  order), the writing rules, and the process for adding a new section.
- authoring-guide.md documents: frontmatter, source-first, headings, internal links, and
  folder-promotion.

## Non-negotiable rules

Apply them to EVERY doc you generate:

- **R1. SOURCE-FIRST.** Every technical fact is verifiable against a repo file. Cite it in backticks; use
  `file:line` when the fact is on a concrete line. Speculating is worse than a gap.
- **R2. NO FILLER TEXT.** No stubs, dummy prose, or "TODO/WIP" markers. A page that is not ready must not
  exist. Write real content or do not create the page.
- **R3. FRONTMATTER ON EVERY PAGE.** Every .md under docs/ (except a site generator's config) opens with
  YAML with at least title and description. Mechanical invariant: EXACTLY two lines that are `---` alone
  (open and close). title < 60 chars; specific description.
- **R4. COMMANDS WITH THE ENVIRONMENT PREFIX/RUNNER.** If the project runs behind a wrapper (Docker
  Compose, Sail, devcontainer, Makefile, npm/pnpm scripts, ./gradlew, dotnet, etc.), document the
  commands WITH that exact runner (e.g. `vendor/bin/sail …`, `docker compose run …`, `make …`,
  `./gradlew …`, `npm run …`). Never bare commands if the project is not used that way.
- **R5. COLLEAGUE TONE.** Write for someone capable but new to THIS project. Explain the why of each
  decision, not just the what.
- **R6. DOCS ALONGSIDE THE CODE.** When a change touches a service/driver/port/behavior, its doc is
  updated in the same PR. No documenting from memory afterward.

## Format conventions

- HEADINGS: only ## (H2) and ### (H3). H4+ FORBIDDEN. If you need more nesting, the page must become a
  folder with sub-pages (folder-promotion).
- INTERNAL LINKS: relative paths between docs (e.g. ../testing/index.md). Link to real .md files (not
  invented anchors). After moving/renaming, update all the links (grep first).
- BAN `---` as a horizontal rule in the body (it collides with the frontmatter; the counter expects
  exactly two `^---$`). If you need a visual separator, use `***`.
- EVIDENCE-OF-ABSENCE: to document something the project does NOT have yet, do not silently omit it. Use
  a PORTABLE GitHub callout (`> [!WARNING]` followed by bullets) that CITES the reviewed paths, so the
  gap looks intentional and verified. (In VitePress, `::: warning` is equivalent; prefer `> [!WARNING]`
  because it looks good raw and rendered.)
- FOLDER-PROMOTION: when a flat file grows, promote it to a folder:
    1. `git mv docs/x.md docs/x/index.md` (preserves history);
    2. create/move sub-pages with their own frontmatter and their "Why it exists" block;
    3. if you use a site generator, update its navigation (e.g. the VitePress sidebar);
    4. update ALL cross-links to the old path (grep before assuming).

Next: [§7 sizing](07-sizing.md).
