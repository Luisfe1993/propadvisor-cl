"use client";

import Link from "next/link";
import { useUser } from "@clerk/nextjs";

export default function DashboardPage() {
  const { user } = useUser();

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg-primary)" }}>
      <div style={{ maxWidth: "960px", margin: "0 auto", padding: "48px 24px" }}>

        {/* Header */}
        <header style={{ marginBottom: "40px" }}>
          <p style={{ fontSize: "12px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--accent)", marginBottom: "6px" }}>
            Portfolio de inversión
          </p>
          <h1 style={{ fontSize: "clamp(26px, 4vw, 34px)", fontWeight: 800, letterSpacing: "-0.03em", color: "var(--text-primary)", marginBottom: "6px" }}>
            Hola, {user?.firstName || "Inversor"} 👋
          </h1>
          <p style={{ fontSize: "16px", color: "var(--text-secondary)", lineHeight: 1.6 }}>
            Aquí podrás guardar propiedades, comparar inversiones y exportar memorándums profesionales.
          </p>
        </header>

        {/* Empty state */}
        <div style={{
          border: "2px dashed var(--border)", borderRadius: "16px",
          padding: "64px 32px", textAlign: "center",
          background: "white",
        }}>
          <div style={{ fontSize: "48px", marginBottom: "16px" }}>🏗️</div>
          <h2 style={{ fontSize: "20px", fontWeight: 800, color: "var(--text-primary)", marginBottom: "8px", letterSpacing: "-0.02em" }}>
            Tu portfolio está vacío
          </h2>
          <p style={{ fontSize: "15px", color: "var(--text-secondary)", lineHeight: 1.6, maxWidth: "400px", margin: "0 auto 24px" }}>
            Analiza tu primera propiedad y guárdala aquí para construir tu portfolio de inversión.
          </p>
          <Link
            href="/calcular"
            className="btn-primary"
            style={{ padding: "12px 28px", fontSize: "15px" }}
          >
            Analizar una propiedad →
          </Link>
        </div>

        {/* Coming soon features */}
        <div style={{ marginTop: "40px" }}>
          <p style={{ fontSize: "13px", fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "16px" }}>
            Próximamente en Pro
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "12px" }}>
            {[
              { icon: "📊", title: "Portfolio Dashboard", desc: "Inversión total, cash flow, rendimiento" },
              { icon: "🔍", title: "Comparar Propiedades", desc: "Lado a lado con IRR, DSCR, cap rate" },
              { icon: "📄", title: "Memorándum PDF", desc: "Informe profesional para socios y bancos" },
              { icon: "🧮", title: "Modelar Vacancia", desc: "Impacto de 0-20% vacancia en tu flujo" },
              { icon: "💰", title: "Calculadora de Impuestos", desc: "Contribuciones, renta, DFL2" },
              { icon: "📈", title: "IRR a 20 Años", desc: "Rentabilidad real de tu inversión" },
            ].map((f) => (
              <div key={f.title} style={{
                border: "1px solid var(--border)", borderRadius: "10px",
                padding: "16px", background: "var(--bg-secondary)",
              }}>
                <p style={{ fontSize: "20px", marginBottom: "8px" }}>{f.icon}</p>
                <p style={{ fontSize: "13px", fontWeight: 700, color: "var(--text-primary)", marginBottom: "4px" }}>{f.title}</p>
                <p style={{ fontSize: "12px", color: "var(--text-muted)" }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
