# §3 — docs/ blueprint, derived from the real stack

Do NOT copy a fixed list. DETECT the stack and DERIVE the sections from the real repo with this
principle:

- one section per real orchestration SERVICE (compose/Dockerfile/k8s): database, cache, queue, search,
  storage, mail, realtime, … (include only the ones that exist);
- one section per cross-cutting LAYER/CAPABILITY, according to the project TYPE. Examples:
    - backend/API: architecture, api/endpoints, authentication, authorization, persistence/ORM,
      background-jobs, testing, deployment, tooling;
    - frontend (Angular/React/Vue): architecture, routing, components, state-management, services/
      data-fetching, styling/theming, build, testing, tooling;
    - library/SDK: getting-started, api-reference, usage/recipes, versioning, testing;
    - CLI: getting-started, commands, configuration, testing;

    include only the implemented layers;

- one domains/ (or modules/) section with a CATALOG of the code's domains/bounded-contexts/modules;
- always: index.md (entry map), getting-started/, and meta/ (conventions).

Rule: each top-level section maps to something REAL in the stack/workflow. Document only what is
implemented (R2). Omit what does not exist; or document its absence with a callout (see
[§6](06-authoring.md), evidence-of-absence).

## Why each folder (mandatory)

The index.md of EACH folder opens by declaring its reason for being, with three lines — this is the
boundary that prevents overlaps:

```text
**Why it exists:** <what this section is for>
**Covers:** <short list of sub-topics>
**Does not cover:** <what seems to fit but goes in another section> → link to that section.
```

structure-guide.md (see [§6](06-authoring.md)) additionally documents WHY that set of sections and in
that order.

## Boundary disambiguation

Resolve the typical clashes; adjust to your stack:

- "capability" vs "domain/module": one section per CAPABILITY (e.g. authentication, queue, search)
  explains HOW that capability works end to end; domains/<x>/ explains the ORGANIZATION of that
  bounded-context/module's code (packages/namespaces, classes/models, boundaries). If a module
  implements a capability (e.g. a Security module that IS the auth), each side documents its angle and
  LINKS to the other; they never repeat the same fact.
- authentication (who you are: login/session/2FA) vs authorization (what you can do: roles/policies/
  permissions).
- testing (conventions and how to run tests, cross-cutting) vs the one-off "how to test X" of a feature
  (lives inside that feature's page, linking to testing/).
- tooling (lint/format/analysis/hooks, local) vs deployment/CI (pipeline and delivery).

When a fact fits in two places: it goes in the MOST SPECIFIC one and the other links (see
[§4](04-anti-overlap.md)).

## Illustrative example

Shows FORM only — replace the sections with those of your real stack:

```text
docs/
  index.md                 # Overview: stack table (service/layer → version, verified) + quick links
  getting-started/index.md # clone, configure environment, build/run, verify health
  architecture/
    index.md               # topology/structure, modules, which config controls what
    app-configuration.md   # what wires up the bootstrap (bootstrap/DI/Startup/root module)
    domain-namespaces.md   # code organization convention ("reference" page type, §5)
  <layers per project type, see principle above>/index.md
  testing/index.md  deployment/index.md
  tooling/{index.md, git-hooks.md, static-analysis.md}
  domains/{index.md, <domain>/index.md}
  meta/{index.md, structure-guide.md, authoring-guide.md}
```

Next: [§4 anti-overlap](04-anti-overlap.md).
