# Second Brain Pipeline

Telegram Inbox → Obsidian vault second brain. Collects links and notes from
Telegram, processes them daily with LLM, and saves structured notes to an
Obsidian vault with a knowledge graph.

## Architecture

```
Telegram Inbox Topic → collect.py (lightweight queue)
                              ↓
                    Daily Cron (5AM IRDT)
                              ↓
                    process_inbox.py (extract content)
                              ↓
                    LLM (categorize, summarize, tag)
                              ↓
                    Obsidian Vault (notes + knowledge graph)
                              ↓
                    second_brain_sender.py (per-note messages with buttons)
                              ↓
                    Telegram (individual messages with inline keyboards)
```

## Components

### Scripts

| File | Purpose |
|------|---------|
| `scripts/collect.py` | Lightweight inbox pre-processor. Detects platform, extracts tags, guesses categories, queues for daily processing. |
| `scripts/process_inbox.py` | Content extractor. Reads queued items and extracts full content (YouTube transcripts, X/Twitter via fxtwitter, GitHub metadata, Reddit, web pages). |
| `scripts/second_brain_sender.py` | Telegram sender. Sends each processed note as a separate message with inline keyboard buttons (Read source, Deep dive, Deep search). |
| `scripts/second_brain_prompt.txt` | Cron job prompt template for the LLM processing step. |

### Skills (Hermes Agent)

| File | Purpose |
|------|---------|
| `skills/second-brain-inbox/SKILL.md` | Telegram Inbox topic skill. Tells the agent to silently collect links and reply only with category confirmation. |
| `skills/second-brain/SKILL.md` | Master reference skill. Full architecture, file paths, how to modify each component. |

### Cron Job

The daily processing runs at 5:00 AM IRDT (01:30 UTC) via a Hermes cron job.

Job config is in `cron-job-config.json`. To set up:

```bash
hermes cron create \
  --name "second-brain-daily" \
  --schedule "30 1 * * *" \
  --script scripts/process_inbox.py \
  --workdir ~/obsidian-vault \
  --prompt "$(cat scripts/second_brain_prompt.txt)"
```

## Setup

### Prerequisites

- [Hermes Agent](https://github.com/NousResearch/hermes-agent) running as Telegram gateway
- Telegram bot with DM topics enabled
- Obsidian vault at `~/obsidian-vault/`
- Python 3.8+ with:
  ```bash
  pip install youtube-transcript-api
  ```

### 1. Copy scripts

```bash
cp scripts/*.py ~/.hermes/scripts/
cp scripts/*.txt ~/.hermes/scripts/
chmod +x ~/.hermes/scripts/*.py
```

### 2. Install skills

```bash
cp -r skills/second-brain-inbox ~/.hermes/skills/my-skills/
cp -r skills/second-brain ~/.hermes/skills/my-skills/
```

### 3. Configure Telegram topic

In `~/.hermes/config.yaml`, add under `platforms.telegram.extra`:

```yaml
dm_topics:
  - chat_id: YOUR_TELEGRAM_USER_ID
    topics:
      - name: Inbox
        icon_color: 16750848
        skill: second-brain-inbox
```

### 4. Create the cron job

```bash
hermes cron create \
  --name "second-brain-daily" \
  --schedule "30 1 * * *" \
  --script scripts/process_inbox.py \
  --workdir ~/obsidian-vault \
  --prompt "$(cat scripts/second_brain_prompt.txt)"
```

### 5. Restart gateway

```bash
sudo systemctl restart hermes-gateway
```

## Obsidian Vault Structure

```
~/obsidian-vault/
├── Notes/                    # Processed notes by category
│   ├── AI & Machine Learning/
│   ├── Cybersecurity/
│   ├── Networking/
│   ├── Development/
│   ├── DevOps & Infrastructure/
│   ├── Productivity & Tools/
│   ├── Hardware & DIY/
│   └── General/
├── Daily Digests/            # YYYY-MM-DD.md summaries
├── Maps of Content/          # Index pages per category (MOC)
├── People & Sources/         # Notable authors/sources
├── Templates/                # note-template.md
├── .inbox-queue/             # Raw queued items (JSON)
├── .inbox-archive/           # Processed items (archived)
└── .obsidian/                # Obsidian config
```

## Supported Platforms

YouTube, GitHub, Reddit, X/Twitter, Instagram, Telegram, LinkedIn, Medium,
arXiv, Hacker News, Stack Overflow, and any web URL.

## User Preferences

- **Timezone**: +03:30 (Iran Standard Time)
- **Processing time**: 5:00 AM local
- **Note delivery**: Each note as separate Telegram message with inline buttons
- **Tags**: Comprehensive (8-15 per item)
- **Content types**: tool, learning, idea, reference
