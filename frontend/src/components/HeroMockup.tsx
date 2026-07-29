// Realistic product-UI mockup shown in the hero — a live command-center screen.
export function HeroMockup() {
  return (
    <div className="hero-visual">
      <div className="mock">
        <div className="mock-bar"><i /><i /><i /><span>urj · executive command center</span></div>
        <div className="mock-screen">
          <svg viewBox="0 0 520 360" xmlns="http://www.w3.org/2000/svg" style={{ width: "100%", display: "block" }}>
            <defs>
              <linearGradient id="g1" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stopColor="#7fe0c2" stopOpacity=".9" />
                <stop offset="1" stopColor="#7fe0c2" stopOpacity=".05" />
              </linearGradient>
              <linearGradient id="g2" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0" stopColor="#34c99b" />
                <stop offset="1" stopColor="#ffbf47" />
              </linearGradient>
            </defs>
            <g fontFamily="Space Grotesk, monospace">
              <rect x="16" y="16" width="150" height="66" rx="10" fill="#ffffff" opacity=".08" />
              <text x="30" y="42" fill="#7fe0c2" fontSize="11">AT&amp;C LOSS</text>
              <text x="30" y="68" fill="#fff" fontSize="24" fontWeight="700">12.4%</text>
              <rect x="182" y="16" width="150" height="66" rx="10" fill="#ffffff" opacity=".08" />
              <text x="196" y="42" fill="#ffbf47" fontSize="11">COLLECTION EFF.</text>
              <text x="196" y="68" fill="#fff" fontSize="24" fontWeight="700">98.1%</text>
              <rect x="348" y="16" width="156" height="66" rx="10" fill="#ffffff" opacity=".08" />
              <text x="362" y="42" fill="#7fe0c2" fontSize="11">FEEDERS LIVE</text>
              <text x="362" y="68" fill="#fff" fontSize="24" fontWeight="700">1,284</text>
            </g>
            <rect x="16" y="98" width="316" height="164" rx="12" fill="#ffffff" opacity=".07" />
            <text x="32" y="122" fill="#cdeee2" fontSize="11" fontFamily="Space Grotesk, monospace">FEEDER LOAD · LIVE FORECAST (MW)</text>
            <polyline points="32,232 80,214 128,224 176,190 224,200 272,164 320,150" fill="none" stroke="url(#g2)" strokeWidth="3" strokeLinecap="round" />
            <polygon points="32,232 80,214 128,224 176,190 224,200 272,164 320,150 320,246 32,246" fill="url(#g1)" opacity=".4" />
            <circle cx="320" cy="150" r="4.5" fill="#ffbf47" />
            <rect x="348" y="98" width="156" height="164" rx="12" fill="#ffffff" opacity=".07" />
            <text x="362" y="122" fill="#cdeee2" fontSize="11" fontFamily="Space Grotesk, monospace">SLD · LIVE</text>
            <line x1="426" y1="140" x2="426" y2="170" stroke="#7fe0c2" strokeWidth="2" />
            <circle cx="426" cy="140" r="6" fill="none" stroke="#34c99b" strokeWidth="2" />
            <line x1="390" y1="170" x2="462" y2="170" stroke="#7fe0c2" strokeWidth="2" />
            <line x1="390" y1="170" x2="390" y2="200" stroke="#34c99b" strokeWidth="2" />
            <line x1="426" y1="170" x2="426" y2="200" stroke="#ffbf47" strokeWidth="2" />
            <line x1="462" y1="170" x2="462" y2="200" stroke="#34c99b" strokeWidth="2" />
            <circle cx="390" cy="206" r="5" fill="#34c99b" /><circle cx="426" cy="206" r="5" fill="#ffbf47" /><circle cx="462" cy="206" r="5" fill="#34c99b" />
            <text x="362" y="250" fill="#7fe0c2" fontSize="9" fontFamily="Space Grotesk, monospace">69 substations · 2 circles</text>
            <rect x="16" y="278" width="488" height="66" rx="12" fill="#ffffff" opacity=".07" />
            <circle cx="34" cy="300" r="4" fill="#ffbf47" /><text x="48" y="304" fill="#fff" fontSize="11" fontFamily="Inter">Tamper flag · DT-4471 · Guwahati-I</text>
            <circle cx="34" cy="324" r="4" fill="#34c99b" /><text x="48" y="328" fill="#cdeee2" fontSize="11" fontFamily="Inter">Load threshold cleared · Feeder BRP-12</text>
          </svg>
        </div>
      </div>
      <div className="float-card float-a">
        <div className="fi" style={{ background: "var(--emerald-50)", color: "var(--emerald-600)" }}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}><path d="M4 20V10m5 10V4m5 16v-6m5 6V8" /></svg>
        </div>
        <div><b>−2.4pp</b><span>AT&amp;C loss, target</span></div>
      </div>
      <div className="float-card float-b">
        <div className="fi" style={{ background: "var(--volt-100)", color: "var(--volt-600)" }}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 3" /></svg>
        </div>
        <div><b>Real-time</b><span>vs days of reports</span></div>
      </div>
    </div>
  );
}
