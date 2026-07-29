import { useState } from "react";
import { Icon } from "./Icon";

/* ───────────── How rollout works ───────────── */
const STEPS = [
  { n: "01", icon: "hub", title: "Connect the data", text: "Point URJ at the utility's existing sources — substation registers, the smart-metering feed and the billing system. The ingestion hub normalises every source to one canonical schema." },
  { n: "02", icon: "grid", title: "Configure the tenant", text: "Provision an isolated tenant database, gated menus and roles. Fault codes, PM schedules and lookups are editable in-app — no development cycle to tailor the platform." },
  { n: "03", icon: "bolt", title: "Go live", text: "Dashboards, live single-line diagrams, loss detection and the field app come online on shared, already-proven infrastructure. Rollout is onboarding, not a from-scratch build." },
];

export function HowItWorks() {
  return (
    <section className="section" style={{ background: "var(--white)", borderTop: "1px solid var(--line)" }}>
      <div className="wrap">
        <div className="sec-head center reveal">
          <span className="eyebrow center">Rollout in three steps</span>
          <h2>Live in weeks, because it's onboarding — not a rebuild</h2>
          <p className="lead" style={{ marginLeft: "auto", marginRight: "auto" }}>
            Every capability already runs in production for live tenants. Bringing on a new DISCOM is a
            data-connection and configuration exercise on top of the shared platform.
          </p>
        </div>
        <div className="steps">
          {STEPS.map((s, i) => (
            <div className={`step reveal d${i + 1}`} key={s.n}>
              <div className="step-top"><span className="step-n">{s.n}</span><div className="step-ic"><Icon name={s.icon} /></div></div>
              <h3>{s.title}</h3>
              <p>{s.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ───────────── Bespoke intelligence ───────────── */
export function Bespoke({ image }: { image?: string }) {
  return (
    <section className="section">
      <div className="wrap">
        <div className="bespoke">
          <div className="reveal">
            <span className="eyebrow">Beyond the shared modules</span>
            <h2 style={{ marginTop: 18 }}>Tenant-specific bespoke intelligence</h2>
            <p className="lead" style={{ marginTop: 20 }}>
              Each DISCOM can carry its own bespoke dashboards, built on that tenant's canonical data schema.
              Today APDCL runs a live operational dashboard, while PVVNL runs a multi-tab analytics, derived-metrics
              and innovations suite — each shaped around its own feeds.
            </p>
            <ul className="ticks" style={{ marginTop: 24 }}>
              <li><Icon name="check" /><span>Shared modules cover the common ground across every utility</span></li>
              <li><Icon name="check" /><span>A tenant layer covers what's unique to that utility's systems and data</span></li>
              <li><Icon name="check" /><span>The same template onboards any future DISCOM tenant</span></li>
            </ul>
          </div>
          <div className="bespoke-visual reveal d1">
            {image && <img src={image} alt="Tenant operations" onError={(e) => (e.currentTarget.style.display = "none")} />}
            <div className="bespoke-tenants">
              <div className="bt-card"><b>APDCL</b><span>Live operational dashboard</span></div>
              <div className="bt-card"><b>PVVNL</b><span>Multi-tab analytics &amp; innovations suite</span></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ───────────── Forward roadmap ───────────── */
const ROADMAP = [
  { t: "Mobile admin dashboards", d: "Extending the native field app with dedicated network-operations and finance/settings dashboards for admin-role users." },
  { t: "More DISCOM tenants", d: "Onboarding additional utilities using the multi-tenant architecture already proven in production." },
  { t: "Deeper IES alignment", d: "Deeper India Energy Stack standards alignment as the national metering-data interoperability mandate matures." },
  { t: "Expanding AI Insights", d: "Growing the DISCOM AI Insights module as further live billing-API and metering data sources are connected." },
];

export function Roadmap() {
  return (
    <section className="section" style={{ background: "var(--white)", borderTop: "1px solid var(--line)" }}>
      <div className="wrap">
        <div className="sec-head reveal">
          <span className="eyebrow">Forward roadmap</span>
          <h2>Under active development</h2>
          <p className="lead">The platform keeps evolving. Planned near-term work builds on the same shared, multi-tenant foundation.</p>
        </div>
        <div className="timeline">
          {ROADMAP.map((r, i) => (
            <div className={`tl-item reveal d${(i % 4) + 1}`} key={r.t}>
              <span className="tl-dot" />
              <h4>{r.t}</h4>
              <p>{r.d}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ───────────── FAQ ───────────── */
const FAQ = [
  { q: "Is URJ a concept or is it actually running?", a: "It's deployed and operational today, serving two live DISCOM tenants (APDCL and PVVNL) on one shared backend with real tenant isolation, backed by live smart-meter/DT/feeder telemetry and real billing data." },
  { q: "How is one platform safe for multiple DISCOMs?", a: "Each tenant gets an isolated database and its own login. Access control is enforced at the API layer, not just the UI — a user without a tenant's scope is refused with an HTTP 403 on every route, verified against the running system." },
  { q: "Do the ROI figures reflect audited results?", a: "Figures marked \"modelled\" are indicative targets derived from the operational benefits each module delivers (e.g. AT&C loss reduction, field productivity). Proof points cite what's been verified end-to-end, such as 69 substations auto-parsed across two real circles." },
  { q: "What does onboarding a new DISCOM involve?", a: "It's a data-connection and configuration exercise on top of shared, already-proven infrastructure — connecting metering/billing sources and configuring the tenant — not a from-scratch development effort." },
  { q: "Can engineers change the system without developers?", a: "Yes. Lookups, fault codes, PM frequencies and workflow rules are database-backed records editable from the UI, so DISCOM engineers configure the platform without a development cycle." },
];

export function Faq() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section className="section">
      <div className="wrap faq-wrap">
        <div className="sec-head reveal" style={{ marginBottom: 0 }}>
          <span className="eyebrow">Questions</span>
          <h2>What stakeholders ask first</h2>
          <p className="lead" style={{ marginTop: 20 }}>Straight answers on deployment status, security, ROI framing and rollout.</p>
        </div>
        <div className="faq reveal d1">
          {FAQ.map((f, i) => (
            <div className={`faq-item ${open === i ? "open" : ""}`} key={i}>
              <button className="faq-q" onClick={() => setOpen(open === i ? null : i)}>
                <span>{f.q}</span>
                <span className="faq-ic"><Icon name={open === i ? "x" : "arrow"} /></span>
              </button>
              <div className="faq-a"><p>{f.a}</p></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
