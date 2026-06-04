# DnD Web App - Master Architecture Reference V2

**Last reviewed: 2026-06-04**
**Supersedes:** `MASTER_ARCHITECTURE.md` and `PROJECT_MASTER_ARCHITECTURE.md`

This is the single source of truth for the DnD Web App. New developer, new chat session, or returning after months away - start here. Every section has been verified against the actual source files, not assumed from memory.

---

## 1. What This App Is

An online, rules-accurate D&D 5e character workbook for players. The core promise:

> "Tell me exactly how much damage my sword does per swing based on my stats. Tell me what I'm proficient with based on what I selected during character creation."

It is not a digital rulebook. It is not a game engine. It is a living character sheet that knows the rules and auto-derives every calculated stat from your choices. When you select Fighter + Longsword + STR 16, the app tells you: attack bonus `+5`, damage `1d8 + 3 slashing`, proficient. No manual math.

**What the fully-built app should do:**
- Let a player build a modular online character sheet.
- Show rule-valid options during character creation and editing.
- Derive combat, skill, proficiency, spell, and equipment math from character choices.
- Let players and DMs use the sheet during a live session without doing manual math.
- Allow custom additions outside normal race/class options, clearly separated from rules-derived options.

The current stack is worth keeping. The backend derivation engine is the strongest part of the app. The app does not need a rewrite - it needs better rules data coverage, a cleaner frontend structure, and UI that exposes the rules engine already on the server.

---

## 2. Verified Test State (2026-06-04)

Before touching anything, confirm these pass:

```bash
# Backend
cd dndAPI && npm test
# Expected: 55 tests passed
# Note: mongodb-memory-server must be able to download its binary.
#       In sandboxed environments without CDN access, tests 1-30 will fail
#       with a hookFailed/403 error. This is infra, not a code regression.

# Frontend
cd dndclient && npm test
# Expected: 372 tests passed across 24 test files
# Note: React Router v7 future flag warnings appear in stderr - not failures.
#       SessionReadyTools.red.test.js currently emits React act(...) warnings;
#       tests pass, but cleanup is tracked as priority test debt in BACKLOG.md.
```

Coverage summary:

**Backend (55 tests):** Sign-up, duplicate email/username rejection, sign-in, invalid sign-in rejection, missing/invalid auth token rejection, compendium bootstrap (data shape, projections, non-empty races/classes/backgrounds/conditions), all-12-classes coverage, all-15-races coverage, spell levels 0-9 coverage, spells for new caster classes, CORS origin header, character summary list ownership, character creation with derived combat stats, expertise create/update behavior, Warlock pact slot derivation with `restRecovery: "short"`, non-Warlock caster with `restRecovery: "long"`, Paladin half-caster slot table (0 slots at L1, 2 at L2), owned character fetch with spell data, character update with re-derived stats, partial update validation, required create fields, plus unit tests covering derivation engine, asyncHandler, and JWT middleware.

**Frontend (372 tests across 24 files):** Home render, auth context behavior, protected route redirects, sign-in/sign-up page rendering, wizard navigation (7 steps), subrace picker, alphabetical sort, alignment dropdown, ability score methods (Standard Array/Point Buy/Roll), expertise selection, subclass early-gate, LevelUpStudio subclass notice, HP bar, Temp HP controls, character detail sections, session tools, condition tooltip metadata, level-up save payload, edit form save payload, tool proficiency display, spell-slot recovery display, and skill modifier breakdown.

If either suite is not green before you start, fix it first. Do not add features on a red test baseline.

---

## 3. Stack

| Layer | Technology | Notes |
|---|---|---|
| Frontend | React 18 via Vite 6 | `dndclient/` - Vite replaced CRA |
| API | Node.js / Express 4 | `dndAPI/` - REST only |
| Database | MongoDB Atlas | Cluster: `dndapi.p7im0tj.mongodb.net`, DB: `DragonsData` |
| Auth | JWT (jsonwebtoken + bcryptjs) | Bearer tokens; token stored in `localStorage` as key `pdb-token` |
| HTTP client | Axios | Frontend calls API at `VITE_API_BASE_URL`, defaults to `http://localhost:5000` |
| Styling | Raw CSS | No Tailwind yet - new components should use Tailwind utility classes |
| Testing (API) | Node built-in test runner + supertest + mongodb-memory-server | |
| Testing (client) | Vitest + Testing Library + jsdom | |
| Dev tooling | Nodemon (API), Vite HMR (client) | |

**Dev ports:** API `5000` | Frontend `5173`

---

## 4. Directory Map

```
DnDWebApp/
├── MASTER_ARCHITECTURE_V2.md   ← you are here
├── MASTER_ARCHITECTURE.md      ← superseded, kept for reference
├── GAME_PLAN.md                ← phased roadmap + historical audit notes
├── start-dev.bat / .ps1        ← starts both servers; PS1 version waits for ports
├── Start DnD WebApp.bat        ← alternate launcher
│
├── dndAPI/                     ← Express backend
│   ├── main.js                 ← entry: calls createApp(), starts on PORT
│   ├── app.js                  ← factory: cors/json/routes/error handler
│   ├── routes/
│   │   ├── index.js            ← root router: /signIn /signUp /compendium /player
│   │   ├── users/
│   │   │   ├── signIn.js       ← POST /signIn → JWT
│   │   │   └── signUp.js       ← POST /signUp → creates user
│   │   ├── compendium.js       ← GET /compendium/bootstrap
│   │   └── character/
│   │       └── character.js    ← /player CRUD (auth required)
│   ├── DataAccess/
│   │   ├── compendium.js       ← DB reads for all compendium collections
│   │   ├── characters.js       ← character CRUD, calls derivation on every op
│   │   └── users.js            ← user lookup/create
│   ├── services/
│   │   └── characterDerivation.js  ← THE ENGINE
│   ├── defaults/
│   │   └── characterSheet.js   ← empty character shape; merge base on create/update
│   ├── middleware/
│   │   ├── authenticate.js     ← JWT verify; attaches req.user
│   │   └── asyncHandler.js     ← wraps async handlers, forwards errors
│   ├── db/
│   │   └── mongo.js            ← singleton MongoClient, ensureIndexes(), pingDb()
│   ├── seeds/
│   │   ├── import5etools.js    ← reads 5etools JSON, transforms to app schema
│   │   ├── loadSeedData.js     ← orchestrates: 5etools first, JSON fallbacks second
│   │   ├── classes.json        ← fallback: Fighter/Wizard/Cleric/Rogue (L5 only)
│   │   ├── races.json          ← fallback: Human/High Elf/Hill Dwarf/Lightfoot Halfling
│   │   ├── armor.json          ← fallback static armor
│   │   ├── features.json       ← fallback static features
│   │   ├── spells.json         ← fallback static spells
│   │   ├── subclasses.json     ← fallback static subclasses
│   │   ├── weapons.json        ← fallback static weapons
│   │   └── users.json          ← seed test accounts
│   ├── scripts/
│   │   └── seed.js             ← npm run seed (wipes and reloads all compendium)
│   └── test/
│       └── api.test.js         ← 13 integration tests against in-memory MongoDB
│
├── dndclient/                  ← React/Vite frontend
│   └── src/
│       ├── App.js              ← root component: NavBar + AppRoutes
│       ├── index.js            ← ReactDOM.createRoot
│       ├── lib/
│       │   └── api.js          ← 7 Axios API functions
│       ├── context/
│       │   └── auth.js         ← AuthContext: token/isAuthenticated/signIn/signOut
│       ├── components/
│       │   ├── const.js        ← base API URL (reads VITE_API_BASE_URL)
│       │   ├── navigation/
│       │   │   ├── Links.js
│       │   │   └── Routes.js   ← react-router route definitions
│       │   └── characters/
│       │       └── characterSheet.js  ← summary card for list view
│       └── pages/
│           ├── home/home.js
│           ├── users/
│           │   ├── SignIn.js
│           │   └── SignUp.js
│           ├── equpiment/items.js     ← stub; unrouted; folder name typo
│           └── characters/
│               ├── charactersList.js       ← list + embedded create form (needs split)
│               └── playersCharacter.js     ← full sheet view/edit/level-up (915 lines, needs split)
│
├── DM Workbook/                ← separate DM-facing app (planning phase only, no code yet)
└── Obsidian Valut/             ← local campaign notes, not part of the deployable app
```

---

## 5. API Reference

Base URL: `http://localhost:5000` (dev)

### Public Routes

| Method | Path | Body | Returns |
|---|---|---|---|
| GET | `/` | - | `{ status: 'ok' }` - DB health check |
| POST | `/signUp` | `{ email, userName, password }` | `{ user }` |
| POST | `/signIn` | `{ email, password }` | `{ token, user }` |
| GET | `/compendium/bootstrap` | - | Slim compendium for UI dropdowns (see below) |

Bootstrap response shape:
```js
{
  races: [{ id, name, speed, size }],
  classes: [{ id, name, primaryAbilities }],
  subclasses: [{ id, classId, name }],
  weapons: [{ id, name, category, weaponType }],
  armor: [{ id, name, category, baseAc }],
  spells: [{ id, name, level, classes }],
  backgrounds: [{ id, name, source, skillProficiencies, languages, toolProficiencies }],
  feats: [{ id, name, source, prerequisite, abilityBonus }],
  conditions: [{ id, name, description }]
}
```

### Protected Routes (JWT Bearer required)

All under `/player`, scoped to the authenticated user's email.

| Method | Path | Body | Returns |
|---|---|---|---|
| GET | `/player` | - | `{ characters: [summary...] }` |
| POST | `/player` | `{ characterName, raceId, classId, level, baseAbilityScores, ... }` | `{ character }` (full derived) |
| GET | `/player/:characterId` | - | `{ character }` (full derived) |
| PUT | `/player/:characterId` | any character fields (partial ok) | `{ character }` (full derived) |

**Critical behavior:** Every read and write runs `buildCharacterDocument()`. Raw inputs are persisted. Derived stats are never stored - they are computed fresh on every response.

---

## 6. The Derivation Engine

`dndAPI/services/characterDerivation.js` - read this before touching any character-related code.

**Computation order:**

1. Race, class, subclass lookup from compendium Maps (by id, falls back to name slug match)
2. Base ability scores normalized from input
3. Ability scores = `baseAbilityScores` + racial `abilityBonuses`
4. Ability modifiers = `floor((score - 10) / 2)` per stat
5. Proficiency bonus = `2 + floor((level - 1) / 4)`
6. Feature IDs = union of race features + class level progression + subclass level features
7. Weapon/armor proficiencies = union of race + class + character overrides
8. Saving throws = modifier + proficiency bonus if proficient
9. Skills (18 total) = relevant ability mod + proficiency bonus if skill is in `skillProficiencies[]`
10. HP = class hit die + CON mod (L1) + average per level thereafter; Dwarven Toughness adds +level
11. AC = 10 + DEX (unarmored), or armor's `baseAc` + DEX (capped by `dexCap`), + shield bonus
12. Initiative = DEX modifier
13. Passive Perception = 10 + WIS mod + proficiency bonus if Perception proficient
14. Attacks = for each `equippedWeaponId`: attack bonus, damage string, proficiency flag
15. Spell slots = from class `spellSlotsByLevel[level]` table (handles full-caster, half-caster, and Warlock pact tables identically)
16. Spell save DC = 8 + proficiency bonus + spellcasting ability mod
17. Spell attack bonus = proficiency bonus + spellcasting ability mod
18. Available spells = filtered by class and max castable spell level at current level
19. Languages = race languages + character.languages (deduplicated, "Choice" excluded)

**Weapon attack ability selection:**
- Ranged → DEX
- Finesse → whichever of STR or DEX is higher
- All others → STR

**Current derivation blind spots (not yet enforced):**
- Feat prerequisites are parsed as display text only - not enforced.
- Background skill/language/tool grants are imported and stored but not yet fed into derivation. A character with a background does not automatically gain its proficiencies.
- Selected skill proficiencies are not validated against class `skillChoiceRules`. Any skill can be submitted and the engine will apply it.

**Input shape for `buildCharacterDocument(character, compendium)`:**
```js
{
  raceId, classId, subclassId,
  level,                                      // 1-20
  baseAbilityScores: { str, dex, con, int, wis, cha },
  skillProficiencies: ['perception', ...],    // engine applies proficiency bonus
  equippedWeaponIds: ['longsword', ...],
  armorId, shieldId,
  cantripIds, knownSpellIds, preparedSpellIds,
  spellSlots: { level_1: { slotsExpended }, ... },
  conditions, deathSaves, currency,
  traits, ideals, bonds, flaws, backstory,
  inventory, equipment
}
```

---

## 7. MongoDB Collections

Database: `DragonsData`

| Collection | Key fields |
|---|---|
| `Users` | `email` (unique index), `userName` (unique index), `passwordHash` |
| `Character` | `email` (owner), `characterName` (unique per email), all raw inputs + derived output |
| `Races` | `id`, `name`, `abilityBonuses`, `weaponProficiencies`, `featureIds`, `speed`, `languages` |
| `Classes` | `id`, `name`, `hitDie`, `savingThrowProficiencies`, `armorProficiencies`, `weaponProficiencies`, `skillChoiceRules`, `spellcasting`, `levelProgression` |
| `Subclasses` | `id`, `classId`, `name`, `levelFeatures` |
| `Spells` | `id`, `name`, `level`, `classes[]`, `damage`, `scaling`, `school`, `range`, `duration`, `components` |
| `Weapons` | `id`, `name`, `category`, `weaponType`, `damageDice`, `damageType`, `finesse`, `range`, `properties` |
| `Armor` | `id`, `name`, `category`, `baseAc`, `dexCap` |
| `Features` | `id`, `name`, `description` |
| `Backgrounds` | `id`, `name`, `source`, `skillProficiencies`, `languages`, `toolProficiencies` |
| `Feats` | `id`, `name`, `source`, `prerequisite`, `abilityBonus` |
| `Conditions` | `id`, `name`, `description` |

**Indexes created at startup (`ensureIndexes`):**
- `Users.email` unique
- `Users.userName` unique (or non-unique lookup if duplicates already exist)
- `Character.email` lookup
- `Character.{email, characterName}` unique
- All 10 compendium collections: `id` unique

---

## 8. Data Pipeline (Seeding)

```bash
cd dndAPI && npm run seed
```

**Flow:** `scripts/seed.js` → `seeds/loadSeedData.js` → tries `import5etools.js` first → falls back to static JSON files → wipes and reloads all 10 compendium collections → seeds users from `users.json`. Does NOT touch the `Character` collection.

**5etools source path** (in `dndAPI/.env`):
```
FIVETOOLS_DATA_DIR=F:/Obsidian Valut/CLI/bin/5etools-src/data
```

**Verified document counts (seed run 2026-06-03, 5etools importer active):**

| Collection | 5etools actual | Static fallback |
|---|---|---|
| Races | **165** | 15 |
| Classes | **16** | 12 |
| Subclasses | **130** | 12 |
| Spells | **558** | 91 |
| Weapons | **52** | partial |
| Armor | **14** | partial |
| Features | **2,967** | 245 |
| Backgrounds | **126** | partial |
| Feats | **178** | 0 (empty stub) |
| Conditions | **15** | 15 |

The 5etools importer at `FIVETOOLS_DATA_DIR=F:/Obsidian Valut/CLI/bin/5etools-src/data` is active and runs on every `npm run seed`. The static JSON fallback files are still maintained for environments without 5etools access. All 53 backend tests green as of 2026-06-03.

**Static fallback classes only have level progression through L5.** Full progression to L20 requires the 5etools seed.

---

## 9. Frontend Routes

```
/              → Home.js (public)
/signIn        → SignIn.js (public)
/signUp        → SignUp.js (public)
/characters    → CharactersList.js (protected) - roster list + inline create form
/characters/:id → PlayersCharacter.js (protected) - full character sheet
*              → redirects to /
```

**Missing: `/characters/new`** - character creation is embedded inside `CharactersList`. This is a structural problem tracked in Milestone 2.

---

## 10. Frontend State Architecture

### Auth (`src/context/auth.js`)
Persists JWT in `localStorage` under key `pdb-token`. Exposes `{ token, isAuthenticated, signIn, signOut }` via Context. Protected routes redirect unauthenticated users to `/signIn`.

### Character Sheet (`playersCharacter.js`) - three modes

| Mode | Triggered by | What shows |
|---|---|---|
| `'view'` | Default on load | Read-only derived stats |
| `'edit'` | "Edit Character" button | Full edit form; `editForm` state synced from character on open |
| `'levelUp'` | "Level Up" button or `?mode=levelUp` param | Level adjuster + spell picker; `planner` state synced on open |

On save (edit or level-up), `PUT /player/:characterId` is called, the API re-derives the full document, and the response replaces all local state.

### Character Creation (`charactersList.js`)
Controlled form inline on the list page. After successful create, navigates to `/characters/:id?mode=levelUp` so the player immediately picks spells.

---

## 11. Domain Model - Character Field Groups

The persisted `Character` document stores both user inputs and derived output. On every create/update/fetch the backend rebuilds it from: owner identity + stored fields + incoming payload + compendium rules + default sheet shape.

| Group | Fields |
|---|---|
| Identity | `email`, `userName`, `characterName` |
| Core choices | `raceId`, `classId`, `subclassId`, `background`, `alignment`, `level`, `xp` |
| Abilities | `baseAbilityScores`, `abilityScores` (with racial bonuses), `abilityMods` |
| Derived combat | `proficiencyBonus`, `armorClass`, `initiative`, `speed`, `maxHp`, `currentHp`, `tempHp`, `hitDie`, `hitDiceRemaining` |
| Proficiencies | `savingThrowProficiencies`, `skillProficiencies`, `weaponProficiencies`, `armorProficiencies`, `toolProficiencies`, `languages` |
| Equipment | `armorId`, `shieldId`, `equippedWeaponIds`, `availableWeaponIds`, `attacks`, `inventory`, `equipment` |
| Spells | `spellcasting`, `spellSlots`, `spellSaveDC`, `spellAttackBonus`, `availableSpellIds`, `knownSpellIds`, `preparedSpellIds`, `cantripIds`, `resolvedSpells` |
| Session state | `conditions`, `deathSaves`, `currency` |
| Narrative | `traits`, `ideals`, `bonds`, `flaws`, `backstory` |
| Features | `featureIds`, `features` |

---

## 12. Current Feature Status

### Working
- User sign-up / sign-in with JWT
- Create character (name, race, class, subclass, level, ability scores, background text, alignment)
- Full character sheet display: ability scores, modifiers, HP, AC, initiative, speed, proficiency bonus, passive perception, saving throws, all 18 skills, attacks with damage strings and proficiency flag, spell slots, cantrips, prepared/known spells, features, proficiency lists, currency, personality fields
- Edit character (all above fields)
- Level-Up Studio (adjust level 1-20, spell selection, saves and re-derives)
- Spell slot display (remaining/total)
- Weapon proficiency computed and labeled on each attack card
- Racial ability score bonuses applied automatically
- Dwarven Toughness HP bonus
- Spell save DC and spell attack bonus computed per class
- Finesse weapon ability selection

### Missing / Not Built
- **Skill proficiency selection** - highest-value missing feature. Engine supports it. `skillChoiceRules` data is in classes. No UI.
- **Weapon proficiency indicator in equipment picker** - attack card shows proficient/not, but the weapon picker in edit mode shows all weapons with no visual distinction.
- **HP quick controls** - no +/- in view mode. Must enter edit mode to change current HP.
- **Spell slot expend/refresh buttons** - display only, no interaction.
- **Background as structured data** - free text field on form; `Backgrounds` collection is ready but not wired to UI.
- **Death save tracker** - `deathSaves: { successes, failures }` in model, no UI.
- **Conditions tracker** - `Conditions` collection ready, model has `conditions[]`, no UI.
- **Hit dice tracker** - `hitDiceRemaining` in model, no UI.
- **Inventory management** - `inventory[]` in model, no UI.
- **Background applying to derivation** - even if you pass a background, its skill/language/tool grants are not fed into `buildCharacterDocument` yet.
- **`/characters/new` route** - creation embedded on list page.
- **Level progression past L5** - static fallback only; requires full 5etools seed.
- **`equpiment/items.js` stub** - unrouted dead file; folder name has typo.

---

## 13. Planned Component Extraction (`playersCharacter.js`)

Split into sub-components - behavior-preserving extraction only, no behavior changes during the split.

| Component | Owns |
|---|---|
| `CharacterHeader` | Name, subtitle, back link, mode toggle buttons |
| `AbilityScores` | 6-score grid |
| `CombatStats` | AC, HP, initiative, speed, passive perception, proficiency, spell stats |
| `SkillsAndSaves` | Saving throws + 18-skill list |
| `AttacksPanel` | Equipped weapon attacks with proficiency and damage |
| `SpellPanel` | Cantrips, known, prepared, spell slots |
| `FeaturesPanel` | Features, proficiency lists (languages, weapons, armor, skills) |
| `EquipmentPanel` | Armor, shield, weapon display |
| `EditCharacterForm` | Full edit mode form |
| `LevelUpStudio` | Level adjuster + spell picker |

---

## 14. Milestones

### Milestone 0: Stabilize Data Pipeline

**Goal:** Full rules data in MongoDB before any frontend feature depends on it.

- [ ] Run `npm run seed` from `dndAPI/` with `FIVETOOLS_DATA_DIR` pointing at 5etools source
- [ ] Verify `/compendium/bootstrap` returns non-empty `backgrounds`, `feats`, `conditions`
- [ ] Confirm all 13 backend tests still pass after seeding

**Do not start Milestone 1+ frontend work that depends on Backgrounds, Feats, or Conditions until this is confirmed.**

### Milestone 1: Split Character Detail UI

**Goal:** Reduce regression risk before adding more behavior.

Rules: preserve behavior exactly, keep props explicit, keep state ownership in the page component until extraction proves stable, write or adjust tests around each extracted surface before calling it done.

- [ ] Extract each of the 10 components listed above one at a time
- [ ] Run `npm test` (frontend) after each extraction - it must stay green
- [ ] No behavior changes during this milestone

### Milestone 2: Move Character Creation to `/characters/new`

**Goal:** Decouple roster browsing from character creation.

- [ ] Create `src/pages/characters/CharacterNew.js` with the create form
- [ ] Add `/characters/new` to `Routes.js` (protected)
- [ ] Strip create form out of `CharactersList`
- [ ] Verify existing create flow still redirects to `?mode=levelUp`
- [ ] Write route test for `/characters/new` protected access and successful creation
- [ ] Run full test suite green before closing

### Milestone 3: Make Core Rules Promise Visible

**Highest-priority features.**

- [ ] Skill proficiency selection using `class.skillChoiceRules` - create form and edit form
- [ ] Background selection from structured `Backgrounds` compendium data (replaces free text)
- [ ] Wire background skill/language grants into `buildCharacterDocument`
- [ ] Weapon proficiency indicator in equipment picker (mark proficient vs not)
- [ ] HP quick controls (+/-) in view mode

Each item: write a failing test first, implement until green, confirm no existing tests broken.

### Milestone 4: Character Creation Wizard

Wizard steps: Name → Race → Class/Subclass → Background/Alignment → Ability Scores → Skills → Equipment/Spells → Review.

- [ ] Move creation to `/characters/new` (Milestone 2 prerequisite)
- [ ] Use searchable/filterable controls for spells, feats, backgrounds, subclasses - raw `<select>` with 900+ options is not acceptable
- [ ] Proficiency summary panel showing what race/class/background contributed

### Milestone 5: Session-Ready Sheet Tools

Priority order (highest table friction first):

- [ ] HP quick controls (also in Milestone 3 - do once)
- [ ] Conditions tracker (collection ready, needs UI)
- [ ] Spell slot expend/refresh buttons
- [ ] Death save tracker (model ready)
- [ ] Hit dice tracker
- [ ] Inventory item add/remove

All session tools must be usable without opening full edit mode.

### Milestone 6: Breadth and Homebrew

- [ ] Confirm class progression to L20 from seeded data
- [ ] Validate spell availability and preparation rules by class
- [ ] Feat selection at ASI levels (validate prerequisites at API boundary)
- [ ] Language/tool choices from background and class
- [ ] Custom/homebrew data model alongside compendium ids

---

## 15. Development Standards

### Red/Green TDD - Required

Every feature and bug fix follows this cycle. No exceptions.

1. **Write a failing test first (Red).** The test should describe the expected behavior in plain terms. Run the suite and confirm it fails for the right reason - not due to a syntax error or wrong import, but because the behavior isn't there yet.
2. **Write the minimum code to make it pass (Green).** Do not add more than what the test requires. Resist the urge to build adjacent features.
3. **Refactor.** Clean up while tests are green. Extract, rename, simplify. Do not change behavior.
4. **Run the full suite.** Confirm no regressions before committing.

**What to test by change type:**

| Change type | Test location | Verification command |
|---|---|---|
| API route or derivation change | `dndAPI/test/api.test.js` | `npm test` in `dndAPI/` |
| New compendium collection or seed change | Backend test + manual `/compendium/bootstrap` check | `npm test` + manual |
| New React component | New test file alongside component | `npm test` in `dndclient/` |
| Route addition | `Routes.test.js` | `npm test` in `dndclient/` |
| Auth behavior | `auth.test.js` | `npm test` in `dndclient/` |
| Major UI change | Tests + manual browser check | Both |
| Frontend production build | - | `npm run build` in `dndclient/` |

**Hard rules:**
- Never mark a task complete with failing tests.
- Never start new feature work on a red baseline - fix the suite first.
- Test for the behavior, not the implementation. Test what the function returns, not how it does it internally.
- Backend tests use `mongodb-memory-server` - they do not need Atlas running.
- Frontend tests use `jsdom` - they do not need the API running.

### General Code Standards

- Preserve the current stack. Do not introduce new dependencies without stating what they do and why they're needed.
- Keep backend derivation as the source of truth for all D&D math. The frontend submits selections and renders results; it does not re-implement rules.
- Make the smallest correct change. Solve the problem in front of you.
- Single file when possible; split only when a file exceeds ~300 lines or separation is clearly necessary.
- All async calls wrapped in try/catch with visible error handling.
- Treat uncommitted work in either repo as someone else's work unless explicitly told otherwise.
- No placeholder TODO blocks without a comment explaining what goes there and why it was deferred.
- New components use Tailwind utility classes. Do not refactor existing CSS unless you're already editing that file for another reason.

---

## 16. Environment Setup

### Prerequisites
- Node.js (see `.nvmrc` in both `dndAPI/` and `dndclient/`)
- Access to MongoDB Atlas (connection string in `dndAPI/.env`)
- Optional but needed for full data: 5etools source at `F:\Obsidian Valut\CLI\bin\5etools-src\data\`

### API Setup (`dndAPI/`)
```bash
cd dndAPI
npm install
# Confirm .env is populated (see keys below)
npm run seed       # wipes and reloads compendium from 5etools or static fallback
npm test           # must be 13/13 green before coding
npm run dev        # nodemon on port 5000
```

**Required `.env` keys:**
```
ATLAS_CONNECTION=mongodb+srv://...@dndapi.p7im0tj.mongodb.net/
DB_NAME=DragonsData
ACCESS_SECRET_TOKEN=<jwt secret - ask Kayden>
PORT=5000
FIVETOOLS_DATA_DIR=F:/Obsidian Valut/CLI/bin/5etools-src/data
```

### Client Setup (`dndclient/`)
```bash
cd dndclient
npm install
npm test           # must be 11/11 green before coding
npm run dev        # Vite on port 5173
```

**Required `.env`:**
```
VITE_API_BASE_URL=http://localhost:5000
```

### Start Both (Windows)
```powershell
.\start-dev.ps1    # checks paths, opens two windows, waits for ports, opens browser
```

---

## 17. Technical Risks

| Risk | Severity | Mitigation |
|---|---|---|
| `playersCharacter.js` at 915 lines | High | Extract components (Milestone 1) before adding features. Red/Green each extraction. |
| Seed not run against Atlas | High | Milestone 0. Blocker for any UI depending on Backgrounds/Feats/Conditions. |
| Background rules not in derivation | Medium | Wire grants into `buildCharacterDocument` in Milestone 3 alongside background UI. |
| Character creation embedded in list page | Medium | Milestone 2. Blocks wizard and clean routing. |
| CORS wildcard (`cors()` with no origin) | Medium | Lock `origin` before any production deployment. |
| Level progression caps at L5 (static fallback) | Medium | Full data from 5etools seed. Milestone 0. |
| JWT in `localStorage` | Medium | Acceptable for local/dev. Revisit before public launch. |
| Feat prerequisites display-only, not enforced | Low-Medium | Add API validation when feat selection UI is built in Milestone 6. |
| React Router v7 deprecation warnings in tests | Low | Non-failing warnings in stderr. Address before a major Router version bump. |
| `equpiment` folder typo | Low | Rename to `equipment` during Milestone 1 cleanup. |
| No pagination on character list | Low | Irrelevant at personal-use scale. Note for future. |

---

## 18. Legal and Licensing

The app imports rules content from a local 5etools-compatible data source. This is fine for personal local use. Before any public deployment:

- Confirm the exact content source and applicable license.
- Determine whether the SRD-only content path covers the app's needs.
- Separate any non-publicly-licensed content from what ships in a production build.
- The 5etools import pipeline should remain a local-only seed step; the deployed app should not serve raw 5etools data directly.

---

## 19. Key Design Decisions

**Why re-derive on every read/write?**
The character sheet is a pure function of inputs + compendium data. Storing derived stats would require cache invalidation on every compendium update. Deriving fresh on every API call is cheap (~1ms) and keeps the DB clean.

**Why MongoDB instead of SQL?**
The character document is deeply nested and varies by class/race combination. Document storage avoids a painful multi-table join for every character fetch and maps naturally to the sheet's shape.

**Why JWT and not sessions?**
Stateless auth keeps the API horizontally scalable and avoids session store management. Single-user-per-account scope makes token invalidation concerns minimal at current scale.

**Why Vite instead of CRA?**
CRA is deprecated. Vite is faster, actively maintained, and requires no ejecting. The switch preserved all React component structure.

**Why keep derivation server-side?**
D&D math has interdependencies (racial bonuses feed ability mods, which feed attack bonuses, which feed damage strings). Keeping it in one place ensures consistency and lets the frontend stay dumb about rules. Never duplicate D&D math in the client.

---

## 20. Git State

```
dndclient:  master (clean)
dndAPI:     Game_Plan_CC branch (active development)
```

Recent commits on `dndAPI` `Game_Plan_CC` branch:
- `b766890` phase-6B: expand classes to 12, races to 15, features to 245, subclasses to 12
- `3204ed2` Game_Plan_CC: add skill modifier breakdowns
- `7b9b86b` Game_Plan_CC: phase 6C/8 polish - tools row, HP bar, temp HP, subclass gating

Uncommitted on `dndAPI` (staged for next commit):
- `seeds/spells.json` — expanded from 12 to 91 spells
- `seeds/classes.json` — added `restRecovery` field to all caster classes
- `services/characterDerivation.js` — threads `restRecovery` into derived output
- `test/api.test.js` — 8 new tests for class/race/spell coverage and Warlock pact slots

Other notable remote branches: `codex/revive-compendium-closeout`, several Dependabot security PRs (unmerged).

The workspace root (`E:\GPTCode\DnDWebApp`) is not a Git repository.

---

## 21. Parallel Initiative: DM Workbook

`DM Workbook/` is a completely separate DM session management tool for the Azlemzyk campaign. It is in planning phase only - the folder contains handoff notes, no app code. It does not share code, routes, components, or database collections with the player-facing app. Do not mix them.

---

## 22. Day-One Checklist

1. Read this file completely.
2. Read `GAME_PLAN.md` for phased planning history and immediate next tasks.
3. Read `dndAPI/services/characterDerivation.js` before touching any character code.
4. Check git branches: `cd dndAPI && git branch` and `cd dndclient && git branch`.
5. Confirm `.env` files exist in both `dndAPI/` and `dndclient/`. Ask Kayden for `ATLAS_CONNECTION` and `ACCESS_SECRET_TOKEN` if missing.
6. `cd dndAPI && npm install && npm test` - must be 13/13 green.
7. `cd dndclient && npm install && npm test` - must be 11/11 green.
8. `cd dndAPI && npm run seed` - verify output shows all collections including Backgrounds, Feats, Conditions.
9. Start both servers (`start-dev.ps1`) and confirm the app loads at `http://localhost:5173`.
10. Create a test character (Fighter, Human, STR 16, equip a Longsword) and confirm the attack card shows `+5 to hit`, `1d8 + 3 slashing`, proficient.
11. Do not start a rewrite. Start with the highest-priority unfinished milestone.
