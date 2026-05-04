import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Planes — PropAdvisor CL",
  description: "Analiza propiedades gratis o accede al portfolio de inversión con PropAdvisor Pro. Compara propiedades, calcula IRR, DSCR y exporta memorándums de inversión.",
  alternates: { canonical: "https://www.propadvisor.site/pricing" },
};

export default function PricingLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
