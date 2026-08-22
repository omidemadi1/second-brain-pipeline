---
title: "Diagram Design — Claude Code Skill for Editorial Diagrams"
source: "https://github.com/cathrynlavery/diagram-design"
platform: "github"
content_type: "tool"
date_saved: "2026-08-13"
date_processed: "2026-08-14"
category: "Development"
tags:
  - claude-code
  - diagram-design
  - visual-documentation
  - html-svg
  - editorial-diagrams
  - ai-coding-assistant
  - developer-tools
  - self-contained-output
  - brand-matching
  - semantic-patterns
  - mermaid-alternative
  - drawio-converter
  - in-depth
  - practical
rating: "worth-deep-reading"
author: "cathrynlavery"
---

## Summary

Diagram Design is a Claude Code skill (also available for Codex and Pi) that generates 27 editorial-quality diagram types as self-contained HTML + SVG files. Unlike Mermaid or draw.io, it produces clean, designer-grade output with zero build step. The skill reads your website in ~60 seconds to automatically match brand colors, fonts, and styling. New in v2.3: semantic system patterns that describe behavior separately from layout (queues, policy traces, trust boundaries reuse existing types), plus optional accessible motion for ordered explanations while keeping static HTML as default. Outputs are fully editable and portable — just open the HTML file anywhere.

## Key Takeaways

- **27 diagram types** covering architecture, flows, timelines, loops, trust boundaries, queues, and semantic system patterns
- **Self-contained HTML/SVG** — no dependencies, no build step, works offline
- **Auto brand matching** — reads your site and applies your design system automatically
- **Semantic patterns** (v2.3) — behavior-described patterns (queue, retry loop, trust boundary) reuse visual types without expanding the catalog
- **Mermaid/draw.io converter** — redraws existing sources at chosen format, size, and detail level
- **Optional motion** — accessible animations for step-by-step explanations, static by default
- **Cross-agent** — works with Claude Code, Codex, and Pi
- **14.6k+ stars** — actively maintained (96 commits, recent updates hours ago)
- **MIT licensed** — free for commercial use

## My Notes

This could replace Mermaid for documentation where visual quality matters. The brand-matching feature is unique — most diagram tools require manual styling. Semantic patterns are a smart abstraction: instead of 100+ diagram types, you have ~27 visual forms + behavioral patterns that map to them. Useful for: architecture docs, system design reviews, API flow diagrams, incident postmortems, onboarding materials. The "editorial quality" claim is backed by the examples shown — clean typography, proper spacing, no "Mermaid slop" (shadows, rigid layouts).

Potential integration: Could use this in our AI wardrobe app for architecture diagrams, user flow docs, or even generating visual explanations of outfit recommendation logic.

## Related

- [[AI & Machine Learning/Claude Code]] (if exists)
- [[Development/Mermaid vs Custom Diagram Tools]]
- [[Design & Visual Documentation]]
- [[diagram-design-editorial-diagrams]]
- [[Scroll-World - 3D Scrollable Product Pages]]
- [[AI Website Cloner Template — Multi-Agent Code Generation]]
- Source: https://github.com/cathrynlavery/diagram-design