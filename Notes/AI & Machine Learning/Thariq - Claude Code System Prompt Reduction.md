---
title: "Thariq - Claude Code System Prompt Reduction"
source: "https://x.com/trq212/status/2080710971228918066"
platform: "x"
content_type: "reference"
date_saved: "2026-08-04"
date_processed: "2026-08-08"
category: "AI & Machine Learning"
tags: ["claude-code", "system-prompt", "context-engineering", "claude-opus-5", "claude-fable", "prompt-engineering", "anthropic", "coding-agents", "best-practices", "optimization"]
rating: "worth-deep-reading"
author: "Thariq (@trq212)"
---

## Summary

Anthropic's Claude Code team removed over 80% of the system prompt for their newest models (Claude Opus 5 and Claude Fable 5) with no measurable loss on coding evaluations. Thariq, who works on Claude Code at Anthropic, shared the lessons learned about writing system prompts, skills, and CLAUDE.md files for this new class of models. This represents a fundamental shift in how much guidance frontier models need — they require far less explicit instruction than their predecessors. The post received 16k likes and 1.8k retweets, indicating significant community interest.

## Key Takeaways

- 80%+ of Claude Code's system prompt removed with no quality loss
- New models (Opus 5, Fable 5) need far less explicit guidance
- System prompts, skills, and CLAUDE.md should be rewritten for new models
- Less is more — frontier models follow intent better than instructions
- By Thariq (@trq212) from Anthropic's Claude Code team
- 16k likes — highly significant signal from the community

## My Notes

Directly relevant to Hermes configuration. If using Claude Opus 5 or Fable 5 models, the system prompts could potentially be trimmed significantly. Worth testing whether this applies to our custom models too.

## Related

- [[Claude Code Context Management]]
- [[Obsidian Skills - Agent Skills for Obsidian Vault]]
