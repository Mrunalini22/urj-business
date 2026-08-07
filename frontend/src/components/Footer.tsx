import { Link } from "react-router-dom";
import { BrandLogo } from "./Logo";

export function Footer() {
  return (
    <footer className="foot">
      <div className="wrap">
        <div className="foot-top">
          <div>
            <Link className="brand" to="/">
              <BrandLogo height={44} />
            </Link>
            <p className="foot-desc" style={{ marginTop: 18 }}>
              A single, multi-tenant Operations Intelligence Portal purpose-built for electricity
              distribution utilities — unifying network operations, revenue assurance, predictive
              analytics, field operations and governance.
            </p>
            <div className="foot-contact">
              <b>GBS PLUS Pvt Ltd</b>
              <span>Global Business Solutions</span>
              <span>WINDSOR Apartment, Ground Floor, Lower Level</span>
              <span>TC No. 4/1256(38), Kuravankonam, Kowdiar</span>
              <span>Trivandrum — 695003</span>
              <span>+91 755 888 1001 · asr@gbs-plus.com</span>
            </div>
          </div>
          <div className="foot-col">
            <h5>Platform</h5>
            <Link to="/portal#architecture">Architecture</Link>
            <Link to="/#value">Business value</Link>
            <Link to="/portal#roi">ROI engine</Link>
            <Link to="/portal">Enter portal</Link>
          </div>
          <div className="foot-col">
            <h5>Modules</h5>
            <Link to="/portal">Command Center</Link>
            <Link to="/portal">Revenue Assurance</Link>
            <Link to="/portal">Predictive Analytics</Link>
            <Link to="/portal">Field Force</Link>
          </div>
          <div className="foot-col">
            <h5>Governance</h5>
            <Link to="/portal">Multi-tenancy</Link>
            <Link to="/portal">Security</Link>
            <Link to="/portal">Licensing</Link>
            <Link to="/portal">Audit &amp; compliance</Link>
          </div>
        </div>
        <div className="foot-bot">
          <span>© 2026 GBS PLUS Pvt Ltd · URJ — DISCOM Operations Intelligence Portal · Confidential — for business scoping &amp; stakeholder review.</span>
          <span className="pill pill-live"><span className="dot" /> Live &amp; operational — APDCL &amp; PVVNL</span>
        </div>
      </div>
    </footer>
  );
}
