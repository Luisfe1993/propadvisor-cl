"use client";

import { useState, useEffect } from "react";
import { track } from "@vercel/analytics";
import ToolLayout from "@/components/ToolLayout";
import { calcBuyVsRent, formatCLP, formatUF } from "@/lib/toolCalculations";
import { getCityOptions, getComunaOptions, getComunaInfo } from "@/lib/comunaData";
import type { BuyVsRentResult } from "@/lib/toolCalculations";

const UF_FALLBACK = 37000;

function fmtInput(v: string): string {
  const n = v.replace(/\D/g, "");
  return n ? Number(n).toLocaleString("es-CL") : "";
}
function parseInput(v: string): number {
  return Number(v.replace(/\D/g, "")) || 0;
}

export default function ComprarOArendarPage() {
  const [priceRaw, setPriceRaw] = useState("");
  const [currency, setCurrency] = useState<"CLP" | "UF">("UF");
  const [rentRaw, setRentRaw] = useState("");
  const [city, setCity] = useState("santiago");
  const [comuna, setComuna] = useState("providencia");
  const [ufValue, setUfValue] = useState(UF_FALLBACK);
  const [result, setResult] = useState<BuyVsRentResult | null>(null);

  const cityOptions = getCityOptions();
  const comunaOptions = getComunaOptions(city);

  useEffect(() => {
    fetch("/api/uf").then(r => r.json()).then(d => { if (d.value) setUfValue(d.value); }).catch(() => {});
    track("tool_started", { tool: "comprar-o-arrendar" });
  }, []);

  // Update comuna when city changes
  useEffect(() => {
    const opts = getComunaOptions(city);
    if (opts.length > 0) setComuna(opts[0].value);
  }, [city]);

  const handleCalc = (e: React.FormEvent) => {
    e.preventDefault();
    const raw = parseInput(priceRaw);
    const rentVal = parseInput(rentRaw);
    if (raw <= 0 || rentVal <= 0) return;

    const priceCLP = currency === "UF" ? raw * ufValue : raw;
    const comunaInfo = getComunaInfo(city, comuna);
    const appreciation = comunaInfo?.appreciation || 0.06;

    const r = calcBuyVsRent({
      propertyPriceCLP: priceCLP,
      monthlyRentCLP: rentVal,
      annualRate: 3.7,
      downPaymentPct: 20,
      loanTermYears: 20,
      annualAppreciation: appreciation,
      annualRentInflation: 0.03,
    });
    setResult(r);

    track("tool_completed", {
      tool: "comprar-o-arrendar",
      winner: r.winner,
      savingsM: Math.round(r.savings / 1_000_000),
    });
  };

  const priceUF = currency === "UF" ? parseInput(priceRaw) : Math.round(parseInput(priceRaw) / ufValue);
  const comunaInfo = getComunaInfo(city, comuna);

  return (
    <ToolLayout
      slug="comprar-o-arrendar"
      title="¿Conviene comprar o arrendar?"
      subtitle="Compara el costo total de comprar vs. arrendar a 20 años, con plusvalía por comuna e inflación de arriendos."
      showInsurance={result?.winner === "comprar"}
      emailCapture={result ? { ctaText: "Enviar resultado", valueProp: "Recibe el resultado completo con gráfico de proyección en tu correo." } : undefined}
      result={result ? (
        <div>
          {/* Winner card */}
          <div style={{
            background: result.winner === "comprar"
              ? "linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)"
              : "linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)",
            border: `2px solid ${result.winner === "comprar" ? "#16a34a" : "#3b82f6"}`,
            borderRadius: "16px",
            padding: "32px 28px",
            textAlign: "center",
            marginBottom: "20px",
          }}>
            <p style={{ fontSize: "40px", marginBottom: "8px" }}>
              {result.winner === "comprar" ? "🏠" : "🔑"}
            </p>
            <p style={{
              fontSize: "clamp(24px, 5vw, 32px)",
              fontWeight: 800,
              color: "var(--text-primary)",
              letterSpacing: "-0.03em",
              marginBottom: "8px",
            }}>
              {result.winner === "comprar" ? "Comprar gana" : "Arrendar gana"}
            </p>
            <p style={{ fontSize: "16px", color: "var(--text-secondary)", marginBottom: "16px" }}>
              Ahorras <strong>{formatCLP(result.savings)}</strong> en 20 años vs. {result.winner === "comprar" ? "arrendar" : "comprar"}
            </p>

            {/* Comparison bars */}
            <div style={{ maxWidth: "360px", margin: "0 auto", textAlign: "left" }}>
              {/* Buy bar */}
              <div style={{ marginBottom: "12px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px", marginBottom: "4px" }}>
                  <span style={{ fontWeight: 600, color: "var(--text-primary)" }}>Comprar (neto)</span>
                  <span style={{ fontWeight: 700, color: result.winner === "comprar" ? "#16a34a" : "var(--text-secondary)" }}>
                    {formatCLP(result.buyTotal20 - result.equityAtYear20)}
                  </span>
                </div>
                <div style={{ background: "#e2e8f0", borderRadius: "6px", height: "8px", overflow: "hidden" }}>
                  <div style={{
                    width: `${Math.min(100, ((result.buyTotal20 - result.equityAtYear20) / Math.max(result.buyTotal20 - result.equityAtYear20, result.rentTotal20)) * 100)}%`,
                    height: "100%",
                    background: result.winner === "comprar" ? "#16a34a" : "#94a3b8",
                    borderRadius: "6px",
                    transition: "width 0.5s ease",
                  }} />
                </div>
                <p style={{ fontSize: "11px", color: "var(--text-muted)", marginTop: "2px" }}>
                  Costo total {formatCLP(result.buyTotal20)} − patrimonio {formatCLP(result.equityAtYear20)}
                </p>
              </div>

              {/* Rent bar */}
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px", marginBottom: "4px" }}>
                  <span style={{ fontWeight: 600, color: "var(--text-primary)" }}>Arrendar (total)</span>
                  <span style={{ fontWeight: 700, color: result.winner === "arrendar" ? "#3b82f6" : "var(--text-secondary)" }}>
                    {formatCLP(result.rentTotal20)}
                  </span>
                </div>
                <div style={{ background: "#e2e8f0", borderRadius: "6px", height: "8px", overflow: "hidden" }}>
                  <div style={{
                    width: `${Math.min(100, (result.rentTotal20 / Math.max(result.buyTotal20 - result.equityAtYear20, result.rentTotal20)) * 100)}%`,
                    height: "100%",
                    background: result.winner === "arrendar" ? "#3b82f6" : "#94a3b8",
                    borderRadius: "6px",
                    transition: "width 0.5s ease",
                  }} />
                </div>
                <p style={{ fontSize: "11px", color: "var(--text-muted)", marginTop: "2px" }}>
                  Arriendos acumulados con 3% inflación anual
                </p>
              </div>
            </div>
          </div>

          {/* Key numbers */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "12px" }}>
            <div className="card" style={{ padding: "16px 20px", textAlign: "center" }}>
              <p style={{ fontSize: "11px", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.04em", marginBottom: "4px" }}>Dividendo mensual</p>
              <p style={{ fontSize: "18px", fontWeight: 700, color: "var(--text-primary)" }}>{formatCLP(result.dividendo)}</p>
            </div>
            <div className="card" style={{ padding: "16px 20px", textAlign: "center" }}>
              <p style={{ fontSize: "11px", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.04em", marginBottom: "4px" }}>Valor propiedad año 20</p>
              <p style={{ fontSize: "18px", fontWeight: 700, color: "#16a34a" }}>{formatCLP(result.propertyValueYear20)}</p>
            </div>
          </div>
        </div>
      ) : undefined}
      explanation={result ? (
        <div style={{ fontSize: "14px", color: "var(--text-secondary)", lineHeight: 1.7 }}>
          <p style={{ marginBottom: "8px" }}>
            Esta comparación considera: <strong>pie de 20%</strong>, tasa de 3.7% a 20 años, plusvalía de {comunaInfo ? `${(comunaInfo.appreciation * 100).toFixed(0)}%` : "6%"} anual para {comunaInfo?.label || "la comuna"}, e inflación de arriendos del 3% anual.
          </p>
          <p style={{ marginBottom: "8px" }}>
            {result.winner === "comprar"
              ? `Al comprar, pagas ${formatCLP(result.buyTotal20)} en total, pero al año 20 tu propiedad vale ${formatCLP(result.propertyValueYear20)}. El costo neto (pagado − patrimonio) es ${formatCLP(result.buyTotal20 - result.equityAtYear20)}.`
              : `Al arrendar, pagas ${formatCLP(result.rentTotal20)} en 20 años, pero no acumulas patrimonio. En este caso, el costo neto de comprar (${formatCLP(result.buyTotal20 - result.equityAtYear20)}) supera lo que pagarías arrendando.`
            }
          </p>
          <p>
            Para un análisis más detallado con 3 escenarios, 8 bancos y proyección año por año, usa el <strong>analizador completo</strong>.
          </p>
        </div>
      ) : undefined}
    >
      {/* Input form */}
      <form onSubmit={handleCalc} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
        {/* Location */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
          <div>
            <label className="form-label">Ciudad</label>
            <select className="form-select" value={city} onChange={e => setCity(e.target.value)}>
              {cityOptions.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
            </select>
          </div>
          <div>
            <label className="form-label">Comuna</label>
            <select className="form-select" value={comuna} onChange={e => setComuna(e.target.value)}>
              {comunaOptions.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
            </select>
          </div>
        </div>

        {/* Price */}
        <div>
          <label className="form-label">Precio de venta</label>
          <div style={{ display: "flex", gap: "8px" }}>
            <input
              type="text"
              inputMode="numeric"
              className="form-input"
              placeholder={currency === "UF" ? "Ej: 3.500" : "Ej: 130.000.000"}
              value={priceRaw}
              onChange={e => setPriceRaw(fmtInput(e.target.value))}
              style={{ flex: 1 }}
              required
            />
            <select className="form-select" value={currency} onChange={e => { setCurrency(e.target.value as "CLP" | "UF"); setPriceRaw(""); }} style={{ width: "80px" }}>
              <option value="UF">UF</option>
              <option value="CLP">CLP</option>
            </select>
          </div>
        </div>

        {/* Rent */}
        <div>
          <label className="form-label">Arriendo mensual (CLP)</label>
          <input
            type="text"
            inputMode="numeric"
            className="form-input"
            placeholder="Ej: 450.000"
            value={rentRaw}
            onChange={e => setRentRaw(fmtInput(e.target.value))}
            required
          />
          <p style={{ fontSize: "12px", color: "var(--text-muted)", marginTop: "4px" }}>
            {comunaInfo ? `Arriendo estimado en ${comunaInfo.label}: cap rate ${(comunaInfo.capRate * 100).toFixed(1)}%` : "Arriendo mensual de una propiedad similar en la zona."}
          </p>
        </div>

        <button type="submit" className="btn-primary" style={{ width: "100%", padding: "14px", fontSize: "16px", marginTop: "4px" }}>
          Comparar →
        </button>
      </form>
    </ToolLayout>
  );
}
