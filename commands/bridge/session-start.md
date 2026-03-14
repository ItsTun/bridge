---
name: bridge:session-start
description: Restore session context — resume-session + instinct-status + gsd:progress
allowed-tools:
  - Read
  - Bash
  - Glob
  - Grep
---
<objective>
Restore full context at the start of a work session.

Pipeline:
1. resume-session — load last session file from ~/.claude/sessions/
2. instinct-status — print project + global instincts
3. gsd:progress — show current phase, next task, blocking issues
</objective>

<execution_context>
bridge/SKILL.md (loaded as plugin skill — already in context)
</execution_context>

<context>
$ARGUMENTS
</context>

<process>
Show the banner, then run the three pipeline steps in sequence.

Print: `━━━ BRIDGE ► SESSION START ━━━`

**Step 1 — Check for session files**
Run: `ls ~/.claude/sessions/ 2>/dev/null | grep -E '\.(md|tmp)$' | head -5`

If files are found:
  - Print: `○ resume-session`
  - Run `/everything-claude-code:resume-session` to load the most recent session file.

If no files found (empty output or directory missing):
  - Print: `⚠ No session file found — starting fresh (skipping resume-session)`
  - Skip the resume-session step entirely.

**Step 2 — Always run instinct-status**
Print: `○ instinct-status`
Run `/everything-claude-code:instinct-status` to print project + global instincts.

**Step 3 — Always run gsd:progress**
Print: `○ gsd:progress`
Run `/gsd:progress` to show current phase, next task, and blocking issues.

**Step 4 — Print completion**
Print: `✓ Context restored — ready to work`

Then show:
```
╔═══════════════════════════════════╗
║  Next Up → /bridge:quick "task"   ║
╚═══════════════════════════════════╝
```
</process>
