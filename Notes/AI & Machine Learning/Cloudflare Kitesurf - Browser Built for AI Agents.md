---
title: "Cloudflare Kitesurf - Browser Built for AI Agents"
source: "https://techcrunch.com/2026/08/07/cloudflare-launches-kitesurf-a-browser-built-for-ai-agents"
platform: "web"
content_type: "reference"
date_saved: "2026-08-08"
date_processed: "2026-08-08"
category: "AI & Machine Learning"
tags: ["browser", "ai-agents", "cloudflare", "cloud-browser", "headless-browser", "workers", "firefox-stylo", "boa-js", "prompt-injection-protection", "bot-browser", "scraping", "automation", "free-beta"]
rating: "reference"
author: "Sarah Perez / TechCrunch"
---

## Summary

Cloudflare launched Kitesurf, a cloud-hosted browser designed specifically for AI agents instead of people. Built entirely on Cloudflare Workers in just 12 weeks. Uses Firefox's Stylo CSS parser, Boa JS engine, and a modular rendering engine from Blitz. Significantly more efficient in CPU and memory than Chromium for screenshots and HTML extraction. Passes 215k+ web platform tests. Includes prompt injection protection for the different threat model of AI browsers. Free during beta via Browser Run.

## Key Takeaways

- Cloud-hosted browser purpose-built for AI agents
- More efficient than Chromium for agent tasks (screenshots, HTML extraction)
- Built on Cloudflare Workers with Firefox Stylo + Boa JS engines
- Prompt injection protection built in
- Free beta via Browser Run
- 215k+ web platform tests passing
- Different threat model: no themes, tabs, extensions — focus on context, tokens, cost

## My Notes

Interesting alternative to running headless Chromium. The lower resource usage could be beneficial. The prompt injection protection is directly relevant to the security patterns in the Prompt Injection article.

## Related

- [[Prompt Injection - You Cannot Filter Your Way Out]]
- [[Browser Use - AI Browser Automation]]
