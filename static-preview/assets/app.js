/* ============================================================
   URJ Portal — module dataset, ROI model & interactions
   ============================================================ */

/* ---------- inline icon set (stroke-based) ---------- */
const I = {
  command:'<path d="M9 3H5a2 2 0 0 0-2 2v4m6-6h6m-6 0v18m0-18H9m12 6V5a2 2 0 0 0-2-2h-4m6 6v6m0-6h0M3 9v6m0-6h0m0 6v4a2 2 0 0 0 2 2h4m-6-6h18m-6 6h4a2 2 0 0 0 2-2v-4m-6 6H9"/>',
  grid:'<rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/>',
  network:'<circle cx="12" cy="5" r="2.4"/><circle cx="5" cy="19" r="2.4"/><circle cx="19" cy="19" r="2.4"/><path d="M12 7.4v4m0 0-5 5m5-5 5 5"/>',
  wrench:'<path d="M14.7 6.3a4 4 0 0 0-5.4 5.2L3 17.8 6.2 21l6.3-6.3a4 4 0 0 0 5.2-5.4l-2.5 2.5-2.3-.6-.6-2.3 2.4-2.6Z"/>',
  shield:'<path d="M12 3 5 6v5c0 4.3 3 8.3 7 9.5 4-1.2 7-5.2 7-9.5V6l-7-3Z"/><path d="m9 12 2 2 4-4"/>',
  chart:'<path d="M4 20V10m5 10V4m5 16v-6m5 6V8"/>',
  brain:'<path d="M9 3a3 3 0 0 0-3 3 3 3 0 0 0-2 5 3 3 0 0 0 2 5 3 3 0 0 0 5 1V4a3 3 0 0 0-2-1Z"/><path d="M15 3a3 3 0 0 1 3 3 3 3 0 0 1 2 5 3 3 0 0 1-2 5 3 3 0 0 1-5 1"/>',
  phone:'<rect x="6" y="2.5" width="12" height="19" rx="2.5"/><path d="M11 18h2"/>',
  hub:'<circle cx="12" cy="12" r="2.5"/><circle cx="12" cy="4" r="1.6"/><circle cx="12" cy="20" r="1.6"/><circle cx="4" cy="8" r="1.6"/><circle cx="20" cy="8" r="1.6"/><circle cx="4" cy="16" r="1.6"/><circle cx="20" cy="16" r="1.6"/><path d="m12 5.6.01 4M12 18.4v-4M6 9l3.8 2M18 9l-3.8 2M6 15l3.8-2M18 15l-3.8-2"/>',
  key:'<circle cx="7.5" cy="15.5" r="4"/><path d="m10.5 12.5 8-8m-2 2 2 2m-4 0 2 2"/>',
  chat:'<path d="M4 5.5A2.5 2.5 0 0 1 6.5 3h11A2.5 2.5 0 0 1 20 5.5v7A2.5 2.5 0 0 1 17.5 15H9l-4 4v-4H6.5"/>',
  bolt:'<path d="M13 2 4 14h7l-1 8 9-12h-7l1-8Z"/>',
  gauge:'<path d="M12 14a2 2 0 1 0 0-4 2 2 0 0 0 0 4Zm0 0 4-4M4.5 18a9 9 0 1 1 15 0"/>',
  coins:'<ellipse cx="9" cy="7" rx="5.5" ry="2.6"/><path d="M3.5 7v5c0 1.4 2.5 2.6 5.5 2.6M14.5 12a5.5 2.6 0 1 0 5.5 2.6 5.5 2.6 0 0 0-5.5-2.6Zm5.5 2.6v5c0 1.4-2.5 2.6-5.5 2.6s-5.5-1.2-5.5-2.6"/>',
  trend:'<path d="M3 17 9 11l4 4 8-8m0 0h-5m5 0v5"/>',
  clock:'<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 3"/>',
  users:'<circle cx="9" cy="8" r="3.2"/><path d="M3.5 20a5.5 5.5 0 0 1 11 0M16 5.5a3.2 3.2 0 0 1 0 6M20.5 20a5.5 5.5 0 0 0-4-5.3"/>',
  check:'<path d="M20 6 9 17l-5-5"/>',
  x:'<path d="M18 6 6 18M6 6l12 12"/>',
  arrow:'<path d="M5 12h14m-6-6 6 6-6 6"/>',
  leaf:'<path d="M11 20A7 7 0 0 1 4 13c0-6 5-9 15-9 0 8-4 12-8 13Z"/><path d="M4 20c2-5 5-7 8-8"/>',
  layers:'<path d="m12 3 9 5-9 5-9-5 9-5Z"/><path d="m3 13 9 5 9-5M3 17l9 5 9-5"/>',
  lock:'<rect x="4.5" y="10.5" width="15" height="10" rx="2.5"/><path d="M8 10.5V7a4 4 0 0 1 8 0v3.5"/>',
};
const svg = (name,cls='') => `<svg class="${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">${I[name]||''}</svg>`;

/* ---------- MODULE DATASET ---------- */
const MODULES = [
{
  n:'01', icon:'command', cat:'exec',
  title:'Executive Command Center',
  driver:'Leadership visibility · faster decisions',
  short:'A single, always-current pane of glass for leadership — replacing the manual weekly collation of numbers from separate systems.',
  roiHead:'Reporting: days → real-time',
  features:[
    'Tenant-adaptive, fleet-wide KPI scorecard across assets, consumers, revenue & reliability',
    'Live alert feed aggregated across every connected telemetry source (tamper, outage, threshold breach)',
    'Real-time dashboard push — no manual refresh during an incident',
    'Fleet-level consumer-asset drill-down by DT, feeder, meter, net-meter or solar down to individual consumer',
  ],
  benefits:[
    'One pane of glass for leadership — no manual collation before a review',
    'Faster situational awareness during outages; dashboards update live, not on a refresh cycle',
    'Cuts management-reporting turnaround from days of spreadsheet work to real time',
  ],
  roi:[
    {v:'90%+',l:'less time spent collating review numbers'},
    {v:'Real-time',l:'situational awareness in incidents'},
    {v:'1',l:'source of truth across all functions'},
  ],
  proof:'Fleet-consumer mapping is drawn from the same live topology crosswalk the SLD module uses — verified against real DT/feeder telemetry, not a static asset register.',
},
{
  n:'02', icon:'network', cat:'ops',
  title:'Network Operations & Single-Line Diagrams',
  driver:'Faster fault localisation & restoration',
  short:'Converts a utility’s existing substation Excel register into a live, interactive single-line diagram automatically — overlaid with real-time telemetry, not a static drawing.',
  roiHead:'Weeks of CAD drafting → automatic',
  features:[
    'Auto-generated IEC/ANSI single-line diagrams straight from an uploaded substation register',
    'Live telemetry overlay: real voltage/current per meter & DT, colour-coded by voltage band',
    'Animated live-status indicators — see at a glance which parts of the network are reporting now',
    'Feeder / substation / RMU / SCADA views with cascading filters, plus a GIS asset map',
    'Integrated OMS work-order and CRM complaint tracking',
  ],
  benefits:[
    'Eliminates weeks of manual AutoCAD/Visio drafting — diagrams regenerate when the register updates',
    'Staff see real equipment status layered on the diagram — faster fault localisation & restoration',
    'One system spans topology, live telemetry and outage handling instead of separate GIS/SCADA/OMS tools',
  ],
  roi:[
    {v:'0',l:'manual redrawing on register update'},
    {v:'69',l:'substations auto-parsed, 2 circles'},
    {v:'↓ MTTR',l:'faster fault localisation'},
  ],
  proof:'Verified end-to-end on real circle data: 69 substations across two circles (Barpeta and Guwahati Electric Circle-I), auto-parsed from utility-supplied Excel registers with zero manual redrawing.',
},
{
  n:'03', icon:'wrench', cat:'ops',
  title:'Asset & Maintenance Management',
  driver:'Predictive maintenance · asset life extension',
  short:'A full, config-driven Enterprise Asset Management workbench — every lookup, fault code and workflow rule is an editable record, not a hardcoded value needing a developer.',
  roiHead:'Reactive → predictive maintenance',
  features:[
    '10-module EAM/CMMS workbench: fault codes, PM schedules, standard jobs, skills, KPIs — all editable in-app',
    '360° asset drill-down for any asset type or ID',
    'Time-to-failure (TTF) and fault-mode prediction, pre-computed per asset',
    'Risk forecasting that fuses four real input streams per asset into one score',
    'Depreciation, procurement (PR/PO), tool register, document management & compliance reporting',
    'Work-order lifecycle, Permit-to-Work and multi-step approval state machine',
  ],
  benefits:[
    'Shifts maintenance from reactive/calendar-based to predictive/risk-based — fewer unplanned outages, longer asset life',
    'One system of record for the full asset lifecycle — capex, operation, depreciation, disposal',
    'Configurable without developers — engineers add fault codes, PM frequencies or job types themselves',
  ],
  roi:[
    {v:'↓ 15–25%',l:'unplanned outages (modelled)'},
    {v:'10',l:'EAM/CMMS sub-modules in one workbench'},
    {v:'+ Years',l:'extended asset life via risk-based PM'},
  ],
  proof:'Every lookup, fault code and workflow rule is a Mongo-backed record editable from the UI — DISCOM engineers configure the system without a development cycle.',
},
{
  n:'04', icon:'coins', cat:'revenue',
  title:'Revenue Assurance & Loss Reduction',
  driver:'AT&C loss reduction · theft detection',
  short:'Targets the single metric every DISCOM is judged on — Aggregate Technical & Commercial (AT&C) loss — with automated, always-on detection instead of periodic manual audits.',
  roiHead:'The headline national metric, continuously',
  features:[
    'Consumer 360° profile: search, billing history, payment record and meter-reading trend in one view',
    'Billing anomaly detection (IsolationForest) across the live smart-meter feed — nil consumption, sudden drops, tamper flags',
    'AT&C loss heatmap and collection-efficiency tracking',
    'Loss & audit module: energy balance plus a full regulatory audit log',
  ],
  benefits:[
    'Directly targets AT&C loss — the headline metric under national loss-reduction schemes — continuously, not via periodic physical audit',
    'Surfaces revenue leakage (theft, meter bypass, billing error) in near real time instead of at the next audit cycle',
    'Gives commercial/audit teams a ranked, evidence-backed worklist instead of blanket field inspections',
  ],
  roi:[
    {v:'↓ 2–4pp',l:'AT&C loss reduction target (modelled)'},
    {v:'Near real-time',l:'leakage detection vs audit cycle'},
    {v:'Ranked',l:'evidence-backed inspection worklist'},
  ],
  proof:'Anomaly detection runs continuously across the live smart-meter feed — every flag is evidence-backed and traceable to a real reading, giving audit teams a defensible worklist.',
},
{
  n:'05', icon:'brain', cat:'revenue',
  title:'DISCOM AI Insights — Billing & Consumer Intelligence',
  driver:'TOD tariff & sanctioned-load compliance',
  short:'The platform’s newest, most data-dense module — built directly on the real Time-of-Day billing API and the utility’s own consumer register. Every figure traces to a live source, nothing synthetic.',
  roiHead:'Two siloed feeds → one auditable layer',
  features:[
    'Power-factor risk scoring using real trend regression, with dormant-connection false positives filtered out',
    'Reactive-power compensation targeting via statistical outlier detection (Mahalanobis distance)',
    'Tamper-event surfacing, sanctioned-load audit, phase-integrity monitoring, unit-normalised DTR loading',
    'Transparent, explainable composite risk score per consumer — contributing weights are shown, not hidden',
    'Load clustering (KMeans), DTR load forecasting (Prophet), billing anomaly detection (IsolationForest)',
    'A live-polling Executive Summary that recomputes findings and states the DISCOM implication in plain language',
  ],
  benefits:[
    'Unifies two previously siloed feeds — billing API and consumer register — into one queryable intelligence layer',
    'Every score is explainable and auditor-traceable to a real source number — not a black-box vendor model',
    'Directly supports Time-of-Day tariff compliance and sanctioned-load enforcement — active revenue levers',
  ],
  roi:[
    {v:'100%',l:'figures traceable to a live source'},
    {v:'Explainable',l:'risk scores, weights shown'},
    {v:'2 → 1',l:'siloed feeds unified into one layer'},
  ],
  proof:'Coverage is intentionally reported wherever it is partial rather than silently extrapolated — a deliberate design choice to keep every insight defensible under audit.',
},
{
  n:'06', icon:'trend', cat:'analytics',
  title:'Predictive Analytics, Forecasting & ROI Engine',
  driver:'Power-purchase planning · capex prioritisation',
  short:'Real, trained statistical and machine-learning models — not canned demo charts — covering load forecasting, power quality and investment-return analysis.',
  roiHead:'Static business cases → live what-if',
  features:[
    'Trained ARIMA/SARIMAX load forecasts per feeder, retrained on demand on the latest interval data',
    'Transparent model catalogue & registry — every AI/ML model in production, what it consumes and predicts',
    'An 18-endpoint Intelligence Suite plus a real-time visualisation layer',
    'Composite Power Quality Index and Demand-Response endpoints',
    'A 15-calculator ROI engine supporting live what-if assumption overrides — no round-trip to re-run a scenario',
    'A data-quality workbench for irregular-interval telemetry, plus tenant-adaptive Exploratory Data Analysis',
  ],
  benefits:[
    'Load forecasting supports better power-purchase planning — reducing under-drawal penalties and costly last-minute market purchases',
    'The ROI engine lets capex committees run investment scenarios live — DT augmentation, feeder bifurcation, smart-meter rollout — backed by real operational data, not a static spreadsheet',
    'Full model transparency supports regulatory and internal-audit scrutiny of any AI-driven decision',
  ],
  roi:[
    {v:'15',l:'live ROI calculators, what-if overrides'},
    {v:'18',l:'intelligence-suite endpoints'},
    {v:'↓ Penalties',l:'better power-purchase planning'},
  ],
  proof:'Models are real and trained — ARIMA/SARIMAX forecasts retrain on demand on the latest interval data and cache for performance, feeding a 15-calculator ROI engine used by capex committees.',
},
{
  n:'07', icon:'phone', cat:'field',
  title:'Field Force Mobile Application',
  driver:'Field-force digitisation & productivity',
  short:'A native Android application purpose-built for foreman and lineman roles, sharing one real-time backend with the control-room portal.',
  roiHead:'Paper registers → real-time dispatch',
  features:[
    'Native Android app with distinct, role-based home screens for foreman and lineman',
    'Digital check-in / attendance and photo capture in the field',
    'Job pool, crew board and an escalation queue for issues needing supervisor attention',
    'Real-time work-order assignment and status sync with the main portal, with live push notifications',
  ],
  benefits:[
    'Digitises field attendance and job assignment — replaces paper registers and phone-call dispatch',
    'Shortens the fault-to-repair cycle: crews receive and acknowledge work orders in real time',
    'Photo-evidence capture builds an audit trail for completed work and supports warranty/AMC claims',
  ],
  roi:[
    {v:'↑ 20–30%',l:'crew productivity (modelled)'},
    {v:'Real-time',l:'work-order acknowledgement'},
    {v:'0 paper',l:'digital attendance & job assignment'},
  ],
  proof:'Built and operational today for APDCL; the same architecture is designed to be rebranded and reused for additional DISCOM tenants.',
},
{
  n:'08', icon:'hub', cat:'platform',
  title:'Data Ingestion & Multi-Source Integration Hub',
  driver:'Vendor-agnostic data onboarding',
  short:'A dedicated integration layer so onboarding a new metering vendor or data source doesn’t mean building a new bespoke dashboard from scratch.',
  roiHead:'Per-vendor rebuilds → one canonical layer',
  features:[
    'Ingestion Platform with per-source pipelines, schedules, quality rules, a dead-letter queue and observability dashboard',
    'Admin-controlled triggers and live status for upstream vendor integrations (AMISP/HES feeds)',
    'A unified-schema “canonical” layer that normalises every tenant’s disparate source data before any dashboard',
    'Genus HES three-phase HT-meter intelligence',
    'India Energy Stack (IES) MeterData v0.6 standards-compliance module',
    'A generic configuration CRUD framework so new lookup/config collections register without new backend code',
  ],
  benefits:[
    'One integration layer serves every AMISP/HES vendor a DISCOM contracts with — no per-vendor bespoke dashboard',
    'The dead-letter queue and observability dashboard surface data-quality problems immediately',
    'Alignment with the India Energy Stack standard reduces future integration cost as the national mandate matures',
  ],
  roi:[
    {v:'1',l:'integration layer for all vendors'},
    {v:'IES v0.6',l:'national-standard aligned'},
    {v:'↓ Cost',l:'future vendor onboarding'},
  ],
  proof:'A unified canonical schema normalises every tenant’s disparate source data before it reaches any dashboard — new metering vendors onboard as configuration, not a rebuild.',
},
{
  n:'09', icon:'shield', cat:'platform',
  title:'Multi-Tenant Platform Security & Governance',
  driver:'Cyber-risk reduction · multi-DISCOM scale',
  short:'The security and tenancy layer that lets one platform serve multiple DISCOMs safely — with access control enforced at the API, not just hidden in the UI.',
  roiHead:'Shared platform, real tenant isolation',
  features:[
    'Full multi-tenant architecture: each DISCOM gets isolated data access, gated menus and its own login',
    'Role-based access control enforced at the route level, plus a superadmin RBAC management console',
    'TOTP-based multi-factor authentication and WebAuthn/passkey login support',
    'URJ Shield — a client-side bot-defense / proof-of-work gate protecting the public login surface',
    'A full audit log covering login history, security alerts, security events and administrative actions',
  ],
  benefits:[
    'One platform serves multiple DISCOMs with real, verified tenant isolation — cross-tenant access refused with HTTP 403 — at sharply lower per-DISCOM cost than separate installs',
    'Passkey/MFA plus bot-defense meaningfully raises the bar against credential-stuffing and phishing',
    'A full audit trail supports both internal governance and external regulatory or security review',
  ],
  roi:[
    {v:'HTTP 403',l:'verified cross-tenant refusal'},
    {v:'↓ Cost',l:'vs separate per-DISCOM installs'},
    {v:'MFA + Passkey',l:'credential-attack resistance'},
  ],
  proof:'Access control is enforced at the API layer, not just the UI — a user without a tenant’s discom_scope grant is refused with an HTTP 403 on every route, verified directly against the running system.',
},
{
  n:'10', icon:'key', cat:'platform',
  title:'Standalone Licensing & Compliance Service',
  driver:'Commercial packaging · audit-ready licensing',
  short:'An independent License Management Service, decoupled from the operational portal, so licensing logic never becomes a point of operational failure.',
  roiHead:'Fail-open by design — never an outage',
  features:[
    'RS256-signed, offline-verifiable license tokens — the portal keeps working even if the licensing server is briefly unreachable',
    'A break-glass emergency-access procedure for exceptional circumstances',
    'A hash-chained, tamper-evident audit log of every licensing action',
    'Usage metering, with both an admin console and a self-service portal for license management',
  ],
  benefits:[
    'Lets URJ be commercially packaged and licensed per DISCOM or per module without bespoke billing logic',
    'The fail-open design means a licensing-service outage never becomes an operational outage',
    'A tamper-evident audit trail supports commercial dispute resolution and compliance audits',
  ],
  roi:[
    {v:'Fail-open',l:'licensing outage ≠ operational outage'},
    {v:'Per-module',l:'flexible commercial packaging'},
    {v:'Tamper-evident',l:'hash-chained licensing audit'},
  ],
  proof:'License tokens are RS256-signed and offline-verifiable — critical for infrastructure software running a utility’s operations, where a licensing hiccup must never take the grid tools down.',
},
{
  n:'11', icon:'chat', cat:'exec',
  title:'Conversational AI / Knowledge Assistant',
  driver:'Self-service insight for non-technical staff',
  short:'A portal-wide assistant and an extensible automated-agent framework, so getting an answer doesn’t always require an analyst or an IT ticket.',
  roiHead:'Analyst tickets → self-service answers',
  features:[
    'A portal-wide chatbot (Gemini-powered) that answers questions grounded in the DISCOM’s own live data',
    'An agent framework — list, run, history and knowledge-agent “ask” endpoints — extensible to new workflows',
  ],
  benefits:[
    'Lowers the barrier for non-technical staff — junior engineers, field supervisors — to self-serve answers instead of waiting on an analyst or IT ticket',
    'The extensible agent framework means new automated workflows (e.g. auto-drafted compliance reports) can be added without a platform rewrite',
  ],
  roi:[
    {v:'Self-serve',l:'answers without an analyst'},
    {v:'Grounded',l:'in the DISCOM’s own live data'},
    {v:'Extensible',l:'agent framework, no rewrite'},
  ],
  proof:'Answers are grounded in the DISCOM’s own live data — not a generic model — and the agent framework is designed to absorb new automated workflows without a platform rewrite.',
},
];

/* ---------- render module cards ---------- */
function renderModules(target, filter='all'){
  const grid = document.querySelector(target);
  if(!grid) return;
  const list = filter==='all' ? MODULES : MODULES.filter(m=>m.cat===filter);
  grid.innerHTML = list.map((m,i)=>`
    <article class="mod-card reveal ${'d'+((i%3)+1)}" data-cat="${m.cat}" data-mod="${m.n}">
      <div class="mod-top">
        <span class="mod-num">MODULE ${m.n}</span>
        <div class="mod-ic">${svg(m.icon)}</div>
      </div>
      <h3>${m.title}</h3>
      <div class="mod-driver">${m.driver}</div>
      <p>${m.short}</p>
      <div class="mod-foot">
        <span class="mod-roi"><b>${m.roiHead}</b></span>
        <span class="mod-more">Explore ${svg('arrow')}</span>
      </div>
    </article>`).join('');
  bindReveal();
  grid.querySelectorAll('.mod-card').forEach(c=>c.addEventListener('click',()=>openModal(c.dataset.mod)));
}

/* ---------- module detail modal ---------- */
function openModal(num){
  const m = MODULES.find(x=>x.n===num); if(!m) return;
  let scrim = document.querySelector('.modal-scrim');
  scrim.querySelector('.modal').innerHTML = `
    <button class="modal-close" aria-label="Close">${svg('x')}</button>
    <div class="modal-hero">
      <div class="hero-grid"></div>
      <div class="modal-hero-in">
        <div class="modal-num">MODULE ${m.n}</div>
        <h2>${m.title}</h2>
        <span class="driver">${svg('bolt')} ${m.driver}</span>
      </div>
    </div>
    <div class="modal-body">
      <p class="desc">${m.short}</p>
      <div class="roi-box">
        <h4>${svg('trend')} Business return</h4>
        <div class="roi-metrics">
          ${m.roi.map(r=>`<div class="roi-metric"><div class="rn">${r.v}</div><div class="rl">${r.l}</div></div>`).join('')}
        </div>
      </div>
      <div class="mb-grid" style="margin-top:34px">
        <div class="mb-col">
          <h4>Key capabilities</h4>
          <ul>${m.features.map(f=>`<li>${svg('check')}<span>${f}</span></li>`).join('')}</ul>
        </div>
        <div class="mb-col">
          <h4>Benefit to the DISCOM</h4>
          <ul>${m.benefits.map(b=>`<li>${svg('check')}<span>${b}</span></li>`).join('')}</ul>
        </div>
      </div>
      <div class="proof"><b>Proof point · </b>${m.proof}</div>
    </div>`;
  scrim.classList.add('open');
  document.body.style.overflow='hidden';
  scrim.querySelector('.modal-close').onclick = closeModal;
}
function closeModal(){
  const scrim=document.querySelector('.modal-scrim');
  scrim.classList.remove('open');
  document.body.style.overflow='';
}

/* ---------- reveal on scroll ---------- */
let revealObs;
function bindReveal(){
  if(!revealObs){
    revealObs=new IntersectionObserver((es)=>{
      es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');revealObs.unobserve(e.target)}});
    },{threshold:.12,rootMargin:'0px 0px -8% 0px'});
  }
  document.querySelectorAll('.reveal:not(.in)').forEach(el=>revealObs.observe(el));
}

/* ---------- animated counters + tracks ---------- */
function animateTracks(){
  const obs=new IntersectionObserver((es)=>{
    es.forEach(e=>{
      if(e.isIntersecting){
        e.target.querySelectorAll('.track i').forEach(i=>{i.style.width=i.dataset.w||'0%'});
        obs.unobserve(e.target);
      }
    });
  },{threshold:.4});
  document.querySelectorAll('[data-tracks]').forEach(el=>obs.observe(el));
}

/* ---------- nav scroll state ---------- */
function initNav(){
  const nav=document.querySelector('.nav');
  if(!nav) return;
  const onScroll=()=>nav.classList.toggle('scrolled',window.scrollY>40);
  onScroll(); window.addEventListener('scroll',onScroll,{passive:true});
}

/* ---------- boot ---------- */
document.addEventListener('DOMContentLoaded',()=>{
  initNav();
  // build modal shell once
  if(!document.querySelector('.modal-scrim')){
    const s=document.createElement('div');
    s.className='modal-scrim';
    s.innerHTML='<div class="modal" role="dialog" aria-modal="true"></div>';
    document.body.appendChild(s);
    s.addEventListener('click',e=>{if(e.target===s) closeModal();});
    document.addEventListener('keydown',e=>{if(e.key==='Escape') closeModal();});
  }
  // filters
  document.querySelectorAll('.filter').forEach(f=>{
    f.addEventListener('click',()=>{
      document.querySelectorAll('.filter').forEach(x=>x.classList.remove('active'));
      f.classList.add('active');
      renderModules('#modGrid',f.dataset.filter);
    });
  });
  if(document.querySelector('#modGrid')) renderModules('#modGrid','all');
  bindReveal();
  animateTracks();
});
