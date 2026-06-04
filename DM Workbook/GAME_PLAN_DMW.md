# DM Workbook - Game Plan

**Last reviewed: 2026-05-28 by Claude**

> This document covers the DM Workbook standalone app only.
> For the DnDWebApp character creator, see `GAME_PLAN_CC.md`.

## Purpose

The DM Workbook is a standalone tool for the DM to manage the Azlemzyk campaign. It is not a feature of the player-facing DnDWebApp. It does not share routes, components, or data models with the character creator. Build it in `DM Workbook/` under the repo root.

It is a personal tool, not a commercial product. Design for one person who needs to run sessions efficiently. Dense information display is preferred over whitespace. Navigation should be minimal clicks to any major section.

## Stack Decision

| Layer | Choice | Rationale |
|---|---|---|
| Frontend | React via Vite | Same toolchain already in use; fast dev server |
| API | Local Express server (`dmw-api/`) | `better-sqlite3` is a Node native module - it cannot run in the browser. A thin local Express API owns all DB reads and writes. |
| Storage | SQLite via `better-sqlite3` | Zero config, local, fast, structured, no server needed. Migrate to MongoDB only if cloud sync becomes a priority. |
| Styling | Tailwind CSS | Utility-first, fast iteration, no separate CSS files |
| Auth | None | Single-user local tool |

**Dev ports:** API `5001` (avoids conflict with DnDWebApp at `5000`) | Frontend `5174`

The project structure is:
```
DM Workbook/
├── dmw-api/       ← Express + better-sqlite3, runs on port 5001
│   ├── main.js
│   ├── app.js
│   ├── routes/    ← one router per domain: npcs, factions, sessions, party, etc.
│   └── db.js      ← opens dm_workbook.db, runs schema migration on startup
├── dmw-client/    ← React/Vite frontend, proxies /api to port 5001
│   └── src/
└── dm_workbook.db ← SQLite file, created by dmw-api on first run
```

Do not use a paid service without flagging it first. Do not mix DM Workbook components or routes into the DnDWebApp client.

## World Context

Campaign world: **Azlemzyk**. Use correct terminology everywhere in labels, seed data, and copy. Do not invent alternatives.

- Primary city: Cindralock (frontier trade hub, ~7,100 people, on the Ashroad)
- Party: Akta Dragonfucked (Tiefling Sorcerer), Bryer Williams (Druid), Gribble Longtoe (Halfling Warlock), Adolf Assler (Human Barbarian)
- Major factions: Ironmark Trading Co. (IMTC), Church of Selena, Selenar, Selvants, Auric Covenant, Goblin royalty
- Divine beings: Horren (Rasc, Verum, Iris, Raea, Decius), Minora (Selena), imprisoned (Arkum, Linel)
- Planes: Azlemzyk, Kiros/the Garden, Wurth/the Throne, Eredent (mortal realm)

All seed data must use Azlemzyk-accurate names and details. No lorem ipsum. No invented lore.

## Database Schema

SQLite, single file: `dm_workbook.db`

```sql
npcs             (name, goal, method, quirk, secret, faction, status)
factions         (name, public_face, private_motive, method, pressure, leverage, escalation)
session_logs     (session_num, date, content)  -- FTS: fts_session_logs
party            (name, class, status, notable_items, notes)
encounters       (name, stat_block, dc_refs, environment, notes)
clue_trail       (clue, source_npc, target_npc, faction, location, notes)
villain_timeline (date_in_world, event, triggered_by_party)
locations        (name, description, factions_present, tensions)
world_lore       (topic, content)
campaign_timeline(date_in_world, event, session_num)
meta_currency    (player_name, inspiration, fate_tokens, clarity_tokens)
```

Create FTS index on `session_logs.content` at DB initialization.

## Phased Plan

### DM-W Phase 1: Core Reference [TODO - not started]

Priority 1 features. Nothing from Phase 2 or 3 gets built until all of these are working and verified.

- `[Claude][TODO]` **NPC Manager** - Table view of all NPCs with columns for name, faction, status, and goal. Add/edit form with fields: name, goal, method, quirk, secret, faction, status. Status options: active, inactive, dead, unknown. Filter by faction and status. Empty state shows prompt to add first NPC.
- `[Claude][TODO]` **Faction Tracker** - Table or card view per faction. Fields: public face, private motive, method, pressure, leverage, escalation. Edit in place. Seed with Azlemzyk factions: IMTC, Church of Selena, Selenar, Selvants, Auric Covenant, Goblin royalty.
- `[Claude][TODO]` **Session Log** - Chronological list of session entries. Each entry has: session number, in-world date, content (long text). Full-text search across all entries. Tag support (freeform). Newest session at top.
- `[Claude][TODO]` **Party Tracker** - Table of party members. Fields: name, class, current status, notable items, notes. Seed with Akta, Bryer, Gribble, Adolf. Inline editing without a full form modal.

Acceptance criteria for Phase 1:
- App loads without console errors.
- All four sections navigate without a full page reload.
- Empty state for each section is visible and descriptive.
- Adding, editing, and deleting a record in each section persists to `dm_workbook.db` and survives a page reload.
- Full-text search in Session Log returns correct results.

### DM-W Phase 2: Active Campaign Tools [TODO - blocked on Phase 1]

Priority 2 features. Build after Phase 1 is fully verified.

- `[Claude][TODO]` **Encounter Builder** - Named encounter entries with fields: stat blocks (freeform or structured), monster notes, DC reference table, environmental features. Encounters are reusable; link to locations optionally.
- `[Claude][TODO]` **Clue Trail** - Evidence and hook tracker. Fields: clue text, source NPC, target NPC, faction, location, notes. Table view with filter by faction or NPC. Purpose: show how investigation threads connect.
- `[Claude][TODO]` **Villain Timeline** - Scheduled events the villain executes if the party ignores them. Fields: in-world date, event description, triggered-by-party flag. Sort by date ascending. Shows what happens if the party does nothing.
- `[Claude][TODO]` **Location Notes** - Named locations with fields: description, factions present (multi-select from factions table), active tensions. Link to NPCs present. Seed Cindralock and key surrounding locations.

Acceptance criteria for Phase 2:
- All four tools persist data to `dm_workbook.db` and survive reload.
- Clue Trail filter by faction and NPC works correctly.
- Villain Timeline sorts by in-world date correctly.
- Location Notes shows correct faction names from the factions table (no stale strings if a faction is renamed).

### DM-W Phase 3: Reference And Archive [TODO - blocked on Phase 2]

Priority 3 features. Lower urgency; build when Phase 1 and 2 are solid.

- `[Claude][TODO]` **World Lore Reference** - Canon summaries stored as topic/content pairs. Topics include: creation myth, divine beings, planes, Cindralock history, Ashroad, key factions. Read-only view with search. Edit mode available.
- `[Claude][TODO]` **Divine System** - Dedicated view for the Horren table. Columns: aspect name (Rasc, Verum, Iris, Raea, Decius), domain, known artifact properties, notes. Separate section for Minora (Selena) and imprisoned beings (Arkum, Linel).
- `[Claude][TODO]` **Meta-Currency Tracker** - Per-player tracking of Inspiration, Fate tokens, and Clarity tokens. Seed with party members. Increment/decrement controls visible without entering an edit form. Changes persist immediately.
- `[Claude][TODO]` **Campaign Timeline** - In-world date tracker and event log. Fields: in-world date, event description, session number (links to Session Log entry). Sort chronologically. Separate from Session Log - this is the in-world history, not the session notes.

Acceptance criteria for Phase 3:
- World Lore search returns accurate results.
- Meta-Currency controls work without a page refresh.
- Campaign Timeline and Session Log are linked correctly by session number.

## Navigation Design

All four Phase 1 sections accessible from a persistent left sidebar. Phase 2 and 3 sections added to the same sidebar as they are built. No more than 2 clicks to reach any record from the sidebar. Active section highlighted.

## Immediate Next Tasks

1. `[Shared][NEXT]` Scaffold the project: `DM Workbook/dmw-api/` (Express + better-sqlite3, port 5001) and `DM Workbook/dmw-client/` (React/Vite, port 5174, proxies `/api` to 5001). `dmw-api/db.js` initializes `dm_workbook.db` and runs the schema migration on startup.
2. `[Shared][NEXT]` Build the left sidebar navigation shell with placeholder panels for Phase 1 sections.
3. `[Shared][NEXT]` Implement NPC Manager first (most-used section; tests the full add/edit/persist cycle).
4. `[Shared][NEXT]` Seed NPCs and factions with Azlemzyk-accurate data before considering Phase 1 complete.

## Verification Expectations

- Every new section must handle the empty state visibly.
- Every new section must handle a DB failure (connection error, write failure) without crashing.
- Persist-and-reload is the minimum verification bar: add a record, reload the page, confirm it is still there.
- Do not use lorem ipsum in any seed data. Use Azlemzyk-accurate names and details.
- No DM Workbook components or routes should be imported into the DnDWebApp client.
