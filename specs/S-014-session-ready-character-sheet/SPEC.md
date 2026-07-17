# S-014 - Session-Ready Character Sheet

> Generated from LLM Workbench v2.3.

**Spec ID:** S-014
**Status:** complete
**Priority:** 1
**Owner:** dndclient Living Sheet
**Updated:** 2026-07-17
**Catalog description:** Give players a derived living sheet with view/edit/level-up modes and persistent at-table character tools.
**Blockers:** none
**Latest event:** The implemented living sheet and session tools were captured from live source and green tests/build.
**Next gate:** none

## Outcome

A player opens one character and can read derived rules, edit raw choices, level
up, and operate HP, spells, conditions, death saves, hit dice, and inventory at
the table.

## Why It Matters

The core player module must turn backend derivation into a readable,
session-ready tool rather than a static character record.

## Current Verified State

- Protected sheet has view, edit, and level-up modes.
- Extracted panels render abilities, combat, skills/saves, attacks, spells,
  features/proficiencies/currency, equipment, and session tools.
- HP/temp HP, spell slots/recovery, conditions, death saves, hit dice, and
  inventory persist through API updates from view mode.
- Client suite 372/372 and Vite build are green; React/localStorage/mock warnings
  remain non-failing test debt.

## Desired Behavior

- View mode renders backend-derived values and clear empty states.
- Edit/level-up submit raw choices, then replace local state with API response.
- At-table tools persist immediately with visible errors.
- Skill/expertise and attack/spell breakdowns are understandable.
- No React code independently derives D&D math.

## Decisions And Contracts

- `playersCharacter.js` owns page state; auth is the only global context.
- All HTTP calls use `lib/api.js`.
- Session state updates pass through the API and re-derived response.
- Visual/browser acceptance remains S-016.

## Non-Goals

- Feat/ASI policy, VTT combat, or public character sharing.

## Dependencies And Blockers

- S-011 identity/roster and S-012 derivation are complete.

## Vertical Implementation Slices

| Ticket | Slice | Status | Blockers | Proof |
|---|---|---|---|---|
| TK-001 | Render derived identity, abilities, combat, skills/saves, attacks, spells, and features | done | S-011, S-012 | component/page tests green |
| TK-002 | Edit raw character choices and replace state with re-derived API response | done | TK-001 | edit form/page tests green |
| TK-003 | Adjust level 1-20, gate subclass, and select spells in Level-Up mode | done | TK-001 | LevelUpStudio tests green |
| TK-004 | Operate HP/temp HP and spell slots/recovery from view mode | done | TK-001 | CombatStats/SpellPanel/session tests green |
| TK-005 | Operate conditions, death saves, hit dice, and inventory from view mode | done | TK-001 | SessionToolsPanel and red tests green |
| TK-006 | Preserve skill/expertise/proficiency/currency/equipment readability | done | TK-001 | component suites and build green |

## Acceptance Criteria

- [x] Sheet renders all current derived sections.
- [x] Edit and level-up round-trip through backend derivation.
- [x] Session tools persist from view mode.
- [x] Client does not duplicate rules math.
- [x] Component/page tests and production build pass.

## Testing Seams

- Component/page/API mock tests; S-016 browser and responsive proof.

## Verification Procedure

```bash
cd dndclient && npm test -- --run && npm run build
```

## Documentation Impact

- S-014 owns durable living-sheet truth; nested Blueprint remains screen detail.

## Append-Only Evidence And Execution Log

| Date | Ticket | Event | Verification | Docs | Remaining gap |
|---|---|---|---|---|---|
| 2026-07-17 | spec | Captured implemented session-ready sheet | dndclient 372/372 and build green; panels/page/tests/docs inspected | S-014 and Blueprint matrix created | Browser/responsive proof and warning cleanup remain S-016/follow-up |

## Completion Result

The current living sheet now has stable requirements, invariants, acceptance,
and proof ownership.

## Remaining Limitations Or Follow-Up Specs

- S-015 owns feat/ASI; S-016 owns real browser release proof.

## Supersession

- Supersedes: sheet/session-tool truth scattered across nested plans/handoffs.
- Superseded by: none.
