"use client";

import { useState, useEffect } from "react";
import { track } from "@vercel/analytics";
import ToolLayout from "@/components/ToolLayout";
import { calcPrepago, formatCLP } from "@/lib/toolCalculations";
import type { PrepagoResult } from "@/lib/toolCalculations";

function fmtInput(v: string): string {
  const n = v.replace(/\D/g, "");
  return n ? Number(n).toLocaleString("es-CL") : "";
}
function parseInput(v: string): number {
  return Number(v.replace(/\D/g, "")) || 0;
}

export default function PrepagoPage() {
  const [balance, setBalance] = useState("");
  const [remainingYears, setRemainingYears] = useState("15");
  const [rate, setRate] = useState("3.70");
  const [prepayAmount, setPrepayAmount] = useState("");
  const [result, setResult] = useState<PrepagoResult | null>(null);

  useEffect(() => {
    track("tool_started", { tool: "prepago" });
  }, []);

  const handleCalc = (e: React.FormEvent) => {
    e.preventDefault();
    const bal = parseInput(balance);
    const prepay = parseInput(prepayAmount);
    if (bal <= 0 || prepay <= 0) return;

    const r = calcPrepago({
      outstandingBalance: bal,
      remainingMonths: (parseFloat(remainingYears) || 15) * 12,
      annualRate: parseFloat(rate) || 3.7,
      prepaymentAmount: prepay,
    });
    setResult(r);
    track("tool_completed", { tool: "prepago", savedM: Math.round(r.interestSaved / 1_000_000) });
  };

  return (
    <ToolLayout
      slug="prepago"
      title="¿Me conviene prepagar mi crédito?"
      subtitle="Simula cuánto ahorras en intereses si haces un abono extra a tu hipoteca. Mantienes la misma cuota pero reduces el plazo."
      showInsurance={!!result}
      emailCapture={result ? { ctaText: "Enviar plan", valueProp: "Recibe el detalle del prepago con la comparación completa en tu correo." } : undefined}
      result={result ? (
        <div>
          {/* Main result */}
          <div style={{
            background: "linear-gradient(135deg, #fff7ed 0%, #ffedd5 50%, #fef3c7 100%)",
            border: "2px solid #ea580c",
            borderRadius: "16px",
            padding: "32px 28px",
            textAlign: "center",
            marginBottom: "20px",
          }}>
            <p style={{ fontSize: "13px", fontWeight: 600, color: "#9a3412", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "8px" }}>
              Ahorrarías en intereses
            </p>
            <p style={{ fontSize: "clamp(36px, 6vw, 48px)", fontWeight: 800, color: result.interestSaved > 0 ? "#16a34a" : "var(--text-primary)", letterSpacing: "-0.04em", lineHeight: 1.1 }}>
              {formatCLP(Math.max(0, result.interestSaved))}
            </p>
            {result.monthsSaved > 0 && (
              <p style={{ fontSize: "16px", color: "var(--text-secondary)", marginTop: "8px" }}>
                y terminas <strong>{result.monthsSaved} meses antes</strong> ({Math.round(result.monthsSaved / 12 * 10) / 10} años)
              </p>
            )}
          </div>

          {/* Comparison */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "16px" }}>
            <div className="card" style={{ padding: "20px", textAlign: "center" }}>
              <p style={{ fontSize: "11px", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.04em", marginBottom: "6px" }}>Sin prepago</p>
              <p style={{ fontSize: "18px", fontWeight: 700, color: "var(--text-primary)", marginBottom: "4px" }}>{formatCLP(result.totalWithoutPrepay)}</p>
              <p style={{ fontSize: "12px", color: "var(--text-secondary)" }}>{parseFloat(remainingYears) * 12} cuotas restantes</p>
            </div>
            <div className="card" style={{ padding: "20px", textAlign: "center", borderColor: "#16a34a" }}>
              <p style={{ fontSize: "11px", color: "#16a34a", textTransform: "uppercase", letterSpacing: "0.04em", marginBottom: "6px", fontWeight: 700 }}>Con prepago</p>
              <p style={{ fontSize: "18px", fontWeight: 700, color: "#16a34a", marginBottom: "4px" }}>{formatCLP(result.totalWithPrepay)}</p>
              <p style={{ fontSize: "12px", color: "var(--text-secondary)" }}>{result.newRemainingMonths} cuotas restantes</p>
            </div>
          </div>

          {/* Details */}
          <div className="card" style={{ padding: "20px 24px" }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", fontSize: "14px" }}>
              <div>
                <p style={{ color: "var(--text-muted)", fontSize: "12px", marginBottom: "2px" }}>Cuota actual</p>
                <p style={{ fontWeight: 700, color: "var(--text-primary)" }}>{formatCLP(result.currentMonthlyPayment)}/mes</p>
              </div>
              <div>
                <p style={{ color: "var(--text-muted)", fontSize: "12px", marginBottom: "2px" }}>Saldo después del abono</p>
                <p style={{ fontWeight: 700, color: "var(--text-primary)" }}>{formatCLP(result.newBalance)}</p>
              </div>
            </div>
          </div>
        </div>
      ) : undefined}
      explanation={result ? (
        <div style={{ fontSize: "14px", color: "var(--text-secondary)", lineHeight: 1.7 }}>
          <p style={{ marginBottom: "8px" }}>
            Al hacer un abono extra de <strong>{formatCLP(parseInput(prepayAmount))}</strong>, tu saldo baja de {formatCLP(parseInput(balance))} a {formatCLP(result.newBalance)}.
            Manteniendo la misma cuota de {formatCLP(result.currentMonthlyPayment)}/mes, el crédito se paga <strong>{result.monthsSaved} meses antes</strong>.
          </p>
          <p style={{ marginBottom: "8px" }}>
            En Chile, la <strong>Ley 20.555</strong> (SERNAC Financiero) te permite prepagar tu crédito hipotecario en cualquier momento.
            El costo de prepago no puede superar 1.5 meses de intereses sobre el capital prepagado.
          </p>
          <p>
            <strong>Consejo:</strong> Prepagar conviene más al inicio del crédito, cuando la mayor parte de tu cuota va a intereses.
          </p>
        </div>
      ) : undefined}
    >
      <form onSubmit={handleCalc} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
        <div>
          <label className="form-label">Saldo actual del crédito (CLP)</label>
          <input type="text" inputMode="numeric" className="form-input" placeholder="Ej: 80.000.000" value={balance} onChange={e => setBalance(fmtInput(e.target.value))} required />
          <p style={{ fontSize: "12px", color: "var(--text-muted)", marginTop: "4px" }}>Lo que te queda por pagar. Encuéntralo en tu cartola bancaria.</p>
        </div>

        <div>
          <label className="form-label">Años restantes</label>
          <div style={{ display: "flex", gap: "8px" }}>
            {[5, 10, 15, 20].map(y => (
              <button key={y} type="button" onClick={() => setRemainingYears(String(y))} style={{
                flex: 1, padding: "10px", border: `1px solid ${remainingYears === String(y) ? "#ea580c" : "var(--border)"}`,
                borderRadius: "8px", background: remainingYears === String(y) ? "#fff7ed" : "white",
                color: remainingYears === String(y) ? "#ea580c" : "var(--text-secondary)",
                fontWeight: remainingYears === String(y) ? 700 : 500, fontSize: "14px", cursor: "pointer",
              }}>
                {y}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="form-label">Tasa de interés anual (%)</label>
          <input type="text" inputMode="decimal" className="form-input" placeholder="Ej: 3.70" value={rate} onChange={e => setRate(e.target.value)} />
        </div>

        <div>
          <label className="form-label">Monto a prepagar (CLP)</label>
          <input type="text" inputMode="numeric" className="form-input" placeholder="Ej: 10.000.000" value={prepayAmount} onChange={e => setPrepayAmount(fmtInput(e.target.value))} required />
          <p style={{ fontSize: "12px", color: "var(--text-muted)", marginTop: "4px" }}>El abono extra que quieres hacer.</p>
        </div>

        <button type="submit" className="btn-primary" style={{ width: "100%", padding: "14px", fontSize: "16px", marginTop: "4px" }}>
          Simular prepago →
        </button>
      </form>
    </ToolLayout>
  );
}
