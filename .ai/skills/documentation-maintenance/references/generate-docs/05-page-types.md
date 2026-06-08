# §5 — Page types and their mold

Not all pages are the same. Choose the mold by page type. All carry frontmatter ([§6](06-authoring.md))
and start with an # H1.

## (a) Index / overview (every index.md)

- "Why it exists / Covers / Does not cover" block ([§3](03-blueprint.md)).
- Navigation table to its sub-pages (Topic → link + one line of scope).
- For the root docs/index.md: additionally a verified stack table + quick links.
- No detail content of its own (that lives in the children).

## (b) Guide / walkthrough (getting-started, deployment, a step-by-step flow)

- `## Overview` (what this guide achieves and prerequisites).
- Numbered actionable steps, each command with its environment prefix and its expected result.
- `## Troubleshooting` / Health check when applicable.

## (c) Reference / convention (domains, namespaces, a capability, a subsystem)

- `## Overview` — what it is and why it exists.
- `## Naming rules / Tables` — conventions in TABLES (concern → convention → example).
- `## Worked example` — a REAL example from the repo (real code with its path cited), not hypothetical
  User/Post. Each block followed by "Key points:" in bullets.
- `## Adding a new X` — numbered steps to extend, with the EXACT framework scaffolding commands (e.g.
  artisan make / ng generate / dotnet new / spring init / rails g / nest g / go generate, whichever
  applies) and the greps to update the affected import sites.
- `## What NOT to do` — the counterpart: what NOT to touch and why (table + rationale).

In all types: explain the WHY, not just the what. Cite decisions if the project tracks them.

Next: [§6 authoring](06-authoring.md).
