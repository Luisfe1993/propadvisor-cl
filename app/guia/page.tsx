import type { Metadata } from "next";
import Link from "next/link";
import { GuiaSectionsWrapper } from "./GuiaSectionsWrapper";

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

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />

      {/* Breadcrumb */}
      <nav aria-label="Ruta de navegación" className="border-b border-[var(--border)]">
        <div className="max-w-6xl mx-auto px-6 py-3 text-sm text-[var(--text-secondary)]">
          <ol className="flex gap-2 list-none">
            <li><Link href="/" className="hover:text-[var(--accent)]">Inicio</Link></li>
            <li aria-hidden="true">/</li>
            <li aria-current="page" className="text-[var(--text-primary)] font-medium">Guía de compra en Chile</li>
          </ol>
        </div>
      </nav>

      {/* ── Hero ────────────────────────────────────────── */}
      <div className="relative overflow-hidden">
        {/* Gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-[var(--accent)]/5 via-white to-[var(--accent-light)]/30" />
        {/* Subtle grid pattern */}
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")" }} />

        <div className="relative max-w-6xl mx-auto px-6 pt-20 pb-24 sm:pt-28 sm:pb-32">
          <div className="max-w-3xl">
            {/* Badge */}
            <div className="mb-6 inline-flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full border border-[var(--border)] shadow-sm">
              <span className="w-2 h-2 bg-[var(--accent)] rounded-full animate-pulse" />
              <span className="text-[var(--accent)] text-sm font-semibold">Actualizada · {dateStr}</span>
            </div>

            <h1
              id="guia-heading"
              className="text-4xl sm:text-5xl lg:text-6xl font-black text-[var(--text-primary)] mb-6 tracking-tight leading-[1.1]"
              itemProp="headline"
            >
              La guía definitiva para comprar propiedad en Chile
            </h1>

            <p className="text-lg sm:text-xl text-[var(--text-secondary)] leading-relaxed max-w-2xl mb-10" itemProp="description">
              Crédito hipotecario, UF, pie, comparación de bancos, comprar vs arrendar, inversión y el proceso paso a paso. Todo lo que necesitas entender antes de firmar.
            </p>

            {/* Stats row */}
            <div className="flex flex-wrap gap-6 sm:gap-10">
              {[
                { value: "8", label: "bancos comparados" },
                { value: "60+", label: "comunas con datos" },
                { value: "20", label: "años de proyección" },
                { value: "3", label: "escenarios de análisis" },
              ].map((stat) => (
                <div key={stat.label} className="flex items-baseline gap-2">
                  <span className="text-2xl sm:text-3xl font-black text-[var(--accent)]">{stat.value}</span>
                  <span className="text-sm text-[var(--text-muted)]">{stat.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Disclaimer */}
      <div className="max-w-6xl mx-auto px-6 py-6">
        <div className="p-4 bg-amber-50 rounded-xl border border-amber-200 flex items-start gap-3">
          <span className="text-amber-500 flex-shrink-0 mt-0.5">⚠</span>
          <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
            <strong className="text-[var(--text-primary)]">Aviso importante:</strong> Esta guía es educativa. Los números son aproximaciones basadas en datos del mercado chileno de 2025-2026. No constituye asesoría financiera o legal. Antes de tomar una decisión de inversión, consulta un profesional.
          </p>
        </div>
      </div>

      {/* ── Main content: Sidebar + Sections ─────────── */}
      <article
        aria-labelledby="guia-heading"
        className="max-w-6xl mx-auto px-6 pb-20"
        itemScope
        itemType="https://schema.org/Article"
      >
        <GuiaSectionsWrapper />

        {/* ── Bottom CTA ──────────────────────────────── */}
        <div className="mt-20 p-8 sm:p-12 bg-gradient-to-br from-[var(--accent)] to-[var(--accent-dark)] rounded-2xl text-center relative overflow-hidden">
          {/* Background decoration */}
          <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23fff' fill-opacity='1' fill-rule='evenodd'%3E%3Ccircle cx='3' cy='3' r='3'/%3E%3Ccircle cx='13' cy='13' r='3'/%3E%3C/g%3E%3C/svg%3E\")" }} />

          <div className="relative">
            <h2 className="text-2xl sm:text-3xl font-black text-white mb-4 tracking-tight">
              ¿Listo para analizar tu propiedad?
            </h2>
            <p className="text-white/85 mb-8 max-w-lg mx-auto leading-relaxed">
              Aplica todo lo que aprendiste. Calcula tu dividendo real con datos de 8 bancos, compara escenarios a 20 años y decide con números.
            </p>
            <Link
              href="/calcular"
              className="inline-block bg-white text-[var(--accent)] px-8 py-4 rounded-xl font-bold text-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200"
            >
              Comenzar análisis gratis →
            </Link>
            <p className="text-white/50 text-sm mt-4">Sin registro · Sin tarjeta · Resultado en 2 minutos</p>
          </div>
        </div>
      </article>
    </>
  );
}
