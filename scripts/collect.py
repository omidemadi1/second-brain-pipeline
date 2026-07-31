#!/usr/bin/env python3
"""
Inbox Collector — lightweight pre-processor for Second Brain.
Detects URLs, identifies platforms, extracts tags from URL + user text,
categorizes, and queues for daily processing.

Usage:
    python3 collect.py <message_text>

Output: JSON with {action, items: [{platform, category, tags, ...}]}
Also writes queue entry to .inbox-queue/
"""

import json
import os
import re
import sys
import hashlib
from datetime import datetime, timezone, timedelta
from urllib.parse import urlparse, unquote

VAULT = os.path.expanduser("~/obsidian-vault")
QUEUE_DIR = os.path.join(VAULT, ".inbox-queue")

# ── Platform detection ───────────────────────────────────────────────

PLATFORM_PATTERNS = {
    "youtube": [
        r"(?:youtube\.com/watch\?v=|youtu\.be/|youtube\.com/shorts/)",
        r"youtube\.com/live/",
        r"youtube\.com/embed/",
    ],
    "github": [
        r"github\.com/[^/]+/[^/]+",
        r"github\.com/[^/]+/[^/]+/issues/",
        r"github\.com/[^/]+/[^/]+/pull/",
        r"github\.com/[^/]+/[^/]+/blob/",
        r"github\.com/[^/]+/[^/]+/tree/",
    ],
    "reddit": [
        r"reddit\.com/r/",
        r"redd\.it/",
        r"reddit\.com/user/",
        r"old\.reddit\.com/",
    ],
    "x": [
        r"twitter\.com/\w+/status/",
        r"x\.com/\w+/status/",
        r"nitter\.",
    ],
    "instagram": [
        r"instagram\.com/p/",
        r"instagram\.com/reel/",
        r"instagram\.com/stories/",
        r"instagram\.com/tv/",
    ],
    "telegram": [
        r"t\.me/",
        r"telegram\.me/",
    ],
    "linkedin": [
        r"linkedin\.com/posts/",
        r"linkedin\.com/feed/",
        r"linkedin\.com/pulse/",
    ],
    "medium": [
        r"medium\.com/",
        r"towardsdatascience\.com/",
    ],
    "arxiv": [
        r"arxiv\.org/abs/",
        r"arxiv\.org/pdf/",
    ],
    "hackernews": [
        r"news\.ycombinator\.com/",
        r"hn\.al/",
    ],
    "stackoverflow": [
        r"stackoverflow\.com/questions/",
        r"stackoverflow\.com/a/",
    ],
}

# ── Tag extraction from URLs ────────────────────────────────────────

# Map URL path keywords → tags
URL_KEYWORD_TAGS = {
    # Dev topics
    "python": "python", "python3": "python", "py": "python",
    "javascript": "javascript", "js": "javascript", "typescript": "typescript", "ts": "typescript",
    "rust": "rust", "golang": "golang", "go": "golang",
    "java": "java", "kotlin": "kotlin", "swift": "swift",
    "cpp": "c++", "c-plus-plus": "c++", "csharp": "c#",
    "ruby": "ruby", "php": "php", "scala": "scala",
    # AI/ML
    "llm": "llm", "large-language-model": "llm",
    "machine-learning": "machine-learning", "ml": "machine-learning",
    "deep-learning": "deep-learning", "dl": "deep-learning",
    "neural-network": "neural-networks", "neural": "neural-networks",
    "transformer": "transformers", "transformers": "transformers",
    "nlp": "nlp", "natural-language-processing": "nlp",
    "computer-vision": "computer-vision", "cv": "computer-vision",
    "reinforcement-learning": "reinforcement-learning", "rl": "reinforcement-learning",
    "diffusion": "diffusion-models", "stable-diffusion": "stable-diffusion",
    "pytorch": "pytorch", "tensorflow": "tensorflow", "keras": "keras",
    "huggingface": "huggingface", "hugging-face": "huggingface",
    "openai": "openai", "chatgpt": "chatgpt", "gpt": "gpt",
    "claude": "claude", "anthropic": "anthropic",
    "langchain": "langchain", "rag": "rag",
    "fine-tuning": "fine-tuning", "finetune": "fine-tuning",
    "embedding": "embeddings", "embeddings": "embeddings",
    "prompt-engineering": "prompt-engineering",
    "agent": "ai-agents", "ai-agent": "ai-agents", "agents": "ai-agents",
    "mlops": "mlops", "model-deployment": "model-deployment",
    "training": "model-training",
    # DevOps/Infra
    "docker": "docker", "kubernetes": "kubernetes", "k8s": "kubernetes",
    "terraform": "terraform", "ansible": "ansible", "jenkins": "jenkins",
    "ci-cd": "ci-cd", "cicd": "ci-cd", "github-actions": "github-actions",
    "linux": "linux", "ubuntu": "ubuntu", "debian": "debian", "centos": "centos",
    "aws": "aws", "azure": "azure", "gcp": "gcp",
    "nginx": "nginx", "apache": "apache", "caddy": "caddy",
    "prometheus": "prometheus", "grafana": "grafana",
    "git": "git", "github": "github", "gitlab": "gitlab",
    # Networking
    "networking": "networking", "network": "networking",
    "firewall": "firewall", "vpn": "vpn", "proxy": "proxy",
    "dns": "dns", "tcp": "tcp-ip", "http": "http-protocol", "https": "https",
    "router": "routing", "switching": "switching", "vlan": "vlan",
    "cisco": "cisco", "mikrotik": "mikrotik", "ubiquiti": "ubiquiti",
    "linux-networking": "linux-networking",
    # Security
    "security": "security", "cybersecurity": "cybersecurity",
    "pentest": "penetration-testing", "penetration-testing": "penetration-testing",
    "bug-bounty": "bug-bounty", "bugbounty": "bug-bounty",
    "ctf": "ctf", "capture-the-flag": "ctf",
    "vulnerability": "vulnerability", "exploit": "exploit",
    "malware": "malware", "phishing": "phishing",
    "owasp": "owasp", "sql-injection": "sql-injection",
    "xss": "xss", "csrf": "csrf",
    "reverse-engineering": "reverse-engineering",
    "crypto": "cryptography", "cryptography": "cryptography",
    # Web
    "react": "react", "vue": "vue", "angular": "angular",
    "nextjs": "nextjs", "next.js": "nextjs",
    "nodejs": "nodejs", "node": "nodejs",
    "flask": "flask", "django": "django", "fastapi": "fastapi",
    "api": "api", "rest": "rest-api", "graphql": "graphql",
    "database": "database", "sql": "sql", "nosql": "nosql",
    "postgresql": "postgresql", "mongodb": "mongodb", "redis": "redis",
    "elasticsearch": "elasticsearch",
    # Business/Productivity
    "startup": "startup", "saas": "saas", "marketing": "marketing",
    "seo": "seo", "automation": "automation",
    "productivity": "productivity", "workflow": "workflow",
    "notion": "notion", "obsidian": "obsidian",
    # Hardware
    "raspberry-pi": "raspberry-pi", "arduino": "arduino",
    "homelab": "homelab", "self-hosted": "self-hosted",
    "proxmox": "proxmox", "vmware": "vmware",
    # Languages/topics from URL segments
    "tutorial": "tutorial", "guide": "guide",
    "example": "example", "demo": "demo",
    "benchmark": "benchmark", "benchmarks": "benchmark",
    "paper": "research-paper", "research": "research",
}

# Category → tags association for context enrichment
CATEGORY_TAG_MAP = {
    "github": ["open-source", "code"],
    "stackoverflow": ["q&a", "problem-solving"],
    "arxiv": ["research-paper", "academic"],
    "youtube": ["video", "tutorial"],
    "reddit": ["discussion", "community"],
    "medium": ["article", "blog"],
    "linkedin": ["professional", "networking"],
    "hackernews": ["tech-news", "community"],
    "instagram": ["visual-content"],
    "x": ["microblog", "discussion"],
    "telegram": ["messaging"],
}

# URL regex
URL_PATTERN = re.compile(
    r"https?://[^\s<>\"'\)\]]+",
    re.IGNORECASE
)

# ── Common English words to ignore when extracting tags from text ────

STOP_WORDS = {
    "the", "a", "an", "and", "or", "but", "in", "on", "at", "to", "for",
    "of", "with", "by", "from", "is", "are", "was", "were", "be", "been",
    "being", "have", "has", "had", "do", "does", "did", "will", "would",
    "could", "should", "may", "might", "shall", "can", "this", "that",
    "these", "those", "i", "me", "my", "we", "our", "you", "your", "he",
    "she", "it", "they", "them", "their", "its", "what", "which", "who",
    "whom", "how", "when", "where", "why", "not", "no", "so", "if",
    "then", "than", "too", "very", "just", "about", "also", "here",
    "there", "up", "out", "all", "some", "any", "each", "every",
    "much", "many", "more", "most", "other", "into", "over", "after",
    "before", "between", "under", "again", "further", "once",
    "am", "as", "because", "until", "while", "during", "through",
    "above", "below", "both", "few", "own", "same",
    # Action words users commonly type
    "check", "out", "look", "see", "read", "watch", "found", "cool",
    "interesting", "nice", "good", "great", "awesome", "love",
    "saved", "bookmark", "save", "remember", "later",
    "new", "using", "setup", "use", "make", "need", "want",
    "get", "got", "one", "two", "way", "thing", "things",
    "link", "post", "article", "video", "content", "page",
}


def detect_platform(url: str) -> str:
    """Detect which platform a URL belongs to."""
    for platform, patterns in PLATFORM_PATTERNS.items():
        for pattern in patterns:
            if re.search(pattern, url):
                return platform
    return "web"


def extract_urls(text: str) -> list:
    """Extract all URLs from text."""
    return URL_PATTERN.findall(text)


def generate_id(url: str) -> str:
    """Generate a short deterministic ID for a URL."""
    return hashlib.md5(url.encode()).hexdigest()[:12]


def extract_tags_from_url(url: str, platform: str) -> list:
    """Extract tags from URL structure — path segments, repo name, subreddit, etc."""
    tags = set()
    parsed = urlparse(url)
    path = parsed.path.lower().strip("/")
    segments = [unquote(s) for s in path.split("/") if s]

    # 1. GitHub: owner/repo → extract repo name segments
    if platform == "github" and len(segments) >= 2:
        repo_name = segments[1]
        # Split repo name by common separators
        for part in re.split(r"[-_/.]", repo_name):
            part = part.lower().strip()
            if part and len(part) > 1 and part in URL_KEYWORD_TAGS:
                tags.add(URL_KEYWORD_TAGS[part])
            elif part and len(part) > 2:
                tags.add(part)

    # 2. Reddit: r/subreddit → subreddit name as tag
    elif platform == "reddit":
        for seg in segments:
            if seg.startswith("r/"):
                sub = seg[2:]
                tags.add(sub)
            elif seg == "r" and len(segments) > segments.index(seg) + 1:
                sub_idx = segments.index(seg) + 1
                if sub_idx < len(segments):
                    tags.add(segments[sub_idx])

    # 3. YouTube: channel or video context
    elif platform == "youtube":
        # Nothing much from URL alone, but check if path has keywords
        pass

    # 4. StackOverflow: tags are in the URL path
    elif platform == "stackoverflow":
        # /questions/tagged/python → python
        if "tagged" in segments:
            tag_idx = segments.index("tagged") + 1
            while tag_idx < len(segments):
                tags.add(segments[tag_idx])
                tag_idx += 1

    # 5. arxiv: categories from URL
    elif platform == "arxiv":
        for seg in segments:
            if "." in seg and len(seg) < 10:
                tags.add(seg)  # e.g., "cs.AI", "cs.CL"

    # 6. General: scan ALL path segments for known keywords
    for seg in segments:
        for part in re.split(r"[-_/.]", seg):
            part = part.lower().strip()
            if part in URL_KEYWORD_TAGS:
                tags.add(URL_KEYWORD_TAGS[part])

    # 7. Also scan the full URL hostname + path for compound keywords
    full_lower = url.lower()
    skip_tags = {"http", "https", "http-protocol", "tls"}
    for keyword, tag in URL_KEYWORD_TAGS.items():
        if tag in skip_tags:
            continue
        if len(keyword) >= 4 and keyword in full_lower:
            tags.add(tag)

    return sorted(tags)


def extract_tags_from_text(text: str) -> list:
    """Extract meaningful tags from user's accompanying text."""
    if not text:
        return []

    tags = set()
    # Normalize
    text_lower = text.lower()

    # 1. Match known keywords from our tag map
    for keyword, tag in URL_KEYWORD_TAGS.items():
        # Word boundary match for short keywords, substring for longer ones
        if len(keyword) <= 3:
            if re.search(r'\b' + re.escape(keyword) + r'\b', text_lower):
                tags.add(tag)
        else:
            if keyword in text_lower:
                tags.add(tag)

    # 2. Extract potential tags from camelCase / hyphenated / underscored terms
    # e.g., "MikroTik API" → "mikrotik", "api"
    words = re.findall(r'[a-zA-Z][a-zA-Z0-9_-]{2,}', text)
    for word in words:
        w = word.lower().strip()
        if w not in STOP_WORDS and len(w) > 2:
            if w in URL_KEYWORD_TAGS:
                tags.add(URL_KEYWORD_TAGS[w])
            elif w not in STOP_WORDS:
                tags.add(w)

    return sorted(tags)


def extract_all_tags(url: str, platform: str, user_text: str) -> list:
    """Combine tags from URL structure and user text. Deduplicate and prioritize."""
    url_tags = extract_tags_from_url(url, platform) if url else []
    text_tags = extract_tags_from_text(user_text)

    # Platform context tags (always include)
    context_tags = CATEGORY_TAG_MAP.get(platform, [])

    # Merge: url tags first (from structure), then text tags, then context
    all_tags = []
    seen = set()
    for tag in url_tags + text_tags + context_tags:
        if tag not in seen:
            seen.add(tag)
            all_tags.append(tag)

    return all_tags


# ── Content type detection ─────────────────────────────────────────

# Keywords that suggest a tool/resource vs learning content
TOOL_KEYWORDS = {
    "tool", "tools", "cli", "dashboard", "platform", "app", "extension",
    "plugin", "framework", "library", "sdk", "api", "saas", "alternative",
    "self-hosted", "open-source", "repo", "github", "release", "download",
    "install", "setup", "deploy", "docker", "package", "manager",
    "editor", "ide", "browser", "vpn", "proxy", "scanner", "scanner",
    "monitoring", "analytics", "automation", "bot", "helper",
}

LEARNING_KEYWORDS = {
    "tutorial", "guide", "how-to", "explained", "introduction", "basics",
    "deep-dive", "overview", "course", "lesson", "paper", "research",
    "study", "analysis", "theory", "concept", "principle", "technique",
    "method", "approach", "architecture", "design-pattern", "best-practice",
    "certification", "exam", "interview", "cheatsheet", "reference",
}

IDEA_KEYWORDS = {
    "idea", "idea:", "build", "create", "make", "project", "plan",
    "todo", "todo:", "reminder", "note:", "remember", "think about",
    "explore", "investigate", "research", "try", "experiment",
}


def guess_content_type(url: str, text: str, tags: list) -> str:
    """Determine if the content is a tool, learning topic, idea, or general reference."""
    combined = f"{url} {text} {' '.join(tags)}".lower()

    # Check for ideas (notes without URLs, or explicit idea markers)
    if not url:
        for kw in IDEA_KEYWORDS:
            if kw in combined:
                return "idea"

    # Check for tools
    tool_score = sum(1 for kw in TOOL_KEYWORDS if kw in combined)
    learn_score = sum(1 for kw in LEARNING_KEYWORDS if kw in combined)

    # GitHub repos with tool-like names are usually tools
    if "github.com" in combined and tool_score > 0:
        return "tool"

    # Papers, tutorials, guides are learning
    if any(kw in combined for kw in ["arxiv", "paper", "tutorial", "guide", "explained", "course"]):
        return "learning"

    # Videos are usually learning (unless clearly a product demo)
    if any(p in combined for p in ["youtube.com", "youtu.be"]):
        if tool_score > learn_score:
            return "tool"
        return "learning"

    # Score-based decision
    if tool_score > learn_score and tool_score >= 2:
        return "tool"
    if learn_score > tool_score and learn_score >= 2:
        return "learning"

    return "reference"


# ── Test/placeholder URL validation ───────────────────────────────

FAKE_URL_PATTERNS = [
    r"example\.com",
    r"localhost",
    r"127\.0\.0\.1",
    r"questions/\d{1,4}/",  # Very short question IDs are often test data
    r"/questions/12345/",   # Common test ID
]


def is_likely_real_url(url: str) -> bool:
    """Check if a URL looks like real content vs test/placeholder data."""
    for pattern in FAKE_URL_PATTERNS:
        if re.search(pattern, url, re.IGNORECASE):
            return False
    # Very short tweet IDs are likely fake
    tweet_match = re.search(r"/status/(\d+)", url)
    if tweet_match and len(tweet_match.group(1)) < 10:
        return False
    return True


def guess_categories(platform: str, tags: list) -> list:
    """Guess categories based on platform + extracted tags. Returns ranked list."""
    categories = []

    tag_set = set(tags)

    # AI/ML tags
    ai_tags = {"llm", "machine-learning", "deep-learning", "neural-networks",
               "transformers", "nlp", "computer-vision", "pytorch", "tensorflow",
               "huggingface", "openai", "gpt", "claude", "anthropic", "langchain",
               "rag", "fine-tuning", "embeddings", "prompt-engineering", "ai-agents",
               "mlops", "model-deployment", "model-training", "diffusion-models",
               "stable-diffusion", "reinforcement-learning"}
    if tag_set & ai_tags:
        categories.append("AI & Machine Learning")

    # Security tags
    sec_tags = {"security", "cybersecurity", "penetration-testing", "bug-bounty",
                "ctf", "vulnerability", "exploit", "malware", "owasp", "xss",
                "csrf", "sql-injection", "reverse-engineering", "cryptography"}
    if tag_set & sec_tags:
        categories.append("Cybersecurity")

    # Networking tags
    net_tags = {"networking", "firewall", "vpn", "dns", "tcp-ip", "vlan",
                "cisco", "mikrotik", "ubiquiti", "routing", "switching",
                "linux-networking"}
    if tag_set & net_tags:
        categories.append("Networking")

    # DevOps/Infra tags
    ops_tags = {"docker", "kubernetes", "terraform", "ansible", "jenkins",
                "ci-cd", "github-actions", "prometheus", "grafana", "aws",
                "azure", "gcp", "linux", "nginx", "homelab", "self-hosted",
                "proxmox"}
    if tag_set & ops_tags:
        categories.append("DevOps & Infrastructure")

    # Development tags
    dev_tags = {"python", "javascript", "typescript", "rust", "golang", "java",
                "react", "vue", "angular", "nextjs", "nodejs", "flask", "django",
                "fastapi", "api", "rest-api", "graphql", "database", "sql",
                "postgresql", "mongodb", "redis", "git", "github", "open-source"}
    if tag_set & dev_tags:
        categories.append("Development")

    # Business/Productivity tags
    biz_tags = {"startup", "saas", "marketing", "seo", "automation",
                "productivity", "workflow", "notion", "obsidian"}
    if tag_set & biz_tags:
        categories.append("Productivity & Tools")

    # Hardware tags
    hw_tags = {"raspberry-pi", "arduino", "homelab", "proxmox", "vmware"}
    if tag_set & hw_tags:
        categories.append("Hardware & DIY")

    # Platform-based fallbacks
    if not categories:
        if platform in ("github", "stackoverflow"):
            categories.append("Development")
        elif platform in ("medium", "linkedin"):
            categories.append("General")
        else:
            categories.append("General")

    return categories


def queue_item(url: str = None, text: str = None, user_message: str = "") -> dict:
    """Queue an item for daily processing."""
    now = datetime.now(timezone(timedelta(hours=3, minutes=30)))
    timestamp = now.isoformat()

    if url:
        # Validate URL is likely real content
        if not is_likely_real_url(url):
            return None  # Skip test/placeholder URLs
        item_id = generate_id(url)
        platform = detect_platform(url)
        tags = extract_all_tags(url, platform, text or "")
        categories = guess_categories(platform, tags)
        content_type = guess_content_type(url, text or "", tags)
        title_preview = url[:80]
    else:
        item_id = hashlib.md5(text.encode()).hexdigest()[:12]
        platform = "note"
        tags = extract_tags_from_text(text or "")
        categories = guess_categories(platform, tags)
        content_type = guess_content_type("", text or "", tags)
        title_preview = text[:80] if text else "untitled"

    entry = {
        "id": item_id,
        "url": url,
        "text": text,
        "platform": platform,
        "category_guess": categories[0] if categories else "General",
        "categories": categories,
        "content_type": content_type,
        "tags": tags[:15],  # cap at 15 initial tags, LLM will refine
        "title_preview": title_preview,
        "timestamp": timestamp,
        "user_message": user_message,
        "processed": False,
    }

    # Write to queue
    filename = f"{item_id}.json"
    filepath = os.path.join(QUEUE_DIR, filename)
    with open(filepath, "w") as f:
        json.dump(entry, f, indent=2, ensure_ascii=False)

    return entry


def process_message(message_text: str) -> dict:
    """Process an incoming message and queue items."""
    urls = extract_urls(message_text)
    items = []

    # Remove URLs from text to get any accompanying note
    note_text = message_text
    for url in urls:
        note_text = note_text.replace(url, "").strip()

    if urls:
        for url in urls:
            entry = queue_item(url=url, text=note_text if note_text else None, user_message=message_text)
            if entry is None:
                continue  # Skip test/placeholder URLs
            items.append({
                "platform": entry["platform"],
                "category": entry["category_guess"],
                "categories": entry["categories"],
                "content_type": entry["content_type"],
                "tags": entry["tags"],
                "url": url,
                "id": entry["id"],
            })
    elif message_text.strip():
        # Pure text note
        entry = queue_item(text=message_text.strip(), user_message=message_text)
        items.append({
            "platform": "note",
            "category": entry["category_guess"],
            "categories": entry["categories"],
            "content_type": entry["content_type"],
            "tags": entry["tags"],
            "url": None,
            "id": entry["id"],
        })

    return {
        "action": "queued",
        "items": items,
        "count": len(items),
    }


def main():
    if len(sys.argv) < 2:
        print(json.dumps({"error": "Usage: collect.py <message_text>"}))
        sys.exit(1)

    message = " ".join(sys.argv[1:])
    result = process_message(message)
    print(json.dumps(result, indent=2, ensure_ascii=False))


if __name__ == "__main__":
    main()
