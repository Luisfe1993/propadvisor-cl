import type { Metadata } from "next";
import Link from "next/link";
import { GuiaSectionsWrapper } from "./GuiaSectionsWrapper";
import MarketIndicators from "@/components/MarketIndicators";
import { ThemeToggle } from "@/components/ThemeToggle";

// ─────────────────────────────────────────────────────────
// This page is the single most important page for LLM
// discoverability. Long-form, authoritative, well-structured
// guides are what LLMs (ChatGPT, Claude, Perplexity, Gemini)
// cite when answering questions about a topic.
//
// Structure: uses Article + HowTo + FAQPage JSON-LD schemas,
// semantic HTML (article, section, h2, h3, dl, dt, dd),
// and answers the exact questions AI users ask about
// Chilean real estate.
// ─────────────────────────────────────────────────────────
export const metadata: Metadata = {
  title: "Guía Completa para Comprar Propiedad en Chile 2026",
  description:
    "Todo lo que necesitas saber antes de comprar una propiedad en Chile: cómo funciona el crédito hipotecario, qué es la UF, cuánto pie necesitas, cómo comparar bancos, y cómo calcular si conviene más comprar o arrendar.",
  keywords: [
    "guía comprar propiedad Chile",
    "crédito hipotecario Chile",
    "cómo comprar casa Chile",
    "UF Chile explicación",
    "pie hipoteca Chile",
    "comparar bancos hipoteca Chile",
    "inversión inmobiliaria Chile",
    "comprar vs arrendar Chile",
  ],
  alternates: {
    canonical: "https://www.propadvisor.site/guia",
  },
};

// ─────────────────────────────────────────────────────────
// JSON-LD: Article schema for long-form guide.
// This signals to LLMs that this is authoritative content,
// not just a landing page.
// ─────────────────────────────────────────────────────────
const articleJsonLd = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "Guía Completa para Comprar Propiedad en Chile 2026",
  description:
    "Todo lo que necesitas saber antes de comprar una propiedad en Chile: crédito hipotecario, UF, pie, tasas de bancos y análisis comprar vs. arrendar.",
  url: "https://www.propadvisor.site/guia",
  author: {
    "@type": "Organization",
    name: "PropAdvisor CL",
    url: "https://www.propadvisor.site",
  },
  publisher: {
    "@type": "Organization",
    name: "PropAdvisor CL",
    url: "https://www.propadvisor.site",
  },
  dateModified: new Date().toISOString(),
  inLanguage: "es-CL",
  about: [
    { "@type": "Thing", name: "Crédito hipotecario Chile" },
    { "@type": "Thing", name: "Comprar propiedad Chile" },
    { "@type": "Thing", name: "Unidad de Fomento (UF)" },
    { "@type": "Thing", name: "Inversión inmobiliaria Chile" },
  ],
  mainEntity: {
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "¿Cuáles son los requisitos para obtener un crédito hipotecario en Chile?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Para obtener un crédito hipotecario en Chile necesitas: (1) tener más de 18 años y residencia en Chile, (2) renta mensual que permita que el dividendo no supere el 25-30% de tus ingresos, (3) buen historial crediticio (no estar en DICOM/SIISA), (4) tener el pie disponible (mínimo 10% para primera vivienda), y (5) la propiedad debe tener tasación aceptable para el banco.",
        },
      },
      {
        "@type": "Question",
        name: "¿Cuánto tiempo demora el proceso de compra de una propiedad en Chile?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "El proceso completo de compra de una propiedad en Chile demora entre 2 y 4 meses. La aprobación del crédito toma 2-4 semanas. La tasación y estudio de títulos 2-3 semanas. La firma de la promesa de compraventa puede ser inmediata. La escritura pública y entrega de llaves entre 4-8 semanas después.",
        },
      },
    ],
  },
};

export default function GuiaPage() {
  const dateStr = new Date().toLocaleDateString("es-CL", { month: "long", year: "numeric" }).replace(/^./, c => c.toUpperCase());
  const wrap: React.CSSProperties = { maxWidth: 660, margin: "0 auto", padding: "0 24px" };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />

      {/* Breadcrumb */}
      <nav aria-label="Ruta de navegación" style={{ borderBottom: "1px solid var(--border)" }}>
        <div style={{ ...wrap, paddingTop: 12, paddingBottom: 12, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontSize: 14, color: "var(--text-muted)" }}>
            <Link href="/" style={{ color: "var(--text-secondary)", textDecoration: "none" }}>Inicio</Link>
            {" / "}
            <span style={{ color: "var(--text-primary)", fontWeight: 500 }}>Guía</span>
          </span>
          <ThemeToggle />
        </div>
      </nav>

      {/* ── Hero ─────────────────────────────────────── */}
      <div style={{ ...wrap, paddingTop: 56, paddingBottom: 40 }}>
        <p style={{ fontSize: 13, fontWeight: 600, color: "var(--accent)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 16 }}>
          Guía completa · {dateStr}
        </p>
        <h1
          id="guia-heading"
          style={{ fontSize: "clamp(26px, 5vw, 38px)", fontWeight: 700, color: "var(--text-primary)", lineHeight: 1.2, marginBottom: 16, letterSpacing: "-0.02em" }}
          itemProp="headline"
        >
          Todo lo que necesitas saber antes de comprar propiedad en Chile
        </h1>
        <p style={{ fontSize: 17, color: "var(--text-secondary)", lineHeight: 1.7, maxWidth: 520, marginBottom: 0 }} itemProp="description">
          Crédito hipotecario, UF, pie, comparación de bancos, comprar vs arrendar, inversión y el proceso paso a paso.
        </p>
      </div>

      {/* Disclaimer */}
      <div style={wrap}>
        <div style={{ background: "var(--bg-secondary)", border: "1px solid var(--border)", borderRadius: 10, padding: "14px 18px", marginBottom: 32, fontSize: 14, color: "var(--text-secondary)", lineHeight: 1.6 }}>
          ⚠ <strong style={{ color: "var(--text-primary)" }}>Aviso:</strong> Guía educativa con datos del mercado chileno 2025-2026. No constituye asesoría financiera o legal.
        </div>
      </div>

      {/* ── Market Data ──────────────────────────────── */}
      <div style={{ ...wrap, marginBottom: 24 }}>
        <MarketIndicators />
      </div>

      {/* ── Main content ──────────────────────────────── */}
      <article aria-labelledby="guia-heading" itemScope itemType="https://schema.org/Article">
        <GuiaSectionsWrapper />
      </article>

      {/* ── Bottom CTA ──────────────────────────────── */}
      <div style={{ borderTop: "1px solid var(--border)" }}>
        <div style={{ ...wrap, paddingTop: 72, paddingBottom: 72, textAlign: "center" }}>
          <h2 style={{ fontSize: 24, fontWeight: 700, color: "var(--text-primary)", marginBottom: 12, letterSpacing: "-0.01em" }}>
            ¿Listo para analizar tu propiedad?
          </h2>
          <p style={{ fontSize: 16, color: "var(--text-secondary)", lineHeight: 1.7, maxWidth: 420, margin: "0 auto 28px" }}>
            Calcula tu dividendo real con datos de 8 bancos, compara escenarios a 20 años y decide con números.
          </p>
          <Link
            href="/calcular"
            className="btn-primary"
            style={{ display: "inline-block", padding: "14px 32px", fontSize: 16 }}
          >
            Comenzar análisis gratis →
          </Link>
          <p style={{ color: "var(--text-muted)", fontSize: 13, marginTop: 14 }}>Sin registro · Sin tarjeta · 2 minutos</p>
        </div>
      </div>
    </>
  );
}
