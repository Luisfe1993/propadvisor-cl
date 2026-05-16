import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "¿Me conviene prepagar mi crédito hipotecario? — Calculadora Chile",
  description: "Calcula cuánto ahorras en intereses prepagando tu crédito hipotecario en Chile. Simulación gratuita, sin registro.",
  keywords: ["prepago crédito hipotecario Chile", "conviene prepagar hipoteca", "prepagar crédito Chile", "amortización anticipada hipoteca"],
  alternates: { canonical: "https://www.propadvisor.site/herramientas/prepago" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
