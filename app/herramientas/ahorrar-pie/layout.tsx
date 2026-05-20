import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "¿Cuánto necesito ahorrar para el pie? — Planificador Chile",
  description: "Calcula cuántos meses necesitas para juntar el pie de tu departamento o casa en Chile. Incluye rendimiento de ahorro. Gratis, sin registro.",
  keywords: ["cuánto ahorrar pie departamento Chile", "pie departamento Chile", "ahorro cuota inicial vivienda Chile", "planificador pie hipoteca"],
  alternates: { canonical: "https://www.propadvisor.site/herramientas/ahorrar-pie" },
};

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    { "@type": "Question", name: "¿Cuánto pie necesito para comprar un departamento en Chile?", acceptedAnswer: { "@type": "Answer", text: "En Chile, el pie mínimo es generalmente 10-20% del valor de la propiedad. BancoEstado permite desde 10%, mientras que la mayoría de los bancos privados piden 20%. Para un depto de UF 3.000, necesitas entre UF 300 y UF 600 de pie." } },
    { "@type": "Question", name: "¿Cuánto tiempo toma ahorrar el pie en Chile?", acceptedAnswer: { "@type": "Answer", text: "Depende de tu capacidad de ahorro mensual. Ahorrando $500.000/mes con un rendimiento del 5% anual, puedes juntar UF 300 (pie para depto de UF 3.000 al 10%) en aproximadamente 24-28 meses." } },
    { "@type": "Question", name: "¿Dónde conviene ahorrar el pie en Chile?", acceptedAnswer: { "@type": "Answer", text: "Las opciones más comunes son depósitos a plazo (bajo riesgo, 4-6% anual), fondos mutuos de renta fija (5-7%), o cuenta de ahorro para la vivienda (APV con beneficio tributario). Evita inversiones volátiles si planeas comprar en menos de 2 años." } },
  ],
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      {children}
    </>
  );
}
