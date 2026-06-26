# DnDWebApp - Runbook

**Last reviewed:** 2026-06-26  
**Runtime owner:** Kayden plus the active agent  
**Environment:** local development workspace with nested backend/frontend repos

This file explains how to operate and verify the DnDWebApp workspace.

## Prerequisites

Required tools:

- macOS or Windows shell, depending on the launcher being used.
- Node.js versions compatible with `dndAPI/.nvmrc` and `dndclient/.nvmrc`.
- npm.
- Git.
- `rg`, `find`, `sed`, and standard shell tools for agent verification.

Required accounts/services:

- MongoDB Atlas only for live API runtime and seeding against Atlas.
- No external service is needed for frontend unit tests.
- Backend tests use `mongodb-memory-server`; first run may need network access
  to download a MongoDB binary.

Required local files:

- `dndAPI/.env` - API secrets and runtime config, created from
  `dndAPI/.env.example`.
- `dndclient/.env` - frontend API base URL, created from
  `dndclient/.env.example`.
- Optional local 5etools-compatible compendium folder for larger seed imports.

## Environment Configuration

Create local config from examples:

```bash
cp dndAPI/.env.example dndAPI/.env
cp dndclient/.env.example dndclient/.env
```

Required variables:

| Variable | Purpose | Secret? | Example / Notes |
|---|---|---|---|
| `ATLAS_CONNECTION` | MongoDB Atlas connection string for API runtime/seed | yes | Use only in `dndAPI/.env`. |
| `DB_NAME` | MongoDB database name | no | Existing docs use `DragonsData`. |
| `ACCESS_SECRET_TOKEN` | JWT signing secret | yes | Use only in `dndAPI/.env`. |
| `PORT` | API port | no | Default `5000`. |
| `CORS_ORIGIN` | Allowed frontend origin | no | Local value `http://localhost:5173`. |
| `FIVETOOLS_DATA_DIR` | Optional local compendium source | no, but local path | Keep vendored data ignored. |
| `VITE_API_BASE_URL` | Frontend API base URL | no | `http://localhost:5000`. |

Rules:

- Do not commit real `.env` files, secrets, local databases, logs, vendored
  compendium data, or private campaign exports.
- Keep secrets server-side or local-only.
- Prefer degraded checks over fake credentials when secrets are unavailable.

## Install

Install backend dependencies:

```bash
cd dndAPI
npm install
```

Install frontend dependencies:

```bash
cd dndclient
npm install
```

Expected result:

- `node_modules/` exists in the nested project being installed.
- No dependency folders are staged in Git.

## Run Locally

Windows launcher from the workspace root:

```powershell
.\start-dev.ps1
```

Manual API startup:

```bash
cd dndAPI
npm run dev
```

Manual frontend startup:

```bash
cd dndclient
npm run dev
```

Open:

- Frontend: `http://localhost:5173`
- API health: `http://localhost:5000`

Expected result:

- API listens on port `5000`.
- Frontend listens on port `5173`.
- Sign-in and character routes work when API `.env` is valid and seed data is
  present.

## Test And Build

Fast root documentation check:

```bash
test -f AGENTS.md
test -f BLUEPRINT.md
test -f ROADMAP.md
test -f RUNBOOK.md
rg -n -F \
  -e "$(printf '[%s]' PROJECT_NAME)" \
  -e "$(printf '[%s]' ABSOLUTE_PROJECT_PATH)" \
  -e "$(printf '[%s]' YYYY-MM-DD)" \
  AGENTS.md BLUEPRINT.md ROADMAP.md RUNBOOK.md
rg -n "GAME_PLAN|Gameplan|gameplan" AGENTS.md BLUEPRINT.md ROADMAP.md RUNBOOK.md
git diff --check
```

Backend verification:

```bash
cd dndAPI
npm test
```

Frontend verification:

```bash
cd dndclient
npm test
npm run build
```

Expected result:

- root docs exist;
- placeholder search returns no unresolved template placeholders;
- active root docs use `ROADMAP.md` for current planning and mention Gameplan
  files only as historical or nested references;
- `git diff --check` passes;
- backend tests pass after backend changes;
- frontend tests and build pass after frontend changes.

### Test Coverage Policy

Treat tests as the project specification. The suite should be strong enough that
if someone accidentally deletes a meaningful line, route, data contract,
workflow step, validation rule, or bug fix, at least one test or documented
manual check fails.

Coverage rules:

- Prefer red/green TDD: write or update the failing test first, confirm the
  expected failure, then implement the smallest fix.
- Keep tests that prove behavior a user, API consumer, operator, or future
  maintainer depends on.
- Improve tests that assert the wrong level, hide real failures, rely on stale
  fixtures, or pass without proving meaningful behavior.
- Remove tests only when they are stale, duplicated without value, or pure
  bloat.
- If a behavior cannot be tested in the current harness, record the exact
  reason and use the strongest concrete manual check available.

## Data Operations

Seed/import compendium data:

```bash
cd dndAPI
npm run seed
```

Safety rules:

- Seed wipes and reloads compendium collections.
- Seed does not intentionally touch the `Character` collection.
- Run this only when `.env` points at the intended database.
- Verify output counts and then run backend tests after seed-related changes.

## Deployment Or Startup

This root workspace has no production deployment target. Deployment/runtime
state is owned by the nested backend/client repos and their hosting choices.

Before any production deployment decision:

- set `CORS_ORIGIN` explicitly;
- verify frontend API base URL;
- run backend tests;
- run frontend tests and build;
- confirm no secrets or local-only data are included in the deploy artifact.

## Version Control

The root `DnDWebApp` repo tracks root coordination docs, launch helpers, archive
docs, and `DM Workbook/` planning material. `dndAPI/` and `dndclient/` are
nested repos with their own history.

Conventions:

- Branch from `origin/main`.
- For the workbench rollout, use branch `Workbench-v1-Update`.
- Commit only intentional files for the current repo.
- Run `git status -sb` before staging and before commit.
- Never stage `.env`, local databases, logs, `node_modules`, build output,
  vendored compendium data, or unrelated nested-repo changes.
- Do not rewrite published history or force-push shared branches unless Kayden
  explicitly approves.

Because this workspace lives under the GPT_OS mounted folder, clear stale Git
lock files before repeated Git commands if Git reports an existing lock:

```bash
find .git -name '*.lock' -type f -exec sh -c 'for f do mv "$f" "$f.discard.$(date +%s)"; done' sh {} +
```

## Troubleshooting

| Symptom | Likely cause | Check | Fix |
|---|---|---|---|
| Backend tests fail before running code | `mongodb-memory-server` binary download blocked | Read failure for `fastdl.mongodb.org` or hook setup error | Record infra blocker; retry on networked host before judging code. |
| Frontend cannot reach API | API not running or `VITE_API_BASE_URL` mismatch | `curl http://localhost:5000` and inspect `dndclient/.env` | Start API or fix local `.env`. |
| API starts but seed data missing | Seed not run or Atlas config invalid | API logs and `/compendium/bootstrap` | Fix `dndAPI/.env`; run `npm run seed` intentionally. |
| Root commit misses harness files | `.gitignore` exceptions absent | `git check-ignore -v AGENTS.md BLUEPRINT.md ROADMAP.md RUNBOOK.md` | Keep explicit unignore rules for the four harness docs. |
| Git says lock file exists | Sandbox mount left stale `.git/*.lock` | `find .git -name '*.lock' -type f` | Rename locks with the command above, then retry. |

## Recovery And Rollback

If a root docs change fails verification:

1. Re-open the changed doc and identify the stale or invalid claim.
2. Apply the smallest corrective edit.
3. Re-run the root documentation checks.
4. Append an accurate `ROADMAP.md` Verification Log row.

If backend or frontend behavior fails verification:

1. Stay in the nested repo that owns the change.
2. Fix the root cause with the smallest change.
3. Re-run the targeted test and the relevant full suite.
4. Update nested docs if behavior, commands, or contracts changed.

Do not delete data, reset databases, rewrite history, rotate secrets, or
reorganize campaign/archive material unless Kayden explicitly approves that
action.

## Operational Proof

If a command or edit changes durable project state, append a row to
`ROADMAP.md` Verification Log. Routine local reads that do not change state can
be reported only in the final response.
