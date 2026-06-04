---
name: large-dataset-retrieval
description: >
  Enforces a 3-tier retrieval protocol when accessing large or growing datasets — DnDWebApp codebase (dndAPI/ + dndclient/),
  DM Workbook SQLite DB, or any future large dataset Kayden provides. Triggers on: "what's the app state", "check the codebase",
  "what files do I need to change", "project status", "what's going on with [NPC/faction/character]", "what happened last
  session", "where are we in the story", "look up [anything in the DB]", "show me the campaign state", "read the architecture",
  "what does the DB have on X". Prohibits full-dataset reads when a targeted query suffices. Does NOT cover ChatGPT history
  (see chatgpt-history skill) or one-off file reads for small files.
---

# Large Dataset Retrieval — 3-Tier Protocol

Before reading any file or querying any database, follow this decision tree. Do not skip tiers.

---

## Decision Tree — Start Here

```
What are you looking for?
│
├── General app or campaign state (broad context)
│   └── → Tier 1: Read the hot summary. Stop if it answers the question.
│
├── A specific topic (NPCs, factions, a route, a component)
│   └── → Tier 2: Read the one domain file that covers it. Stop if sufficient.
│
└── A specific record, symbol, conversation, or fact
    └── → Tier 3: Query the DB or grep the codebase. Never read everything.
```

**Hard limits:**
- Never read more than 3 domain files (Tier 2) per session unless explicitly asked.
- Never jump to Tier 3 before checking Tier 1 and Tier 2 — Tier 3 is for precision lookups, not context loading.
- Never read an entire SQLite table or an entire codebase directory to answer a question a targeted query could answer.

---

## Dataset A — DnDWebApp Codebase

Root: `E:\GPTCode\DnDWebApp\`  
Two git repos: `dndAPI/` (Express backend) and `dndclient/` (React/Vite frontend)

### Tier 1 — Architecture hot summary

Read `E:\GPTCode\DnDWebApp\MASTER_ARCHITECTURE_V2.md` at the start of any DnDWebApp session.  
This is the single source of truth for the full codebase. Read it once. Do not re-read it in the same session.

When to stop here: The question is about stack, routes, the derivation engine, the data model, milestones, standards, or any topic covered in the architecture doc.

### Tier 2 — Targeted file reads

After reading MASTER_ARCHITECTURE_V2.md, read only the specific file relevant to the task.

| Task type | File to read |
|---|---|
| Character derivation logic | `dndAPI/services/characterDerivation.js` |
| Character CRUD routes | `dndAPI/routes/character/character.js` |
| Character data access | `dndAPI/DataAccess/characters.js` |
| Compendium data access | `dndAPI/DataAccess/compendium.js` |
| Seeding pipeline | `dndAPI/seeds/loadSeedData.js` + `seeds/import5etools.js` |
| Full character sheet UI | `dndclient/src/pages/characters/playersCharacter.js` |
| Character list + create form | `dndclient/src/pages/characters/charactersList.js` |
| Auth context | `dndclient/src/context/auth.js` |
| API client functions | `dndclient/src/lib/api.js` |
| Frontend routes | `dndclient/src/components/navigation/Routes.js` |
| Backend tests | `dndAPI/test/api.test.js` |

Read only the file(s) directly relevant to the task. Do not speculatively read adjacent files.

### Tier 3 — Symbol and pattern search

When you need to find where a function, variable, or pattern is defined or used without reading every file:

```bash
# Find a function definition across the whole codebase
cd /sessions/*/mnt/DnDWebApp && rg "functionName" --type js -n

# Find all usages of a specific API endpoint
rg "\/player\/:characterId" --type js -n

# Find all files importing a module
rg "require\('.*characterDerivation" --type js -l

# Find a component reference across client
rg "PlayersCharacter" dndclient/src --type js -n
```

Use `rg` (ripgrep) in bash. Never read whole directories to find a symbol.

---

## Dataset B — DM Workbook

Root: `E:\GPTCode\DnDWebApp\DM Workbook\`  
DB: `E:\GPTCode\DnDWebApp\DM Workbook\dm_workbook.db` (SQLite, grows each session)  
Campaign world: **Azlemzyk**. City: Cindralock. Party: Akta Dragonfucked, Bryer Williams, Gribble Longtoe, Adolf Assler.

### Tier 1 — Campaign hot summary

Read `E:\GPTCode\DnDWebApp\DM Workbook\CAMPAIGN_SNAPSHOT.md` at the start of any DM Workbook session.

**If CAMPAIGN_SNAPSHOT.md does not exist:** Generate it immediately from available data (DB query + existing docs), save it, then answer. Do not block the request. Contents:
- Current campaign arc (1-2 sentences)
- Active faction tensions (bullets)
- Party status and last known location
- 5-10 most recently touched NPCs (name + one-line status)
- Open plot threads
- Last session number and date

When to stop here: The question is about general campaign state, party status, recent arc summary, or open threads.

### Tier 2 — Domain context files

After checking the snapshot, load only the file matching the topic. Maximum 2-3 domain files per session.

| File | Load when... |
|---|---|
| `E:\GPTCode\DnDWebApp\DM Workbook\ctx_npcs_active.md` | Any NPC interaction, dialogue, motivation, or decision |
| `E:\GPTCode\DnDWebApp\DM Workbook\ctx_factions.md` | Faction tensions, leverage, motives, escalation |
| `E:\GPTCode\DnDWebApp\DM Workbook\ctx_session_log_recent.md` | "What happened last session" or any recency question |
| `E:\GPTCode\DnDWebApp\DM Workbook\ctx_party.md` | Party status, inventory, relationships, individual notes |
| `E:\GPTCode\DnDWebApp\DM Workbook\ctx_locations.md` | Encounter planning, travel, location descriptions |
| `E:\GPTCode\DnDWebApp\DM Workbook\ctx_villain_timeline.md` | What the villain is doing, scheduled events |

**If a ctx_ file does not exist:** Generate it from a Tier 3 DB query, save it, then answer. Do not block.

Each ctx_ file should be 2-4KB max. Synthesize from DB data — do not dump raw rows.

### Tier 3 — SQLite queries

Use when a specific NPC name, session number, faction, location, or fact is needed that the domain files do not cover.

**Copy-to-tmp pattern (required — cannot open DB from mounted Windows path directly):**

```python
import sqlite3, shutil, os, glob
src = next(p for p in glob.glob('/sessions/*/mnt/DM Workbook/dm_workbook.db') if os.path.exists(p))
shutil.copy2(src, '/tmp/dm_query.db')
con = sqlite3.connect('/tmp/dm_query.db')
# --- your queries here ---
con.close()
os.remove('/tmp/dm_query.db')
```

Run via `mcp__workspace__bash` using `python3 -c "..."` or a heredoc.

**Schema:**

```
npcs             name, goal, method, quirk, secret, faction, status
factions         name, public_face, private_motive, method, pressure, leverage, escalation
session_logs     session_num, date, content  [FTS: fts_session_logs]
party            name, class, status, notable_items, notes
encounters       name, stat_block, dc_refs, environment, notes
clue_trail       clue, source_npc, target_npc, faction, location, notes
villain_timeline date_in_world, event, triggered_by_party
locations        name, description, factions_present, tensions
world_lore       topic, content
campaign_timeline date_in_world, event, session_num
meta_currency    player_name, inspiration, fate_tokens, clarity_tokens
```

**Query templates:**

```sql
-- Look up a specific NPC
SELECT * FROM npcs WHERE name LIKE '%Gribble%';

-- FTS across session logs
SELECT session_num, date, snippet(fts_session_logs, 0, '[', ']', '...', 20) as match
FROM fts_session_logs
WHERE fts_session_logs MATCH 'betrayal OR ambush'
ORDER BY session_num DESC
LIMIT 10;

-- Active NPCs by faction
SELECT name, goal, status FROM npcs WHERE faction = 'Ashveil Syndicate' AND status != 'dead';

-- Recent sessions
SELECT session_num, date, substr(content, 1, 300) as preview
FROM session_logs
ORDER BY session_num DESC
LIMIT 5;

-- Faction leverage and escalation
SELECT name, leverage, escalation FROM factions ORDER BY name;

-- Party current state
SELECT name, class, status, notable_items FROM party;

-- Villain timeline upcoming
SELECT date_in_world, event FROM villain_timeline ORDER BY date_in_world;
```

**FTS requirement:** Confirm `fts_session_logs` exists before querying. If it does not:

```sql
CREATE VIRTUAL TABLE fts_session_logs USING fts5(content, content='session_logs', content_rowid='rowid');
INSERT INTO fts_session_logs(fts_session_logs) VALUES('rebuild');
```

---

## Session Close Protocol

At the end of any session where DM Workbook data was read or modified:

1. **Update CAMPAIGN_SNAPSHOT.md** — regenerate from current DB state. Keep it under 500 words.
2. **Update any ctx_ files that were touched** — re-query the relevant DB tables and rewrite the file. Do not append; overwrite with fresh synthesized content.
3. **Do not update files that were only read, not changed** — avoid unnecessary writes.

State what you updated before closing: "Updated CAMPAIGN_SNAPSHOT.md and ctx_npcs_active.md."

---

## General Protocol — Any Future Large Dataset

When Kayden provides a new large dataset (log files, exported data, new DB), apply the same pattern:

1. Is there a hot summary file? Read it first.
2. Is there a domain/topic file for this query? Read only that one.
3. Need a specific record? Query or grep. Do not read everything.

If no hot summary exists: offer to generate one before proceeding. A 300-500 word synthesized summary is always worth creating for any dataset that will be accessed more than once.

---

## What This Skill Prohibits

- Reading `MASTER_ARCHITECTURE_V2.md` more than once per session.
- Reading all ctx_ files when only one is relevant.
- Running `SELECT * FROM npcs` (or any table) without a WHERE clause when a targeted query would answer the question.
- Reading entire source directories (`dndAPI/routes/`, `dndclient/src/pages/`) when `rg` could find the symbol.
- Generating ctx_ files from scratch every session — check if they exist first.
- Skipping Tier 1 and going straight to Tier 3 — hot summaries exist to prevent this.
