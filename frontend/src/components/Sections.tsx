import type { ArchLayer, ComparisonRow, Kpi, RoiLever, RoiFlow } from "../types";
import { Icon } from "./Icon";
import { RoiCalculator } from "./RoiCalculator";

export function Kpis({ kpis }: { kpis: Kpi[] }) {
  return (
    <div className="kpi-grid">
      {kpis.map((k, i) => (
        <div className={`kpi reveal d${i}`} key={i}>
          <div className="ic"><Icon name={k.icon} /></div>
          <div className="big">{k.big}{k.unit && <span className="u">{k.unit}</span>}</div>
          <h4>{k.title}</h4>
          <p>{k.text}</p>
          <div className="bar" />
        </div>
      ))}
    </div>
  );
}

export function Architecture({ layers }: { layers: ArchLayer[] }) {
  return (
    <div className="arch reveal" id="architecture">
      <div className="hero-grid" />
      <div className="arch-inner">
        <div>
          <span className="eyebrow" style={{ color: "var(--emerald-300)" }}>
            <span style={{ background: "var(--emerald-300)" }} />Platform architecture
          </span>
          <h2 style={{ marginTop: 18 }}>One backend. Genuine multi-tenancy. Enforced at the API.</h2>
          <p className="lead" style={{ marginTop: 20 }}>
            URJ runs as a single service that serves both the REST API and the web frontend —
            deliberately simple to deploy and reason about, versus a sprawling microservice estate.
            Each DISCOM gets its own isolated database; access is enforced at the API layer, not just the UI.
          </p>
          <div style={{ marginTop: 28, display: "flex", gap: 12, flexWrap: "wrap" }}>
            <span className="pill" style={{ background: "rgba(255,255,255,.08)", color: "var(--emerald-300)", border: "1px solid rgba(255,255,255,.15)" }}>Cross-tenant access → HTTP 403</span>
            <span className="pill" style={{ background: "rgba(255,255,255,.08)", color: "var(--volt-400)", border: "1px solid rgba(255,255,255,.15)" }}>Per-tenant data isolation</span>
          </div>
        </div>
        <div className="arch-layers">
          {layers.map((l) => (
            <div className="layer" key={l.num}>
              <span className="lnum">{l.num}</span>
              <div className="ltxt"><b>{l.name}</b><span>{l.detail}</span></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function RoiDashboard({ levers, flows }: { levers: RoiLever[]; flows: RoiFlow[] }) {
  return (
    <section className="section roi-hero" id="roi">
      <div className="hero-grid" />
      <div className="hero-glow a" />
      <div className="wrap" style={{ position: "relative", zIndex: 2 }}>
        <div className="sec-head reveal" style={{ maxWidth: 820 }}>
          <span className="eyebrow" style={{ color: "var(--emerald-300)" }}>
            <span style={{ background: "var(--emerald-300)" }} />Interactive ROI engine
          </span>
          <h2 style={{ color: "#fff" }}>Model the business case for your utility</h2>
          <p className="lead" style={{ color: "rgba(255,255,255,.8)" }}>
            Move the assumptions and the engine recomputes the return live — gross opportunity, the share
            realistically credited to the platform, net annual benefit, payback and a five-year projection.
            Start from a utility size, then tune every lever to your own numbers.
          </p>
        </div>

        {/* live value levers as a quick-read band */}
        <div className="roi-levers-band reveal" data-tracks>
          {levers.map((l, i) => (
            <div className="rlv" key={i}>
              <div className="rlv-v">{l.value}{l.unit && <span className="u">{l.unit}</span>}</div>
              <div className="rlv-l">{l.label}</div>
              <div className="track"><i data-w={`${l.track_pct}%`} /></div>
            </div>
          ))}
        </div>

        <RoiCalculator flows={flows} />
      </div>
    </section>
  );
}

export function Comparison({ rows }: { rows: ComparisonRow[] }) {
  return (
    <div className="reveal d1" style={{ overflowX: "auto" }}>
      <table className="cmp">
        <thead><tr><th>Capability</th><th>Legacy point tools</th><th>URJ Portal</th></tr></thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i}>
              <td>{r.capability}</td>
              <td className="no">{r.legacy}</td>
              <td><span className="yes"><Icon name="check" /> {r.urj}</span></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
