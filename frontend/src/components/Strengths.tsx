import { useEffect, useRef, useState } from "react";
import { Icon } from "./Icon";

/** Counts up to a target once scrolled into view (snaps if tab not visible). */
function Counter({ value, dec = 0, prefix = "", suffix = "" }: { value: number; dec?: number; prefix?: string; suffix?: string }) {
  const [v, setV] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let done = false;
    const run = () => {
      if (done) return;
      done = true;
      if (document.visibilityState !== "visible") { setV(value); return; }
      const start = performance.now(), dur = 1500;
      const tick = (t: number) => {
        const p = Math.min(1, (t - start) / dur);
        setV(value * (1 - Math.pow(1 - p, 3)));
        if (p < 1) requestAnimationFrame(tick); else setV(value);
      };
      requestAnimationFrame(tick);
    };
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { obs.disconnect(); run(); } }, { threshold: 0.4 });
    obs.observe(el);
    // Safety: if the tab isn't compositing (IO won't fire), snap to the value.
    const fallback = window.setTimeout(() => { if (!done && document.visibilityState !== "visible") { setV(value); done = true; } }, 1200);
    return () => { obs.disconnect(); clearTimeout(fallback); };
  }, [value]);
  return <span ref={ref}>{prefix}{v.toLocaleString("en-IN", { minimumFractionDigits: dec, maximumFractionDigits: dec })}{suffix}</span>;
}

type Stat = { icon: string; value?: number; dec?: number; prefix?: string; suffix?: string; big?: string; label: string; sub: string };
const STATS: Stat[] = [
  { icon: "coins", prefix: "₹", value: 3.03, dec: 2, suffix: " L Cr", label: "RDSS reform-ready",
    sub: "Built to operationalise the Revamped Distribution Sector Scheme — the national programme modernising DISCOMs." },
  { icon: "trend", value: 16, suffix: "%", label: "AT&C loss — the headline", dec: 0,
    sub: "Always-on loss & theft detection targets the metric every Indian DISCOM is judged on, vs periodic audits." },
  { icon: "hub", value: 25, suffix: " Cr", label: "Smart meters, mandated", dec: 0,
    sub: "A vendor-agnostic ingestion hub built to absorb the AMISP/HES smart-meter rollout at national scale." },
  { icon: "layers", big: "IES v0.6", label: "India Energy Stack aligned", suffix: "",
    sub: "Standards-compliant with the national MeterData interoperability specification — future-proofed integration." },
];

export function Strengths() {
  return (
    <section className="section strengths-sec">
      <div className="hero-grid" />
      <div className="hero-glow a" />
      <div className="wrap" style={{ position: "relative", zIndex: 2 }}>
        <div className="sec-head reveal" style={{ maxWidth: 760 }}>
          <span className="eyebrow" style={{ color: "var(--emerald-300)" }}>
            <span style={{ background: "var(--emerald-300)" }} />Built for the Indian distribution sector
          </span>
          <h2 style={{ color: "#fff" }}>Purpose-built for how Indian DISCOMs actually run</h2>
          <p className="lead" style={{ color: "rgba(255,255,255,.8)" }}>
            URJ maps to the sector's real pressures — reform mandates, AT&C loss, smart-metering scale and national data
            standards — with capabilities that are live in production today, not on a roadmap.
          </p>
        </div>

        <div className="strengths-grid reveal d1">
          {STATS.map((s, i) => (
            <div className="strength-card" key={i}>
              <div className="strength-ic"><Icon name={s.icon} /></div>
              <div className="strength-num">
                {s.big ? s.big : <Counter value={s.value!} dec={s.dec} prefix={s.prefix} suffix={s.suffix} />}
              </div>
              <h4>{s.label}</h4>
              <p>{s.sub}</p>
            </div>
          ))}
        </div>

        <p className="strengths-note">
          Sector figures are widely-cited public references (RDSS outlay, national AT&C loss, smart-meter targets) shown for
          context; every URJ capability described is deployed and operational today.
        </p>
      </div>
    </section>
  );
}
