import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Planes — PropAdvisor CL",
  description: "Analiza propiedades gratis o accede al portfolio de inversión con PropAdvisor Pro. Compara propiedades, calcula IRR, DSCR y exporta memorándums de inversión.",
  alternates: { canonical: "https://www.propadvisor.site/pricing" },
};

const features = [
  { name: "Análisis de propiedad (3 escenarios)", free: true, pro: true },
  { name: "Informe PDF + Excel gratis", free: true, pro: true },
  { name: "Tasas de 8 bancos chilenos", free: true, pro: true },
  { name: "Datos por comuna (plusvalía, cap rate)", free: true, pro: true },
  { name: "Contacto con ejecutivo hipotecario", free: true, pro: true },
  { name: "Guardar propiedades en portfolio", free: false, pro: true },
  { name: "Comparar hasta 10 propiedades", free: false, pro: true },
  { name: "Modelar vacancia (0-20%)", free: false, pro: true },
  { name: "Desglose de gastos (GGCC, seguros, admin)", free: false, pro: true },
  { name: "Calculadora de impuestos (contribuciones, DFL2)", free: false, pro: true },
  { name: "IRR (tasa interna de retorno)", free: false, pro: true },
  { name: "DSCR (cobertura de deuda)", free: false, pro: true },
  { name: "Cash-on-cash por año", free: false, pro: true },
  { name: "Dashboard de portfolio", free: false, pro: true },
  { name: "Memorándum de inversión PDF", free: false, pro: true },
];

export default function PricingPage() {
  return (
    <div style={{ minHeight: "100vh", background: "var(--bg-primary)" }}>
      <div style={{ maxWidth: "960px", margin: "0 auto", padding: "64px 24px" }}>

        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "56px" }}>
          <p style={{ fontSize: "12px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--accent)", marginBottom: "12px" }}>
            Planes
          </p>
          <h1 style={{ fontSize: "clamp(32px, 5vw, 48px)", fontWeight: 800, letterSpacing: "-0.04em", color: "var(--text-primary)", marginBottom: "16px", lineHeight: 1.1 }}>
            Analiza gratis.<br />Invierte con Pro.
          </h1>
          <p style={{ fontSize: "18px", color: "var(--text-secondary)", maxWidth: "520px", margin: "0 auto", lineHeight: 1.6 }}>
            El análisis básico es y será siempre gratis. Pro es para inversores que quieren un portfolio profesional.
          </p>
        </div>

        {/* Plans grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "24px", marginBottom: "64px" }}>

          {/* Free plan */}
          <div style={{ border: "1px solid var(--border)", borderRadius: "16px", padding: "32px", background: "white" }}>
            <p style={{ fontSize: "13px", fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "8px" }}>Gratis</p>
            <div style={{ display: "flex", alignItems: "baseline", gap: "4px", marginBottom: "8px" }}>
              <p style={{ fontSize: "42px", fontWeight: 800, color: "var(--text-primary)", letterSpacing: "-0.04em", lineHeight: 1 }}>$0</p>
              <p style={{ fontSize: "15px", color: "var(--text-muted)" }}>para siempre</p>
            </div>
            <p style={{ fontSize: "14px", color: "var(--text-secondary)", lineHeight: 1.5, marginBottom: "24px" }}>
              Analiza cualquier propiedad con datos reales. Sin registro, sin tarjeta.
            </p>
            <Link
              href="/calcular"
              className="btn-secondary"
              style={{ display: "block", textAlign: "center", padding: "12px", fontSize: "14px", width: "100%", boxSizing: "border-box" }}
            >
              Empezar gratis →
            </Link>
          </div>

          {/* Pro plan */}
          <div style={{ border: "2px solid var(--accent)", borderRadius: "16px", padding: "32px", background: "white", position: "relative" }}>
            <div style={{
              position: "absolute", top: "-12px", left: "50%", transform: "translateX(-50%)",
              background: "var(--accent)", color: "white", fontSize: "11px", fontWeight: 700,
              padding: "4px 16px", borderRadius: "9999px", textTransform: "uppercase", letterSpacing: "0.05em",
            }}>
              Para inversores
            </div>
            <p style={{ fontSize: "13px", fontWeight: 700, color: "var(--accent)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "8px" }}>Pro</p>
            <div style={{ display: "flex", alignItems: "baseline", gap: "4px", marginBottom: "4px" }}>
              <p style={{ fontSize: "42px", fontWeight: 800, color: "var(--text-primary)", letterSpacing: "-0.04em", lineHeight: 1 }}>$15.000</p>
              <p style={{ fontSize: "15px", color: "var(--text-muted)" }}>/mes</p>
            </div>
            <p style={{ fontSize: "12px", color: "var(--text-muted)", marginBottom: "8px" }}>~$15 USD · Cancela cuando quieras</p>
            <p style={{ fontSize: "14px", color: "var(--text-secondary)", lineHeight: 1.5, marginBottom: "24px" }}>
              Portfolio, IRR, DSCR, comparación lado a lado y memorándum de inversión profesional.
            </p>
            <Link
              href="/dashboard"
              style={{
                display: "block", textAlign: "center", padding: "12px", fontSize: "14px",
                width: "100%", boxSizing: "border-box",
                background: "var(--accent)", color: "white", borderRadius: "10px",
                fontWeight: 700, textDecoration: "none",
                transition: "background 0.15s",
              }}
            >
              Probar 7 días gratis →
            </Link>
            <p style={{ fontSize: "11px", color: "var(--text-muted)", textAlign: "center", marginTop: "8px" }}>
              Sin tarjeta para empezar
            </p>
          </div>
        </div>

        {/* Feature comparison table */}
        <div style={{ marginBottom: "64px" }}>
          <h2 style={{ fontSize: "24px", fontWeight: 800, color: "var(--text-primary)", textAlign: "center", marginBottom: "32px", letterSpacing: "-0.02em" }}>
            Comparación detallada
          </h2>
          <div style={{ border: "1px solid var(--border)", borderRadius: "12px", overflow: "hidden" }}>
            {/* Header */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 80px 80px", gap: "0", background: "var(--bg-secondary)", padding: "12px 20px", borderBottom: "1px solid var(--border)" }}>
              <p style={{ fontSize: "12px", fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.05em" }}>Funcionalidad</p>
              <p style={{ fontSize: "12px", fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.05em", textAlign: "center" }}>Gratis</p>
              <p style={{ fontSize: "12px", fontWeight: 700, color: "var(--accent)", textTransform: "uppercase", letterSpacing: "0.05em", textAlign: "center" }}>Pro</p>
            </div>
            {/* Rows */}
            {features.map((f, i) => (
              <div
                key={f.name}
                style={{
                  display: "grid", gridTemplateColumns: "1fr 80px 80px", gap: "0",
                  padding: "12px 20px",
                  background: i % 2 === 0 ? "white" : "var(--bg-secondary)",
                  borderBottom: i < features.length - 1 ? "1px solid var(--border)" : "none",
                }}
              >
                <p style={{ fontSize: "14px", color: "var(--text-primary)" }}>{f.name}</p>
                <p style={{ fontSize: "16px", textAlign: "center" }}>{f.free ? "✅" : "—"}</p>
                <p style={{ fontSize: "16px", textAlign: "center" }}>✅</p>
              </div>
            ))}
          </div>
        </div>

        {/* FAQ */}
        <div style={{ maxWidth: "640px", margin: "0 auto" }}>
          <h2 style={{ fontSize: "24px", fontWeight: 800, color: "var(--text-primary)", textAlign: "center", marginBottom: "24px", letterSpacing: "-0.02em" }}>
            Preguntas frecuentes
          </h2>
          {[
            { q: "¿Puedo seguir usando PropAdvisor gratis?", a: "Sí, siempre. El análisis de una propiedad con 3 escenarios, PDF y Excel es y será gratis. Pro agrega portfolio, métricas de inversión avanzadas y comparación entre propiedades." },
            { q: "¿Puedo cancelar cuando quiera?", a: "Sí. Sin contratos, sin permanencia mínima. Cancelas y sigues usando la versión gratis." },
            { q: "¿Necesito tarjeta para probar?", a: "No. Los primeros 7 días son gratis sin ingresar tarjeta. Solo la agregas si decides continuar." },
            { q: "¿Qué es IRR y DSCR?", a: "IRR (Internal Rate of Return) es la rentabilidad real de tu inversión considerando todos los flujos a 20 años. DSCR (Debt Service Coverage Ratio) es lo que los bancos usan para aprobar créditos de inversión — mide si el arriendo cubre el dividendo. Necesitas DSCR > 1.2." },
            { q: "¿Puedo compartir mi portfolio con socios?", a: "Pro incluye exportación de memorándum de inversión en PDF profesional, listo para compartir con socios, bancos o inversionistas." },
          ].map((faq, i) => (
            <details
              key={i}
              style={{ background: "white", border: "1px solid var(--border)", borderRadius: "10px", overflow: "hidden", marginBottom: "8px" }}
            >
              <summary style={{ padding: "16px 20px", cursor: "pointer", fontSize: "15px", fontWeight: 600, color: "var(--text-primary)", listStyle: "none" }}>
                {faq.q}
              </summary>
              <div style={{ padding: "0 20px 16px", borderTop: "1px solid var(--border)", paddingTop: "12px" }}>
                <p style={{ fontSize: "14px", color: "var(--text-secondary)", lineHeight: 1.7 }}>{faq.a}</p>
              </div>
            </details>
          ))}
        </div>

        {/* Bottom CTA */}
        <div style={{ textAlign: "center", marginTop: "64px" }}>
          <p style={{ fontSize: "15px", color: "var(--text-secondary)", marginBottom: "16px" }}>
            ¿No estás seguro? Empieza analizando una propiedad gratis.
          </p>
          <Link href="/calcular" className="btn-primary" style={{ padding: "14px 32px", fontSize: "15px" }}>
            Analizar una propiedad →
          </Link>
        </div>

      </div>
    </div>
  );
}
