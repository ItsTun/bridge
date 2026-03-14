#!/usr/bin/env node
/**
 * bridge-session-start.js — SessionStart hook
 *
 * Fires at the start of every Claude Code session in any GSD project.
 * - Reads .planning/STATE.md → injects current GSD position into context
 * - Reads .claude/project-config.json → injects stack + skills config
 * - Checks ~/.claude/sessions/ for a recent session file → hint to resume
 * - Reminds Claude to run /bridge:session-start to restore full context
 *
 * Activation: only fires if .planning/STATE.md exists in cwd.
 * Falls back silently for non-GSD projects.
 */

const fs   = require('fs');
const path = require('path');
const os   = require('os');

const stdinTimeout = setTimeout(() => process.exit(0), 3000);

let input = '';
process.stdin.setEncoding('utf8');
process.stdin.on('data', chunk => { input += chunk; });
process.stdin.on('end', () => {
  clearTimeout(stdinTimeout);

  try {
    const event   = JSON.parse(input);
    const cwd     = event.cwd || process.cwd();
    const stateMd = path.join(cwd, '.planning', 'STATE.md');

    // Only activate in GSD projects
    if (!fs.existsSync(stateMd)) process.exit(0);

    const stateText = fs.readFileSync(stateMd, 'utf8');

    // Extract key fields from STATE.md frontmatter
    const stoppedAt   = (stateText.match(/stopped_at:\s*(.+)/)               || [])[1]?.trim().replace(/^"|"$/g, '') || '';
    const lastUpdated = (stateText.match(/last_updated:\s*"?([^"\n]+)"?/)     || [])[1]?.trim() || '';
    const status      = (stateText.match(/status:\s*(.+)/)                   || [])[1]?.trim() || '';
    const milestone   = (stateText.match(/milestone_name:\s*(.+)/)           || [])[1]?.trim() || '';

    // Find highest quick task number completed
    const taskNums = [...stateText.matchAll(/^\| (\d+) \|/gm)].map(m => parseInt(m[1]));
    const lastTask = taskNums.length ? Math.max(...taskNums) : 0;
    const nextTask = lastTask + 1;

    // Read project-config.json for stack info (bridge-initialized projects)
    const configPath = path.join(cwd, '.claude', 'project-config.json');
    const isBridgeInitialized = fs.existsSync(configPath);

    let stackLine = '';
    if (isBridgeInitialized) {
      try {
        const cfg = JSON.parse(fs.readFileSync(configPath, 'utf8'));
        const base     = cfg.stack?.base || '';
        const overlays = (cfg.stack?.overlays || []).join(', ');
        stackLine = base
          ? `\n   • Stack: ${base}${overlays ? ` + ${overlays}` : ''} [bridge v${cfg.bridge || '?'}]`
          : '';
      } catch { /* ignore */ }
    }

    // Check for recent session file
    let sessionHint = '';
    const sessionsDir = path.join(os.homedir(), '.claude', 'sessions');
    try {
      const files = fs.readdirSync(sessionsDir)
        .filter(f => f.endsWith('.md') || f.endsWith('.tmp'))
        .map(f => ({ name: f, mtime: fs.statSync(path.join(sessionsDir, f)).mtimeMs }))
        .sort((a, b) => b.mtime - a.mtime);
      if (files.length > 0) {
        const age = Math.round((Date.now() - files[0].mtime) / 3600000);
        const ageStr = age < 24 ? `${age}h ago` : `${Math.round(age / 24)}d ago`;
        sessionHint = `\n   • Session file: ${files[0].name} (${ageStr}) — restore with /everything-claude-code:resume-session`;
      }
    } catch { /* sessions dir may not exist */ }

    let message;

    if (isBridgeInitialized) {
      // Bridge-initialized project: project-specific hook likely already injected GSD state.
      // Output only the bridge-specific additions to avoid duplication.
      message =
        `Bridge session ready:` +
        stackLine +
        sessionHint +
        `\n\nWorkflow: /bridge:session-start → restore full context → then /bridge:quick "task"`;
    } else {
      // GSD-only project (no bridge init): inject full GSD state ourselves.
      message =
        `GSD Project State:\n` +
        `   • Status: ${status}${milestone ? ` (${milestone})` : ''}\n` +
        `   • Last completed: ${stoppedAt || (lastTask ? `quick-${lastTask}` : 'none')}\n` +
        `   • Last updated: ${lastUpdated}\n` +
        `   • Next task: quick-${nextTask}` +
        sessionHint +
        `\n\nWorkflow: /bridge:session-start → restore full context → then /bridge:quick "task"`;
    }

    process.stdout.write(JSON.stringify({
      hookSpecificOutput: {
        hookEventName: 'SessionStart',
        additionalContext: message,
      }
    }));

    process.exit(0);
  } catch {
    process.exit(0);
  }
});
