---
name: second-brain
description: "Omid's Second Brain pipeline — Telegram Inbox → Obsidian vault with knowledge graph. Covers: inbox collection, daily cron processing, vault structure, tagging, and all related config."
platforms: [linux]
---

# Second Brain Pipeline

Omid's personal knowledge management system. Collects links and notes from
Telegram, processes them daily with LLM, and saves structured notes to Obsidian
with a knowledge graph. Sends each note as a separate Telegram message with
inline buttons for interactive follow-up.

## Architecture Overview

```
Telegram Inbox Topic → collect.py (lightweight queue) → Daily Cron (5AM IRDT)
                                                              ↓
                                                    process_inbox.py (extract)
                                                              ↓
                                                    LLM (categorize, summarize, tag)
                                                              ↓
                                                    Obsidian Vault (notes + graph)
                                                              ↓
                                                    second_brain_sender.py (per-note messages with buttons)
                                                              ↓
                                                    Telegram (individual messages with inline keyboards)
```

## Components

### 1. Telegram Inbox Topic (dm_topics)

Config in `~/.hermes/config.yaml` under `platforms.telegram.extra.dm_topics`:
- chat_id: 244972243 (Omid's Telegram user ID)
- Topics: "Inbox" (skill: second-brain-inbox) and "General"

### 2. Inbox Collector Script

Path: `~/obsidian-vault/.inbox-queue/collect.py`
Also copied to: `~/.hermes/scripts/collect.py`

Detects platform, extracts tags, guesses categories, assigns content_type
(tool/learning/idea/reference). Rejects test/placeholder URLs.

### 3. Inbox Processor Script

Path: `~/.hermes/scripts/process_inbox.py`

Content extraction:
- YouTube → transcript; fallback: oEmbed + page scraping (title, description, views, duration)
- X/Twitter → fxtwitter API (text, author, engagement, media)
- GitHub → repo metadata via API
- Reddit → post + metadata via JSON endpoint
- Instagram → meta tags (limited)
- Web URLs → curl + HTML parsing
- Notes → raw text

### 4. Telegram Sender Script

Path: `~/.hermes/scripts/second_brain_sender.py`

Sends each processed note as a separate Telegram message with inline keyboard:
- "Read source" → URL button (opens source)
- "Deep dive" → callback button (triggers agent to explain deeper)
- "Deep search" → callback button (triggers agent to search + save new notes)

Usage:
```bash
echo '<json>' | python3 ~/.hermes/scripts/second_brain_sender.py
python3 ~/.hermes/scripts/second_brain_sender.py --file notes.json
```

Input JSON format:
```json
{
  "chat_id": "244972243",
  "date": "2026-07-26",
  "notes": [
    {
      "id": "note-id",
      "title": "Title",
      "url": "https://...",
      "category": "Category",
      "content_type": "tool|learning|idea|reference",
      "rating": "worth-deep-reading|reference|quick-note",
      "tags": ["tag1", "tag2"],
      "summary": "2-3 sentence summary"
    }
  ]
}
```

### 5. Daily Cron Job

Job ID: `757af4cb6f44`
Schedule: `30 1 * * *` (01:30 UTC = 5:00 AM IRDT)
Script: process_inbox.py (context injection)
Workdir: ~/obsidian-vault

Flow:
1. process_inbox.py extracts content from queued items
2. LLM categorizes, tags, rates, creates Obsidian notes
3. LLM writes digest JSON to .inbox-queue/digest_YYYY-MM-DD.json
4. LLM calls second_brain_sender.py to send each note with buttons
5. Archives processed items, updates MOCs, cross-links notes

### 6. Adapter Callback Handler

The Telegram adapter is patched to handle `sb:` callback queries:
- `sb:dive:<note_id>` → injects `/sb_dive <note_id>` message into agent session
- `sb:search:<note_id>` → injects `/sb_search <note_id>` message into agent session

Patch location: `/usr/local/lib/hermes-agent/plugins/platforms/telegram/adapter.py`
**Note**: This patch must be re-applied after Hermes updates.

### 7. Obsidian Vault

Path: `~/obsidian-vault/`

Note frontmatter includes: title, source, platform, content_type, date_saved,
date_processed, category, tags, rating, author.

### 8. Inbox Skill

Path: `~/.hermes/skills/my-skills/second-brain-inbox/SKILL.md`

## How to Make Changes

### Change the schedule
```bash
hermes cron list
hermes cron update <job_id> schedule="0 3 * * *"
```

### Change categories or tags
Edit keyword maps in `~/obsidian-vault/.inbox-queue/collect.py`:
- URL_KEYWORD_TAGS, CATEGORY_TAG_MAP, guess_categories()
- TOOL_KEYWORDS / LEARNING_KEYWORDS / IDEA_KEYWORDS

### Change the digest format
Edit `~/.hermes/scripts/second_brain_prompt.txt` then reload the cron job.

### Change what content is extracted
Edit `~/.hermes/scripts/process_inbox.py`

### Change the inline buttons
Edit `format_note()` in `~/.hermes/scripts/second_brain_sender.py`

### Re-apply adapter patch after updates
The sb: callback handler patch is at line ~5612 in the adapter.
Re-apply after any Hermes update:
```bash
# The patch adds an sb: handler in _handle_callback_query
# See session history for the exact patch content
```

## Key File Paths

| File | Purpose |
|------|---------|
| `~/.hermes/config.yaml` | Telegram dm_topics config |
| `~/.hermes/.env` | TELEGRAM_BOT_TOKEN, OBSIDIAN_VAULT_PATH |
| `~/.hermes/scripts/collect.py` | Inbox collector |
| `~/.hermes/scripts/process_inbox.py` | Content extractor |
| `~/.hermes/scripts/second_brain_sender.py` | Telegram sender with inline keyboards |
| `~/.hermes/scripts/second_brain_prompt.txt` | Cron job prompt template |
| `~/.hermes/cron/jobs.json` | Cron job definitions |
| `~/.hermes/skills/my-skills/second-brain-inbox/SKILL.md` | Inbox skill |
| `~/obsidian-vault/` | The vault root |
| `~/obsidian-vault/.inbox-queue/` | Pending items + digest JSON |
| `~/obsidian-vault/.inbox-archive/` | Processed items |
| `~/obsidian-vault/Notes/` | Final Obsidian notes |
| `~/obsidian-vault/Daily Digests/` | Daily summaries |

## Dependencies

- youtube-transcript-api (YouTube transcript extraction)
- instaloader (Instagram — limited by anti-scraping)
- fxtwitter API (X/Twitter — free, no auth)
- YouTube oEmbed API (metadata fallback — free, no auth)
- Telegram Bot API (inline keyboards — built-in)

## User Preferences

- Timezone: +03:30 (Iran Standard Time)
- Processing time: 5:00 AM local
- Each note sent as separate message with inline buttons
- 3 buttons per note: Read source, Deep dive, Deep search
- Tags: comprehensive (8-15 per item)
- Content types: tool, learning, idea, reference
- Language: English for notes
