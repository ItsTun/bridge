---
name: bridge:eval
description: Run the project-specific evaluation script defined in project-config.json
allowed-tools:
  - Read
  - Bash
  - Glob
---
<objective>
Run the project-specific eval script from .claude/project-config.json.

Useful for oracle evaluation, model scoring, or any project-specific quality check that is too project-specific to be a named ECC skill.

Reads project_specific.eval_script from .claude/project-config.json and runs it via Bash. Shows formatted results with pass/fail/score detection.
</objective>

<execution_context>
bridge/SKILL.md (loaded as plugin skill — already in context)
</execution_context>

<context>
$ARGUMENTS

Pipeline definition for bridge:eval is in the SKILL.md under "### `/bridge:eval`".
</context>

<process>
Show the ━━━ BRIDGE ► EVAL ━━━ banner. Then follow these steps exactly:

Step 1 — Show banner
  Print: ━━━ BRIDGE ► EVAL ━━━

Step 2 — Read project-config.json
  a. Try Read .claude/project-config.json
  b. If the file does not exist → print "⚠ No project-config.json found — run /bridge:init first" and stop.

Step 3 — Extract eval_script
  a. Read project_specific.eval_script from the config.
  b. If absent or empty → print:
       ⚠ No eval_script configured in project-config.json.
       Add: project_specific.eval_script = "your command here"
     and stop.

Step 4 — Note eval_trigger (if set)
  a. Read project_specific.eval_trigger from the config.
  b. If present → print:
       Auto-trigger: this script runs automatically when [eval_trigger].

Step 5 — Run eval_script
  a. Run eval_script via Bash. Capture stdout and stderr.

Step 6 — Display formatted results
  a. Show full output from the script.
  b. If output contains "PASS" or exit code is 0 → print "✓ Eval passed"
  c. If output contains "FAIL" or exit code is non-zero → print "✗ Eval failed — see output above"
  d. If output contains a numeric score pattern (e.g., "Score: 87") → surface it explicitly: "Score: 87"

Step 7 — Show Next Up block

╔═══════════════════════════════════╗
║  Next Up → /bridge:session-end    ║
╚═══════════════════════════════════╝
</process>
