import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Planes — PropAdvisor CL",
  description: "Analiza propiedades gratis o accede al portfolio de inversión con PropAdvisor Pro. Compara propiedades, calcula IRR, DSCR y exporta memorándums de inversión.",
  keywords: [
    "planes PropAdvisor",
    "precio PropAdvisor",
    "herramienta inversión inmobiliaria Chile",
    "calculadora hipotecaria premium",
    "IRR DSCR propiedades Chile",
    "portfolio inversión inmobiliaria",
  ],
  alternates: { canonical: "https://www.propadvisor.site/pricing" },
};

export default function PricingLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
