---
name: bridge:verify-work
description: Validate built features through conversational UAT
argument-hint: "[phase]"
allowed-tools:
  - Read
  - Bash
  - Glob
  - Grep
  - AskUserQuestion
---
<objective>
Run conversational UAT to validate that built features meet requirements.
After UAT passes, runs e2e-testing if frontend components were involved.
</objective>

<execution_context>
bridge/SKILL.md (loaded as plugin skill — already in context)
</execution_context>

<context>
$ARGUMENTS
</context>

<process>
Show the ━━━ BRIDGE ► VERIFY WORK ━━━ banner.

Execute the /bridge:verify-work pipeline from SKILL.md.
</process>
