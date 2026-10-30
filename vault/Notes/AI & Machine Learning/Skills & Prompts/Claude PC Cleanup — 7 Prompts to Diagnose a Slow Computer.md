---
title: "Claude PC Cleanup — 7 Prompts to Diagnose a Slow Computer"
id: "f363f5373b18"
source: "https://x.com/free_ai_guides/status/2112453797218017563"
platform: x
content_type: learning
date_saved: 2026-10-22T10:33:51+03:30
date_processed: 2026-10-23
category: "AI & Machine Learning/Skills & Prompts"
tags:
  - prompts
  - prompt-library
  - ai-assistant
  - claude-desktop
  - computer-use
  - pc-maintenance
  - troubleshooting
  - windows
  - macos
  - startup-programs
  - disk-cleanup
  - system-optimization
  - beginners
  - quick-win
rating: quick-note
author: "AI Guides (@free_ai_guides / @alex_prompter)"
---

# Claude PC Cleanup — 7 Prompts to Diagnose a Slow Computer

## Summary

An X post framing a set of seven prompts that turn the Claude desktop app (with computer access enabled) into a first-line PC tuner: "Claude can now fix your slow computer like a $120/hour IT technician." The prompts are presented as a sequence for diagnosing and cleaning a machine that has become slow, covering the usual suspects — CPU and RAM usage, unnecessary startup programs, storage cleanup, and unused applications — plus reading the resulting system information and recommending what to remove.

The full prompt text is not in the post; it is gated behind a comment/DM ("comment FIX"), which is the standard growth mechanic for this account. The underlying procedure, though, is the same one a help-desk tech runs manually, with the LLM doing the interpretation step.

## Key Takeaways

- The workflow is: give the agent system access → ask for a diagnosis of CPU/RAM/startup/storage → get a prioritised cleanup list → approve changes one at a time.
- Most of the value is in the interpretation of Task Manager / Activity Monitor / `systeminfo` output, not in the prompts themselves.
- Works for Windows and macOS; the account pitches it for old or slow laptops and for people who would otherwise pay for a repair visit.
- Nothing here needs an API key or a paid tier beyond the Claude desktop app itself.
- Treat "let an AI touch my system settings" as a permission decision, not a shortcut — approve each change rather than running a batch.

## My Notes

- Low content density: the prompts are behind a DM gate, so the reusable part is the checklist, not the wording.
- Genuinely useful pattern for the family/friends tech-support role — describe the symptoms, let Claude read the system report, and get a clean list of what to disable or delete before touching anything.
- For my own machines the manual route is faster: Task Manager → Startup apps, then WinDirStat for storage. The LLM adds value mainly when the report is long and unfamiliar (a customer's laptop, an old company PC).
- If I formalise this, a short local checklist for NiroTransfo workstations would be more reusable than a prompt pack.

## Related

- [[AI Guides - Free AI Tips Account]]
- [[AI Agents - Simple Memory System with Markdown]]
- [[Second-Brain-Pipeline-Telegram-Inbox-to-Obsidian]]
