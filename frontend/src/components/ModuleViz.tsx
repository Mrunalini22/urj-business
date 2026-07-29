import type { ModuleDetail } from "../types";

/* deterministic pseudo-random per module (stable across renders) */
function seeded(slug: string) {
  let h = 2166136261;
  for (const c of slug) { h ^= c.charCodeAt(0); h = Math.imul(h, 16777619); }
  return () => {
    h = Math.imul(h ^ (h >>> 15), 2246822507);
    h = Math.imul(h ^ (h >>> 13), 3266489909);
    return ((h ^ (h >>> 16)) >>> 0) / 4294967296;
  };
}

const EM = "#0f7a5c", EM2 = "#34c99b", VOLT = "#f5a623", SKY = "#1f8fdb", ROSE = "#e0564e";

/* ── renderers (viewBox 320×130) ── */
function Spark({ rng, band, color = EM }: { rng: () => number; band?: boolean; color?: string }) {
  const n = 18, W = 320, H = 130, pad = 10;
  let v = 0.45;
  const vals = Array.from({ length: n }, (_, i) => {
    v = Math.max(0.12, Math.min(0.9, v + (rng() - 0.42) * 0.16 + (i > n / 2 ? 0.012 : 0)));
    return v;
  });
  const X = (i: number) => pad + (i / (n - 1)) * (W - pad * 2);
  const Y = (t: number) => H - pad - t * (H - pad * 2);
  const line = vals.map((t, i) => `${X(i)},${Y(t)}`).join(" ");
  const split = Math.floor(n * 0.66);
  const bandPoly = band
    ? [...vals.slice(split).map((t, i) => `${X(split + i)},${Y(Math.min(0.95, t + 0.13))}`),
       ...vals.slice(split).reverse().map((t, i) => `${X(n - 1 - i)},${Y(Math.max(0.05, t - 0.13))}`)].join(" ")
    : "";
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="mviz-svg">
      {[0.25, 0.5, 0.75].map((g) => <line key={g} x1={pad} x2={W - pad} y1={Y(g)} y2={Y(g)} className="grid" />)}
      {band && <polygon points={bandPoly} fill="rgba(52,201,155,.18)" />}
      <polygon points={`${line} ${X(n - 1)},${H - pad} ${X(0)},${H - pad}`} fill="rgba(15,122,92,.10)" />
      <polyline points={line} fill="none" stroke={color} strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" className="draw" />
      {band && <line x1={X(split)} x2={X(split)} y1={pad} y2={H - pad} stroke={VOLT} strokeWidth="1.3" strokeDasharray="3 3" opacity=".7" />}
    </svg>
  );
}

function Bars({ rng, color = EM }: { rng: () => number; color?: string }) {
  const n = 9, W = 320, H = 130, pad = 12;
  const vals = Array.from({ length: n }, () => 0.25 + rng() * 0.72);
  const bw = (W - pad * 2) / n;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="mviz-svg">
      {vals.map((t, i) => (
        <rect key={i} x={pad + i * bw + bw * 0.16} y={H - pad - t * (H - pad * 2)} width={bw * 0.68}
          height={t * (H - pad * 2)} rx="3" fill={i === n - 1 ? VOLT : color}
          className="mviz-bar" style={{ transformOrigin: "bottom", animationDelay: `${i * 55}ms` }} />
      ))}
    </svg>
  );
}

function Gauge({ pct, label, color = EM2 }: { pct: number; label: string; color?: string }) {
  const W = 320, H = 130, cx = 160, cy = 118, r = 84;
  const a0 = Math.PI, a1 = 0;
  const ang = a0 + (a1 - a0) * (pct / 100);
  const p = (a: number) => [cx + r * Math.cos(a), cy - r * Math.sin(a)];
  const [sx, sy] = p(a0), [ex, ey] = p(ang), [tx, ty] = p(a1);
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="mviz-svg">
      <path d={`M${sx},${sy} A${r},${r} 0 0 1 ${tx},${ty}`} fill="none" stroke="var(--line)" strokeWidth="12" strokeLinecap="round" />
      <path d={`M${sx},${sy} A${r},${r} 0 0 1 ${ex},${ey}`} fill="none" stroke={color} strokeWidth="12" strokeLinecap="round" className="gauge-arc" />
      <text x={cx} y={cy - 22} textAnchor="middle" fontFamily="var(--font-display)" fontSize="30" fontWeight="600" fill="var(--emerald-700)">{pct}%</text>
      <text x={cx} y={cy - 4} textAnchor="middle" fontFamily="var(--font-mono)" fontSize="9.5" letterSpacing=".08em" fill="var(--ink-400)">{label}</text>
    </svg>
  );
}

function Heat({ rng }: { rng: () => number }) {
  const cols = 12, rows = 5, W = 320, H = 130, cw = W / cols, ch = (H - 6) / rows;
  const col = (v: number) => { const t = v; return t < 0.5 ? `rgb(${Math.round(22 + 223 * t * 2)},${Math.round(163 + -3 * t * 2)},${Math.round(122 - 87 * t * 2)})` : `rgb(224,${Math.round(166 - 90 * (t - 0.5) * 2)},${Math.round(35 + 43 * (t - 0.5) * 2)})`; };
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="mviz-svg">
      {Array.from({ length: rows }).map((_, r) =>
        Array.from({ length: cols }).map((_, c) => {
          const v = Math.max(0.05, Math.min(0.95, 0.3 + r * 0.11 + Math.sin(c / 2) * 0.12 + rng() * 0.25));
          return <rect key={`${r}-${c}`} x={c * cw + 1.5} y={r * ch + 3} width={cw - 3} height={ch - 3} rx="2.5"
            fill={col(v)} className="hm-cell" style={{ animationDelay: `${(r + c) * 25}ms` }} />;
        })
      )}
    </svg>
  );
}

function Scatter({ rng }: { rng: () => number }) {
  const W = 320, H = 130, pad = 8;
  const cl = [{ x: .3, y: .35, c: EM2 }, { x: .6, y: .55, c: VOLT }, { x: .8, y: .78, c: ROSE }];
  const pts: { x: number; y: number; c: string }[] = [];
  cl.forEach((k) => { for (let i = 0; i < 22; i++) pts.push({ x: Math.min(.97, Math.max(.03, k.x + (rng() - .5) * .22)), y: Math.min(.97, Math.max(.03, k.y + (rng() - .5) * .22)), c: k.c }); });
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="mviz-svg">
      {pts.map((p, i) => <circle key={i} cx={pad + p.x * (W - pad * 2)} cy={H - pad - p.y * (H - pad * 2)} r="3.4" fill={p.c} className="sc-dot" style={{ animationDelay: `${i * 9}ms` }} />)}
    </svg>
  );
}

function Flow() {
  const W = 320, H = 130, y = 65;
  const xs = [40, 130, 220, 290];
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="mviz-svg">
      {xs.slice(0, -1).map((x, i) => <line key={i} x1={x} y1={y} x2={xs[i + 1]} y2={y} className="mflow-wire" style={{ animationDelay: `${i * 0.3}s` }} />)}
      {[40, 130, 220].map((x, i) => <circle key={i} cx={x} cy={y} r="14" fill="none" stroke={[SKY, EM2, EM2][i]} strokeWidth="3" />)}
      <rect x={xs[3] - 16} y={y - 16} width="32" height="32" rx="8" fill={EM} />
      <text x={40} y={y + 34} textAnchor="middle" fontFamily="var(--font-mono)" fontSize="9" fill="var(--ink-400)">source</text>
      <text x={130} y={y + 34} textAnchor="middle" fontFamily="var(--font-mono)" fontSize="9" fill="var(--ink-400)">normalise</text>
      <text x={220} y={y + 34} textAnchor="middle" fontFamily="var(--font-mono)" fontSize="9" fill="var(--ink-400)">quality</text>
      <text x={290} y={y + 34} textAnchor="middle" fontFamily="var(--font-mono)" fontSize="9" fill="var(--emerald-700)" fontWeight="600">canonical</text>
    </svg>
  );
}

/* slug → chart */
const MAP: Record<string, { render: (rng: () => number) => JSX.Element; title: string }> = {
  "executive-command-center": { title: "Live KPI trend", render: (r) => <Spark rng={r} /> },
  "network-ops-sld": { title: "Live network flow", render: () => <Flow /> },
  "asset-maintenance-eam": { title: "Fleet asset-health score", render: () => <Gauge pct={86} label="HEALTHY" /> },
  "revenue-assurance": { title: "AT&C loss by zone / month", render: (r) => <Heat rng={r} /> },
  "discom-ai-insights": { title: "Consumer risk clusters", render: (r) => <Scatter rng={r} /> },
  "predictive-roi-engine": { title: "Load forecast + confidence band", render: (r) => <Spark rng={r} band /> },
  "field-force-mobile": { title: "Jobs completed / crew", render: (r) => <Bars rng={r} /> },
  "data-ingestion-hub": { title: "Ingestion pipeline", render: () => <Flow /> },
  "platform-security-governance": { title: "Verified tenant isolation", render: () => <Gauge pct={100} label="ISOLATED" /> },
  "licensing-compliance": { title: "Platform availability (fail-open)", render: () => <Gauge pct={99} label="UPTIME" color={EM} /> },
  "conversational-ai": { title: "Self-serve queries answered", render: (r) => <Bars rng={r} color={SKY} /> },
};

export function ModuleViz({ mod }: { mod: ModuleDetail }) {
  const cfg = MAP[mod.slug] ?? { title: "Signal", render: (r: () => number) => <Spark rng={r} /> };
  const rng = seeded(mod.slug);
  return (
    <div className="mviz-panel">
      <div className="mviz-head">
        <span className="mviz-title">{cfg.title}</span>
        <span className="mviz-tag">illustrative</span>
      </div>
      <div className="mviz-chart">{cfg.render(rng)}</div>
      <div className="mviz-stats">
        {mod.metrics.slice(0, 3).map((m, i) => (
          <div className="mviz-stat" key={i}><b>{m.value}</b><span>{m.label}</span></div>
        ))}
      </div>
    </div>
  );
}
