import { useLive, useCountUp } from "../hooks";
import type { LiveTile, LiveSnapshot } from "../types";

function fmt(v: number, t?: LiveTile): string {
  if (t?.fmt === "comma") return Math.round(v).toLocaleString("en-IN");
  if (t?.fmt === "comma1") return v.toLocaleString("en-IN", { minimumFractionDigits: 1, maximumFractionDigits: 1 });
  const dec = Number.isInteger(t?.value) ? 0 : (t && Math.abs(t.value) < 2 ? 3 : t && t.value < 100 ? 2 : 1);
  return v.toLocaleString("en-IN", { minimumFractionDigits: dec, maximumFractionDigits: dec });
}

function Tile({ t }: { t: LiveTile }) {
  const v = useCountUp(t.value);
  const up = (t.delta ?? 0) >= 0;
  const good = t.good ? (t.good === "up" ? up : !up) : up;
  return (
    <div className="ltile">
      <div className="ltile-label">{t.label}</div>
      <div className="ltile-val">{fmt(v, t)}{t.unit && <span className="u">{t.unit}</span>}</div>
      {t.delta !== undefined && t.delta !== 0 && (
        <div className={`ltile-delta ${good ? "up" : "down"}`}>
          <span>{up ? "▲" : "▼"}</span> {Math.abs(t.delta).toLocaleString("en-IN")} <span className="win">/ min</span>
        </div>
      )}
    </div>
  );
}

function LoadChart({ snap }: { snap: LiveSnapshot }) {
  const W = 640, H = 200, pad = 8;
  const pts = snap.load_curve;
  const max = Math.max(...pts.map((p) => p.mw)) * 1.06;
  const min = Math.min(...pts.map((p) => p.mw)) * 0.9;
  const x = (i: number) => pad + (i / (pts.length - 1)) * (W - pad * 2);
  const y = (mw: number) => H - pad - ((mw - min) / (max - min)) * (H - pad * 2);
  const line = pts.map((p, i) => `${i ? "L" : "M"}${x(i).toFixed(1)},${y(p.mw).toFixed(1)}`).join(" ");
  const area = `${line} L${x(pts.length - 1)},${H} L${x(0)},${H} Z`;
  const nh = snap.now_h;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="lchart" preserveAspectRatio="none">
      <defs>
        <linearGradient id="lfill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#34c99b" stopOpacity=".45" />
          <stop offset="1" stopColor="#34c99b" stopOpacity="0" />
        </linearGradient>
      </defs>
      {[0.25, 0.5, 0.75].map((g) => <line key={g} x1={pad} x2={W - pad} y1={pad + g * (H - pad * 2)} y2={pad + g * (H - pad * 2)} stroke="rgba(255,255,255,.08)" />)}
      <path d={area} fill="url(#lfill)" />
      <path d={line} fill="none" stroke="#7fe0c2" strokeWidth={2.5} strokeLinejoin="round" strokeLinecap="round" />
      <line x1={x(nh)} x2={x(nh)} y1={pad} y2={H - pad} stroke="#ffbf47" strokeWidth={1.5} strokeDasharray="4 4" opacity=".8" />
      <circle cx={x(nh)} cy={y(pts[nh].mw)} r={5} fill="#ffbf47">
        <animate attributeName="r" values="5;8;5" dur="1.6s" repeatCount="indefinite" />
      </circle>
    </svg>
  );
}

export function LiveOps() {
  const { snap, online } = useLive(3000);

  return (
    <section className="section liveops" id="live">
      <div className="hero-grid" />
      <div className="hero-glow a" />
      <div className="wrap" style={{ position: "relative", zIndex: 2 }}>
        <div className="live-head reveal">
          <div>
            <span className="eyebrow" style={{ color: "var(--emerald-300)" }}><span style={{ background: "var(--emerald-300)" }} />Live operations</span>
            <h2 style={{ color: "#fff", marginTop: 16 }}>The platform, streaming right now</h2>
            <p className="lead" style={{ color: "rgba(255,255,255,.8)", marginTop: 16 }}>
              These figures update live from the operational data layer — the same real-time feed leadership
              watches during an incident. Not a static snapshot: it moves.
            </p>
          </div>
          <div className={`live-status ${online ? "on" : "off"}`}>
            <span className="ls-dot" />
            <div>
              <b>{online ? "LIVE" : "RECONNECTING"}</b>
              <span>{snap ? `as of ${snap.as_of} · updates every 3s` : "connecting…"}</span>
            </div>
          </div>
        </div>

        {!snap ? (
          <div className="live-loading">Connecting to the live feed…</div>
        ) : (
          <div className="live-grid">
            <div className="live-tiles">
              {snap.tiles.map((t) => <Tile key={t.key} t={t} />)}
            </div>

            <div className="live-row">
              <div className="live-panel chart-panel">
                <div className="lp-head">
                  <span>System demand · live daily curve</span>
                  <span className="lp-now">{snap.tiles.find((t) => t.key === "load")?.value.toLocaleString("en-IN")} MW now</span>
                </div>
                <LoadChart snap={snap} />
                <div className="lp-axis">
                  {[0, 6, 12, 18, 23].map((h) => <span key={h}>{String(h).padStart(2, "0")}:00</span>)}
                </div>
              </div>

              <div className="live-panel feed-panel">
                <div className="lp-head"><span>Live alert &amp; event feed</span><span className="lp-live"><span className="dot" /> streaming</span></div>
                <ul className="live-feed">
                  {snap.alerts.map((a, i) => (
                    <li key={a.t + i} className={`lf-${a.level}`}>
                      <span className="lf-dot" />
                      <span className="lf-text">{a.text}</span>
                      <span className="lf-time">{a.t}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
