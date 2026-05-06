import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Buscar Propiedades en Chile — PropAdvisor CL",
  description:
    "Busca propiedades por presupuesto, ciudad y tipo en Santiago, Valparaíso y Concepción. Analiza si conviene comprar o arrendar con datos reales de 8 bancos chilenos.",
  keywords: [
    "buscar propiedades Chile",
    "propiedades en venta Santiago",
    "departamentos Santiago",
    "casas en venta Chile",
    "propiedades por presupuesto",
    "comprar departamento Chile",
  ],
  alternates: { canonical: "https://www.propadvisor.site/buscar" },
};

export default function BuscarLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
