SITUATION REPORT - D&D Character Workbook
The Honest Assessment
The dev team got further than it looks. The engine underneath this app is legitimately good - they just never finished wiring it to the surface. The bones are solid enough to build on without a rewrite. Here's the breakdown.

WHAT WORKS
API - characterDerivation.js is the strongest piece of code in the project. It correctly implements D&D 5e math end-to-end:

Ability modifier formula (floor((score-10)/2)) - correct
Proficiency bonus by level (2 + floor((level-1)/4)) - correct
Weapon attack bonuses including finesse weapons (picks STR vs DEX based on which is higher) - correct
Damage summary string generation - correct
Armor class with DEX cap handling (heavy armor ignores DEX, medium caps it) - correct
HP calculation (hit die + CON mod per level, Dwarven Toughness support included) - correct
Spell save DC and spell attack bonus from spellcasting ability - correct
Skill and saving throw values resolved from proficiency sets - correct
Race ability bonuses applied on top of base scores - correct

This means the core promise - "tell me exactly how much damage my sword does" - already works on the server. The data just never makes it to a usable UI.
Also working:

JWT auth with bcrypt, token stored in localStorage, protected routes - all solid
MongoDB with proper indexes on startup (email unique, character owner+name unique, compendium id unique)
Character CRUD with ownership enforcement (can't touch another user's character)
Compendium data layer loaded into Maps for O(1) lookups
asyncHandler middleware so unhandled promise rejections don't silently swallow errors
React 18 + Vite - modern, fast setup
Dark fantasy CSS theme - actually looks good, not placeholder garbage
Auth context, API layer cleanly separated in lib/api.js
Edit mode and Level-Up Studio on the character sheet - both work structurally


WHAT DOESN'T WORK
Critical - The App Cannot Fulfill Its Core Promise
1. Compendium data is a proof-of-concept, not a real ruleset.

4 races (Human, High Elf, Hill Dwarf, Lightfoot Halfling)
4 classes (Fighter, Wizard, Cleric, Rogue)
11 weapons
12 spells
5 armor pieces
Level progression only defined through level 5 for all classes

An actual D&D 5e SRD has 9 core races, 12 classes, 100+ weapons/items, 300+ spells, and features through level 20. The vendor/ directory exists with a README pointing at a 5etools data import script (seeds/import5etools.js) that was never run. The data pipeline exists - it just hasn't been executed.
2. Skill proficiency selection is completely missing from the UI.
The class data has skillChoiceRules (e.g., "pick 2 from: Acrobatics, Athletics...") and the derivation engine correctly applies them - but there is zero UI to make that selection. Characters are created with no skill proficiencies, so every skill shows just the raw ability modifier. This is the most obvious gap.
3. No weapon proficiency indicator in the equipment picker.
The edit form shows every weapon in the database as a flat checklist with no indication of which ones your character is actually proficient with. The server already computes availableWeaponIds and returns it on the character - the client just ignores it.
4. items.js is an empty class component. It imports two constants and exports an empty React class. Dead file, never wired to a route.
5. Backstory is in the edit form but not displayed in view mode. You can save it, it disappears.
6. No HP management in view mode. Current HP is only editable by going into the full edit form. No quick heal/damage buttons during a session.
7. Death saves and conditions have model support but zero UI.
Structural Problems
8. playersCharacter.js is 600+ lines. It contains the character detail page, edit form, level-up studio, spell selection, attack display, and multiple inline sub-components all in one file. This is the main wall the team kept hitting - every new feature makes this file harder to touch.
9. Character creation form is embedded in the character list page. It's just a flat form sitting above the character cards. No guided flow, no ability score rolling/point buy, no skill selection step.
10. CRA artifacts polluting the Vite project. serviceWorker.js, manifest.json, logo192.png, logo512.png are Create React App leftovers. The project is Vite now - these are dead weight and create false impressions about PWA capability that doesn't exist.
11. CORS is wide open. app.use(cors()) with no origin list. Fine for local dev, a problem if this ever goes online.

THE GAMEPLAN
Phase 0 - Structural Cleanup (Do This Before Anything Else)
Estimated scope: 1 session. Nothing new ships until this is done.

Run the 5etools import or build a proper seed from the SRD JSON. Get full race, class, spell, weapon, and armor data through level 20. Without this, every feature we add is demo-ware.
Break playersCharacter.js into components. Target structure:

CharacterHeader.jsx - name, subtitle, action buttons
AbilityScores.jsx - the 6-stat grid
CombatStats.jsx - AC, HP, initiative, speed
SkillsAndSaves.jsx
AttacksPanel.jsx
SpellPanel.jsx
FeaturesPanel.jsx
EditCharacterForm.jsx
LevelUpStudio.jsx


Move character creation to its own route (/characters/new). The list page should just list characters.

Phase 1 - Make the Core Promise Real
Features that directly deliver "tell me what my character can do."

Skill proficiency selection - add a step to creation and a section in edit mode. Use the class's skillChoiceRules to drive the options. This is the single highest-value gap.
Weapon picker shows proficiency status - filter the equipped weapon list by availableWeaponIds, or at minimum mark non-proficient weapons visually.
HP tracker on the view screen - heal/damage buttons that PATCH currentHp directly. No need to open the full edit form for this.
Expand level progression to level 20 for all 4 classes in the seed data. Spells slots, features, ability score improvements - all the way to cap.

Phase 2 - Character Creation Wizard
Replace the flat form with a guided multi-step flow.
Steps: Name -> Race (shows racial bonuses, traits, languages) -> Class (shows hit die, saves, armor/weapon profs) -> Background + Alignment -> Ability Scores (standard array, point buy, or manual) -> Skill Selection (driven by class rules) -> Review
This is the feature that makes the app feel like a D&D tool instead of a generic form.
Phase 3 - Session-Ready Tools
Features you actually need at the table.

Death save tracker (UI for the existing model fields)
Conditions tracker
Spell slot expend/refresh buttons
Hit dice tracker
Inventory management (add/remove items by name/quantity)
Initiative tracker (probably session-scoped, not persisted)

Phase 4 - Breadth Expansion
More content, more options.

Remaining SRD classes (Barbarian, Bard, Druid, Monk, Paladin, Ranger, Sorcerer, Warlock)
Remaining races (Dragonborn, Gnome, Half-Elf, Half-Orc, Tiefling)
Full spell list through level 9
Backgrounds as structured data (not free text)
Feat selection at ASI levels
Tool proficiency and language selection


VERDICT
Don't rewrite. The stack is right (React/Vite/Express/MongoDB), the derivation engine works correctly, and the data model is sound. What this app needs is content data, a broken-up component structure, and the skill selection feature that makes character stats actually mean something.
The first thing I'd do next session: execute the 5etools import pipeline and get the full SRD dataset loaded, then split playersCharacter.js. Both are zero-feature-change structural moves that unblock everything else.