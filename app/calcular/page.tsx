"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { calcMonthlyPayment, calc20YearComparison } from "@/lib/calculations";
import type { BankRate } from "@/lib/types";
import EmailGateModal from "@/components/EmailGateModal";
import type { AnalysisPayload } from "@/components/EmailGateModal";

// ─────────────────────────────────────────────────────────
// /calcular — Manual property analysis
// The user enters their own property data (price, rent, etc.)
// and gets the full 20-year analysis + lead capture CTAs.
// No mock data required. Works for any property in Chile.
// ─────────────────────────────────────────────────────────

const UF_FALLBACK = 37000;

const defaultBanks: BankRate[] = [
  { id: "bancoestado", bank: "BancoEstado",    shortName: "BE",        rate: 4.19, minDownPayment: 10, logoColor: "#1B5E20" },
  { id: "santander",   bank: "Banco Santander", shortName: "Santander", rate: 3.43, minDownPayment: 15, logoColor: "#C41E3A" },
  { id: "bci",         bank: "Banco BCI",       shortName: "BCI",       rate: 3.96, minDownPayment: 20, logoColor: "#003DA5" },
  { id: "bdechile",    bank: "Banco de Chile",  shortName: "BdChile",   rate: 3.75, minDownPayment: 15, logoColor: "#0066B2" },
];

type InputCurrency = "CLP" | "UF";

const labelSx: React.CSSProperties = {
  display: "block",
  fontSize: "12px",
  fontWeight: 700,
  textTransform: "uppercase",
  letterSpacing: "0.05em",
  color: "var(--text-secondary)",
  marginBottom: "6px",
};

const inputSx: React.CSSProperties = {
  width: "100%",
  padding: "10px 14px",
  fontSize: "16px",
  border: "1px solid var(--border)",
  borderRadius: "8px",
  background: "white",
  color: "var(--text-primary)",
  outline: "none",
  transition: "border-color 0.15s, box-shadow 0.15s",
  appearance: "none",
  WebkitAppearance: "none",
};

function onFocus(e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) {
  e.currentTarget.style.borderColor = "var(--accent)";
  e.currentTarget.style.boxShadow = "0 0 0 3px rgba(13,148,136,0.1)";
}
function onBlur(e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) {
  e.currentTarget.style.borderColor = "var(--border)";
  e.currentTarget.style.boxShadow = "none";
}

export default function CalcularPage() {
  // Property inputs
  const [priceRaw, setPriceRaw]         = useState("");
  const [priceCurrency, setPriceCurrency] = useState<InputCurrency>("UF");
  const [rentRaw, setRentRaw]           = useState("");
  const [city, setCity]                 = useState("santiago");

  // Mortgage inputs
  const [downPayment, setDownPayment]   = useState(20);
  const [loanTerm, setLoanTerm]         = useState(20);
  const [selectedBankId, setSelectedBankId] = useState("bancoestado");

  // Remote data
  const [banks, setBanks]       = useState<BankRate[]>(defaultBanks);
  const [ufValue, setUfValue]   = useState(UF_FALLBACK);
  const [analysisReady, setAnalysisReady] = useState(false);
  const [showEmailModal, setShowEmailModal] = useState(false);

  // Fetch UF + bank rates on mount
  useEffect(() => {
    fetch("/api/tasas")
      .then((r) => r.json())
      .then((d) => { if (d.banks?.length) setBanks(d.banks); })
      .catch(() => {});

    fetch("/api/uf")
      .then((r) => r.json())
      .then((d) => { if (d.value) setUfValue(d.value); })
      .catch(() => {});
  }, []);

  const formatCLP = (v: number) =>
    new Intl.NumberFormat("es-CL", { style: "currency", currency: "CLP", minimumFractionDigits: 0 }).format(v);

  // Derived values
  const priceCLP: number = (() => {
    const n = parseFloat(priceRaw.replace(/\./g, "").replace(",", "."));
    if (!n || isNaN(n)) return 0;
    return priceCurrency === "UF" ? n * ufValue : n;
  })();

  const priceUF = priceCLP / ufValue;

  const rentCLP: number = (() => {
    const n = parseFloat(rentRaw.replace(/\./g, "").replace(",", "."));
    return !n || isNaN(n) ? 0 : n;
  })();

  const selectedBank  = banks.find((b) => b.id === selectedBankId) ?? banks[0];
  const interestRate  = selectedBank?.rate ?? 4.19;
  const loanAmount    = priceCLP * (1 - downPayment / 100);
  const downAmount    = priceCLP * (downPayment / 100);
  const monthlyPayment = priceCLP > 0 ? calcMonthlyPayment(loanAmount, interestRate, loanTerm) : 0;

  const comparison = priceCLP > 0 && rentCLP > 0
    ? calc20YearComparison(monthlyPayment + 500000, rentCLP, downAmount, priceCLP)
    : null;

  const netFlow     = rentCLP - monthlyPayment - 500000;
  const rentalYield = priceCLP > 0 && rentCLP > 0 ? (rentCLP * 12) / priceCLP * 100 : 0;

  const canAnalyze = priceCLP > 0 && rentCLP > 0;

  const cityLabel: Record<string, string> = {
    santiago: "Santiago", valparaiso: "Valparaíso", concepcion: "Concepción",
  };

  const buildPayload = useCallback((): AnalysisPayload | null => {
    if (!comparison || !canAnalyze) return null;
    return {
      address: cityLabel[city] || city,
      propertyType: "Propiedad",
      city: cityLabel[city] || city,
      rooms: 0,
      baths: 0,
      priceCLP,
      priceUF,
      ufValue,
      bankName: selectedBank?.bank || "",
      interestRate,
      downPaymentPct: downPayment,
      downPaymentCLP: downAmount,
      loanTermYears: loanTerm,
      monthlyPayment,
      buyTotal: comparison.buyTotal,
      rentTotal: comparison.rentTotal,
      rentMonthlyCLP: rentCLP,
      netMonthlyFlow: netFlow,
      rentalYield,
      propertyValueAfter20Years: comparison.propertyValueAfter20Years,
      savings: comparison.savings,
      generatedAt: new Date().toLocaleDateString("es-CL", { day: "numeric", month: "long", year: "numeric" }),
    };
  }, [comparison, canAnalyze, city, cityLabel, priceCLP, priceUF, ufValue, selectedBank, interestRate, downPayment, downAmount, loanTerm, monthlyPayment, rentCLP, netFlow, rentalYield]);

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg-primary)" }}>
      <div style={{ maxWidth: "960px", margin: "0 auto", padding: "48px 24px" }}>

        {/* Header */}
        <header style={{ marginBottom: "40px" }}>
          <Link href="/" style={{ fontSize: "13px", color: "var(--text-muted)", display: "inline-block", marginBottom: "20px" }}>
            ← Volver al inicio
          </Link>
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "16px", flexWrap: "wrap" }}>
            <div>
              <p style={{ fontSize: "12px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--accent)", marginBottom: "6px" }}>
                Calculadora manual
              </p>
              <h1 style={{ fontSize: "clamp(26px, 4vw, 34px)", fontWeight: 800, letterSpacing: "-0.03em", color: "var(--text-primary)", marginBottom: "6px" }}>
                Analiza cualquier propiedad
              </h1>
              <p style={{ fontSize: "16px", color: "var(--text-secondary)", lineHeight: 1.6 }}>
                Ingresa el precio y arriendo estimado de la propiedad que encontraste — obtendrás el análisis completo a 20 años.
              </p>
            </div>
            {canAnalyze && (
              <div style={{
                display: "inline-flex", alignItems: "center", gap: "6px",
                padding: "6px 12px", background: "var(--accent-light)",
                borderRadius: "9999px", fontSize: "12px", fontWeight: 700,
                color: "var(--accent-dark)", flexShrink: 0,
              }}>
                <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "var(--accent)", display: "inline-block" }} />
                Análisis listo
              </div>
            )}
          </div>
        </header>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "24px", alignItems: "start" }}>

          {/* ── LEFT: Inputs ──────────────────────────────────── */}
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>

            {/* Property price */}
            <fieldset style={{ border: "1px solid var(--border)", borderRadius: "12px", padding: "24px", background: "white" }}>
              <legend style={{ fontSize: "15px", fontWeight: 700, color: "var(--text-primary)", padding: "0 4px", letterSpacing: "-0.01em" }}>
                Datos de la propiedad
              </legend>
              <div style={{ marginTop: "20px", display: "flex", flexDirection: "column", gap: "16px" }}>

                {/* Price */}
                <div>
                  <label htmlFor="price-input" style={labelSx}>
                    Precio de venta <span aria-label="obligatorio">*</span>
                  </label>
                  <div style={{ display: "flex", gap: "8px" }}>
                    <input
                      id="price-input"
                      type="text"
                      inputMode="numeric"
                      value={priceRaw}
                      onChange={(e) => setPriceRaw(e.target.value)}
                      placeholder={priceCurrency === "UF" ? "Ej: 3200" : "Ej: 120000000"}
                      style={{ ...inputSx, flex: 1 }}
                      onFocus={onFocus}
                      onBlur={onBlur}
                    />
                    <select
                      value={priceCurrency}
                      onChange={(e) => setPriceCurrency(e.target.value as InputCurrency)}
                      aria-label="Moneda del precio"
                      style={{ ...inputSx, width: "80px", cursor: "pointer" }}
                      onFocus={onFocus}
                      onBlur={onBlur}
                    >
                      <option value="UF">UF</option>
                      <option value="CLP">CLP</option>
                    </select>
                  </div>
                  {priceCLP > 0 && (
                    <p style={{ fontSize: "12px", color: "var(--accent)", marginTop: "5px", fontWeight: 600 }}>
                      ≈ {priceCurrency === "UF" ? formatCLP(priceCLP) : `UF ${priceUF.toLocaleString("es-CL", { maximumFractionDigits: 0 })}`}
                      {" · "}UF actual: {ufValue.toLocaleString("es-CL")}
                    </p>
                  )}
                </div>

                {/* Estimated monthly rent */}
                <div>
                  <label htmlFor="rent-input" style={labelSx}>
                    Arriendo mensual estimado (CLP) <span aria-label="obligatorio">*</span>
                  </label>
                  <input
                    id="rent-input"
                    type="text"
                    inputMode="numeric"
                    value={rentRaw}
                    onChange={(e) => setRentRaw(e.target.value)}
                    placeholder="Ej: 450000"
                    style={inputSx}
                    onFocus={onFocus}
                    onBlur={onBlur}
                  />
                  {rentCLP > 0 && priceCLP > 0 && (
                    <p style={{ fontSize: "12px", color: "var(--text-muted)", marginTop: "5px" }}>
                      Rentabilidad bruta: <strong style={{ color: rentalYield >= 5 ? "#16a34a" : "var(--text-secondary)" }}>{rentalYield.toFixed(1)}%</strong> anual
                      {rentalYield >= 5 ? " — buen retorno" : rentalYield >= 4 ? " — retorno aceptable" : " — retorno bajo"}
                    </p>
                  )}
                </div>

                {/* City */}
                <div>
                  <label htmlFor="city-select" style={labelSx}>Ciudad</label>
                  <select
                    id="city-select"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    style={{ ...inputSx, cursor: "pointer" }}
                    onFocus={onFocus}
                    onBlur={onBlur}
                  >
                    <option value="santiago">Santiago</option>
                    <option value="valparaiso">Valparaíso</option>
                    <option value="concepcion">Concepción</option>
                  </select>
                </div>

              </div>
            </fieldset>

            {/* Mortgage parameters */}
            <fieldset style={{ border: "1px solid var(--border)", borderRadius: "12px", padding: "24px", background: "white" }}>
              <legend style={{ fontSize: "15px", fontWeight: 700, color: "var(--text-primary)", padding: "0 4px", letterSpacing: "-0.01em" }}>
                Parámetros del crédito
              </legend>
              <div style={{ marginTop: "20px", display: "flex", flexDirection: "column", gap: "16px" }}>

                {/* Bank */}
                <div>
                  <label htmlFor="bank-select" style={labelSx}>Banco</label>
                  <select
                    id="bank-select"
                    value={selectedBankId}
                    onChange={(e) => setSelectedBankId(e.target.value)}
                    style={{ ...inputSx, cursor: "pointer" }}
                    onFocus={onFocus}
                    onBlur={onBlur}
                  >
                    {banks.map((b) => (
                      <option key={b.id} value={b.id}>{b.bank} — {b.rate.toFixed(2)}% anual</option>
                    ))}
                  </select>
                </div>

                {/* Down payment */}
                <div>
                  <label htmlFor="down-payment" style={labelSx}>
                    Pie: {downPayment}%
                    {priceCLP > 0 && <span style={{ fontWeight: 400, color: "var(--text-muted)", textTransform: "none", letterSpacing: 0 }}> = {formatCLP(downAmount)}</span>}
                  </label>
                  <input
                    id="down-payment"
                    type="range" min="10" max="50" step="5"
                    value={downPayment}
                    onChange={(e) => setDownPayment(parseInt(e.target.value))}
                    style={{ width: "100%", accentColor: "var(--accent)" }}
                  />
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "11px", color: "var(--text-muted)", marginTop: "2px" }}>
                    <span>10%</span><span>50%</span>
                  </div>
                </div>

                {/* Loan term */}
                <div>
                  <label htmlFor="loan-term" style={labelSx}>Plazo</label>
                  <select
                    id="loan-term"
                    value={loanTerm}
                    onChange={(e) => setLoanTerm(parseInt(e.target.value))}
                    style={{ ...inputSx, cursor: "pointer" }}
                    onFocus={onFocus}
                    onBlur={onBlur}
                  >
                    <option value="15">15 años</option>
                    <option value="20">20 años</option>
                    <option value="25">25 años</option>
                  </select>
                </div>

              </div>
            </fieldset>

          </div>

          {/* ── RIGHT: Analysis output ─────────────────────── */}
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>

            {!canAnalyze ? (
              <div style={{
                border: "2px dashed var(--border)", borderRadius: "12px",
                padding: "48px 32px", textAlign: "center",
              }}>
                <p style={{ fontSize: "28px", marginBottom: "12px" }}>📊</p>
                <p style={{ fontSize: "15px", fontWeight: 600, color: "var(--text-primary)", marginBottom: "6px" }}>
                  Tu análisis aparecerá aquí
                </p>
                <p style={{ fontSize: "14px", color: "var(--text-secondary)" }}>
                  Ingresa el precio de venta y el arriendo estimado para ver los resultados.
                </p>
              </div>
            ) : (
              <>
                {/* Dividend result */}
                <div style={{ background: "white", border: "1px solid var(--border)", borderRadius: "12px", padding: "24px" }}>
                  <p style={labelSx}>Dividendo mensual estimado</p>
                  <p style={{ fontSize: "36px", fontWeight: 800, color: "var(--accent)", letterSpacing: "-0.04em", lineHeight: 1 }}>
                    {formatCLP(monthlyPayment)}
                  </p>
                  <p style={{ fontSize: "12px", color: "var(--text-muted)", marginTop: "6px" }}>
                    {selectedBank?.bank} · {interestRate.toFixed(2)}% · {loanTerm} años · Pie {downPayment}%
                  </p>
                </div>

                {/* 3 scenarios */}
                <div style={{ background: "var(--bg-secondary)", border: "1px solid var(--border)", borderRadius: "12px", padding: "20px" }}>
                  <p style={{ ...labelSx, marginBottom: "16px" }}>
                    Comparación a {loanTerm} años
                  </p>
                  <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>

                    {/* Scenario row component */}
                    {[
                      {
                        label: "Comprar para vivir",
                        sub: "Pagas dividendo + gastos",
                        value: formatCLP(comparison?.buyTotal ?? 0),
                        highlight: (comparison?.savings ?? 0) > 0,
                        color: "var(--accent)",
                      },
                      {
                        label: "Seguir arrendando",
                        sub: `${formatCLP(rentCLP)}/mes × ${loanTerm * 12} meses`,
                        value: formatCLP(comparison?.rentTotal ?? 0),
                        highlight: false,
                        color: "var(--text-primary)",
                      },
                    ].map((s) => (
                      <div key={s.label} style={{
                        background: "white",
                        border: s.highlight ? "2px solid var(--accent)" : "1px solid var(--border)",
                        borderRadius: "10px",
                        padding: "14px 16px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        gap: "12px",
                      }}>
                        <div>
                          <p style={{ fontSize: "13px", fontWeight: 600, color: "var(--text-primary)", marginBottom: "2px" }}>{s.label}</p>
                          <p style={{ fontSize: "12px", color: "var(--text-muted)" }}>{s.sub}</p>
                        </div>
                        <p style={{ fontSize: "16px", fontWeight: 800, color: s.color, letterSpacing: "-0.02em", flexShrink: 0 }}>{s.value}</p>
                      </div>
                    ))}

                    {/* Buy to rent */}
                    <div style={{
                      background: "white", border: "1px solid var(--border)",
                      borderRadius: "10px", padding: "14px 16px",
                      display: "flex", alignItems: "center", justifyContent: "space-between", gap: "12px",
                    }}>
                      <div>
                        <p style={{ fontSize: "13px", fontWeight: 600, color: "var(--text-primary)", marginBottom: "2px" }}>Comprar para arrendar</p>
                        <p style={{ fontSize: "12px", color: "var(--text-muted)" }}>Flujo neto mensual (arriendo − dividendo − gastos)</p>
                      </div>
                      <p style={{ fontSize: "16px", fontWeight: 800, color: netFlow >= 0 ? "#16a34a" : "#dc2626", letterSpacing: "-0.02em", flexShrink: 0 }}>
                        {netFlow >= 0 ? "+" : ""}{formatCLP(netFlow)}
                      </p>
                    </div>

                  </div>
                </div>

                {/* Recommendation */}
                {comparison && (
                  <div style={{ background: "var(--bg-secondary)", border: "1px solid var(--border)", borderRadius: "12px", padding: "20px" }}>
                    <p style={{ fontSize: "13px", fontWeight: 700, color: "var(--text-primary)", marginBottom: "6px" }}>
                      Análisis
                    </p>
                    <p style={{ fontSize: "14px", color: "var(--text-secondary)", lineHeight: 1.7 }}>
                      {comparison.savings > 0
                        ? `Comprar conviene más a largo plazo. En ${loanTerm} años ahorrarías ${formatCLP(Math.abs(comparison.savings))} versus seguir arrendando, además de quedarte con la propiedad valuada en ${formatCLP(comparison.propertyValueAfter20Years)}.`
                        : `Arrendar tiene menor costo directo a ${loanTerm} años. Ajusta el pie o el plazo para mejorar el escenario de compra.`}
                    </p>
                    <p style={{ fontSize: "11px", color: "var(--text-muted)", marginTop: "8px" }}>
                      Proyección con 7% apreciación anual estimada. No incluye impuestos ni gastos de escritura.
                    </p>
                  </div>
                )}

                {/* ── Lead Capture CTA ───────────────────── */}
                <div style={{
                  background: "white", border: "1px solid var(--border)",
                  borderRadius: "12px", padding: "20px 24px",
                  display: "flex", alignItems: "center", justifyContent: "space-between",
                  gap: "16px", flexWrap: "wrap",
                }}>
                  <div>
                    <p style={{ fontSize: "15px", fontWeight: 700, color: "var(--text-primary)", marginBottom: "3px", letterSpacing: "-0.02em" }}>
                      ¿Listo para dar el siguiente paso?
                    </p>
                    <p style={{ fontSize: "13px", color: "var(--text-secondary)" }}>
                      Recibe tu análisis completo y conecta con un ejecutivo hipotecario — sin costo.
                    </p>
                  </div>
                  <button
                    onClick={() => setShowEmailModal(true)}
                    disabled={!comparison}
                    className="btn-primary"
                    style={{ padding: "10px 20px", fontSize: "14px", flexShrink: 0 }}
                  >
                    Recibir análisis + contacto →
                  </button>
                </div>

                {/* Email gate modal */}
                {showEmailModal && (() => {
                  const p = buildPayload();
                  return p ? <EmailGateModal payload={p} onClose={() => setShowEmailModal(false)} /> : null;
                })()}

              </>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
