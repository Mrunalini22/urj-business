import { useEffect, useState } from "react";
import { api } from "../api/client";
import type { VizData } from "../types";
import { Icon } from "./Icon";

/* ── colour helpers ─────────────────────────────────────────── */
const hex = (h: string) => [parseInt(h.slice(1, 3), 16), parseInt(h.slice(3, 5), 16), parseInt(h.slice(5, 7), 16)];
const lerp = (a: number[], b: number[], t: number) => `rgb(${a.map((v, i) => Math.round(v + (b[i] - v) * t)).join(",")})`;
const G = hex("#16a37a"), Y = hex("#f5a623"), R = hex("#e0564e");
function lossColor(v: number, min = 6, max = 22) {
  const t = Math.max(0, Math.min(1, (v - min) / (max - min)));
  return t < 0.5 ? lerp(G, Y, t * 2) : lerp(Y, R, (t - 0.5) * 2);
}
const RISK = { low: "#16a37a", med: "#f5a623", high: "#e0564e" } as Record<string, string>;

/* ══════════════ 1 · LIVE SINGLE-LINE DIAGRAM ══════════════ */
export function Sld() {
  // static topology, animated current flow + live node states
  const feeders = [130, 260, 390];
  const dtY = [150, 220, 290];
  const state = (f: number, d: number) => {
    const k = (f + d) % 5;
    return k === 3 ? "#f5a623" : k === 4 && f === 1 ? "#e0564e" : "#34c99b";
  };
  return (
    <svg viewBox="0 0 520 340" className="viz-svg sld">
      {/* grid supply */}
      <text x="260" y="26" textAnchor="middle" className="viz-t" fill="var(--emerald-300)">132 kV GRID SUPPLY</text>
      <line x1="260" y1="34" x2="260" y2="62" className="wire live" />
      {/* transformer */}
      <circle cx="252" cy="72" r="11" className="xfmr" /><circle cx="268" cy="72" r="11" className="xfmr" />
      <line x1="260" y1="83" x2="260" y2="96" className="wire live" />
      {/* bus bar */}
      <rect x="90" y="96" width="340" height="7" rx="3" className="bus" />
      <text x="96" y="118" className="viz-t" fill="rgba(255,255,255,.6)">33 kV BUS · SS-Guwahati-I</text>
      {feeders.map((x, f) => (
        <g key={f}>
          <line x1={x} y1="103" x2={x} y2="130" className="wire live" style={{ animationDelay: `${f * 0.3}s` }} />
          <rect x={x - 16} y="130" width="32" height="16" rx="3" className="brk" />
          <text x={x} y="141" textAnchor="middle" className="viz-t2">F{f + 1}</text>
          {dtY.map((y, d) => (
            <g key={d}>
              <line x1={x} y1={d === 0 ? 146 : dtY[d - 1] + 8} x2={x} y2={y - 8} className="wire live" style={{ animationDelay: `${(f + d) * 0.25}s` }} />
              <circle cx={x} cy={y} r="7" fill={state(f, d)} className={state(f, d) === "#e0564e" ? "dt fault" : "dt"} />
              <text x={x + 14} y={y + 4} className="viz-t2">DT-{f}{d}{2 + d}</text>
            </g>
          ))}
        </g>
      ))}
      {/* legend */}
      <g transform="translate(96,315)">
        <circle cx="0" cy="0" r="5" fill="#34c99b" /><text x="10" y="4" className="viz-t2">Normal</text>
        <circle cx="90" cy="0" r="5" fill="#f5a623" /><text x="100" y="4" className="viz-t2">Reduced V</text>
        <circle cx="200" cy="0" r="5" fill="#e0564e" /><text x="210" y="4" className="viz-t2">Excursion / fault</text>
      </g>
    </svg>
  );
}

/* ══════════════ 2 · AT&C LOSS HEATMAP ══════════════ */
function Heatmap({ d }: { d: VizData["loss_heatmap"] }) {
  const [hover, setHover] = useState<{ z: number; m: number } | null>(null);
  const cw = 30, ch = 26, x0 = 110, y0 = 20;
  return (
    <svg viewBox={`0 0 ${x0 + 12 * cw + 20} ${y0 + 8 * ch + 60}`} className="viz-svg">
      {d.zones.map((z, zi) => (
        <text key={z} x={x0 - 10} y={y0 + zi * ch + ch / 2 + 4} textAnchor="end" className="viz-t2">{z}</text>
      ))}
      {d.months.map((m, mi) => (
        <text key={m} x={x0 + mi * cw + cw / 2} y={y0 + 8 * ch + 18} textAnchor="middle" className="viz-t2">{m}</text>
      ))}
      {d.matrix.map((row, zi) =>
        row.map((v, mi) => (
          <rect key={`${zi}-${mi}`} x={x0 + mi * cw + 1.5} y={y0 + zi * ch + 1.5} width={cw - 3} height={ch - 3} rx="3"
            fill={lossColor(v)} className="hm-cell" style={{ animationDelay: `${(zi + mi) * 22}ms` }}
            opacity={hover && (hover.z !== zi || hover.m !== mi) ? 0.35 : 1}
            onMouseEnter={() => setHover({ z: zi, m: mi })} onMouseLeave={() => setHover(null)} />
        ))
      )}
      {hover && (
        <text x={x0} y={y0 + 8 * ch + 42} className="viz-t" fill="var(--ink-800)">
          {d.zones[hover.z]} · {d.months[hover.m]} — AT&C loss {d.matrix[hover.z][hover.m]}%
        </text>
      )}
      {/* legend gradient */}
      <g transform={`translate(${x0 + 12 * cw - 168},${y0 + 8 * ch + 34})`}>
        <text x="0" y="10" className="viz-t2">Low</text>
        {Array.from({ length: 40 }).map((_, i) => (
          <rect key={i} x={30 + i * 2.5} y="2" width="2.6" height="10" fill={lossColor(6 + (i / 40) * 16)} />
        ))}
        <text x="138" y="10" className="viz-t2">High</text>
      </g>
    </svg>
  );
}

/* ══════════════ 3 · ENERGY BALANCE ══════════════ */
function EnergyBalance({ d }: { d: VizData["energy_balance"] }) {
  const total = d.input_mu;
  const tech = d.technical_loss_pct, comm = d.commercial_loss_pct;
  const collGap = ((d.billed_mu - d.collected_mu) / total) * 100;
  const collected = (d.collected_mu / total) * 100;
  const segs = [
    { label: "Energy realised (collected)", pct: collected, mu: d.collected_mu, c: "var(--emerald-500)" },
    { label: "Collection gap", pct: collGap, mu: +(d.billed_mu - d.collected_mu).toFixed(1), c: "#f5a623" },
    { label: "Commercial loss", pct: comm, mu: +(total * comm / 100).toFixed(1), c: "#e08a2e" },
    { label: "Technical loss", pct: tech, mu: +(total * tech / 100).toFixed(1), c: "#e0564e" },
  ];
  return (
    <div className="ebal">
      <div className="ebal-head">
        <div><span>Energy input</span><b>{d.input_mu.toLocaleString("en-IN")} <em>MU / month</em></b></div>
        <div className="ebal-atnc"><span>AT&C loss</span><b>{d.atnc_pct}%</b></div>
      </div>
      <div className="ebal-bar">
        {segs.map((s, i) => (
          <div key={i} className="ebal-seg" style={{ width: `${s.pct}%`, background: s.c, animationDelay: `${i * 140}ms` }} title={`${s.label}: ${s.mu} MU`} />
        ))}
      </div>
      <div className="ebal-legend">
        {segs.map((s, i) => (
          <div key={i} className="ebal-leg">
            <span className="dot" style={{ background: s.c }} />
            <div><b>{s.label}</b><span>{s.mu.toLocaleString("en-IN")} MU · {s.pct.toFixed(1)}%</span></div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ══════════════ 4 · LOAD FORECAST ══════════════ */
function Forecast({ d }: { d: VizData["forecast"] }) {
  const W = 560, H = 260, pad = 34;
  const pts = d.points;
  const ys = pts.flatMap((p) => [p.actual, p.forecast, p.lo, p.hi].filter((v): v is number => v != null));
  const max = Math.max(...ys) * 1.04, min = Math.min(...ys) * 0.92;
  const X = (i: number) => pad + (i / (pts.length - 1)) * (W - pad * 2);
  const Y = (v: number) => H - pad - ((v - min) / (max - min)) * (H - pad * 2);
  const actual = pts.filter((p) => p.actual != null).map((p) => `${X(p.i)},${Y(p.actual!)}`).join(" ");
  const fc = pts.filter((p) => p.forecast != null);
  const fcLine = fc.map((p) => `${X(p.i)},${Y(p.forecast!)}`).join(" ");
  const band = [...fc.map((p) => `${X(p.i)},${Y(p.hi!)}`), ...fc.reverse().map((p) => `${X(p.i)},${Y(p.lo!)}`)].join(" ");
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="viz-svg">
      {[0, .25, .5, .75, 1].map((g) => {
        const v = min + (max - min) * g;
        return <g key={g}><line x1={pad} x2={W - pad} y1={Y(v)} y2={Y(v)} className="grid" /><text x={pad - 6} y={Y(v) + 3} textAnchor="end" className="viz-t2">{Math.round(v)}</text></g>;
      })}
      <polygon points={band} className="fc-band" />
      <polyline points={actual} className="fc-actual draw" />
      <polyline points={fcLine} className="fc-line draw" />
      <line x1={X(d.split)} y1={pad} x2={X(d.split)} y2={H - pad} className="fc-now" />
      <text x={X(d.split)} y={pad - 6} textAnchor="middle" className="viz-t" fill="var(--volt-600)">NOW</text>
      <text x={pad} y={H - 8} className="viz-t2">−24h</text>
      <text x={W - pad} y={H - 8} textAnchor="end" className="viz-t2">+24h forecast ({d.unit})</text>
    </svg>
  );
}

/* ══════════════ 5 · CONSUMER RISK CLUSTERS ══════════════ */
function Scatter({ d }: { d: VizData["risk_scatter"] }) {
  const W = 540, H = 300, pad = 40;
  const X = (x: number) => pad + x * (W - pad * 2);
  const Y = (y: number) => H - pad - y * (H - pad * 2);
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="viz-svg">
      <line x1={pad} y1={H - pad} x2={W - pad} y2={H - pad} className="axis" />
      <line x1={pad} y1={pad} x2={pad} y2={H - pad} className="axis" />
      <text x={W / 2} y={H - 6} textAnchor="middle" className="viz-t2">{d.x_label}</text>
      <text x={12} y={H / 2} textAnchor="middle" className="viz-t2" transform={`rotate(-90 12 ${H / 2})`}>{d.y_label}</text>
      {d.points.map((p, i) => (
        <circle key={i} cx={X(p.x)} cy={Y(p.y)} r="4.5" fill={RISK[p.risk]} className="sc-dot" style={{ animationDelay: `${i * 7}ms` }} opacity=".82" />
      ))}
      {d.clusters.map((c, i) => (
        <text key={i} x={X(c.cx)} y={Y(c.cy) - 12} textAnchor="middle" className="viz-t" fill="var(--ink-700)">{c.label}</text>
      ))}
    </svg>
  );
}

/* ══════════════ 6 · RELIABILITY TREND ══════════════ */
function Reliability({ d }: { d: VizData["reliability"] }) {
  const W = 560, H = 250, pad = 40;
  const maxS = Math.max(...d.saidi) * 1.1, maxF = Math.max(...d.saifi) * 1.2;
  const X = (i: number) => pad + (i / (d.months.length - 1)) * (W - pad * 2);
  const Ys = (v: number) => H - pad - (v / maxS) * (H - pad * 2);
  const Yf = (v: number) => H - pad - (v / maxF) * (H - pad * 2);
  const areaS = `${pad},${H - pad} ${d.saidi.map((v, i) => `${X(i)},${Ys(v)}`).join(" ")} ${W - pad},${H - pad}`;
  const lineF = d.saifi.map((v, i) => `${X(i)},${Yf(v)}`).join(" ");
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="viz-svg">
      <polygon points={areaS} className="rel-area" />
      <polyline points={d.saidi.map((v, i) => `${X(i)},${Ys(v)}`).join(" ")} className="rel-saidi draw" />
      <polyline points={lineF} className="rel-saifi draw" />
      {d.months.map((m, i) => <text key={m} x={X(i)} y={H - 14} textAnchor="middle" className="viz-t2">{m}</text>)}
      <g transform={`translate(${pad},18)`}>
        <line x1="0" y1="-4" x2="22" y2="-4" className="rel-saidi" /><text x="28" y="0" className="viz-t2">SAIDI (min) ↓ improving</text>
        <line x1="200" y1="-4" x2="222" y2="-4" className="rel-saifi" /><text x="228" y="0" className="viz-t2">SAIFI (count) ↓ improving</text>
      </g>
    </svg>
  );
}

/* ══════════════ SHOWCASE ══════════════ */
const TABS = [
  { key: "sld", label: "Live network", icon: "network", cap: "Auto-generated single-line diagram with animated power flow and live node status — control-room fault localisation at a glance." },
  { key: "heatmap", label: "AT&C loss heatmap", icon: "grid", cap: "Aggregate Technical & Commercial loss by zone and month — instantly surfaces the lossiest circles and the seasonal theft pattern." },
  { key: "energy", label: "Energy balance", icon: "bolt", cap: "Where every unit of energy goes — realised revenue vs technical, commercial and collection losses, reconciled to the AT&C figure." },
  { key: "forecast", label: "Load forecast", icon: "trend", cap: "Trained load forecast with a widening confidence band — the basis for power-purchase planning and fewer open-market penalties." },
  { key: "risk", label: "Consumer risk", icon: "brain", cap: "Consumers clustered by load and composite risk — a ranked, evidence-backed worklist instead of blanket field inspections." },
  { key: "reliability", label: "Reliability trend", icon: "chart", cap: "SAIDI and SAIFI trending down month over month — the reliability story leadership and the regulator both track." },
];

export function VizShowcase() {
  const [d, setD] = useState<VizData | null>(null);
  const [tab, setTab] = useState("sld");
  useEffect(() => {
    let alive = true;
    const tick = () => api.viz().then((v) => alive && setD(v)).catch(() => {});
    tick();
    const id = setInterval(tick, 4000); // live refresh — updates in place, no re-animation
    return () => { alive = false; clearInterval(id); };
  }, []);
  const active = TABS.find((t) => t.key === tab)!;

  return (
    <section className="section viz-sec" id="visuals">
      <div className="wrap">
        <div className="sec-head center reveal">
          <span className="eyebrow center">Intelligence in action</span>
          <h2>See the data layer come alive</h2>
          <p className="lead" style={{ marginLeft: "auto", marginRight: "auto" }}>
            The same visual intelligence operators use every day — live network topology, loss analytics,
            energy balance, forecasting and consumer risk — rendered from real operational data.
          </p>
        </div>

        <div className="viz-tabs reveal">
          {TABS.map((t) => (
            <button key={t.key} className={`viz-tab ${tab === t.key ? "active" : ""}`} onClick={() => setTab(t.key)}>
              <Icon name={t.icon} /> {t.label}
            </button>
          ))}
        </div>

        <div className="viz-stage reveal d1">
          <div className="viz-canvas" key={tab}>
            {!d ? <div className="live-loading" style={{ color: "var(--ink-400)" }}>Loading visualization data…</div> : (
              tab === "sld" ? <Sld /> :
              tab === "heatmap" ? <Heatmap d={d.loss_heatmap} /> :
              tab === "energy" ? <EnergyBalance d={d.energy_balance} /> :
              tab === "forecast" ? <Forecast d={d.forecast} /> :
              tab === "risk" ? <Scatter d={d.risk_scatter} /> :
              <Reliability d={d.reliability} />
            )}
          </div>
          <div className="viz-cap">
            <span className="pill pill-live"><span className="dot" /> LIVE DATA</span>
            <p>{active.cap}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
