# Bridge — Universal GSD + ECC Orchestrator

Bridge wraps every `/gsd:` command with automatic ECC quality gates.
Auto-detects project stack. Auto-installs GSD + ECC if missing.

Stack detection logic → `stack-map.md`
Banner style → GSD-identical (`━━━ BRIDGE ► STAGE NAME ━━━`)

---

## Command Index

### Bridge-Only Commands
- `/bridge:install` — detect runtime, install GSD + ECC
- `/bridge:init` — bootstrap a project (brownfield or greenfield)
- `/bridge:status` — show stack, installed skills, instinct count
- `/bridge:session-start` — resume context + show progress
- `/bridge:session-end` — save session, learn, evolve

### Active Commands (GSD + ECC pipeline)
- `/bridge:quick "task"` — quick task with full quality gates
- `/bridge:plan-phase` — plan a phase with risk analysis
- `/bridge:execute-phase` — execute with wave orchestration + post-gates
- `/bridge:new-project` — full project setup with research
- `/bridge:new-milestone` — milestone cycle with audit + transition
- `/bridge:discuss-phase` — adaptive questioning before planning
- `/bridge:verify-work` — conversational UAT
- `/bridge:add-tests` — generate tests for completed phase
- `/bridge:debug` — systematic debugging with checkpoints
- `/bridge:health` — diagnose planning directory + repair

### GSD Pass-Throughs (25)
These forward directly to GSD with no pipeline wrapping:

`progress`, `resume-work`, `pause-work`, `audit-milestone`, `complete-milestone`,
`plan-milestone-gaps`, `map-codebase`, `check-todos`, `add-todo`, `add-phase`,
`insert-phase`, `remove-phase`, `research-phase`, `validate-phase`,
`list-phase-assumptions`, `set-profile`, `settings`, `cleanup`,
`reapply-patches`, `update`, `join-discord`, `help`

### ECC Pass-Throughs (18)
These forward directly to ECC with no pipeline wrapping:

`quality-gate`, `harness-audit`, `model-route`, `refactor-clean`, `code-review`,
`skill-create`, `evolve`, `learn-eval`, `save-session`, `resume-session`,
`instinct-status`, `instinct-export`, `instinct-import`, `promote`,
`build-fix`, `security-scan`, `loop-start`, `loop-status`

---

## Pipeline Definitions

### `/bridge:install`

```
━━━ BRIDGE ► INSTALL ━━━

1. Detect runtime:
   • Check: claude --version → Claude Code
   • Check: opencode --version → OpenCode
   • Check: gemini --version → Gemini CLI
   • Check: codex --version → Codex CLI
   • Default: Claude Code

2. Install GSD:
   npx -y get-shit-done-cc@latest --{runtime} --global

3. Install ECC:
   npm install -g ecc-universal

4. Verify:
   • gsd:help → ✓ GSD installed
   • ecc:instinct-status → ✓ ECC installed

✓ Bridge ready — run /bridge:init to configure project
```

---

### `/bridge:init`

```
━━━ BRIDGE ► INIT ━━━

◆ Detecting project type...

[BROWNFIELD — existing code detected]

  Wave 1: Explore
  ○ gsd:map-codebase → .planning/CODEMAPS/
  ○ Scan stack signals → stack-map.md lookup
  ○ skill-create → extract patterns from git log

  Wave 2: Configure
  ○ harness-audit → optimize tool definitions
  ○ enable continuous-learning-v2 (disabled by default)
  ○ wire plankton-code-quality PostToolUse hook

  Wave 3: Bootstrap
  ○ Write CLAUDE.md (workflow protocol block)
  ○ Write .claude/project-config.json (stack + skills)
  ○ Write .claude/config.json (model routing)

✓ Bridge initialized
Next Up → /bridge:status to verify
```

**Greenfield path** (no existing source files):
- Skip `map-codebase` and `skill-create`
- Run `gsd:new-project` directly after stack scan

---

### `/bridge:status`

```
━━━ BRIDGE ► STATUS ━━━

Stack:        Python / FastAPI            [detected]
GSD:          v2.x.x                      [✓]
ECC:          installed                   [✓]
Instincts:    12 project / 47 global      [✓]
Plankton:     wired (PostToolUse)         [✓]
Learning:     continuous-learning-v2 ON   [✓]

Active skills for this stack:
  python-review, python-testing, security-review,
  verification-loop, save-session, learn-eval

Phase:        quick-28 (in progress)
Next Up:      /bridge:quick "task description"
```

---

### `/bridge:session-start`

```
━━━ BRIDGE ► SESSION START ━━━

○ resume-session        → load last session file
○ instinct-status       → print project + global instincts
○ gsd:progress          → show current phase, next task

✓ Context restored — ready to work
```

---

### `/bridge:session-end`

```
━━━ BRIDGE ► SESSION END ━━━

○ save-session          → write ~/.claude/sessions/<date>.md
○ learn-eval            → extract patterns, self-evaluate quality
○ evolve                → cluster instincts, surface promotable patterns

✓ Session saved
```

---

### `/bridge:quick "task"`

```
━━━ BRIDGE ► QUICK ━━━

⚡ GSD Phase
  → gsd:quick "{task}"        [atomic commit, state tracked]

◆ Post-Step Gates (auto, no user prompt)
  [stack-driven — see stack-map.md]

  Python/FastAPI example:
  → python-review             [if .py changed]
  → eval_brief.py             [if oracle_v4.txt changed — project-specific]
  → verification-loop         [always]

✓ Task complete
Next Up → /bridge:session-end when done for the day
```

**All GSD flags pass through verbatim:**
`--auto`, `--batch`, `--gaps-only`, `--model=`, `--prd`, `--repair`, `--discuss`, `--full`

---

### `/bridge:plan-phase`

```
━━━ BRIDGE ► PLAN PHASE ━━━

⚡ Pre-Planning Gates
  → search-first          [if new data source or API in scope]
  → deep-research         [if novel library or technique]

⚡ GSD Phase
  → gsd:plan-phase        [creates PLAN.md]

◆ Post-Planning Review
  → ecc:plan              [review PLAN.md for codebase-specific risks]

✓ Plan ready
Next Up → /bridge:execute-phase
```

---

### `/bridge:execute-phase`

```
━━━ BRIDGE ► EXECUTE PHASE ━━━

⚡ GSD Phase
  → gsd:execute-phase     [wave-based execution, atomic commits]

◆ Post-Execution Gates (stack-driven)
  → {stack}-review        [e.g., python-review, go-reviewer, kotlin-reviewer]
  → eval_brief.py         [project-specific — if oracle files changed]
  → verification-loop     [always]
  → security-review       [if endpoints or env vars changed]
  → e2e                   [if frontend components changed]
  → docker-patterns       [if Dockerfile overlay active]
  → deployment-patterns   [if CI/CD overlay active]

✓ Phase complete
Next Up → /bridge:session-end
```

---

### `/bridge:new-project`

```
━━━ BRIDGE ► NEW PROJECT ━━━

⚡ Pre-Research
  → search-first          [always — check existing tools/patterns]
  → deep-research         [domain research]

⚡ GSD Phase
  → gsd:new-project       [roadmap, milestone, phase breakdown]

◆ Post-Setup
  → bridge:init           [stack detection + ECC wiring]
  → verification-loop

✓ Project initialized
```

---

### `/bridge:new-milestone`

```
━━━ BRIDGE ► NEW MILESTONE ━━━

⚡ GSD Phase
  → gsd:audit-milestone   [validate current milestone]
  → gsd:complete-milestone
  → gsd:new-milestone

◆ Post-Transition
  → learn-eval            [extract patterns before context wipe]
  → evolve                [promote strong instincts]

✓ Milestone transitioned
```

---

### `/bridge:debug`

```
━━━ BRIDGE ► DEBUG ━━━

⚡ GSD Phase
  → gsd:debug             [scientific method, checkpoint state]

◆ Post-Debug
  → {stack}-review        [review the fix]
  → verification-loop

✓ Debug complete
```

---

### `/bridge:health`

```
━━━ BRIDGE ► HEALTH ━━━

  → gsd:health            [diagnose .planning/, STATE.md, ROADMAP.md]
  → bridge:status         [verify ECC + stack config]

✓ Health report complete
```

---

## Stack Detection Procedure

Run at the start of every active command:

```
1. Read stack-map.md
2. Scan project root for detection signals (pyproject.toml, go.mod, etc.)
3. Assign base stack + overlays
4. Load skill set for this stack
5. Cache result in session — do not re-detect per command
```

If stack changes mid-session (rare): user can run `/bridge:status` to force re-detection.

---

## Banner & Symbol Reference

| Symbol | Meaning |
|--------|---------|
| `━━━ BRIDGE ► STAGE ━━━` | Stage header |
| `✓` | Success |
| `✗` | Failure |
| `◆` | Gate / checkpoint |
| `○` | Step in progress |
| `⚡` | GSD sub-phase |
| `⚠` | Warning |

Checkpoint box format:
```
┌─ Checkpoint ──────────────────────┐
│ ✓ python-review passed            │
│ ✓ verification-loop passed        │
│ ⚠ security-review: 1 warning      │
└───────────────────────────────────┘
```

Next Up block format:
```
╔═══════════════════════════════════╗
║  Next Up → /bridge:session-end    ║
╚═══════════════════════════════════╝
```

---

## Notes

- `plankton-code-quality` is a PostToolUse hook — not a pipeline step
- `continuous-learning-v2` is disabled by default — `/bridge:init` enables it
- `plugin.json` has no `hooks` field (Claude Code v2.1+ auto-loads `hooks/hooks.json`)
- ECC install: `npm install -g ecc-universal` (not git clone)
- GSD install: `npx -y get-shit-done-cc@latest --{runtime} --global`
