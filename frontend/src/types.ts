export interface Metric { value: string; label: string }
export interface TextItem { text: string }

export interface ModuleSummary {
  num: string;
  slug: string;
  title: string;
  icon: string;
  category: string;
  driver: string;
  short: string;
  roi_head: string;
  metrics: Metric[];
}

export interface ModuleDetail extends ModuleSummary {
  proof: string;
  what: string;
  where: string;
  outcome: string;
  how: string;
  features: TextItem[];
  benefits: TextItem[];
}

export interface VizData {
  energy_balance: {
    input_mu: number; technical_loss_pct: number; commercial_loss_pct: number;
    billed_mu: number; collected_mu: number; collection_eff_pct: number; atnc_pct: number;
  };
  loss_heatmap: { zones: string[]; months: string[]; matrix: number[][] };
  forecast: { points: { i: number; actual: number | null; forecast: number | null; lo: number | null; hi: number | null }[]; split: number; unit: string };
  risk_scatter: {
    points: { x: number; y: number; cluster: number; risk: string }[];
    clusters: { cx: number; cy: number; label: string; risk: string }[];
    x_label: string; y_label: string;
  };
  reliability: { months: string[]; saidi: number[]; saifi: number[] };
}

export interface Kpi { icon: string; big: string; unit: string; title: string; text: string }
export interface ArchLayer { num: string; name: string; detail: string }
export interface RoiLever { value: string; unit: string; label: string; track_pct: number }
export interface RoiFlow { icon: string; title: string; subtitle: string; direction: "up" | "down" }
export interface HeroStat { num: string; unit: string; label: string }
export interface ComparisonRow { capability: string; legacy: string; urj: string }
export interface Category { key: string; label: string }
export interface MediaAsset {
  key: string;
  kind: "file" | "mp4" | "youtube" | "vimeo" | "image";
  title: string;
  subtitle: string;
  src: string;
  poster: string;
}

export interface RoiInputs {
  energy_input_mu: number;
  atnc_loss_pct: number;
  atnc_reduction_pp: number;
  realization_rs_kwh: number;
  collection_gain_pp: number;
  om_saving_pct: number;
  attribution_pct: number;
  platform_cost_cr: number;
}
export interface RoiField {
  key: keyof RoiInputs;
  label: string;
  min: number;
  max: number;
  step: number;
  unit: string;
  fmt?: "comma";
  hint?: string;
}
export interface RoiConfig {
  fields: RoiField[];
  defaults: RoiInputs;
  presets: { key: string; label: string; note: string; inputs: RoiInputs }[];
}
export interface RoiResult {
  inputs: RoiInputs;
  billed_revenue_cr: number;
  breakdown: { key: string; label: string; value: number; hint: string }[];
  gross_opportunity_cr: number;
  attribution_pct: number;
  attributable_benefit_cr: number;
  platform_cost_cr: number;
  net_annual_cr: number;
  roi_pct: number;
  benefit_multiple: number;
  payback_months: number;
  five_year_net_cr: number;
  timeline: { year: number; benefit: number; cost: number; net: number; cumulative: number }[];
}

export interface LiveTile {
  key: string;
  label: string;
  value: number;
  unit: string;
  delta?: number;
  fmt?: "comma" | "comma1";
  good?: "up" | "down";
}
export interface LiveAlert { level: "warn" | "ok" | "info"; text: string; t: string }
export interface LiveSnapshot {
  ts: string;
  as_of: string;
  tenants_online: number;
  tiles: LiveTile[];
  load_curve: { h: number; mw: number }[];
  now_h: number;
  alerts: LiveAlert[];
}

export interface Overview {
  stats: HeroStat[];
  kpis: Kpi[];
  architecture: ArchLayer[];
  modules: ModuleSummary[];
  categories: Category[];
  roi_levers: RoiLever[];
  roi_flows: RoiFlow[];
  comparison: ComparisonRow[];
  media: MediaAsset[];
}
