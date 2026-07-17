# DnDWebApp - Build Backlog

> Archived during Workbench v2.3 adoption. Stable capability truth and open
> work now live in the root stable specs; this file remains historical evidence.

**Last updated: 2026-06-04 by Codex**

Items spotted during Phase 1 and Phase 2 work that are not in the game plan yet. Review before starting Phase 3.

---

## Data / Backend

- **Seed verification before Phase 7 browser testing** - DONE 2026-06-03. Atlas counts verified via importer path: 165 races, 16 classes, 130 subclasses, 558 spells, 2967 features, 126 backgrounds, 178 feats, 15 conditions. Backend suite now has 55 green tests.
- **[PRIORITY - TEST]** Frontend `spellcasting.restRecovery` display - DONE 2026-06-04. `SpellPanel` now shows "Recovers on: short rest" for pact casters and "Recovers on: long rest" for standard casters. Added failing tests first, then implemented the UI.
- **Feats seed data** - `feats.json` is still an empty stub in `loadSeedData.js`. PHB SRD feats should be added here once ASI/feat selection UI exists (Phase 6D).
- **Conditions seed data** - DONE 2026-05-28. Local fallback seed data now includes the 15 SRD conditions and backend bootstrap tests verify them.
- **Spells above level 5** - DONE 2026-06-03. `spells.json` expanded to 91 spells covering all levels 0-9 for all caster classes.
- **Background skill proficiency application** - DONE 2026-05-28. `characterDerivation.js` merges background skills into effective proficiencies.
- **Background tool and language grants** - DONE 2026-05-28. Derivation applies tool and language grants; displayed in FeaturesPanel.
- **Half-caster classes (Paladin, Ranger)** - DONE 2026-06-03. Both classes have half-caster `spellSlotsByLevel` tables (slots start at level 2). Verified with new test: Paladin at L1 has 0 slots, at L2 has 2 level-1 slots.
- **Short rest vs. long rest recovery** - DONE 2026-06-04. `restRecovery` field added to all caster classes in `classes.json`. Threaded through derivation engine and displayed in `SpellPanel` as short-rest vs. long-rest recovery copy.

---

## Frontend / UX

- **SkillSelector empty-state message is misleading** - DONE 2026-05-28. Empty state now says "No skill choices for this class."
- **Ability score standard array / point-buy helper** - DONE in Phase 2 post-feedback pass.
- **Wizard step validation** - DONE 2026-05-28 for required identity fields: name, race, and class. Background, alignment, and class skills remain optional at creation time.
- **Wizard back-navigation preserves state** - DONE 2026-05-28. Regression coverage now checks Back navigation and tab jumps.
- **Character list card detail** - Already present. Character cards show level, race, and class.
- **Subclass early-gate** - DONE 2026-05-28. Wizard hides subclass selection until the starting level reaches `class.subclassLevel`.
- **Level-up warns but does not enforce subclass unlock** - DONE 2026-05-28. `LevelUpStudio` shows a "subclass unlocks at level X" notice when applicable.
- **Spell search / filter in LevelUpStudio** - DONE 2026-05-28. Long spell lists now show a name filter.
- **HP bar visualization** - DONE 2026-05-28. `CombatStats` shows a progress bar with low/critical color states.
- **Temp HP tracker on view screen** - DONE 2026-05-28. `CombatStats` has view-mode Temp HP display and quick Set control.
- **Currency display on view screen** - DONE 2026-05-28. `FeaturesPanel` shows cp/sp/ep/gp/pp in read-only view mode.
- **Proficiency breakdown tooltip** - DONE 2026-06-04. Skill modifiers expose ability modifier, class/background proficiency, expertise, and other bonuses in hover and screen-reader text.
- **Expertise selection and display** - DONE 2026-06-04. `expertiseProficiencies` now round-trips through create/edit, derives double proficiency only for already-proficient skills, updates passive Perception for Perception expertise, and displays in `FeaturesPanel` plus skill breakdowns.
- **Condition description tooltip** - DONE 2026-06-04. Conditions keep the compact checklist layout while exposing descriptions through an accessible tooltip trigger. Added `SessionToolsPanel.test.js` to cover tooltip metadata and ensure the tooltip trigger does not toggle the condition checkbox.
- **[PRIORITY - TEST] Phase 7 browser/e2e smoke coverage** - Add coverage for sign in, create Warlock and Paladin characters, verify pact short-rest recovery and Paladin half-caster slots, use spell/condition/death-save/hit-dice/inventory trackers, level up, and confirm a second user cannot see the first user's characters.

---

## Phase 3 Prep (spotted during Phase 2 work)

- **Spell slot tracker state** - DONE 2026-05-28. Expend/refresh persists `spellSlots.level_N.slotsExpended` per request.
- **Conditions tracker data shape** - DONE 2026-05-28. Existing `conditions` array is used for active condition ids.
- **Death save model fields** - DONE 2026-05-28. Existing `deathSaves` object is used.
- **Inventory data shape** - DONE 2026-05-28. Existing `inventory` array stores `{ name, quantity }` items.
- **Rest endpoint** - Phase 3 hit dice and spell slot restore on short/long rest may benefit from a dedicated `/characters/:id/rest` route instead of a general `updateCharacter` call. Decide before implementing.

---

## Technical Debt

- **`syncEditForm` double-reads ability scores** - The fallback chain (`character?.baseAbilityScores?.str ?? character?.abilityScores?.str ?? 8`) is a leftover from a schema migration. Once old character documents without `baseAbilityScores` are gone, simplify this.
- **No frontend route tests for CharacterNew wizard navigation** - DONE 2026-05-28. `CharacterWizard.red.test.js` covers Back navigation and tab-jump state persistence.
- **API tests do not cover backgrounds collection** - DONE. Backend tests now assert non-empty backgrounds after seeding.
- **CORS config** - PARTIAL 2026-05-28. `CORS_ORIGIN` can restrict allowed origins and is documented in `dndAPI/.env.example`; deployment still needs environment-specific values.
- **`.env` committed to repo** - DONE 2026-06-04. Confirmed `dndAPI/.env` is ignored and not tracked; only `.env.example` is tracked.
- **[PRIORITY - TEST] SessionReadyTools test warnings** - `npm test` passes, but `SessionReadyTools.red.test.js` emits React `act(...)` warnings. Clean this up so future test output stays high-signal.
- **Write/Edit tool null-byte corruption** - The Cowork Write and Edit tools append null bytes to files when content is long. Workaround: use Python `open(..., 'w')` or bash heredocs for files over ~250 lines. Log this as known behavior.
