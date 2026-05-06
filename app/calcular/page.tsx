"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { track } from "@vercel/analytics";
import { useUser } from "@clerk/nextjs";
import { calcMonthlyPayment, calc20YearComparison } from "@/lib/calculations";
import type { BankRate } from "@/lib/types";
import { getComunaInfo, getCityOptions, getComunaOptions, cityData } from "@/lib/comunaData";
import EmailGateModal from "@/components/EmailGateModal";
import type { AnalysisPayload } from "@/components/EmailGateModal";

// ─────────────────────────────────────────────────────────
// /calcular — Manual property analysis
// The user enters their own property data (price, rent, etc.)
// and gets the full 20-year analysis + lead capture CTAs.
// No mock data required. Works for any property in Chile.
// ─────────────────────────────────────────────────────────

const UF_FALLBACK = 37000;

type PropertyPurpose = "vivienda" | "inversion";

const defaultBanks: BankRate[] = [
  { id: "santander",   bank: "Banco Santander", shortName: "Santander", rate: 3.43, rateLowPie: 3.93, rateHighPie: 3.19, minDownPayment: 15, logoColor: "#C41E3A" },
  { id: "bdechile",    bank: "Banco de Chile",  shortName: "BdChile",   rate: 3.75, rateLowPie: 4.25, rateHighPie: 3.45, minDownPayment: 15, logoColor: "#0066B2" },
  { id: "scotiabank",  bank: "Scotiabank",      shortName: "Scotia",    rate: 3.65, rateLowPie: 4.15, rateHighPie: 3.35, minDownPayment: 20, logoColor: "#EC111A" },
  { id: "bci",         bank: "Banco BCI",       shortName: "BCI",       rate: 3.96, rateLowPie: 4.46, rateHighPie: 3.65, minDownPayment: 20, logoColor: "#003DA5" },
  { id: "itau",        bank: "Banco Itaú",      shortName: "Itaú",      rate: 3.55, rateLowPie: 4.05, rateHighPie: 3.25, minDownPayment: 20, logoColor: "#FF6600" },
  { id: "bancoestado", bank: "BancoEstado",      shortName: "BE",       rate: 4.19, rateLowPie: 4.69, rateHighPie: 3.89, minDownPayment: 10, logoColor: "#1B5E20" },
  { id: "security",    bank: "Banco Security",  shortName: "Security",  rate: 3.80, rateLowPie: 4.30, rateHighPie: 3.50, minDownPayment: 20, logoColor: "#1A237E" },
  { id: "bice",        bank: "Banco BICE",      shortName: "BICE",      rate: 3.70, rateLowPie: 4.20, rateHighPie: 3.40, minDownPayment: 20, logoColor: "#004D40" },
];

type RateMode = "referential" | "manual";

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
  const { isSignedIn } = useUser();

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
  const [selectedBankId, setSelectedBankId] = useState("santander");
  const [monthlyCosts, setMonthlyCosts] = useState(200000);
  const [rateMode, setRateMode]         = useState<RateMode>("referential");
  const [manualRate, setManualRate]      = useState("");
  const [manualBankName, setManualBankName] = useState("");
  const [hasPreApproval, setHasPreApproval] = useState(false);

  // Remote data
  const [banks, setBanks]       = useState<BankRate[]>(defaultBanks);
  const [ufValue, setUfValue]   = useState(UF_FALLBACK);
  const [analysisReady, setAnalysisReady] = useState(false);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");

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
  // Rate: manual override or tiered from selected bank
  const interestRate  = (() => {
    if (rateMode === "manual") {
      const parsed = parseFloat(manualRate.replace(",", "."));
      return !parsed || isNaN(parsed) ? 4.0 : parsed;
    }
    if (!selectedBank) return 4.0;
    if (downPayment >= 30) return selectedBank.rateHighPie ?? selectedBank.rate;
    if (downPayment < 20) return selectedBank.rateLowPie ?? selectedBank.rate;
    return selectedBank.rate;
  })();
  const rateTier = downPayment >= 30 ? "30%+" : downPayment < 20 ? "10-19%" : "20-29%";
  const bankLabel = rateMode === "manual" ? (manualBankName.trim() || "Tasa manual") : selectedBank?.bank ?? "";
  const loanAmount    = priceCLP * (1 - downPayment / 100);
  const downAmount    = priceCLP * (downPayment / 100);
  const monthlyPayment = priceCLP > 0 ? calcMonthlyPayment(loanAmount, interestRate, loanTerm) : 0;

  // Comuna-specific data
  const comunaInfo = getComunaInfo(city, comuna);
  const comunaAppreciation = comunaInfo?.appreciation ?? 0.06;
  const comunaCapRate = comunaInfo?.capRate ?? 0.048;

  // Auto-suggest rent using comuna cap rate (monthly = price × capRate / 12)
  const suggestedRent = priceCLP > 0 ? Math.round(priceCLP * comunaCapRate / 12) : 0;

  const effectiveRent = rentCLP > 0 ? rentCLP : suggestedRent;

  const comparison = priceCLP > 0 && effectiveRent > 0
    ? calc20YearComparison(monthlyPayment + monthlyCosts, effectiveRent, downAmount, priceCLP, loanTerm, comunaAppreciation)
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

  const getCityLabel = (id: string) => cityData[id]?.label || id;

  const buildPayload = useCallback((): AnalysisPayload | null => {
    if (!comparison || !canAnalyze) return null;
    return {
      address: comunaInfo?.label || getCityLabel(city),
      propertyType: purpose === "inversion" ? "Inversión" : "Primera vivienda",
      city: getCityLabel(city),
      rooms: 0,
      baths: 0,
      priceCLP,
      priceUF,
      ufValue,
      bankName: bankLabel,
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
      hasPreApproval: rateMode === "manual" ? hasPreApproval : undefined,
    };
  }, [comparison, canAnalyze, city, comunaInfo, priceCLP, priceUF, ufValue, bankLabel, interestRate, downPayment, downAmount, loanTerm, monthlyPayment, rentCLP, netFlow, rentalYield, rateMode, hasPreApproval]);

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
                      Usando estimación: {formatCLP(suggestedRent)}/mes (cap rate {(comunaCapRate * 100).toFixed(1)}% {comunaInfo?.label || ""})
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
                    {getCityOptions().map((c) => (
                      <option key={c.value} value={c.value}>{c.label} ({c.region})</option>
                    ))}
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
                    {getComunaOptions(city).map((c) => (
                      <option key={c.value} value={c.value}>{c.label}</option>
                    ))}
                  </select>
                </div>

                {/* Comuna context card */}
                {comunaInfo && comuna && (
                  <div style={{
                    background: "var(--accent-light)", border: "1px solid var(--accent)",
                    borderRadius: "10px", padding: "12px 14px",
                  }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
                      <p style={{ fontSize: "13px", fontWeight: 700, color: "var(--accent-dark)" }}>{comunaInfo.label}</p>
                      <span style={{
                        fontSize: "10px", fontWeight: 700, padding: "2px 8px", borderRadius: "4px",
                        background: comunaInfo.risk === "low" ? "#dcfce7" : comunaInfo.risk === "high" ? "#fef2f2" : "#fef9c3",
                        color: comunaInfo.risk === "low" ? "#16a34a" : comunaInfo.risk === "high" ? "#dc2626" : "#a16207",
                      }}>
                        Riesgo {comunaInfo.risk === "low" ? "bajo" : comunaInfo.risk === "high" ? "alto" : "medio"}
                      </span>
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "8px", fontSize: "11px", marginBottom: "6px" }}>
                      <div>
                        <p style={{ color: "var(--text-muted)", marginBottom: "1px" }}>Plusvalía/año</p>
                        <p style={{ fontWeight: 700, color: "var(--text-primary)" }}>{(comunaInfo.appreciation * 100).toFixed(0)}%</p>
                      </div>
                      <div>
                        <p style={{ color: "var(--text-muted)", marginBottom: "1px" }}>Cap rate</p>
                        <p style={{ fontWeight: 700, color: "var(--text-primary)" }}>{(comunaInfo.capRate * 100).toFixed(1)}%</p>
                      </div>
                      <div>
                        <p style={{ color: "var(--text-muted)", marginBottom: "1px" }}>Precio m²</p>
                        <p style={{ fontWeight: 700, color: "var(--text-primary)" }}>UF {comunaInfo.avgPricePerM2UF}</p>
                      </div>
                    </div>
                    <p style={{ fontSize: "11px", color: "var(--text-secondary)" }}>{comunaInfo.note}</p>
                    {comunaInfo.metro && <p style={{ fontSize: "10px", color: "var(--accent)", marginTop: "4px", fontWeight: 600 }}>🚇 Conectividad metro/transporte público</p>}
                  </div>
                )}

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

                {/* Rate mode toggle */}
                <div>
                  <label style={labelSx}>Tasa de interés</label>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px", marginBottom: "12px" }}>
                    <button
                      type="button"
                      onClick={() => setRateMode("referential")}
                      style={{
                        padding: "10px 12px",
                        border: rateMode === "referential" ? "2px solid var(--accent)" : "1px solid var(--border)",
                        borderRadius: "8px",
                        background: rateMode === "referential" ? "var(--accent-light)" : "white",
                        cursor: "pointer", textAlign: "left", transition: "all 0.15s",
                      }}
                    >
                      <p style={{ margin: 0, fontSize: "12px", fontWeight: 700, color: "var(--text-primary)" }}>🏦 Tasas referenciales</p>
                      <p style={{ margin: "2px 0 0", fontSize: "10px", color: "var(--text-muted)" }}>8 bancos · Actualizado mayo 2026</p>
                    </button>
                    <button
                      type="button"
                      onClick={() => setRateMode("manual")}
                      style={{
                        padding: "10px 12px",
                        border: rateMode === "manual" ? "2px solid var(--accent)" : "1px solid var(--border)",
                        borderRadius: "8px",
                        background: rateMode === "manual" ? "var(--accent-light)" : "white",
                        cursor: "pointer", textAlign: "left", transition: "all 0.15s",
                      }}
                    >
                      <p style={{ margin: 0, fontSize: "12px", fontWeight: 700, color: "var(--text-primary)" }}>✏️ Ya tengo mi tasa</p>
                      <p style={{ margin: "2px 0 0", fontSize: "10px", color: "var(--text-muted)" }}>Ingresa la tasa de tu cotización</p>
                    </button>
                  </div>

                  {rateMode === "referential" ? (
                    <>
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
                        Tasa para pie {rateTier} · Fuente: CMF Chile · pueden variar según perfil crediticio
                      </p>
                    </>
                  ) : (
                    <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
                        <div>
                          <input
                            type="text"
                            inputMode="decimal"
                            value={manualRate}
                            onChange={(e) => setManualRate(e.target.value)}
                            placeholder="Ej: 3.50"
                            style={inputSx}
                            onFocus={onFocus}
                            onBlur={onBlur}
                          />
                          <p style={{ fontSize: "10px", color: "var(--text-muted)", marginTop: "3px" }}>Tasa anual (%)</p>
                        </div>
                        <div>
                          <input
                            type="text"
                            value={manualBankName}
                            onChange={(e) => setManualBankName(e.target.value)}
                            placeholder="Nombre del banco (opcional)"
                            style={inputSx}
                            onFocus={onFocus}
                            onBlur={onBlur}
                          />
                          <p style={{ fontSize: "10px", color: "var(--text-muted)", marginTop: "3px" }}>Aparecerá en tu informe</p>
                        </div>
                      </div>

                      {/* Pre-approval indicator */}
                      <label
                        htmlFor="pre-approval"
                        style={{
                          display: "flex", alignItems: "center", gap: "8px",
                          cursor: "pointer", fontSize: "12px", color: "var(--text-secondary)",
                          padding: "8px 10px", borderRadius: "8px",
                          background: hasPreApproval ? "var(--accent-light)" : "var(--bg-secondary)",
                          border: hasPreApproval ? "1px solid var(--accent)" : "1px solid transparent",
                          transition: "all 0.15s",
                        }}
                      >
                        <input
                          id="pre-approval"
                          type="checkbox"
                          checked={hasPreApproval}
                          onChange={(e) => setHasPreApproval(e.target.checked)}
                          style={{ accentColor: "var(--accent)", width: "14px", height: "14px" }}
                        />
                        <span style={{ fontWeight: hasPreApproval ? 700 : 500 }}>
                          {hasPreApproval ? "✅ Tengo pre-aprobación" : "¿Tienes pre-aprobación del banco?"}
                        </span>
                      </label>
                    </div>
                  )}
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
                    {bankLabel} · {interestRate.toFixed(2)}% · {loanTerm} años · Pie {downPayment}%
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

                {/* ══ 3-WAY PATRIMONIO COMPARISON ══════════════════ */}
                <div style={{ background: "var(--bg-secondary)", border: "1px solid var(--border)", borderRadius: "12px", padding: "20px" }}>
                  <p style={{ ...labelSx, marginBottom: "4px" }}>
                    Patrimonio neto en {loanTerm} años
                  </p>
                  <p style={{ fontSize: "11px", color: "var(--text-muted)", marginBottom: "16px" }}>
                    ¿Cuál camino te deja con más patrimonio?
                  </p>

                  <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                    {/* Card: Buy to Live */}
                    {(() => {
                      const isWinner = comparison?.winner === "buy";
                      return (
                        <div style={{ background: "white", border: isWinner ? "2px solid var(--accent)" : "1px solid var(--border)", borderRadius: "10px", padding: "14px 16px" }}>
                          {isWinner && <span style={{ fontSize: "10px", fontWeight: 700, color: "var(--accent-dark)", background: "var(--accent-light)", padding: "2px 8px", borderRadius: "4px", textTransform: "uppercase", letterSpacing: "0.04em" }}>⭐ Mejor opción</span>}
                          <p style={{ fontSize: "13px", fontWeight: 700, color: "var(--text-primary)", marginTop: isWinner ? "8px" : 0, marginBottom: "8px" }}>🏠 Comprar para vivir</p>
                          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "6px", fontSize: "12px" }}>
                            <div><p style={{ color: "var(--text-muted)", marginBottom: "1px" }}>Gastas en total</p><p style={{ fontWeight: 700, color: "#dc2626" }}>{formatCLP(comparison?.buyTotal ?? 0)}</p></div>
                            <div><p style={{ color: "var(--text-muted)", marginBottom: "1px" }}>Propiedad vale</p><p style={{ fontWeight: 700, color: "#16a34a" }}>{formatCLP(comparison?.propertyValueAfter20Years ?? 0)}</p></div>
                          </div>
                          <div style={{ marginTop: "8px", paddingTop: "8px", borderTop: "1px solid var(--border)", display: "flex", justifyContent: "space-between" }}>
                            <p style={{ fontSize: "11px", color: "var(--text-muted)" }}>Patrimonio neto</p>
                            <p style={{ fontSize: "16px", fontWeight: 800, color: (comparison?.buyNetWealth ?? 0) >= 0 ? "#16a34a" : "#dc2626" }}>{(comparison?.buyNetWealth ?? 0) >= 0 ? "+" : ""}{formatCLP(comparison?.buyNetWealth ?? 0)}</p>
                          </div>
                        </div>
                      );
                    })()}

                    {/* Card: Rent + Invest */}
                    {(() => {
                      const isWinner = comparison?.winner === "rent";
                      return (
                        <div style={{ background: "white", border: isWinner ? "2px solid var(--accent)" : "1px solid var(--border)", borderRadius: "10px", padding: "14px 16px" }}>
                          {isWinner && <span style={{ fontSize: "10px", fontWeight: 700, color: "var(--accent-dark)", background: "var(--accent-light)", padding: "2px 8px", borderRadius: "4px", textTransform: "uppercase", letterSpacing: "0.04em" }}>⭐ Mejor opción</span>}
                          <p style={{ fontSize: "13px", fontWeight: 700, color: "var(--text-primary)", marginTop: isWinner ? "8px" : 0, marginBottom: "8px" }}>📈 Arrendar + invertir el pie</p>
                          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "6px", fontSize: "12px" }}>
                            <div><p style={{ color: "var(--text-muted)", marginBottom: "1px" }}>Arriendos totales</p><p style={{ fontWeight: 700, color: "#dc2626" }}>{formatCLP(comparison?.rentTotal ?? 0)}</p></div>
                            <div><p style={{ color: "var(--text-muted)", marginBottom: "1px" }}>Pie invertido crece a</p><p style={{ fontWeight: 700, color: "#16a34a" }}>{formatCLP(comparison?.pieInvested ?? 0)}</p></div>
                          </div>
                          <div style={{ marginTop: "8px", paddingTop: "8px", borderTop: "1px solid var(--border)", display: "flex", justifyContent: "space-between" }}>
                            <p style={{ fontSize: "11px", color: "var(--text-muted)" }}>Patrimonio neto</p>
                            <p style={{ fontSize: "16px", fontWeight: 800, color: (comparison?.rentNetWealth ?? 0) >= 0 ? "#16a34a" : "#dc2626" }}>{(comparison?.rentNetWealth ?? 0) >= 0 ? "+" : ""}{formatCLP(comparison?.rentNetWealth ?? 0)}</p>
                          </div>
                        </div>
                      );
                    })()}

                    {/* Card: Buy to Rent */}
                    {(() => {
                      const isWinner = comparison?.winner === "invest";
                      const cocReturn = downAmount > 0 ? ((netFlow * 12 / downAmount) * 100) : 0;
                      return (
                        <div style={{ background: "white", border: isWinner ? "2px solid var(--accent)" : "1px solid var(--border)", borderRadius: "10px", padding: "14px 16px" }}>
                          {isWinner && <span style={{ fontSize: "10px", fontWeight: 700, color: "var(--accent-dark)", background: "var(--accent-light)", padding: "2px 8px", borderRadius: "4px", textTransform: "uppercase", letterSpacing: "0.04em" }}>⭐ Mejor opción</span>}
                          <p style={{ fontSize: "13px", fontWeight: 700, color: "var(--text-primary)", marginTop: isWinner ? "8px" : 0, marginBottom: "8px" }}>🏢 Comprar para arrendar</p>
                          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "6px", fontSize: "12px" }}>
                            <div><p style={{ color: "var(--text-muted)", marginBottom: "1px" }}>Gastas en total</p><p style={{ fontWeight: 700, color: "#dc2626" }}>{formatCLP(comparison?.buyTotal ?? 0)}</p></div>
                            <div><p style={{ color: "var(--text-muted)", marginBottom: "1px" }}>Propiedad + arriendos</p><p style={{ fontWeight: 700, color: "#16a34a" }}>{formatCLP((comparison?.propertyValueAfter20Years ?? 0) + (comparison?.totalRentalIncome ?? 0))}</p></div>
                          </div>
                          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "6px", fontSize: "11px", marginTop: "8px", paddingTop: "8px", borderTop: "1px solid var(--border)" }}>
                            <div><p style={{ color: "var(--text-muted)", marginBottom: "1px" }}>Flujo/mes</p><p style={{ fontWeight: 700, color: netFlow >= 0 ? "#16a34a" : "#dc2626" }}>{netFlow >= 0 ? "+" : ""}{formatCLP(netFlow)}</p></div>
                            <div><p style={{ color: "var(--text-muted)", marginBottom: "1px" }}>Cap rate</p><p style={{ fontWeight: 700 }}>{rentalYield.toFixed(1)}%</p></div>
                            <div><p style={{ color: "var(--text-muted)", marginBottom: "1px" }}>Cash-on-cash</p><p style={{ fontWeight: 700 }}>{cocReturn.toFixed(1)}%</p></div>
                          </div>
                          <div style={{ marginTop: "8px", paddingTop: "8px", borderTop: "1px solid var(--border)", display: "flex", justifyContent: "space-between" }}>
                            <p style={{ fontSize: "11px", color: "var(--text-muted)" }}>Patrimonio neto</p>
                            <p style={{ fontSize: "16px", fontWeight: 800, color: (comparison?.investNetWealth ?? 0) >= 0 ? "#16a34a" : "#dc2626" }}>{(comparison?.investNetWealth ?? 0) >= 0 ? "+" : ""}{formatCLP(comparison?.investNetWealth ?? 0)}</p>
                          </div>
                        </div>
                      );
                    })()}
                  </div>
                </div>

                {/* ══ 3-WAY VERDICT ═════════════════════════ */}
                {comparison && (() => {
                  const w = comparison.winner;
                  const bw = formatCLP(comparison.buyNetWealth);
                  const rw = formatCLP(comparison.rentNetWealth);
                  const iw = formatCLP(comparison.investNetWealth);

                  let icon: string, title: string, color: string, body: string, tip: string;

                  if (w === "invest") {
                    icon = "🏢"; title = "Comprar para arrendar es lo más rentable"; color = "#16a34a";
                    body = `Como inversión, esta propiedad genera un patrimonio neto de ${iw} en ${loanTerm} años — más que comprar para vivir (${bw}) o arrendar e invertir (${rw}).`;
                    if (netFlow >= 0) {
                      body += ` Con cash flow positivo de ${formatCLP(netFlow)}/mes desde el día 1 y un cap rate de ${rentalYield.toFixed(1)}%.`;
                      tip = "Esta propiedad es una buena inversión. El arriendo cubre el dividendo y genera ingreso pasivo.";
                    } else {
                      body += ` Requiere un subsidio de ${formatCLP(Math.abs(netFlow))}/mes, pero la plusvalía y el ingreso por arriendo lo compensan.`;
                      tip = comparison.cashFlowBreakEvenYear > 0
                        ? `El arriendo cubre el dividendo a partir del año ${comparison.cashFlowBreakEvenYear} (sube 3%/año).`
                        : `Aumenta el pie para reducir el subsidio mensual.`;
                    }
                  } else if (w === "buy") {
                    icon = "🏠"; title = "Comprar para vivir es la mejor opción"; color = "#16a34a";
                    body = `Vivir en tu propiedad genera un patrimonio neto de ${bw} en ${loanTerm} años. Es mejor que arrendar e invertir (${rw}).`;
                    if (comparison.investNetWealth > comparison.buyNetWealth) {
                      body += ` Pero como inversión para arrendar generarías aún más (${iw}).`;
                    }
                    tip = comparison.breakEvenYear > 0 ? `Comprar supera a arrendar a partir del año ${comparison.breakEvenYear}.` : "";
                  } else {
                    icon = "📈"; title = "Arrendar + invertir el pie conviene más"; color = "#0f766e";
                    body = `Arrendar e invertir tu pie en un fondo al 6% genera un patrimonio de ${rw} — más que comprar para vivir (${bw}).`;
                    if (comparison.investNetWealth > comparison.rentNetWealth) {
                      body += ` Sin embargo, comprar para arrendar sería aún mejor (${iw}).`;
                      tip = `Si puedes comprar sin vivir ahí, la inversión inmobiliaria genera más patrimonio.`;
                    } else {
                      body += ` El precio de esta propiedad es alto relativo al arriendo de la zona.`;
                      tip = "Busca propiedades con cap rate > 5% para mejor inversión, o espera a mejores tasas.";
                    }
                  }

                  return (
                    <div style={{ background: "var(--bg-secondary)", border: "1px solid var(--border)", borderRadius: "12px", padding: "20px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
                        <span style={{ fontSize: "18px" }}>{icon}</span>
                        <p style={{ fontSize: "14px", fontWeight: 700, color }}>{title}</p>
                      </div>
                      <p style={{ fontSize: "14px", color: "var(--text-secondary)", lineHeight: 1.7 }}>{body}</p>
                      {tip && (
                        <p style={{ fontSize: "12px", color: "var(--accent)", marginTop: "8px", fontWeight: 600 }}>
                          💡 {tip}
                        </p>
                      )}
                      <p style={{ fontSize: "11px", color: "var(--text-muted)", marginTop: "10px", paddingTop: "8px", borderTop: "1px solid var(--border)" }}>
                        Supuestos: plusvalía {(comunaAppreciation * 100).toFixed(0)}%/año ({comunaInfo?.label || "promedio"}) · arriendo sube 3%/año · fondo alternativo 6%/año · fuente: CCHC/SII.
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
                      { label: comparison?.winner === "invest" ? "Patrimonio inversión" : comparison && comparison.savings > 0 ? "Patrimonio compra" : "Patrimonio arriendo", value: formatCLP(Math.max(comparison?.buyNetWealth ?? 0, comparison?.rentNetWealth ?? 0, comparison?.investNetWealth ?? 0)) },
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

                {/* Standalone broker CTA — visible to ALL users after analysis */}
                {comparison && (
                  <div style={{
                    border: "1.5px solid #BBF7D0", borderRadius: "12px", padding: "20px",
                    background: "linear-gradient(135deg, #F0FDF4 0%, #ECFDF5 100%)",
                    marginBottom: "16px",
                  }}>
                    <div style={{ display: "flex", alignItems: "flex-start", gap: "12px" }}>
                      <span style={{ fontSize: "24px", flexShrink: 0 }}>🏦</span>
                      <div style={{ flex: 1 }}>
                        <p style={{ fontSize: "15px", fontWeight: 700, color: "var(--text-primary)", marginBottom: "4px" }}>
                          ¿Listo para dar el siguiente paso?
                        </p>
                        <p style={{ fontSize: "13px", color: "var(--text-secondary)", lineHeight: 1.5, marginBottom: "12px" }}>
                          Conecta gratis con un ejecutivo hipotecario que te ayude a evaluar el crédito para esta propiedad. Sin compromiso, sin costo.
                        </p>
                        <button
                          onClick={() => { setShowEmailModal(true); track("broker_cta_clicked", { page: "calcular", city, source: "standalone_cta" }); }}
                          disabled={!comparison}
                          style={{
                            padding: "12px 24px", fontSize: "14px", fontWeight: 700,
                            color: "white", background: "#16a34a",
                            border: "none", borderRadius: "8px",
                            cursor: "pointer", transition: "all 0.15s",
                          }}
                          onMouseOver={(e) => { e.currentTarget.style.background = "#15803d"; e.currentTarget.style.transform = "translateY(-1px)"; }}
                          onMouseOut={(e) => { e.currentTarget.style.background = "#16a34a"; e.currentTarget.style.transform = ""; }}
                        >
                          Hablar con un ejecutivo →
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Insurance CTA — every mortgage needs seguro de desgravamen + incendio */}
                {comparison && priceCLP > 0 && (
                  <div style={{
                    border: "1px solid #BFDBFE", borderRadius: "12px", padding: "20px",
                    background: "linear-gradient(135deg, #EFF6FF 0%, #F0F9FF 100%)",
                    marginBottom: "16px",
                  }}>
                    <div style={{ display: "flex", alignItems: "flex-start", gap: "12px" }}>
                      <span style={{ fontSize: "24px", flexShrink: 0 }}>🛡️</span>
                      <div style={{ flex: 1 }}>
                        <p style={{ fontSize: "14px", fontWeight: 700, color: "var(--text-primary)", marginBottom: "4px" }}>
                          ¿Sabías que necesitas seguro para tu crédito hipotecario?
                        </p>
                        <p style={{ fontSize: "13px", color: "var(--text-secondary)", lineHeight: 1.5, marginBottom: "4px" }}>
                          Todo crédito hipotecario en Chile requiere <strong>seguro de desgravamen</strong> (vida) y <strong>seguro de incendio</strong>. 
                          Cotizar antes te da poder de negociación con el banco.
                        </p>
                        <p style={{ fontSize: "12px", color: "var(--text-muted)", marginBottom: "12px" }}>
                          Estimación para tu propiedad: <strong>{formatCLP(Math.round(priceCLP * 0.003))}-{formatCLP(Math.round(priceCLP * 0.006))}/año</strong> en primas
                        </p>
                        <button
                          onClick={() => { track("insurance_cta_clicked", { page: "calcular", priceCLP, city }); window.open("https://www.consorcio.cl/seguros/seguro-de-desgravamen?utm_source=propadvisor&utm_medium=referral&utm_campaign=calculadora", "_blank"); }}
                          style={{
                            padding: "10px 20px", fontSize: "13px", fontWeight: 700,
                            color: "#1D4ED8", background: "white",
                            border: "1.5px solid #93C5FD", borderRadius: "8px",
                            cursor: "pointer", transition: "all 0.15s",
                          }}
                          onMouseOver={(e) => { e.currentTarget.style.background = "#DBEAFE"; }}
                          onMouseOut={(e) => { e.currentTarget.style.background = "white"; }}
                        >
                          Cotizar seguros hipotecarios →
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Save to portfolio + Pro upgrade */}
                {isSignedIn ? (
                  <div style={{
                    border: saveStatus === "saved" ? "2px solid #16a34a" : "1px solid var(--border)",
                    borderRadius: "12px", padding: "20px",
                    background: saveStatus === "saved" ? "#f0fdf4" : "var(--bg-secondary)",
                    display: "flex", alignItems: "center", gap: "16px", flexWrap: "wrap",
                  }}>
                    <div style={{ flex: 1, minWidth: "200px" }}>
                      {saveStatus === "saved" ? (
                        <>
                          <p style={{ fontSize: "14px", fontWeight: 700, color: "#16a34a", marginBottom: "4px" }}>
                            ✅ Guardado en tu portfolio
                          </p>
                          <p style={{ fontSize: "13px", color: "var(--text-secondary)" }}>
                            <a href="/dashboard" style={{ color: "var(--accent)", fontWeight: 600, textDecoration: "none" }}>Ver en mi portfolio →</a>
                          </p>
                        </>
                      ) : (
                        <>
                          <p style={{ fontSize: "14px", fontWeight: 700, color: "var(--text-primary)", marginBottom: "4px" }}>
                            💼 Guardar en mi portfolio
                          </p>
                          <p style={{ fontSize: "13px", color: "var(--text-secondary)", marginBottom: "8px" }}>
                            Guarda este análisis para comparar con otras propiedades después.
                          </p>
                          <label style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "12px", color: "var(--text-secondary)", cursor: "pointer" }}>
                            <input type="checkbox" defaultChecked style={{ accentColor: "var(--accent)" }} id="save-broker-optin" />
                            También quiero que un ejecutivo hipotecario me contacte
                          </label>
                        </>
                      )}
                    </div>
                    {saveStatus !== "saved" && (
                      <button
                        onClick={async () => {
                          if (!comparison) return;
                          setSaveStatus("saving");
                          try {
                            const res = await fetch("/api/portfolio", {
                              method: "POST",
                              headers: { "Content-Type": "application/json" },
                              body: JSON.stringify({
                                label: `${comunaInfo?.label || getCityLabel(city)} — UF ${Math.round(priceUF).toLocaleString("es-CL")}`,
                                city: getCityLabel(city),
                                comuna: comunaInfo?.label || "",
                                priceUF,
                                priceCLP,
                                monthlyRent: effectiveRent,
                                propertyType: purpose === "inversion" ? "Inversión" : "Primera vivienda",
                                bankName: bankLabel,
                                interestRate,
                                downPaymentPct: downPayment,
                                loanTermYears: loanTerm,
                                monthlyPayment,
                                monthlyCosts,
                                buyNetWealth: comparison.buyNetWealth,
                                rentNetWealth: comparison.rentNetWealth,
                                investNetWealth: comparison.investNetWealth,
                                netMonthlyFlow: netFlow,
                                capRate: rentalYield,
                                winner: comparison.winner,
                              }),
                            });
                            if (!res.ok) {
                              const data = await res.json().catch(() => ({}));
                              if (data.upgrade) {
                                alert("Has alcanzado el límite de 1 propiedad en el plan gratuito. Actualiza a Pro para guardar propiedades ilimitadas.");
                                window.location.href = "/pricing";
                                return;
                              }
                              throw new Error();
                            }
                            setSaveStatus("saved");
                            track("property_saved", { city, comuna: comunaInfo?.label || "" });

                            // Fix 1: Send broker lead if opt-in checkbox is checked
                            const brokerCheckbox = document.getElementById("save-broker-optin") as HTMLInputElement | null;
                            if (brokerCheckbox?.checked) {
                              const payload = buildPayload();
                              if (payload) {
                                fetch("/api/send-analysis", {
                                  method: "POST",
                                  headers: { "Content-Type": "application/json" },
                                  body: JSON.stringify({
                                    email: "portfolio-lead@propadvisor.site",
                                    wantsBrokerContact: true,
                                    ...payload,
                                  }),
                                }).catch(() => {});
                              }
                            }
                          } catch {
                            setSaveStatus("error");
                            setTimeout(() => setSaveStatus("idle"), 3000);
                          }
                        }}
                        disabled={saveStatus === "saving" || !comparison}
                        style={{
                          padding: "10px 20px", fontSize: "13px", fontWeight: 700,
                          color: "white", background: "var(--accent)",
                          border: "none", borderRadius: "8px",
                          cursor: saveStatus === "saving" ? "wait" : "pointer",
                          flexShrink: 0, transition: "all 0.15s",
                        }}
                      >
                        {saveStatus === "saving" ? "Guardando..." : saveStatus === "error" ? "Error — reintentar" : "Guardar →"}
                      </button>
                    )}
                  </div>
                ) : (
                  <p style={{ fontSize: "12px", color: "var(--text-muted)", textAlign: "center" }}>
                    ¿Quieres guardar este análisis? <a href="/sign-in" style={{ color: "var(--accent)", fontWeight: 600, textDecoration: "none" }}>Inicia sesión</a> para acceder a tu portfolio.
                  </p>
                )}

              </>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
