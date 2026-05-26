import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Calculadora Hipotecaria Chile 2026 — Simula tu Dividendo",
  description:
    "Calculadora de dividendo hipotecario para Chile. Ingresa el precio de cualquier propiedad, compara tasas de BancoEstado, Santander, BCI y Banco de Chile, y proyecta 3 escenarios a 20 años. Gratis, sin registro.",
  keywords: [
    "calculadora hipotecaria Chile",
    "simulador dividendo Chile",
    "calcular dividendo hipotecario",
    "crédito hipotecario Chile 2026",
    "simulador crédito hipotecario Chile",
    "cuánto es mi dividendo",
    "calculadora UF a CLP",
    "comparar tasas hipotecarias Chile",
  ],
  alternates: { canonical: "https://www.propadvisor.site/calcular" },
};

const calcularJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Calculadora Hipotecaria PropAdvisor CL",
  url: "https://www.propadvisor.site/calcular",
  description:
    "Calculadora gratuita de dividendo hipotecario para el mercado chileno. Compara tasas de 4 bancos, proyecta 3 escenarios a 20 años, y calcula si conviene comprar o arrendar.",
  applicationCategory: "FinanceApplication",
  operatingSystem: "Web",
  offers: { "@type": "Offer", price: "0", priceCurrency: "CLP" },
  inLanguage: "es-CL",
  featureList: [
    "Comparación de tasas de 4 bancos chilenos",
    "Proyección a 20 años con 3 escenarios",
    "Cálculo de dividendo mensual en tiempo real",
    "Valor de UF actualizado diariamente",
    "Informe PDF + modelo Excel gratuito",
  ],
};

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "¿Conviene más comprar o arrendar en Chile?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Depende del precio, la comuna, el pie disponible y las tasas. En general, comprar conviene si planeas quedarte más de 7 años y la plusvalía de la zona es buena. Nuestra calculadora compara los 3 caminos con datos reales de tu comuna.",
      },
    },
    {
      "@type": "Question",
      name: "¿Qué es el cap rate y por qué importa?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "El cap rate (tasa de capitalización) mide cuánto rinde una propiedad como inversión: arriendo anual ÷ precio. Un cap rate de 5% significa que recuperas el 5% del valor cada año en arriendo.",
      },
    },
    {
      "@type": "Question",
      name: "¿Cuánto pie necesito para comprar un departamento en Chile?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Los bancos en Chile financian entre el 80% y 90% del valor. Para primera vivienda necesitas al menos 10% de pie; para inversión, mínimo 20-30%. Además, considera 1.5-2% adicional en gastos de escrituración.",
      },
    },
    {
      "@type": "Question",
      name: "¿Qué pasa si las tasas hipotecarias bajan?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Si las tasas bajan, el dividendo mensual será menor y comprar se vuelve más atractivo vs arrendar. Puedes simular distintas tasas usando la opción 'Ya tengo mi tasa' en el paso 2.",
      },
    },
    {
      "@type": "Question",
      name: "¿Es rentable comprar para arrendar en Santiago?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Depende de la comuna. Comunas con cap rate > 5% generan mejor flujo mensual. Comunas premium tienen menor cap rate pero mayor plusvalía. Nuestra calculadora muestra el escenario de inversión con datos específicos de cada comuna.",
      },
    },
    {
      "@type": "Question",
      name: "¿De dónde salen las tasas de interés?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Las tasas son referenciales, basadas en datos publicados por los principales bancos chilenos y la CMF. La tasa real depende de tu perfil crediticio, antigüedad laboral y relación con el banco.",
      },
    },
  ],
};

export default function CalcularLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(calcularJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      {children}
    </>
  );
}
