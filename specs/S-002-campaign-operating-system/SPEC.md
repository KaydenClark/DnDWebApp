# S-002 - Campaign Operating System

> Generated from LLM Workbench v2.3.

**Spec ID:** S-002
**Status:** planned
**Priority:** 1
**Owner:** Kayden (product); Campaign Engineer
**Updated:** 2026-07-17
**Catalog description:** Deliver one private World Anvil-style campaign workspace that unifies preparation, live-session operation, recall, and character modules.
**Blockers:** S-003, S-004
**Latest event:** Product identity and module boundaries were settled during the canon harvest.
**Next gate:** Complete the preservation and local foundation dependencies, then activate TK-001.

## Outcome

Kayden enters one private campaign workspace, navigates campaign domains and
character modules coherently, and sees honest loading, empty, error, and
freshness states.

## Why It Matters

Independent notes and character apps each solve only part of running a campaign.
The operating-system shell is the product seam that makes those capabilities
feel like one dependable tool.

## Current Verified State

- Character API/client modules run separately on ports 5000/5173.
- Campaign capabilities exist only as documented direction and local notes.
- Root launchers start the two character apps but there is no integrated
  campaign navigation, capability health, or module contract.

## Desired Behavior

- Private landing/navigation covers campaign, session, world, and character
  modules without exposing campaign data publicly.
- Module boundaries use stable IDs and links instead of copied text.
- Unavailable modules degrade honestly and preserve recoverable work.
- Desktop and tablet layouts support preparation and at-table use.
- The shell exposes source/freshness where data is derived or indexed.

## Decisions And Contracts

- Character creator/sheet are modules, not a parallel product.
- Campaign source records remain canonical; dashboards/context are derived.
- Local-first operation precedes any production hosting decision.
- Cross-module contracts are explicit APIs/IDs, not direct hidden DB coupling.

## Non-Goals

- Public wiki publishing, multiplayer VTT, marketplace, or production deploy.

## Dependencies And Blockers

- S-003 preserves and maps repositories.
- S-004 supplies the local app/data seam.
- Domain modules S-005 through S-016 integrate incrementally.

## Vertical Implementation Slices

| Ticket | Slice | Status | Blockers | Proof |
|---|---|---|---|---|
| TK-001 | Render the private campaign home with stable navigation and honest unavailable-module states | ready | S-003, S-004 | pending |
| TK-002 | Link campaign entities and character modules through stable identities | ready | TK-001 | pending |
| TK-003 | Add desktop/tablet preparation and at-table navigation states | ready | TK-002 | pending |
| TK-004 | Surface module health, source, and freshness without leaking private data | ready | TK-003 | pending |
| TK-005 | Prove the integrated shell with a synthetic under-one-minute campaign demo | ready | TK-004 | pending |

## Acceptance Criteria

- [ ] One private shell reaches every specified campaign and character module.
- [ ] Navigation and cross-links preserve stable identities.
- [ ] Missing/stale/error states are visible and recoverable.
- [ ] Desktop and tablet layouts avoid overflow and keep primary actions usable.
- [ ] Synthetic integrated demo contains no private campaign data.

## Testing Seams

- Route/navigation tests, module contract fixtures, privacy scans, viewport E2E.

## Verification Procedure

```bash
# Targeted shell tests defined by TK-001.
# Full API/client/campaign suites plus S-016 browser proof.
```

## Documentation Impact

- README gains integrated startup/use only when the shell exists.

## Append-Only Evidence And Execution Log

| Date | Ticket | Event | Verification | Docs | Remaining gap |
|---|---|---|---|---|---|
| 2026-07-17 | canon harvest | Captured settled campaign OS identity and module boundaries | Current authorization compared with root/nested docs and live source | Blueprint, Lexicon, and S-002 created | All implementation slices remain |

## Completion Result

Pending.

## Remaining Limitations Or Follow-Up Specs

- Each domain remains owned by its dedicated stable spec.

## Supersession

- Supersedes: the character-sheet-only root product identity.
- Superseded by: none.
