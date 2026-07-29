import { useEffect, useState } from "react";
import { api } from "../api/client";
import type { Overview } from "../types";
import { useNavScroll, useReveal, useTracks } from "../hooks";
import { Nav } from "../components/Nav";
import { Footer } from "../components/Footer";
import { Modules } from "../components/Modules";
import { LiveOps } from "../components/LiveOps";
import { VizShowcase } from "../components/Viz";
import { Architecture, Comparison, RoiDashboard } from "../components/Sections";
import { Loader } from "../components/Loader";

export function Portal() {
  const [data, setData] = useState<Overview | null>(null);
  const [err, setErr] = useState<string | null>(null);

  useNavScroll();
  useReveal([data]);
  useTracks([data]);

  useEffect(() => {
    api.overview().then(setData).catch((e) => setErr(String(e)));
    window.scrollTo(0, 0);
  }, []);

  if (err) return <Loader error={err} />;
  if (!data) return <Loader />;

  return (
    <>
      <Nav />

      {/* PORTAL HEADER */}
      <header className="hero" id="top" style={{ minHeight: "auto" }}>
        <div className="hero-grid" />
        <div className="hero-glow a" /><div className="hero-glow b" />
        <div className="wrap">
          <div style={{ padding: "150px 0 70px", maxWidth: 860, position: "relative", zIndex: 3 }}>
            <span className="pill pill-live"><span className="dot" /> INSIDE THE PORTAL — BUSINESS VIEW</span>
            <h1 style={{ fontSize: "clamp(2.4rem,5vw,3.8rem)", marginTop: 22 }}>
              Eleven modules. One operation. <span className="accent">Every return, in detail.</span>
            </h1>
            <p className="hero-sub">
              Browse each module by business area, open any card for its full capability list, benefit
              statement, ROI figures and field-verified proof point — all served live from the platform database.
            </p>
            <div className="hero-stats" style={{ marginTop: 44 }}>
              {data.stats.map((s, i) => (
                <div className="stat" key={i}>
                  <div className="num">{s.num}{s.unit && <span className="u">{s.unit}</span>}</div>
                  <div className="lbl">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </header>

      {/* LIVE OPERATIONS */}
      <LiveOps />

      {/* VISUALIZATION SHOWCASE */}
      <VizShowcase />

      {/* MODULES */}
      <section className="section" id="modules" style={{ background: "var(--white)", paddingTop: 80 }}>
        <div className="wrap">
          <div className="sec-head reveal">
            <span className="eyebrow">Module directory</span>
            <h2>Filter by business area, open any module</h2>
            <p className="lead">Each module is presented from a DISCOM business perspective — what it does, why it matters, and the quantified return.</p>
          </div>
          <Modules modules={data.modules} categories={data.categories} />
        </div>
      </section>

      {/* ARCHITECTURE */}
      <section className="section">
        <div className="wrap"><Architecture layers={data.architecture} /></div>
      </section>

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

      <Footer />
    </>
  );
}
