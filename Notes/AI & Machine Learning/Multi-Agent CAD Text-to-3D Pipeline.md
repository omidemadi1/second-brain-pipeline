---
title: "Multi-Agent CAD — Open-Source Text-to-CAD Pipeline"
source: "https://github.com/Pan-Chera/Multi-Agent-CAD"
platform: github
content_type: tool
date_saved: 2026-08-08
date_processed: 2026-08-09
category: AI & Machine Learning
tags:
  - text-to-cad
  - 3d-modeling
  - 3d-printing
  - multi-agent
  - cad
  - generative-design
  - langgraph
  - build123d
  - opencascade
  - step-file
  - mechanical-engineering
  - llm-agent
  - qwen
  - aider
  - python
rating: worth-deep-reading
author: Pan-Chera
---

## Summary

**MAC (Multi-Agent CAD)** is an open-source decoupled multi-agent framework for text-to-CAD generation via constrained test-time compute. It generates 3D CAD assets from natural language descriptions at approximately **$0.15 each** — claimed to be 13x cheaper than CAD Skills (a comparable commercial approach). Built with LangGraph for agent orchestration, Build123d and OpenCASCADE for CAD geometry, and Qwen as the LLM backbone. Produces STEP files suitable for 3D printing and mechanical engineering workflows. 481 GitHub stars.

## Key Takeaways

- **What**: Text-to-CAD pipeline generating STEP files from natural language
- **Cost**: ~$0.15 per generation, 13x cheaper than alternatives
- **Stack**: LangGraph (orchestration) + Build123d/OpenCASCADE (geometry) + Qwen (LLM)
- **Output**: STEP files — standard format for CAD/3D printing
- **Architecture**: Decoupled multi-agent — constrained test-time compute
- **Use cases**: 3D printing, mechanical engineering, rapid prototyping
- **Status**: Open-source, 481 stars, actively maintained

## My Notes

Interesting for anyone doing 3D printing or prototyping. The multi-agent approach with constrained compute is a smart way to get reliable CAD output from LLMs. Could be useful for the AI wardrobe app if we ever need physical product prototyping. Worth watching as the text-to-CAD space matures.

## Related

- [[Mixamo-LLM-Mocap-Video-to-3D-Animation]] — Video-to-animation pipeline for Mixamo characters
- [[Paritok Context Compression Gateway]]
- [[Repowise Codebase Intelligence for AI Assistants]]
