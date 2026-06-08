---
title: Domains
description: Catalog of the code's bounded-contexts. Today there is a single domain, Security.
---

# Domains

**Why it exists:** be the catalog of the application's bounded-contexts — the high-level map of "what
business areas exist" and where their code lives.
**Covers:** the list of domains and a link to each domain's detail.
**Does not cover:** the naming/organization convention itself (see
[../architecture/code-organization.md](../architecture/code-organization.md)) or how authentication
works (see [../authentication/index.md](../authentication/index.md)).

## Catalog

| Domain   | Namespace        | Table prefix | Detail                     |
| -------- | ---------------- | ------------ | -------------------------- |
| Security | `App\…\Security` | `security_`  | [security.md](security.md) |

> [!NOTE]
> There is currently a single domain. As the application grows, add one row per new bounded-context and
> a matching detail page, following [../architecture/code-organization.md](../architecture/code-organization.md).
