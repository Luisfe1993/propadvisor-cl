"use client";

import { useState } from "react";
import { useUser } from "@clerk/nextjs";

interface UpgradeModalProps {
  onClose: () => void;
  feature?: string;
}

const overlay: React.CSSProperties = {
  position: "fixed", inset: 0, zIndex: 1000,
  background: "rgba(0,0,0,0.45)",
  display: "flex", alignItems: "center", justifyContent: "center",
  padding: "16px",
  backdropFilter: "blur(4px)",
  WebkitBackdropFilter: "blur(4px)",
};

const modal: React.CSSProperties = {
  background: "white",
  borderRadius: "16px",
  padding: "32px 28px 28px",
  width: "100%",
  maxWidth: "480px",
  boxShadow: "0 20px 60px rgba(0,0,0,0.18)",
  position: "relative",
  animation: "upgradeModalIn 0.18s ease-out",
};

const proFeatures = [
  "Guardar propiedades ilimitadas",
  "Comparar hasta 10 propiedades lado a lado",
  "IRR, DSCR, cash-on-cash por año",
  "Memorándum de inversión profesional (PDF)",
  "Modelar vacancia y gastos reales",
  "Calculadora de impuestos (DFL2)",
];

export default function UpgradeModal({ onClose, feature }: UpgradeModalProps) {
  const { isSignedIn } = useUser();
  const [loading, setLoading] = useState(false);

  const handleUpgrade = async () => {
    if (!isSignedIn) {
      window.location.href = "/sign-up?redirect_url=/pricing";
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/checkout", { method: "POST" });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
      else throw new Error(data.error);
    } catch {
      alert("Error al iniciar el checkout. Intenta de nuevo.");
    }
    setLoading(false);
  };

  return (
    <>
      <style>{`
        @keyframes upgradeModalIn {
          from { opacity: 0; transform: translateY(12px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>

      <div
        style={overlay}
        onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
        role="dialog"
        aria-modal="true"
        aria-labelledby="upgrade-title"
      >
        <div style={modal}>
          {/* Close */}
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

          {/* Badge */}
          <div style={{
            display: "inline-block",
            background: "var(--accent)", color: "white",
            fontSize: "11px", fontWeight: 700,
            padding: "4px 12px", borderRadius: "9999px",
            textTransform: "uppercase", letterSpacing: "0.05em",
            marginBottom: "16px",
          }}>
            Pro
          </div>

          <h2
            id="upgrade-title"
            style={{
              fontSize: "22px", fontWeight: 800,
              color: "var(--text-primary)",
              letterSpacing: "-0.02em",
              marginBottom: "8px",
              lineHeight: 1.2,
            }}
          >
            {feature
              ? `Desbloquea "${feature}" con Pro`
              : "Lleva tu análisis al siguiente nivel"}
          </h2>

          <p style={{
            fontSize: "15px", color: "var(--text-secondary)",
            lineHeight: 1.6, marginBottom: "20px",
          }}>
            Herramientas profesionales de inversión para tomar decisiones con confianza.
          </p>

          {/* Feature list */}
          <div style={{
            background: "var(--bg-secondary)",
            border: "1px solid var(--border)",
            borderRadius: "10px",
            padding: "14px 16px",
            marginBottom: "20px",
          }}>
            {proFeatures.map((f) => (
              <div key={f} style={{
                display: "flex", alignItems: "center", gap: "8px",
                padding: "6px 0",
              }}>
                <span style={{ color: "var(--accent)", fontSize: "14px", flexShrink: 0 }}>✓</span>
                <span style={{ fontSize: "13px", color: "var(--text-primary)" }}>{f}</span>
              </div>
            ))}
          </div>

          {/* Price */}
          <div style={{
            textAlign: "center", marginBottom: "16px",
          }}>
            <span style={{ fontSize: "32px", fontWeight: 800, color: "var(--text-primary)", letterSpacing: "-0.03em" }}>$15.000</span>
            <span style={{ fontSize: "15px", color: "var(--text-muted)", marginLeft: "4px" }}>/mes</span>
            <p style={{ fontSize: "12px", color: "var(--text-muted)", marginTop: "2px" }}>
              7 días gratis · Sin tarjeta para empezar · Cancela cuando quieras
            </p>
          </div>

          {/* CTA */}
          <button
            onClick={handleUpgrade}
            disabled={loading}
            style={{
              width: "100%",
              background: loading ? "var(--text-muted)" : "var(--accent)",
              color: "white", border: "none", borderRadius: "10px",
              padding: "14px 24px", fontSize: "15px", fontWeight: 700,
              cursor: loading ? "wait" : "pointer",
              transition: "background 0.15s",
            }}
          >
            {loading ? "Cargando..." : "Probar 7 días gratis →"}
          </button>

          <p style={{
            fontSize: "12px", color: "var(--text-muted)",
            textAlign: "center", marginTop: "12px",
          }}>
            <a href="/pricing" style={{ color: "var(--accent)", textDecoration: "none", fontWeight: 600 }}>
              Ver comparación completa →
            </a>
          </p>
        </div>
      </div>
    </>
  );
}
