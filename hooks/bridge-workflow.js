#!/usr/bin/env node
/**
 * bridge-workflow.js — PostToolUse hook
 *
 * Fires after each tool use in any GSD project.
 *
 * TRIGGERS:
 *   GSD quick task commit  → remind /bridge:session-end (once per session)
 *   GSD phase commit       → remind /bridge:session-end (once per session)
 *
 * The detailed per-file review reminders (python-review, security-review, etc.)
 * are handled by project-specific workflow hooks (e.g. xauusd-workflow.js).
 * This hook only fires the generic session-end pipeline reminder.
 *
 * State: /tmp/bridge-workflow-{session_id}.json
 */

const fs   = require('fs');
const path = require('path');
const os   = require('os');

const stdinTimeout = setTimeout(() => process.exit(0), 3000);
let input = '';
process.stdin.setEncoding('utf8');
process.stdin.on('data', c => { input += c; });
process.stdin.on('end', () => {
  clearTimeout(stdinTimeout);
  try {
    const event = JSON.parse(input);
    const { session_id, tool_name, tool_input, tool_output } = event;
    if (!session_id) process.exit(0);

    // Only activate in GSD projects
    const cwd = event.cwd || process.cwd();
    if (!fs.existsSync(path.join(cwd, '.planning', 'STATE.md'))) process.exit(0);

    const stateFile = path.join(os.tmpdir(), `bridge-workflow-${session_id}.json`);
    let state = { session_end_injected: false };
    try { Object.assign(state, JSON.parse(fs.readFileSync(stateFile, 'utf8'))); } catch {}

    // Already reminded this session — exit
    if (state.session_end_injected) process.exit(0);

    // Detect GSD commit completion via Bash output
    if (tool_name !== 'Bash') {
      try { fs.writeFileSync(stateFile, JSON.stringify(state)); } catch {}
      process.exit(0);
    }

    const output = tool_output?.output || '';
    const isQuickCommit = /\[.*\].*\(quick-\d+\)/.test(output);
    const isPhaseCommit = /\[.*\].*\(phase-\d+\)/.test(output);
    const hasChanges    = /\d+\s+file.*changed/.test(output);

    if (!((isQuickCommit || isPhaseCommit) && hasChanges)) {
      try { fs.writeFileSync(stateFile, JSON.stringify(state)); } catch {}
      process.exit(0);
    }

    // Read project-config to surface the right session-end skills
    let sessionEndSkills = 'save-session → learn-eval → evolve';
    try {
      const cfg = JSON.parse(fs.readFileSync(path.join(cwd, '.claude', 'project-config.json'), 'utf8'));
      const skills = cfg.skills?.session_end;
      if (Array.isArray(skills) && skills.length) {
        sessionEndSkills = skills.map(s => `/everything-claude-code:${s}`).join(' → ') + ' → /everything-claude-code:evolve';
      }
    } catch { /* use default */ }

    state.session_end_injected = true;
    try { fs.writeFileSync(stateFile, JSON.stringify(state)); } catch {}

    const taskType = isPhaseCommit ? 'Phase' : 'Quick task';
    const message =
      `${taskType} complete (bridge detected GSD commit).\n` +
      `When done for the session, run:\n` +
      `   /bridge:session-end  →  ${sessionEndSkills}\n` +
      `\nOr run the full pipeline: /bridge:session-end`;

    process.stdout.write(JSON.stringify({
      hookSpecificOutput: {
        hookEventName: 'PostToolUse',
        additionalContext: message,
      }
    }));

    process.exit(0);
  } catch {
    process.exit(0);
  }
});
