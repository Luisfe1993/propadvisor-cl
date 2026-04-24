"use client";

import { useState, useEffect, useRef } from "react";

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
  padding: "24px",
  backdropFilter: "blur(4px)",
  WebkitBackdropFilter: "blur(4px)",
};

const modal: React.CSSProperties = {
  background: "white",
  borderRadius: "16px",
  padding: "36px 32px 32px",
  width: "100%",
  maxWidth: "460px",
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
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

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
        body: JSON.stringify({ email: trimmed, ...payload }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Error al enviar");
      setStatus("success");
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
              <p style={{ fontSize: "13px", color: "var(--text-muted)", marginBottom: "28px", lineHeight: 1.5 }}>
                El Excel incluye tabla de amortización, comparación año a año y análisis de sensibilidad — todo modificable.
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
              <div style={iconWrap}>
                <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.75" aria-hidden="true">
                  <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" strokeLinecap="round" strokeLinejoin="round" />
                  <polyline points="14 2 14 8 20 8" strokeLinecap="round" strokeLinejoin="round" />
                  <line x1="12" y1="18" x2="12" y2="12" strokeLinecap="round" />
                  <line x1="9" y1="15" x2="15" y2="15" strokeLinecap="round" />
                </svg>
              </div>

              <h2 id="modal-title" style={{ fontSize: "20px", fontWeight: 800, color: "var(--text-primary)", marginBottom: "6px", letterSpacing: "-0.02em" }}>
                Recibe tu análisis completo
              </h2>
              <p style={{ fontSize: "14px", color: "var(--text-secondary)", lineHeight: 1.6, marginBottom: "8px" }}>
                Te enviamos gratis el <strong>informe PDF</strong> + el <strong>modelo Excel interactivo</strong> con 4 hojas:
              </p>

              {/* Files list */}
              <ul style={{ margin: "0 0 24px", padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: "8px" }}>
                {[
                  ["📄", "PDF profesional", "Para compartir con tu banco o corredor"],
                  ["📊", "Excel: Resumen + Amortización", "Dividendo mes a mes, capital vs interés"],
                  ["📈", "Excel: Comparación 20 años", "Costo total compra vs arriendo, año a año"],
                  ["🔍", "Excel: Sensibilidad", "Qué pasa si la apreciación o el arriendo cambian"],
                ].map(([icon, title, desc]) => (
                  <li key={title} style={{
                    display: "flex", gap: "10px", alignItems: "flex-start",
                    background: "var(--bg-secondary)", borderRadius: "8px", padding: "10px 12px",
                  }}>
                    <span style={{ fontSize: "16px", flexShrink: 0, marginTop: "1px" }}>{icon}</span>
                    <div>
                      <p style={{ margin: 0, fontSize: "13px", fontWeight: 700, color: "var(--text-primary)" }}>{title}</p>
                      <p style={{ margin: 0, fontSize: "12px", color: "var(--text-muted)" }}>{desc}</p>
                    </div>
                  </li>
                ))}
              </ul>

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
                  "Enviar análisis gratis →"
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
