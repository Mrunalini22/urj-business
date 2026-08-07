import { useState } from "react";

// Fallback mark — only shown if the real logo image hasn't been added yet.
export function LogoMark({ size = 38 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="URJ">
      <defs>
        <linearGradient id="urjBlue" x1="6" y1="8" x2="40" y2="42" gradientUnits="userSpaceOnUse">
          <stop stopColor="#2fa6e0" /><stop offset="1" stopColor="#1f7fd1" />
        </linearGradient>
        <linearGradient id="urjGreen" x1="10" y1="42" x2="42" y2="8" gradientUnits="userSpaceOnUse">
          <stop stopColor="#3fce7a" /><stop offset="1" stopColor="#7ee081" />
        </linearGradient>
      </defs>
      <path d="M20 8 A16 16 0 1 0 34 16" stroke="url(#urjBlue)" strokeWidth="5.6" strokeLinecap="round" />
      <path d="M28 40 A16 16 0 1 0 14 32" stroke="url(#urjGreen)" strokeWidth="5.6" strokeLinecap="round" />
      <circle cx="24" cy="24" r="3.4" fill="#1f7fd1" />
    </svg>
  );
}

/** Brand — uses the real URJ logo image (public/urj-logo.png), on a themed
 *  chip so it reads cleanly on the dark sidebar. Falls back to the SVG mark
 *  + wordmark until the image file is added. */
export function BrandLogo({ height = 42, sub = false }: { height?: number; sub?: boolean }) {
  const [ok, setOk] = useState(true);
  if (ok) {
    return (
      <span className="brand-chip">
        <img src="/urj-logo-trans.png" alt="URJ — DISCOM Operations Intelligence"
             style={{ height }} onError={() => setOk(false)} />
      </span>
    );
  }
  return (
    <>
      <span className="mark logo-mark"><LogoMark size={36} /></span>
      <span className="brand-word">URJ{sub && <span className="sub">DISCOM OPS INTELLIGENCE</span>}</span>
    </>
  );
}
