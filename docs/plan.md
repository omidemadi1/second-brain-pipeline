# Second Brain Workspace — Plan v2

Status: Phase 1 browsing/health UI implemented; agent actions pending the Hermes API server
Owner: Omid
Last updated: 2026-10-22

## 0. Implementation status (2026-10-22)

Built in the dashboard repo:

- vault scanner and audit for both layouts, MOCs, links, and frontmatter health;
- sidebar, library, category and tag filters, live search;
- note reader with source, tags, summary, sections, backlinks, and broken links;
- tags index and issues index with link suggestions and preview-before-apply fixes;
- canvas knowledge graph with pan/zoom, labels, and click-through;
- `Design.md` visual system.

Still to build: category/tag editing, category create/rename/merge, tag merges, Deep Dive, Deep Research, Merge, and the Hermes API proxy. The full-content note format and backfill are still in the pipeline repo.

## 1. What we are building

A private reading and curation workspace for the notes Hermes produces, plus a control surface for running deeper work on them.

Two jobs:

1. **Find, review, and read** — categories → notes → a proper note page with metadata, a personalized summary, and the full rewritten content.
2. **Act on a note** — read the original source, discuss it with the agent, research it further, enrich it, merge it with related notes, and reorganize it.

The dashboard is not a second brain. Hermes builds the brain; this is where you use it.

## 2. Division of labor

| Layer | Owner | Responsibility |
|---|---|---|
| Ingestion | Hermes | Fetch the source, extract it, rewrite it, summarize, tag, categorize, write the note |
| Structure | Dashboard server (deterministic code) | Categories, folders, MOCs, frontmatter, links, merges, archives, git commits |
| Prose | Hermes (via agent jobs) | Deep explanations, research synthesis, merged content, full rewrites |
| Judgment | You | What to read, what to keep, what to merge, what to change |

**Core rule: the agent writes prose, the server writes structure.** The agent never moves files, edits frontmatter, or commits. It returns content; the server validates it, applies it, and commits. This makes destructive operations predictable and reversible.

## 3. What changed from v1

- Deep Dive, Deep Research, and Merge are first-class features, not "later".
- Notes gain a full, topic-organized rewrite in v2 of the note format.
- Categories become manageable: create, rename, merge, and assign.
- Tags become editable in bulk, with duplicate detection.
- The dashboard calls Hermes through its **API server**, not shell commands or Telegram.
- Source content is archived at ingest, so "Read Source" still works when the post is gone.

## 4. Note format v2

Current notes are summaries. The new format adds the rewritten body and provenance.

```markdown
---
title: "Note Title"
source: "https://..."
sources: []                    # merged notes only
source_snapshot: ".sources/<note-id>.md"
source_status: "archived"      # archived | url-only | missing
platform: "youtube"
content_type: "learning"
content_status: "full"         # full | summary-only
date_saved: "2026-08-20T19:52:30+03:30"
date_processed: "2026-08-21"
date_researched: null
category: "AI & Machine Learning"
tags: [...]
rating: "worth-deep-reading"
author: "..."
merged_from: []                # titles of archived originals
merged_at: null
---

## Summary

What it is, its key features, and what it is useful for *to Omid specifically*.
Three to six sentences. No engagement metrics, no filler.

## Full Content

A rewritten, topic-organized explanation of the source in Markdown.
Not a transcript, not a copy. Grouped under `###` headings by subject.
For a YouTube video: one section per topic, in a logical order, not chronological.
For a tool: what it does, how it works, installation, usage, caveats.
For a thread/list: one subsection per item with a line of substance.

## Key Takeaways

- 3–6 bullets.

## Deep Research

(optional) Added by a research job. New findings with citations, never a rewrite of existing content.

## Sources

(optional) Links and titles used by research or merge.

## Related

- [[Other Note]] — why it is related.
```

`content_status: summary-only` lets the dashboard render existing notes honestly and offer "Generate full rewrite" until the backfill reaches them.

## 5. Pages and workflows

### Categories (`/`)

The home screen becomes the category index, not a stats dashboard.

- Grid of category cards: name, description, note count, unread count, last updated, 2–3 recent note titles.
- Search across all notes from the top bar.
- Create category (name + optional description) → creates `Notes/<Category>/` and a MOC skeleton.
- Category actions: rename, merge into another, delete (empty only), edit description/color.
- Clicking a card opens the category view: notes grouped by rating or date, with filters.
- Uncategorized notes get a first-class card so nothing hides.

### Note page (`/note/:id`)

Top to bottom, matching the requested structure:

1. **Metadata header** — title, category, source (with "Read Source"), tags, platform, author, date, rating, content status.
2. **Summary** — Hermes-generated, personalized: what it is, features, use cases for you.
3. **Full Content** — the rewritten, topic-organized Markdown body. A sticky table of contents on desktop.
4. **Action bar** — Read Source · Deep Dive · Deep Research · Merge · Edit tags · Change category.
5. **Key Takeaways / Deep Research / Sources** — collapsible sections.
6. **Related / Linked from** — graph neighbourhood and backlinks.

Reading state and scroll progress are saved, so the category view can show "continue reading".

For merged notes, `source` becomes a source list: one primary "Read Source" plus "All sources".

### Deep Dive

A side panel with two modes:

- **Explain deeply** — a one-shot agent job: go beyond the note, explain the concepts, give examples, connect to related notes. Streamed token by token.
- **Ask questions** — a chat scoped to this note. The note content is the system context; the agent answers, and can search the web when asked.

Each note gets one persistent Hermes session, stored in the dashboard DB, so the conversation survives navigation and restarts. Answers can be saved as a `## Deep Dive` section or a linked child note.

This is the only action that is conversational; the rest are jobs.

### Deep Research

- Runs as an async job with live tool progress.
- Input: the note, its archived source, and the vault context.
- Output: a proposed `## Deep Research` section plus `## Sources`.
- The result opens as a **diff preview**: Apply / Discard / Run again.
- Apply appends the section, updates `date_researched`, and commits.
- Never overwrites the original summary or full content without a separate confirmation.

### Merge

This is the most destructive action, so it gets the most structure.

1. Select 2–N notes in the Library (or from a note's "Merge with…").
2. Confirmation modal: target title, target category, and what will happen to the originals (archive, never delete).
3. Agent job: receives all selected notes, returns one complete note in the v2 format that synthesizes them.
4. Validation: required frontmatter, required sections, at least two sources, no empty content.
5. Diff preview: the merged note, the list of originals, and the backlinks that will be redirected.
6. Apply:
   - Write the new note.
   - `git mv` originals to `.archive/merged/<date>/`.
   - Rewrite inbound wikilinks to the new title across the vault.
   - Update the relevant MOCs.
   - One commit: `dashboard: merge 3 notes into "Title"`.
7. The originals keep `merged_into` metadata in the archive; they are excluded from the index and graph.

If the merge fails validation, nothing is written.

### Library

- Instant search over title, tags, summary, full content, and takeaways.
- Facets: category, content type, rating, platform, tag, date, content status, unread.
- Bulk select → recategorize, add/remove tags, set rating, merge.
- Table view with sortable columns for curation sessions.
- URL-synced filters.

### Categories and tags management

- Category rename = `git mv` folder + patch every note's `category` + rewrite the MOC title + commit.
- Category merge = move all notes, merge MOC bullets, archive the old MOC.
- Tag merge = preview "27 notes will change `ai-agent` → `ai-agents`", then one commit.
- Tag suggestions come from normalization (case, plurals, hyphens, edit distance), not from the LLM.

### Graph and Insights

- Graph coloured by category, with merged notes as visible hubs and archived notes excluded.
- Insights: growth per week, category balance, reading backlog, stale categories, source mix, tag sprawl trend.

### Ops

- Queue depth, last run, next run, manual pipeline trigger.
- Health: broken links, missing frontmatter, missing sources, summary-only notes, MOCs out of sync, tag duplicates.
- Job history: every Deep Dive / Research / Merge / Rewrite, with status, tokens, cost, and result.

## 6. Hermes integration

### Use the API server, not the CLI

Hermes ships an OpenAI-compatible API server designed for external UIs, with exactly the primitives this needs:

| Need | Hermes endpoint |
|---|---|
| One-shot action (research, merge, rewrite) | `POST /v1/runs` → `run_id` |
| Live progress | `GET /v1/runs/{id}/events` (SSE) |
| Poll status / result / usage | `GET /v1/runs/{id}` |
| Cancel | `POST /v1/runs/{id}/stop` |
| Interactive Deep Dive | `POST /api/sessions/{id}/chat/stream` |
| Resume a conversation | `GET /api/sessions/{id}/messages` |
| Trigger the daily pipeline | `POST /api/jobs/{id}/run` |

Why this and not `hermes cron run` or a subprocess per button:

- Runs are async and observable: progress events, token usage, cancellation, terminal status.
- Sessions give Deep Dive real memory across turns and restarts.
- No parsing terminal output, no blocked HTTP requests, no duplicated agent loop.
- The same prompts and skills can serve both Telegram and the dashboard.

### Topology

```
Browser ──HTTPS──> Dashboard (Hono) ──HTTP/SSE──> Hermes API server (127.0.0.1:8642)
                        │                              │
                        ├── vault (read/write)          ├── agent loop
                        ├── SQLite (jobs, state)        ├── skills
                        └── git commits                 └── web tools
```

- Enable with `API_SERVER_ENABLED=true` and a strong `API_SERVER_KEY`; bind to `127.0.0.1`.
- The browser never sees the Hermes key; the dashboard server proxies every call.
- Restrict the `api_server` platform's toolsets to web/search only, so an agent job cannot run terminal commands or write files. All writes happen in the dashboard server. (Confirm the exact config key, or use a dedicated Hermes profile with the same restriction.)
- If platform-level restriction is not possible, use a dedicated profile whose config only enables web tools and whose workspace is read-only.

### Job lifecycle

```
queued → running → needs_review → applied
                 ↘ failed / cancelled
```

Every action creates a row in `jobs`:

```
id, type, note_ids, options, prompt_version, status,
hermes_run_id, hermes_session_id, started_at, finished_at,
result_markdown, result_meta, tokens_in, tokens_out, cost, error
```

- One job runner processes the queue with a concurrency cap (start with 1–2) to avoid provider rate limits.
- Progress from Hermes SSE is forwarded to the browser over the dashboard's own SSE.
- Results for mutating actions are written to `.dashboard/staging/<job-id>/`, not to the vault.
- Apply is a separate, explicit step; it is the only thing that writes notes and commits.
- Failed or discarded jobs leave no trace in the vault.

### Prompt contracts

Prompts live in a versioned Hermes skill (`second-brain-actions`) shared by Telegram and the dashboard:

| Action | Input | Output contract |
|---|---|---|
| `deep_dive` | note + optional question | Markdown explanation; no frontmatter; cite the note |
| `deep_research` | note + snapshot | `## Deep Research` section + `## Sources` list; cited, no invented facts |
| `merge` | 2–N notes | complete v2 note: frontmatter + Summary + Full Content + Key Takeaways + Sources |
| `full_rewrite` | note + snapshot | `## Summary` + `## Full Content` for the existing note |

The server validates the output before staging it. A malformed merge is rejected, not applied.

### Prompt injection

Note content is untrusted web text. Every prompt wraps it in explicit delimiters and instructs the agent to treat it as data, never as instructions. The agent has no write tools, and its only external capability is web access. The server never executes anything the agent returns.

## 7. Sources and archiving

`source` alone is not enough. Instagram and Telegram links rot or require a session.

At ingest, extend `process_inbox.py`:

1. Save the extracted raw content to `.sources/<note-id>.md` (or `.json` for structured APIs).
2. Set `source_snapshot` and `source_status: archived`.
3. Keep the canonical permalink in `source`.

Read Source behavior:

- Primary: open the original URL in a new tab.
- If the snapshot exists: "Archived copy" opens a reader view of the snapshot.
- If the URL is dead and no snapshot exists: show "Source unavailable" and offer Deep Research on the note's content.

For merged notes, sources become a list with the same per-source behavior.

## 8. Dashboard data and API

### Index

Server-side scan of the vault into a normalized index, served once to the client:

- Both layouts: `Notes/<Category>/` and the ~70 legacy top-level notes.
- Derived fields: title, category, tags, rating, platform, source, content status, summary, sections, word count, links, backlinks, issues.
- Link resolution across filename, title, path, and ID-stripped basename. 102 currently unresolved targets stay flagged, not hidden.

Client-side MiniSearch + faceted filters; note bodies fetched on demand.

### Endpoints

| Method | Path | Purpose |
|---|---|---|
| GET | `/api/bootstrap` | Notes metadata, categories, tags, stats, health summary |
| GET | `/api/notes/:id` | Full note, sections, backlinks, source info |
| PATCH | `/api/notes/:id/meta` | Category, tags, rating |
| POST | `/api/notes/bulk-meta` | Bulk curation |
| GET/POST | `/api/categories` | List, create |
| PATCH | `/api/categories/:name` | Rename, description |
| POST | `/api/categories/merge` | Merge categories |
| POST | `/api/tags/merge` | Merge tag variants |
| POST | `/api/actions` | Start a job: dive, research, merge, rewrite |
| GET | `/api/jobs` / `/api/jobs/:id` | History and status |
| GET | `/api/jobs/:id/events` | SSE progress proxy |
| POST | `/api/jobs/:id/apply` / `discard` / `cancel` | Resolve a job |
| GET/POST | `/api/notes/:id/chat` | Deep Dive history and streaming turn |
| POST | `/api/ops/run` | Trigger the daily pipeline |
| GET | `/api/healthz` | Liveness |

### State

Sidecar SQLite, never in the vault:

- `note_state(path, read_at, scroll_pct, snoozed_until)`
- `jobs(...)`
- `sessions(note_id, hermes_session_id)`
- `runs(...)` for pipeline history
- `settings(key, value)` — model, budget cap, auto-apply preferences

## 9. Pipeline v2

The daily job must produce the new format. Changes:

1. Update the note template and the daily prompt: generate `## Full Content` as a topic-organized rewrite, not just a summary.
2. Make the summary personal: what it is, features, and concrete use cases for Omid.
3. Save the source snapshot under `.sources/` and set `source_status`.
4. Keep the Telegram message short: title, 2-line summary, category, buttons. The long content lives in the note and the dashboard.
5. Share one skill (`second-brain-actions`) between Telegram buttons and dashboard jobs so "Deep Dive" means the same thing in both places.
6. Backfill existing notes lazily: show `summary-only` in the dashboard and offer "Generate full rewrite"; batch-prioritize `worth-deep-reading` notes first.

## 10. Security

- Dashboard: single-user token → HttpOnly cookie; CSRF on writes; rate limits; CSP; sanitized Markdown.
- Hermes API: loopback only, strong bearer key, never sent to the browser.
- Agent jobs: web tools only; no terminal, no file writes; strict output validation.
- Mutating actions require an explicit Apply, except where the user opts into auto-apply.
- Git is the undo mechanism: every applied change is one commit; "Revert this change" is a first-class button.
- Cost guard: per-job token/cost logging, a monthly budget, and confirmation above a threshold.
- Prompt injection: note text is delimited data; the agent cannot write or execute.

## 11. Delivery plan

Riskiest first: prove the Hermes round-trip before building breadth.

| Phase | Work | Exit criteria | Est. |
|---|---|---|---|
| 0 | Scaffold, parser/index, v2 schema, audit; **API server spike** on one note | 328 notes indexed; a test Deep Dive run streams back through the dashboard | 2–3d |
| 1 | Reading workspace: categories, library, note page, search, source view | Open a category → note → read summary + full content on phone and desktop | 3–4d |
| 2 | Curation: category CRUD, tag editing/merge, bulk actions, git commits | Create/rename/merge a category; merge two tags; one clean commit each | 2–3d |
| 3 | Action control plane: jobs, queue, SSE, Deep Dive chat, job history | Deep Dive streams; conversation resumes; jobs survive restart | 3–4d |
| 4 | Deep Research + Merge + full rewrite, diff preview, apply, archive, link redirects | Research a note and apply it; merge 3 notes with all backlinks redirected | 4–5d |
| 5 | Pipeline v2 + source snapshots + lazy backfill | New daily notes contain full content and an archived source | 2–3d |
| 6 | Graph, insights, PWA, polish, revert UI | Installable; every applied job can be reverted in one click | 2–3d |

Total: roughly 18–25 working days, depending on how much of the backfill and pipeline work lands in the same pass.

Suggested vertical slice for the first demo: **one category → one note page → Deep Dive streaming → save an insight.** It exercises the parser, the UI, the API server, sessions, and git in a single path.

## 12. Risks

| Risk | Mitigation |
|---|---|
| Rewrites hallucinate or flatten nuance | Preserve `source_snapshot`; show content status; keep Key Takeaways; allow human edit of Full Content later |
| Merge loses information | Preview diff, archive originals, one commit, one-click revert, never hard-delete |
| Agent output is malformed | Strict schema validation; reject and retry; nothing applied on failure |
| Long jobs feel broken | SSE progress, tool events, elapsed time, cancel button |
| Model cost creep | Cheaper model for dive/rewrite; budget cap; per-job cost display |
| API server exposed | Loopback, bearer key, proxy only, restricted toolsets |
| Prompt injection via notes | Delimited untrusted content, no file/terminal tools, no execution of output |
| Two layouts confuse counts | Explicit `legacy` flag; migration as a separate confirmed task |
| Git conflicts with cron | Write lock, re-read before patch, one commit per action, push failure surfaced |
| Source dead before ingest | Archived snapshot; health flags `url-only` and `missing` |

## 13. Open decisions

1. **Agent isolation:** restrict the `api_server` platform's toolsets, or run a dedicated Hermes profile for dashboard jobs? (Recommend dedicated profile or platform restriction; never full tools.)
2. **Apply policy:** preview-before-apply for every mutating action, or auto-apply research and preview only merge/rewrite? (Recommend preview for all in v1; add opt-in auto-apply later.)
3. **Backfill:** rewrite all 258 notes now, or lazily with priority on `worth-deep-reading`? (Recommend lazy.)
4. **Source archiving:** keep `.sources/` in git (durable, larger repo) or outside git with a backup? (Recommend in git; text is small.)
5. **Merge originals:** archive and redirect links (recommended), or keep the originals and link them to the merged note?
6. **Model choice per action:** one model for everything, or a cheap model for dive/rewrite and a stronger one for research/merge?

## 14. Next step

Phase 0 spike: enable the Hermes API server, run a Deep Dive against one existing note, stream the result into a minimal dashboard route, and confirm token usage and cancellation. If that round-trip is solid, the rest of the product is conventional web work.
