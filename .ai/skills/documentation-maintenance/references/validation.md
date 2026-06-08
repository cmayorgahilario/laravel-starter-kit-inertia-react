# Documentation delta and validation

Two things: (1) how to know **what changed** since the last docs review, and (2) the **checklist**
that `AGENTS.md`, `CLAUDE.md`, and `docs/` must meet.

## Delta: what changed and is not yet in the docs

The skill's only script. **Runs only on `develop`** (the integration branch); on any other branch it
aborts with a warning. It compares the current code against the last commit marked as reviewed.

```bash
bash .ai/skills/documentation-maintenance/scripts/docs-delta.sh          # delta since the last --mark
bash .ai/skills/documentation-maintenance/scripts/docs-delta.sh --stat   # with +/- per file
bash .ai/skills/documentation-maintenance/scripts/docs-delta.sh --mark   # marks HEAD as reviewed
```

- State lives in `.ai/skills/documentation-maintenance/.last-doc-commit` (versioned: the team shares the
  reference point). If there is no state, or the saved commit no longer exists (rebase/squash/fresh
  clone), the delta is computed from the start of history.
- The allowed branch is `develop` by default (`INTEGRATION_BRANCH` at the top of the script).
- Pure bash on the HOST: it does not need `sail`.

Restricting the script to `develop` avoids the problem of ephemeral feature branches (hashes that never
reach the base) and of squash/rebase (the marked commit always exists on `develop`). Since features
never touch `.last-doc-commit`, that file never causes merge conflicts. The end-to-end flow (when to
review and when to `--mark`) lives in `SKILL.md` → SYNC mode (single source).

## Validation checklist (manual)

When you finish generating or editing documentation, verify by hand:

| #   | Check                                                                                                  |
| --- | ------------------------------------------------------------------------------------------------------ |
| 1   | `AGENTS.md` exists at the root                                                                         |
| 2   | `CLAUDE.md` contains EXACTLY `@AGENTS.md` (one line, nothing else)                                     |
| 3   | Every `.md` under `docs/` (except `docs/.vitepress/`) has valid frontmatter: exactly two `^---$` lines |
| 4   | No page uses `####` (H4+) — if needed, folder-promotion                                                |
| 5   | No `---` as a horizontal rule in the body (consequence of #3)                                          |
| 6   | Internal relative `.md` links point to an existing file (no dead links)                                |
| 7   | Every `index.md` includes its "Why it exists / Covers / Does not cover" block                          |

The source of truth for these rules is `references/generate-docs/` (§6 authoring and §8 output).
