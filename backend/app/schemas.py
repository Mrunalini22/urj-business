from pydantic import BaseModel, ConfigDict


class _ORM(BaseModel):
    model_config = ConfigDict(from_attributes=True)


class Metric(_ORM):
    value: str
    label: str


class TextItem(_ORM):
    text: str


class ModuleSummary(_ORM):
    num: str
    slug: str
    title: str
    icon: str
    category: str
    driver: str
    short: str
    roi_head: str
    metrics: list[Metric]


class ModuleDetail(ModuleSummary):
    proof: str
    what: str
    where: str
    outcome: str
    how: str
    features: list[TextItem]
    benefits: list[TextItem]


class Kpi(_ORM):
    icon: str
    big: str
    unit: str
    title: str
    text: str


class ArchLayer(_ORM):
    num: str
    name: str
    detail: str


class RoiLever(_ORM):
    value: str
    unit: str
    label: str
    track_pct: int


class RoiFlow(_ORM):
    icon: str
    title: str
    subtitle: str
    direction: str


class HeroStat(_ORM):
    num: str
    unit: str
    label: str


class ComparisonRow(_ORM):
    capability: str
    legacy: str
    urj: str


class MediaAsset(_ORM):
    key: str
    kind: str
    title: str
    subtitle: str
    src: str
    poster: str


class Category(BaseModel):
    key: str
    label: str


class Overview(BaseModel):
    """Everything the landing page needs, in one call."""
    stats: list[HeroStat]
    kpis: list[Kpi]
    architecture: list[ArchLayer]
    modules: list[ModuleSummary]
    categories: list[Category]
    roi_levers: list[RoiLever]
    roi_flows: list[RoiFlow]
    comparison: list[ComparisonRow]
    media: list[MediaAsset]
