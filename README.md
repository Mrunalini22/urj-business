# URJ · DISCOM Operations Intelligence Portal

A visually rich, business-facing portal for **URJ** — a single, multi-tenant Operations
Intelligence Platform for electricity distribution utilities (DISCOMs). It presents all
**11 modules** from a business perspective, with ROI, an architecture overview and a
tool-comparison — all content served live from a database.

**Stack:** React (Vite + TypeScript) · FastAPI (Python) · PostgreSQL (SQLAlchemy).
This mirrors URJ's real production stack described in the scope document.

```
portal urj/
├─ backend/            FastAPI API — serves all portal content from the DB
│  ├─ app/
│  │  ├─ main.py          app + CORS + router wiring
│  │  ├─ config.py        env-driven settings (DATABASE_URL, CORS)
│  │  ├─ database.py      SQLAlchemy engine/session (Postgres or SQLite)
│  │  ├─ models.py        ORM tables (modules, features, benefits, ROI, …)
│  │  ├─ schemas.py       Pydantic response models
│  │  ├─ seed_data.py     all portal content, sourced from the scope PDF
│  │  ├─ seed.py          create tables + load content  (python -m app.seed)
│  │  └─ routers/content.py   /api/* endpoints
│  ├─ requirements.txt
│  └─ .env.example
├─ frontend/           React SPA (landing page + interior portal)
│  └─ src/
│     ├─ pages/        Landing.tsx, Portal.tsx
│     ├─ components/   Nav, Footer, Hero mockup, Modules grid, Module modal, Sections
│     ├─ api/client.ts REST client (Vite proxies /api → backend)
│     └─ styles/       design system (light theme, innovative fonts)
├─ docker-compose.yml  optional: PostgreSQL only
└─ static-preview/     the original single-file HTML mockup (reference)
```

---

## Run it locally

### 1 · Database (PostgreSQL)

Easiest — start Postgres with Docker (matches `backend/.env.example`):

```bash
docker compose up -d
```

Or use a Postgres you already have and create a database:

```sql
CREATE DATABASE urj_portal;
CREATE USER urj WITH PASSWORD 'urj';
GRANT ALL PRIVILEGES ON DATABASE urj_portal TO urj;
```

> **No Postgres handy?** The backend is database-agnostic. Set
> `DATABASE_URL=sqlite:///./urj_portal.db` in `backend/.env` to run instantly with zero setup.

### 2 · Backend (FastAPI)

```bash
cd backend
python -m venv .venv
.venv\Scripts\activate            # Windows  (use: source .venv/bin/activate on macOS/Linux)
pip install -r requirements.txt
copy .env.example .env            # Windows  (use: cp .env.example .env elsewhere)
python -m app.seed                # create tables + load all portal content
uvicorn app.main:app --reload     # → http://localhost:8000  (docs at /docs)
```

### 3 · Frontend (React)

```bash
cd frontend
npm install
npm run dev                       # → http://localhost:5173
```

Open **http://localhost:5173**. The Vite dev server proxies `/api/*` to the backend on `:8000`.

---

## API

| Endpoint | Purpose |
|---|---|
| `GET /api/overview` | Everything the landing page needs, in one call |
| `GET /api/modules` | All modules (filter with `?category=platform`) |
| `GET /api/modules/{slug}` | Full module detail — features, benefits, ROI, proof point |
| `GET /api/kpis` · `/architecture` · `/roi` · `/stats` · `/comparison` | Individual content sections |
| `GET /api/media` | Video slots + imagery (see "Adding video" below) |
| `GET /api/live` | **Live operations feed** — real-time metrics, load curve & alert stream |
| `GET /api/roi/config` | ROI calculator slider metadata, defaults & sizing presets |
| `POST /api/roi/calculate` | **Interactive ROI engine** — computes the business case from assumptions |
| `GET /api/viz` | **Visualization datasets** — loss heatmap, energy balance, forecast, risk clusters, reliability |
| `GET /api/health` | Liveness + module count |

### Visualization showcase

The **Intelligence in Action** section renders six animated, data-driven charts (pure inline SVG — no
chart library, fully self-contained): a live single-line diagram with animated power flow, an AT&C loss
heatmap by zone/month, an energy-balance breakdown, a load forecast with confidence band, a consumer
risk-cluster scatter, and a reliability (SAIDI/SAIFI) trend. Data comes from `GET /api/viz`
(`backend/app/routers/viz.py`) — swap those generators for real queries to drive them from production data.

### Content & branding

Module detail follows the official URJ brochure structure — **What it is / Where we use it / Outcome we
get / How we achieve it** (`WWOH` in `backend/app/seed_data.py`). Branding matches the brochure: the URJ
mark (`frontend/src/components/Logo.tsx`) and **GBS PLUS Pvt Ltd** company/contact details in the footer.
All copy stays name-free (no internal model/algorithm/vendor names) for the investor audience.

### Interactive ROI engine

The ROI section is a live calculator. Adjust the assumptions (energy input, AT&C loss, reduction,
realisation, collection gain, operational saving, **share credited to URJ**, platform cost) and the
frontend POSTs them to `POST /api/roi/calculate`, which returns gross opportunity, the attributable
share, net annual benefit, ROI multiple, payback and a 5-year projection — all in ₹ crore.

The model is deliberately **conservative and transparent**: it never claims 100% of the theoretical
loss-recovery opportunity. A "share credited to URJ" lever attributes only part of the gross opportunity
to the platform (the rest depends on metering, enforcement and field execution), so the headline
multiple stays defensible. The math lives in `backend/app/routers/roi_engine.py` — edit `PRESETS`,
`FIELDS` or `compute()` to retune it.

### Live data

The **Live Operations** section streams from `GET /api/live`, which the frontend polls every 3 seconds.
The backend generates realistic, continuously-changing distribution telemetry from the current time
(a daily demand curve + smooth drift + jitter): power delivered, AT&C loss, collection efficiency,
feeders reporting, smart meters online, power factor, active alerts and field crews — plus a live
daily load curve and a rotating alert/event feed. To wire it to a real utility feed, replace
`snapshot()` in `backend/app/routers/live.py` with your live data source.

> **Note on content:** all copy is written for a business / investor audience — no internal
> model, algorithm or vendor product names are exposed. Edit `backend/app/seed_data.py` to adjust.

Interactive API docs: **http://localhost:8000/docs**

---

## Editing content

All portal content lives in **`backend/app/seed_data.py`** — the single source of truth
(sourced from `URJ_Portal_Business_Scope_v2.pdf`). Edit it, then re-run `python -m app.seed`
to reload the database. ROI figures marked *"modelled"* are indicative targets derived from
the operational benefits each module describes, not audited results.

## Production build

```bash
cd frontend && npm run build     # → dist/  (static assets)
```

Serve `frontend/dist/` behind any static host / nginx, with the FastAPI backend reachable at `/api`.
