import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "¿Me alcanza para comprar? — Simulador de crédito hipotecario Chile",
  description: "Descubre el precio máximo de propiedad que puedes financiar con tu sueldo. Compara 8 bancos chilenos al instante. Gratis y sin registro.",
  keywords: ["cuánto puedo pedir crédito hipotecario Chile", "simulador crédito hipotecario Chile", "capacidad de endeudamiento Chile", "me alcanza para comprar departamento"],
  alternates: { canonical: "https://www.propadvisor.site/herramientas/me-alcanza" },
};

export default function MeAlcanzaLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
