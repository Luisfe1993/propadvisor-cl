"use client";

import { useState, useEffect } from "react";
import { track } from "@vercel/analytics";
import ToolLayout from "@/components/ToolLayout";
import { calcPresupuesto, formatCLP } from "@/lib/toolCalculations";
import type { PresupuestoResult } from "@/lib/toolCalculations";

function fmtInput(v: string): string {
  const n = v.replace(/\D/g, "");
  return n ? Number(n).toLocaleString("es-CL") : "";
}
function parseInput(v: string): number {
  return Number(v.replace(/\D/g, "")) || 0;
}

const statusConfig = {
  saludable: { emoji: "✅", color: "#16a34a", bg: "linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)", border: "#16a34a", label: "Saludable" },
  ajustado: { emoji: "⚠️", color: "#d97706", bg: "linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%)", border: "#d97706", label: "Ajustado" },
  riesgoso: { emoji: "🚨", color: "#dc2626", bg: "linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%)", border: "#dc2626", label: "Riesgoso" },
};

export default function PresupuestoPage() {
  const [income, setIncome] = useState("");
  const [housing, setHousing] = useState("");
  const [otherCosts, setOtherCosts] = useState("");
  const [result, setResult] = useState<PresupuestoResult | null>(null);

  useEffect(() => {
    track("tool_started", { tool: "presupuesto-vivienda" });
  }, []);

  const handleCalc = (e: React.FormEvent) => {
    e.preventDefault();
    const inc = parseInput(income);
    const hous = parseInput(housing);
    if (inc <= 0 || hous <= 0) return;

    const r = calcPresupuesto({
      monthlyIncome: inc,
      housingCost: hous,
      otherFixedCosts: parseInput(otherCosts),
    });
    setResult(r);
    track("tool_completed", { tool: "presupuesto-vivienda", status: r.status, pct: Math.round(r.totalHousingPct * 100) });
  };

  const sc = result ? statusConfig[result.status] : null;

  return (
    <ToolLayout
      slug="presupuesto-vivienda"
      title="¿Cuánto de mi sueldo se va en vivienda?"
      subtitle="Revisa si tu gasto en vivienda (dividendo o arriendo + gastos comunes) es saludable según la regla del 30%."
      showInsurance={false}
      emailCapture={result ? { ctaText: "Guardar presupuesto", valueProp: "Guarda tu presupuesto y compáralo si cambias de vivienda." } : undefined}
      toolData={result ? { status: result.status, housingPct: result.totalHousingPct, maxRecommended: result.maxRecommendedHousing } : undefined}
      result={result && sc ? (
        <div>
          {/* Status card */}
          <div style={{
            background: sc.bg,
            border: `2px solid ${sc.border}`,
            borderRadius: "16px",
            padding: "32px 28px",
            textAlign: "center",
            marginBottom: "20px",
          }}>
            <p style={{ fontSize: "40px", marginBottom: "8px" }}>{sc.emoji}</p>
            <p style={{ fontSize: "clamp(24px, 5vw, 32px)", fontWeight: 800, color: "var(--text-primary)", letterSpacing: "-0.03em", marginBottom: "8px" }}>
              {sc.label}
            </p>
            <p style={{ fontSize: "16px", color: "var(--text-secondary)", marginBottom: "20px", maxWidth: "360px", margin: "0 auto 20px" }}>
              {result.recommendation}
            </p>

            {/* Gauge */}
            <div style={{ maxWidth: "320px", margin: "0 auto" }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", color: "var(--text-muted)", marginBottom: "6px" }}>
                <span>0%</span>
                <span>30% (ideal)</span>
                <span>50%+</span>
              </div>
              <div style={{ position: "relative", height: "12px", background: "#e2e8f0", borderRadius: "6px", overflow: "hidden" }}>
                {/* 30% marker */}
                <div style={{ position: "absolute", left: "60%", top: 0, width: "2px", height: "100%", background: "#16a34a", zIndex: 2 }} />
                {/* Bar */}
                <div style={{
                  width: `${Math.min(100, result.totalHousingPct * 200)}%`,
                  height: "100%",
                  background: result.totalHousingPct <= 0.3 ? "#16a34a" : result.totalHousingPct <= 0.4 ? "#d97706" : "#dc2626",
                  borderRadius: "6px",
                  transition: "width 0.5s",
                }} />
              </div>
              <p style={{ fontSize: "24px", fontWeight: 800, color: sc.color, marginTop: "12px" }}>
                {Math.round(result.totalHousingPct * 100)}%
              </p>
              <p style={{ fontSize: "13px", color: "var(--text-secondary)" }}>de tu ingreso va a vivienda</p>
            </div>
          </div>

          {/* Breakdown */}
          <div className="card" style={{ padding: "20px 24px" }}>
            <p style={{ fontSize: "13px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.04em", color: "var(--text-primary)", marginBottom: "12px" }}>
              Desglose
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px", fontSize: "14px" }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: "var(--text-secondary)" }}>Dividendo / Arriendo</span>
                <span style={{ fontWeight: 700 }}>{formatCLP(parseInput(housing))} ({Math.round(result.housingPct * 100)}%)</span>
              </div>
              {parseInput(otherCosts) > 0 && (
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ color: "var(--text-secondary)" }}>Gastos comunes + seguros</span>
                  <span style={{ fontWeight: 700 }}>{formatCLP(parseInput(otherCosts))}</span>
                </div>
              )}
              <div style={{ display: "flex", justifyContent: "space-between", borderTop: "1px solid var(--border)", paddingTop: "10px" }}>
                <span style={{ color: "var(--text-secondary)" }}>Máximo recomendado (30%)</span>
                <span style={{ fontWeight: 700, color: "#16a34a" }}>{formatCLP(result.maxRecommendedHousing)}</span>
              </div>
            </div>
          </div>
        </div>
      ) : undefined}
      explanation={result ? (
        <div style={{ fontSize: "14px", color: "var(--text-secondary)", lineHeight: 1.7 }}>
          <p style={{ marginBottom: "8px" }}>
            La <strong>regla del 30%</strong> dice que tu gasto total en vivienda (dividendo o arriendo + gastos comunes + seguros) no debería superar el 30% de tu ingreso líquido mensual.
          </p>
          <p style={{ marginBottom: "8px" }}>
            Esto te deja margen para ahorro, imprevistos y calidad de vida.
            Los bancos chilenos usan una regla similar (25-30% máximo del dividendo vs. ingreso) para aprobar créditos hipotecarios.
          </p>
          <p>
            Si estás por encima del 30%, considera: buscar una propiedad más económica, aumentar el pie para bajar el dividendo, o extender el plazo del crédito.
          </p>
        </div>
      ) : undefined}
    >
      <form onSubmit={handleCalc} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
        <div>
          <label className="form-label">Ingreso líquido mensual (CLP)</label>
          <input type="text" inputMode="numeric" className="form-input" placeholder="Ej: 2.500.000" value={income} onChange={e => setIncome(fmtInput(e.target.value))} required />
        </div>
        <div>
          <label className="form-label">Dividendo o arriendo mensual (CLP)</label>
          <input type="text" inputMode="numeric" className="form-input" placeholder="Ej: 600.000" value={housing} onChange={e => setHousing(fmtInput(e.target.value))} required />
        </div>
        <div>
          <label className="form-label">Gastos comunes + seguros (CLP)</label>
          <input type="text" inputMode="numeric" className="form-input" placeholder="Ej: 80.000" value={otherCosts} onChange={e => setOtherCosts(fmtInput(e.target.value))} />
          <p style={{ fontSize: "12px", color: "var(--text-muted)", marginTop: "4px" }}>GGCC, seguro de incendio, desgravamen. Deja en 0 si no aplica.</p>
        </div>
        <button type="submit" className="btn-primary" style={{ width: "100%", padding: "14px", fontSize: "16px", marginTop: "4px" }}>
          Evaluar →
        </button>
      </form>
    </ToolLayout>
  );
}
