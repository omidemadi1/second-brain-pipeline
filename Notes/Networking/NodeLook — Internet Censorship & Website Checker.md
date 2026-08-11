---
title: NodeLook — Internet Censorship & Website Checker
source: https://github.com/nodelook/android
platform: github
content_type: tool
date_saved: 2026-08-10
date_processed: 2026-08-11
category: Networking
tags: [internet-censorship, iran, android-app, website-testing, kotlin, f-droid, open-source, privacy, circumvention, network-testing, availability-checker, mirror-checking, censorship, dns]
rating: reference
author: RepoFA
note_id: 8bc826c82a22
---

# NodeLook — Internet Censorship & Website Checker

## Summary
NodeLook (github.com/nodelook/android) is an Android app for testing website accessibility beyond simple ping. It's designed specifically for users facing internet restrictions (particularly in Iran) to verify whether mirrors and sites are truly accessible, not just reachable by ICMP. Available on F-Droid, it checks actual site accessibility — handling cases where a site responds to ping but is DNS-blocked, SNI-filtered, or otherwise censored. Built in Kotlin, MIT-licensed, 27 stars. A companion F-Droid listing describes it as "a general website checker for users facing internet restrictions."

## Key Takeaways
- Purpose-built for users behind internet censorship (target: Iran).
- Tests actual site accessibility, not just ping — catches DNS blocks, SNI filtering, etc.
- Available on F-Droid (open source Android app store), no Google Play needed.
- Built in Kotlin, MIT-licensed.
- Relevant to networking work: understanding how sites are blocked and how to verify reachability.

## My Notes
Directly useful for anyone in Iran dealing with internet censorship. As a Network+ certified person: this is a practical tool for diagnosing *why* a site is unreachable, not just *whether* it's unreachable. Good reference for any future network diagnostics work or if asked about Iran censorship tools.

## Related
- [[Censorship in Iran]]