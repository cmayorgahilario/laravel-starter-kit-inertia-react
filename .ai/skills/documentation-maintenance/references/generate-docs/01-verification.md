# §1 — Verification (mandatory, before writing any fact)

- Cross-check every non-trivial statement against the real file. Depending on the stack, that includes:
  dependency manifests (package.json, composer.json, pom.xml, build.gradle, _.csproj/_.sln, go.mod,
  pyproject.toml/requirements.txt, Cargo.toml, Gemfile, angular.json…), orchestration
  (compose.yaml/Dockerfile/k8s manifests), git hooks and CI config, environment variables
  (.env.example, appsettings.json…), app config and bootstrap (bootstrap/DI/providers/Startup/main/root
  module), route/endpoint definitions, and lint/format/analysis/test configs.
- When two inputs contradict each other (queue/cache defaults, package manager, ports, drivers), resolve
  by looking at the repo and document ONLY what is verified.
- If something cannot be verified, OMIT it. Do not invent "Common Tasks", "Tips", or "Support".

Next: [§2 architecture](02-architecture.md).
