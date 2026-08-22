---
title: "Firecrawl Keyless Web Search for OpenCode"
source: "https://x.com/firecrawl/status/2087209828800209193"
platform: x
content_type: tool
date_saved: "2026-08-12"
date_processed: "2026-08-13"
category: "Development"
tags:
  - firecrawl
  - opencode
  - web-search
  - keyless
  - no-api-key
  - code-agent
  - ai-coding
  - web-scraping
  - simpleqa
  - search-provider
  - dev-tools
  - opencode2
  - mcp
  - ai-agent-tools
  - developer-productivity
rating: reference
author: "Firecrawl (@firecrawl)"
---

# Firecrawl Keyless Web Search for OpenCode

## Summary

Firecrawl announced integration as a keyless web search provider in OpenCode (the AI coding agent platform). The key features are:

- **Zero setup required**: No API key, no account, no signup needed — just select Firecrawl as your search provider in OpenCode settings.
- **94.7% accuracy on SimpleQA benchmark**: State-of-the-art accuracy for live web results delivered to AI coding agents.
- **MCP-based integration**: Provides firecrawl_search, firecrawl_scrape, and firecrawl_parse tools via MCP (Model Context Protocol).
- **Free tier**: 1,000 free credits/month for keyless users, shared across same public IP.
- **How to activate**: Update opencode2, go to MCP settings, select Firecrawl as the search provider.

Firecrawl previously launched their keyless program in June 2026, offering 1,000 free monthly credits without an account. The OpenCode integration makes this accessible to AI coding agents that need live web data during development — looking up documentation, finding solutions, checking current library versions, etc.

## Key Takeaways

- Firecrawl is now a keyless (no API key) option for web search in OpenCode
- 94.7% accuracy on SimpleQA — higher than many paid alternatives
- Free tier: 1,000 credits/month, shared across same public IP
- Setup: update opencode2, select Firecrawl in search settings
- Also provides scraping and parsing via MCP tools
- Particularly useful for coding agents that need real-time web data

## My Notes

This is directly relevant since we use OpenCode in the Hermes skill stack. The keyless option means we could add web search capability to our coding agent workflow without any API key management.

Potential use case: when opencode needs to look up current docs, find solutions, or verify library versions during coding tasks — this gives it live web access for free.

The 1,000 free credits/month shared across same IP is a consideration for our VPS setup.

## Related

- [[crawl4ai-llm-friendly-web-crawler]]
- [[Keenable-Web-Search-for-AI-Agents]]
- [[Agent-Reach-Social-Media-Access-for-Agents]]
- [[PixelRAG - AI-Powered Web Scraping]]
- [[Browser Use - AI Browser Automation]]
- [[Agent-Reach-Multi-Platform-Internet-Access-for-AI-Agents]]
