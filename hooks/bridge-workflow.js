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
 *                            Detected by naming convention, not hardcoded filenames.
 *                            Matches: *_store.*, *repository.*, *repo.*, models.*,
 *                            schema.*, database.*, db.*, or path contains migrations/
 *
 * The detailed per-file review reminders (python-review, security-review, etc.)
 * are handled by project-specific workflow hooks (e.g. xauusd-workflow.js).
 * This hook fires only generic, stack-agnostic reminders.
 *
 * State: /tmp/bridge-workflow-{session_id}.json
 */

const fs   = require('fs');
const path = require('path');
const os   = require('os');

// Generic DB file detection — matches common naming conventions across stacks.
// Does NOT hardcode project-specific filenames.
function isDbFile(filePath) {
  const name = path.basename(filePath).toLowerCase();
  const ext  = path.extname(name);
  const stem = name.slice(0, -ext.length);

  // Naming conventions: store, repository, repo, models, schema, database, db
  if (/(_store|repository|_repo|^models?|^schema|^database|^db)$/.test(stem)) return true;

  // Path contains migrations directory
  if (/(\/|\\)(migrations?|alembic|flyway|liquibase)(\/|\\)/.test(filePath)) return true;

  return false;
}

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
    };
    try { Object.assign(state, JSON.parse(fs.readFileSync(stateFile, 'utf8'))); } catch {}

    let message = null;

    // ── File-edit detection (Write / Edit) ─────────────────────────────────
    if ((tool_name === 'Write' || tool_name === 'Edit') && !state.db_patterns_injected) {
      const filePath = tool_input?.file_path || '';
      if (isDbFile(filePath)) {
        state.db_patterns_injected = true;
        try { fs.writeFileSync(stateFile, JSON.stringify(state)); } catch {}
        message = 'DB file edited — run /everything-claude-code:postgres-patterns (WAL mode, index design, concurrent access, INSERT OR REPLACE)';
        process.stdout.write(JSON.stringify({
          hookSpecificOutput: { hookEventName: 'PostToolUse', additionalContext: message }
        }));
      }
      process.exit(0);
    }

    // ── GSD commit detection (Bash) ─────────────────────────────────────────
    if (state.session_end_injected) process.exit(0);

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
      hookSpecificOutput: { hookEventName: 'PostToolUse', additionalContext: message }
    }));

    process.exit(0);
  } catch {
    process.exit(0);
  }
});
