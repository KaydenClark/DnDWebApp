# DnDWebApp Workbench Benchmark

This folder records how the Workbench v2 harness should be evaluated for this
project. Static coverage is checked by:

```bash
node /Users/kayden/GPT_OS/workbench\ templates/tools/evaluate-workbench.mjs --path . --include-controls
```

## Scientific Method

Hypotheses:

- **H1: Better than no template.** A project with the workbench gives an agent
  explicit authority, scope, safety, operations, verification, and documentation
  rules that are absent in the no-template control.
- **H2: Better than a single instruction file.** A project with the workbench
  covers more failure modes than a generic `AGENTS.md` or `CLAUDE.md` file that
  only says to follow style and run tests.
- **H3: Improving over time.** A new branch is better only when it increases
  measured coverage or fixes a named failure mode without reducing other rubric
  areas.
- **H4: Useful in the real world.** Static coverage is necessary but not
  sufficient; stronger proof comes from controlled DnDWebApp tasks with and
  without the harness.
- **H5: Machine-checkable metadata.** YAML front matter improves the template
  only when it is parsed by the evaluator or harness for ownership, writable
  roots, forbidden paths, quality gates, and review triggers.
- **H6: Policy needs guardrails.** Prompt-injection boundaries, tool guardrails,
  CI/CD security defaults, and traceable proof fields reduce avoidable agent
  failures only when they are explicit and verifiable.

## Controls

- `control:no-template` - an empty project instruction set.
- `control:single-instruction-file` - one generic instruction file with no
  blueprint, roadmap, runbook, team workflow, or proof log.

New claims must become evaluator checks before they are treated as template
improvements. Do not claim that template improvements help DnDWebApp agents
unless the static rubric verifies the expected control surfaces and task trials
can later test behavior.

## Current Evidence

The Workbench v2 rollout records evaluator output in `ROADMAP.md` Verification
Log. That row proves static harness coverage only; backend/frontend product
behavior still requires the relevant nested test suites.

Research-backed checklist for DnDWebApp rollout reviews:

- `CLAUDE.md` imports `AGENTS.md` so shared instructions are not duplicated.
- Prompt-injection boundaries and CI/CD guardrails are present before claiming
  improved safety.
- Verification rows include traceable proof with command/result, artifact or
  trace path, and coverage scope.
