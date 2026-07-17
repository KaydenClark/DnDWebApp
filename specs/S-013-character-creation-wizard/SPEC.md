# S-013 - Character Creation Wizard

> Generated from LLM Workbench v2.3.

**Spec ID:** S-013
**Status:** complete
**Priority:** 1
**Owner:** dndclient Character Creation
**Updated:** 2026-07-17
**Catalog description:** Guide a player through a validated seven-step character creation flow backed by server-side rules and compendium choices.
**Blockers:** none
**Latest event:** The implemented wizard was captured from live source and the green 372-test client baseline.
**Next gate:** none

## Outcome

A signed-in player creates a usable character through clear identity, race,
class, background, ability, skill, and review steps without doing rules math.

## Why It Matters

Creation is the front door to the living sheet. A large compendium and complex
choice dependencies must remain understandable and preserve in-progress input.

## Current Verified State

- Protected `/characters/new` implements seven tabbed steps.
- Race groups/subraces and classes/subclasses are sorted and conditionally shown.
- Standard Array, 27-point buy, and 4d6-drop-lowest roll methods are implemented.
- Class/background skill rules, structured alignment/background, review, and
  post-create level-up routing are implemented.
- Wizard/navigation/page tests pass in the 372-test suite.

## Desired Behavior

- Required identity choices validate before progress/submit.
- State survives Back/Next and direct tab navigation.
- Compendium choices follow backend data and do not encode derived math.
- Ability methods enforce their own bounds/costs.
- Submit creates one character and reaches the sheet/level-up path.

## Decisions And Contracts

- Creation stays protected and uses API wrapper functions.
- Method selection is creation UI state; final base scores are persisted.
- Feat/tool/language selection awaits the S-015 policy, not ad hoc wizard math.

## Non-Goals

- Feat/ASI rules, public anonymous creation, or full rules text.

## Dependencies And Blockers

- S-011 auth/roster and S-012 API/compendium are complete.

## Vertical Implementation Slices

| Ticket | Slice | Status | Blockers | Proof |
|---|---|---|---|---|
| TK-001 | Route signed-in users to a separate seven-step creation flow | done | S-011 | route/page tests green |
| TK-002 | Select race/subrace/class/subclass/background/alignment with stable ordering/gates | done | TK-001, S-012 | wizard tests green |
| TK-003 | Support Standard Array, Point Buy, and Roll ability methods | done | TK-001 | ability-method wizard tests green |
| TK-004 | Enforce class/background skill selection and preserve navigation state | done | TK-002 | wizard/state/proficiency tests green |
| TK-005 | Review, create through API, and continue to level-up/sheet | done | TK-004 | character-page/API mock tests green |

## Acceptance Criteria

- [x] Seven steps are reachable and preserve state.
- [x] Required choices and ability methods validate correctly.
- [x] Race/class/background/skill choices use compendium contracts.
- [x] Frontend does not compute derived character values.
- [x] Successful creation reaches the next character workflow.

## Testing Seams

- Wizard red/regression tests, route/page tests, API mocks, S-016 real browser flow.

## Verification Procedure

```bash
cd dndclient && npm test -- --run && npm run build
```

## Documentation Impact

- S-013 owns durable wizard truth; nested Blueprint describes exact screen fields.

## Append-Only Evidence And Execution Log

| Date | Ticket | Event | Verification | Docs | Remaining gap |
|---|---|---|---|---|---|
| 2026-07-17 | spec | Captured implemented creation wizard | dndclient 372/372 and build green; source/tests/docs inspected | S-013 and Blueprint matrix created | Real browser creation proof belongs to S-016 |

## Completion Result

The seven-step creator now has durable requirements, contracts, acceptance, and
proof ownership. No source changed during capture.

## Remaining Limitations Or Follow-Up Specs

- S-015 owns feat/tool/language progression policy; S-016 owns E2E.

## Supersession

- Supersedes: wizard capability truth scattered across Gameplans/handoffs.
- Superseded by: none.
