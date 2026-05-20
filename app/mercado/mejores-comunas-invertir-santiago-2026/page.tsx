import type { Metadata } from "next";
import Link from "next/link";
import RateAlertSignup from "@/components/RateAlertSignup";

export const metadata: Metadata = {
  title: "Mejores comunas para invertir en Santiago 2026 | PropAdvisor CL",
  description: "Análisis de plusvalía, cap rate y rentabilidad por comuna en Santiago. Descubre dónde conviene comprar para invertir según tu presupuesto en 2026.",
  keywords: ["mejores comunas invertir Santiago 2026", "plusvalía comunas Santiago", "inversión inmobiliaria Santiago", "cap rate comunas Chile"],
  alternates: { canonical: "https://www.propadvisor.site/mercado/mejores-comunas-invertir-santiago-2026" },
};

const comunas = [
  { comuna: "Ñuñoa", plusvalia: "8.5%", capRate: "4.8%", precioUF: "3.500-5.000", perfil: "Alto crecimiento, metro, baja vacancia" },
  { comuna: "Santiago Centro", plusvalia: "5.0%", capRate: "5.5%", precioUF: "1.800-3.500", perfil: "Mayor cap rate, alta rotación, precio accesible" },
  { comuna: "Providencia", plusvalia: "7.0%", capRate: "4.2%", precioUF: "4.500-7.000", perfil: "Premium, baja vacancia, alta plusvalía" },
  { comuna: "La Florida", plusvalia: "7.5%", capRate: "5.0%", precioUF: "2.500-4.000", perfil: "Metro, crecimiento sostenido, buena demanda" },
  { comuna: "Macul", plusvalia: "7.0%", capRate: "5.2%", precioUF: "2.200-3.500", perfil: "Emergente, cerca de universidades, buena renta" },
  { comuna: "Estación Central", plusvalia: "6.0%", capRate: "5.8%", precioUF: "1.500-2.800", perfil: "Alto cap rate, precio de entrada bajo, metro" },
  { comuna: "San Miguel", plusvalia: "8.0%", capRate: "4.9%", precioUF: "2.800-4.200", perfil: "Fuerte valorización, metro L2, proyectos nuevos" },
  { comuna: "Las Condes", plusvalia: "5.5%", capRate: "3.8%", precioUF: "5.000-9.000", perfil: "Baja renta relativa, plusvalía moderada, bajo riesgo" },
];

const wrap: React.CSSProperties = { maxWidth: "720px", margin: "0 auto", padding: "0 24px" };
const h2Sx: React.CSSProperties = { fontSize: "20px", fontWeight: 700, color: "var(--text-primary)", marginTop: "40px", marginBottom: "12px" };
const pSx: React.CSSProperties = { fontSize: "15px", color: "var(--text-secondary)", lineHeight: 1.8, marginBottom: "16px" };

export default function MejoresComunasPage() {
  return (
    <div style={{ minHeight: "100vh", background: "var(--bg-primary)" }}>
      <article style={{ ...wrap, paddingTop: "64px", paddingBottom: "96px" }}>

        <div style={{ fontSize: "13px", color: "var(--text-muted)", marginBottom: "24px" }}>
          <Link href="/mercado" style={{ color: "var(--accent)", textDecoration: "none" }}>← Mercado</Link>
        </div>

        <span className="badge badge-teal" style={{ marginBottom: "12px" }}>Mercado · 7 min lectura</span>
        <h1 style={{ fontSize: "clamp(28px, 5vw, 40px)", fontWeight: 800, letterSpacing: "-0.03em", color: "var(--text-primary)", lineHeight: 1.15, marginBottom: "12px" }}>
          Mejores comunas para invertir en Santiago 2026
        </h1>
        <p style={{ fontSize: "15px", color: "var(--text-secondary)", lineHeight: 1.7, marginBottom: "32px" }}>
          Analizamos plusvalía, cap rate y perfil de riesgo de las 8 comunas más interesantes para inversión inmobiliaria en Santiago.
        </p>

        {/* Table */}
        <div style={{ overflowX: "auto", marginBottom: "32px" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "14px" }}>
            <thead>
              <tr style={{ borderBottom: "2px solid var(--accent)" }}>
                <th style={{ textAlign: "left", padding: "10px 12px", fontWeight: 700 }}>Comuna</th>
                <th style={{ textAlign: "right", padding: "10px 12px", fontWeight: 700 }}>Plusvalía</th>
                <th style={{ textAlign: "right", padding: "10px 12px", fontWeight: 700 }}>Cap Rate</th>
                <th style={{ textAlign: "right", padding: "10px 12px", fontWeight: 700 }}>Precio (UF)</th>
              </tr>
            </thead>
            <tbody>
              {comunas.map((c) => (
                <tr key={c.comuna} style={{ borderBottom: "1px solid var(--border)" }}>
                  <td style={{ padding: "10px 12px", fontWeight: 600 }}>{c.comuna}</td>
                  <td style={{ padding: "10px 12px", textAlign: "right", color: "var(--accent-dark)", fontWeight: 700 }}>{c.plusvalia}</td>
                  <td style={{ padding: "10px 12px", textAlign: "right" }}>{c.capRate}</td>
                  <td style={{ padding: "10px 12px", textAlign: "right", color: "var(--text-secondary)" }}>{c.precioUF}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Analysis by profile */}
        <h2 style={h2Sx}>🎯 Por perfil de inversionista</h2>

        <h3 style={{ fontSize: "16px", fontWeight: 700, color: "var(--text-primary)", marginTop: "24px", marginBottom: "8px" }}>Inversionista conservador (bajo riesgo)</h3>
        <p style={pSx}>
          <strong>Providencia, Las Condes, Ñuñoa.</strong> Comunas consolidadas con baja vacancia y demanda estable. El cap rate es menor (3.8-4.8%), pero la plusvalía es consistente y el riesgo de no arrendar es mínimo. Ideal si priorizas seguridad sobre retorno inmediato.
        </p>

        <h3 style={{ fontSize: "16px", fontWeight: 700, color: "var(--text-primary)", marginTop: "24px", marginBottom: "8px" }}>Inversionista de renta (cash flow)</h3>
        <p style={pSx}>
          <strong>Santiago Centro, Estación Central, Macul.</strong> Cap rate de 5.2-5.8% — el arriendo cubre o supera el dividendo desde el día 1. Precio de entrada bajo (desde UF 1.500). El riesgo es mayor rotación de arrendatarios y gastos comunes altos en algunos edificios.
        </p>

        <h3 style={{ fontSize: "16px", fontWeight: 700, color: "var(--text-primary)", marginTop: "24px", marginBottom: "8px" }}>Inversionista de plusvalía (crecimiento)</h3>
        <p style={pSx}>
          <strong>Ñuñoa, San Miguel, La Florida.</strong> Plusvalía de 7.5-8.5% anual con cap rates razonables (4.8-5.0%). Estas comunas tienen proyectos de metro, renovación urbana y alta demanda. El precio ya subió, pero el potencial de crecimiento sigue fuerte.
        </p>

        {/* Key metrics */}
        <h2 style={h2Sx}>📊 Métricas clave que debes entender</h2>
        <ul style={{ ...pSx, paddingLeft: "20px" }}>
          <li><strong>Cap Rate:</strong> Ingreso neto operacional / precio de la propiedad. Sobre 5% es bueno para inversión en Chile.</li>
          <li><strong>Plusvalía:</strong> Apreciación anual del valor de la propiedad. 7%+ es excelente.</li>
          <li><strong>DSCR:</strong> Capacidad del arriendo para cubrir el dividendo. Sobre 1.2 es autosustentable.</li>
          <li><strong>Cash-on-Cash:</strong> Retorno sobre tu inversión de pie. Compáralo con alternativas de inversión (fondos mutuos, depósitos).</li>
        </ul>

        <div style={{ background: "var(--bg-secondary)", border: "1px solid var(--border)", borderRadius: "10px", padding: "16px", marginBottom: "16px" }}>
          <p style={{ fontSize: "13px", color: "var(--text-secondary)", margin: 0 }}>
            💡 <strong>Tip:</strong> Usa nuestro <Link href="/calcular" style={{ color: "var(--accent)" }}>análisis completo</Link> para calcular IRR, DSCR y cash-on-cash de cualquier propiedad que estés evaluando.
          </p>
        </div>

        {/* Newsletter */}
        <div style={{ marginTop: "40px" }}>
          <RateAlertSignup />
        </div>

        {/* Related */}
        <div style={{ marginTop: "32px", paddingTop: "24px", borderTop: "1px solid var(--border)" }}>
          <p style={{ fontSize: "13px", fontWeight: 700, color: "var(--text-secondary)", marginBottom: "12px", textTransform: "uppercase", letterSpacing: "0.04em" }}>Artículos relacionados</p>
          <Link href="/mercado/tasas-hipotecarias-junio-2026" style={{ fontSize: "14px", color: "var(--accent)", textDecoration: "none", display: "block", marginBottom: "8px" }}>
            Tasas hipotecarias en Chile — Junio 2026 →
          </Link>
          <Link href="/mercado/guia-comprar-primera-vivienda-santiago-2026" style={{ fontSize: "14px", color: "var(--accent)", textDecoration: "none", display: "block" }}>
            Guía completa: comprar tu primera vivienda en Santiago 2026 →
          </Link>
        </div>
      </article>
    </div>
  );
}
