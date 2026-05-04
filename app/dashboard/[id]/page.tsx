"use client";

import { useState, useEffect, use, useMemo } from "react";
import Link from "next/link";
import { calcInvestorMetrics, type InvestorInputs } from "@/lib/investorCalcs";
import { calcMonthlyPayment } from "@/lib/calculations";
import type { SavedProperty } from "@/lib/db";

function fmt(n: number): string {
  return new Intl.NumberFormat("es-CL", { style: "currency", currency: "CLP", minimumFractionDigits: 0 }).format(n);
}

function pct(n: number): string {
  return (n * 100).toFixed(1) + "%";
}

export default function PropertyDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [property, setProperty] = useState<SavedProperty | null>(null);
  const [loading, setLoading] = useState(true);
  const [isPro, setIsPro] = useState<boolean | null>(null);
  const [wantsBroker, setWantsBroker] = useState(false);
  const [brokerSent, setBrokerSent] = useState(false);

  // Advanced inputs (editable)
  const [vacancy, setVacancy] = useState(5);
  const [ggcc, setGgcc] = useState(100000);
  const [insurance, setInsurance] = useState(30000);
  const [adminFee, setAdminFee] = useState(8);
  const [maintenance, setMaintenance] = useState(300000);
  const [contribuciones, setContribuciones] = useState(400000);
  const [isDFL2, setIsDFL2] = useState(false);

  useEffect(() => {
    // Fetch property and plan in parallel
    Promise.all([
      fetch(`/api/portfolio/${id}`).then(r => r.json()),
      fetch("/api/plan").then(r => r.json()),
    ]).then(([propData, planData]) => {
      if (propData.property) {
        setProperty(propData.property);
        if (propData.property.monthly_costs) setGgcc(Number(propData.property.monthly_costs) * 0.5);
      }
      setIsPro(planData.isActive === true);
    }).catch(() => {}).finally(() => setLoading(false));
  }, [id]);

  const results = useMemo(() => {
    if (!property) return null;
    const p = property;
    const priceCLP = Number(p.price_clp);
    const monthlyRent = Number(p.monthly_rent);
    const rate = Number(p.interest_rate);
    const dpPct = Number(p.down_payment_pct);
    const term = Number(p.loan_term_years);
    const loan = priceCLP * (1 - dpPct / 100);
    const pmt = calcMonthlyPayment(loan, rate, term);

    const inputs: InvestorInputs = {
      priceCLP,
      monthlyRent,
      downPaymentPct: dpPct,
      interestRate: rate,
      loanTermYears: term,
      monthlyPayment: pmt,
      vacancyRate: vacancy / 100,
      monthlyGGCC: ggcc,
      monthlyInsurance: insurance,
      adminFeePct: adminFee / 100,
      annualMaintenance: maintenance,
      annualContribuciones: contribuciones,
      isDFL2,
      appreciationRate: 0.07,
      rentInflation: 0.03,
    };
    return calcInvestorMetrics(inputs);
  }, [property, vacancy, ggcc, insurance, adminFee, maintenance, contribuciones, isDFL2]);

  if (loading) {
    return <div style={{ minHeight: "60vh", display: "flex", alignItems: "center", justifyContent: "center" }}><p style={{ color: "var(--text-muted)" }}>Cargando...</p></div>;
  }
  if (!property || !results) {
    return <div style={{ minHeight: "60vh", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: "12px" }}><p style={{ color: "#dc2626" }}>Propiedad no encontrada</p><Link href="/dashboard" style={{ color: "var(--accent)" }}>← Volver al portfolio</Link></div>;
  }

  // Fix 1+5: Gate detail page behind Pro
  if (isPro === false) {
    return (
      <div style={{ minHeight: "80vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "48px 24px" }}>
        <div style={{ maxWidth: "480px", textAlign: "center" }}>
          <div style={{ fontSize: "48px", marginBottom: "16px" }}>🔒</div>
          <h2 style={{ fontSize: "24px", fontWeight: 800, color: "var(--text-primary)", marginBottom: "8px" }}>
            Funcionalidad Pro
          </h2>
          <p style={{ fontSize: "15px", color: "var(--text-secondary)", lineHeight: 1.6, marginBottom: "8px" }}>
            IRR, DSCR, análisis de vacancia, impuestos y proyección año a año son funcionalidades exclusivas de PropAdvisor Pro.
          </p>
          <p style={{ fontSize: "14px", color: "var(--text-muted)", marginBottom: "24px" }}>
            CLP $15.000/mes · 7 días gratis · Cancela cuando quieras
          </p>
          <a href="/pricing" style={{
            display: "inline-block", padding: "14px 32px", fontSize: "15px", fontWeight: 700,
            background: "var(--accent)", color: "white", borderRadius: "10px", textDecoration: "none",
          }}>
            Probar Pro gratis →
          </a>
          <br />
          <Link href="/dashboard" style={{ display: "inline-block", marginTop: "16px", fontSize: "13px", color: "var(--text-muted)" }}>
            ← Volver al portfolio
          </Link>
        </div>
      </div>
    );
  }

  const p = property;
  const dscrColor = results.dscr >= 1.2 ? "#16a34a" : results.dscr >= 1.0 ? "#a16207" : "#dc2626";
  const dscrLabel = results.dscr >= 1.2 ? "Aprobable" : results.dscr >= 1.0 ? "Límite" : "Riesgoso";

  const labelSx: React.CSSProperties = { fontSize: "11px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.04em", color: "var(--text-muted)", marginBottom: "4px" };
  const inputSx: React.CSSProperties = { width: "100%", padding: "8px 12px", fontSize: "14px", border: "1px solid var(--border)", borderRadius: "8px", background: "white", color: "var(--text-primary)" };

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg-primary)" }}>
      <div style={{ maxWidth: "960px", margin: "0 auto", padding: "48px 24px" }}>

        {/* Header */}
        <header style={{ marginBottom: "32px" }}>
          <Link href="/dashboard" style={{ fontSize: "13px", color: "var(--text-muted)", display: "inline-block", marginBottom: "16px" }}>← Volver al portfolio</Link>
          <h1 style={{ fontSize: "clamp(22px, 3vw, 30px)", fontWeight: 800, letterSpacing: "-0.03em", color: "var(--text-primary)", marginBottom: "4px" }}>{p.label}</h1>
          <p style={{ fontSize: "14px", color: "var(--text-secondary)" }}>{p.city}{p.comuna ? ` · ${p.comuna}` : ""} · {p.property_type} · {p.bank_name} {Number(p.interest_rate).toFixed(2)}%</p>
        </header>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "24px", alignItems: "start" }}>

          {/* LEFT: Inputs */}
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>

            {/* Key metrics */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
              <div style={{ background: "white", border: "1px solid var(--border)", borderRadius: "10px", padding: "16px" }}>
                <p style={labelSx}>NOI Anual</p>
                <p style={{ fontSize: "20px", fontWeight: 800, color: results.noi >= 0 ? "#16a34a" : "#dc2626" }}>{fmt(results.noi)}</p>
              </div>
              <div style={{ background: "white", border: "1px solid var(--border)", borderRadius: "10px", padding: "16px" }}>
                <p style={labelSx}>Cap Rate</p>
                <p style={{ fontSize: "20px", fontWeight: 800, color: "var(--text-primary)" }}>{pct(results.capRate)}</p>
              </div>
              <div style={{ background: "white", border: "1px solid var(--border)", borderRadius: "10px", padding: "16px" }}>
                <p style={labelSx}>Cash-on-Cash</p>
                <p style={{ fontSize: "20px", fontWeight: 800, color: results.cashOnCash >= 0 ? "#16a34a" : "#dc2626" }}>{pct(results.cashOnCash)}</p>
              </div>
              <div style={{ background: "white", border: `2px solid ${dscrColor}`, borderRadius: "10px", padding: "16px" }}>
                <p style={labelSx}>DSCR</p>
                <p style={{ fontSize: "20px", fontWeight: 800, color: dscrColor }}>{results.dscr.toFixed(2)}</p>
                <p style={{ fontSize: "11px", color: dscrColor, fontWeight: 600 }}>{dscrLabel} {results.dscr >= 1.2 ? "✅" : results.dscr >= 1.0 ? "⚠️" : "❌"}</p>
              </div>
            </div>

            {/* IRR + Sensitivity */}
            <div style={{ background: "linear-gradient(135deg, #0f766e 0%, #1e3a5f 100%)", borderRadius: "12px", padding: "20px", color: "white" }}>
              <p style={{ fontSize: "11px", opacity: 0.7, textTransform: "uppercase", letterSpacing: "0.04em", marginBottom: "6px" }}>IRR (Tasa Interna de Retorno)</p>
              <p style={{ fontSize: "32px", fontWeight: 800, letterSpacing: "-0.03em" }}>{pct(results.irr)}</p>
              <p style={{ fontSize: "12px", opacity: 0.7, marginBottom: "12px" }}>Rentabilidad real a {Number(p.loan_term_years)} años incluyendo flujos, plusvalía y venta</p>
              <div style={{ display: "flex", gap: "8px" }}>
                {results.irrScenarios.map((s) => (
                  <div key={s.label} style={{ flex: 1, background: "rgba(255,255,255,0.15)", borderRadius: "8px", padding: "8px", textAlign: "center" }}>
                    <p style={{ fontSize: "10px", opacity: 0.7, marginBottom: "2px" }}>{s.label}</p>
                    <p style={{ fontSize: "14px", fontWeight: 800 }}>{pct(s.irr)}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Tax */}
            <div style={{ background: "white", border: "1px solid var(--border)", borderRadius: "12px", padding: "16px" }}>
              <p style={{ ...labelSx, marginBottom: "10px" }}>Impacto tributario (anual)</p>
              <div style={{ display: "flex", flexDirection: "column", gap: "6px", fontSize: "13px" }}>
                <div style={{ display: "flex", justifyContent: "space-between" }}><span style={{ color: "var(--text-muted)" }}>Ingreso bruto arriendo</span><span>{fmt(results.grossRentalIncome)}</span></div>
                <div style={{ display: "flex", justifyContent: "space-between" }}><span style={{ color: "var(--text-muted)" }}>− Gastos + vacancia</span><span style={{ color: "#dc2626" }}>−{fmt(results.totalExpenses + results.grossRentalIncome * (vacancy / 100))}</span></div>
                <div style={{ display: "flex", justifyContent: "space-between", borderTop: "1px solid var(--border)", paddingTop: "6px" }}><span style={{ fontWeight: 700 }}>NOI</span><span style={{ fontWeight: 700 }}>{fmt(results.noi)}</span></div>
                <div style={{ display: "flex", justifyContent: "space-between" }}><span style={{ color: "var(--text-muted)" }}>− Dividendo anual</span><span style={{ color: "#dc2626" }}>−{fmt(Number(p.monthly_payment) * 12)}</span></div>
                <div style={{ display: "flex", justifyContent: "space-between" }}><span style={{ color: "var(--text-muted)" }}>− Impuesto estimado</span><span style={{ color: "#dc2626" }}>−{fmt(results.estimatedTax)}</span></div>
                <div style={{ display: "flex", justifyContent: "space-between", borderTop: "1px solid var(--border)", paddingTop: "6px" }}><span style={{ fontWeight: 700 }}>Cash flow neto (post-tax)</span><span style={{ fontWeight: 700, color: results.afterTaxCashFlow >= 0 ? "#16a34a" : "#dc2626" }}>{fmt(results.afterTaxCashFlow)}</span></div>
              </div>
              <label style={{ display: "flex", alignItems: "center", gap: "8px", marginTop: "12px", fontSize: "12px", cursor: "pointer" }}>
                <input type="checkbox" checked={isDFL2} onChange={(e) => setIsDFL2(e.target.checked)} style={{ accentColor: "var(--accent)" }} />
                <span>Propiedad DFL2 (exenta de impuesto arriendo por 20 años)</span>
              </label>
            </div>

            {/* Expense inputs */}
            <div style={{ background: "white", border: "1px solid var(--border)", borderRadius: "12px", padding: "16px" }}>
              <p style={{ ...labelSx, marginBottom: "12px" }}>Supuestos editables</p>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                <div>
                  <p style={labelSx}>Vacancia (%)</p>
                  <input type="number" value={vacancy} onChange={(e) => setVacancy(Number(e.target.value))} min={0} max={30} style={inputSx} />
                </div>
                <div>
                  <p style={labelSx}>GGCC mensual</p>
                  <input type="number" value={ggcc} onChange={(e) => setGgcc(Number(e.target.value))} style={inputSx} />
                </div>
                <div>
                  <p style={labelSx}>Seguros mensual</p>
                  <input type="number" value={insurance} onChange={(e) => setInsurance(Number(e.target.value))} style={inputSx} />
                </div>
                <div>
                  <p style={labelSx}>Admin fee (%)</p>
                  <input type="number" value={adminFee} onChange={(e) => setAdminFee(Number(e.target.value))} min={0} max={15} style={inputSx} />
                </div>
                <div>
                  <p style={labelSx}>Mantención anual</p>
                  <input type="number" value={maintenance} onChange={(e) => setMaintenance(Number(e.target.value))} style={inputSx} />
                </div>
                <div>
                  <p style={labelSx}>Contribuciones anual</p>
                  <input type="number" value={contribuciones} onChange={(e) => setContribuciones(Number(e.target.value))} style={inputSx} />
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT: Year-by-year table */}
          <div>
            <div style={{ background: "white", border: "1px solid var(--border)", borderRadius: "12px", padding: "16px", overflowX: "auto" }}>
              <p style={{ ...labelSx, marginBottom: "12px" }}>Proyección año a año</p>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "12px" }}>
                <thead>
                  <tr style={{ borderBottom: "2px solid var(--border)" }}>
                    {["Año", "Arriendo", "NOI", "Dividendo", "Cash Flow", "Acum.", "Propiedad", "Equity"].map((h) => (
                      <th key={h} style={{ padding: "6px 4px", textAlign: "right", color: "var(--text-muted)", fontWeight: 700, fontSize: "10px", textTransform: "uppercase" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {results.yearlyProjection.map((yr) => (
                    <tr key={yr.year} style={{ borderBottom: "1px solid var(--border)" }}>
                      <td style={{ padding: "6px 4px", fontWeight: 700, color: "var(--text-primary)" }}>{yr.year}</td>
                      <td style={{ padding: "6px 4px", textAlign: "right" }}>{fmt(yr.rent)}</td>
                      <td style={{ padding: "6px 4px", textAlign: "right", color: yr.noi >= 0 ? "#16a34a" : "#dc2626" }}>{fmt(yr.noi)}</td>
                      <td style={{ padding: "6px 4px", textAlign: "right" }}>{fmt(yr.debtService)}</td>
                      <td style={{ padding: "6px 4px", textAlign: "right", fontWeight: 600, color: yr.cashFlow >= 0 ? "#16a34a" : "#dc2626" }}>{fmt(yr.cashFlow)}</td>
                      <td style={{ padding: "6px 4px", textAlign: "right", color: yr.cumulativeCashFlow >= 0 ? "#16a34a" : "#dc2626" }}>{fmt(yr.cumulativeCashFlow)}</td>
                      <td style={{ padding: "6px 4px", textAlign: "right" }}>{fmt(yr.propertyValue)}</td>
                      <td style={{ padding: "6px 4px", textAlign: "right", fontWeight: 600, color: "#16a34a" }}>{fmt(yr.equity)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Fix 2: Broker CTA — highest-intent lead capture */}
          <div style={{
            gridColumn: "1 / -1",
            background: "linear-gradient(135deg, #0f766e 0%, #1e3a5f 100%)",
            borderRadius: "12px", padding: "24px", color: "white",
            marginTop: "8px",
          }}>
            {brokerSent ? (
              <div style={{ textAlign: "center", padding: "8px 0" }}>
                <p style={{ fontSize: "18px", fontWeight: 800, marginBottom: "4px" }}>✅ ¡Listo!</p>
                <p style={{ fontSize: "14px", opacity: 0.85 }}>Un ejecutivo hipotecario se pondrá en contacto contigo.</p>
              </div>
            ) : (
              <>
                <p style={{ fontSize: "17px", fontWeight: 800, marginBottom: "4px" }}>
                  ¿Listo para avanzar con esta inversión?
                </p>
                <p style={{ fontSize: "13px", opacity: 0.85, lineHeight: 1.5, marginBottom: "16px" }}>
                  Conecta con un ejecutivo hipotecario que te ayude a evaluar el crédito para esta propiedad. Sin costo, sin compromiso.
                </p>
                <button
                  onClick={async () => {
                    setBrokerSent(true);
                    // Send as a broker lead via the existing pipeline
                    await fetch("/api/send-analysis", {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({
                        email: "dashboard-lead@propadvisor.site",
                        wantsBrokerContact: true,
                        address: property.comuna || property.city,
                        propertyType: property.property_type,
                        city: property.city,
                        priceCLP: Number(property.price_clp),
                        priceUF: Number(property.price_uf),
                        bankName: property.bank_name,
                        interestRate: Number(property.interest_rate),
                        downPaymentPct: Number(property.down_payment_pct),
                        monthlyPayment: Number(property.monthly_payment),
                        loanTermYears: Number(property.loan_term_years),
                        ufValue: 37000,
                        rooms: 0, baths: 0,
                        buyTotal: 0, rentTotal: 0, rentMonthlyCLP: Number(property.monthly_rent),
                        netMonthlyFlow: Number(property.net_monthly_flow),
                        rentalYield: Number(property.cap_rate),
                        propertyValueAfter20Years: 0, savings: 0,
                        generatedAt: new Date().toLocaleDateString("es-CL"),
                      }),
                    }).catch(() => {});
                  }}
                  style={{
                    width: "100%", padding: "14px 24px",
                    background: "white", color: "#0f766e",
                    border: "none", borderRadius: "10px",
                    fontSize: "15px", fontWeight: 800, cursor: "pointer",
                  }}
                >
                  Conectar con ejecutivo hipotecario →
                </button>
                <p style={{ fontSize: "11px", opacity: 0.6, marginTop: "8px", textAlign: "center" }}>
                  Tu análisis completo será compartido con el ejecutivo
                </p>
              </>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
