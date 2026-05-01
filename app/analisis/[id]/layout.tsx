import type { Metadata } from "next";
import { mockProperties } from "@/lib/properties";

type Props = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const property = mockProperties.find((p) => p.id === id);

  if (!property) {
    return {
      title: "Análisis de Propiedad",
      description: "Análisis financiero de propiedad en Chile — comprar vs arrendar.",
    };
  }

  const cityLabel: Record<string, string> = {
    santiago: "Santiago", valparaiso: "Valparaíso", concepcion: "Concepción",
  };
  const typeLabel = property.type === "departamento" ? "Departamento" : "Casa";
  const city = cityLabel[property.city] || property.city;

  return {
    title: `Análisis: ${property.address} — ¿Conviene Comprar?`,
    description: `${typeLabel} en ${city} por UF ${property.priceUF.toLocaleString("es-CL")}. ${property.rooms} dormitorios, ${property.baths} baños. Calcula dividendo, compara 3 escenarios a 20 años y decide si conviene comprar o arrendar.`,
    alternates: { canonical: `https://www.propadvisor.site/analisis/${id}` },
  };
}

export default function AnalisisLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
