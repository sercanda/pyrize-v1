export default function HomePage() {
  return (
    <main style={{ padding: 24, fontFamily: "system-ui, -apple-system, Segoe UI, Roboto, Arial" }}>
      <h1 style={{ margin: 0 }}>Pyrize</h1>
      <p style={{ marginTop: 8, opacity: 0.8 }}>
        Deploy başarılı ✅ (Root route eklendi)
      </p>

      <div style={{ marginTop: 16, display: "flex", gap: 12, flexWrap: "wrap" }}>
        <a href="/api/health" style={{ textDecoration: "underline" }}>Health</a>
      </div>
    </main>
  );
}
