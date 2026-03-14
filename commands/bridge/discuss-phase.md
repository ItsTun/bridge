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
Asks a pre-gate question, optionally runs search-first, then delegates to gsd:discuss-phase.
</objective>

<execution_context>
bridge/SKILL.md (loaded as plugin skill — already in context)
</execution_context>

<context>
$ARGUMENTS
</context>

<process>
Show the ━━━ BRIDGE ► DISCUSS PHASE ━━━ banner.

Execute the /bridge:discuss-phase pipeline from SKILL.md.
</process>
