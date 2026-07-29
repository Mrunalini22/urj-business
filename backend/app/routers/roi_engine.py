"""Interactive ROI engine — computes a realistic DISCOM business case from
adjustable operating assumptions. All figures are in Indian Rupee crore (₹ Cr).

Model (energy in million units, MU = 1e6 kWh; ₹ Cr = 1e7 ₹):
  recovered energy      = input × reduction_pp/100
  loss recovery (₹ Cr)  = recovered_MU × realization × 0.1
  billed revenue (₹ Cr) = input × (1 − loss/100) × realization × 0.1
  collection uplift     = billed_revenue × collection_gain_pp/100
  O&M efficiency saving = billed_revenue × om_saving_pct/100
Benefits ramp as the rollout matures (Y1 60%, Y2 85%, Y3+ 100%).
"""

from pydantic import BaseModel, Field

# ── input contract ────────────────────────────────────────────────────────────
class RoiInputs(BaseModel):
    energy_input_mu: float = Field(12000, ge=100, le=80000)
    atnc_loss_pct: float = Field(15.5, ge=3, le=40)
    atnc_reduction_pp: float = Field(2.5, ge=0.2, le=8)
    realization_rs_kwh: float = Field(6.5, ge=2, le=15)
    collection_gain_pp: float = Field(1.5, ge=0, le=8)
    om_saving_pct: float = Field(0.5, ge=0, le=4)
    attribution_pct: float = Field(20, ge=5, le=100)
    platform_cost_cr: float = Field(12, ge=0.5, le=120)


RAMP = [0.60, 0.85, 1.0, 1.0, 1.0]

DEFAULTS = RoiInputs()

PRESETS = [
    {"key": "small", "label": "Small utility", "note": "~0.8M consumers",
     "inputs": {"energy_input_mu": 3200, "atnc_loss_pct": 18.0, "atnc_reduction_pp": 2.5,
                "realization_rs_kwh": 6.2, "collection_gain_pp": 2.0, "om_saving_pct": 0.6,
                "attribution_pct": 20, "platform_cost_cr": 4}},
    {"key": "medium", "label": "Medium utility", "note": "~3.5M consumers",
     "inputs": DEFAULTS.model_dump()},
    {"key": "large", "label": "Large utility", "note": "~8M consumers",
     "inputs": {"energy_input_mu": 32000, "atnc_loss_pct": 14.0, "atnc_reduction_pp": 2.2,
                "realization_rs_kwh": 6.8, "collection_gain_pp": 1.2, "om_saving_pct": 0.4,
                "attribution_pct": 15, "platform_cost_cr": 28}},
]

# slider metadata drives the UI
FIELDS = [
    {"key": "energy_input_mu", "label": "Annual energy input", "min": 1000, "max": 60000, "step": 500, "unit": "MU", "fmt": "comma"},
    {"key": "atnc_loss_pct", "label": "Current AT&C loss", "min": 5, "max": 35, "step": 0.5, "unit": "%"},
    {"key": "atnc_reduction_pp", "label": "AT&C loss reduction with URJ", "min": 0.5, "max": 6, "step": 0.1, "unit": "pp"},
    {"key": "realization_rs_kwh", "label": "Average realization", "min": 3, "max": 12, "step": 0.1, "unit": "₹/kWh"},
    {"key": "collection_gain_pp", "label": "Collection-efficiency gain", "min": 0, "max": 5, "step": 0.1, "unit": "pp"},
    {"key": "om_saving_pct", "label": "Operational efficiency saving", "min": 0, "max": 3, "step": 0.1, "unit": "% of revenue"},
    {"key": "attribution_pct", "label": "Share credited to URJ", "min": 5, "max": 60, "step": 5, "unit": "% of opportunity",
     "hint": "Conservative share of the gross opportunity attributable to the platform — the rest depends on metering, enforcement and field execution."},
    {"key": "platform_cost_cr", "label": "URJ platform cost", "min": 1, "max": 60, "step": 1, "unit": "₹ Cr / yr"},
]


def compute(i: RoiInputs) -> dict:
    billed_rev = i.energy_input_mu * (1 - i.atnc_loss_pct / 100) * i.realization_rs_kwh * 0.1
    loss_recovery = i.energy_input_mu * (i.atnc_reduction_pp / 100) * i.realization_rs_kwh * 0.1
    collection_uplift = billed_rev * (i.collection_gain_pp / 100)
    om_saving = billed_rev * (i.om_saving_pct / 100)

    gross = loss_recovery + collection_uplift + om_saving
    share = i.attribution_pct / 100
    attributable = gross * share                       # credited to the platform
    net = attributable - i.platform_cost_cr
    roi_pct = (net / i.platform_cost_cr * 100) if i.platform_cost_cr else 0.0
    multiple = (attributable / i.platform_cost_cr) if i.platform_cost_cr else 0.0
    payback_months = (i.platform_cost_cr / (attributable / 12)) if attributable else 0.0

    timeline, cum = [], 0.0
    for yr, r in enumerate(RAMP, start=1):
        yb = attributable * r
        yn = yb - i.platform_cost_cr
        cum += yn
        timeline.append({"year": yr, "benefit": round(yb, 1), "cost": round(i.platform_cost_cr, 1),
                         "net": round(yn, 1), "cumulative": round(cum, 1)})

    return {
        "inputs": i.model_dump(),
        "billed_revenue_cr": round(billed_rev, 1),
        "breakdown": [
            {"key": "loss", "label": "AT&C loss recovery", "value": round(loss_recovery, 1),
             "hint": "Energy now billed & collected after loss reduction"},
            {"key": "collection", "label": "Collection-efficiency uplift", "value": round(collection_uplift, 1),
             "hint": "Higher realisation on already-billed revenue"},
            {"key": "om", "label": "Operational efficiency saving", "value": round(om_saving, 1),
             "hint": "Manual effort, dispatch & maintenance efficiency"},
        ],
        "gross_opportunity_cr": round(gross, 1),
        "attribution_pct": round(i.attribution_pct, 0),
        "attributable_benefit_cr": round(attributable, 1),
        "platform_cost_cr": round(i.platform_cost_cr, 1),
        "net_annual_cr": round(net, 1),
        "roi_pct": round(roi_pct, 0),
        "benefit_multiple": round(multiple, 1),
        "payback_months": round(payback_months, 1),
        "five_year_net_cr": round(cum, 1),
        "timeline": timeline,
    }
