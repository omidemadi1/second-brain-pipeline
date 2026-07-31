---
title: "Opencode + Brick — 80% Inference Cost Reduction via Semantic Routing"
source: null
platform: note
content_type: tool
date_saved: 2026-07-29
date_processed: 2026-07-30
category: AI & Machine Learning
tags:
  - inference-optimization
  - cost-reduction
  - semantic-routing
  - ai-costs
  - model-routing
  - subagents
  - privacy-focused-ai
  - opencode
  - brick
  - regolo
  - ai-infrastructure
  - llm-optimization
  - model-selection
  - developer-tools
rating: worth-deep-reading
author: AiSegaro
---

## Summary

Opencode + Brick achieves an 80% reduction in inference costs through semantic routing. The system uses SubAgents and Regolo to analyze incoming prompts and route them to the optimal model — sending simple queries to cheaper models while reserving expensive frontier models for complex reasoning tasks. This approach also prioritizes privacy by enabling local model routing where appropriate.

## Key Takeaways

- **80% cost reduction** by routing prompts to appropriately-sized models instead of using the most expensive model for everything
- **Semantic routing** via SubAgents analyzes prompt complexity and content to determine the best model
- **Regolo** acts as the routing layer, directing traffic to optimal endpoints
- **Privacy advantage** — sensitive prompts can be routed to local/self-hosted models
- Applicable to any multi-model AI pipeline or coding assistant setup

## My Notes

This is a compelling approach to the LLM cost problem. Rather than using one model for everything, semantic routing matches prompt complexity to model capability. This is especially relevant for coding assistants and agentic workflows where many sub-tasks don't need frontier-level intelligence. Worth investigating how to implement this pattern with existing tools.

## Related
- [[Llama-cpp-Optimization-Tool-30B-on-6GB-VRAM]] — Local inference optimization
- [[Qwen-Free-API-for-Hermes-and-AI-Harnesses]] — Free LLM APIs
- [[Brinicle-Resource-Efficient-Vector-Index]] — Efficient ML infrastructure
- [[serving-llms-vllm]] (existing Hermes skill concept)
