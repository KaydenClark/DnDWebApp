# S-008 - Session And Party Operations

> Generated from LLM Workbench v2.3.

**Spec ID:** S-008
**Status:** planned
**Priority:** 2
**Owner:** Session Operations Engineer
**Updated:** 2026-07-17
**Catalog description:** Give Kayden a searchable Session Log, live Party Tracker, and immediate per-player meta-currency controls.
**Blockers:** S-004, S-005
**Latest event:** Session Log, FTS, Party Tracker, and Meta-Currency contracts were ported from settled campaign direction.
**Next gate:** Complete the local foundation and activate session capture/search.

## Outcome

Kayden can record a session, recover what happened, inspect current party state,
and adjust table currencies without leaving the campaign operating surface.

## Why It Matters

These are the highest-frequency at-table records. They must persist quickly,
remain searchable, and distinguish historical notes from current party state.

## Current Verified State

- Planned schema defines `session_logs`, `party`, `meta_currency`, and FTS5.
- Historical query templates define recent sessions and full-text snippets.
- No tracked campaign runtime implements these workflows.

## Desired Behavior

- Session Log stores session number/in-world date/content/freeform tags, lists
  newest sessions first, and supports bounded FTS snippets and no-result states.
- Party Tracker stores member/class/status/notable items/notes and exposes a
  concise at-table view.
- Meta-Currency tracks Inspiration, Fate, and Clarity per player with immediate
  increment/decrement persistence and safe bounds.
- Updates are transactional and retrieval contexts refresh.
- Player-facing projections exclude DM-only notes.

## Decisions And Contracts

- Session Log is real-session history; Campaign Timeline is in-world history.
- Party state is not duplicated from character sheets unless an explicit link
  defines which fields sync.
- Immediate controls use optimistic UI only with rollback/error visibility.

## Non-Goals

- Audio transcription, automatic summaries as canon, or combat initiative.

## Dependencies And Blockers

- S-004 foundation and S-005 approved data. S-006 consumes these records.

## Vertical Implementation Slices

| Ticket | Slice | Status | Blockers | Proof |
|---|---|---|---|---|
| TK-001 | Create, edit, tag, and list newest-first Session Log records | ready | S-004, S-005 | pending |
| TK-002 | Add FTS5 session search with bounded snippets, ranking, and no-result state | ready | TK-001 | pending |
| TK-003 | Refresh recent-session context after writes and prove source/freshness | ready | TK-002 | pending |
| TK-004 | Create and update Party Tracker records with concise at-table view | ready | S-004, S-005 | pending |
| TK-005 | Link party members to character identities without copying derived rules data | ready | TK-004 | pending |
| TK-006 | Add per-player Inspiration/Fate/Clarity controls with persistence and rollback | ready | TK-004 | pending |
| TK-007 | Prove session search, party state, and currency controls in one responsive synthetic flow | ready | TK-003, TK-005, TK-006 | pending |

## Ticket Done Contracts

| Ticket | Done criteria | Required proof |
|---|---|---|
| TK-001 | Session CRUD persists number/date/content/freeform tags and lists newest sessions first after reload. | API/DB validation tests, tag round-trip, newest-first ordering fixture, and persist-reload browser trace. |
| TK-002 | FTS returns accurate bounded/ranked snippets for content and handles no-result/invalid queries. | FTS fixture tests for match/rank/snippet/limit/no-result/injection cases. |
| TK-003 | Session writes refresh recent-session context with correct source/freshness and no canonical duplication. | Fixed-clock write/invalidation test, context diff, provenance fields, and no-extra-write assertion. |
| TK-004 | Party CRUD/inline editing persists settled fields with clear loading/empty/error states. | API/DB/client tests, inline persist-reload trace, and responsive table screenshot. |
| TK-005 | Party-character links use stable IDs and never copy backend-derived rules values as party truth. | Link/rename/missing-character fixtures and schema/response assertion excluding derived duplicates. |
| TK-006 | Inspiration/Fate/Clarity increments/decrements persist within bounds or visibly roll back on failure. | Boundary/transaction/API tests, simulated failure rollback, and no-refresh UI trace. |
| TK-007 | One responsive synthetic flow records/tags/searches a session, edits party state, and adjusts currency without leaking DM-only notes. | Browser E2E, viewport screenshots, privacy projection scan, console/network log, and full suite. |

## Acceptance Criteria

- [ ] Session records persist and FTS returns accurate bounded results.
- [ ] Session Log persists freeform tags and lists newest sessions first.
- [ ] Party state is fast to read/update and links safely to characters.
- [ ] Currency changes persist immediately or roll back visibly.
- [ ] DM-only notes do not appear in player projections.
- [ ] Recent-session context refreshes with provenance.

## Testing Seams

- FTS fixtures, transaction/rollback tests, character-link fixtures, privacy
  projection tests, browser at-table flow.

## Verification Procedure

```bash
# Targeted session/party tests plus full campaign and browser suites.
```

## Documentation Impact

- README explains session/party operation after ship; retrieval docs link S-006.

## Append-Only Evidence And Execution Log

| Date | Ticket | Event | Verification | Docs | Remaining gap |
|---|---|---|---|---|---|
| 2026-07-17 | canon harvest | Consolidated three tightly linked live-session capabilities | Archived schema, queries, and acceptance notes inspected | S-008 created | All seven slices remain |
| 2026-07-17 | Planner remediation | Restored freeform Session Log tags/newest-first ordering and added explicit done/proof contracts to all session/party slices | Archived Phase 1 canon, 27-row matrix, seven contract rows, blocker audit, render, and doctor checked | S-008 and Blueprint updated | Seven implementation slices remain |

## Completion Result

Pending.

## Remaining Limitations Or Follow-Up Specs

- Encounters/clues/villain state remain S-009; in-world history remains S-010.

## Supersession

- Supersedes: session/party/currency TODOs in archived workbook plan.
- Superseded by: none.
