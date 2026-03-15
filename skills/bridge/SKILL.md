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
- `/bridge:smoke-test` — verify bridge installation: stack detection, hook wiring, dry-run gate execution

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
- `/bridge:eval` — run project-specific evaluation script from project-config.json
- `/bridge:configure` — update project-config.json fields interactively
### GSD Pass-Throughs (22)
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
○ promote               → publish any surfaced promotable instincts

✓ Session saved
```

---

### `/bridge:quick "task"`

```
━━━ BRIDGE ► QUICK ━━━

⚡ GSD Phase
  → gsd:quick "{task}"        [atomic commit, state tracked]

◆ Post-Step Gates (auto, no user prompt)

  Post-step gate matrix (all stacks):

  | Trigger | Skill(s) |
  |---------|----------|
  | .py file changed (python stacks) | `on_py_change` skills from config (default: `python-review`) |
  | .go file changed (go stack) | `go-reviewer` |
  | .kt file changed (kotlin stacks) | `kotlin-reviewer` |
  | .java file changed (java stack) | `code-reviewer` |
  | .ts / .tsx file changed (next.js overlay) | `on_ts_tsx_change` skills from config (default: `frontend-patterns`) |
  | *_store.*, *repository.*, models.*, schema.*, migrations/ changed | `postgres-patterns` + `database-reviewer` |
  | Endpoint file changed (auth overlay active) | `on_endpoint_change` skills from config (default: `security-review`) |
  | Test file changed | `on_test_change` skills from config (default: `{stack}-testing`) |
  | .py file changed (python stacks) + TDD session active | `tdd-workflow` |
  | .py file changed (python stacks) | `python-patterns` (alongside `python-review`) |
  | project_specific.eval_trigger file changed | run `project_specific.eval_script` (Bash) |
  | No project-config.json (unknown stack) | `code-reviewer` |
  | Always | `verification-loop` |

  Config source: `.claude/project-config.json` skills map. Fallback: `stack-map.md` defaults for detected base stack.

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
  → api-design            [if API endpoint files in scope]

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
  → database-reviewer     [if schema/migration files changed]
  → database-migrations   [if migration files changed]
  → project_specific.eval_script [if eval_trigger file changed — from project-config.json]
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
  → skill-create          [extract patterns from git log before context wipe]
  → learn-eval            [extract patterns before context wipe]
  → evolve                [promote strong instincts]

✓ Milestone transitioned
```

---

### `/bridge:discuss-phase`

```
━━━ BRIDGE ► DISCUSS PHASE ━━━

⚡ Pre-Gate
  ○ Ask: "Does this phase involve a new external API, data source, or library
          not currently in the codebase?"
    → Yes → run /everything-claude-code:search-first first
    → No  → proceed directly

⚡ GSD Phase
  → gsd:discuss-phase [with provided arguments]

✓ Discussion complete
Next Up → /bridge:plan-phase
```

---

### `/bridge:verify-work`

```
━━━ BRIDGE ► VERIFY WORK ━━━

⚡ GSD Phase
  → gsd:verify-work [with provided arguments]

◆ Post-Gate (if UAT passes)
  ○ Check: did this phase touch .tsx / .ts frontend components?
    → Yes → run /everything-claude-code:e2e-testing
    → No  → skip

✓ Verification complete
```

---

### `/bridge:add-tests`

```
━━━ BRIDGE ► ADD TESTS ━━━

⚡ GSD Phase
  → gsd:add-tests [with provided arguments]

◆ Post-Test Review
  Determine base stack from .claude/project-config.json, then run:

  | Stack            | Testing Skill                        |
  |------------------|--------------------------------------|
  | python/fastapi   | python-testing                       |
  | python/django    | python-testing + django-tdd          |
  | python/flask     | python-testing                       |
  | node/next.js     | e2e-testing                          |
  | node/express     | code-reviewer (no dedicated skill)   |
  | go               | golang-testing                       |
  | kotlin/ktor      | kotlin-testing                       |
  | kotlin/android   | kotlin-testing                       |
  | java/spring      | springboot-tdd                       |
  | rust             | code-reviewer (no dedicated skill)   |
  | unknown/fallback | code-reviewer                        |

✓ Tests complete
```

---

### `/bridge:debug`

```
━━━ BRIDGE ► DEBUG ━━━

⚡ GSD Phase
  → gsd:debug             [scientific method, checkpoint state]

◆ Post-Debug
  → {stack}-review        [review the fix]
  → refactor-cleaner      [after fix applied]
  → verification-loop

✓ Debug complete
```

---

### `/bridge:health`

```
━━━ BRIDGE ► HEALTH ━━━

  → gsd:health            [diagnose .planning/, STATE.md, ROADMAP.md]
  → bridge:status         [verify ECC + stack config]

◆ Hook Wiring Check
  ○ Read ~/.claude/settings.json
  ○ Check hooks section for bridge hook entries:
      SessionStart  → ✓ wired | ⚠ missing
      PreToolUse    → ✓ wired | ⚠ missing
      PostToolUse   → ✓ wired | ⚠ missing
  ○ If any missing → show re-wire command:
      node ~/.claude/get-shit-done/bin/gsd-tools.cjs hook-wire --bridge

◆ Security & Harness Diagnostics
  → security-scan         [scan .claude/ config for exposed secrets or unsafe patterns]
  → harness-audit         [verify tool definitions are optimal]

✓ Health report complete
```

---

### `/bridge:eval`

```
━━━ BRIDGE ► EVAL ━━━

○ Read .claude/project-config.json → project_specific.eval_script
○ If eval_trigger set → note which file change triggers this automatically
○ Run eval_script via Bash
○ Display formatted results (pass/fail/score)

✓ Eval complete
```

Config field: `project_specific.eval_script` in .claude/project-config.json
Warning if absent: ⚠ No eval_script configured

---

### `/bridge:smoke-test`

```
━━━ BRIDGE ► SMOKE TEST ━━━

○ Check .claude/project-config.json exists and is valid JSON
○ Check ~/.claude/settings.json has SessionStart, PreToolUse, PostToolUse bridge hooks registered
○ Check bridge skills are loaded (SKILL.md and stack-map.md accessible)
○ Verify stack detected correctly (read project-config.json stack field)
○ Dry-run: show which skills WOULD fire for a hypothetical .py file edit (no actual execution)

┌─ Results ─────────────────────────────────────┐
│ ✓ project-config.json    valid JSON           │
│ ✓ SessionStart hook      registered           │
│ ✓ PreToolUse hook        registered           │
│ ✓ PostToolUse hook       registered           │
│ ✓ SKILL.md               loaded               │
│ ✓ stack-map.md           loaded               │
│ ✓ Stack detected         Python/FastAPI       │
│ ✓ Dry-run .py edit       → python-review      │
└───────────────────────────────────────────────┘

✓ Bridge is healthy
```

---

### `/bridge:configure`

```
━━━ BRIDGE ► CONFIGURE ━━━

○ Read .claude/project-config.json
○ Display current values grouped by section:
    Stack:    base, overlays
    Skills:   on_py_change, on_test_change, on_endpoint_change,
              on_ts_tsx_change, on_new_library, after_execution, session_end
    Project:  eval_script, eval_trigger, local_skill
    Config:   continuous_learning_v2, plankton_hook
    Blocked:  blocked_packages list

○ Ask: "Which field do you want to update? (or 'add-blocked' / 'remove-blocked' / 'done')"

○ Loop until user says 'done':
    - For skill arrays: show current list, ask for new comma-separated value
    - For blocked_packages add: ask for package name + reason
    - For blocked_packages remove: show list with numbers, ask which to remove
    - For string fields: ask for new value (show current as default)
    - For boolean-like fields (continuous_learning_v2, plankton_hook): ask for new value

○ Show diff of all changes before writing
○ Write updated project-config.json
○ Confirm: ✓ project-config.json updated

✓ Configure complete
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
┌─ Checkpoint ──────────────────────────────────┐
│ ✓ gsd:quick         13m 02s                   │
│ ✓ python-review     passed                    │
│ ✓ verification-loop passed                    │
│ ─────────────────────────────────────────     │
│ Total: 13m 28s                                │
└───────────────────────────────────────────────┘
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

### `trigger_patterns` in project-config.json

Projects can declare fine-grained file patterns for trigger detection in `.claude/project-config.json`:

```json
"trigger_patterns": {
  "endpoint": ["app/api/*.py", "app/routers/*.py"],
  "test":     ["tests/**/*.py"],
  "frontend": ["frontend/src/**/*.tsx"],
  "db_files": ["app/services/*_store.py"],
  "eval":     ["oracle_v4.txt"]
}
```

These patterns are read by `bridge-workflow.js` and `bridge:quick` to fire the correct skill reminders per file type. If absent, naming convention defaults from `stack-map.md` apply.

**Supported stacks** (full detection signals + skill assignments in `stack-map.md`):
Python/FastAPI, Python/Django, Python/Flask, Node/Next.js, Node/Express, Go, Kotlin/Ktor, Kotlin/Android (KMP), Java/Spring Boot, Rust, Swift/iOS, React Native/Expo

**Overlays** (applied on top of any base stack): Docker, CI/CD, Database, Auth, GraphQL, Redis
