#!/usr/bin/env node
/**
 * bridge-workflow.js — PostToolUse hook
 *
 * Fires after each tool use in any GSD project.
 *
 * TRIGGERS:
 *   GSD quick task commit  → remind /bridge:session-end (once per session)
 *   GSD phase commit       → remind /bridge:session-end (once per session)
 *   DB file edited         → remind postgres-patterns (once per session)
 *   Async file edited      → remind python-patterns (once per session)
 *   Scheduler file edited  → remind backend-patterns (once per session)
 *
 * The detailed per-file review reminders (python-review, security-review, etc.)
 * are handled by project-specific workflow hooks (e.g. xauusd-workflow.js).
 * This hook fires the generic session-end pipeline reminder and Tier 2 skill triggers.
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
    let state = {
      session_end_injected: false,
      db_patterns_injected: false,
      python_patterns_injected: false,
      backend_patterns_injected: false,
    };
    try { Object.assign(state, JSON.parse(fs.readFileSync(stateFile, 'utf8'))); } catch {}

    const DB_FILES        = new Set(['trade_store.py', 'brief_store.py', 'backtest_runner.py']);
    const ASYNC_FILES     = new Set(['oanda_stream.py', 'data_fetcher.py', 'main.py']);
    const SCHEDULER_FILES = new Set(['main.py']);

    let message = null;

    // File-edit detection — fires on Write or Edit tool uses
    if (tool_name === 'Write' || tool_name === 'Edit') {
      const filePath = tool_input?.file_path || '';
      const filename = path.basename(filePath);

      if (DB_FILES.has(filename) && !state.db_patterns_injected) {
        state.db_patterns_injected = true;
        try { fs.writeFileSync(stateFile, JSON.stringify(state)); } catch {}
        message = 'DB file edited — run /everything-claude-code:postgres-patterns (WAL mode, index design, concurrent access, INSERT OR REPLACE)';
      }

      if (ASYNC_FILES.has(filename) && !state.python_patterns_injected) {
        state.python_patterns_injected = true;
        try { fs.writeFileSync(stateFile, JSON.stringify(state)); } catch {}
        message = message
          ? message + '\nAsync file edited — run /everything-claude-code:python-patterns (asyncio.to_thread, event loop safety)'
          : 'Async file edited — run /everything-claude-code:python-patterns (asyncio.to_thread, event loop safety)';
      }

      if (SCHEDULER_FILES.has(filename) && !state.backend_patterns_injected) {
        state.backend_patterns_injected = true;
        try { fs.writeFileSync(stateFile, JSON.stringify(state)); } catch {}
        message = message
          ? message + '\nScheduler file edited — run /everything-claude-code:backend-patterns (APScheduler factory pattern, lifespan lifecycle)'
          : 'Scheduler file edited — run /everything-claude-code:backend-patterns (APScheduler factory pattern, lifespan lifecycle)';
      }

      if (message) {
        process.stdout.write(JSON.stringify({
          hookSpecificOutput: {
            hookEventName: 'PostToolUse',
            additionalContext: message,
          }
        }));
      }
      process.exit(0);
    }

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
    message =
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
