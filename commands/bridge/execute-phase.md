---
name: bridge:execute-phase
description: Execute a phase with wave orchestration + stack-driven post-gates (review, security, e2e)
argument-hint: "<phase-number> [--gaps-only]"
allowed-tools:
  - Read
  - Write
  - Edit
  - Glob
  - Grep
  - Bash
  - Task
  - Agent
  - AskUserQuestion
---
<objective>
Execute a phase with full bridge quality gates, stack-driven from project-config.json.

Pipeline:
1. gsd:execute-phase — wave-based execution, atomic commits
2. Post-execution gates — derived from project-config.json skills map + trigger_patterns; fallback to stack-map.md defaults when config absent
3. verification-loop — always
</objective>

<execution_context>
bridge/SKILL.md (loaded as plugin skill — already in context)
</execution_context>

<context>
$ARGUMENTS

Pipeline definition for bridge:execute-phase is in the SKILL.md under "### `/bridge:execute-phase`".
Stack-to-skill mapping is in bridge/stack-map.md (loaded as plugin skill — already in context)
</context>

<process>
Show the ━━━ BRIDGE ► EXECUTE PHASE ━━━ banner. Then follow these steps exactly:

Step 1 — Load config
  a. Try Read .claude/project-config.json
  b. If found: extract skills map (on_py_change, on_ts_tsx_change, on_endpoint_change, on_test_change, after_execution) and project_specific block (eval_script, eval_trigger)
  c. If not found: load stack-map.md defaults for detected base stack + overlays

Step 2 — Run gsd:execute-phase [arguments]
  Wait for gsd:execute-phase to complete and collect the list of files changed across all wave commits.

Step 3 — Determine post-execution gates
  Walk the changed file list. For each file, apply trigger rules:

  IF project-config.json loaded:
    • File ends in .py            → run each skill in skills.on_py_change
    • File ends in .ts or .tsx    → run each skill in skills.on_ts_tsx_change
    • File ends in .go            → run go-reviewer (stack-map.md fallback for go stacks)
    • File ends in .kt            → run kotlin-reviewer (stack-map.md fallback)
    • File ends in .java          → run code-reviewer (stack-map.md fallback)
    • File matches *_store.*, *repository.*, models.*, schema.*, or path contains migrations/ → run postgres-patterns + database-reviewer
    • File is an endpoint file (routes/, api/, *router*, *endpoint*) → run each skill in skills.on_endpoint_change
    • File is a test file (test_*, *_test.*, *.test.ts, *.spec.*) → run skills.on_test_change
    • File name matches project_specific.eval_trigger         → run project_specific.eval_script (Bash, not a skill)
  ELSE (stack-map.md fallback):
    • Use the trigger table for the detected base stack
    • Apply overlay triggers (auth overlay → security-review, DB overlay → database-reviewer, Docker overlay → docker-patterns, CI/CD overlay → deployment-patterns)

  ALWAYS (regardless of config):
    • Run verification-loop

Step 4 — Run gates in order, show checkpoint box
  Record start time before running gsd:execute-phase. Run each gate skill. Never skip. Do not pause for user confirmation between gates.
  After all gates: render checkpoint box with per-gate durations and total time elapsed since start.

Step 5 — Show Next Up block
</process>
