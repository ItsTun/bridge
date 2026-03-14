---
name: bridge:plan-phase
description: Plan a phase with pre-gates (search-first, deep-research) + gsd:plan-phase + post-review
argument-hint: "[phase] [--auto] [--research] [--prd <file>]"
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
Plan a phase with bridge quality gates.

Pipeline:
1. Pre-gates: search-first (if new data source/API), deep-research (if novel library/technique)
2. gsd:plan-phase — creates PLAN.md
3. Post-review: ecc:plan — reviews PLAN.md for codebase-specific risks

All GSD flags pass through.
</objective>

<execution_context>
@/Users/tunhanmra/Dev/bridge/skills/bridge/SKILL.md
</execution_context>

<context>
$ARGUMENTS

Pipeline definition for bridge:plan-phase is in the SKILL.md under "### `/bridge:plan-phase`".
</context>

<process>
Execute the /bridge:plan-phase pipeline from the SKILL.md.
Show the ━━━ BRIDGE ► PLAN PHASE ━━━ banner.
</process>
