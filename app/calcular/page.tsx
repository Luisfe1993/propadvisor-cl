"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { track } from "@vercel/analytics";
import { useUser } from "@clerk/nextjs";
import { calcMonthlyPayment, calc20YearComparison } from "@/lib/calculations";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from "recharts";
import type { BankRate } from "@/lib/types";
import { getComunaInfo, getCityOptions, getComunaOptions, cityData } from "@/lib/comunaData";
import EmailGateModal from "@/components/EmailGateModal";
import UpgradeModal from "@/components/UpgradeModal";
import ShareAnalysis from "@/components/ShareAnalysis";
import type { AnalysisPayload } from "@/components/EmailGateModal";

// ─────────────────────────────────────────────────────────
// /calcular — 3-Step Wizard
// Step 1: Tu propiedad (property + location + purpose)
// Step 2: Tu crédito (rate, pie, term)
// Step 3: Tu resultado (analysis + single adaptive CTA)
// ─────────────────────────────────────────────────────────

const UF_FALLBACK = 37000;

type PropertyPurpose = "vivienda" | "inversion";
type RateMode = "referential" | "manual";
type InputCurrency = "CLP" | "UF";

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

// ── Styles ────────────────────────────────────────────────
const labelSx: React.CSSProperties = {
  display: "block", fontSize: "12px", fontWeight: 700,
  textTransform: "uppercase", letterSpacing: "0.05em",
  color: "var(--text-secondary)", marginBottom: "6px",
};
const inputSx: React.CSSProperties = {
  width: "100%", padding: "10px 14px", fontSize: "16px",
  border: "1px solid var(--border)", borderRadius: "8px",
  background: "white", color: "var(--text-primary)", outline: "none",
  transition: "border-color 0.15s, box-shadow 0.15s",
  appearance: "none", WebkitAppearance: "none",
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
  const { isSignedIn, user } = useUser();

  // ── Wizard step ─────────────────────────────────────────
  const [step, setStep] = useState(1);

  // ── Step 1: Property inputs ─────────────────────────────
  const [priceRaw, setPriceRaw]           = useState("");
  const [priceCurrency, setPriceCurrency] = useState<InputCurrency>("UF");
  const [city, setCity]                   = useState("santiago");
  const [comuna, setComuna]               = useState("providencia");
  const [purpose, setPurpose]             = useState<PropertyPurpose>("vivienda");

  // ── Step 2: Mortgage inputs ─────────────────────────────
  const [downPayment, setDownPayment]       = useState(20);
  const [loanTerm, setLoanTerm]             = useState(20);
  const [selectedBankId, setSelectedBankId] = useState("santander");
  const [monthlyCosts, setMonthlyCosts]     = useState(200000);
  const [rateMode, setRateMode]             = useState<RateMode>("referential");
  const [manualRate, setManualRate]         = useState("");
  const [manualBankName, setManualBankName] = useState("");

  // ── Remote data ─────────────────────────────────────────
  const [banks, setBanks]     = useState<BankRate[]>(defaultBanks);
  const [ufValue, setUfValue] = useState(UF_FALLBACK);
  const [tpm, setTpm]         = useState<number | null>(null);
  const [ipc, setIpc]         = useState<number | null>(null);
  const [dolar, setDolar]     = useState<number | null>(null);

  // ── UI state ────────────────────────────────────────────
  const [showEmailModal, setShowEmailModal]     = useState(false);
  const [saveStatus, setSaveStatus]             = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [showAdvanced, setShowAdvanced]         = useState(false);

  // ── Fetch data on mount ─────────────────────────────────
  useEffect(() => {
    fetch("/api/tasas")
      .then((r) => r.json())
      .then((d) => { if (d.banks?.length) setBanks(d.banks); })
      .catch(() => {});
    fetch("/api/uf")
      .then((r) => r.json())
      .then((d) => {
        if (d.value) setUfValue(d.value);
        if (d.tpm != null) setTpm(d.tpm);
        if (d.ipc != null) setIpc(d.ipc);
        if (d.dolar != null) setDolar(d.dolar);
      })
      .catch(() => {});
  }, []);

  // ── Derived values ──────────────────────────────────────
  const formatCLP = (v: number) =>
    new Intl.NumberFormat("es-CL", { style: "currency", currency: "CLP", minimumFractionDigits: 0 }).format(v);

  // Human-readable format for big numbers: $929.406.562 → "$929M"
  const formatShort = (v: number) => {
    const abs = Math.abs(v);
    const sign = v < 0 ? "-" : "+";
    if (abs >= 1_000_000_000) return `${sign}$${(abs / 1_000_000_000).toFixed(0)} mil M`;
    if (abs >= 1_000_000) return `${sign}$${(abs / 1_000_000).toFixed(0)}M`;
    if (abs >= 1_000) return `${sign}$${(abs / 1_000).toFixed(0)}K`;
    return `${sign}$${abs}`;
  };

  const priceCLP: number = (() => {
    const n = parseFloat(priceRaw.replace(/\./g, "").replace(",", "."));
    if (!n || isNaN(n)) return 0;
    return priceCurrency === "UF" ? n * ufValue : n;
  })();
  const priceUF = priceCLP / ufValue;

  const selectedBank = banks.find((b) => b.id === selectedBankId) ?? banks[0];
  const interestRate = (() => {
    if (rateMode === "manual") {
      const parsed = parseFloat(manualRate.replace(",", "."));
      return !parsed || isNaN(parsed) ? 4.0 : parsed;
    }
    if (!selectedBank) return 4.0;
    if (downPayment >= 30) return selectedBank.rateHighPie ?? selectedBank.rate;
    if (downPayment < 20) return selectedBank.rateLowPie ?? selectedBank.rate;
    return selectedBank.rate;
  })();
  const bankLabel = rateMode === "manual" ? (manualBankName.trim() || "Tasa manual") : selectedBank?.bank ?? "";
  const loanAmount = priceCLP * (1 - downPayment / 100);
  const downAmount = priceCLP * (downPayment / 100);
  const monthlyPayment = priceCLP > 0 ? calcMonthlyPayment(loanAmount, interestRate, loanTerm) : 0;

  // Comuna-specific data
  const comunaInfo = getComunaInfo(city, comuna);
  const comunaAppreciation = comunaInfo?.appreciation ?? 0.06;
  const comunaCapRate = comunaInfo?.capRate ?? 0.048;
  const suggestedRent = priceCLP > 0 ? Math.round(priceCLP * comunaCapRate / 12) : 0;
  const effectiveRent = suggestedRent; // auto-estimated from comuna cap rate

  const comparison = priceCLP > 0 && effectiveRent > 0
    ? calc20YearComparison(monthlyPayment + monthlyCosts, effectiveRent, downAmount, priceCLP, loanTerm, comunaAppreciation)
    : null;

  const netFlow = effectiveRent - monthlyPayment - monthlyCosts;
  const rentalYield = priceCLP > 0 && effectiveRent > 0 ? (effectiveRent * 12) / priceCLP * 100 : 0;
  const totalInterest = monthlyPayment * loanTerm * 12 - loanAmount;
  const canAnalyze = priceCLP > 0 && effectiveRent > 0;

  // Auto-select best bank (lowest rate for current pie %)
  useEffect(() => {
    if (rateMode === "referential") {
      const sorted = [...banks].sort((a, b) => {
        const rateA = downPayment >= 30 ? (a.rateHighPie ?? a.rate) : downPayment < 20 ? (a.rateLowPie ?? a.rate) : a.rate;
        const rateB = downPayment >= 30 ? (b.rateHighPie ?? b.rate) : downPayment < 20 ? (b.rateLowPie ?? b.rate) : b.rate;
        return rateA - rateB;
      });
      if (sorted[0] && sorted[0].id !== selectedBankId) {
        setSelectedBankId(sorted[0].id);
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [downPayment, rateMode, banks]);

  // Track analysis completion
  useEffect(() => {
    if (step === 3 && canAnalyze && comparison) {
      track("analysis_completed", {
        city, bank: selectedBank?.bank || "",
        priceUF: Math.round(priceUF), downPayment, loanTerm,
      });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step]);

  const getCityLabel = (id: string) => cityData[id]?.label || id;

  const buildPayload = useCallback((): AnalysisPayload | null => {
    if (!comparison || !canAnalyze) return null;
    return {
      address: comunaInfo?.label || getCityLabel(city),
      comuna: comuna || "",
      propertyType: purpose === "inversion" ? "Inversión" : "Primera vivienda",
      city: getCityLabel(city),
      rooms: 0, baths: 0,
      priceCLP, priceUF, ufValue,
      bankName: bankLabel, interestRate,
      downPaymentPct: downPayment, downPaymentCLP: downAmount,
      loanTermYears: loanTerm, monthlyPayment,
      buyTotal: comparison.buyTotal, rentTotal: comparison.rentTotal,
      rentMonthlyCLP: effectiveRent, netMonthlyFlow: netFlow, rentalYield,
      propertyValueAfter20Years: comparison.propertyValueAfter20Years,
      savings: comparison.savings,
      generatedAt: new Date().toLocaleDateString("es-CL", { day: "numeric", month: "long", year: "numeric" }),
    };
  }, [comparison, canAnalyze, city, comuna, comunaInfo, priceCLP, priceUF, ufValue, bankLabel, interestRate, downPayment, downAmount, loanTerm, monthlyPayment, netFlow, rentalYield, purpose, effectiveRent]);

  // ── Step navigation ─────────────────────────────────────
  const canGoStep2 = priceCLP > 0;
  const canGoStep3 = canGoStep2 && canAnalyze;

  const goNext = () => {
    if (step === 1 && canGoStep2) setStep(2);
    else if (step === 2 && canGoStep3) setStep(3);
  };
  const goBack = () => { if (step > 1) setStep(step - 1); };

  // ── Step indicator ──────────────────────────────────────
  const steps = [
    { n: 1, label: "Tu propiedad" },
    { n: 2, label: "Tu crédito" },
    { n: 3, label: "Tu resultado" },
  ];

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg-primary)" }}>
      <div style={{ maxWidth: "640px", margin: "0 auto", padding: "32px 24px 64px" }}>

        {/* ── Header ─────────────────────────────────────── */}
        <header style={{ marginBottom: "32px", textAlign: "center" }}>
          <Link href="/" style={{ fontSize: "13px", color: "var(--text-muted)", display: "inline-block", marginBottom: "16px" }}>
            ← Volver al inicio
          </Link>
          <h1 style={{ fontSize: "clamp(24px, 4vw, 32px)", fontWeight: 800, letterSpacing: "-0.03em", color: "var(--text-primary)", marginBottom: "6px" }}>
            Calcula en 3 pasos
          </h1>
          <p style={{ fontSize: "14px", color: "var(--text-secondary)" }}>
            Precio, crédito y resultado. Sin registro, gratis.
          </p>
          <p style={{ fontSize: "12px", color: "var(--text-muted)", marginTop: "6px" }}>
            📡 UF {ufValue.toLocaleString("es-CL")}
            {tpm != null && <> · TPM {tpm}%</>}
            {dolar != null && <> · USD ${dolar.toLocaleString("es-CL")}</>}
          </p>
        </header>

        {/* ── Step progress bar ──────────────────────────── */}
        <div style={{ display: "flex", alignItems: "center", gap: "0", marginBottom: "32px" }}>
          {steps.map((s, i) => (
            <div key={s.n} style={{ flex: 1, display: "flex", alignItems: "center" }}>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", flex: 1 }}>
                <div
                  style={{
                    width: "32px", height: "32px", borderRadius: "50%",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: "13px", fontWeight: 700,
                    background: step >= s.n ? "var(--accent)" : "var(--bg-secondary)",
                    color: step >= s.n ? "white" : "var(--text-muted)",
                    border: step >= s.n ? "none" : "1px solid var(--border)",
                    transition: "all 0.2s",
                  }}
                >
                  {step > s.n ? "✓" : s.n}
                </div>
                <p style={{
                  fontSize: "11px", fontWeight: step === s.n ? 700 : 500,
                  color: step >= s.n ? "var(--accent)" : "var(--text-muted)",
                  marginTop: "4px", textAlign: "center",
                }}>
                  {s.label}
                </p>
              </div>
              {i < steps.length - 1 && (
                <div style={{
                  height: "2px", flex: 1,
                  background: step > s.n ? "var(--accent)" : "var(--border)",
                  transition: "background 0.2s",
                  marginBottom: "18px",
                }} />
              )}
            </div>
          ))}
        </div>

        {/* ════════════════════════════════════════════════════
            STEP 1: Tu propiedad
        ════════════════════════════════════════════════════ */}
        {step === 1 && (
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <div style={{
              border: "1px solid var(--border)", borderRadius: "12px",
              padding: "24px", background: "white",
              display: "flex", flexDirection: "column", gap: "16px",
            }}>
              {/* City + Comuna in one row */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                <div>
                  <label htmlFor="city-select" style={labelSx}>Ciudad</label>
                  <select
                    id="city-select" value={city}
                    onChange={(e) => {
                      const newCity = e.target.value;
                      setCity(newCity);
                      const comunas = getComunaOptions(newCity);
                      setComuna(comunas.length > 0 ? comunas[0].value : "");
                    }}
                    style={{ ...inputSx, cursor: "pointer" }} onFocus={onFocus} onBlur={onBlur}
                  >
                    {getCityOptions().map((c) => (
                      <option key={c.value} value={c.value}>{c.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label htmlFor="comuna-select" style={labelSx}>Comuna</label>
                  <select
                    id="comuna-select" value={comuna}
                    onChange={(e) => setComuna(e.target.value)}
                    style={{ ...inputSx, cursor: "pointer" }} onFocus={onFocus} onBlur={onBlur}
                  >
                    {getComunaOptions(city).map((c) => (
                      <option key={c.value} value={c.value}>{c.label}</option>
                    ))}
                  </select>
                </div>
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
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "8px", fontSize: "11px" }}>
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
                  {comunaInfo.metro && <p style={{ fontSize: "10px", color: "var(--accent)", marginTop: "6px", fontWeight: 600 }}>🚇 Conectividad metro</p>}
                </div>
              )}

              {/* Property price */}
              <div>
                <label htmlFor="price-input" style={labelSx}>Precio de venta</label>
                <div style={{ display: "flex", gap: "8px" }}>
                  <input
                    id="price-input" type="text" inputMode="numeric"
                    value={priceRaw}
                    onChange={(e) => setPriceRaw(e.target.value)}
                    placeholder={priceCurrency === "UF" ? "Ej: 3200" : "Ej: 120000000"}
                    style={{ ...inputSx, flex: 1 }} onFocus={onFocus} onBlur={onBlur}
                    autoFocus
                  />
                  <select
                    value={priceCurrency}
                    onChange={(e) => setPriceCurrency(e.target.value as InputCurrency)}
                    aria-label="Moneda" style={{ ...inputSx, width: "80px", cursor: "pointer" }}
                    onFocus={onFocus} onBlur={onBlur}
                  >
                    <option value="UF">UF</option>
                    <option value="CLP">CLP</option>
                  </select>
                </div>
                {priceCLP > 0 && (
                  <p style={{ fontSize: "12px", color: "var(--accent)", marginTop: "5px", fontWeight: 600 }}>
                    ≈ {priceCurrency === "UF" ? formatCLP(priceCLP) : `UF ${priceUF.toLocaleString("es-CL", { maximumFractionDigits: 0 })}`}
                  </p>
                )}
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
                      key={opt.value} type="button"
                      onClick={() => {
                        setPurpose(opt.value);
                        if (opt.value === "inversion" && downPayment < 30) setDownPayment(30);
                      }}
                      style={{
                        padding: "12px",
                        border: purpose === opt.value ? "2px solid var(--accent)" : "1px solid var(--border)",
                        borderRadius: "10px",
                        background: purpose === opt.value ? "var(--accent-light)" : "white",
                        cursor: "pointer", textAlign: "left", transition: "all 0.15s",
                      }}
                    >
                      <p style={{ margin: 0, fontSize: "13px", fontWeight: 700, color: "var(--text-primary)" }}>{opt.label}</p>
                      <p style={{ margin: "2px 0 0", fontSize: "11px", color: "var(--text-muted)" }}>{opt.sub}</p>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Instant preview — shows dividend estimate */}
            {priceCLP > 0 && (
              <div style={{
                background: "var(--accent-light)", border: "1px solid var(--accent)",
                borderRadius: "12px", padding: "16px 20px", textAlign: "center",
              }}>
                <p style={{ fontSize: "12px", color: "var(--accent-dark)", fontWeight: 600, marginBottom: "4px" }}>
                  Dividendo estimado
                </p>
                <p style={{ fontSize: "28px", fontWeight: 800, color: "var(--accent)", letterSpacing: "-0.03em" }}>
                  {formatCLP(monthlyPayment)}<span style={{ fontSize: "14px", fontWeight: 500, color: "var(--text-secondary)" }}>/mes</span>
                </p>
                <p style={{ fontSize: "11px", color: "var(--text-muted)", marginTop: "4px" }}>
                  {bankLabel} · {interestRate.toFixed(2)}% · Pie {downPayment}% · {loanTerm} años — personaliza en el paso 2
                </p>
              </div>
            )}

            {/* CTA */}
            <button
              onClick={goNext} disabled={!canGoStep2}
              style={{
                width: "100%", padding: "16px", fontSize: "16px", fontWeight: 700,
                color: "white", background: canGoStep2 ? "var(--accent)" : "var(--border)",
                border: "none", borderRadius: "10px",
                cursor: canGoStep2 ? "pointer" : "not-allowed",
                transition: "all 0.15s",
              }}
            >
              {canGoStep2 ? "Personalizar crédito →" : "Ingresa el precio para continuar"}
            </button>
          </div>
        )}

        {/* ════════════════════════════════════════════════════
            STEP 2: Tu crédito
        ════════════════════════════════════════════════════ */}
        {step === 2 && (
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>

            {/* Context: what property are we configuring */}
            <div style={{
              background: "var(--bg-secondary)", borderRadius: "10px",
              padding: "12px 16px", display: "flex", justifyContent: "space-between",
              alignItems: "center", border: "1px solid var(--border)",
            }}>
              <div>
                <p style={{ fontSize: "13px", fontWeight: 700, color: "var(--text-primary)" }}>
                  {comunaInfo?.label || getCityLabel(city)} · {priceCurrency === "UF" ? `UF ${priceRaw}` : formatCLP(priceCLP)}
                </p>
                <p style={{ fontSize: "11px", color: "var(--text-muted)" }}>
                  {purpose === "inversion" ? "📈 Inversión" : "🏠 Primera vivienda"}
                </p>
              </div>
              <button
                onClick={goBack}
                style={{
                  fontSize: "12px", color: "var(--accent)", fontWeight: 600,
                  background: "none", border: "none", cursor: "pointer",
                }}
              >
                Editar
              </button>
            </div>

            <div style={{
              border: "1px solid var(--border)", borderRadius: "12px",
              padding: "24px", background: "white",
              display: "flex", flexDirection: "column", gap: "20px",
            }}>

              {/* Interest rate */}
              <div>
                <label style={labelSx}>Tasa de interés</label>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px", marginBottom: "12px" }}>
                  <button type="button" onClick={() => setRateMode("referential")}
                    style={{
                      padding: "10px 12px",
                      border: rateMode === "referential" ? "2px solid var(--accent)" : "1px solid var(--border)",
                      borderRadius: "8px",
                      background: rateMode === "referential" ? "var(--accent-light)" : "white",
                      cursor: "pointer", textAlign: "left", transition: "all 0.15s",
                    }}>
                    <p style={{ margin: 0, fontSize: "12px", fontWeight: 700, color: "var(--text-primary)" }}>🏦 Mejor tasa disponible</p>
                    <p style={{ margin: "2px 0 0", fontSize: "10px", color: "var(--text-muted)" }}>Auto-selecciona la más baja</p>
                  </button>
                  <button type="button" onClick={() => setRateMode("manual")}
                    style={{
                      padding: "10px 12px",
                      border: rateMode === "manual" ? "2px solid var(--accent)" : "1px solid var(--border)",
                      borderRadius: "8px",
                      background: rateMode === "manual" ? "var(--accent-light)" : "white",
                      cursor: "pointer", textAlign: "left", transition: "all 0.15s",
                    }}>
                    <p style={{ margin: 0, fontSize: "12px", fontWeight: 700, color: "var(--text-primary)" }}>✏️ Ya tengo mi tasa</p>
                    <p style={{ margin: "2px 0 0", fontSize: "10px", color: "var(--text-muted)" }}>Ingresa tu cotización</p>
                  </button>
                </div>

                {rateMode === "referential" ? (
                  <>
                    <select
                      id="bank-select" value={selectedBankId}
                      onChange={(e) => setSelectedBankId(e.target.value)}
                      style={{ ...inputSx, cursor: "pointer" }} onFocus={onFocus} onBlur={onBlur}
                    >
                      {banks.map((b) => {
                        const r = downPayment >= 30 ? (b.rateHighPie ?? b.rate) : downPayment < 20 ? (b.rateLowPie ?? b.rate) : b.rate;
                        return <option key={b.id} value={b.id}>{b.bank} — {r.toFixed(2)}%</option>;
                      })}
                    </select>
                    <p style={{ fontSize: "11px", color: "var(--text-muted)", marginTop: "4px" }}>
                      Fuente: CMF Chile · pueden variar según perfil crediticio
                    </p>
                  </>
                ) : (
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
                    <div>
                      <input type="text" inputMode="decimal" value={manualRate}
                        onChange={(e) => setManualRate(e.target.value)}
                        placeholder="Ej: 3.50" style={inputSx} onFocus={onFocus} onBlur={onBlur} />
                      <p style={{ fontSize: "10px", color: "var(--text-muted)", marginTop: "3px" }}>Tasa anual (%)</p>
                    </div>
                    <div>
                      <input type="text" value={manualBankName}
                        onChange={(e) => setManualBankName(e.target.value)}
                        placeholder="Banco (opcional)" style={inputSx} onFocus={onFocus} onBlur={onBlur} />
                      <p style={{ fontSize: "10px", color: "var(--text-muted)", marginTop: "3px" }}>Aparecerá en tu informe</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Down payment */}
              <div>
                <label htmlFor="down-payment" style={labelSx}>
                  Pie: {downPayment}%
                  {priceCLP > 0 && <span style={{ fontWeight: 400, color: "var(--text-muted)", textTransform: "none", letterSpacing: 0 }}> = {formatCLP(downAmount)}</span>}
                </label>
                <input id="down-payment" type="range"
                  min={purpose === "inversion" ? "30" : "10"} max="50" step="5"
                  value={downPayment}
                  onChange={(e) => setDownPayment(parseInt(e.target.value))}
                  style={{ width: "100%", accentColor: "var(--accent)" }} />
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "11px", color: "var(--text-muted)", marginTop: "2px" }}>
                  <span>{purpose === "inversion" ? "30%" : "10%"}</span><span>50%</span>
                </div>
              </div>

              {/* Loan term */}
              <div>
                <label htmlFor="loan-term" style={labelSx}>Plazo</label>
                <select id="loan-term" value={loanTerm}
                  onChange={(e) => setLoanTerm(parseInt(e.target.value))}
                  style={{ ...inputSx, cursor: "pointer" }} onFocus={onFocus} onBlur={onBlur}>
                  <option value="15">15 años</option>
                  <option value="20">20 años</option>
                  <option value="25">25 años</option>
                </select>
              </div>

              {/* Advanced toggle for monthly costs */}
              <div>
                <button
                  type="button"
                  onClick={() => setShowAdvanced(!showAdvanced)}
                  style={{
                    background: "none", border: "none", cursor: "pointer",
                    fontSize: "12px", color: "var(--text-muted)", fontWeight: 600,
                    display: "flex", alignItems: "center", gap: "4px",
                  }}
                >
                  {showAdvanced ? "▾" : "▸"} Ajustar gastos mensuales ({formatCLP(monthlyCosts)})
                </button>
                {showAdvanced && (
                  <div style={{ marginTop: "8px" }}>
                    <input id="monthly-costs" type="range"
                      min="50000" max="500000" step="25000"
                      value={monthlyCosts}
                      onChange={(e) => setMonthlyCosts(parseInt(e.target.value))}
                      style={{ width: "100%", accentColor: "var(--accent)" }} />
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: "11px", color: "var(--text-muted)", marginTop: "2px" }}>
                      <span>$50K</span><span>$500K</span>
                    </div>
                    <p style={{ fontSize: "10px", color: "var(--text-muted)", marginTop: "4px" }}>
                      Gastos comunes + seguros + administración
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Live dividend preview */}
            {canAnalyze && (
              <div style={{
                background: "var(--accent-light)", border: "1px solid var(--accent)",
                borderRadius: "12px", padding: "16px 20px", textAlign: "center",
              }}>
                <p style={{ fontSize: "12px", color: "var(--accent-dark)", fontWeight: 600, marginBottom: "4px" }}>
                  Dividendo mensual
                </p>
                <p style={{ fontSize: "32px", fontWeight: 800, color: "var(--accent)", letterSpacing: "-0.03em" }}>
                  {formatCLP(monthlyPayment)}
                </p>
                <p style={{ fontSize: "11px", color: "var(--text-muted)", marginTop: "4px" }}>
                  {bankLabel} · {interestRate.toFixed(2)}% · Pie {downPayment}% ({formatCLP(downAmount)}) · {loanTerm} años
                </p>
              </div>
            )}

            {/* Navigation */}
            <div style={{ display: "flex", gap: "12px" }}>
              <button onClick={goBack}
                style={{
                  flex: 1, padding: "14px", fontSize: "15px", fontWeight: 600,
                  color: "var(--text-secondary)", background: "var(--bg-secondary)",
                  border: "1px solid var(--border)", borderRadius: "10px", cursor: "pointer",
                }}>
                ← Atrás
              </button>
              <button onClick={goNext} disabled={!canGoStep3}
                style={{
                  flex: 2, padding: "14px", fontSize: "15px", fontWeight: 700,
                  color: "white", background: canGoStep3 ? "var(--accent)" : "var(--border)",
                  border: "none", borderRadius: "10px",
                  cursor: canGoStep3 ? "pointer" : "not-allowed",
                }}>
                Ver resultados →
              </button>
            </div>
          </div>
        )}

        {/* ════════════════════════════════════════════════════
            STEP 3: Tu resultado
        ════════════════════════════════════════════════════ */}
        {step === 3 && canAnalyze && (
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>

            {/* Edit bar */}
            <div style={{
              display: "flex", justifyContent: "space-between", alignItems: "center",
              background: "var(--bg-secondary)", borderRadius: "10px",
              padding: "10px 16px", border: "1px solid var(--border)",
            }}>
              <p style={{ fontSize: "12px", color: "var(--text-muted)" }}>
                {comunaInfo?.label || getCityLabel(city)} · UF {Math.round(priceUF).toLocaleString("es-CL")} · {bankLabel} {interestRate.toFixed(2)}%
              </p>
              <button onClick={() => setStep(2)}
                style={{ fontSize: "12px", color: "var(--accent)", fontWeight: 600, background: "none", border: "none", cursor: "pointer" }}>
                Ajustar números
              </button>
            </div>

            {/* ── Dividend card ──────────────────────────── */}
            <div style={{ background: "white", border: "1px solid var(--border)", borderRadius: "12px", padding: "24px" }}>
              <p style={labelSx}>Dividendo mensual estimado</p>
              <p style={{ fontSize: "36px", fontWeight: 800, color: "var(--accent)", letterSpacing: "-0.04em", lineHeight: 1 }}>
                {formatCLP(monthlyPayment)}
              </p>
              <p style={{ fontSize: "12px", color: "var(--text-muted)", marginTop: "6px" }}>
                {bankLabel} · {interestRate.toFixed(2)}% · {loanTerm} años · Pie {downPayment}%
              </p>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginTop: "16px", paddingTop: "16px", borderTop: "1px solid var(--border)" }}>
                <div>
                  <p style={{ fontSize: "11px", color: "var(--text-muted)", marginBottom: "2px", textTransform: "uppercase", letterSpacing: "0.04em" }}>Total intereses</p>
                  <p style={{ fontSize: "15px", fontWeight: 700, color: "#dc2626" }}>{formatShort(totalInterest > 0 ? totalInterest : 0)}</p>
                </div>
                <div>
                  <p style={{ fontSize: "11px", color: "var(--text-muted)", marginBottom: "2px", textTransform: "uppercase", letterSpacing: "0.04em" }}>Pie requerido</p>
                  <p style={{ fontSize: "15px", fontWeight: 700, color: "var(--text-primary)" }}>{formatShort(downAmount)}</p>
                </div>
              </div>
            </div>

            {/* ── ¿Cuánto ganas? — 3-Way comparison ────── */}
            {comparison && (() => {
              const w = comparison.winner;
              const cocReturn = downAmount > 0 ? ((netFlow * 12 / downAmount) * 100) : 0;

              // Build verdict text based on winner
              let verdictTitle: string, verdictBody: string, verdictTip: string;
              if (w === "invest") {
                verdictTitle = "Comprar para arrendar es lo más rentable";
                verdictBody = `Como inversión, ganas ${formatShort(comparison.investNetWealth)} en ${loanTerm} años — más que comprando para vivir (${formatShort(comparison.buyNetWealth)}) o arrendando (${formatShort(comparison.rentNetWealth)}).`;
                verdictTip = netFlow >= 0
                  ? `El arriendo cubre el dividendo y genera ${formatCLP(netFlow)}/mes de ingreso pasivo.`
                  : comparison.cashFlowBreakEvenYear > 0
                    ? `El arriendo cubre el dividendo a partir del año ${comparison.cashFlowBreakEvenYear}.`
                    : "Aumenta el pie para reducir el subsidio mensual.";
              } else if (w === "buy") {
                verdictTitle = "Comprar para vivir es la mejor opción";
                verdictBody = `Vivir en tu propiedad te deja con ${formatShort(comparison.buyNetWealth)} en ${loanTerm} años. Es mejor que arrendar (${formatShort(comparison.rentNetWealth)}).`;
                verdictTip = comparison.breakEvenYear > 0 ? `Comprar supera a arrendar a partir del año ${comparison.breakEvenYear}.` : "";
              } else {
                verdictTitle = "Arrendar + invertir el pie conviene más";
                verdictBody = `Arrendar e invertir tu pie al 6% te deja con ${formatShort(comparison.rentNetWealth)} — más que comprando (${formatShort(comparison.buyNetWealth)}).`;
                verdictTip = comparison.investNetWealth > comparison.rentNetWealth
                  ? "Si puedes comprar sin vivir ahí, la inversión inmobiliaria genera más."
                  : "Busca propiedades con cap rate > 5% o espera mejores tasas.";
              }

              // Scenario cards data
              const scenarios = [
                {
                  key: "buy", icon: "🏠", label: "Comprar para vivir",
                  gain: comparison.buyNetWealth,
                  detail: `Pagas ${formatShort(comparison.buyTotal)} → Vale ${formatShort(comparison.propertyValueAfter20Years)}`,
                },
                {
                  key: "rent", icon: "📈", label: "Arrendar + invertir",
                  gain: comparison.rentNetWealth,
                  detail: `Arriendos ${formatShort(comparison.rentTotal)} · Pie crece a ${formatShort(comparison.pieInvested)}`,
                },
                {
                  key: "invest", icon: "🏢", label: "Comprar para arrendar",
                  gain: comparison.investNetWealth,
                  detail: `Flujo ${formatShort(netFlow)}/mes · Cap rate ${rentalYield.toFixed(1)}% · CoC ${cocReturn.toFixed(1)}%`,
                },
              ];

              return (
                <div style={{ background: "var(--bg-secondary)", border: "1px solid var(--border)", borderRadius: "12px", padding: "20px" }}>
                  <p style={{ ...labelSx, marginBottom: "4px" }}>¿Cuánto ganas en {loanTerm} años?</p>
                  <p style={{ fontSize: "11px", color: "var(--text-muted)", marginBottom: "16px" }}>
                    3 caminos, un ganador claro.
                  </p>
                  <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "16px" }}>
                    {scenarios.map((s) => {
                      const isWinner = w === s.key;
                      return (
                        <div key={s.key} style={{
                          background: "white",
                          border: isWinner ? "2px solid var(--accent)" : "1px solid var(--border)",
                          borderRadius: "10px", padding: "14px 16px",
                        }}>
                          {isWinner && <span style={{ fontSize: "10px", fontWeight: 700, color: "var(--accent-dark)", background: "var(--accent-light)", padding: "2px 8px", borderRadius: "4px", textTransform: "uppercase", letterSpacing: "0.04em" }}>⭐ Mejor opción</span>}
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: isWinner ? "8px" : 0 }}>
                            <p style={{ fontSize: "13px", fontWeight: 700, color: "var(--text-primary)" }}>
                              {s.icon} {s.label}
                            </p>
                            <p style={{
                              fontSize: "20px", fontWeight: 800, letterSpacing: "-0.03em",
                              color: s.gain >= 0 ? "#16a34a" : "#dc2626",
                            }}>
                              {formatShort(s.gain)}
                            </p>
                          </div>
                          <p style={{ fontSize: "11px", color: "var(--text-muted)", marginTop: "4px" }}>
                            {s.detail}
                          </p>
                        </div>
                      );
                    })}
                  </div>

                  {/* Verdict — merged into the comparison section */}
                  <div style={{
                    background: "white", borderRadius: "10px", padding: "14px 16px",
                    border: "1px solid var(--border)",
                  }}>
                    <p style={{ fontSize: "14px", fontWeight: 700, color: "#16a34a", marginBottom: "6px" }}>
                      {scenarios.find(s => s.key === w)?.icon} {verdictTitle}
                    </p>
                    <p style={{ fontSize: "13px", color: "var(--text-secondary)", lineHeight: 1.6 }}>
                      {verdictBody}
                    </p>
                    {verdictTip && (
                      <p style={{ fontSize: "12px", color: "var(--accent)", marginTop: "6px", fontWeight: 600 }}>
                        💡 {verdictTip}
                      </p>
                    )}
                  </div>

                  <p style={{ fontSize: "10px", color: "var(--text-muted)", marginTop: "12px", textAlign: "center" }}>
                    Supuestos: plusvalía {(comunaAppreciation * 100).toFixed(0)}%/año · arriendo sube {ipc != null ? `${Math.max(ipc * 12, 2).toFixed(1)}` : "3"}%/año · fondo 6%/año
                  </p>
                </div>
              );
            })()}

            {/* ── Primary CTA (adaptive) ─────────────────── */}
            {comparison && (() => {
              // Year-by-year chart data
              const chartData = comparison.yearlySnapshots;
              const formatAxis = (v: number) => {
                const abs = Math.abs(v);
                if (abs >= 1_000_000_000) return `${v < 0 ? "-" : ""}$${(abs / 1_000_000_000).toFixed(0)} mil M`;
                if (abs >= 1_000_000) return `${v < 0 ? "-" : ""}$${(abs / 1_000_000).toFixed(0)}M`;
                if (abs >= 1_000) return `${v < 0 ? "-" : ""}$${(abs / 1_000).toFixed(0)}K`;
                return `$${v}`;
              };

              return (
                <>
                  {/* ── Chart: Evolución patrimonial ────────── */}
                  <div style={{ background: "white", border: "1px solid var(--border)", borderRadius: "12px", padding: "20px" }}>
                    <p style={{ ...labelSx, marginBottom: "4px" }}>Evolución en {loanTerm} años</p>
                    <p style={{ fontSize: "11px", color: "var(--text-muted)", marginBottom: "16px" }}>
                      Cuánto ganas en cada camino, año a año.
                    </p>

                    {/* Legend */}
                    <div style={{ display: "flex", gap: "16px", marginBottom: "12px", flexWrap: "wrap" }}>
                      {[
                        { color: "#0f766e", label: "🏠 Comprar para vivir" },
                        { color: "#2563eb", label: "📈 Arrendar + invertir" },
                        { color: "#d97706", label: "🏢 Comprar para arrendar" },
                      ].map((l) => (
                        <div key={l.label} style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                          <div style={{ width: "12px", height: "3px", borderRadius: "2px", background: l.color }} />
                          <span style={{ fontSize: "11px", color: "var(--text-secondary)" }}>{l.label}</span>
                        </div>
                      ))}
                    </div>

                    <div style={{ width: "100%", height: "260px" }}>
                      <ResponsiveContainer>
                        <LineChart data={chartData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
                          <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                          <XAxis
                            dataKey="year" tickFormatter={(v) => `${v}`}
                            style={{ fontSize: "11px" }} tick={{ fill: "var(--text-muted)" }}
                          />
                          <YAxis
                            tickFormatter={formatAxis}
                            style={{ fontSize: "10px" }} tick={{ fill: "var(--text-muted)" }}
                            width={60}
                          />
                          <Tooltip
                            formatter={(value, name) => {
                              const labels: Record<string, string> = { buy: "Comprar para vivir", rent: "Arrendar + invertir", invest: "Comprar para arrendar" };
                              return [formatAxis(Number(value)), labels[String(name)] || String(name)];
                            }}
                            labelFormatter={(label) => `Año ${label}`}
                            contentStyle={{ fontSize: "12px", borderRadius: "8px", border: "1px solid var(--border)" }}
                          />
                          <ReferenceLine y={0} stroke="var(--text-muted)" strokeDasharray="4 4" />
                          <Line type="monotone" dataKey="buy" stroke="#0f766e" strokeWidth={2.5} dot={false} />
                          <Line type="monotone" dataKey="rent" stroke="#2563eb" strokeWidth={2.5} dot={false} />
                          <Line type="monotone" dataKey="invest" stroke="#d97706" strokeWidth={2.5} dot={false} />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>

                    {comparison.breakEvenYear > 0 && (
                      <p style={{ fontSize: "11px", color: "var(--accent)", marginTop: "8px", fontWeight: 600, textAlign: "center" }}>
                        📍 Comprar supera a arrendar en el año {comparison.breakEvenYear}
                      </p>
                    )}
                  </div>

                  {/* ── CTA card ─────────────────────────────── */}
                  <div style={{
                background: "linear-gradient(135deg, #0f766e 0%, #1e3a5f 100%)",
                borderRadius: "12px", padding: "24px", color: "white",
              }}>
                {/* Personalized summary */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "12px", marginBottom: "16px" }}>
                  {[
                    { label: "Tu dividendo", value: formatCLP(monthlyPayment) },
                    { label: comparison.winner === "invest" ? "Ganas invirtiendo" : comparison.savings > 0 ? "Ganas comprando" : "Ganas arrendando", value: formatShort(Math.max(comparison.buyNetWealth, comparison.rentNetWealth, comparison.investNetWealth)) },
                    { label: `Propiedad en ${loanTerm} años`, value: formatShort(comparison.propertyValueAfter20Years) },
                  ].map((m) => (
                    <div key={m.label}>
                      <p style={{ fontSize: "10px", opacity: 0.7, marginBottom: "2px", textTransform: "uppercase", letterSpacing: "0.04em" }}>{m.label}</p>
                      <p style={{ fontSize: "14px", fontWeight: 800, letterSpacing: "-0.02em" }}>{m.value}</p>
                    </div>
                  ))}
                </div>

                <div style={{ borderTop: "1px solid rgba(255,255,255,0.2)", paddingTop: "16px" }}>
                  {isSignedIn ? (
                    /* Signed-in: Save to portfolio */
                    <>
                      <p style={{ fontSize: "17px", fontWeight: 800, marginBottom: "4px", letterSpacing: "-0.02em" }}>
                        {saveStatus === "saved" ? "✅ Guardado en tu portfolio" : "Guarda este análisis en tu portfolio"}
                      </p>
                      <p style={{ fontSize: "13px", opacity: 0.85, lineHeight: 1.5, marginBottom: "16px" }}>
                        {saveStatus === "saved"
                          ? "Puedes comparar esta propiedad con otras en tu dashboard."
                          : "Compara con otras propiedades, accede cuando quieras."}
                      </p>
                      {saveStatus === "saved" ? (
                        <a href="/dashboard"
                          style={{
                            display: "block", width: "100%", padding: "14px 24px", textAlign: "center",
                            background: "white", color: "#0f766e",
                            border: "none", borderRadius: "10px",
                            fontSize: "15px", fontWeight: 800, textDecoration: "none",
                          }}>
                          Ver mi portfolio →
                        </a>
                      ) : (
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
                                  city: getCityLabel(city), comuna: comunaInfo?.label || "",
                                  priceUF, priceCLP, monthlyRent: effectiveRent,
                                  propertyType: purpose === "inversion" ? "Inversión" : "Primera vivienda",
                                  bankName: bankLabel, interestRate,
                                  downPaymentPct: downPayment, loanTermYears: loanTerm,
                                  monthlyPayment, monthlyCosts,
                                  buyNetWealth: comparison.buyNetWealth,
                                  rentNetWealth: comparison.rentNetWealth,
                                  investNetWealth: comparison.investNetWealth,
                                  netMonthlyFlow: netFlow, capRate: rentalYield,
                                  winner: comparison.winner,
                                }),
                              });
                              if (!res.ok) {
                                const data = await res.json().catch(() => ({}));
                                if (data.upgrade) { setShowUpgradeModal(true); setSaveStatus("idle"); return; }
                                throw new Error();
                              }
                              setSaveStatus("saved");
                              track("property_saved", { city, comuna: comunaInfo?.label || "" });
                            } catch { setSaveStatus("error"); setTimeout(() => setSaveStatus("idle"), 3000); }
                          }}
                          disabled={saveStatus === "saving"}
                          style={{
                            width: "100%", padding: "14px 24px",
                            background: "white", color: "#0f766e",
                            border: "none", borderRadius: "10px",
                            fontSize: "15px", fontWeight: 800,
                            cursor: saveStatus === "saving" ? "wait" : "pointer",
                          }}>
                          {saveStatus === "saving" ? "Guardando..." : saveStatus === "error" ? "Error — reintentar" : "Guardar en portfolio →"}
                        </button>
                      )}
                    </>
                  ) : (
                    /* Anonymous: Email capture */
                    <>
                      <p style={{ fontSize: "17px", fontWeight: 800, marginBottom: "4px", letterSpacing: "-0.02em" }}>
                        Recibe estos números en un informe profesional
                      </p>
                      <p style={{ fontSize: "13px", opacity: 0.85, lineHeight: 1.5, marginBottom: "16px" }}>
                        PDF listo para tu banco + Excel interactivo con amortización y análisis de sensibilidad. <strong>100% gratis.</strong>
                      </p>
                      <button
                        onClick={() => { setShowEmailModal(true); track("lead_cta_clicked", { page: "calcular" }); }}
                        style={{
                          width: "100%", padding: "14px 24px",
                          background: "white", color: "#0f766e",
                          border: "none", borderRadius: "10px",
                          fontSize: "15px", fontWeight: 800, cursor: "pointer",
                          transition: "transform 0.1s, box-shadow 0.1s",
                        }}
                        onMouseOver={(e) => { e.currentTarget.style.transform = "translateY(-1px)"; e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.2)"; }}
                        onMouseOut={(e) => { e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = ""; }}>
                        Recibir informe gratis →
                      </button>
                      <p style={{ fontSize: "11px", opacity: 0.6, marginTop: "8px", textAlign: "center" }}>
                        Sin registro · Sin tarjeta · Llega en 30 segundos
                      </p>
                    </>
                  )}
                </div>
              </div>
                </>
              );
            })()}

            {/* ── Secondary actions ──────────────────────── */}
            {comparison && (
              <div style={{ flex: 1, minWidth: "200px" }}>
                <ShareAnalysis
                  winner={comparison.winner}
                  dividendo={formatCLP(monthlyPayment)}
                  patrimonio={formatCLP(Math.max(comparison.buyNetWealth, comparison.rentNetWealth, comparison.investNetWealth))}
                  propertyValue={formatCLP(comparison.propertyValueAfter20Years)}
                  loanTerm={loanTerm}
                  city={comunaInfo?.label || getCityLabel(city)}
                />
              </div>
            )}

            {/* Analyze another */}
            <div style={{ textAlign: "center", paddingTop: "8px" }}>
              <button
                onClick={() => { setPriceRaw(""); setSaveStatus("idle"); setStep(1); }}
                style={{
                  fontSize: "14px", fontWeight: 600, color: "var(--accent)",
                  background: "none", border: "none", cursor: "pointer",
                }}>
                Calcular otra propiedad →
              </button>
            </div>

            {/* ── Methodology (collapsible) ──────────────── */}
            <details style={{ background: "white", border: "1px solid var(--border)", borderRadius: "12px" }}>
              <summary style={{
                padding: "16px 20px", cursor: "pointer", fontSize: "13px", fontWeight: 700,
                color: "var(--text-primary)", listStyle: "none",
                display: "flex", justifyContent: "space-between", alignItems: "center",
              }}>
                📐 Metodología y supuestos
                <span style={{ fontSize: "11px", color: "var(--text-muted)" }}>▸</span>
              </summary>
              <div style={{ padding: "0 20px 20px", fontSize: "13px", color: "var(--text-secondary)", lineHeight: 1.7 }}>
                <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                  <div>
                    <p style={{ fontWeight: 700, color: "var(--text-primary)", marginBottom: "2px" }}>Dividendo mensual</p>
                    <p>Se calcula con amortización francesa (cuota fija). Fórmula: M = P × [r(1+r)ⁿ] / [(1+r)ⁿ - 1], donde P = monto financiado, r = tasa mensual, n = número de cuotas.</p>
                  </div>
                  <div>
                    <p style={{ fontWeight: 700, color: "var(--text-primary)", marginBottom: "2px" }}>Tasas de interés</p>
                    <p>Tasas referenciales de 8 bancos chilenos, actualizadas periódicamente. Varían según porcentaje de pie y perfil crediticio. Fuente: CMF Chile.</p>
                  </div>
                  <div>
                    <p style={{ fontWeight: 700, color: "var(--text-primary)", marginBottom: "2px" }}>Plusvalía por comuna</p>
                    <p>Tasa de apreciación anual estimada para cada comuna, basada en datos históricos de transacciones y tendencias del mercado local.</p>
                  </div>
                  <div>
                    <p style={{ fontWeight: 700, color: "var(--text-primary)", marginBottom: "2px" }}>Cap rate y arriendo estimado</p>
                    <p>El arriendo se estima automáticamente usando el cap rate de la comuna (ingreso anual por arriendo / precio de la propiedad). No considera vacancia.</p>
                  </div>
                  <div>
                    <p style={{ fontWeight: 700, color: "var(--text-primary)", marginBottom: "2px" }}>Comparación a 3 caminos</p>
                    <p>Se proyecta mes a mes durante el plazo del crédito. El arriendo sube 3%/año (IPC). El pie no invertido se capitaliza al 6%/año (fondo conservador). La propiedad se aprecia según la comuna seleccionada.</p>
                  </div>
                  <div style={{ background: "var(--bg-secondary)", borderRadius: "8px", padding: "12px", fontSize: "12px", color: "var(--text-muted)" }}>
                    ⚠️ Esta herramienta es informativa y educativa. No constituye asesoría financiera. Los resultados dependen de supuestos que pueden no materializarse. Consulta un profesional antes de tomar decisiones de inversión.
                  </div>
                </div>
              </div>
            </details>

            {/* ── FAQ ────────────────────────────────────── */}
            <div style={{ background: "white", border: "1px solid var(--border)", borderRadius: "12px", padding: "20px" }}>
              <p style={{ ...labelSx, marginBottom: "16px" }}>Preguntas frecuentes</p>
              <div style={{ display: "flex", flexDirection: "column", gap: "0" }}>
                {[
                  {
                    q: "¿Conviene más comprar o arrendar en Chile?",
                    a: "Depende del precio, la comuna, el pie disponible y las tasas. En general, comprar conviene si planeas quedarte más de 7 años y la plusvalía de la zona es buena. Nuestra calculadora compara los 3 caminos con datos reales de tu comuna.",
                  },
                  {
                    q: "¿Qué es el cap rate y por qué importa?",
                    a: "El cap rate (tasa de capitalización) mide cuánto rinde una propiedad como inversión: arriendo anual ÷ precio. Un cap rate de 5% significa que recuperas el 5% del valor cada año en arriendo. En Chile, varía mucho por comuna: Santiago Centro tiene cap rates altos (~6%) pero menor plusvalía.",
                  },
                  {
                    q: "¿Cuánto pie necesito para comprar un departamento?",
                    a: "Los bancos en Chile financian entre el 80% y 90% del valor. Para primera vivienda necesitas al menos 10% de pie; para inversión, mínimo 20-30%. Además, considera 1.5-2% adicional en gastos de escrituración.",
                  },
                  {
                    q: "¿Qué pasa si las tasas hipotecarias bajan?",
                    a: "Si las tasas bajan, el dividendo mensual será menor y comprar se vuelve más atractivo vs arrendar. Puedes simular distintas tasas usando la opción 'Ya tengo mi tasa' en el paso 2.",
                  },
                  {
                    q: "¿Es rentable comprar para arrendar en Santiago?",
                    a: "Depende de la comuna. Comunas con cap rate > 5% (como Santiago Centro o Estación Central) generan mejor flujo mensual. Comunas premium (Las Condes, Vitacura) tienen menor cap rate pero mayor plusvalía. Nuestra calculadora muestra el escenario de inversión con datos específicos de cada comuna.",
                  },
                  {
                    q: "¿De dónde salen las tasas de interés?",
                    a: "Las tasas son referenciales, basadas en datos publicados por los principales bancos chilenos y la CMF. La tasa real que obtengas depende de tu perfil crediticio, antigüedad laboral y relación con el banco.",
                  },
                ].map((faq, i) => (
                  <details key={i} style={{
                    borderTop: i > 0 ? "1px solid var(--border)" : "none",
                    padding: "14px 0",
                  }}>
                    <summary style={{
                      cursor: "pointer", fontSize: "14px", fontWeight: 600,
                      color: "var(--text-primary)", lineHeight: 1.4,
                    }}>
                      {faq.q}
                    </summary>
                    <p style={{ fontSize: "13px", color: "var(--text-secondary)", lineHeight: 1.7, marginTop: "8px", paddingRight: "8px" }}>
                      {faq.a}
                    </p>
                  </details>
                ))}
              </div>
            </div>

            {/* ── Feeder tool CTAs ───────────────────────── */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
              <a href="/cuanto-puedo-comprar" style={{
                background: "var(--bg-secondary)", border: "1px solid var(--border)", borderRadius: "12px",
                padding: "16px", textDecoration: "none", transition: "border-color 0.15s",
              }}>
                <p style={{ fontSize: "20px", marginBottom: "4px" }}>💰</p>
                <p style={{ fontSize: "13px", fontWeight: 700, color: "var(--text-primary)", marginBottom: "2px" }}>¿Cuánto puedo comprar?</p>
                <p style={{ fontSize: "11px", color: "var(--text-muted)" }}>Según tu sueldo</p>
              </a>
              <a href="/cuanto-pie" style={{
                background: "var(--bg-secondary)", border: "1px solid var(--border)", borderRadius: "12px",
                padding: "16px", textDecoration: "none", transition: "border-color 0.15s",
              }}>
                <p style={{ fontSize: "20px", marginBottom: "4px" }}>🏦</p>
                <p style={{ fontSize: "13px", fontWeight: 700, color: "var(--text-primary)", marginBottom: "2px" }}>¿Cuánto pie necesito?</p>
                <p style={{ fontSize: "11px", color: "var(--text-muted)" }}>Para esta propiedad</p>
              </a>
            </div>
          </div>
        )}
      </div>

      {/* ── Modals ───────────────────────────────────────── */}
      {showEmailModal && (() => {
        const p = buildPayload();
        return p ? <EmailGateModal payload={p} onClose={() => setShowEmailModal(false)} /> : null;
      })()}
      {showUpgradeModal && (
        <UpgradeModal onClose={() => setShowUpgradeModal(false)} feature="Guardar propiedades ilimitadas" />
      )}
    </div>
  );
}
