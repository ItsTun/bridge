# Bridge

Universal GSD + ECC orchestrator plugin for Claude Code.

Wraps every `/gsd:` command with automatic ECC quality gates. Auto-detects your project stack. Auto-installs GSD + ECC if missing.

---

## What It Does

- **Stack detection** — scans `pyproject.toml`, `go.mod`, `package.json`, `build.gradle`, `Cargo.toml` and assigns the right ECC review/test/security skills automatically
- **Quality gates** — after every GSD task, the right reviewer fires without you having to ask (e.g. `python-review` for FastAPI, `go-reviewer` for Go, `kotlin-reviewer` for Ktor)
- **Session hygiene** — `bridge:session-start` restores context; `bridge:session-end` saves + learns + evolves instincts
- **Flag pass-through** — all GSD flags (`--auto`, `--batch`, `--model=`, etc.) pass through verbatim
- **No duplicate hooks** — `plugin.json` has no `hooks` field; Claude Code v2.1+ loads `hooks/hooks.json` automatically

---

## Supported Stacks

| Stack | Base skills |
|-------|-------------|
| Python / FastAPI | `python-review`, `python-testing`, `security-review` |
| Python / Django | `python-review`, `django-tdd`, `django-security`, `django-verification` |
| Python / Flask | `python-review`, `python-testing`, `backend-patterns` |
| Node / Next.js | `frontend-patterns`, `e2e-testing`, `security-review` |
| Node / Express | `backend-patterns`, `api-design`, `security-review` |
| Go | `go-reviewer`, `golang-patterns`, `golang-testing`, `go-build-resolver` |
| Kotlin / Ktor | `kotlin-reviewer`, `kotlin-ktor-patterns`, `kotlin-testing` |
| Kotlin / Android | `kotlin-reviewer`, `android-clean-architecture`, `kotlin-testing` |
| Java / Spring Boot | `springboot-verification`, `springboot-tdd`, `springboot-security` |
| Rust | `code-reviewer`, `verification-loop` |

**Overlays** (applied on top of any stack): Docker, CI/CD, Database, Auth

---

## Install

### Option A — Plugin marketplace (recommended)

Add to `~/.claude/settings.json`:

```json
{
  "extraKnownMarketplaces": [
    {
      "name": "bridge",
      "url": "https://raw.githubusercontent.com/YOUR_ORG/bridge/main/plugin.json"
    }
  ],
  "enabledPlugins": ["bridge"]
}
```

Then run `/bridge:install` in any project.

### Option B — Manual (two files)

```bash
mkdir -p ~/.claude/skills/bridge

curl -o ~/.claude/skills/bridge/SKILL.md \
  https://raw.githubusercontent.com/YOUR_ORG/bridge/main/skills/bridge/SKILL.md

curl -o ~/.claude/skills/bridge/stack-map.md \
  https://raw.githubusercontent.com/YOUR_ORG/bridge/main/skills/bridge/stack-map.md
```

---

## First-Time Setup

```bash
# 1. Install GSD + ECC (one time, global)
/bridge:install

# 2. Initialize your project
cd /path/to/your/project
/bridge:init
```

`bridge:init` will:
1. Run `gsd:map-codebase` (brownfield) or `gsd:new-project` (greenfield)
2. Detect your stack from `stack-map.md`
3. Extract patterns via `skill-create`
4. Audit your agent harness
5. Enable `continuous-learning-v2`
6. Wire the `plankton-code-quality` PostToolUse hook
7. Write `CLAUDE.md` workflow protocol + `.claude/project-config.json`

---

## Daily Workflow

```bash
# Start of session
/bridge:session-start

# Do work
/bridge:quick "add rate limiting to /api/brief"
/bridge:plan-phase
/bridge:execute-phase

# End of session
/bridge:session-end
```

---

## Command Reference

| Command | What it does |
|---------|-------------|
| `/bridge:install` | Detect runtime, install GSD + ECC globally |
| `/bridge:init` | Bootstrap project (brownfield or greenfield) |
| `/bridge:status` | Show stack, skills, instinct count, phase |
| `/bridge:session-start` | Resume context + show GSD progress |
| `/bridge:session-end` | save-session → learn-eval → evolve |
| `/bridge:quick "task"` | GSD quick task + stack-driven quality gates |
| `/bridge:plan-phase` | search-first → deep-research → gsd:plan → plan review |
| `/bridge:execute-phase` | gsd:execute → stack review → verification-loop |
| `/bridge:new-project` | Full setup with research + bridge:init |
| `/bridge:new-milestone` | Audit → complete → transition → learn + evolve |
| `/bridge:discuss-phase` | GSD adaptive questioning before planning |
| `/bridge:verify-work` | Conversational UAT via GSD |
| `/bridge:add-tests` | Generate tests for completed phase |
| `/bridge:debug` | Scientific debugging + stack review of fix |
| `/bridge:health` | gsd:health + bridge:status |

**GSD pass-throughs (25):** `progress`, `resume-work`, `pause-work`, `audit-milestone`, `complete-milestone`, `plan-milestone-gaps`, `map-codebase`, `check-todos`, `add-todo`, `add-phase`, `insert-phase`, `remove-phase`, `research-phase`, `validate-phase`, `list-phase-assumptions`, `set-profile`, `settings`, `cleanup`, `reapply-patches`, `update`, `join-discord`, `help`

**ECC pass-throughs (18):** `quality-gate`, `harness-audit`, `model-route`, `refactor-clean`, `code-review`, `skill-create`, `evolve`, `learn-eval`, `save-session`, `resume-session`, `instinct-status`, `instinct-export`, `instinct-import`, `promote`, `build-fix`, `security-scan`, `loop-start`, `loop-status`

---

## Dependencies

- [Claude Code](https://claude.ai/code) v2.1+
- [GSD (get-shit-done-cc)](https://www.npmjs.com/package/get-shit-done-cc) — installed by `bridge:install`
- [ECC (ecc-universal)](https://www.npmjs.com/package/ecc-universal) — installed by `bridge:install`
- Node.js 18+ (for npx / npm install)

---

## Architecture

```
~/.claude/skills/bridge/
├── SKILL.md        — all commands + pipeline logic
└── stack-map.md    — detection signals + skill assignments per stack

~/Dev/bridge/       (source repo)
├── plugin.json     — plugin manifest (no hooks field)
├── README.md
├── skills/bridge/
│   ├── SKILL.md
│   └── stack-map.md
└── hooks/          — hooks.json lives here (auto-loaded by Claude Code v2.1+)
```

---

## Contributing

PRs welcome. When adding a new stack:
1. Add detection signals + skill table to `stack-map.md`
2. Add pipeline block to `SKILL.md` (or update existing one)
3. Update the stack table in `README.md`
4. Add a test case to the checklist below

---

## Test Checklist

Run this manually after any change to `SKILL.md` or `stack-map.md`:

- [ ] `/bridge:install` detects Claude Code runtime correctly
- [ ] `/bridge:install` installs GSD without error
- [ ] `/bridge:install` installs ECC without error
- [ ] `/bridge:init` on a FastAPI project detects `Python / FastAPI` stack
- [ ] `/bridge:init` on a Django project detects `Python / Django` stack
- [ ] `/bridge:init` on a Next.js project detects `Node / Next.js` stack
- [ ] `/bridge:init` on a Go project detects `Go` stack
- [ ] `/bridge:init` on a Kotlin/Ktor project detects `Kotlin / Ktor` stack
- [ ] `/bridge:init` on a Spring Boot project detects `Java / Spring Boot` stack
- [ ] `/bridge:init` on an unknown project falls back gracefully with `⚠ Stack not detected`
- [ ] `/bridge:quick "task"` fires `python-review` after `.py` file change (FastAPI project)
- [ ] `/bridge:quick "task"` fires `go-reviewer` after `.go` file change (Go project)
- [ ] `/bridge:quick "task"` always fires `verification-loop` regardless of stack
- [ ] `/bridge:session-start` runs `resume-session` + `instinct-status` + `gsd:progress`
- [ ] `/bridge:session-end` runs `save-session` → `learn-eval` → `evolve` in order
- [ ] `/bridge:plan-phase` fires `search-first` when new API is in scope
- [ ] `/bridge:execute-phase` fires `security-review` when endpoint changes detected
- [ ] `plugin.json` has no `hooks` field
- [ ] All 25 GSD pass-throughs forward without modification
- [ ] All 18 ECC pass-throughs forward without modification
- [ ] `--auto` flag passes through `/bridge:quick` to `gsd:quick` verbatim
- [ ] Docker overlay activates when `Dockerfile` present in project root
- [ ] Auth overlay activates when `nextauth` found in `package.json`
