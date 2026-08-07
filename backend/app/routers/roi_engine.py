"""Interactive ROI engine — computes a realistic utility business case from
adjustable operating assumptions. All monetary figures are in US dollars:
inputs use $/kWh and $M/yr; outputs are in US$ millions ($M).

Model (energy in million units, MU = 1e6 kWh; 1 MU x $/kWh = $M):
  recovered energy       = input x reduction_pp/100
  loss recovery ($M)     = recovered_MU x realization_usd
  billed revenue ($M)    = input x (1 - loss/100) x realization_usd
  collection uplift      = billed_revenue x collection_gain_pp/100
  O&M efficiency saving  = billed_revenue x om_saving_pct/100
Benefits ramp as the rollout matures (Y1 60%, Y2 85%, Y3+ 100%).

Result keys retain a legacy suffix but now hold US$ millions.
"""

from pydantic import BaseModel, Field

# ── input contract (USD) ──────────────────────────────────────────────────────
class RoiInputs(BaseModel):
    energy_input_mu: float = Field(12000, ge=100, le=80000)
    atnc_loss_pct: float = Field(15.5, ge=3, le=40)
    atnc_reduction_pp: float = Field(2.5, ge=0.2, le=8)
    realization_rs_kwh: float = Field(0.09, ge=0.03, le=0.30)   # $/kWh (avg realization)
    collection_gain_pp: float = Field(1.5, ge=0, le=8)
    om_saving_pct: float = Field(0.5, ge=0, le=4)
    attribution_pct: float = Field(20, ge=5, le=100)
    platform_cost_cr: float = Field(1.5, ge=0.1, le=25)          # $M / yr


RAMP = [0.60, 0.85, 1.0, 1.0, 1.0]

DEFAULTS = RoiInputs()

PRESETS = [
    {"key": "small", "label": "Small utility", "note": "~0.8M consumers",
     "inputs": {"energy_input_mu": 3200, "atnc_loss_pct": 18.0, "atnc_reduction_pp": 2.5,
                "realization_rs_kwh": 0.085, "collection_gain_pp": 2.0, "om_saving_pct": 0.6,
                "attribution_pct": 20, "platform_cost_cr": 0.6}},
    {"key": "medium", "label": "Medium utility", "note": "~3.5M consumers",
     "inputs": DEFAULTS.model_dump()},
    {"key": "large", "label": "Large utility", "note": "~8M consumers",
     "inputs": {"energy_input_mu": 32000, "atnc_loss_pct": 14.0, "atnc_reduction_pp": 2.2,
                "realization_rs_kwh": 0.092, "collection_gain_pp": 1.2, "om_saving_pct": 0.4,
                "attribution_pct": 15, "platform_cost_cr": 3.5}},
]

# slider metadata drives the UI
FIELDS = [
    {"key": "energy_input_mu", "label": "Annual energy input", "min": 1000, "max": 60000, "step": 500, "unit": "MU", "fmt": "comma"},
    {"key": "atnc_loss_pct", "label": "Current AT&C loss", "min": 5, "max": 35, "step": 0.5, "unit": "%"},
    {"key": "atnc_reduction_pp", "label": "AT&C loss reduction with URJ", "min": 0.5, "max": 6, "step": 0.1, "unit": "pp"},
    {"key": "realization_rs_kwh", "label": "Average realization", "min": 0.04, "max": 0.20, "step": 0.005, "unit": "$/kWh"},
    {"key": "collection_gain_pp", "label": "Collection-efficiency gain", "min": 0, "max": 5, "step": 0.1, "unit": "pp"},
    {"key": "om_saving_pct", "label": "Operational efficiency saving", "min": 0, "max": 3, "step": 0.1, "unit": "% of revenue"},
    {"key": "attribution_pct", "label": "Share credited to URJ", "min": 5, "max": 60, "step": 5, "unit": "% of opportunity",
     "hint": "Conservative share of the gross opportunity attributable to the platform — the rest depends on metering, enforcement and field execution."},
    {"key": "platform_cost_cr", "label": "URJ platform cost", "min": 0.2, "max": 15, "step": 0.1, "unit": "$M / yr"},
]


def compute(i: RoiInputs) -> dict:
    r = i.realization_rs_kwh  # $/kWh
    billed_rev = i.energy_input_mu * (1 - i.atnc_loss_pct / 100) * r          # $M
    loss_recovery = i.energy_input_mu * (i.atnc_reduction_pp / 100) * r        # $M
    collection_uplift = billed_rev * (i.collection_gain_pp / 100)
    om_saving = billed_rev * (i.om_saving_pct / 100)

    gross = loss_recovery + collection_uplift + om_saving
    share = i.attribution_pct / 100
    attributable = gross * share                       # credited to the platform
    cost = i.platform_cost_cr                           # $M / yr
    net = attributable - cost
    roi_pct = (net / cost * 100) if cost else 0.0
    multiple = (attributable / cost) if cost else 0.0
    payback_months = (cost / (attributable / 12)) if attributable else 0.0

    timeline, cum = [], 0.0
    for yr, ramp in enumerate(RAMP, start=1):
        yb = attributable * ramp
        yn = yb - cost
        cum += yn
        timeline.append({"year": yr, "benefit": round(yb, 1), "cost": round(cost, 1),
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
        "platform_cost_cr": round(cost, 1),
        "net_annual_cr": round(net, 1),
        "roi_pct": round(roi_pct, 0),
        "benefit_multiple": round(multiple, 1),
        "payback_months": round(payback_months, 1),
        "five_year_net_cr": round(cum, 1),
        "timeline": timeline,
    }
