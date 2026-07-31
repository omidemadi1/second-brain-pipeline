#!/usr/bin/env python3
"""
Second Brain — Daily Processor
Reads queued inbox items, extracts content, and prepares them for LLM summarization.
Output is injected into the cron job's prompt as context.

Usage:
    python3 process_inbox.py

Output: JSON with all queued items ready for processing.
"""

import json
import os
import re
import subprocess
import sys
import urllib.request
import urllib.error
from datetime import datetime, timezone, timedelta

VAULT = os.path.expanduser("~/obsidian-vault")
QUEUE_DIR = os.path.join(VAULT, ".inbox-queue")
ARCHIVE_DIR = os.path.join(VAULT, ".inbox-archive")
SKILL_DIR = os.path.expanduser("~/.hermes/skills/media/youtube-content/scripts")

# fxtwitter API — extracts tweet text, author, media without auth
FXTWITTER_API = "https://api.fxtwitter.com"


def load_queue():
    """Load all unprocessed items from the queue."""
    items = []
    if not os.path.exists(QUEUE_DIR):
        return items
    for filename in sorted(os.listdir(QUEUE_DIR)):
        if filename.endswith(".json") and not filename.startswith("digest_"):
            filepath = os.path.join(QUEUE_DIR, filename)
            try:
                with open(filepath) as f:
                    item = json.load(f)
                if not item.get("processed", False):
                    items.append(item)
            except (json.JSONDecodeError, IOError):
                continue
    return items


def fetch_youtube_transcript(url: str) -> str:
    """Fetch YouTube transcript using the youtube-content skill script."""
    script = os.path.join(SKILL_DIR, "fetch_transcript.py")
    if not os.path.exists(script):
        return "[YouTube transcript script not found]"
    try:
        result = subprocess.run(
            ["python3", script, url, "--text-only"],
            capture_output=True, text=True, timeout=30
        )
        if result.returncode == 0 and result.stdout.strip():
            text = result.stdout.strip()
            # Truncate very long transcripts to save tokens
            if len(text) > 8000:
                text = text[:4000] + "\n... [truncated, " + str(len(text)) + " chars total] ... \n" + text[-2000:]
            return text
        stderr = result.stderr.strip()[:200]
        return f"[No transcript available: {stderr}]"
    except Exception as e:
        return f"[Transcript fetch error: {str(e)[:200]}]"


def fetch_youtube_metadata(url: str) -> str:
    """Fallback when no transcript: extract title, author, description via oEmbed + page scraping."""
    parts = []

    # 1. oEmbed API (title + author)
    try:
        oembed_url = f"https://www.youtube.com/oembed?url={url}&format=json"
        req = urllib.request.Request(oembed_url)
        with urllib.request.urlopen(req, timeout=10) as resp:
            data = json.loads(resp.read())
        if data.get("title"):
            parts.append(f"Title: {data['title']}")
        if data.get("author_name"):
            parts.append(f"Author: {data['author_name']}")
        if data.get("author_url"):
            parts.append(f"Channel: {data['author_url']}")
    except Exception:
        pass

    # 2. Page scraping for description, views, duration
    try:
        req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
        with urllib.request.urlopen(req, timeout=10) as resp:
            html = resp.read().decode("utf-8", errors="ignore")

        desc_match = re.search(r'"shortDescription":"([^"]{0,3000})"', html)
        if desc_match:
            desc = desc_match.group(1).replace("\\n", "\n")
            if len(desc) > 1000:
                desc = desc[:1000] + "..."
            parts.append(f"Description:\n{desc}")

        views_match = re.search(r'"viewCount":"(\d+)"', html)
        if views_match:
            parts.append(f"Views: {views_match.group(1)}")

        dur_match = re.search(r'"lengthSeconds":"(\d+)"', html)
        if dur_match:
            secs = int(dur_match.group(1))
            parts.append(f"Duration: {secs // 60}:{secs % 60:02d}")

        chan_match = re.search(r'"ownerChannelName":"([^"]+)"', html)
        if chan_match and not any("Author:" in p for p in parts):
            parts.append(f"Channel: {chan_match.group(1)}")
    except Exception:
        pass

    if parts:
        return "\n".join(parts)
    return "[No transcript and no metadata available]"


def fetch_x_content(url: str) -> str:
    """Extract X/Twitter post content via fxtwitter API (no auth needed)."""
    # Extract tweet ID from URL
    tweet_id_match = re.search(r"/status/(\d+)", url)
    if not tweet_id_match:
        return f"[X/Twitter post — URL: {url}]"
    tweet_id = tweet_id_match.group(1)

    try:
        api_url = f"{FXTWITTER_API}/i/status/{tweet_id}"
        req = urllib.request.Request(api_url, headers={"User-Agent": "SecondBrain/1.0"})
        with urllib.request.urlopen(req, timeout=15) as resp:
            data = json.loads(resp.read())

        tweet = data.get("tweet", data)
        parts = []

        # Author info
        author = tweet.get("author", {})
        if author.get("name"):
            parts.append(f"Author: {author['name']} (@{author.get('screen_name', '')})")
        if author.get("description"):
            parts.append(f"Author bio: {author['description'][:200]}")

        # Tweet text
        if tweet.get("text"):
            parts.append(f"\nTweet:\n{tweet['text']}")

        # Engagement
        likes = tweet.get("likes", 0)
        rts = tweet.get("retweets", 0)
        replies = tweet.get("replies", 0)
        if likes or rts or replies:
            parts.append(f"\nEngagement: {likes} likes, {rts} retweets, {replies} replies")

        # Date
        if tweet.get("created_at"):
            parts.append(f"Date: {tweet['created_at']}")

        # Media
        media = tweet.get("media", {})
        photos = media.get("photos", [])
        videos = media.get("videos", [])
        if photos:
            parts.append(f"Media: {len(photos)} photo(s)")
        if videos:
            parts.append(f"Media: {len(videos)} video(s)")

        # Quote tweet
        quote = tweet.get("quote", {})
        if quote and quote.get("text"):
            q_author = quote.get("author", {})
            parts.append(f"\nQuoted tweet by @{q_author.get('screen_name', '?')}: {quote['text']}")

        if parts:
            return "\n".join(parts)
        return f"[X/Twitter post — URL: {url}]"

    except Exception as e:
        return f"[X/Twitter extraction failed: {str(e)[:200]} — URL: {url}]"


def fetch_github_info(url: str) -> str:
    """Fetch GitHub repo info via API."""
    # Extract owner/repo from URL
    match = re.search(r'github\.com/([^/]+)/([^/]+)', url)
    if not match:
        return "[Invalid GitHub URL]"
    owner, repo = match.groups()
    repo = repo.rstrip('/')
    
    try:
        result = subprocess.run(
            ["curl", "-s", f"https://api.github.com/repos/{owner}/{repo}"],
            capture_output=True, text=True, timeout=15
        )
        if result.returncode == 0:
            data = json.loads(result.stdout)
            parts = []
            if data.get("description"):
                parts.append(f"Description: {data['description']}")
            if data.get("stargazers_count"):
                parts.append(f"Stars: {data['stargazers_count']}")
            if data.get("language"):
                parts.append(f"Language: {data['language']}")
            if data.get("topics"):
                parts.append(f"Topics: {', '.join(data['topics'])}")
            if data.get("homepage"):
                parts.append(f"Homepage: {data['homepage']}")
            return "\n".join(parts) if parts else "[No metadata available]"
    except Exception as e:
        return f"[GitHub API error: {str(e)[:200]}]"
    return "[Could not fetch GitHub info]"


def fetch_reddit_info(url: str) -> str:
    """Fetch Reddit post via old.reddit.com JSON endpoint."""
    # Convert to JSON endpoint
    json_url = url.rstrip('/') + ".json"
    try:
        result = subprocess.run(
            ["curl", "-s", "-H", "User-Agent: SecondBrain/1.0", json_url],
            capture_output=True, text=True, timeout=15
        )
        if result.returncode == 0:
            data = json.loads(result.stdout)
            if isinstance(data, list) and len(data) > 0:
                post = data[0]["data"]["children"][0]["data"]
                parts = []
                if post.get("title"):
                    parts.append(f"Title: {post['title']}")
                if post.get("selftext"):
                    text = post["selftext"][:3000]
                    parts.append(f"Text: {text}")
                if post.get("subreddit"):
                    parts.append(f"Subreddit: r/{post['subreddit']}")
                if post.get("score"):
                    parts.append(f"Score: {post['score']}")
                return "\n".join(parts)
    except Exception as e:
        return f"[Reddit fetch error: {str(e)[:200]}]"
    return "[Could not fetch Reddit info]"


def fetch_instagram_info(url: str) -> str:
    """Try to fetch Instagram post info. Limited by anti-scraping."""
    try:
        result = subprocess.run(
            ["curl", "-s", "-L", "-H", "User-Agent: Mozilla/5.0", url],
            capture_output=True, text=True, timeout=15
        )
        if result.returncode == 0:
            html = result.stdout
            # Try to extract meta description
            desc_match = re.search(r'<meta[^>]*name="description"[^>]*content="([^"]*)"', html)
            title_match = re.search(r'<meta[^>]*property="og:title"[^>]*content="([^"]*)"', html)
            parts = []
            if title_match:
                parts.append(f"Title: {title_match.group(1)}")
            if desc_match:
                parts.append(f"Description: {desc_match.group(1)[:1000]}")
            return "\n".join(parts) if parts else "[Instagram content requires login to view]"
    except Exception as e:
        return f"[Instagram fetch error: {str(e)[:200]}]"
    return "[Could not fetch Instagram info]"


def extract_web_content(url: str) -> str:
    """Extract web page content using curl + basic parsing."""
    try:
        result = subprocess.run(
            ["curl", "-s", "-L", "-H", "User-Agent: Mozilla/5.0", "--max-time", "15", url],
            capture_output=True, text=True, timeout=20
        )
        if result.returncode == 0:
            html = result.stdout
            # Extract meta description and title
            desc_match = re.search(r'<meta[^>]*name="description"[^>]*content="([^"]*)"', html, re.IGNORECASE)
            title_match = re.search(r'<title[^>]*>([^<]*)</title>', html, re.IGNORECASE)
            og_desc = re.search(r'<meta[^>]*property="og:description"[^>]*content="([^"]*)"', html, re.IGNORECASE)
            
            parts = []
            if title_match:
                parts.append(f"Title: {title_match.group(1).strip()}")
            desc = og_desc.group(1) if og_desc else (desc_match.group(1) if desc_match else "")
            if desc:
                parts.append(f"Description: {desc[:1500]}")
            
            # Try to extract main text content (rough)
            # Remove scripts and styles
            clean = re.sub(r'<script[^>]*>.*?</script>', '', html, flags=re.DOTALL)
            clean = re.sub(r'<style[^>]*>.*?</style>', '', clean, flags=re.DOTALL)
            clean = re.sub(r'<[^>]+>', ' ', clean)
            clean = re.sub(r'\s+', ' ', clean).strip()
            # Get a chunk of text
            if len(clean) > 500:
                # Find a good starting point (skip navigation)
                start = clean.find('. ', 200)
                if start > 0:
                    clean = clean[start:start+5000]
                else:
                    clean = clean[:5000]
                parts.append(f"Content preview: {clean}")
            
            return "\n".join(parts) if parts else "[Could not extract content]"
    except Exception as e:
        return f"[Web fetch error: {str(e)[:200]}]"
    return "[Could not fetch web content]"


def extract_content(item: dict) -> str:
    """Extract content based on platform."""
    url = item.get("url", "")
    platform = item.get("platform", "web")

    if platform == "youtube":
        # Primary: try transcript
        result = fetch_youtube_transcript(url)
        # Fallback: if no transcript, get metadata from oEmbed + page scraping
        if "[No transcript available" in result or "[Transcript fetch error" in result:
            metadata = fetch_youtube_metadata(url)
            if metadata and "[No transcript" not in metadata:
                result = f"{result}\n\nVideo Metadata:\n{metadata}"
        return result
    elif platform == "github":
        return fetch_github_info(url)
    elif platform == "reddit":
        return fetch_reddit_info(url)
    elif platform == "instagram":
        return fetch_instagram_info(url)
    elif platform == "x":
        return fetch_x_content(url)
    elif platform == "telegram":
        return f"[Telegram post — URL: {url}]"
    elif url:
        return extract_web_content(url)
    else:
        return item.get("text", "[No content]")


def process_all():
    """Process all queued items and output context for the LLM."""
    items = load_queue()
    
    if not items:
        print(json.dumps({"status": "empty", "message": "No items in inbox queue."}))
        return
    
    processed_items = []
    for item in items:
        content = extract_content(item)
        processed_items.append({
            "id": item["id"],
            "url": item.get("url"),
            "platform": item["platform"],
            "category_guess": item.get("category_guess", "General"),
            "content_type": item.get("content_type", "reference"),
            "text": item.get("text"),
            "user_message": item.get("user_message", ""),
            "timestamp": item.get("timestamp", ""),
            "extracted_content": content,
        })
    
    output = {
        "status": "ready",
        "date": datetime.now(timezone(timedelta(hours=3, minutes=30))).strftime("%Y-%m-%d"),
        "item_count": len(processed_items),
        "items": processed_items,
    }
    
    print(json.dumps(output, indent=2, ensure_ascii=False))


if __name__ == "__main__":
    process_all()
