import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "¿Cuánto sería mi dividendo? — Calculadora hipotecaria Chile",
  description: "Calcula tu dividendo hipotecario mensual en segundos. Compara tasas de 8 bancos chilenos con UF en tiempo real. Gratis, sin registro.",
  keywords: ["calcular dividendo hipotecario Chile", "simulador dividendo Chile", "cuota hipotecaria Chile", "dividendo mensual propiedad Chile"],
  alternates: { canonical: "https://www.propadvisor.site/herramientas/dividendo" },
};

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    { "@type": "Question", name: "¿Cómo se calcula el dividendo hipotecario en Chile?", acceptedAnswer: { "@type": "Answer", text: "El dividendo se calcula con la fórmula de cuota fija (sistema francés): se toma el monto del crédito, la tasa de interés mensual y el plazo en meses. En Chile, las tasas hipotecarias actuales van de 3.4% a 4.2% anual según el banco y el porcentaje de pie." } },
    { "@type": "Question", name: "¿Cuánto pie necesito para un crédito hipotecario en Chile?", acceptedAnswer: { "@type": "Answer", text: "La mayoría de los bancos chilenos piden entre 10% y 20% de pie. BancoEstado permite desde 10%, mientras que BCI, Scotiabank e Itaú generalmente piden 20%. Un pie mayor reduce la tasa de interés." } },
    { "@type": "Question", name: "¿Qué banco tiene la tasa hipotecaria más baja en Chile 2026?", acceptedAnswer: { "@type": "Answer", text: "Las tasas varían mensualmente. En general, Santander, Itaú y Scotiabank suelen ofrecer las tasas más competitivas para pie de 20%. Usa nuestra calculadora para comparar los 8 principales bancos con tasas actualizadas." } },
  ],
};

export default function DividendoLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      {children}
    </>
  );
}
