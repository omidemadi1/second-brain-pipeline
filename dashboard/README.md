# Second Brain Dashboard

A local reading workspace over the Obsidian vault: browse, search, inspect links, and fix broken ones.

## Run

```bash
npm install
npm run audit   # reconcile the vault, print stats and issues
npm start       # http://localhost:8787
```

Environment:

- `VAULT_PATH` — defaults to the repository root (two levels up from `dashboard/src`)
- `PORT` — defaults to `8787`
- `HOST` — defaults to `127.0.0.1`; set `0.0.0.0` only for trusted LAN access

Node 24 runs the TypeScript directly; there is no build step.

## Docker

```bash
docker compose up -d --build
```

Then open <http://127.0.0.1:8787>. If the local Node server is already using 8787:

```bash
DASHBOARD_PORT=8788 docker compose up -d --build
```

The compose file mounts the repo root (`..`, i.e. this monorepo) at `/vault` **read-write**. Link fixes need the `.git` directory so they can create commits. To use another vault location:

```bash
VAULT_PATH_HOST=/absolute/path/to/vault docker compose up -d
```

Useful settings:

| Variable | Default | Purpose |
|---|---|---|
| `DASHBOARD_BIND` | `127.0.0.1` | Host interface; use `0.0.0.0` for trusted LAN access |
| `DASHBOARD_PORT` | `8787` | Host port |
| `VAULT_PATH_HOST` | `..` (repo root) | Host path mounted at `/vault` |
| `DASHBOARD_UID` / `DASHBOARD_GID` | `1000` | Linux vault owner, if not UID/GID 1000 |
| `GIT_AUTHOR_NAME` / `GIT_AUTHOR_EMAIL` | `Second Brain Dashboard` / `dashboard@localhost` | Author for link-fix commits |

The container runs as a non-root user, includes `git` for the fix flow, and has a healthcheck on `/api/healthz`.

```bash
docker compose logs -f
docker compose down
```

## What works

- Indexes both vault layouts: `Notes/<Category>/` and the legacy top-level folders.
- Sidebar navigation: Library, Tags, Issues, Graph, plus category counts.
- Library: newest-first list, category chips, live text search, tag filters.
- Note page: metadata, source, clickable tags, summary, sections, backlinks, unresolved links.
- Tags page: every tag with counts and a filter; each tag links to its notes.
- Issues page:
  - all broken wikilinks grouped by source note, with close-match suggestions;
  - confidence-scored suggestions, preview diff, and one-click apply;
  - applying rewrites **one file** and creates **one git commit** in the vault;
  - all notes without frontmatter, plus missing-field counts.
- Graph: canvas force layout, category colors, pan/zoom, labels, click-through.
- `/api/bootstrap`, `/api/graph`, `/api/healthz`.
- `Design.md` holds the visual system (dark editorial, brass + violet).

## Safety

The server rewrites vault files only from the link-fix preview flow. It binds to localhost by default and has no authentication yet. Do not expose it to a public interface.

## Not yet

- Editing tags/categories or creating categories from the UI.
- Deep Dive, Deep Research, Merge (needs the Hermes API server).
- Full rewritten content (`0` notes have it today).
- Source snapshots, auth, PWA.

The scanner is the foundation; every screen reads from the same normalized index.
