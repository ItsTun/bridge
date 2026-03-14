# Changelog

All notable changes to Bridge will be documented here.

## [0.1.0] — 2026-03-14

### Added
- Universal GSD + ECC orchestrator plugin for Claude Code
- Stack auto-detection for 12 stacks: Python/FastAPI, Python/Django, Python/Flask, Node/Next.js, Node/Express, Go, Kotlin/Ktor, Kotlin/Android (KMP), Java/Spring Boot, Rust, Swift/iOS, React Native/Expo
- 6 overlays: Docker, CI/CD, Database, Auth, GraphQL, Redis
- `/bridge:install` — detect runtime, install GSD + ECC
- `/bridge:init` — bootstrap project (brownfield or greenfield)
- `/bridge:quick` — GSD quick task with automatic stack-driven quality gates
- `/bridge:plan-phase` — planning pipeline with pre-gates (search-first, deep-research, api-design)
- `/bridge:execute-phase` — wave execution with post-gates (stack review, security, e2e, verification)
- `/bridge:session-start` / `/bridge:session-end` — context save/restore + instinct learning
- `/bridge:new-project` / `/bridge:new-milestone` — project lifecycle management
- `/bridge:discuss-phase`, `/bridge:verify-work`, `/bridge:add-tests`, `/bridge:debug` — supporting commands
- `/bridge:health`, `/bridge:status`, `/bridge:smoke-test`, `/bridge:configure`, `/bridge:eval` — diagnostics
- 25 GSD pass-throughs and 18 ECC pass-throughs
- `hooks/hooks.json` — SessionStart, PreToolUse, PostToolUse hooks (auto-loaded by Claude Code v2.1+)
- `trigger_patterns` support in `.claude/project-config.json` for fine-grained file pattern configuration
