import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../api/client";
import type { MediaAsset, Overview } from "../types";
import { useNavScroll, useReveal, useTracks } from "../hooks";
import { Nav } from "../components/Nav";
import { Footer } from "../components/Footer";
import { HeroMockup } from "../components/HeroMockup";
import { Modules } from "../components/Modules";
import { Architecture, Comparison, Kpis, RoiDashboard } from "../components/Sections";
import { Icon } from "../components/Icon";
import { Loader } from "../components/Loader";
import { LiveOps } from "../components/LiveOps";
import { VizShowcase } from "../components/Viz";
import { Slider } from "../components/Slider";
import { Strengths } from "../components/Strengths";
import { SldFeature } from "../components/SldFeature";
import { HowItWorks, Bespoke, Roadmap, Faq } from "../components/Detail";

const PROBLEMS = [
  "GIS, SCADA viewers and Excel registers that don't talk to each other",
  "Weekly numbers collated by hand from separate systems before every review",
  "AT&C loss found at the next physical audit, not in near real time",
  "Weeks of manual CAD drafting for every single-line diagram",
  "Paper registers and phone-call dispatch for the field force",
];
const SOLUTIONS = [
  "Topology, live telemetry and outage handling in one system, per tenant",
  "A live executive scorecard — management reporting drops from days to real time",
  "Always-on loss & anomaly detection across the live smart-meter feed",
  "Single-line diagrams auto-generated from the Excel register — no CAD",
  "Native Android field app with real-time work-order sync and push",
];
const TRUST = ["GIS", "SCADA", "Billing systems", "Metering feeds", "ROI spreadsheets", "Field dispatch"];

export function Landing() {
  const [data, setData] = useState<Overview | null>(null);
  const [err, setErr] = useState<string | null>(null);

  useNavScroll();
  useReveal([data]);
  useTracks([data]);

  useEffect(() => {
    api.overview().then(setData).catch((e) => setErr(String(e)));
  }, []);

  const media = useMemo(() => {
    const map: Record<string, MediaAsset> = {};
    (data?.media ?? []).forEach((m) => (map[m.key] = m));
    return map;
  }, [data]);
  if (err) return <Loader error={err} />;
  if (!data) return <Loader />;

  const heroImg = media.hero_image?.src;

  return (
    <>
      <Nav />

      {/* TOP IMAGE SLIDER — 10 realistic power-sector images */}
      <Slider hero />

      {/* HERO */}
      <header className="hero" id="top">
        <div className="hero-bg">
          {heroImg && <img src={heroImg} alt="" onError={(e) => (e.currentTarget.style.display = "none")} />}
        </div>
        <div className="hero-grid" />
        <div className="hero-glow a" /><div className="hero-glow b" />
        <div className="wrap">
          <div className="hero-layout">
            <div>
              <span className="pill pill-live"><span className="dot" /> LIVE &amp; OPERATIONAL — APDCL &amp; PVVNL TENANTS</span>
              <h1>One platform for the <span className="accent">entire DISCOM</span> operation.</h1>
              <p className="hero-sub">
                URJ replaces the patchwork of GIS tools, SCADA viewers, Excel billing registers and
                standalone ROI spreadsheets with a single, multi-tenant Operations Intelligence Portal —
                one login, one live data layer, eleven business-grade modules.
              </p>
              <div className="hero-actions">
                <Link className="btn btn-primary" to="/portal">Explore the modules <Icon name="arrow" /></Link>
                <a className="btn btn-ghost" href="#roi">See the ROI</a>
              </div>
              <div className="hero-badges">
                <span className="hero-badge"><Icon name="shield" /> Real tenant isolation</span>
                <span className="hero-badge"><Icon name="bolt" /> Live meter &amp; feeder telemetry</span>
                <span className="hero-badge"><Icon name="check" /> Deployed, not a mock-up</span>
              </div>
            </div>
            <HeroMockup />
          </div>

          <div className="hero-stats">
            {data.stats.map((s, i) => (
              <div className="stat" key={i}>
                <div className="num">{s.num}{s.unit && <span className="u">{s.unit}</span>}</div>
                <div className="lbl">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </header>

      {/* TRUST */}
      <section className="trust">
        <div className="wrap trust-inner">
          <span>Unifying what DISCOMs run today&nbsp;—</span>
          {TRUST.map((t) => <b key={t}>{t}</b>)}
          <span>— into one live data layer</span>
        </div>
      </section>

      {/* LIVE OPERATIONS — real-time data feed */}
      <LiveOps />

      {/* VISUALIZATION SHOWCASE — animated charts */}
      <VizShowcase />

      {/* PROBLEM → SOLUTION */}
      <section className="section" id="platform">
        <div className="wrap">
          <div className="sec-head center reveal">
            <span className="eyebrow center">The shift</span>
            <h2>From a disconnected tool estate to one intelligence layer</h2>
            <p className="lead" style={{ marginLeft: "auto", marginRight: "auto" }}>
              Most DISCOMs run a patchwork of point tools that don't share data. URJ is one backend,
              one login and one real data layer per tenant — deployed and operational today, not a concept.
            </p>
          </div>
          <div className="split">
            <div className="panel before reveal">
              <span className="tag">Today · the patchwork</span>
              <h3 style={{ marginTop: 14 }}>Separate systems, manual glue</h3>
              <ul>{PROBLEMS.map((p) => <li key={p}><Icon name="x" /><span>{p}</span></li>)}</ul>
            </div>
            <div className="panel after reveal d1">
              <div className="hero-grid" />
              <span className="tag">With URJ · one platform</span>
              <h3 style={{ marginTop: 14 }}>One backend, one live truth</h3>
              <ul>{SOLUTIONS.map((s) => <li key={s}><Icon name="check" /><span>{s}</span></li>)}</ul>
            </div>
          </div>
        </div>
      </section>

      {/* BUSINESS VALUE */}
      <section className="section" id="value" style={{ background: "var(--white)", borderTop: "1px solid var(--line)", borderBottom: "1px solid var(--line)" }}>
        <div className="wrap">
          <div className="sec-head reveal">
            <span className="eyebrow">Business value</span>
            <h2>Built around the four numbers a DISCOM is judged on</h2>
            <p className="lead">
              Every module maps to a board-level outcome — loss reduction, reliability, capex efficiency
              and field productivity. These are the levers regulators and leadership actually track.
            </p>
          </div>
          <Kpis kpis={data.kpis} />
        </div>
      </section>

      {/* INDIAN DISCOM STRENGTHS — animated context counters */}
      <Strengths />

      {/* ARCHITECTURE */}
      <section className="section">
        <div className="wrap"><Architecture layers={data.architecture} /></div>
      </section>

      {/* SLD FEATURE SPOTLIGHT — auto-generated single-line diagram */}
      <SldFeature />

      {/* MODULES */}
      <section className="section" id="modules" style={{ background: "var(--white)", borderTop: "1px solid var(--line)" }}>
        <div className="wrap">
          <div className="mod-toolbar">
            <div className="sec-head reveal" style={{ marginBottom: 0 }}>
              <span className="eyebrow">Eleven modules</span>
              <h2>Every capability, mapped to a business driver</h2>
            </div>
            <Link className="btn btn-line reveal d1" to="/portal">Open the full portal <Icon name="arrow" /></Link>
          </div>
          <Modules modules={data.modules} categories={data.categories} />
        </div>
      </section>

      {/* HOW ROLLOUT WORKS */}
      <HowItWorks />

      {/* TENANT-SPECIFIC BESPOKE + secondary video */}
      <Bespoke image={media.gallery_1?.src} />

      {/* ROI */}
      <RoiDashboard levers={data.roi_levers} flows={data.roi_flows} />

      {/* COMPARISON */}
      <section className="section" style={{ background: "var(--white)" }}>
        <div className="wrap">
          <div className="sec-head center reveal">
            <span className="eyebrow center">Why one platform</span>
            <h2>URJ vs the disconnected tool estate</h2>
          </div>
          <Comparison rows={data.comparison} />
        </div>
      </section>

      {/* ROADMAP */}
      <Roadmap />

      {/* FAQ */}
      <Faq />

      {/* CTA */}
      <section className="section">
        <div className="wrap">
          <div className="cta reveal">
            {media.cta_image?.src && (
              <div className="hero-bg"><img src={media.cta_image.src} alt="" onError={(e) => (e.currentTarget.style.display = "none")} /></div>
            )}
            <div className="hero-grid" /><div className="hero-glow a" />
            <div className="cta-in">
              <span className="pill pill-live" style={{ background: "rgba(255,255,255,.08)", borderColor: "rgba(255,255,255,.18)", color: "var(--emerald-300)" }}>
                <span className="dot" /> Rollout = tenant onboarding, not from-scratch build
              </span>
              <h2 style={{ marginTop: 22 }}>Every capability here is live today.</h2>
              <p>
                Onboarding a new DISCOM is a data-connection and configuration exercise on top of shared,
                already-proven infrastructure. Step inside the portal to see each module and its business return in detail.
              </p>
              <div className="hero-actions">
                <Link className="btn btn-primary" to="/portal">Enter the Portal <Icon name="arrow" /></Link>
                <a className="btn btn-ghost" href="#modules">Browse modules</a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
