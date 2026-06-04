# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

### Run the full stack
```bash
make run          # starts Go backend and Vite frontend in parallel
make run-go       # backend only (cd backend && go run main.go)
make run-react    # frontend only (npm install + npm run dev)
make build        # compile Go binary to backend/main
```

### Frontend
```bash
cd frontend && npm run lint    # ESLint
cd frontend && npm run build   # production build
```

### Backend
```bash
cd backend && go build ./...   # compile check
cd backend && go vet ./...     # static analysis
```

## Architecture

This is a monorepo using a Go workspace (`go.work`). The backend and frontend are independent directories.

### Backend (`backend/`)

Echo v4 HTTP server. Entry point: `main.go` → `routes.StartServer()`.

Package layout:
- `packages/routes/` — server init (CORS, middleware, DB connection, migration trigger) and route registration
- `packages/controller/` — request handlers (`Login`, `CreateUser`)
- `packages/db/` — `ConnectDB()`, `Migrate()`, and SQL query constants (`queries.go`)
- `packages/models/` — struct definitions (`User`, `LoginRequest`, `UserResponseWithTokens`)
- `packages/utils/` — validation (`ValidateUser`) and `UserExists` check
- `packages/middleware/` — `ValidateJWT` Echo middleware (reads `access_token` cookie)

**Auth flow:** `POST /login` hashes comparison via bcrypt, issues a JWT signed with `JWT_SECRET` set as an `HttpOnly` cookie (`access_token`) and also returned in the JSON body. `POST /register` validates, checks uniqueness, bcrypt-hashes the password, then inserts via `RETURNING id`.

Protected routes are defined but commented out in `routes/api.go` — uncomment and add routes under the `/api` group using `ValidateJWT` middleware.


### Frontend (`frontend/`)

React 18 + Vite + Tailwind CSS v4. Single-page app.

- `src/App.jsx` — root component, controls modal open/close state
- `src/components/login.jsx` — combined Login/Register modal; toggles between modes, calls `VITE_API_URL` + `/login` or `/register`, stores token in `localStorage` on success

### Database

PostgreSQL. Schema managed via `golang-migrate` (files in `backend/packages/db/migrations/`).

To run migrations, set `RUN_MIGRATION=true` in `backend/.env` before starting the server. Migrations run once on startup then are skipped automatically (`ErrNoChange`).

### Environment variables

**`backend/.env`**
| Variable | Purpose |
|---|---|
| `DATABASE_*` | PostgreSQL connection details |
| `JWT_SECRET` | HMAC signing key for JWTs |
| `PORT` | Server port (default `:8081`) |
| `CLIENT_URL` | Frontend origin added to CORS allowlist |
| `RUN_MIGRATION` | Set `true` to apply pending migrations on startup |

**`frontend/.env`**
| Variable | Purpose |
|---|---|
| `VITE_API_URL` | Backend base URL (e.g. `http://localhost:8081`) |

# Agent Execution Guidelines

## 1. Think Before Coding

**Don't assume. Don't hide confusion. Surface tradeoffs.**

Before implementing:
- State your assumptions explicitly. If uncertain, ask.
- If multiple interpretations exist, present them - don't pick silently.
- If a simpler approach exists, say so. Push back when warranted.
- If something is unclear, stop. Name what's confusing. Ask.

## 2. Simplicity First

**Minimum code that solves the problem. Nothing speculative.**

- No features beyond what was asked.
- No abstractions for single-use code.
- No "flexibility" or "configurability" that wasn't requested.
- No error handling for impossible scenarios.
- If you write 200 lines and it could be 50, rewrite it.

Ask yourself: "Would a senior engineer say this is overcomplicated?" If yes, simplify.

## 3. Surgical Changes

**Touch only what you must. Clean up only your own mess.**

When editing existing code:
- Don't "improve" adjacent code, comments, or formatting.
- Don't refactor things that aren't broken.
- Match existing style, even if you'd do it differently.
- If you notice unrelated dead code, mention it - don't delete it.

When your changes create orphans:
- Remove imports/variables/functions that YOUR changes made unused.
- Don't remove pre-existing dead code unless asked.

The test: Every changed line should trace directly to the user's request.

## 4. Goal-Driven Execution

**Define success criteria. Loop until verified.**

Transform tasks into verifiable goals:
- "Add validation" → "Write tests for invalid inputs, then make them pass"
- "Fix the bug" → "Write a test that reproduces it, then make it pass"
- "Refactor X" → "Ensure tests pass before and after"

For multi-step tasks, state a brief plan:
```
1. [Step] → verify: [check]
2. [Step] → verify: [check]
3. [Step] → verify: [check]
```

Strong success criteria let you loop independently. Weak criteria ("make it work") require constant clarification.

---

**These guidelines are working if:** fewer unnecessary changes in diffs, fewer rewrites due to overcomplication, and clarifying questions come before implementation rather than after mistakes.