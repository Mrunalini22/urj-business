from fastapi import APIRouter

from . import roi_engine as e

router = APIRouter(prefix="/api/roi", tags=["roi"])


@router.get("/config")
def config() -> dict:
    """Slider metadata, defaults and sizing presets for the ROI calculator."""
    return {"fields": e.FIELDS, "defaults": e.DEFAULTS.model_dump(), "presets": e.PRESETS}


@router.post("/calculate")
def calculate(inputs: e.RoiInputs) -> dict:
    return e.compute(inputs)
