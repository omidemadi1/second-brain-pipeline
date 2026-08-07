#!/bin/bash
set -e

cd /root/obsidian-vault

# Run the processing script and output its JSON (this will be captured by cronjob)
python3 scripts/process_inbox.py

# Git push is handled by the LLM agent AFTER it creates notes.
# Do NOT push here — the agent's new notes haven't been written yet at this point.
