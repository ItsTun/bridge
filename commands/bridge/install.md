---
name: bridge:install
description: Detect runtime and install GSD + ECC if missing
allowed-tools:
  - Bash
---
<objective>
Install GSD and ECC for the current runtime.

Pipeline:
1. Detect runtime (claude --version / opencode / gemini / codex)
2. npx -y get-shit-done-cc@latest --{runtime} --global
3. npm install -g ecc-universal
4. Verify: gsd:help + ecc:instinct-status
</objective>

<execution_context>
@/Users/tunhanmra/Dev/bridge/skills/bridge/SKILL.md
</execution_context>

<context>
$ARGUMENTS
</context>

<process>
Execute the /bridge:install pipeline from the SKILL.md.
Show the ━━━ BRIDGE ► INSTALL ━━━ banner.
</process>
