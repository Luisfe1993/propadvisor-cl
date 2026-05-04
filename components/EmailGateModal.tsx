"use client";

import { useState, useEffect, useRef } from "react";
import { track } from "@vercel/analytics";

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

export interface AnalysisPayload {
  address: string;
  propertyType: string;
  city: string;
  rooms: number;
  baths: number;
  priceCLP: number;
  priceUF: number;
  ufValue: number;
  bankName: string;
  interestRate: number;
  downPaymentPct: number;
  downPaymentCLP: number;
  loanTermYears: number;
  monthlyPayment: number;
  buyTotal: number;
  rentTotal: number;
  rentMonthlyCLP: number;
  netMonthlyFlow: number;
  rentalYield: number;
  propertyValueAfter20Years: number;
  savings: number;
  generatedAt: string;
  hasPreApproval?: boolean;
}

export interface LeadPayload extends AnalysisPayload {
  email: string;
  wantsBrokerContact: boolean;
  name?: string;
  phone?: string;
  incomeRange?: string;
  hasPieAvailable?: boolean;
}

interface EmailGateModalProps {
  payload: AnalysisPayload;
  onClose: () => void;
}

// ─────────────────────────────────────────────────────────────────────────────
// Inline styles
// ─────────────────────────────────────────────────────────────────────────────

const overlay: React.CSSProperties = {
  position: "fixed", inset: 0, zIndex: 1000,
  background: "rgba(0,0,0,0.45)",
  display: "flex", alignItems: "center", justifyContent: "center",
  padding: "16px",
  backdropFilter: "blur(4px)",
  WebkitBackdropFilter: "blur(4px)",
  overflowY: "auto",
};

const modal: React.CSSProperties = {
  background: "white",
  borderRadius: "16px",
  padding: "32px 28px 28px",
  width: "100%",
  maxWidth: "460px",
  maxHeight: "90vh",
  overflowY: "auto",
  boxShadow: "0 20px 60px rgba(0,0,0,0.18)",
  position: "relative",
  animation: "modalIn 0.18s ease-out",
};

const iconWrap: React.CSSProperties = {
  width: "52px", height: "52px", borderRadius: "12px",
  background: "var(--accent-light)", display: "flex",
  alignItems: "center", justifyContent: "center",
  color: "var(--accent)", marginBottom: "16px",
};

const inputStyle: React.CSSProperties = {
  width: "100%", padding: "12px 16px",
  fontSize: "16px", border: "1.5px solid var(--border)",
  borderRadius: "10px", background: "white",
  color: "var(--text-primary)", outline: "none",
  transition: "border-color 0.15s, box-shadow 0.15s",
  boxSizing: "border-box",
};

// ─────────────────────────────────────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────────────────────────────────────

export default function EmailGateModal({ payload, onClose }: EmailGateModalProps) {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [incomeRange, setIncomeRange] = useState("");
  const [hasPie, setHasPie] = useState<"" | "si" | "no">("");
  const [wantsBroker, setWantsBroker] = useState(true);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  // Capture UTM params from URL
  const utmSource = typeof window !== "undefined" ? new URLSearchParams(window.location.search).get("utm_source") || "" : "";

  useEffect(() => {
    // Focus input on open
    setTimeout(() => inputRef.current?.focus(), 50);
    // Close on Escape
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [onClose]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = email.trim().toLowerCase();
    if (!trimmed || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      setErrorMsg("Ingresa un email válido.");
      return;
    }
    setErrorMsg("");
    setStatus("loading");
    try {
      const res = await fetch("/api/send-analysis", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: trimmed,
          wantsBrokerContact: wantsBroker,
          utmSource,
          name: name.trim() || undefined,
          phone: phone.trim() || undefined,
          incomeRange: incomeRange || undefined,
          hasPieAvailable: hasPie === "si" ? true : hasPie === "no" ? false : undefined,
          ...payload,
        }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Error al enviar");
      setStatus("success");
      track("email_submitted", { broker_optin: wantsBroker, city: payload.city, utm_source: utmSource });
    } catch (err: unknown) {
      setStatus("error");
      setErrorMsg(err instanceof Error ? err.message : "Ocurrió un error. Intenta de nuevo.");
    }
  };

  return (
    <>
      <style>{`
        @keyframes modalIn {
          from { opacity: 0; transform: translateY(12px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>

      {/* Overlay */}
      <div style={overlay} onClick={(e) => { if (e.target === e.currentTarget) onClose(); }} role="dialog" aria-modal="true" aria-labelledby="modal-title">

        <div style={modal}>

          {/* Close button */}
          <button
            onClick={onClose}
            aria-label="Cerrar"
            style={{
              position: "absolute", top: "16px", right: "16px",
              background: "none", border: "none", cursor: "pointer",
              color: "var(--text-muted)", padding: "4px",
              fontSize: "20px", lineHeight: 1,
            }}
          >×</button>

          {status === "success" ? (
            // ── Success state ────────────────────────────────────────────────
            <div style={{ textAlign: "center", padding: "8px 0" }}>
              <div style={{ fontSize: "48px", marginBottom: "16px" }}>✅</div>
              <h2 style={{ fontSize: "20px", fontWeight: 800, color: "var(--text-primary)", marginBottom: "10px", letterSpacing: "-0.02em" }}>
                ¡Listo! Revisa tu bandeja
              </h2>
              <p style={{ fontSize: "15px", color: "var(--text-secondary)", lineHeight: 1.6, marginBottom: "8px" }}>
                Te enviamos el <strong>informe PDF</strong> y el <strong>modelo Excel</strong> a <strong>{email}</strong>.
              </p>
              {wantsBroker && (
                <p style={{ fontSize: "14px", color: "var(--accent-dark)", lineHeight: 1.6, marginBottom: "8px", background: "var(--accent-light)", borderRadius: "8px", padding: "10px 14px" }}>
                  Un ejecutivo hipotecario se pondrá en contacto contigo para ayudarte con el crédito.
                </p>
              )}
              <p style={{ fontSize: "13px", color: "var(--text-muted)", marginBottom: "20px", lineHeight: 1.5 }}>
                También te avisaremos si las tasas hipotecarias bajan — para que no pierdas la mejor oportunidad.
              </p>
              <button
                onClick={onClose}
                style={{
                  background: "var(--accent)", color: "white", border: "none",
                  borderRadius: "10px", padding: "12px 28px", fontSize: "15px",
                  fontWeight: 700, cursor: "pointer", width: "100%",
                }}
              >
                Cerrar
              </button>
            </div>
          ) : (
            // ── Input state ──────────────────────────────────────────────────
            <form onSubmit={handleSubmit}>

              {/* Personalized summary — user's own numbers */}
              <div style={{
                background: "linear-gradient(135deg, #0f766e 0%, #1e3a5f 100%)",
                borderRadius: "12px", padding: "16px", marginBottom: "20px",
                color: "white",
              }}>
                <p style={{ fontSize: "11px", opacity: 0.7, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "8px" }}>Tu análisis personalizado</p>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
                  <div>
                    <p style={{ fontSize: "10px", opacity: 0.6, marginBottom: "1px" }}>Dividendo/mes</p>
                    <p style={{ fontSize: "16px", fontWeight: 800 }}>{new Intl.NumberFormat("es-CL", { style: "currency", currency: "CLP", minimumFractionDigits: 0 }).format(payload.monthlyPayment)}</p>
                  </div>
                  <div>
                    <p style={{ fontSize: "10px", opacity: 0.6, marginBottom: "1px" }}>{payload.savings > 0 ? "Ahorras comprando" : "Arriendo más barato"}</p>
                    <p style={{ fontSize: "16px", fontWeight: 800 }}>{new Intl.NumberFormat("es-CL", { style: "currency", currency: "CLP", minimumFractionDigits: 0 }).format(Math.abs(payload.savings))}</p>
                  </div>
                </div>
              </div>

              <h2 id="modal-title" style={{ fontSize: "20px", fontWeight: 800, color: "var(--text-primary)", marginBottom: "4px", letterSpacing: "-0.02em" }}>
                Recibe este análisis en tu email
              </h2>
              <p style={{ fontSize: "14px", color: "var(--text-secondary)", lineHeight: 1.6, marginBottom: "16px" }}>
                <strong style={{ color: "var(--accent)" }}>100% gratis</strong> — Recibes un <strong>PDF profesional</strong> + <strong>modelo Excel</strong> con amortización, comparación año a año y análisis de sensibilidad.
              </p>

              {/* Email input */}
              <label htmlFor="email-input" style={{ display: "block", fontSize: "12px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--text-secondary)", marginBottom: "6px" }}>
                Tu email
              </label>
              <input
                ref={inputRef}
                id="email-input"
                type="email"
                value={email}
                onChange={(e) => { setEmail(e.target.value); setErrorMsg(""); }}
                placeholder="tu@email.com"
                style={{
                  ...inputStyle,
                  borderColor: errorMsg ? "#dc2626" : "var(--border)",
                  boxShadow: errorMsg ? "0 0 0 3px rgba(220,38,38,0.1)" : "none",
                  marginBottom: errorMsg ? "6px" : "20px",
                }}
                onFocus={(e) => {
                  if (!errorMsg) {
                    e.currentTarget.style.borderColor = "var(--accent)";
                    e.currentTarget.style.boxShadow = "0 0 0 3px rgba(13,148,136,0.1)";
                  }
                }}
                onBlur={(e) => {
                  if (!errorMsg) {
                    e.currentTarget.style.borderColor = "var(--border)";
                    e.currentTarget.style.boxShadow = "none";
                  }
                }}
                required
                aria-describedby={errorMsg ? "email-error" : undefined}
              />
              {errorMsg && (
                <p id="email-error" role="alert" style={{ fontSize: "12px", color: "#dc2626", marginBottom: "16px", marginTop: 0 }}>
                  {errorMsg}
                </p>
              )}

              {/* Broker opt-in */}
              <label
                htmlFor="broker-optin"
                style={{
                  display: "flex", alignItems: "flex-start", gap: "10px",
                  marginBottom: wantsBroker ? "12px" : "20px", cursor: "pointer",
                  background: wantsBroker ? "var(--accent-light)" : "var(--bg-secondary)",
                  border: wantsBroker ? "1.5px solid var(--accent)" : "1.5px solid var(--border)",
                  borderRadius: "10px", padding: "12px 14px",
                  transition: "all 0.15s",
                }}
              >
                <input
                  id="broker-optin"
                  type="checkbox"
                  checked={wantsBroker}
                  onChange={(e) => setWantsBroker(e.target.checked)}
                  style={{ marginTop: "2px", accentColor: "var(--accent)", width: "16px", height: "16px", flexShrink: 0 }}
                />
                <div>
                  <p style={{ margin: 0, fontSize: "13px", fontWeight: 700, color: "var(--text-primary)", lineHeight: 1.4 }}>
                    Quiero que un ejecutivo hipotecario me contacte
                  </p>
                  <p style={{ margin: "2px 0 0", fontSize: "12px", color: "var(--text-muted)", lineHeight: 1.4 }}>
                    Sin compromiso · Sin costo · Te ayudan a evaluar el crédito
                  </p>
                </div>
              </label>

              {/* Broker qualification fields — only shown when opted in */}
              {wantsBroker && (
                <div style={{
                  background: "var(--bg-secondary)", borderRadius: "10px",
                  padding: "14px", marginBottom: "20px",
                  display: "flex", flexDirection: "column", gap: "10px",
                  border: "1px solid var(--border)",
                }}>
                  <p style={{ fontSize: "11px", fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.04em", marginBottom: "2px" }}>
                    Para que el ejecutivo te ayude mejor (opcional)
                  </p>

                  {/* Name + Phone row */}
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Tu nombre"
                      style={{ ...inputStyle, fontSize: "14px", padding: "10px 12px" }}
                    />
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="Teléfono (opcional)"
                      style={{ ...inputStyle, fontSize: "14px", padding: "10px 12px" }}
                    />
                  </div>

                  {/* Income range */}
                  <select
                    value={incomeRange}
                    onChange={(e) => setIncomeRange(e.target.value)}
                    style={{ ...inputStyle, fontSize: "14px", padding: "10px 12px", cursor: "pointer", color: incomeRange ? "var(--text-primary)" : "var(--text-muted)" }}
                  >
                    <option value="">Ingreso mensual líquido (opcional)</option>
                    <option value="<1M">Menos de $1.000.000</option>
                    <option value="1M-2M">$1.000.000 — $2.000.000</option>
                    <option value="2M-3M">$2.000.000 — $3.000.000</option>
                    <option value="3M-5M">$3.000.000 — $5.000.000</option>
                    <option value="5M+">Más de $5.000.000</option>
                  </select>

                  {/* Pie availability */}
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
                    {([
                      { v: "si" as const, label: "✅ Tengo el pie disponible" },
                      { v: "no" as const, label: "⏳ Aún estoy juntando" },
                    ]).map((opt) => (
                      <button
                        key={opt.v}
                        type="button"
                        onClick={() => setHasPie(opt.v)}
                        style={{
                          padding: "8px 10px",
                          border: hasPie === opt.v ? "1.5px solid var(--accent)" : "1px solid var(--border)",
                          borderRadius: "8px",
                          background: hasPie === opt.v ? "var(--accent-light)" : "white",
                          cursor: "pointer",
                          fontSize: "12px",
                          fontWeight: hasPie === opt.v ? 700 : 500,
                          color: "var(--text-primary)",
                          textAlign: "center",
                          transition: "all 0.15s",
                        }}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={status === "loading"}
                style={{
                  width: "100%",
                  background: status === "loading" ? "var(--text-muted)" : "var(--accent)",
                  color: "white", border: "none", borderRadius: "10px",
                  padding: "13px 24px", fontSize: "15px", fontWeight: 700,
                  cursor: status === "loading" ? "wait" : "pointer",
                  transition: "background 0.15s",
                  display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
                }}
              >
                {status === "loading" ? (
                  <>
                    <span style={{ width: "16px", height: "16px", border: "2px solid rgba(255,255,255,0.3)", borderTop: "2px solid white", borderRadius: "50%", animation: "spin 0.7s linear infinite", display: "inline-block" }} />
                    Generando y enviando…
                  </>
                ) : (
                  "Enviar mi informe gratis →"
                )}
              </button>
              <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>

              {status === "error" && (
                <p role="alert" style={{ marginTop: "12px", fontSize: "13px", color: "#dc2626", textAlign: "center" }}>
                  {errorMsg || "Error al enviar. Intenta de nuevo."}
                </p>
              )}

              <p style={{ marginTop: "14px", fontSize: "11px", color: "var(--text-muted)", textAlign: "center", lineHeight: 1.5 }}>
                Sin spam. Usamos tu email solo para enviarte este análisis.
              </p>
            </form>
          )}

        </div>
      </div>
    </>
  );
}
