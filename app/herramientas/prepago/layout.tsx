import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "¿Me conviene prepagar mi crédito hipotecario? — Calculadora Chile",
  description: "Calcula cuánto ahorras en intereses prepagando tu crédito hipotecario en Chile. Simulación gratuita, sin registro.",
  keywords: ["prepago crédito hipotecario Chile", "conviene prepagar hipoteca", "prepagar crédito Chile", "amortización anticipada hipoteca"],
  alternates: { canonical: "https://www.propadvisor.site/herramientas/prepago" },
};

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    { "@type": "Question", name: "¿Conviene prepagar el crédito hipotecario en Chile?", acceptedAnswer: { "@type": "Answer", text: "Generalmente sí, especialmente en los primeros años del crédito cuando la proporción de intereses es mayor. Prepagar reduce el capital adeudado y puedes elegir entre reducir el plazo (ahorra más intereses) o reducir la cuota mensual (más liquidez)." } },
    { "@type": "Question", name: "¿Cuánto ahorro en intereses si prepago mi hipoteca?", acceptedAnswer: { "@type": "Answer", text: "El ahorro depende del monto prepagado, la tasa y el plazo restante. Como regla general, prepagar UF 100 en los primeros 5 años de un crédito a 20 años al 4% puede ahorrar más de UF 80 en intereses a lo largo del crédito." } },
    { "@type": "Question", name: "¿Cuándo NO conviene prepagar la hipoteca?", acceptedAnswer: { "@type": "Answer", text: "No conviene si tu tasa hipotecaria es muy baja (bajo 3%) y puedes invertir ese dinero a mejor retorno, si te quedan pocos años de crédito (ya pagaste la mayoría de los intereses), o si necesitas liquidez para emergencias." } },
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
