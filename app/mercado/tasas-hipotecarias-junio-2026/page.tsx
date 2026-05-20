import type { Metadata } from "next";
import Link from "next/link";
import RateAlertSignup from "@/components/RateAlertSignup";

export const metadata: Metadata = {
  title: "Tasas hipotecarias en Chile — Junio 2026 | PropAdvisor CL",
  description: "Comparación actualizada de tasas hipotecarias de los 8 principales bancos de Chile. Tendencias, análisis y proyección para el segundo semestre 2026.",
  keywords: ["tasas hipotecarias Chile junio 2026", "tasa crédito hipotecario Chile", "comparar bancos hipotecarios Chile", "mejor tasa hipotecaria 2026"],
  alternates: { canonical: "https://www.propadvisor.site/mercado/tasas-hipotecarias-junio-2026" },
};

const banks = [
  { bank: "Santander", rate20: "3.43%", rate10: "3.93%", rate30: "3.19%", pie: "15%" },
  { bank: "Itaú", rate20: "3.55%", rate10: "4.05%", rate30: "3.25%", pie: "20%" },
  { bank: "Scotiabank", rate20: "3.65%", rate10: "4.15%", rate30: "3.35%", pie: "20%" },
  { bank: "BICE", rate20: "3.70%", rate10: "4.20%", rate30: "3.40%", pie: "20%" },
  { bank: "Banco de Chile", rate20: "3.75%", rate10: "4.25%", rate30: "3.45%", pie: "15%" },
  { bank: "Security", rate20: "3.80%", rate10: "4.30%", rate30: "3.50%", pie: "20%" },
  { bank: "BCI", rate20: "3.96%", rate10: "4.46%", rate30: "3.65%", pie: "20%" },
  { bank: "BancoEstado", rate20: "4.19%", rate10: "4.69%", rate30: "3.89%", pie: "10%" },
];

const wrap: React.CSSProperties = { maxWidth: "720px", margin: "0 auto", padding: "0 24px" };

export default function TasasJunio2026() {
  return (
    <div style={{ minHeight: "100vh", background: "var(--bg-primary)" }}>
      <article style={{ ...wrap, paddingTop: "64px", paddingBottom: "96px" }}>

        {/* Breadcrumb */}
        <div style={{ fontSize: "13px", color: "var(--text-muted)", marginBottom: "24px" }}>
          <Link href="/mercado" style={{ color: "var(--accent)", textDecoration: "none" }}>← Mercado</Link>
        </div>

        {/* Header */}
        <span className="badge badge-teal" style={{ marginBottom: "12px" }}>Tasas · Junio 2026</span>
        <h1 style={{ fontSize: "clamp(28px, 5vw, 40px)", fontWeight: 800, letterSpacing: "-0.03em", color: "var(--text-primary)", lineHeight: 1.15, marginBottom: "12px" }}>
          Tasas hipotecarias en Chile — Junio 2026
        </h1>
        <p style={{ fontSize: "15px", color: "var(--text-secondary)", lineHeight: 1.7, marginBottom: "32px" }}>
          Comparación actualizada de los 8 principales bancos. Ordenadas de menor a mayor tasa para pie de 20%.
        </p>

        {/* Rate table */}
        <div style={{ overflowX: "auto", marginBottom: "32px" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "14px" }}>
            <thead>
              <tr style={{ borderBottom: "2px solid var(--accent)" }}>
                <th style={{ textAlign: "left", padding: "10px 12px", fontWeight: 700, color: "var(--text-primary)" }}>Banco</th>
                <th style={{ textAlign: "right", padding: "10px 12px", fontWeight: 700, color: "var(--text-primary)" }}>Pie 20%</th>
                <th style={{ textAlign: "right", padding: "10px 12px", fontWeight: 700, color: "var(--text-secondary)" }}>Pie 10-19%</th>
                <th style={{ textAlign: "right", padding: "10px 12px", fontWeight: 700, color: "var(--text-secondary)" }}>Pie 30%+</th>
                <th style={{ textAlign: "right", padding: "10px 12px", fontWeight: 700, color: "var(--text-secondary)" }}>Pie mín.</th>
              </tr>
            </thead>
            <tbody>
              {banks.map((b, i) => (
                <tr key={b.bank} style={{ borderBottom: "1px solid var(--border)", background: i === 0 ? "var(--accent-light)" : undefined }}>
                  <td style={{ padding: "10px 12px", fontWeight: 600 }}>{i === 0 && "⭐ "}{b.bank}</td>
                  <td style={{ padding: "10px 12px", textAlign: "right", fontWeight: 700, color: "var(--accent-dark)" }}>{b.rate20}</td>
                  <td style={{ padding: "10px 12px", textAlign: "right", color: "var(--text-secondary)" }}>{b.rate10}</td>
                  <td style={{ padding: "10px 12px", textAlign: "right", color: "var(--text-secondary)" }}>{b.rate30}</td>
                  <td style={{ padding: "10px 12px", textAlign: "right", color: "var(--text-secondary)" }}>{b.pie}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Analysis */}
        <h2 style={{ fontSize: "20px", fontWeight: 700, color: "var(--text-primary)", marginBottom: "12px" }}>📊 Análisis</h2>
        <div style={{ fontSize: "15px", color: "var(--text-secondary)", lineHeight: 1.8, marginBottom: "32px" }}>
          <p style={{ marginBottom: "16px" }}>
            <strong>Tendencia:</strong> Las tasas hipotecarias en Chile han mostrado una leve tendencia a la baja durante el primer semestre de 2026, siguiendo los recortes de la TPM por parte del Banco Central. Santander lidera con la tasa más competitiva (3.43% para pie de 20%), mientras que BancoEstado compensa su tasa más alta con el pie mínimo más bajo del mercado (10%).
          </p>
          <p style={{ marginBottom: "16px" }}>
            <strong>Recomendación:</strong> Si tienes 20% o más de pie, cotiza primero en Santander, Itaú y Scotiabank. Si solo tienes 10-15% de pie, BancoEstado y Banco de Chile son tus mejores opciones. Recuerda que las tasas son referenciales y pueden variar según tu perfil crediticio.
          </p>
          <p>
            <strong>Proyección segundo semestre:</strong> Si la TPM continúa bajando hacia 4.0-4.5%, esperamos que las tasas hipotecarias puedan llegar al rango de 3.0-3.5% para pie de 20% hacia fin de año, lo que mejoraría significativamente la capacidad de compra.
          </p>
        </div>

        {/* Impact calculator */}
        <div style={{ background: "var(--bg-secondary)", border: "1px solid var(--border)", borderRadius: "12px", padding: "20px", marginBottom: "32px" }}>
          <p style={{ fontSize: "14px", fontWeight: 700, color: "var(--text-primary)", marginBottom: "8px" }}>💡 ¿Qué significa para tu bolsillo?</p>
          <p style={{ fontSize: "14px", color: "var(--text-secondary)", lineHeight: 1.6, marginBottom: "12px" }}>
            Para una propiedad de UF 3.000 con 20% de pie, la diferencia entre la tasa más baja (Santander, 3.43%) y la más alta (BancoEstado, 4.19%) es de <strong>$58.000/mes</strong> en el dividendo — o <strong>$14 millones</strong> en 20 años.
          </p>
          <Link href="/herramientas/dividendo" style={{ display: "inline-block", padding: "10px 20px", background: "var(--accent)", color: "white", borderRadius: "8px", fontSize: "13px", fontWeight: 700, textDecoration: "none" }}>
            Calcula tu dividendo exacto →
          </Link>
        </div>

        {/* Newsletter CTA */}
        <RateAlertSignup />

        {/* Related */}
        <div style={{ marginTop: "32px", paddingTop: "24px", borderTop: "1px solid var(--border)" }}>
          <p style={{ fontSize: "13px", fontWeight: 700, color: "var(--text-secondary)", marginBottom: "12px", textTransform: "uppercase", letterSpacing: "0.04em" }}>Artículos relacionados</p>
          <Link href="/mercado/guia-comprar-primera-vivienda-santiago-2026" style={{ fontSize: "14px", color: "var(--accent)", textDecoration: "none", display: "block", marginBottom: "8px" }}>
            Guía completa: comprar tu primera vivienda en Santiago 2026 →
          </Link>
          <Link href="/mercado/mejores-comunas-invertir-santiago-2026" style={{ fontSize: "14px", color: "var(--accent)", textDecoration: "none", display: "block" }}>
            Mejores comunas para invertir en Santiago 2026 →
          </Link>
        </div>
      </article>
    </div>
  );
}
