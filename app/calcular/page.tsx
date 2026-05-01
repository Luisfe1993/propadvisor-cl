"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { track } from "@vercel/analytics";
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

// Comunas by city
const comunasByCity: Record<string, string[]> = {
  santiago: [
    "Providencia", "Las Condes", "Ñuñoa", "Vitacura", "Lo Barnechea",
    "La Reina", "Macul", "San Miguel", "La Florida", "Peñalolén",
    "Santiago Centro", "Barrio Italia", "Bellavista", "Maipú", "Puente Alto",
    "La Cisterna", "San Bernardo", "Huechuraba", "Quilicura", "Otra",
  ],
  valparaiso: [
    "Valparaíso Centro", "Viña del Mar", "Concón", "Quilpué", "Villa Alemana", "Otra",
  ],
  concepcion: [
    "Concepción Centro", "San Pedro de la Paz", "Chiguayante", "Hualpén", "Talcahuano", "Otra",
  ],
};

type PropertyPurpose = "vivienda" | "inversion";

const defaultBanks: BankRate[] = [
  { id: "bancoestado", bank: "BancoEstado",    shortName: "BE",        rate: 4.19, rateLowPie: 4.69, rateHighPie: 3.89, minDownPayment: 10, logoColor: "#1B5E20" },
  { id: "santander",   bank: "Banco Santander", shortName: "Santander", rate: 3.43, rateLowPie: 3.93, rateHighPie: 3.19, minDownPayment: 15, logoColor: "#C41E3A" },
  { id: "bci",         bank: "Banco BCI",       shortName: "BCI",       rate: 3.96, rateLowPie: 4.46, rateHighPie: 3.65, minDownPayment: 20, logoColor: "#003DA5" },
  { id: "bdechile",    bank: "Banco de Chile",  shortName: "BdChile",   rate: 3.75, rateLowPie: 4.25, rateHighPie: 3.45, minDownPayment: 15, logoColor: "#0066B2" },
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
  const [comuna, setComuna]             = useState("");
  const [purpose, setPurpose]           = useState<PropertyPurpose>("vivienda");

  // Mortgage inputs
  const [downPayment, setDownPayment]   = useState(20);
  const [loanTerm, setLoanTerm]         = useState(20);
  const [selectedBankId, setSelectedBankId] = useState("bancoestado");
  const [monthlyCosts, setMonthlyCosts] = useState(200000);

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
  // Rate varies by down payment tier
  const interestRate  = (() => {
    if (!selectedBank) return 4.19;
    if (downPayment >= 30) return selectedBank.rateHighPie ?? selectedBank.rate;
    if (downPayment < 20) return selectedBank.rateLowPie ?? selectedBank.rate;
    return selectedBank.rate;
  })();
  const rateTier = downPayment >= 30 ? "30%+" : downPayment < 20 ? "10-19%" : "20-29%";
  const loanAmount    = priceCLP * (1 - downPayment / 100);
  const downAmount    = priceCLP * (downPayment / 100);
  const monthlyPayment = priceCLP > 0 ? calcMonthlyPayment(loanAmount, interestRate, loanTerm) : 0;

  // Auto-suggest rent when price changes and rent is empty
  const suggestedRent = priceCLP > 0 ? Math.round(priceCLP * 0.004) : 0;

  const effectiveRent = rentCLP > 0 ? rentCLP : suggestedRent;

  const comparison = priceCLP > 0 && effectiveRent > 0
    ? calc20YearComparison(monthlyPayment + monthlyCosts, effectiveRent, downAmount, priceCLP, loanTerm)
    : null;

  const netFlow     = effectiveRent - monthlyPayment - monthlyCosts;
  const rentalYield = priceCLP > 0 && effectiveRent > 0 ? (effectiveRent * 12) / priceCLP * 100 : 0;

  // Total interest paid over the loan
  const totalInterest = monthlyPayment * loanTerm * 12 - loanAmount;

  const canAnalyze = priceCLP > 0 && effectiveRent > 0;

  // Track analysis completion
  useEffect(() => {
    if (canAnalyze && comparison) {
      track("analysis_completed", {
        city,
        bank: selectedBank?.bank || "",
        priceUF: Math.round(priceUF),
        downPayment,
        loanTerm,
      });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [canAnalyze]);

  const cityLabel: Record<string, string> = {
    santiago: "Santiago", valparaiso: "Valparaíso", concepcion: "Concepción",
  };

  const buildPayload = useCallback((): AnalysisPayload | null => {
    if (!comparison || !canAnalyze) return null;
    return {
      address: comuna || cityLabel[city] || city,
      propertyType: purpose === "inversion" ? "Inversión" : "Primera vivienda",
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
      rentMonthlyCLP: effectiveRent,
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
                Calculadora hipotecaria Chile
              </p>
              <h1 style={{ fontSize: "clamp(26px, 4vw, 34px)", fontWeight: 800, letterSpacing: "-0.03em", color: "var(--text-primary)", marginBottom: "6px" }}>
                Calcula tu dividendo y compara escenarios
              </h1>
              <p style={{ fontSize: "16px", color: "var(--text-secondary)", lineHeight: 1.6 }}>
                Ingresa el precio de la propiedad que encontraste — obtendrás dividendo, comparación a 20 años y un informe completo.
              </p>
              <p style={{ fontSize: "12px", color: "var(--text-muted)", marginTop: "8px", display: "flex", gap: "12px", flexWrap: "wrap" }}>
                <span>📡 UF actualizada · Banco Central</span>
                <span>🏦 Tasas reales · 4 bancos</span>
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
                    Arriendo mensual estimado (CLP)
                  </label>
                  <input
                    id="rent-input"
                    type="text"
                    inputMode="numeric"
                    value={rentRaw}
                    onChange={(e) => setRentRaw(e.target.value)}
                    placeholder={suggestedRent > 0 ? `Sugerido: ${suggestedRent.toLocaleString("es-CL")}` : "Ej: 450000"}
                    style={inputSx}
                    onFocus={onFocus}
                    onBlur={onBlur}
                  />
                  {rentCLP === 0 && suggestedRent > 0 && (
                    <p style={{ fontSize: "12px", color: "var(--accent)", marginTop: "5px", fontWeight: 600 }}>
                      Usando estimación: {formatCLP(suggestedRent)}/mes (0.4% del precio)
                    </p>
                  )}
                  {effectiveRent > 0 && priceCLP > 0 && (
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
                    onChange={(e) => { setCity(e.target.value); setComuna(""); }}
                    style={{ ...inputSx, cursor: "pointer" }}
                    onFocus={onFocus}
                    onBlur={onBlur}
                  >
                    <option value="santiago">Santiago</option>
                    <option value="valparaiso">Valparaíso</option>
                    <option value="concepcion">Concepción</option>
                  </select>
                </div>

                {/* Comuna */}
                <div>
                  <label htmlFor="comuna-select" style={labelSx}>Comuna / Sector</label>
                  <select
                    id="comuna-select"
                    value={comuna}
                    onChange={(e) => setComuna(e.target.value)}
                    style={{ ...inputSx, cursor: "pointer" }}
                    onFocus={onFocus}
                    onBlur={onBlur}
                  >
                    <option value="">Seleccionar comuna</option>
                    {(comunasByCity[city] || []).map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                {/* Property purpose */}
                <div>
                  <label style={labelSx}>¿Para qué es la propiedad?</label>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
                    {([
                      { value: "vivienda" as const, label: "🏠 Primera vivienda", sub: "Pie desde 10%" },
                      { value: "inversion" as const, label: "📈 Inversión", sub: "Pie desde 30%" },
                    ] as const).map((opt) => (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => {
                          setPurpose(opt.value);
                          if (opt.value === "inversion" && downPayment < 30) setDownPayment(30);
                        }}
                        style={{
                          padding: "12px",
                          border: purpose === opt.value ? "2px solid var(--accent)" : "1px solid var(--border)",
                          borderRadius: "10px",
                          background: purpose === opt.value ? "var(--accent-light)" : "white",
                          cursor: "pointer",
                          textAlign: "left",
                          transition: "all 0.15s",
                        }}
                      >
                        <p style={{ margin: 0, fontSize: "13px", fontWeight: 700, color: "var(--text-primary)" }}>{opt.label}</p>
                        <p style={{ margin: "2px 0 0", fontSize: "11px", color: "var(--text-muted)" }}>{opt.sub}</p>
                      </button>
                    ))}
                  </div>
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
                    {banks.map((b) => {
                      const r = downPayment >= 30 ? (b.rateHighPie ?? b.rate) : downPayment < 20 ? (b.rateLowPie ?? b.rate) : b.rate;
                      return <option key={b.id} value={b.id}>{b.bank} — {r.toFixed(2)}% anual</option>;
                    })}
                  </select>
                  <p style={{ fontSize: "11px", color: "var(--text-muted)", marginTop: "4px" }}>
                    Tasa para pie {rateTier} · Tasas referenciales, el banco puede variar según perfil
                  </p>
                </div>

                {/* Down payment */}
                <div>
                  <label htmlFor="down-payment" style={labelSx}>
                    Pie: {downPayment}%
                    {priceCLP > 0 && <span style={{ fontWeight: 400, color: "var(--text-muted)", textTransform: "none", letterSpacing: 0 }}> = {formatCLP(downAmount)}</span>}
                  </label>
                  <input
                    id="down-payment"
                    type="range" min={purpose === "inversion" ? "30" : "10"} max="50" step="5"
                    value={downPayment}
                    onChange={(e) => setDownPayment(parseInt(e.target.value))}
                    style={{ width: "100%", accentColor: "var(--accent)" }}
                  />
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "11px", color: "var(--text-muted)", marginTop: "2px" }}>
                    <span>{purpose === "inversion" ? "30%" : "10%"}</span><span>50%</span>
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

                {/* Monthly costs */}
                <div>
                  <label htmlFor="monthly-costs" style={labelSx}>
                    Gastos mensuales (GGCC + seguros): {formatCLP(monthlyCosts)}
                  </label>
                  <input
                    id="monthly-costs"
                    type="range" min="50000" max="500000" step="25000"
                    value={monthlyCosts}
                    onChange={(e) => setMonthlyCosts(parseInt(e.target.value))}
                    style={{ width: "100%", accentColor: "var(--accent)" }}
                  />
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "11px", color: "var(--text-muted)", marginTop: "2px" }}>
                    <span>$50K</span><span>$500K</span>
                  </div>
                </div>

              </div>
            </fieldset>

            {/* Portal Inmobiliario nudge */}
            <div style={{
              border: "1px solid var(--border)", borderRadius: "12px",
              padding: "16px 20px", background: "var(--bg-secondary)",
              display: "flex", alignItems: "flex-start", gap: "12px",
            }}>
              <span style={{ fontSize: "20px", flexShrink: 0, marginTop: "2px" }}>💡</span>
              <div>
                <p style={{ fontSize: "13px", fontWeight: 600, color: "var(--text-primary)", marginBottom: "4px" }}>
                  ¿Encontraste algo en Portal Inmobiliario?
                </p>
                <p style={{ fontSize: "12px", color: "var(--text-secondary)", lineHeight: 1.5 }}>
                  Copia el precio de la publicación arriba. Para el arriendo, busca propiedades similares en arriendo en la misma zona o usa nuestra estimación automática.
                </p>
              </div>
            </div>

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

                  {/* Key metrics row */}
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginTop: "16px", paddingTop: "16px", borderTop: "1px solid var(--border)" }}>
                    <div>
                      <p style={{ fontSize: "11px", color: "var(--text-muted)", marginBottom: "2px", textTransform: "uppercase", letterSpacing: "0.04em" }}>Total intereses</p>
                      <p style={{ fontSize: "15px", fontWeight: 700, color: "#dc2626" }}>{formatCLP(totalInterest > 0 ? totalInterest : 0)}</p>
                    </div>
                    <div>
                      <p style={{ fontSize: "11px", color: "var(--text-muted)", marginBottom: "2px", textTransform: "uppercase", letterSpacing: "0.04em" }}>Pie requerido</p>
                      <p style={{ fontSize: "15px", fontWeight: 700, color: "var(--text-primary)" }}>{formatCLP(downAmount)}</p>
                    </div>
                  </div>
                </div>

                {/* NET WEALTH COMPARISON — the honest view */}
                <div style={{ background: "var(--bg-secondary)", border: "1px solid var(--border)", borderRadius: "12px", padding: "20px" }}>
                  <p style={{ ...labelSx, marginBottom: "4px" }}>
                    Patrimonio neto en {loanTerm} años
                  </p>
                  <p style={{ fontSize: "11px", color: "var(--text-muted)", marginBottom: "16px" }}>
                    ¿En cuál escenario terminas con más patrimonio?
                  </p>
                  <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>

                    {/* Buy scenario */}
                    <div style={{
                      background: "white",
                      border: (comparison?.netWealthDifference ?? 0) > 0 ? "2px solid var(--accent)" : "1px solid var(--border)",
                      borderRadius: "10px", padding: "14px 16px",
                    }}>
                      {(comparison?.netWealthDifference ?? 0) > 0 && (
                        <span style={{ fontSize: "10px", fontWeight: 700, color: "var(--accent-dark)", background: "var(--accent-light)", padding: "2px 8px", borderRadius: "4px", textTransform: "uppercase", letterSpacing: "0.04em" }}>Mejor opción</span>
                      )}
                      <p style={{ fontSize: "13px", fontWeight: 600, color: "var(--text-primary)", marginTop: (comparison?.netWealthDifference ?? 0) > 0 ? "8px" : 0, marginBottom: "8px" }}>Comprar para vivir</p>
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px", fontSize: "12px" }}>
                        <div>
                          <p style={{ color: "var(--text-muted)", marginBottom: "1px" }}>Gastas en total</p>
                          <p style={{ fontWeight: 700, color: "#dc2626" }}>{formatCLP(comparison?.buyTotal ?? 0)}</p>
                        </div>
                        <div>
                          <p style={{ color: "var(--text-muted)", marginBottom: "1px" }}>Propiedad vale</p>
                          <p style={{ fontWeight: 700, color: "#16a34a" }}>{formatCLP(comparison?.propertyValueAfter20Years ?? 0)}</p>
                        </div>
                      </div>
                      <div style={{ marginTop: "8px", paddingTop: "8px", borderTop: "1px solid var(--border)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <p style={{ fontSize: "11px", color: "var(--text-muted)" }}>Patrimonio neto</p>
                        <p style={{ fontSize: "16px", fontWeight: 800, color: (comparison?.buyNetWealth ?? 0) >= 0 ? "#16a34a" : "#dc2626" }}>
                          {(comparison?.buyNetWealth ?? 0) >= 0 ? "+" : ""}{formatCLP(comparison?.buyNetWealth ?? 0)}
                        </p>
                      </div>
                    </div>

                    {/* Rent scenario */}
                    <div style={{
                      background: "white",
                      border: (comparison?.netWealthDifference ?? 0) <= 0 ? "2px solid var(--accent)" : "1px solid var(--border)",
                      borderRadius: "10px", padding: "14px 16px",
                    }}>
                      {(comparison?.netWealthDifference ?? 0) <= 0 && (
                        <span style={{ fontSize: "10px", fontWeight: 700, color: "var(--accent-dark)", background: "var(--accent-light)", padding: "2px 8px", borderRadius: "4px", textTransform: "uppercase", letterSpacing: "0.04em" }}>Mejor opción</span>
                      )}
                      <p style={{ fontSize: "13px", fontWeight: 600, color: "var(--text-primary)", marginTop: (comparison?.netWealthDifference ?? 0) <= 0 ? "8px" : 0, marginBottom: "8px" }}>Seguir arrendando + invertir el pie</p>
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px", fontSize: "12px" }}>
                        <div>
                          <p style={{ color: "var(--text-muted)", marginBottom: "1px" }}>Arriendos totales</p>
                          <p style={{ fontWeight: 700, color: "#dc2626" }}>{formatCLP(comparison?.rentTotal ?? 0)}</p>
                        </div>
                        <div>
                          <p style={{ color: "var(--text-muted)", marginBottom: "1px" }}>Pie invertido crece a</p>
                          <p style={{ fontWeight: 700, color: "#16a34a" }}>{formatCLP(comparison?.pieInvested ?? 0)}</p>
                        </div>
                      </div>
                      <div style={{ marginTop: "8px", paddingTop: "8px", borderTop: "1px solid var(--border)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <p style={{ fontSize: "11px", color: "var(--text-muted)" }}>Patrimonio neto</p>
                        <p style={{ fontSize: "16px", fontWeight: 800, color: (comparison?.rentNetWealth ?? 0) >= 0 ? "#16a34a" : "#dc2626" }}>
                          {(comparison?.rentNetWealth ?? 0) >= 0 ? "+" : ""}{formatCLP(comparison?.rentNetWealth ?? 0)}
                        </p>
                      </div>
                    </div>

                    {/* Buy to rent — investment view */}
                    <div style={{
                      background: "white", border: "1px solid var(--border)",
                      borderRadius: "10px", padding: "14px 16px",
                    }}>
                      <p style={{ fontSize: "13px", fontWeight: 600, color: "var(--text-primary)", marginBottom: "8px" }}>Comprar para arrendar</p>
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "8px", fontSize: "12px" }}>
                        <div>
                          <p style={{ color: "var(--text-muted)", marginBottom: "1px" }}>Flujo neto/mes</p>
                          <p style={{ fontWeight: 700, color: netFlow >= 0 ? "#16a34a" : "#dc2626" }}>
                            {netFlow >= 0 ? "+" : ""}{formatCLP(netFlow)}
                          </p>
                        </div>
                        <div>
                          <p style={{ color: "var(--text-muted)", marginBottom: "1px" }}>Cap rate</p>
                          <p style={{ fontWeight: 700, color: rentalYield >= 5 ? "#16a34a" : rentalYield >= 4 ? "var(--text-primary)" : "#dc2626" }}>
                            {rentalYield.toFixed(1)}%
                          </p>
                        </div>
                        <div>
                          <p style={{ color: "var(--text-muted)", marginBottom: "1px" }}>Cash-on-cash</p>
                          <p style={{ fontWeight: 700, color: "var(--text-primary)" }}>
                            {downAmount > 0 ? ((netFlow * 12 / downAmount) * 100).toFixed(1) : "0"}%
                          </p>
                        </div>
                      </div>
                      {netFlow < 0 && (
                        <p style={{ fontSize: "11px", color: "#dc2626", marginTop: "8px" }}>
                          Subsidias {formatCLP(Math.abs(netFlow))}/mes de tu bolsillo. En {loanTerm} años son {formatCLP(Math.abs(netFlow) * loanTerm * 12)} adicionales.
                        </p>
                      )}
                      {netFlow >= 0 && (
                        <p style={{ fontSize: "11px", color: "#16a34a", marginTop: "8px" }}>
                          Cash flow positivo desde el mes 1. Generas {formatCLP(netFlow * 12)}/año neto.
                        </p>
                      )}
                    </div>

                  </div>
                </div>

                {/* Recommendation — nuanced 4-verdict */}
                {comparison && (() => {
                  const diff = comparison.netWealthDifference;
                  const absFormatted = formatCLP(Math.abs(diff));
                  const buyWins = diff > 0;
                  const margin = Math.abs(diff) / (comparison.buyTotal || 1);
                  const isClear = margin > 0.05; // >5% difference = clear winner
                  const investmentViable = rentalYield >= 4 && netFlow > -200000;

                  let verdict: string;
                  let verdictColor: string;
                  let verdictIcon: string;

                  if (buyWins && isClear) {
                    verdict = `Comprar es claramente la mejor opción. Tu patrimonio neto será ${absFormatted} mayor que si arriendas e inviertes el pie en un fondo al 6% anual.`;
                    verdictColor = "#16a34a";
                    verdictIcon = "🏠";
                  } else if (buyWins && !isClear) {
                    verdict = `Comprar tiene una leve ventaja (${absFormatted} más de patrimonio), pero la diferencia es pequeña. Si valoras flexibilidad o crees que el mercado puede bajar, arrendar e invertir es una alternativa válida.`;
                    verdictColor = "var(--accent)";
                    verdictIcon = "⚖️";
                  } else if (!buyWins && !isClear) {
                    verdict = `Arrendar e invertir el pie tiene una leve ventaja (${absFormatted} más de patrimonio). Pero comprar te da estabilidad y protección contra alzas de arriendo. Ambas opciones son razonables.`;
                    verdictColor = "var(--accent)";
                    verdictIcon = "⚖️";
                  } else {
                    verdict = `Arrendar e invertir tu pie es más rentable por ${absFormatted}. El precio de esta propiedad es alto relativo al arriendo. Considera buscar una propiedad con mejor relación precio/arriendo o esperar a mejores tasas.`;
                    verdictColor = "#dc2626";
                    verdictIcon = "🏢";
                  }

                  if (investmentViable && netFlow >= 0) {
                    verdict += ` Como inversión para arrendar, esta propiedad genera cash flow positivo con un cap rate de ${rentalYield.toFixed(1)}%.`;
                  } else if (investmentViable && netFlow < 0) {
                    verdict += ` Como inversión, requiere un subsidio de ${formatCLP(Math.abs(netFlow))}/mes, pero el cap rate de ${rentalYield.toFixed(1)}% es aceptable si apuestas a la plusvalía.`;
                  }

                  return (
                    <div style={{ background: "var(--bg-secondary)", border: "1px solid var(--border)", borderRadius: "12px", padding: "20px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
                        <span style={{ fontSize: "18px" }}>{verdictIcon}</span>
                        <p style={{ fontSize: "14px", fontWeight: 700, color: verdictColor }}>
                          {buyWins ? "Comprar conviene" : diff === 0 ? "Empate" : "Arrendar + invertir conviene"}
                        </p>
                      </div>
                      <p style={{ fontSize: "14px", color: "var(--text-secondary)", lineHeight: 1.7 }}>
                        {verdict}
                      </p>
                      {comparison.breakEvenYear > 0 && comparison.breakEvenYear <= loanTerm && (
                        <p style={{ fontSize: "12px", color: "var(--text-muted)", marginTop: "8px" }}>
                          📅 Comprar se vuelve más rentable a partir del año {comparison.breakEvenYear}.
                        </p>
                      )}
                      <p style={{ fontSize: "11px", color: "var(--text-muted)", marginTop: "8px", paddingTop: "8px", borderTop: "1px solid var(--border)" }}>
                        Supuestos: plusvalía 7%/año · arriendo sube 3%/año · fondo de inversión alternativo 6%/año · no incluye impuestos, comisiones de venta ni escritura.
                      </p>
                    </div>
                  );
                })()}

                {/* ── Lead Capture CTA ───────────────────── */}
                <div style={{
                  background: "linear-gradient(135deg, #0f766e 0%, #1e3a5f 100%)",
                  borderRadius: "12px", padding: "24px",
                  color: "white",
                }}>
                  {/* Personalized summary */}
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "12px", marginBottom: "16px" }}>
                    {[
                      { label: "Tu dividendo", value: formatCLP(monthlyPayment) },
                      { label: comparison && comparison.savings > 0 ? "Ahorras comprando" : "Costo extra compra", value: formatCLP(Math.abs(comparison?.savings ?? 0)) },
                      { label: `Propiedad en ${loanTerm} años`, value: formatCLP(comparison?.propertyValueAfter20Years ?? 0) },
                    ].map((m) => (
                      <div key={m.label}>
                        <p style={{ fontSize: "10px", opacity: 0.7, marginBottom: "2px", textTransform: "uppercase", letterSpacing: "0.04em" }}>{m.label}</p>
                        <p style={{ fontSize: "14px", fontWeight: 800, letterSpacing: "-0.02em" }}>{m.value}</p>
                      </div>
                    ))}
                  </div>

                  <div style={{ borderTop: "1px solid rgba(255,255,255,0.2)", paddingTop: "16px" }}>
                    <p style={{ fontSize: "17px", fontWeight: 800, marginBottom: "4px", letterSpacing: "-0.02em" }}>
                      Recibe estos números en un informe profesional
                    </p>
                    <p style={{ fontSize: "13px", opacity: 0.85, lineHeight: 1.5, marginBottom: "16px" }}>
                      PDF listo para tu banco + Excel interactivo con amortización, comparación año a año y análisis de sensibilidad. <strong>100% gratis.</strong>
                    </p>
                    <button
                      onClick={() => { setShowEmailModal(true); track("lead_cta_clicked", { page: "calcular" }); }}
                      disabled={!comparison}
                      style={{
                        width: "100%", padding: "14px 24px",
                        background: "white", color: "#0f766e",
                        border: "none", borderRadius: "10px",
                        fontSize: "15px", fontWeight: 800,
                        cursor: "pointer", letterSpacing: "-0.01em",
                        transition: "transform 0.1s, box-shadow 0.1s",
                      }}
                      onMouseOver={(e) => { e.currentTarget.style.transform = "translateY(-1px)"; e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.2)"; }}
                      onMouseOut={(e) => { e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = ""; }}
                    >
                      Enviar informe gratis a mi email →
                    </button>
                    <p style={{ fontSize: "11px", opacity: 0.6, marginTop: "8px", textAlign: "center" }}>
                      Sin registro · Sin tarjeta · Llega en 30 segundos
                    </p>
                  </div>
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
