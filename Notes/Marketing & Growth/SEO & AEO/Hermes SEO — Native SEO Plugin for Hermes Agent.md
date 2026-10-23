---
title: "Hermes SEO — Native SEO Plugin for Hermes Agent"
id: "3f5927885102"
source: "https://github.com/yuzushi-dev/hermes-seo"
platform: github
content_type: tool
date_saved: 2026-10-22T10:54:36+03:30
date_processed: 2026-10-23
category: "Marketing & Growth/SEO & AEO"
tags:
  - seo
  - hermes-agent
  - plugin
  - agent-skills
  - technical-seo
  - schema-org
  - json-ld
  - geo
  - ai-search
  - site-audit
  - content-brief
  - local-seo
  - international-seo
  - python
  - mit
rating: worth-deep-reading
author: "yuzushi-dev (shared by @AHSeslami)"
---

# Hermes SEO — Native SEO Plugin for Hermes Agent

## Summary

**hermes-seo** ports the well-known Claude SEO workflow set into a native Hermes Agent plugin. It packages 25 SEO workflow skills plus a central **SEO Router** skill, 19 role-specific skills, 56 helper scripts, Schema.org templates and optional connectors to external SEO services, so Hermes can run an audit end-to-end instead of improvising an SEO answer.

**What it does**

- **Full site audit** — crawl a site, find issues, return a prioritised report instead of a flat list.
- **Technical SEO** — crawlability, indexation, sitemaps, `robots.txt`, canonical tags, HTTP status codes, Lighthouse/Core Web Vitals evidence.
- **Page and content analysis** — evaluate a single URL, or generate a content brief for a target query.
- **Structured data** — validate existing Schema.org markup and produce JSON-LD fixes or new markup.
- **Local SEO** — local visibility and business-profile checks.
- **International SEO** — hreflang and multi-market workflows.
- **GEO / AI search visibility** — how the site shows up in generative/answer engines.
- **Strategy** — a written plan for a site or business type.

**Install**

```
hermes plugins install https://github.com/yuzushi-dev/hermes-seo.git \
  --ref 5f04951e8fddc8b869378236a7ff5b584a0d023d --yes-deps --enable
hermes plugins doctor
```

Requires Hermes Agent 0.22.2+, Python 3.10+, Linux or macOS. `hermes seo setup` downloads Python packages and, unless skipped, Chromium. Validation: `hermes plugins validate`, `hermes plugins doctor --ci`, `rtk pytest -q`.

**Scope and limits**

- Some capabilities need API keys, third-party accounts, or MCP connections; some Google OAuth flows are disabled for now.
- The plugin analyses and recommends — it does not push changes to a live site or guarantee rankings.
- `hermes_seo_run` starts local subprocesses in the Hermes host process, so a Docker terminal sandbox does not contain it. Scripts are allowlisted, and SSRF/DNS-rebinding protections from the upstream project are kept.
- Core is MIT; the FLOW framework prompts stay CC BY 4.0. Schema feedback runs after file writes and reports findings to the model; it does not block writes.

## Key Takeaways

- Closest thing to a turnkey SEO analyst inside Hermes: one router skill dispatches to specialised workflows instead of loading everything at once.
- The evidence-based angle (Lighthouse/CWV, crawl status codes, structured-data validation) is what separates it from prompt-only "SEO advice" packs.
- Setup cost is real: Python deps and a Chromium download, so it wants a normal Linux/macOS box, not a minimal container.
- Positioned as a port of Claude SEO, so the skill structure and report shapes will be familiar if I have seen that project.

## My Notes

- Worth installing on the VPS Hermes and running against a site I actually control first (portfolio or a small client page) — the audit output is the fastest way to judge whether the 25-skill structure is signal or bulk.
- The GEO/AI-search workflows overlap with the vault's AEO notes; useful to compare their checklist against [[Answer Engine Optimization (AEO) Strategy]].
- Risk to watch: `--yes-deps` plus a Chromium download on a small VPS. Check disk and RAM before running setup, and prefer `hermes seo setup` with the browser step skipped unless rendering is needed.
- Do not expect it to edit the site; treat its output as a brief for manual fixes.

## Related

- [[Open SEO - Open Source SEO Tool]]
- [[openseo]]
- [[Google Search Documentation — SEO Fundamentals]]
- [[Answer Engine Optimization (AEO) Strategy]]
- [[Google Search Console Social Account Support]]
- [[Hermes-Bot-Mode-Marketing-Agent-Team]]
- [[awesome-hermes-agent]]
