// Stroke-based icon set, keyed by name — mirrors the backend `icon` field.
const PATHS: Record<string, string> = {
  command: '<rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><path d="M10 6.5h4M6.5 10v4M17.5 10v4M10 17.5h4"/>',
  grid: '<rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/>',
  network: '<circle cx="12" cy="5" r="2.4"/><circle cx="5" cy="19" r="2.4"/><circle cx="19" cy="19" r="2.4"/><path d="M12 7.4v4m0 0-5 5m5-5 5 5"/>',
  wrench: '<path d="M14.7 6.3a4 4 0 0 0-5.4 5.2L3 17.8 6.2 21l6.3-6.3a4 4 0 0 0 5.2-5.4l-2.5 2.5-2.3-.6-.6-2.3 2.4-2.6Z"/>',
  shield: '<path d="M12 3 5 6v5c0 4.3 3 8.3 7 9.5 4-1.2 7-5.2 7-9.5V6l-7-3Z"/><path d="m9 12 2 2 4-4"/>',
  chart: '<path d="M4 20V10m5 10V4m5 16v-6m5 6V8"/>',
  brain: '<path d="M9 3a3 3 0 0 0-3 3 3 3 0 0 0-2 5 3 3 0 0 0 2 5 3 3 0 0 0 5 1V4a3 3 0 0 0-2-1Z"/><path d="M15 3a3 3 0 0 1 3 3 3 3 0 0 1 2 5 3 3 0 0 1-2 5 3 3 0 0 1-5 1"/>',
  phone: '<rect x="6" y="2.5" width="12" height="19" rx="2.5"/><path d="M11 18h2"/>',
  hub: '<circle cx="12" cy="12" r="2.5"/><circle cx="12" cy="4" r="1.6"/><circle cx="12" cy="20" r="1.6"/><circle cx="4" cy="8" r="1.6"/><circle cx="20" cy="8" r="1.6"/><circle cx="4" cy="16" r="1.6"/><circle cx="20" cy="16" r="1.6"/><path d="m12 5.6.01 4M12 18.4v-4M6 9l3.8 2M18 9l-3.8 2M6 15l3.8-2M18 15l-3.8-2"/>',
  key: '<circle cx="7.5" cy="15.5" r="4"/><path d="m10.5 12.5 8-8m-2 2 2 2m-4 0 2 2"/>',
  chat: '<path d="M4 5.5A2.5 2.5 0 0 1 6.5 3h11A2.5 2.5 0 0 1 20 5.5v7A2.5 2.5 0 0 1 17.5 15H9l-4 4v-4H6.5"/>',
  bolt: '<path d="M13 2 4 14h7l-1 8 9-12h-7l1-8Z"/>',
  clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 3"/>',
  users: '<circle cx="9" cy="8" r="3.2"/><path d="M3.5 20a5.5 5.5 0 0 1 11 0M16 5.5a3.2 3.2 0 0 1 0 6M20.5 20a5.5 5.5 0 0 0-4-5.3"/>',
  trend: '<path d="M3 17 9 11l4 4 8-8m0 0h-5m5 0v5"/>',
  coins: '<ellipse cx="9" cy="7" rx="5.5" ry="2.6"/><path d="M3.5 7v5c0 1.4 2.5 2.6 5.5 2.6M14.5 12a5.5 2.6 0 1 0 5.5 2.6 5.5 2.6 0 0 0-5.5-2.6Zm5.5 2.6v5c0 1.4-2.5 2.6-5.5 2.6s-5.5-1.2-5.5-2.6"/>',
  check: '<path d="M20 6 9 17l-5-5"/>',
  x: '<path d="M18 6 6 18M6 6l12 12"/>',
  arrow: '<path d="M5 12h14m-6-6 6 6-6 6"/>',
  gauge: '<path d="M12 14a2 2 0 1 0 0-4 2 2 0 0 0 0 4Zm0 0 4-4M4.5 18a9 9 0 1 1 15 0"/>',
  play: '<circle cx="12" cy="12" r="9"/><path d="M10.5 8.5 16 12l-5.5 3.5z"/>',
  layers: '<path d="m12 3 9 5-9 5-9-5 9-5Z"/><path d="m3 13 9 5 9-5M3 17l9 5 9-5"/>',
};

export function Icon({ name, className, width = 18 }: { name: string; className?: string; width?: number }) {
  // Always carry an intrinsic size so an icon never balloons to the SVG default
  // (300×150) when a call-site doesn't constrain it via CSS. CSS width still wins.
  return (
    <svg
      className={className}
      width={width}
      height={width}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.7}
      strokeLinecap="round"
      strokeLinejoin="round"
      dangerouslySetInnerHTML={{ __html: PATHS[name] ?? "" }}
    />
  );
}
