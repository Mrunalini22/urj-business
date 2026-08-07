import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Icon } from "./Icon";
import { BrandLogo } from "./Logo";

type NavLink = { href: string; label: string; icon: string; id?: string };

const LANDING_LINKS: NavLink[] = [
  { href: "#top", label: "Overview", icon: "command", id: "top" },
  { href: "#live", label: "Live ops", icon: "gauge", id: "live" },
  { href: "#visuals", label: "Visuals", icon: "chart", id: "visuals" },
  { href: "#modules", label: "Modules", icon: "grid", id: "modules" },
  { href: "#roi", label: "ROI engine", icon: "trend", id: "roi" },
];

const PORTAL_LINKS: NavLink[] = [
  { href: "#top", label: "Overview", icon: "command", id: "top" },
  { href: "#modules", label: "Modules", icon: "grid", id: "modules" },
  { href: "#live", label: "Live ops", icon: "gauge", id: "live" },
  { href: "#architecture", label: "Architecture", icon: "layers", id: "architecture" },
  { href: "#roi", label: "ROI engine", icon: "trend", id: "roi" },
];

export function Nav() {
  const onLanding = useLocation().pathname === "/";
  const links = onLanding ? LANDING_LINKS : PORTAL_LINKS;
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState<string>("top");

  // scrollspy via IntersectionObserver (robust to which element scrolls)
  useEffect(() => {
    const ids = links.map((l) => l.id).filter((x): x is string => !!x && x !== "top");
    const els = ids.map((id) => document.getElementById(id)).filter((e): e is HTMLElement => !!e);
    if (!els.length) return;
    const visible = new Set<string>();
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => (e.isIntersecting ? visible.add(e.target.id) : visible.delete(e.target.id)));
        const first = ids.find((id) => visible.has(id));
        setActive(first ?? "top");
      },
      { rootMargin: "-12% 0px -58% 0px", threshold: 0 }
    );
    els.forEach((e) => obs.observe(e));
    return () => obs.disconnect();
  }, [links]);

  const close = () => setOpen(false);

  return (
    <>
      {/* mobile top bar */}
      <div className="sb-mobilebar">
        <button className="sb-burger" aria-label="Menu" onClick={() => setOpen((v) => !v)}>
          <span /><span /><span />
        </button>
        <Link className="brand" to="/" onClick={close}>
          <BrandLogo height={30} />
        </Link>
      </div>

      <div className={`sb-scrim ${open ? "show" : ""}`} onClick={close} />

      <aside className={`sidebar ${open ? "open" : ""}`}>
        <Link className="sb-brand" to="/" onClick={close}>
          <BrandLogo height={46} />
        </Link>

        <nav className="sb-links">
          {links.map((l) => (
            <a key={l.href} href={l.href} className={`sb-link ${active === l.id ? "active" : ""}`}
               onClick={() => { setActive(l.id ?? "top"); close(); }}>
              <Icon name={l.icon} width={18} /> <span>{l.label}</span>
            </a>
          ))}
          <div className="sb-sep" />
          {onLanding ? (
            <Link to="/portal" className="sb-link" onClick={close}><Icon name="layers" width={18} /> <span>Full portal</span></Link>
          ) : (
            <Link to="/" className="sb-link" onClick={close}><Icon name="arrow" width={18} /> <span>Back to home</span></Link>
          )}
        </nav>

        <div className="sb-bottom">
          <Link className="btn btn-primary sb-cta" to={onLanding ? "/portal" : "/"} onClick={close}>
            {onLanding ? "Enter the Portal" : "Home"} <Icon name="arrow" width={16} />
          </Link>
          <div className="sb-status"><span className="pill pill-live"><span className="dot" /> LIVE · APDCL &amp; PVVNL</span></div>
        </div>
      </aside>
    </>
  );
}
