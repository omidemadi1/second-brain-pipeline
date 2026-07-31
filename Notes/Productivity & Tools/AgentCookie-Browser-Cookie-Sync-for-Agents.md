---
title: "AgentCookie — Browser Cookie Sync for AI Agents"
source: "https://agentcookie.dev/"
platform: web
content_type: tool
date_saved: "2026-07-30"
date_processed: "2026-07-31"
category: "Productivity & Tools"
tags:
  - browser-automation
  - cookie-sync
  - ai-agents
  - tailscale
  - encrypted-sync
  - session-management
  - cli-tokens
  - api-keys
  - openclaw
  - hermes-agent
  - macos
  - developer-tool
  - authentication
  - secrets-management
rating: worth-deep-reading
author: mvanhorn
---

## Summary

**What:** AgentCookie is an open-source tool that syncs browser cookies, CLI tokens, and API keys with AI agents using encrypted Tailscale connections.

**Key features:**
- Continuous laptop → agent sync of browser cookies
- Per-CLI secrets bus for bearer tokens and API keys
- Encrypted over Tailscale (AES-256-GCM)
- Works with Chrome, Stripe, Linear, Notion, Slack, and dozens more
- v2 adoption standard with agentcookie.toml manifests
- 449+ unit tests across 26 packages
- macOS only (both ends)

**Use case:** Developers running AI agents on a second machine who need their agents to access authenticated services without manual cookie/key transfers.

> Solves the "my agent can't log into my services" problem securely.

## Key Takeaways

- Eliminates manual cookie and token copying between machines
- Tailscale encryption means no data exposure over the network
- The v2 adoption standard makes integration declarative
- Supports both browser cookies and CLI secrets in one tool
- Headless install over SSH — no GUI required
- Apple Developer ID signed for macOS security

## My Notes

- This solves a real pain point for multi-machine AI agent setups
- The Tailscale integration is elegant — encrypted by default
- macOS-only limits applicability but the approach is sound
- Worth monitoring for cross-platform expansion
- The 449+ tests indicate production-quality engineering

## Related
- [[Keenable-Web-Search-for-AI-Agents]] — Agent infrastructure
- [[Agent-Reach-Social-Media-Access-for-Agents]] — Agent data access
- [[awesome-hermes-agent]] — Hermes ecosystem
