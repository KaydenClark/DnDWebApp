# DnDWebApp - Blueprint

**Last reviewed:** 2026-06-26  
**Status:** active  
**Source root:** `/Users/kayden/GPT_OS/Projects/DnDWebApp`

This is the stable reference for the DnDWebApp workspace. Active tasks and proof
belong in `ROADMAP.md`.

## What This Project Is

DnDWebApp is a split Dungeons and Dragons character-sheet workspace. The root
repo coordinates the project, launch helpers, and DM Workbook planning material;
the runnable apps live in nested repos:

- `dndAPI/` - Express + MongoDB REST API and the D&D rules derivation engine.
- `dndclient/` - Vite + React frontend for player character creation and sheet
  use.

Core promise:

> A player can build and use a living character sheet that derives combat,
> skill, proficiency, spell, and session-state details from the choices they
> make, without doing the math by hand.

Primary users:

- Kayden as the project owner and DM.
- Players using the character sheet during a campaign.
- Agents maintaining the split app under documented repo boundaries.

## Non-Goals

This project is not trying to:

- make the root workspace a deployable app;
- turn the character sheet into a full game engine or digital rulebook;
- compute D&D math in the frontend;
- merge the DM Workbook planning material into the player-facing app without an
  explicit product decision;
- commit secrets, Atlas credentials, local databases, vendored compendium data,
  or private campaign exports.

## Current Product Shape

When the project is working, a user can:

- run the API on port `5000` and the client on port `5173`;
- sign in, create a character, and view a derived character sheet;
- use session tools for HP, spell slots, conditions, death saves, hit dice, and
  inventory;
- seed rules data from local fallback JSON or a local 5etools-compatible
  compendium source;
- use root launch helpers to start both dev servers on Windows.

The most important quality bar is:

- keep D&D rules math centralized in `dndAPI/services/characterDerivation.js`
  and covered by tests.

## Architecture

| Layer | Choice | Source / Notes |
|---|---|---|
| Workspace | Root GitHub repo `KaydenClark/DnDWebApp` | Coordinates docs, launch helpers, and workbook planning. |
| Backend | Node.js + Express 4 | `dndAPI/`; REST API; port `5000`; nested repo `KaydenClark/dndAPI`. |
| Frontend | React 18 + Vite | `dndclient/`; port `5173`; nested repo `KaydenClark/dndclient`. |
| Database/storage | MongoDB Atlas plus in-memory MongoDB tests | API uses native MongoDB driver; tests use `mongodb-memory-server`. |
| Auth | JWT with bcryptjs | Backend issues tokens; frontend stores token in `localStorage` key `pdb-token`. |
| Testing | Node built-in test runner, supertest, Vitest, Testing Library, jsdom | Run from nested project folders. |
| DM planning | Markdown in `DM Workbook/` | `MASTER_ARCHITECTURE_V2.md` and Gameplan files describe direction and backlog. |
| Startup | Batch/PowerShell launch helpers plus npm scripts | Root helpers start both nested apps; manual commands live in `RUNBOOK.md`. |

Architecture constraints:

- The backend derives all D&D math; the frontend renders backend results.
- Root docs must not override nested repo instructions for backend or frontend
  code work.
- Keep root, backend, frontend, and DM Workbook changes scoped and committed in
  the right repo.
- Do not touch `.env` files or seed real external services unless the task
  explicitly requires it.

## Directory Map

```text
DnDWebApp/
|-- AGENTS.md                 <- root agent rules and edit/read scope
|-- BLUEPRINT.md              <- stable workspace definition
|-- ROADMAP.md                <- current plan and proof log
|-- RUNBOOK.md                <- setup, run, test, seed, and recovery commands
|-- README.md                 <- user-facing workspace setup
|-- dndAPI/                   <- Express/MongoDB backend nested repo
|-- dndclient/                <- Vite/React frontend nested repo
|-- DM Workbook/              <- campaign and DM-workbook planning docs
|-- Archive/                  <- historical architecture references
|-- Obsidian Valut/           <- local campaign notes, spelling preserved
|-- VISUAL_DESIGN.md          <- local visual guidance
|-- start-dev.bat             <- Windows launcher for both apps
|-- start-dev.ps1             <- PowerShell launcher for both apps
`-- Start DnD WebApp.bat      <- alternate launcher
```

## Main Contracts

### Commands

| Command | Purpose | Required for done? |
|---|---|---|
| `cd dndAPI && npm test` | Backend API and derivation verification | Required after backend changes. |
| `cd dndAPI && npm run seed` | Seed compendium collections | Required after seed or compendium changes; needs `.env`. |
| `cd dndAPI && npm run dev` | Start API on port `5000` | Runtime smoke when API behavior changes. |
| `cd dndclient && npm test` | Frontend component/route verification | Required after frontend changes. |
| `cd dndclient && npm run build` | Production build verification | Required after major frontend or dependency changes. |
| `cd dndclient && npm run dev` | Start frontend on port `5173` | Runtime smoke when UI behavior changes. |

### API Boundaries

| Boundary | Owner | Contract |
|---|---|---|
| D&D derivation | `dndAPI/services/characterDerivation.js` | Routes and frontend consume derived output; no duplicate rules math elsewhere. |
| API calls | `dndclient/src/lib/api.js` | Components use the API wrapper, not direct Axios calls. |
| Auth | API JWT plus frontend `pdb-token` | Protected routes require auth; token is the only approved localStorage use. |
| Compendium seeding | `dndAPI/seeds/` and `dndAPI/scripts/seed.js` | Seed wipes/reloads compendium collections, not `Character`. |

## Core Logic And Invariants

Rules:

- Every character read and write should return a freshly derived character from
  the backend.
- Raw character choices are persisted; derived stats are computed on demand.
- Frontend components do not calculate attack bonuses, AC, spell save DCs,
  skill modifiers, HP, or other D&D-derived values.
- Seed changes must keep local fallback JSON usable when full 5etools data is
  unavailable.
- DM Workbook planning is evidence and backlog unless the current task asks to
  build the DM-facing tool.

Do not duplicate this logic in:

- React components, hooks, or utilities;
- route handlers outside the backend derivation flow;
- root docs as if they were source code;
- DM Workbook notes without syncing the relevant project plan.

## Trust, Privacy, And Safety Boundaries

Sensitive data:

- `dndAPI/.env` and `dndclient/.env`;
- MongoDB Atlas connection strings and JWT secrets;
- local vendored compendium data;
- campaign/private workbook notes and exports;
- generated databases, logs, `node_modules`, `dist`, `build`, and coverage.

Rules:

- Never commit real `.env` files or secrets.
- Use `.env.example` for documented config shape only.
- Do not print secrets in logs or final responses.
- Do not run seed commands against real services unless the task requires it and
  the environment is intentionally configured.

## Known Risks

| Risk | Impact | Mitigation / owner |
|---|---|---|
| Nested repos under root | Root commits can miss backend/client changes or accidentally blur ownership. | Check `git status` in the repo being changed; commit in the owning repo only. |
| `mongodb-memory-server` binary download | Backend tests can fail in restricted networks for infrastructure reasons. | Record the exact failure and run lighter syntax/docs checks when blocked. |
| Frontend/backend dependency drift | Client can expect fields the API no longer returns. | Keep API contracts documented and test both sides after cross-boundary changes. |
| Large compendium data | Huge dropdowns or seed data can hurt UX and repo size. | Keep vendored data ignored; use searchable/filterable UI. |
| Historical Gameplan files | Old plans can look current. | Prefer `ROADMAP.md` for active root plan; keep old Gameplan files as historical references. |

## Design Decisions

| Decision | Rationale | Date / Source |
|---|---|---|
| Keep split client/API architecture | Existing backend derivation engine and Vite frontend are already functional and tested. | 2026-06-04, `DM Workbook/MASTER_ARCHITECTURE_V2.md`. |
| Backend owns D&D math | One rules engine prevents frontend/API divergence. | Existing `dndAPI/AGENTS.md` and `dndclient/AGENTS.md`. |
| Root repo coordinates, nested repos implement | The root tracks workspace docs and launch helpers while `dndAPI/` and `dndclient/` have their own repos. | 2026-06-26 rollout inspection. |
| Keep Gameplan files as historical references | They contain useful context but active proof belongs in `ROADMAP.md`. | 2026-06-26 workbench rollout. |

## Health Criteria

The project is healthy when:

- root harness docs exist and have no unresolved template placeholders;
- root docs point active planning to `ROADMAP.md` while preserving historical
  Gameplan references;
- backend tests pass after backend changes;
- frontend tests and build pass after frontend changes;
- seed and runtime checks are run when data or environment behavior changes;
- secrets, local data, generated output, and ignored nested repos are not
  included in root commits.

Verification commands live in `RUNBOOK.md`. Proof of past runs lives in the
`ROADMAP.md` Verification Log.
