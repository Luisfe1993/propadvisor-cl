"use client";

import { useState, useCallback, useEffect } from "react";
import Link from "next/link";
import { track } from "@vercel/analytics";
import { useUser } from "@clerk/nextjs";
import { calcMonthlyPayment, calc20YearComparison } from "@/lib/calculations";
import {
  ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";
import type { BankRate } from "@/lib/types";
import { getComunaInfo, getCityOptions, getComunaOptions, cityData } from "@/lib/comunaData";
import {
  calcularAnalisisCompleto, calcMonthlyRate, calcPaymentFactor,
  calcMaxPriceByIncome, calcMaxPriceBySavings,
} from "@/lib/calcAvanzado";
import type { CalcAvanzadoInput, RateConvention } from "@/lib/calcAvanzado";
import EmailGateModal from "@/components/EmailGateModal";
import UpgradeModal from "@/components/UpgradeModal";
import ShareAnalysis from "@/components/ShareAnalysis";
import OpportunitiesView from "@/components/OpportunitiesView";
import type { AnalysisPayload } from "@/components/EmailGateModal";

// ─────────────────────────────────────────────────────────
// /calcular — Capacidad de compra: sticky Supuestos sidebar + tabs
// (issue 2 of 3: engine = LUI-7, this shell = LUI-8, property-matching = LUI-9)
// ─────────────────────────────────────────────────────────

const UF_FALLBACK = 37000;
const MONTHLY_COSTS_CLP = 200_000; // gastos comunes + seguros + administración (flat, matches old default)

type PropertyPurpose = "vivienda" | "inversion";
type RateMode = "referential" | "manual";
type TipoPropiedad = "departamento" | "casa";

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
  background: "var(--bg-primary)", color: "var(--text-primary)", outline: "none",
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
const fieldsetSx: React.CSSProperties = { marginBottom: "28px" };
const legendSx: React.CSSProperties = {
  fontSize: "12px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em",
  color: "var(--text-secondary)", marginBottom: "14px", paddingBottom: "8px",
  borderBottom: "1px solid var(--border)",
};
const fieldSx: React.CSSProperties = { marginBottom: "16px" };
const subSx: React.CSSProperties = { fontSize: "11px", color: "var(--text-muted)", marginTop: "4px", lineHeight: 1.4 };
const twoColSx: React.CSSProperties = { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" };

/** Adds `months` calendar months to `base`, clamping the day to the target month's length. */
function addMonths(base: Date, months: number): Date {
  const year = base.getFullYear();
  const month = base.getMonth() + months;
  const day = base.getDate();
  const lastDayOfTargetMonth = new Date(year, month + 1, 0).getDate();
  return new Date(year, month, Math.min(day, lastDayOfTargetMonth));
}
function dateToInputValue(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function formatUF(v: number, decimals = 0): string {
  return `UF ${(isFinite(v) ? v : 0).toLocaleString("es-CL", { minimumFractionDigits: decimals, maximumFractionDigits: decimals })}`;
}

export default function CalcularPage() {
  const { isSignedIn } = useUser();

  // ── Shared: property + credit (feed both the new tab and the legacy lead-gen path) ──
  const [city, setCity]     = useState("santiago");
  const [comuna, setComuna] = useState("providencia");
  const [purpose, setPurpose] = useState<PropertyPurpose>("vivienda");
  const [loanTerm, setLoanTerm] = useState(20);
  const [rateMode, setRateMode]             = useState<RateMode>("referential");
  const [manualRate, setManualRate]         = useState("");
  const [manualBankName, setManualBankName] = useState("");
  const [selectedBankId, setSelectedBankId] = useState("santander");

  // ── Remote data ─────────────────────────────────────────
  const [banks, setBanks]     = useState<BankRate[]>(defaultBanks);
  const [ufValue, setUfValue] = useState(UF_FALLBACK);
  const [tpm, setTpm]         = useState<number | null>(null);
  const [dolar, setDolar]     = useState<number | null>(null);

  // ── New: Supuestos panel — Mercado ──────────────────────
  const [rateConvention, setRateConvention] = useState<RateConvention>("compuesta");

  // ── New: Supuestos panel — Tu situación ─────────────────
  const [monthlyIncomeCLP, setMonthlyIncomeCLP]         = useState(2_500_000);
  const [otherMonthlyDebtsCLP, setOtherMonthlyDebtsCLP] = useState(0);
  const [availableSavingsCLP, setAvailableSavingsCLP]   = useState(45_000_000);
  const [maxIncomeRatioPct, setMaxIncomeRatioPct]       = useState(25);

  // ── New: Supuestos panel — Estructura del crédito ───────
  const [ltvOverridePct, setLtvOverridePct] = useState<string>(""); // "" = use LUI-7's purpose-aware default
  const [firstPaymentDateStr, setFirstPaymentDateStr] = useState(() => dateToInputValue(addMonths(new Date(), 1)));
  const [desgravamenPct, setDesgravamenPct]   = useState(0.02);
  const [fireInsurancePct, setFireInsurancePct] = useState(0.02);

  // ── New: Supuestos panel — Costos de compra ─────────────
  const [mortgageTaxPct, setMortgageTaxPct] = useState(0.8);
  const [cbrPct, setCbrPct]                 = useState(0.2);
  const [cbrCapUF, setCbrCapUF]             = useState(35.5);
  const [fixedCostsUF, setFixedCostsUF]     = useState(14);
  const [brokeragePct, setBrokeragePct]     = useState(0);

  // ── New: Supuestos panel — Arriendo y explotación ───────
  const [monthlyRentUF, setMonthlyRentUF]           = useState(14);
  const [vacancyPct, setVacancyPct]                 = useState(8);
  const [managementPct, setManagementPct]           = useState(8);
  const [maintenancePct, setMaintenancePct]         = useState(5);
  const [propertyTaxAnnualUF, setPropertyTaxAnnualUF] = useState(0);
  const [hoaMonthlyUF, setHoaMonthlyUF]             = useState(0);

  // ── New: Supuestos panel — Propiedad a evaluar ──────────
  const [tipoPropiedad, setTipoPropiedad] = useState<TipoPropiedad>("departamento");
  const [usarMax, setUsarMax]           = useState(true);
  const [manualPrecioUF, setManualPrecioUF] = useState("");

  // ── UI state (lead-gen) ─────────────────────────────────
  const [showEmailModal, setShowEmailModal]     = useState(false);
  const [saveStatus, setSaveStatus]             = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);

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
        if (d.dolar != null) setDolar(d.dolar);
      })
      .catch(() => {});
  }, []);

  // Auto-select the cheapest bank in "Mejor tasa" mode. LTV is decoupled
  // from this picker now (derived from the Supuestos panel instead), so
  // unlike the old page this only needs to sort by the flat `rate`.
  useEffect(() => {
    if (rateMode === "referential" && banks.length > 0) {
      const cheapest = [...banks].sort((a, b) => a.rate - b.rate)[0];
      if (cheapest && cheapest.id !== selectedBankId) setSelectedBankId(cheapest.id);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rateMode, banks]);

  // ── Derived: resolved bank rate (AC-3 — feeds calcAvanzado's tasaAnual) ──
  const formatCLP = (v: number) =>
    new Intl.NumberFormat("es-CL", { style: "currency", currency: "CLP", minimumFractionDigits: 0 }).format(v);

  const selectedBank = banks.find((b) => b.id === selectedBankId) ?? banks[0];
  const interestRate = (() => {
    if (rateMode === "manual") {
      const parsed = parseFloat(manualRate.replace(",", "."));
      return !parsed || isNaN(parsed) ? 4.0 : parsed;
    }
    if (!selectedBank) return 4.0;
    return selectedBank.rate;
  })();
  const bankLabel = rateMode === "manual" ? (manualBankName.trim() || "Tasa manual") : selectedBank?.bank ?? "";
  const getCityLabel = (id: string) => cityData[id]?.label || id;
  const comunaInfo = getComunaInfo(city, comuna);

  // ── calcAvanzado (LUI-7) — Capacidad de compra ──────────
  const firstPaymentDate = (() => {
    const [y, m, d] = firstPaymentDateStr.split("-").map(Number);
    return y && m && d ? new Date(y, m - 1, d) : addMonths(new Date(), 1);
  })();

  const calcInput: CalcAvanzadoInput = {
    ufValue,
    annualRate: interestRate / 100,
    termYears: loanTerm,
    rateConvention,
    monthlyIncomeCLP,
    otherMonthlyDebtsCLP,
    availableSavingsCLP,
    maxIncomeRatio: maxIncomeRatioPct / 100,
    purpose,
    ltv: ltvOverridePct === "" ? undefined : Number(ltvOverridePct) / 100,
    firstPaymentDate,
    desgravamenRate: desgravamenPct / 100,
    fireInsuranceRate: fireInsurancePct / 100,
    mortgageTaxRate: mortgageTaxPct / 100,
    cbrRate: cbrPct / 100,
    cbrCapUF,
    fixedCostsUF,
    brokerageRate: brokeragePct / 100,
    monthlyRentUF,
    vacancyRate: vacancyPct / 100,
    managementRate: managementPct / 100,
    maintenanceRate: maintenancePct / 100,
    propertyTaxAnnualUF,
    hoaMonthlyUF,
    cityId: city,
    comunaId: comuna,
    evaluatedPriceUF: usarMax ? undefined : (parseFloat(manualPrecioUF) || undefined),
  };

  const resolvedLtv = calcInput.ltv ?? (purpose === "vivienda" ? 0.9 : 0.8);
  const termMonths = Math.max(1, Math.round(loanTerm)) * 12;
  const monthlyRateValue = calcMonthlyRate(calcInput.annualRate, rateConvention);
  const paymentFactorValue = calcPaymentFactor(monthlyRateValue, termMonths);
  // "¿Qué te limita?" needs the individual renta/ahorro ceilings, which the
  // orchestrator's pinned return shape doesn't expose — call the other
  // exported pure functions directly (still "consumed as-is", NG-3).
  const byIncome = calcMaxPriceByIncome(calcInput, paymentFactorValue, resolvedLtv);
  const bySavingsUF = calcMaxPriceBySavings(calcInput, resolvedLtv);
  const result = calcularAnalisisCompleto(calcInput);

  const cashTotalUF = result.rentabilidad.downPaymentUF + result.gastosCompra.totalUF;
  const brechaUF = Math.abs(byIncome.priceUF - bySavingsUF);
  const ahorroUF = ufValue > 0 ? availableSavingsCLP / ufValue : 0;

  // ── Legacy lead-gen path (calc20YearComparison / calcMonthlyPayment) ───
  // Preserved unchanged (NG-3), fed by the same price/rate/term/city/comuna
  // as the new tab; LTV is derived from the same resolvedLtv above so both
  // sections describe the same deal.
  const priceUF = result.precioEvaluadoUF;
  const priceCLP = priceUF * ufValue;
  const downPaymentPct = Math.round((1 - resolvedLtv) * 100);
  const downAmount = priceCLP * (1 - resolvedLtv);
  const loanAmount = priceCLP * resolvedLtv;
  const monthlyPayment = priceCLP > 0 ? calcMonthlyPayment(loanAmount, interestRate, loanTerm) : 0;

  const comunaAppreciation = comunaInfo?.appreciation ?? 0.06;
  const comunaCapRate = comunaInfo?.capRate ?? 0.048;
  const suggestedRent = priceCLP > 0 ? Math.round(priceCLP * comunaCapRate / 12) : 0;
  const effectiveRent = suggestedRent;

  const comparison = priceCLP > 0 && effectiveRent > 0
    ? calc20YearComparison(monthlyPayment + MONTHLY_COSTS_CLP, effectiveRent, downAmount, priceCLP, loanTerm, comunaAppreciation)
    : null;

  const netFlow = effectiveRent - monthlyPayment - MONTHLY_COSTS_CLP;
  const rentalYield = priceCLP > 0 && effectiveRent > 0 ? (effectiveRent * 12) / priceCLP * 100 : 0;
  const canAnalyze = priceCLP > 0 && effectiveRent > 0;

  useEffect(() => {
    if (canAnalyze && comparison) {
      track("analysis_completed", { city, bank: selectedBank?.bank || "", priceUF: Math.round(priceUF), downPaymentPct, loanTerm });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [Math.round(priceUF), loanTerm, interestRate]);

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
      downPaymentPct, downPaymentCLP: downAmount,
      loanTermYears: loanTerm, monthlyPayment,
      buyTotal: comparison.buyTotal, rentTotal: comparison.rentTotal,
      rentMonthlyCLP: effectiveRent, netMonthlyFlow: netFlow, rentalYield,
      propertyValueAfter20Years: comparison.propertyValueAfter20Years,
      savings: comparison.savings,
      generatedAt: new Date().toLocaleDateString("es-CL", { day: "numeric", month: "long", year: "numeric" }),
    };
  }, [comparison, canAnalyze, city, comuna, comunaInfo, priceCLP, priceUF, ufValue, bankLabel, interestRate, downPaymentPct, downAmount, loanTerm, monthlyPayment, netFlow, rentalYield, purpose, effectiveRent]);

  // ── Payment-composition chart data (yearly buckets) ─────
  const chartData = (() => {
    const rows = result.amortizacion.rows;
    const years = Math.ceil(rows.length / 12);
    const data: { year: number; amortizacion: number; intereses: number; saldo: number }[] = [];
    for (let y = 0; y < years; y++) {
      const chunk = rows.slice(y * 12, y * 12 + 12);
      if (!chunk.length) continue;
      data.push({
        year: y + 1,
        amortizacion: chunk.reduce((s, r) => s + r.principalUF, 0),
        intereses: chunk.reduce((s, r) => s + r.interestUF, 0),
        saldo: chunk[chunk.length - 1].endingBalanceUF,
      });
    }
    return data;
  })();

  const comunaOptions = getComunaOptions(city);

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg-primary)" }}>
      <style>{`
        @media (min-width: 1024px) {
          .calc-layout { grid-template-columns: 340px 1fr !important; align-items: start; }
          .calc-sidebar { position: sticky; top: 24px; max-height: calc(100vh - 48px); overflow-y: auto; }
        }
      `}</style>

      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "32px 24px 64px" }}>

        {/* ── Header ─────────────────────────────────────── */}
        <header style={{ marginBottom: "28px" }}>
          <Link href="/" style={{ fontSize: "13px", color: "var(--text-muted)", display: "inline-block", marginBottom: "12px" }}>
            ← Volver al inicio
          </Link>
          <h1 style={{ fontSize: "clamp(24px, 4vw, 32px)", fontWeight: 800, letterSpacing: "-0.03em", color: "var(--text-primary)", marginBottom: "6px" }}>
            ¿Cuánto puedo comprar?
          </h1>
          <p style={{ fontSize: "14px", color: "var(--text-secondary)" }}>
            Ajusta cualquier supuesto: todo se recalcula al instante. Sin registro, gratis.
          </p>
          <p style={{ fontSize: "12px", color: "var(--text-muted)", marginTop: "6px" }}>
            📡 UF {ufValue.toLocaleString("es-CL")}
            {tpm != null && <> · TPM {tpm}%</>}
            {dolar != null && <> · USD ${dolar.toLocaleString("es-CL")}</>}
          </p>
        </header>

        {/* ── Layout: sidebar + tabs ─────────────────────── */}
        <div className="calc-layout" style={{ display: "grid", gridTemplateColumns: "1fr", gap: "24px" }}>

          {/* ════════════ SUPUESTOS SIDEBAR ════════════ */}
          <aside className="calc-sidebar" style={{
            border: "1px solid var(--border)", borderRadius: "12px",
            padding: "24px", background: "var(--bg-primary)", boxShadow: "var(--shadow-sm)",
          }}>
            <h2 style={{ fontSize: "18px", fontWeight: 700, color: "var(--text-primary)", marginBottom: "4px" }}>Supuestos</h2>
            <p style={{ fontSize: "13px", color: "var(--text-secondary)", marginBottom: "24px" }}>
              Todo el análisis se recalcula al instante.
            </p>

            {/* Mercado */}
            <fieldset style={fieldsetSx}>
              <legend style={legendSx}>Mercado</legend>
              <div style={fieldSx}>
                <label htmlFor="uf-input" style={labelSx}>Valor de la UF <span style={{ fontWeight: 400, textTransform: "none" }}>(CLP)</span></label>
                <input id="uf-input" type="number" min={1} value={ufValue}
                  onChange={(e) => setUfValue(parseFloat(e.target.value) || UF_FALLBACK)}
                  style={inputSx} onFocus={onFocus} onBlur={onBlur} />
              </div>

              <div style={fieldSx}>
                <label style={labelSx}>Tasa anual</label>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px", marginBottom: "10px" }}>
                  <button type="button" onClick={() => setRateMode("referential")}
                    style={{
                      padding: "9px 10px", border: rateMode === "referential" ? "2px solid var(--accent)" : "1px solid var(--border)",
                      borderRadius: "8px", background: rateMode === "referential" ? "var(--accent-light)" : "var(--bg-primary)",
                      cursor: "pointer", textAlign: "left", transition: "all 0.15s",
                    }}>
                    <p style={{ margin: 0, fontSize: "11px", fontWeight: 700, color: "var(--text-primary)" }}>🏦 Mejor tasa</p>
                  </button>
                  <button type="button" onClick={() => setRateMode("manual")}
                    style={{
                      padding: "9px 10px", border: rateMode === "manual" ? "2px solid var(--accent)" : "1px solid var(--border)",
                      borderRadius: "8px", background: rateMode === "manual" ? "var(--accent-light)" : "var(--bg-primary)",
                      cursor: "pointer", textAlign: "left", transition: "all 0.15s",
                    }}>
                    <p style={{ margin: 0, fontSize: "11px", fontWeight: 700, color: "var(--text-primary)" }}>✏️ Ya tengo tasa</p>
                  </button>
                </div>
                {rateMode === "referential" ? (
                  <select value={selectedBankId} onChange={(e) => setSelectedBankId(e.target.value)}
                    style={{ ...inputSx, cursor: "pointer" }} onFocus={onFocus} onBlur={onBlur}>
                    {banks.map((b) => <option key={b.id} value={b.id}>{b.bank} — {b.rate.toFixed(2)}%</option>)}
                  </select>
                ) : (
                  <div style={twoColSx}>
                    <input type="text" inputMode="decimal" value={manualRate} onChange={(e) => setManualRate(e.target.value)}
                      placeholder="Ej: 3.50" style={inputSx} onFocus={onFocus} onBlur={onBlur} />
                    <input type="text" value={manualBankName} onChange={(e) => setManualBankName(e.target.value)}
                      placeholder="Banco (opcional)" style={inputSx} onFocus={onFocus} onBlur={onBlur} />
                  </div>
                )}
              </div>

              <div style={twoColSx}>
                <div>
                  <label htmlFor="plazo-select" style={labelSx}>Plazo</label>
                  <select id="plazo-select" value={loanTerm} onChange={(e) => setLoanTerm(parseInt(e.target.value))}
                    style={{ ...inputSx, cursor: "pointer" }} onFocus={onFocus} onBlur={onBlur}>
                    <option value="15">15 años</option>
                    <option value="20">20 años</option>
                    <option value="25">25 años</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="convencion-select" style={labelSx}>Convención mensual</label>
                  <select id="convencion-select" value={rateConvention} onChange={(e) => setRateConvention(e.target.value as RateConvention)}
                    style={{ ...inputSx, cursor: "pointer" }} onFocus={onFocus} onBlur={onBlur}>
                    <option value="compuesta">Compuesta</option>
                    <option value="lineal">Lineal</option>
                  </select>
                </div>
              </div>
            </fieldset>

            {/* Tu situación */}
            <fieldset style={fieldsetSx}>
              <legend style={legendSx}>Tu situación</legend>
              <div style={fieldSx}>
                <label htmlFor="renta-input" style={labelSx}>Renta líquida mensual <span style={{ fontWeight: 400, textTransform: "none" }}>(CLP)</span></label>
                <input id="renta-input" type="number" min={0} step={50000} value={monthlyIncomeCLP}
                  onChange={(e) => setMonthlyIncomeCLP(parseFloat(e.target.value) || 0)}
                  style={inputSx} onFocus={onFocus} onBlur={onBlur} />
              </div>
              <div style={fieldSx}>
                <label htmlFor="deudas-input" style={labelSx}>Otras deudas/cuotas mensuales <span style={{ fontWeight: 400, textTransform: "none" }}>(CLP)</span></label>
                <input id="deudas-input" type="number" min={0} step={10000} value={otherMonthlyDebtsCLP}
                  onChange={(e) => setOtherMonthlyDebtsCLP(parseFloat(e.target.value) || 0)}
                  style={inputSx} onFocus={onFocus} onBlur={onBlur} />
              </div>
              <div style={fieldSx}>
                <label htmlFor="ahorro-input" style={labelSx}>Ahorro disponible <span style={{ fontWeight: 400, textTransform: "none" }}>(CLP)</span></label>
                <input id="ahorro-input" type="number" min={0} step={500000} value={availableSavingsCLP}
                  onChange={(e) => setAvailableSavingsCLP(parseFloat(e.target.value) || 0)}
                  style={inputSx} onFocus={onFocus} onBlur={onBlur} />
                <p style={subSx}>Debe cubrir el pie y los gastos operacionales.</p>
              </div>
              <div>
                <label htmlFor="pctRenta-input" style={labelSx}>Máx. renta destinada al dividendo <span style={{ fontWeight: 400, textTransform: "none" }}>(%)</span></label>
                <input id="pctRenta-input" type="number" min={1} max={60} value={maxIncomeRatioPct}
                  onChange={(e) => setMaxIncomeRatioPct(parseFloat(e.target.value) || 0)}
                  style={inputSx} onFocus={onFocus} onBlur={onBlur} />
              </div>
            </fieldset>

            {/* Estructura del crédito */}
            <fieldset style={fieldsetSx}>
              <legend style={legendSx}>Estructura del crédito</legend>
              <div style={fieldSx}>
                <label style={labelSx}>¿Para qué es la propiedad?</label>
                <div style={twoColSx}>
                  {([
                    { value: "vivienda" as const, label: "🏠 Vivienda" },
                    { value: "inversion" as const, label: "📈 Inversión" },
                  ]).map((opt) => (
                    <button key={opt.value} type="button" onClick={() => setPurpose(opt.value)}
                      style={{
                        padding: "10px", border: purpose === opt.value ? "2px solid var(--accent)" : "1px solid var(--border)",
                        borderRadius: "8px", background: purpose === opt.value ? "var(--accent-light)" : "var(--bg-primary)",
                        cursor: "pointer", fontSize: "12px", fontWeight: 700, color: "var(--text-primary)", transition: "all 0.15s",
                      }}>
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>
              <div style={fieldSx}>
                <label htmlFor="ltv-input" style={labelSx}>Financiamiento del banco <span style={{ fontWeight: 400, textTransform: "none" }}>(% del valor)</span></label>
                <input id="ltv-input" type="number" min={10} max={100} value={ltvOverridePct}
                  placeholder={String(Math.round(resolvedLtv * 100))}
                  onChange={(e) => setLtvOverridePct(e.target.value)}
                  style={inputSx} onFocus={onFocus} onBlur={onBlur} />
                <p style={subSx}>Por defecto {Math.round((purpose === "vivienda" ? 0.9 : 0.8) * 100)}% según el propósito. Editable.</p>
              </div>
              <div style={fieldSx}>
                <label htmlFor="fecha-input" style={labelSx}>Fecha de la primera cuota</label>
                <input id="fecha-input" type="date" value={firstPaymentDateStr}
                  onChange={(e) => setFirstPaymentDateStr(e.target.value)}
                  style={inputSx} onFocus={onFocus} onBlur={onBlur} />
              </div>
              <div style={twoColSx}>
                <div>
                  <label htmlFor="desgr-input" style={labelSx}>Desgravamen <span style={{ fontWeight: 400, textTransform: "none" }}>(% mensual)</span></label>
                  <input id="desgr-input" type="number" min={0} step={0.005} value={desgravamenPct}
                    onChange={(e) => setDesgravamenPct(parseFloat(e.target.value) || 0)}
                    style={inputSx} onFocus={onFocus} onBlur={onBlur} />
                </div>
                <div>
                  <label htmlFor="incendio-input" style={labelSx}>Incendio <span style={{ fontWeight: 400, textTransform: "none" }}>(% mensual)</span></label>
                  <input id="incendio-input" type="number" min={0} step={0.005} value={fireInsurancePct}
                    onChange={(e) => setFireInsurancePct(parseFloat(e.target.value) || 0)}
                    style={inputSx} onFocus={onFocus} onBlur={onBlur} />
                </div>
              </div>
            </fieldset>

            {/* Costos de compra */}
            <fieldset style={fieldsetSx}>
              <legend style={legendSx}>Costos de compra</legend>
              <div style={fieldSx}>
                <label htmlFor="mutuo-select" style={labelSx}>Impuesto al mutuo</label>
                <select id="mutuo-select" value={mortgageTaxPct} onChange={(e) => setMortgageTaxPct(parseFloat(e.target.value))}
                  style={{ ...inputSx, cursor: "pointer" }} onFocus={onFocus} onBlur={onBlur}>
                  <option value={0.8}>0,8% — vivienda estándar</option>
                  <option value={0.2}>0,2% — DFL2</option>
                  <option value={0}>0% — vivienda social</option>
                </select>
              </div>
              <div style={twoColSx}>
                <div>
                  <label htmlFor="cbr-input" style={labelSx}>CBR <span style={{ fontWeight: 400, textTransform: "none" }}>(% precio)</span></label>
                  <input id="cbr-input" type="number" min={0} step={0.05} value={cbrPct}
                    onChange={(e) => setCbrPct(parseFloat(e.target.value) || 0)}
                    style={inputSx} onFocus={onFocus} onBlur={onBlur} />
                </div>
                <div>
                  <label htmlFor="cbrTope-input" style={labelSx}>Tope CBR <span style={{ fontWeight: 400, textTransform: "none" }}>(UF)</span></label>
                  <input id="cbrTope-input" type="number" min={0} step={0.5} value={cbrCapUF}
                    onChange={(e) => setCbrCapUF(parseFloat(e.target.value) || 0)}
                    style={inputSx} onFocus={onFocus} onBlur={onBlur} />
                </div>
              </div>
              <div style={{ ...fieldSx, marginTop: "16px" }}>
                <label htmlFor="fijos-input" style={labelSx}>Gastos fijos <span style={{ fontWeight: 400, textTransform: "none" }}>(UF)</span></label>
                <input id="fijos-input" type="number" min={0} step={1} value={fixedCostsUF}
                  onChange={(e) => setFixedCostsUF(parseFloat(e.target.value) || 0)}
                  style={inputSx} onFocus={onFocus} onBlur={onBlur} />
                <p style={subSx}>Tasación, notaría, estudio de títulos.</p>
              </div>
              <div>
                <label htmlFor="corretaje-input" style={labelSx}>Corretaje <span style={{ fontWeight: 400, textTransform: "none" }}>(% precio)</span></label>
                <input id="corretaje-input" type="number" min={0} step={0.5} value={brokeragePct}
                  onChange={(e) => setBrokeragePct(parseFloat(e.target.value) || 0)}
                  style={inputSx} onFocus={onFocus} onBlur={onBlur} />
              </div>
            </fieldset>

            {/* Arriendo y explotación */}
            <fieldset style={fieldsetSx}>
              <legend style={legendSx}>Arriendo y explotación</legend>
              <div style={fieldSx}>
                <label htmlFor="arriendo-input" style={labelSx}>Arriendo mensual esperado <span style={{ fontWeight: 400, textTransform: "none" }}>(UF)</span></label>
                <input id="arriendo-input" type="number" min={0} step={0.5} value={monthlyRentUF}
                  onChange={(e) => setMonthlyRentUF(parseFloat(e.target.value) || 0)}
                  style={inputSx} onFocus={onFocus} onBlur={onBlur} />
              </div>
              <div style={twoColSx}>
                <div>
                  <label htmlFor="vacancia-input" style={labelSx}>Vacancia <span style={{ fontWeight: 400, textTransform: "none" }}>(%)</span></label>
                  <input id="vacancia-input" type="number" min={0} max={100} value={vacancyPct}
                    onChange={(e) => setVacancyPct(parseFloat(e.target.value) || 0)}
                    style={inputSx} onFocus={onFocus} onBlur={onBlur} />
                </div>
                <div>
                  <label htmlFor="admin-input" style={labelSx}>Administración <span style={{ fontWeight: 400, textTransform: "none" }}>(%)</span></label>
                  <input id="admin-input" type="number" min={0} step={0.5} value={managementPct}
                    onChange={(e) => setManagementPct(parseFloat(e.target.value) || 0)}
                    style={inputSx} onFocus={onFocus} onBlur={onBlur} />
                </div>
              </div>
              <div style={{ ...twoColSx, marginTop: "16px" }}>
                <div>
                  <label htmlFor="mant-input" style={labelSx}>Mantención <span style={{ fontWeight: 400, textTransform: "none" }}>(%)</span></label>
                  <input id="mant-input" type="number" min={0} step={0.5} value={maintenancePct}
                    onChange={(e) => setMaintenancePct(parseFloat(e.target.value) || 0)}
                    style={inputSx} onFocus={onFocus} onBlur={onBlur} />
                </div>
                <div>
                  <label htmlFor="contrib-input" style={labelSx}>Contribuciones <span style={{ fontWeight: 400, textTransform: "none" }}>(UF/año)</span></label>
                  <input id="contrib-input" type="number" min={0} step={1} value={propertyTaxAnnualUF}
                    onChange={(e) => setPropertyTaxAnnualUF(parseFloat(e.target.value) || 0)}
                    style={inputSx} onFocus={onFocus} onBlur={onBlur} />
                </div>
              </div>
              <div style={{ marginTop: "16px" }}>
                <label htmlFor="gc-input" style={labelSx}>Gastos comunes a tu cargo <span style={{ fontWeight: 400, textTransform: "none" }}>(UF/mes)</span></label>
                <input id="gc-input" type="number" min={0} step={0.5} value={hoaMonthlyUF}
                  onChange={(e) => setHoaMonthlyUF(parseFloat(e.target.value) || 0)}
                  style={inputSx} onFocus={onFocus} onBlur={onBlur} />
              </div>
            </fieldset>

            {/* Propiedad a evaluar */}
            <fieldset style={{ marginBottom: 0 }}>
              <legend style={legendSx}>Propiedad a evaluar</legend>
              <div style={twoColSx}>
                <div>
                  <label htmlFor="city-select" style={labelSx}>Ciudad</label>
                  <select id="city-select" value={city}
                    onChange={(e) => {
                      const newCity = e.target.value;
                      setCity(newCity);
                      const options = getComunaOptions(newCity);
                      setComuna(options.length > 0 ? options[0].value : "");
                    }}
                    style={{ ...inputSx, cursor: "pointer" }} onFocus={onFocus} onBlur={onBlur}>
                    {getCityOptions().map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
                  </select>
                </div>
                <div>
                  <label htmlFor="comuna-select" style={labelSx}>Comuna</label>
                  <select id="comuna-select" value={comuna} onChange={(e) => setComuna(e.target.value)}
                    style={{ ...inputSx, cursor: "pointer" }} onFocus={onFocus} onBlur={onBlur}>
                    {comunaOptions.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
                  </select>
                </div>
              </div>
              <div style={{ marginTop: "16px" }}>
                <label htmlFor="tipo-select" style={labelSx}>Tipo de propiedad</label>
                <select id="tipo-select" value={tipoPropiedad} onChange={(e) => setTipoPropiedad(e.target.value as TipoPropiedad)}
                  style={{ ...inputSx, cursor: "pointer" }} onFocus={onFocus} onBlur={onBlur}>
                  <option value="departamento">Departamento</option>
                  <option value="casa">Casa</option>
                </select>
              </div>
              <div style={{ marginTop: "16px" }}>
                <label htmlFor="precio-input" style={labelSx}>Precio del inmueble <span style={{ fontWeight: 400, textTransform: "none" }}>(UF)</span></label>
                <input id="precio-input" type="number" min={1} step={50}
                  value={usarMax ? String(Math.round(result.precioMaximoUF)) : manualPrecioUF}
                  disabled={usarMax}
                  onChange={(e) => setManualPrecioUF(e.target.value)}
                  style={{ ...inputSx, opacity: usarMax ? 0.6 : 1 }} onFocus={onFocus} onBlur={onBlur} />
                <label style={{ display: "flex", alignItems: "center", gap: "8px", marginTop: "10px", cursor: "pointer" }}>
                  <input type="checkbox" checked={usarMax}
                    onChange={(e) => {
                      if (!e.target.checked) setManualPrecioUF(String(Math.round(result.precioMaximoUF)));
                      setUsarMax(e.target.checked);
                    }}
                    style={{ accentColor: "var(--accent)", width: "16px", height: "16px" }} />
                  <span style={{ fontSize: "13px", color: "var(--text-primary)" }}>Usar automáticamente mi precio máximo</span>
                </label>
              </div>
            </fieldset>
          </aside>

          {/* ════════════ RESULTS ════════════ */}
          <main>
            {/* Tab bar — only "Capacidad de compra" exists today (AC-4) */}
            <div role="tablist" style={{ display: "flex", gap: "4px", borderBottom: "1px solid var(--border)", marginBottom: "24px" }}>
              <button role="tab" aria-selected="true" style={{
                background: "none", border: "none", fontFamily: "inherit", fontSize: "14px", fontWeight: 700,
                color: "var(--accent)", padding: "12px 16px", cursor: "default",
                borderBottom: "2px solid var(--accent)", marginBottom: "-1px",
              }}>
                Capacidad de compra
              </button>
            </div>

            {/* KPI cards */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: "16px", marginBottom: "24px" }}>
              {[
                { k: "Precio al que puedes aspirar", v: formatUF(result.precioMaximoUF), s: formatCLP(result.precioMaximoUF * ufValue), accent: true },
                { k: "Pie necesario", v: formatUF(result.rentabilidad.downPaymentUF), s: formatCLP(result.rentabilidad.downPaymentUF * ufValue) },
                { k: "Dividendo mensual", v: formatUF(result.amortizacion.firstDividendUF, 1), s: formatCLP(result.amortizacion.firstDividendUF * ufValue) },
                { k: "Efectivo total al comprar", v: formatUF(cashTotalUF), s: formatCLP(cashTotalUF * ufValue) },
              ].map((kpi) => (
                <div key={kpi.k} className="card" style={{ padding: "20px" }}>
                  <p style={{ fontSize: "11px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--text-secondary)" }}>{kpi.k}</p>
                  <p style={{ fontSize: "26px", fontWeight: 800, letterSpacing: "-0.02em", marginTop: "8px", color: kpi.accent ? "var(--accent)" : "var(--text-primary)" }}>{kpi.v}</p>
                  <p style={{ fontSize: "13px", color: "var(--text-secondary)", marginTop: "4px" }}>{kpi.s}</p>
                </div>
              ))}
            </div>

            {/* ¿Qué te limita? */}
            <div className="card" style={{ padding: "24px", marginBottom: "24px" }}>
              <h3 style={{ fontSize: "17px", fontWeight: 700, color: "var(--text-primary)", marginBottom: "4px" }}>¿Qué te limita?</h3>
              <p style={{ fontSize: "13px", color: "var(--text-secondary)", marginBottom: "16px" }}>
                Tu techo de compra es el menor entre lo que soporta tu renta y lo que alcanza tu ahorro.
              </p>
              <div style={{ borderTop: "1px solid var(--border)" }}>
                {[
                  { n: "Techo por capacidad de pago", sub: `Dividendo máximo ${formatUF(byIncome.maxDividendUF, 1)} = ${maxIncomeRatioPct}% de tu renta menos otras cuotas`, v: formatUF(byIncome.priceUF), s: formatCLP(byIncome.priceUF * ufValue) },
                  { n: "Techo por ahorro disponible", sub: `${formatUF(ahorroUF)} deben cubrir pie de ${Math.round((1 - resolvedLtv) * 100)}% más gastos operacionales`, v: formatUF(bySavingsUF), s: formatCLP(bySavingsUF * ufValue) },
                ].map((row) => (
                  <div key={row.n} style={{ display: "flex", justifyContent: "space-between", gap: "16px", padding: "12px 0", borderBottom: "1px solid var(--border)" }}>
                    <div>
                      <p style={{ fontSize: "14px", color: "var(--text-primary)" }}>{row.n}</p>
                      <p style={{ fontSize: "12px", color: "var(--text-muted)", marginTop: "2px" }}>{row.sub}</p>
                    </div>
                    <div style={{ textAlign: "right", flexShrink: 0 }}>
                      <p style={{ fontSize: "14px", fontWeight: 700, color: "var(--text-primary)" }}>{row.v}</p>
                      <p style={{ fontSize: "12px", color: "var(--text-muted)" }}>{row.s}</p>
                    </div>
                  </div>
                ))}
                <div style={{ display: "flex", justifyContent: "space-between", gap: "16px", paddingTop: "14px" }}>
                  <p style={{ fontSize: "16px", fontWeight: 700, color: "var(--text-primary)" }}>Precio al que puedes aspirar</p>
                  <div style={{ textAlign: "right" }}>
                    <p style={{ fontSize: "16px", fontWeight: 700, color: "var(--accent)" }}>{formatUF(result.precioMaximoUF)}</p>
                    <p style={{ fontSize: "12px", color: "var(--text-muted)" }}>{formatCLP(result.precioMaximoUF * ufValue)}</p>
                  </div>
                </div>
              </div>
              <div style={{ marginTop: "20px", background: "var(--bg-secondary)", borderRadius: "8px", padding: "14px 16px", fontSize: "13px", color: "var(--text-secondary)", lineHeight: 1.6 }}>
                {result.limitante === "renta" ? (
                  <><strong style={{ color: "var(--accent)" }}>Te limita la renta.</strong> Tu ahorro alcanzaría para una propiedad {formatUF(brechaUF)} más cara, pero el dividendo no cabe en el {maxIncomeRatioPct}% de tu renta. Palancas: alargar el plazo, sumar un co-deudor, o poner más pie.</>
                ) : (
                  <><strong style={{ color: "var(--danger)" }}>Te limita el ahorro.</strong> Tu renta soportaría una propiedad {formatUF(brechaUF)} más cara, pero no tienes el pie necesario. Palancas: ahorrar la diferencia, buscar mayor financiamiento, o comprar en verde.</>
                )}
              </div>
            </div>

            {/* Estructura de la operación */}
            <div className="card" style={{ padding: "24px", marginBottom: "24px" }}>
              <h3 style={{ fontSize: "17px", fontWeight: 700, color: "var(--text-primary)", marginBottom: "4px" }}>Estructura de la operación</h3>
              <p style={{ fontSize: "13px", color: "var(--text-secondary)", marginBottom: "16px" }}>
                Sobre el precio evaluado de <strong>{formatUF(result.precioEvaluadoUF)}</strong>.
              </p>
              <div style={{ borderTop: "1px solid var(--border)" }}>
                {[
                  { n: "Precio del inmueble", v: formatUF(result.precioEvaluadoUF), s: formatCLP(result.precioEvaluadoUF * ufValue) },
                  { n: "Pie", sub: `${Math.round((1 - resolvedLtv) * 100)}% del precio`, v: `−${formatUF(result.rentabilidad.downPaymentUF)}`, s: formatCLP(result.rentabilidad.downPaymentUF * ufValue) },
                  { n: "Monto del crédito", sub: `${Math.round(resolvedLtv * 100)}% financiado a ${loanTerm} años`, v: formatUF(result.amortizacion.creditUF), s: formatCLP(result.amortizacion.creditUF * ufValue) },
                  { n: "Cuota pura (capital + interés)", sub: `Tasa ${interestRate.toFixed(2)}% anual`, v: formatUF(result.amortizacion.installmentUF, 2), s: formatCLP(result.amortizacion.installmentUF * ufValue) },
                  { n: "Seguro de desgravamen", sub: "Primera cuota", v: formatUF(result.amortizacion.rows[0]?.desgravamenUF ?? 0, 2), s: formatCLP((result.amortizacion.rows[0]?.desgravamenUF ?? 0) * ufValue) },
                  { n: "Seguro de incendio", sub: "Constante", v: formatUF(result.amortizacion.rows[0]?.fireInsuranceUF ?? 0, 2), s: formatCLP((result.amortizacion.rows[0]?.fireInsuranceUF ?? 0) * ufValue) },
                ].map((row) => (
                  <div key={row.n} style={{ display: "flex", justifyContent: "space-between", gap: "16px", padding: "12px 0", borderBottom: "1px solid var(--border)" }}>
                    <div>
                      <p style={{ fontSize: "14px", color: "var(--text-primary)" }}>{row.n}</p>
                      {row.sub && <p style={{ fontSize: "12px", color: "var(--text-muted)", marginTop: "2px" }}>{row.sub}</p>}
                    </div>
                    <div style={{ textAlign: "right", flexShrink: 0 }}>
                      <p style={{ fontSize: "14px", fontWeight: 700, color: "var(--text-primary)" }}>{row.v}</p>
                      <p style={{ fontSize: "12px", color: "var(--text-muted)" }}>{row.s}</p>
                    </div>
                  </div>
                ))}
                <div style={{ display: "flex", justifyContent: "space-between", gap: "16px", paddingTop: "14px" }}>
                  <p style={{ fontSize: "16px", fontWeight: 700, color: "var(--text-primary)" }}>Dividendo total</p>
                  <div style={{ textAlign: "right" }}>
                    <p style={{ fontSize: "16px", fontWeight: 700, color: "var(--accent)" }}>{formatUF(result.amortizacion.firstDividendUF, 2)}</p>
                    <p style={{ fontSize: "12px", color: "var(--text-muted)" }}>{formatCLP(result.amortizacion.firstDividendUF * ufValue)}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Payment-composition chart */}
            <div className="card" style={{ padding: "24px", marginBottom: "24px" }}>
              <h3 style={{ fontSize: "17px", fontWeight: 700, color: "var(--text-primary)", marginBottom: "4px" }}>Composición del pago a lo largo del crédito</h3>
              <p style={{ fontSize: "13px", color: "var(--text-secondary)", marginBottom: "16px" }}>
                Cuánto de cada año se va en intereses versus amortización de capital, y cómo baja el saldo insoluto.
              </p>
              <div style={{ width: "100%", height: "280px" }}>
                <ResponsiveContainer>
                  <ComposedChart data={chartData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                    <XAxis dataKey="year" style={{ fontSize: "11px" }} tick={{ fill: "var(--text-muted)" }} />
                    <YAxis yAxisId="left" style={{ fontSize: "10px" }} tick={{ fill: "var(--text-muted)" }} width={50} />
                    <YAxis yAxisId="right" orientation="right" style={{ fontSize: "10px" }} tick={{ fill: "var(--text-muted)" }} width={50} />
                    <Tooltip
                      formatter={(value, name) => {
                        const labels: Record<string, string> = { amortizacion: "Amortización de capital", intereses: "Intereses", saldo: "Saldo insoluto" };
                        return [`${Number(value).toFixed(1)} UF`, labels[String(name)] || String(name)];
                      }}
                      labelFormatter={(label) => `Año ${label}`}
                      contentStyle={{ fontSize: "12px", borderRadius: "8px", border: "1px solid var(--border)" }}
                    />
                    <Bar yAxisId="left" dataKey="amortizacion" stackId="pago" fill="var(--accent)" />
                    <Bar yAxisId="left" dataKey="intereses" stackId="pago" fill="#C4CAD1" />
                    <Line yAxisId="right" type="monotone" dataKey="saldo" stroke="var(--text-primary)" strokeWidth={2} dot={false} />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>
              <div style={{ display: "flex", gap: "16px", marginTop: "16px", flexWrap: "wrap" }}>
                {[
                  { color: "var(--accent)", label: "Amortización de capital" },
                  { color: "#C4CAD1", label: "Intereses" },
                  { color: "var(--text-primary)", label: "Saldo insoluto (línea)" },
                ].map((l) => (
                  <div key={l.label} style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                    <div style={{ width: "12px", height: "3px", borderRadius: "2px", background: l.color }} />
                    <span style={{ fontSize: "11px", color: "var(--text-secondary)" }}>{l.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Ungated property-matching — no email/auth required (LUI-9) */}
            {result.precioEvaluadoUF > 0 && (
              <div style={{ marginBottom: "24px" }}>
                <OpportunitiesView
                  priceUF={result.precioEvaluadoUF}
                  city={city}
                  comuna={comuna}
                  operacion="venta"
                  tipoPropiedad={tipoPropiedad}
                />
              </div>
            )}

            {/* ── Below tab: existing lead-gen/monetization mechanisms (AC-6, unchanged) ── */}
            {comparison && canAnalyze && (
              <div style={{
                background: "linear-gradient(135deg, #0f766e 0%, #1e3a5f 100%)",
                borderRadius: "12px", padding: "24px", color: "white", marginBottom: "16px",
              }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "16px" }}>
                  <div>
                    <p style={{ fontSize: "10px", opacity: 0.7, marginBottom: "2px", textTransform: "uppercase", letterSpacing: "0.04em" }}>Tu dividendo</p>
                    <p style={{ fontSize: "16px", fontWeight: 800 }}>{formatCLP(monthlyPayment)}</p>
                  </div>
                  <div>
                    <p style={{ fontSize: "10px", opacity: 0.7, marginBottom: "2px", textTransform: "uppercase", letterSpacing: "0.04em" }}>Propiedad en {loanTerm} años</p>
                    <p style={{ fontSize: "16px", fontWeight: 800 }}>{formatCLP(comparison.propertyValueAfter20Years)}</p>
                  </div>
                </div>
                <div style={{ borderTop: "1px solid rgba(255,255,255,0.2)", paddingTop: "16px" }}>
                  {isSignedIn ? (
                    <>
                      <p style={{ fontSize: "17px", fontWeight: 800, marginBottom: "4px", letterSpacing: "-0.02em" }}>
                        {saveStatus === "saved" ? "✅ Guardado en tu portfolio" : "Guarda este análisis en tu portfolio"}
                      </p>
                      <p style={{ fontSize: "13px", opacity: 0.85, lineHeight: 1.5, marginBottom: "16px" }}>
                        {saveStatus === "saved" ? "Puedes comparar esta propiedad con otras en tu dashboard." : "Compara con otras propiedades, accede cuando quieras."}
                      </p>
                      {saveStatus === "saved" ? (
                        <Link href="/dashboard" style={{ display: "block", width: "100%", padding: "14px 24px", textAlign: "center", background: "white", color: "#0f766e", border: "none", borderRadius: "10px", fontSize: "15px", fontWeight: 800, textDecoration: "none" }}>
                          Ver mi portfolio →
                        </Link>
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
                                  downPaymentPct, loanTermYears: loanTerm,
                                  monthlyPayment, monthlyCosts: MONTHLY_COSTS_CLP,
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
                          style={{ width: "100%", padding: "14px 24px", background: "white", color: "#0f766e", border: "none", borderRadius: "10px", fontSize: "15px", fontWeight: 800, cursor: saveStatus === "saving" ? "wait" : "pointer" }}>
                          {saveStatus === "saving" ? "Guardando..." : saveStatus === "error" ? "Error — reintentar" : "Guardar en portfolio →"}
                        </button>
                      )}
                    </>
                  ) : (
                    <>
                      <p style={{ fontSize: "17px", fontWeight: 800, marginBottom: "4px", letterSpacing: "-0.02em" }}>
                        Recibe estos números en un informe profesional
                      </p>
                      <p style={{ fontSize: "13px", opacity: 0.85, lineHeight: 1.5, marginBottom: "16px" }}>
                        PDF listo para tu banco + Excel interactivo con amortización y análisis de sensibilidad. <strong>100% gratis.</strong>
                      </p>
                      <button
                        onClick={() => { setShowEmailModal(true); track("lead_cta_clicked", { page: "calcular" }); }}
                        style={{ width: "100%", padding: "14px 24px", background: "white", color: "#0f766e", border: "none", borderRadius: "10px", fontSize: "15px", fontWeight: 800, cursor: "pointer" }}>
                        Recibir informe gratis →
                      </button>
                      <p style={{ fontSize: "11px", opacity: 0.6, marginTop: "8px", textAlign: "center" }}>
                        Sin registro · Sin tarjeta · Llega en 30 segundos
                      </p>
                    </>
                  )}
                </div>
              </div>
            )}

            {comparison && canAnalyze && (
              <ShareAnalysis
                winner={comparison.winner}
                dividendo={formatCLP(monthlyPayment)}
                patrimonio={formatCLP(Math.max(comparison.buyNetWealth, comparison.rentNetWealth, comparison.investNetWealth))}
                propertyValue={formatCLP(comparison.propertyValueAfter20Years)}
                loanTerm={loanTerm}
                city={comunaInfo?.label || getCityLabel(city)}
              />
            )}
          </main>
        </div>
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
