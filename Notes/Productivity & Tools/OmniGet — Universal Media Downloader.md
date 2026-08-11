---
title: OmniGet — Universal Media Downloader
source: https://github.com/tonhowtf/omniget
platform: note
content_type: tool
date_saved: 2026-08-10
date_processed: 2026-08-11
category: Productivity & Tools
tags: [video-downloader, youtube, instagram, tiktok, universal-downloader, open-source, tauri, rust, batch-download, media-conversion, ffmpeg, ebook-reader, torrent, cross-platform, yt-dlp, gpl3]
rating: worth-deep-reading
author: Linuxor / pedrambirack
note_id: e266745f0fcd
---

# OmniGet — Universal Media Downloader

## Summary
OmniGet (github.com/tonhowtf/omniget) is a GPL-3.0 open-source universal media downloader built with Tauri (Rust backend) that supports 1800+ sites — including YouTube, Instagram, TikTok, Reddit, Udemy, Hotmart, Bilibili, and even torrents. It aims to replace the need for multiple separate download tools with one unified application. Key features include: quality and format selection, batch download with queue management, partial video download and audio-only extraction, built-in video/music player, PDF/EPUB ebook reader, FFmpeg-powered file converter, and global clipboard hotkey for one-key downloads. Built with pnpm/Tauri, available on GitHub with full source.

## Key Takeaways
- Supports 1800+ sites in one app — replaces yt-dlp, separate torrent clients, etc.
- Quality + format selection, batch queues, partial downloads, audio extraction.
- Built-in video player, music player, PDF/EPUB reader, FFmpeg converter.
- Global clipboard hotkey: copy a link → press hotkey → download starts.
- GPL-3.0, open source, Tauri-based (Rust + frontend), cross-platform.
- Particularly strong for educational content: Udemy + Hotmart course downloads.

## My Notes
Interesting as a desktop alternative to yt-dlp on the VPS. On the server side, we use yt-dlp + ffmpeg already. OmniGet is desktop-first (Tauri GUI), so not directly useful for server-side work. But the Udemy/Hotmart download feature is unique — useful if we ever need to download course content. Bookmark as a "nice to have" desktop tool.

## Related
- [[yt-dlp — Video Download & Transcription Workflow]]