---
title: Documentation conventions
description: The rules that govern this documentation system — structure and authoring guides.
---

# Documentation conventions

**Why it exists:** be the meta-section that documents how this documentation is built and maintained, so
it stays consistent and useful as the project grows.
**Covers:** the section blueprint (structure) and the writing rules (authoring).
**Does not cover:** the project's own content — that is the rest of `docs/` (start at
[../index.md](../index.md)).

## Sub-pages

| Topic                                                        | Link                                     |
| ------------------------------------------------------------ | ---------------------------------------- |
| Section blueprint and why each section exists                | [structure-guide.md](structure-guide.md) |
| Authoring rules (frontmatter, source-first, headings, links) | [authoring-guide.md](authoring-guide.md) |

## The system in one paragraph

`AGENTS.md` is the canonical, minimal root file read on every turn; `CLAUDE.md` is a one-line stub that
imports it (`@AGENTS.md`). All the detail lives in `docs/`, organized by blueprint and read on demand.
Each fact lives in exactly one canonical page; everything else links to it. The source of truth is
always the repository code.
