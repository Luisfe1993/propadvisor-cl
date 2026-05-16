import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "¿Cuánto sería mi dividendo? — Calculadora hipotecaria Chile",
  description: "Calcula tu dividendo hipotecario mensual en segundos. Compara tasas de 8 bancos chilenos con UF en tiempo real. Gratis, sin registro.",
  keywords: ["calcular dividendo hipotecario Chile", "simulador dividendo Chile", "cuota hipotecaria Chile", "dividendo mensual propiedad Chile"],
  alternates: { canonical: "https://www.propadvisor.site/herramientas/dividendo" },
};

export default function DividendoLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
