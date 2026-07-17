# S-009 - Encounter And Investigation Operations

> Generated from LLM Workbench v2.3.

**Spec ID:** S-009
**Status:** planned
**Priority:** 3
**Owner:** Campaign Planning Engineer
**Updated:** 2026-07-17
**Catalog description:** Let Kayden prepare encounters, trace investigative clues, and see the villain's pending timeline as linked operational records.
**Blockers:** S-004, S-005, S-007, S-008
**Latest event:** Encounter Builder, Clue Trail, and Villain Timeline requirements were ported from settled campaign canon.
**Next gate:** Complete all Phase 1 owners S-007 and S-008 plus foundation/data dependencies, then activate encounter preparation.

## Outcome

Kayden can prepare a playable encounter, understand how clues connect, and see
what antagonists do if the party acts or waits.

## Why It Matters

Preparation fails when stat references, hooks, actors, locations, and future
consequences live in unrelated notes. These three tools form one planning loop.

## Current Verified State

- Planned encounter fields: name, stat block, DC references, environment, notes.
- Planned clue links: clue, source/target NPC, faction, location, notes.
- Planned villain events: in-world date, event, party-trigger flag.
- No tracked runtime implements them.

## Desired Behavior

- Encounter Builder creates/reuses structured encounters and resolves linked
  actors/locations/rules references.
- Clue Trail filters by NPC/faction and exposes broken/missing links.
- Villain Timeline sorts consistently by in-world date and records whether
  party action triggered/changed an event.
- Archiving linked records preserves historical session references.
- Preparation view is usable at desktop/tablet widths.

## Decisions And Contracts

- Rule references are links/citations, not copied full rulebooks.
- Villain Timeline is prospective/conditional; Campaign Timeline is historical.
- Clue relationships use stable IDs and allow incomplete knowledge explicitly.

## Non-Goals

- Automated encounter balance guarantees, tactical VTT, or AI-decided villain actions.

## Dependencies And Blockers

- Archived Phase 2 explicitly waits for all Phase 1 work. S-009 therefore
  depends on S-004/S-005 plus both Phase 1 capability owners S-007 and S-008.

## Vertical Implementation Slices

| Ticket | Slice | Status | Blockers | Proof |
|---|---|---|---|---|
| TK-001 | Create/edit encounters with environment, notes, and validated rule/DC references | ready | S-004, S-005, S-007, S-008 | pending |
| TK-002 | Link encounters to actors/locations and prove a reusable preparation view | ready | TK-001, S-007 | pending |
| TK-003 | Create/edit clue links and filter by NPC or faction | ready | S-007, S-008 | pending |
| TK-004 | Expose broken/incomplete clue links without losing the clue record | ready | TK-003 | pending |
| TK-005 | Create/sort villain events and record party-trigger state | ready | S-004, S-005, S-007, S-008 | pending |
| TK-006 | Prove encounter-clue-villain preparation as one responsive synthetic workflow | ready | TK-002, TK-004, TK-005 | pending |

## Ticket Done Contracts

| Ticket | Done criteria | Required proof |
|---|---|---|
| TK-001 | Encounter CRUD persists name, stat/DC references, monster notes, environment, and notes with validated references. | API/DB validation tests, invalid-reference fixture, and persist-reload check. |
| TK-002 | Encounters link to actors/locations through stable IDs and remain reusable after rename/archive. | Relationship rename/archive fixtures, preparation-view browser assertion, and orphan scan. |
| TK-003 | Clue CRUD persists all settled links and filters accurately by NPC or faction. | API/DB CRUD tests, filter-combination fixtures, and rendered table assertions. |
| TK-004 | Missing/archived clue links remain visible as explicit incomplete state without deleting clue evidence. | Broken-link fixtures, before/after record comparison, and recovery UI screenshot. |
| TK-005 | Villain events persist, sort ascending by in-world date, and expose party-trigger state. | Date-order/trigger validation tests and persist-reload browser trace. |
| TK-006 | One responsive flow prepares an encounter, follows a clue, and reviews villain consequences without console/network failures. | Browser E2E, desktop/tablet screenshots, sanitized demo artifact, and full suite. |

## Acceptance Criteria

- [ ] Encounters persist validated references and remain reusable.
- [ ] Clue filters and link integrity are accurate.
- [ ] Villain events sort and expose party-trigger state.
- [ ] Missing links degrade visibly without data loss.
- [ ] One preparation workflow is browser-proven.

## Testing Seams

- Temporary domain fixtures, date ordering, link deletion/archival, filters,
  responsive browser preparation flow.

## Verification Procedure

```bash
# Targeted planning-domain tests plus full campaign/browser suites.
```

## Documentation Impact

- README gains preparation workflow after implementation.

## Append-Only Evidence And Execution Log

| Date | Ticket | Event | Verification | Docs | Remaining gap |
|---|---|---|---|---|---|
| 2026-07-17 | canon harvest | Grouped encounter, investigation, and villain consequence planning into one coherent capability | Archived DMW plan/schema inspected | S-009 created | All six slices remain |
| 2026-07-17 | Planner remediation | Restored the Phase 2 gate on all Phase 1 owners including S-008 and added all ticket done/proof contracts | Archived phase order, supported blocker IDs, six contract rows, render, and doctor checked | S-009 updated | S-004, S-005, S-007, and S-008 precede Phase 2 |

## Completion Result

Pending.

## Remaining Limitations Or Follow-Up Specs

- Location/lore/history reference remains S-010.

## Supersession

- Supersedes: encounter/clue/villain TODOs in archived workbook plan.
- Superseded by: none.
