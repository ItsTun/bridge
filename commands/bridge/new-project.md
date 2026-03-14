---
name: bridge:new-project
description: Initialize a new project with research + gsd:new-project + bridge:init wiring
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
Set up a new project with full bridge pipeline.

Pipeline:
1. Pre-research: search-first (always) + deep-research (domain research)
2. gsd:new-project — roadmap, milestone, phase breakdown
3. bridge:init — stack detection + ECC wiring
4. verification-loop
</objective>

<execution_context>
bridge/SKILL.md (loaded as plugin skill — already in context)
</execution_context>

<context>
$ARGUMENTS
</context>

<process>
Execute the /bridge:new-project pipeline from the SKILL.md.
Show the ━━━ BRIDGE ► NEW PROJECT ━━━ banner.
</process>
