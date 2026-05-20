"use client";

import { useState, useEffect, useCallback } from "react";
import { useUser } from "@clerk/nextjs";

interface Placement {
  id: string;
  created_at: string;
  developer_name: string;
  project_name: string;
  city: string;
  comuna: string;
  price_uf_from: number;
  price_uf_to: number;
  property_type: string;
  description: string;
  image_url: string;
  cta_url: string;
  impressions: number;
  clicks: number;
  is_active: boolean;
  expires_at: string | null;
}

function formatNum(v: number): string {
  return v.toLocaleString("es-CL");
}

// Admin user IDs — add your Clerk user ID here
const ADMIN_IDS = new Set([
  process.env.NEXT_PUBLIC_ADMIN_USER_ID || "",
]);

export default function AdminPlacementsPage() {
  const { user, isLoaded } = useUser();
  const [placements, setPlacements] = useState<Placement[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    developer_name: "", project_name: "", city: "santiago", comuna: "",
    price_uf_from: "", price_uf_to: "", property_type: "departamento",
    description: "", image_url: "", cta_url: "",
  });
  const [saving, setSaving] = useState(false);

  const fetchPlacements = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/placements");
      if (res.ok) {
        const data = await res.json();
        setPlacements(data.placements || []);
      }
    } catch { /* ignore */ }
    setLoading(false);
  }, []);

  useEffect(() => { if (isLoaded && user) fetchPlacements(); }, [isLoaded, user, fetchPlacements]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch("/api/admin/placements", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          price_uf_from: parseFloat(form.price_uf_from) || 0,
          price_uf_to: parseFloat(form.price_uf_to) || 0,
        }),
      });
      if (res.ok) {
        setShowForm(false);
        setForm({ developer_name: "", project_name: "", city: "santiago", comuna: "", price_uf_from: "", price_uf_to: "", property_type: "departamento", description: "", image_url: "", cta_url: "" });
        fetchPlacements();
      }
    } catch { /* ignore */ }
    setSaving(false);
  };

  const toggleActive = async (id: string, isActive: boolean) => {
    await fetch("/api/admin/placements", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, is_active: !isActive }),
    });
    fetchPlacements();
  };

  if (!isLoaded) return null;
  if (!user || !ADMIN_IDS.has(user.id)) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <p style={{ fontSize: "15px", color: "var(--text-secondary)" }}>Acceso restringido a administradores.</p>
      </div>
    );
  }

  const cardSx: React.CSSProperties = { background: "white", border: "1px solid var(--border)", borderRadius: "12px", padding: "20px 24px" };
  const inputSx: React.CSSProperties = { width: "100%", padding: "10px 14px", fontSize: "14px", border: "1px solid var(--border)", borderRadius: "8px", background: "white" };
  const labelSx: React.CSSProperties = { display: "block", fontSize: "12px", fontWeight: 700, color: "var(--text-secondary)", marginBottom: "4px", textTransform: "uppercase", letterSpacing: "0.04em" };

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg-primary)" }}>
      <div style={{ maxWidth: "960px", margin: "0 auto", padding: "48px 24px 96px" }}>

        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "32px" }}>
          <div>
            <h1 style={{ fontSize: "28px", fontWeight: 800, letterSpacing: "-0.03em", color: "var(--text-primary)" }}>
              Placements
            </h1>
            <p style={{ fontSize: "14px", color: "var(--text-secondary)" }}>Propiedades destacadas de desarrolladores</p>
          </div>
          <button onClick={() => setShowForm(!showForm)} style={{ padding: "10px 20px", fontSize: "13px", fontWeight: 700, background: "var(--accent)", color: "white", border: "none", borderRadius: "8px", cursor: "pointer" }}>
            {showForm ? "Cancelar" : "+ Nuevo placement"}
          </button>
        </div>

        {/* Create form */}
        {showForm && (
          <form onSubmit={handleSubmit} style={{ ...cardSx, marginBottom: "24px" }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
              <div>
                <label style={labelSx}>Desarrollador</label>
                <input style={inputSx} value={form.developer_name} onChange={e => setForm(f => ({ ...f, developer_name: e.target.value }))} required />
              </div>
              <div>
                <label style={labelSx}>Proyecto</label>
                <input style={inputSx} value={form.project_name} onChange={e => setForm(f => ({ ...f, project_name: e.target.value }))} required />
              </div>
              <div>
                <label style={labelSx}>Ciudad</label>
                <select style={inputSx} value={form.city} onChange={e => setForm(f => ({ ...f, city: e.target.value }))}>
                  <option value="santiago">Santiago</option>
                  <option value="valparaiso">Valparaíso</option>
                  <option value="concepcion">Concepción</option>
                </select>
              </div>
              <div>
                <label style={labelSx}>Comuna</label>
                <input style={inputSx} value={form.comuna} onChange={e => setForm(f => ({ ...f, comuna: e.target.value }))} />
              </div>
              <div>
                <label style={labelSx}>Precio desde (UF)</label>
                <input style={inputSx} type="number" value={form.price_uf_from} onChange={e => setForm(f => ({ ...f, price_uf_from: e.target.value }))} />
              </div>
              <div>
                <label style={labelSx}>Precio hasta (UF)</label>
                <input style={inputSx} type="number" value={form.price_uf_to} onChange={e => setForm(f => ({ ...f, price_uf_to: e.target.value }))} />
              </div>
              <div>
                <label style={labelSx}>Tipo</label>
                <select style={inputSx} value={form.property_type} onChange={e => setForm(f => ({ ...f, property_type: e.target.value }))}>
                  <option value="departamento">Departamento</option>
                  <option value="casa">Casa</option>
                </select>
              </div>
              <div>
                <label style={labelSx}>Imagen URL</label>
                <input style={inputSx} type="url" value={form.image_url} onChange={e => setForm(f => ({ ...f, image_url: e.target.value }))} />
              </div>
              <div style={{ gridColumn: "1 / -1" }}>
                <label style={labelSx}>Descripción</label>
                <textarea style={{ ...inputSx, minHeight: "60px", resize: "vertical" }} value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} />
              </div>
              <div style={{ gridColumn: "1 / -1" }}>
                <label style={labelSx}>URL de destino (CTA)</label>
                <input style={inputSx} type="url" value={form.cta_url} onChange={e => setForm(f => ({ ...f, cta_url: e.target.value }))} />
              </div>
            </div>
            <button type="submit" disabled={saving} style={{ marginTop: "16px", padding: "10px 24px", fontSize: "14px", fontWeight: 700, background: "var(--accent)", color: "white", border: "none", borderRadius: "8px", cursor: "pointer", opacity: saving ? 0.6 : 1 }}>
              {saving ? "Guardando..." : "Crear placement"}
            </button>
          </form>
        )}

        {/* Stats */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "12px", marginBottom: "24px" }}>
          <div style={cardSx}>
            <p style={{ fontSize: "11px", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.04em", marginBottom: "4px" }}>Activos</p>
            <p style={{ fontSize: "28px", fontWeight: 800, color: "var(--text-primary)" }}>{placements.filter(p => p.is_active).length}</p>
          </div>
          <div style={cardSx}>
            <p style={{ fontSize: "11px", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.04em", marginBottom: "4px" }}>Impresiones totales</p>
            <p style={{ fontSize: "28px", fontWeight: 800, color: "var(--accent)" }}>{formatNum(placements.reduce((s, p) => s + p.impressions, 0))}</p>
          </div>
          <div style={cardSx}>
            <p style={{ fontSize: "11px", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.04em", marginBottom: "4px" }}>Clicks totales</p>
            <p style={{ fontSize: "28px", fontWeight: 800, color: "#0284c7" }}>{formatNum(placements.reduce((s, p) => s + p.clicks, 0))}</p>
          </div>
        </div>

        {/* Placement list */}
        {loading && <p style={{ textAlign: "center", color: "var(--text-muted)", padding: "32px" }}>Cargando...</p>}

        {!loading && placements.length === 0 && (
          <div style={{ ...cardSx, textAlign: "center", padding: "48px" }}>
            <p style={{ fontSize: "32px", marginBottom: "8px" }}>📦</p>
            <p style={{ fontSize: "15px", fontWeight: 600 }}>Sin placements activos</p>
            <p style={{ fontSize: "13px", color: "var(--text-secondary)" }}>Crea un placement cuando un desarrollador firme contrato.</p>
          </div>
        )}

        {!loading && placements.length > 0 && (
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {placements.map(p => {
              const ctr = p.impressions > 0 ? ((p.clicks / p.impressions) * 100).toFixed(1) : "0.0";
              return (
                <div key={p.id} style={{ ...cardSx, opacity: p.is_active ? 1 : 0.5 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "8px" }}>
                    <span style={{ fontSize: "14px", fontWeight: 700, color: "var(--text-primary)", flex: 1 }}>
                      {p.project_name}
                    </span>
                    <span style={{ fontSize: "12px", color: "var(--text-muted)" }}>{p.developer_name}</span>
                    <button onClick={() => toggleActive(p.id, p.is_active)}
                      style={{ padding: "4px 12px", fontSize: "12px", fontWeight: 600, border: "1px solid var(--border)", borderRadius: "6px", background: p.is_active ? "#f0fdf4" : "#fef2f2", color: p.is_active ? "#16a34a" : "#dc2626", cursor: "pointer" }}
                    >
                      {p.is_active ? "Activo ✓" : "Inactivo"}
                    </button>
                  </div>
                  <div style={{ display: "flex", gap: "16px", fontSize: "12px", color: "var(--text-secondary)" }}>
                    <span>📍 {p.comuna || p.city}</span>
                    <span>💰 UF {formatNum(p.price_uf_from)}-{formatNum(p.price_uf_to)}</span>
                    <span>👁 {formatNum(p.impressions)} imp</span>
                    <span>🖱 {formatNum(p.clicks)} clicks</span>
                    <span>📊 CTR {ctr}%</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
