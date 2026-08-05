# 🧠 Second Brain

An automated personal knowledge management system built with [Hermes Agent](https://hermes-agent.nousresearch.com), Obsidian, and Telegram. Links and notes sent to a Telegram inbox are automatically extracted, categorized, summarized by an LLM, and saved as structured Obsidian notes — then pushed to GitHub.

**Author:** [Omid Emadi](https://github.com/omidemadi1)

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
obsidian-vault/
├── Notes/                          # Main notes, organized by category
│   ├── AI & Machine Learning/      # Neural nets, LLMs, AI tools
│   ├── Cybersecurity/              # Pentesting, OSINT, security tools
│   ├── Development/                # Programming, frameworks, dev tools
│   ├── DevOps & Infrastructure/    # Docker, CI/CD, servers
│   ├── Networking/                 # Network tools, monitoring dashboards
│   ├── Marketing & Growth/         # Growth hacking, SEO, distribution
│   ├── Business & Finance/         # Pricing, finance tools
│   ├── Design & Creative/          # Design systems, creative tools
│   ├── Productivity & Tools/       # Productivity apps and utilities
│   └── General/                    # Cross-topic, reference articles
├── Maps of Content/                # MOC index per category
├── Templates/                      # note-template.md with YAML frontmatter
├── People & Sources/               # Source tracking
├── Daily Digests/                  # Daily summary digests
├── scripts/                        # Pipeline scripts
│   ├── collect.py                  # Inbox collector (URL detection + queuing)
│   ├── process_inbox.py            # Queue processor (API extraction)
│   ├── process_and_push.sh         # Cron wrapper: process + git push
│   ├── second_brain_sender.py      # Telegram note sender with inline buttons
│   └── check_related.py            # Wikilink relationship scanner
├── .inbox-queue/                   # Queued items (JSON)
├── .inbox-archive/                 # Processed items archive
└── skills/                         # Hermes skills for the pipeline
    ├── second-brain/
    └── second-brain-inbox/
```

**Current stats:** 96 notes across 10 categories

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
python3 scripts/collect.py "https://github.com/user/repo"
# Output: JSON with action + queued items
# Side effect: writes .json to .inbox-queue/
```

**Supported platforms:** YouTube, GitHub, Reddit, X/Twitter, Instagram, Telegram, general web

### `process_inbox.py` — Queue Processor
Reads queued items, fetches content from platform APIs, outputs structured JSON for the LLM.

```bash
python3 scripts/process_inbox.py
# Output: JSON with all unprocessed items + extracted content
```

### `process_and_push.sh` — Cron Wrapper
Runs the processor, captures output, then pushes to git in the background.

```bash
bash scripts/process_and_push.sh
```

### `check_related.py` — Wikilink Scanner
Scans notes for `[[wikilink]]` relationships and reports populated vs. empty links.

### `second_brain_sender.py` — Telegram Sender
Sends processed notes as individual Telegram messages with inline keyboard buttons.

```bash
echo '<json>' | python3 scripts/second_brain_sender.py
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
