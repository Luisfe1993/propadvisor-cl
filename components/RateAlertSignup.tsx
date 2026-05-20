"use client";

import { useState } from "react";
import { track } from "@vercel/analytics";

export default function RateAlertSignup() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = email.trim().toLowerCase();
    if (!trimmed || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) return;

    setStatus("loading");
    try {
      const res = await fetch("/api/rate-alert", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: trimmed }),
      });
      if (!res.ok) throw new Error();
      setStatus("success");
      track("rate_alert_signup", { source: "homepage" });
    } catch {
      setStatus("error");
    }
  };

  if (status === "success") {
    return (
      <div style={{
        maxWidth: "520px", margin: "0 auto",
        background: "var(--accent-light)", border: "1px solid var(--accent)",
        borderRadius: "12px", padding: "16px 20px",
        textAlign: "center",
      }}>
        <p style={{ fontSize: "14px", fontWeight: 700, color: "var(--accent-dark)" }}>
          ✅ ¡Listo! Te avisaremos cuando bajen las tasas.
        </p>
      </div>
    );
  }

  return (
    <div style={{
      maxWidth: "520px", margin: "0 auto",
      background: "white", border: "1px solid var(--border)",
      borderRadius: "12px", padding: "20px",
    }}>
      <p style={{
        fontSize: "14px", fontWeight: 700, color: "var(--text-primary)",
        marginBottom: "4px", textAlign: "center",
      }}>
        📉 ¿Esperando que bajen las tasas?
      </p>
      <p style={{
        fontSize: "13px", color: "var(--text-secondary)",
        marginBottom: "12px", textAlign: "center",
      }}>
        Te avisamos cuando las tasas hipotecarias bajen. Sin spam, solo datos.
      </p>
      <form onSubmit={handleSubmit} style={{ display: "flex", gap: "8px" }}>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="tu@email.com"
          required
          style={{
            flex: 1, padding: "10px 14px", fontSize: "15px",
            border: "1.5px solid var(--border)", borderRadius: "8px",
            outline: "none", background: "white", color: "var(--text-primary)",
          }}
          onFocus={(e) => { e.currentTarget.style.borderColor = "var(--accent)"; }}
          onBlur={(e) => { e.currentTarget.style.borderColor = "var(--border)"; }}
        />
        <button
          type="submit"
          disabled={status === "loading"}
          style={{
            padding: "10px 20px", fontSize: "14px", fontWeight: 700,
            background: status === "loading" ? "var(--text-muted)" : "var(--accent)",
            color: "white", border: "none", borderRadius: "8px",
            cursor: status === "loading" ? "wait" : "pointer",
            whiteSpace: "nowrap",
          }}
        >
          {status === "loading" ? "..." : "Avisarme →"}
        </button>
      </form>
      {status === "error" && (
        <p style={{ fontSize: "12px", color: "#dc2626", textAlign: "center", marginTop: "8px" }}>
          Error al registrar. Intenta de nuevo.
        </p>
      )}
      <p style={{ fontSize: "11px", color: "var(--text-muted)", textAlign: "center", marginTop: "8px" }}>
        Sin spam · Solo cuando haya cambios importantes
      </p>
    </div>
  );
}
