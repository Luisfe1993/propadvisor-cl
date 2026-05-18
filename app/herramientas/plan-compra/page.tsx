"use client";

import { useState, useEffect } from "react";
import { track } from "@vercel/analytics";
import ToolLayout from "@/components/ToolLayout";
import { calcPieAhorro, formatCLP, formatUF } from "@/lib/toolCalculations";

const UF_FALLBACK = 37000;

function fmtInput(v: string): string {
  const n = v.replace(/\D/g, "");
  return n ? Number(n).toLocaleString("es-CL") : "";
}
function parseInput(v: string): number {
  return Number(v.replace(/\D/g, "")) || 0;
}

interface Milestone {
  month: number;
  label: string;
  description: string;
  icon: string;
}

interface PlanResult {
  monthsToGoal: number;
  pieNeeded: number;
  monthlySavings: number;
  currentSavings: number;
  milestones: Milestone[];
  targetDate: string;
}

function buildPlan(pieNeeded: number, currentSavings: number, monthlySavings: number, monthsToGoal: number): PlanResult {
  const milestones: Milestone[] = [];
  const now = new Date();

  // 25% milestone
  const pct25months = Math.ceil(monthsToGoal * 0.25);
  milestones.push({ month: pct25months, label: "25% del pie", description: `Habrás juntado ${formatCLP(Math.round(pieNeeded * 0.25))}`, icon: "🌱" });

  // 50% milestone
  const pct50months = Math.ceil(monthsToGoal * 0.5);
  milestones.push({ month: pct50months, label: "Mitad del camino", description: `${formatCLP(Math.round(pieNeeded * 0.5))} ahorrados. Puedes empezar a buscar propiedades.`, icon: "🔍" });

  // Pre-approval
  const preApprovalMonth = Math.max(1, monthsToGoal - 3);
  milestones.push({ month: preApprovalMonth, label: "Pedir pre-aprobación", description: "Contacta a tu banco para obtener pre-aprobación del crédito.", icon: "🏦" });

  // 100%
  milestones.push({ month: monthsToGoal, label: "¡Pie listo!", description: `${formatCLP(pieNeeded)} ahorrados. Listo para firmar la promesa de compraventa.`, icon: "🎉" });

  // Post: key steps
  milestones.push({ month: monthsToGoal + 1, label: "Firma promesa", description: "Firma la promesa de compraventa y entrega el pie.", icon: "✍️" });
  milestones.push({ month: monthsToGoal + 3, label: "Escritura + llaves", description: "Firma la escritura pública y recibe las llaves de tu propiedad.", icon: "🔑" });

  const targetDate = new Date(now);
  targetDate.setMonth(targetDate.getMonth() + monthsToGoal);
  const targetStr = targetDate.toLocaleDateString("es-CL", { month: "long", year: "numeric" });

  return { monthsToGoal, pieNeeded, monthlySavings, currentSavings, milestones, targetDate: targetStr };
}

export default function PlanCompraPage() {
  const [priceRaw, setPriceRaw] = useState("");
  const [currency, setCurrency] = useState<"CLP" | "UF">("UF");
  const [piePct, setPiePct] = useState(20);
  const [currentSavings, setCurrentSavings] = useState("");
  const [monthlySavings, setMonthlySavings] = useState("");
  const [ufValue, setUfValue] = useState(UF_FALLBACK);
  const [plan, setPlan] = useState<PlanResult | null>(null);

  useEffect(() => {
    fetch("/api/uf").then(r => r.json()).then(d => { if (d.value) setUfValue(d.value); }).catch(() => {});
    track("tool_started", { tool: "plan-compra" });
  }, []);

  const handleCalc = (e: React.FormEvent) => {
    e.preventDefault();
    const raw = parseInput(priceRaw);
    if (raw <= 0) return;
    const priceCLP = currency === "UF" ? raw * ufValue : raw;
    const monthly = parseInput(monthlySavings);
    if (monthly <= 0) return;

    const savings = calcPieAhorro({
      propertyPriceCLP: priceCLP,
      downPaymentPct: piePct,
      currentSavings: parseInput(currentSavings),
      monthlySavings: monthly,
      annualSavingsReturn: 0.04,
    });

    if (savings.monthsToGoal >= 600) {
      setPlan({ monthsToGoal: 600, pieNeeded: savings.pieNeeded, monthlySavings: monthly, currentSavings: parseInput(currentSavings), milestones: [], targetDate: "Muy lejano" });
    } else {
      const p = buildPlan(savings.pieNeeded, parseInput(currentSavings), monthly, savings.monthsToGoal);
      setPlan(p);
    }
    track("tool_completed", { tool: "plan-compra", months: savings.monthsToGoal });
  };

  return (
    <ToolLayout
      slug="plan-compra"
      title="Mi plan para comprar"
      subtitle="Arma tu plan paso a paso: cuánto ahorrar, cuándo pedir pre-aprobación, y cuándo tendrás las llaves."
      showInsurance={false}
      emailCapture={plan && plan.monthsToGoal < 600 ? { ctaText: "Recibir hitos", valueProp: "Te enviamos un recordatorio en cada hito clave de tu plan de compra." } : undefined}
      toolData={plan ? { monthsToGoal: plan.monthsToGoal, pieNeeded: plan.pieNeeded, targetDate: plan.targetDate } : undefined}
      result={plan ? (
        <div>
          {plan.monthsToGoal >= 600 ? (
            <div style={{ background: "#fef2f2", border: "2px solid #dc2626", borderRadius: "16px", padding: "32px 28px", textAlign: "center" }}>
              <p style={{ fontSize: "40px", marginBottom: "8px" }}>⏳</p>
              <p style={{ fontSize: "20px", fontWeight: 700, color: "var(--text-primary)", marginBottom: "8px" }}>Necesitas ahorrar más</p>
              <p style={{ fontSize: "14px", color: "var(--text-secondary)" }}>
                Con {formatCLP(plan.monthlySavings)}/mes necesitarías demasiado tiempo. Considera aumentar tu ahorro o reducir el precio objetivo.
              </p>
            </div>
          ) : (
            <>
              {/* Summary card */}
              <div style={{
                background: "linear-gradient(135deg, #eef2ff 0%, #e0e7ff 50%, #ede9fe 100%)",
                border: "2px solid #4f46e5",
                borderRadius: "16px",
                padding: "32px 28px",
                textAlign: "center",
                marginBottom: "24px",
              }}>
                <p style={{ fontSize: "13px", fontWeight: 600, color: "#3730a3", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "8px" }}>
                  Tu fecha objetivo
                </p>
                <p style={{ fontSize: "clamp(28px, 5vw, 36px)", fontWeight: 800, color: "var(--text-primary)", letterSpacing: "-0.03em", lineHeight: 1.1, textTransform: "capitalize" }}>
                  {plan.targetDate}
                </p>
                <p style={{ fontSize: "16px", color: "var(--text-secondary)", marginTop: "8px" }}>
                  {plan.monthsToGoal} meses · {formatCLP(plan.monthlySavings)}/mes · Pie de {formatCLP(plan.pieNeeded)}
                </p>
              </div>

              {/* Timeline */}
              <div className="card" style={{ padding: "24px" }}>
                <p style={{ fontSize: "13px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.04em", color: "var(--text-primary)", marginBottom: "20px" }}>
                  Tu roadmap
                </p>
                <div style={{ position: "relative", paddingLeft: "32px" }}>
                  {/* Vertical line */}
                  <div style={{ position: "absolute", left: "11px", top: "8px", bottom: "8px", width: "2px", background: "var(--border)" }} />

                  {plan.milestones.map((m, i) => (
                    <div key={i} style={{ position: "relative", marginBottom: i < plan.milestones.length - 1 ? "24px" : "0" }}>
                      {/* Dot */}
                      <div style={{
                        position: "absolute", left: "-28px", top: "4px",
                        width: "18px", height: "18px", borderRadius: "50%",
                        background: i === plan.milestones.length - 1 ? "#4f46e5" : "white",
                        border: `2px solid ${i === plan.milestones.length - 1 ? "#4f46e5" : "var(--border)"}`,
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontSize: "10px", zIndex: 1,
                      }}>
                        {i === plan.milestones.length - 1 ? "" : ""}
                      </div>

                      <div>
                        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
                          <span style={{ fontSize: "16px" }}>{m.icon}</span>
                          <span style={{ fontSize: "12px", fontWeight: 600, color: "#4f46e5", textTransform: "uppercase", letterSpacing: "0.04em" }}>
                            Mes {m.month}
                          </span>
                        </div>
                        <p style={{ fontSize: "15px", fontWeight: 700, color: "var(--text-primary)", marginBottom: "2px" }}>{m.label}</p>
                        <p style={{ fontSize: "13px", color: "var(--text-secondary)", lineHeight: 1.5 }}>{m.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      ) : undefined}
      explanation={plan && plan.monthsToGoal < 600 ? (
        <div style={{ fontSize: "14px", color: "var(--text-secondary)", lineHeight: 1.7 }}>
          <p style={{ marginBottom: "8px" }}>
            Este plan asume un ahorro constante de {formatCLP(plan.monthlySavings)}/mes con un rendimiento conservador de 4% anual (depósito a plazo o fondo mutuo de bajo riesgo).
          </p>
          <p>
            <strong>Tip:</strong> Pide la pre-aprobación bancaria 2-3 meses antes de tener el pie completo. El proceso toma ~2-4 semanas y te da certeza de cuánto te presta el banco.
          </p>
        </div>
      ) : undefined}
    >
      <form onSubmit={handleCalc} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
        <div>
          <label className="form-label">Precio de la propiedad objetivo</label>
          <div style={{ display: "flex", gap: "8px" }}>
            <input type="text" inputMode="numeric" className="form-input" placeholder={currency === "UF" ? "Ej: 3.500" : "Ej: 130.000.000"} value={priceRaw} onChange={e => setPriceRaw(fmtInput(e.target.value))} style={{ flex: 1 }} required />
            <select className="form-select" value={currency} onChange={e => { setCurrency(e.target.value as "CLP" | "UF"); setPriceRaw(""); }} style={{ width: "80px" }}>
              <option value="UF">UF</option>
              <option value="CLP">CLP</option>
            </select>
          </div>
        </div>

        <div>
          <label className="form-label">Pie: {piePct}%</label>
          <input type="range" min={10} max={40} step={5} value={piePct} onChange={e => setPiePct(Number(e.target.value))} style={{ width: "100%", accentColor: "#4f46e5" }} />
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", color: "var(--text-muted)" }}><span>10%</span><span>40%</span></div>
        </div>

        <div>
          <label className="form-label">Ahorros actuales (CLP)</label>
          <input type="text" inputMode="numeric" className="form-input" placeholder="Ej: 5.000.000" value={currentSavings} onChange={e => setCurrentSavings(fmtInput(e.target.value))} />
        </div>

        <div>
          <label className="form-label">Ahorro mensual (CLP)</label>
          <input type="text" inputMode="numeric" className="form-input" placeholder="Ej: 500.000" value={monthlySavings} onChange={e => setMonthlySavings(fmtInput(e.target.value))} required />
        </div>

        <button type="submit" className="btn-primary" style={{ width: "100%", padding: "14px", fontSize: "16px", marginTop: "4px", background: "#4f46e5" }}>
          Crear mi plan →
        </button>
      </form>
    </ToolLayout>
  );
}
