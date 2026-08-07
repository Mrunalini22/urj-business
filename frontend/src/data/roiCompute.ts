import type { RoiInputs, RoiResult } from "../types";

// Ported from backend/app/routers/roi_engine.py — runs entirely in the browser.
// Monetary values are in US$ millions.
const RAMP = [0.6, 0.85, 1.0, 1.0, 1.0];
const r1 = (x: number) => Math.round(x * 10) / 10;

export function computeRoi(i: RoiInputs): RoiResult {
  const r = i.realization_rs_kwh; // $/kWh
  const billed = i.energy_input_mu * (1 - i.atnc_loss_pct / 100) * r;
  const loss = i.energy_input_mu * (i.atnc_reduction_pp / 100) * r;
  const collection = billed * (i.collection_gain_pp / 100);
  const om = billed * (i.om_saving_pct / 100);

  const gross = loss + collection + om;
  const share = i.attribution_pct / 100;
  const attributable = gross * share;
  const cost = i.platform_cost_cr;
  const net = attributable - cost;
  const roiPct = cost ? (net / cost) * 100 : 0;
  const multiple = cost ? attributable / cost : 0;
  const payback = attributable ? cost / (attributable / 12) : 0;

  let cum = 0;
  const timeline = RAMP.map((ramp, idx) => {
    const yb = attributable * ramp;
    const yn = yb - cost;
    cum += yn;
    return { year: idx + 1, benefit: r1(yb), cost: r1(cost), net: r1(yn), cumulative: r1(cum) };
  });

  return {
    inputs: i,
    billed_revenue_cr: r1(billed),
    breakdown: [
      { key: "loss", label: "AT&C loss recovery", value: r1(loss), hint: "Energy now billed & collected after loss reduction" },
      { key: "collection", label: "Collection-efficiency uplift", value: r1(collection), hint: "Higher realisation on already-billed revenue" },
      { key: "om", label: "Operational efficiency saving", value: r1(om), hint: "Manual effort, dispatch & maintenance efficiency" },
    ],
    gross_opportunity_cr: r1(gross),
    attribution_pct: Math.round(i.attribution_pct),
    attributable_benefit_cr: r1(attributable),
    platform_cost_cr: r1(cost),
    net_annual_cr: r1(net),
    roi_pct: Math.round(roiPct),
    benefit_multiple: r1(multiple),
    payback_months: r1(payback),
    five_year_net_cr: r1(cum),
    timeline,
  };
}
