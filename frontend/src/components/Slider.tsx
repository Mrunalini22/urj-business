import { useCallback, useEffect, useRef, useState } from "react";
import { Icon } from "./Icon";

type Slide = { img: string; eyebrow: string; title: string; desc: string; stat: string };

const SLIDES: Slide[] = [
  { img: "/media/img/hero.jpg", eyebrow: "Transmission & distribution", title: "The grid, at scale",
    desc: "From 132 kV supply down to the last distribution transformer — one live topology, colour-coded by real voltage and current.", stat: "69 substations auto-mapped" },
  { img: "/media/img/g1-control.jpg", eyebrow: "Command center", title: "One control room, one truth",
    desc: "Live KPIs, alerts and telemetry aggregated across every connected source — no more collating numbers by hand before a review.", stat: "Real-time, not days" },
  { img: "/media/img/g3-substation.jpg", eyebrow: "Asset & maintenance", title: "Every asset, on the record",
    desc: "Condition, risk and time-to-failure for each asset — shifting maintenance from calendar-based to predictive and risk-based.", stat: "↓ 15–25% unplanned outages" },
  { img: "/media/img/g5-metering.jpg", eyebrow: "Revenue assurance", title: "From metering to money",
    desc: "Always-on anomaly detection across the live smart-meter feed surfaces theft, bypass and leakage in near real time.", stat: "↓ 2–4pp AT&C loss" },
  { img: "/media/img/g4-field.jpg", eyebrow: "Field force", title: "Crews, fully digitised",
    desc: "Real-time work-order dispatch, digital attendance and photo evidence — paper registers and phone relay, gone.", stat: "↑ 20–30% productivity" },
  { img: "/media/img/mod-ingest.jpg", eyebrow: "Data & integration", title: "One canonical data layer",
    desc: "Every metering vendor and data source normalised to a single schema before it reaches any dashboard.", stat: "Vendor-agnostic onboarding" },
  { img: "/media/img/g6-solar.jpg", eyebrow: "Renewables & DER", title: "Ready for the energy transition",
    desc: "Net-metering and distributed solar tracked alongside the rest of the network on one shared platform.", stat: "Solar / DER aware" },
];

const INTERVAL = 6000;

export function Slider() {
  const [i, setI] = useState(0);
  const [prev, setPrev] = useState(0);
  const [paused, setPaused] = useState(false);
  const n = SLIDES.length;
  const timer = useRef<number>(0);

  const goTo = useCallback((next: number) => {
    setI((cur) => { setPrev(cur); return (next + n) % n; });
  }, [n]);
  const step = useCallback((d: number) => goTo(i + d), [goTo, i]);

  useEffect(() => {
    if (paused) return;
    timer.current = window.setInterval(() => setI((cur) => { setPrev(cur); return (cur + 1) % n; }), INTERVAL);
    return () => window.clearInterval(timer.current);
  }, [paused, n]);

  const s = SLIDES[i];
  const dir = (i - prev + n) % n === n - 1 ? -1 : 1; // reveal direction

  return (
    <section className="section slider-sec" id="showcase">
      <div className="wrap">
        <div className="sec-head center reveal">
          <span className="eyebrow center">The platform in the real world</span>
          <h2>One system across the whole distribution network</h2>
          <p className="lead" style={{ marginLeft: "auto", marginRight: "auto" }}>
            From the control room to the last-mile crew — a visual tour of where URJ operates, on real power-sector infrastructure.
          </p>
        </div>

        <div className="slider reveal d1" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
          <div className="slide-track">
            {SLIDES.map((sl, idx) => (
              <div className={`slide ${idx === i ? "active" : idx === prev ? "prev" : ""}`}
                   key={idx} style={{ ["--dir" as string]: dir }} aria-hidden={idx !== i}>
                <img src={sl.img} alt={sl.title} onError={(e) => (e.currentTarget.style.display = "none")} />
                <span className="slide-overlay" />
              </div>
            ))}

            {/* animated giant index */}
            <span className="slide-index" key={`idx${i}`}>{String(i + 1).padStart(2, "0")}</span>

            {/* progress */}
            <div className="slider-progress"><i key={i} style={{ animationDuration: `${INTERVAL}ms`, animationPlayState: paused ? "paused" : "running" }} /></div>

            {/* counter */}
            <div className="slider-counter"><b>{String(i + 1).padStart(2, "0")}</b><span>/ {String(n).padStart(2, "0")}</span></div>

            {/* kinetic caption */}
            <div className="slide-content" key={`c${i}`}>
              <span className="slide-eyebrow">{s.eyebrow}</span>
              <h3 className="slide-title">{s.title}</h3>
              <p className="slide-desc">{s.desc}</p>
              <span className="slide-stat"><Icon name="bolt" width={15} /> {s.stat}</span>
            </div>

            {/* arrows */}
            <button className="slider-arrow prev" onClick={() => step(-1)} aria-label="Previous"><Icon name="arrow" width={20} /></button>
            <button className="slider-arrow next" onClick={() => step(1)} aria-label="Next"><Icon name="arrow" width={20} /></button>

            {/* segment dots */}
            <div className="slider-dots">
              {SLIDES.map((_, idx) => (
                <button key={idx} className={`sdot ${idx === i ? "on" : ""}`} onClick={() => goTo(idx)} aria-label={`Slide ${idx + 1}`} />
              ))}
            </div>
          </div>

          {/* thumbnail strip */}
          <div className="slider-thumbs">
            {SLIDES.map((sl, idx) => (
              <button className={`thumb ${idx === i ? "active" : ""}`} key={idx} onClick={() => goTo(idx)} aria-label={sl.title}>
                <img src={sl.img} alt="" onError={(e) => (e.currentTarget.style.display = "none")} />
                <span className="thumb-label">{sl.eyebrow}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
