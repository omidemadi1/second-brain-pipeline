#!/usr/bin/env python3
"""
Second Brain — Telegram Sender
Sends processed notes as individual messages with inline keyboard buttons.

Usage:
    echo '<json>' | python3 second_brain_sender.py
    python3 second_brain_sender.py --file notes.json

Input JSON format:
{
  "chat_id": "244972243",
  "thread_id": "546378",   // optional, for forum topics
  "date": "2026-07-26",
  "notes": [
    {
      "id": "note-id",
      "title": "Note Title",
      "url": "https://...",
      "category": "AI & Machine Learning",
      "content_type": "tool",  // tool|learning|idea|reference
      "rating": "worth-deep-reading",
      "tags": ["tag1", "tag2"],
      "summary": "2-3 sentence summary..."
    }
  ]
}

Output: sends Telegram messages with inline keyboards.
"""

import json
import os
import sys
import urllib.request
import urllib.error
from urllib.parse import quote

# ── Config ────────────────────────────────────────────────────────

def get_bot_token():
    """Read bot token from .env file."""
    env_path = os.path.expanduser("~/.hermes/.env")
    if not os.path.exists(env_path):
        raise RuntimeError(f"Config not found: {env_path}")
    with open(env_path) as f:
        for line in f:
            line = line.strip()
            if line.startswith("TELEGRAM_BOT_TOKEN="):
                return line.split("=", 1)[1].strip()
    raise RuntimeError("TELEGRAM_BOT_TOKEN not found in .env")

def get_bot_username(token):
    """Get bot username from Telegram API."""
    url = f"https://api.telegram.org/bot{token}/getMe"
    try:
        req = urllib.request.Request(url)
        with urllib.request.urlopen(req, timeout=10) as resp:
            data = json.loads(resp.read())
        return data.get("result", {}).get("username", "")
    except Exception:
        return ""


# ── Content type icons ────────────────────────────────────────────

CONTENT_TYPE_ICONS = {
    "tool": "🛠",
    "learning": "📚",
    "idea": "💡",
    "reference": "🔗",
}

RATING_LABELS = {
    "worth-deep-reading": "⭐ Worth deep reading",
    "reference": "📌 Reference",
    "quick-note": "📝 Quick note",
}


# ── Telegram API ──────────────────────────────────────────────────

def send_message(token, chat_id, text, reply_markup=None, thread_id=None):
    """Send a message via Telegram Bot API."""
    url = f"https://api.telegram.org/bot{token}/sendMessage"
    payload = {
        "chat_id": chat_id,
        "text": text,
        "parse_mode": "Markdown",
        "disable_web_page_preview": True,
    }
    if thread_id:
        payload["message_thread_id"] = int(thread_id)
    if reply_markup:
        payload["reply_markup"] = reply_markup

    data = json.dumps(payload).encode("utf-8")
    req = urllib.request.Request(
        url,
        data=data,
        headers={"Content-Type": "application/json"},
        method="POST",
    )
    try:
        with urllib.request.urlopen(req, timeout=15) as resp:
            result = json.loads(resp.read())
            if not result.get("ok"):
                print(f"  ⚠ Telegram API error: {result}", file=sys.stderr)
            return result
    except urllib.error.HTTPError as e:
        body = e.read().decode("utf-8", errors="ignore")[:300]
        print(f"  ⚠ HTTP {e.code}: {body}", file=sys.stderr)
        return {"ok": False, "error": body}
    except Exception as e:
        print(f"  ⚠ Send failed: {e}", file=sys.stderr)
        return {"ok": False, "error": str(e)}


# ── Note formatting ───────────────────────────────────────────────

def format_note(note, bot_username):
    """Format a note as a Telegram message with inline keyboard buttons."""
    icon = CONTENT_TYPE_ICONS.get(note.get("content_type", "reference"), "🔗")
    title = note.get("title", "Untitled")
    url = note.get("url", "")
    category = note.get("category", "")
    rating = note.get("rating", "reference")
    tags = note.get("tags", [])
    summary = note.get("summary", "")
    note_id = note.get("id", "unknown")

    # Build message text
    lines = []
    lines.append(f"{icon} *{_escape_md(title)}*")
    if category:
        lines.append(f"📂 {_escape_md(category)}")
    if rating:
        label = RATING_LABELS.get(rating, rating)
        lines.append(f"{label}")
    if tags:
        tag_str = " ".join(f"`{t}`" for t in tags[:10])
        lines.append(f"\n🏷 {tag_str}")
    if summary:
        # Summary contains intentional Markdown formatting (bold, bullets)
        # from the LLM — do NOT escape it
        lines.append(f"\n{summary}")

    text = "\n".join(lines)

    # Build inline keyboard
    buttons = []

    # Row 1: Read source (URL button)
    if url:
        buttons.append([{"text": "📖 Read source", "url": url}])

    # Row 2: Deep dive + Deep search (callback buttons)
    callback_row = []
    callback_row.append({
        "text": "🔍 Deep dive",
        "callback_data": f"sb:dive:{note_id}",
    })
    callback_row.append({
        "text": "🔎 Deep search",
        "callback_data": f"sb:search:{note_id}",
    })
    buttons.append(callback_row)

    keyboard = {"inline_keyboard": buttons}

    return text, keyboard


def _escape_md(text):
    """Escape characters that have special meaning in Telegram Markdown (v1)."""
    # Only these 4 characters are special in Markdown v1
    special = {"*", "_", "`", "["}
    result = []
    for ch in str(text):
        if ch in special:
            result.append(f"\\{ch}")
        else:
            result.append(ch)
    return "".join(result)


# ── Main ──────────────────────────────────────────────────────────

def main():
    # Read input
    if len(sys.argv) > 2 and sys.argv[1] == "--file":
        with open(sys.argv[2]) as f:
            data = json.load(f)
    else:
        data = json.load(sys.stdin)

    chat_id = data.get("chat_id", "")
    thread_id = data.get("thread_id")
    date = data.get("date", "")
    notes = data.get("notes", [])

    if not chat_id:
        print("Error: chat_id is required", file=sys.stderr)
        sys.exit(1)

    if not notes:
        print("No notes to send.")
        return

    # Get bot token
    token = get_bot_token()
    bot_username = get_bot_username(token)

    # Send digest header
    header = f"🧠 *Second Brain — Daily Digest*\n📅 {_escape_md(date)}\n\nProcessed *{len(notes)}* items today:"
    send_message(token, chat_id, header, thread_id=thread_id)

    # Send each note as a separate message
    sent = 0
    for note in notes:
        text, keyboard = format_note(note, bot_username)
        result = send_message(token, chat_id, text, reply_markup=keyboard, thread_id=thread_id)
        if result.get("ok"):
            sent += 1
            # Store message_id in the note for callback handling
            msg_id = result.get("result", {}).get("message_id")
            if msg_id:
                note["sent_message_id"] = msg_id
        else:
            print(f"  Failed to send: {note.get('title', 'unknown')}", file=sys.stderr)

    # Send footer
    content_types = {}
    for n in notes:
        ct = n.get("content_type", "reference")
        content_types[ct] = content_types.get(ct, 0) + 1

    footer_parts = []
    for ct, count in sorted(content_types.items()):
        icon = CONTENT_TYPE_ICONS.get(ct, "🔗")
        footer_parts.append(f"{icon} {ct}: {count}")

    footer = f"---\n{' | '.join(footer_parts)}\nTotal: {sent}/{len(notes)} sent"
    send_message(token, chat_id, footer, thread_id=thread_id)

    print(f"✅ Sent {sent}/{len(notes)} notes to Telegram")


if __name__ == "__main__":
    main()
