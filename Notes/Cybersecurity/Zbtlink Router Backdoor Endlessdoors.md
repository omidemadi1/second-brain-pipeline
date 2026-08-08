---
title: "Zbtlink Router Backdoor 'Endlessdoors' — CVE-2026-66747"
source: "https://www.vulncheck.com/blog/zbt-endlessdoors"
platform: telegram
content_type: reference
date_saved: 2026-08-08
date_processed: 2026-08-09
category: Cybersecurity
tags:
  - cybersecurity
  - backdoor
  - router-security
  - iot-security
  - zbtlink
  - endlessdoors
  - vulncheck
  - cve-2026-66747
  - supply-chain-security
  - china-threat
  - embedded-firmware
  - network-security
  - telecom-security
  - threat-intelligence
rating: worth-deep-reading
author: VulnCheck
---

## Summary

VulnCheck discovered a persistent backdoor called **"Endlessdoors"** embedded in 20+ Zbtlink consumer router models manufactured in China. The backdoor (tracked as CVE-2026-66747) silently phones home to a Chinese domain (`rbdg4nzqadui.wikaba[.]com`) every 35 seconds via an implant named `rctl`, started at boot by an init.d script called `skworker`. Whoever controls the resolution of that domain can hijack the outbound communication and obtain an **unauthenticated root shell** on the router — no internet reachability required. Over 100,000 units were sold in the UK alone. Every firmware image on zbtlink.com's download page (~24 images) contains the implant.

## Key Takeaways

- **Scale**: 20+ router models affected, 100K+ units sold in UK alone
- **Mechanism**: `rctl` implant phones home every 35 seconds to a hardcoded Chinese domain
- **Impact**: Full unauthenticated root shell access — complete network takeover
- **Stealth**: Starts via init.d script `skworker` at boot, embedded in every firmware
- **Attack**: Attacker only needs to control DNS resolution of the C2 domain
- **Assigned CVE**: CVE-2026-66747
- **Reported by**: VulnCheck, covered by The Sun, Reuters, CADE project

## My Notes

This is a significant supply-chain security incident. If you or anyone you know uses Zbtlink routers, they should be considered fully compromised. The backdoor is in the firmware itself — no configuration change can disable it. Affected users should replace the hardware entirely. This reinforces the risk of using cheap, unvetted networking equipment from Chinese manufacturers.

## Related

- [[CryptoJS Weak RNG Crypto Wallet Vulnerability]]
- [[Google Search Console Social Account Support]]
