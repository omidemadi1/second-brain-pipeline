---
title: "Graph Engineering — 7 Repos That Make It Work"
source: "https://x.com/i/status/2081787771333546438"
platform: x
content_type: reference
date_saved: 2026-07-28
date_processed: 2026-07-29
category: AI & Machine Learning
tags: [graph-engineering, ai-agents, langgraph, microsoft-agent-framework, temporal, graphify, gitnexus, graphiti, cognee, agent-orchestration, knowledge-graphs, open-source, developer-tools, agent-memory, workflow-automation, code-intelligence, agent-persistence, temporal-memory]
rating: worth-deep-reading
author: Yarchi (@undefinedKi)
---

## Summary

Yarchi's thread breaks graph engineering into two halves: the graph that runs the work (execution) and the graph that the work looks things up in (knowledge). Seven repos are recommended across both categories.

**Execution layer:**
1. **LangGraph** (38k stars, MIT) — Draw agent steps as a diagram, execute with progress saving. Crash at step 40, resume at step 40. Supports human-in-the-loop pauses.
2. **Microsoft Agent Framework** (12k stars, MIT) — Same concept for .NET/Python teams. Merged AutoGen + Semantic Kernel into one framework.
3. **Temporal** — Process durability layer. Makes processes survive server crashes, restarts, and days of waiting. Not built for AI, which is why it works.

**Knowledge layer:**
4. **Graphify** (97k stars, Apache 2.0) — Point at any folder, maps everything into one connected graph. Notes, PDFs, code, images, spreadsheets. Agent queries the map instead of opening files.
5. **GitNexus** (45k stars) — Code-only deep analysis. Traces function calls, imports, class inheritance across entire repos. Agent stops editing files whose dependencies it never read.
6. **Graphiti** (29k stars, Apache 2.0) — Temporal-aware memory. Knows when a fact was true. "Who owned this account in February?" answers February, not today.
7. **Cognee** (29k stars, Apache 2.0) — Turns documents into a queryable graph on a single Postgres instance. Nothing leaves your machine.

## Key Takeaways

- Graph engineering needs both execution (running the work) and knowledge (looking things up) halves
- LangGraph is the most popular execution framework with checkpoint-based resume capability
- Microsoft Agent Framework consolidates AutoGen + Semantic Kernel for .NET/Python teams
- Temporal provides battle-tested process durability underneath AI workflows
- Graphify can map any folder of mixed content into a queryable knowledge graph (97k stars)
- GitNexus traces code dependencies deeply so agents don't edit blind
- Graphiti provides temporal memory — knowing when facts were true, not just what's true now
- Cognee runs entirely on your own Postgres for full data sovereignty

## My Notes

This is a follow-up to the earlier graph engineering posts from Argona. The distinction between execution graphs and knowledge graphs is useful for system design. Graphify's 97k stars suggest huge interest in turning arbitrary file collections into agent-queryable knowledge. Graphiti's temporal memory is particularly interesting for agents that need historical context.

## Related
- [[Graph Engineering Overview]] — Graph engineering fundamentals
- [[Graph Engineering — The Layer Above Prompting]] — Graph concepts
- [[Graphify-Knowledge-Graph-from-Codebase]] — Code knowledge graphs
- [[langchain]] — GraphRAG framework
- [[Brinicle-Resource-Efficient-Vector-Index]] — Vector indexing
