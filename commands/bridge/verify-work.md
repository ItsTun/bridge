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
Delegates to gsd:verify-work with no additional pipeline wrapping.
</objective>

<execution_context>
bridge/SKILL.md (loaded as plugin skill — already in context)
</execution_context>

<context>
$ARGUMENTS
</context>

<process>
Run gsd:verify-work with the provided arguments.
</process>
