from __future__ import annotations

from sqlalchemy import ForeignKey, Integer, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from .database import Base


class Module(Base):
    __tablename__ = "modules"

    id: Mapped[int] = mapped_column(primary_key=True)
    num: Mapped[str] = mapped_column(String(4), unique=True, index=True)
    slug: Mapped[str] = mapped_column(String(80), unique=True, index=True)
    title: Mapped[str] = mapped_column(String(160))
    icon: Mapped[str] = mapped_column(String(40))
    category: Mapped[str] = mapped_column(String(40), index=True)
    driver: Mapped[str] = mapped_column(String(200))
    short: Mapped[str] = mapped_column(Text)
    roi_head: Mapped[str] = mapped_column(String(120))
    proof: Mapped[str] = mapped_column(Text)
    what: Mapped[str] = mapped_column(Text, default="")
    where: Mapped[str] = mapped_column(Text, default="")
    outcome: Mapped[str] = mapped_column(Text, default="")
    how: Mapped[str] = mapped_column(Text, default="")
    sort: Mapped[int] = mapped_column(Integer, default=0)

    features: Mapped[list[ModuleFeature]] = relationship(
        back_populates="module", cascade="all, delete-orphan", order_by="ModuleFeature.sort"
    )
    benefits: Mapped[list[ModuleBenefit]] = relationship(
        back_populates="module", cascade="all, delete-orphan", order_by="ModuleBenefit.sort"
    )
    metrics: Mapped[list[ModuleMetric]] = relationship(
        back_populates="module", cascade="all, delete-orphan", order_by="ModuleMetric.sort"
    )


class ModuleFeature(Base):
    __tablename__ = "module_features"
    id: Mapped[int] = mapped_column(primary_key=True)
    module_id: Mapped[int] = mapped_column(ForeignKey("modules.id"))
    text: Mapped[str] = mapped_column(Text)
    sort: Mapped[int] = mapped_column(Integer, default=0)
    module: Mapped[Module] = relationship(back_populates="features")


class ModuleBenefit(Base):
    __tablename__ = "module_benefits"
    id: Mapped[int] = mapped_column(primary_key=True)
    module_id: Mapped[int] = mapped_column(ForeignKey("modules.id"))
    text: Mapped[str] = mapped_column(Text)
    sort: Mapped[int] = mapped_column(Integer, default=0)
    module: Mapped[Module] = relationship(back_populates="benefits")


class ModuleMetric(Base):
    """One ROI headline figure for a module (value + label)."""
    __tablename__ = "module_metrics"
    id: Mapped[int] = mapped_column(primary_key=True)
    module_id: Mapped[int] = mapped_column(ForeignKey("modules.id"))
    value: Mapped[str] = mapped_column(String(40))
    label: Mapped[str] = mapped_column(String(160))
    sort: Mapped[int] = mapped_column(Integer, default=0)
    module: Mapped[Module] = relationship(back_populates="metrics")


class Kpi(Base):
    __tablename__ = "kpis"
    id: Mapped[int] = mapped_column(primary_key=True)
    icon: Mapped[str] = mapped_column(String(40))
    big: Mapped[str] = mapped_column(String(20))
    unit: Mapped[str] = mapped_column(String(12), default="")
    title: Mapped[str] = mapped_column(String(120))
    text: Mapped[str] = mapped_column(Text)
    sort: Mapped[int] = mapped_column(Integer, default=0)


class ArchLayer(Base):
    __tablename__ = "arch_layers"
    id: Mapped[int] = mapped_column(primary_key=True)
    num: Mapped[str] = mapped_column(String(4))
    name: Mapped[str] = mapped_column(String(60))
    detail: Mapped[str] = mapped_column(Text)
    sort: Mapped[int] = mapped_column(Integer, default=0)


class RoiLever(Base):
    """A modelled value gauge on the ROI dashboard."""
    __tablename__ = "roi_levers"
    id: Mapped[int] = mapped_column(primary_key=True)
    value: Mapped[str] = mapped_column(String(20))
    unit: Mapped[str] = mapped_column(String(12), default="")
    label: Mapped[str] = mapped_column(String(120))
    track_pct: Mapped[int] = mapped_column(Integer, default=0)
    sort: Mapped[int] = mapped_column(Integer, default=0)


class RoiFlow(Base):
    """A cost-out / revenue-protected line on the ROI dashboard."""
    __tablename__ = "roi_flows"
    id: Mapped[int] = mapped_column(primary_key=True)
    icon: Mapped[str] = mapped_column(String(40))
    title: Mapped[str] = mapped_column(String(120))
    subtitle: Mapped[str] = mapped_column(String(200))
    direction: Mapped[str] = mapped_column(String(4))  # 'up' | 'down'
    sort: Mapped[int] = mapped_column(Integer, default=0)


class HeroStat(Base):
    __tablename__ = "hero_stats"
    id: Mapped[int] = mapped_column(primary_key=True)
    num: Mapped[str] = mapped_column(String(12))
    unit: Mapped[str] = mapped_column(String(8), default="")
    label: Mapped[str] = mapped_column(String(160))
    sort: Mapped[int] = mapped_column(Integer, default=0)


class ComparisonRow(Base):
    __tablename__ = "comparison_rows"
    id: Mapped[int] = mapped_column(primary_key=True)
    capability: Mapped[str] = mapped_column(String(160))
    legacy: Mapped[str] = mapped_column(String(200))
    urj: Mapped[str] = mapped_column(String(200))
    sort: Mapped[int] = mapped_column(Integer, default=0)


class MediaAsset(Base):
    """A video slot on the site. Add a video by setting `src` (a file under
    frontend/public/media, an .mp4 URL, or a YouTube/Vimeo id) — no code change."""
    __tablename__ = "media_assets"
    id: Mapped[int] = mapped_column(primary_key=True)
    key: Mapped[str] = mapped_column(String(60), unique=True, index=True)
    kind: Mapped[str] = mapped_column(String(16), default="file")  # file | mp4 | youtube | vimeo
    title: Mapped[str] = mapped_column(String(160), default="")
    subtitle: Mapped[str] = mapped_column(String(240), default="")
    src: Mapped[str] = mapped_column(String(400), default="")   # empty = placeholder shown
    poster: Mapped[str] = mapped_column(String(400), default="")
    sort: Mapped[int] = mapped_column(Integer, default=0)
