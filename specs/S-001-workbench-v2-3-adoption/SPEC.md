# S-001 - Workbench v2.3 Adoption

> Generated from LLM Workbench v2.3.

**Spec ID:** S-001
**Status:** active
**Priority:** 0
**Owner:** DnDWebApp Planner
**Updated:** 2026-07-17
**Catalog description:** Give the canonical owner a history-preserving v2.3 control surface, stable capability records, generated hot work, and reproducible recovery.
**Blockers:** none
**Latest event:** TK-001 closed with proof.
**Next gate:** Confirm acceptance criteria and completion result.

## Outcome

DnDWebApp has one trustworthy v2.3 lifecycle whose Blueprint matches the
campaign operating system, whose stable specs own every settled capability, and
whose generated Taskboard is the only hot projection.

## Why It Matters

The v2 root harness still treated the character sheet as the whole product,
kept a hand-maintained Roadmap, and had no stable specs. That structure hid the
campaign platform and made durable planning impossible.

## Current Verified State

- Source ref: `KaydenClark/DnDWebApp` `Workbench-v2-Update` at
  `db18330a0d7a9002ce8a49ded32b9b0628956d13`.
- Consolidation inputs: `KaydenClark/dndAPI` `master` at
  `874957998a0db1c84a0c94b54048b033c914f875` and
  `KaydenClark/dndclient` `master` at
  `6c75778c73cddcb2b5b8175be96ece8af261e40b`.
- Baseline checks: API 132/132; client 372/372; client build green.
- Existing dialect: Workbench v2 with `ROADMAP.md`; no `LEXICON.md`, `specs/`,
  or generated `TASKBOARD.md`.

## Desired Behavior

- Six v2.3 controls plus Lexicon exist without placeholders.
- Blueprint and README state the World Anvil-style campaign OS identity.
- Every meaningful canon item maps to one cohesive stable spec.
- Retired plan documents remain in a cold archive.
- Lifecycle render/doctor and fresh-clone recovery are repeatable.

## Decisions And Contracts

- Migration map: root v2 controls are **port/fold**; Roadmap and workbook
  Gameplans/Backlog are **retire after port**; architecture and handoffs are
  **keep as historical evidence**; nested repos are **keep unchanged**.
- `.claude/` is omitted deliberately because `CLAUDE.md` is the thin shared
  bridge and no project-specific Claude permission file is required.
- The shared Factory lifecycle tool is referenced rather than vendored; no
  helper checksum applies.

## Non-Goals

- Product implementation, nested repo edits, repository merging/retirement,
  production deployment, secrets, or private database reads.

## Dependencies And Blockers

- Canonical Workbench Factory v2.3 adoption protocol.
- No open owner blocker.

## Vertical Implementation Slices

| Ticket | Slice | Status | Blockers | Proof |
|---|---|---|---|---|
| TK-001 | Port v2 truth into v2.3 controls/specs, archive competing plans, render, doctor, verify, commit, and push | done | none | API 132/132; client 372/372; Vite build; Workbench evaluator 113/113; render/doctor; placeholder/stale-plan/file-set and git diff checks passed |

## Acceptance Criteria

- [ ] All filled v2.3 controls exist with no required placeholders.
- [ ] Blueprint identity and 27-item coverage matrix match settled canon/live source.
- [ ] Sixteen cohesive stable specs own every matrix item.
- [ ] Roadmap and combined Gameplans are archived, not active beside Taskboard.
- [ ] API/client baselines and docs/lifecycle checks pass.
- [ ] All three remotes/histories remain unchanged and recoverable.
- [ ] Canonical-owner checkpoint is committed and pushed.

## Testing Seams

- File/placeholder/stale-route searches.
- Spec render/doctor and JSON next selection.
- API/client test suites and client build.
- Git status, object/ref/remote comparisons, and remote `ls-remote`.

## Verification Procedure

```bash
cd dndAPI && npm test
cd ../dndclient && npm test -- --run && npm run build
cd ..
WB="/Users/kayden/GPT_OS/Workbench Factory/tools/spec-workbench.mjs"
node "$WB" render --path .
node "$WB" doctor --path .
git diff --check
```

## Documentation Impact

- Reconciles all root controls; archives prior active plans; leaves nested docs
  unchanged because no nested implementation occurred.

## Append-Only Evidence And Execution Log

| Date | Ticket | Event | Verification | Docs | Remaining gap |
|---|---|---|---|---|---|
| 2026-07-17 | TK-001 | Adoption inventory and baseline captured | Three clean repos/remotes/heads inspected; API 132/132, client 372/372, client build green | v2 controls and retired plans classified | Render, doctor, commit, push, and recovery verification pending |
| 2026-07-17 | TK-001 | Ticket closed | API 132/132; client 372/372; Vite build; Workbench evaluator 113/113; render/doctor; placeholder/stale-plan/file-set and git diff checks passed | Reconciled seven root controls, created sixteen stable specs, and archived five retired plan documents | Commit, push, and remote recovery verification remain before handoff |

## Completion Result

Pending.

## Remaining Limitations Or Follow-Up Specs

- Product implementation begins with S-003 after adoption closes.

## Supersession

- Supersedes: active use of root `ROADMAP.md` and workbook Gameplan queues.
- Superseded by: none.
