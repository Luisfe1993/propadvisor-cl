"use client";

import { useState, useEffect } from "react";
import { track } from "@vercel/analytics";
import ToolLayout from "@/components/ToolLayout";
import { calcAffordability, formatCLP, formatUF, toolBanks } from "@/lib/toolCalculations";
import type { AffordabilityResult } from "@/lib/toolCalculations";

const UF_FALLBACK = 37000;

function fmtInput(v: string): string {
  const n = v.replace(/\D/g, "");
  return n ? Number(n).toLocaleString("es-CL") : "";
}
function parseInput(v: string): number {
  return Number(v.replace(/\D/g, "")) || 0;
}

export default function MeAlcanzaPage() {
  const [income, setIncome] = useState("");
  const [debts, setDebts] = useState("");
  const [pie, setPie] = useState("");
  const [ufValue, setUfValue] = useState(UF_FALLBACK);
  const [result, setResult] = useState<AffordabilityResult | null>(null);

  useEffect(() => {
    fetch("/api/uf").then(r => r.json()).then(d => { if (d.value) setUfValue(d.value); }).catch(() => {});
    track("tool_started", { tool: "me-alcanza" });
  }, []);

  const handleCalc = (e: React.FormEvent) => {
    e.preventDefault();
    const incomeVal = parseInput(income);
    if (incomeVal <= 0) return;
    const r = calcAffordability(
      { monthlyIncome: incomeVal, monthlyDebts: parseInput(debts), downPaymentAvailable: parseInput(pie), annualRate: 3.7, loanTermYears: 20 },
      ufValue,
      toolBanks,
    );
    setResult(r);
    track("tool_completed", { tool: "me-alcanza", maxUF: r.maxPropertyUF });
  };

  return (
    <ToolLayout
      slug="me-alcanza"
      title="¿Me alcanza para comprar?"
      subtitle="Ingresa tu sueldo y deudas. Te mostramos el precio máximo de propiedad que podrías financiar — comparando 8 bancos chilenos."
      showInsurance={!!result}
      emailCapture={result ? { ctaText: "Enviar resultado", valueProp: "Recibe tu resultado con desglose por banco en tu correo." } : undefined}
      toolData={result ? { maxPropertyUF: result.maxPropertyUF, maxDividendo: result.maxDividendo, income: parseInput(income) } : undefined}
      opportunities={result ? { priceUF: result.maxPropertyUF, city: "santiago" } : undefined}
      result={result ? (
        <div>
          {/* Main result card */}
          <div style={{
            background: "linear-gradient(135deg, #f0fdfa 0%, #ccfbf1 50%, #f0fdf4 100%)",
            border: "2px solid var(--accent)",
            borderRadius: "16px",
            padding: "32px 28px",
            textAlign: "center",
            marginBottom: "20px",
          }}>
            <p style={{ fontSize: "13px", fontWeight: 600, color: "var(--accent-dark)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "8px" }}>
              Puedes comprar una propiedad de hasta
            </p>
            <p style={{ fontSize: "clamp(36px, 6vw, 48px)", fontWeight: 800, color: "var(--text-primary)", letterSpacing: "-0.04em", lineHeight: 1.1 }}>
              {formatUF(result.maxPropertyUF)}
            </p>
            <p style={{ fontSize: "16px", color: "var(--text-secondary)", marginTop: "4px" }}>
              ~{formatCLP(result.maxPropertyCLP)}
            </p>
            <div style={{ marginTop: "16px", display: "flex", justifyContent: "center", gap: "24px", flexWrap: "wrap" }}>
              <div>
                <p style={{ fontSize: "12px", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.04em" }}>Dividendo máximo</p>
                <p style={{ fontSize: "18px", fontWeight: 700, color: "var(--text-primary)" }}>{formatCLP(result.maxDividendo)}<span style={{ fontSize: "13px", fontWeight: 400, color: "var(--text-secondary)" }}>/mes</span></p>
              </div>
              <div>
                <p style={{ fontSize: "12px", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.04em" }}>% del ingreso</p>
                <p style={{ fontSize: "18px", fontWeight: 700, color: "var(--text-primary)" }}>25%</p>
              </div>
            </div>
          </div>

          {/* Bank comparison */}
          <div style={{ background: "white", border: "1px solid var(--border)", borderRadius: "12px", overflow: "hidden" }}>
            <div style={{ padding: "16px 20px", borderBottom: "1px solid var(--border)", background: "var(--bg-secondary)" }}>
              <p style={{ fontSize: "13px", fontWeight: 700, color: "var(--text-primary)", textTransform: "uppercase", letterSpacing: "0.04em" }}>
                Comparación por banco
              </p>
            </div>
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "14px" }}>
                <thead>
                  <tr style={{ borderBottom: "1px solid var(--border)" }}>
                    <th style={{ textAlign: "left", padding: "10px 16px", fontWeight: 600, color: "var(--text-secondary)", fontSize: "12px", textTransform: "uppercase", letterSpacing: "0.04em" }}>Banco</th>
                    <th style={{ textAlign: "right", padding: "10px 16px", fontWeight: 600, color: "var(--text-secondary)", fontSize: "12px", textTransform: "uppercase", letterSpacing: "0.04em" }}>Tasa</th>
                    <th style={{ textAlign: "right", padding: "10px 16px", fontWeight: 600, color: "var(--text-secondary)", fontSize: "12px", textTransform: "uppercase", letterSpacing: "0.04em" }}>Máx. UF</th>
                  </tr>
                </thead>
                <tbody>
                  {result.bankResults.slice(0, 5).map((b, i) => (
                    <tr key={b.bank} style={{ borderBottom: i < 4 ? "1px solid var(--border)" : "none" }}>
                      <td style={{ padding: "10px 16px", fontWeight: 600, color: "var(--text-primary)" }}>{b.bank}</td>
                      <td style={{ padding: "10px 16px", textAlign: "right", color: "var(--text-secondary)" }}>{b.rate}%</td>
                      <td style={{ padding: "10px 16px", textAlign: "right", fontWeight: 700, color: "var(--accent-dark)" }}>{formatUF(b.maxPropertyUF)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : undefined}
      explanation={result ? (
        <div style={{ fontSize: "14px", color: "var(--text-secondary)", lineHeight: 1.7 }}>
          <p style={{ marginBottom: "8px" }}>
            Los bancos chilenos exigen que tu <strong>dividendo no supere el 25-30%</strong> de tu ingreso líquido mensual.
            Con un ingreso de {formatCLP(parseInput(income))} y deudas de {formatCLP(parseInput(debts))}, tu capacidad de pago disponible para dividendo es de {formatCLP(result.maxDividendo)}/mes.
          </p>
          <p>
            Con un pie de {formatCLP(parseInput(pie))} y una tasa promedio de ~3.7% a 20 años, el banco te prestaría hasta {formatCLP(result.maxLoan)}, lo que sumado al pie da un precio máximo de {formatUF(result.maxPropertyUF)}.
          </p>
        </div>
      ) : undefined}
    >
      {/* Input form */}
      <form onSubmit={handleCalc} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
        <div>
          <label className="form-label">Ingreso líquido mensual (CLP)</label>
          <input
            type="text"
            inputMode="numeric"
            className="form-input"
            placeholder="Ej: 2.500.000"
            value={income}
            onChange={e => setIncome(fmtInput(e.target.value))}
            required
          />
        </div>
        <div>
          <label className="form-label">Deudas mensuales actuales (CLP)</label>
          <input
            type="text"
            inputMode="numeric"
            className="form-input"
            placeholder="Ej: 150.000 (créditos, tarjetas, auto)"
            value={debts}
            onChange={e => setDebts(fmtInput(e.target.value))}
          />
          <p style={{ fontSize: "12px", color: "var(--text-muted)", marginTop: "4px" }}>Cuotas de créditos, tarjetas, auto. Deja en 0 si no tienes.</p>
        </div>
        <div>
          <label className="form-label">Pie disponible (CLP)</label>
          <input
            type="text"
            inputMode="numeric"
            className="form-input"
            placeholder="Ej: 25.000.000"
            value={pie}
            onChange={e => setPie(fmtInput(e.target.value))}
          />
          <p style={{ fontSize: "12px", color: "var(--text-muted)", marginTop: "4px" }}>Ahorros disponibles para la cuota inicial.</p>
        </div>

        <button type="submit" className="btn-primary" style={{ width: "100%", padding: "14px", fontSize: "16px", marginTop: "4px" }}>
          Calcular →
        </button>
      </form>
    </ToolLayout>
  );
}
