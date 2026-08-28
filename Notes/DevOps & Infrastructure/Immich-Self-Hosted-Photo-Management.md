---
title: "Immich — The One App Every Home Server Needs"
source: "https://www.instagram.com/reel/DY5su_aPTaU/"
platform: instagram
content_type: tool
date_saved: "2026-08-26"
date_processed: "2026-08-28"
category: "DevOps & Infrastructure"
tags: [immich, self-hosted, photo-management, home-server, docker, google-photos-alternative, self-hosting, homelab, media-management, open-source, cloud-alternative, privacy, plex]
rating: reference
author: "Switch and Click"
---

## Summary

Switch and Click recommends Immich as the single most essential self-hosted app for any home server. Immich is an open-source, self-hosted photo and video management platform positioned as a direct replacement for Google Photos.

Key features:
- **Full Google Photos replacement** — face recognition, object detection, map view, timeline, albums, sharing
- **Docker-based deployment** — easy install via docker-compose, runs on any Linux server
- **6GB RAM minimum** — requires modest resources (2 CPU cores + 6GB RAM)
- **Mobile apps** — iOS and Android clients with auto-upload (like Google Photos backup)
- **External library support** — mount existing photo folders without moving them
- **Multi-user** — supports multiple accounts with sharing and permissions
- **WebDAV and API** — integrates with other tools in the self-hosted ecosystem

Why it matters: eliminates dependency on Google/Apple cloud photo storage. Full data ownership, no subscription fees, no privacy concerns. Works with Proxmox/LXC environments for homelab setups.

## My Notes

Already has a Proxmox homelab — Immich would be a natural addition. Needs 6GB RAM which is tight on the VPS but fine on Proxmox. Good option for storing product photos for the wardrobe app project.

## Related

- [[Coolify — Self-Hosted Vercel Heroku Alternative]] — another essential self-hosted app
- [[proxmox-vm-backup-automation]] — Proxmox management for running Immich in a VM
