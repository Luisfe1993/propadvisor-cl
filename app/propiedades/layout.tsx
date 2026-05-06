import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Propiedades Disponibles — PropAdvisor CL",
  description:
    "Explora propiedades disponibles en Santiago, Valparaíso y Concepción. Cada propiedad incluye análisis financiero completo: dividendo, 3 escenarios y proyección a 20 años.",
  keywords: [
    "propiedades Chile",
    "departamentos en venta",
    "casas en venta Santiago",
    "análisis inmobiliario Chile",
    "inversión inmobiliaria Santiago",
  ],
  alternates: { canonical: "https://www.propadvisor.site/propiedades" },
};

export default function PropiedadesLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
