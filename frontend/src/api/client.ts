import type { Overview, ModuleDetail, LiveSnapshot, RoiConfig, RoiResult, RoiInputs, VizData } from "../types";

// In dev, Vite proxies /api to the local backend (see vite.config.ts).
// In production, set VITE_API_BASE to the hosted backend origin
// (e.g. https://urj-backend.onrender.com) at build time.
const BASE = `${import.meta.env.VITE_API_BASE ?? ""}/api`;

async function get<T>(path: string): Promise<T> {
  const res = await fetch(`${BASE}${path}`);
  if (!res.ok) throw new Error(`${res.status} ${res.statusText} — ${path}`);
  return res.json() as Promise<T>;
}

async function post<T>(path: string, body: unknown): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`${res.status} ${res.statusText} — ${path}`);
  return res.json() as Promise<T>;
}

export const api = {
  overview: () => get<Overview>("/overview"),
  module: (slug: string) => get<ModuleDetail>(`/modules/${slug}`),
  live: () => get<LiveSnapshot>("/live"),
  roiConfig: () => get<RoiConfig>("/roi/config"),
  roiCalc: (inputs: RoiInputs) => post<RoiResult>("/roi/calculate", inputs),
  viz: () => get<VizData>("/viz"),
  health: () => get<{ status: string; modules: number }>("/health"),
};
