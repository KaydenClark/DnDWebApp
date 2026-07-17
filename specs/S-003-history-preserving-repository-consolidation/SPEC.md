# S-003 - History-Preserving Repository Consolidation

> Generated from LLM Workbench v2.3.

**Spec ID:** S-003
**Status:** active
**Priority:** 0
**Owner:** Repository Engineer
**Updated:** 2026-07-17
**Catalog description:** Consolidate the product under DnDWebApp without losing, rewriting, deleting, or silently disconnecting the dndAPI and dndclient histories/remotes.
**Blockers:** none
**Latest event:** All three clean heads, histories, upstreams, and remote recovery refs were recorded before planning.
**Next gate:** Claim TK-001 and make repository provenance mechanically verifiable without modifying either nested repo.

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
| TK-001 | Add a deterministic three-repo provenance manifest and read-only verifier | ready | none | pending |
| TK-002 | Rehearse the chosen history-preserving import in a disposable clone/worktree | ready | TK-001 | pending |
| TK-003 | Integrate API/client trees on an isolated owner branch with full history reachability | ready | TK-002 | pending |
| TK-004 | Prove build/test/recovery and all original remotes unchanged after integration | ready | TK-003 | pending |

## Ticket Done Contracts

- **TK-001:** verifier fails on any unexpected remote/ref/head/count and performs
  no writes to nested repos.
- **TK-002:** disposable rehearsal documents exact commands, resulting graph,
  conflicts, rollback, and byte/file checks.
- **TK-003:** imported histories are reachable from explicit refs/tags and
  product paths are unambiguous.
- **TK-004:** all suites and fresh-clone recovery pass; no repository is retired.

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

## Completion Result

Pending.

## Remaining Limitations Or Follow-Up Specs

- Owner may later choose repository retirement, but it is not implied here.

## Supersession

- Supersedes: the ignored-nested-clone arrangement as the final product model.
- Superseded by: none.
