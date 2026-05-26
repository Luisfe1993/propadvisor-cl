import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "¿Cuánto Pie Necesito? — Calculadora de Pie Hipotecario Chile 2026",
  description:
    "Calcula cuánto pie necesitas para comprar un departamento o casa en Chile. Compara 10%, 20% y 30% de pie, ve cómo cambia tu dividendo, y estima gastos de escrituración. Gratis.",
  keywords: [
    "cuánto pie necesito para comprar departamento Chile",
    "pie hipotecario Chile",
    "pie mínimo crédito hipotecario Chile",
    "gastos escrituración Chile",
    "cuánto necesito para comprar casa Chile",
    "pie 10 20 30 por ciento hipotecario",
  ],
  alternates: { canonical: "https://www.propadvisor.site/cuanto-pie" },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "¿Cuánto Pie Necesito? — PropAdvisor CL",
  url: "https://www.propadvisor.site/cuanto-pie",
  description: "Calcula el pie necesario para comprar una propiedad en Chile. Compara escenarios de 10%, 20% y 30%.",
  applicationCategory: "FinanceApplication",
  operatingSystem: "Web",
  offers: { "@type": "Offer", price: "0", priceCurrency: "CLP" },
  inLanguage: "es-CL",
};

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "¿Cuánto pie necesito para comprar un departamento en Chile?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Para primera vivienda, los bancos piden entre 10% y 20% del valor. Para inversión, mínimo 20-30%. Además, necesitas 1.5-2% adicional para gastos de escrituración (notaría, inscripción, tasación).",
      },
    },
    {
      "@type": "Question",
      name: "¿Conviene poner más pie del mínimo?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Sí. Con más pie obtienes mejor tasa, pagas menos dividendo mensual y menos intereses totales. La diferencia entre 10% y 20% de pie puede ser de $50.000-$100.000/mes en el dividendo.",
      },
    },
  ],
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      {children}
    </>
  );
}
