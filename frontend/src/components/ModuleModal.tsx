import { useEffect, useState } from "react";
import { api } from "../api/client";
import type { ModuleDetail } from "../types";
import { Icon } from "./Icon";
import { ModuleViz } from "./ModuleViz";

export function ModuleModal({ slug, onClose }: { slug: string | null; onClose: () => void }) {
  const [mod, setMod] = useState<ModuleDetail | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    setMod(null);
    api.module(slug).then(setMod).catch(() => setMod(null)).finally(() => setLoading(false));
  }, [slug]);

  useEffect(() => {
    document.body.style.overflow = slug ? "hidden" : "";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [slug, onClose]);

  return (
    <div className={`modal-scrim ${slug ? "open" : ""}`} onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal" role="dialog" aria-modal="true">
        <button className="modal-close" aria-label="Close" onClick={onClose}><Icon name="x" /></button>
        {loading && <div style={{ padding: 80, textAlign: "center", color: "var(--ink-500)" }}>Loading…</div>}
        {mod && (
          <>
            <div className="modal-hero">
              <div className="hero-grid" />
              <div className="modal-hero-in">
                <div className="modal-num">MODULE {mod.num}</div>
                <h2>{mod.title}</h2>
                <span className="driver"><Icon name="bolt" /> {mod.driver}</span>
              </div>
            </div>
            <div className="modal-body">
              <p className="desc">{mod.short}</p>

              <ModuleViz mod={mod} />

              <div className="wwoh">
                <div className="wwoh-item"><span className="wl">What it is</span><p>{mod.what}</p></div>
                <div className="wwoh-item"><span className="wl">Where we use it</span><p>{mod.where}</p></div>
                <div className="wwoh-item accent"><span className="wl">Outcome we get</span><p>{mod.outcome}</p></div>
                <div className="wwoh-item"><span className="wl">How we achieve it</span><p>{mod.how}</p></div>
              </div>

              <div className="roi-box">
                <div className="roi-box-head">
                  <span className="rb-chip"><Icon name="trend" width={16} /></span>
                  Business return
                </div>
                <div className="roi-metrics">
                  {mod.metrics.map((m, i) => (
                    <div className="roi-metric" key={i}>
                      <div className="rn">{m.value}</div>
                      <div className="rl">{m.label}</div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="mb-grid" style={{ marginTop: 34 }}>
                <div className="mb-col">
                  <h4>Key capabilities</h4>
                  <ul>{mod.features.map((f, i) => <li key={i}><Icon name="check" /><span>{f.text}</span></li>)}</ul>
                </div>
                <div className="mb-col">
                  <h4>Benefit to the DISCOM</h4>
                  <ul>{mod.benefits.map((b, i) => <li key={i}><Icon name="check" /><span>{b.text}</span></li>)}</ul>
                </div>
              </div>
              <div className="proof"><b>Proof point · </b>{mod.proof}</div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
