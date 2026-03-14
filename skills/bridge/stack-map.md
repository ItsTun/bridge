# Bridge Stack Map
# Detection signals → ECC skill assignments for each known stack

---

## How Detection Works

Bridge scans the project root for signals in this priority order:
1. `pyproject.toml` / `requirements.txt` / `setup.py` / `Pipfile` → Python base
2. `package.json` → Node base (inspect `dependencies` for framework; also React Native/Expo if `expo`/`react-native` in deps)
3. `go.mod` → Go
4. `build.gradle` / `build.gradle.kts` → Kotlin/Java (inspect for Android / Ktor / Spring)
5. `Cargo.toml` → Rust
6. `Package.swift` / `*.xcodeproj` / `*.xcworkspace` → Swift/iOS
7. Overlays applied after base stack: `Dockerfile`, `.github/workflows/`, `docker-compose.yml`, DB deps, auth deps, GraphQL deps, Redis deps

---

## Python Stacks

### Python / FastAPI
**Detection signals** (any of):
- `requirements.txt` or `pyproject.toml` contains `fastapi`
- `main.py` or `app.py` imports `from fastapi import`

**ECC skills assigned:**
| Trigger | Skill |
|---------|-------|
| Any `.py` file changed | `python-review` |
| Test files changed | `python-testing` |
| Endpoint or env var changed | `security-review` |
| New library considered | `search-first` |
| Session end | `save-session` → `learn-eval` |
| After execution | `verification-loop` |
| DB file changed (naming convention: *_store, *repository, models, schema, migrations/) | `postgres-patterns` + `database-reviewer` |
| Schema/migration files changed | `database-migrations` |

**GSD skills assigned:** `gsd:quick`, `gsd:plan-phase`, `gsd:execute-phase`

---

### Python / Django
**Detection signals** (any of):
- `requirements.txt` contains `django` (case-insensitive)
- `manage.py` exists at root
- `settings.py` contains `INSTALLED_APPS`

**ECC skills assigned:**
| Trigger | Skill |
|---------|-------|
| Any `.py` file changed | `python-review` |
| Model/migration changed | `database-migrations` + `postgres-patterns` |
| Auth/views/permissions changed | `django-security` |
| After execution | `django-verification` |
| New library considered | `search-first` |
| Session end | `save-session` → `learn-eval` |

**ECC pattern skills:** `django-patterns`, `django-tdd`

---

### Python / Flask
**Detection signals** (any of):
- `requirements.txt` contains `flask`
- `app.py` imports `from flask import`

**ECC skills assigned:**
| Trigger | Skill |
|---------|-------|
| Any `.py` file changed | `python-review` |
| Test files changed | `python-testing` |
| Endpoint or auth changed | `security-review` |
| After execution | `verification-loop` |
| Session end | `save-session` → `learn-eval` |

**ECC pattern skills:** `python-patterns`, `backend-patterns`, `api-design`

---

## Node Stacks

### Node / Next.js
**Detection signals** (any of):
- `package.json` dependencies contain `next`
- `next.config.js` or `next.config.ts` exists
- `app/` or `pages/` directory at root

**ECC skills assigned:**
| Trigger | Skill |
|---------|-------|
| Any `.ts`/`.tsx` file changed | `frontend-patterns` |
| API route changed | `api-design` + `security-review` |
| E2E needed | `e2e-testing` |
| After execution | `verification-loop` |
| Session end | `save-session` → `learn-eval` |

**ECC pattern skills:** `frontend-patterns`, `e2e-testing`

---

### Node / Express
**Detection signals** (any of):
- `package.json` dependencies contain `express`
- `app.js` or `server.js` imports `require('express')`

**ECC skills assigned:**
| Trigger | Skill |
|---------|-------|
| Any `.js`/`.ts` file changed | `code-reviewer` |
| Endpoint or auth changed | `security-review` |
| DB query changed | `database-reviewer` |
| After execution | `verification-loop` |
| Session end | `save-session` → `learn-eval` |

**ECC pattern skills:** `backend-patterns`, `api-design`

---

## Go Stack

### Go
**Detection signals** (any of):
- `go.mod` exists at root

**ECC skills assigned:**
| Trigger | Skill |
|---------|-------|
| Any `.go` file changed | `go-reviewer` |
| Build fails | `go-build-resolver` |
| Test files changed | `golang-testing` |
| After execution | `verification-loop` |
| Session end | `save-session` → `learn-eval` |

**ECC pattern skills:** `golang-patterns`, `golang-testing`

---

## Kotlin Stacks

### Kotlin / Ktor
**Detection signals** (any of):
- `build.gradle.kts` contains `ktor`
- `src/main/kotlin` exists and no `AndroidManifest.xml`

**ECC skills assigned:**
| Trigger | Skill |
|---------|-------|
| Any `.kt` file changed | `kotlin-reviewer` |
| Build fails | `kotlin-build-resolver` |
| Test files changed | `kotlin-testing` |
| After execution | `verification-loop` |
| Session end | `save-session` → `learn-eval` |

**ECC pattern skills:** `kotlin-ktor-patterns`, `kotlin-patterns`, `kotlin-coroutines-flows`

---

### Kotlin / Android (or KMP)
**Detection signals** (any of):
- `AndroidManifest.xml` exists anywhere in tree
- `build.gradle` contains `com.android.application` or `com.android.library`

**ECC skills assigned:**
| Trigger | Skill |
|---------|-------|
| Any `.kt` file changed | `kotlin-reviewer` |
| Compose file changed | `compose-multiplatform-patterns` |
| Build fails | `kotlin-build-resolver` |
| Test files changed | `kotlin-testing` |
| After execution | `verification-loop` |
| Session end | `save-session` → `learn-eval` |

**ECC pattern skills:** `android-clean-architecture`, `kotlin-patterns`, `kotlin-coroutines-flows`

---

## Java Stack

### Java / Spring Boot
**Detection signals** (any of):
- `pom.xml` contains `spring-boot`
- `build.gradle` contains `org.springframework.boot`
- `src/main/java` exists

**ECC skills assigned:**
| Trigger | Skill |
|---------|-------|
| Any `.java` file changed | `code-reviewer` |
| Security/auth changed | `springboot-security` |
| After execution | `springboot-verification` |
| Test files changed | `springboot-tdd` |
| Session end | `save-session` → `learn-eval` |

**ECC pattern skills:** `springboot-patterns`, `jpa-patterns`, `java-coding-standards`

---

## Rust Stack

### Rust
**Detection signals** (any of):
- `Cargo.toml` exists at root

**ECC skills assigned:**
| Trigger | Skill |
|---------|-------|
| Any `.rs` file changed | `code-reviewer` |
| Unsafe block added (`unsafe {`) | `security-review` |
| Build fails | (run `cargo check` — no dedicated ECC skill yet) |
| Test files changed (`*_test.rs`, `tests/`) | `code-reviewer` |
| After execution | `verification-loop` |
| Session end | `save-session` → `learn-eval` |

---

## Swift / iOS Stack

### Swift / iOS
**Detection signals** (any of):
- `Package.swift` exists at root
- `*.xcodeproj` or `*.xcworkspace` exists at root
- `Sources/` directory exists alongside `Package.swift`

**ECC skills assigned:**
| Trigger | Skill |
|---------|-------|
| Any `.swift` file changed | `swiftui-patterns` |
| Concurrency/actor file changed (`*Actor*`, `*async*`) | `swift-concurrency-6-2` |
| Persistence file changed (`*Store*`, `*Repository*`) | `swift-actor-persistence` |
| Protocol/DI file changed | `swift-protocol-di-testing` |
| After execution | `verification-loop` |
| Session end | `save-session` → `learn-eval` |

---

## React Native / Expo Stack

### React Native / Expo
**Detection signals** (any of):
- `package.json` dependencies contain `expo` or `react-native`
- `app.json` exists with `expo` key
- `metro.config.js` exists

**ECC skills assigned:**
| Trigger | Skill |
|---------|-------|
| Any `.ts`/`.tsx` file changed | `frontend-patterns` |
| Navigation file changed (`*navigator*`, `*navigation*`) | `frontend-patterns` |
| API/fetch file changed | `security-review` |
| After execution | `verification-loop` |
| Session end | `save-session` → `learn-eval` |

**ECC pattern skills:** `frontend-patterns`, `e2e-testing`

---

## Overlays (applied on top of any base stack)

### Docker Overlay
**Detection signals:** `Dockerfile` or `docker-compose.yml` exists

**Adds:** `docker-patterns` to plan-phase and execute-phase pipelines

---

### CI/CD Overlay
**Detection signals:** `.github/workflows/` directory exists, or `.gitlab-ci.yml`, or `Jenkinsfile`

**Adds:** `deployment-patterns` to execute-phase pipeline

---

### Database Overlay
**Detection signals** (any of):
- `requirements.txt` / `package.json` / `pom.xml` contains: `sqlalchemy`, `prisma`, `typeorm`, `hibernate`, `psycopg`, `asyncpg`, `pymysql`, `sequelize`
- Migration directory exists: `migrations/`, `alembic/`, `db/migrate/`

**Adds:** `database-reviewer` + `database-migrations` to execute-phase pipeline

---

### Auth Overlay
**Detection signals** (any of):
- Code contains: `jwt`, `oauth`, `passport`, `authlib`, `python-jose`, `spring-security`, `nextauth`
- Files named: `auth.py`, `auth.ts`, `middleware/auth.*`

**Adds:** `security-review` to quick, plan-phase, execute-phase, add-tests, and debug pipelines

---

### GraphQL Overlay
**Detection signals** (any of):
- Files with `.graphql` or `.gql` extension exist
- `package.json` / `requirements.txt` / `pyproject.toml` contains: `apollo`, `graphql`, `strawberry`, `ariadne`, `graphene`, `hasura`
- `schema.graphql` file exists

**Adds:** `api-design` + `security-review` (introspection exposure risk) to plan-phase and execute-phase pipelines

---

### Redis Overlay
**Detection signals** (any of):
- `requirements.txt` / `package.json` / `pyproject.toml` contains: `redis`, `ioredis`, `aioredis`, `celery`, `bull`, `bullmq`
- `redis.conf` exists at root

**Adds:** `backend-patterns` to execute-phase pipeline

---

## Fallback (Unknown Stack)

If no signals match:

**ECC skills assigned:**
| Trigger | Skill |
|---------|-------|
| Any source file changed | `code-reviewer` |
| After execution | `verification-loop` |
| Session end | `save-session` → `learn-eval` |

Bridge logs: `⚠ Stack not detected — using universal fallback profile`
