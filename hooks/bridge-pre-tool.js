#!/usr/bin/env node
/**
 * bridge-pre-tool.js — PreToolUse hook
 *
 * Fires before Bash tool executions in any GSD project.
 * - Detects pip/pip3/npm/yarn/pnpm install commands
 * - Reads .claude/project-config.json for blocked_packages[]
 * - Emits search-first reminder (once per session via /tmp state file)
 * - Blocks if any package in the command matches blocked_packages
 *
 * State: /tmp/bridge-pre-tool-{session_id}.json
 * Activation: only fires if .planning/STATE.md exists in cwd.
 */

const fs   = require('fs');
const path = require('path');
const os   = require('os');

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

// Extract candidate package names from an install command string.
// Strips the installer prefix words and flag tokens (anything starting with -).
// Normalizes by lowercasing and stripping version specifiers.
function extractPackageNames(command) {
  // Remove the installer prefix (pip install / pip3 install / npm install / yarn add / pnpm add)
  const stripped = command
    .replace(/\bpip3?\s+install\b/i, '')
    .replace(/\bnpm\s+install\b/i, '')
    .replace(/\byarn\s+add\b/i, '')
    .replace(/\bpnpm\s+add\b/i, '');

  return stripped
    .split(/\s+/)
    .map(t => t.trim())
    .filter(t => t.length > 0 && !t.startsWith('-'))
    // Strip version specifiers: >=, ==, <=, ~=, !=, @, [extras]
    .map(t => t.replace(/[><=!~@].*$/, '').replace(/\[.*\]$/, '').toLowerCase())
    .filter(t => t.length > 0);
}

const INSTALL_RE = /\b(pip3?\s+install|npm\s+install|yarn\s+add|pnpm\s+add)\b/i;

const SEARCH_FIRST_TEXT =
  'Before installing: run /everything-claude-code:search-first to check:\n' +
  '   \u2022 Is this already in requirements.txt / package.json?\n' +
  '   \u2022 Is there an MCP server that provides this capability instead?\n' +
  '   \u2022 Does an existing installed package already cover this use case?';

const stdinTimeout = setTimeout(() => process.exit(0), 3000);
let input = '';
process.stdin.setEncoding('utf8');
process.stdin.on('data', c => { input += c; });
process.stdin.on('end', () => {
  clearTimeout(stdinTimeout);
  try {
    const event = JSON.parse(input);
    const { session_id, tool_name, tool_input } = event;
    const cwd = event.cwd || process.cwd();

    // Only activate in GSD projects
    if (!fs.existsSync(path.join(cwd, '.planning', 'STATE.md'))) process.exit(0);

    // Only intercept Bash tool
    if (tool_name !== 'Bash') process.exit(0);

    // Only intercept install commands
    const command = tool_input?.command || '';
    if (!INSTALL_RE.test(command)) process.exit(0);

    // Load session state
    const stateFile = path.join(os.tmpdir(), `bridge-pre-tool-${session_id}.json`);
    let state = { search_first_injected: false };
    try { Object.assign(state, JSON.parse(fs.readFileSync(stateFile, 'utf8'))); } catch {}

    // Load project config and blocked_packages
    const cfg = loadProjectConfig(cwd);
    const blockedPackages = Array.isArray(cfg?.blocked_packages) ? cfg.blocked_packages : [];

    // Extract candidate package names from the command
    const candidates = extractPackageNames(command);

    // Check for blocked packages
    const blocked = candidates
      .map(name => blockedPackages.find(bp => bp.name.toLowerCase() === name))
      .filter(Boolean);

    if (blocked.length > 0) {
      // Hard block — include search-first text in reason
      const blockLines = blocked.map(bp => `\u26D4 ${bp.name} is blocked: ${bp.reason}`).join('\n');
      const reason = SEARCH_FIRST_TEXT + '\n\n' + blockLines;
      process.stdout.write(JSON.stringify({ decision: 'block', reason }));
      process.exit(0);
    }

    // No blocked packages — emit search-first reminder once per session
    if (!state.search_first_injected) {
      state.search_first_injected = true;
      try { fs.writeFileSync(stateFile, JSON.stringify(state)); } catch {}
      process.stdout.write(JSON.stringify({
        hookSpecificOutput: { hookEventName: 'PreToolUse', additionalContext: SEARCH_FIRST_TEXT }
      }));
      process.exit(0);
    }

    // Already reminded this session — silent
    process.exit(0);
  } catch {
    process.exit(0);
  }
});
