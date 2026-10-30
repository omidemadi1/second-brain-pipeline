---
title: "Pele — Fast Mermaid-to-SVG Renderer for Obsidian"
id: "47b83692edd9"
source: "https://pele.run"
platform: web
content_type: tool
date_saved: 2026-10-22T10:52:56+03:30
date_processed: 2026-10-23
category: "Productivity & Tools/Knowledge & Note Tools"
tags:
  - obsidian
  - mermaid
  - diagrams
  - svg
  - rendering
  - visualization
  - javascript
  - npm
  - css-variables
  - performance
  - open-source
  - mit
  - knowledge-management
  - frontend
rating: reference
author: "Obsidian / kepano (shared by @AmirAnonn)"
---

# Pele — Fast Mermaid-to-SVG Renderer for Obsidian

## Summary

**Pele** is a lightweight open-source library from the Obsidian team (by kepano) that renders Mermaid diagram syntax to themeable SVG. It keeps Mermaid as the authoring language and replaces the rendering engine: zero dependencies, MIT licensed, `npm install pele`, and a one-call API — `render(mermaidText)` returns the SVG string for you to inject.

**Key numbers from the project page**

- Bundle size (gzip): **230 kB** vs Mermaid.js **1.6 MB** — about 6× smaller.
- Render time: **0.05–0.3 ms** vs **6–82 ms** — up to ~500× faster.
- Direct dependencies: **0** vs 23.
- Supports every diagram type built into **Mermaid 12.1.0**.

**Key features**

- **Theming via CSS variables** (`--pele-bg`, `--pele-fg`, `--pele-line`, `--pele-surface`, …) — colour changes apply without re-rendering, so light/dark switching is free.
- **Small-screen behaviour** — adapts the layout rather than scaling a fixed-width diagram down.
- Runs at render time in the browser or build step; no headless Chromium, no DOM font measurement service.

## Key Takeaways

- Same syntax, much cheaper engine — this is the "replace the renderer, keep the format" pattern rather than a new diagram language.
- Theming by CSS variables means diagrams inherit the note or site theme instead of shipping baked colours.
- Zero dependencies makes it safe to embed in an Obsidian plugin, a docs site, or a static build.
- Compatibility page exists for the syntax/layout differences from Mermaid, which is the thing to check before relying on exotic diagrams.

## My Notes

- Interesting for two places: rendering diagrams in this vault without the Mermaid plugin's weight, and embedding diagrams in client-facing HTML pages that should match the design system's colours.
- The Wardley map / mindmap / radar / gitGraph examples in the announcement suggest coverage beyond the usual flowchart, but I would verify each type against the compatibility page before using it in a deliverable.
- Not urgent — bookmark for the next time a diagram needs to live outside Obsidian.

## Related

- [[Diagram Design - Editorial SVG HTML Diagram Skill for AI Agents]]
- [[Diagram-Design-Claude-Code-Skill]]
- [[Obsidian Skills - Agent Skills for Obsidian Vault]]
- [[Second-Brain-Pipeline-Telegram-Inbox-to-Obsidian]]
- [[Laravel Truss — Live Database Schema ER Diagram]]
