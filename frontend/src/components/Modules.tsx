import { useState } from "react";
import type { Category, ModuleSummary } from "../types";
import { Icon } from "./Icon";
import { ModuleModal } from "./ModuleModal";

// module slug → realistic banner image (local, self-contained)
export const MODULE_IMG: Record<string, string> = {
  "executive-command-center": "/media/img/mod-exec.jpg",
  "network-ops-sld": "/media/img/mod-network.jpg",
  "asset-maintenance-eam": "/media/img/mod-asset.jpg",
  "revenue-assurance": "/media/img/mod-revenue.jpg",
  "discom-ai-insights": "/media/img/mod-ai.jpg",
  "predictive-roi-engine": "/media/img/mod-roi.jpg",
  "field-force-mobile": "/media/img/mod-field.jpg",
  "data-ingestion-hub": "/media/img/mod-ingest.jpg",
  "platform-security-governance": "/media/img/mod-security.jpg",
  "licensing-compliance": "/media/img/mod-license.jpg",
  "conversational-ai": "/media/img/mod-ai2.jpg",
};

export function ModuleCard({ m, onOpen, delay }: { m: ModuleSummary; onOpen: (s: string) => void; delay: number }) {
  const img = MODULE_IMG[m.slug];
  return (
    <article className={`mod-card reveal d${delay}`} onClick={() => onOpen(m.slug)}>
      <div className="mod-banner">
        {img && <img src={img} alt="" onError={(e) => (e.currentTarget.style.display = "none")} />}
        <span className="mod-banner-grad" />
        <span className="mod-num">MODULE {m.num}</span>
        <div className="mod-ic"><Icon name={m.icon} /></div>
      </div>
      <div className="mod-content">
        <h3>{m.title}</h3>
        <div className="mod-driver">{m.driver}</div>
        <p>{m.short}</p>
        <div className="mod-foot">
          <span className="mod-roi"><b>{m.roi_head}</b></span>
          <span className="mod-more">Explore <Icon name="arrow" /></span>
        </div>
      </div>
    </article>
  );
}

export function Modules({ modules, categories }: { modules: ModuleSummary[]; categories: Category[] }) {
  const [filter, setFilter] = useState("all");
  const [open, setOpen] = useState<string | null>(null);
  const shown = filter === "all" ? modules : modules.filter((m) => m.category === filter);
  const filters: Category[] = [{ key: "all", label: "All modules" }, ...categories];

  return (
    <>
      <div className="mod-filters" style={{ marginBottom: 38 }}>
        {filters.map((f) => (
          <button key={f.key} className={`filter ${filter === f.key ? "active" : ""}`} onClick={() => setFilter(f.key)}>
            {f.label}
          </button>
        ))}
      </div>
      <div className="mod-grid">
        {shown.map((m, i) => (
          <ModuleCard key={m.slug} m={m} onOpen={setOpen} delay={(i % 3) + 1} />
        ))}
      </div>
      <ModuleModal slug={open} onClose={() => setOpen(null)} />
    </>
  );
}
