---
title: "OWASP Top 10 for LLM Applications 2025"
id: "01830e4f608b"
source: "https://genai.owasp.org/resource/owasp-top-10-for-llm-applications-2025/"
platform: web
content_type: reference
date_saved: 2026-10-22T10:48:39+03:30
date_processed: 2026-10-23
category: "Cybersecurity/AI Security"
tags:
  - owasp
  - llm-security
  - ai-security
  - prompt-injection
  - threat-modeling
  - security-checklist
  - genai
  - excessive-agency
  - supply-chain-security
  - data-poisoning
  - vector-embeddings
  - security-framework
  - appsec
  - overview
rating: worth-deep-reading
author: "OWASP GenAI Security Project (shared by @Hamed)"
---

# OWASP Top 10 for LLM Applications 2025

## Summary

The OWASP Top 10 for LLM Applications (2025 edition) is the community-maintained reference list of the ten most significant security risks for applications built on large language models, each with a description, attack scenarios, and mitigation guidance. It is produced by the OWASP GenAI Security Project and published as a downloadable PDF, with companion material: the GenAI Red Teaming Manual v1.0 (Oct 2026), the Agent Control Standard (ACS), and a GenAI security framework crosswalk.

The 2025 list, in order:

1. **LLM01 Prompt Injection** — user or third-party text alters model behaviour, overriding instructions.
2. **LLM02 Sensitive Information Disclosure** — the model or its app leaks PII, secrets, or proprietary data.
3. **LLM03 Supply Chain** — risky models, datasets, plugins, and dependencies flowing into the app.
4. **LLM04 Data and Model Poisoning** — tampered pre-training, fine-tuning, or embedding data skews outputs.
5. **LLM05 Improper Output Handling** — model output passed downstream without validation or sanitisation (XSS, SSRF, command injection).
6. **LLM06 Excessive Agency** — the system is given more permissions, tools, or autonomy than the task needs.
7. **LLM07 System Prompt Leakage** — the system prompt is treated as a secret and then extracted.
8. **LLM08 Vector and Embedding Weaknesses** — retrieval and embedding layer flaws (cross-tenant leakage, poisoned documents).
9. **LLM09 Misinformation** — confident wrong output relied on without verification.
10. **LLM10 Unbounded Consumption** — unlimited token/tool usage leading to cost blowups and denial of service.

## Key Takeaways

- The list is a threat model, not a compliance checkbox: each entry has concrete mitigation patterns (input/output isolation, least-privilege tool scoping, rate and budget limits, human approval gates).
- The 2025 revision adds **System Prompt Leakage** and **Vector and Embedding Weaknesses**, i.e. it now assumes RAG and agentic architectures as the default.
- LLM06 (Excessive Agency) and LLM01 (Prompt Injection) are the two that matter most for agent products — untrusted input plus over-broad tools is the classic exploit path.
- LLM10 is the cost-side risk: uncapped loops and generous tool calls are both a billing and availability problem.
- Good pairing with the GenAI Red Teaming Manual for turning the list into tests.

## My Notes

- Directly applicable to anything here that touches an LLM: the Second Brain pipeline takes untrusted web/X content and feeds it into an agent that writes files and runs git. That is a textbook LLM01 + LLM06 combination — the collector output should keep being treated as data, never instructions.
- Useful as a checklist when writing client/work automation at NiroTransfo or any internal tool with an LLM in the loop.
- The one-line-per-risk table above is the fastest thing to reuse in a review or a proposal appendix.
- Worth reading the LLM06 and LLM08 sections in full rather than skimming — those change most between versions.

## Related

- [[Prompt Injection - You Cannot Filter Your Way Out]]
- [[5-Free-Open-Source-AI-Security-Tools-2026]]
- [[AI Agent Privacy — Understanding Data Exposure Risks]]
- [[Google-Mantis-Agentic-Vulnerability-Framework]]
- [[Hallusquatting-AI-Hallucination-Package-Attack]]
- [[Frontend Security Beyond Backend - A Developer Checklist]]
