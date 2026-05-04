import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Portfolio de Inversión",
  description: "Tu portfolio de propiedades de inversión. Compara, analiza IRR, DSCR y exporta memorándums profesionales.",
};

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
