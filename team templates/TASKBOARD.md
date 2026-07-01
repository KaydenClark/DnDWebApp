# Taskboard - DnDWebApp Team Run

The single shared coordination artifact for a manager/subagent run. The manager
owns the Goal, Done when, assignments, and final documentation integration.
Subagents append their own rows to the Proof Log and report documentation impact
for their lanes. No one rewrites another agent's rows.

**Run started:** set by manager  
**Manager:** set by manager  
**Subagents:** set by manager

## Goal

Set one sentence describing the outcome this run must produce.

## Done When

The run is complete when all of these hold:

- Checkable acceptance conditions are met.
- Affected docs are updated, or documentation is marked
  `Docs checked; no update needed`.
- The full verification suite from `RUNBOOK.md` passes.
- No task below is `assigned` or `in-progress`.

## Assignments

The manager fills this in. Rule: no two open tasks may share a `Touches` path.
If two tasks need the same files, sequence them instead of running both.

| ID | Task | Owner | Touches (paths it may edit) | Docs impact | Status | Why (outcome) |
|---|---|---|---|---|---|---|
| T1 | set by manager | set by manager | set by manager | set by manager | assigned | set by manager |

**Status values:** `assigned` -> `in-progress` -> `needs-rework` -> `done`, or
`blocked`.

## Blocked

Tasks that cannot proceed. Surface these to the user; do not retry
indefinitely.

| ID | Blocked on | Reason |
|---|---|---|
| n/a | n/a | n/a |

## Proof Log

Append one row when a task changes durable project state. Tag it with your agent
id. Use actual results, not claims. Include the documentation result. Re-read
this file immediately before appending so you build on the latest version; never
rewrite an existing row. This board is the subagents' only durable write target;
the manager copies the final result into the project `ROADMAP.md`.

| Date | Agent | Task | Proof (command or named manual check) | Documentation | Result | Remaining gap |
|---|---|---|---|---|---|---|
| set by manager | manager | baseline | full test command | docs checked or gap | pass/fail | none/gap |
