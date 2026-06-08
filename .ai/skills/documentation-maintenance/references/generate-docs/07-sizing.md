# §7 — Size, scaling, and fragmentation threshold

- The root file is injected EVERY turn: keep it at ~120-180 lines. Favor dense tables over prose. The
  bulky stuff (long reference, per-domain detail) lives in docs/, read on demand.
- Critical and security rules NEVER move to on-demand: they stay in the root file.
- Do NOT fragment prematurely. While a page fits comfortably and uses only H2/H3, leave it flat. WHEN it
  grows (it would need H4, or mixes clear sub-topics), apply folder-promotion ([§6](06-authoring.md)).
- For a domain with its own code you may additionally place a nested AGENTS.md inside its folder (with
  Claude Code, a nested CLAUDE.md — stub `@AGENTS.md` — loads automatically when working there). That
  would be the domain's canonical file; the catalog in docs/domains/ and the root only link.
- The root file ALWAYS keeps: runtime, essential commands, critical rules, and the "Where to find more"
  table. That is never fragmented.

Next: [§8 output](08-output.md).
