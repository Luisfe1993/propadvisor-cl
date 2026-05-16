import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "¿Cuánto necesito ahorrar para el pie? — Planificador Chile",
  description: "Calcula cuántos meses necesitas para juntar el pie de tu departamento o casa en Chile. Incluye rendimiento de ahorro. Gratis, sin registro.",
  keywords: ["cuánto ahorrar pie departamento Chile", "pie departamento Chile", "ahorro cuota inicial vivienda Chile", "planificador pie hipoteca"],
  alternates: { canonical: "https://www.propadvisor.site/herramientas/ahorrar-pie" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
