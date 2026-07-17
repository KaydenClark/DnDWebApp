# S-007 - Campaign Actors And Factions

> Generated from LLM Workbench v2.3.

**Spec ID:** S-007
**Status:** planned
**Priority:** 2
**Owner:** Campaign Domain Engineer
**Updated:** 2026-07-17
**Catalog description:** Let Kayden manage NPC motives/status and faction pressure/leverage as linked living campaign records.
**Blockers:** S-004, S-005
**Latest event:** NPC Manager and Faction Tracker requirements were ported from settled workbook canon.
**Next gate:** Complete the foundation and approved seed path, then activate NPC CRUD.

## Outcome

Kayden can find, create, update, filter, and cross-link NPCs and factions fast
enough for preparation and live-session decisions.

## Why It Matters

People and organizations drive most campaign consequences. Their motives,
methods, secrets, pressure, leverage, and escalation need to remain linked and
current instead of scattered across notes.

## Current Verified State

- Planned NPC fields: name, goal, method, quirk, secret, faction, status.
- Planned faction fields: name, public face, private motive, method, pressure,
  leverage, escalation.
- No tracked campaign database/API/UI implements either manager.

## Desired Behavior

- NPC Manager supports validated CRUD, active/status/faction filtering, and
  linked faction display.
- Faction Tracker supports validated CRUD, pressure/leverage/escalation, and
  current linked NPC membership.
- Renames preserve links through stable IDs.
- Destructive deletes require impact preview; archive/inactive is default.
- Azlemzyk seed/import uses S-005 provenance and synthetic tests remain private.

## Decisions And Contracts

- Names are display values; stable IDs own links.
- Secrets are private and excluded from player-facing views by default.
- Faction membership is relational, not copied stale strings.

## Non-Goals

- AI-generated personalities, public NPC pages, or automatic story decisions.

## Dependencies And Blockers

- S-004 schema/runtime and S-005 approved campaign data.

## Vertical Implementation Slices

| Ticket | Slice | Status | Blockers | Proof |
|---|---|---|---|---|
| TK-001 | Create/list/update NPCs with validation, persistence, and active-status filter | ready | S-004, S-005 | pending |
| TK-002 | Filter/search NPCs by name, faction, and status with visible empty/error states | ready | TK-001 | pending |
| TK-003 | Archive NPCs safely with link-impact preview and no destructive default | ready | TK-002 | pending |
| TK-004 | Create/list/update factions with pressure, leverage, and escalation | ready | TK-001 | pending |
| TK-005 | Link factions to current NPC members through stable IDs and safe rename behavior | ready | TK-004 | pending |
| TK-006 | Prove actor/faction workflow with Azlemzyk-shaped synthetic fixtures and responsive UI | ready | TK-003, TK-005 | pending |

## Ticket Done Contracts

| Ticket | Done criteria | Required proof |
|---|---|---|
| TK-001 | NPC CRUD persists all settled fields, validates status/required inputs, and shows active/empty/error states. | API/DB CRUD and validation tests, persist-reload check, and client state tests. |
| TK-002 | NPC search/filter returns correct name/faction/status subsets with deterministic ordering. | Filter-combination fixtures, no-result/error tests, and responsive table screenshot. |
| TK-003 | NPC archive previews link impact, preserves history, and never destructively deletes by default. | Linked-record fixture, impact-preview assertion, archive/reload test, and unchanged-history proof. |
| TK-004 | Faction CRUD persists public/private motive, method, pressure, leverage, and escalation fields. | API/DB validation and persist-reload tests plus client edit-state proof. |
| TK-005 | Faction membership uses stable IDs and remains correct across faction/NPC rename or archive. | Rename/archive relationship fixtures, orphan check, and rendered membership assertion. |
| TK-006 | One synthetic responsive flow creates/links/filters/archives actors and exposes no private secrets in player projection. | Browser E2E, desktop/tablet screenshots, privacy scan, console/network log, and full suite. |

## Acceptance Criteria

- [ ] NPC and faction fields match settled canon.
- [ ] Filters/search and empty/error states are accurate.
- [ ] Stable links survive renames.
- [ ] Secrets stay out of player-facing responses.
- [ ] Archive/impact preview prevents accidental destructive loss.

## Testing Seams

- Temporary DB/API tests, stable-ID rename fixtures, privacy projection tests,
  responsive browser workflow.

## Verification Procedure

```bash
# Targeted actor/faction tests plus full campaign and browser suites.
```

## Documentation Impact

- User field definitions live here; README gains usage after the module ships.

## Append-Only Evidence And Execution Log

| Date | Ticket | Event | Verification | Docs | Remaining gap |
|---|---|---|---|---|---|
| 2026-07-17 | canon harvest | Ported NPC Manager and Faction Tracker as one linked actor capability | Archived DMW plan/schema and retrieval contract inspected | S-007 created | All six slices remain |
| 2026-07-17 | Planner remediation | Added explicit done criteria and required proof to all actor/faction slices | Six ticket rows matched six done-contract rows; blocker syntax, render, and doctor checked | S-007 updated | Six implementation slices remain |

## Completion Result

Pending.

## Remaining Limitations Or Follow-Up Specs

- Party, clues, locations, sessions, and timelines own their own links.

## Supersession

- Supersedes: NPC/faction TODOs in the archived workbook plan.
- Superseded by: none.
