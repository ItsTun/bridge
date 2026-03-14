---
name: bridge:status
description: Show stack, GSD version, ECC status, instinct count, active skills, and current phase
allowed-tools:
  - Read
  - Bash
  - Glob
---
<objective>
Display full bridge status for the current project.

Shows:
- Detected stack + overlays
- GSD version
- ECC installed status
- Instinct count (project + global)
- Plankton hook status
- Continuous-learning-v2 status
- Active skills for this stack
- Current phase and next task
- Harness issues from last audit (if any)
</objective>

<execution_context>
@/Users/tunhanmra/Dev/bridge/skills/bridge/SKILL.md
</execution_context>

<context>
$ARGUMENTS

Pipeline definition for bridge:status is in the SKILL.md under "### `/bridge:status`".
Read .claude/project-config.json for stack + skills config.
</context>

<process>
Execute the /bridge:status pipeline from the SKILL.md.
Show the ━━━ BRIDGE ► STATUS ━━━ banner.
</process>
