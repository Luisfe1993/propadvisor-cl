"use client";

import { useState, useEffect, useCallback } from "react";
import { useUser } from "@clerk/nextjs";
import { track } from "@vercel/analytics";

interface Lead {
  id: string;
  created_at: string;
  score: number;
  tier: "hot" | "warm" | "cold";
  email: string;
  name: string | null;
  phone: string | null;
  income_range: string | null;
  has_pie_available: boolean;
  has_pre_approval: boolean;
  city: string;
  comuna: string;
  property_type: string;
  price_uf: number;
  price_clp: number;
  bank_name: string | null;
  interest_rate: number | null;
  monthly_payment: number | null;
  address: string | null;
  status: string;
  contacted_at: string | null;
}

const tierConfig = {
  hot:  { emoji: "🔥", label: "CALIENTE", color: "#dc2626", bg: "#fef2f2" },
  warm: { emoji: "🟡", label: "TIBIO",    color: "#d97706", bg: "#fffbeb" },
  cold: { emoji: "🔵", label: "FRÍO",     color: "#2563eb", bg: "#eff6ff" },
};

const statusConfig: Record<string, { label: string; color: string }> = {
  new:       { label: "Nuevo",      color: "#6b7280" },
  viewed:    { label: "Visto",      color: "#2563eb" },
  contacted: { label: "Contactado", color: "#d97706" },
  converted: { label: "Convertido", color: "#16a34a" },
  rejected:  { label: "Descartado", color: "#dc2626" },
};

function formatCLP(v: number): string {
  return new Intl.NumberFormat("es-CL", { style: "currency", currency: "CLP", minimumFractionDigits: 0 }).format(v);
}

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `hace ${mins} min`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `hace ${hours}h`;
  const days = Math.floor(hours / 24);
  return `hace ${days}d`;
}

export default function BrokerDashboardPage() {
  const { user, isLoaded } = useUser();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filterTier, setFilterTier] = useState<string>("all");
  const [filterCity, setFilterCity] = useState<string>("all");
  const [totalLeads, setTotalLeads] = useState(0);
  const [hotCount, setHotCount] = useState(0);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const fetchLeads = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (filterTier !== "all") params.set("tier", filterTier);
    if (filterCity !== "all") params.set("city", filterCity);
    try {
      const res = await fetch(`/api/broker/leads?${params}`);
      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Error al cargar leads");
        setLeads([]);
        return;
      }
      const data = await res.json();
      setLeads(data.leads || []);
      setTotalLeads(data.total || 0);
      setHotCount(data.hotCount || 0);
      setError(null);
    } catch {
      setError("Error de conexión");
    } finally {
      setLoading(false);
    }
  }, [filterTier, filterCity]);

  useEffect(() => { if (isLoaded && user) fetchLeads(); }, [isLoaded, user, fetchLeads]);

  const updateStatus = async (leadId: string, status: string) => {
    try {
      const res = await fetch("/api/broker/leads", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: leadId, status }),
      });
      if (res.ok) {
        track("broker_lead_status", { status });
        setLeads(prev => prev.map(l => l.id === leadId ? { ...l, status } : l));
      }
    } catch { /* ignore */ }
  };

  if (!isLoaded) return null;
  if (!user) return <div style={{ padding: 64, textAlign: "center" }}>Debes iniciar sesión</div>;

  const cardSx: React.CSSProperties = { background: "white", border: "1px solid var(--border)", borderRadius: "12px", padding: "20px 24px" };

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg-primary)" }}>
      <div style={{ maxWidth: "960px", margin: "0 auto", padding: "48px 24px 96px" }}>

        {/* Header */}
        <div style={{ marginBottom: "32px" }}>
          <h1 style={{ fontSize: "28px", fontWeight: 800, letterSpacing: "-0.03em", color: "var(--text-primary)", marginBottom: "4px" }}>
            Panel de Leads
          </h1>
          <p style={{ fontSize: "14px", color: "var(--text-secondary)" }}>
            Leads de PropAdvisor para tu zona. Contacta rápido — los leads calientes cierran en 48h.
          </p>
        </div>

        {/* Stats */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "12px", marginBottom: "24px" }}>
          <div style={cardSx}>
            <p style={{ fontSize: "11px", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.04em", marginBottom: "4px" }}>Total leads</p>
            <p style={{ fontSize: "28px", fontWeight: 800, color: "var(--text-primary)" }}>{totalLeads}</p>
          </div>
          <div style={cardSx}>
            <p style={{ fontSize: "11px", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.04em", marginBottom: "4px" }}>🔥 Calientes</p>
            <p style={{ fontSize: "28px", fontWeight: 800, color: "#dc2626" }}>{hotCount}</p>
          </div>
          <div style={cardSx}>
            <p style={{ fontSize: "11px", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.04em", marginBottom: "4px" }}>Conversión</p>
            <p style={{ fontSize: "28px", fontWeight: 800, color: "var(--accent)" }}>
              {totalLeads > 0 ? `${Math.round((leads.filter(l => l.status === "converted").length / leads.length) * 100)}%` : "—"}
            </p>
          </div>
        </div>

        {/* Filters */}
        <div style={{ display: "flex", gap: "8px", marginBottom: "20px", flexWrap: "wrap" }}>
          {[
            { value: "all", label: "Todos" },
            { value: "hot", label: "🔥 Calientes" },
            { value: "warm", label: "🟡 Tibios" },
            { value: "cold", label: "🔵 Fríos" },
          ].map(f => (
            <button key={f.value} onClick={() => setFilterTier(f.value)}
              style={{
                padding: "7px 14px", fontSize: "13px", fontWeight: 600,
                border: "1px solid var(--border)", borderRadius: "8px",
                background: filterTier === f.value ? "var(--accent)" : "white",
                color: filterTier === f.value ? "white" : "var(--text-primary)",
                cursor: "pointer",
              }}
            >{f.label}</button>
          ))}
          <select value={filterCity} onChange={e => setFilterCity(e.target.value)}
            style={{ padding: "7px 14px", fontSize: "13px", border: "1px solid var(--border)", borderRadius: "8px", background: "white", cursor: "pointer" }}
          >
            <option value="all">Todas las ciudades</option>
            <option value="santiago">Santiago</option>
            <option value="valparaiso">Valparaíso</option>
            <option value="concepcion">Concepción</option>
          </select>
        </div>

        {/* Error state */}
        {error && (
          <div style={{ ...cardSx, borderColor: "#fecaca", background: "#fef2f2", marginBottom: "16px" }}>
            <p style={{ fontSize: "14px", color: "#dc2626" }}>{error}</p>
            <p style={{ fontSize: "12px", color: "#9ca3af", marginTop: "4px" }}>
              Si crees que esto es un error, contacta a soporte en luisfsande@hotmail.com.
            </p>
          </div>
        )}

        {/* Loading */}
        {loading && <p style={{ textAlign: "center", color: "var(--text-muted)", padding: "32px" }}>Cargando leads...</p>}

        {/* Lead list */}
        {!loading && leads.length === 0 && !error && (
          <div style={{ ...cardSx, textAlign: "center", padding: "48px" }}>
            <p style={{ fontSize: "32px", marginBottom: "8px" }}>📭</p>
            <p style={{ fontSize: "15px", fontWeight: 600, color: "var(--text-primary)" }}>Sin leads todavía</p>
            <p style={{ fontSize: "13px", color: "var(--text-secondary)" }}>Los leads aparecerán aquí cuando usuarios soliciten contacto con un corredor.</p>
          </div>
        )}

        {!loading && leads.length > 0 && (
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {leads.map(lead => {
              const tier = tierConfig[lead.tier] || tierConfig.cold;
              const stat = statusConfig[lead.status] || statusConfig.new;
              const expanded = expandedId === lead.id;

              return (
                <div key={lead.id} style={{ ...cardSx, borderLeft: `4px solid ${tier.color}`, cursor: "pointer" }}
                  onClick={() => {
                    setExpandedId(expanded ? null : lead.id);
                    if (lead.status === "new") updateStatus(lead.id, "viewed");
                  }}
                >
                  {/* Summary row */}
                  <div style={{ display: "flex", alignItems: "center", gap: "12px", flexWrap: "wrap" }}>
                    <span style={{ fontSize: "11px", fontWeight: 700, color: tier.color, background: tier.bg, padding: "3px 8px", borderRadius: "6px" }}>
                      {tier.emoji} {lead.score}/10
                    </span>
                    <span style={{ fontSize: "14px", fontWeight: 700, color: "var(--text-primary)", flex: 1 }}>
                      {lead.name || lead.email}
                    </span>
                    <span style={{ fontSize: "12px", color: stat.color, fontWeight: 600 }}>{stat.label}</span>
                    <span style={{ fontSize: "12px", color: "var(--text-muted)" }}>{timeAgo(lead.created_at)}</span>
                  </div>

                  {/* Quick info */}
                  <div style={{ display: "flex", gap: "16px", marginTop: "8px", fontSize: "12px", color: "var(--text-secondary)", flexWrap: "wrap" }}>
                    <span>📍 {lead.comuna || lead.city}</span>
                    <span>💰 UF {Math.round(lead.price_uf).toLocaleString("es-CL")}</span>
                    {lead.phone && <span>📱 Tiene teléfono</span>}
                    {lead.has_pre_approval && <span>✅ Pre-aprobado</span>}
                  </div>

                  {/* Expanded detail */}
                  {expanded && (
                    <div style={{ marginTop: "16px", paddingTop: "16px", borderTop: "1px solid var(--border)" }}>
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", fontSize: "13px", marginBottom: "16px" }}>
                        <div><span style={{ color: "var(--text-muted)" }}>Email:</span> <strong>{lead.email}</strong></div>
                        {lead.phone && <div><span style={{ color: "var(--text-muted)" }}>Teléfono:</span> <strong>{lead.phone}</strong></div>}
                        {lead.income_range && <div><span style={{ color: "var(--text-muted)" }}>Ingreso:</span> <strong>{lead.income_range}</strong></div>}
                        <div><span style={{ color: "var(--text-muted)" }}>Pie:</span> <strong>{lead.has_pie_available ? "✅ Disponible" : "⏳ Juntando"}</strong></div>
                        {lead.address && <div><span style={{ color: "var(--text-muted)" }}>Propiedad:</span> <strong>{lead.address}</strong></div>}
                        <div><span style={{ color: "var(--text-muted)" }}>Precio:</span> <strong>{formatCLP(lead.price_clp)}</strong></div>
                        {lead.bank_name && <div><span style={{ color: "var(--text-muted)" }}>Banco:</span> <strong>{lead.bank_name} {lead.interest_rate ? `(${Number(lead.interest_rate).toFixed(2)}%)` : ""}</strong></div>}
                        {lead.monthly_payment && <div><span style={{ color: "var(--text-muted)" }}>Dividendo:</span> <strong>{formatCLP(Number(lead.monthly_payment))}</strong></div>}
                      </div>

                      {/* Actions */}
                      <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                        {lead.phone && (
                          <a
                            href={`https://wa.me/${lead.phone.replace(/\D/g, "")}?text=${encodeURIComponent(`Hola${lead.name ? ` ${lead.name}` : ""}, soy corredor asociado a PropAdvisor. Vi que estás evaluando una propiedad${lead.address ? ` en ${lead.address}` : ""}. ¿Te gustaría que revisemos las opciones?`)}`}
                            target="_blank" rel="noopener"
                            onClick={(e) => { e.stopPropagation(); updateStatus(lead.id, "contacted"); }}
                            style={{ display: "inline-flex", alignItems: "center", gap: "6px", padding: "8px 16px", background: "#25D366", color: "white", borderRadius: "8px", fontSize: "13px", fontWeight: 700, textDecoration: "none" }}
                          >
                            📱 WhatsApp
                          </a>
                        )}
                        <a
                          href={`mailto:${lead.email}?subject=PropAdvisor — Asesoría hipotecaria&body=${encodeURIComponent(`Hola${lead.name ? ` ${lead.name}` : ""},\n\nSoy corredor asociado a PropAdvisor. Vi que estás evaluando una propiedad${lead.address ? ` en ${lead.address}` : ""} y me gustaría ayudarte con el proceso.\n\n¿Tienes unos minutos para conversar?\n\nSaludos`)}`}
                          onClick={(e) => { e.stopPropagation(); updateStatus(lead.id, "contacted"); }}
                          style={{ display: "inline-flex", alignItems: "center", gap: "6px", padding: "8px 16px", background: "#1E3A5F", color: "white", borderRadius: "8px", fontSize: "13px", fontWeight: 700, textDecoration: "none" }}
                        >
                          ✉️ Email
                        </a>
                        <button
                          onClick={(e) => { e.stopPropagation(); updateStatus(lead.id, "converted"); }}
                          style={{ padding: "8px 16px", background: "#f0fdf4", color: "#16a34a", border: "1px solid #bbf7d0", borderRadius: "8px", fontSize: "13px", fontWeight: 700, cursor: "pointer" }}
                        >
                          ✅ Convertido
                        </button>
                        <button
                          onClick={(e) => { e.stopPropagation(); updateStatus(lead.id, "rejected"); }}
                          style={{ padding: "8px 16px", background: "#fef2f2", color: "#dc2626", border: "1px solid #fecaca", borderRadius: "8px", fontSize: "13px", fontWeight: 700, cursor: "pointer" }}
                        >
                          ✕ Descartar
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
