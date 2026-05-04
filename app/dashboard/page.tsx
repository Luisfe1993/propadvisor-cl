"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useUser } from "@clerk/nextjs";
import type { SavedProperty } from "@/lib/db";

function formatCLP(v: number): string {
  return new Intl.NumberFormat("es-CL", { style: "currency", currency: "CLP", minimumFractionDigits: 0 }).format(v);
}

export default function DashboardPage() {
  const { user } = useUser();
  const [properties, setProperties] = useState<SavedProperty[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/portfolio")
      .then((r) => r.json())
      .then((d) => { setProperties(d.properties || []); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("¿Eliminar esta propiedad del portfolio?")) return;
    setDeleting(id);
    try {
      await fetch(`/api/portfolio?id=${id}`, { method: "DELETE" });
      setProperties((prev) => prev.filter((p) => p.id !== id));
    } catch {}
    setDeleting(null);
  };

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
            {properties.length > 0
              ? `Tienes ${properties.length} propiedad${properties.length > 1 ? "es" : ""} guardada${properties.length > 1 ? "s" : ""}.`
              : "Analiza propiedades y guárdalas aquí para construir tu portfolio."}
          </p>
        </header>

        {loading ? (
          <div style={{ textAlign: "center", padding: "64px 0" }}>
            <p style={{ color: "var(--text-muted)" }}>Cargando portfolio...</p>
          </div>
        ) : properties.length === 0 ? (
          /* Empty state */
          <div style={{
            border: "2px dashed var(--border)", borderRadius: "16px",
            padding: "64px 32px", textAlign: "center", background: "white",
          }}>
            <div style={{ fontSize: "48px", marginBottom: "16px" }}>🏗️</div>
            <h2 style={{ fontSize: "20px", fontWeight: 800, color: "var(--text-primary)", marginBottom: "8px", letterSpacing: "-0.02em" }}>
              Tu portfolio está vacío
            </h2>
            <p style={{ fontSize: "15px", color: "var(--text-secondary)", lineHeight: 1.6, maxWidth: "400px", margin: "0 auto 24px" }}>
              Analiza tu primera propiedad y haz clic en &ldquo;Guardar&rdquo; para agregarla a tu portfolio.
            </p>
            <Link href="/calcular" className="btn-primary" style={{ padding: "12px 28px", fontSize: "15px" }}>
              Analizar una propiedad →
            </Link>
          </div>
        ) : (
          /* Property cards */
          <>
            {/* Portfolio summary */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: "12px", marginBottom: "24px" }}>
              {[
                { label: "Propiedades", value: properties.length.toString() },
                { label: "Inversión total (UF)", value: `UF ${Math.round(properties.reduce((s, p) => s + Number(p.price_uf), 0)).toLocaleString("es-CL")}` },
                { label: "Mejor patrimonio", value: formatCLP(Math.max(...properties.map(p => Math.max(Number(p.buy_net_wealth), Number(p.rent_net_wealth), Number(p.invest_net_wealth))))) },
              ].map((s) => (
                <div key={s.label} style={{ background: "white", border: "1px solid var(--border)", borderRadius: "10px", padding: "16px" }}>
                  <p style={{ fontSize: "11px", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.04em", marginBottom: "4px" }}>{s.label}</p>
                  <p style={{ fontSize: "18px", fontWeight: 800, color: "var(--text-primary)", letterSpacing: "-0.02em" }}>{s.value}</p>
                </div>
              ))}
            </div>

            {/* Cards */}
            <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginBottom: "24px" }}>
              {properties.map((p) => {
                const winnerLabel = p.winner === "invest" ? "🏢 Inversión" : p.winner === "rent" ? "📈 Arriendo" : "🏠 Compra";
                const bestWealth = Math.max(Number(p.buy_net_wealth), Number(p.rent_net_wealth), Number(p.invest_net_wealth));
                return (
                  <div key={p.id} style={{
                    background: "white", border: "1px solid var(--border)", borderRadius: "12px",
                    padding: "20px", display: "flex", gap: "16px", flexWrap: "wrap", alignItems: "center",
                    cursor: "pointer", transition: "border-color 0.15s, box-shadow 0.15s",
                  }}
                  className="card"
                  onClick={() => window.location.href = `/dashboard/${p.id}`}
                  >
                    <div style={{ flex: 1, minWidth: "200px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px" }}>
                        <p style={{ fontSize: "15px", fontWeight: 700, color: "var(--text-primary)" }}>{p.label}</p>
                        <span style={{
                          fontSize: "10px", fontWeight: 700, padding: "2px 8px", borderRadius: "4px",
                          background: "var(--accent-light)", color: "var(--accent-dark)",
                        }}>
                          {winnerLabel}
                        </span>
                      </div>
                      <p style={{ fontSize: "12px", color: "var(--text-muted)" }}>
                        {p.city}{p.comuna ? ` · ${p.comuna}` : ""} · {p.property_type} · {p.bank_name} {Number(p.interest_rate).toFixed(2)}%
                      </p>
                    </div>

                    <div style={{ display: "flex", gap: "16px", flexWrap: "wrap", alignItems: "center" }}>
                      <div style={{ textAlign: "right" }}>
                        <p style={{ fontSize: "10px", color: "var(--text-muted)", marginBottom: "1px" }}>Dividendo</p>
                        <p style={{ fontSize: "14px", fontWeight: 700, color: "var(--accent)" }}>{formatCLP(Number(p.monthly_payment))}</p>
                      </div>
                      <div style={{ textAlign: "right" }}>
                        <p style={{ fontSize: "10px", color: "var(--text-muted)", marginBottom: "1px" }}>Patrimonio</p>
                        <p style={{ fontSize: "14px", fontWeight: 700, color: bestWealth >= 0 ? "#16a34a" : "#dc2626" }}>{formatCLP(bestWealth)}</p>
                      </div>
                      <div style={{ textAlign: "right" }}>
                        <p style={{ fontSize: "10px", color: "var(--text-muted)", marginBottom: "1px" }}>Cap rate</p>
                        <p style={{ fontSize: "14px", fontWeight: 700 }}>{Number(p.cap_rate).toFixed(1)}%</p>
                      </div>
                      <button
                        onClick={() => handleDelete(p.id)}
                        disabled={deleting === p.id}
                        style={{
                          padding: "6px 12px", fontSize: "12px", color: "#dc2626",
                          background: "none", border: "1px solid #fecaca", borderRadius: "6px",
                          cursor: "pointer",
                        }}
                      >
                        {deleting === p.id ? "..." : "✕"}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            <Link href="/calcular" className="btn-primary" style={{ display: "inline-block", padding: "12px 28px", fontSize: "14px" }}>
              + Agregar propiedad
            </Link>
          </>
        )}

        {/* Coming soon features */}
        <div style={{ marginTop: "40px" }}>
          <p style={{ fontSize: "13px", fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "16px" }}>
            Próximamente en Pro
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "12px" }}>
            {[
              { icon: "🔍", title: "Comparar Propiedades", desc: "Lado a lado con IRR, DSCR, cap rate" },
              { icon: "📄", title: "Memorándum PDF", desc: "Informe profesional para socios y bancos" },
              { icon: "🧮", title: "Modelar Vacancia", desc: "Impacto de 0-20% vacancia en tu flujo" },
              { icon: "💰", title: "Calculadora de Impuestos", desc: "Contribuciones, renta, DFL2" },
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
