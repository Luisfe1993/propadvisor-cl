import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Herramientas Gratuitas de Análisis Inmobiliario",
  description:
    "8 herramientas gratuitas para tomar la mejor decisión inmobiliaria en Chile: calcula si te alcanza, simula tu dividendo, compara comprar vs. arrendar, planifica tu pie y más.",
  keywords: [
    "herramientas inmobiliarias Chile",
    "calculadora hipotecaria Chile",
    "simulador dividendo Chile",
    "comprar o arrendar Chile",
    "pie departamento Chile",
    "análisis inmobiliario Chile",
  ],
  alternates: { canonical: "https://www.propadvisor.site/herramientas" },
};

export default function HerramientasLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
