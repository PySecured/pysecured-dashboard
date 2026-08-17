# PySecured Dashboard (frontend)

The web UI for PySecured — talks to the API running inside your Discord bot
on Cybrancee. This is a separate deployable from the bot itself; it doesn't
need Cybrancee or any server of its own.

## Local development

```bash
npm install
cp .env.example .env   # point VITE_API_URL at your bot's dashboard API
npm run dev
```

Runs at `http://localhost:5173`. For local dev against a locally-running
bot, set `DASHBOARD_ALLOWED_ORIGINS=http://localhost:5173` in the bot's
`.env` so CORS allows it.

## Deploying to Vercel with your own domain

1. Push this folder to a GitHub repo.
2. vercel.com -> Add New Project -> import the repo. Vercel auto-detects
   Vite; no build config needed.
3. Before deploying, add an environment variable:
   - `VITE_API_URL` = `https://api.yourdomain.com` (your bot's dashboard
     API — see the main project's README for the Cloudflare Tunnel setup
     that gets you this URL from Cybrancee).
4. Deploy. Vercel gives you a `*.vercel.app` URL immediately.
5. Custom domain: Project -> Settings -> Domains -> add
   `dashboard.yourdomain.com`. Vercel shows you a DNS record (usually a
   CNAME) to add at your domain registrar/DNS provider — HTTPS is issued
   automatically once it propagates.
6. Back in the bot's `.env` on Cybrancee, set
   `DASHBOARD_ALLOWED_ORIGINS=https://dashboard.yourdomain.com` (must match
   exactly — scheme, host, no trailing slash) and restart the bot so CORS
   and the post-login redirect both point at the real domain.
7. In the Discord Developer Portal -> your app -> OAuth2, add
   `https://api.yourdomain.com/auth/callback` as a redirect URL — it must
   match `DASHBOARD_REDIRECT_URI` in the bot's `.env` exactly.

## What's here

- `src/pages/Login.jsx` — "Continue with Discord" button, redirects to the API's `/auth/login`.
- `src/pages/Guilds.jsx` — server picker, shows only servers you admin where the bot is present.
- `src/pages/Settings.jsx` — the actual settings, mirrors the `/setup` Discord panel exactly: general protection, trap channel, whitelist — including the two action buttons (auto-create & lock the quarantine role, post/refresh the trap channel notice) that actually perform Discord actions, not just save config.
- `src/api.js` — fetch wrapper; every request sends cookies (`credentials: 'include'`) so the session from login is included.
- `src/AuthContext.jsx` — tracks the logged-in user app-wide, redirects to `/login` if the session check fails.

## Extending it

Every field here maps 1:1 to a key in the bot's `utils/config_manager.py`
`DEFAULT_CONFIG`. Adding a new setting there just means adding the matching
control in `Settings.jsx` — the backend already accepts any key that exists
in `DEFAULT_CONFIG` through `PATCH /api/guilds/{id}/config`.
