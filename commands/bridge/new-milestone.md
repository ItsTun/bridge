---
name: bridge:new-milestone
description: Transition to new milestone — audit + complete + new + learn-eval + evolve
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
Transition to a new milestone with knowledge capture.

Pipeline:
1. gsd:audit-milestone — validate current milestone completeness
2. gsd:complete-milestone — archive
3. gsd:new-milestone — initialize next cycle
4. learn-eval — extract patterns before context wipe
5. evolve — promote strong instincts
</objective>

<execution_context>
@/Users/tunhanmra/Dev/bridge/skills/bridge/SKILL.md
</execution_context>

<context>
$ARGUMENTS
</context>

<process>
Execute the /bridge:new-milestone pipeline from the SKILL.md.
Show the ━━━ BRIDGE ► NEW MILESTONE ━━━ banner.
</process>
