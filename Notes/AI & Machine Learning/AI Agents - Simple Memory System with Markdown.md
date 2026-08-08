---
title: "AI Agents - Simple Memory System with Markdown"
source: "https://x.com/alex_prompter/status/2084233350903128530"
platform: "x"
content_type: "learning"
date_saved: "2026-08-04"
date_processed: "2026-08-08"
category: "AI & Machine Learning"
tags: ["ai-agents", "memory-system", "markdown", "simple-architecture", "personal-agent", "knowledge-management", "git-trackable", "context-management", "flat-files", "no-vector-db"]
rating: "reference"
author: "Alex Prompter (@alex_prompter)"
---

## Summary

The simplest AI agent memory system that works uses four markdown files and zero databases. Alex Prompter's approach: (1) One file per domain (people.md, companies.md, deals.md, tasks.md) — never per date. (2) A MEMORY.md index that maps everything with one-line descriptions — agent loads this first, then pulls specific files. (3) Cache files with freshness headers (last_sync timestamps) for mirrored external data. (4) Flat markdown over vector databases — readable, searchable, git-trackable. No embedding pipeline or retrieval infrastructure needed. Setup takes 20 minutes.

## Key Takeaways

- Domain-based files, not date-based — stays searchable
- MEMORY.md index for agent navigation
- Cache files with freshness headers prevent stale data
- Flat markdown > vector databases for personal agents
- Git-trackable, human-readable, zero dependencies
- Setup in 20 minutes

## My Notes

This validates our current Hermes memory architecture approach. The domain-based organization matches our MEMORY.md structure. The freshness header idea for cached data is worth adopting.

## Related

- [[Lapse - Personal Memory for AI Assistants]]
- [[TencentDB Agent Memory]]
