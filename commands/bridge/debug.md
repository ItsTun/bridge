---
name: bridge:debug
description: Systematic debugging with scientific method + post-debug stack review + verification-loop
argument-hint: "[bug description]"
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
Debug systematically with quality gates.

Pipeline:
1. gsd:debug — scientific method, checkpoint state, persistent across context resets
2. Post-debug:
   - {stack}-review — review the fix for quality/correctness
   - verification-loop — confirm nothing else broke
</objective>

<execution_context>
@/Users/tunhanmra/Dev/bridge/skills/bridge/SKILL.md
</execution_context>

<context>
$ARGUMENTS
</context>

<process>
Execute the /bridge:debug pipeline from the SKILL.md.
Show the ━━━ BRIDGE ► DEBUG ━━━ banner.
</process>
