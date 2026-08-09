---
title: "Shepherd — Reversible Runtime for AI Agents"
source: "https://nimaaksoy.com/radar/shepherd"
platform: web
content_type: tool
date_saved: 2026-08-09
date_processed: 2026-08-10
category: "AI & Machine Learning"
tags:
  - ai-agents
  - execution-traces
  - reversible-computation
  - copy-on-write
  - meta-agents
  - agent-runtime
  - code-review
  - git-like
  - agent-supervision
  - sandboxing
  - python
  - open-source
  - agent-infrastructure
rating: worth-deep-reading
author: shepherd-agents
---

## Summary

Shepherd is a runtime substrate that turns every agent run into a durable, inspectable, Git-like execution trace. It records model calls, tool use, and filesystem changes as commits in a copy-on-write (CoW) world shared between the agent and its environment. Meta-agents can observe the execution stream, fork from any past state, replay with ~95% KV-cache reuse, and revert without rebuilding the entire sandbox. Installs with `pip install shepherd-ai` and defines tasks as typed Python functions. Outputs land as retained proposals, not live writes — you select, apply, or discard before anything touches production.

## Key Takeaways

- **Git-like execution traces**: Every agent run is a durable, inspectable, forkable trace.
- **Copy-on-write forking**: 5x faster than docker commit for environment snapshots.
- **95% KV-cache reuse on replay**: Dramatically reduces cost and latency when re-executing agent paths.
- **Meta-agent supervision**: A second agent can observe, review, and supervise the first agent's work.
- **Proposal-based outputs**: Agent writes are retained as proposals, not live file changes — select/apply/discard workflow.
- **Paper published**: Academic backing with arxiv publication (arxiv:2605.10913).
- **Framework for meta-agents**: Designed for supervising, optimizing, and training other agents.

## My Notes

This is a game-changer for unattended agent work. Instead of agents modifying files directly, Shepherd creates a review layer — exactly what's needed for safe autonomous coding workflows.

## Related

- [[LoopX — AI Agent Loop Control Plane]]
- [[T3 Code — Agent Harness Control Surface]]
- [[Strix — Open-Source AI Pentesting Tool]]
