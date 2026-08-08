---
title: "HyperDbg - Hardware & Software Debugging Infrastructure"
source: "https://github.com/HyperDbg/HyperDbg"
platform: "github"
content_type: "tool"
date_saved: "2026-08-02"
date_processed: "2026-08-08"
category: "Cybersecurity"
tags: ["debugging", "hypervisor", "reverse-engineering", "malware-analysis", "kernel", "intel-vt-x", "open-source", "c", "windows", "anti-anti-debug", "stealth-hooking", "security-tools", "binary-analysis"]
rating: "reference"
author: "HyperDbg Contributors"
---

## Summary

HyperDbg is a state-of-the-art open-source hardware and software debugging infrastructure using Intel VT-x/EPT for both user and kernel mode debugging. Features include stealth hooking (invisible to anti-debug measures), anti-anti-debug capabilities, and precise code execution tracing. Written in C with 3.9k stars. Designed for reverse engineering, malware analysis, and kernel development. The hypervisor-based approach means it operates at a level below the OS, making it extremely powerful for security research.

## Key Takeaways

- Uses Intel VT-x/EPT for hardware-level debugging
- Stealth hooking bypasses anti-debug protections
- Supports both user and kernel mode
- Ideal for reverse engineering and malware analysis
- Anti-anti-debug for analyzing protected software
- C-based, 3.9k stars, well-maintained

## My Notes

Relevant for bug bounty hunting interests. HyperDbg's stealth hooking could be useful for analyzing web application security at the binary level, though most web bug bounty work is higher-level.

## Related

- [[Prompt Injection - You Cannot Filter Your Way Out]]
