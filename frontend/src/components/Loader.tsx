export function Loader({ error }: { error?: string }) {
  return (
    <div style={{ minHeight: "100vh", display: "grid", placeItems: "center", background: "var(--paper)", padding: 24 }}>
      <div style={{ textAlign: "center", maxWidth: 460 }}>
        <div style={{ fontFamily: "var(--font-display)", fontSize: "2rem", fontWeight: 700, color: "var(--emerald-700)", letterSpacing: "-.03em" }}>URJ</div>
        {!error ? (
          <p style={{ marginTop: 12, color: "var(--ink-500)" }}>Loading the portal…</p>
        ) : (
          <div style={{ marginTop: 14 }}>
            <p style={{ color: "var(--rose)", fontWeight: 600 }}>Could not reach the API.</p>
            <p style={{ marginTop: 10, color: "var(--ink-500)", fontSize: 14, lineHeight: 1.6 }}>
              Start the backend, then seed the database:<br />
              <code style={{ fontFamily: "var(--font-mono)", background: "var(--white)", padding: "2px 8px", borderRadius: 6, border: "1px solid var(--line)" }}>
                uvicorn app.main:app --reload
              </code>
            </p>
            <p style={{ marginTop: 10, color: "var(--ink-400)", fontSize: 12, fontFamily: "var(--font-mono)" }}>{error}</p>
          </div>
        )}
      </div>
    </div>
  );
}
