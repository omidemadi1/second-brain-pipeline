---
title: "Paritok — Open-Source Context Compression for AI Coding Agents"
source: "https://nimaaksoy.com/radar/paritok"
platform: telegram
content_type: tool
date_saved: 2026-08-08
date_processed: 2026-08-09
category: AI & Machine Learning
tags:
  - ai-agents
  - token-compression
  - coding-agents
  - llm-gateway
  - context-window
  - cost-reduction
  - claude-code
  - cursor
  - codex
  - openhands
  - proxy
  - 4b-model
  - ollama
  - tool-schema-optimization
  - history-summarization
rating: worth-deep-reading
author: Nima Aksoy
---

## Summary

Paritok is an open-source **context compression gateway** that sits between AI coding agents (Claude Code, Cursor, Codex, OpenHands, etc.) and the upstream LLM. It attacks input token costs directly by:

1. **Tool-schema filtering** — keeps only relevant tools per request, eliminating schema bloat that can burn tens of thousands of tokens per turn
2. **Content compression** — shrinks tool output and file reads to ~quarter size using REF tags, powered by a code-trained 4B model
3. **History summarization** — summarizes stale conversation history when the context window fills

Powered by the first open 4B model trained on real coding-agent trajectories. Compressed chunks stay recoverable on demand. Install via `pip`, run `paritok up` (pulls model through Ollama), and point your agent at the local `BASE_URL`. Claims ~25% reduction on turn one, much more in deep sessions. Total input reduction of ~74%.

## Key Takeaways

- **What**: Non-destructive compression gateway for AI coding agents
- **How**: Proxy between agent and LLM — filters schemas, compresses outputs, summarizes history
- **Model**: Open 4B model trained on coding-agent trajectories, runs via Ollama
- **Savings**: ~25% off turn one, ~74% total input reduction in deep sessions
- **Setup**: `pip install`, `paritok up`, point agent at local BASE_URL
- **Compatible**: Claude Code, Cursor, Codex, OpenHands, any BASE_URL agent
- **Lossy but recoverable**: Original bytes available on demand via REF tags

## My Notes

This is directly relevant to our Hermes setup and any coding agent workflow. The token cost savings could be significant for long coding sessions. Worth trying with Hermes if it supports BASE_URL proxying. The 4B model runs locally via Ollama, so no data leaves the machine.

## Related

- [[Repowise Codebase Intelligence for AI Assistants]]
- [[Synapse Local-First Memory for AI Agents]]
