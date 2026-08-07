# Deploy URJ on your own server (full stack + HTTPS)

This runs the **real FastAPI backend + the React frontend** on your Linux server,
behind Caddy, with **automatic free HTTPS**. One command.

## What you need

- A **Linux server** (VPS or your GBS Plus server) with **SSH access** and a **public IP**.
- **Docker + Docker Compose** installed. If not:
  ```bash
  curl -fsSL https://get.docker.com | sh
  ```
- **Ports 80 and 443 open** to the internet (firewall / security group).
- Your **domain's A record pointing at this server's public IP**
  (e.g. in GoDaddy: `A  @  <server-ip>`; remove the old `111.92.62.192`).

## Deploy (on the server)

```bash
# 1. Get the code
git clone https://github.com/Mrunalini22/urj-business.git
cd urj-business

# 2. Set your domain (must already point at this server)
echo "DOMAIN=urj-ai.com" > .env          # or urj-gbs-plus.com

# 3. Build & start everything
docker compose -f docker-compose.prod.yml up -d --build
```

That's it. Caddy automatically obtains a Let's Encrypt certificate the first time
someone hits the domain. In ~1 minute:

- **https://urj-ai.com** → the portal (frontend)
- **https://urj-ai.com/api/health** → `{"status":"ok","modules":11}` (backend)

The backend auto-seeds its content on first boot; the frontend talks to it at
`/api` on the same domain (no CORS, no separate subdomain).

## Everyday operations

```bash
docker compose -f docker-compose.prod.yml logs -f       # watch logs
docker compose -f docker-compose.prod.yml restart       # restart
docker compose -f docker-compose.prod.yml down          # stop
git pull && docker compose -f docker-compose.prod.yml up -d --build   # update after code changes
```

## How it fits together

```
Internet ──443──▶  Caddy (web container)  ──/api/*──▶  FastAPI (backend container)
                     │  auto HTTPS
                     └─ serves the React build (SPA)
```

- `frontend/Dockerfile` builds the app (with `VITE_API_BASE=https://$DOMAIN`) and serves it via Caddy.
- `frontend/Caddyfile` handles HTTPS, the SPA fallback, `/api/*` → backend, and security headers.
- `backend/Dockerfile` runs uvicorn; SQLite content auto-seeds on startup.
- `docker-compose.prod.yml` wires it together; `.env` holds your `DOMAIN`.

## Security (already built in)

- Automatic TLS 1.3 HTTPS + HSTS (preload), http→https redirect (Caddy).
- Security headers: nosniff, X-Frame-Options DENY, Referrer-Policy, Permissions-Policy, CSP.
- Backend: trusted-host + CORS locked to your domain, security headers on every response.
- No secrets in the frontend bundle.

> Want a hardened firewall in front too? Put **Cloudflare** in front of the domain
> (proxied DNS) for free DDoS protection + WAF — it layers cleanly on top of this.
