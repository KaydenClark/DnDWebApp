# S-012 - Character Rules Derivation And Compendium

> Generated from LLM Workbench v2.3.

**Spec ID:** S-012
**Status:** complete
**Priority:** 1
**Owner:** dndAPI Character Rules
**Updated:** 2026-07-17
**Catalog description:** Derive trustworthy D&D character values server-side from raw choices and validated compendium records.
**Blockers:** none
**Latest event:** The implemented derivation/data pipeline was captured from live source and a green 132-test API baseline.
**Next gate:** none

## Outcome

Every character read/write returns rules-dependent values derived consistently
from raw player choices and compendium data without duplicating math in clients.

## Why It Matters

Ability, attack, defense, skill, spell, proficiency, and progression values are
interdependent. One tested server-side engine prevents contradictory sheets.

## Current Verified State

- `characterDerivation.js` computes ability scores/modifiers, proficiency, HP,
  AC, initiative, passive perception, attacks, skills/saves, spell slots/DC/
  attacks, spells, features, proficiencies, currency/default session state.
- Compendium bootstrap exposes ten projected collections; local fallback and
  5etools-compatible import paths exist.
- API validates character payloads, owner uniqueness, and compendium references.
- API suite passes 132 tests including background grants, expertise, caster/
  pact/half-caster slots, recovery labels, conditions, hit dice, and edge cases.

## Desired Behavior

- Persist raw choices/session state and recompute derived values on demand.
- Frontends consume responses without reproducing rules math.
- Invalid inputs fail explicitly; unknown references degrade safely.
- Fallback seed remains usable while large imports stay local/licensed.
- Seed/import operations remain intentional and never touch character records.

## Decisions And Contracts

- `dndAPI/services/characterDerivation.js` is the only rules-math owner.
- Derived values are not stored as independent truth.
- Bootstrap projections are client-safe; richer internal maps stay server-side.
- Rules content source/licensing and real-service seed runs remain guarded.

## Non-Goals

- Full digital rulebook, feat/ASI policy (S-015), or frontend math.

## Dependencies And Blockers

- Existing dndAPI source/data/tests; no current blocker.

## Vertical Implementation Slices

| Ticket | Slice | Status | Blockers | Proof |
|---|---|---|---|---|
| TK-001 | Derive core abilities, combat, attacks, skills, saves, and proficiencies | done | none | derivation unit/API tests green |
| TK-002 | Derive spellcasting for full, half, and pact casters with recovery contract | done | TK-001 | Warlock/non-Warlock/Paladin API and derivation tests green |
| TK-003 | Apply race/class/subclass/background/expertise feature grants safely | done | TK-001 | background, expertise, feature, and compendium tests green |
| TK-004 | Validate character API boundaries and owner-safe persistence | done | TK-001 | validation, API, and data-access tests green |
| TK-005 | Seed/import and project ten client-safe compendium collections | done | TK-003 | bootstrap, seed shape, database index, and projection tests green |

## Acceptance Criteria

- [x] Derived math is centralized server-side.
- [x] Every character operation returns freshly derived output.
- [x] Major caster/rules/background/expertise paths are covered.
- [x] Invalid payloads and unsafe references are handled explicitly.
- [x] Compendium bootstrap is client-safe and seed/import boundaries are documented.

## Testing Seams

- Pure derivation units, temporary MongoDB integration, API validation, seed
  JSON/import fixtures, client projection tests.

## Verification Procedure

```bash
cd dndAPI && npm test
```

## Documentation Impact

- This spec owns durable rules capability; nested Blueprint/API docs retain
  field-level implementation detail.

## Append-Only Evidence And Execution Log

| Date | Ticket | Event | Verification | Docs | Remaining gap |
|---|---|---|---|---|---|
| 2026-07-17 | spec | Captured implemented derivation/compendium capability | dndAPI 132/132 green; source, docs, manifests, seeds, and tests inspected | S-012 and Blueprint matrix created | Feat/ASI policy remains S-015 |

## Completion Result

The current server-side derivation and compendium capability now has stable
requirements, invariants, acceptance, and proof ownership.

## Remaining Limitations Or Follow-Up Specs

- S-015 owns feat/ASI rules and future rules-version decisions.

## Supersession

- Supersedes: derivation/data capability truth scattered across nested plans.
- Superseded by: none.
