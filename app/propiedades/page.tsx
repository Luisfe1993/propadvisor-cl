"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Suspense, useEffect, useState } from "react";
import type { PropertySearchResponse } from "@/lib/types";

function PropiedadesContent() {
  const searchParams = useSearchParams();
  const budget = searchParams.get("budget");
  const currency = searchParams.get("currency") || "CLP";
  const city = searchParams.get("city");
  const propertyType = searchParams.get("propertyType");

  const [properties, setProperties] = useState<PropertySearchResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        setLoading(true);
        const params = new URLSearchParams({
          budget: budget || "",
          currency: currency || "CLP",
          ...(city && { city }),
          ...(propertyType && { propertyType }),
        });

        const response = await fetch(`/api/propiedades?${params}`);
        if (!response.ok) throw new Error("Failed to fetch properties");

        const data: PropertySearchResponse = await response.json();
        setProperties(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, [budget, currency, city, propertyType]);

  const formatCLP = (value: number) => {
    return new Intl.NumberFormat("es-CL", {
      style: "currency",
      currency: "CLP",
      minimumFractionDigits: 0,
    }).format(value);
  };

  const getCityLabel = (cityCode: string) => {
    const cities: { [key: string]: string } = {
      santiago: "Santiago",
      valparaiso: "Valparaíso",
      concepcion: "Concepción",
    };
    return cities[cityCode] || cityCode;
  };

  const getTypeLabel = (type: string) => {
    return type === "departamento" ? "Departamento" : "Casa";
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--bg-primary)] flex items-center justify-center">
        <div className="text-center">
          <p className="text-[var(--text-secondary)] mb-4">Buscando propiedades...</p>
          <div className="w-8 h-8 border-4 border-[var(--accent)] border-t-transparent rounded-full animate-spin mx-auto"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[var(--bg-primary)] flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">Error: {error}</p>
          <Link href="/calcular" className="text-[var(--accent)] font-medium hover:underline">
            Volver a buscar
          </Link>
        </div>
      </div>
    );
  }

  const props = properties?.properties || [];

  return (
    <div className="min-h-screen bg-[var(--bg-primary)]">
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[var(--text-primary)] mb-4">
            Propiedades Disponibles
          </h1>
          <div className="text-[var(--text-secondary)] text-sm mb-2">
            <p>
              <strong>Presupuesto:</strong> {budget} {currency}
              {city && <> • <strong>Ciudad:</strong> {getCityLabel(city)}</>}
              {propertyType && <> • <strong>Tipo:</strong> {getTypeLabel(propertyType)}</>}
            </p>
          </div>
          {properties && (
            <p className="text-[var(--text-muted)] text-sm">
              {props.length} {props.length === 1 ? "propiedad" : "propiedades"} encontrada{props.length !== 1 ? "s" : ""}
            </p>
          )}
        </div>

        {props.length === 0 ? (
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            {/* Explain why */}
            <div style={{ background: "var(--bg-secondary)", border: "1px solid var(--border)", borderRadius: "12px", padding: "28px 32px" }}>
              <p style={{ fontSize: "16px", fontWeight: 700, color: "var(--text-primary)", marginBottom: "8px" }}>
                Sin resultados para tu búsqueda
              </p>
              <p style={{ fontSize: "15px", color: "var(--text-secondary)", lineHeight: 1.6, marginBottom: "16px" }}>
                No hay propiedades en nuestra base de datos que coincidan con tu presupuesto y criterios.
                {currency === "CLP" && budget && Number(budget) < 100000000
                  ? " El presupuesto ingresado puede ser menor al precio mínimo de las propiedades disponibles (desde ~UF 1.600 / $58M CLP)."
                  : ""}
              </p>
              <Link href="/calcular" style={{ fontSize: "14px", color: "var(--accent)", fontWeight: 600 }}>
                ← Ajustar criterios de búsqueda
              </Link>
            </div>

            {/* Manual entry CTA — the real product */}
            <div style={{
              background: "white",
              border: "2px solid var(--accent)",
              borderRadius: "12px",
              padding: "28px 32px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: "24px",
              flexWrap: "wrap",
            }}>
              <div>
                <p style={{ fontSize: "12px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--accent)", marginBottom: "6px" }}>
                  ¿Ya tienes una propiedad en mente?
                </p>
                <p style={{ fontSize: "16px", fontWeight: 700, color: "var(--text-primary)", marginBottom: "6px", letterSpacing: "-0.02em" }}>
                  Calcula con tus propios datos
                </p>
                <p style={{ fontSize: "14px", color: "var(--text-secondary)", lineHeight: 1.5 }}>
                  Ingresa el precio y arriendo estimado de cualquier propiedad y obtén el análisis completo a 20 años — aunque no esté en nuestra base de datos.
                </p>
              </div>
              <Link
                href="/calcular"
                style={{
                  display: "inline-flex", alignItems: "center", justifyContent: "center",
                  background: "var(--accent)", color: "white",
                  padding: "12px 24px", borderRadius: "8px",
                  fontWeight: 600, fontSize: "14px",
                  textDecoration: "none", whiteSpace: "nowrap", flexShrink: 0,
                }}
              >
                Ingresar datos manualmente →
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {props.map((property) => (
              <Link
                key={property.id}
                href={`/analisis/${property.id}`}
                className="group overflow-hidden rounded-lg border border-[var(--border)] hover:border-[var(--accent)] transition-all hover:shadow-md"
              >
                <div className="aspect-video bg-gray-200 overflow-hidden">
                  <img
                    src={property.image}
                    alt={property.address}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                </div>
                <div className="p-4">
                  <p className="text-[var(--text-secondary)] text-sm mb-2">
                    {property.rooms} dorm • {property.baths} baños • {property.type === "casa" ? "Casa" : "Dpto."}
                    {property.m2 && <> • {property.m2} m²</>}
                  </p>
                  <h3 className="font-semibold text-[var(--text-primary)] mb-3 group-hover:text-[var(--accent)] transition-colors line-clamp-2">
                    {property.address}
                  </h3>
                  <div className="border-t border-[var(--border)] pt-3">
                    <p className="text-[var(--accent)] font-bold text-lg mb-1">
                      {formatCLP(property.priceCLP)}
                    </p>
                    <div className="flex items-center justify-between">
                      <p className="text-[var(--text-muted)] text-sm">
                        UF {property.priceUF.toLocaleString("es-CL")}
                      </p>
                      {property.sourceUrl && (
                        <a
                          href={property.sourceUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="text-xs text-[var(--text-muted)] hover:text-[var(--accent)] transition-colors"
                        >
                          Ver en Portal ↗
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
        {/* Always-visible manual entry nudge */}
        <div style={{ marginTop: "40px", paddingTop: "32px", borderTop: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "12px" }}>
          <p style={{ fontSize: "14px", color: "var(--text-secondary)" }}>
            ¿Encontraste una propiedad en Portal Inmobiliario u otro sitio?
          </p>
          <Link href="/calcular" style={{ fontSize: "14px", color: "var(--accent)", fontWeight: 600, whiteSpace: "nowrap" }}>
            Calcular con mis propios datos →
          </Link>
        </div>

      </div>
    </div>
  );
}

export default function PropiedadesPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[var(--bg-primary)] flex items-center justify-center"><p className="text-[var(--text-secondary)]">Cargando...</p></div>}>
      <PropiedadesContent />
    </Suspense>
  );
}
