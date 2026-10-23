---
title: "Context Mode — Context Window Optimization for Coding Agents"
id: "1bcf0237559d"
source: "https://github.com/mksglu/context-mode"
platform: github
content_type: tool
date_saved: 2026-10-22T10:49:18+03:30
date_processed: 2026-10-23
category: "AI & Machine Learning/Coding Agents & Harnesses"
tags:
  - context-window
  - context-management
  - mcp
  - mcp-server
  - coding-agents
  - claude-code
  - codex
  - opencode
  - token-optimization
  - fts5
  - sqlite
  - session-memory
  - compaction
  - agent-tooling
  - elastic-license
rating: worth-deep-reading
author: "mksglu (context-mode)"
---

# Context Mode — Context Window Optimization for Coding Agents

## Summary

**Context Mode** is an MCP server plus a set of per-platform hooks that keeps raw tool output out of a coding agent's context window, carries session state across compactions, and enforces a "write a script instead of reading 50 files" routing rule. It targets 17 agent platforms, including Claude Code, Codex, Cursor, opencode, Copilot CLI, Zed, Antigravity and OpenClaw.

The problem it attacks: every MCP call dumps raw data into context (a Playwright snapshot ≈ 56 KB, twenty GitHub issues ≈ 59 KB, one access log ≈ 45 KB). After ~30 minutes roughly 40% of the window is gone, and the next compaction wipes the agent's memory of which files it was editing.

**Key features**

- **Sandboxed tool output** — `ctx_execute` / `ctx_batch_execute` / `ctx_execute_file` run the work in a sandbox and return only the result: its own benchmark figure is 315 KB → 5.4 KB (98% reduction).
- **Session continuity** — file edits, git operations, tasks, errors and decisions are recorded in SQLite; after compaction they are indexed into FTS5 and retrieved by BM25 instead of being re-dumped into the prompt.
- **Think in code** — the agent writes a script that computes the answer and prints only the result (e.g. one `ctx_execute` call replacing 47 file reads at 3.6 KB instead of 700 KB).
- **11 MCP tools** — six sandbox/index tools (`ctx_execute`, `ctx_batch_execute`, `ctx_execute_file`, `ctx_index`, `ctx_search`, `ctx_fetch_and_index`) and five meta tools (`ctx_stats`, `ctx_doctor`, `ctx_upgrade`, `ctx_purge`, `ctx_insight`).
- **No prose-style enforcement** — the routing block controls where data goes, not how the model writes its final answer (an earlier terse/caveman injection was removed after evidence that brevity prompts hurt coding benchmarks).

**Install (Claude Code)**

```
/plugin marketplace add mksglu/context-mode
/plugin install context-mode@context-mode
/context-mode:ctx-doctor
```

Other platforms: `npm install -g context-mode` plus the platform's own plugin/hook install (each has its own config directory in the repo). Non-hook platforms need a one-time routing-file copy.

**Licence:** Elastic License 2.0 (source-available) — free to use, fork and modify; you may not resell it as a hosted service or strip the licence notices.

## Key Takeaways

- It solves the input side of the context problem (tool output), complementing context-compaction strategy rather than replacing it.
- The session DB is the interesting part: after a compaction the agent resumes with facts, not a replayed transcript, and a non-`--continue` session deletes prior data immediately.
- Zero-config for hook-capable platforms; hookless ones need manual routing setup.
- Cost of entry: the injected routing block adds prompt tokens every turn (roughly 2.5K in the Pi integration), so the saving has to come from real tool-output volume.
- The `ctx_insight` dashboard is a hosted, optional extra — the core works fully local.

## My Notes

- Worth testing with opencode before touching the Claude Code setup — same benefit, nothing critical to break.
- The "think in code" pattern is exactly what `execute_code` does here; the useful new idea is persisting session events into SQLite/FTS5 so long multi-day work survives compaction.
- ELv2 is fine for personal use but rules it out as a dependency inside anything resold as a service.
- If the routing block turns out to cost more than it saves on short sessions, test with it enabled only for MCP-heavy sessions.

## Related

- [[Claude Code Context Management - When to Clear and Compact]]
- [[Paritok Context Compression Gateway]]
- [[TencentDB Agent Memory - Smart Context Compression]]
- [[Synapse Local-First Memory for AI Agents]]
- [[Agent Graph Memory - Cost Analysis]]
- [[T3 Code — Agent Harness Control Surface]]
