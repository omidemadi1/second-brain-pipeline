---
title: "Mizan v3 — Persian Decision Model (3B, GGUF)"
source: "https://huggingface.co/xmanii/Mizan-4B"
platform: huggingface
content_type: tool
date_saved: "2026-10-21"
date_processed: "2026-10-22"
category: "AI & Machine Learning/Models & Research"
tags:
  - decision-model
  - persian
  - farsi
  - nlp
  - gguf
  - llama-cpp
  - local-inference
  - calibrated-probability
  - qwen
  - apache-2.0
  - text-classification
  - moderation
  - ticket-routing
  - system-one
  - low-vram
rating: worth-deep-reading
author: "Nimruz"
---

## Summary

**What:** Mizan v3 is a Persian-first **decision model**: give it a record (text or JSON) plus a set of typed questions, and it returns a calibrated probability for every allowed answer in **one forward pass** — no text generation, no parsing, no invented labels.

**Key facts:**
- Built by Nimruz; the shared link `xmanii/Mizan-4B` resolves to **`Nimruz/Mizan-v3-3B`** (decides from layer 20 of Qwen3.5-4B's 32)
- Question types: **choice** (`criteria` map → key + confidence + probabilities), **noul** (probability of "yes"), **score** (expected level on a rubric + per-level probabilities)
- **Q4_K_M GGUF is 1.9 GB**, answers in ~55 ms on an entry-level GPU — 1.5× faster than Mizan 1.0; runs on CPU with `llama-server -ngl 0`
- **Jev / SystemOne compatible** — same request/response body as `/v1/systemone`, so it is a drop-in for that API shape
- **Apache-2.0**, trained only on commercially usable data; requires llama.cpp build b11443 or newer
- Scores **82.5% on 3,000 real Persian records** (vs 83.0% Clef-Flash 9B, 83.4% Clef 27B) and is the **best-calibrated** model tested; **91.1 on Tasmim-Bench** with the lowest score error on that leaderboard
- No vision in v3 — use **Mizan v2 (4B, text+images, 2.7 GB + 0.37 GB)** for camera frames, receipts, product photos

**Use case:** Persian ticket routing by policy, severity/urgency/risk scoring, next-step decisions, fact checks against a record, moderation/sentiment/intent on comments, support messages, SMS, scam ads and résumés.

## Key Takeaways

- It reads the *policy in the record* and follows it, even when the rule goes against intuition — that is what makes it usable for routing and scoring rather than just sentiment.
- Calibration is the selling point over raw accuracy: probabilities you can threshold, and it beats models 3–9× its size on that axis.
- 1.9 GB at Q4 means this runs on a laptop beside everything else — the cheapest useful Persian classifier in the vault so far.
- Answers come back fully typed (`{"sentiment": {"type": "choice", "choice": "negative", "confidence": 0.989, ...}}`), so downstream code needs no parsing.
- Numbers differ between the announcement post and the model card: the post claims 78.7% and ~2.5 GB RAM, the card shows 82.5% and a 1.9 GB Q4. Trust the card for planning; re-measure on your own data before production.

## My Notes

- Immediately testable: route Persian support/review text with a rubric in the record, then compare against the current LLM prompt on the same 100 real messages.
- Because it speaks `/v1/systemone`, it can sit behind the same endpoint as [[Decision-3.0-Open-Multimodal-Decision-Models]] and Jev — one client, three backends, easy A/B.
- Needs llama.cpp b11443+; check the local build number before wiring it into anything.

## Related

- [[Decision-3.0-Open-Multimodal-Decision-Models]] — general multimodal decision family, higher ceiling, unverified Persian
- [[Perplexity-Decider-v1.1-Open-Weights-Clinical-Decisions]] — the closed-domain decider benchmark to compare against
- [[Bina 0.1 - Persian OCR Model]] — Persian OCR, pairs with Mizan for scanned Persian records
- [[Ava-82M-Farsi-TTS-Model]] — another small, Persian-first open model
- [[Llama-cpp-Optimization-Tool-30B-on-6GB-VRAM]] — llama.cpp serving and VRAM budgeting
