# DnDWebApp Master Architecture and Onboarding Brief

Last reviewed: 2026-05-25

## Executive Summary

DnDWebApp is a split frontend/backend Dungeons and Dragons character workbook. The core product promise is:

- Let a player build a modular online character sheet.
- Show rule-valid options during character creation and editing.
- Derive combat, skill, proficiency, spell, and equipment math from character choices.
- Let players and Dungeon Masters use the sheet during a live session without doing manual math.

The current stack is worth keeping. The backend derivation engine is the strongest part of the app and already proves the core math for ability modifiers, proficiency bonus, attacks, damage strings, AC, HP, spell DCs, spell attacks, skills, saving throws, spell slots, and feature resolution. The app does not need a rewrite. It needs better rules data coverage, a cleaner frontend structure, and UI that exposes the rules engine already present on the server.

Current status:

- Backend: Express, MongoDB, JWT auth, character CRUD, compendium bootstrap, seed/import pipeline, and derivation engine are in place.
- Frontend: React/Vite app with sign in, sign up, protected character list, character creation, character detail, edit mode, and level-up flow.
- Main bottleneck: character UI is too concentrated in `dndclient/src/pages/characters/playersCharacter.js`, currently 915 lines.
- Highest-value missing feature: skill proficiency selection. Backend supports skill math, but the UI does not let players choose class/background skills yet.
- Highest-risk dependency: full compendium data. Built-in fallback data is small, and Backgrounds/Feats/Conditions are empty unless the local 5etools import path is configured and seeded.

## Workspace Map

Root: `E:\GPTCode\DnDWebApp`

Important paths:

- `dndclient/`: React 18 + Vite frontend.
- `dndAPI/`: Express + MongoDB backend.
- `DM Workbook/`: separate DM-facing initiative containing handoff notes only, not app code yet.
- `Obsidian Valut/`: local campaign/rules material, not part of the deployable app.
- `README.md`: local run instructions.
- `GAME_PLAN.md`: existing phase plan and historical audit notes.
- `PROJECT_MASTER_ARCHITECTURE.md`: this document.

Git status at review time:

- `dndclient`: clean on `master`.
- `dndAPI`: on `codex/character-level-up-flow` with modified files:
  - `DataAccess/compendium.js`
  - `db/mongo.js`
  - `seeds/import5etools.js`
  - `seeds/loadSeedData.js`
- Workspace root is not a Git repository.

## Product Vision

The app should become a practical digital binder for D&D characters:

- During character creation, the player chooses race, class, subclass, background, abilities, skills, equipment, spells, languages, tools, and feats.
- The app constrains or annotates choices using the loaded rules data.
- The app derives what the character can do instead of asking the player to manually calculate it.
- The character view is session-ready: HP, attacks, spells, slots, conditions, death saves, hit dice, and inventory are usable at the table.
- The app should allow custom additions outside normal race/class options, but those should be clearly separated from rules-derived options.

## Architecture Overview

```text
Browser
  React/Vite frontend
  Auth token in localStorage
  API client in src/lib/api.js
        |
        v
Express API
  Routes
  Auth middleware
  DataAccess layer
  Character derivation service
        |
        v
MongoDB
  Users
  Character
  Races / Classes / Subclasses
  Spells / Weapons / Armor / Features
  Backgrounds / Feats / Conditions
```

The design is serviceable:

- The frontend sends selected user intent, such as `raceId`, `classId`, `baseAbilityScores`, equipped weapons, selected spells, and proficiencies.
- The backend treats MongoDB compendium data as the rules source.
- `buildCharacterDocument()` rehydrates and re-derives the complete character document on create, update, and fetch.
- The frontend renders derived values returned by the API.

This is the right direction. Keep the backend as the authority for D&D math.

## Backend

Path: `E:\GPTCode\DnDWebApp\dndAPI`

### Stack

- Node.js
- Express 4
- MongoDB driver
- bcryptjs
- jsonwebtoken
- dotenv
- node:test
- supertest
- mongodb-memory-server

### Entrypoints

- `main.js`: starts the server.
- `app.js`: creates the Express app, initializes DB indexes, configures middleware, routes, 404 handler, and error handler.
- `routes/index.js`: root router.

### API Routes

Current API surface:

- `GET /`: pings MongoDB and returns `{ status: "ok" }`.
- `POST /signUp`: creates a user.
- `POST /signIn`: validates credentials and returns a JWT.
- `GET /compendium/bootstrap`: returns slim frontend-ready rules data.
- `GET /player`: authenticated list of character summaries for the signed-in user.
- `POST /player`: authenticated character creation.
- `GET /player/:characterId`: authenticated owned character fetch.
- `PUT /player/:characterId`: authenticated owned character update.

Route files:

- `routes/users/signIn.js`
- `routes/users/signUp.js`
- `routes/compendium.js`
- `routes/character/character.js`

### Authentication

Auth flow:

- Passwords are hashed with bcrypt.
- Sign-in returns a JWT.
- Frontend stores the JWT in `localStorage` under `pdb-token`.
- Protected API routes use `Authorization: Bearer <token>`.
- `middleware/authenticate.js` verifies the token and attaches the authenticated user to `req.user`.

Known concern:

- Token storage in `localStorage` is acceptable for local/dev but should be revisited before real production deployment.

### Data Access Layer

Key files:

- `DataAccess/users.js`: user creation and lookup behavior.
- `DataAccess/characters.js`: character create/update/fetch/list behavior.
- `DataAccess/compendium.js`: compendium collection mapping, indexed maps, and bootstrap payloads.
- `db/mongo.js`: shared Mongo connection, index creation, DB ping, and test teardown helper.

The backend uses collection names with capitalized names:

- `Users`
- `Character`
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

Indexes are created at app startup:

- Unique user email.
- Unique or lookup username, depending on existing duplicates.
- Character lookup by email.
- Unique character name per owner.
- Unique `id` for each compendium collection.

### Character Derivation Engine

File: `dndAPI/services/characterDerivation.js`

This is the app's core domain engine. It currently handles:

- Ability score normalization.
- Race ability bonuses.
- Ability modifiers.
- Proficiency bonus by level.
- Race, class, subclass lookup by id or name.
- Feature ids from race/class/subclass progression.
- Weapon proficiency resolution.
- Armor proficiency resolution.
- Language resolution.
- Hit point calculation.
- Armor class calculation with armor DEX caps and shields.
- Skill value derivation from selected proficiencies.
- Saving throw derivation from class/user proficiencies.
- Spell slot state.
- Spell save DC.
- Spell attack bonus.
- Equipped weapon attack bonuses.
- Damage summary strings.
- Spell summaries and cantrip scaling.
- Available weapon ids.
- Available spell ids.
- Conditions, death saves, currency, inventory, equipment, character story fields.

Important design decision:

- Keep this logic server-side and treat it as the source of truth. The frontend should display and submit selections, not duplicate D&D math.

Current blind spots:

- Feat prerequisites are parsed as display text, not enforced by the backend.
- Background rules are imported but not yet applied into character derivation.
- Class skill choice rules exist in compendium data, but selected skill validation is not enforced.
- Custom/homebrew options need a formal data model before they become first-class.

### Seeding and Rules Data

Seed entry:

- `scripts/seed.js`

Seed loader:

- `seeds/loadSeedData.js`

Importer:

- `seeds/import5etools.js`

Seed behavior:

- If `FIVETOOLS_DATA_DIR` points to a valid local source folder, the seed pipeline imports larger 5etools-compatible compendium data.
- If not, the seed pipeline uses small built-in JSON files under `seeds/`.

Built-in fallback seed files exist for:

- Races
- Classes
- Subclasses
- Spells
- Weapons
- Armor
- Features
- Users
- Characters

Fallback stubs currently exist but are empty for:

- Backgrounds
- Feats
- Conditions

5etools importer currently targets:

- Races
- Classes
- Subclasses
- Spells
- Weapons
- Armor
- Features
- Backgrounds
- Feats
- Conditions

Critical dependency:

- The app cannot provide real D&D breadth until the intended local compendium source is present and `npm run seed` has successfully loaded it into the target database.

### Backend Environment

Example file: `dndAPI/.env.example`

Variables:

- `ATLAS_CONNECTION`
- `ACCESS_SECRET_TOKEN`
- `DB_NAME`
- `PORT`
- `FIVETOOLS_DATA_DIR`

Default API port:

- `5000`

### Backend Tests

File:

- `dndAPI/test/api.test.js`

Coverage includes:

- Sign-up.
- Duplicate email/username rejection.
- Sign-in.
- Invalid sign-in rejection.
- Missing/invalid auth token rejection.
- Compendium bootstrap.
- Character summary list ownership.
- Character creation with derived combat stats.
- Owned character fetch with spell data.
- Character update with re-derived dependent stats.
- Partial update validation.
- Required create fields.

Verification run during this review:

- Command: `npm.cmd test` from `dndAPI`
- Result: 13 tests passed.

## Frontend

Path: `E:\GPTCode\DnDWebApp\dndclient`

### Stack

- React 18
- Vite 6
- React Router 6
- Axios
- Vitest
- Testing Library
- jsdom

### Entrypoints

- `src/index.js`
- `src/App.js`
- `src/components/navigation/Routes.js`
- `src/components/navigation/Links.js`

### Routing

Current routes:

- `/`: home page.
- `/signIn`: sign in.
- `/signUp`: sign up.
- `/characters`: protected character list and embedded creation form.
- `/characters/:characterId`: protected character detail page.
- `*`: redirects to `/`.

Missing route:

- `/characters/new` does not exist yet. Character creation is embedded in the list page.

### API Client

File: `src/lib/api.js`

Functions:

- `requestSignIn`
- `requestSignUp`
- `fetchCharacters`
- `fetchCompendiumBootstrap`
- `createCharacter`
- `fetchCharacterById`
- `updateCharacter`

API base:

- `src/components/const.js` reads `VITE_API_BASE_URL` and falls back to `http://localhost:5000`.

### Auth State

File: `src/context/auth.js`

Current behavior:

- Stores token in localStorage as `pdb-token`.
- Exposes `isAuthenticated`, `token`, `signIn`, and `signOut`.
- Protected routes redirect unauthenticated users to `/signIn`.

### Character List and Creation

File: `src/pages/characters/charactersList.js`

Current behavior:

- Loads character summaries and compendium bootstrap data in parallel.
- Renders a flat create-character form.
- Supports race, class, subclass, background text, alignment text, level, and base ability scores.
- Creates a character through `POST /player`.
- Redirects new characters to `/characters/:id?mode=levelUp`.

Limitations:

- No dedicated character creation route.
- No wizard.
- No skill proficiency selection.
- Background is plain text even though backend can now expose structured backgrounds.
- No equipment, language, tool, or feat choices during creation.
- Long compendium lists will need searchable controls, not raw selects.

### Character Detail, Edit, and Level-Up

File: `src/pages/characters/playersCharacter.js`

Current status:

- 915 lines.
- Contains formatting helpers, spell selection components, page state, fetch logic, edit form, level-up flow, and display sections in one file.
- Functionally important but too large for continued feature work.

Current behavior:

- Loads compendium bootstrap and character detail.
- Renders derived stats, attacks, spells, features, proficiencies, currency, and narrative fields.
- Supports edit mode.
- Supports level-up mode.
- Saves character updates through `PUT /player/:characterId`.
- Lets user edit base stats, HP, race/class/subclass, equipment, weapons, currency, and narrative fields.
- Lets user select known/prepared/cantrip spells in level-up flow.

Limitations:

- Large file is the main frontend maintainability risk.
- Skill proficiency selection is missing.
- Weapon picker does not clearly mark proficiency status.
- HP quick controls are missing from view mode.
- Conditions and death saves are model-backed but not visible as session tools.
- Spell slot expend/refresh UI is missing.
- Backstory/story field support is partial and should be checked in view mode after any refactor.

### Frontend Tests

Current test files:

- `src/App.test.js`
- `src/context/auth.test.js`
- `src/components/navigation/Routes.test.js`
- `src/pages/users/AuthPages.test.js`
- `src/pages/characters/CharactersPages.test.js`

Coverage includes:

- Home render.
- Auth context behavior.
- Protected route redirects.
- Sign-in/sign-up page rendering.
- Character creation controls.
- Creation redirect to level-up flow.
- Character detail sections.
- Level-up save payload.
- Edit form save payload.

Verification run during this review:

- Command: `npm.cmd test` from `dndclient`
- Result: 5 test files passed, 11 tests passed.
- Note: React Router v7 future flag warnings appear in stderr. They are warnings, not failing tests.

## Local Startup

Root helper scripts:

- `Start DnD WebApp.bat`
- `start-dev.bat`
- `start-dev.ps1`

Local ports:

- API: `http://localhost:5000`
- Frontend: `http://localhost:5173`

Recommended local startup:

1. Create `dndAPI/.env` from `dndAPI/.env.example`.
2. Create `dndclient/.env` from `dndclient/.env.example`.
3. Install dependencies in both app folders.
4. Seed the database from `dndAPI`.
5. Start API.
6. Start frontend.

The PowerShell launcher checks required paths, starts the API and client in separate windows, waits for ports, and opens the frontend.

## Domain Model Snapshot

The persisted `Character` document is both user input and derived output. On create/update/fetch, the backend rebuilds it from:

- Owner identity.
- Stored character fields.
- Incoming payload fields.
- Compendium rules data.
- Default character sheet shape.

Key character field groups:

- Identity: `email`, `userName`, `characterName`.
- Core choices: `raceId`, `classId`, `subclassId`, `background`, `alignment`, `level`, `xp`.
- Abilities: `baseAbilityScores`, `abilityScores`, `abilityMods`.
- Derived combat: `proficiencyBonus`, `armorClass`, `initiative`, `speed`, `maxHp`, `currentHp`, `tempHp`, `hitDie`, `hitDiceRemaining`.
- Proficiencies: `savingThrowProficiencies`, `skillProficiencies`, `weaponProficiencies`, `armorProficiencies`, `toolProficiencies`, `languages`.
- Equipment: `armorId`, `shieldId`, `equippedWeaponIds`, `availableWeaponIds`, `attacks`, `inventory`, `equipment`.
- Spells: `spellcasting`, `spellSlots`, `spellSaveDC`, `spellAttackBonus`, `availableSpellIds`, `knownSpellIds`, `preparedSpellIds`, `cantripIds`, `resolvedSpells`.
- Session state: `conditions`, `deathSaves`, `currency`.
- Narrative: `traits`, `ideals`, `bonds`, `flaws`, `backstory`.
- Features: `featureIds`, `features`.

Compendium documents should remain normalized by stable `id` fields. Characters should store selected ids and user overrides, while the backend derives display values.

## Current Milestones

### Milestone 0: Stabilize Data Pipeline

Goal:

- Full intended rules data is available in MongoDB and bootstrap payloads before frontend features depend on it.

Status:

- Importer code exists for Backgrounds, Feats, and Conditions.
- Backend compendium layer references Backgrounds, Feats, and Conditions.
- Index creation references Backgrounds, Feats, and Conditions.
- Built-in fallback arrays for these collections are empty.
- Need to run and verify seed against the intended database with the intended local source.

Acceptance criteria:

- `npm run seed` succeeds from `dndAPI`.
- `/compendium/bootstrap` returns non-empty `backgrounds`, `feats`, and `conditions` when using full local data.
- Backend tests pass after seeding.

### Milestone 1: Split Character Detail UI

Goal:

- Reduce risk before adding more character sheet behavior.

Recommended extraction targets:

- `CharacterHeader`
- `AbilityScores`
- `CombatStats`
- `SkillsAndSaves`
- `AttacksPanel`
- `SpellPanel`
- `FeaturesPanel`
- `EquipmentPanel`
- `EditCharacterForm`
- `LevelUpStudio`

Rules:

- Preserve behavior first.
- Keep props explicit.
- Keep state ownership in the page until extraction proves stable.
- Add or adjust tests around each extracted surface.

### Milestone 2: Move Character Creation to `/characters/new`

Goal:

- Separate roster browsing from character creation.

Current issue:

- `CharactersList` is doing roster loading, compendium loading, create form state, create submit, and character-card rendering.

Acceptance criteria:

- `/characters` lists characters only.
- `/characters/new` owns the creation form.
- Existing create flow still redirects to `/characters/:id?mode=levelUp`.
- Route tests cover protected access and successful creation.

### Milestone 3: Make Core Rules Promise Visible

Highest-priority features:

- Skill proficiency selection driven by class `skillChoiceRules`.
- Background selection from structured background compendium data.
- Weapon proficiency indicators in equipment selection.
- HP quick controls on the character view.

Acceptance criteria:

- Player can select legal class skills during creation.
- Skill values on the sheet reflect selected proficiencies.
- Equipment picker marks proficient vs non-proficient weapons.
- Attack rows show correct hit bonus and damage summary.
- Player can apply damage/healing without opening full edit mode.

### Milestone 4: Character Creation Wizard

Recommended wizard steps:

- Name
- Race
- Class/subclass
- Background/alignment
- Ability scores
- Skills/proficiencies
- Equipment/spells where applicable
- Review

Important UX rule:

- Full compendium data will produce long lists. Use searchable/filterable controls for spells, feats, equipment, subclasses, and backgrounds.

### Milestone 5: Session-Ready Sheet Tools

Priority order:

- HP quick controls.
- Conditions tracker.
- Spell slot expend/refresh.
- Death save tracker.
- Hit dice tracker.
- Inventory item add/remove.

These should be fast to use during play and should not require opening full edit mode.

### Milestone 6: Breadth and Homebrew

Goal:

- Support broad official/SRD-style content and controlled custom additions.

Needed work:

- Confirm class progression through level 20 from imported data.
- Validate spell availability and spell preparation behavior by class.
- Implement feat selection at ASI levels.
- Implement language/tool choices.
- Add a custom/homebrew data model that can coexist with compendium ids.

## Technical Risks

### Data Completeness

The app is only as useful as its compendium. Small fallback data is enough for tests and demos, not launch.

Mitigation:

- Treat seed/import verification as a blocker for UI features that depend on content breadth.

### Frontend File Size

`playersCharacter.js` is already too large. More features added there will slow development and increase regression risk.

Mitigation:

- Extract components mechanically before changing behavior.

### Rules Validation

The backend derives values but does not yet enforce every legal choice.

Examples:

- Selected skill proficiencies are not validated against class/background rules.
- Feat prerequisites are display-only.
- Background languages/tools are not applied to derivation yet.

Mitigation:

- Add validation at API boundaries as each feature becomes user-facing.

### Production Security

Current setup is acceptable for local development but not production-hard.

Concerns:

- Open CORS.
- JWT in localStorage.
- No visible refresh-token/session expiry strategy in frontend.
- Environment variables and Atlas access must be handled carefully.

Mitigation:

- Lock CORS origins before deployment.
- Review auth/session approach before public launch.
- Keep `.env` out of source control.

### Legal and Licensing

Rules content sources matter. The repository references a local 5etools-compatible import flow.

Mitigation:

- Before public launch, confirm the exact allowed content source and license strategy.
- Separate internal/local content from publicly shipped data if needed.

## Development Standards for This Project

Use this operating model:

- Preserve the current stack.
- Keep backend derivation as source of truth.
- Make the smallest correct change.
- Add tests near the behavior being changed.
- Run relevant tests before claiming completion.
- Do not rewrite large areas unless there is a narrow, behavior-preserving extraction plan.
- Treat uncommitted work in either repo as someone else's work unless explicitly told otherwise.

Recommended verification by change type:

- Backend API or derivation change: run `npm.cmd test` in `dndAPI`.
- Frontend route/component change: run `npm.cmd test` in `dndclient`.
- Build confidence before handoff: run `npm.cmd run build` in `dndclient`.
- Data import change: run seed against intended DB, then verify `/compendium/bootstrap`.
- Major UI change: run tests and manually inspect the app in browser.

## Day-One New Developer Checklist

1. Read this file.
2. Read `README.md` for local setup.
3. Read `GAME_PLAN.md` for current phased planning history.
4. Check Git status inside `dndclient` and `dndAPI`.
5. Confirm `.env` files exist and point at the intended database/data source.
6. Run backend tests.
7. Run frontend tests.
8. Do not start with a rewrite. Start with the highest-priority milestone.

## Recommended Next Work

Do this next, in order:

1. Seed and verify the full compendium data pipeline for Backgrounds, Feats, and Conditions.
2. Split `playersCharacter.js` through behavior-preserving component extraction.
3. Move character creation to `/characters/new`.
4. Add skill proficiency selection.
5. Add weapon proficiency indicators.
6. Add HP quick controls.

This order keeps the project launch-focused: first make the data real, then make the UI maintainable, then expose the rules engine to players.

## Review Verification

Commands run during this review:

- `npm.cmd test` in `E:\GPTCode\DnDWebApp\dndAPI`
  - Result: 13 tests passed.
- `npm.cmd test` in `E:\GPTCode\DnDWebApp\dndclient`
  - Result: 11 tests passed across 5 files.

Known warnings:

- Frontend tests emit React Router v7 future flag warnings. They are not current failures.

What was not verified:

- Full app manual browser flow.
- `npm run seed` against the intended Atlas/local production-like database.
- Full compendium bootstrap with non-empty Backgrounds/Feats/Conditions from the real local source.
- Frontend production build.

