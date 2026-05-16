import Link from "next/link";
import { allTools } from "@/lib/toolData";

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  name: "Herramientas Gratuitas de Análisis Inmobiliario — PropAdvisor CL",
  description: "8 herramientas gratuitas para tomar la mejor decisión inmobiliaria en Chile.",
  url: "https://www.propadvisor.site/herramientas",
  mainEntity: allTools.map(t => ({
    "@type": "WebApplication",
    name: t.title,
    url: `https://www.propadvisor.site/herramientas/${t.slug}`,
    applicationCategory: "FinanceApplication",
    offers: { "@type": "Offer", price: "0", priceCurrency: "CLP" },
  })),
};

export default function HerramientasPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <div style={{ minHeight: "100vh", background: "var(--bg-primary)" }}>
        <div style={{ maxWidth: "960px", margin: "0 auto", padding: "64px 24px 96px" }}>

          {/* Header */}
          <div style={{ textAlign: "center", marginBottom: "56px" }}>
            <span className="badge badge-teal" style={{ marginBottom: "16px" }}>100% gratis · Sin registro</span>
            <h1 style={{
              fontSize: "clamp(32px, 5vw, 48px)",
              fontWeight: 800,
              letterSpacing: "-0.04em",
              color: "var(--text-primary)",
              marginBottom: "16px",
              lineHeight: 1.1,
            }}>
              ¿Qué quieres saber?
            </h1>
            <p style={{
              fontSize: "18px",
              color: "var(--text-secondary)",
              maxWidth: "520px",
              margin: "0 auto",
              lineHeight: 1.6,
            }}>
              Elige una pregunta y obtén una respuesta clara en segundos. Sin cuentas, sin formularios largos.
            </p>
          </div>

          {/* Tool Grid */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(270px, 1fr))",
            gap: "16px",
            marginBottom: "64px",
          }}>
            {allTools.map((tool) => (
              <Link
                key={tool.slug}
                href={`/herramientas/${tool.slug}`}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  padding: "28px 24px",
                  borderRadius: "14px",
                  border: "1px solid var(--border)",
                  background: "white",
                  textDecoration: "none",
                  transition: "border-color 0.15s, box-shadow 0.15s, transform 0.1s",
                }}
                className="card"
              >
                {/* Icon */}
                <span style={{
                  fontSize: "28px",
                  marginBottom: "14px",
                  width: "48px",
                  height: "48px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: "12px",
                  background: `${tool.color}12`,
                }}>
                  {tool.icon}
                </span>

                {/* Title */}
                <h2 style={{
                  fontSize: "17px",
                  fontWeight: 700,
                  color: "var(--text-primary)",
                  letterSpacing: "-0.02em",
                  marginBottom: "6px",
                  lineHeight: 1.3,
                }}>
                  {tool.title}
                </h2>

                {/* Description */}
                <p style={{
                  fontSize: "14px",
                  color: "var(--text-secondary)",
                  lineHeight: 1.55,
                  flex: 1,
                }}>
                  {tool.description}
                </p>

                {/* Arrow */}
                <div style={{
                  marginTop: "16px",
                  fontSize: "13px",
                  fontWeight: 600,
                  color: "var(--accent)",
                  display: "flex",
                  alignItems: "center",
                  gap: "4px",
                }}>
                  Calcular
                  <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path d="M9 18l6-6-6-6" />
                  </svg>
                </div>
              </Link>
            ))}
          </div>

          {/* Full Analysis CTA */}
          <div style={{
            background: "linear-gradient(135deg, #f0fdfa 0%, #ccfbf1 100%)",
            border: "1px solid #99f6e4",
            borderRadius: "16px",
            padding: "40px 32px",
            textAlign: "center",
          }}>
            <h2 style={{
              fontSize: "clamp(22px, 4vw, 28px)",
              fontWeight: 800,
              letterSpacing: "-0.03em",
              color: "var(--text-primary)",
              marginBottom: "12px",
            }}>
              ¿Ya tienes una propiedad en mente?
            </h2>
            <p style={{
              fontSize: "16px",
              color: "var(--text-secondary)",
              marginBottom: "24px",
              maxWidth: "440px",
              margin: "0 auto 24px",
              lineHeight: 1.6,
            }}>
              Haz un análisis completo: dividendo por banco, 3 escenarios a 20 años, informe PDF + Excel gratis.
            </p>
            <Link href="/calcular" className="btn-primary" style={{ padding: "14px 32px", fontSize: "16px" }}>
              Analizar una propiedad →
            </Link>
          </div>

        </div>
      </div>
    </>
  );
}
