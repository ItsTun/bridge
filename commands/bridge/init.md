---
name: bridge:init
description: Bootstrap a project (brownfield or greenfield) with stack detection, codebase map, ECC wiring, and config files
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
Bootstrap the current project with bridge quality gates.

Brownfield path (existing code):
- Wave 1: gsd:map-codebase → stack detection → skill-create
- Wave 2: harness-audit → enable continuous-learning-v2 → wire plankton hook
- Wave 3: write CLAUDE.md bridge block + .claude/project-config.json + .claude/config.json

Greenfield path (no source files yet):
- Stack scan → gsd:new-project → bridge:init (configure only)
</objective>

<execution_context>
@/Users/tunhanmra/Dev/bridge/skills/bridge/SKILL.md
</execution_context>

<context>
$ARGUMENTS

Pipeline definition for bridge:init is in the SKILL.md under "### `/bridge:init`".
Stack detection rules are in @/Users/tunhanmra/Dev/bridge/skills/bridge/stack-map.md
</context>

<process>
Execute the /bridge:init pipeline defined in the SKILL.md.
Follow Wave 1 → Wave 2 → Wave 3 order.
Show the ━━━ BRIDGE ► INIT ━━━ banner.
End with bridge:status to verify.
</process>
