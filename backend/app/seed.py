"""Create tables and load portal content. Idempotent — wipes & reloads content tables.

Run from the backend/ directory:  python -m app.seed
"""

from .database import Base, SessionLocal, engine
from . import models, seed_data as d


def run() -> None:
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    try:
        # clear existing content (child rows cascade)
        for m in db.query(models.Module).all():
            db.delete(m)
        for tbl in (models.Kpi, models.ArchLayer, models.RoiLever,
                    models.RoiFlow, models.HeroStat, models.ComparisonRow,
                    models.MediaAsset):
            db.query(tbl).delete()
        db.commit()

        for i, m in enumerate(d.MODULES):
            w = d.WWOH.get(m["slug"], {})
            module = models.Module(
                num=m["num"], slug=m["slug"], title=m["title"], icon=m["icon"],
                category=m["category"], driver=m["driver"], short=m["short"],
                roi_head=m["roi_head"], proof=m["proof"], sort=i,
                what=w.get("what", ""), where=w.get("where", ""),
                outcome=w.get("outcome", ""), how=w.get("how", ""),
                features=[models.ModuleFeature(text=t, sort=j) for j, t in enumerate(m["features"])],
                benefits=[models.ModuleBenefit(text=t, sort=j) for j, t in enumerate(m["benefits"])],
                metrics=[models.ModuleMetric(value=v, label=l, sort=j) for j, (v, l) in enumerate(m["metrics"])],
            )
            db.add(module)

        db.add_all([models.HeroStat(num=n, unit=u, label=l, sort=i)
                    for i, (n, u, l) in enumerate(d.HERO_STATS)])
        db.add_all([models.Kpi(icon=ic, big=b, unit=u, title=t, text=tx, sort=i)
                    for i, (ic, b, u, t, tx) in enumerate(d.KPIS)])
        db.add_all([models.ArchLayer(num=n, name=nm, detail=dt, sort=i)
                    for i, (n, nm, dt) in enumerate(d.ARCH_LAYERS)])
        db.add_all([models.RoiLever(value=v, unit=u, label=l, track_pct=p, sort=i)
                    for i, (v, u, l, p) in enumerate(d.ROI_LEVERS)])
        db.add_all([models.RoiFlow(icon=ic, title=t, subtitle=s, direction=dr, sort=i)
                    for i, (ic, t, s, dr) in enumerate(d.ROI_FLOWS)])
        db.add_all([models.ComparisonRow(capability=c, legacy=lg, urj=u, sort=i)
                    for i, (c, lg, u) in enumerate(d.COMPARISON)])
        db.add_all([models.MediaAsset(sort=i, **m) for i, m in enumerate(d.MEDIA)])
        db.commit()
        print(f"[OK] Seeded {len(d.MODULES)} modules, {len(d.KPIS)} KPIs, "
              f"{len(d.ARCH_LAYERS)} architecture layers, {len(d.ROI_LEVERS)} ROI levers.")
    finally:
        db.close()


if __name__ == "__main__":
    run()
