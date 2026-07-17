# S-015 - Character Progression And Feat/ASI Rules

> Generated from LLM Workbench v2.3.

**Spec ID:** S-015
**Status:** blocked
**Priority:** 1
**Owner:** Kayden (rules decision); Character Rules Engineer
**Updated:** 2026-07-17
**Catalog description:** Extend the shipped level-up flow with one explicit, validated feat/ASI rules contract across API, compendium, creator, and sheet.
**Blockers:** none
**Latest event:** Current progression was captured as implemented; feat/ASI remains blocked on one explicit product/rules contract rather than generic scoping.
**Next gate:** Kayden selects the named rules baseline and deliberate exceptions, then TK-002 becomes ready.

## Outcome

Players progress characters through level 20 and receive only the ASI/feat
choices allowed by the selected rules baseline, with prerequisites and ability
effects enforced consistently server-side.

## Why It Matters

Current level/spell/subclass progression works, but adding feats without a
single policy would encode an accidental hybrid of 2014 and 2024 rules and
diverge API/data/UI.

## Current Verified State

- Level-Up Studio supports levels 1-20, subclass gates, and searchable spell
  selection.
- Backend clamps levels, applies level progression/features/subclass/spell slots.
- Compendium can expose feats and ability bonuses, but prerequisites are display
  text and fallback feats may be empty.
- Current seeds/docs mix traditional 2014 ability bonuses with selected 2024
  species/class details.
- Four open contracts remain: ASI/feat levels including class exceptions,
  prerequisite enforcement, ability-score mutation model, and tool/language
  choice model.

## Desired Behavior

- One named baseline defines ordinary and Fighter/Rogue exception levels.
- API validates feat eligibility/prerequisites and choice cardinality.
- Ability changes have one documented raw-data/derivation model.
- Tool/language grants use structured choices and derive consistently.
- Creation/level-up/sheet expose only valid options and explain blocked choices.

## Decisions And Contracts

- Backend remains the enforcement/math owner.
- Existing characters require a non-destructive migration/default policy.
- Owner decision is limited to rules baseline and deliberate exceptions; the
  implementation decomposition is already complete.

## Non-Goals

- Supporting every D&D edition simultaneously or silently choosing a hybrid.

## Dependencies And Blockers

- TK-002 is owner-blocked through the explicit gate below. Lifecycle blocker
  fields contain only supported spec/ticket IDs or `none`.

## Vertical Implementation Slices

| Ticket | Slice | Status | Blockers | Proof |
|---|---|---|---|---|
| TK-001 | Preserve current level/subclass/spell progression through level 20 | done | none | API/client progression tests pass in 132/372 baselines |
| TK-002 | Record the selected ASI/feat levels, class exceptions, prerequisites, mutation, and grant contract | blocked | none | pending |
| TK-003 | Enforce ASI/feat eligibility, prerequisites, score bounds, and grants in API derivation | blocked | TK-002 | pending |
| TK-004 | Add migration-safe persistence and compendium support for existing/new characters | blocked | TK-003 | pending |
| TK-005 | Add creation/level-up/sheet choices and end-to-end rules proof | blocked | TK-004 | pending |

## Owner Gate

| Ticket | Decision | Options | Recommendation | Cost / impact | Owner | Resolution effect |
|---|---|---|---|---|---|---|
| TK-002 | Select the feat/ASI rules baseline and deliberate exceptions | 2014 5e / 2024 5e / explicit hybrid | Choose one named baseline and document only deliberate exceptions | Changes progression timing, prerequisites, data shape, migration, and client choices | Kayden | Record the choice in append-only evidence, then change TK-002 from blocked to ready |

## Ticket Done Contracts

| Ticket | Done criteria | Required proof |
|---|---|---|
| TK-002 | Kayden's named baseline and deliberate exceptions define ASI/feat levels, class exceptions, prerequisites, ability mutation, and tool/language grants without ambiguity. | Owner-decision evidence, complete rules table/examples, contradiction scan against seeds/docs, and lifecycle transition to ready. |
| TK-003 | API derivation/validation enforces the approved timing, prerequisites, score bounds, and structured grants. | Red/green table-driven unit/API tests covering ordinary, Fighter/Rogue exception, invalid prerequisite, and score-bound cases. |
| TK-004 | Existing/new characters persist approved feat/ASI choices through a reversible migration with valid compendium references. | Migration up/down or rollback tests, existing-character fixture comparison, compendium link checks, and backup proof. |
| TK-005 | Creator/level-up/sheet expose only valid choices, explain blocked choices, and render backend-derived results. | Client tests, API integration, browser ordinary/Fighter/Rogue flows, build, and no-frontend-math scan. |

## Acceptance Criteria

- [x] Current level/subclass/spell progression is preserved and tested.
- [ ] One named rules baseline and deliberate exceptions are recorded.
- [ ] API enforces levels, prerequisites, score bounds, and choice grants.
- [ ] Existing characters migrate without destructive loss.
- [ ] Client shows only valid choices and relies on API results.
- [ ] Browser proof covers ordinary and Fighter/Rogue exception cases.

## Testing Seams

- Table-driven class/level rules, prerequisite fixtures, score-bound property
  cases, existing-character migrations, API/client/browser progression flow.

## Verification Procedure

```bash
cd dndAPI && npm test
cd ../dndclient && npm test -- --run && npm run build
```

## Documentation Impact

- The selected baseline and exceptions must be recorded here and reflected in
  nested API/client docs when implemented.

## Append-Only Evidence And Execution Log

| Date | Ticket | Event | Verification | Docs | Remaining gap |
|---|---|---|---|---|---|
| 2026-07-17 | TK-001 | Captured shipped progression and isolated the genuine owner rules gate | API 132/132 and client 372/372/build green; plans/source/tests compared | S-015 and Taskboard owner decision created | Kayden must choose the rules baseline before TK-002 |
| 2026-07-17 | Planner remediation | Replaced unsupported prose blocker text with blocked-ticket plus explicit owner-gate semantics and added done/proof contracts to every unfinished slice | Owner-gate table, supported blocker-ID audit, four contract rows, render, and doctor checked | S-015 and Taskboard updated | Kayden's baseline choice keeps TK-002 owner-blocked |

## Completion Result

Pending.

## Remaining Limitations Or Follow-Up Specs

- S-016 owns final browser release proof.

## Supersession

- Supersedes: generic Phase 6D needs-design backlog entries.
- Superseded by: none.
