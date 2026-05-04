"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { calcMonthlyPayment } from "@/lib/calculations";
import { calcInvestorMetrics, type InvestorInputs } from "@/lib/investorCalcs";
import type { SavedProperty } from "@/lib/db";

function fmt(n: number): string {
  return new Intl.NumberFormat("es-CL", { style: "currency", currency: "CLP", minimumFractionDigits: 0 }).format(n);
}
function pct(n: number): string {
  return (n * 100).toFixed(1) + "%";
}

function getMetrics(p: SavedProperty) {
  const priceCLP = Number(p.price_clp);
  const monthlyRent = Number(p.monthly_rent);
  const rate = Number(p.interest_rate);
  const dpPct = Number(p.down_payment_pct);
  const term = Number(p.loan_term_years);
  const loan = priceCLP * (1 - dpPct / 100);
  const pmt = calcMonthlyPayment(loan, rate, term);

  const inputs: InvestorInputs = {
    priceCLP, monthlyRent, downPaymentPct: dpPct, interestRate: rate,
    loanTermYears: term, monthlyPayment: pmt,
    vacancyRate: 0.05, monthlyGGCC: 100000, monthlyInsurance: 30000,
    adminFeePct: 0.08, annualMaintenance: 300000, annualContribuciones: 400000,
    isDFL2: false, appreciationRate: 0.07, rentInflation: 0.03,
  };
  return calcInvestorMetrics(inputs);
}

export default function ComparePage() {
  const [properties, setProperties] = useState<SavedProperty[]>([]);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [isPro, setIsPro] = useState<boolean | null>(null);

  useEffect(() => {
    Promise.all([
      fetch("/api/portfolio").then(r => r.json()),
      fetch("/api/plan").then(r => r.json()),
    ]).then(([portfolioData, planData]) => {
      setProperties(portfolioData.properties || []);
      setIsPro(planData.isActive === true);
    }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const toggleSelect = (id: string) => {
    setSelected(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else if (next.size < 4) next.add(id);
      return next;
    });
  };

  const selectedProperties = properties.filter(p => selected.has(p.id));
  const metricsMap = useMemo(() => {
    const map = new Map<string, ReturnType<typeof getMetrics>>();
    selectedProperties.forEach(p => map.set(p.id, getMetrics(p)));
    return map;
  }, [selectedProperties]);

  if (loading) {
    return <div style={{ minHeight: "60vh", display: "flex", alignItems: "center", justifyContent: "center" }}><p style={{ color: "var(--text-muted)" }}>Cargando...</p></div>;
  }

  if (isPro === false) {
    return (
      <div style={{ minHeight: "80vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "48px 24px" }}>
        <div style={{ maxWidth: "480px", textAlign: "center" }}>
          <div style={{ fontSize: "48px", marginBottom: "16px" }}>🔒</div>
          <h2 style={{ fontSize: "24px", fontWeight: 800, color: "var(--text-primary)", marginBottom: "8px" }}>Funcionalidad Pro</h2>
          <p style={{ fontSize: "15px", color: "var(--text-secondary)", lineHeight: 1.6, marginBottom: "24px" }}>
            La comparación lado a lado es una funcionalidad exclusiva de PropAdvisor Pro.
          </p>
          <a href="/pricing" style={{ display: "inline-block", padding: "14px 32px", fontSize: "15px", fontWeight: 700, background: "var(--accent)", color: "white", borderRadius: "10px", textDecoration: "none" }}>
            Probar Pro gratis →
          </a>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg-primary)" }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "48px 24px" }}>

        <header style={{ marginBottom: "32px" }}>
          <Link href="/dashboard" style={{ fontSize: "13px", color: "var(--text-muted)", display: "inline-block", marginBottom: "16px" }}>← Volver al portfolio</Link>
          <h1 style={{ fontSize: "clamp(22px, 3vw, 30px)", fontWeight: 800, letterSpacing: "-0.03em", color: "var(--text-primary)", marginBottom: "4px" }}>
            Comparar propiedades
          </h1>
          <p style={{ fontSize: "14px", color: "var(--text-secondary)" }}>
            Selecciona 2-4 propiedades para comparar lado a lado. {selected.size > 0 && `(${selected.size} seleccionada${selected.size > 1 ? "s" : ""})`}
          </p>
        </header>

        {/* Selection */}
        {properties.length === 0 ? (
          <div style={{ textAlign: "center", padding: "48px", border: "2px dashed var(--border)", borderRadius: "12px" }}>
            <p style={{ color: "var(--text-muted)" }}>No tienes propiedades guardadas.</p>
            <Link href="/calcular" style={{ color: "var(--accent)", fontWeight: 600 }}>Analizar una propiedad →</Link>
          </div>
        ) : (
          <>
            {/* Property selector */}
            <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginBottom: "32px" }}>
              {properties.map(p => (
                <button
                  key={p.id}
                  onClick={() => toggleSelect(p.id)}
                  style={{
                    padding: "10px 16px", fontSize: "13px", fontWeight: 600,
                    border: selected.has(p.id) ? "2px solid var(--accent)" : "1px solid var(--border)",
                    borderRadius: "8px",
                    background: selected.has(p.id) ? "var(--accent-light)" : "white",
                    cursor: "pointer", transition: "all 0.15s",
                    color: "var(--text-primary)",
                  }}
                >
                  {selected.has(p.id) ? "✅ " : ""}{p.label}
                </button>
              ))}
            </div>

            {/* Comparison table */}
            {selectedProperties.length >= 2 && (
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px", background: "white", borderRadius: "12px", overflow: "hidden", border: "1px solid var(--border)" }}>
                  <thead>
                    <tr style={{ background: "var(--bg-secondary)" }}>
                      <th style={{ padding: "12px 16px", textAlign: "left", fontWeight: 700, color: "var(--text-muted)", fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.04em", minWidth: "140px" }}>Métrica</th>
                      {selectedProperties.map(p => (
                        <th key={p.id} style={{ padding: "12px 16px", textAlign: "right", fontWeight: 700, color: "var(--text-primary)", fontSize: "12px", minWidth: "150px" }}>
                          {p.label}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { label: "Precio (UF)", render: (p: SavedProperty) => `UF ${Math.round(Number(p.price_uf)).toLocaleString("es-CL")}` },
                      { label: "Dividendo/mes", render: (p: SavedProperty) => fmt(Number(p.monthly_payment)) },
                      { label: "Arriendo/mes", render: (p: SavedProperty) => fmt(Number(p.monthly_rent)) },
                      { label: "Cap Rate", render: (_p: SavedProperty, m: ReturnType<typeof getMetrics>) => pct(m.capRate), highlight: true },
                      { label: "NOI Anual", render: (_p: SavedProperty, m: ReturnType<typeof getMetrics>) => fmt(m.noi) },
                      { label: "Cash-on-Cash", render: (_p: SavedProperty, m: ReturnType<typeof getMetrics>) => pct(m.cashOnCash), highlight: true },
                      { label: "DSCR", render: (_p: SavedProperty, m: ReturnType<typeof getMetrics>) => m.dscr.toFixed(2) },
                      { label: "IRR", render: (_p: SavedProperty, m: ReturnType<typeof getMetrics>) => pct(m.irr), highlight: true },
                      { label: "Cash Flow Año 1", render: (_p: SavedProperty, m: ReturnType<typeof getMetrics>) => fmt(m.yearlyProjection[0]?.cashFlow || 0) },
                      { label: "Equity Año 10", render: (_p: SavedProperty, m: ReturnType<typeof getMetrics>) => fmt(m.yearlyProjection[9]?.equity || 0) },
                      { label: "Equity Año 20", render: (_p: SavedProperty, m: ReturnType<typeof getMetrics>) => fmt(m.yearlyProjection[19]?.equity || 0) },
                      { label: "Impuesto Anual", render: (_p: SavedProperty, m: ReturnType<typeof getMetrics>) => fmt(m.estimatedTax) },
                      { label: "After-Tax CF", render: (_p: SavedProperty, m: ReturnType<typeof getMetrics>) => fmt(m.afterTaxCashFlow) },
                    ].map((row, i) => {
                      // Find best value for highlight rows
                      let bestId = "";
                      if (row.highlight) {
                        let bestVal = -Infinity;
                        selectedProperties.forEach(p => {
                          const m = metricsMap.get(p.id)!;
                          const val = row.label === "Cap Rate" ? m.capRate : row.label === "Cash-on-Cash" ? m.cashOnCash : m.irr;
                          if (val > bestVal) { bestVal = val; bestId = p.id; }
                        });
                      }

                      return (
                        <tr key={row.label} style={{ borderTop: "1px solid var(--border)", background: i % 2 === 0 ? "white" : "var(--bg-secondary)" }}>
                          <td style={{ padding: "10px 16px", fontWeight: 600, color: "var(--text-primary)" }}>{row.label}</td>
                          {selectedProperties.map(p => {
                            const m = metricsMap.get(p.id)!;
                            const isBest = bestId === p.id;
                            return (
                              <td key={p.id} style={{
                                padding: "10px 16px", textAlign: "right",
                                fontWeight: isBest ? 800 : 500,
                                color: isBest ? "#16a34a" : "var(--text-primary)",
                              }}>
                                {row.render(p, m)}
                                {isBest && " ⭐"}
                              </td>
                            );
                          })}
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}

            {selectedProperties.length < 2 && selectedProperties.length > 0 && (
              <p style={{ textAlign: "center", color: "var(--text-muted)", padding: "32px" }}>
                Selecciona al menos 2 propiedades para comparar.
              </p>
            )}
          </>
        )}
      </div>
    </div>
  );
}
