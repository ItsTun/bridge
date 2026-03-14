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

Stack-to-testing-skill mapping:
| Stack            | Testing Skill                        |
|------------------|--------------------------------------|
| python/fastapi   | python-testing                       |
| python/django    | python-testing + django-tdd          |
| python/flask     | python-testing                       |
| node/next.js     | e2e-testing                          |
| node/express     | code-reviewer (no dedicated skill)   |
| go               | golang-testing                       |
| kotlin/ktor      | kotlin-testing                       |
| kotlin/android   | kotlin-testing                       |
| java/spring      | springboot-tdd                       |
| rust             | code-reviewer (no dedicated skill)   |
| unknown/fallback | code-reviewer                        |
</objective>

<execution_context>
bridge/SKILL.md (loaded as plugin skill — already in context)
</execution_context>

<context>
$ARGUMENTS
</context>

<process>
Run gsd:add-tests with the provided arguments.
Then determine the detected base stack from project-config.json and run the testing skill from the mapping table above.
</process>
