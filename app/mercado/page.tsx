import Link from "next/link";
import { articles } from "@/lib/articles";

const categoryLabels: Record<string, { label: string; color: string }> = {
  tasas: { label: "Tasas", color: "#0284c7" },
  guia: { label: "Guía", color: "#059669" },
  mercado: { label: "Mercado", color: "#7c3aed" },
};

export default function MercadoPage() {
  return (
    <div style={{ minHeight: "100vh", background: "var(--bg-primary)" }}>
      <div style={{ maxWidth: "800px", margin: "0 auto", padding: "64px 24px 96px" }}>

        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "48px" }}>
          <span className="badge badge-teal" style={{ marginBottom: "16px" }}>Actualizado mensualmente</span>
          <h1 style={{
            fontSize: "clamp(32px, 5vw, 44px)",
            fontWeight: 800,
            letterSpacing: "-0.04em",
            color: "var(--text-primary)",
            marginBottom: "16px",
            lineHeight: 1.1,
          }}>
            Mercado Inmobiliario Chile
          </h1>
          <p style={{
            fontSize: "17px",
            color: "var(--text-secondary)",
            maxWidth: "560px",
            margin: "0 auto",
            lineHeight: 1.6,
          }}>
            Análisis de tasas, plusvalía y tendencias para tomar mejores decisiones inmobiliarias.
          </p>
        </div>

        {/* Articles */}
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {articles.map((article) => {
            const cat = categoryLabels[article.category];
            return (
              <Link
                key={article.slug}
                href={`/mercado/${article.slug}`}
                style={{
                  display: "block",
                  padding: "24px",
                  borderRadius: "14px",
                  border: "1px solid var(--border)",
                  background: "white",
                  textDecoration: "none",
                  transition: "border-color 0.15s, box-shadow 0.15s",
                }}
                className="card"
              >
                <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "10px" }}>
                  <span style={{
                    fontSize: "11px", fontWeight: 700, color: cat.color,
                    background: `${cat.color}15`, padding: "3px 10px",
                    borderRadius: "6px", textTransform: "uppercase", letterSpacing: "0.04em",
                  }}>
                    {cat.label}
                  </span>
                  <span style={{ fontSize: "12px", color: "var(--text-muted)" }}>
                    {new Date(article.date).toLocaleDateString("es-CL", { day: "numeric", month: "long", year: "numeric" })}
                  </span>
                  <span style={{ fontSize: "12px", color: "var(--text-muted)" }}>· {article.readingTime}</span>
                </div>
                <h2 style={{
                  fontSize: "18px", fontWeight: 700,
                  color: "var(--text-primary)",
                  marginBottom: "6px", lineHeight: 1.3,
                }}>
                  {article.title}
                </h2>
                <p style={{
                  fontSize: "14px", color: "var(--text-secondary)",
                  lineHeight: 1.5, margin: 0,
                }}>
                  {article.description}
                </p>
              </Link>
            );
          })}
        </div>

        {/* CTA */}
        <div style={{ textAlign: "center", marginTop: "48px" }}>
          <p style={{ fontSize: "14px", color: "var(--text-secondary)", marginBottom: "12px" }}>
            ¿Quieres recibir estos análisis en tu correo?
          </p>
          <Link
            href="/calcular"
            style={{
              display: "inline-block",
              padding: "12px 28px",
              background: "var(--accent)", color: "white",
              borderRadius: "10px", fontSize: "14px", fontWeight: 700,
              textDecoration: "none",
            }}
          >
            Analizar mi propiedad →
          </Link>
        </div>
      </div>
    </div>
  );
}
