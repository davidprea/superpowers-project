# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Full-stack site for a school consortium experimenting with AI-based student portfolio assessment. Primary domain `superpowersproject.org`. Deployed to Render.com (see `render.yaml`).

`PROMPT.md` is the original product spec — read it for feature intent, user states, and tagging/email rules. `STYLE.md` describes the "Laboratory" visual aesthetic (warm paper, serif headlines, mono labels, copper accent) and the design tokens.

## Repo layout

Two siblings, each with its own `package.json` and `node_modules`:

- `server/` — Express 5 API (CommonJS, `require`)
- `client/` — React 19 + Vite + Tailwind 4 + DaisyUI (ESM, `import`)

There is **no** root `package.json`. Always `cd` into `server/` or `client/` before running npm scripts.

## Common commands

```bash
# Server (port 3001)
cd server
npm run dev          # node --watch index.js
npm run migrate      # run any new SQL files in db/migrations/
npm run seed         # idempotent — creates admin from ADMIN_EMAIL/ADMIN_PASSWORD

# Client (port 5173)
cd client
npm run dev          # Vite dev server; proxies /api → localhost:3001
npm run build
npm run lint         # eslint .
```

No test suite exists. Don't claim to have run tests.

## Environment

Server reads `server/.env` (see `.env.example` at repo root for the canonical list). Two startup invariants enforced in `server/index.js` and `server/db/seed.js`:

- `JWT_SECRET` must be set and not the placeholder `your-secret-key-change-this` — server exits otherwise.
- `ADMIN_EMAIL` and `ADMIN_PASSWORD` must be set for `seed.js` — it throws otherwise. No `changeme123` fallback.

`CORS_ORIGIN` is a comma-separated allowlist of browser origins. In dev it must include `http://localhost:5173`. Requests with no `Origin` header (curl, server-to-server) are allowed through.

Client reads `VITE_API_URL` at build time. If unset, `client/src/services/api.js` falls back to a relative `/api` (which is what the Vite proxy expects in dev).

## Architecture

### Backend
- Express 5, mounted route modules under `/api/*` in `server/index.js`. Each file in `server/routes/` handles one resource (auth, blog, resources, tags, members, subscribers, email, uploads).
- `server/middleware/auth.js` exports `authenticate` (verifies JWT, loads user) and `requireRole('admin', ...)`. Apply both for admin endpoints.
- DB access via a single `pg` Pool in `server/db/pool.js`. Production uses SSL with `rejectUnauthorized: false` because Render's managed Postgres uses self-signed certs over their private network — do not copy this elsewhere.
- Migrations are plain `.sql` files in `server/db/migrations/`, run in lexical order by `db/migrate.js`, tracked in a `migrations` table. To add one, drop a new `NNN_description.sql` file — do not edit existing migrations.
- Image uploads go to Cloudflare R2 via `services/uploadService.js` (S3-compatible SDK). The server never serves uploaded files directly.
- Emails go through `services/emailService.js` (Resend). If `RESEND_API_KEY` is unset, it logs a stub instead of sending — useful in dev. Unsubscribe links are signed via `services/unsubscribeToken.js` using `JWT_SECRET`.

### Frontend
- Routing in `client/src/routes/AppRouter.jsx`. Public pages render under `PageLayout`; admin pages under `AdminRoute` (gate) → `AdminLayout`.
- Auth state lives in `client/src/context/AuthContext.jsx`. Token is stored in `localStorage` and attached by the axios interceptor in `services/api.js`. A 401 on any non-login request clears the token and redirects to `/login`.
- Pages are flat under `pages/public/` and `pages/admin/` — no per-feature folders. Shared layout primitives are in `layouts/`.
- TipTap is the blog post editor. `marked` renders markdown elsewhere.

### Data model highlights
- `users.role` is the enum `('observer','member','admin')`. `member_status` (`pending`/`approved`/`rejected`) gates members-area access for `role='member'`. Access control is by role/status only — **tags are not access control**.
- Newsletter subscribers (`newsletter_subscribers`) are a separate table from `users`. The old `user_tags` table was dropped in migration 008; subscriber tagging uses `subscriber_tags`.
- Always lowercase + trim email before any `SELECT`/`INSERT`/`UPDATE` on users or subscribers (existing code in `routes/auth.js`, `routes/subscribers.js` does this).

## Deployment

`render.yaml` defines three services: Postgres DB, Node API, and the static frontend. The API's `startCommand` runs `migrate && seed && index.js` on every boot — both scripts are idempotent. Secrets (`RESEND_API_KEY`, `CORS_ORIGIN`, `SITE_URL`, `ADMIN_*`, `R2_*`, `VITE_API_URL`) are set in the Render dashboard, not in the YAML.

## Styling conventions

Use DaisyUI semantic classes (`btn-primary`, `bg-base-100`) over hardcoded Tailwind colors so the theme stays swappable. The intended palette/typography is documented in `STYLE.md` — refer to it before making visual changes.
