import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Mi plan para comprar — Planificador de compra Chile",
  description: "Arma tu plan paso a paso para comprar propiedad en Chile: meta, ahorro mensual, timeline y milestones. Gratis.",
  keywords: ["plan compra departamento Chile", "plan ahorro vivienda Chile", "cómo comprar casa Chile", "planificador compra propiedad"],
  alternates: { canonical: "https://www.propadvisor.site/herramientas/plan-compra" },
};

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    { "@type": "Question", name: "¿Cuáles son los pasos para comprar una propiedad en Chile?", acceptedAnswer: { "@type": "Answer", text: "1) Evaluar tu capacidad de crédito, 2) Ahorrar el pie (10-20%), 3) Obtener preaprobación hipotecaria, 4) Buscar propiedades, 5) Hacer una oferta, 6) Firmar promesa de compraventa, 7) Gestionar el crédito hipotecario, 8) Escriturar ante notario e inscribir en el CBR." } },
    { "@type": "Question", name: "¿Cuánto tiempo toma comprar un departamento en Chile?", acceptedAnswer: { "@type": "Answer", text: "Desde la preaprobación hasta la escritura, el proceso toma entre 45 y 90 días. Sin embargo, ahorrar el pie puede tomar 1-3 años dependiendo de tus ingresos y el precio objetivo. Planificar con anticipación es clave." } },
    { "@type": "Question", name: "¿Qué costos adicionales tiene comprar una propiedad en Chile?", acceptedAnswer: { "@type": "Answer", text: "Además del pie, debes considerar: gastos operacionales del crédito (0.5-1% del crédito), estudio de títulos ($200.000-$400.000), tasación ($150.000-$300.000), notaría e inscripción CBR ($500.000-$1.000.000), y el impuesto de timbres (0.2% del crédito). En total, suma 2-4% adicional al precio." } },
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
