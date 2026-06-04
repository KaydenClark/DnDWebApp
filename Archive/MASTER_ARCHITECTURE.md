# DnD Web App - Master Architecture Reference

**Last reviewed: 2026-05-24 | Reviewer: Senior Dev (full audit)**

This is the single source of truth for the DnD Web App project. New developer, new chat session, or returning after months away - start here.

---

## 1. What This App Is

An online, rules-accurate D&D 5e character workbook for players. The core promise:

> "Tell me exactly how much damage my sword does per swing based on my stats. Tell me what I'm proficient with based on what I selected during character creation."

It is not a digital rulebook. It is not a game engine. It is a living character sheet that knows the rules and auto-derives every calculated stat from your choices. When you select Fighter + Longsword + STR 16, the app tells you: attack bonus `+5`, damage `1d8 + 3 slashing`, proficient. No manual math.

---

## 2. Stack

| Layer | Technology | Notes |
|---|---|---|
| Frontend | React 18 via Vite | `dndclient/` - CRA replaced with Vite |
| API | Node.js / Express 4 | `dndAPI/` - REST, no GraphQL |
| Database | MongoDB Atlas | Cluster `dndapi.p7im0tj.mongodb.net`, DB `DragonsData` |
| Auth | JWT (jsonwebtoken + bcryptjs) | Bearer tokens, no sessions |
| Styling | Raw CSS (no Tailwind yet) | CSS files in `dndclient/src/styles/` and `App.css` |
| HTTP client | Axios | Calls API at `http://localhost:5000` by default |
| Testing (API) | Node built-in test runner + supertest + mongodb-memory-server | |
| Testing (client) | Vitest + Testing Library | |
| Dev tooling | Nodemon (API), Vite HMR (client) | `start-dev.bat` / `start-dev.ps1` at root |

**Ports:**
- API: `5000`
- Frontend: `5173` (Vite default)

---

## 3. Directory Map

```
DnDWebApp/
├── MASTER_ARCHITECTURE.md      ← you are here
├── GAME_PLAN.md                ← phased roadmap + immediate next tasks
├── start-dev.bat / .ps1        ← starts both servers in sequence
├── dndAPI/                     ← Express backend
│   ├── main.js                 ← entry point, calls createApp(), starts server on PORT
│   ├── app.js                  ← factory fn, wires cors/json/routes/error handler
│   ├── routes/
│   │   ├── index.js            ← root router: /signIn, /signUp, /compendium, /player
│   │   ├── users/
│   │   │   ├── signIn.js       ← POST /signIn → JWT token
│   │   │   └── signUp.js       ← POST /signUp → creates user
│   │   ├── compendium.js       ← GET /compendium/bootstrap → slim compendium for UI dropdowns
│   │   └── character/
│   │       └── character.js    ← CRUD under /player (auth required)
│   ├── DataAccess/
│   │   ├── compendium.js       ← DB reads for all compendium collections
│   │   ├── characters.js       ← character CRUD, calls derivation on every read/write
│   │   └── users.js            ← user lookup/create
│   ├── services/
│   │   └── characterDerivation.js  ← THE ENGINE - derives all stats from raw inputs
│   ├── defaults/
│   │   └── characterSheet.js   ← empty character shape; used as merge base on create/update
│   ├── middleware/
│   │   ├── authenticate.js     ← JWT verify middleware
│   │   └── asyncHandler.js     ← wraps async route handlers, forwards errors
│   ├── db/
│   │   └── mongo.js            ← singleton MongoClient, ensureIndexes()
│   ├── seeds/
│   │   ├── import5etools.js    ← reads 5etools JSON source, transforms to app schema
│   │   ├── loadSeedData.js     ← orchestrates seed: 5etools first, JSON fallbacks second
│   │   ├── armor.json          ← fallback static armor data
│   │   ├── classes.json        ← fallback: Fighter, Wizard, Cleric, Rogue (to L5 only)
│   │   ├── features.json       ← fallback static features
│   │   ├── races.json          ← fallback: Human, High Elf, Hill Dwarf, Lightfoot Halfling
│   │   ├── spells.json         ← fallback static spells
│   │   ├── subclasses.json     ← fallback static subclasses
│   │   ├── weapons.json        ← fallback static weapons
│   │   └── users.json          ← seed test user accounts
│   ├── scripts/
│   │   └── seed.js             ← run with: npm run seed  (wipes and reloads all compendium)
│   └── test/
│       └── api.test.js         ← integration tests against in-memory MongoDB
│
└── dndclient/                  ← React/Vite frontend
    ├── src/
    │   ├── App.js              ← root component, renders NavBar + AppRoutes
    │   ├── index.js            ← ReactDOM.createRoot
    │   ├── lib/
    │   │   └── api.js          ← all Axios API calls (7 functions)
    │   ├── context/
    │   │   └── auth.js         ← AuthContext: token, isAuthenticated, signIn/Out
    │   ├── components/
    │   │   ├── const.js        ← base API URL constant
    │   │   ├── navigation/
    │   │   │   ├── Links.js    ← NavBar link component
    │   │   │   └── Routes.js   ← react-router route definitions
    │   │   └── characters/
    │   │       └── characterSheet.js  ← summary card used in the list view
    │   └── pages/
    │       ├── home/home.js            ← landing page
    │       ├── users/
    │       │   ├── SignIn.js           ← sign in form
    │       │   └── SignUp.js           ← sign up form
    │       ├── equpiment/items.js      ← stub (typo in folder name: "equpiment")
    │       └── characters/
    │           ├── charactersList.js   ← character list + inline CREATE FORM (needs split)
    │           └── playersCharacter.js ← full character sheet view/edit/level-up (915 lines, needs split)
    └── styles/
        ├── NavBar.css
        └── sign.css
```

---

## 4. API Reference

All routes are prefixed from `http://localhost:5000`.

### Auth Routes (no token required)

| Method | Path | Body | Returns |
|---|---|---|---|
| POST | `/signUp` | `{ email, userName, password }` | `{ user }` |
| POST | `/signIn` | `{ email, password }` | `{ token, user }` |

### Compendium Routes (no token required)

| Method | Path | Returns |
|---|---|---|
| GET | `/compendium/bootstrap` | Slim compendium for dropdowns: races, classes, subclasses, weapons, armor, spells, backgrounds, feats, conditions |

### Character Routes (JWT Bearer token required)

All under `/player`, scoped to the authenticated user's email.

| Method | Path | Body | Returns |
|---|---|---|---|
| GET | `/player` | - | `{ characters: [summary...] }` |
| POST | `/player` | `{ characterName, raceId, classId, level, baseAbilityScores, ... }` | `{ character }` (full derived) |
| GET | `/player/:characterId` | - | `{ character }` (full derived) |
| PUT | `/player/:characterId` | any character fields (partial) | `{ character }` (full derived) |

**Key behavior:** Every read and write runs the character through `characterDerivation.buildCharacterDocument()`. The database stores raw inputs. Derived stats are never persisted - they are computed fresh on every response.

### Utility

| Method | Path | Returns |
|---|---|---|
| GET | `/` | `{ status: 'ok' }` - DB ping health check |

---

## 5. The Derivation Engine

`dndAPI/services/characterDerivation.js` is the most important file in the project. Read it before touching anything character-related.

**What it computes (in order):**

1. Race + class lookups from compendium Maps
2. Ability scores = `baseAbilityScores` + racial `abilityBonuses`
3. Ability modifiers = `floor((score - 10) / 2)` for each stat
4. Proficiency bonus = `2 + floor((level - 1) / 4)`
5. Saving throws = modifier + proficiency bonus if proficient
6. Skills (18 skills) = relevant ability modifier + proficiency bonus if proficient
7. HP = class hit die + CON mod (L1) + average per level (L2+), with Dwarven Toughness support
8. AC = base 10 + DEX, or armor's formula (with DEX cap), + shield bonus
9. Initiative = DEX modifier
10. Passive Perception = 10 + WIS mod + proficiency if Perception trained
11. Attacks = for each `equippedWeaponId`: attack bonus (ability mod + proficiency if proficient), damage string, proficiency flag
12. Spell slots = from class `spellSlotsByLevel[level]` table
13. Spell save DC = 8 + proficiency + spellcasting ability mod
14. Spell attack bonus = proficiency + spellcasting ability mod
15. Available spells = filtered by class and max castable spell level
16. Features = union of race features + class level progression + subclass level features
17. Languages = race languages + character.languages (deduplicated)
18. Weapon/armor proficiencies = union of race + class + character overrides

**Rules for weapon attack ability:**
- Ranged weapons → DEX
- Finesse weapons → highest of STR or DEX
- All others → STR

**Input shape** (what you send to `buildCharacterDocument`):

```js
{
  raceId, classId, subclassId,           // resolved against compendium Maps
  level,                                  // 1-20
  baseAbilityScores: { str, dex, con, int, wis, cha },
  skillProficiencies: ['perception', ...],
  equippedWeaponIds: ['longsword', ...],
  armorId, shieldId,
  cantripIds, knownSpellIds, preparedSpellIds,
  spellSlots: { level_1: { slotsExpended }, ... },
  conditions, deathSaves, currency,
  // ... personality fields
}
```

---

## 6. MongoDB Collections

Database: `DragonsData` on Atlas cluster `dndapi.p7im0tj.mongodb.net`

| Collection | Purpose | Key fields |
|---|---|---|
| `Users` | Auth accounts | `email` (unique), `userName` (unique), `passwordHash` |
| `Character` | Player characters | `email` (owner), `characterName` (unique per email), all raw inputs |
| `Races` | Race compendium | `id`, `name`, `abilityBonuses`, `weaponProficiencies`, `featureIds`, `speed`, `languages` |
| `Classes` | Class compendium | `id`, `name`, `hitDie`, `savingThrowProficiencies`, `armorProficiencies`, `weaponProficiencies`, `skillChoiceRules`, `spellcasting`, `levelProgression` |
| `Subclasses` | Subclass compendium | `id`, `classId`, `name`, `levelFeatures` |
| `Spells` | Spell compendium | `id`, `name`, `level`, `classes[]`, `damage`, `scaling`, `school`, `range`, `duration`, `components` |
| `Weapons` | Weapon compendium | `id`, `name`, `category`, `weaponType`, `damageDice`, `damageType`, `finesse`, `range`, `properties` |
| `Armor` | Armor/shield compendium | `id`, `name`, `category`, `baseAc`, `dexCap` |
| `Features` | Class/race features | `id`, `name`, `description` |
| `Backgrounds` | Background options | `id`, `name`, `source`, `skillProficiencies`, `languages`, `toolProficiencies` |
| `Feats` | Feat options | `id`, `name`, `source`, `prerequisite`, `abilityBonus` |
| `Conditions` | Status conditions | `id`, `name`, `description` |

**Indexes:**
- `Users.email` unique
- `Users.userName` unique
- `Character.email` lookup
- `Character.email + characterName` unique
- All compendium collections: `id` unique

---

## 7. Data Pipeline (Seeding)

```
npm run seed    (from dndAPI/)
```

**Flow:**
1. `scripts/seed.js` calls `loadSeedData.js`
2. `loadSeedData.js` tries `import5etools.js` first (reads from `FIVETOOLS_DATA_DIR`)
3. If 5etools data unavailable, falls back to static JSON files in `seeds/`
4. Wipes and reloads all 10 compendium collections
5. Seeds test users from `seeds/users.json`
6. Does NOT wipe `Character` collection

**5etools source path** (set in `.env`):
```
FIVETOOLS_DATA_DIR=F:/Obsidian Valut/CLI/bin/5etools-src/data
```

**Expected scale when running from full 5etools source (dry-run verified 2026-05-24):**

| Collection | Count |
|---|---|
| Races | 211 |
| Classes | 16 |
| Subclasses | 262 |
| Spells | 937 |
| Weapons | 52 |
| Armor | 14 |
| Features | 2,967 |
| Backgrounds | 126 |
| Feats | 226 |
| Conditions | 15 |
| **Total** | **4,826** |

**Static seed fallbacks (when 5etools unavailable):**

| Collection | Count |
|---|---|
| Races | 4 (Human, High Elf, Hill Dwarf, Lightfoot Halfling) |
| Classes | 4 (Fighter, Wizard, Cleric, Rogue) - **level progression only to L5** |
| Subclasses | ~4 |
| Spells | partial |
| Weapons | partial |
| Armor | partial |
| Backgrounds | 0 (stub fallback returns empty array) |
| Feats | 0 (stub fallback returns empty array) |
| Conditions | 0 (stub fallback returns empty array) |

> **Critical:** The seed has NOT been run against Atlas since the 2026-05-24 session. Backgrounds, Feats, and Conditions code is written and verified in dry-run, but the Atlas database does not yet contain those collections. Run `npm run seed` from your machine to activate.

---

## 8. Frontend Routes

```
/              → Home.js (public)
/signIn        → SignIn.js (public)
/signUp        → SignUp.js (public)
/characters    → CharactersList.js (protected) - list + inline create form
/characters/:id → PlayersCharacter.js (protected) - full character sheet
```

**Missing route:** `/characters/new` does not exist. Character creation is embedded inside `CharactersList`. This is a known structural problem - see Phase 0.

---

## 9. Frontend State Architecture

### Auth (`context/auth.js`)
Persists token in `localStorage`. Exposes `{ token, isAuthenticated, signIn, signOut }` via Context.

### Character Sheet (`playersCharacter.js`)
Three distinct UI modes driven by a `mode` state variable:

| Mode | What it shows |
|---|---|
| `'view'` | Read-only character sheet - all derived stats |
| `'edit'` | Edit form: name, race, class, stats, equipment, personality |
| `'levelUp'` | Level-Up Studio: adjust level, pick spells, save to re-derive |

**Key state:**
- `character` - the last derived character from the API
- `editForm` - controlled form state for edit mode (synced from `character` on open)
- `planner` - spell/level selections for level-up mode
- `compendium` - bootstrap data loaded on mount (races, classes, weapons, armor, spells)

### Character Creation (`charactersList.js`)
Simple controlled form inline on the list page. After successful create, navigates to `?mode=levelUp` so the player immediately selects spells.

---

## 10. Current Feature Status

### Working
- User sign up / sign in with JWT
- Create character (name, race, class, subclass, level, ability scores, background text, alignment)
- Full character sheet view (ability scores, modifiers, HP, AC, initiative, speed, proficiency bonus, passive perception, saving throws, all 18 skills, attacks with damage strings, spell slots, cantrips, prepared/known spells, features, proficiency lists, currency, personality fields)
- Edit character (all above fields)
- Level-Up Studio (adjust level, spell selection, saves and re-derives)
- Spell slot display (total vs expended)
- Weapon proficiency computed and displayed (proficient/not proficient label on attack card)
- Racial ability score bonuses applied automatically
- Dwarven Toughness HP bonus
- Spell save DC and spell attack bonus computed per class
- Finesse weapon ability selection (best of STR/DEX)

### Missing / Broken
- **Skill proficiency selection** - derivation engine fully supports it, but the create and edit forms have no UI for it. Players cannot choose their 2-4 class skills. This is the highest-value missing feature.
- **Weapon proficiency filtering in UI** - the attack card shows "proficient/not proficient" but the weapon picker in edit mode shows ALL weapons with no visual indicator. Players can accidentally equip weapons they can't use.
- **HP quick controls** - no +/- buttons on view mode. Must enter edit mode to change current HP. Major table friction.
- **Spell slot expend/refresh** - slots display remaining but there are no buttons to mark them used or refresh them.
- **Background as structured data** - background is a free-text field. The `Backgrounds` collection (126 entries) is ready on the backend but not wired to the UI.
- **Death save tracker** - model has `deathSaves: { successes, failures }` but no UI to interact with it.
- **Conditions tracker** - `Conditions` collection (15 entries) exists but no UI.
- **Hit dice tracker** - model has `hitDiceRemaining` but no UI.
- **Inventory management** - model has `inventory[]` but no UI.
- **Class skill choice rules** - `classes.json` has `skillChoiceRules.options` and `skillChoiceRules.choose` but this data is not used in the UI.
- **No `/characters/new` route** - character creation is embedded on the list page, making the URL non-shareable.
- **Level progression only to L5** - static JSON fallback classes only have `levelProgression` through level 5. Full 5etools data goes to 20, but only if seeded from the 5etools source.
- **`playersCharacter.js` is 915 lines** - one monolithic component. Adding features here is risky.
- **CORS wildcard** - `app.use(cors())` with no origin restriction. Fine for local dev, must fix before production deployment.
- **Stub equipment page** - `src/pages/equpiment/items.js` exists but is not routed anywhere.
- **Typo in folder name** - `equpiment` (missing `i`). Minor but should be cleaned up.

---

## 11. Planned Component Extraction (`playersCharacter.js`)

Target components after split (behavior-preserving extraction first):

| Component | Responsibility |
|---|---|
| `CharacterHeader` | Name, subtitle, back link, mode toggle buttons |
| `AbilityScores` | 6-score grid display |
| `CombatStats` | AC, HP, initiative, speed, passive perception, proficiency, spell stats |
| `SkillsAndSaves` | Saving throws + 18-skill list |
| `AttacksPanel` | Equipped weapon attacks with proficiency and damage |
| `SpellPanel` | Cantrips, known, prepared, spell slots |
| `FeaturesPanel` | Features, proficiencies (languages, weapons, armor, skills) |
| `EditCharacterForm` | Full edit mode form |
| `LevelUpStudio` | Level adjustment + spell selection |

---

## 12. Phased Roadmap

### Phase -1: Lock Backend Data Pipeline [ACTIVE]
Status: Code written. **Seed not yet run against Atlas.**
- [ ] Run `npm run seed` from `dndAPI/` on the dev machine
- [ ] Verify `/compendium/bootstrap` response includes `backgrounds`, `feats`, `conditions` arrays
- [ ] Verify existing API tests pass: `npm test` from `dndAPI/`

### Phase 0: Structural Cleanup
- [ ] Split `playersCharacter.js` into sub-components (behavior-preserving only)
- [ ] Move character creation to `/characters/new` route
- [ ] Clean up stub/dead files (`equpiment/items.js`, remove stale CRA artifacts)
- [ ] Fix CORS before any deployment work

### Phase 1: Core Promise Delivery (highest value)
- [ ] Skill proficiency selection UI - use `class.skillChoiceRules` from bootstrap
- [ ] Weapon proficiency indicator in equipment picker
- [ ] HP quick controls (+/-) in view mode
- [ ] Level progression to L20 (depends on 5etools seed)

### Phase 2: Character Creation Wizard
- [ ] Multi-step flow: Name → Race → Class → Background → Abilities → Skills → Review
- [ ] Background selection using `Backgrounds` collection (not free text)
- [ ] Proficiency summary panel
- [ ] Move creation to `/characters/new`
- [ ] Searchable/filterable controls for large option lists (spells, feats, backgrounds)

### Phase 3: Session-Ready Tools
- [ ] Death save tracker (model ready, needs UI)
- [ ] Conditions tracker (collection ready, needs UI)
- [ ] Spell slot expend/refresh buttons
- [ ] Hit dice tracker
- [ ] Inventory management UI

### Phase 4: Breadth Expansion
- [ ] Remaining SRD classes (Barbarian, Bard, Druid, Monk, Paladin, Ranger, Sorcerer, Warlock)
- [ ] Remaining races (Dragonborn, Gnome, Half-Elf, Half-Orc, Tiefling)
- [ ] Full spell list through L9
- [ ] Feat selection at ASI levels
- [ ] Tool proficiency and language selection

---

## 13. Environment Setup

### Prerequisites
- Node.js (see `.nvmrc` in both `dndAPI/` and `dndclient/`)
- Access to MongoDB Atlas cluster (connection string in `.env`)
- Optional: 5etools data source at `F:\Obsidian Valut\CLI\bin\5etools-src\data\` for full compendium

### API Setup (`dndAPI/`)
```bash
cd dndAPI
npm install
# .env already exists - verify ATLAS_CONNECTION and FIVETOOLS_DATA_DIR
npm run seed     # load compendium data into Atlas
npm run dev      # starts on port 5000 with nodemon
```

Required `.env` keys:
```
ATLAS_CONNECTION=mongodb+srv://...@dndapi.p7im0tj.mongodb.net/
DB_NAME=DragonsData
ACCESS_SECRET_TOKEN=<jwt secret>
FIVETOOLS_DATA_DIR=F:/Obsidian Valut/CLI/bin/5etools-src/data
```

### Client Setup (`dndclient/`)
```bash
cd dndclient
npm install
npm run dev      # starts Vite on port 5173
```

Required `.env` (see `.env.example`):
```
VITE_API_BASE_URL=http://localhost:5000
```

### Start Both (Windows)
```
start-dev.ps1   # or start-dev.bat
```

---

## 14. Testing

### API Tests
```bash
cd dndAPI
npm test
```
Uses `mongodb-memory-server`. Tests cover auth routes and character CRUD. Run after any backend change.

### Client Tests
```bash
cd dndclient
npm test
```
Uses Vitest + Testing Library. Tests cover routes and auth context. Run after any component or route change.

---

## 15. Known Technical Debt

| Issue | Severity | Notes |
|---|---|---|
| `playersCharacter.js` at 915 lines | High | Adding features here introduces regression risk. Split before Phase 1. |
| Character creation embedded in list page | Medium | Prevents clean routing, bookmarking, and wizard flow |
| CORS wildcard `cors()` | Medium | Ship blocker for production. Add `origin` restriction. |
| Level progression caps at L5 (static fallback) | Medium | Full data available via 5etools seed |
| `equpiment` folder typo | Low | Rename to `equipment` during cleanup |
| No loading state on bootstrap | Low | If `/compendium/bootstrap` fails, dropdowns are silently empty |
| `background` and `alignment` are free text | Low | Backend collection exists, just not wired up yet |
| No pagination on character list | Low | Fine for personal use, note for future |
| Git repo on `codex/character-level-up-flow` branch | Medium | Not on `master`. Confirm which branch is canonical before continuing. |

---

## 16. Git State

Active branch: `codex/character-level-up-flow`

Recent commits:
```
202ff0b  add character update endpoint
90c128c  revive api and local compendium import
bb72e2f  added character by ID fix
070c330  added character by ID
6da1290  fixed get request
```

Other notable branches:
- `codex/revive-compendium-closeout` - compendium pipeline work
- `master` - older baseline
- Several Dependabot security PRs on remote (not merged)

---

## 17. Parallel Initiative: DM Workbook

The `DM Workbook/` folder at the repo root is a **completely separate app** being built alongside the player-facing character sheet. It is a DM session management tool for the Azlemzyk campaign (a personal D&D campaign world).

The DM Workbook has its own project instructions and feature roadmap. It does NOT share code, routes, or components with `dndclient`. Do not mix them.

**DM Workbook current state:** No app code exists yet. The folder contains only chat handoff notes. It is in planning/early design phase.

---

## 18. Day-One Checklist for a New Developer

1. Read this file completely.
2. Read `GAME_PLAN.md` - it has the immediate next tasks with priority order.
3. Read `dndAPI/services/characterDerivation.js` - understand the engine before touching character code.
4. Read `dndclient/src/pages/characters/playersCharacter.js` - understand what exists before splitting it.
5. Check current git branch: `git branch` - confirm you're on `codex/character-level-up-flow` or merge it to `master`.
6. Run `npm install` in both `dndAPI/` and `dndclient/`.
7. Verify `.env` files exist in both folders. Ask Kayden for `ATLAS_CONNECTION` if missing.
8. Run `npm run seed` from `dndAPI/` to load the full compendium into Atlas.
9. Start both servers (`start-dev.ps1`) and verify the app loads at `http://localhost:5173`.
10. Run tests in both repos: `npm test`.
11. Create a test character and confirm the attack damage string is correct before writing any code.

---

## 19. Key Design Decisions

**Why re-derive on every read?**
The character sheet is a pure function of inputs + compendium data. Storing derived stats would require invalidating them on every compendium update (rule change, errata, etc.). Deriving fresh on every API call is cheap and keeps the DB clean.

**Why MongoDB instead of SQL?**
The character document shape is deeply nested and varies by class/race combinations. Document storage avoids a painful multi-table join for every character fetch.

**Why JWT and not sessions?**
Stateless auth makes the API easier to scale later and avoids session store management. Token is stored in `localStorage` on the client.

**Why Vite instead of CRA?**
CRA is deprecated. Vite is faster, actively maintained, and has better DX. The switch was made without breaking the existing React component structure.

**Why no Tailwind yet?**
The app predates the decision to adopt Tailwind. The project instructions call for Tailwind as the preferred styling approach for new work. When splitting `playersCharacter.js` into components, new components should use Tailwind utility classes. Do not refactor existing CSS unless you're already touching that file for another reason.
