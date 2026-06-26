# DnDWebApp - Agent Instructions

This file controls work at the `DnDWebApp` workspace root. The deployable apps
inside `dndAPI/` and `dndclient/` have their own local agent instructions; read
those before editing those repos.

## Authority Order

When instructions conflict, use this order:

1. Current user request.
2. The nearest applicable `AGENTS.md` (`dndAPI/AGENTS.md` or
   `dndclient/AGENTS.md` for nested repo work).
3. This `AGENTS.md`.
4. Source code and tests, verified live.
5. `BLUEPRINT.md`.
6. `ROADMAP.md`.
7. `RUNBOOK.md`.
8. `README.md`, `DM Workbook/MASTER_ARCHITECTURE_V2.md`, and older handoff
   notes.

If docs and code disagree, trust verified code, flag the drift, and update the
stale doc when the task touches that area.

## Read Scope

The agent may read:

- this workspace root and root docs;
- `DM Workbook/` planning docs needed for product direction;
- `dndAPI/` or `dndclient/` docs, source, tests, configs, manifests, and
  lockfiles when the task explicitly involves that subproject;
- generated output only when debugging build or runtime behavior.

The agent must not read secrets or private local data unless the current task
requires it and the file is inside the approved project scope. Treat `.env`
files, local databases, exported compendium folders, logs, and campaign-private
raw notes as sensitive.

## Edit Scope

The agent may edit:

- root coordination docs and launch helpers: `AGENTS.md`, `BLUEPRINT.md`,
  `ROADMAP.md`, `RUNBOOK.md`, `README.md`, `.gitignore`, `start-dev.bat`,
  `start-dev.ps1`, and `Start DnD WebApp.bat`;
- `DM Workbook/` planning docs when the task is project planning or DM-workbook
  planning;
- `dndAPI/` only after reading `dndAPI/AGENTS.md`;
- `dndclient/` only after reading `dndclient/AGENTS.md`;
- dependency manifests and lockfiles only when a dependency change is necessary
  and explained.

The agent must not edit:

- nested subrepos as a side effect of root documentation work;
- `.env` files, secrets, OAuth tokens, local databases, raw private exports,
  ignored vendored compendium data, generated build output, dependency folders,
  or unrelated projects;
- D&D rules math outside `dndAPI/services/characterDerivation.js`;
- frontend D&D math in `dndclient/`.

If the correct change requires leaving this scope, stop and explain the smallest
needed scope expansion.

## Agent Job

Maintain the split DnDWebApp workspace without blurring repo boundaries.

Default responsibilities:

- restate the current goal in one sentence;
- read the relevant root and nested project docs before editing;
- make the smallest correct change;
- preserve the split architecture: root workspace, backend API, frontend client,
  and DM Workbook planning material;
- use red/green TDD for behavior changes when the stack supports it;
- update docs that would otherwise become stale;
- append to `ROADMAP.md` Verification Log when durable project state changes;
- leave the branch with only intentional changes staged or committed.

## Project Rules

- `dndAPI/` owns all D&D rules derivation, persistence, auth, and API behavior.
- `dndclient/` renders API results and must not reimplement D&D math.
- The workspace root coordinates both apps and launch docs; it is not itself a
  deployable app.
- `DM Workbook/` is planning/source material for the campaign and DM-facing
  tool. Do not mix its future app work into the player character sheet unless
  Kayden explicitly asks.
- Before changing UI or visual design, read `VISUAL_DESIGN.md` when present and
  the relevant nested project design/docs.

## Documentation Ownership

Documentation is part of the work, not a follow-up role. Unless the current task
assigns a separate documentation owner, the agent making the change owns the
documentation for that change.

Use this routing:

| Change type | Documentation to check |
|---|---|
| Workspace purpose, boundaries, architecture, repo split, invariants | `BLUEPRINT.md` |
| Current state, active goal, next tasks, blockers, proof | `ROADMAP.md` |
| Install, run, test, seed, recovery, operations | `RUNBOOK.md` |
| User-facing setup or usage | `README.md` |
| Backend behavior | `dndAPI/AGENTS.md`, `dndAPI/BLUEPRINT.md`, `dndAPI/GAME_PLAN.md` |
| Frontend behavior | `dndclient/AGENTS.md`, `dndclient/BLUEPRINT.md`, `dndclient/GAME_PLAN.md` |
| Campaign/DM planning | `DM Workbook/MASTER_ARCHITECTURE_V2.md` and active workbook plans |

If no docs need edits, say `Docs checked; no update needed` in the final
response with a short reason.

## Verification And Proof

For behavior changes, use red/green/refactor:

1. Define the expected behavior.
2. Add or update a failing test when the stack supports it.
3. Run the test and confirm it fails for the expected reason.
4. Implement the smallest change.
5. Run the targeted test.
6. Run the relevant verification from `RUNBOOK.md`.

For docs-only changes, run concrete checks: file existence, unresolved
placeholder search, stale active Gameplan route search, `git diff --check`, and
any lightweight project checks available without secrets.

Never claim work is verified unless the command actually ran. If a check cannot
run, say exactly why and record the gap in `ROADMAP.md`.

## What Not To Do

- Do not invent APIs, files, functions, behavior, or test results.
- Do not rewrite the split repo structure without explicit approval.
- Do not add paid services or new persistence models without approval.
- Do not commit `.env`, local databases, private campaign exports, vendored
  compendium data, build output, dependency folders, or unrelated nested-repo
  changes.
- Do not start feature work on a red baseline.
- Do not rewrite existing `ROADMAP.md` Verification Log rows; append only.
