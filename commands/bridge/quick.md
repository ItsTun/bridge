---
name: bridge:quick
description: Execute a quick task with GSD guarantees + automatic ECC quality gates (stack-driven post-steps)
argument-hint: "\"task description\" [--full] [--discuss] [--auto]"
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
Execute a quick task with full bridge quality gates.

Pipeline:
1. gsd:quick "{task}" — atomic commit, state tracked
2. Post-step gates (auto, stack-driven, no user prompt):
   - python-review (if .py changed)
   - eval_brief.py (if oracle_v4.txt changed — project-specific)
   - verification-loop (always)

All GSD flags pass through: --auto, --batch, --gaps-only, --model=, --prd, --repair, --discuss, --full

Stack detection runs at start of every active command (cached per session).
</objective>

<execution_context>
@/Users/tunhanmra/Dev/bridge/skills/bridge/SKILL.md
</execution_context>

<context>
$ARGUMENTS

Pipeline definition for bridge:quick is in the SKILL.md under "### `/bridge:quick`".
Stack-to-skill mapping is in @/Users/tunhanmra/Dev/bridge/skills/bridge/stack-map.md
</context>

<process>
Execute the /bridge:quick pipeline from the SKILL.md.
Run post-step gates automatically after gsd:quick completes — do not pause or ask.
Show the ━━━ BRIDGE ► QUICK ━━━ banner with checkpoint box.
</process>
