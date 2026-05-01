import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Calculadora Hipotecaria Chile 2026 — Simula tu Dividendo",
  description:
    "Calculadora de dividendo hipotecario para Chile. Ingresa el precio de cualquier propiedad, compara tasas de BancoEstado, Santander, BCI y Banco de Chile, y proyecta 3 escenarios a 20 años. Gratis, sin registro.",
  keywords: [
    "calculadora hipotecaria Chile",
    "simulador dividendo Chile",
    "calcular dividendo hipotecario",
    "crédito hipotecario Chile 2026",
    "simulador crédito hipotecario Chile",
    "cuánto es mi dividendo",
    "calculadora UF a CLP",
    "comparar tasas hipotecarias Chile",
  ],
  alternates: { canonical: "https://www.propadvisor.site/calcular" },
};

const calcularJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Calculadora Hipotecaria PropAdvisor CL",
  url: "https://www.propadvisor.site/calcular",
  description:
    "Calculadora gratuita de dividendo hipotecario para el mercado chileno. Compara tasas de 4 bancos, proyecta 3 escenarios a 20 años, y calcula si conviene comprar o arrendar.",
  applicationCategory: "FinanceApplication",
  operatingSystem: "Web",
  offers: { "@type": "Offer", price: "0", priceCurrency: "CLP" },
  inLanguage: "es-CL",
  featureList: [
    "Comparación de tasas de 4 bancos chilenos",
    "Proyección a 20 años con 3 escenarios",
    "Cálculo de dividendo mensual en tiempo real",
    "Valor de UF actualizado diariamente",
    "Informe PDF + modelo Excel gratuito",
  ],
};

export default function CalcularLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(calcularJsonLd) }}
      />
      {children}
    </>
  );
}
