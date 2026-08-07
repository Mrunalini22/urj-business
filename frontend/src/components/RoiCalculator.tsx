import { useEffect, useRef, useState } from "react";
import { api } from "../api/client";
import type { RoiConfig, RoiInputs, RoiResult, RoiFlow } from "../types";
import { useCountUp } from "../hooks";
import { Icon } from "./Icon";

// US number grouping + USD money (values are in $ millions)
const grp = (v: number, dec = 0) =>
  v.toLocaleString("en-US", { minimumFractionDigits: dec, maximumFractionDigits: dec });
const money = (v: number) =>
  v >= 1000 ? `$${grp(v / 1000, 2)}B` : `$${grp(v, v < 100 ? 1 : 0)}M`;
const moneyShort = (v: number) =>
  v >= 1000 ? `$${grp(v / 1000, 1)}B` : `$${grp(v, 0)}M`;

const SEG = { loss: "var(--emerald-500)", collection: "var(--volt-500)", om: "var(--sky)" } as Record<string, string>;

function Stat({ label, value, suffix, sub, dec = 0, isMoney = false }:
  { label: string; value: number; suffix?: string; sub: string; dec?: number; isMoney?: boolean }) {
  const v = useCountUp(value, 600);
  return (
    <div className="roi-stat">
      <div className="roi-stat-label">{label}</div>
      <div className="roi-stat-val">{isMoney ? money(v) : grp(v, dec)}{suffix && <span className="u">{suffix}</span>}</div>
      <div className="roi-stat-sub">{sub}</div>
    </div>
  );
}

function FiveYearChart({ r }: { r: RoiResult }) {
  const W = 520, H = 170, pad = 26;
  const max = Math.max(...r.timeline.map((t) => t.cumulative), 1);
  const bw = (W - pad * 2) / r.timeline.length;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="roi-yearchart" preserveAspectRatio="none">
      <line x1={pad} x2={W - pad} y1={H - 20} y2={H - 20} stroke="var(--line)" />
      {r.timeline.map((t, i) => {
        const h = (t.cumulative / max) * (H - 44);
        const x = pad + i * bw + bw * 0.18;
        const w = bw * 0.64;
        return (
          <g key={t.year}>
            <rect x={x} y={H - 20 - h} width={w} height={h} rx={5} fill="url(#roibar)" />
            <text x={x + w / 2} y={H - 20 - h - 6} textAnchor="middle" fontSize="10.5" fontFamily="Space Grotesk, monospace" fill="var(--emerald-700)" fontWeight="600">{moneyShort(t.cumulative)}</text>
            <text x={x + w / 2} y={H - 6} textAnchor="middle" fontSize="10.5" fontFamily="Space Grotesk, monospace" fill="var(--ink-400)">Y{t.year}</text>
          </g>
        );
      })}
      <defs>
        <linearGradient id="roibar" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="var(--emerald-500)" />
          <stop offset="1" stopColor="var(--emerald-600)" />
        </linearGradient>
      </defs>
    </svg>
  );
}

export function RoiCalculator({ flows }: { flows: RoiFlow[] }) {
  const [cfg, setCfg] = useState<RoiConfig | null>(null);
  const [inputs, setInputs] = useState<RoiInputs | null>(null);
  const [res, setRes] = useState<RoiResult | null>(null);
  const [activePreset, setActivePreset] = useState("medium");
  const timer = useRef<number>(0);

  useEffect(() => {
    api.roiConfig().then((c) => {
      setCfg(c);
      setInputs(c.defaults);
      api.roiCalc(c.defaults).then(setRes);
    });
  }, []);

  // debounced recompute on input change
  useEffect(() => {
    if (!inputs) return;
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => api.roiCalc(inputs).then(setRes), 120);
    return () => window.clearTimeout(timer.current);
  }, [inputs]);

  if (!cfg || !inputs || !res) {
    return <div className="live-loading" style={{ color: "var(--ink-400)" }}>Loading the ROI engine…</div>;
  }

  const setField = (k: keyof RoiInputs, v: number) => { setActivePreset(""); setInputs({ ...inputs, [k]: v }); };
  const applyPreset = (key: string, ins: RoiInputs) => { setActivePreset(key); setInputs(ins); };

  return (
    <div className="roi-calc">
      <div className="roi-presets">
        <span className="roi-presets-label">Size your utility</span>
        {cfg.presets.map((p) => (
          <button key={p.key} className={`preset ${activePreset === p.key ? "active" : ""}`} onClick={() => applyPreset(p.key, p.inputs)}>
            {p.label} <em>{p.note}</em>
          </button>
        ))}
      </div>

      <div className="roi-body">
        {/* INPUTS */}
        <div className="roi-inputs">
          <h3>Your operating assumptions</h3>
          {cfg.fields.map((f) => {
            const val = inputs[f.key];
            const dec = f.step < 0.01 ? 3 : f.step < 0.1 ? 2 : f.step < 1 ? 1 : 0;
            const disp = f.fmt === "comma" ? grp(val) : grp(val, dec);
            return (
              <div className="roi-field" key={f.key}>
                <div className="roi-field-top">
                  <label title={f.hint || ""}>{f.label}{f.hint && <span className="qmark" title={f.hint}>?</span>}</label>
                  <span className="roi-field-val">{disp}<em>{f.unit}</em></span>
                </div>
                <input type="range" min={f.min} max={f.max} step={f.step} value={val}
                  onChange={(e) => setField(f.key, +e.target.value)} />
              </div>
            );
          })}
        </div>

        {/* RESULTS */}
        <div className="roi-results">
          <div className="roi-stat-row">
            <Stat label="Net annual benefit" value={res.net_annual_cr} isMoney sub="after platform cost" />
            <Stat label="Return multiple" value={res.benefit_multiple} suffix="×" sub={`${grp(res.roi_pct)}% ROI`} dec={1} />
            <Stat label="Payback" value={res.payback_months} suffix="mo" sub="to recover platform cost" dec={1} />
          </div>

          {/* waterfall */}
          <div className="roi-flow-strip">
            <div className="rfs-node"><span>Gross opportunity</span><b>{money(res.gross_opportunity_cr)}</b></div>
            <div className="rfs-op">× {grp(res.attribution_pct)}%<Icon name="arrow" /></div>
            <div className="rfs-node"><span>Credited to URJ</span><b>{money(res.attributable_benefit_cr)}</b></div>
            <div className="rfs-op">− cost<Icon name="arrow" /></div>
            <div className="rfs-node net"><span>Net annual</span><b>{money(res.net_annual_cr)}</b></div>
          </div>

          {/* breakdown bar */}
          <div className="roi-panel">
            <div className="roi-panel-head"><span>Gross annual opportunity · {money(res.gross_opportunity_cr)}</span></div>
            <div className="roi-bar">
              {res.breakdown.map((b) => (
                <div key={b.key} className="roi-seg" style={{ flexGrow: Math.max(b.value, 0.01), background: SEG[b.key] }} title={`${b.label}: ${money(b.value)}`} />
              ))}
            </div>
            <div className="roi-legend">
              {res.breakdown.map((b) => (
                <div key={b.key} className="roi-leg"><span className="dot" style={{ background: SEG[b.key] }} /> {b.label} <b>{money(b.value)}</b></div>
              ))}
            </div>
          </div>

          {/* 5-year cumulative */}
          <div className="roi-panel">
            <div className="roi-panel-head">
              <span>Cumulative net benefit · 5-year</span>
              <span className="roi-panel-hi">{money(res.five_year_net_cr)}</span>
            </div>
            <FiveYearChart r={res} />
          </div>
        </div>
      </div>

      {/* money-moves band */}
      <div className="roi-flows">
        {flows.map((f, i) => (
          <div className="roi-flowline" key={i}>
            <div className="ri"><Icon name={f.icon} /></div>
            <div className="rt"><b>{f.title}</b><span>{f.subtitle}</span></div>
            <div className={`rval ${f.direction}`}>{f.direction === "up" ? "↑" : "↓"}</div>
          </div>
        ))}
      </div>

      <p className="roi-disclaimer">
        Indicative model for illustration — figures move with the assumptions above. The “share credited to URJ”
        conservatively attributes only part of the gross opportunity to the platform; the remainder depends on
        metering, enforcement and field execution.
      </p>
    </div>
  );
}
