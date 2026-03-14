---
name: bridge:health
description: Diagnose planning directory health + verify bridge/ECC config
allowed-tools:
  - Read
  - Bash
  - Glob
  - Grep
---
<objective>
Run a full health check on the project setup.

Pipeline:
1. gsd:health — diagnose .planning/, STATE.md, ROADMAP.md
2. bridge:status — verify ECC + stack config, flag any harness issues
</objective>

<execution_context>
bridge/SKILL.md (loaded as plugin skill — already in context)
</execution_context>

<context>
$ARGUMENTS
</context>

<process>
Execute the /bridge:health pipeline from the SKILL.md.
Show the ━━━ BRIDGE ► HEALTH ━━━ banner.
</process>
