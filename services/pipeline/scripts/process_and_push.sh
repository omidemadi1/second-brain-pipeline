#!/bin/bash
set -e

# Resolve this script's directory, then run the processor against the vault.
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
VAULT="${OBSIDIAN_VAULT_PATH:-$HOME/obsidian-vault/vault}"

cd "$VAULT"

# Run the processing script and output its JSON (this will be captured by cronjob)
python3 "$SCRIPT_DIR/process_inbox.py"

# Git push is handled by the LLM agent AFTER it creates notes.
# Do NOT push here - the agent's new notes haven't been written yet at this point.
