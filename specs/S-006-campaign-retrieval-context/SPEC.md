# S-006 - Campaign Retrieval And Context

> Generated from LLM Workbench v2.3.

**Spec ID:** S-006
**Status:** planned
**Priority:** 1
**Owner:** Retrieval Engineer
**Updated:** 2026-07-17
**Catalog description:** Provide bounded, provenance-bearing campaign summaries, domain context, and targeted search over canonical local records.
**Blockers:** S-004, S-005
**Latest event:** The historical three-tier retrieval protocol was ported as product behavior rather than retained as an untracked skill-only promise.
**Next gate:** Complete the data foundation and approved canon import, then activate summary generation.

## Outcome

Kayden can ask for campaign state, a domain view, or a precise fact and receive
a concise answer with source and freshness without loading or duplicating the
whole private dataset.

## Why It Matters

Fast recall is a core campaign OS value. Unbounded reads are slow and risky;
stale generated summaries are misleading unless their provenance is visible.

## Current Verified State

- Historical skill defines tier 1 hot summary, tier 2 bounded domain context,
  and tier 3 targeted SQL/FTS queries.
- No tracked runtime generates, validates, or exposes those artifacts.
- The planned schema includes FTS session logs and the required domains.

## Desired Behavior

- Tier 1 gives a bounded campaign snapshot with generated-at/source metadata.
- Tier 2 exposes small NPC/faction/session/party/location/villain contexts.
- Tier 3 runs validated targeted queries and FTS, never arbitrary SQL from UI.
- Stale/unavailable sources degrade honestly and never fabricate canon.
- Generated artifacts refresh after relevant writes and remain non-canonical.

## Decisions And Contracts

- Canonical DB records outrank summaries/context.
- Retrieval follows summary -> domain -> targeted query.
- Direct personal/private content stays local; synthetic demos use fixtures.
- Every result exposes source identity and freshness.

## Non-Goals

- General autonomous story generation, external vector DB, or making generated
  context the source of truth.

## Dependencies And Blockers

- S-004 local data foundation and S-005 approved canonical data.

## Vertical Implementation Slices

| Ticket | Slice | Status | Blockers | Proof |
|---|---|---|---|---|
| TK-001 | Generate a bounded campaign snapshot with source/freshness from synthetic records | ready | S-004, S-005 | pending |
| TK-002 | Generate bounded domain contexts for actors, factions, sessions, party, locations, and villain activity | ready | TK-001 | pending |
| TK-003 | Add validated targeted record and FTS query endpoints with limits and snippets | ready | TK-002 | pending |
| TK-004 | Refresh affected contexts after writes and prove stale/unavailable degradation | ready | TK-003 | pending |

## Ticket Done Contracts

| Ticket | Done criteria | Required proof |
|---|---|---|
| TK-001 | Snapshot stays within documented size/record bounds and exposes source identity and generated-at freshness. | Fixed-clock synthetic snapshot test, bound assertions, source/freshness fields, and sanitized artifact. |
| TK-002 | Actor/faction/session/party/location/villain contexts are domain-bounded and derived only from canonical records. | Per-domain fixture tests, byte/row bounds, provenance checks, and no-canonical-write assertion. |
| TK-003 | Targeted lookup and FTS validate inputs, enforce result/snippet limits, and return accurate ranked results. | Positive/no-result/injection/limit/ranking tests against temporary SQLite fixtures. |
| TK-004 | Relevant writes refresh/invalidate affected contexts while stale/unavailable sources remain explicit. | Fixed-clock mutation tests, invalidation matrix, stale/offline fixtures, and browser/API degradation trace. |

## Acceptance Criteria

- [ ] Snapshot and domain contexts are bounded and provenance-bearing.
- [ ] Targeted/FTS search is limited, validated, and accurate.
- [ ] Writes invalidate or refresh affected derived artifacts.
- [ ] Stale/unavailable states are visible.
- [ ] No generated artifact silently overrides canonical records.

## Testing Seams

- Temporary SQLite fixtures, fixed clock, stale-source cases, FTS ranking,
  injection/limit tests, context size assertions.

## Verification Procedure

```bash
# Retrieval tests and synthetic demo command are created by TK-001.
```

## Documentation Impact

- README/Runbook describe retrieval tiers and freshness only when available.

## Append-Only Evidence And Execution Log

| Date | Ticket | Event | Verification | Docs | Remaining gap |
|---|---|---|---|---|---|
| 2026-07-17 | canon harvest | Converted the three-tier retrieval contract into a durable product capability | Historical skill and planned schema compared with live tracked source | Lexicon and S-006 created | Runtime implementation remains |
| 2026-07-17 | Planner remediation | Added explicit done criteria and required proof to every retrieval/context slice | Four ticket rows matched four done-contract rows; blocker syntax, render, and doctor checked | S-006 updated | Four implementation slices remain |

## Completion Result

Pending.

## Remaining Limitations Or Follow-Up Specs

- Domain editing behavior remains in S-007 through S-010.

## Supersession

- Supersedes: retrieval behavior existing only in `large-dataset-retrieval` skill text.
- Superseded by: none.
