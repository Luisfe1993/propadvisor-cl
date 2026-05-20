import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "¿Estás listo para comprar? — Test de preparación Chile",
  description: "Descubre qué tan preparado estás para comprar tu primera propiedad en Chile con este test rápido de 8 preguntas.",
  keywords: ["estoy listo para comprar casa Chile", "test comprador vivienda", "preparación compra propiedad Chile", "quiz comprar departamento"],
  alternates: { canonical: "https://www.propadvisor.site/herramientas/test-comprador" },
};

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    { "@type": "Question", name: "¿Cómo saber si estoy listo para comprar mi primera propiedad?", acceptedAnswer: { "@type": "Answer", text: "Estás listo si: tienes empleo estable (idealmente 1+ año), has ahorrado al menos 10% del valor de la propiedad, tu carga financiera (deudas/ingreso) es menor al 40%, tienes un fondo de emergencia de 3-6 meses, y planeas vivir en la zona al menos 5 años." } },
    { "@type": "Question", name: "¿Qué requisitos piden los bancos para un crédito hipotecario en Chile?", acceptedAnswer: { "@type": "Answer", text: "Los bancos piden: renta mínima (generalmente $800.000-$1.000.000 líquido), antigüedad laboral (6-12 meses), pie de 10-20%, edad máxima al término del crédito (75 años), buen comportamiento crediticio (sin morosidades), y relación dividendo/ingreso menor al 25-30%." } },
    { "@type": "Question", name: "¿Es mejor comprar propiedad joven o esperar en Chile?", acceptedAnswer: { "@type": "Answer", text: "Comprar joven tiene la ventaja de más años de plusvalía y un crédito más largo (cuota más baja). Sin embargo, no conviene apurarse sin pie suficiente o estabilidad. La mejor estrategia es empezar a ahorrar temprano y comprar cuando tengas los fundamentales cubiertos." } },
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
