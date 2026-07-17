# S-010 - World Reference And Timeline

> Generated from LLM Workbench v2.3.

**Spec ID:** S-010
**Status:** planned
**Priority:** 4
**Owner:** World Canon Engineer
**Updated:** 2026-07-17
**Catalog description:** Give Kayden linked Location Notes, searchable World Lore, the Divine System reference, and chronological Campaign Timeline.
**Blockers:** S-004, S-005, S-007, S-008
**Latest event:** Location, lore, divine, and in-world timeline requirements were ported from settled Azlemzyk direction.
**Next gate:** Complete all Phase 1 owners, then run Phase 2 Location Notes; Phase 3 TK-003 through TK-008 also wait for S-009.

## Outcome

Kayden can recover where things are, what is canon, how divine entities relate,
and what happened in-world without searching raw notes.

## Why It Matters

World reference is useful only when it is searchable, linked to live campaign
records, and clearly distinguished from session notes or prospective villain
plans.

## Current Verified State

- Location fields and actor/faction links are specified.
- World Lore is specified as searchable topic/content with edit mode.
- Divine System names Horren aspects, Minora, imprisoned beings, domains,
  artifacts, and notes.
- Campaign Timeline is specified as date/event/session link.
- None is implemented in tracked runtime.

## Desired Behavior

- Location Notes manage description, factions, tensions, and present NPC links.
- World Lore supports validated topic/content edit and full-text search.
- Divine System renders structured beings/aspects/domains/artifacts/notes.
- Campaign Timeline sorts chronological events and links to Session Log.
- Stable IDs survive renames; archived records preserve historical references.

## Decisions And Contracts

- Campaign Timeline is in-world history; Session Log is table history; Villain
  Timeline is prospective.
- Divine data is Azlemzyk canon, not generic D&D deity content.
- Search results expose source/freshness and respect private projections.

## Non-Goals

- Public lore wiki, map editor, calendar rules engine, or automatic canon writing.

## Dependencies And Blockers

- S-004/S-005 provide foundation/canon and S-007/S-008 complete Phase 1.
- Archived Location Notes are Phase 2 and may run in parallel with S-009 after
  Phase 1. Phase 3 begins at TK-003 and is lifecycle-blocked on completed S-009.

## Vertical Implementation Slices

| Ticket | Slice | Status | Blockers | Proof |
|---|---|---|---|---|
| TK-001 | Create/edit Location Notes with faction/tension fields | ready | S-004, S-005, S-007, S-008 | pending |
| TK-002 | Link locations to current NPCs/factions and survive renames/archives | ready | TK-001, S-007 | pending |
| TK-003 | Create/edit/search World Lore topics with bounded snippets | ready | S-004, S-005, S-009 | pending |
| TK-004 | Prove lore freshness/privacy and no-result/error states | ready | TK-003 | pending |
| TK-005 | Render/edit structured Horren, Minora, imprisoned-being, domain, artifact, and notes records | ready | S-004, S-005, S-009 | pending |
| TK-006 | Protect Divine System relationships and private notes with tests | ready | TK-005 | pending |
| TK-007 | Create/sort Campaign Timeline events linked to Session Log | ready | S-008, S-009 | pending |
| TK-008 | Prove location-lore-divine-timeline reference in one responsive synthetic flow | ready | TK-002, TK-004, TK-006, TK-007 | pending |

## Ticket Done Contracts

| Ticket | Done criteria | Required proof |
|---|---|---|
| TK-001 | Location CRUD persists description, factions, tensions, and clear empty/error states after Phase 1 completes. | API/DB validation tests, persist-reload check, and client state tests. |
| TK-002 | Location actor/faction links use stable IDs and remain accurate across rename/archive. | Rename/archive fixtures, orphan scan, and rendered link assertion. |
| TK-003 | After S-009 completion, World Lore CRUD/search returns accurate bounded snippets for topic/content. | Lifecycle dependency check, CRUD/FTS rank/limit/no-result tests, and search UI trace. |
| TK-004 | Lore results expose freshness/privacy and degrade visibly when source/search fails. | Fixed-clock freshness tests, private-projection scan, and stale/offline browser states. |
| TK-005 | After S-009 completion, Divine System persists/renders Horren aspects, Minora, imprisoned beings, domains, artifacts, and notes. | Lifecycle dependency check, schema/API fixtures for every entity type, and rendered reference proof. |
| TK-006 | Divine links and private notes remain valid across edits while player projections exclude DM-only fields. | Relationship mutation tests, projection privacy scan, and before/after link report. |
| TK-007 | After S-009 completion, Campaign Timeline sorts in-world events chronologically and links exact Session Log records. | Lifecycle dependency check, date-order/link/missing-session fixtures, and persist-reload trace. |
| TK-008 | One responsive synthetic flow navigates location, lore, divine, and timeline references with correct links and no private leakage. | Browser E2E, viewport screenshots, sanitized demo, console/network log, and full suite. |

## Acceptance Criteria

- [ ] Location links remain accurate across renames/archives.
- [ ] Lore search is accurate, bounded, and provenance-bearing.
- [ ] Divine System models settled Azlemzyk entities/relationships.
- [ ] Campaign Timeline orders events and links correct sessions.
- [ ] Private notes remain private and synthetic proof is check-in safe.

## Testing Seams

- Stable-ID rename/archive fixtures, FTS search, date ordering, privacy
  projections, responsive reference workflow.

## Verification Procedure

```bash
# Targeted world-reference tests plus full campaign/browser suites.
```

## Documentation Impact

- README gains world-reference navigation after ship.

## Append-Only Evidence And Execution Log

| Date | Ticket | Event | Verification | Docs | Remaining gap |
|---|---|---|---|---|---|
| 2026-07-17 | canon harvest | Ported four linked world-reference capabilities with clear timeline distinctions | Archived DMW plan, schema, and retrieval contract inspected | Lexicon and S-010 created | All eight slices remain |
| 2026-07-17 | Planner remediation | Preserved Phase 2 Location Notes after Phase 1 while making every Phase 3 world-reference entry wait on S-009; added all done/proof contracts | Archived phase order, supported blocker IDs, eight contract rows, render, and doctor checked | S-010 updated | Location Notes may parallel S-009; TK-003 through TK-008 wait on S-009 |

## Completion Result

Pending.

## Remaining Limitations Or Follow-Up Specs

- Map visualization or calendar mechanics require later linked specs.

## Supersession

- Supersedes: location/lore/divine/timeline TODOs in archived workbook plan.
- Superseded by: none.
