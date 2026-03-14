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
bridge/SKILL.md (loaded as plugin skill — already in context)
</execution_context>

<context>
$ARGUMENTS

Pipeline definition for bridge:init is in the SKILL.md under "### `/bridge:init`".
Stack detection rules are in bridge/stack-map.md (loaded as plugin skill — already in context)
</context>

<process>
Show the ━━━ BRIDGE ► INIT ━━━ banner. Then follow these steps exactly:

Wave 1 — Explore
  a. Run gsd:map-codebase → writes .planning/CODEMAPS/
  b. Scan project root for stack detection signals (pyproject.toml, go.mod, package.json, etc.) using stack-map.md lookup
  c. Run skill-create → extracts patterns from git log into a new project skill

Wave 2 — Configure
  a. harness-audit → optimize tool definitions
  b. Wire plankton-code-quality PostToolUse hook:
     - Read ~/.claude/settings.json
     - If hooks.PostToolUse array does not contain "plankton-code-quality", append it
     - Write updated settings.json
     - Set project-config.json → "plankton_hook": "wired"
  c. Enable continuous-learning-v2:
     - Read ~/.claude/settings.json
     - Locate or create the continuous_learning setting and set to "v2"
     - Write updated settings.json
     - Set project-config.json → "continuous_learning_v2": "enabled"
  d. Initialize instincts.json:
     - Determine project hash path: ~/.claude/projects/<project-hash>/instincts.json
       (project hash = base64url of absolute project path, same as Claude Code uses)
     - If instincts.json does not exist, create it with: {"instincts": [], "version": "1.0"}
     - Set project-config.json → "instincts": "initialized"

Wave 3 — Bootstrap
  a. Write CLAUDE.md workflow protocol block. Use this exact template, substituting [STACK] and [DB_FILES]:

     ## Workflow Protocol (self-enforced — always follow this)

     <!-- Bridge: do not remove this block -->
     **Stack:** [STACK]

     **AUTOMATION RULE: Run every post-step automatically, without waiting for the user to ask.**

     ### For every `/bridge:quick` task
     1. `/bridge:quick "task"` — GSD + ECC quality gates
     2. **Auto-run:** Stack-specific review (e.g., python-review if .py changed)
     3. **Auto-run:** `/everything-claude-code:verification-loop` (always)
     4. End of session: `/bridge:session-end`

     ### For every `/bridge:plan-phase` task
     1. **Auto-run:** `/everything-claude-code:search-first` (if new data source or API in scope)
     2. **Auto-run:** `/everything-claude-code:deep-research` (if novel library or technique)
     3. `/bridge:plan-phase` — creates PLAN.md
     4. **Auto-run:** `/everything-claude-code:plan` to review PLAN.md for codebase-specific risks

     ### For every `/bridge:execute-phase` task
     1. `/bridge:execute-phase` — wave-based execution
     2. **Auto-run:** Stack-specific review (all modified backend files)
     3. **Auto-run:** `/everything-claude-code:verification-loop` (always)
     4. **Auto-run:** `/everything-claude-code:security-review` (if endpoints or env vars changed)
     5. End of session: `/bridge:session-end`

     ### Always — before adding any dependency
     - **Auto-run** `/everything-claude-code:search-first` before `pip install` or `npm install`

     ### Always — [DB_FILES] schema changes
     - **Auto-run** `/everything-claude-code:postgres-patterns` when editing [DB_FILES]

     ### Hooks are active — they inject reminders only
     Bridge hooks fire automatically but cannot invoke skills. Claude must act on reminders immediately.

  b. Write .claude/project-config.json with detected stack + skills map
  c. Write .claude/config.json with model routing (planner: claude-opus-4-5, executor: claude-sonnet-4-5, checker: claude-haiku-3-5 or detected equivalent)

End with bridge:status to verify.
</process>
