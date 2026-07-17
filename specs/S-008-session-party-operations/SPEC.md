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

- Session Log stores session number/date/content and supports bounded FTS
  snippets, ordering, and no-result states.
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
| TK-001 | Create, edit, and list ordered Session Log records | ready | S-004, S-005 | pending |
| TK-002 | Add FTS5 session search with bounded snippets, ranking, and no-result state | ready | TK-001 | pending |
| TK-003 | Refresh recent-session context after writes and prove source/freshness | ready | TK-002 | pending |
| TK-004 | Create and update Party Tracker records with concise at-table view | ready | S-004, S-005 | pending |
| TK-005 | Link party members to character identities without copying derived rules data | ready | TK-004 | pending |
| TK-006 | Add per-player Inspiration/Fate/Clarity controls with persistence and rollback | ready | TK-004 | pending |
| TK-007 | Prove session search, party state, and currency controls in one responsive synthetic flow | ready | TK-003, TK-005, TK-006 | pending |

## Acceptance Criteria

- [ ] Session records persist and FTS returns accurate bounded results.
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

## Completion Result

Pending.

## Remaining Limitations Or Follow-Up Specs

- Encounters/clues/villain state remain S-009; in-world history remains S-010.

## Supersession

- Supersedes: session/party/currency TODOs in archived workbook plan.
- Superseded by: none.
