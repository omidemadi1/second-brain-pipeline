---
title: "Claude Code Context Management - When to Clear and Compact"
source: "https://tim-schipper.nl/en/blog/claude-code-context-management"
platform: "web"
content_type: "learning"
date_saved: "2026-08-07"
date_processed: "2026-08-08"
category: "AI & Machine Learning"
tags: ["claude-code", "context-management", "ai-coding", "best-practices", "token-optimization", "code-quality", "session-management", "compaction", "long-context", "degradation", "noLiMa", "chroma", "slopcodebench"]
rating: "worth-deep-reading"
author: "Tim Schipper"
---

## Summary

Long AI coding sessions degrade code quality significantly. Key findings: accuracy drops after ~32k tokens (11 of 13 tested models fell below half baseline at 32k); 66% more structural duplication in long sessions; complexity concentration increases from 4.1 to 37.0 high-complexity functions per codebase. /compact is a lossy re-encode — it summarizes but doesn't restore signal quality. Best practice: save important context to CLAUDE.md before clearing. /context command's "free space" indicator is misleading because degradation starts long before the window fills. Anthropic's own guidance is to find the smallest set of high-signal tokens. Session length is the lever — quality-aware prompting only improves the starting point, not the degradation slope.

## Key Takeaways

- Accuracy degrades significantly after ~32k tokens on a 128k+ context window
- 66% more duplicated code, complexity rises 9x across long sessions
- /compact is lossy summarization, not signal restoration
- Save key context to CLAUDE.md, use /clear for new tasks, not /compact
- The /context "free space" meter doesn't reflect actual quality degradation
- NoLiMa study: 11/13 models drop below half baseline at 32k tokens
- SlopCodeBench: zero agents solved problems end-to-end across 93 checkpoints

## My Notes

Critical insight for Hermes operation — context compression in long sessions is lossy. The recommendation to use /clear instead of /compact for new tasks is actionable. The ~32k token degradation threshold is important to keep in mind for cron job context budgets.

## Related

- [[TencentDB Agent Memory - Smart Context Compression]]
- [[Lapse - Personal Memory for AI Assistants]]
