# Contributing to Bridge

PRs welcome.

## Adding a New Stack

1. Add detection signals + skill table to `skills/bridge/stack-map.md`
2. Add or update the pipeline block in `skills/bridge/SKILL.md`
3. Update the stack table in `README.md`
4. Add test cases to the checklist in `README.md`

## Adding a New Command

1. Create `commands/bridge/<command-name>.md` with YAML frontmatter:
   ```yaml
   ---
   name: bridge:<command-name>
   description: <one-line description>
   argument-hint: "<args>"
   allowed-tools:
     - <tool-list>
   ---
   ```
2. Add the pipeline block to `skills/bridge/SKILL.md`
3. Register the command in `README.md` Command Reference table
4. Add to `plugin.json` if needed

## Hook Changes

Hooks live in `hooks/`. Claude Code v2.1+ auto-loads `hooks/hooks.json`.
Do **not** add a `hooks` field to `plugin.json` — it causes duplicate registration.

## Testing

Run the manual test checklist in `README.md` after any change to `SKILL.md` or `stack-map.md`.

## Style

- Banner format: `━━━ BRIDGE ► STAGE NAME ━━━`
- Symbols: `✓` success, `✗` failure, `◆` gate, `○` step, `⚡` GSD sub-phase, `⚠` warning
- Keep pipeline steps minimal and sequential — no magic, no hidden state

## Reporting Issues

Open an issue at https://github.com/ItsTun/bridge/issues
