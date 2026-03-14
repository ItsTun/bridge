---
name: bridge:session-end
description: Save session, extract patterns, evolve instincts — save-session + learn-eval + evolve
allowed-tools:
  - Read
  - Write
  - Bash
  - Glob
---
<objective>
Close a work session with full knowledge capture.

Pipeline:
1. save-session — write ~/.claude/sessions/<date>.md
2. learn-eval — extract reusable patterns, self-evaluate quality
3. evolve — cluster instincts, surface promotable patterns
</objective>

<execution_context>
bridge/SKILL.md (loaded as plugin skill — already in context)
</execution_context>

<context>
$ARGUMENTS
</context>

<process>
Execute the /bridge:session-end pipeline from the SKILL.md.
Show the ━━━ BRIDGE ► SESSION END ━━━ banner.
Run all three steps in sequence.
</process>
