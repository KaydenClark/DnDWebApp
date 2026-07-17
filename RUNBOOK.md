# DnDWebApp - Runbook

> Generated from LLM Workbench v2.3.

**Last reviewed:** 2026-07-17
**Runtime owner:** Kayden plus the assigned agent
**Environment:** private local workspace with three Git repositories

## Prerequisites

- Node.js 24-compatible runtime and npm.
- Git and authenticated GitHub access for `KaydenClark/*`.
- Canonical Workbench checkout at `/Users/kayden/GPT_OS/Workbench Factory`.
- Local `.env` files created from nested `.env.example` files when runtime work
  is explicitly in scope. Never print or commit their contents.

## Repository Preflight

```bash
for repo in \
  "/Users/kayden/GPT_OS/Projects/DnDWebApp" \
  "/Users/kayden/GPT_OS/Projects/DnDWebApp/dndAPI" \
  "/Users/kayden/GPT_OS/Projects/DnDWebApp/dndclient"
do
  git -C "$repo" status --short --branch
  git -C "$repo" remote -v
  git -C "$repo" branch -vv
done
```

Expected owner remotes:

- `https://github.com/KaydenClark/DnDWebApp.git`
- `https://github.com/KaydenClark/dndAPI.git`
- `https://github.com/KaydenClark/dndclient.git`

## Repository Provenance

`consolidation/repository-provenance.json` pins the immutable remote URL,
source ref, head, history count, and intended import destination for all three
repositories. Verify the local objects and live remote refs without fetching or
writing to any repository:

```bash
node tools/verify-repository-provenance.mjs \
  --manifest consolidation/repository-provenance.json
```

The command fails closed on any mismatch. Its regression suite uses disposable
synthetic repositories:

```bash
node --test tools/verify-repository-provenance.test.mjs
```

Update the manifest only through an assigned consolidation ticket with
before/after status, head, and remote proof. A source-ref change is provenance
drift, not an automatic update.

## Environment Configuration

Create only local config from the nested examples when runtime work requires it:

```bash
cp dndAPI/.env.example dndAPI/.env
cp dndclient/.env.example dndclient/.env
```

Required variable names and safe examples live in those tracked example files.
Real values are secrets/local data: never print, stage, or commit them.

## Spec Lifecycle

```bash
WB="/Users/kayden/GPT_OS/Workbench Factory/tools/spec-workbench.mjs"
node "$WB" doctor --path .
node "$WB" next --path . --json
node "$WB" show S-001 --path .
node "$WB" claim S-001 --path . --agent codex
node "$WB" close S-001 --path . \
  --proof "named checks" \
  --docs "updated owner docs" \
  --remaining-gap "remaining gap"
node "$WB" complete S-001 --path .
node "$WB" render --path .
node "$WB" doctor --path .
```

Do not hand-edit generated catalog or hot-spec regions.

## Install

```bash
cd /Users/kayden/GPT_OS/Projects/DnDWebApp/dndAPI
npm ci

cd /Users/kayden/GPT_OS/Projects/DnDWebApp/dndclient
npm ci
```

## Run Locally

```bash
cd /Users/kayden/GPT_OS/Projects/DnDWebApp/dndAPI
npm run dev
```

In a second terminal:

```bash
cd /Users/kayden/GPT_OS/Projects/DnDWebApp/dndclient
npm run dev
```

Open `http://localhost:5173`; the API defaults to `http://localhost:5000`.
Root Windows launchers remain available for the current split runtime.

## Test And Build

Targeted checks belong to the assigned spec. Full verification baseline:

```bash
cd /Users/kayden/GPT_OS/Projects/DnDWebApp/dndAPI
npm test

cd /Users/kayden/GPT_OS/Projects/DnDWebApp/dndclient
npm test -- --run
npm run build

cd /Users/kayden/GPT_OS/Projects/DnDWebApp
WB="/Users/kayden/GPT_OS/Workbench Factory/tools/spec-workbench.mjs"
node "$WB" render --path .
node "$WB" doctor --path .
git diff --check
```

Verified baseline on 2026-07-17:

- API: 132 passed, 0 failed.
- Client: 24 files and 372 tests passed.
- Client Vite production build succeeded.
- Client emits non-failing Node `localStorage` and nested `vi.mock` warnings;
  these are test-harness debt, not release proof.

### Test Coverage Policy

Tests must prove behavior a user, API consumer, operator, or maintainer depends
on. If someone accidentally deletes a meaningful line, branch, route, data
contract, validation rule, workflow step, or bug fix, at least one test or
documented manual check should fail. Remove or improve tests that are stale,
duplicate without adding a boundary, pure snapshot bloat, or green without
checking meaningful behavior.

## Data Operations

The existing character seed command is destructive to compendium collections
and may target a configured service:

```bash
cd /Users/kayden/GPT_OS/Projects/DnDWebApp/dndAPI
npm run seed
```

Run it only when the assigned ticket explicitly requires it and the target is
verified. Never run it as a docs/adoption check.

Campaign SQLite schema/migration/backup commands do not exist yet. S-004 owns
their implementation and proof.

## Browser And Release Proof

Unit tests and a Vite build are not full release proof. S-016 owns a repeatable
browser path covering auth, account isolation, roster, creation, derivation,
session tools, progression, campaign navigation/search, responsive layouts,
console errors, and a check-in artifact.

Until that spec is complete, describe the current release state as
unit/build-verified, not browser/E2E-verified.

## Version Control

- Work on a bounded `codex/` branch from a verified recovery ref.
- Stage only canonical owner files for root planning/adoption work.
- Never stage nested repositories, `.env`, databases, private campaign data,
  `node_modules`, or `dist`.
- Never force-push or rewrite published history.
- Only Kayden authorizes repository retirement/deletion and final promotion to
  `main`.

Before commit:

```bash
git status --short --branch
git diff --check
git diff --cached --name-status
```

## Fresh-Clone Recovery

Owner repository:

```bash
tmp_dir=$(mktemp -d)
git clone https://github.com/KaydenClark/DnDWebApp.git "$tmp_dir/DnDWebApp"
git -C "$tmp_dir/DnDWebApp" checkout codex/s002-dndwebapp-canon-adoption
git -C "$tmp_dir/DnDWebApp" rev-parse HEAD
```

Consolidation inputs remain separately recoverable:

```bash
git clone https://github.com/KaydenClark/dndAPI.git "$tmp_dir/dndAPI"
git -C "$tmp_dir/dndAPI" checkout master
git -C "$tmp_dir/dndAPI" rev-parse HEAD

git clone https://github.com/KaydenClark/dndclient.git "$tmp_dir/dndclient"
git -C "$tmp_dir/dndclient" checkout master
git -C "$tmp_dir/dndclient" rev-parse HEAD
```

Recreate the current split workspace by placing the two clones at
`DnDWebApp/dndAPI` and `DnDWebApp/dndclient`; root ignore rules intentionally
keep their Git metadata and working trees out of the owner commit.

## Adoption Provenance

| Repository | Source ref at adoption | Resolved commit |
|---|---|---|
| `KaydenClark/DnDWebApp` | `Workbench-v2-Update` | `db18330a0d7a9002ce8a49ded32b9b0628956d13` |
| `KaydenClark/dndAPI` | `master` | `874957998a0db1c84a0c94b54048b033c914f875` |
| `KaydenClark/dndclient` | `master` | `6c75778c73cddcb2b5b8175be96ece8af261e40b` |
| Workbench protocol source | Workbench Factory live v2.3 checkout | `cf6fd6e6c9aeaf655fc07b2f257539f9647188b0` |

No helper was vendored, so no vendored-helper checksum applies.

## Troubleshooting

| Symptom | Check | Safe response |
|---|---|---|
| `mongodb-memory-server` cannot download | Inspect test hook/network error | Record infrastructure blocker; do not judge product behavior from setup failure. |
| Client cannot reach API | Check process and documented base URL without printing secrets | Start API or correct local config. |
| Doctor reports render drift | Run `render`, inspect only generated regions, then rerun `doctor` | Fix canonical spec/Blueprint source, not Taskboard rows. |
| Nested repo appears dirty | Run status inside that exact nested repo | Preserve it; use an isolated worktree or stop overlapping writes. |
| Remote differs from provenance | Compare `remote -v`, upstream, and `ls-remote` | Stop consolidation work and surface the recovery mismatch. |

## Recovery And Rollback

1. Identify the owning repo and touched files.
2. Preserve unrelated dirty work.
3. Revert only the smallest failed change.
4. Rerun the failing targeted check and full owner verification.
5. Append truthful evidence to the assigned spec and rerender.

Do not reset databases, delete repos, rotate credentials, or rewrite history as
recovery.
