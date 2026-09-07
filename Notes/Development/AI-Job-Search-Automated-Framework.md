---
title: "AI Job Search — Automated Job Application Framework"
source: "github.com/MadsLorentzen/ai-job-search / @Linuxor (Telegram)"
platform: "note"
content_type: "tool"
date_saved: "2026-09-06T21:53:19+03:30"
date_processed: "2026-09-07"
category: "Development"
tags:
  - ai-job-search
  - job-automation
  - claude-code
  - resume-optimization
  - cover-letter-generation
  - interview-preparation
  - job-matching
  - career-ai
  - python
  - bun
  - latex
  - pdf-generation
  - open-source-tool
  - recruitment-tech
  - iran-job-market
rating: "worth-deep-reading"
author: "Omid"
---

## Summary

**AI Job Search** (github.com/MadsLorentzen/ai-job-search) is an open-source AI-powered job application framework built on **Claude Code** that runs locally on your machine. It takes your resume, experience, skills, and career goals → scrapes job boards for relevant positions → ranks matches by fit score → generates tailored CVs and cover letters → prepares you for interviews with likely questions and practice sessions. The core is designed for Claude Code but the architecture is adaptable to other agents. Requires Python, Bun, and LaTeX (for PDF resume/cover letter generation). The author notes this is critically needed in Iran's current job market — everyone should build their own version.

## Key Takeaways

- **Local-first, privacy-preserving** — Runs on your machine, owns your data, no cloud dependency
- **End-to-end pipeline** — Job discovery → matching → application materials → interview prep
- **Claude Code native** — Built specifically for Claude Code's agentic workflow
- **Adaptable architecture** — Core patterns portable to other agent frameworks
- **PDF output via LaTeX** — Professional resume/cover letter generation
- **Iran job market context** — Specifically highlighted as essential for Iranian job seekers
- **Active project** — Recent commits, active development

## Key Features

**Resume & profile ingestion** — Parses your resume, experience, skills, and career targets as structured input  
**Multi-site job scraping** — Crawls job boards to discover relevant positions automatically  
**Intelligent job ranking** — Scores and ranks positions by personal fit (skills, experience, preferences)  
**Tailored CV generation** — Creates customized resumes for each application using LaTeX/PDF  
**Cover letter automation** — Writes personalized cover letters matched to job requirements  
**Interview preparation** — Generates likely interview questions and runs practice sessions  
**Claude Code integration** — Native workflow using Claude Code's agent capabilities  
**Cross-agent adaptability** — Architecture documented for porting to other agent frameworks  
**Local execution** — Python + Bun runtime, no external API dependencies for core logic  

## Use Cases

- Job seekers automating the repetitive parts of application process (scraping, tailoring, writing)
- Career switchers needing to rapidly adapt materials for different role types
- Iranian job market participants where competition is high and automation provides edge
- Developers wanting a reference implementation for building personal AI career agents
- Anyone wanting to own their job search data and avoid LinkedIn/third-party platforms

## My Notes

Shared by @Linuxor on Telegram with emphasis on Iran's job market needs. The local-first approach is crucial — job data is sensitive. LaTeX for PDF generation ensures professional output. The Claude Code native design means it leverages Anthropic's agent SDK patterns. For our context: this is a practical "agent as personal assistant" use case. Could be adapted for freelance/consulting lead generation too. The Iran-specific mention suggests localization (Persian job sites, cultural nuances) would be a valuable fork.

## Related

- [[Browser Use - AI Browser Automation]] — AI browser automation for job applications (108k stars)
- [[Hermes Academy — Convert AI Tasks into Structured Lessons]] — Rust CLI for auto-documenting agent work
- [[Synapse Local-First Memory for AI Agents]] — Local-first memory system for personal agents
- [[AI Skills for Home Lab Agents]] — Downloadable agent skills for Docker, K8s, DevOps
- [[CloseAI - Ronin CEO Tweet]] — AI engineering career guidance content
- [[70 Hands-On Cybersecurity Projects — Beginner to Advanced]] — Portfolio projects for job hunting