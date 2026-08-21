---
title: "Paper Tunes — Store Songs on Paper via QR Codes, Stream Over LoRA"
source: "https://share.google/OJZMsW3uPueAp6CNQ"
platform: "web"
content_type: "reference"
date_saved: "2026-08-20T07:37:44.485014+03:30"
date_processed: "2026-08-21"
category: "Development"
tags:
  - lora
  - qr-code
  - audio-compression
  - neural-codec
  - encodec
  - meta-ai
  - paper-storage
  - offline-data-transfer
  - mesh-networking
  - meshtastic
  - makestreame
  - hackaday
  - innovative-compression
  - low-bandwidth
rating: "worth-deep-reading"
author: "Makestreame (via Hackaday)"
---

## Summary

Paper Tunes by Makestreame (featured on Hackaday) stores a full song on a single sheet of paper via QR codes and transmits it over LoRA (Long Range radio). The breakthrough: Meta's EnCodec neural codec compresses a 2.9 MB MP3 down to 21.44 kB — small enough to fit across 8 QR codes (front/back of paper = "A side" and "B side"). EnCodec uses neural networks to extract only the minimal information needed to reconstruct audio. While 21 kB won't fit in a single 3.3 kB QR code, 8 codes on one page make it work. This same compression enables LoRA transmission, proving "unsuitable for audio" is a challenge, not a limitation. The project includes Instructables build guide and audio samples.

## Key Takeaways

- **EnCodec is the key**: Meta's neural audio codec achieves ~135x compression (2.9 MB → 21 kB) with surprising quality
- **Physical-digital bridge**: Paper + QR codes = offline, durable, human-readable data storage
- **LoRA audio is viable**: 21 kB fits easily in LoRA packets; enables mesh network voice/music sharing
- **Error correction**: QR codes have built-in redundancy — damage resistant
- **Prior art**: PaperBack (Oleh Yuschuk) stored ~0.5 MB/page; 1200-2400 DPI printers could pack more QR codes
- **Mesh implications**: Meshtastic could bundle EnCodec for walkie-talkie voice over mesh (2.4 GHz LoRA)

## My Notes

- EnCodec: Open source from Meta AI; check Hugging Face for models/integrations
- Build requirements: Thermal/laser printer (600+ DPI), QR generator, EnCodec encoder/decoder, LoRA radio (SX127x/SX126x)
- Use cases: Offline music sharing, emergency comms, mesh network voice, art installations, education
- Compression vs. quality trade-off: EnCodec at 21 kB/3min = ~1.2 kbps — impressive for neural codec
- Could this work for voice notes? Lower bitrate possible for speech-only
- Hackaday comments suggest 15+ QR codes/page possible with 1200 DPI + 30% error correction

## Related

- [[diagram-design-editorial-diagrams]]
- [[web-animation-mastery-gsap-framer-motion]]
- [[wiretapper-wireless-osint-tool]]