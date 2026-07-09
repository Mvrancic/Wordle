# Wordle Game Unlimited 🎯

A Wordle implementation with five real game modes, built as a full-stack
monorepo. Game logic lives entirely in the frontend (offline-playable,
localStorage-backed); the backend only handles auth sync, stats, history and
the shared daily word.

## 🏗️ Repository Structure

```
backend/
├── src/
│   ├── controllers/       # Route controllers
│   ├── services/          # Business logic
│   ├── repositories/      # Data access (raw SQL via `pg`)
│   ├── models/            # TypeScript types and interfaces
│   ├── middleware/        # Auth verification, error handling
│   ├── routes/            # Route definitions
│   ├── config/            # Configuration (DB pool, env)
│   ├── utils/             # Utilities
│   └── types/             # Shared types
├── sql/                   # SQL migrations (run manually in Supabase)
└── package.json

frontend/
├── src/
│   ├── components/        # Reusable components
│   │   ├── game/          # Board, cells, keyboard
│   │   ├── game-modes/    # Mode-specific UI (selectors, modals)
│   │   └── layout/        # Header, layout shell
│   ├── hooks/              # Game engines + page logic per mode
│   ├── pages/              # Route components
│   ├── services/           # API client
│   ├── contexts/           # Auth context (Supabase session)
│   ├── types/               # TypeScript types
│   └── utils/               # Word evaluation logic
└── package.json
```

## 🛠️ Technology Stack

- **Frontend**: React + TypeScript + Tailwind CSS + React Router + Supabase JS (auth)
- **Backend**: Express.js + TypeScript + `pg` (raw SQL) + Supabase (PostgreSQL + Auth)
- **Architecture**: Game logic runs client-side; the backend is a thin API for
  auth sync, per-user stats/history, and the daily word. There is no ORM —
  repositories use hand-written SQL against a Supabase Postgres database.

## 🚀 Getting Started

### Prerequisites
- Node.js v18+
- A Supabase project (Postgres database + Google OAuth provider enabled)

### 1. Backend setup

```bash
cd backend
npm install

cp env.example .env
```

Edit `.env`:
- `DATABASE_URL` — your Supabase connection string (Project Settings → Database).
- `SUPABASE_JWT_SECRET` — Project Settings → API → JWT Settings → JWT Secret.
  The backend uses this to verify the session token the frontend sends;
  without it the server refuses to start.
- `FRONTEND_URL` — where the frontend runs (`http://localhost:3000` for local dev).

Create the database schema by running the SQL files in `backend/sql/` **in
order** (`01-...` through `04-...`) in the Supabase SQL Editor.

```bash
npm run dev   # http://localhost:3001
```

### 2. Frontend setup

```bash
cd frontend
npm install

cp .env.example .env
```

Edit `.env`:
- `REACT_APP_API_URL` — the backend URL (`http://localhost:3001/api` for local dev).
- `REACT_APP_SUPABASE_URL` / `REACT_APP_SUPABASE_ANON_KEY` — same Supabase
  project as the backend (Project Settings → API).

```bash
npm start   # http://localhost:3000
```

Both servers need to be running for auth, stats, history and the Daily Word
mode. Classic/Timer/Hard/Multi are fully playable offline as a guest even if
the backend is down — only Daily Word and login-gated stats require it.

### Docker

`docker-compose.yml` and `scripts/setup.sh` exist in the repo but are **not
currently verified** — they configure the backend with `DB_HOST`/`DB_PORT`-style
variables that the app doesn't read (it only reads `DATABASE_URL`), so it will
fail to boot as-is. Use the manual npm setup above until that's fixed.

## 📝 Environment Variables

### Backend (`.env`)
```env
DATABASE_URL="postgresql://user:password@host:5432/database?sslmode=require"
PORT=3001
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
SUPABASE_JWT_SECRET=your-supabase-project-jwt-secret
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```
`JWT_SECRET`/`JWT_EXPIRES_IN` are also validated but unused today — reserved
for a possible future first-party auth flow. All real auth goes through
Supabase.

### Frontend (`.env`)
```env
REACT_APP_API_URL=http://localhost:3001/api
REACT_APP_SUPABASE_URL=https://your-project.supabase.co
REACT_APP_SUPABASE_ANON_KEY=your-supabase-anon-key
```

## 🎮 Game Modes

All five modes share the same 5-letter English word list and color-coded
feedback (🟩 correct position, 🟨 wrong position, ⬜ not in word).

- **Classic** — unlimited plays, 6 attempts, no time or extra rules.
- **Timer** — pick a time limit (10s–5min); guess before it runs out.
- **Hard** — every green/yellow clue from a previous guess must be reused.
- **Daily** — one shared word per day, same for everyone, one attempt per day.
- **Multi** — Quordle/Dordle-style: guess 2 or 4 words at once, one guess
  evaluated against every unsolved board, boardCount + 5 shared attempts
  (7 for 2 words, 9 for 4).

Signed-in users (Google, via Supabase) get their stats and game history
persisted server-side. Classic, Timer, Hard and Multi are fully playable
offline as a guest, entirely via localStorage. Daily always needs the
backend, guest or not, since the word has to be the same for everyone.

## 📊 API Endpoints

All routes below except `/auth/sync`'s registration step require a Supabase
session token (`Authorization: Bearer <access_token>`), which the frontend's
API client attaches automatically. `/daily/today` accepts an optional token.

- `POST /api/auth/sync` — sync a Supabase-authenticated user into our `users` table
- `GET /api/stats/:userId` — get a user's stats (must match the session)
- `POST /api/stats/record` — record a finished game (history + streak/stats update)
- `GET /api/history/:userId` — get a user's game history (must match the session)
- `GET /api/daily/all` — list previously used daily words
- `POST /api/daily/today` — get/set today's word, and whether this user already played
- `GET /health` — health check

## 🧪 Development Scripts

### Backend
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start         # Start production server (after build)
npm run lint          # Lint code
npm run format        # Format code
npm run type-check    # Type check
```

### Frontend
```bash
npm start             # Start development server
npm run build         # Build for production
npm test              # Run tests
```

Test coverage today is limited to the pure word-evaluation logic
(`src/utils/gameLogic.test.ts`) — there's no end-to-end or component test
suite yet.

## 📚 Architecture

### Backend (layered)
1. **Controllers** — HTTP request/response handling
2. **Services** — business logic (stats aggregation, daily word selection)
3. **Repositories** — hand-written SQL over a `pg` connection pool
4. **Middleware** — Supabase JWT verification (`requireAuth`/`optionalAuth`), error handling

### Frontend
1. **Pages** — one per route/game mode
2. **Hooks** — one local game-engine hook per mode (`useLocalClassicGame`,
   `useLocalHardGame`, `useDailyGame`, `useLocalMultiGame`), plus shared
   helpers (`useWordDictionary`, `useKeyboardColors`)
3. **Components** — board/cell/keyboard primitives reused across every mode
4. **Services** — `services/api.ts`, an axios client with an interceptor that
   attaches the current Supabase session token

---

**Ready to challenge your vocabulary? Start playing now!** 🚀
