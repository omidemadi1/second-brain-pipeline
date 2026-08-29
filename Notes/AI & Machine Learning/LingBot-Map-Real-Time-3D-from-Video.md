---
title: "LingBot-Map: Real-Time 3D Scene Reconstruction from Video"
source: "https://www.instagram.com/p/Dbp9VytG9-A/"
platform: instagram
content_type: tool
date_saved: "2026-08-15"
date_processed: "2026-08-16"
category: "AI & Machine Learning"
tags:
  - 3d-reconstruction
  - real-time-3d
  - computer-vision
  - open-source
  - streaming-reconstruction
  - point-cloud
  - single-gpu
  - feed-forward-model
  - scene-mapping
  - depth-estimation
  - visual-slam
  - lingbot-map
  - robbyant
  - robot-perception
  - ar-vr
rating: worth-deep-reading
author: simplifyinai / Robbyant
---

## Summary

LingBot-Map is an open-source feed-forward 3D foundation model by Robbyant (Ant Lingbo Technology) that reconstructs live 3D scenes from a standard RGB video stream — no LiDAR or expensive sensors required. It achieves ~20 fps at 518×378 resolution on a single GPU, holds steady past 10,000 frames without drift, and handles diverse input: drone footage, driving video, and indoor walkthroughs. A 13-minute, ~25,000-frame indoor demo proved long-sequence stability. It outperforms both streaming and offline methods on benchmarks, and is fully open-source on GitHub.

## Key Takeaways

- **Single GPU, real-time**: ~20 fps at 518×378 on one GPU — practical for robotics, AR/VR, and autonomous navigation
- **100% open-source**: Code on GitHub under Robbyant/lingbot-map
- **Long-sequence stable**: Tested past 10,000 frames with no drift; a 13-minute demo with ~25K frames
- **Multi-domain**: Works on drone, driving, and indoor video
- **Feed-forward architecture**: No per-scene optimization needed — runs on streaming data directly
- **Beats benchmarks**: Outperforms existing streaming and offline 3D reconstruction methods

## My Notes

This is particularly interesting for the AI wardrobe app project — real-time 3D body/garment scanning could be a future feature. Also relevant to any Proxmox homelab computer vision experiments.

## Related

- [[Mixamo-LLM-Mocap-Video-to-3D-Animation]] — Video-to-character-animation pipeline using GVHMR + Mixamo
- [[Open Code Review by Alibaba]]
- [[DeepSeek V4 Pro Launch]]
