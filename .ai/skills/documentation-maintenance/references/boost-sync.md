# BOOST-SYNC — fold Laravel Boost guidelines into the curated docs

Laravel Boost auto-generates a guidelines block and re-injects it on every `boost:update` (Composer's
`post-update-cmd`), i.e. **every time a dependency is installed/updated**. The block grows with the
dependencies: one `=== <key> rules ===` section per package/topic. Left alone it collides with the
curated documentation system (AGENTS.md + docs/).

This mode keeps the curated docs as the single source of truth: Boost's block is an **input to distill**,
never final documentation.

## One-time setup (already applied in this repo)

- `config/boost.php` → `agents.*.guidelines_path` redirects every agent's guidelines to a single
  dedicated file: `.ai/boost-guidelines.md`.
- That file is **gitignored**.
- `CLAUDE.md` stays the one-line `@AGENTS.md` stub; `AGENTS.md` stays curated (no Boost block).

If a future Boost version writes the block into the root files anyway, restore the redirect and re-run
this mode.

## State (for incremental, token-cheap runs)

State lives in `.ai/skills/documentation-maintenance/.boost-state.json`:

```json
{
    "sections": {
        "<key> rules": {
            "hash": "<sha256-of-section-body>",
            "decision": "integrated|discarded",
            "where": "docs/... or AGENTS.md",
            "why": "short reason"
        }
    }
}
```

The hash makes runs cheap: only sections whose hash changed (or new sections) are read in full and
re-evaluated. Unchanged sections are skipped. Discarded sections are not re-evaluated unless their hash
changes.

## Flow

1. **Locate & split.** Read `.ai/boost-guidelines.md`. Confirm it is wrapped in
   `<laravel-boost-guidelines>…</laravel-boost-guidelines>`. Split the body by the `=== <key> rules ===`
   headers into sections.
2. **Diff.** For each section compute the SHA-256 of its body and compare with `.boost-state.json`.
   Process only **new or changed** sections. (Use the helper:
   `bash .ai/skills/documentation-maintenance/scripts/boost-delta.sh`.) **Idempotence guard: if the
   delta is empty, report "no changes" and STOP — do not write any file, not even `.boost-state.json`.**
3. **Distill each new/changed section.** Decide per fact:
    - **Integrate** if it is a concrete rule/command/convention/tool that is **useful here and not yet
      documented** → put it in its canonical page (`docs/...` for detail, `AGENTS.md` only if it is a
      first-turn essential), citing it came from Boost. Then record `decision: integrated` + `where`.
    - **Discard** if it is generic framework guidance already covered by a Boost skill
      (`laravel-best-practices`, `pest-testing`, etc.), already documented (Sail, Wayfinder, useHttp,
      Laravel Cloud, the stack table), or pure style enforced by Pint/PHPStan/Rector. Record
      `decision: discarded` + `why`.
4. **Never duplicate.** A fact integrated once must not be copied again; other pages link to it
   (single-source rule from §4 of `generate-docs/`).
5. **Keep the curated files clean.** Do not paste the Boost block into AGENTS.md/CLAUDE.md.
6. **Update state.** Write the new hashes + decisions to `.boost-state.json`.
7. **Validate.** Run VALIDATE mode (frontmatter, no H4/`---`, no dead links, CLAUDE.md == `@AGENTS.md`).

## What "important and not yet documented" means here

Bias toward integrating: specific MCP tools, project-specific commands/flags, version-specific gotchas,
and rules that change how an agent should act in THIS repo. Bias toward discarding: generic language
tutorials, code style covered by the formatters, and anything a listed skill already owns.

## When to run

- After `composer require`/`update` (the block just changed).
- As part of SYNC mode when `docs-delta.sh` shows dependency changes.
