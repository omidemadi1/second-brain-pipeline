---
title: "LoopX — AI Agent Loop Control Plane"
source: "https://github.com/huangruiteng/loopx"
platform: github
content_type: tool
date_saved: 2026-08-09
date_processed: 2026-08-10
category: "AI & Machine Learning"
tags:
  - ai-agents
  - loop-engineering
  - agent-control-plane
  - python
  - codex
  - claude-code
  - workflow-automation
  - durable-goals
  - quota-aware
  - multi-agent
  - long-running-agents
  - agent-ops
  - open-source
rating: worth-deep-reading
author: Huang Ruiteng
---

## Summary

LoopX is a lightweight state kernel and agent-agnostic local control plane for "loop engineering." It sits above agent runtimes like Codex, Claude Code, and Cursor rather than replacing them. The project enables managing and coordinating large numbers of AI agents — from conducting research to inter-agent collaboration and code review — within a unified workflow.

## Key Takeaways

- **Goal-level control plane**: Manages long-running AI agent work across sessions, runtimes, and hosts with durable goals and quota-aware auto-wake.
- **Agent-agnostic**: Works with Codex, Claude Code, Cursor, and other coding agents without lock-in.
- **Executable todos & evidence logs**: Tasks are structured, trackable, and produce verifiable handoffs between agents.
- **3,732+ GitHub stars** and growing fast, indicating strong community adoption.
- **Python-based**: Easy to extend and integrate into existing AI agent workflows.
- **Enables multi-agent collaboration**: Agents can hand off work, review each other's code, and coordinate within a single pipeline.

## My Notes

This fits directly into the AI agent orchestration space. For the wardrobe app project, if agents are used for code generation, LoopX could provide structured handoffs between research, design, and implementation agents.

## Related

- [[Strix — Open-Source AI Pentesting Tool]]
- [[T3 Code — Agent Harness Control Surface]]
- [[Shepherd — Reversible Runtime for AI Agents]]
