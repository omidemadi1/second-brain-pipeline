---
title: "OpenHaystack — Open-Source AirTag Alternative for Apple Find My Network"
source: "https://share.google/474v0XE6vSgiz4JRS"
platform: "web"
content_type: "tool"
date_saved: "2026-08-16T17:58:12.183142+03:30"
date_processed: "2026-08-17"
category: "DevOps & Infrastructure"
tags:
  - openhaystack
  - airtag-alternative
  - find-my-network
  - apple-find-my
  - bluetooth-tracking
  - hardware-trackers
  - diy-hardware
  - iot
  - privacy-focused
  - open-source
  - seemoo-lab
  - embedded-systems
  - firmware
  - practical
  - hardware
rating: "worth-deep-reading"
author: "Tom Dörr / SEEMOO Lab"
---

## Summary

OpenHaystack (by SEEMOO Lab, TU Darmstadt) is an open-source framework for building custom Bluetooth trackers compatible with Apple's massive Find My network. It lets you create DIY "AirTags" using off-the-shelf hardware (ESP32, Nordic nRF52, etc.) that piggyback on Apple's billion-device mesh network for location reporting — no Apple hardware required. The project includes firmware, a macOS app for management, and supports offline finding via Bluetooth LE advertising. GitHub: seemoo-lab/openhaystack. Related: OpenTag (UWB-based alternative).

## Key Takeaways

- **DIY AirTags** — Build custom trackers using ESP32/nRF52 boards
- **Leverages Apple Find My** — Billion-device mesh network, no subscription
- **Privacy-preserving** — End-to-end encryption, Apple can't see locations
- **Open-source firmware & app** — Full control, auditable code
- **Offline finding** — BLE advertising works without internet on tracker
- **Research-grade** — From SEEMOO Lab (TU Darmstadt), security-focused
- **Low cost** — ~$5-15 per tracker vs $29/official AirTag

## My Notes

Relevant for homelab/Proxmox monitoring — could build custom asset trackers for server equipment, network gear, or personal items. The ESP32 support makes it accessible for hobbyist hardware projects.

## Related

- [[Proxmox Manager — VMs, LXCs, Storage, Networking]] — Homelab infrastructure
- [[Networking]] — Category for network-related hardware projects