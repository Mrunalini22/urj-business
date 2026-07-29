"""Visualization datasets — realistic, lightly time-varying data powering the
animated charts (loss heatmap, energy balance, load forecast, consumer-risk
clusters, reliability trend, and live network topology)."""

import math
import random
from datetime import datetime

from fastapi import APIRouter

router = APIRouter(prefix="/api/viz", tags=["viz"])

ZONES = ["Guwahati-I", "Guwahati-II", "Barpeta", "Nalbari", "Rangia", "Mangaldoi", "Tezpur", "Dibrugarh"]
MONTHS = ["Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec", "Jan", "Feb", "Mar"]
DAY_SHAPE = [0.62, 0.58, 0.55, 0.54, 0.56, 0.62, 0.70, 0.78, 0.85, 0.90, 0.93, 0.95,
             0.94, 0.92, 0.90, 0.89, 0.91, 0.95, 1.00, 0.99, 0.95, 0.86, 0.75, 0.68]


def _energy_balance() -> dict:
    now = datetime.now()
    drift = math.sin(now.timestamp() / 120)
    inp = 1000.0
    tech = 7.4 + 0.2 * drift          # technical loss %
    comm = 5.2 - 0.15 * drift         # commercial loss %
    coll_eff = 97.9 + 0.2 * drift     # collection efficiency %
    billed = inp * (1 - (tech + comm) / 100)
    collected = billed * coll_eff / 100
    atnc = (1 - collected / inp) * 100
    return {
        "input_mu": round(inp, 1),
        "technical_loss_pct": round(tech, 2),
        "commercial_loss_pct": round(comm, 2),
        "billed_mu": round(billed, 1),
        "collected_mu": round(collected, 1),
        "collection_eff_pct": round(coll_eff, 1),
        "atnc_pct": round(atnc, 2),
    }


def _loss_heatmap() -> dict:
    r = random.Random(datetime.now().hour)  # stable within the hour
    matrix = []
    for z, zone in enumerate(ZONES):
        base = 10 + z * 1.6                 # some zones structurally lossier
        row = []
        for m in range(12):
            seasonal = 2.2 * math.sin((m / 12) * 2 * math.pi + 1)   # monsoon/theft season
            improve = -m * 0.25                                     # trending down over the year
            val = base + seasonal + improve + r.uniform(-0.8, 0.8)
            row.append(round(max(4.0, val), 1))
        matrix.append(row)
    return {"zones": ZONES, "months": MONTHS, "matrix": matrix}


def _forecast() -> dict:
    now = datetime.now()
    peak = 2680
    pts, split = [], 24
    for i in range(48):
        h = (now.hour + i) % 24
        base = peak * DAY_SHAPE[h]
        if i < split:
            pts.append({"i": i, "actual": round(base + 24 * math.sin(i)), "forecast": None, "lo": None, "hi": None})
        else:
            f = base
            band = 40 + (i - split) * 6           # widening uncertainty
            pts.append({"i": i, "actual": None, "forecast": round(f),
                        "lo": round(f - band), "hi": round(f + band)})
    # continuity point
    pts[split]["actual"] = pts[split - 1]["actual"]
    return {"points": pts, "split": split, "unit": "MW"}


def _risk_scatter() -> dict:
    r = random.Random(7)
    clusters = [
        {"cx": 0.30, "cy": 0.35, "label": "Healthy", "risk": "low"},
        {"cx": 0.62, "cy": 0.55, "label": "Watch", "risk": "med"},
        {"cx": 0.78, "cy": 0.80, "label": "High risk", "risk": "high"},
        {"cx": 0.45, "cy": 0.68, "label": "Reactive-power", "risk": "med"},
    ]
    pts = []
    for c, cl in enumerate(clusters):
        n = [46, 34, 18, 24][c]
        for _ in range(n):
            x = min(0.98, max(0.02, r.gauss(cl["cx"], 0.07)))
            y = min(0.98, max(0.02, r.gauss(cl["cy"], 0.07)))
            pts.append({"x": round(x, 3), "y": round(y, 3), "cluster": c, "risk": cl["risk"]})
    return {"points": pts, "clusters": clusters,
            "x_label": "Avg. load (normalised)", "y_label": "Composite risk score"}


def _reliability() -> dict:
    r = random.Random(3)
    saidi, saifi = [], []
    s1, s2 = 320.0, 9.2
    for m in range(12):
        s1 *= 0.955 + r.uniform(-0.01, 0.01)      # improving SAIDI (minutes)
        s2 *= 0.96 + r.uniform(-0.008, 0.008)     # improving SAIFI (count)
        saidi.append(round(s1, 1))
        saifi.append(round(s2, 2))
    return {"months": MONTHS, "saidi": saidi, "saifi": saifi}


@router.get("")
def viz() -> dict:
    return {
        "energy_balance": _energy_balance(),
        "loss_heatmap": _loss_heatmap(),
        "forecast": _forecast(),
        "risk_scatter": _risk_scatter(),
        "reliability": _reliability(),
    }
