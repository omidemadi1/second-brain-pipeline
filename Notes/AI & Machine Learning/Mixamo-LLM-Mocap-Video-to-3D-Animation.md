---
title: "Mixamo LLM Mocap — Video to 3D Character Animation Pipeline"
source: "https://www.instagram.com/reel/DcNOMyTCXmO/?igsi=MWZ6aGhsOXF0bGQyeA=="
platform: "instagram"
content_type: "tool"
date_saved: "2026-08-28T08:04:52.521616+03:30"
date_processed: "2026-08-29"
category: "AI & Machine Learning"
tags:
  - motion-capture
  - 3d-animation
  - blender
  - mixamo
  - gvhmr
  - smpl-x
  - ai-animation
  - video-to-3d
  - character-rigging
  - fk-animation
  - retargeting
  - open-source
  - ai-agent
  - game-dev
  - pipeline-automation
  - worth-deep-reading
rating: "worth-deep-reading"
author: "githubsignals (Instagram) / squall01337 (GitHub)"
---

## Summary

**Mixamo LLM Mocap** (squall01337/mixamo-llm-mocap) is an open-source pipeline that turns any locked-camera video — filmed or AI-generated — into a clean FK (Forward Kinematics) animation on **any Mixamo character**, with no mocap suit and no manual keyframing. The entire process is scriptable enough that an **AI agent can run the whole loop end-to-end**. The pipeline handles single performers and **two people fighting in the same scene**, keeping movements realistic and grounded. It uses GVHMR (SMPL-X mesh recovery) for 3D pose estimation, spec-driven retargeting that preserves motion direction while rebuilding positions from the target character's measured bone lengths, and Blender MCP for live FK application with foot planting and zero skate. A comprehensive QA gate (qa_clip.py) catches exploded bones, hip pops, foot skate, drifting roots, and broken rest poses numerically before human review. The two-character pipeline splits tracks by screen side, retargets onto different Mixamo characters with their own proportions, and places them at the actual measured distance from the footage.

## Key Takeaways

- **Any Mixamo character works** — `setup_rig.py` builds a clean scene from your Mixamo FBX download and measures it into `rig_profile.json` (rest pose, bone lengths, hip/ground heights); every stage reads this profile
- **Motions are data, not code** — New motions are small JSON specs in `action_specs/` (kung-fu forms, fight combos, jumping spin kicks, two-fighter duels); the schema is documented in `docs/PIPELINE.md`
- **Honest Mixamo FK** — Hips are the only translating bone; everything else is quaternions at 30fps — clips drop into any Mixamo-style workflow without cleanup
- **Real ground contact** — Planted feet solve to ground height with zero skate; jumps integrate the estimator's real pelvis arc
- **QA gate, not vibes** — Numerical checks catch exploded bones, hip pops, foot skate, drifting roots, broken rest poses before human review
- **Closed refinement loop** — `compare_reference.py` measures retarget vs source video frame-by-frame on what an eye reads (hand height vs face, hand distance, limbs inside torso, gaze direction) and reports exact diverging frame windows
- **Two characters, one scene** — Performer tracks split by screen side (robust where tracker IDs swap on contact), retargeted onto different Mixamo characters with measured proportions, placed at actual distance recovered from footage
- **Agent-native design** — Beat decisions from `analyze_landmarks.py` numbers (never eyeballing), every stage is CLI/socket call, `docs/PITFALLS.md` encodes every mistake for the next operator (human or AI)

## My Notes

This is a **complete production pipeline** — not a demo. The 10-stage pipeline (estimate_pose → analyze_landmarks → action_specs → lift_to_mixamo → apply_mixamo_fk → qa_clip → compare_reference → compare_pair → run_in_blender → render_preview) is fully documented with install guides for Windows (prebuilt pytorch3d wheel) and Linux. Requires ~8GB VRAM (developed on RTX 4080), Blender 5.1+, Blender MCP add-on, GVHMR checkpoints (~5GB), SMPL-X body model. The "action_spec" schema is the key abstraction — it separates what the video can know (motion) from what it can't (support foot, fist timing, rest locks). This is exactly the kind of structured, agent-operable tooling that makes AI-driven 3D content pipelines viable. Perfect for game dev, animation studios, and AI video-to-3D workflows.

## Related

- [[Multi-Agent CAD Text-to-3D Pipeline]]
- [[LingBot-Map-Real-Time-3D-from-Video]]
- [[AI & Machine Learning/Multi-Agent CAD Text-to-3D Pipeline.md]]
- [[AI & Machine Learning/LingBot-Map-Real-Time-3D-from-Video.md]]