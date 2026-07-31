---
title: "Ava-82M — Farsi TTS Model from Kokoro"
source: "https://huggingface.co/xmanii/Ava-82M"
platform: web
content_type: tool
date_saved: "2026-07-30"
date_processed: "2026-07-31"
category: "AI & Machine Learning"
tags:
  - text-to-speech
  - farsi
  - persian
  - kokoro
  - tts-model
  - huggingface
  - fine-tuning
  - low-cost-training
  - audio-generation
  - single-speaker
  - 24khz
  - styletts2
  - istftnet
  - multilingual-ai
rating: worth-deep-reading
author: xmanii
---

## Summary

**What:** Ava-82M is a Farsi (Persian) text-to-speech model fine-tuned from Kokoro-82M, producing 24kHz single-speaker Persian speech with ~$0 budget training cost.

**Key features:**
- 82M parameters, under 400MB model size
- Trained on ~20 hours of Farsi data in 2 stages
- Stage 2 training on L40S took 107 minutes, cost $0.61
- Total training cost: $0.90
- Includes Persian text frontend, number/date normalization
- Boundary cleanup for artifact-free output
- CPU inference on Apple Silicon (~4.5s speech in ~0.9s)
- `pip install` from HuggingFace, ready to use

**Use case:** Developers and researchers needing Farsi/Persian speech synthesis for applications, content creation, or accessibility features.

> Training a usable TTS model for under $1 makes this an incredible demonstration of accessible AI development.

## Key Takeaways

- Sub-$1 training cost demonstrates democratized AI model creation
- The two-stage training approach (10h clean + 9h additional) is practical
- Built on Kokoro's efficient StyleTTS2/iSTFTNet architecture
- Persian-specific frontend handles Arabic/Persian digits, ordinals, and ezafe
- Boundary cleanup removes synthesis artifacts without modifying pauses
- Informal listening tests showed improved tone, pace, and stability over v0.1

## My Notes

- The $0.90 training cost is remarkable — demonstrates accessible AI
- Could be useful for Persian language applications and content
- The Kokoro base model architecture is worth exploring further
- The two-stage training approach is a practical recipe for other languages
- Should test output quality for potential integration

## Related
- [[Grok-Voice-Think-Fast-2.0]] — Voice AI
- [[Tuby-Persian-Subtitle-Translator-YouTube]] — Persian language tools
- [[Google-Flow-Music-Lyria-3.5-Music-Generation]] — Audio generation
