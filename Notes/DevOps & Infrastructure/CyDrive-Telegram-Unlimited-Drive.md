---
title: "CyDrive — Turn Telegram Into Unlimited Windows Drive (Zero Disk Footprint)"
source: "https://github.com/thecynetx/CyDrive"
platform: youtube
content_type: tool
date_saved: "2026-08-27"
date_processed: "2026-08-28"
category: "DevOps & Infrastructure"
tags: [cydrive, telegram, cloud-storage, unlimited-storage, windows, webdav, virtual-drive, file-sync, self-hosted, open-source, python, sqlite, mtproto, zero-disk, network-drive]
rating: worth-deep-reading
author: "Cynet (thecynetx)"
---

## Summary

CyDrive is an open-source project that maps a Telegram bot's cloud storage to a native Windows network drive (e.g., Y:), effectively turning Telegram into an unlimited, free cloud storage solution.

Key details:
- **How it works**: Uses Telegram Bot API (MTProto) to stream files asynchronously. Files are stored in Telegram's cloud, with metadata indexed in a local SQLite database. The drive appears as a real Windows drive via WebDAV protocol.
- **Zero disk footprint** — files live in Telegram's servers, not on local disk. A multi-GB project folder can be dragged into Y: without consuming local storage.
- **Web UI** — includes a cyberpunk-themed web interface for managing files
- **AES-256 encryption** — optional encryption layer for stored files
- **Setup requires**: Telegram Bot (via @BotFather), user info (via @userinfobot), Python environment
- **Open source** — GitHub repo at thecynetx/CyDrive, MIT licensed
- **Limitations**: File size limits may apply per Telegram API, not suitable for real-time large file editing (streaming latency)

**Why it's interesting**: For users with limited disk space, this offers genuinely unlimited storage using Telegram's infrastructure. However, it depends on Telegram's bot API reliability and rate limits for heavy use.

## My Notes

Interesting concept but has practical limits — Telegram bot API has file size and bandwidth restrictions. Could be useful for cold storage or backups rather than active use. Worth monitoring but not a primary storage solution.

## Related

- Related to Telegram-Drive projects (caamer20/darwix) — similar concept, different implementations
- [[Coolify — Self-Hosted Vercel Heroku Alternative]] — self-hosted infrastructure for deploying tools
