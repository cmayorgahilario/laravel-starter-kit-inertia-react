# §4 — Anti-overlap, so docs/ scales without getting confused

- SINGLE SOURCE (golden rule): each fact lives in EXACTLY one canonical file. Everything else (root or
  other docs) LINKS to it, never recopies it. If you find yourself pasting the same thing in two places,
  keep the canonical one and link.
- BOUNDARY PER FOLDER: the "Why it exists / Covers / Does not cover" of the index.md
  ([§3](03-blueprint.md)) IS the boundary contract. Before writing a fact, check which folder it belongs
  to according to those contracts.
- ONE FILE = ONE SUB-TOPIC. Kebab-case, descriptive names. Forbidden: notes.md / misc.md / temp.md and
  any catch-all.
- index.md = NAVIGATION only + the "Why it exists" block ([§3](03-blueprint.md)). It does not duplicate
  its children's content.
- If a fact fits in two sections, it goes in the MOST SPECIFIC one and the other links.
- Keep docs/index.md (and the root's "Where to find more" table) in sync with the folder's reality: when
  creating/moving/deleting a doc, update the indexes and the cross-links.

Next: [§5 page types](05-page-types.md).
