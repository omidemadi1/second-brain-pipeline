---
title: "Perplexity Decider v1.1 — Open Weights Beat Jev on Clinical Decisions"
source: "https://huggingnews.com/ai/update-perplexity-open-weights-model-beats-jev-in-clinical-decisions-9b4aca8e"
platform: web
content_type: reference
date_saved: "2026-10-21"
date_processed: "2026-10-22"
category: "AI & Machine Learning/Models & Research"
tags:
  - decision-model
  - perplexity
  - open-weights
  - pplx-decider
  - qwen
  - clinical-ai
  - benchmark
  - decision-index
  - openrouter
  - cost-per-decision
  - typed-answers
  - calibrated-probability
  - model-release
  - llm-routing
rating: reference
author: "Perplexity AI"
---

## Summary

Perplexity released **pplx-decider-v1.1-27b**, an open-weights *decision* model — a generative discriminator fine-tuned from Qwen3.8-27B that returns typed answers with probabilities instead of free text.

- In an independent evaluation over 669 medical cases by tester Maziyar Panahi, it answered **643 correctly vs 628 for Jev**.
- **42% lower cost per decision**; priced at **$0.02 per million input tokens with output free** (v1 launched at $0.04/M and was halved for v1.1).
- **250K context**, accepts text, JSON and images.
- Tops the Hugging Face **Decision Index 0.3**; previously placed first among eight models in a Tetris-playing decision simulation.
- Available through **OpenRouter**.

→ Practical read: this is the "system-one" layer — routing, approvals, judging, moderation — where you want a cheap calibrated label, not prose.

## Key Takeaways

- The product being sold is $/decision, not $/token: free output tokens change the economics of high-volume, low-latency classification.
- Fine-tuning a 27B *generator* into a *discriminator* keeps the 250K multimodal context while removing generation cost.
- Evidence is a single independent 669-case evaluation on clinical triage — good signal, narrow domain; treat the 643-vs-628 gap as directional.
- Being on OpenRouter means zero infra to trial it, which makes an A/B against Jev cheap.
- Another entrant in the same lane as [[Decision-3.0-Open-Multimodal-Decision-Models]] and [[Mizan-v3-Persian-Decision-Model]] — the decision-model category is filling out fast.

## My Notes

- Directly relevant to Hermes routing: swap in as the judge/classifier for small in-harness calls (intent, approvals, triage) and measure against the current default.
- Clinical benchmark ≠ Persian support. Persian quality is what [[Mizan-v3-Persian-Decision-Model]] exists for.
- Free output tokens + $0.02/M input makes it a plausible always-on classifier; worth pricing against a local 0.6–3B decision model at current volume.

## Related

- [[Decision-3.0-Open-Multimodal-Decision-Models]] — d3 scores 64.1 on Jev Decision Index 0.3.2 vs 62.8 for this model
- [[Mizan-v3-Persian-Decision-Model]] — Persian-first decision model, Jev/SystemOne-compatible API
- [[Ori Eval - AI Model Evaluation by OpenRouter]] — evaluating models on your own prompts before switching
- [[Qwen 3.8 Max Model Review]] — the Qwen 3.8 family this is fine-tuned from
- [[DeepSeek-V4-Pro-Launch-Dynamic-Pricing-Reasoning-Control]] — another pricing-driven model release
