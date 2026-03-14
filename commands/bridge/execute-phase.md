---
name: bridge:execute-phase
description: Execute a phase with wave orchestration + stack-driven post-gates (review, security, e2e)
argument-hint: "<phase-number> [--gaps-only]"
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
Execute a phase with full bridge quality gates.

Pipeline:
1. gsd:execute-phase — wave-based execution, atomic commits
2. Post-execution gates (stack-driven):
   - {stack}-review (e.g. python-review, go-reviewer, kotlin-reviewer)
   - eval_brief.py (project-specific — if oracle files changed)
   - verification-loop (always)
   - security-review (if endpoints or env vars changed)
   - e2e (if frontend components changed)
   - docker-patterns / deployment-patterns (if overlays active)
</objective>

<execution_context>
@/Users/tunhanmra/Dev/bridge/skills/bridge/SKILL.md
</execution_context>

<context>
$ARGUMENTS

Pipeline definition for bridge:execute-phase is in the SKILL.md under "### `/bridge:execute-phase`".
Stack-to-skill mapping is in @/Users/tunhanmra/Dev/bridge/skills/bridge/stack-map.md
</context>

<process>
Execute the /bridge:execute-phase pipeline from the SKILL.md.
Show the ━━━ BRIDGE ► EXECUTE PHASE ━━━ banner.
Run post-gates automatically — do not pause or ask.
</process>
