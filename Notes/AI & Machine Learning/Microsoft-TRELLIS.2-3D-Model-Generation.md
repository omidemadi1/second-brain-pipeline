---
title: "Microsoft TRELLIS.2 — Open Source 3D Model Generation"
source: "https://github.com/microsoft/TRELLIS.2"
platform: github
content_type: tool
date_saved: "2026-07-30"
date_processed: "2026-07-31"
category: "AI & Machine Learning"
tags:
  - 3d-generation
  - image-to-3d
  - microsoft
  - open-source
  - pbr-materials
  - voxel-reconstruction
  - blender
  - unity
  - unreal-engine
  - ai-model
  - computer-graphics
  - 3d-asset
  - real-time-generation
  - texture-generation
  - four-billion-parameters
rating: worth-deep-reading
author: Microsoft
---

## Summary

**What:** Microsoft TRELLIS.2 is a state-of-the-art open-source 3D generation model (4B parameters) that converts any image into a production-ready 3D model in ~3 seconds with full PBR materials.

**Key features:**
- 4 billion parameter model for high-fidelity 3D generation
- Generates textured, physically accurate 3D models from single images
- Full PBR (Physically Based Rendering) materials: base color, roughness, metallic, transparency
- Handles hair, fabric, glass, and complex geometries
- Outputs .glb format ready for Unity, Unreal, and Blender
- Runs locally, generates in ~3 seconds
- Full training codebase is open source

**Use case:** 3D artists, game developers, and designers who need rapid 3D asset creation from reference images.

> This is not a demo or research preview — it's a production-ready tool with full source code.

## Key Takeaways

- 3-second generation time makes this practical for iterative workflows
- Full PBR materials mean output is production-ready, not just visual
- The "field-free" sparse voxel structure (O-Voxel) handles complex topologies
- Local execution ensures privacy and no cloud dependency
- Fine-tunable on custom datasets for studio-specific styles
- Open training codebase enables research and customization

## My Notes

- The 3-second generation claim needs testing
- Could significantly speed up 3D asset creation pipelines
- Worth exploring for game development and VR/AR projects
- The fine-tuning capability is powerful for specialized use cases
- Open training code is rare for models of this quality

## Related
- [[FeyNoBg on Hugging Face]] — HuggingFace visual models
- [[feynobg-background-removal-model]] — Visual AI models
- [[huggingface-hub]] (existing skill concept)
