# Deploying URJ for free (full stack)

You'll host two things, both on free tiers:

- **Backend** (FastAPI) → **Render** — auto-seeds its content on first boot.
- **Frontend** (React/Vite static build) → **Vercel** (or Netlify).

Deploy the **backend first**, copy its URL, then deploy the frontend pointing at it.

> Free-tier note: Render's free web service **sleeps after ~15 min idle** and takes
> ~30–60s to wake on the next request. So the first page load after idle will pause on
> the loading screen, then work normally. That's expected on the free plan.

---

## 0 · Put the code on GitHub (one time)

Both hosts deploy from a Git repo.

```bash
cd "F:/portal urj"
git init
git add .
git commit -m "URJ portal"
```

Create an empty repo on github.com, then:

```bash
git remote add origin https://github.com/<you>/urj-portal.git
git branch -M main
git push -u origin main
```

---

## 1 · Backend on Render

1. Go to **https://render.com** → sign up (free, GitHub login).
2. **New +** → **Blueprint** → connect your repo.
   Render reads **`render.yaml`** and creates the `urj-backend` web service automatically.
   *(No Blueprint? Use **New + → Web Service** instead, and set: Root Directory `backend`,
   Build `pip install -r requirements.txt`, Start `uvicorn app.main:app --host 0.0.0.0 --port $PORT`.)*
3. Click **Apply / Create**. First build takes a few minutes.
4. When it's live, copy the URL, e.g. **`https://urj-backend.onrender.com`**.
5. Test it: open `https://urj-backend.onrender.com/api/health` — you should see
   `{"status":"ok","modules":11}` (the DB auto-seeds on first boot).

`CORS_ORIGINS` is set to `*` in `render.yaml` so any frontend can call it — fine for a demo.
To lock it down later, set it to your exact frontend URL in the Render dashboard.

---

## 2 · Frontend on Vercel

1. Go to **https://vercel.com** → sign up (free, GitHub login) → **Add New… → Project** → import your repo.
2. Set **Root Directory** = `frontend` (Framework auto-detects as **Vite**).
3. Under **Environment Variables**, add:
   - **Name:** `VITE_API_BASE`
   - **Value:** your Render backend URL, no trailing slash — e.g. `https://urj-backend.onrender.com`
4. **Deploy.** In ~1 minute you get a public URL like `https://urj-portal.vercel.app`.

Open that URL — the sidebar, live data, ROI engine, charts and all imagery load from your
hosted backend. Done. 🎉

> If you change `VITE_API_BASE` later, trigger a **redeploy** — Vite bakes env vars in at build time.

### Netlify instead of Vercel (alternative)

1. **https://netlify.com** → **Add new site → Import an existing project** → pick the repo.
2. Netlify reads **`netlify.toml`** (base `frontend`, publish `dist`).
3. **Site settings → Environment variables** → add `VITE_API_BASE` = your Render URL.
4. **Deploy site.**

---

## Optional · persistent Postgres on Render

The backend defaults to SQLite, which re-seeds on every restart (fine — the content is fixed).
For a persistent database instead, edit `render.yaml`: uncomment the `databases:` block and the
`DATABASE_URL … fromDatabase` env var, and remove the plain `DATABASE_URL: sqlite:///...` line.
The backend auto-detects and normalizes the Postgres URL.

---

## Local development (unchanged)

```bash
cd backend  && ./.venv/Scripts/python -m uvicorn app.main:app --port 8000
cd frontend && npm run dev        # http://localhost:5173
```

Leave `VITE_API_BASE` unset locally — Vite proxies `/api` to `localhost:8000`.
