import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "¿Cuánto Puedo Comprar? — Calculadora de Capacidad Hipotecaria Chile 2026",
  description:
    "Ingresa tu sueldo líquido y descubre cuánto puedes comprar en Chile. Calcula tu dividendo máximo, propiedad alcanzable y pie necesario. Gratis, sin registro.",
  keywords: [
    "cuánto puedo comprar con mi sueldo Chile",
    "capacidad hipotecaria Chile",
    "cuánto me presta el banco Chile",
    "simulador crédito hipotecario sueldo",
    "dividendo máximo sueldo Chile",
    "calculadora hipotecaria sueldo líquido",
  ],
  alternates: { canonical: "https://www.propadvisor.site/cuanto-puedo-comprar" },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "¿Cuánto Puedo Comprar? — PropAdvisor CL",
  url: "https://www.propadvisor.site/cuanto-puedo-comprar",
  description: "Calcula cuánto puedes comprar según tu sueldo líquido. Regla del 25% bancaria aplicada.",
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
      name: "¿Cuánto sueldo necesito para un crédito hipotecario en Chile?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Los bancos aplican la regla del 25%: tu dividendo no puede superar el 25% de tu sueldo líquido. Con un sueldo de $1.500.000, tu dividendo máximo sería $375.000.",
      },
    },
    {
      "@type": "Question",
      name: "¿Cuánto me presta el banco para comprar una propiedad?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Los bancos financian entre 80% y 90% del valor de la propiedad. El monto exacto depende de tu sueldo, deudas actuales y perfil crediticio.",
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
