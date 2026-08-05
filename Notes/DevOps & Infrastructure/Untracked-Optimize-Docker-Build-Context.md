---
title: "Untracked — Optimize Docker Build Context by 99.8%"
source: "https://github.com/Kikobeats/untracked"
platform: github
content_type: tool
date_saved: "2026-07-30"
date_processed: "2026-07-31"
category: "DevOps & Infrastructure"
tags:
  - docker
  - build-optimization
  - dockerignore
  - containerization
  - devops
  - javascript
  - cli-tool
  - build-context
  - image-size
  - kiko-beats
  - deployment
  - lambda
  - webpack
  - packaging
rating: worth-deep-reading
author: Kiko Beats
---

## Summary

**What:** Untracked is a CLI tool by Kiko Beats (ex-Vercel dev) that optimizes project output by removing junk and unnecessary files, dramatically reducing build contexts and deployment artifacts.

**Key features:**
- Cuts build context by 99.8% (1.87GB → 2.51MB demonstrated)
- Auto-generates `.dockerignore` rules
- Universal untracked file list for zip/lambda/webpack bundles
- Faster builds, smaller images, reduced bandwidth

**Use case:** DevOps engineers and developers who want to optimize Docker builds, Lambda deployments, and webpack bundles by automatically filtering out unnecessary files.

> Best for: teams with bloated build contexts looking for a quick win.

## Key Takeaways

- Default node_modules and build artifacts massively inflate Docker build contexts
- Untracked provides a universal ignore list based on common junk patterns
- 99.8% size reduction means significantly faster CI/CD pipelines
- Works with Docker, Lambda, webpack, and general zip packaging
- Created by a former Vercel developer with deep deployment expertise

## My Notes

- Should audit our current Docker build contexts
- Could significantly reduce build times in CI/CD
- Worth integrating into our deployment pipeline
- The 99.8% reduction claim is remarkable — needs verification

## Related
- [[docker-kubernetes-production-guide]] — Docker and K8s production
- [[Brinicle-Resource-Efficient-Vector-Index]] — Performance optimization
- [[AI Skills for Home Lab Agents]] — Home lab Docker/DevOps
- [[Idea - Proxmox VM Backup Automation Tool]] — Infrastructure automation
- [[Graphify-Knowledge-Graph-from-Codebase]] — Code analysis tools
- [[proxmox-vm-backup-automation]] — Proxmox automation
