#!/usr/bin/env node
/**
 * bridge-workflow.js — PostToolUse hook
 *
 * Fires after each tool use in any GSD project.
 *
 * TRIGGERS (all deduplicated via state file — fire at most once per session):
 *   Write / Edit — eval trigger file   → remind to run eval_script from project-config.json
 *   Write / Edit — DB file             → remind postgres-patterns
 *                                         Detected by naming convention AND config sqlite_db path.
 *                                         Matches: *_store.*, *repository.*, *repo.*, models.*,
 *                                         schema.*, database.*, db.*, or path contains migrations/
 *   Write / Edit — endpoint file       → remind on_endpoint_change skill(s) from config
 *                                         Matches routers/, api/, routes/ dirs or *controller.* / *route.* names
 *   Write / Edit — test file           → remind on_test_change skill(s) from config
 *                                         Matches test_*.py, *.test.ts/js, *.spec.ts/js, /tests/ dirs
 *   Write / Edit — TypeScript/TSX      → remind on_ts_tsx_change skill(s) from config
 *                                         (skipped if already matched as endpoint or test)
 *   Write / Edit — Python              → remind on_py_change skill(s) from config
 *                                         (skipped if already matched as endpoint or test)
 *   GSD quick task commit              → remind /bridge:session-end (once per session)
 *   GSD phase commit                   → remind /bridge:session-end (once per session)
 *
 * Projects without project-config.json still receive the DB naming-convention reminder.
 * If project-config.json is malformed or missing the hook fails silently.
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

// Load project-config.json from {cwd}/.claude/project-config.json.
// Returns parsed object or null on any error (file missing, JSON parse fail).
// Never throws.
function loadProjectConfig(cwd) {
  try {
    return JSON.parse(fs.readFileSync(path.join(cwd, '.claude', 'project-config.json'), 'utf8'));
  } catch {
    return null;
  }
}

// Format a skill reminder message.
// skills is string[] from config; each entry becomes /everything-claude-code:<skill>
function formatSkillReminder(prefix, skills) {
  return `${prefix} — run: ${skills.map(s => '/everything-claude-code:' + s).join(' + ')}`;
}

// Classify a file edit into zero or more reminder triggers.
// Returns array of { stateKey, skills, message } objects.
// Multiple entries are returned when a file matches multiple independent rules.
function classifyFile(filePath, cfg) {
  const triggers = [];
  const basename = path.basename(filePath);

  // Track which category-level matches occurred to suppress generic catches
  let matchedAsEndpoint = false;
  let matchedAsTest = false;

  // a. EVAL TRIGGER (highest specificity — check first)
  if (cfg?.project_specific?.eval_trigger) {
    const evalFilename = cfg.project_specific.eval_trigger.split(/\s+/)[0];
    if (evalFilename && basename === evalFilename) {
      triggers.push({
        stateKey: 'eval_trigger_injected',
        skills: [cfg.project_specific.eval_script],
        message: `Oracle prompt changed — run: ${cfg.project_specific.eval_script}`,
      });
    }
  }

  // b. DB FILE
  const configDbBasename = cfg?.project_specific?.sqlite_db
    ? path.basename(cfg.project_specific.sqlite_db)
    : null;
  if (isDbFile(filePath) || (configDbBasename && basename === configDbBasename)) {
    const dbSkills = cfg?.skills?.on_db_change || ['postgres-patterns'];
    triggers.push({
      stateKey: 'db_patterns_injected',
      skills: dbSkills,
      message: 'DB file edited — run /everything-claude-code:postgres-patterns (WAL mode, index design, concurrent access, INSERT OR REPLACE)',
    });
  }

  // c. ENDPOINT FILE
  if (cfg?.skills?.on_endpoint_change) {
    const inEndpointDir = /\/(routers?|api|routes?)\//i.test(filePath);
    const isEndpointName = /(controller|route)\.(py|ts|js)$/i.test(basename);
    if (inEndpointDir || isEndpointName) {
      matchedAsEndpoint = true;
      triggers.push({
        stateKey: 'endpoint_injected',
        skills: cfg.skills.on_endpoint_change,
        message: formatSkillReminder('Endpoint file changed', cfg.skills.on_endpoint_change),
      });
    }
  }

  // d. TEST FILE
  if (cfg?.skills?.on_test_change) {
    const isTestFile = /(^|\/)test[_-].*\.(py|ts|js)$|\.test\.(ts|js|tsx)$|\.spec\.(ts|js|tsx)$|(\/|\\)(tests?)(\/|\\)/i.test(filePath);
    if (isTestFile) {
      matchedAsTest = true;
      triggers.push({
        stateKey: 'test_injected',
        skills: cfg.skills.on_test_change,
        message: formatSkillReminder('Test file changed', cfg.skills.on_test_change),
      });
    }
  }

  // e. TYPESCRIPT/TSX (skip if already matched as endpoint or test)
  if (cfg?.skills?.on_ts_tsx_change && !matchedAsEndpoint && !matchedAsTest) {
    if (/\.(ts|tsx)$/i.test(filePath)) {
      triggers.push({
        stateKey: 'ts_tsx_injected',
        skills: cfg.skills.on_ts_tsx_change,
        message: formatSkillReminder('TypeScript file changed', cfg.skills.on_ts_tsx_change),
      });
    }
  }

  // f. PYTHON (skip if already matched as endpoint or test)
  if (cfg?.skills?.on_py_change && !matchedAsEndpoint && !matchedAsTest) {
    if (/\.py$/i.test(filePath)) {
      triggers.push({
        stateKey: 'py_injected',
        skills: cfg.skills.on_py_change,
        message: formatSkillReminder('Python file changed', cfg.skills.on_py_change),
      });
    }
  }

  return triggers;
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
      eval_trigger_injected: false,
      endpoint_injected: false,
      test_injected: false,
      ts_tsx_injected: false,
      py_injected: false,
    };
    try { Object.assign(state, JSON.parse(fs.readFileSync(stateFile, 'utf8'))); } catch {}

    // ── File-edit detection (Write / Edit) ─────────────────────────────────
    if (tool_name === 'Write' || tool_name === 'Edit') {
      const filePath = tool_input?.file_path || '';
      const cfg = loadProjectConfig(cwd);
      const triggers = classifyFile(filePath, cfg);
      const messages = [];
      let stateChanged = false;
      for (const trigger of triggers) {
        if (!state[trigger.stateKey]) {
          state[trigger.stateKey] = true;
          stateChanged = true;
          messages.push(trigger.message);
        }
      }
      if (stateChanged) {
        try { fs.writeFileSync(stateFile, JSON.stringify(state)); } catch {}
      }
      if (messages.length) {
        process.stdout.write(JSON.stringify({
          hookSpecificOutput: { hookEventName: 'PostToolUse', additionalContext: messages.join('\n\n') }
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
    const message =
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
