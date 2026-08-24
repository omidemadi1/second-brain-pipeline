---
title: "BHolmesDev skill-doctor — AI Skill Analysis & Improvement Tool"
source: "https://t.me/smartainewss (Telegram)"
platform: note
content_type: tool
date_saved: "2026-08-23T20:13:01.646226+03:30"
date_processed: "2026-08-24"
category: AI & Machine Learning
tags:
  - skill-doctor
  - bholmesdev
  - claude-code
  - codex
  - warp
  - ai-skills
  - skill-analysis
  - skill-optimization
  - diff-generation
  - developer-tools
  - ai-agents
  - coding-assistants
rating: worth-deep-reading
author: "BHolmesDev / @smartainewss"
---

## Summary

**BHolmesDev** is developing **skill-doctor** — a new diagnostic tool that **automatically analyzes and improves your AI coding agent skills** across **Claude Code, Codex, and Warp**. The tool works by:

1. **Scanning your chat history** in these environments to understand how you use skills
2. **Scoring skill effectiveness and code quality** based on actual usage patterns and outcomes
3. **Generating actionable diffs/patches** to upgrade existing skills — fixing triggers, improving prompts, resolving conflicts

This addresses a real pain point: as developers install more skills (agents, slash commands, prompt templates), they accumulate **shadowing, trigger collisions, and stale configurations** that degrade performance. skill-doctor acts as a "linter for your skill library" — detecting duplicates, drift, broken symlinks, and configuration rot across multiple AI coding platforms simultaneously.

The project appears on GitHub under multiple forks (MindiveLabs, JoaquinCampo) and as a PyPI package, suggesting active development. It cross-runtime supports **Claude Code, Codex, Cursor, OpenClaw, and more** — making it a universal skill hygiene tool for the AI-assisted development ecosystem.

## Key Takeaways

- **skill-doctor** = automated skill quality assurance for AI coding agents
- Supports **Claude Code, Codex, Warp, Cursor, OpenClaw** — cross-platform
- Three-phase workflow: **Audit → Score → Patch** (diffs for skill improvements)
- Detects: **skill shadowing, trigger collisions, stale configs, duplicate skills, broken links**
- Outputs **actionable diffs** — not just reports, but ready-to-apply fixes
- Developed by **BHolmesDev**, announced via **@smartainewss** (AI news Telegram channel)
- Available on **GitHub** (multiple forks) and **PyPI** — installable via pip
- Solves "skill rot" as developers accumulate dozens of agents/commands over time

## My Notes

- **Highly relevant to our Hermes setup** — we have 50+ skills across profiles; skill-doctor could audit them
- Could integrate into our cron job: periodic skill health checks alongside inbox processing
- The "diff generation" approach matches our skill_manage(patch) workflow
- BHolmesDev appears active in the AI agent/tooling space — worth tracking
- @smartainewss is a good AI news source to follow on Telegram
- Consider contributing Hermes-specific skill patterns if we adopt this

## Related

- [[SkillsGate-Unified-Skill-Manager-Coding-Agents]] — Another skill management approach
- [[hermes-agent-passive-income-stream-guide]] — Our Hermes skill usage patterns
- [[hermes-agent-passive-income-reddit-automation]] — More skill examples
- [[claude-video-video-analysis-for-claude-code]] — Claude Code specific tooling
- [[Machina — AI Video Studio in Claude Code]] — Advanced Claude Code workflow