# Hosting URJ on urj-ai.com — HTTPS + full security

## What I already hardened (in the code)

The app now ships production-grade security. When you deploy, these are active automatically:

**Frontend** (`vercel.json` + `public/_headers`):
- **Content-Security-Policy** — locks scripts/styles/fonts/images/connections to known sources; `frame-ancestors 'none'` (no clickjacking), `object-src 'none'`, `upgrade-insecure-requests`.
- **Strict-Transport-Security (HSTS)** with `preload` — forces HTTPS for 2 years.
- **X-Content-Type-Options: nosniff**, **X-Frame-Options: DENY**, **Referrer-Policy**, **Permissions-Policy** (camera/mic/geo denied), **Cross-Origin-Opener-Policy**.

**Backend** (FastAPI middleware):
- Same security headers + **HSTS** on every response.
- **TrustedHostMiddleware** — rejects requests with an unexpected `Host` header.
- **CORS locked** to your real frontend origin (no wildcard in production), methods limited to GET/POST.
- No secrets in the frontend bundle; the API serves only public content + calculations (no user data, no write endpoints).

**HTTPS itself is automatic** — Vercel and Render each issue and renew a free Let's Encrypt certificate for your custom domain, and redirect http→https. You don't touch certificates.

---

## The three things only you can do (they need your accounts / payment)

1. **Buy the domain `urj-ai.com`** at a registrar (Cloudflare Registrar, Namecheap, GoDaddy… ~$10–15/yr). I can't purchase it.
2. **Deploy** to your Vercel + Render accounts (your logins).
3. **Add the DNS records** at your registrar (your login).

Everything below is the exact click-path.

---

## Step 1 — Deploy (if not already)

Follow `DEPLOY.md`:
- **Backend → Render** (Blueprint reads `render.yaml`). Note its URL, e.g. `urj-ai-backend.onrender.com`.
- **Frontend → Vercel** (Root Directory = `frontend`).

## Step 2 — Point the API at your domain (backend)

In **Render → your service → Settings → Custom Domains**: add **`api.urj-ai.com`**. Render shows a **CNAME target** (like `urj-ai-backend.onrender.com`).

Then in **Render → Environment**, set:
- `CORS_ORIGINS` = `https://urj-ai.com,https://www.urj-ai.com`
- `ALLOWED_HOSTS` = `api.urj-ai.com,urj-ai-backend.onrender.com`

## Step 3 — Point the site at your domain (frontend)

In **Vercel → your project → Settings → Domains**: add **`urj-ai.com`** and **`www.urj-ai.com`**. Vercel shows the DNS records to add.

In **Vercel → Settings → Environment Variables**, set (then redeploy):
- `VITE_API_BASE` = `https://api.urj-ai.com`

## Step 4 — Add DNS records (at your registrar)

Typical values (Vercel/Render show you the exact ones — use theirs if different):

| Type  | Name  | Value                                   | Purpose            |
|-------|-------|-----------------------------------------|--------------------|
| A     | `@`   | `76.76.21.21`                           | apex → Vercel      |
| CNAME | `www` | `cname.vercel-dns.com`                  | www → Vercel       |
| CNAME | `api` | `urj-ai-backend.onrender.com`           | api → Render       |

DNS takes a few minutes to a few hours. Once it resolves, Vercel and Render each auto-issue the HTTPS certificate. Done — `https://urj-ai.com` is live and secured.

> Tip: if you buy the domain at **Cloudflare Registrar** and use Cloudflare DNS, you also get free DDoS protection and a WAF in front of everything — the strongest "full security" option, at no extra cost.

---

## Step 5 — Verify the security (2 minutes)

1. Open `https://urj-ai.com` — padlock shown, no "not secure".
2. Scan it at **https://securityheaders.com** → should grade **A / A+**.
3. Scan TLS at **https://www.ssllabs.com/ssltest/** → should grade **A / A+**.
4. Confirm `http://urj-ai.com` auto-redirects to `https://`.

If `securityheaders.com` flags anything, it'll name the exact header — paste it to me and I'll adjust the CSP/headers.

---

## Note on the CSP + your API host

The Content-Security-Policy currently allows the frontend to call `https://api.urj-ai.com` and `https://*.onrender.com`. If your backend ends up on a **different** host, tell me and I'll update `connect-src` in `frontend/vercel.json` and `frontend/public/_headers`.
