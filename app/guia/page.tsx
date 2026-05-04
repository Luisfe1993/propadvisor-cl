import type { Metadata } from "next";
import Link from "next/link";
import { GuiaAccordion } from "./GuiaAccordion";

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
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />

      {/* Breadcrumb */}
      <nav aria-label="Ruta de navegación" className="border-b border-[var(--border)]">
        <div className="max-w-5xl mx-auto px-6 py-3 text-sm text-[var(--text-secondary)]">
          <ol className="flex gap-2 list-none">
            <li><Link href="/" className="hover:text-[var(--accent)]">Inicio</Link></li>
            <li aria-hidden="true">/</li>
            <li aria-current="page" className="text-[var(--text-primary)] font-medium">Guía de compra en Chile</li>
          </ol>
        </div>
      </nav>

      {/* Hero section */}
      <div className="bg-gradient-to-b from-[var(--bg-secondary)] to-white">
        <div className="max-w-5xl mx-auto px-6 pt-16 pb-20">
          <div className="flex flex-col md:flex-row md:items-center gap-10 md:gap-16">
            <div className="flex-1">
              <div className="mb-6 inline-block px-3 py-1.5 bg-[var(--accent-light)] rounded-full">
                <span className="text-[var(--accent)] text-sm font-semibold">Guía actualizada · {new Date().toLocaleDateString("es-CL", { month: "long", year: "numeric" }).replace(/^./, c => c.toUpperCase())}</span>
              </div>
              <h1
                id="guia-heading"
                className="text-4xl sm:text-5xl font-bold text-[var(--text-primary)] mb-8 leading-[1.15]"
                itemProp="headline"
              >
                Guía completa para comprar propiedad en Chile
              </h1>
              <p className="text-lg text-[var(--text-secondary)] leading-relaxed max-w-xl" itemProp="description">
                Todo lo que necesitas entender antes de firmar: cómo funciona el crédito hipotecario,
                qué es la UF, cuánto pie necesitas, cómo comparar bancos y cómo saber si conviene
                más comprar o arrendar en tu situación específica.
              </p>
            </div>
            {/* Illustration */}
            <div className="hidden md:flex flex-shrink-0 w-64 h-64 items-center justify-center">
              <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-lg">
                <rect x="45" y="90" width="110" height="80" rx="6" fill="var(--accent)" opacity="0.12" stroke="var(--accent)" strokeWidth="2" />
                <path d="M30 95 L100 35 L170 95" stroke="var(--accent)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="var(--accent)" fillOpacity="0.08" />
                <rect x="85" y="120" width="30" height="50" rx="4" fill="var(--accent)" opacity="0.25" />
                <circle cx="109" cy="147" r="2.5" fill="var(--accent)" />
                <rect x="55" y="105" width="22" height="22" rx="3" fill="white" stroke="var(--accent)" strokeWidth="1.5" />
                <line x1="66" y1="105" x2="66" y2="127" stroke="var(--accent)" strokeWidth="1" />
                <line x1="55" y1="116" x2="77" y2="116" stroke="var(--accent)" strokeWidth="1" />
                <rect x="123" y="105" width="22" height="22" rx="3" fill="white" stroke="var(--accent)" strokeWidth="1.5" />
                <line x1="134" y1="105" x2="134" y2="127" stroke="var(--accent)" strokeWidth="1" />
                <line x1="123" y1="116" x2="145" y2="116" stroke="var(--accent)" strokeWidth="1" />
                <rect x="130" y="45" width="16" height="30" rx="2" fill="var(--accent)" opacity="0.18" stroke="var(--accent)" strokeWidth="1.5" />
                <path d="M138 42 Q142 32 138 22" stroke="var(--accent)" strokeWidth="1.5" strokeLinecap="round" fill="none" opacity="0.3" />
                <path d="M140 40 Q145 28 140 18" stroke="var(--accent)" strokeWidth="1" strokeLinecap="round" fill="none" opacity="0.2" />
                <line x1="20" y1="170" x2="180" y2="170" stroke="var(--accent)" strokeWidth="1.5" opacity="0.2" />
                <circle cx="25" cy="140" r="14" fill="var(--accent)" opacity="0.15" />
                <circle cx="20" cy="148" r="10" fill="var(--accent)" opacity="0.1" />
                <rect x="23" y="152" width="4" height="18" rx="2" fill="var(--accent)" opacity="0.2" />
                <circle cx="172" cy="155" r="8" stroke="var(--accent)" strokeWidth="2" fill="white" />
                <line x1="172" y1="163" x2="172" y2="180" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round" />
                <line x1="172" y1="173" x2="177" y2="173" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round" />
                <line x1="172" y1="178" x2="177" y2="178" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      <article
        aria-labelledby="guia-heading"
        className="max-w-5xl mx-auto px-6 pb-20"
        itemScope
        itemType="https://schema.org/Article"
      >
        {/* Disclaimer */}
        <div className="py-6">
          <div className="p-5 bg-amber-50 rounded-xl border border-amber-200">
            <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
              <strong className="text-[var(--text-primary)]">⚠ Aviso importante:</strong> Esta guía es educativa. Los números son aproximaciones basadas en datos del mercado chileno de 2025-2026. No constituye asesoría financiera o legal. Antes de tomar una decisión de inversión, consulta un profesional.
            </p>
          </div>
        </div>

        {/* Table of contents */}
        <nav aria-label="Tabla de contenidos" className="my-10 p-8 bg-[var(--bg-secondary)] rounded-2xl border border-[var(--border)]">
          <p className="font-bold text-[var(--text-primary)] text-lg mb-6">En esta guía</p>
          <ol className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4 text-sm">
            <li><a href="#credito-hipotecario" className="text-[var(--accent)] hover:underline flex gap-2"><span className="text-[var(--text-secondary)]">01</span> ¿Cómo funciona el crédito hipotecario?</a></li>
            <li><a href="#que-es-uf" className="text-[var(--accent)] hover:underline flex gap-2"><span className="text-[var(--text-secondary)]">02</span> ¿Qué es la UF y cómo afecta tu dividendo?</a></li>
            <li><a href="#pie" className="text-[var(--accent)] hover:underline flex gap-2"><span className="text-[var(--text-secondary)]">03</span> El pie: cuánto necesitas</a></li>
            <li><a href="#comparar-bancos" className="text-[var(--accent)] hover:underline flex gap-2"><span className="text-[var(--text-secondary)]">04</span> Cómo comparar los bancos</a></li>
            <li><a href="#comprar-vs-arrendar" className="text-[var(--accent)] hover:underline flex gap-2"><span className="text-[var(--text-secondary)]">05</span> ¿Comprar o arrendar?</a></li>
            <li><a href="#inversión" className="text-[var(--accent)] hover:underline flex gap-2"><span className="text-[var(--text-secondary)]">06</span> Rentabilidad real</a></li>
            <li><a href="#comunas" className="text-[var(--accent)] hover:underline flex gap-2"><span className="text-[var(--text-secondary)]">07</span> Mejores comunas en Santiago</a></li>
            <li><a href="#proceso" className="text-[var(--accent)] hover:underline flex gap-2"><span className="text-[var(--text-secondary)]">08</span> Proceso paso a paso</a></li>
          </ol>
        </nav>

        {/* Accordion sections */}
        <div className="mt-16">
          <GuiaAccordion />
        </div>

        {/* CTA */}
        <div className="mt-20 p-10 bg-[var(--accent)] rounded-2xl text-center">
          <h2 className="text-2xl font-bold text-white mb-4">
            ¿Listo para analizar tu propiedad?
          </h2>
          <p className="text-white/90 mb-8 max-w-lg mx-auto">
            Aplica todo lo que aprendiste en esta guía con PropAdvisor. Calcula tu dividendo real, compara bancos y decide con datos.
          </p>
          <Link
            href="/calcular"
            className="inline-block bg-white text-[var(--accent)] px-8 py-3 rounded-lg font-bold hover:shadow-lg transition-shadow"
          >
            Comenzar análisis gratis →
          </Link>
        </div>
      </article>
    </>
  );
}
