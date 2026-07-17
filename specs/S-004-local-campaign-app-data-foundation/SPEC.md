# S-004 - Local Campaign App And Data Foundation

> Generated from LLM Workbench v2.3.

**Spec ID:** S-004
**Status:** planned
**Priority:** 0
**Owner:** Campaign Platform Engineer
**Updated:** 2026-07-17
**Catalog description:** Establish the private local campaign web runtime, SQLite schema/migrations, stable IDs, backup/recovery, and safe test fixtures.
**Blockers:** S-003
**Latest event:** Archived workbook direction settled the local React/Express/SQLite seam; no scaffold exists yet.
**Next gate:** Complete S-003 provenance, then activate the smallest schema-backed vertical slice.

## Outcome

Campaign modules share one private local runtime and durable relational data
foundation that can be migrated, backed up, tested, and recovered safely.

## Why It Matters

Every campaign feature depends on the same identity, linking, transaction, and
search foundation. Building each screen against ad hoc Markdown or duplicated
state would create irreversible drift.

## Current Verified State

- Archived plan proposed Express + `better-sqlite3` and React/Vite on local
  ports 5001/5174.
- No `dmw-api`, `dmw-client`, SQLite schema, migration runner, or backup command
  exists in tracked source.
- Private campaign notes and possible databases are intentionally untracked.

## Desired Behavior

- Local API/client start without cloud credentials.
- Versioned migrations create stable primary/foreign keys, timestamps, and FTS.
- Writes are transactional and validated; foreign-key failures are explicit.
- Synthetic fixtures support tests/demos without copying private canon.
- Backup/restore and schema health are one-command, non-destructive operations.

## Decisions And Contracts

- SQLite + FTS5 is the settled first persistence target.
- Database files remain local and ignored.
- Stable opaque IDs back cross-domain links; names are display values.
- Schema migrations never silently destroy data and require backup proof before
  destructive steps.

## Non-Goals

- Cloud sync, production hosting, multi-tenant auth, or importing private data
  before schema/backup proof.

## Dependencies And Blockers

- S-003 determines the durable source layout.

## Vertical Implementation Slices

| Ticket | Slice | Status | Blockers | Proof |
|---|---|---|---|---|
| TK-001 | Start a local campaign API with health route and temporary SQLite database | ready | S-003 | pending |
| TK-002 | Add versioned schema migrations, stable IDs, constraints, and transaction tests | ready | TK-001 | pending |
| TK-003 | Add synthetic fixture loading with deterministic counts and privacy scan | ready | TK-002 | pending |
| TK-004 | Add local campaign client shell with explicit loading/empty/error states | ready | TK-003 | pending |
| TK-005 | Add backup, restore, schema-health, and fresh-clone recovery proof | ready | TK-004 | pending |

## Acceptance Criteria

- [ ] Local runtime needs no paid/cloud dependency.
- [ ] Migrations are repeatable and preserve data.
- [ ] Constraints and transactions reject invalid cross-domain writes.
- [ ] Synthetic fixtures contain no private campaign content.
- [ ] Backup/restore and fresh-clone startup are repeatable.

## Testing Seams

- Temporary DBs, migration version fixtures, rollback tests, API validation,
  client state tests, backup byte/schema comparison.

## Verification Procedure

```bash
# Commands are created by TK-001/TK-005 and recorded in RUNBOOK.md.
```

## Documentation Impact

- Runbook gains install/run/migrate/backup/restore commands when implemented.

## Append-Only Evidence And Execution Log

| Date | Ticket | Event | Verification | Docs | Remaining gap |
|---|---|---|---|---|---|
| 2026-07-17 | canon harvest | Ported the settled local app/data direction without fabricating a scaffold | Root tree, manifests, and archived campaign plan inspected | S-004 created | All five slices remain |

## Completion Result

Pending.

## Remaining Limitations Or Follow-Up Specs

- Domain schemas and behaviors are owned by S-005 through S-010.

## Supersession

- Supersedes: ad hoc future `dm_workbook.db` initialization instructions.
- Superseded by: none.
