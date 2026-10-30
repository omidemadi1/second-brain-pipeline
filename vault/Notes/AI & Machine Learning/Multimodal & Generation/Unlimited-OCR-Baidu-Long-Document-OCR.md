---
title: "Unlimited OCR — Baidu's Long-Document OCR Model"
source: "https://huggingface.co/baidu/Unlimited-OCR"
platform: huggingface
content_type: tool
date_saved: "2026-10-21"
date_processed: "2026-10-22"
category: "AI & Machine Learning/Multimodal & Generation"
tags:
  - ocr
  - document-parsing
  - pdf-extraction
  - long-context
  - long-document
  - vision-language-model
  - multimodal
  - open-weights
  - local-inference
  - vllm
  - sglang
  - llama-cpp
  - ollama
  - baidu
  - document-ai
rating: worth-deep-reading
author: "Baidu"
---

## Summary

**What:** Unlimited-OCR is Baidu's open-weight OCR / document-parsing model, positioned as "one-shot long-horizon parsing" — parse an entire 100-page PDF in a single pass instead of page-by-page.

**Key features:**
- ~3B parameters, 32K text window — long documents stay in one context instead of being chunked
- Reportedly ~93% accuracy, ~6 points above the baseline, with error rate under 0.11 on documents of 40+ pages (per the release notes / post)
- Multilingual, runs fully locally — nothing leaves the machine
- Served by Transformers, vLLM, SGLang, Docker Model Runner, and via GGUF on llama.cpp / Ollama / LM Studio
- Training support through ms-swift; paper on arXiv; also mirrored on ModelScope and Baidu Cloud

**Use case:** anyone who needs to turn scanned or digital PDFs (contracts, papers, invoices, books) into structured text at home — especially long documents where per-page OCR loses cross-page context.

## Key Takeaways

- The claim that matters is the 32K window + one-shot parsing: OCR quality on long PDFs is usually limited by chunking, not by character recognition.
- Dependency surface is narrow and standard (torch 2.10, transformers 4.57.1, CUDA 12.9, pymupdf/psutil) — no exotic stack.
- Serving options are the same as any modern VLM, so it slots into an existing vLLM/SGLang box or a llama.cpp laptop.
- Quantized GGUF builds make it a candidate for local, offline document processing where cloud OCR is not acceptable.
- Released 2026-06-22; vLLM support landed 2026-06-28, so the deployment story matured within a week of release.

## My Notes

- Worth benchmarking against [[Bina 0.1 - Persian OCR Model]] for Persian documents — Baidu's multilingual claim vs a Persian-tuned checkpoint is the real test for this vault.
- The 100-page single-pass claim is the differentiator; verify on a real 40+ page Persian PDF before trusting it for bulk work.
- If it holds up, this is the missing piece for ingesting paper/scanned material into the Second Brain pipeline instead of manual transcription.

## Related

- [[Bina 0.1 - Persian OCR Model]] — Persian/Farsi OCR checkpoint; the direct comparison target
- [[Roboflow Supervision - Computer Vision Library]] — CV toolkit for post-processing detections
- [[Llama-cpp-Optimization-Tool-30B-on-6GB-VRAM]] — running large models on small GPUs, relevant for local serving
- [[Wan2GP-Free-AI-Video-Studio]] — another local, low-VRAM multimodal stack
- [[NVIDIA-PAIR-Distributed-Local-Inference-Clustering]] — scaling local inference across machines
