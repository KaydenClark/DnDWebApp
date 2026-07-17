# DnDWebApp

DnDWebApp is a private World Anvil-style campaign operating system for
Azlemzyk. Campaign management is the product; the existing character creator
and living character sheet are modules within it.

Current implementation is still split across three recoverable repositories:

- this canonical owner repo: product controls, campaign material, launchers,
  stable specs, and consolidation plan;
- `KaydenClark/dndAPI`: Express/MongoDB auth, character persistence,
  compendium, and server-side derivation;
- `KaydenClark/dndclient`: React/Vite auth, roster, creation wizard, living
  sheet, session tools, and progression UI.

No repository has been deleted, retired, or history-rewritten.

## Start Here

- `AGENTS.md` - operating rules and repository boundaries.
- `BLUEPRINT.md` - product direction and complete capability-to-spec matrix.
- `TASKBOARD.md` - generated hot work projection.
- `RUNBOOK.md` - exact lifecycle, test, recovery, and Git commands.
- `LEXICON.md` - shared campaign/product vocabulary.

The control surface is plain Markdown and is intended to work across Codex,
Claude, and other repository-aware agents. In Claude Code, import the shared
rules with `@AGENTS.md` (or run `/init` and keep the generated bridge thin).

## Current Runtime

The existing character modules run from the nested repos:

```bash
cd dndAPI && npm run dev
cd dndclient && npm run dev
```

The API defaults to port 5000 and the client to 5173. See `RUNBOOK.md` for
install, environment, tests, launchers, and safety boundaries.

The campaign-management module is specified but not yet implemented. Do not
describe the integrated campaign OS as shipped until its owning specs close.
