# DnDWebApp Character Creator - Game Plan

**Last reviewed: 2026-06-04 by Codex (phase audit/docs pass)**

> This document covers the DnDWebApp character creator only.
> For the DM Workbook, see `GAME_PLAN_DMW.md`.

## Purpose

Shared working plan for DnDWebApp between Kayden, Claude, and Codex. Keeps current project direction, task order, and reasoning in one document so future sessions can pick up without re-auditing the whole app.

Ownership labels:

- `[Claude]` Original plan or assessment from Claude.
- `[Codex]` Adjustment or recommendation from Codex review.
- `[Shared]` Direction both plans support.

## Current State

- `[Claude]` The stack is worth keeping: React/Vite frontend, Express API, MongoDB, JWT auth, and a strong character derivation engine.
- `[Claude]` `characterDerivation.js` correctly handles core D&D 5e math: ability modifiers, proficiency bonus, attacks, damage strings, AC, HP, spell DCs, spell attacks, skills, saving throws, and race bonuses.
- `[Claude]` Auth, ownership checks, compendium lookups, character CRUD, and the basic character sheet structure are already in place.
- `[Codex]` Backend importer/bootstrap work for Backgrounds, Feats, and Conditions exists. Local fallback seed data now includes Conditions; Feats stay deferred until ASI/feat selection is implemented.
- `[Codex]` The app must treat full 5etools-scale data as a UX problem. Huge raw dropdowns will not be acceptable for spells, feats, equipment, subclasses, or backgrounds.

### Verified State (2026-06-04 audit by Codex)

- `[Claude]` `playersCharacter.js` is 480 lines after Phase 0 component extraction. All target components exist under `components/`.
- `[Claude]` `/characters/new` route exists in `Routes.js` and renders `CharacterNew`.
- `[Claude]` `CharacterNew.js` implements the Phase 2 multi-step wizard (Name, Race, Class, Background and Alignment, Ability Scores, Skill Selection, Review).
- `[Claude]` Phase 1 features confirmed shipped: `SkillSelector` component with class rule enforcement, weapon proficiency markers in `EditCharacterForm`, HP quick controls in `CombatStats`, level 1-20 in `LevelUpStudio`.
- `[Codex]` Automated phase coverage is green: backend `npm test` passes 55 tests; frontend `npm test` passes 372 tests after the condition-tooltip coverage added in this pass.
- `[Codex]` `CharacterWizard.red.test.js` and `SessionReadyTools.red.test.js` are now green. The character sheet persists spell slot usage, active conditions, death saves, hit dice, and inventory from view mode.
- `[Codex]` Seeds include `backgrounds.json` and `conditions.json`; `feats` are still an explicit empty fallback until Phase VI feat rules are ready.
- `[Codex]` `/compendium/bootstrap` returns `backgrounds`, `feats`, and `conditions`; backend tests verify non-empty backgrounds and conditions.
- `[Codex]` Fallback seed data currently has 12 classes, 15 races, 91 spells, 245 features, 12 subclasses, 15 conditions, and backgrounds. Atlas seed counts from 2026-06-03 show the importer can load a much larger compendium when local 5etools data is present.
- `[Codex]` `dndAPI/.env.example` and `dndclient/.env.example` already exist; the backend example now documents `CORS_ORIGIN`.

## Phased Plan

### Phase 3: Data Pipeline And Seed Confidence [COMPLETE - 2026-05-28]

- `[Codex][DONE]` Added local fallback seed data for the 15 SRD conditions.
- `[Codex][DONE]` Updated the seed script to print collection counts after loading.
- `[Codex][DONE]` Enabled backend bootstrap coverage for seeded conditions.
- `[Codex][DONE]` Kept fallback `feats` empty by design until ASI/feat selection rules are implemented.
- `[Codex][DONE]` Updated the seed runbook to reflect current fallback behavior and verification expectations.

### Phase 0: Structural Cleanup [COMPLETE - 2026-05-25]

- `[Claude][DONE]` `playersCharacter.js` split into 9 extracted components: CharacterHeader, AbilityScores, CombatStats, SkillsAndSaves, AttacksPanel, SpellPanel, FeaturesPanel, EditCharacterForm, LevelUpStudio. File reduced from 915 to 480 lines.
- `[Claude][DONE]` `/characters/new` route added to `Routes.js`. `CharacterNew` component created.
- `[Claude][DONE]` `BackgroundField` component added for structured background selection with free-text fallback.
- `[Claude][DONE]` `SkillSelector` component added.
- `[Claude][DONE]` `EquipmentPanel` component added.

### Phase 1: Make The Core Promise Real [COMPLETE - 2026-05-25]

- `[Shared][DONE]` Skill proficiency selection added. `SkillSelector` driven by class `skillChoiceRules`. Available in both `CharacterNew` and `EditCharacterForm`. Background-granted skills lock their slots.
- `[Shared][DONE]` Weapon proficiency indicators added to `EditCharacterForm`. Each weapon shows "Proficient / Not proficient" based on `character.availableWeaponIds`.
- `[Shared][DONE]` HP quick controls added to `CombatStats`. Damage and Heal buttons with amount input. Persists without opening full edit mode.
- `[Claude][DONE]` Level progression 1-20 wired into `LevelUpStudio`. `+` and `-` buttons and direct input both clamp to 1-20.

### Phase 2: Character Creation Wizard [COMPLETE - 2026-05-27, post-feedback pass]

- `[Shared][DONE]` Flat creation form replaced with 7-step tabbed wizard: Name, Race, Class, Background and Alignment, Ability Scores, Skill Selection, Review.
- `[Claude][DONE]` Tab bar with `role="tab"` and `aria-selected` allows both linear Next/Back navigation and direct tab jumping without losing state.
- `[Claude][DONE]` Background auto-selects first compendium option on load so Review step always has data to show. Falls back to free-text when not seeded.
- `[Claude][DONE]` Review step shows full character summary and Proficiency Summary (background name + class skills + background-granted skills).
- `[Claude][DONE]` Wizard submits to `/characters/:id?mode=levelUp` so spell selection follows immediately after creation.
- `[Claude][DONE]` `CharacterWizard.red.test.js` is now green. `CharactersPages.test.js` updated for wizard navigation (7/7 passing).
- `[Codex]` Language/tool selection UI is still deferred. Background-derived languages and tools already derive on the backend; tool display remains a Phase 6C polish item.
- `[Codex]` Full feat selection deferred to Phase 6D (ASI rules not clean yet).

#### Phase 2 Post-Feedback Fixes (2026-05-27)

- `[Claude][DONE]` **Root cause of blank Class/Background/Skills**: DB not seeded. Run `npm run seed` from `dndAPI/`. Seed files exist (`classes.json`, `backgrounds.json`, `races.json`). No code change - operational step only.
- `[Claude][DONE]` **Subrace picker**: Added `raceGroup` field to `races.json`. Race step now shows base-race select first, then subrace select when the group has multiple variants. Single-variant groups hide the subrace picker.
- `[Claude][DONE]` **Alphabetical sort**: Race groups, subraces, and subclasses sorted alphabetically in wizard.
- `[Claude][DONE]` **Alignment dropdown**: Replaced free-text input with a `<select>` of all 9 standard alignments.
- `[Claude][DONE]` **Ability score methods**: Standard Array, Point Buy (27-point budget), and Roll (4d6 drop lowest) all implemented.
- `[Claude][DONE]` New tests added: subrace picker, alphabetical order, alignment dropdown, all three ability score methods.
- `[Claude][DONE]` New backend API tests: bootstrap returns non-empty races/classes/backgrounds; `raceGroup` field included in race projection.

### Phase 4: Session-Ready Tools [COMPLETE - 2026-05-28]

- `[Codex][DONE]` Spell slots can be expended and refreshed directly from the sheet.
- `[Codex][DONE]` Conditions can be toggled from the imported conditions compendium.
- `[Codex][DONE]` Death saves can be tracked without opening edit mode.
- `[Codex][DONE]` Hit dice can be spent/restored from the sheet.
- `[Codex][DONE]` Inventory items can be added with name and quantity.
- `[Codex][DONE]` `SessionReadyTools.red.test.js` is unskipped and green.
- `[Shared][DEFERRED]` Initiative tracker remains later work, probably session-scoped rather than persisted directly on the character.

### Phase 5: Character Creation And Roster Polish [COMPLETE - 2026-05-28]

- `[Codex][DONE]` Wizard Next navigation validates required identity choices: name, race, and class.
- `[Codex][DONE]` Added wizard state-preservation coverage for Back navigation and tab jumps.
- `[Codex][DONE]` Edit mode now uses the same structured alignment options as the wizard.
- `[Codex][DONE]` `SkillSelector` empty-state copy no longer tells users to re-seed when a class has no choices.
- `[Shared][DONE]` Character cards already show level, race, and class for scannable roster cards.

### Phase 6: Progression And Character Breadth [PARTIAL - 2026-05-28]

#### Phase 6A: Data Foundation [COMPLETE - 2026-06-03]

Decision made: hybrid approach. Classes and races hand-seeded for schema control. Spells hand-seeded for essential SRD coverage (91 spells). Full spell coverage via 5etools importer remains available if needed later.

- `[Claude][DONE - 2026-06-03]` Decided hybrid approach: hand-seed classes, races, and representative spells. 5etools importer available for future expansion.
- `[Claude][DONE - 2026-06-03]` `spells.json` expanded from 12 (levels 0-3, wizard/cleric only) to 91 spells covering all levels 0-9 for all caster classes: bard, cleric, druid, paladin, ranger, sorcerer, warlock, wizard.

#### Phase 6B: Breadth [COMPLETE - 2026-06-03]

- `[Claude][DONE - 2026-06-03]` Added 8 remaining classes: Barbarian, Bard, Druid, Monk, Paladin, Ranger, Sorcerer, Warlock. All have correct `hitDie`, `subclassLevel`, `savingThrowProficiencies`, `armorProficiencies`, `weaponProficiencies`, `skillChoiceRules`, and `levelProgression` through level 20.
- `[Claude][DONE - 2026-06-03]` Paladin and Ranger use half-caster `spellSlotsByLevel` tables (slots start at level 2). Warlock uses `kind: "pact"` with pact-slot table (slot level scales with character level). `characterDerivation.js` handles all three via `spellSlotsByLevel[String(level)] || {}` — no code change needed.
- `[Claude][DONE - 2026-06-03]` Added races: Dragonborn, Mountain Dwarf, Wood Elf, Drow, Forest Gnome, Rock Gnome, Goliath, Stout Halfling, Orc, Asmodeus Tiefling, Zariel Tiefling. All have `raceGroup`, `speed`, `abilityBonuses`, `featureIds`.
- `[Claude][DONE - 2026-06-03]` Added 8 subclasses (one per new class): Berserker, College of Lore, Circle of the Moon, Way of the Open Hand, Oath of Devotion, Hunter, Draconic Bloodline, The Fiend.
- `[Claude][DONE - 2026-06-03]` All `featureId` references verified — 0 missing. Committed as `phase-6B: expand classes to 12, races to 15, features to 245, subclasses to 12`.
- `[Claude][DONE - 2026-06-03]` Full spell list added: `spells.json` expanded to 91 spells, levels 0-9, all caster classes. LevelUpStudio name filter already handles full list (done 2026-05-28).
- `[Codex][DONE]` Level-Up Studio filters long spell lists by name.
- `[Shared][DONE - 2026-06-03]` Seed run against Atlas. 5etools importer active — actual counts: 165 races, 16 classes, 130 subclasses, 558 spells, 2967 features, 126 backgrounds, 178 feats, 15 conditions. All 53 backend tests green.

#### Phase 6C: Derivation Engine Gaps [COMPLETE - 2026-06-03]

Verified against source during 2026-05-28 audit.

- `[Codex][DONE]` Background skill proficiencies are merged in `characterDerivation.js` (line 449-450: `effectiveSkillProficiencies`). `backgroundSkillProficiencies` is returned in the derived object and displayed in `FeaturesPanel.js` (line 17).
- `[Codex][DONE]` Background tool proficiencies are merged in derivation (line 525: `toolProficiencies` combines character + background). Background languages are resolved via `resolveLanguages(race, background, character)` (line 526) and displayed in `FeaturesPanel.js` (line 14).
- `[Claude][DONE - 2026-05-28]` **Tool proficiency display** - Added "Tools" row to `FeaturesPanel` alongside Weapons/Armor rows. Shows "None" when empty. Frontend display tests added (3 tests).
- `[Claude][DONE - 2026-06-03]` **Warlock Pact Magic rest recovery** - Added `restRecovery` field to all caster classes in `classes.json` (`"short"` for Warlock, `"long"` for all others). Threaded through `characterDerivation.js` — derived characters now include `spellcasting.restRecovery` in their output. Frontend displays the correct rest type in `SpellPanel`. 8 backend tests and 3 frontend display tests cover the behavior.

#### Phase 6D: Feat And ASI System [DEFERRED - design required first]

Do not implement until the following are written down:

- Which levels trigger ASI vs. feat choice per class (Fighter and Rogue get extras).
- Prerequisite check system for feats.
- Ability score mutation model: does a feat's +1 STR go on `baseAbilityScores` and re-derive, or as a separate modifier?
- Tool proficiency and language selection UI (likely lives in the feat/background step).

- `[Codex][DEFERRED]` Feat selection remains blocked on ASI timing, prerequisites, and ability score mutation rules.

### Phase 7: Release Hardening [PARTIAL - 2026-05-28]

- `[Codex][DONE]` Backend CORS can now be restricted with `CORS_ORIGIN` while preserving local defaults.
- `[Codex][DONE]` Frontend and backend automated tests pass with no skipped roadmap tests.
- `[Codex][DONE]` Seed runbook documents current startup and seed-state expectations.
- `[Shared][TODO]` Manual browser verification: sign in, create character (all 3 ability score methods), open sheet, use all session trackers (spell slots, conditions, death saves, hit dice, inventory), level up. Verify a second user cannot see the first user's characters.
- `[Codex][DONE - 2026-05-28]` Added `CORS_ORIGIN=http://localhost:5173` to `dndAPI/.env.example`.
- `[Shared][TODO]` Set `CORS_ORIGIN` per environment. Confirm production env has a real value before any deployment.

### Phase 8: UX Polish [PARTIAL - 2026-05-28]

Backlog UX status for character-sheet polish. Not blockers for session play, but visible quality gaps should stay tracked here.

- `[Codex][DONE]` **Currency display on view screen** - `FeaturesPanel.js` (lines 33-36) already renders cp/sp/ep/gp/pp in read-only view mode. Not a TODO.
- `[Claude][DONE - 2026-05-28]` **Subclass early-gate** - Added `subclassLevel` field to `classes.json` (Fighter=3, Rogue=3, Wizard=2, Cleric=1). Wizard Class step now hides the subclass picker and shows a hint ("Subclass picks at level X. Raise starting level to unlock.") until `form.level >= class.subclassLevel`. Frontend gate tests added (4 tests). `subclassLevel` projected in `getBootstrapCompendium`.
- `[Claude][DONE - 2026-05-28]` **LevelUpStudio subclass notice** - Shows "Subclass unlocks at level X." card in the toolbar when `planner.level < subclassLevel`. `subclassLevel` derived from `compendium.classes` in `playersCharacter.js` and passed as a prop. Tests added (6 tests).
- `[Claude][DONE - 2026-05-28]` **HP bar visualization** - Added a `role="progressbar"` bar to the HP tile in `CombatStats`. Color classes: `hp-bar-ok` (≥50%), `hp-bar-low` (<50%), `hp-bar-critical` (<25%). CSS classes need wiring in the stylesheet. Tests added (6 tests).
- `[Claude][DONE - 2026-05-28]` **Temp HP display and quick controls** - Added Temp HP tile to stat grid (visible when `tempHp > 0`). Added Set control in HP tracker panel. `handleTempHpChange` added to `playersCharacter.js`; persists via `updateCharacter`. Tests added (7 tests).
- `[Claude][DONE - 2026-05-28]` **HP bar CSS** - Rules added to `App.css`. Bar renders with green/yellow/red thresholds.
- `[Codex][DONE - 2026-06-04]` **Expertise selection and display** - Added `expertiseProficiencies` to derived characters, create/edit payloads, wizard/edit UI, `FeaturesPanel`, and skill breakdowns. Expertise applies one extra proficiency bonus only to already-proficient skills and updates passive Perception when Perception has expertise.
- `[Codex][DONE - 2026-06-04]` **Proficiency breakdown tooltip** - Skill modifiers now expose a hover/screen-reader breakdown for ability modifier, class/background proficiency, expertise, and other bonuses. Tests cover class proficiency, background proficiency, expertise, and unproficient skills.
- `[Codex][DONE - 2026-06-04]` **Spell slot rest recovery display** - `SpellPanel` shows "Recovers on: short rest" for pact casters and "Recovers on: long rest" for standard casters. Tests cover short, long, and missing recovery data.
- `[Codex][DONE - 2026-06-04]` **Condition description tooltip coverage** - Preserved the compact condition list while exposing condition descriptions through an accessible tooltip trigger. Added a focused regression test for the condition toggle and tooltip metadata.

#### Phase 8 Tech Debt (opportunistic)

- `[Claude][TODO]` **`syncEditForm` ability score fallback** - The fallback chain `character?.baseAbilityScores?.str ?? character?.abilityScores?.str ?? 8` is a leftover from a schema migration. Once old character documents without `baseAbilityScores` are confirmed gone (run a DB query to verify), simplify the reads. Do not do this until the migration is confirmed complete.

## Codex Adjustments

- `[Codex]` Seed and verify backend data before frontend feature work depends on it.
- `[Codex]` Treat real compendium size as a UX concern, not just a data concern.
- `[Codex]` Prioritize skill proficiency selection above most other feature work.
- `[Codex]` Delay full feat selection until level-up, ASI timing, prerequisites, and ability score mutation are cleaner.
- `[Codex]` Use searchable/filterable controls instead of huge dropdowns.
- `[Codex]` Keep tests close to each step: backend seed/bootstrap tests for data work, frontend route/component tests for UI work.

## Immediate Next Tasks

1. `[Shared][DONE - 2026-06-03]` Seed run. Atlas counts verified. Backend suite now has 55 green tests.
2. `[Shared][DONE - 2026-06-04]` Run `npm test` in `dndclient/` to confirm frontend suite still green.
3. `[Shared][DONE - 2026-06-04]` Wire `spellcasting.restRecovery` in the frontend `SpellPanel` — show "Recovers on: short rest" vs "long rest" next to the spell slot display.
4. `[Shared][NEXT]` Manually verify browser flows: sign in, create a Warlock (verify pact slots show correct level and short-rest recovery), create a Paladin (verify no slots at L1, 2 at L2), open sheet, use session trackers, level up (Phase 7 TODO).
5. `[Shared][NEXT]` Write the feat/ASI design doc before starting Phase 6D.

## Backlog Notes

- `[Codex][DONE - 2026-06-04]` Expertise is now modeled as chosen skill ids in `expertiseProficiencies`. Future feat/ASI work remains deferred until ASI timing, feat prerequisites, ability-score mutation rules, and related language/tool choice UI are designed.
- `[Codex][DONE - 2026-06-04]` Added `SessionToolsPanel.test.js` for the new condition-description tooltip behavior. No additional unit test is needed for that change.
- `[Codex][PRIORITY - TEST]` Add browser/e2e coverage for the Phase 7 manual flow: sign in, create Warlock and Paladin characters, verify spell-slot recovery and half-caster slots, use session trackers, level up, and confirm cross-user character isolation.
- `[Codex][PRIORITY - TEST]` Clean up existing React `act(...)` warnings in `SessionReadyTools.red.test.js`; the tests pass, but the warnings reduce signal during future regressions.

## Verification Expectations

- `[Shared]` Run backend tests after backend pipeline or API changes.
- `[Shared]` Run frontend tests after route, component, or character sheet changes.
- `[Shared]` Keep skipped tests only for explicitly deferred future work.
- `[Codex]` For large UI changes, verify the rendered app manually or with browser automation before calling the work done.
- `[Codex]` Do not claim seeded data is live until the seed command has actually run successfully against the intended database.
