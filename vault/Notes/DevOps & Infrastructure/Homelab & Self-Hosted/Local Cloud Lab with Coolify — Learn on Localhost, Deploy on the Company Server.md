---
title: "Local Cloud Lab with Coolify — Learn on Localhost, Deploy on the Company Server"
id: "6bb919d1e5cd"
source: "https://coolify.io/self-hosted"
platform: web
content_type: idea
date_saved: 2026-10-22T15:42:06+03:30
date_processed: 2026-10-23
category: "DevOps & Infrastructure/Homelab & Self-Hosted"
tags:
  - coolify
  - self-hosted
  - homelab
  - paas
  - docker
  - deployment
  - learning
  - proxmox
  - vps
  - devops
  - infrastructure
  - local-cloud
  - ssl
  - backups
  - practice
rating: reference
author: "@pytens (poster) / coolLabs"
---

# Local Cloud Lab with Coolify — Learn on Localhost, Deploy on the Company Server

## Summary

A capture of a discussion (Persian, from @pytens) about wanting something like AWS or DigitalOcean but running locally — first to learn on, then to put on the company's old server that sits about 90% idle. The answer that stood out was **Coolify**, described as the most attractive option while also possibly overkill for personal use, precisely because it is built for production. The self-hosted edition is free with every feature included.

The plan this implies: install Coolify on a local box (an LXC or VM on the Proxmox host), use it the way you would use a cloud PaaS — create a project, attach a server, deploy an app from git, add a database, watch logs and resource usage — then apply the same install on the company server once the workflow is familiar.

**Coolify, briefly**

- Open-source, self-hostable PaaS: deploy applications, databases and services to your own servers through a web UI.
- One-command install: `curl -fsSL https://cdn.coollabs.io/coolify/install.sh | sudo bash`.
- No paywall, no feature limits, no cap on the number of sites or servers; Docker under the hood; automatic SSL, domains, deployments.
- Positioned as the Vercel/Heroku/Netlify/Railway alternative that runs on hardware you already own.

## Key Takeaways

- The gap this fills is *experience*: a free local Coolify gives the same mental model (servers, projects, environments, deployments, databases) as a paid cloud, without the bill.
- "Overkill for personal use" is the honest caveat — for a single static site, a plain Docker Compose file is simpler; the value shows up at the second or third service.
- Moving from lab to company server is mostly a hardware/networking question, not a Coolify question: static IP, DNS, ports, and someone's permission.

## My Notes

- Concrete learning sequence, in order: (1) Coolify in a Proxmox LXC with 4 GB RAM; (2) deploy this vault's static export or a small Node app from a git repo; (3) add a Postgres service and connect an app to it; (4) break it deliberately — bad Dockerfile, wrong port — and fix it from the logs; (5) restore from a backup once.
- SSL is the part that will bite in a lab: Let's Encrypt needs a public, resolvable hostname, so use a real subdomain or a wildcard cert, or accept HTTP/no-TLS locally.
- Before touching the company server: confirm the hardware spec, whether it has a static public IP, whether port 80/443 are free and forwarded, and get written approval — deploying on a corporate box without that is how homelab enthusiasm turns into an incident.
- Also worth comparing Dokploy during the lab phase; the Coolify site itself links a comparison page.

## Related

- [[Coolify — Self-Hosted Vercel Heroku Alternative]]
- [[Stackyard - Self-Hosted Homelab Dashboard]]
- [[Idea - Proxmox VM Backup Automation Tool]]
- [[proxmox-vm-backup-automation]]
- [[Immich-Self-Hosted-Photo-Management]]
- [[MPay-Cards-Free-Cloud-Credits-Trial-Guide]]
- [[DevOps & Infrastructure]]
