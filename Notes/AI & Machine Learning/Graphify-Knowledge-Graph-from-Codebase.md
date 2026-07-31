---
title: "Graphify — Turn Codebase into Queryable Knowledge Graph"
source: "https://github.com/Graphify-Labs/graphify"
platform: github
content_type: tool
date_saved: "2026-07-30"
date_processed: "2026-07-31"
category: "AI & Machine Learning"
tags:
  - knowledge-graph
  - code-analysis
  - ai-agents
  - ast-parsing
  - tree-sitter
  - graphrag
  - rag
  - claude-code
  - cursor
  - codex
  - gemini
  - developer-tools
  - code-search
  - leiden-clustering
  - mcp
rating: worth-deep-reading
author: Graphify Labs
---

## Summary

**What:** Graphify turns any codebase (with docs, SQL schemas, configs, and PDFs) into a queryable knowledge graph using local deterministic AST parsing — no vector store needed.

**Key features:**
- Local deterministic AST parsing with tree-sitter (no LLM calls for parsing)
- Generates knowledge graphs with explained edges
- Works with Claude Code, Cursor, Codex, and Gemini CLI as a /graphify skill
- Processes docs, SQL schemas, configs, and PDFs alongside code
- Leiden community detection for clustering related code
- 99k+ stars — one of the most popular AI dev tools

**Use case:** Developers working with large codebases who want to understand code structure, dependencies, and relationships through a queryable knowledge graph.

> This is essentially GraphRAG for code — deterministic, explainable, and runs locally.

## Key Takeaways

- Deterministic AST parsing means consistent, reproducible knowledge graphs
- No vector store dependency keeps it lightweight and self-contained
- Works as a skill/plugin for major AI coding assistants
- Processes heterogeneous sources (code + docs + configs + PDFs)
- Leiden clustering identifies natural code communities
- 99k stars indicates strong community adoption and trust

## My Notes

- This could significantly improve code navigation and understanding
- The "no vector store" approach is appealing for local development
- Worth trying on our own codebases for architecture documentation
- Could complement or replace traditional code search tools
- The skill format makes it easy to integrate into existing workflows

## Related
- [[Imp-Skills-AI-Agent-UI-Design]] — AI agent skill collections
- [[Brinicle-Resource-Efficient-Vector-Index]] — Vector search alternative
- [[Graph Engineering Overview]] — Knowledge graphs for AI
- [[Graph Engineering — The Layer Above Prompting]] — Graph-based AI workflows
- [[Graph Engineering — 7 Repos That Make It Work]] — Graph tool ecosystem
- [[langchain]] — GraphRAG and agent frameworks
