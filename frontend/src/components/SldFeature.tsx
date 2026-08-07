import { Icon } from "./Icon";
import { Sld } from "./Viz";

const ADVANTAGES = [
  "Auto-generated IEC/ANSI single-line diagrams straight from an uploaded Excel substation register — no manual CAD drafting or upkeep.",
  "Live telemetry overlay — real voltage and current per meter and distribution transformer, colour-coded by voltage band.",
  "Animated live-status indicators — see at a glance which parts of the network are actually reporting right now.",
  "The diagram regenerates the moment the asset register changes — it is never a stale, hand-drawn snapshot.",
];

export function SldFeature() {
  return (
    <section className="section sldf-sec">
      <div className="wrap">
        <div className="sec-head reveal" style={{ maxWidth: 760 }}>
          <span className="eyebrow">Feature spotlight · Network operations</span>
          <h2>Your substation register becomes a <span className="accent-em">live single-line diagram</span> — automatically</h2>
          <p className="lead">
            No CAD team, no weeks of AutoCAD/Visio drafting. URJ parses a utility's existing Excel substation register,
            generates a standard IEC/ANSI single-line diagram, and overlays it with real-time telemetry — so the control
            room sees the network as it actually is, not a static drawing.
          </p>
        </div>

        <div className="sldf-body">
          <div className="sldf-text reveal">
            <ul className="ticks">
              {ADVANTAGES.map((a, i) => (
                <li key={i}><Icon name="check" /><span>{a}</span></li>
              ))}
            </ul>
            <div className="sldf-proof">
              <b>Proven on real data · </b>69 substations across two circles (Barpeta and Guwahati Electric Circle-I),
              auto-parsed from utility-supplied Excel registers with zero manual redrawing.
            </div>
            <div className="sldf-stats">
              <div className="sldf-stat"><b>0</b><span>manual redraws when the register updates</span></div>
              <div className="sldf-stat"><b>69</b><span>substations auto-mapped, 2 circles</span></div>
              <div className="sldf-stat"><b>↓ MTTR</b><span>faster fault localisation &amp; restoration</span></div>
            </div>
          </div>

          <div className="sldf-visual reveal d1">
            <figure className="sldf-photo">
              <img src="/media/img/g2-transmission.jpg" alt="Substation and feeder network" onError={(e) => (e.currentTarget.style.display = "none")} />
              <figcaption><span className="tag">The physical network</span> Substations, feeders &amp; distribution transformers</figcaption>
            </figure>
            <div className="sldf-arrow"><Icon name="arrow" width={20} /><span>auto-generated in seconds</span></div>
            <div className="sldf-diagram">
              <div className="sldf-diagram-head"><span className="dot" /> Auto-generated single-line diagram · live telemetry</div>
              <Sld />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
