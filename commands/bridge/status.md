---
name: bridge:status
description: Show stack, GSD version, ECC status, instinct count, active skills, and current phase
allowed-tools:
  - Read
  - Bash
  - Glob
---
<objective>
Display full bridge status for the current project.

Shows:
- Detected stack + overlays
- GSD version
- ECC installed status
- Instinct count (project + global)
- Plankton hook status
- Continuous-learning-v2 status
- Active skills for this stack
- Current phase and next task
- Harness issues from last audit (if any)
</objective>

<execution_context>
bridge/SKILL.md (loaded as plugin skill — already in context)
</execution_context>

<context>
$ARGUMENTS

Read .claude/project-config.json for stack + skills config.
</context>

<process>
Gather live data by reading each source below. Do not use memory or template values.

**Step 1 — Read STATE.md**
Read `.planning/STATE.md` from the project root. Extract:
- `stopped_at` → current phase/task
- `last_updated` → timestamp of last state write
- `status` → executing / paused / complete
- `milestone` + `milestone_name` → milestone identifier

**Step 2 — Read project-config.json**
Read `.claude/project-config.json`. Extract:
- `bridge` → bridge plugin version
- `stack.base` + `stack.overlays` → stack string (e.g. "python/fastapi + nextjs")
- `skills` → list the map keys and their skill arrays
- `continuous_learning_v2` → enabled / disabled
- `plankton_hook` → wired / not_installed
- `blocked_packages` → count (e.g. "1 blocked")

**Step 3 — Count instincts**
Run: `ls ~/.claude/projects/ | head -20` to find the project hash directory.
In that directory, check for `instincts.json`. If found, count entries: `cat ~/.claude/projects/<hash>/instincts.json | python3 -c "import sys,json; d=json.load(sys.stdin); print(len(d.get('instincts',[])))" 2>/dev/null`.
Also check `~/.claude/instincts.json` for global instincts and count the same way.
If either file is missing, show 0 for that count.

**Step 4 — Find most recent session file**
List `~/.claude/sessions/` (if it exists). Find the most recently modified `.md` or `.tmp` file. Compute age in hours. If no files: show "none".

**Step 5 — Check hooks registration**
Read `~/.claude/settings.json`. Verify that SessionStart, PreToolUse, and PostToolUse hooks include bridge hook entries. Show "✓ registered" or "✗ missing" per hook type.

**Step 6 — Render the STATUS banner with live data**
Print exactly this banner, substituting the live values gathered above:

```
━━━ BRIDGE ► STATUS ━━━

Stack:        {stack.base} + {overlays}   [detected]
Bridge:       v{bridge}                   [✓]
GSD:          {run: node ~/.claude/get-shit-done/bin/gsd-tools.cjs version 2>/dev/null || echo "installed"}
Instincts:    {project_count} project / {global_count} global   [{✓ or ✗}]
Plankton:     {plankton_hook}             [{✓ or ⚠}]
Learning:     continuous-learning-v2 {continuous_learning_v2}   [{✓ or ⚠}]
Blocked pkgs: {blocked_packages count}   [⚠ if > 0, ✓ if 0]

Hooks:
  SessionStart:  {✓ registered | ✗ missing}
  PreToolUse:    {✓ registered | ✗ missing}
  PostToolUse:   {✓ registered | ✗ missing}

Active skills for this stack:
  {list skills from config, comma-separated by trigger key}

Session file: {filename} ({age}h ago) | none
Phase:        {stopped_at}
Last updated: {last_updated}
Status:       {status}
```

Use ✓ for healthy values, ⚠ for warnings (plankton not_installed, learning disabled, hooks missing), ✗ for failures.
</process>
