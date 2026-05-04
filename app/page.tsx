import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "PropAdvisor CL — ¿Conviene Comprar o Arrendar en Chile?",
  description:
    "Analiza si conviene más comprar o arrendar en Chile con datos reales. Calcula tu dividendo hipotecario, compara tasas de BancoEstado, Santander, BCI y BdChile, y proyecta 3 escenarios a 20 años. Gratis, sin registro.",
  alternates: { canonical: "https://www.propadvisor.site" },
};

// ── JSON-LD schemas ───────────────────────────────────────
const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "¿Conviene comprar o arrendar en Chile en 2026?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Depende de tu horizonte financiero, ciudad y tasa de interés. Comprar conviene a largo plazo (más de 10 años) porque acumulas patrimonio. Arrendar es preferible si necesitas flexibilidad.",
      },
    },
    {
      "@type": "Question",
      name: "¿Cuánto es el pie para comprar en Chile?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "El pie mínimo es 10% para primera vivienda, aunque los bancos suelen preferir 20-25%. Para segunda propiedad (inversión), el mínimo exigido es 30%.",
      },
    },
    {
      "@type": "Question",
      name: "¿Cuál es la tasa hipotecaria más baja en Chile hoy?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Las tasas fijas a 20 años oscilan entre 4% y 5.5% anual según banco y perfil crediticio.",
      },
    },
    {
      "@type": "Question",
      name: "¿Qué es la UF y cómo afecta mi dividendo?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "La UF (Unidad de Fomento) es una unidad indexada a la inflación chilena, con valor ~$37.000 CLP en 2026. Los créditos hipotecarios se expresan en UF.",
      },
    },
    {
      "@type": "Question",
      name: "¿Vale la pena comprar para arrendar en Santiago?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Sí, si la rentabilidad bruta supera el 4-5% anual. En Santiago es típicamente 4-6%.",
      },
    },
    {
      "@type": "Question",
      name: "¿Cuáles son las mejores comunas para invertir en Santiago?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Para rentabilidad: Ñuñoa, Santiago Centro y Providencia. Para plusvalía: Las Condes y Vitacura.",
      },
    },
    {
      "@type": "Question",
      name: "¿Cuánto debería ser mi dividendo mensual máximo?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "La regla general es que tu dividendo no supere el 25-30% de tu ingreso líquido mensual.",
      },
    },
    {
      "@type": "Question",
      name: "¿Cuánto gana un departamento en arriendo en Chile?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "La rentabilidad bruta típica en Santiago es 4-6% anual. Un departamento de UF 3.000 genera entre $370K-$555K/mes.",
      },
    },
    {
      "@type": "Question",
      name: "¿Qué banco tiene la mejor tasa hipotecaria en Chile?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Las tasas varían según perfil. En 2026, las tasas fijas a 20 años van de 3.4% a 5.5%. PropAdvisor compara BancoEstado, Santander, BCI y Banco de Chile.",
      },
    },
  ],
};

const howToJsonLd = {
  "@context": "https://schema.org",
  "@type": "HowTo",
  name: "Cómo analizar si conviene comprar o arrendar en Chile",
  totalTime: "PT5M",
  estimatedCost: { "@type": "MonetaryAmount", currency: "CLP", value: "0" },
  step: [
    { "@type": "HowToStep", position: 1, name: "Ingresa los datos de la propiedad", text: "Precio de venta en UF o CLP y arriendo mensual estimado.", url: "https://www.propadvisor.site/calcular" },
    { "@type": "HowToStep", position: 2, name: "Elige banco y condiciones", text: "Compara tasas de BancoEstado, Santander, BCI y Banco de Chile. Ajusta pie y plazo.", url: "https://www.propadvisor.site/calcular" },
    { "@type": "HowToStep", position: 3, name: "Obtén tu análisis", text: "Dividendo mensual, flujo neto, y proyección comparativa a 20 años. Recibe PDF + Excel gratis.", url: "https://www.propadvisor.site/calcular" },
  ],
};

// ── FAQ data ─────────────────────────────────────────────
const faqs = [
  {
    q: "¿Conviene comprar o arrendar en Chile en 2026?",
    a: "Depende de tu horizonte y situación. Comprar conviene si planeas quedarte más de 10 años y tienes el pie disponible — acumulas patrimonio y te proteges contra alzas de arriendo. Arrendar es mejor si necesitas movilidad o el dividendo superaría el 40% de tus ingresos.",
  },
  {
    q: "¿Cuánto es el pie mínimo para comprar en Chile?",
    a: "El mínimo legal es 10% para primera vivienda, pero los bancos prefieren 20-25% para mejores tasas. Para segunda propiedad (inversión) el mínimo exigido es 30%.",
  },
  {
    q: "¿Cuál es la tasa hipotecaria más baja en Chile hoy?",
    a: "Las tasas fijas a 20 años oscilan entre 4% y 5.5% anual según banco y perfil. PropAdvisor muestra las tasas actuales de BancoEstado, Santander, BCI y BdChile y calcula el dividendo con cada una.",
  },
  {
    q: "¿Qué es la UF y cómo afecta mi dividendo?",
    a: "La UF es una unidad indexada a la inflación chilena. Vale ~$37.000 CLP en 2026 y sube diariamente. Los créditos hipotecarios se expresan en UF, así que tu deuda en CLP crece con la inflación aunque pagues todo al día.",
  },
  {
    q: "¿Vale la pena comprar para arrendar en Santiago?",
    a: "Puede ser rentable si la rentabilidad bruta supera el 4-5% anual. La rentabilidad neta real (descontando dividendo, gastos, vacancia) suele ser 2.5-4.5%. PropAdvisor calcula el flujo neto mensual para cada propiedad.",
  },
  {
    q: "¿Cuáles son las mejores comunas para invertir en Santiago?",
    a: "Para rentabilidad por arriendo: Ñuñoa, Santiago Centro y Barrio Brasil. Para plusvalía a largo plazo: Las Condes y Vitacura. Para equilibrio entre ambas: Macul y La Reina.",
  },
  {
    q: "¿Cuánto debería ser mi dividendo mensual máximo?",
    a: "La regla general es que tu dividendo no supere el 25-30% de tu ingreso líquido mensual. Si ganas $2M líquidos, tu dividendo no debería pasar de $500K-$600K. PropAdvisor te muestra el dividendo exacto con cada banco.",
  },
  {
    q: "¿Cuánto gana un departamento en arriendo en Chile?",
    a: "La rentabilidad bruta típica en Santiago es 4-6% anual. Un departamento de UF 3.000 (~$111M CLP) genera entre $370K-$555K/mes de arriendo. Pero debes restar dividendo, gastos comunes, seguros y vacancia para obtener la rentabilidad neta real.",
  },
  {
    q: "¿Qué banco tiene la mejor tasa hipotecaria en Chile?",
    a: "Las tasas varían según perfil crediticio, monto del crédito y relación con el banco. En 2026, las tasas fijas a 20 años van de 3.4% a 5.5%. PropAdvisor compara BancoEstado, Santander, BCI y Banco de Chile para que veas el dividendo con cada uno.",
  },
];

// ── SVG icons ────────────────────────────────────────────
const ChartIcon = () => (
  <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.75" aria-hidden="true">
    <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const CalendarIcon = () => (
  <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.75" aria-hidden="true">
    <rect x="3" y="4" width="18" height="18" rx="2" strokeLinecap="round" strokeLinejoin="round" />
    <line x1="16" y1="2" x2="16" y2="6" strokeLinecap="round" />
    <line x1="8" y1="2" x2="8" y2="6" strokeLinecap="round" />
    <line x1="3" y1="10" x2="21" y2="10" strokeLinecap="round" />
  </svg>
);

const CompareIcon = () => (
  <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.75" aria-hidden="true">
    <path d="M9 3H5a2 2 0 00-2 2v4m6-6h10a2 2 0 012 2v4M9 3v18m0 0h10a2 2 0 002-2v-4M9 21H5a2 2 0 01-2-2v-4m0 0h18" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const ShieldIcon = () => (
  <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.75" aria-hidden="true">
    <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" strokeLinecap="round" strokeLinejoin="round" />
    <polyline points="14 2 14 8 20 8" strokeLinecap="round" strokeLinejoin="round" />
    <line x1="12" y1="18" x2="12" y2="12" strokeLinecap="round" />
    <line x1="9" y1="15" x2="15" y2="15" strokeLinecap="round" />
  </svg>
);

// ── Feature data ─────────────────────────────────────────
const features = [
  {
    Icon: ChartIcon,
    title: "Datos reales del mercado chileno",
    desc: "Tasas actualizadas de BancoEstado, Santander, BCI y Banco de Chile. Valor de UF en tiempo real desde el Banco Central.",
  },
  {
    Icon: CalendarIcon,
    title: "Proyección a 20 años",
    desc: "No basta con el dividendo mensual. PropAdvisor proyecta el costo total real de cada escenario, incluyendo plusvalía estimada.",
  },
  {
    Icon: CompareIcon,
    title: "3 escenarios en paralelo",
    desc: "Compara al mismo tiempo: comprar para vivir, comprar para arrendar, o seguir arrendando. Números reales para cada opción.",
  },
  {
    Icon: ShieldIcon,
    title: "Informe PDF + Excel gratis",
    desc: "Recibe un informe profesional con tu análisis completo y un modelo Excel interactivo con 4 hojas. Listo para compartir con tu banco o corredor.",
  },
];

export default function Home() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(howToJsonLd) }} />

      {/* ══════════════════════════════════════════════════════
          HERO
      ══════════════════════════════════════════════════════ */}
      <section
        aria-labelledby="hero-heading"
        style={{
          width: "100%",
          padding: "88px 24px 80px",
          background: "var(--bg-primary)",
          textAlign: "center",
        }}
      >
        <div style={{ maxWidth: "720px", margin: "0 auto" }}>

          {/* Badge */}
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              padding: "5px 12px",
              background: "var(--accent-light)",
              borderRadius: "9999px",
              fontSize: "12px",
              fontWeight: 600,
              color: "var(--accent-dark)",
              letterSpacing: "0.01em",
              textTransform: "uppercase",
              marginBottom: "28px",
            }}
          >
            <span
              style={{
                width: "6px",
                height: "6px",
                borderRadius: "50%",
                background: "var(--accent)",
                display: "inline-block",
                flexShrink: 0,
              }}
            />
            Herramienta gratuita · Chile
          </div>

          {/* Heading — 3 short lines, unmistakably centered */}
          <h1
            id="hero-heading"
            style={{
              fontSize: "clamp(44px, 7vw, 72px)",
              fontWeight: 800,
              lineHeight: 1.05,
              letterSpacing: "-0.04em",
              color: "var(--text-primary)",
              marginBottom: "24px",
            }}
          >
            ¿Comprar<br />
            o arrendar<br />
            en Chile?
          </h1>

          {/* Subheading */}
          <p
            style={{
              fontSize: "18px",
              color: "var(--text-secondary)",
              lineHeight: 1.65,
              maxWidth: "520px",
              margin: "0 auto 36px",
            }}
          >
            Calcula tu dividendo, compara tasas de los 4 principales bancos
            y proyecta 3 escenarios a 20 años — antes de firmar nada.
          </p>

          {/* CTAs */}
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "12px",
              justifyContent: "center",
              marginBottom: "40px",
            }}
          >
            <a href="/calcular" className="btn-primary" style={{ padding: "13px 28px", fontSize: "15px" }}>
              Analizar una propiedad →
            </a>
          </div>

          {/* Value prop */}
          <p style={{ fontSize: "14px", color: "var(--text-muted)", marginBottom: "40px", textAlign: "center" }}>
            Compara 8 bancos · 3 escenarios a 20 años · Informe PDF gratis · En 5 minutos
          </p>

          {/* Trust strip */}
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px 16px",
              fontSize: "13px",
              color: "var(--text-muted)",
            }}
          >
            {["Sin registro", "100% gratis", "Datos reales de Chile"].map((item, i, arr) => (
              <span key={item} style={{ display: "inline-flex", alignItems: "center", gap: "16px" }}>
                {item}
                {i < arr.length - 1 && (
                  <span style={{ opacity: 0.35 }}>·</span>
                )}
              </span>
            ))}
          </div>

        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          METRICS STRIP — builds trust, breaks up the page
      ══════════════════════════════════════════════════════ */}
      <div
        aria-hidden="true"
        style={{
          borderTop: "1px solid var(--border)",
          borderBottom: "1px solid var(--border)",
          background: "var(--bg-secondary)",
          padding: "24px",
        }}
      >
        <dl
          style={{
            maxWidth: "720px",
            margin: "0 auto",
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: "0",
          }}
        >
          {[
            { value: "4", label: "bancos chilenos comparados" },
            { value: "3", label: "escenarios a 20 años" },
            { value: "UF", label: "actualizada en tiempo real" },
          ].map((stat, i) => (
            <div
              key={stat.label}
              style={{
                textAlign: "center",
                padding: "8px 16px",
                borderRight: i < 2 ? "1px solid var(--border)" : "none",
              }}
            >
              <dt
                style={{
                  fontSize: "28px",
                  fontWeight: 800,
                  color: "var(--accent)",
                  letterSpacing: "-0.04em",
                  lineHeight: 1.1,
                  marginBottom: "4px",
                }}
              >
                {stat.value}
              </dt>
              <dd style={{ fontSize: "13px", color: "var(--text-secondary)" }}>
                {stat.label}
              </dd>
            </div>
          ))}
        </dl>
      </div>

      {/* ══════════════════════════════════════════════════════
          HOW IT WORKS
      ══════════════════════════════════════════════════════ */}
      <section
        id="como-funciona"
        aria-labelledby="howto-heading"
        style={{ padding: "96px 24px", background: "var(--bg-primary)" }}
      >
        <div style={{ maxWidth: "1024px", margin: "0 auto" }}>

          {/* Section label */}
          <div style={{ textAlign: "center", marginBottom: "56px" }}>
            <p
              style={{
                fontSize: "12px",
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                color: "var(--accent)",
                marginBottom: "12px",
              }}
            >
              Cómo funciona
            </p>
            <h2
              id="howto-heading"
              style={{ fontSize: "clamp(28px, 4vw, 40px)", fontWeight: 800, letterSpacing: "-0.03em", color: "var(--text-primary)", marginBottom: "12px" }}
            >
              Análisis completo en 3 pasos
            </h2>
            <p style={{ fontSize: "17px", color: "var(--text-secondary)", maxWidth: "460px", margin: "0 auto" }}>
              Sin cuentas, sin formularios interminables. Solo resultados.
            </p>
          </div>

          {/* Steps */}
          <ol
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
              gap: "24px",
              listStyle: "none",
            }}
          >
            {[
              {
                n: "01",
                title: "Ingresa los datos",
                desc: "Precio de venta (en UF o CLP) y arriendo mensual estimado de la propiedad que encontraste.",
              },
              {
                n: "02",
                title: "Elige banco y condiciones",
                desc: "Compara tasas de BancoEstado, Santander, BCI y Banco de Chile. Ajusta el pie y el plazo.",
              },
              {
                n: "03",
                title: "Recibe tu análisis",
                desc: "Dividendo mensual, 3 escenarios a 20 años, y un informe PDF + Excel enviado a tu email.",
              },
            ].map((step) => (
              <li key={step.n}>
                <div
                  style={{
                    background: "white",
                    border: "1px solid var(--border)",
                    borderRadius: "12px",
                    padding: "32px",
                    height: "100%",
                    transition: "border-color 0.15s ease, box-shadow 0.15s ease",
                  }}
                  className="card"
                >
                  {/* Step number */}
                  <p
                    style={{
                      fontSize: "13px",
                      fontWeight: 700,
                      color: "var(--accent)",
                      letterSpacing: "0.04em",
                      marginBottom: "16px",
                      fontVariantNumeric: "tabular-nums",
                    }}
                  >
                    Paso {step.n}
                  </p>
                  <h3
                    style={{
                      fontSize: "18px",
                      fontWeight: 700,
                      color: "var(--text-primary)",
                      letterSpacing: "-0.02em",
                      marginBottom: "10px",
                      lineHeight: 1.3,
                    }}
                  >
                    {step.title}
                  </h3>
                  <p style={{ fontSize: "15px", color: "var(--text-secondary)", lineHeight: 1.65 }}>
                    {step.desc}
                  </p>
                </div>
              </li>
            ))}
          </ol>

        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          FEATURES
      ══════════════════════════════════════════════════════ */}
      <section
        id="features"
        aria-labelledby="features-heading"
        style={{
          padding: "96px 24px",
          background: "var(--bg-secondary)",
          borderTop: "1px solid var(--border)",
        }}
      >
        <div style={{ maxWidth: "1024px", margin: "0 auto" }}>

          <div style={{ textAlign: "center", marginBottom: "56px" }}>
            <p
              style={{
                fontSize: "12px",
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                color: "var(--accent)",
                marginBottom: "12px",
              }}
            >
              Por qué PropAdvisor
            </p>
            <h2
              id="features-heading"
              style={{ fontSize: "clamp(28px, 4vw, 40px)", fontWeight: 800, letterSpacing: "-0.03em", color: "var(--text-primary)", marginBottom: "12px" }}
            >
              Construido para el mercado chileno
            </h2>
            <p style={{ fontSize: "17px", color: "var(--text-secondary)", maxWidth: "460px", margin: "0 auto" }}>
              No es una calculadora genérica. Cada dato y cada cálculo refleja la realidad del sistema inmobiliario en Chile.
            </p>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              gap: "16px",
            }}
          >
            {features.map(({ Icon, title, desc }) => (
              <article
                key={title}
                className="card"
                style={{ background: "white", padding: "28px 28px 32px" }}
              >
                {/* Icon container */}
                <div
                  style={{
                    width: "40px",
                    height: "40px",
                    borderRadius: "10px",
                    background: "var(--accent-light)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "var(--accent)",
                    marginBottom: "16px",
                    flexShrink: 0,
                  }}
                >
                  <Icon />
                </div>
                <h3
                  style={{
                    fontSize: "16px",
                    fontWeight: 700,
                    color: "var(--text-primary)",
                    letterSpacing: "-0.02em",
                    marginBottom: "8px",
                    lineHeight: 1.35,
                  }}
                >
                  {title}
                </h3>
                <p style={{ fontSize: "14px", color: "var(--text-secondary)", lineHeight: 1.65 }}>
                  {desc}
                </p>
              </article>
            ))}
          </div>

        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          FAQ
      ══════════════════════════════════════════════════════ */}
      <section
        id="preguntas"
        aria-labelledby="faq-heading"
        style={{
          padding: "96px 24px",
          background: "var(--bg-primary)",
          borderTop: "1px solid var(--border)",
        }}
      >
        <div style={{ maxWidth: "680px", margin: "0 auto" }}>

          <div style={{ textAlign: "center", marginBottom: "48px" }}>
            <p
              style={{
                fontSize: "12px",
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                color: "var(--accent)",
                marginBottom: "12px",
              }}
            >
              Preguntas frecuentes
            </p>
            <h2
              id="faq-heading"
              style={{ fontSize: "clamp(26px, 4vw, 36px)", fontWeight: 800, letterSpacing: "-0.03em", color: "var(--text-primary)", marginBottom: "12px" }}
            >
              Todo lo que necesitas saber
            </h2>
            <p style={{ fontSize: "17px", color: "var(--text-secondary)" }}>
              Respuestas directas sobre compra e inversión inmobiliaria en Chile.
            </p>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            {faqs.map((faq, i) => (
              <details
                key={i}
                style={{ background: "white", border: "1px solid var(--border)", borderRadius: "10px", overflow: "hidden" }}
              >
                <summary
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "18px 20px",
                    cursor: "pointer",
                    listStyle: "none",
                    gap: "16px",
                    userSelect: "none",
                  }}
                  className="faq-summary"
                >
                  <h3
                    style={{
                      fontSize: "15px",
                      fontWeight: 600,
                      color: "var(--text-primary)",
                      letterSpacing: "-0.01em",
                      lineHeight: 1.4,
                    }}
                  >
                    {faq.q}
                  </h3>
                  <span
                    style={{
                      flexShrink: 0,
                      width: "22px",
                      height: "22px",
                      borderRadius: "50%",
                      border: "1px solid var(--border)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "16px",
                      color: "var(--text-muted)",
                      fontWeight: 300,
                    }}
                  >
                    +
                  </span>
                </summary>
                <div
                  style={{
                    padding: "0 20px 18px",
                    borderTop: "1px solid var(--border)",
                    paddingTop: "16px",
                  }}
                >
                  <p style={{ fontSize: "15px", color: "var(--text-secondary)", lineHeight: 1.7 }}>
                    {faq.a}
                  </p>
                </div>
              </details>
            ))}
          </div>

          <p
            style={{
              marginTop: "32px",
              textAlign: "center",
              fontSize: "15px",
              color: "var(--text-secondary)",
            }}
          >
            ¿Quieres entender más a fondo?{" "}
            <a
              href="/guia"
              style={{
                color: "var(--accent)",
                fontWeight: 600,
                textDecoration: "none",
              }}
            >
              Lee la Guía completa →
            </a>
          </p>

        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          CTA
      ══════════════════════════════════════════════════════ */}
      <section
        aria-label="Llamada a la acción"
        style={{
          padding: "96px 24px",
          background: "var(--bg-secondary)",
          borderTop: "1px solid var(--border)",
          textAlign: "center",
        }}
      >
        <div style={{ maxWidth: "560px", margin: "0 auto" }}>
          <p
            style={{
              fontSize: "12px",
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: "0.08em",
              color: "var(--accent)",
              marginBottom: "16px",
            }}
          >
            Comienza ahora
          </p>
          <h2
            style={{
              fontSize: "clamp(28px, 4vw, 42px)",
              fontWeight: 800,
              letterSpacing: "-0.035em",
              color: "var(--text-primary)",
              marginBottom: "16px",
              lineHeight: 1.15,
            }}
          >
            Tu análisis inmobiliario<br />en 5 minutos
          </h2>
          <p
            style={{
              fontSize: "17px",
              color: "var(--text-secondary)",
              marginBottom: "36px",
              lineHeight: 1.6,
            }}
          >
            Sabrás si conviene más comprar, arrendar o invertir — con números reales del mercado chileno.
          </p>
          <a
            href="/calcular"
            className="btn-primary"
            style={{ padding: "14px 32px", fontSize: "15px", borderRadius: "9px" }}
          >
            Analizar una propiedad ahora →
          </a>
          <p style={{ marginTop: "16px", fontSize: "13px", color: "var(--text-muted)" }}>
            Sin registro · Gratis para siempre
          </p>
        </div>
      </section>
    </>
  );
}
