---
name: bridge:smoke-test
description: Verify bridge is working — tests stack detection, hook injection, and a dry-run gate execution
allowed-tools: [Read, Bash, Glob]
---
<objective>
Verify bridge is correctly installed and configured for this project.
</objective>
<process>
1. Check .claude/project-config.json exists and is valid JSON
2. Check ~/.claude/settings.json has SessionStart, PreToolUse, PostToolUse bridge hooks registered
3. Check bridge skills are loaded (SKILL.md and stack-map.md accessible)
4. Verify stack was detected correctly (read project-config.json stack field)
5. Dry-run: show which skills WOULD fire for a hypothetical .py file edit (no actual execution)
6. Show ━━━ BRIDGE ► SMOKE TEST ━━━ banner with ✓/⚠ for each check
</process>
