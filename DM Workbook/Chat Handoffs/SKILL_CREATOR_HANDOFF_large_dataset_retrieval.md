# Skill Creator Handoff: Large Dataset Retrieval Skill

**For:** Skill Creator chat  
**From:** Claude (DM Workbook session)  
**Date:** 2026-05-27  
**Purpose:** Build a reusable skill that lets Claude retrieve data from large, growing datasets without loading the entire dataset into context.

---

## What Claude Is Doing Right Now (The Problem)

Claude is the primary developer and data-wrangler for two related projects:

1. **DM Workbook** - A DM-facing campaign management tool set in the Azlemzyk world. It tracks NPCs, factions, session logs, encounters, locations, and campaign timelines. The data lives in a SQLite DB (MVP) that grows every session. This is the primary test case.

2. **DnDWebApp** - A player-facing D&D 5e character sheet app. Large codebase (~50+ files across `dndAPI/` and `dndclient/`). Claude needs to read relevant files each session to understand current state.

**The failure mode:** Claude currently reads the full architecture doc, full game plan doc, and any relevant source files at the start of every session. As the DM Workbook SQLite DB grows (more NPCs, more session logs, more factions, more encounters), reading everything becomes wasteful and starts consuming significant context. The user will be adding data after every game session, potentially weekly. Within months this will be a real problem.

**The goal:** A skill Claude uses every time it needs to access a large dataset - whether that's the DM Workbook DB, a large codebase, or any future dataset the user feeds into a project. The skill should tell Claude exactly how to retrieve only what it needs.

---

## Reference Model: The `chatgpt-history` Skill

There is already a working example of this pattern. Read it at:

```
C:\Users\kayde\AppData\Roaming\Claude\local-agent-mode-sessions\skills-plugin\...\skills\chatgpt-history\SKILL.md
```

The pattern it uses is a **3-tier retrieval system**:

- **Tier 1 (Hot):** A small synthesized summary file (~2-4KB). Load this when you just need broad context. Never read the raw DB for this.
- **Tier 2 (Domain):** A set of topic-specific context files, each ~2-4KB. Load only the one(s) relevant to the current task.
- **Tier 3 (Full search):** SQLite FTS queries. Use only when you need specific records, conversations, or facts. Never load the whole table.

This is the pattern the new skill should replicate, adapted for the DM Workbook.

---

## DM Workbook Data: What Exists and What Will Grow

### Current project location
```
E:\GPTCode\DnDWebApp\DM Workbook\
```

### Key reference files (already exist)
| File | Size | Purpose |
|---|---|---|
| `MASTER_ARCHITECTURE_V2.md` | Medium, stable | Full codebase map for DnDWebApp |
| `GAME_PLAN.md` | Medium, grows | Phased roadmap + session audit notes |
| `BACKLOG.md` | Small, grows | Deferred tasks and known issues |

### DM Workbook SQLite DB (being built, will grow fast)
The DM Workbook app (React/Vite + SQLite via better-sqlite3) stores:
- `npcs` - Name, goal, method, quirk, secret, faction, status
- `factions` - Public face, private motive, method, pressure, leverage, escalation
- `session_logs` - Chronological session notes, searchable, tagged
- `party` - Party members, stats, status, notable items
- `encounters` - Stat blocks, monster notes, DC refs, environment features
- `clue_trail` - Evidence and hooks linking NPCs, locations, factions
- `villain_timeline` - Scheduled events if party ignores villain
- `locations` - Descriptions, factions present, tensions
- `world_lore` - Canon summaries, divine beings, planes
- `campaign_timeline` - In-world dates and events
- `meta_currency` - Per-player inspiration, Fate, Clarity tokens

Campaign world is **Azlemzyk**. Primary city: Cindralock (~7,100 people). Party: Akta Dragonfucked, Bryer Williams, Gribble Longtoe, Adolf Assler.

The DB is small now. After 20 sessions it will have 40+ NPCs, 100+ session log entries, 10+ factions, 20+ locations, and so on.

---

## What the Skill Should Build

### Skill name suggestion
`dm-workbook-retrieval` or `large-dataset-retrieval` (the latter is reusable)

### Tier 1: Hot summary file
The skill should instruct Claude to maintain (or generate on first use) a `CAMPAIGN_SNAPSHOT.md` file at:
```
E:\GPTCode\DnDWebApp\DM Workbook\CAMPAIGN_SNAPSHOT.md
```

This file is a synthesized, ~500 word summary that gets regenerated after each session. It should include:
- Current campaign arc (1-2 sentences)
- Active faction tensions (bullets)
- Party status and last known location
- 5-10 most recently touched NPCs (name + one-line status)
- Open plot threads
- Last session number and date

**Rule:** Claude reads this first, every session, before touching anything else. If it answers the question, stop here.

### Tier 2: Domain files
The skill should define ~6-8 domain context files that Claude can generate and keep updated. Each is a focused 2-4KB file covering one slice of the world:

| File | When to load |
|---|---|
| `ctx_npcs_active.md` | When dealing with any NPC interaction, dialogue, or decision |
| `ctx_factions.md` | When faction tensions, leverage, or motives are relevant |
| `ctx_session_log_recent.md` | When Kayden asks "what happened last session" or needs recency |
| `ctx_party.md` | When party status, inventory, or relationships matter |
| `ctx_locations.md` | When planning encounters or travel |
| `ctx_villain_timeline.md` | When asking what the villain is doing |

**Rule:** Claude reads only the relevant file(s), not all of them. Maximum 2-3 domain files per session open.

### Tier 3: SQLite query
When a specific NPC name, session number, faction, or fact is needed that is not in the domain files, query the SQLite DB directly.

**DB path:** `E:\GPTCode\DnDWebApp\DM Workbook\dm_workbook.db`

**SQLite in bash note:** The DB cannot be opened from the mounted Windows path directly. Copy to /tmp first:
```python
import sqlite3, shutil, glob, os
src = next(p for p in glob.glob('/sessions/*/mnt/DM Workbook/dm_workbook.db') if os.path.exists(p))
shutil.copy2(src, '/tmp/dm_query.db')
con = sqlite3.connect('/tmp/dm_query.db')
# ... queries ...
con.close()
os.remove('/tmp/dm_query.db')
```

**FTS on session logs:** The skill should require that `session_logs` has a full-text search virtual table so Claude can do `WHERE fts_session_logs MATCH 'Gribble OR betrayal'` instead of scanning all rows.

---

## Generalization: Applies to Any Large Dataset

The same 3-tier pattern applies beyond the DM Workbook. The skill should be written so it generalizes. Whenever Claude is given a large dataset (codebase, conversation history, campaign DB, log files), the protocol is:

1. Is there a hot summary? Read it. Done if sufficient.
2. Is there a domain file for this topic? Read only that one. Done if sufficient.
3. Need a specific record? Query the DB or grep the file. Don't read everything.

The skill should explicitly prohibit:
- Reading the entire DB or all files to answer a question that a targeted query could answer
- Loading more than 3 domain files in a single session unless explicitly asked
- Skipping Tier 1 and jumping to Tier 3 (wastes context on noise)

---

## DnDWebApp Codebase (Secondary Test Case)

For the existing `dndAPI/` and `dndclient/` codebase, a similar pattern applies:

- **Tier 1:** `MASTER_ARCHITECTURE_V2.md` is the hot summary for the whole app. Read this first, every time.
- **Tier 2:** Read only the specific component or route file relevant to the task.
- **Tier 3:** Use `grep` (bash `rg`) to find a symbol, function, or pattern across the codebase rather than reading every file.

The skill should encode this for Claude explicitly so it doesn't re-read `MASTER_ARCHITECTURE_V2.md` on top of a domain file on top of 5 component files every session.

---

## What the Skill Creator Should Deliver

A single `SKILL.md` that Claude uses every time it accesses a large dataset in this project. It should:

1. Open with a decision tree: "Start here before you read anything else."
2. Define Tier 1, Tier 2, Tier 3 clearly with exact file paths and query templates.
3. Include the SQLite copy-to-tmp boilerplate so Claude doesn't have to reinvent it.
4. Include a `ctx_` file generation protocol - how Claude should build and refresh the domain files after each session.
5. Have a trigger rule: any time Kayden asks for campaign data, codebase state, or project status, this skill fires first.
6. Be general enough that the same 3-tier protocol applies to any future large dataset Kayden gives Claude.

### Suggested trigger phrases for the skill description
"show me the campaign state", "what's going on with [NPC/faction]", "what happened last session", "where are we in the story", "look up [anything in the DB]", "check the codebase", "read the architecture", "what files do I need to change", "project status"

---

## Current Process Pain Points to Fix

| Pain | Current behavior | Target behavior |
|---|---|---|
| Context bloat | Claude reads architecture doc + game plan + multiple source files every session | Read CAMPAIGN_SNAPSHOT.md (Tier 1) then stop unless more is needed |
| No structured retrieval | Claude guesses which files to read | Decision tree in the skill tells Claude exactly what to load for each query type |
| No hot summary exists yet | Must read full docs | Skill bootstraps CAMPAIGN_SNAPSHOT.md on first run; Claude maintains it |
| DB grows unbounded | Eventually Claude will try to read too much | Tiered queries cap context consumption at query time |
| Redundant re-reads | Claude re-reads same architecture doc every session | Tier 1 hot file is tiny; read once, proceed |

---

## Open Questions for Skill Creator

1. Should the `ctx_` domain files be generated by Claude at the end of each session, or on-demand when first needed? (Recommendation: on-demand, refreshed at session end.)
2. Should the skill include a "session close" protocol that tells Claude to update the hot summary and any touched domain files before ending the conversation?
3. Should the Tier 3 query templates be embedded in the skill itself, or in a separate `QUERY_TEMPLATES.md`?
4. Is the pattern general enough to be a standalone "large-dataset-retrieval" skill, or should it be DM-Workbook-specific and generalization handled later?

---

## Files to Create/Generate (Skill Should Bootstrap These)

When the skill runs for the first time on a session with no existing context files, it should:

1. Check if `CAMPAIGN_SNAPSHOT.md` exists. If not, generate it from whatever data is available (DB query + existing docs).
2. Check if `ctx_npcs_active.md` exists. If not, generate it on first NPC-related request.
3. Never block the user's request to generate the files - generate inline, save, then answer.

---

*This handoff was written by Claude after reviewing the `chatgpt-history` skill (the reference implementation), the DM Workbook architecture, and the DnDWebApp GAME_PLAN.md and MASTER_ARCHITECTURE_V2.md. The skill creator has everything it needs above to build the retrieval skill.*
