---
title: MCP Servers
description: The MCP servers wired into this project via .mcp.json — what each one does, when to use which, how to combine them, fallback order when a quota runs out, how to export API keys, and how to generate them.
---

# MCP Servers

This project ships with several Model Context Protocol (MCP) servers declared in `.mcp.json` at the repository root. Any Claude Code session opened inside the project picks them up automatically.

`laravel-boost` runs inside the Sail container, `context7` and `tavily` launch locally via `npx`, and `jina` is an HTTP endpoint. All except `laravel-boost` require API keys sourced from your shell environment.

## Server Inventory

| Server          | Transport    | Command / URL                                              | Needs API key?          | Quota model                        |
|-----------------|--------------|-------------------------------------------------------------|-------------------------|------------------------------------|
| `laravel-boost` | stdio (sail) | `vendor/bin/sail artisan boost:mcp`                         | No                      | None — runs locally               |
| `context7`      | stdio (npx)  | `npx -y @upstash/context7-mcp`                              | Yes — `CONTEXT7_API_KEY`| Free tier: monthly request cap     |
| `tavily`        | stdio (npx)  | `npx -y tavily-mcp@latest`                                  | Yes — `TAVILY_API_KEY`  | Free tier: monthly credit balance  |
| `jina`          | http         | `https://mcp.jina.ai/v1`                                    | Yes — `JINA_API_KEY`    | Free tier: monthly token allowance |

### What Each One Provides

- **`laravel-boost`** — Project-specific Laravel tools: `search-docs`, `database-query`, `database-schema`, `browser-logs`, `get-absolute-url`, `application-info`, `last-error`, `tinker`, `read-log-entries`. The only MCP with direct access to this application's runtime state.
- **`context7`** — Version-pinned documentation lookup for libraries, frameworks, SDKs, and CLI tools. Two tools: `resolve-library-id` (find the library) and `query-docs` (fetch snippets). Resolves to a specific major version (`/websites/laravel_13_x`, `/vercel/next.js/15.0.0`, etc.).
- **`tavily`** — Web search optimized for LLM consumption. Five tools: `tavily_search`, `tavily_extract` (URL → clean text), `tavily_crawl` (follow links from a seed URL), `tavily_map` (site map discovery), `tavily_research` (deep multi-step research).
- **`jina`** — Broad web access suite. Search (`search_web`, `search_images`, `search_arxiv`, `search_ssrn`, `search_bibtex`, `search_jina_blog`), URL reading (`read_url`, `parallel_read_url`), screenshots (`capture_screenshot_url`), PDF extraction (`extract_pdf`), classification, reranking, deduplication, query expansion, and a `primer` meta tool.

## When to Use Which Server

Pick the MCP whose scope best matches the task. The default order for any given task is listed below — only fall back when the primary choice is unavailable or returns nothing.

### Task → Primary MCP

| Task                                               | Primary                          | Why                                                       |
|----------------------------------------------------|----------------------------------|-----------------------------------------------------------|
| Laravel / Livewire / Pest / Tailwind / Inertia docs| `laravel-boost/search-docs`      | Version-pinned to this project's installed packages       |
| Inspect DB tables, columns, foreign keys           | `laravel-boost/database-schema`  | Live schema, no guessing                                  |
| Read DB rows (read-only queries)                   | `laravel-boost/database-query`   | Safer than tinker, scoped to read                         |
| Backend exception / stack trace                    | `laravel-boost/last-error`       | Direct access to the framework's last thrown exception    |
| Browser console / JS errors                        | `laravel-boost/browser-logs`     | Reads recent entries from the app's browser log pipeline  |
| Correct project URL (scheme, host, port)           | `laravel-boost/get-absolute-url` | Respects Sail config; avoids hardcoded localhost guesses  |
| Non-Laravel library docs (React, Next, Prisma, etc.)| `context7/query-docs`           | Version-pinned, curated, higher signal than generic search|
| General web search                                 | `tavily/tavily_search`           | Clean LLM-friendly snippets                              |
| Current events, news, time-sensitive queries       | `tavily/tavily_search`           | Freshness controls (`time_range`, `start_date`/`end_date`)|
| Read a specific URL → clean text                   | `jina/read_url`                  | Fast, reader-oriented extraction                          |
| Read many URLs in parallel                         | `jina/parallel_read_url`         | Batches fan-out reads in a single call                    |
| Screenshot a webpage                               | `jina/capture_screenshot_url`    | Only MCP that returns a rendered image                    |
| Extract figures/tables/equations from PDF          | `jina/extract_pdf`               | PDF-aware extraction, no text-only fallback needed        |
| arXiv / SSRN academic paper search                 | `jina/search_arxiv`, `search_ssrn` | Dedicated scholarly endpoints                           |
| BibTeX citation lookup                             | `jina/search_bibtex`             | LaTeX-ready output                                        |
| Crawl a site from a seed URL                       | `tavily/tavily_crawl`            | Designed for multi-page traversal                         |
| Discover site structure / sitemap                  | `tavily/tavily_map`              | Returns link graph, not page content                      |
| Multi-step deep research report                    | `tavily/tavily_research`         | Orchestrates search + read + synthesis server-side        |
| Classify / rerank / deduplicate text or images     | `jina/classify_text`, `sort_by_relevance`, `deduplicate_strings`, `deduplicate_images` | Jina is the only MCP with these |

### Rule of Thumb

- **Is it about this Laravel app?** → `laravel-boost` first.
- **Is it a library / framework API question?** → `context7` first.
- **Is it a general web question?** → `tavily` first for search, `jina` first for reading a specific URL or image/PDF work.
- **Is it scholarly or citation-related?** → `jina` (no Tavily equivalent).

## Combined Usage Patterns

Real tasks often chain several MCPs. Prefer these patterns over single-MCP improvisation.

### Pattern: "Add a feature that uses a third-party library"

1. `laravel-boost/search-docs` — check if Laravel's built-in abstraction already covers it.
2. `context7/resolve-library-id` → `query-docs` — pin the library version and pull API snippets.
3. `laravel-boost/database-schema` — confirm relevant tables before writing migrations.
4. After implementing, `laravel-boost/browser-logs` + `last-error` to verify no regressions.

### Pattern: "Debug a production-ish issue"

1. `laravel-boost/last-error` — backend exception.
2. `laravel-boost/browser-logs` — frontend errors from the same timeframe.
3. `laravel-boost/read-log-entries` — surrounding context in `storage/logs/laravel.log`.
4. `laravel-boost/database-query` — verify data state matches expectation.
5. If a library is suspected: `context7/query-docs` against that library's version.

### Pattern: "Research a topic end-to-end"

1. `tavily/tavily_search` — broad scan of current sources.
2. `jina/read_url` (or `parallel_read_url`) — pull full text from the top results Tavily returned.
3. `jina/search_arxiv` / `search_ssrn` — academic angle if relevant.
4. Optional: `jina/sort_by_relevance` to rerank, `jina/deduplicate_strings` to collapse near-duplicates.

### Pattern: "Verify a claim against primary sources"

1. `tavily/tavily_search` with `include_domains` scoped to the authoritative source.
2. `jina/read_url` on the specific page.
3. Optional: `jina/capture_screenshot_url` if the claim is about visual layout or a dashboard.

### Pattern: "Write a UI component using an unfamiliar library"

1. `context7/resolve-library-id` — pick the right version.
2. `context7/query-docs` — pull component API and examples.
3. `laravel-boost/search-docs` scoped to `tailwindcss` (or your CSS framework) for styling primitives.

## Fallback Priority (Quota Exhaustion)

Free-tier quotas on `context7`, `tavily`, and `jina` are finite. When a call returns a 429, 402, or an auth-flavored rate-limit error, switch to the fallback in order. `laravel-boost` has no quota — it's always available when Sail is running.

### General web search

1. `tavily/tavily_search` (primary — cleaner snippets for LLM use)
2. `jina/search_web` (equivalent surface area, different quota pool)
3. `tavily/tavily_research` (uses credits faster; only if the above fail and the task is research-heavy)

### Reading a single URL's content

1. `jina/read_url` (primary — fast reader-mode extraction)
2. `tavily/tavily_extract` (fallback — similar output, different quota)

### Library / framework documentation

1. `laravel-boost/search-docs` if the package is in this project's `composer.json` or `package.json` that Boost indexes.
2. `context7/query-docs` for everything else with a version pin.
3. `tavily/tavily_search` with `include_domains=["docs.<lib>.com"]` as a last resort.
4. `jina/search_web` + `jina/read_url` against the official docs site if Tavily is also exhausted.

### News / current events

1. `tavily/tavily_search` with `time_range="day"` or `"week"` (built-in freshness).
2. `jina/search_web` with `tbs="qdr:d"` or `tbs="qdr:w"` (Google-style freshness filter).

### Academic / scholarly

No fallback — only `jina` offers `search_arxiv`, `search_ssrn`, and `search_bibtex`. If Jina's quota is exhausted, surface the limitation to the user rather than substituting generic web search.

### Image or PDF work

No fallback — `jina/capture_screenshot_url`, `jina/extract_pdf`, `jina/search_images`, and `jina/deduplicate_images` have no equivalent elsewhere. Same rule: surface the limitation.

### Site crawling / mapping

No direct fallback — `tavily/tavily_crawl` and `tavily/tavily_map` are Tavily-only. As a workaround, `jina/read_url` on a sitemap URL can partially substitute for `tavily_map`.

::: tip Do not silently degrade
When a quota is exhausted and no fallback can produce equivalent output (scholarly search, screenshots, PDF extraction, crawling), tell the user which quota is out and what's blocked — don't substitute a lower-quality tool and pretend the result is the same.
:::

## Exporting API Keys

The three API keys are referenced in `.mcp.json` using `${VAR}` placeholders and are read from your shell environment when Claude Code launches the MCP servers. They **must be exported** from the shell — not just set — so child processes inherit them.

### Bash (`~/.bashrc`)

Add these lines to `~/.bashrc`:

```bash
export CONTEXT7_API_KEY="ctx7sk-..."
export TAVILY_API_KEY="tvly-..."
export JINA_API_KEY="jina_..."
```

Then reload the shell so the current session picks them up:

```bash
source ~/.bashrc
```

### Zsh (`~/.zshrc`)

Same syntax, different file:

```bash
export CONTEXT7_API_KEY="ctx7sk-..."
export TAVILY_API_KEY="tvly-..."
export JINA_API_KEY="jina_..."
```

Reload with `source ~/.zshrc`.

### Fish (`~/.config/fish/config.fish`)

Fish uses a different export syntax:

```fish
set -gx CONTEXT7_API_KEY "ctx7sk-..."
set -gx TAVILY_API_KEY "tvly-..."
set -gx JINA_API_KEY "jina_..."
```

Reload with `source ~/.config/fish/config.fish`.

### Verifying the Keys Are Exported

From the same terminal that will launch Claude Code:

```bash
printenv CONTEXT7_API_KEY TAVILY_API_KEY JINA_API_KEY
```

All three should print values. If any are blank, the `source` step didn't run or the `export` prefix is missing.

::: warning Do not commit keys
`.mcp.json` intentionally uses `${VAR}` placeholders so the file is safe to commit. Never hard-code real key values into `.mcp.json`, `.env`, or any tracked file.
:::

### Running with a Subset of MCPs

All three external MCPs (`context7`, `tavily`, `jina`) are optional. If a key isn't exported, that server simply fails to connect and Claude Code reports it under `/mcp` — the rest continue to work. Sessions that only need `laravel-boost` can skip exporting any key.

## Generating the Keys

Each provider has its own signup flow. Expect to create a free account, confirm email, and copy the key from a dashboard page. Keys typically cannot be re-displayed after creation — store them immediately.

### Context7 (Upstash)

1. Visit **[context7.com/dashboard](https://context7.com/dashboard)** and sign in (GitHub OAuth is the fastest path).
2. Open the **API Keys** section.
3. Click **Create API Key**, name it (for example, `laravel-starter-kit`), and copy the `ctx7sk-...` value.
4. Paste into `~/.bashrc` as `CONTEXT7_API_KEY`.

Free tier is sufficient for individual development use.

### Tavily

1. Visit **[app.tavily.com](https://app.tavily.com/)** and sign up.
2. The dashboard shows a default API key under **API Keys** — or click **Create new key**.
3. Copy the `tvly-...` value.
4. Paste into `~/.bashrc` as `TAVILY_API_KEY`.

Free tier includes a monthly search credit allowance.

### Jina AI

1. Visit **[jina.ai/?sui=apikey](https://jina.ai/?sui=apikey)** (the API key management page).
2. Sign in (email or Google). A key is generated on first login.
3. Copy the `jina_...` value from the dashboard.
4. Paste into `~/.bashrc` as `JINA_API_KEY`.

Free tier includes a monthly token allowance that covers Reader, Search, and Embeddings.

## Verifying the MCP Servers Are Live

After updating keys and reloading your shell, start Claude Code from that terminal and run:

```
/mcp
```

All configured servers should report **connected**. A server stuck in `failed` or `authenticating` usually means the corresponding env var is missing, wrong, or the key has been revoked. A server that's intentionally unused (no key exported) can safely remain disconnected.

For `laravel-boost` specifically, Sail must be running (`vendor/bin/sail up -d`) — the server launches an Artisan command inside the container.

## Troubleshooting

| Symptom                                        | Likely cause                                                | Fix                                                           |
|------------------------------------------------|-------------------------------------------------------------|---------------------------------------------------------------|
| `context7` / `tavily` / `jina` fails to start  | Env var not exported in the shell that launched Claude Code | `source ~/.bashrc`, then restart Claude Code                  |
| `context7` connects but returns auth errors    | Key revoked or typoed                                       | Regenerate in the Context7 dashboard, update `~/.bashrc`      |
| `laravel-boost` fails                          | Sail containers not running                                 | `vendor/bin/sail up -d`                                       |
| `jina` HTTP 401                                | `JINA_API_KEY` empty or malformed                           | Check `printenv JINA_API_KEY`; regenerate if needed           |
| Keys visible in `printenv` but not to MCP      | Claude Code started from a shell that didn't source rc file | Start a fresh terminal, confirm vars, then launch Claude Code |
| 429 / rate-limit on `tavily` or `jina`         | Monthly free-tier quota exhausted                           | Fall back per the priority table above; upgrade plan if recurring |
| `context7` returns empty results               | Library not yet indexed, or wrong `libraryName` casing      | Re-query with the official product name (e.g. `Next.js`, not `nextjs`) |
