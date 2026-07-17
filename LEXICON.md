# DnDWebApp - Lexicon

> Generated from LLM Workbench v2.3.

**Last reviewed:** 2026-07-17
**Status:** active

## Workbench Terms

| Term | Definition | Distinction |
|---|---|---|
| Blueprint | Compact product direction, architecture, invariants, non-goals, and spec catalog. | Not a ticket queue or proof archive. |
| Spec | Stable capability record with requirements, decisions, slices, acceptance, and evidence. | Never moved between status folders. |
| Ticket | One temporary vertical implementation slice inside a spec. | Not a separate issue store. |
| Taskboard | Generated projection of active specs. | Never hand-edited as canonical work state. |

## Project Terms

| Term | Definition | Distinction |
|---|---|---|
| DnDWebApp | The canonical private campaign operating system and owner repository. | Not merely the character-sheet root folder. |
| Campaign operating system | The integrated private surface for campaign canon, preparation, live-session operation, recall, and character modules. | Product identity; not an OS kernel or public wiki. |
| Character module | The auth, roster, creation, derivation, sheet, session-tool, and progression capabilities currently split across `dndAPI` and `dndclient`. | A major module, not the whole product. |
| Campaign module | Local campaign-management capabilities backed by relational records and full-text search. | Not raw Obsidian notes or a duplicate character rules engine. |
| Azlemzyk | The campaign world whose canonical records seed and exercise campaign-management capabilities. | Private campaign data; use synthetic fixtures unless live data is explicitly in scope. |
| Canonical owner | `KaydenClark/DnDWebApp`, which owns product direction, specs, consolidation mapping, and integrated proof. | Does not erase nested repository ownership/history. |
| Consolidation input | `KaydenClark/dndAPI` or `KaydenClark/dndclient`, preserved as an independent recovery source while integration is planned. | Not deprecated, archived, or safe to delete. |
| Derived character | A character response whose rules-dependent values are recomputed by the backend from raw player choices. | Derived math is not persisted or recomputed in React. |
| Campaign Timeline | Chronological in-world history linked to sessions. | Distinct from Session Log, which records real table sessions and notes. |
| Villain Timeline | Future or conditional antagonist events ordered by in-world date. | Distinct from past campaign history. |
| Clue Trail | Linked evidence/hooks connecting NPCs, factions, locations, and investigation targets. | Not a free-form session note. |
| Context artifact | Bounded generated summary for retrieval with source and freshness. | Derived convenience, never canonical truth. |
