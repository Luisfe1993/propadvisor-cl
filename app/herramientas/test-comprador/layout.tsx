import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "¿Estás listo para comprar? — Test de preparación Chile",
  description: "Descubre qué tan preparado estás para comprar tu primera propiedad en Chile con este test rápido de 8 preguntas.",
  keywords: ["estoy listo para comprar casa Chile", "test comprador vivienda", "preparación compra propiedad Chile", "quiz comprar departamento"],
  alternates: { canonical: "https://www.propadvisor.site/herramientas/test-comprador" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
