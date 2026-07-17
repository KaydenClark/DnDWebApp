# DnDWebApp - Blueprint

> Generated from LLM Workbench v2.3.

**Last reviewed:** 2026-07-17
**Status:** active
**Source root:** `/Users/kayden/GPT_OS/Projects/DnDWebApp`

## Product Map

DnDWebApp is Kayden's private World Anvil-style campaign operating system for
preparing, running, and recalling the Azlemzyk campaign. It unifies campaign
actors, factions, sessions, party state, encounters, investigation threads,
locations, lore, divine systems, currencies, and timelines. The existing
character creator and living character sheet remain valuable player modules
inside that larger campaign product.

Core promise:

> Kayden can recover the campaign's current truth, prepare the next session,
> run table-facing tools, and manage living characters from one private,
> searchable operating system without losing the histories of the apps that
> already work.

Primary users are Kayden as DM/operator and invited players using their own
character roster and sheet.

## Goals And Pillars

- **Campaign command:** one coherent private surface for preparation, live
  session operation, and post-session recall.
- **Linked canon:** Azlemzyk people, factions, places, lore, sessions, clues,
  encounters, and timelines remain searchable and relational instead of being
  isolated notes.
- **Living characters:** auth, roster, creation, derivation, session tools, and
  progression remain first-class modules backed by one server-side rules engine.
- **Local-first privacy:** campaign records and retrieval context default to
  local storage and do not silently flow to public or paid services.
- **History-preserving evolution:** `DnDWebApp`, `dndAPI`, and `dndclient`
  histories/remotes remain recoverable through consolidation.

## Cross-Cutting Architecture And Invariants

| Layer / concern | Choice | Invariant / source |
|---|---|---|
| Canonical owner | `KaydenClark/DnDWebApp` | Owns product direction, stable specs, consolidation mapping, and integrated release proof. |
| Character API input | `KaydenClark/dndAPI`, Express 4, Node | Current auth, MongoDB persistence, compendium, and derivation stay intact until imported through a history-preserving path. |
| Character client input | `KaydenClark/dndclient`, React 18 + Vite | Current player roster, wizard, sheet, and session tools stay intact until imported through a history-preserving path. |
| Campaign module | Local web app with SQLite + FTS5 | Existing settled workbook direction specifies local campaign persistence and search; exact integration is ticketed, not a new product question. |
| Character data | MongoDB through the existing API | Raw choices persist; derived stats compute on read/write in `characterDerivation.js`. |
| Retrieval | Bounded hot summary, domain context, then targeted query | Results expose source/freshness and never replace canonical records. |
| Testing | Node test runner/Supertest; Vitest/Testing Library; browser E2E | Baseline: API 132/132, client 372/372, client build green on 2026-07-17. |
| Runtime | Local Mac/Windows development; ports 5000/5173 today | Production deployment, credentials, and paid services remain owner-gated. |

Cross-cutting rules:

- Source and tests are implementation truth when a stale document disagrees.
- Campaign management is the product; character creation and sheets are modules.
- The backend is the only owner of D&D-derived math.
- Campaign records, private notes, credentials, databases, and raw exports stay
  untracked and local unless Kayden explicitly authorizes another boundary.
- Search and generated context include provenance and freshness; they do not
  silently mutate source records.
- Consolidation must preserve every commit and remote for all three repos.
- No repository is deleted, retired, or history-rewritten as part of adoption.

## Non-Goals

- A public campaign wiki, marketplace, virtual tabletop, combat simulator, or
  complete digital rulebook.
- Reimplementing character math in React.
- Committing private campaign data, local databases, `.env`, or vendored
  compendium exports.
- Production deployment, paid-service adoption, credential changes, or
  repository retirement without explicit owner approval.

## Blueprint-To-Spec Coverage Matrix

This table is the durable canon-to-spec coverage matrix. It maps product
direction, not ticket state; executable status lives only in stable specs.

| Canonical capability | Verified state | Classification | Stable owner |
|---|---|---|---|
| Workbench v2.3 project lifecycle | v2 controls existed without stable specs, Lexicon, or generated Taskboard | implemented during adoption | S-001 |
| Campaign-management platform / OS shell | Settled private World Anvil-style identity; no integrated surface yet | settled, not implemented | S-002 |
| Non-destructive repository consolidation | Three clean independent histories/remotes; root currently ignores nested repos | settled, not implemented | S-003 |
| Local campaign app/data foundation | Settled Express/React/SQLite direction in archived workbook plan; no app scaffold | settled, not implemented | S-004 |
| Azlemzyk canonical data | Campaign domain/schema and seed intent documented; private live DB not read | settled, not implemented | S-005 |
| Retrieval/context | Three-tier summary/domain/query protocol exists only as a historical skill | settled, not implemented | S-006 |
| NPC Manager | Fields, CRUD, active filtering, and Azlemzyk seed requirement settled | settled, not implemented | S-007 |
| Faction Tracker | Fields, linked NPCs, pressure/leverage/escalation settled | settled, not implemented | S-007 |
| Session Log + full-text search | Session record and FTS5 behavior settled | settled, not implemented | S-008 |
| Party Tracker | Party state, items, notes, and session use settled | settled, not implemented | S-008 |
| Meta-Currency | Per-player Inspiration/Fate/Clarity immediate controls settled | settled, not implemented | S-008 |
| Encounter Builder | Encounter, stat block, DC, environment, and notes fields settled | settled, not implemented | S-009 |
| Clue Trail | Evidence links and NPC/faction filters settled | settled, not implemented | S-009 |
| Villain Timeline | In-world scheduled events and party-trigger behavior settled | settled, not implemented | S-009 |
| Location Notes | Locations, factions, tensions, and present NPC links settled | settled, not implemented | S-010 |
| World Lore | Searchable topic/content canon with edit mode settled | settled, not implemented | S-010 |
| Divine System | Horren aspects, Minora, imprisoned beings, artifacts, and notes settled | settled, not implemented | S-010 |
| Campaign Timeline | Chronological in-world history linked to session number settled | settled, not implemented | S-010 |
| Character auth and roster | JWT ownership, protected routes, and user-scoped roster implemented | implemented, missing durable spec | S-011 |
| Rules derivation and compendium | Server-side derivation, seed/import, and ten collection bootstrap implemented | implemented, missing durable spec | S-012 |
| Character creation wizard | Seven-step wizard and three ability methods implemented | implemented, missing durable spec | S-013 |
| Session-ready character sheet | View/edit/level-up and table tools implemented | implemented, missing durable spec | S-014 |
| Progression | Level 1-20, subclass gates, spell selection implemented | implemented, incomplete durable spec | S-015 |
| Feat/ASI rules | Capability required; current data mixes rule eras and four policy choices remain open | unresolved owner decision | S-015 |
| Browser/E2E release proof | Unit/build green; full browser/account-isolation proof absent | settled, not implemented | S-016 |

Coverage result: **27 of 27 meaningful canon items have stable spec ownership;
zero items are unjustifiably uncovered.**

## Spec Catalog

<!-- spec-catalog:start -->
| Spec | Description | Status |
|---|---|---|
| [S-001 - Workbench v2.3 Adoption](specs/S-001-workbench-v2-3-adoption/SPEC.md) | Give the canonical owner a history-preserving v2.3 control surface, stable capability records, generated hot work, and reproducible recovery. | complete |
| [S-002 - Campaign Operating System](specs/S-002-campaign-operating-system/SPEC.md) | Deliver one private World Anvil-style campaign workspace that unifies preparation, live-session operation, recall, and character modules. | planned |
| [S-003 - History-Preserving Repository Consolidation](specs/S-003-history-preserving-repository-consolidation/SPEC.md) | Consolidate the product under DnDWebApp without losing, rewriting, deleting, or silently disconnecting the dndAPI and dndclient histories/remotes. | active |
| [S-004 - Local Campaign App And Data Foundation](specs/S-004-local-campaign-app-data-foundation/SPEC.md) | Establish the private local campaign web runtime, SQLite schema/migrations, stable IDs, backup/recovery, and safe test fixtures. | planned |
| [S-005 - Azlemzyk Canonical Campaign Data](specs/S-005-azlemzyk-canonical-campaign-data/SPEC.md) | Import and maintain provenance-bearing Azlemzyk campaign records across the campaign schema without exposing private raw sources. | planned |
| [S-006 - Campaign Retrieval And Context](specs/S-006-campaign-retrieval-context/SPEC.md) | Provide bounded, provenance-bearing campaign summaries, domain context, and targeted search over canonical local records. | planned |
| [S-007 - Campaign Actors And Factions](specs/S-007-campaign-actors-factions/SPEC.md) | Let Kayden manage NPC motives/status and faction pressure/leverage as linked living campaign records. | planned |
| [S-008 - Session And Party Operations](specs/S-008-session-party-operations/SPEC.md) | Give Kayden a searchable Session Log, live Party Tracker, and immediate per-player meta-currency controls. | planned |
| [S-009 - Encounter And Investigation Operations](specs/S-009-encounter-investigation-operations/SPEC.md) | Let Kayden prepare encounters, trace investigative clues, and see the villain's pending timeline as linked operational records. | planned |
| [S-010 - World Reference And Timeline](specs/S-010-world-reference-timeline/SPEC.md) | Give Kayden linked Location Notes, searchable World Lore, the Divine System reference, and chronological Campaign Timeline. | planned |
| [S-011 - Character Identity And Roster](specs/S-011-character-identity-roster/SPEC.md) | Let each player authenticate and access only their own scannable character roster and character records. | complete |
| [S-012 - Character Rules Derivation And Compendium](specs/S-012-character-rules-derivation-compendium/SPEC.md) | Derive trustworthy D&D character values server-side from raw choices and validated compendium records. | complete |
| [S-013 - Character Creation Wizard](specs/S-013-character-creation-wizard/SPEC.md) | Guide a player through a validated seven-step character creation flow backed by server-side rules and compendium choices. | complete |
| [S-014 - Session-Ready Character Sheet](specs/S-014-session-ready-character-sheet/SPEC.md) | Give players a derived living sheet with view/edit/level-up modes and persistent at-table character tools. | complete |
| [S-015 - Character Progression And Feat/ASI Rules](specs/S-015-character-progression-feat-asi/SPEC.md) | Extend the shipped level-up flow with one explicit, validated feat/ASI rules contract across API, compendium, creator, and sheet. | blocked |
| [S-016 - Browser E2E Release Proof](specs/S-016-browser-e2e-release-proof/SPEC.md) | Prove the integrated campaign and character workflows in real browsers with account isolation, responsive layouts, clean console, and check-in artifacts. | active |
<!-- spec-catalog:end -->

## Cross-Cutting Health

- `npm test` in `dndAPI/` passes without modifying real data.
- `npm test -- --run && npm run build` in `dndclient/` passes.
- one-command spec render/doctor reports no lifecycle, link, or Taskboard drift.
- all three Git histories and remotes remain independently recoverable.
- private data, secrets, databases, dependencies, and build output stay out of
  the canonical owner commit.

## Design Decisions

| Decision | Rationale | Source |
|---|---|---|
| Campaign OS is the product identity | The current owner instruction explicitly settles the World Anvil-style direction. | 2026-07-17 canon-to-spec authorization |
| Character apps remain modules | Their shipped auth/creator/sheet value is preserved without shrinking campaign scope. | live source/tests plus current authorization |
| DnDWebApp is canonical owner | One product owner avoids three competing plans while preserving code histories. | active portfolio registry/current authorization |
| Local SQLite/FTS remains the campaign data direction | It supports private, fast, relational session operations without a paid dependency. | archived `GAME_PLAN_DMW_2026-07-17.md` |
| Existing nested repos remain untouched during planning | Planning must not rewrite implementation history or remote recovery. | adoption guardrail/current authorization |
