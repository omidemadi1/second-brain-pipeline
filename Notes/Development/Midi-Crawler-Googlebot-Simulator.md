---
title: "Midi Crawler: One-Click Chrome Extension to View Pages as Googlebot Mobile"
source: "https://github.com/mmahdi008/midi-crawler"
platform: "github"
content_type: "tool"
date_saved: "2026-08-29T13:43:09.780311+03:30"
date_processed: "2026-08-30"
category: "Development"
tags: ["seo", "technical-seo", "googlebot", "chrome-extension", "crawling", "rendering", "ssr", "csr", "javascript-seo", "indexing", "devtools", "mahdi-asgari", "open-source", "web-development", "frontend", "in-depth", "practical", "tool"]
rating: "worth-deep-reading"
author: "Mahdi Asgari (@mmahdi008)"
---

## Summary

Midi Crawler is a Chrome extension that instantly toggles the active tab to emulate Googlebot Mobile (Smartphone) with JavaScript disabled — all in one click, no DevTools manual configuration needed. Built by Mahdi Asgari (mmahdiasgari.ir), it solves the tedious workflow of manually setting User-Agent to "Googlebot Smartphone," disabling JavaScript, and refreshing to see raw HTML as Google's crawler sees it.

**Key Features:**
- **One-Click Toggle**: Switch to Googlebot Mobile view instantly
- **JS-Disabled Emulation**: Tests how pages render without JavaScript execution
- **Automated Configuration**: Sets correct Googlebot Mobile User-Agent + Network Conditions
- **SSR vs CSR Comparison**: Inspect source (Ctrl+U) before/after toggle to compare standard HTML vs raw Googlebot output
- **Lightweight & Private**: 83KB, zero data collection, runs entirely in-browser

**Use Cases:**
- Debug rendering mismatches between browser and Googlebot
- Catch client-side JavaScript reliance that blocks indexing
- Verify dynamic content blocks, meta tags, structured data in raw HTML
- Technical SEO audits without leaving the browser

**Install**: Chrome Web Store → `mmijlnphgnfioppbdamppomcjhfidagb` | GitHub: `mmahdi008/midi-crawler`

## Key Takeaways

- **Essential SEO Dev Tool**: Replaces 10+ manual DevTools steps with one click
- **SSR/CSR Audit Accelerator**: Instantly reveals what content Google actually indexes vs. what users see
- **Persian Dev Community**: Built by Iranian developer Mahdi Asgari — shows global SEO tooling innovation
- **Open Source**: Can audit code, contribute, or self-host
- **Complements Search Console**: Pre-deployment check before waiting for GSC crawl

## My Notes

Must-install for any technical SEO work. For our AI wardrobe app, we'll need to verify our React/Next.js pages render critical content (product schema, meta tags, outfit data) without JS. This tool makes that a 2-second check instead of a 5-minute DevTools session. Also useful for debugging why certain pages aren't indexing.

## Related

- [[Technical SEO Audit Checklist]]
- [[Next.js SEO: SSR vs CSR for Googlebot]]
- [[Google Search Console Workflow]]
- [[Structured Data Testing Tools]]
- [[Core Web Vitals & Crawling]]