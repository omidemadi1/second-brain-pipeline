---
title: "Madmail — Self-Hosted Chat Relay for Delta Chat"
source: "https://github.com/themadorg/madmail"
platform: github
content_type: tool
date_saved: 2026-08-11
date_processed: 2026-08-12
category: "DevOps & Infrastructure"
tags:
  - self-hosted
  - chat-server
  - delta-chat
  - rust
  - pgp-encryption
  - deltachat-relay
  - email-server
  - decentralized-messaging
  - internet-outage
  - resilient-messaging
  - open-source
  - privacy
  - lightweight
rating: reference
author: "@RepoFA"
---

# Madmail — Self-Hosted Chat Relay for Delta Chat

## Summary

Madmail is a lightweight, single-binary chat relay server written in Rust, designed for Delta Chat — an email-based messaging protocol. It provides self-hosted messaging infrastructure that works even during internet outages (via email fallback). Features include PGP-only encryption, message storage, and real-time communication. The key value proposition is having your own messaging server that doesn't depend on centralized services like Google. For environments with frequent internet disruptions, a self-hosted Delta Chat relay could be an excellent backup communication channel. 184 GitHub stars and actively maintained.

## Key Takeaways

- Single binary in Rust — lightweight and easy to deploy
- PGP-only encryption for all messages
- Works with Delta Chat clients on mobile and desktop
- Email-based protocol provides resilience during internet outages
- No dependency on centralized services (Google, etc.)
- 184 GitHub stars, active development

## My Notes

- Interesting backup communication option for internet outages in Iran
- Delta Chat works over email — could use with any email provider
- PGP-only means no plaintext storage
- Worth considering for Proxmox homelab as a communication layer between nodes

## Related

- [[DevOps & Infrastructure]]
