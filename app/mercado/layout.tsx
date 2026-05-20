import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Mercado Inmobiliario Chile — Análisis y Tendencias | PropAdvisor CL",
  description: "Análisis mensual del mercado inmobiliario chileno: tasas hipotecarias, plusvalía por comuna, tendencias de precios y guías para compradores e inversionistas.",
  keywords: ["mercado inmobiliario Chile 2026", "tasas hipotecarias Chile", "análisis inmobiliario Santiago", "inversión inmobiliaria Chile"],
  alternates: { canonical: "https://www.propadvisor.site/mercado" },
};

export default function MercadoLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
