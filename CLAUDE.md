---
doc_type: claude_bridge
version: 2
project_name: "DnDWebApp"
status: active
imports:
  - AGENTS.md
---

# DnDWebApp - Claude Instructions

@AGENTS.md

Use this file only for Claude-specific workflow notes that cannot live in the
shared `AGENTS.md`. Keep shared project rules in `AGENTS.md` so Codex, Claude,
and other agents follow the same source of truth.

## Claude-Specific Notes

- Read `AGENTS.md` first, then the nearest nested project instructions before
  editing `dndAPI/` or `dndclient/`.
- Keep this bridge concise; larger project context belongs in `AGENTS.md`,
  `BLUEPRINT.md`, `ROADMAP.md`, or `RUNBOOK.md`.
