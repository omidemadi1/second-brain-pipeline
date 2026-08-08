---
title: "You Cannot Filter Your Way Out of Prompt Injection"
source: "https://hackernoon.com/you-cannot-filter-your-way-out-of-prompt-injection"
platform: "web"
content_type: "learning"
date_saved: "2026-08-05"
date_processed: "2026-08-08"
category: "Cybersecurity"
tags: ["prompt-injection", "ai-security", "llm-security", "cybersecurity", "defensive-patterns", "caMeL", "dual-llm", "confused-deputy", "data-exfiltration", "security-architecture", "system-prompt", "defense-in-depth", "deep-reading"]
rating: "worth-deep-reading"
author: "Eugen Ullrich"
---

## Summary

Filters and system prompts cannot stop prompt injection — only architecture can. The article covers the "Lethal Trifecta" (high-privilege model + untrusted data + tools), Simon Willison's Dual-LLM pattern (one LLM for reading, one for acting, never seeing each other's output), Google DeepMind's CaMeL system, and six design patterns from a 2025 paper. Key insight: prompt injection is NOT jailbreaking — it's when attacker instructions hidden in untrusted text get executed by a model that has tools (mailbox, calendar, HTTP). System prompts fail because there are infinite attack phrasings and models are non-deterministic. Classifiers fail because 99% accuracy isn't enough — attackers find the 1%. Working code examples included.

## Key Takeaways

- Prompt injection ≠ jailbreaking — injection targets your data, jailbreaking targets the vendor
- System prompts and classifiers fundamentally cannot prevent injection
- The "confused deputy" pattern: high-privilege model tricked into misusing authority
- Data exfiltration: model silently steals data via hidden HTTP calls or image URLs
- Dual-LLM: separate reading and acting models that never share context
- CaMeL: architectural separation of concerns in the pipeline
- Security must be architectural, not filter-based

## My Notes

Essential reading for anyone building AI agents with tools. Directly relevant to Hermes's architecture — the tool-approval system is a form of defense-in-depth. The "Lethal Trifecta" framework is a good mental model for evaluating any agent system.

## Related

- [[Claude Code Context Management]]
- [[TencentDB Agent Memory]]
