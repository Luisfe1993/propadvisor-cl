import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Portfolio de Inversión",
  description: "Tu portfolio de propiedades de inversión. Compara, analiza IRR, DSCR y exporta memorándums profesionales.",
  robots: { index: false, follow: false },
  alternates: { canonical: "https://www.propadvisor.site/dashboard" },
};

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
