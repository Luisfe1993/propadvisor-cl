import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "¿Cuánto de mi sueldo se va en vivienda? — Presupuesto Chile",
  description: "Revisa si tu gasto en vivienda es saludable según las reglas financieras. Calculadora gratuita para Chile.",
  keywords: ["presupuesto vivienda Chile", "cuánto gastar en arriendo", "porcentaje sueldo vivienda", "regla 30% vivienda Chile"],
  alternates: { canonical: "https://www.propadvisor.site/herramientas/presupuesto-vivienda" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
