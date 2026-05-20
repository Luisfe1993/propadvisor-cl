import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "¿Conviene comprar o arrendar en Chile? — Comparador gratuito",
  description: "Compara el costo real de comprar vs. arrendar una propiedad en Chile a 20 años. Incluye plusvalía, inflación de arriendo y tasas de 8 bancos. Gratis, sin registro.",
  keywords: ["comprar o arrendar Chile 2026", "comprar vs arrendar", "conviene comprar departamento Chile", "análisis comprar arrendar Santiago"],
  alternates: { canonical: "https://www.propadvisor.site/herramientas/comprar-o-arrendar" },
};

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    { "@type": "Question", name: "¿Conviene más comprar o arrendar en Santiago 2026?", acceptedAnswer: { "@type": "Answer", text: "Depende del precio de la propiedad, el arriendo de la zona y tu horizonte de tiempo. En general, comprar conviene cuando planeas quedarte más de 5-7 años y el cap rate es mayor a 4%. Si el precio es alto relativo al arriendo, arrendar e invertir la diferencia puede ser más rentable." } },
    { "@type": "Question", name: "¿Cuántos años tarda en convenir comprar vs arrendar en Chile?", acceptedAnswer: { "@type": "Answer", text: "El punto de equilibrio típico en Chile es de 5 a 8 años, dependiendo de la plusvalía de la comuna, las tasas hipotecarias y el arriendo. Comunas con alta plusvalía como Ñuñoa o Providencia alcanzan el equilibrio más rápido." } },
    { "@type": "Question", name: "¿Qué factores considerar al decidir entre comprar o arrendar?", acceptedAnswer: { "@type": "Answer", text: "Los principales factores son: tasa hipotecaria, plusvalía de la zona, relación precio/arriendo (cap rate), tu estabilidad laboral, horizonte de permanencia y capacidad de ahorro para el pie. Una propiedad con cap rate sobre 5% generalmente favorece la compra." } },
  ],
};

export default function ComprarArendarLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      {children}
    </>
  );
}
