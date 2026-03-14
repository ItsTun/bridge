---
name: bridge:add-tests
description: Generate tests for a completed phase based on UAT criteria and stack testing patterns
argument-hint: "[phase]"
allowed-tools:
  - Read
  - Write
  - Edit
  - Glob
  - Grep
  - Bash
  - Task
  - Agent
---
<objective>
Generate tests for a completed phase with stack-appropriate testing patterns.

Pipeline:
1. gsd:add-tests — generates tests based on UAT criteria
2. {stack}-testing review (e.g. python-testing for FastAPI)
</objective>

<execution_context>
bridge/SKILL.md (loaded as plugin skill — already in context)
</execution_context>

<context>
$ARGUMENTS
</context>

<process>
Run gsd:add-tests with the provided arguments.
Then run the appropriate stack testing skill from stack-map.md.
</process>
