# DnDWebApp - Hot Taskboard

> Generated from LLM Workbench v2.3.

**Current focus:** Preserve all three histories while establishing the local
campaign platform foundation and closing character release gaps.
**Owner:** Kayden; one assigned Engineer per ticket
**Last updated:** 2026-07-17

This is a generated projection, not a requirements or proof store. Use the
spec lifecycle commands in `RUNBOOK.md`.

## Active Specs

<!-- hot-specs:start -->
| Spec | Current slice | Owner | Blocker | Latest meaningful event | Next gate |
|---|---|---|---|---|---|
| [S-001](specs/S-001-workbench-v2-3-adoption/SPEC.md) | Acceptance / owner gate | DnDWebApp Planner | none | TK-001 closed with proof. | Confirm acceptance criteria and completion result. |
| [S-003](specs/S-003-history-preserving-repository-consolidation/SPEC.md) | TK-001: Add a deterministic three-repo provenance manifest and read-only verifier (ready) | Repository Engineer | none | All three clean heads, histories, upstreams, and remote recovery refs were recorded before planning. | Claim TK-001 and make repository provenance mechanically verifiable without modifying either nested repo. |
| [S-015](specs/S-015-character-progression-feat-asi/SPEC.md) | TK-002: Record the selected ASI/feat levels, class exceptions, prerequisites, mutation, and grant contract (blocked) | Kayden (rules decision); Character Rules Engineer | owner rules-baseline decision | Current progression was captured as implemented; feat/ASI remains blocked on one explicit product/rules contract rather than generic scoping. | Kayden selects the named rules baseline and deliberate exceptions, then TK-002 becomes ready. |
| [S-016](specs/S-016-browser-e2e-release-proof/SPEC.md) | TK-001: Add deterministic synthetic local browser harness and health/startup contract (ready) | Release Engineer | none | Unit and build baselines are green, but current docs overstate release confidence without automated browser/account-isolation proof. | Claim TK-001 and establish a deterministic local browser smoke harness against synthetic data. |
<!-- hot-specs:end -->

Completed specs remain in `BLUEPRINT.md` and their stable paths.

## Owner Decisions

| Spec | Decision | Options | Recommendation | Cost / impact | Owner | Next gate |
|---|---|---|---|---|---|---|
| S-015 | Select the feat/ASI rules contract for the mixed current rules data | 2014 5e timing / 2024 5e timing / explicit hybrid | Choose one named rules baseline, then document deliberate exceptions; avoid an accidental hybrid | Changes progression levels, prerequisites, data shape, migration, and UI | Kayden | Record choice in S-015 before TK-002 |
