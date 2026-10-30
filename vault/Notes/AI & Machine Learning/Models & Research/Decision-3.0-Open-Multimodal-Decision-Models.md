---
title: "Decision 3.0 (d3) — Open Multimodal Decision Models"
source: "https://huggingface.co/collections/vllm-sr/decision-30"
platform: huggingface
content_type: tool
date_saved: "2026-10-21"
date_processed: "2026-10-22"
category: "AI & Machine Learning/Models & Research"
tags:
  - decision-model
  - vllm
  - semantic-router
  - d3
  - open-weights
  - multimodal
  - apache-2.0
  - calibrated-probability
  - guardrails
  - llm-routing
  - typed-questions
  - model-family
  - local-inference
  - system-one
rating: worth-deep-reading
author: "vLLM Semantic Router Team"
---

## Summary

**What:** Decision 3.0 (d3) is a family of open, multimodal **decision models** from the vLLM Semantic Router team. They do not write text — they read a record (text, JSON, images) and answer typed questions about it, returning a probability for every allowed answer in one call.

**Key features:**
- Sizes spanning roughly **0.6B → 27B**, Apache-2.0 — pick the one that fits the hardware (the whole point of the size ladder)
- Three question types: **Choice** (pick a key), **Yes/No** (probability of yes), **Score** (expected level on a rubric)
- Multimodal: images alongside text and JSON, so screenshots and scans can be classified directly
- Served by vLLM through its structured-decisions API (`docs.vllm.ai` → models/structured_decisions_models → Decision 3.0)
- Named variants: `d3`, `d3-flash`, `d3-edge` (edge is second among its size class but not on the accuracy frontier)

**Benchmarks:** `d3` scores **64.1 on the Jev Decision Index 0.3.2**, ahead of Perplexity Decider v1.1 (62.8) and Jev itself (60.1). Five of the six d3 models sit on that frontier.

**Use case:** the "system one" layer of an agent stack — routing, guardrails, moderation, triage and scoring — where a cheap calibrated label is worth more than a paragraph of reasoning.

## Key Takeaways

- The small sizes are the story: a 0.6–0.8B decision model can run beside the main LLM and decide *which* model/policy handles a request, at near-zero cost.
- Probability-per-answer output removes the parsing step — no regex on JSON, no made-up labels, no "I think maybe".
- Apache-2.0 across the family, and vLLM-native, so it drops into an existing inference box.
- It is the router's router: vLLM Semantic Router ships it precisely because routing decisions should not be delegated to a generative model's prose.
- Third entry in the same emerging category as [[Perplexity-Decider-v1.1-Open-Weights-Clinical-Decisions]] and [[Mizan-v3-Persian-Decision-Model]] — the pattern (fine-tune a small model to emit calibrated labels) is now clearly standard.

## My Notes

- Best candidate so far for Hermes-side routing: `d3-edge` or the smallest size for intent/approval judging, with the 27B reserved for hard cases.
- Because the API is the same request/response shape as Jev/SystemOne, it can be swapped in behind the same endpoint — worth testing against the current router.
- Persian quality is unverified; keep [[Mizan-v3-Persian-Decision-Model]] for Persian records until d3 is measured on the same 3,000-record set.

## Related

- [[Perplexity-Decider-v1.1-Open-Weights-Clinical-Decisions]] — closest competitor, same benchmark
- [[Mizan-v3-Persian-Decision-Model]] — Persian-first decision model, SystemOne-compatible
- [[Ori Eval - AI Model Evaluation by OpenRouter]] — measure a candidate router on your own prompts
- [[Llama-cpp-Optimization-Tool-30B-on-6GB-VRAM]] — running the big end of the size ladder locally
- [[NVIDIA-PAIR-Distributed-Local-Inference-Clustering]] — serving a model family across local machines
