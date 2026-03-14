---
name: bridge:discuss-phase
description: Gather phase context through adaptive questioning before planning
argument-hint: "[phase]"
allowed-tools:
  - Read
  - Write
  - Bash
  - Glob
  - AskUserQuestion
---
<objective>
Surface assumptions and gather context before committing to a plan.
Delegates to gsd:discuss-phase with no additional pipeline wrapping.
</objective>

<execution_context>
@/Users/tunhanmra/Dev/bridge/skills/bridge/SKILL.md
</execution_context>

<context>
$ARGUMENTS
</context>

<process>
Run gsd:discuss-phase with the provided arguments.
</process>
