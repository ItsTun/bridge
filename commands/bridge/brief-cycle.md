---
name: bridge:brief-cycle
description: Oracle improvement loop — run task, evaluate brief quality, synthesize prompt improvements, capture patterns
argument-hint: '"task description"'
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
Run a full oracle improvement cycle: implement a task, evaluate brief quality, optimize the prompt, and capture learnings.

Pipeline:
1. gsd:quick "{task}" — implement the oracle improvement task with atomic commit
2. Post-step gates:
   - eval_brief.py — run oracle evaluation against latest brief (python .claude/evals/oracle/eval_brief.py)
   - prompt-optimize — synthesize improvements from evaluation output
   - learn-eval — capture patterns and evaluation results
</objective>

<execution_context>
bridge/SKILL.md (loaded as plugin skill — already in context)
</execution_context>

<context>
$ARGUMENTS
</context>

<process>
Execute the /bridge:brief-cycle pipeline from the SKILL.md.
Show the ━━━ BRIDGE ► BRIEF CYCLE ━━━ banner.
Run all post-gates automatically — do not pause or ask.
If eval_brief.py is not present, skip that gate and note it in output.
</process>
