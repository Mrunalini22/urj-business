"""Live operations feed — realistic, continuously-changing DISCOM telemetry.

Values are computed from the current time (a daily demand curve + smooth drift +
small jitter), so every poll returns fresh, plausible numbers. This models the
live smart-meter / feeder telemetry the platform streams in production.
"""

import math
import random
from datetime import datetime, timedelta

from fastapi import APIRouter

router = APIRouter(prefix="/api", tags=["live"])

# Typical distribution-utility daily demand shape (0-23h), normalised 0..1.
DAY_SHAPE = [
    0.62, 0.58, 0.55, 0.54, 0.56, 0.62, 0.70, 0.78, 0.85, 0.90, 0.93, 0.95,
    0.94, 0.92, 0.90, 0.89, 0.91, 0.95, 1.00, 0.99, 0.95, 0.86, 0.75, 0.68,
]
PEAK_MW = 2680
FEEDERS_TOTAL = 1300
METERS_TOTAL = 512_400

ALERT_POOL = [
    ("warn", "Tamper flag raised · DT-{d} · {c}"),
    ("warn", "Overload warning · Feeder {f} · {c}"),
    ("info", "Voltage excursion cleared · DT-{d}"),
    ("ok", "Work order {w} acknowledged by field crew"),
    ("ok", "Load threshold cleared · Feeder {f}"),
    ("warn", "Nil-consumption anomaly · consumer {m}"),
    ("info", "New reading batch ingested · {n} meters"),
    ("ok", "Restoration confirmed · {c} · {w}"),
    ("warn", "Low power factor flagged · HT connection {m}"),
    ("info", "Collection posted · ${r}k · {c}"),
]
CIRCLES = ["Guwahati-I", "Barpeta", "Nalbari", "Rangia", "Mangaldoi"]


def _mult(now: datetime) -> float:
    h, frac = now.hour, now.minute / 60 + now.second / 3600
    cur, nxt = DAY_SHAPE[h], DAY_SHAPE[(h + 1) % 24]
    return cur + (nxt - cur) * frac


def _rng(now: datetime) -> random.Random:
    # stable within a ~2s window so rapid polls don't jump wildly
    return random.Random(int(now.timestamp() // 2))


def snapshot() -> dict:
    now = datetime.now()
    r = _rng(now)
    mult = _mult(now)
    drift = math.sin(now.timestamp() / 90)  # slow ±1 wave

    load = PEAK_MW * (mult + r.uniform(-0.010, 0.010))
    load_delta = round(PEAK_MW * (mult - _mult(now - timedelta(minutes=1))) + r.uniform(-4, 4), 1)

    atnc = 12.4 - 0.15 * drift + r.uniform(-0.05, 0.05)
    collection = 97.9 + 0.25 * drift + r.uniform(-0.06, 0.06)
    feeders = FEEDERS_TOTAL - r.randint(6, 20)
    meters = METERS_TOTAL - r.randint(180, 1400)
    active_alerts = 4 + int(3 * (mult - 0.6) * 2) + r.randint(0, 2)
    pf = 0.958 + 0.01 * drift + r.uniform(-0.004, 0.004)

    tiles = [
        {"key": "load", "label": "Power delivered now", "value": round(load, 1), "unit": "MW",
         "delta": load_delta, "fmt": "comma1"},
        {"key": "atnc", "label": "AT&C loss · live estimate", "value": round(atnc, 2), "unit": "%",
         "delta": round(-0.15 * drift, 2), "good": "down"},
        {"key": "collection", "label": "Collection efficiency", "value": round(collection, 1), "unit": "%",
         "delta": round(0.25 * drift, 2), "good": "up"},
        {"key": "feeders", "label": "Feeders reporting", "value": feeders, "unit": f"/{FEEDERS_TOTAL}",
         "delta": r.randint(-3, 4), "good": "up"},
        {"key": "meters", "label": "Smart meters online", "value": meters, "unit": "", "fmt": "comma",
         "delta": r.randint(-200, 260), "good": "up"},
        {"key": "pf", "label": "System power factor", "value": round(pf, 3), "unit": "",
         "delta": round(0.01 * drift, 3), "good": "up"},
        {"key": "alerts", "label": "Active alerts", "value": max(1, active_alerts), "unit": "",
         "delta": r.randint(-2, 2), "good": "down"},
        {"key": "crews", "label": "Field crews active", "value": 34 + r.randint(-3, 6), "unit": "",
         "delta": r.randint(-2, 3), "good": "up"},
    ]

    load_curve = [{"h": i, "mw": round(PEAK_MW * DAY_SHAPE[i])} for i in range(24)]
    load_curve[now.hour] = {"h": now.hour, "mw": round(load)}

    alerts = []
    ra = random.Random(int(now.timestamp() // 5))  # new alert set every ~5s
    for i in range(6):
        level, tpl = ra.choice(ALERT_POOL)
        text = tpl.format(
            d=ra.randint(1000, 8999), f=f"{ra.choice('ABG')}{ra.randint(10,49)}",
            c=ra.choice(CIRCLES), w=f"WO-{ra.randint(40000,99999)}",
            m=f"{ra.randint(100000,999999)}", n=f"{ra.randint(2,9)},{ra.randint(100,999)}",
            r=ra.randint(3, 88),
        )
        ts = now - timedelta(seconds=ra.randint(2, 220) + i * 3)
        alerts.append({"level": level, "text": text, "t": ts.strftime("%H:%M:%S")})

    return {
        "ts": now.isoformat(timespec="seconds"),
        "as_of": now.strftime("%H:%M:%S"),
        "tenants_online": 2,
        "tiles": tiles,
        "load_curve": load_curve,
        "now_h": now.hour,
        "alerts": alerts,
    }


@router.get("/live")
def live() -> dict:
    return snapshot()
