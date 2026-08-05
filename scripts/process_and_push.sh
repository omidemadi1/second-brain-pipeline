#!/bin/bash
set -e

cd /root/obsidian-vault

# Run the processing script and output its JSON (this will be captured by cronjob)
python3 scripts/process_inbox.py

# Now, in the background, push to git if there are changes
# We'll add a small delay to ensure the script output is fully captured
# Then run git push in the background
(
  # Wait a bit to let the cronjob capture the output (optional)
  sleep 2
  # Check if there are changes to push
  if git diff-index --quiet HEAD --; then
    echo "No changes to push" >&2
  else
    echo "Pushing changes to git..." >&2
    git push origin main 2>&1 | logger -t second-brain-git-push &
  fi
) &

exit 0