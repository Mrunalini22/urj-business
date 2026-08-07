import type { VizData } from "../types";

// Ported from backend/app/routers/viz.py — chart datasets generated in-browser.
const ZONES = ["Guwahati-I", "Guwahati-II", "Barpeta", "Nalbari", "Rangia", "Mangaldoi", "Tezpur", "Dibrugarh"];
const MONTHS = ["Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec", "Jan", "Feb", "Mar"];
const DAY_SHAPE = [
  0.62, 0.58, 0.55, 0.54, 0.56, 0.62, 0.7, 0.78, 0.85, 0.9, 0.93, 0.95,
  0.94, 0.92, 0.9, 0.89, 0.91, 0.95, 1.0, 0.99, 0.95, 0.86, 0.75, 0.68,
];
const PEAK = 2680;

function mulberry32(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const uni = (r: () => number, a: number, b: number) => a + r() * (b - a);
const rnd = (v: number, d = 0) => { const p = 10 ** d; return Math.round(v * p) / p; };
// Box-Muller gaussian
const gauss = (r: () => number, mu: number, sigma: number) =>
  mu + sigma * Math.sqrt(-2 * Math.log(r() || 1e-9)) * Math.cos(2 * Math.PI * r());

function energyBalance() {
  const drift = Math.sin(Date.now() / 1000 / 120);
  const inp = 1000;
  const tech = 7.4 + 0.2 * drift;
  const comm = 5.2 - 0.15 * drift;
  const collEff = 97.9 + 0.2 * drift;
  const billed = inp * (1 - (tech + comm) / 100);
  const collected = (billed * collEff) / 100;
  const atnc = (1 - collected / inp) * 100;
  return {
    input_mu: rnd(inp, 1), technical_loss_pct: rnd(tech, 2), commercial_loss_pct: rnd(comm, 2),
    billed_mu: rnd(billed, 1), collected_mu: rnd(collected, 1), collection_eff_pct: rnd(collEff, 1), atnc_pct: rnd(atnc, 2),
  };
}

function lossHeatmap() {
  const r = mulberry32(new Date().getHours());
  const matrix = ZONES.map((_, z) => {
    const base = 10 + z * 1.6;
    return Array.from({ length: 12 }, (_, m) => {
      const seasonal = 2.2 * Math.sin((m / 12) * 2 * Math.PI + 1);
      const improve = -m * 0.25;
      return rnd(Math.max(4, base + seasonal + improve + uni(r, -0.8, 0.8)), 1);
    });
  });
  return { zones: ZONES, months: MONTHS, matrix };
}

function forecast() {
  const now = new Date();
  const split = 24;
  const pts = Array.from({ length: 48 }, (_, i) => {
    const h = (now.getHours() + i) % 24;
    const base = PEAK * DAY_SHAPE[h];
    if (i < split) return { i, actual: Math.round(base + 24 * Math.sin(i)), forecast: null, lo: null, hi: null };
    const band = 40 + (i - split) * 6;
    return { i, actual: null, forecast: Math.round(base), lo: Math.round(base - band), hi: Math.round(base + band) };
  }) as VizData["forecast"]["points"];
  pts[split].actual = pts[split - 1].actual;
  return { points: pts, split, unit: "MW" };
}

function riskScatter() {
  const r = mulberry32(7);
  const clusters = [
    { cx: 0.3, cy: 0.35, label: "Healthy", risk: "low" },
    { cx: 0.62, cy: 0.55, label: "Watch", risk: "med" },
    { cx: 0.78, cy: 0.8, label: "High risk", risk: "high" },
    { cx: 0.45, cy: 0.68, label: "Reactive-power", risk: "med" },
  ];
  const counts = [46, 34, 18, 24];
  const points: VizData["risk_scatter"]["points"] = [];
  clusters.forEach((cl, c) => {
    for (let k = 0; k < counts[c]; k++) {
      const x = Math.min(0.98, Math.max(0.02, gauss(r, cl.cx, 0.07)));
      const y = Math.min(0.98, Math.max(0.02, gauss(r, cl.cy, 0.07)));
      points.push({ x: rnd(x, 3), y: rnd(y, 3), cluster: c, risk: cl.risk });
    }
  });
  return { points, clusters, x_label: "Avg. load (normalised)", y_label: "Composite risk score" };
}

function reliability() {
  const r = mulberry32(3);
  const saidi: number[] = [], saifi: number[] = [];
  let s1 = 320, s2 = 9.2;
  for (let m = 0; m < 12; m++) {
    s1 *= 0.955 + uni(r, -0.01, 0.01);
    s2 *= 0.96 + uni(r, -0.008, 0.008);
    saidi.push(rnd(s1, 1));
    saifi.push(rnd(s2, 2));
  }
  return { months: MONTHS, saidi, saifi };
}

export function vizData(): VizData {
  return {
    energy_balance: energyBalance(),
    loss_heatmap: lossHeatmap(),
    forecast: forecast(),
    risk_scatter: riskScatter(),
    reliability: reliability(),
  };
}
