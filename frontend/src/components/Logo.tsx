// URJ mark — recreated from the brochure: interlocking blue/green arcs
// forming a circular "U", with an energy node. Pure SVG, scales cleanly.
export function LogoMark({ size = 38 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="URJ">
      <defs>
        <linearGradient id="urjBlue" x1="6" y1="6" x2="42" y2="42" gradientUnits="userSpaceOnUse">
          <stop stopColor="#2fa6e0" /><stop offset="1" stopColor="#1f7fd1" />
        </linearGradient>
        <linearGradient id="urjGreen" x1="10" y1="40" x2="40" y2="8" gradientUnits="userSpaceOnUse">
          <stop stopColor="#3fce7a" /><stop offset="1" stopColor="#7ee081" />
        </linearGradient>
      </defs>
      {/* outer blue arc — open ring forming the U bowl */}
      <path d="M13 9 A17 17 0 1 0 39 15" stroke="url(#urjBlue)" strokeWidth="5.4" strokeLinecap="round" />
      {/* inner green arc — the J hook / rotor */}
      <path d="M31 12 A13 13 0 1 1 15 34" stroke="url(#urjGreen)" strokeWidth="5.4" strokeLinecap="round" />
      {/* energy node */}
      <circle cx="34" cy="17" r="3.6" fill="#7ee081" />
    </svg>
  );
}

export function Logo({ light = false }: { light?: boolean }) {
  return (
    <span className="brand">
      <span className="mark logo-mark"><LogoMark size={30} /></span>
      <span style={{ color: light ? "#fff" : undefined }}>
        URJ<span className="sub">DISCOM OPS INTELLIGENCE</span>
      </span>
    </span>
  );
}
