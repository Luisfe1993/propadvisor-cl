"use client";

import { useState, useEffect } from "react";
import { track } from "@vercel/analytics";
import ToolLayout from "@/components/ToolLayout";
import { calcDividendo, formatCLP, formatUF, toolBanks } from "@/lib/toolCalculations";
import { calcMonthlyPayment } from "@/lib/calculations";
import type { DividendoResult } from "@/lib/toolCalculations";

const UF_FALLBACK = 37000;

function fmtInput(v: string): string {
  const n = v.replace(/\D/g, "");
  return n ? Number(n).toLocaleString("es-CL") : "";
}
function parseInput(v: string): number {
  return Number(v.replace(/\D/g, "")) || 0;
}

export default function DividendoPage() {
  const [priceRaw, setPriceRaw] = useState("");
  const [currency, setCurrency] = useState<"CLP" | "UF">("UF");
  const [downPct, setDownPct] = useState(20);
  const [term, setTerm] = useState(20);
  const [rate, setRate] = useState("3.70");
  const [ufValue, setUfValue] = useState(UF_FALLBACK);
  const [result, setResult] = useState<DividendoResult | null>(null);
  const [bankDividendos, setBankDividendos] = useState<{ bank: string; rate: number; dividendo: number }[]>([]);

  useEffect(() => {
    fetch("/api/uf").then(r => r.json()).then(d => { if (d.value) setUfValue(d.value); }).catch(() => {});
    track("tool_started", { tool: "dividendo" });
  }, []);

  const handleCalc = (e: React.FormEvent) => {
    e.preventDefault();
    const raw = parseInput(priceRaw);
    if (raw <= 0) return;
    const priceCLP = currency === "UF" ? raw * ufValue : raw;
    const rateVal = parseFloat(rate) || 3.7;

    const r = calcDividendo({ propertyPriceCLP: priceCLP, downPaymentPct: downPct, loanTermYears: term, annualRate: rateVal });
    setResult(r);

    // Calculate for all banks
    const loanAmount = priceCLP - (priceCLP * downPct / 100);
    const bd = toolBanks.map(b => ({
      bank: b.shortName,
      rate: b.rate,
      dividendo: Math.round(calcMonthlyPayment(loanAmount, b.rate, term)),
    })).sort((a, b) => a.dividendo - b.dividendo);
    setBankDividendos(bd);

    track("tool_completed", { tool: "dividendo", dividendo: r.dividendo, priceUF: currency === "UF" ? raw : Math.round(priceCLP / ufValue) });
  };

  const priceUF = result ? (currency === "UF" ? parseInput(priceRaw) : Math.round(parseInput(priceRaw) / ufValue)) : 0;

  return (
    <ToolLayout
      slug="dividendo"
      title="¿Cuánto sería mi dividendo?"
      subtitle="Ingresa el precio de la propiedad y las condiciones del crédito. Obtén tu dividendo mensual al instante."
      showInsurance={!!result}
      emailCapture={result ? { ctaText: "Guardar cálculo", valueProp: "Guarda este cálculo y compáralo después con otras propiedades." } : undefined}
      toolData={result ? { dividendo: result.dividendo, priceUF, loanAmount: result.loanAmount } : undefined}
      opportunities={result && priceUF > 0 ? { priceUF, city: "santiago" } : undefined}
      result={result ? (
        <div>
          {/* Main result */}
          <div style={{
            background: "linear-gradient(135deg, #eff6ff 0%, #dbeafe 50%, #e0f2fe 100%)",
            border: "2px solid #3b82f6",
            borderRadius: "16px",
            padding: "32px 28px",
            textAlign: "center",
            marginBottom: "20px",
          }}>
            <p style={{ fontSize: "13px", fontWeight: 600, color: "#1e40af", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "8px" }}>
              Tu dividendo mensual sería
            </p>
            <p style={{ fontSize: "clamp(36px, 6vw, 48px)", fontWeight: 800, color: "var(--text-primary)", letterSpacing: "-0.04em", lineHeight: 1.1 }}>
              {formatCLP(result.dividendo)}
            </p>
            <p style={{ fontSize: "14px", color: "var(--text-secondary)", marginTop: "8px" }}>
              por {term} años · tasa {rate}% · pie {downPct}%
            </p>

            <div style={{ marginTop: "20px", display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "12px" }}>
              <div style={{ background: "rgba(255,255,255,0.6)", borderRadius: "10px", padding: "12px 8px" }}>
                <p style={{ fontSize: "11px", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.04em" }}>Pie</p>
                <p style={{ fontSize: "15px", fontWeight: 700, color: "var(--text-primary)" }}>{formatCLP(result.downPaymentCLP)}</p>
              </div>
              <div style={{ background: "rgba(255,255,255,0.6)", borderRadius: "10px", padding: "12px 8px" }}>
                <p style={{ fontSize: "11px", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.04em" }}>Crédito</p>
                <p style={{ fontSize: "15px", fontWeight: 700, color: "var(--text-primary)" }}>{formatCLP(result.loanAmount)}</p>
              </div>
              <div style={{ background: "rgba(255,255,255,0.6)", borderRadius: "10px", padding: "12px 8px" }}>
                <p style={{ fontSize: "11px", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.04em" }}>Intereses total</p>
                <p style={{ fontSize: "15px", fontWeight: 700, color: "#dc2626" }}>{formatCLP(result.totalInterest)}</p>
              </div>
            </div>
          </div>

          {/* Bank comparison */}
          {bankDividendos.length > 0 && (
            <div style={{ background: "white", border: "1px solid var(--border)", borderRadius: "12px", overflow: "hidden" }}>
              <div style={{ padding: "16px 20px", borderBottom: "1px solid var(--border)", background: "var(--bg-secondary)" }}>
                <p style={{ fontSize: "13px", fontWeight: 700, color: "var(--text-primary)", textTransform: "uppercase", letterSpacing: "0.04em" }}>
                  Dividendo por banco
                </p>
              </div>
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "14px" }}>
                  <thead>
                    <tr style={{ borderBottom: "1px solid var(--border)" }}>
                      <th style={{ textAlign: "left", padding: "10px 16px", fontWeight: 600, color: "var(--text-secondary)", fontSize: "12px", textTransform: "uppercase", letterSpacing: "0.04em" }}>Banco</th>
                      <th style={{ textAlign: "right", padding: "10px 16px", fontWeight: 600, color: "var(--text-secondary)", fontSize: "12px", textTransform: "uppercase", letterSpacing: "0.04em" }}>Tasa</th>
                      <th style={{ textAlign: "right", padding: "10px 16px", fontWeight: 600, color: "var(--text-secondary)", fontSize: "12px", textTransform: "uppercase", letterSpacing: "0.04em" }}>Dividendo/mes</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bankDividendos.map((b, i) => (
                      <tr key={b.bank} style={{ borderBottom: i < bankDividendos.length - 1 ? "1px solid var(--border)" : "none", background: i === 0 ? "#f0fdf4" : "transparent" }}>
                        <td style={{ padding: "10px 16px", fontWeight: 600, color: "var(--text-primary)" }}>
                          {b.bank}
                          {i === 0 && <span style={{ fontSize: "10px", fontWeight: 700, color: "#16a34a", marginLeft: "6px", textTransform: "uppercase" }}>Menor</span>}
                        </td>
                        <td style={{ padding: "10px 16px", textAlign: "right", color: "var(--text-secondary)" }}>{b.rate}%</td>
                        <td style={{ padding: "10px 16px", textAlign: "right", fontWeight: 700, color: i === 0 ? "#16a34a" : "var(--text-primary)" }}>{formatCLP(b.dividendo)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      ) : undefined}
      explanation={result ? (
        <div style={{ fontSize: "14px", color: "var(--text-secondary)", lineHeight: 1.7 }}>
          <p style={{ marginBottom: "8px" }}>
            El dividendo se calcula usando <strong>amortización francesa</strong> (cuota fija) con una tasa de {rate}% anual fija a {term} años.
          </p>
          <p style={{ marginBottom: "8px" }}>
            Del total que pagarás ({formatCLP(result.totalPaid)}), <strong>{formatCLP(result.totalInterest)}</strong> son intereses.
            A mayor pie, menos intereses pagas a largo plazo.
          </p>
          <p>
            La regla general es que el dividendo <strong>no debe superar el 25-30%</strong> de tu ingreso líquido mensual.
          </p>
        </div>
      ) : undefined}
    >
      {/* Input form */}
      <form onSubmit={handleCalc} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
        {/* Price */}
        <div>
          <label className="form-label">Precio de la propiedad</label>
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
            <select
              className="form-select"
              value={currency}
              onChange={e => { setCurrency(e.target.value as "CLP" | "UF"); setPriceRaw(""); }}
              style={{ width: "80px" }}
            >
              <option value="UF">UF</option>
              <option value="CLP">CLP</option>
            </select>
          </div>
          <p style={{ fontSize: "12px", color: "var(--text-muted)", marginTop: "4px" }}>UF hoy: ${ufValue.toLocaleString("es-CL")}</p>
        </div>

        {/* Pie */}
        <div>
          <label className="form-label">Pie (cuota inicial): {downPct}%</label>
          <input
            type="range"
            min={10}
            max={50}
            step={5}
            value={downPct}
            onChange={e => setDownPct(Number(e.target.value))}
            style={{ width: "100%", accentColor: "var(--accent)" }}
          />
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", color: "var(--text-muted)" }}>
            <span>10%</span><span>50%</span>
          </div>
        </div>

        {/* Term */}
        <div>
          <label className="form-label">Plazo (años)</label>
          <div style={{ display: "flex", gap: "8px" }}>
            {[15, 20, 25, 30].map(y => (
              <button
                key={y}
                type="button"
                onClick={() => setTerm(y)}
                style={{
                  flex: 1, padding: "10px", border: `1px solid ${term === y ? "var(--accent)" : "var(--border)"}`,
                  borderRadius: "8px", background: term === y ? "var(--accent-light)" : "white",
                  color: term === y ? "var(--accent-dark)" : "var(--text-secondary)",
                  fontWeight: term === y ? 700 : 500, fontSize: "14px", cursor: "pointer", transition: "all 0.15s",
                }}
              >
                {y}
              </button>
            ))}
          </div>
        </div>

        {/* Rate */}
        <div>
          <label className="form-label">Tasa de interés anual (%)</label>
          <input
            type="text"
            inputMode="decimal"
            className="form-input"
            placeholder="Ej: 3.70"
            value={rate}
            onChange={e => setRate(e.target.value)}
          />
          <p style={{ fontSize: "12px", color: "var(--text-muted)", marginTop: "4px" }}>Tasa fija promedio en Chile: 3.4%-5.5%</p>
        </div>

        <button type="submit" className="btn-primary" style={{ width: "100%", padding: "14px", fontSize: "16px", marginTop: "4px" }}>
          Calcular dividendo →
        </button>
      </form>
    </ToolLayout>
  );
}
