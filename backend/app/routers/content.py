from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.orm import Session

from .. import models, schemas
from ..database import get_db
from ..seed_data import CATEGORY_LABELS

router = APIRouter(prefix="/api", tags=["content"])


def _categories(db: Session) -> list[schemas.Category]:
    used = {row[0] for row in db.execute(select(models.Module.category)).all()}
    ordered = [k for k in CATEGORY_LABELS if k in used]
    return [schemas.Category(key=k, label=CATEGORY_LABELS[k]) for k in ordered]


@router.get("/health")
def health(db: Session = Depends(get_db)) -> dict:
    return {"status": "ok", "modules": db.query(models.Module).count()}


@router.get("/modules", response_model=list[schemas.ModuleSummary])
def list_modules(category: str | None = None, db: Session = Depends(get_db)):
    q = select(models.Module).order_by(models.Module.sort)
    if category and category != "all":
        q = q.where(models.Module.category == category)
    return db.scalars(q).all()


@router.get("/modules/{slug}", response_model=schemas.ModuleDetail)
def get_module(slug: str, db: Session = Depends(get_db)):
    module = db.scalar(select(models.Module).where(models.Module.slug == slug))
    if not module:
        raise HTTPException(status_code=404, detail="Module not found")
    return module


@router.get("/categories", response_model=list[schemas.Category])
def categories(db: Session = Depends(get_db)):
    return _categories(db)


@router.get("/kpis", response_model=list[schemas.Kpi])
def kpis(db: Session = Depends(get_db)):
    return db.scalars(select(models.Kpi).order_by(models.Kpi.sort)).all()


@router.get("/architecture", response_model=list[schemas.ArchLayer])
def architecture(db: Session = Depends(get_db)):
    return db.scalars(select(models.ArchLayer).order_by(models.ArchLayer.sort)).all()


@router.get("/stats", response_model=list[schemas.HeroStat])
def stats(db: Session = Depends(get_db)):
    return db.scalars(select(models.HeroStat).order_by(models.HeroStat.sort)).all()


@router.get("/comparison", response_model=list[schemas.ComparisonRow])
def comparison(db: Session = Depends(get_db)):
    return db.scalars(select(models.ComparisonRow).order_by(models.ComparisonRow.sort)).all()


@router.get("/media", response_model=list[schemas.MediaAsset])
def media(db: Session = Depends(get_db)):
    return db.scalars(select(models.MediaAsset).order_by(models.MediaAsset.sort)).all()


@router.get("/roi", response_model=dict)
def roi(db: Session = Depends(get_db)):
    levers = db.scalars(select(models.RoiLever).order_by(models.RoiLever.sort)).all()
    flows = db.scalars(select(models.RoiFlow).order_by(models.RoiFlow.sort)).all()
    return {
        "levers": [schemas.RoiLever.model_validate(x).model_dump() for x in levers],
        "flows": [schemas.RoiFlow.model_validate(x).model_dump() for x in flows],
    }


@router.get("/overview", response_model=schemas.Overview)
def overview(db: Session = Depends(get_db)):
    """One aggregate call powering the entire landing page."""
    return schemas.Overview(
        stats=db.scalars(select(models.HeroStat).order_by(models.HeroStat.sort)).all(),
        kpis=db.scalars(select(models.Kpi).order_by(models.Kpi.sort)).all(),
        architecture=db.scalars(select(models.ArchLayer).order_by(models.ArchLayer.sort)).all(),
        modules=db.scalars(select(models.Module).order_by(models.Module.sort)).all(),
        categories=_categories(db),
        roi_levers=db.scalars(select(models.RoiLever).order_by(models.RoiLever.sort)).all(),
        roi_flows=db.scalars(select(models.RoiFlow).order_by(models.RoiFlow.sort)).all(),
        comparison=db.scalars(select(models.ComparisonRow).order_by(models.ComparisonRow.sort)).all(),
        media=db.scalars(select(models.MediaAsset).order_by(models.MediaAsset.sort)).all(),
    )
