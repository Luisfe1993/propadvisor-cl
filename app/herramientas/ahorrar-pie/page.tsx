"use client";

import { useState, useEffect } from "react";
import { track } from "@vercel/analytics";
import ToolLayout from "@/components/ToolLayout";
import { calcPieAhorro, formatCLP, formatUF } from "@/lib/toolCalculations";
import type { PieAhorroResult } from "@/lib/toolCalculations";

const UF_FALLBACK = 37000;

function fmtInput(v: string): string {
  const n = v.replace(/\D/g, "");
  return n ? Number(n).toLocaleString("es-CL") : "";
}
function parseInput(v: string): number {
  return Number(v.replace(/\D/g, "")) || 0;
}

export default function AhorrarPiePage() {
  const [priceRaw, setPriceRaw] = useState("");
  const [currency, setCurrency] = useState<"CLP" | "UF">("UF");
  const [piePct, setPiePct] = useState(20);
  const [currentSavings, setCurrentSavings] = useState("");
  const [monthlySavings, setMonthlySavings] = useState("");
  const [ufValue, setUfValue] = useState(UF_FALLBACK);
  const [result, setResult] = useState<PieAhorroResult | null>(null);

  useEffect(() => {
    fetch("/api/uf").then(r => r.json()).then(d => { if (d.value) setUfValue(d.value); }).catch(() => {});
    track("tool_started", { tool: "ahorrar-pie" });
  }, []);

  const handleCalc = (e: React.FormEvent) => {
    e.preventDefault();
    const raw = parseInput(priceRaw);
    if (raw <= 0) return;
    const priceCLP = currency === "UF" ? raw * ufValue : raw;
    const monthly = parseInput(monthlySavings);
    if (monthly <= 0) return;

    const r = calcPieAhorro({
      propertyPriceCLP: priceCLP,
      downPaymentPct: piePct,
      currentSavings: parseInput(currentSavings),
      monthlySavings: monthly,
      annualSavingsReturn: 0.04,
    });
    setResult(r);
    track("tool_completed", { tool: "ahorrar-pie", months: r.monthsToGoal });
  };

  return (
    <ToolLayout
      slug="ahorrar-pie"
      title="¿Cuánto necesito ahorrar para el pie?"
      subtitle="Calcula cuántos meses necesitas para juntar la cuota inicial de tu propiedad, incluyendo rendimiento de tu ahorro."
      showInsurance={false}
      emailCapture={result ? { ctaText: "Recibir recordatorio", valueProp: "Te avisamos cada mes cómo va tu progreso hacia la meta." } : undefined}
      toolData={result ? { pieNeeded: result.pieNeeded, monthsToGoal: result.monthsToGoal, remaining: result.remaining } : undefined}
      result={result ? (
        <div>
          {/* Main result */}
          <div style={{
            background: "linear-gradient(135deg, #fdf2f8 0%, #fce7f3 50%, #fdf4ff 100%)",
            border: "2px solid #db2777",
            borderRadius: "16px",
            padding: "32px 28px",
            textAlign: "center",
            marginBottom: "20px",
          }}>
            {result.monthsToGoal === 0 ? (
              <>
                <p style={{ fontSize: "40px", marginBottom: "8px" }}>🎉</p>
                <p style={{ fontSize: "clamp(24px, 5vw, 32px)", fontWeight: 800, color: "var(--text-primary)", letterSpacing: "-0.03em" }}>
                  ¡Ya tienes el pie!
                </p>
                <p style={{ fontSize: "16px", color: "var(--text-secondary)", marginTop: "8px" }}>
                  Tus ahorros actuales cubren el pie de {formatCLP(result.pieNeeded)}.
                </p>
              </>
            ) : result.monthsToGoal >= 600 ? (
              <>
                <p style={{ fontSize: "40px", marginBottom: "8px" }}>⏳</p>
                <p style={{ fontSize: "clamp(24px, 5vw, 32px)", fontWeight: 800, color: "var(--text-primary)", letterSpacing: "-0.03em" }}>
                  Necesitas ahorrar más
                </p>
                <p style={{ fontSize: "16px", color: "var(--text-secondary)", marginTop: "8px" }}>
                  Con tu ahorro actual no alcanzarás la meta en un plazo razonable. Intenta aumentar tu ahorro mensual.
                </p>
              </>
            ) : (
              <>
                <p style={{ fontSize: "13px", fontWeight: 600, color: "#9d174d", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "8px" }}>
                  Tendrás tu pie en
                </p>
                <p style={{ fontSize: "clamp(36px, 6vw, 48px)", fontWeight: 800, color: "var(--text-primary)", letterSpacing: "-0.04em", lineHeight: 1.1 }}>
                  {result.monthsToGoal} meses
                </p>
                <p style={{ fontSize: "16px", color: "var(--text-secondary)", marginTop: "4px" }}>
                  {result.yearsToGoal > 1 ? `(${result.yearsToGoal} años)` : ""}
                </p>

                <div style={{ marginTop: "20px", display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "12px" }}>
                  <div style={{ background: "rgba(255,255,255,0.7)", borderRadius: "10px", padding: "12px 8px" }}>
                    <p style={{ fontSize: "11px", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.04em" }}>Pie necesario</p>
                    <p style={{ fontSize: "15px", fontWeight: 700, color: "var(--text-primary)" }}>{formatCLP(result.pieNeeded)}</p>
                  </div>
                  <div style={{ background: "rgba(255,255,255,0.7)", borderRadius: "10px", padding: "12px 8px" }}>
                    <p style={{ fontSize: "11px", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.04em" }}>Te falta</p>
                    <p style={{ fontSize: "15px", fontWeight: 700, color: "#dc2626" }}>{formatCLP(result.remaining)}</p>
                  </div>
                  <div style={{ background: "rgba(255,255,255,0.7)", borderRadius: "10px", padding: "12px 8px" }}>
                    <p style={{ fontSize: "11px", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.04em" }}>Intereses ganados</p>
                    <p style={{ fontSize: "15px", fontWeight: 700, color: "#16a34a" }}>+{formatCLP(result.interestEarned)}</p>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Timeline visual */}
          {result.monthsToGoal > 0 && result.monthsToGoal < 600 && (
            <div className="card" style={{ padding: "20px 24px" }}>
              <p style={{ fontSize: "13px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.04em", color: "var(--text-primary)", marginBottom: "12px" }}>
                Tu timeline
              </p>
              <div style={{ position: "relative", height: "8px", background: "#e2e8f0", borderRadius: "4px", marginBottom: "16px" }}>
                <div style={{
                  position: "absolute", left: 0, top: 0, height: "100%",
                  width: `${Math.min(100, (parseInput(currentSavings) / result.pieNeeded) * 100)}%`,
                  background: "linear-gradient(90deg, #db2777, #ec4899)",
                  borderRadius: "4px", transition: "width 0.5s",
                }} />
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", color: "var(--text-secondary)" }}>
                <span>Hoy: {formatCLP(parseInput(currentSavings))}</span>
                <span>Meta: {formatCLP(result.pieNeeded)}</span>
              </div>
            </div>
          )}
        </div>
      ) : undefined}
      explanation={result && result.monthsToGoal > 0 && result.monthsToGoal < 600 ? (
        <div style={{ fontSize: "14px", color: "var(--text-secondary)", lineHeight: 1.7 }}>
          <p style={{ marginBottom: "8px" }}>
            Necesitas un pie de <strong>{formatCLP(result.pieNeeded)}</strong> ({piePct}% de la propiedad).
            Ahorrando <strong>{formatCLP(parseInput(monthlySavings))}/mes</strong> con un rendimiento estimado de 4% anual,
            llegarás a la meta en <strong>{result.monthsToGoal} meses</strong>.
          </p>
          <p>
            El rendimiento de 4% es conservador — equivale a un depósito a plazo o fondo mutuo de bajo riesgo.
            Mientras más rápido ahorres, menos pagas en arriendo mientras esperas.
          </p>
        </div>
      ) : undefined}
    >
      <form onSubmit={handleCalc} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
        <div>
          <label className="form-label">Precio de la propiedad que quieres</label>
          <div style={{ display: "flex", gap: "8px" }}>
            <input type="text" inputMode="numeric" className="form-input" placeholder={currency === "UF" ? "Ej: 3.500" : "Ej: 130.000.000"} value={priceRaw} onChange={e => setPriceRaw(fmtInput(e.target.value))} style={{ flex: 1 }} required />
            <select className="form-select" value={currency} onChange={e => { setCurrency(e.target.value as "CLP" | "UF"); setPriceRaw(""); }} style={{ width: "80px" }}>
              <option value="UF">UF</option>
              <option value="CLP">CLP</option>
            </select>
          </div>
        </div>

        <div>
          <label className="form-label">Pie deseado: {piePct}%</label>
          <input type="range" min={10} max={40} step={5} value={piePct} onChange={e => setPiePct(Number(e.target.value))} style={{ width: "100%", accentColor: "#db2777" }} />
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", color: "var(--text-muted)" }}><span>10%</span><span>40%</span></div>
        </div>

        <div>
          <label className="form-label">Ahorros actuales (CLP)</label>
          <input type="text" inputMode="numeric" className="form-input" placeholder="Ej: 5.000.000" value={currentSavings} onChange={e => setCurrentSavings(fmtInput(e.target.value))} />
        </div>

        <div>
          <label className="form-label">Ahorro mensual (CLP)</label>
          <input type="text" inputMode="numeric" className="form-input" placeholder="Ej: 500.000" value={monthlySavings} onChange={e => setMonthlySavings(fmtInput(e.target.value))} required />
          <p style={{ fontSize: "12px", color: "var(--text-muted)", marginTop: "4px" }}>Cuánto puedes destinar a ahorro cada mes.</p>
        </div>

        <button type="submit" className="btn-primary" style={{ width: "100%", padding: "14px", fontSize: "16px", marginTop: "4px" }}>
          Calcular →
        </button>
      </form>
    </ToolLayout>
  );
}
