---
name: bridge:session-start
description: Restore session context — resume-session + instinct-status + gsd:progress
allowed-tools:
  - Read
  - Bash
  - Glob
  - Grep
---
<objective>
Restore full context at the start of a work session.

Pipeline:
1. resume-session — load last session file from ~/.claude/sessions/
2. instinct-status — print project + global instincts
3. gsd:progress — show current phase, next task, blocking issues
</objective>

<execution_context>
@/Users/tunhanmra/Dev/bridge/skills/bridge/SKILL.md
</execution_context>

<context>
$ARGUMENTS
</context>

<process>
Execute the /bridge:session-start pipeline from the SKILL.md.
Show the ━━━ BRIDGE ► SESSION START ━━━ banner.
Run all three steps in sequence.
</process>
