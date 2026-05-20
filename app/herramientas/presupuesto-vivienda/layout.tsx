import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "¿Cuánto de mi sueldo se va en vivienda? — Presupuesto Chile",
  description: "Revisa si tu gasto en vivienda es saludable según las reglas financieras. Calculadora gratuita para Chile.",
  keywords: ["presupuesto vivienda Chile", "cuánto gastar en arriendo", "porcentaje sueldo vivienda", "regla 30% vivienda Chile"],
  alternates: { canonical: "https://www.propadvisor.site/herramientas/presupuesto-vivienda" },
};

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    { "@type": "Question", name: "¿Cuánto de mi sueldo debería gastar en vivienda en Chile?", acceptedAnswer: { "@type": "Answer", text: "La regla general es no superar el 30% de tu ingreso líquido en gastos de vivienda (arriendo o dividendo). Si estás sobre 40%, tu presupuesto está bajo presión. Los bancos chilenos usan un límite similar al evaluar créditos hipotecarios." } },
    { "@type": "Question", name: "¿Qué incluye el gasto de vivienda?", acceptedAnswer: { "@type": "Answer", text: "Incluye el dividendo o arriendo mensual, gastos comunes, seguros obligatorios (desgravamen e incendio), contribuciones, y costos de mantenimiento. En Chile, los gastos comunes pueden agregar $50.000-$200.000/mes dependiendo del edificio." } },
    { "@type": "Question", name: "¿Qué pasa si gasto más del 30% en vivienda?", acceptedAnswer: { "@type": "Answer", text: "Gastar más del 30% aumenta tu vulnerabilidad financiera. Dificulta ahorrar, te deja sin colchón para emergencias y puede generar estrés financiero. Si estás en esta situación, considera negociar arriendo, buscar opciones más económicas o aumentar ingresos." } },
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
