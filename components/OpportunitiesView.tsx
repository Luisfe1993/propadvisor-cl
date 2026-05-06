"use client";

import { useState, useEffect } from "react";
import { track } from "@vercel/analytics";

interface OpportunityProperty {
  id: string;
  address: string;
  neighborhood: string;
  city: string;
  priceUF: number;
  priceCLP: number;
  rooms: number;
  baths: number;
  type: string;
  estimatedMonthlyRentCLP: number;
  image: string;
}

interface OpportunitiesViewProps {
  /** User's analyzed price in UF */
  priceUF: number;
  /** User's analyzed city */
  city: string;
  /** User's analyzed property type */
  propertyType?: string;
  /** User's analyzed comuna/neighborhood */
  comuna?: string;
}

function formatCLP(v: number): string {
  return new Intl.NumberFormat("es-CL", {
    style: "currency",
    currency: "CLP",
    minimumFractionDigits: 0,
  }).format(v);
}

export default function OpportunitiesView({ priceUF, city, propertyType, comuna }: OpportunitiesViewProps) {
  const [properties, setProperties] = useState<OpportunityProperty[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch matching properties: ±40% of analyzed price, same city
    const minUF = Math.round(priceUF * 0.6);
    const maxUF = Math.round(priceUF * 1.4);

    const params = new URLSearchParams({
      budget: String(maxUF),
      currency: "UF",
      minBudget: String(minUF),
    });
    if (city) params.set("city", city.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/\s+/g, "_"));

    fetch(`/api/propiedades?${params}`)
      .then((r) => r.json())
      .then((data) => {
        let results: OpportunityProperty[] = data.properties || [];
        // Prioritize same neighborhood if comuna provided
        if (comuna) {
          const comunaNorm = comuna.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
          const sameNeighborhood = results.filter((p) =>
            p.neighborhood.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().includes(comunaNorm)
          );
          const others = results.filter((p) =>
            !p.neighborhood.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().includes(comunaNorm)
          );
          // Show same-neighborhood first, then fill with others
          results = [...sameNeighborhood, ...others.sort(() => Math.random() - 0.5)];
        } else {
          results = results.sort(() => Math.random() - 0.5);
        }
        results = results.slice(0, 6);
        setProperties(results);
        track("opportunities_shown", { city, count: results.length, priceUF });
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [priceUF, city, propertyType]);

  if (loading) {
    return (
      <div style={{ padding: "20px 0", textAlign: "center" }}>
        <div style={{
          width: "32px", height: "32px", border: "3px solid var(--border)",
          borderTop: "3px solid var(--accent)", borderRadius: "50%",
          animation: "spin 0.8s linear infinite", margin: "0 auto 12px",
        }} />
        <p style={{ fontSize: "13px", color: "var(--text-muted)" }}>Buscando oportunidades...</p>
      </div>
    );
  }

  if (properties.length === 0) return null;

  return (
    <div style={{ marginTop: "16px" }}>
      {/* Divider */}
      <div style={{
        display: "flex", alignItems: "center", gap: "12px",
        margin: "8px 0 16px",
      }}>
        <div style={{ flex: 1, height: "1px", background: "var(--border)" }} />
        <span style={{ fontSize: "11px", fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.06em" }}>
          Para ti
        </span>
        <div style={{ flex: 1, height: "1px", background: "var(--border)" }} />
      </div>

      {/* Section header */}
      <div style={{ marginBottom: "14px" }}>
        <p style={{
          fontSize: "16px", fontWeight: 800, color: "var(--text-primary)",
          marginBottom: "4px", letterSpacing: "-0.02em",
        }}>
          🏠 Propiedades que podrían interesarte
        </p>
        <p style={{ fontSize: "12px", color: "var(--text-muted)", lineHeight: 1.5 }}>
          Basado en tu análisis — propiedades en tu rango de precio y ubicación
        </p>
      </div>

      {/* Property cards — horizontal scroll */}
      <div style={{
        display: "flex", gap: "12px", overflowX: "auto",
        paddingBottom: "8px", margin: "0 -4px",
        scrollbarWidth: "none",
        WebkitOverflowScrolling: "touch",
      }}>
        {properties.map((prop) => (
          <a
            key={prop.id}
            href={`/analisis/${prop.id}`}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => track("opportunity_clicked", { propertyId: prop.id, city: prop.city, priceUF: prop.priceUF })}
            style={{
              flex: "0 0 200px", borderRadius: "12px", overflow: "hidden",
              border: "1px solid var(--border)", background: "white",
              textDecoration: "none", color: "inherit",
              transition: "box-shadow 0.15s, transform 0.15s",
              cursor: "pointer",
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.boxShadow = "0 4px 16px rgba(0,0,0,0.1)";
              e.currentTarget.style.transform = "translateY(-2px)";
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.boxShadow = "";
              e.currentTarget.style.transform = "";
            }}
          >
            {/* Image */}
            <div style={{ position: "relative", width: "100%", height: "120px", overflow: "hidden" }}>
              <img
                src={prop.image}
                alt={prop.address}
                loading="lazy"
                style={{
                  width: "100%", height: "100%", objectFit: "cover",
                }}
              />
              {/* Price badge */}
              <div style={{
                position: "absolute", bottom: "8px", left: "8px",
                background: "rgba(0,0,0,0.7)", backdropFilter: "blur(4px)",
                color: "white", padding: "3px 8px", borderRadius: "6px",
                fontSize: "12px", fontWeight: 700,
              }}>
                UF {prop.priceUF.toLocaleString("es-CL")}
              </div>
            </div>

            {/* Info */}
            <div style={{ padding: "10px 12px" }}>
              <p style={{
                fontSize: "12px", fontWeight: 700, color: "var(--text-primary)",
                marginBottom: "2px",
                overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
              }}>
                {prop.neighborhood}
              </p>
              <p style={{
                fontSize: "11px", color: "var(--text-muted)", marginBottom: "6px",
                overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
              }}>
                {prop.rooms}D · {prop.baths}B · {prop.type === "departamento" ? "Depto" : "Casa"}
              </p>
              <div style={{
                display: "flex", justifyContent: "space-between", alignItems: "center",
              }}>
                <span style={{ fontSize: "11px", color: "var(--accent)", fontWeight: 600 }}>
                  Arriendo est. {formatCLP(prop.estimatedMonthlyRentCLP)}
                </span>
              </div>
            </div>
          </a>
        ))}
      </div>

      {/* View more link */}
      <div style={{ textAlign: "center", marginTop: "12px" }}>
        <a
          href={`/buscar?budget=${Math.round(priceUF * 1.2)}&currency=UF&city=${encodeURIComponent(city)}`}
          style={{
            fontSize: "13px", color: "var(--accent)", fontWeight: 600,
            textDecoration: "none",
          }}
          onClick={() => track("opportunities_view_more", { city, priceUF })}
        >
          Ver más propiedades →
        </a>
      </div>
    </div>
  );
}
