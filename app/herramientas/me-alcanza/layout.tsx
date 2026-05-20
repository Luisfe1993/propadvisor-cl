import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "¿Me alcanza para comprar? — Simulador de crédito hipotecario Chile",
  description: "Descubre el precio máximo de propiedad que puedes financiar con tu sueldo. Compara 8 bancos chilenos al instante. Gratis y sin registro.",
  keywords: ["cuánto puedo pedir crédito hipotecario Chile", "simulador crédito hipotecario Chile", "capacidad de endeudamiento Chile", "me alcanza para comprar departamento"],
  alternates: { canonical: "https://www.propadvisor.site/herramientas/me-alcanza" },
};

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    { "@type": "Question", name: "¿Cuánto crédito hipotecario puedo pedir con mi sueldo en Chile?", acceptedAnswer: { "@type": "Answer", text: "En Chile, los bancos permiten que el dividendo no supere el 25-30% de tu ingreso líquido. Con un sueldo de $1.500.000, puedes optar a un dividendo de $375.000-$450.000/mes, lo que financia una propiedad de aproximadamente UF 2.000-3.000 dependiendo del pie y la tasa." } },
    { "@type": "Question", name: "¿Qué porcentaje del sueldo se puede destinar al dividendo en Chile?", acceptedAnswer: { "@type": "Answer", text: "La CMF recomienda máximo 25% del ingreso bruto en carga financiera total. Los bancos chilenos suelen aprobar hasta 30% del ingreso líquido para dividendo, siempre que la carga total (incluyendo otras deudas) no supere el 50%." } },
    { "@type": "Question", name: "¿Cómo afectan mis deudas a la capacidad de crédito hipotecario?", acceptedAnswer: { "@type": "Answer", text: "Cada peso en deudas mensuales (tarjetas, créditos de consumo, automotriz) reduce directamente tu capacidad hipotecaria. Si tienes deudas de $200.000/mes, eso puede reducir tu crédito aprobable en 20-30%." } },
  ],
};

export default function MeAlcanzaLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      {children}
    </>
  );
}
