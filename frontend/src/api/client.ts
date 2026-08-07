// Hybrid data layer:
//  • If VITE_API_BASE is set at build time → calls the REAL FastAPI backend.
//  • If it's NOT set → runs fully in the browser from baked data (static, no server).
// So the same build deploys either as a full stack OR as a standalone static site.
import type { Overview, ModuleDetail, LiveSnapshot, RoiConfig, RoiResult, RoiInputs, VizData } from "../types";
import overviewData from "../data/overview.json";
import moduleDetails from "../data/moduleDetails.json";
import roiConfigData from "../data/roiConfig.json";
import { computeRoi } from "../data/roiCompute";
import { liveSnapshot } from "../data/live";
import { vizData } from "../data/viz";

const API = import.meta.env.VITE_API_BASE as string | undefined;
const details = moduleDetails as Record<string, ModuleDetail>;

async function get<T>(path: string): Promise<T> {
  const res = await fetch(`${API}/api${path}`);
  if (!res.ok) throw new Error(`${res.status} ${res.statusText} — ${path}`);
  return res.json() as Promise<T>;
}
async function post<T>(path: string, body: unknown): Promise<T> {
  const res = await fetch(`${API}/api${path}`, {
    method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`${res.status} ${res.statusText} — ${path}`);
  return res.json() as Promise<T>;
}

export const api = {
  overview: () => (API ? get<Overview>("/overview") : Promise.resolve(overviewData as unknown as Overview)),
  module: (slug: string) => (API ? get<ModuleDetail>(`/modules/${slug}`) : Promise.resolve(details[slug])),
  live: () => (API ? get<LiveSnapshot>("/live") : Promise.resolve(liveSnapshot())),
  roiConfig: () => (API ? get<RoiConfig>("/roi/config") : Promise.resolve(roiConfigData as unknown as RoiConfig)),
  roiCalc: (inputs: RoiInputs) => (API ? post<RoiResult>("/roi/calculate", inputs) : Promise.resolve(computeRoi(inputs))),
  viz: () => (API ? get<VizData>("/viz") : Promise.resolve(vizData() as VizData)),
  health: () => (API ? get<{ status: string; modules: number }>("/health") : Promise.resolve({ status: "ok", modules: Object.keys(details).length })),
};
