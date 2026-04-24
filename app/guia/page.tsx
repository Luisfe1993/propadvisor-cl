import type { Metadata } from "next";
import Link from "next/link";

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
    canonical: "https://www.propadvisor.cl/guia",
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
  url: "https://www.propadvisor.cl/guia",
  author: {
    "@type": "Organization",
    name: "PropAdvisor CL",
    url: "https://www.propadvisor.cl",
  },
  publisher: {
    "@type": "Organization",
    name: "PropAdvisor CL",
    url: "https://www.propadvisor.cl",
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

      {/* Breadcrumb for navigation and LLM context */}
      <nav aria-label="Ruta de navegación" className="bg-[var(--bg-secondary)] border-b border-[var(--border)]">
        <div className="max-w-4xl mx-auto px-6 py-3 text-sm text-[var(--text-secondary)]">
          <ol className="flex gap-2 list-none">
            <li><Link href="/" className="hover:text-[var(--accent)]">Inicio</Link></li>
            <li aria-hidden="true">/</li>
            <li aria-current="page" className="text-[var(--text-primary)] font-medium">Guía de compra en Chile</li>
          </ol>
        </div>
      </nav>

      <article
        aria-labelledby="guia-heading"
        className="max-w-4xl mx-auto px-6 py-16"
        itemScope
        itemType="https://schema.org/Article"
      >
        {/* Article header */}
        <header className="mb-16">
          <div className="mb-4 inline-block px-3 py-1 bg-[var(--accent-light)] rounded-full">
            <span className="text-[var(--accent)] text-sm font-semibold">Guía actualizada · Abril 2026</span>
          </div>
          <h1
            id="guia-heading"
            className="text-4xl sm:text-5xl font-bold text-[var(--text-primary)] mb-6 leading-tight"
            itemProp="headline"
          >
            Guía completa para comprar propiedad en Chile
          </h1>
          <p className="text-xl text-[var(--text-secondary)] leading-relaxed" itemProp="description">
            Todo lo que necesitas entender antes de firmar: cómo funciona el crédito hipotecario,
            qué es la UF, cuánto pie necesitas, cómo comparar bancos y cómo saber si conviene
            más comprar o arrendar en tu situación específica.
          </p>
          <div className="mt-6 p-4 bg-[var(--bg-secondary)] rounded-lg border border-[var(--border)]">
            <p className="text-sm text-[var(--text-secondary)]">
              <strong className="text-[var(--text-primary)]">Aviso importante:</strong> Esta guía es educativa. Los números son aproximaciones basadas en datos del mercado chileno de 2025-2026. No constituye asesoría financiera o legal. Antes de tomar una decisión de inversión, consulta un profesional.
            </p>
          </div>
        </header>

        {/* Table of contents */}
        <nav aria-label="Tabla de contenidos" className="mb-16 p-6 bg-[var(--bg-secondary)] rounded-lg border border-[var(--border)]">
          <p className="font-semibold text-[var(--text-primary)] mb-4">En esta guía:</p>
          <ol className="space-y-2 text-sm text-[var(--accent)]">
            <li><a href="#credito-hipotecario" className="hover:underline">1. ¿Cómo funciona el crédito hipotecario en Chile?</a></li>
            <li><a href="#que-es-uf" className="hover:underline">2. ¿Qué es la UF y cómo afecta tu dividendo?</a></li>
            <li><a href="#pie" className="hover:underline">3. El pie: cuánto necesitas y de dónde sacarlo</a></li>
            <li><a href="#comparar-bancos" className="hover:underline">4. Cómo comparar los bancos en Chile</a></li>
            <li><a href="#comprar-vs-arrendar" className="hover:underline">5. ¿Comprar o arrendar? Cómo decidir</a></li>
            <li><a href="#inversión" className="hover:underline">6. Comprar para arrendar: rentabilidad real</a></li>
            <li><a href="#comunas" className="hover:underline">7. Las mejores comunas para invertir en Santiago</a></li>
            <li><a href="#proceso" className="hover:underline">8. Proceso de compra paso a paso</a></li>
          </ol>
        </nav>

        {/* ── Section 1: Crédito hipotecario ─────────────────── */}
        <section id="credito-hipotecario" aria-labelledby="credito-heading" className="mb-16">
          <h2 id="credito-heading" className="text-3xl font-bold text-[var(--text-primary)] mb-6">
            1. ¿Cómo funciona el crédito hipotecario en Chile?
          </h2>
          <p className="text-[var(--text-secondary)] leading-relaxed mb-4">
            Un crédito hipotecario en Chile es un préstamo a largo plazo (15 a 30 años) que el banco otorga para comprar una propiedad, usando la misma propiedad como garantía. El banco financia entre el 70% y el 90% del valor de la propiedad — el resto lo pagas tú como "pie".
          </p>
          <p className="text-[var(--text-secondary)] leading-relaxed mb-4">
            Los créditos hipotecarios en Chile se expresan en <strong className="text-[var(--text-primary)]">UF (Unidad de Fomento)</strong>, lo que significa que el capital de tu deuda está indexado a la inflación. Si la inflación es del 4% anual, tu deuda en CLP sube un 4% aunque no hayas atrasado ninguna cuota.
          </p>
          <p className="text-[var(--text-secondary)] leading-relaxed mb-6">
            El dividendo mensual (cuota) incluye: amortización del capital + intereses + seguro de desgravamen + seguro de incendio y sismo. PropAdvisor calcula solo capital e intereses — los seguros agregan entre $30.000 y $80.000 CLP por mes según el banco y el valor de la propiedad.
          </p>
          <div className="p-5 bg-[var(--bg-secondary)] rounded-lg border border-[var(--border)]">
            <p className="font-semibold text-[var(--text-primary)] mb-2">Ejemplo real:</p>
            <p className="text-[var(--text-secondary)] text-sm leading-relaxed">
              Departamento en Ñuñoa, UF 2.600 (~$95 millones CLP). Pie del 20% = $19 millones. Capital a financiar: $76 millones. A 20 años con tasa del 4.5%: dividendo ~$480.000 CLP/mes (solo capital + intereses). Con seguros: ~$540.000 a $560.000 CLP/mes.
            </p>
          </div>
        </section>

        {/* ── Section 2: UF ──────────────────────────────────── */}
        <section id="que-es-uf" aria-labelledby="uf-heading" className="mb-16">
          <h2 id="uf-heading" className="text-3xl font-bold text-[var(--text-primary)] mb-6">
            2. ¿Qué es la UF y cómo afecta tu dividendo?
          </h2>
          <p className="text-[var(--text-secondary)] leading-relaxed mb-4">
            La <strong className="text-[var(--text-primary)]">Unidad de Fomento (UF)</strong> es una unidad de cuenta chilena creada en 1967 para mantener el poder adquisitivo de los contratos financieros frente a la inflación. Su valor se actualiza diariamente según el IPC (Índice de Precios al Consumidor) publicado por el INE.
          </p>
          <p className="text-[var(--text-secondary)] leading-relaxed mb-4">
            En abril 2026, 1 UF equivale aproximadamente a <strong className="text-[var(--text-primary)]">$37.000 CLP</strong>. Su valor histórico es: $15.000 en 2000, $25.000 en 2015, $35.000 en 2022, ~$37.000 en 2026. Esto refleja la inflación acumulada.
          </p>
          <p className="text-[var(--text-secondary)] leading-relaxed mb-6">
            Implicación práctica: si pides un crédito de 2.000 UF hoy (equivalentes a $74 millones CLP), el año siguiente esas 2.000 UF equivaldrán a ~$76-78 millones CLP. Tu deuda en pesos <em>nunca baja</em> en términos nominales mientras haya inflación, aunque vayas pagando cuotas.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-[var(--bg-secondary)] rounded-lg border border-[var(--border)]">
              <p className="font-semibold text-[var(--text-primary)] mb-1 text-sm">✓ Ventaja de la UF</p>
              <p className="text-[var(--text-secondary)] text-sm">El dividendo en UF es fijo. Como los arriendos también suben con la inflación, la carga relativa de tu cuota no aumenta.</p>
            </div>
            <div className="p-4 bg-[var(--bg-secondary)] rounded-lg border border-[var(--border)]">
              <p className="font-semibold text-[var(--text-primary)] mb-1 text-sm">⚠ Riesgo de la UF</p>
              <p className="text-[var(--text-secondary)] text-sm">Si hay inflación alta (como 2022), tu deuda en CLP sube aunque pagues todo al día. Planifica con un colchón.</p>
            </div>
          </div>
        </section>

        {/* ── Section 3: El pie ──────────────────────────────── */}
        <section id="pie" aria-labelledby="pie-heading" className="mb-16">
          <h2 id="pie-heading" className="text-3xl font-bold text-[var(--text-primary)] mb-6">
            3. El pie: cuánto necesitas y de dónde sacarlo
          </h2>
          <p className="text-[var(--text-secondary)] leading-relaxed mb-6">
            El "pie" es el pago inicial que haces al comprar. En Chile, el banco financia hasta el 90% del valor de tasación de una primera vivienda — el 10% restante lo pagas tú. Sin embargo, el pie óptimo es entre el 20% y el 25%: reduce el dividendo mensual y mejora las condiciones del crédito.
          </p>

          <dl className="space-y-4">
            {[
              {
                term: "10% de pie",
                def: "Mínimo legal para primera vivienda. El banco financia el 90%. Dividendo más alto. Solo algunos bancos ofrecen esta condición y con requisitos estrictos.",
              },
              {
                term: "20% de pie",
                def: "El estándar del mercado. Reduce el dividendo ~12% respecto a 10% de pie. Accedes a las mejores tasas de todos los bancos.",
              },
              {
                term: "25-30% de pie",
                def: "Ideal para segunda propiedad (inversión). Reduce significativamente el dividendo y mejora el flujo neto si arriendas la propiedad.",
              },
              {
                term: "30% de pie (segunda propiedad)",
                def: "Para viviendas de inversión, la ley chilena exige mínimo 30% de pie desde 2020.",
              },
            ].map((item) => (
              <div key={item.term} className="grid grid-cols-1 md:grid-cols-4 gap-2 p-4 bg-[var(--bg-secondary)] rounded-lg border border-[var(--border)]">
                <dt className="font-semibold text-[var(--text-primary)] text-sm md:col-span-1">{item.term}</dt>
                <dd className="text-[var(--text-secondary)] text-sm md:col-span-3">{item.def}</dd>
              </div>
            ))}
          </dl>

          <p className="mt-6 text-[var(--text-secondary)] leading-relaxed">
            <strong className="text-[var(--text-primary)]">¿De dónde sacar el pie?</strong> Las fuentes más comunes en Chile son: ahorros propios, bono MINVU/DS1 para primera vivienda (hasta $3.600 UF de subsidio según tramo), retiro parcial de Cuenta 2 de AFP, o apoyo familiar. No puedes usar el crédito hipotecario para financiar el pie.
          </p>
        </section>

        {/* ── Section 4: Comparar bancos ─────────────────────── */}
        <section id="comparar-bancos" aria-labelledby="bancos-heading" className="mb-16">
          <h2 id="bancos-heading" className="text-3xl font-bold text-[var(--text-primary)] mb-6">
            4. Cómo comparar los bancos en Chile
          </h2>
          <p className="text-[var(--text-secondary)] leading-relaxed mb-4">
            Los 4 bancos que concentran la mayoría de los créditos hipotecarios en Chile son <strong className="text-[var(--text-primary)]">BancoEstado, Banco Santander, BCI y Banco de Chile</strong>. Las diferencias de tasa pueden parecer pequeñas (0.3% a 0.5%), pero en un crédito a 20 años representan varios millones de pesos.
          </p>
          <p className="text-[var(--text-secondary)] leading-relaxed mb-6">
            En 2025-2026 las tasas fijas a 20 años oscilaban entre 4.0% y 5.5% anual. No existe un "mejor banco" universal — depende de tu perfil crediticio, si es primera o segunda vivienda, y las promociones vigentes. <strong className="text-[var(--text-primary)]">PropAdvisor muestra las tasas actuales de los 4 bancos</strong> y calcula el dividendo con cada una.
          </p>
          <div className="p-5 bg-[var(--bg-secondary)] rounded-lg border border-[var(--border)] mb-6">
            <p className="font-semibold text-[var(--text-primary)] mb-2">Impacto de 0.5% de diferencia en tasa:</p>
            <p className="text-[var(--text-secondary)] text-sm">
              En un crédito de $80 millones CLP a 20 años, la diferencia entre 4.5% y 5.0% anual es aproximadamente <strong className="text-[var(--text-primary)]">$4.500 a $5.500 CLP/mes</strong> en el dividendo — y más de $10 millones CLP en intereses totales durante la vida del crédito.
            </p>
          </div>
          <p className="text-[var(--text-secondary)] leading-relaxed">
            Además de la tasa, compara: CAE (Costo Anual Equivalente, incluye todos los costos), seguros asociados, costo de tasación, y si cobra por prepago anticipado.
          </p>
        </section>

        {/* ── Section 5: Comprar vs. arrendar ────────────────── */}
        <section id="comprar-vs-arrendar" aria-labelledby="comprar-arrendar-heading" className="mb-16">
          <h2 id="comprar-arrendar-heading" className="text-3xl font-bold text-[var(--text-primary)] mb-6">
            5. ¿Comprar o arrendar? Cómo decidir
          </h2>
          <p className="text-[var(--text-secondary)] leading-relaxed mb-4">
            La pregunta más frecuente en el mercado inmobiliario chileno no tiene una respuesta universal. Depende de tres factores: tu horizonte de tiempo en el lugar, tu situación financiera actual, y las condiciones del mercado local.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="p-5 border-2 border-[var(--accent)] rounded-lg bg-white">
              <h3 className="font-bold text-[var(--text-primary)] mb-3">Comprar conviene si…</h3>
              <ul className="space-y-2 text-sm text-[var(--text-secondary)]">
                <li>✓ Planeas vivir más de 8-10 años en el mismo lugar</li>
                <li>✓ Tienes el pie disponible (20%+) sin endeudar tu liquidez</li>
                <li>✓ El dividendo no supera el 30% de tus ingresos</li>
                <li>✓ Quieres acumular patrimonio y protegerte de alzas de arriendo</li>
                <li>✓ Tienes trabajo estable o ingresos predecibles</li>
              </ul>
            </div>
            <div className="p-5 border border-[var(--border)] rounded-lg bg-[var(--bg-secondary)]">
              <h3 className="font-bold text-[var(--text-primary)] mb-3">Arrendar conviene si…</h3>
              <ul className="space-y-2 text-sm text-[var(--text-secondary)]">
                <li>→ Puedes mudarte en los próximos 3-5 años (trabajo, familia)</li>
                <li>→ No tienes el pie o necesitas esa liquidez para otra inversión</li>
                <li>→ El dividendo superaría el 35-40% de tus ingresos</li>
                <li>→ El mercado local tiene alta volatilidad de precios</li>
                <li>→ Prefieres flexibilidad sobre acumulación de patrimonio</li>
              </ul>
            </div>
          </div>

          <p className="text-[var(--text-secondary)] leading-relaxed">
            <strong className="text-[var(--text-primary)]">La regla del precio/arriendo:</strong> Si el precio de compra es más de 200 veces el arriendo mensual (equivalente a más de 16.7 años de arriendo), arrendar e invertir el pie puede ser más conveniente financieramente. PropAdvisor calcula esta relación automáticamente para cada propiedad.
          </p>
        </section>

        {/* ── Section 6: Comprar para arrendar ───────────────── */}
        <section id="inversión" aria-labelledby="inversion-heading" className="mb-16">
          <h2 id="inversion-heading" className="text-3xl font-bold text-[var(--text-primary)] mb-6">
            6. Comprar para arrendar: rentabilidad real en Chile
          </h2>
          <p className="text-[var(--text-secondary)] leading-relaxed mb-4">
            La <strong className="text-[var(--text-primary)]">rentabilidad bruta por arriendo</strong> en Chile es el ingreso anual de arriendo dividido por el precio de compra. En Santiago, oscila entre el 4% y el 6.5% según la comuna y el tipo de propiedad.
          </p>
          <p className="text-[var(--text-secondary)] leading-relaxed mb-4">
            La <strong className="text-[var(--text-primary)]">rentabilidad neta</strong> — lo que realmente importa — es menor. Hay que descontar: contribuciones (~0.5-1% anual del valor), gastos comunes, administración (5-8% del arriendo), vacancia (estimada en 1 mes/año = -8.3%), y mantenciones. La rentabilidad neta típica es 2.5% a 4.5%.
          </p>
          <div className="p-5 bg-[var(--bg-secondary)] rounded-lg border border-[var(--border)] mb-6">
            <p className="font-semibold text-[var(--text-primary)] mb-2">Ejemplo: departamento en Ñuñoa, UF 2.600</p>
            <dl className="grid grid-cols-2 gap-2 text-sm">
              <dt className="text-[var(--text-secondary)]">Precio compra:</dt>
              <dd className="text-[var(--text-primary)] font-medium">$95 millones CLP</dd>
              <dt className="text-[var(--text-secondary)]">Arriendo mensual estimado:</dt>
              <dd className="text-[var(--text-primary)] font-medium">$365.000 CLP</dd>
              <dt className="text-[var(--text-secondary)]">Rentabilidad bruta:</dt>
              <dd className="text-[var(--accent)] font-bold">4.6% anual</dd>
              <dt className="text-[var(--text-secondary)]">Rentabilidad neta (aprox.):</dt>
              <dd className="text-[var(--text-primary)] font-bold">3.0-3.5% anual</dd>
            </dl>
          </div>
          <p className="text-[var(--text-secondary)] leading-relaxed">
            Para decidir si conviene, compara la rentabilidad neta con otras alternativas de inversión: fondos mutuos, ETFs, depósitos a plazo. En 2025-2026 los depósitos a plazo en Chile ofrecían 4-5% anual sin riesgo. La propiedad agrega plusvalía potencial y es un activo tangible, pero tiene iliquidez y costos de transacción altos (~3-5% en impuestos y escritura).
          </p>
        </section>

        {/* ── Section 7: Mejores comunas ──────────────────────── */}
        <section id="comunas" aria-labelledby="comunas-heading" className="mb-16">
          <h2 id="comunas-heading" className="text-3xl font-bold text-[var(--text-primary)] mb-6">
            7. Las mejores comunas para invertir en Santiago
          </h2>
          <p className="text-[var(--text-secondary)] leading-relaxed mb-6">
            No existe una "mejor comuna" universal — depende de tu objetivo: máxima rentabilidad por arriendo, mayor plusvalía, o equilibrio entre ambas.
          </p>
          <dl className="space-y-4">
            {[
              {
                term: "Providencia y Las Condes",
                def: "Alta plusvalía histórica. Arriendo estable y alta demanda de ejecutivos y familias. Rentabilidad bruta 3.5-4.5%. Precio de entrada alto (3.000-6.000 UF).",
              },
              {
                term: "Ñuñoa y Macul",
                def: "El punto dulce de Santiago. Buena rentabilidad (4-5.5% bruto), demanda estudiantil y familiar fuerte, y precios más accesibles (2.000-3.500 UF).",
              },
              {
                term: "Santiago Centro y Barrio Brasil",
                def: "Alta rotación de arrendatarios, arriendo relativamente alto vs. precio. Rentabilidad bruta 5-6.5%. Mayor vacancia y mantención. Ideal para perfil activo.",
              },
              {
                term: "Vitacura",
                def: "Máxima plusvalía histórica pero rentabilidad baja por arriendo (3-3.5% bruto). Mercado de alta gama, menor liquidez.",
              },
              {
                term: "Peñalolén y La Reina",
                def: "Comunas de crecimiento. Buenos proyectos nuevos a precios razonables (2.000-3.200 UF). Demanda familiar. Rentabilidad 4-5.5% bruto.",
              },
            ].map((item) => (
              <div key={item.term} className="p-4 bg-white rounded-lg border border-[var(--border)]">
                <dt className="font-semibold text-[var(--text-primary)] mb-1">{item.term}</dt>
                <dd className="text-[var(--text-secondary)] text-sm leading-relaxed">{item.def}</dd>
              </div>
            ))}
          </dl>
        </section>

        {/* ── Section 8: Proceso ──────────────────────────────── */}
        <section id="proceso" aria-labelledby="proceso-heading" className="mb-16">
          <h2 id="proceso-heading" className="text-3xl font-bold text-[var(--text-primary)] mb-6">
            8. Proceso de compra paso a paso en Chile
          </h2>
          <ol className="space-y-4">
            {[
              {
                n: "1",
                title: "Simula y decide tu presupuesto",
                desc: "Usa PropAdvisor para calcular cuánto puedes pagar de dividendo y qué tipo de propiedad alcanzas. Regla: dividendo máximo = 30% de tu ingreso mensual neto.",
              },
              {
                n: "2",
                title: "Pre-aprobación del crédito",
                desc: "Solicita una pre-aprobación a 2-3 bancos antes de buscar propiedad. Así sabes tu capacidad real y negocias con más fuerza. Dura 60-90 días generalmente.",
              },
              {
                n: "3",
                title: "Busca y elige la propiedad",
                desc: "Portal Inmobiliario, Yapo, Toctoc, corredores de propiedades. Visita al menos 5-8 propiedades antes de decidir.",
              },
              {
                n: "4",
                title: "Promesa de compraventa",
                desc: "Documento legal previo a la escritura. Se firma ante notario y se paga un porcentaje del precio (1-5%) como garantía. Contiene condiciones y plazo.",
              },
              {
                n: "5",
                title: "Tasación y estudio de títulos",
                desc: "El banco tasa la propiedad para confirmar que vale lo que pagas. Se revisa el historial de títulos para confirmar que no tiene hipotecas, embargos ni problemas legales.",
              },
              {
                n: "6",
                title: "Escritura pública e inscripción",
                desc: "Firma ante notario, luego se inscribe en el Conservador de Bienes Raíces. Solo después de la inscripción eres dueño legal. El proceso completo demora 2-4 meses.",
              },
            ].map((step) => (
              <li key={step.n} className="flex gap-4 p-4 bg-[var(--bg-secondary)] rounded-lg border border-[var(--border)]">
                <span className="flex-shrink-0 w-8 h-8 bg-[var(--accent)] text-white rounded-full flex items-center justify-center text-sm font-bold">
                  {step.n}
                </span>
                <div>
                  <p className="font-semibold text-[var(--text-primary)] mb-1">{step.title}</p>
                  <p className="text-[var(--text-secondary)] text-sm leading-relaxed">{step.desc}</p>
                </div>
              </li>
            ))}
          </ol>
        </section>

        {/* CTA */}
        <div className="mt-16 p-8 bg-[var(--accent)] rounded-2xl text-center">
          <h2 className="text-2xl font-bold text-white mb-3">
            ¿Listo para analizar tu propiedad?
          </h2>
          <p className="text-white/90 mb-6">
            Aplica todo lo que aprendiste en esta guía con PropAdvisor. Calcula tu dividendo real, compara bancos y decide con datos.
          </p>
          <Link
            href="/buscar"
            className="inline-block bg-white text-[var(--accent)] px-8 py-3 rounded-lg font-bold hover:shadow-lg transition-shadow"
          >
            Comenzar análisis gratis →
          </Link>
        </div>
      </article>
    </>
  );
}
