"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { track } from "@vercel/analytics";
import { calcMonthlyPayment } from "@/lib/calculations";
import { getCityOptions, getComunaOptions, getComunaInfo } from "@/lib/comunaData";

const UF_FALLBACK = 37000;

// Styles
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

type InputCurrency = "CLP" | "UF";

export default function CuantoPiePage() {
  const [priceRaw, setPriceRaw] = useState("");
  const [priceCurrency, setPriceCurrency] = useState<InputCurrency>("UF");
  const [city, setCity] = useState("santiago");
  const [comuna, setComuna] = useState("providencia");
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

  const priceCLP = (() => {
    const n = parseFloat(priceRaw.replace(/\./g, "").replace(",", "."));
    if (!n || isNaN(n)) return 0;
    return priceCurrency === "UF" ? n * ufValue : n;
  })();
  const priceUF = priceCLP / ufValue;

  const comunaInfo = getComunaInfo(city, comuna);
  const hasResult = priceCLP > 0;

  // Rates per pie level (approximate best available)
  const scenarios = [
    { pie: 10, rate: 4.19, label: "Mínimo (10%)", note: "Solo primera vivienda. Tasa más alta." },
    { pie: 20, rate: 3.43, label: "Estándar (20%)", note: "Requisito más común. Mejor tasa." },
    { pie: 30, rate: 3.19, label: "Ideal (30%)", note: "Mejor tasa disponible. Requerido para inversión." },
  ];

  const results = scenarios.map((s) => {
    const pieAmount = priceCLP * s.pie / 100;
    const loanAmount = priceCLP - pieAmount;
    const monthlyPayment = calcMonthlyPayment(loanAmount, s.rate, 20);
    const totalInterest = monthlyPayment * 240 - loanAmount;
    const closingCosts = priceCLP * 0.018; // ~1.8% escrituración
    const totalUpfront = pieAmount + closingCosts;

    return { ...s, pieAmount, loanAmount, monthlyPayment, totalInterest, closingCosts, totalUpfront };
  });

  // Track
  if (hasResult && !tracked) {
    track("pie_calculated", { priceUF: Math.round(priceUF) });
    setTracked(true);
  }

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg-primary)" }}>
      <div style={{ maxWidth: "640px", margin: "0 auto", padding: "32px 24px 64px" }}>

        {/* Header */}
        <header style={{ marginBottom: "32px", textAlign: "center" }}>
          <Link href="/" style={{ fontSize: "13px", color: "var(--text-muted)", display: "inline-block", marginBottom: "16px" }}>
            ← Volver al inicio
          </Link>
          <h1 style={{ fontSize: "clamp(24px, 4vw, 32px)", fontWeight: 800, letterSpacing: "-0.03em", color: "var(--text-primary)", marginBottom: "6px" }}>
            ¿Cuánto pie necesito?
          </h1>
          <p style={{ fontSize: "14px", color: "var(--text-secondary)" }}>
            Ingresa el precio y ve cuánto necesitas en mano para comprar.
          </p>
          <p style={{ fontSize: "12px", color: "var(--text-muted)", marginTop: "6px" }}>
            📡 UF {ufValue.toLocaleString("es-CL")}
          </p>
        </header>

        {/* Input card */}
        <div style={{
          border: "1px solid var(--border)", borderRadius: "12px",
          padding: "24px", background: "white",
          display: "flex", flexDirection: "column", gap: "16px",
          marginBottom: "16px",
        }}>
          {/* City + Comuna */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
            <div>
              <label htmlFor="city" style={labelSx}>Ciudad</label>
              <select id="city" value={city}
                onChange={(e) => {
                  setCity(e.target.value);
                  const comunas = getComunaOptions(e.target.value);
                  setComuna(comunas[0]?.value || "");
                }}
                style={{ ...inputSx, cursor: "pointer" }} onFocus={onFocus} onBlur={onBlur}>
                {getCityOptions().map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
              </select>
            </div>
            <div>
              <label htmlFor="comuna" style={labelSx}>Comuna</label>
              <select id="comuna" value={comuna}
                onChange={(e) => setComuna(e.target.value)}
                style={{ ...inputSx, cursor: "pointer" }} onFocus={onFocus} onBlur={onBlur}>
                {getComunaOptions(city).map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
              </select>
            </div>
          </div>

          {/* Price */}
          <div>
            <label htmlFor="price" style={labelSx}>Precio de la propiedad</label>
            <div style={{ display: "flex", gap: "8px" }}>
              <input
                id="price" type="text" inputMode="numeric"
                value={priceRaw}
                onChange={(e) => { setPriceRaw(e.target.value); setTracked(false); }}
                placeholder={priceCurrency === "UF" ? "Ej: 3200" : "Ej: 120000000"}
                style={{ ...inputSx, flex: 1 }} onFocus={onFocus} onBlur={onBlur}
                autoFocus
              />
              <select value={priceCurrency}
                onChange={(e) => setPriceCurrency(e.target.value as InputCurrency)}
                style={{ ...inputSx, width: "80px", cursor: "pointer" }}
                onFocus={onFocus} onBlur={onBlur}>
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

          {/* Comuna context */}
          {comunaInfo && hasResult && (
            <div style={{
              background: "var(--accent-light)", border: "1px solid var(--accent)",
              borderRadius: "10px", padding: "12px 14px",
            }}>
              <p style={{ fontSize: "13px", fontWeight: 700, color: "var(--accent-dark)", marginBottom: "4px" }}>
                {comunaInfo.label}
              </p>
              <p style={{ fontSize: "11px", color: "var(--text-secondary)" }}>
                Plusvalía {(comunaInfo.appreciation * 100).toFixed(0)}%/año · Cap rate {(comunaInfo.capRate * 100).toFixed(1)}% · Precio m² UF {comunaInfo.avgPricePerM2UF}
              </p>
            </div>
          )}
        </div>

        {/* Results */}
        {hasResult && (
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>

            {/* Scenario cards */}
            <div style={{ background: "var(--bg-secondary)", border: "1px solid var(--border)", borderRadius: "12px", padding: "20px" }}>
              <p style={{ ...labelSx, marginBottom: "4px" }}>Pie + gastos para esta propiedad</p>
              <p style={{ fontSize: "11px", color: "var(--text-muted)", marginBottom: "16px" }}>
                Cuánto necesitas en mano según el % de pie.
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                {results.map((r, i) => {
                  const isRecommended = i === 1;
                  return (
                    <div key={r.label} style={{
                      background: "white",
                      border: isRecommended ? "2px solid var(--accent)" : "1px solid var(--border)",
                      borderRadius: "10px", padding: "14px 16px",
                    }}>
                      {isRecommended && <span style={{ fontSize: "10px", fontWeight: 700, color: "var(--accent-dark)", background: "var(--accent-light)", padding: "2px 8px", borderRadius: "4px", textTransform: "uppercase", letterSpacing: "0.04em" }}>⭐ Más común</span>}
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: isRecommended ? "8px" : 0 }}>
                        <div>
                          <p style={{ fontSize: "13px", fontWeight: 700, color: "var(--text-primary)" }}>{r.label}</p>
                          <p style={{ fontSize: "11px", color: "var(--text-muted)", marginTop: "2px" }}>{r.note}</p>
                        </div>
                        <div style={{ textAlign: "right" }}>
                          <p style={{ fontSize: "20px", fontWeight: 800, letterSpacing: "-0.03em", color: "var(--accent)" }}>
                            {formatShort(r.totalUpfront)}
                          </p>
                          <p style={{ fontSize: "10px", color: "var(--text-muted)" }}>en mano</p>
                        </div>
                      </div>
                      <div style={{
                        display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "8px",
                        marginTop: "10px", paddingTop: "10px", borderTop: "1px solid var(--border)",
                        fontSize: "11px",
                      }}>
                        <div>
                          <p style={{ color: "var(--text-muted)", marginBottom: "1px" }}>Pie</p>
                          <p style={{ fontWeight: 700, color: "var(--text-primary)" }}>{formatShort(r.pieAmount)}</p>
                        </div>
                        <div>
                          <p style={{ color: "var(--text-muted)", marginBottom: "1px" }}>Escrituración</p>
                          <p style={{ fontWeight: 700, color: "var(--text-primary)" }}>{formatShort(r.closingCosts)}</p>
                        </div>
                        <div>
                          <p style={{ color: "var(--text-muted)", marginBottom: "1px" }}>Dividendo</p>
                          <p style={{ fontWeight: 700, color: "var(--text-primary)" }}>{formatCLP(r.monthlyPayment)}/mes</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Savings comparison */}
            <div style={{ background: "white", border: "1px solid var(--border)", borderRadius: "12px", padding: "20px" }}>
              <p style={{ ...labelSx, marginBottom: "12px" }}>💡 Diferencia de poner más pie</p>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", fontSize: "13px" }}>
                <div>
                  <p style={{ color: "var(--text-muted)", marginBottom: "4px", fontSize: "11px" }}>10% vs 20% pie</p>
                  <p style={{ fontWeight: 700, color: "#16a34a" }}>
                    Ahorras {formatCLP(results[0].monthlyPayment - results[1].monthlyPayment)}/mes
                  </p>
                  <p style={{ fontSize: "11px", color: "var(--text-muted)", marginTop: "2px" }}>
                    y {formatShort(results[0].totalInterest - results[1].totalInterest)} en intereses totales
                  </p>
                </div>
                <div>
                  <p style={{ color: "var(--text-muted)", marginBottom: "4px", fontSize: "11px" }}>20% vs 30% pie</p>
                  <p style={{ fontWeight: 700, color: "#16a34a" }}>
                    Ahorras {formatCLP(results[1].monthlyPayment - results[2].monthlyPayment)}/mes
                  </p>
                  <p style={{ fontSize: "11px", color: "var(--text-muted)", marginTop: "2px" }}>
                    y {formatShort(results[1].totalInterest - results[2].totalInterest)} en intereses totales
                  </p>
                </div>
              </div>
            </div>

            {/* CTA to main calculator */}
            <a href="/calcular" style={{
              display: "block", width: "100%", padding: "16px", textAlign: "center",
              fontSize: "16px", fontWeight: 700, color: "white",
              background: "var(--accent)", borderRadius: "10px",
              textDecoration: "none", transition: "transform 0.1s",
            }}
              onClick={() => track("feeder_to_calculator", { source: "cuanto-pie" })}
            >
              ¿Conviene comprar o arrendar? Compara los 3 caminos →
            </a>

            {/* FAQ */}
            <div style={{ background: "white", border: "1px solid var(--border)", borderRadius: "12px", padding: "20px" }}>
              <p style={{ ...labelSx, marginBottom: "16px" }}>Preguntas frecuentes</p>
              {[
                {
                  q: "¿Cuánto pie necesito para comprar un departamento?",
                  a: "Para primera vivienda, los bancos piden entre 10% y 20%. Para inversión, mínimo 20-30%. Siempre suma ~1.8% extra para gastos de escrituración (notaría, inscripción, tasación).",
                },
                {
                  q: "¿Conviene poner más pie del mínimo?",
                  a: "Sí. Con más pie obtienes mejor tasa, pagas menos dividendo y menos intereses totales. La diferencia puede ser $50.000-$100.000/mes en el dividendo.",
                },
                {
                  q: "¿Qué son los gastos de escrituración?",
                  a: "Incluyen: tasación (~UF 5), estudio de títulos (~UF 5-8), notaría (~0.5% del valor), inscripción CBR (~0.5%), impuesto de timbres y estampillas (0.2-0.8%). En total, 1.5-2% del valor.",
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
              <Link href="/cuanto-puedo-comprar" style={{ fontSize: "14px", fontWeight: 600, color: "var(--accent)" }}>
                ¿No sabes cuánto puedes comprar? Calcula según tu sueldo →
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
