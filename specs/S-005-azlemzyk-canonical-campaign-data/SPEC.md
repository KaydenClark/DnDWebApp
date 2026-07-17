# S-005 - Azlemzyk Canonical Campaign Data

> Generated from LLM Workbench v2.3.

**Spec ID:** S-005
**Status:** planned
**Priority:** 1
**Owner:** Kayden (canon); Campaign Data Engineer
**Updated:** 2026-07-17
**Catalog description:** Import and maintain provenance-bearing Azlemzyk campaign records across the campaign schema without exposing private raw sources.
**Blockers:** S-004
**Latest event:** Domain/schema intent was verified from tracked workbook plans; private live data was deliberately not read.
**Next gate:** Complete S-004, then inventory approved source records without copying private data into Git.

## Outcome

Campaign modules operate on accurate, linked Azlemzyk records with source,
freshness, validation, and owner-review seams.

## Why It Matters

Generic lorem ipsum cannot validate real campaign workflows. At the same time,
private campaign canon must not leak into source control or synthetic demos.

## Current Verified State

- Tracked direction names Azlemzyk and Cindralock and defines the required
  domain tables.
- The local vault contains private notes and vendored rules data, but those raw
  datasets were outside this planning task.
- No tracked campaign database/importer/provenance ledger exists.

## Desired Behavior

- Approved sources import through idempotent adapters into validated records.
- Every imported record carries source identity and freshness metadata.
- Conflicts are reported for owner review instead of silently overwriting canon.
- Seed/import previews expose counts and validation errors before mutation.
- Git/test artifacts use synthetic fixtures; private live data remains local.

## Decisions And Contracts

- Kayden is the canon authority for ambiguous or conflicting story truth.
- Importers preserve source provenance and stable IDs.
- No raw private note/export or live DB is committed.
- Requirements already settled in tracked canon are not relabeled needs-scope.

## Non-Goals

- Inventing story canon, publishing the campaign, or replacing source notes
  before imports are proven.

## Dependencies And Blockers

- S-004 schema, backup, and transaction foundation.
- Live import requires explicit scope for private source files.

## Vertical Implementation Slices

| Ticket | Slice | Status | Blockers | Proof |
|---|---|---|---|---|
| TK-001 | Inventory approved Azlemzyk sources and preview record counts/provenance without mutation | ready | S-004 | pending |
| TK-002 | Import core actor, faction, party, location, and lore records idempotently | ready | TK-001 | pending |
| TK-003 | Import session, clue, encounter, currency, and timeline records with links | ready | TK-002 | pending |
| TK-004 | Detect conflicts/stale links and produce an owner-review report without exposing raw data | ready | TK-003 | pending |

## Acceptance Criteria

- [ ] Approved source imports are idempotent and provenance-bearing.
- [ ] Cross-domain links validate and broken references are explicit.
- [ ] Conflict preview precedes any overwrite.
- [ ] Private raw data and live DB files remain untracked.
- [ ] Synthetic fixtures exercise the same adapters.

## Testing Seams

- Redacted source fixtures, idempotency runs, count/link assertions, conflict
  fixtures, secret/private-content scans.

## Verification Procedure

```bash
# Import preview and validation commands are created with implementation.
```

## Documentation Impact

- Runbook documents preview/import/backup/recovery without private values.

## Append-Only Evidence And Execution Log

| Date | Ticket | Event | Verification | Docs | Remaining gap |
|---|---|---|---|---|---|
| 2026-07-17 | planning | Separated private canon ingestion from synthetic platform fixtures | Tracked plans/schema intent inspected; private DB/raw notes not read | S-005 created | Private-source work remains explicitly scoped and local |

## Completion Result

Pending.

## Remaining Limitations Or Follow-Up Specs

- Domain UX lives in S-007 through S-010; retrieval lives in S-006.

## Supersession

- Supersedes: untracked manual seeding as the only campaign-data path.
- Superseded by: none.
