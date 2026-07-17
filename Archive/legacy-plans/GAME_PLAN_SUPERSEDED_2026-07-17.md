# DnDWebApp Game Plan - SUPERSEDED

> Archived during Workbench v2.3 adoption. Stable capability truth and open
> work now live in the root stable specs; this file remains historical evidence.

**Superseded: 2026-05-28**

This file has been split into two focused documents:

- `GAME_PLAN_CC.md` - Character Creator phases (Phases 0-8, all open items, backlog)
- `GAME_PLAN_DMW.md` - DM Workbook phases (Phases 1-3, stack, schema, seed data)

Do not update this file. Use the documents above.

---

## Purpose

This is the shared working plan for DnDWebApp between Kayden, Claude, and Codex. It keeps the current project direction, task order, and reasoning in one root-level document so future sessions can pick up without re-auditing the whole app.

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

### Verified State (2026-05-25 audit by Claude)

- `[Claude]` `playersCharacter.js` is 480 lines after Phase 0 component extraction. All target components exist under `components/`.
- `[Claude]` `/characters/new` route exists in `Routes.js` and renders `CharacterNew`.
- `[Claude]` `CharacterNew.js` implements the Phase 2 multi-step wizard (Name, Race, Class, Background and Alignment, Ability Scores, Skill Selection, Review).
- `[Claude]` Phase 1 features confirmed shipped: `SkillSelector` component with class rule enforcement, weapon proficiency markers in `EditCharacterForm`, HP quick controls in `CombatStats`, level 1-20 in `LevelUpStudio`.
- `[Claude]` All non-red frontend tests pass. `CharacterWizard.red.test.js` is green. `SessionReadyTools.red.test.js` remains red (Phase 3 not started).
- `[Codex]` `SessionReadyTools.red.test.js` is now green. The character sheet persists spell slot usage, active conditions, death saves, hit dice, and inventory from view mode.
- `[Codex]` Seeds include `backgrounds.json` and `conditions.json`; `feats` are still an explicit empty fallback until Phase VI feat rules are ready.
- `[Codex]` `/compendium/bootstrap` returns `backgrounds`, `feats`, and `conditions`; backend tests verify non-empty backgrounds and conditions.

### Parallel Initiative: DM Workbook

- `[Claude]` The DM Workbook is a standalone DM-facing tool being built in parallel inside the same repo root. It is not a feature of the player-facing DnDWebApp; it is a separate app for session management, NPC tracking, faction notes, encounter building, and campaign logistics set in the Azlemzyk campaign world.
- `[Claude]` DM Workbook has its own build goal and does not depend on or block DnDWebApp phases. Track its progress separately.
- `[Claude]` Do not mix DM Workbook components or routes into the DnDWebApp client.

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
- `[Codex]` Language/tool choices deferred - still pending Phase -1 seed data.
- `[Codex]` Full feat selection deferred to Phase 4 (ASI rules not clean yet).

#### Phase 2 Post-Feedback Fixes (2026-05-27)

User tested the wizard and reported these issues. All fixes applied:

- `[Claude][DONE]` **Root cause of blank Class/Background/Skills**: DB not seeded. Run `npm run seed` from `dndAPI/`. Seed files exist (`classes.json`, `backgrounds.json`, `races.json`). No code change - operational step only.
- `[Claude][DONE]` **Subrace picker**: Added `raceGroup` field to `races.json`. Race step now shows base-race select first, then a subrace select when the chosen group has multiple variants (e.g. Elf -> High Elf / Wood Elf). Single-variant groups (Human) hide the subrace picker.
- `[Claude][DONE]` **Alphabetical sort**: Race groups, subraces within each group, and subclasses are all sorted alphabetically in the wizard.
- `[Claude][DONE]` **Alignment dropdown**: Replaced free-text input with a `<select>` of all 9 standard alignments.
- `[Claude][DONE]` **Ability score methods**: Added method toggle (Standard Array / Point Buy / Roll). Standard Array = current pick/set behavior. Point Buy = 27-point budget, scores 8-15, PHB cost table, +/- controls with budget display. Roll = 4d6 drop lowest per stat, Reroll individual or Roll All.
- `[Claude][DONE]` New tests added: subrace picker show/hide, alphabetical order enforcement, alignment dropdown validation, all three ability score methods including budget exhaustion and roll range.
- `[Claude][DONE]` New backend API tests: bootstrap returns non-empty races/classes/backgrounds (unseeded DB regression catcher), raceGroup field included in race projection.

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

- `[Claude]` Add remaining SRD classes: Barbarian, Bard, Druid, Monk, Paladin, Ranger, Sorcerer, and Warlock.
- `[Claude]` Add remaining races: Dragonborn, Gnome, Half-Elf, Half-Orc, and Tiefling.
- `[Claude]` Add full spell list through level 9.
- `[Claude]` Convert backgrounds into structured data instead of free text (depends on Phase -1).
- `[Claude]` Add feat selection at ASI levels.
- `[Claude]` Add tool proficiency and language selection.
- `[Codex]` Because the importer now targets broader 5etools data, verify what is already available before manually adding more static seed data.
- `[Codex][DONE]` Level-Up Studio now filters long spell lists by name.
- `[Codex][DEFERRED]` Full class/race breadth should use the 5etools importer or carefully tested seed additions; no unsupported static rules were invented in this pass.
- `[Codex][DEFERRED]` Feat selection remains blocked on ASI timing, prerequisites, and ability score mutation rules.

### Phase 7: Release Hardening And DM Readiness [PARTIAL - 2026-05-28]

- `[Codex][DONE]` Backend CORS can now be restricted with `CORS_ORIGIN` while preserving local defaults.
- `[Codex][DONE]` Frontend and backend automated tests pass with no skipped roadmap tests.
- `[Codex][DONE]` Seed runbook documents current startup and seed-state expectations.
- `[Shared][TODO]` Add browser/manual verification for sign in, character creation, sheet trackers, and level-up before a release candidate.
- `[Shared][TODO]` Keep DM Workbook separate unless a future integration phase is explicitly planned.

## Codex Adjustments

- `[Codex]` Seed and verify backend data before frontend feature work depends on it.
- `[Codex]` Treat real compendium size as a UX concern, not just a data concern.
- `[Codex]` Prioritize skill proficiency selection above most other feature work.
- `[Codex]` Delay full feat selection until level-up, ASI timing, prerequisites, and ability score mutation are cleaner.
- `[Codex]` Use searchable/filterable controls instead of huge dropdowns.
- `[Codex]` Keep tests close to each step: backend seed/bootstrap tests for data work, frontend route/component tests for UI work.

## Immediate Next Tasks

Status reflects 2026-05-25 audit. Items marked `[PENDING]` are confirmed not done.

1. `[Shared][NEXT]` Run `npm run seed` from `dndAPI` against the intended development database and confirm collection counts.
2. `[Shared][NEXT]` Manually verify the browser flows: create character, open sheet, use session trackers, level up.
3. `[Shared][NEXT]` Decide whether Phase 6 breadth comes from 5etools import data or hand-curated SRD fallback seeds.
4. `[Shared][NEXT]` Define feat/ASI rules before adding feat selection UI.

## Verification Expectations

- `[Shared]` Run backend tests after backend pipeline or API changes.
- `[Shared]` Run frontend tests after route, component, or character sheet changes.
- `[Shared]` Keep skipped tests only for explicitly deferred future work. Roadmap behavior should normally start red, turn green, and remain enabled.
- `[Codex]` For large UI changes, verify the rendered app manually or with browser automation before calling the work done.
- `[Codex]` Do not claim seeded data is live until the seed command has actually run successfully against the intended database.
