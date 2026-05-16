import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "¿Conviene comprar o arrendar en Chile? — Comparador gratuito",
  description: "Compara el costo real de comprar vs. arrendar una propiedad en Chile a 20 años. Incluye plusvalía, inflación de arriendo y tasas de 8 bancos. Gratis, sin registro.",
  keywords: ["comprar o arrendar Chile 2026", "comprar vs arrendar", "conviene comprar departamento Chile", "análisis comprar arrendar Santiago"],
  alternates: { canonical: "https://www.propadvisor.site/herramientas/comprar-o-arrendar" },
};

export default function ComprarArendarLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
