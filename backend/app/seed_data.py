"""Portal content sourced from URJ_Portal_Business_Scope_v2 — the single source of truth
for seeding the database. ROI metric values marked 'modelled' are indicative targets."""

CATEGORY_LABELS = {
    "exec": "Leadership",
    "ops": "Network & Assets",
    "revenue": "Revenue & Loss",
    "analytics": "Analytics & ROI",
    "field": "Field Force",
    "platform": "Platform & Governance",
}

MODULES = [
    {
        "num": "01", "slug": "executive-command-center", "icon": "command", "category": "exec",
        "title": "Executive Command Center",
        "driver": "Leadership visibility · faster decisions",
        "short": "A single, always-current pane of glass for leadership — replacing the manual weekly collation of numbers from separate systems.",
        "roi_head": "Reporting: days → real-time",
        "features": [
            "Tenant-adaptive, fleet-wide KPI scorecard across assets, consumers, revenue & reliability",
            "Live alert feed aggregated across every connected telemetry source (tamper, outage, threshold breach)",
            "Real-time dashboard push — no manual refresh during an incident",
            "Fleet-level consumer-asset drill-down by DT, feeder, meter, net-meter or solar down to individual consumer",
        ],
        "benefits": [
            "One pane of glass for leadership — no manual collation before a review",
            "Faster situational awareness during outages; dashboards update live, not on a refresh cycle",
            "Cuts management-reporting turnaround from days of spreadsheet work to real time",
        ],
        "metrics": [
            ("90%+", "less time collating review numbers"),
            ("Real-time", "situational awareness in incidents"),
            ("1", "source of truth across all functions"),
        ],
        "proof": "Fleet-consumer mapping is drawn from the same live topology crosswalk the SLD module uses — verified against real DT/feeder telemetry, not a static asset register.",
    },
    {
        "num": "02", "slug": "network-ops-sld", "icon": "network", "category": "ops",
        "title": "Network Operations & Single-Line Diagrams",
        "driver": "Faster fault localisation & restoration",
        "short": "Converts a utility's existing substation Excel register into a live, interactive single-line diagram automatically — overlaid with real-time telemetry, not a static drawing.",
        "roi_head": "Weeks of CAD drafting → automatic",
        "features": [
            "Auto-generated IEC/ANSI single-line diagrams straight from an uploaded substation register",
            "Live telemetry overlay: real voltage/current per meter & DT, colour-coded by voltage band",
            "Animated live-status indicators — see at a glance which parts of the network are reporting now",
            "Feeder / substation / RMU / SCADA views with cascading filters, plus a GIS asset map",
            "Integrated OMS work-order and CRM complaint tracking",
        ],
        "benefits": [
            "Eliminates weeks of manual CAD drafting — diagrams regenerate when the register updates",
            "Staff see real equipment status layered on the diagram — faster fault localisation & restoration",
            "One system spans topology, live telemetry and outage handling instead of separate GIS/SCADA/OMS tools",
        ],
        "metrics": [
            ("0", "manual redrawing on register update"),
            ("69", "substations auto-parsed, 2 circles"),
            ("↓ MTTR", "faster fault localisation"),
        ],
        "proof": "Verified end-to-end on real circle data: 69 substations across two circles (Barpeta and Guwahati Electric Circle-I), auto-parsed from utility-supplied Excel registers with zero manual redrawing.",
    },
    {
        "num": "03", "slug": "asset-maintenance-eam", "icon": "wrench", "category": "ops",
        "title": "Asset & Maintenance Management",
        "driver": "Predictive maintenance · asset life extension",
        "short": "A full, config-driven Enterprise Asset Management workbench — every lookup, fault code and workflow rule is an editable record, not a hardcoded value needing a developer.",
        "roi_head": "Reactive → predictive maintenance",
        "features": [
            "10-module EAM/CMMS workbench: fault codes, PM schedules, standard jobs, skills, KPIs — all editable in-app",
            "360° asset drill-down for any asset type or ID",
            "Time-to-failure (TTF) and fault-mode prediction, pre-computed per asset",
            "Risk forecasting that fuses four real input streams per asset into one score",
            "Depreciation, procurement (PR/PO), tool register, document management & compliance reporting",
            "Work-order lifecycle, Permit-to-Work and multi-step approval state machine",
        ],
        "benefits": [
            "Shifts maintenance from reactive/calendar-based to predictive/risk-based — fewer unplanned outages, longer asset life",
            "One system of record for the full asset lifecycle — capex, operation, depreciation, disposal",
            "Configurable without developers — engineers add fault codes, PM frequencies or job types themselves",
        ],
        "metrics": [
            ("↓ 15–25%", "unplanned outages (modelled)"),
            ("10", "EAM/CMMS sub-modules in one workbench"),
            ("+ Years", "extended asset life via risk-based PM"),
        ],
        "proof": "Every lookup, fault code and workflow rule is a database-backed record editable from the UI — DISCOM engineers configure the system without a development cycle.",
    },
    {
        "num": "04", "slug": "revenue-assurance", "icon": "coins", "category": "revenue",
        "title": "Revenue Assurance & Loss Reduction",
        "driver": "AT&C loss reduction · theft detection",
        "short": "Targets the single metric every DISCOM is judged on — Aggregate Technical & Commercial (AT&C) loss — with automated, always-on detection instead of periodic manual audits.",
        "roi_head": "The headline national metric, continuously",
        "features": [
            "Consumer 360° profile: search, billing history, payment record and meter-reading trend in one view",
            "Automated billing-anomaly detection across the live smart-meter feed — nil consumption, sudden drops, tamper flags",
            "AT&C loss heatmap and collection-efficiency tracking",
            "Loss & audit module: energy balance plus a full regulatory audit log",
        ],
        "benefits": [
            "Directly targets AT&C loss — the headline metric under national loss-reduction schemes — continuously, not via periodic physical audit",
            "Surfaces revenue leakage (theft, meter bypass, billing error) in near real time instead of at the next audit cycle",
            "Gives commercial/audit teams a ranked, evidence-backed worklist instead of blanket field inspections",
        ],
        "metrics": [
            ("↓ 2–4pp", "AT&C loss reduction target (modelled)"),
            ("Near real-time", "leakage detection vs audit cycle"),
            ("Ranked", "evidence-backed inspection worklist"),
        ],
        "proof": "Anomaly detection runs continuously across the live smart-meter feed — every flag is evidence-backed and traceable to a real reading, giving audit teams a defensible worklist.",
    },
    {
        "num": "05", "slug": "discom-ai-insights", "icon": "brain", "category": "revenue",
        "title": "DISCOM AI Insights — Billing & Consumer Intelligence",
        "driver": "TOD tariff & sanctioned-load compliance",
        "short": "The platform's newest, most data-dense module — built directly on the real Time-of-Day billing API and the utility's own consumer register. Every figure traces to a live source, nothing synthetic.",
        "roi_head": "Two siloed feeds → one auditable layer",
        "features": [
            "Power-factor risk scoring using real trend regression, with dormant-connection false positives filtered out",
            "Reactive-power compensation targeting via statistical outlier detection",
            "Tamper-event surfacing, sanctioned-load audit, phase-integrity monitoring, unit-normalised DTR loading",
            "Transparent, explainable composite risk score per consumer — contributing weights are shown, not hidden",
            "Consumer load clustering, distribution-transformer load forecasting and billing-anomaly detection",
            "A live-polling Executive Summary that recomputes findings and states the DISCOM implication in plain language",
        ],
        "benefits": [
            "Unifies two previously siloed feeds — billing API and consumer register — into one queryable intelligence layer",
            "Every score is explainable and auditor-traceable to a real source number — not a black-box vendor model",
            "Directly supports Time-of-Day tariff compliance and sanctioned-load enforcement — active revenue levers",
        ],
        "metrics": [
            ("100%", "figures traceable to a live source"),
            ("Explainable", "risk scores, weights shown"),
            ("2 → 1", "siloed feeds unified into one layer"),
        ],
        "proof": "Coverage is intentionally reported wherever it is partial rather than silently extrapolated — a deliberate design choice to keep every insight defensible under audit.",
    },
    {
        "num": "06", "slug": "predictive-roi-engine", "icon": "trend", "category": "analytics",
        "title": "Predictive Analytics, Forecasting & ROI Engine",
        "driver": "Power-purchase planning · capex prioritisation",
        "short": "Real, trained statistical and machine-learning models — not canned demo charts — covering load forecasting, power quality and investment-return analysis.",
        "roi_head": "Static business cases → live what-if",
        "features": [
            "Trained load forecasts per feeder, retrained on demand on the latest interval data",
            "Transparent model catalogue & registry — every AI/ML model in production, what it consumes and predicts",
            "An 18-endpoint Intelligence Suite plus a real-time visualisation layer",
            "Composite Power Quality Index and Demand-Response endpoints",
            "A 15-calculator ROI engine supporting live what-if assumption overrides — no round-trip to re-run a scenario",
            "A data-quality workbench for irregular-interval telemetry, plus tenant-adaptive Exploratory Data Analysis",
        ],
        "benefits": [
            "Load forecasting supports better power-purchase planning — reducing under-drawal penalties and costly last-minute market purchases",
            "The ROI engine lets capex committees run investment scenarios live — DT augmentation, feeder bifurcation, smart-meter rollout — backed by real operational data",
            "Full model transparency supports regulatory and internal-audit scrutiny of any AI-driven decision",
        ],
        "metrics": [
            ("15", "live ROI calculators, what-if overrides"),
            ("18", "intelligence-suite endpoints"),
            ("↓ Penalties", "better power-purchase planning"),
        ],
        "proof": "The forecasting models are real and trained — they retrain on demand on the latest interval data and cache for performance, feeding a 15-calculator ROI engine used by capex committees.",
    },
    {
        "num": "07", "slug": "field-force-mobile", "icon": "phone", "category": "field",
        "title": "Field Force Mobile Application",
        "driver": "Field-force digitisation & productivity",
        "short": "A native Android application purpose-built for foreman and lineman roles, sharing one real-time backend with the control-room portal.",
        "roi_head": "Paper registers → real-time dispatch",
        "features": [
            "Native Android app with distinct, role-based home screens for foreman and lineman",
            "Digital check-in / attendance and photo capture in the field",
            "Job pool, crew board and an escalation queue for issues needing supervisor attention",
            "Real-time work-order assignment and status sync with the main portal, with live push notifications",
        ],
        "benefits": [
            "Digitises field attendance and job assignment — replaces paper registers and phone-call dispatch",
            "Shortens the fault-to-repair cycle: crews receive and acknowledge work orders in real time",
            "Photo-evidence capture builds an audit trail for completed work and supports warranty/AMC claims",
        ],
        "metrics": [
            ("↑ 20–30%", "crew productivity (modelled)"),
            ("Real-time", "work-order acknowledgement"),
            ("0 paper", "digital attendance & job assignment"),
        ],
        "proof": "Built and operational today for APDCL; the same architecture is designed to be rebranded and reused for additional DISCOM tenants.",
    },
    {
        "num": "08", "slug": "data-ingestion-hub", "icon": "hub", "category": "platform",
        "title": "Data Ingestion & Multi-Source Integration Hub",
        "driver": "Vendor-agnostic data onboarding",
        "short": "A dedicated integration layer so onboarding a new metering vendor or data source doesn't mean building a new bespoke dashboard from scratch.",
        "roi_head": "Per-vendor rebuilds → one canonical layer",
        "features": [
            "Ingestion Platform with per-source pipelines, schedules, quality rules, a dead-letter queue and observability dashboard",
            "Admin-controlled triggers and live status for upstream vendor integrations (AMISP/HES feeds)",
            "A unified-schema 'canonical' layer that normalises every tenant's disparate source data before any dashboard",
            "Three-phase HT-meter intelligence for high-tension industrial connections",
            "India Energy Stack (IES) MeterData v0.6 standards-compliance module",
            "A generic configuration CRUD framework so new lookup/config collections register without new backend code",
        ],
        "benefits": [
            "One integration layer serves every AMISP/HES vendor a DISCOM contracts with — no per-vendor bespoke dashboard",
            "The dead-letter queue and observability dashboard surface data-quality problems immediately",
            "Alignment with the India Energy Stack standard reduces future integration cost as the national mandate matures",
        ],
        "metrics": [
            ("1", "integration layer for all vendors"),
            ("IES v0.6", "national-standard aligned"),
            ("↓ Cost", "future vendor onboarding"),
        ],
        "proof": "A unified canonical schema normalises every tenant's disparate source data before it reaches any dashboard — new metering vendors onboard as configuration, not a rebuild.",
    },
    {
        "num": "09", "slug": "platform-security-governance", "icon": "shield", "category": "platform",
        "title": "Multi-Tenant Platform Security & Governance",
        "driver": "Cyber-risk reduction · multi-DISCOM scale",
        "short": "The security and tenancy layer that lets one platform serve multiple DISCOMs safely — with access control enforced at the API, not just hidden in the UI.",
        "roi_head": "Shared platform, real tenant isolation",
        "features": [
            "Full multi-tenant architecture: each DISCOM gets isolated data access, gated menus and its own login",
            "Role-based access control enforced at the route level, plus a superadmin RBAC management console",
            "Authenticator-app multi-factor authentication and passkey login support",
            "URJ Shield — a client-side bot-defense / proof-of-work gate protecting the public login surface",
            "A full audit log covering login history, security alerts, security events and administrative actions",
        ],
        "benefits": [
            "One platform serves multiple DISCOMs with real, verified tenant isolation — cross-tenant access refused with HTTP 403 — at sharply lower per-DISCOM cost than separate installs",
            "Passkey/MFA plus bot-defense meaningfully raises the bar against credential-stuffing and phishing",
            "A full audit trail supports both internal governance and external regulatory or security review",
        ],
        "metrics": [
            ("HTTP 403", "verified cross-tenant refusal"),
            ("↓ Cost", "vs separate per-DISCOM installs"),
            ("MFA + Passkey", "credential-attack resistance"),
        ],
        "proof": "Access control is enforced at the API layer, not just the UI — a user without a tenant's discom_scope grant is refused with an HTTP 403 on every route, verified directly against the running system.",
    },
    {
        "num": "10", "slug": "licensing-compliance", "icon": "key", "category": "platform",
        "title": "Standalone Licensing & Compliance Service",
        "driver": "Commercial packaging · audit-ready licensing",
        "short": "An independent License Management Service, decoupled from the operational portal, so licensing logic never becomes a point of operational failure.",
        "roi_head": "Fail-open by design — never an outage",
        "features": [
            "Cryptographically signed, offline-verifiable license tokens — the portal keeps working even if the licensing server is briefly unreachable",
            "A break-glass emergency-access procedure for exceptional circumstances",
            "A hash-chained, tamper-evident audit log of every licensing action",
            "Usage metering, with both an admin console and a self-service portal for license management",
        ],
        "benefits": [
            "Lets URJ be commercially packaged and licensed per DISCOM or per module without bespoke billing logic",
            "The fail-open design means a licensing-service outage never becomes an operational outage",
            "A tamper-evident audit trail supports commercial dispute resolution and compliance audits",
        ],
        "metrics": [
            ("Fail-open", "licensing outage ≠ operational outage"),
            ("Per-module", "flexible commercial packaging"),
            ("Tamper-evident", "hash-chained licensing audit"),
        ],
        "proof": "License tokens are cryptographically signed and offline-verifiable — critical for infrastructure software running a utility's operations, where a licensing hiccup must never take the grid tools down.",
    },
    {
        "num": "11", "slug": "conversational-ai", "icon": "chat", "category": "exec",
        "title": "Conversational AI / Knowledge Assistant",
        "driver": "Self-service insight for non-technical staff",
        "short": "A portal-wide assistant and an extensible automated-agent framework, so getting an answer doesn't always require an analyst or an IT ticket.",
        "roi_head": "Analyst tickets → self-service answers",
        "features": [
            "A portal-wide AI assistant that answers questions grounded in the DISCOM's own live data",
            "An agent framework — list, run, history and knowledge-agent 'ask' endpoints — extensible to new workflows",
        ],
        "benefits": [
            "Lowers the barrier for non-technical staff — junior engineers, field supervisors — to self-serve answers instead of waiting on an analyst or IT ticket",
            "The extensible agent framework means new automated workflows (e.g. auto-drafted compliance reports) can be added without a platform rewrite",
        ],
        "metrics": [
            ("Self-serve", "answers without an analyst"),
            ("Grounded", "in the DISCOM's own live data"),
            ("Extensible", "agent framework, no rewrite"),
        ],
        "proof": "Answers are grounded in the DISCOM's own live data — not a generic model — and the agent framework is designed to absorb new automated workflows without a platform rewrite.",
    },
]

HERO_STATS = [
    ("11", "", "business-grade modules on one platform"),
    ("2", "+", "live DISCOM tenants, one shared backend"),
    ("70", "+", "API route modules across every domain"),
    ("69", "", "substations auto-parsed, zero redrawing"),
]

KPIS = [
    ("chart", "2–4", "pp", "AT&C loss reduction",
     "Targeted, always-on detection of theft, bypass and billing error against the live meter feed. Modelled reduction on the headline national metric."),
    ("shield", "↓ MTTR", "", "Reliability · SAIDI / SAIFI",
     "Live network status on the single-line diagram plus real-time field dispatch shorten fault localisation and the fault-to-repair cycle."),
    ("trend", "15", "", "Live ROI calculators",
     "Capex committees run DT augmentation, feeder bifurcation and smart-meter scenarios live — backed by real operational data, not a static spreadsheet."),
    ("users", "20–30", "%", "Field-force productivity",
     "Native Android app replaces paper registers and phone dispatch with real-time work-order assignment, digital attendance and photo evidence."),
]

ARCH_LAYERS = [
    ("01", "Web application", "Live-updating operational dashboards with real-time push — no manual refresh during an incident"),
    ("02", "Unified API service", "One backend covering 70+ capability areas across every business domain — simple to run and govern"),
    ("03", "Per-tenant data", "Each utility gets its own isolated database, with a shared platform layer for configuration and licensing"),
    ("04", "Edge & security", "Reverse proxy with bot-defense · role-based access, multi-factor authentication, passkeys and full audit logging"),
    ("05", "Native mobile apps", "Purpose-built field applications for crews, delivered as per-utility branded builds"),
    ("06", "Licensing service", "Independent, offline-verifiable and fail-open by design — licensing never becomes an operational outage"),
]

ROI_LEVERS = [
    ("−2.4", "pp", "AT&C loss reduction target", 72),
    ("98", "%", "Collection efficiency ceiling", 94),
    ("−90", "%", "Reporting turnaround time", 90),
    ("+25", "%", "Field crew productivity", 80),
]

ROI_FLOWS = [
    ("bolt", "Revenue leakage recovered", "Theft, meter bypass & billing error, near real-time", "up"),
    ("grid", "Point-tool licences consolidated", "GIS, SCADA viewer, OMS, ROI tools → one platform", "down"),
    ("clock", "Manual effort eliminated", "CAD drafting, report collation, paper dispatch", "down"),
    ("hub", "Per-DISCOM deployment cost", "Shared multi-tenant backend vs separate installs", "down"),
    ("trend", "Better power-purchase planning", "Load forecasting cuts under-drawal penalties", "up"),
]

# ── Module "What / Where / Outcome / How" (from the URJ brochure, name-free) ──
WWOH = {
    "executive-command-center": {
        "what": "A single, always-current dashboard for leadership and cross-functional review — replacing the manual weekly/monthly collation of numbers from separate systems.",
        "where": "Leadership review meetings, the control room during live incidents, and board / regulator reporting.",
        "outcome": "A single pane of glass for leadership; faster situational awareness during outages; reporting turnaround cut from days of spreadsheet work to real time.",
        "how": "A tenant-adaptive, fleet-wide KPI scorecard, a live alert feed aggregated across every telemetry source, real-time server-push updates, and fleet-level consumer-asset drill-down to individual consumers.",
    },
    "network-ops-sld": {
        "what": "Converts a utility's existing substation asset register into a live, interactive single-line diagram automatically, overlaid with real-time telemetry.",
        "where": "Control-room fault localisation, field crews viewing the same live diagram, and substation planning teams.",
        "outcome": "Eliminates weeks of manual CAD drafting; faster fault localisation and restoration; one system spans topology, telemetry and outage handling.",
        "how": "Auto-generated IEC/ANSI single-line diagrams from an uploaded register, a live voltage/current overlay colour-coded by band, animated live-status indicators, a GIS asset map, and integrated outage/complaint tracking.",
    },
    "asset-maintenance-eam": {
        "what": "A full, config-driven Enterprise Asset Management workbench — every lookup, fault code and workflow rule is an editable record, not a hardcoded value.",
        "where": "Maintenance planning teams, asset engineers, and procurement / compliance functions.",
        "outcome": "Shifts maintenance from reactive/calendar-based to predictive/risk-based — fewer unplanned outages, longer asset life, and one system of record end to end.",
        "how": "A 10-module workbench, 360° asset drill-down, background-computed time-to-failure prediction, a four-stream fused asset-risk score, and depreciation / procurement / document / compliance workflows.",
    },
    "revenue-assurance": {
        "what": "Targets the metric every DISCOM is judged on — Aggregate Technical & Commercial (AT&C) loss — with automated, always-on detection instead of periodic manual audits.",
        "where": "Commercial and revenue-protection teams, and field inspection units acting on flagged consumers.",
        "outcome": "Directly reduces AT&C loss under national loss-reduction schemes; surfaces leakage in near real time; gives audit teams a ranked, evidence-backed worklist.",
        "how": "A consumer 360° profile, automated billing-anomaly detection on the live smart-meter feed, an AT&C loss heatmap and collection-efficiency tracking, and a full energy-balance audit log.",
    },
    "discom-ai-insights": {
        "what": "The platform's most data-dense module — built directly on the live Time-of-Day billing data and the utility's own consumer register.",
        "where": "Billing-compliance teams and regulatory audit preparation for Time-of-Day tariff and sanctioned-load enforcement.",
        "outcome": "Unifies two previously siloed feeds into one queryable layer; every score is explainable and auditor-traceable; directly supports tariff and sanctioned-load compliance.",
        "how": "Power-factor risk regression, statistical outlier detection, tamper / sanctioned-load / phase monitoring, consumer clustering, transformer load forecasting, and a live executive-summary brief.",
    },
    "predictive-roi-engine": {
        "what": "Real, trained statistical and machine-learning models — not canned demo charts — covering load forecasting, power quality, and investment-return analysis.",
        "where": "Power-purchase planning desks, capex investment committees, and internal / regulatory audit review of decisions.",
        "outcome": "Better power-purchase planning with fewer penalties and open-market purchases; live what-if capex scenario modelling; full model transparency for scrutiny.",
        "how": "Load forecasts retrained on demand, a transparent model registry, an 18-endpoint Intelligence Suite, a composite Power Quality Index, and a 15-calculator ROI engine.",
    },
    "field-force-mobile": {
        "what": "A native mobile application purpose-built for foreman and lineman roles, sharing one real-time backend with the control-room portal.",
        "where": "Field crews on active jobs, and dispatch supervisors coordinating work-order assignment.",
        "outcome": "Digitises field attendance and dispatch, replacing paper and phone relay; shortens the fault-to-repair cycle; builds a photo-evidence audit trail for AMC / warranty claims.",
        "how": "Role-based home screens for foreman vs lineman, digital check-in and photo capture, a job pool / crew board / escalation queue, and real-time work-order sync with push notifications.",
    },
    "data-ingestion-hub": {
        "what": "A dedicated integration layer so onboarding a new metering vendor or data source doesn't require building a new bespoke dashboard.",
        "where": "IT / data-engineering teams onboarding new metering vendors, and technical due diligence for new DISCOM tenants.",
        "outcome": "One integration layer serves every vendor a DISCOM contracts with; data-quality problems surface immediately instead of silently corrupting reports.",
        "how": "Per-source ingestion pipelines with schedules and quality rules, a canonical-schema normalisation layer, three-phase HT-meter intelligence, and India Energy Stack (IES) standards alignment.",
    },
    "platform-security-governance": {
        "what": "The security and tenancy layer that lets one platform serve multiple DISCOMs safely, with access control enforced at the API — not just the UI.",
        "where": "Platform administration, security / compliance review, and every tenant login surface.",
        "outcome": "One platform serves multiple DISCOMs with verified tenant isolation at lower cost than separate installs; raises the bar against credential attacks; supports full audit.",
        "how": "A full multi-tenant architecture with isolated data, route-level role-based access control, multi-factor authentication and passkeys, bot-defense on the login surface, and a complete audit log.",
    },
    "licensing-compliance": {
        "what": "An independent License Management Service, decoupled from the operational portal, so licensing logic never becomes a point of operational failure.",
        "where": "Commercial / sales teams packaging deployments per DISCOM or per module, and compliance audits of licence usage.",
        "outcome": "Enables per-DISCOM or per-module commercial packaging without bespoke billing logic; a licensing outage never becomes an operational outage.",
        "how": "Cryptographically signed, offline-verifiable licence tokens with a fail-open design, a break-glass emergency-access procedure, a hash-chained tamper-evident audit log, and usage metering.",
    },
    "conversational-ai": {
        "what": "A portal-wide assistant and an extensible automated-agent framework, so getting an answer doesn't always require an analyst or an IT ticket.",
        "where": "Junior engineers, field supervisors, and any non-technical staff who need a quick answer grounded in real data.",
        "outcome": "Lowers the barrier to self-serve insight and reduces analyst / IT dependency; the agent framework extends to new automated workflows over time.",
        "how": "An assistant grounded in the DISCOM's own live data, plus an agent framework exposing list, run, history and knowledge-agent endpoints.",
    },
}

# ── Video slots ──────────────────────────────────────────────────────────────
# HOW TO ADD A VIDEO (no code change needed):
#   Option A — local file: drop your file at  frontend/public/media/<name>.mp4
#              and set src below to  /media/<name>.mp4  (kind="file")
#   Option B — hosted mp4:  set src to the full https URL          (kind="mp4")
#   Option C — YouTube:     set kind="youtube" and src to the video ID (e.g. dQw4w9WgXcQ)
#   Option D — Vimeo:       set kind="vimeo"   and src to the video ID (e.g. 76979871)
# Then re-run:  python -m app.seed
# Leave src empty to show an elegant "video coming soon" placeholder.
MEDIA = [
    # ── Realistic imagery (local, self-contained — files in public/media/img). ──
    {"key": "hero_image", "kind": "image", "title": "", "subtitle": "",
     "src": "/media/img/hero.jpg", "poster": ""},
    {"key": "cta_image", "kind": "image", "title": "", "subtitle": "",
     "src": "/media/img/cta.jpg", "poster": ""},
    {"key": "gallery_1", "kind": "image", "title": "Control-room operations", "subtitle": "Command center",
     "src": "/media/img/g1-control.jpg", "poster": ""},
    {"key": "gallery_2", "kind": "image", "title": "Transmission & distribution", "subtitle": "Network",
     "src": "/media/img/g2-transmission.jpg", "poster": ""},
    {"key": "gallery_3", "kind": "image", "title": "Substation assets", "subtitle": "EAM / CMMS",
     "src": "/media/img/g3-substation.jpg", "poster": ""},
    {"key": "gallery_4", "kind": "image", "title": "Field crews digitised", "subtitle": "Field force",
     "src": "/media/img/g4-field.jpg", "poster": ""},
    {"key": "gallery_5", "kind": "image", "title": "Smart metering & billing", "subtitle": "Revenue",
     "src": "/media/img/g5-metering.jpg", "poster": ""},
    {"key": "gallery_6", "kind": "image", "title": "Renewables & net metering", "subtitle": "Solar / DER",
     "src": "/media/img/g6-solar.jpg", "poster": ""},
]

COMPARISON = [
    ("Single live data layer per tenant", "Siloed exports", "Unified & live"),
    ("AT&C loss detection", "Periodic physical audit", "Always-on, ranked worklist"),
    ("Single-line diagrams", "Weeks of manual CAD", "Auto-generated + live telemetry"),
    ("Executive reporting", "Days of spreadsheet collation", "Real-time, one pane of glass"),
    ("ROI / capex analysis", "Static spreadsheet", "15 live what-if calculators"),
    ("Multi-DISCOM tenancy", "Separate installs", "Shared backend, 403-isolated"),
    ("Field operations", "Paper + phone dispatch", "Native app, real-time sync"),
]
