---
title: "Project Eyes-On — Open Source Global IP Camera Discovery Tool"
source: "https://github.com/Y0oshi/Project-Eyes-On"
platform: "x"
content_type: "tool"
date_saved: "2026-08-21T07:33:10.082389+03:30"
date_processed: "2026-08-22"
category: "Cybersecurity"
tags:
  - "ip-camera-discovery"
  - "osint"
  - "surveillance-tools"
  - "y0oshi"
  - "github-repo"
  - "directory-scraping"
  - "deep-web-dorking"
  - "live-feed-verification"
  - "geoip-enrichment"
  - "multi-threaded"
  - "reconnaissance"
  - "security-research"
  - "camera-enumeration"
  - "open-source-intelligence"
  - "in-depth"
rating: "worth-deep-reading"
author: "Tom Dörr (@tom_doerr)"
---

## Summary

**Project Eyes-On** by Y0oshi (@rde0) is a high-speed, multi-threaded open-source surveillance tool for locating **open IP cameras worldwide**. It combines **directory scraping** (public camera indexes), **deep web dorking** (search engine queries for exposed devices), **live feed verification** (confirming streams are active), and **GeoIP enrichment** (mapping cameras to physical locations). The tool is designed for security researchers and OSINT practitioners to enumerate internet-exposed cameras at scale. Hosted at github.com/Y0oshi/Project-Eyes-On. Tom Dörr's tweet (539 likes, 81 retweets) highlights its combined approach: not just scanning, but verifying feeds and enriching with geographic data. This moves beyond simple Shodan/Censys queries by actively validating streams and providing location context.

## Key Takeaways

- **Multi-source discovery** — Directory scraping + deep web dorking = broader coverage
- **Live verification** — Confirms streams are actually accessible, not just indexed
- **GeoIP enrichment** — Maps each camera to country/city/ISP for geographic analysis
- **High-speed multi-threaded** — Scales to global enumeration efficiently
- **Open source** — github.com/Y0oshi/Project-Eyes-On (Y0oshi has 4 repos total)
- **OSINT workflow** — Directory → Dork → Verify → Enrich pipeline
- **Security research tool** — For authorized testing, vulnerability assessment, awareness
- **Real-time feed validation** — Reduces false positives from stale indexes

## My Notes

Shared by Tom Dörr (same person who shared UI/UX Pro Max Skill) — he curates interesting GitHub security/agent tools. This is a powerful recon tool but clearly for authorized use only. Could be relevant for: network security audits (checking client networks for exposed cameras), homelab security (verifying my own cameras aren't exposed), OSINT research. The GeoIP enrichment is a nice touch for visualizing exposure geographically. Should review the repo for license, usage guidelines, and whether it respects robots.txt/rate limits. The "deep web dorking" suggests it uses search engine APIs (Google, Bing, Shodan) — may need API keys.

## Related

- [[Cybersecurity/OSINT-Tools-and-Frameworks]]
- [[Networking/Network-Security-Auditing]]
- [[DevOps & Infrastructure/Proxmox-Homelab-Monitoring]]
- [[Cybersecurity/Shodan-Censys-Alternatives]]