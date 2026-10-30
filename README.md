# 🧠 Second Brain

An automated personal knowledge management system built with [Hermes Agent](https://hermes-agent.nousresearch.com), Obsidian, and Telegram. Links and notes sent to a Telegram inbox are automatically extracted, categorized, summarized by an LLM, and saved as structured Obsidian notes — then pushed to GitHub.

**Author:** [Omid Emadi](https://github.com/omidemadi1)

---

## Monorepo Layout

```
second-brain-pipeline/
├── services/
│   ├── dashboard/                 # Hono web app: browse/search the vault, fix links
│   │   ├── src/
│   │   ├── docs/
│   │   └── Dockerfile
│   └── pipeline/                  # Hermes cron worker (collect → process → notes)
│       ├── scripts/               # collect.py, process_inbox.py, sender, taxonomy
│       ├── skills/                # Hermes skills: second-brain, second-brain-inbox
│       └── cron-job-config.json   # exported Hermes cron definitions
├── packages/
│   └── shared/                    # reserved for code shared by more than one service
├── vault/                         # the Obsidian vault (Notes/, Maps of Content/, …)
├── docker-compose.yml             # runs the dashboard against ./vault
├── .github/workflows/             # CI per service
└── README.md
```

Run the dashboard:

```bash
cd services/dashboard
npm install
npm run audit    # reconcile the vault, print stats and issues
npm start        # http://localhost:8787
```

Or from the repo root, `docker compose up -d` (pulls `ghcr.io/omidemadi1/second-brain-dashboard:dev` and mounts the repo at `/repo`). See [services/dashboard/README.md](services/dashboard/README.md).

The pipeline is not containerized: Hermes cron runs `services/pipeline/scripts/process_and_push.sh` with `OBSIDIAN_VAULT_PATH` pointing at `vault/`. On a server clone that means `OBSIDIAN_VAULT_PATH=/root/obsidian-vault/vault`, and the cron prompts must use the same `vault/` prefix.

---

## How It Works

```
Telegram Inbox Topic
        │
        ▼
   collect.py          ← Lightweight: detects URLs, identifies platform, queues item
        │
        ▼
  .inbox-queue/        ← JSON files, one per queued item
        │
        ▼  (daily cron @ 01:30 UTC / 05:00 IRDT)
        │
  process_inbox.py     ← Reads queue, fetches content via APIs (fxtwitter, YouTube, GitHub)
        │               │
        │               ├── X/Twitter → fxtwitter API (no auth)
        │               ├── YouTube  → transcript fetcher + oEmbed fallback
        │               ├── GitHub   → REST API (stars, description, language)
        │               └── Web      → fallback scraping
        │
        ▼
   Hermes Agent (LLM)  ← Summarizes, categorizes, generates tags, creates Obsidian notes
        │
        ▼
  Obsidian Vault        ← Structured notes with YAML frontmatter + knowledge graph
        │
        ├── git push → GitHub (automatic)
        │
        └── second_brain_sender.py → Telegram (optional per-note messages)
```

## Vault Structure

```
vault/
├── Notes/                          # Notes, two levels: <Domain>/<Subtopic>/
│   ├── AI & Machine Learning/      # 8 subtopics: MCP & Agent Tooling, Skills &
│   │                               # Prompts, Coding Agents & Harnesses, Agentic
│   │                               # Systems, RAG/Search & Data, Multimodal &
│   │                               # Generation, Models & Research, Free Access & Cost
│   ├── Cybersecurity/              # 5: Offensive & Pentesting, OSINT & Recon,
│   │                               # AppSec & Vulnerabilities, Privacy & Hardening, AI Security
│   ├── Development/                # 4: Web & Frontend, Backend/APIs & Architecture,
│   │                               # Dev Tools & Editors, Learning & Fundamentals
│   ├── DevOps & Infrastructure/    # 4: Containers & Orchestration, Homelab & Self-Hosted,
│   │                               # Cloud/CI-CD & Backups, Hardware & DIY
│   ├── Networking/                 # 2: Network Config & Traffic, Connectivity & Censorship
│   ├── Marketing & Growth/         # 4: Growth & Distribution, SEO & AEO,
│   │                               # Brand & Storytelling, Outreach & Lead Gen
│   ├── Business & Finance/         # 3: Entrepreneurship & Startups, Pricing &
│   │                               # Monetization, Finance & Crypto
│   ├── Design & Creative/          # 5: Design Craft & Principles, Design Systems & UI,
│   │                               # AI Design Skills & Anti-Slop, Motion & Interaction,
│   │                               # 3D & Visual Assets
│   ├── Productivity & Tools/       # 3: Desktop & Utility Apps, Voice & Dictation,
│   │                               # Knowledge & Note Tools
│   └── Unsorted/                   # 1: To Review — only for captures with no subject
├── Maps of Content/                # One MOC per domain, with a section per subtopic
├── Templates/                      # note-template.md with YAML frontmatter
├── People & Sources/               # Source tracking
├── Daily Digests/                  # Daily summary digests
├── .inbox-queue/                   # Queued items (JSON)
└── .inbox-archive/                 # Processed items archive

services/pipeline/
├── scripts/
│   ├── taxonomy.json               # Single source of truth: domains → subtopics → keywords
│   ├── collect.py                  # Inbox collector (URL detection + taxonomy classification)
│   ├── process_inbox.py            # Queue processor (API extraction)
│   ├── process_and_push.sh         # Cron wrapper: process (git push is done by the agent)
│   ├── second_brain_sender.py      # Telegram note sender with inline buttons
│   └── check_related.py            # Wikilink relationship scanner
├── skills/                         # Hermes skills for the pipeline
│   ├── second-brain/
│   └── second-brain-inbox/
└── cron-job-config.json            # Exported Hermes cron definitions
```

**Current stats:** 342 notes (272 in `Notes/`, 70 legacy) + 10 MOCs

## Note Format

Every note uses YAML frontmatter for metadata:

```yaml
---
title: "Note Title"
source: "https://..."
platform: "github"          # github | x | youtube | web | note
date_saved: "2026-08-05"
date_processed: "2026-08-05"
category: "Development"
tags: ["tool", "open-source", "debugger"]
rating: "worth-deep-reading"  # worth-deep-reading | useful | reference | skip
author: "Author Name"
---

## Summary
2-3 sentence summary of the content.

## Key Takeaways
- Main point 1
- Main point 2

## Notes
Personal annotations and context.

## Related
[[Other Note]] — brief description of relationship
```

## Cron Jobs

| Job | Schedule | Description |
|-----|----------|-------------|
| `second-brain-daily` | `30 1 * * *` (05:00 IRDT) | Processes queued inbox items → Obsidian notes → git push |
| `second-brain-pipeline` | `0 15 * * 5` (Fridays 19:30 IRDT) | Weekly full pipeline run |

Both run on the default Hermes profile on the shared Telegram gateway.

## Scripts

### `collect.py` — Inbox Collector
Detects URLs in messages and queues them for processing.

```bash
python3 services/pipeline/scripts/collect.py "https://github.com/user/repo"
# Output: JSON with action + queued items
# Side effect: writes .json to .inbox-queue/
```

**Supported platforms:** YouTube, GitHub, Reddit, X/Twitter, Instagram, Telegram, general web

### `process_inbox.py` — Queue Processor
Reads queued items, fetches content from platform APIs, outputs structured JSON for the LLM.

```bash
python3 services/pipeline/scripts/process_inbox.py
# Output: JSON with all unprocessed items + extracted content
```

### `process_and_push.sh` — Cron Wrapper
Runs the processor, captures output, then pushes to git in the background.

```bash
bash services/pipeline/scripts/process_and_push.sh
```

### `check_related.py` — Wikilink Scanner
Scans notes for `[[wikilink]]` relationships and reports populated vs. empty links.

### `second_brain_sender.py` — Telegram Sender
Sends processed notes as individual Telegram messages with inline keyboard buttons.

```bash
echo '<json>' | python3 services/pipeline/scripts/second_brain_sender.py
```

## Platforms

| Platform | Extraction Method | Auth Required |
|----------|------------------|---------------|
| X/Twitter | fxtwitter API | No |
| YouTube | Transcript fetch + oEmbed fallback | No |
| GitHub | REST API | No |
| Reddit | Page scraping | No |
| Web | Fallback scraping | No |

## Setup

1. **Clone the repo:**
   ```bash
   git clone https://github.com/omidemadi1/second-brain-pipeline.git ~/obsidian-vault
   ```
   The Obsidian vault is the `vault/` subfolder. Open `~/obsidian-vault/vault` in Obsidian and point the pipeline at it with `OBSIDIAN_VAULT_PATH=~/obsidian-vault/vault`.

2. **Configure Hermes cron jobs** (in `~/.hermes/config.yaml` or via `hermes cron`):
   - `second-brain-daily` — daily processing cron
   - `second-brain-pipeline` — weekly full pipeline

3. **Set up Telegram inbox topic** — configure `dm_topics` in the Hermes gateway config to route messages to the `collect.py` script.

4. **Git remote** — ensure push access:
   ```bash
   cd ~/obsidian-vault
   git remote set-url origin https://github.com/omidemadi1/second-brain-pipeline.git
   ```

## Dependencies

- **Python 3** (no pip packages — uses only stdlib + subprocess calls)
- **Hermes Agent** with Telegram gateway and cron scheduling
- **Git** for version control and push
- **curl** (for GitHub API calls from `process_inbox.py`)

## License

Personal project — not licensed for distribution.
