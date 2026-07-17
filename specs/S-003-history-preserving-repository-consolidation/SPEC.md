# S-003 - History-Preserving Repository Consolidation

> Generated from LLM Workbench v2.3.

**Spec ID:** S-003
**Status:** active
**Priority:** 0
**Owner:** codex-engineer-dnd
**Updated:** 2026-07-17
**Catalog description:** Consolidate the product under DnDWebApp without losing, rewriting, deleting, or silently disconnecting the dndAPI and dndclient histories/remotes.
**Blockers:** none
**Latest event:** TK-001 closed with proof.
**Next gate:** Complete TK-002.

## Outcome

The canonical owner can integrate and release the product while every original
commit and GitHub remote remains independently recoverable and traceable.

## Why It Matters

The current ignored nested clones work locally but are not a durable,
reproducible consolidation. A careless flatten/merge could orphan years of
history or make the root remote falsely appear complete.

## Current Verified State

- Owner: 4 commits, branch `Workbench-v2-Update`, remote
  `KaydenClark/DnDWebApp`, head `db18330...`.
- API: 56 commits, `master`, remote `KaydenClark/dndAPI`, head `8749579...`.
- Client: 50 commits, `master`, remote `KaydenClark/dndclient`, head
  `6c75778...`.
- All worktrees were clean before adoption; root `.gitignore` excludes both
  nested directories. No submodule metadata exists.

## Desired Behavior

- A deterministic manifest records source remote, ref, commit, history count,
  import destination, and verification command for each repo.
- A reversible import strategy preserves full histories and stable provenance.
- Integrated builds do not require ambiguous untracked nested clones.
- Original remotes remain readable and unchanged after consolidation.
- Repository deletion/retirement remains a separate owner-only decision and is
  not required for completion.

## Decisions And Contracts

- DnDWebApp is the canonical product owner.
- Preserve histories by construction; no squashing, force-push, filter-repo,
  subtree rewrite, or manual `.git` deletion.
- Use an isolated integration branch/worktree for any eventual import.
- Verify original refs before and after every structural step.

## Non-Goals

- Deleting/archiving repos, changing remote URLs, implementation refactors, or
  integration-to-main promotion.

## Dependencies And Blockers

- No owner decision is needed for read-only provenance checks and reversible
  import rehearsal.

## Vertical Implementation Slices

| Ticket | Slice | Status | Blockers | Proof |
|---|---|---|---|---|
| TK-001 | Add a deterministic three-repo provenance manifest and read-only verifier | done | none | Exact-head Auditor green at 21d5d5650ea12d78b6d6bc686f2eb3d5a953a878; provenance verifier 6/6; live remote refs 3/3; API 132/132; client 372/372; Vite build green; git fsck 3/3 exit 0; before/after repository-state SHA-256 both 15d0f143cc7bfa22770c7447f32f8769317882fc26cef5c27f046bbb0ed04e0b. |
| TK-002 | Rehearse the chosen history-preserving import in a disposable clone/worktree | ready | TK-001 | pending |
| TK-003 | Integrate API/client trees on an isolated owner branch with full history reachability | ready | TK-002 | pending |
| TK-004 | Prove build/test/recovery and all original remotes unchanged after integration | ready | TK-003 | pending |

## Ticket Done Contracts

| Ticket | Done criteria | Required proof |
|---|---|---|
| TK-001 | Manifest/verifier records and validates all three remote/ref/head/count tuples and performs no nested writes. | Red mismatch fixture, green live read-only run, and before/after nested status/head/remote bytes. |
| TK-002 | Disposable rehearsal preserves both nested histories, documents conflicts, and rolls back without touching canonical repos. | Exact commands, resulting graph/rev counts, tree comparison, rollback trace, and clean canonical statuses. |
| TK-003 | Integrated branch contains unambiguous API/client paths with all original commits reachable from named refs. | `git fsck`, rev reachability/counts, path/tree checks, and original-ref mapping. |
| TK-004 | Integrated fresh clone passes app verification while all three original remotes/refs remain unchanged and no repo is retired. | Fresh-clone API/client tests/build, remote `ls-remote` comparison, recovery commands, and final provenance report. |

## Acceptance Criteria

- [ ] Every original commit remains reachable and attributable.
- [ ] All three original GitHub remotes remain unchanged and recoverable.
- [ ] Canonical owner reproduces the integrated source without ignored clones.
- [ ] Rehearsal and rollback are documented and repeatable.
- [ ] No delete, retire, force-push, or history rewrite occurs.

## Testing Seams

- Temporary clones, `git fsck`, `merge-base`, rev counts, remote/ref manifest,
  tree diffs, and full application tests.

## Verification Procedure

```bash
git remote -v
git rev-list --count HEAD
git fsck --full
git ls-remote origin
```

## Documentation Impact

- Runbook owns exact import/recovery operations; Blueprint owns repository
  boundaries; manifest is implementation evidence.

## Append-Only Evidence And Execution Log

| Date | Ticket | Event | Verification | Docs | Remaining gap |
|---|---|---|---|---|---|
| 2026-07-17 | planning | Captured immutable pre-consolidation provenance | Three statuses, branches, logs, rev counts, remotes, and live `ls-remote` results inspected | S-003 and Runbook provenance created | TK-001 is the smallest safe Engineer ticket |
| 2026-07-17 | Planner remediation | Normalized every open consolidation slice to explicit done criteria and required proof | Four ticket rows matched four done-contract rows; blocker syntax, render, and doctor checked | S-003 updated | TK-001 remains the smallest safe Engineer ticket |
| 2026-07-17 | TK-001 checkpoint | Added the deterministic three-repository manifest, fail-closed read-only verifier, and synthetic mismatch regression | Red: verifier module missing; green: verifier tests 2/2, live manifest 3/3, before/after repository-state SHA-256 both `7f25fb132f7dfecc35e9f3da1f3b23a66e644f504fed41fd89f9f049e013f12c`; API 132/132; client 372/372; Vite build green | Runbook documents manifest, live verification, regression command, and provenance-drift rule | Exact-head Auditor review and ticket close remain |
| 2026-07-17 | TK-001 Auditor remediation | Made symlinked CLI execution fail closed, required exact real Git roots, rejected duplicate/nested import destinations, used a locally reachable remote-mismatch fixture, cleaned fixtures with `t.after`, and restored the stable proof contract | Red: symlink, subdirectory, and duplicate-destination tests failed; green: verifier 6/6 and live manifest 3/3; reproducible before/after state SHA-256 both `09892db97065794ebacf40dcd580e9a58db9e6259300ddbdda0237b9c5c142c9`; API 132/132; client 372/372; Vite build green | Runbook records the reproducible evidence-hash command; S-003 required-proof contract restored | Exact-head re-audit and ticket close remain |
| 2026-07-17 | TK-001 | Ticket closed | Exact-head Auditor green at 21d5d5650ea12d78b6d6bc686f2eb3d5a953a878; provenance verifier 6/6; live remote refs 3/3; API 132/132; client 372/372; Vite build green; git fsck 3/3 exit 0; before/after repository-state SHA-256 both 15d0f143cc7bfa22770c7447f32f8769317882fc26cef5c27f046bbb0ed04e0b. | RUNBOOK.md documents manifest verification, regression suite, reproducible state-hash proof, and provenance-drift handling; S-003 evidence records implementation, remediation, and audit proof. | S-003 TK-002 through TK-004 remain; S-005 private-source authorization and S-015 feat/ASI rules baseline remain owner-gated. |

## Completion Result

Pending.

## Remaining Limitations Or Follow-Up Specs

- Owner may later choose repository retirement, but it is not implied here.

## Supersession

- Supersedes: the ignored-nested-clone arrangement as the final product model.
- Superseded by: none.
