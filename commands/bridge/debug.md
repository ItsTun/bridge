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
   - refactor-cleaner — clean up any temporary debug scaffolding
   - verification-loop — confirm nothing else broke
</objective>

<execution_context>
bridge/SKILL.md (loaded as plugin skill — already in context)
</execution_context>

<context>
$ARGUMENTS
</context>

<process>
Execute the /bridge:debug pipeline from the SKILL.md.
Show the ━━━ BRIDGE ► DEBUG ━━━ banner.
</process>
