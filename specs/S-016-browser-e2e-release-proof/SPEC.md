# S-016 - Browser E2E Release Proof

> Generated from LLM Workbench v2.3.

**Spec ID:** S-016
**Status:** active
**Priority:** 1
**Owner:** Release Engineer
**Updated:** 2026-07-17
**Catalog description:** Prove the integrated campaign and character workflows in real browsers with account isolation, responsive layouts, clean console, and check-in artifacts.
**Blockers:** none
**Latest event:** Unit and build baselines are green, but current docs overstate release confidence without automated browser/account-isolation proof.
**Next gate:** Claim TK-001 and establish a deterministic local browser smoke harness against synthetic data.

## Outcome

A fresh local checkout can run a deterministic browser suite and produce a
check-in artifact proving the critical private campaign and character flows.

## Why It Matters

jsdom/unit tests do not prove real routing, servers, persistence, layout,
account isolation, or console health. Release readiness needs user-visible
evidence, not test-count claims.

## Current Verified State

- API 132/132, client 372/372, and Vite build pass.
- Current plans call for manual Warlock/Paladin, session-tool, level-up, and
  cross-user isolation verification.
- No browser/E2E script, checked-in screenshot/report, or integrated campaign
  flow exists in the canonical owner.
- Client emits non-failing localStorage and nested mock warnings in unit tests.

## Desired Behavior

- One command starts isolated test services/data and runs supported browsers.
- Character flow covers sign-up/in, isolation, roster, creation, Warlock/Paladin
  derivation, session tools, and progression.
- Campaign flow covers shell/navigation, record edit, FTS, and cross-domain links
  as those modules become available.
- Desktop and tablet/mobile target widths have no critical overflow.
- Console/page/network failures fail the run; artifacts are private-safe and
  check-in ready.

## Decisions And Contracts

- E2E uses synthetic accounts/data and never real Atlas/campaign records.
- Unit/build remains required but insufficient.
- Gated campaign steps may skip only with explicit dependency evidence; the
  character baseline must run now.
- Dependency additions require normal review but are not a product owner gate.

## Non-Goals

- Production deployment, visual taste approval, load testing, or real account data.

## Dependencies And Blockers

- Character baseline has no product blocker.
- Integrated campaign steps depend on S-002/S-004 and domain specs.

## Vertical Implementation Slices

| Ticket | Slice | Status | Blockers | Proof |
|---|---|---|---|---|
| TK-001 | Add deterministic synthetic local browser harness and health/startup contract | ready | none | pending |
| TK-002 | Prove auth, cross-user isolation, roster, creation, and sheet load | ready | TK-001 | pending |
| TK-003 | Prove Warlock/Paladin derivation, session tools, and level-up persistence | ready | TK-002 | pending |
| TK-004 | Add campaign navigation/search/link workflow when S-002/S-004 domains land | ready | S-002, S-004 | pending |
| TK-005 | Produce desktop/tablet/mobile, console/network, recovery, and check-in release artifact | ready | TK-003, TK-004 | pending |

## Acceptance Criteria

- [ ] One documented command runs isolated browser proof.
- [ ] Cross-user character isolation is browser-proven.
- [ ] Critical character creation/sheet/session/progression flows pass.
- [ ] Available campaign flows pass with accurate dependency gating.
- [ ] Target viewports avoid critical overflow and primary actions remain usable.
- [ ] Console/page/network failures fail the suite.
- [ ] Artifact contains no credentials or private campaign data.

## Testing Seams

- Ephemeral database/accounts, fixed synthetic fixtures, service health probes,
  accessible selectors, viewport matrix, console/network listeners.

## Verification Procedure

```bash
cd dndAPI && npm test
cd ../dndclient && npm test -- --run && npm run build
# Browser command is created by TK-001 and added to RUNBOOK.md.
```

## Documentation Impact

- Runbook/README gain browser command and supported scope only after it works.

## Append-Only Evidence And Execution Log

| Date | Ticket | Event | Verification | Docs | Remaining gap |
|---|---|---|---|---|---|
| 2026-07-17 | canon harvest | Converted manual release notes into a full browser-proof capability | Unit/build baselines and absence of E2E scripts/artifacts verified | S-016 and Runbook release boundary created | TK-001 is agent-safe; integrated campaign proof waits on its domain dependencies |

## Completion Result

Pending.

## Remaining Limitations Or Follow-Up Specs

- Subjective product/visual acceptance remains Kayden's owner gate, not automated proof.

## Supersession

- Supersedes: manual browser TODOs as the only release-evidence plan.
- Superseded by: none.
