"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { track } from "@vercel/analytics";
import { calcMonthlyPayment } from "@/lib/calculations";

const UF_FALLBACK = 37000;

// Styles (shared with /calcular)
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
function onFocus(e: React.FocusEvent<HTMLInputElement>) {
  e.currentTarget.style.borderColor = "var(--accent)";
  e.currentTarget.style.boxShadow = "0 0 0 3px rgba(13,148,136,0.1)";
}
function onBlur(e: React.FocusEvent<HTMLInputElement>) {
  e.currentTarget.style.borderColor = "var(--border)";
  e.currentTarget.style.boxShadow = "none";
}

export default function CuantoPuedoComprarPage() {
  const [salaryRaw, setSalaryRaw] = useState("");
  const [debtsRaw, setDebtsRaw] = useState("");
  const [savingsRaw, setSavingsRaw] = useState("");
  const [ufValue, setUfValue] = useState(UF_FALLBACK);
  const [tracked, setTracked] = useState(false);

  useEffect(() => {
    fetch("/api/uf")
      .then((r) => r.json())
      .then((d) => { if (d.value) setUfValue(d.value); })
      .catch(() => {});
  }, []);

  const formatCLP = (v: number) =>
    new Intl.NumberFormat("es-CL", { style: "currency", currency: "CLP", minimumFractionDigits: 0 }).format(v);
  const formatShort = (v: number) => {
    const abs = Math.abs(v);
    if (abs >= 1_000_000_000) return `$${(abs / 1_000_000_000).toFixed(1)} mil M`;
    if (abs >= 1_000_000) return `$${(abs / 1_000_000).toFixed(0)}M`;
    if (abs >= 1_000) return `$${(abs / 1_000).toFixed(0)}K`;
    return `$${abs}`;
  };

  const salary = parseInt(salaryRaw.replace(/\./g, "")) || 0;
  const debts = parseInt(debtsRaw.replace(/\./g, "")) || 0;
  const savings = parseInt(savingsRaw.replace(/\./g, "")) || 0;

  // Bank rule: max 25% of net salary for mortgage
  const availableForMortgage = Math.max(0, salary * 0.25 - debts);
  const hasResult = salary > 0 && availableForMortgage > 0;

  // Calculate max property for different scenarios
  const scenarios = [
    { pie: 10, term: 25, rate: 4.19, label: "Mínimo (10% pie)" },
    { pie: 20, term: 20, rate: 3.43, label: "Estándar (20% pie)" },
    { pie: 30, term: 20, rate: 3.19, label: "Ideal (30% pie)" },
  ];

  const results = scenarios.map((s) => {
    // Reverse-engineer: given max monthly payment, what's max loan?
    const monthlyRate = s.rate / 100 / 12;
    const n = s.term * 12;
    const maxLoan = monthlyRate > 0
      ? availableForMortgage * (Math.pow(1 + monthlyRate, n) - 1) / (monthlyRate * Math.pow(1 + monthlyRate, n))
      : availableForMortgage * n;
    const maxProperty = maxLoan / (1 - s.pie / 100);
    const pieNeeded = maxProperty * s.pie / 100;
    const actualPayment = calcMonthlyPayment(maxLoan, s.rate, s.term);

    return { ...s, maxLoan, maxProperty, pieNeeded, actualPayment };
  });

  // Track analysis
  if (hasResult && !tracked) {
    track("affordability_calculated", { salary: Math.round(salary / 100000) * 100000 });
    setTracked(true);
  }

  // Best scenario = highest property value
  const best = results.reduce((a, b) => a.maxProperty > b.maxProperty ? a : b);
  // Recommended = standard 20%
  const recommended = results[1];

  // Savings plan: how long to save the pie
  const monthlyCanSave = Math.max(0, salary - debts - (salary * 0.5)); // assume 50% living costs
  const monthsToSave20Pie = monthlyCanSave > 0 ? Math.ceil((recommended.pieNeeded - savings) / monthlyCanSave) : 0;
  const yearsToSave = monthsToSave20Pie > 0 ? Math.ceil(monthsToSave20Pie / 12) : 0;

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg-primary)" }}>
      <div style={{ maxWidth: "640px", margin: "0 auto", padding: "32px 24px 64px" }}>

        {/* Header */}
        <header style={{ marginBottom: "32px", textAlign: "center" }}>
          <Link href="/" style={{ fontSize: "13px", color: "var(--text-muted)", display: "inline-block", marginBottom: "16px" }}>
            ← Volver al inicio
          </Link>
          <h1 style={{ fontSize: "clamp(24px, 4vw, 32px)", fontWeight: 800, letterSpacing: "-0.03em", color: "var(--text-primary)", marginBottom: "6px" }}>
            ¿Cuánto puedo comprar?
          </h1>
          <p style={{ fontSize: "14px", color: "var(--text-secondary)" }}>
            Ingresa tu sueldo y descubre qué puedes comprar. Regla del 25% bancaria.
          </p>
        </header>

        {/* Input card */}
        <div style={{
          border: "1px solid var(--border)", borderRadius: "12px",
          padding: "24px", background: "white",
          display: "flex", flexDirection: "column", gap: "16px",
          marginBottom: "16px",
        }}>
          <div>
            <label htmlFor="salary" style={labelSx}>Sueldo líquido mensual</label>
            <input
              id="salary" type="text" inputMode="numeric"
              value={salaryRaw}
              onChange={(e) => { setSalaryRaw(e.target.value); setTracked(false); }}
              placeholder="Ej: 1500000"
              style={inputSx} onFocus={onFocus} onBlur={onBlur}
              autoFocus
            />
            <p style={{ fontSize: "11px", color: "var(--text-muted)", marginTop: "4px" }}>
              Lo que recibes en tu cuenta después de descuentos
            </p>
          </div>

          <div>
            <label htmlFor="debts" style={labelSx}>Deudas mensuales (opcional)</label>
            <input
              id="debts" type="text" inputMode="numeric"
              value={debtsRaw}
              onChange={(e) => setDebtsRaw(e.target.value)}
              placeholder="Ej: 150000"
              style={inputSx} onFocus={onFocus} onBlur={onBlur}
            />
            <p style={{ fontSize: "11px", color: "var(--text-muted)", marginTop: "4px" }}>
              Auto, tarjetas, otros créditos — se restan del 25%
            </p>
          </div>

          <div>
            <label htmlFor="savings" style={labelSx}>Ahorro disponible para pie (opcional)</label>
            <input
              id="savings" type="text" inputMode="numeric"
              value={savingsRaw}
              onChange={(e) => setSavingsRaw(e.target.value)}
              placeholder="Ej: 10000000"
              style={inputSx} onFocus={onFocus} onBlur={onBlur}
            />
          </div>
        </div>

        {/* Results */}
        {hasResult && (
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>

            {/* Hero result */}
            <div style={{
              background: "var(--accent-light)", border: "1px solid var(--accent)",
              borderRadius: "12px", padding: "20px", textAlign: "center",
            }}>
              <p style={{ fontSize: "12px", color: "var(--accent-dark)", fontWeight: 600, marginBottom: "4px" }}>
                Tu dividendo máximo (25% regla bancaria)
              </p>
              <p style={{ fontSize: "32px", fontWeight: 800, color: "var(--accent)", letterSpacing: "-0.03em" }}>
                {formatCLP(availableForMortgage)}<span style={{ fontSize: "14px", fontWeight: 500, color: "var(--text-secondary)" }}>/mes</span>
              </p>
              {debts > 0 && (
                <p style={{ fontSize: "11px", color: "var(--text-muted)", marginTop: "4px" }}>
                  25% de {formatCLP(salary)} = {formatCLP(salary * 0.25)} − deudas {formatCLP(debts)}
                </p>
              )}
            </div>

            {/* Scenario cards */}
            <div style={{ background: "var(--bg-secondary)", border: "1px solid var(--border)", borderRadius: "12px", padding: "20px" }}>
              <p style={{ ...labelSx, marginBottom: "4px" }}>¿Qué puedes comprar?</p>
              <p style={{ fontSize: "11px", color: "var(--text-muted)", marginBottom: "16px" }}>
                3 escenarios según tu pie disponible.
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                {results.map((r, i) => {
                  const isRecommended = i === 1;
                  const canAffordPie = savings >= r.pieNeeded;
                  return (
                    <div key={r.label} style={{
                      background: "white",
                      border: isRecommended ? "2px solid var(--accent)" : "1px solid var(--border)",
                      borderRadius: "10px", padding: "14px 16px",
                    }}>
                      {isRecommended && <span style={{ fontSize: "10px", fontWeight: 700, color: "var(--accent-dark)", background: "var(--accent-light)", padding: "2px 8px", borderRadius: "4px", textTransform: "uppercase", letterSpacing: "0.04em" }}>⭐ Recomendado</span>}
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: isRecommended ? "8px" : 0 }}>
                        <p style={{ fontSize: "13px", fontWeight: 700, color: "var(--text-primary)" }}>
                          {r.label}
                        </p>
                        <p style={{ fontSize: "20px", fontWeight: 800, letterSpacing: "-0.03em", color: "var(--accent)" }}>
                          {formatShort(r.maxProperty)}
                        </p>
                      </div>
                      <div style={{ display: "flex", gap: "16px", marginTop: "6px", fontSize: "11px", color: "var(--text-muted)" }}>
                        <span>Pie: {formatShort(r.pieNeeded)}</span>
                        <span>Dividendo: {formatCLP(r.actualPayment)}/mes</span>
                        <span>Tasa: {r.rate}%</span>
                      </div>
                      {savings > 0 && (
                        <p style={{ fontSize: "11px", marginTop: "4px", fontWeight: 600, color: canAffordPie ? "#16a34a" : "#d97706" }}>
                          {canAffordPie ? "✅ Tu ahorro cubre el pie" : `⚠️ Faltan ${formatShort(r.pieNeeded - savings)} de pie`}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Savings plan */}
            {savings < recommended.pieNeeded && monthlyCanSave > 0 && (
              <div style={{ background: "white", border: "1px solid var(--border)", borderRadius: "12px", padding: "20px" }}>
                <p style={{ ...labelSx, marginBottom: "8px" }}>💡 Plan de ahorro para el pie</p>
                <p style={{ fontSize: "14px", color: "var(--text-secondary)", lineHeight: 1.6 }}>
                  Te faltan <strong>{formatShort(recommended.pieNeeded - savings)}</strong> para el pie estándar (20%).
                  Ahorrando <strong>{formatCLP(monthlyCanSave)}/mes</strong>, lo juntas en <strong>{yearsToSave > 1 ? `~${yearsToSave} años` : `~${monthsToSave20Pie} meses`}</strong>.
                </p>
              </div>
            )}

            {/* CTA to main calculator */}
            <a href={`/calcular`} style={{
              display: "block", width: "100%", padding: "16px", textAlign: "center",
              fontSize: "16px", fontWeight: 700, color: "white",
              background: "var(--accent)", borderRadius: "10px",
              textDecoration: "none", transition: "transform 0.1s",
            }}
              onClick={() => track("feeder_to_calculator", { source: "cuanto-puedo-comprar" })}
            >
              ¿Ya tienes una propiedad en mente? Simula si conviene →
            </a>

            {/* FAQ */}
            <div style={{ background: "white", border: "1px solid var(--border)", borderRadius: "12px", padding: "20px" }}>
              <p style={{ ...labelSx, marginBottom: "16px" }}>Preguntas frecuentes</p>
              {[
                {
                  q: "¿Qué es la regla del 25%?",
                  a: "Los bancos en Chile exigen que tu dividendo hipotecario no supere el 25% de tu sueldo líquido. Algunos aceptan hasta 30% con buen historial crediticio.",
                },
                {
                  q: "¿Cuánto sueldo necesito para un crédito hipotecario?",
                  a: "Para un departamento de UF 2.500 (~$92M) con 20% de pie, necesitas un sueldo líquido de al menos ~$1.100.000 para que el dividendo no supere el 25%.",
                },
                {
                  q: "¿Las deudas afectan cuánto me prestan?",
                  a: "Sí. Los bancos restan tus cuotas de créditos existentes (auto, tarjetas, educación) del 25% disponible para el dividendo.",
                },
              ].map((faq, i) => (
                <details key={i} style={{ borderTop: i > 0 ? "1px solid var(--border)" : "none", padding: "14px 0" }}>
                  <summary style={{ cursor: "pointer", fontSize: "14px", fontWeight: 600, color: "var(--text-primary)", lineHeight: 1.4 }}>
                    {faq.q}
                  </summary>
                  <p style={{ fontSize: "13px", color: "var(--text-secondary)", lineHeight: 1.7, marginTop: "8px" }}>
                    {faq.a}
                  </p>
                </details>
              ))}
            </div>

            {/* Cross-link */}
            <div style={{ textAlign: "center" }}>
              <Link href="/cuanto-pie" style={{ fontSize: "14px", fontWeight: 600, color: "var(--accent)" }}>
                ¿Ya sabes qué comprar? Calcula cuánto pie necesitas →
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
