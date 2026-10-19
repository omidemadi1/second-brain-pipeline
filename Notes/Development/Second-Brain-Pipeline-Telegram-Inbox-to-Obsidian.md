---
title: "Second Brain Pipeline — Telegram Inbox to Obsidian Vault"
source: "https://github.com/omidemadi1/second-brain-pipeline"
platform: "github"
content_type: "tool"
date_saved: "2026-10-19"
date_processed: "2026-10-19"
category: "Development"
tags: ["second-brain", "knowledge-management", "obsidian", "telegram-bot", "automation", "cron-jobs", "hermes-agent", "llm-pipeline", "personal-knowledge-base", "python", "markdown-notes", "self-hosted", "content-extraction", "knowledge-graph", "in-depth"]
rating: "worth-deep-reading"
author: "omidemadi1"
---

## Summary

**What:** An end-to-end personal knowledge management pipeline that turns links and notes sent to a Telegram Inbox topic into structured, tagged Obsidian notes. Items are queued the moment they are sent, processed once a day by an LLM (Hermes Agent), written to the vault as markdown with YAML frontmatter and wikilinks, then committed and pushed to GitHub. It runs on Python 3 stdlib only — no pip packages and no API keys needed for extraction.

**Key features:**
- **Capture** — `collect.py` detects URLs, identifies the platform, and writes one JSON file per item into `.inbox-queue/`. Messages posted in the Telegram "Inbox" topic auto-load the collector skill, so capture is just sending a link.
- **Extraction without auth** — `process_inbox.py` fetches content per platform: fxtwitter API for X/Twitter, transcript fetch + oEmbed fallback for YouTube, GitHub REST API (description, language), page scraping for Reddit and general web.
- **LLM structuring** — the daily cron run picks a single category, expands tags to 8–15, sets content_type (tool / learning / idea / reference) and rating, then writes the note with Summary, Key Takeaways, My Notes and Related sections.
- **Delivery with actions** — `second_brain_sender.py` sends each note as its own Telegram message with three inline buttons: Read source, Deep dive (`/sb_dive <id>`), Deep search (`/sb_search <id>`).
- **Versioned vault** — `process_and_push.sh` runs the processor and pushes the vault to git afterwards, so the knowledge base is also a code repo with full history.

**Use case:** → Best for anyone who collects far more links than they can read, and wants a searchable, cross-linked plain-markdown knowledge base that survives any single app. Also a clean reference architecture for a self-hosted "capture → enrich → publish" pipeline driven by cron plus an LLM agent.

## Key Takeaways

- Two-stage design keeps capture cheap and processing expensive-but-rare: queue immediately, enrich on a schedule.
- Zero-dependency Python (stdlib + `curl` subprocess) means the pipeline keeps working with no package drift — the only moving parts are Hermes Agent, git and cron.
- Notes carry both metadata in frontmatter (category, tags, rating, content_type, platform, dates) and graph edges in the Related section, so the vault is queryable and navigable.
- Obsidian's `[[wikilink]]` syntax is the knowledge graph — `check_related.py` scans for populated vs. empty links, so graph health is auditable.
- Everything is plain files on disk plus git; there is no database or vendor format to escape later.
- Failure modes are honest ones: pushes fail loudly when there is no git credential, rather than silently dropping content.

## My Notes

This is my own pipeline — the running instance of this repo *is* the vault this note lives in (`/opt/data/home/obsidian-vault`), so the daily job that produced this note is the same code being described. Worth keeping as the architecture reference for any future extension.

Observations while processing:
- The repo now serves double duty: the vault is the working tree and the git remote is the backup/history. That means note-content commits and code commits interleave in one history (e.g. "Daily inbox processing — 2026-09-07" next to script commits).
- No GitHub token is configured on this host yet, so the push step can fail; the pipeline should surface that as a visible error rather than assume success.
- Some duplicate notes exist from near-identical captures (for example `Open SEO - Open Source SEO Tool.md` vs `openseo.md`, and several Grok Build CLI entries). A dedupe-by-URL step before note creation would clean this up.
- Cross-linking is still manual; the Related section is the weakest link in the graph because it depends on the processor searching the vault each run.

Possible next steps: add a URL-slug index to skip already-captured links, and auto-generate Related links from shared tags instead of relying on ad-hoc search.

## Related

- [[Obsidian Skills - Agent Skills for Obsidian Vault]] — the skill layer that lets an agent read/write this vault
- [[AI Agents - Simple Memory System with Markdown]] — same premise: plain markdown files as durable agent memory
- [[Synapse Local-First Memory for AI Agents]] — local-first alternative for agent memory storage
- [[Graphify-Knowledge-Graph-from-Codebase]] — building a knowledge graph out of a corpus, the graph side of this pipeline
- [[awesome-hermes-agent]] — Hermes Agent integrations, including this pipeline's runtime
