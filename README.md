# DnD WebApp Workspace

This workspace contains the revived split app:

- `dndclient`: Vite + React frontend
- `dndAPI`: Express + MongoDB backend

Project coordination docs are plain Markdown so Codex, Claude, Claude Code, and
other agents can use the same source of truth. Claude Code should load
`CLAUDE.md`, which imports `@AGENTS.md`; after `/init`, keep shared rules in
`AGENTS.md` rather than duplicating them in agent-specific files.

Visual-design starters live in `VISUAL_DESIGN.md`. Use them as
project-specific direction for D&D UI work, not as a replacement for existing
screens, user context, accessibility checks, or concrete browser verification.

## Run Locally

### One-click launcher

From this workspace root, either:

- Double-click `Start DnD WebApp.bat`
- Or run `.\start-dev.bat`

The launcher starts the API on port `5000`, starts the frontend on port `5173`, and opens `http://localhost:5173`.

Close the two server terminal windows when you want to stop the app.

If the API terminal closes or shows a MongoDB connection error, check `dndAPI/.env` and your network connection. The launcher can start the backend, but the backend still needs a valid MongoDB connection string.

### Manual startup

1. Create `dndAPI/.env` from `dndAPI/.env.example`
2. Create `dndclient/.env` from `dndclient/.env.example`
3. In `dndAPI`, run `npm install`
4. In `dndclient`, run `npm install`
5. Optional: populate `dndAPI/vendor/5etools-data` and leave `FIVETOOLS_DATA_DIR=./vendor/5etools-data` to import a larger local compendium
6. In `dndAPI`, run `npm run seed` after your Atlas connection string is configured
7. In `dndAPI`, run `npm run dev`
8. In `dndclient`, run `npm run dev`

## Seeded Starter Data

`npm run seed` loads starter SRD-style data for:

- `Races`
- `Classes`
- `Subclasses`
- `Spells`
- `Weapons`
- `Armor`
- `Features`
- `Backgrounds`
- `Feats`
- `Conditions`
- `Users`
- `Character`

If `FIVETOOLS_DATA_DIR` points to a valid local compendium source folder, the seed step imports compendium data from that local source instead of the small built-in starter set.

Starter sign-in accounts use password `Password123!`:

- `aria@example.com`
- `bran@example.com`
- `dm@example.com`

## Default Local Ports

- Frontend: `5173`
- API: `5000`
