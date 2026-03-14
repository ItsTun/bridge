---
name: bridge:configure
description: Interactively update project-config.json fields
allowed-tools:
  - Read
  - Write
  - Bash
  - AskUserQuestion
---
<objective>
Show current project-config.json values and let user update any field interactively.
</objective>

<execution_context>
bridge/SKILL.md (loaded as plugin skill — already in context)
</execution_context>

<context>
$ARGUMENTS
</context>

<process>
Show the ━━━ BRIDGE ► CONFIGURE ━━━ banner.

Execute the /bridge:configure pipeline from SKILL.md.
</process>
