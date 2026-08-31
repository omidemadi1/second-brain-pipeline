---
title: "MPay Cards — Free Cloud Credits & Trial Activation Guide"
source: null
platform: note
content_type: learning
date_saved: 2026-08-30
date_processed: 2026-08-31
category: DevOps & Infrastructure
tags:
  - mpay
  - cloud-credits
  - aws-free-tier
  - akamai-linode
  - oracle-cloud
  - google-cloud-platform
  - free-tier
  - spotify-trial
  - bin-checker
  - virtual-cards
  - vps
  - hosting
  - ip-blocking
  - hostvds
  - trial-activation
  - infrastructure-costs
rating: worth-deep-reading
author: Ali Rajabian (via email to Omid)
---

# MPay Cards — Free Cloud Credits & Trial Activation Guide

## Summary

Community member Ali Rajabian shared a detailed guide on using MPay virtual cards to activate trials and obtain free cloud credits from major providers. The note covers three key areas:

1. **Spotify Trial Activation**: No Google Pay/Wallet needed — enter card details directly. The critical rule is that the Spotify account region must match the card's issuing country. Use a BIN checker (first 6 digits) to identify the card's country (e.g., BIN 456599 = Singapore).

2. **Free Cloud Credits**: MPay cards can be used to claim significant free credits:
   - **AWS**: $100 base + up to $200 via 5 simple tasks (6-month validity, up to 8GB RAM / 30GB storage)
   - **Akamai (Linode)**: $100 signup credit
   - **Oracle Cloud**: Always Free tier (4 ARM cores, 24GB RAM) — but requires AVS verification that MPay cards may fail
   - **Google Cloud**: $300 credit (requires $30 upfront payment)

3. **Hosting IP Blocking**: Iranian hosting providers (Pars VDS, Pars Pack) tend to block IPs every 10-15 days after December crackdowns. HostVDS (recommended by Omid) has shown no blocking over 1.5 months with the same tunnel configurations — suggesting some domestic providers may monitor traffic patterns or profit from IP replacement fees.

## Key Takeaways

- BIN checker sites reveal MPay card country of origin — match this to service regions
- AWS tasks system can yield $200 total in free credits over 6 months
- Oracle Cloud's Always Free tier is the most generous (4 ARM, 24GB RAM) but needs real AVS-verified cards
- Google Cloud $300 credit requires $30 upfront — may be worth it
- HostVDS shows better IP stability than Pars VDS/Pars Pack for tunnel use
- Some domestic providers may intentionally monitor and block tunnel traffic for profit
- Kiro AI (Amazon's agent) may support using AWS credits with advanced models like Opus 5

## My Notes

This is valuable community-sourced intel. The BIN checker trick is immediately useful for anyone with MPay cards. The AWS task system for extra credits is worth exploring — $200 for 5 simple tasks is excellent ROI. The HostVDS vs Iranian hosting comparison aligns with what we've seen — foreign providers are less likely to actively interfere with tunnel traffic. The Oracle AVS limitation is important to know before attempting to claim their free tier.

## Related

- [[docker-kubernetes-production-guide]]
- [[Coolify — Self-Hosted Vercel Heroku Alternative]]
