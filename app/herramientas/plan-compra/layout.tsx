import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Mi plan para comprar — Planificador de compra Chile",
  description: "Arma tu plan paso a paso para comprar propiedad en Chile: meta, ahorro mensual, timeline y milestones. Gratis.",
  keywords: ["plan compra departamento Chile", "plan ahorro vivienda Chile", "cómo comprar casa Chile", "planificador compra propiedad"],
  alternates: { canonical: "https://www.propadvisor.site/herramientas/plan-compra" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
