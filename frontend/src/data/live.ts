import type { LiveSnapshot } from "../types";

// Ported from backend/app/routers/live.py — realistic, time-varying telemetry
// generated in the browser (no server needed).
const DAY_SHAPE = [
  0.62, 0.58, 0.55, 0.54, 0.56, 0.62, 0.7, 0.78, 0.85, 0.9, 0.93, 0.95,
  0.94, 0.92, 0.9, 0.89, 0.91, 0.95, 1.0, 0.99, 0.95, 0.86, 0.75, 0.68,
];
const PEAK_MW = 2680, FEEDERS_TOTAL = 1300, METERS_TOTAL = 512400;
const CIRCLES = ["Guwahati-I", "Barpeta", "Nalbari", "Rangia", "Mangaldoi"];
const ALERT_POOL: [string, string][] = [
  ["warn", "Tamper flag raised · DT-{d} · {c}"],
  ["warn", "Overload warning · Feeder {f} · {c}"],
  ["info", "Voltage excursion cleared · DT-{d}"],
  ["ok", "Work order {w} acknowledged by field crew"],
  ["ok", "Load threshold cleared · Feeder {f}"],
  ["warn", "Nil-consumption anomaly · consumer {m}"],
  ["info", "New reading batch ingested · {n} meters"],
  ["ok", "Restoration confirmed · {c} · {w}"],
  ["warn", "Low power factor flagged · HT connection {m}"],
  ["info", "Collection posted · ${r}k · {c}"],
];

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
const rint = (r: () => number, a: number, b: number) => Math.floor(a + r() * (b - a + 1));
const pick = <T,>(r: () => number, arr: T[]): T => arr[Math.floor(r() * arr.length)];
const rnd = (v: number, d = 0) => { const p = 10 ** d; return Math.round(v * p) / p; };

function multAt(d: Date): number {
  const h = d.getHours();
  const frac = d.getMinutes() / 60 + d.getSeconds() / 3600;
  const cur = DAY_SHAPE[h], nxt = DAY_SHAPE[(h + 1) % 24];
  return cur + (nxt - cur) * frac;
}

export function liveSnapshot(): LiveSnapshot {
  const now = new Date();
  const secs = now.getTime() / 1000;
  const r = mulberry32(Math.floor(secs / 2));
  const mult = multAt(now);
  const prev = multAt(new Date(now.getTime() - 60000));
  const drift = Math.sin(secs / 90);

  const load = PEAK_MW * (mult + uni(r, -0.01, 0.01));
  const loadDelta = rnd(PEAK_MW * (mult - prev) + uni(r, -4, 4), 1);
  const atnc = 12.4 - 0.15 * drift + uni(r, -0.05, 0.05);
  const collection = 97.9 + 0.25 * drift + uni(r, -0.06, 0.06);
  const feeders = FEEDERS_TOTAL - rint(r, 6, 20);
  const meters = METERS_TOTAL - rint(r, 180, 1400);
  const activeAlerts = 4 + Math.floor(3 * (mult - 0.6) * 2) + rint(r, 0, 2);
  const pf = 0.958 + 0.01 * drift + uni(r, -0.004, 0.004);

  const tiles = [
    { key: "load", label: "Power delivered now", value: rnd(load, 1), unit: "MW", delta: loadDelta, fmt: "comma1" as const },
    { key: "atnc", label: "AT&C loss · live estimate", value: rnd(atnc, 2), unit: "%", delta: rnd(-0.15 * drift, 2), good: "down" as const },
    { key: "collection", label: "Collection efficiency", value: rnd(collection, 1), unit: "%", delta: rnd(0.25 * drift, 2), good: "up" as const },
    { key: "feeders", label: "Feeders reporting", value: feeders, unit: `/${FEEDERS_TOTAL}`, delta: rint(r, -3, 4), good: "up" as const },
    { key: "meters", label: "Smart meters online", value: meters, unit: "", fmt: "comma" as const, delta: rint(r, -200, 260), good: "up" as const },
    { key: "pf", label: "System power factor", value: rnd(pf, 3), unit: "", delta: rnd(0.01 * drift, 3), good: "up" as const },
    { key: "alerts", label: "Active alerts", value: Math.max(1, activeAlerts), unit: "", delta: rint(r, -2, 2), good: "down" as const },
    { key: "crews", label: "Field crews active", value: 34 + rint(r, -3, 6), unit: "", delta: rint(r, -2, 3), good: "up" as const },
  ];

  const load_curve = DAY_SHAPE.map((v, i) => ({ h: i, mw: Math.round(PEAK_MW * v) }));
  load_curve[now.getHours()] = { h: now.getHours(), mw: Math.round(load) };

  const ra = mulberry32(Math.floor(secs / 5));
  const hhmmss = (d: Date) =>
    [d.getHours(), d.getMinutes(), d.getSeconds()].map((n) => String(n).padStart(2, "0")).join(":");
  const alerts = Array.from({ length: 6 }, (_, i) => {
    const [level, tpl] = pick(ra, ALERT_POOL);
    const text = tpl
      .replace("{d}", String(rint(ra, 1000, 8999)))
      .replace("{f}", `${pick(ra, ["A", "B", "G"])}${rint(ra, 10, 49)}`)
      .replace("{c}", pick(ra, CIRCLES))
      .replace("{w}", `WO-${rint(ra, 40000, 99999)}`)
      .replace("{m}", String(rint(ra, 100000, 999999)))
      .replace("{n}", `${rint(ra, 2, 9)},${rint(ra, 100, 999)}`)
      .replace("{r}", String(rint(ra, 3, 88)));
    const ts = new Date(now.getTime() - (rint(ra, 2, 220) + i * 3) * 1000);
    return { level: level as "warn" | "ok" | "info", text, t: hhmmss(ts) };
  });

  return {
    ts: now.toISOString().slice(0, 19),
    as_of: hhmmss(now),
    tenants_online: 2,
    tiles,
    load_curve,
    now_h: now.getHours(),
    alerts,
  };
}
