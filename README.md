# Second Brain Dashboard

Phase 0 of the reading workspace: a local, read-only view over the Obsidian vault.

## Run

```bash
npm install
npm run audit   # reconcile the vault, print stats and issues
npm start       # http://localhost:8787
```

Environment:

- `VAULT_PATH` — defaults to `../second-brain-pipeline`
- `PORT` — defaults to `8787`

## What works

- Indexes both vault layouts: `Notes/<Category>/` and the legacy top-level folders.
- Resolves wikilinks by path, filename, and title; MOCs resolve but are not listed as notes.
- Category index with counts, client-side text filter, and note list.
- Note page: metadata, source, tags, summary, sections, backlinks, broken links.
- `/api/bootstrap` returns the normalized index; `/api/healthz` for liveness.

## Not yet

- Editing categories/tags, creating categories.
- Deep Dive, Deep Research, Merge (needs the Hermes API server).
- Full rewritten content (`0` notes have it today).
- Source snapshots, auth, PWA.

The scanner is the foundation; every later screen reads from the same normalized index.
