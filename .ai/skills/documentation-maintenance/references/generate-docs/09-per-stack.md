# §9 — Per-stack adaptation

This spec works for **any** stack — not just the four below. The whole system is stack-agnostic: the
sections you produce come from DETECTING the repo, not from a fixed list. The table here is just a
**sample** of four common ecosystems to show how generic concepts map; a stack that is not in it is
equally supported.

## How to map any stack (the actual method)

1. **Detect** the stack by its dependency manifest and build/CI files (see [§1](01-verification.md)).
2. **Translate** each generic concept (command runner, scaffolding, bootstrap, routes, persistence,
   tests, lint) to that ecosystem's real tool, verifying against the repo.
3. **Derive** the blueprint ([§3](03-blueprint.md)) from the real services and layers you find — never
   from this table.

## Sample mapping (not exhaustive)

```text
Generic concept     | Laravel/PHP      | Spring/Java        | ASP.NET/C#         | Angular/Node
--------------------|------------------|--------------------|--------------------|------------------
Deps manifest       | composer.json    | pom.xml/build.gradle| *.csproj/*.sln    | package.json
Command runner      | artisan / sail   | ./gradlew / mvn    | dotnet             | npm/pnpm/ng
Scaffolding         | artisan make:    | spring init / gen  | dotnet new         | ng generate / nest g
Bootstrap/config    | providers/bootstrap| @Configuration/main| Program/Startup   | main.ts/root module
Routes/endpoints    | routes/*.php     | @RestController     | Controllers/Minimal| *-routing.module / router
ORM/persistence     | Eloquent         | JPA/Hibernate      | EF Core            | (API) / Prisma/TypeORM
Code organization   | namespaces/Models| packages/classes   | namespaces/classes | modules/components/services
Tests               | Pest/PHPUnit     | JUnit              | xUnit/NUnit        | Jest/Vitest/Karma
Lint/format         | Pint/PHPStan     | Checkstyle/SpotBugs | dotnet format/analyzers| ESLint/Prettier
```

## Stack not in the table?

Apply the same method. Identify the manifest, then map the concepts. A few more ecosystems as a starting
point (verify against the real repo):

- **Python** — manifest `pyproject.toml`/`requirements.txt`; runner `poetry`/`uv`/`pip` + `manage.py`
  (Django) or `uvicorn` (FastAPI); tests `pytest`; lint `ruff`/`mypy`.
- **Go** — manifest `go.mod`; runner `go` (`go run`/`go test`/`go generate`); tests `go test`; lint
  `golangci-lint`.
- **Rust** — manifest `Cargo.toml`; runner `cargo`; tests `cargo test`; lint `clippy`/`rustfmt`.
- **Ruby/Rails** — manifest `Gemfile`; runner `bundle`/`rails`; scaffolding `rails g`; tests
  `RSpec`/`Minitest`; lint `RuboCop`.
- **Node/Nest/Express** — manifest `package.json`; runner `npm`/`pnpm`/`nest`; scaffolding `nest g`;
  tests `Jest`/`Vitest`; lint `ESLint`/`Prettier`.

For frontends (Angular/React/Vue) the typical LAYERS are not "backend services" but: routing,
components, state-management, services/data-fetching, styling/theming, build, testing. For libraries:
api-reference + usage/recipes + versioning. Adjust the blueprint ([§3](03-blueprint.md)) to whatever the
repo really is.

Back to [index](index.md).
