"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const cities = [
  { value: "santiago", label: "Santiago" },
  { value: "valparaiso", label: "Valparaíso" },
  { value: "concepcion", label: "Concepción" },
];

const propertyTypes = [
  { value: "departamento", label: "Departamento" },
  { value: "casa", label: "Casa" },
];

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "10px 14px",
  fontSize: "16px",
  border: "1px solid var(--border)",
  borderRadius: "8px",
  background: "white",
  color: "var(--text-primary)",
  outline: "none",
  transition: "border-color 0.15s ease, box-shadow 0.15s ease",
  appearance: "none",
  WebkitAppearance: "none",
};

const labelStyle: React.CSSProperties = {
  display: "block",
  fontSize: "13px",
  fontWeight: 600,
  color: "var(--text-secondary)",
  marginBottom: "6px",
  textTransform: "uppercase",
  letterSpacing: "0.04em",
};

export default function BuscarPage() {
  const router = useRouter();
  const [budget, setBudget] = useState("");
  const [currency, setCurrency] = useState<"CLP" | "UF">("CLP");
  const [city, setCity] = useState("santiago");
  const [propertyType, setPropertyType] = useState("departamento");
  const [rooms, setRooms] = useState("");
  const [baths, setBaths] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    const params = new URLSearchParams({
      budget,
      currency,
      city,
      propertyType,
      ...(rooms && { rooms }),
      ...(baths && { baths }),
    });
    router.push(`/propiedades?${params.toString()}`);
    setIsLoading(false);
  };

  const handleFocus = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) => {
    e.currentTarget.style.borderColor = "var(--accent)";
    e.currentTarget.style.boxShadow = "0 0 0 3px rgba(13,148,136,0.1)";
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) => {
    e.currentTarget.style.borderColor = "var(--border)";
    e.currentTarget.style.boxShadow = "none";
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "var(--bg-primary)",
        padding: "64px 24px",
      }}
    >
      <div style={{ maxWidth: "560px", margin: "0 auto" }}>

        {/* Header */}
        <header style={{ marginBottom: "40px" }}>
          <a
            href="/"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              fontSize: "13px",
              color: "var(--text-muted)",
              marginBottom: "24px",
            }}
          >
            ← Volver al inicio
          </a>
          <h1
            style={{
              fontSize: "clamp(26px, 4vw, 34px)",
              fontWeight: 800,
              letterSpacing: "-0.03em",
              color: "var(--text-primary)",
              marginBottom: "8px",
            }}
          >
            Buscar propiedades
          </h1>
          <p style={{ fontSize: "16px", color: "var(--text-secondary)", lineHeight: 1.6 }}>
            Ingresa tu presupuesto y preferencias para encontrar propiedades con análisis hipotecario incluido.
          </p>
        </header>

        <form
          onSubmit={handleSubmit}
          aria-label="Formulario de búsqueda de propiedades"
          noValidate
          style={{ display: "flex", flexDirection: "column", gap: "24px" }}
        >

          {/* ── Budget ─────────────────────────────────────────── */}
          <fieldset
            style={{
              border: "1px solid var(--border)",
              borderRadius: "12px",
              padding: "24px",
              background: "white",
            }}
          >
            <legend
              style={{
                fontSize: "15px",
                fontWeight: 700,
                color: "var(--text-primary)",
                letterSpacing: "-0.01em",
                padding: "0 4px",
              }}
            >
              Tu presupuesto
            </legend>

            <div style={{ marginTop: "20px" }}>
              <label htmlFor="budget-amount" style={labelStyle}>
                Monto disponible <span aria-label="obligatorio">*</span>
              </label>
              <div style={{ display: "flex", gap: "8px" }}>
                <input
                  id="budget-amount"
                  type="number"
                  value={budget}
                  onChange={(e) => setBudget(e.target.value)}
                  placeholder={currency === "CLP" ? "Ej: 100000000" : "Ej: 3000"}
                  required
                  aria-required="true"
                  aria-describedby="budget-hint"
                  min="1"
                  style={{ ...inputStyle, flex: 1 }}
                  onFocus={handleFocus}
                  onBlur={handleBlur}
                />
                <select
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value as "CLP" | "UF")}
                  aria-label="Moneda del presupuesto"
                  style={{ ...inputStyle, width: "80px", cursor: "pointer" }}
                  onFocus={handleFocus}
                  onBlur={handleBlur}
                >
                  <option value="CLP">CLP</option>
                  <option value="UF">UF</option>
                </select>
              </div>
              <p
                id="budget-hint"
                style={{ fontSize: "13px", color: "var(--text-muted)", marginTop: "6px" }}
              >
                {currency === "CLP"
                  ? "En pesos chilenos. Ej: 100000000 = $100 millones (~2.700 UF)."
                  : "En UF. Ej: 3000 UF ≈ $110 millones CLP."}
              </p>
            </div>
          </fieldset>

          {/* ── Preferences ────────────────────────────────────── */}
          <fieldset
            style={{
              border: "1px solid var(--border)",
              borderRadius: "12px",
              padding: "24px",
              background: "white",
            }}
          >
            <legend
              style={{
                fontSize: "15px",
                fontWeight: 700,
                color: "var(--text-primary)",
                letterSpacing: "-0.01em",
                padding: "0 4px",
              }}
            >
              Preferencias
            </legend>

            <div style={{ marginTop: "20px", display: "flex", flexDirection: "column", gap: "16px" }}>

              {/* City */}
              <div>
                <label htmlFor="city-select" style={labelStyle}>
                  Ciudad <span aria-label="obligatorio">*</span>
                </label>
                <select
                  id="city-select"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  required
                  aria-required="true"
                  style={{ ...inputStyle, cursor: "pointer" }}
                  onFocus={handleFocus}
                  onBlur={handleBlur}
                >
                  {cities.map((c) => (
                    <option key={c.value} value={c.value}>{c.label}</option>
                  ))}
                </select>
              </div>

              {/* Property type */}
              <div>
                <label htmlFor="type-select" style={labelStyle}>
                  Tipo de propiedad <span aria-label="obligatorio">*</span>
                </label>
                <select
                  id="type-select"
                  value={propertyType}
                  onChange={(e) => setPropertyType(e.target.value)}
                  required
                  aria-required="true"
                  style={{ ...inputStyle, cursor: "pointer" }}
                  onFocus={handleFocus}
                  onBlur={handleBlur}
                >
                  {propertyTypes.map((pt) => (
                    <option key={pt.value} value={pt.value}>{pt.label}</option>
                  ))}
                </select>
              </div>

              {/* Rooms + Baths */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                <div>
                  <label htmlFor="rooms-input" style={labelStyle}>
                    Dormitorios (mín.)
                  </label>
                  <input
                    id="rooms-input"
                    type="number"
                    value={rooms}
                    onChange={(e) => setRooms(e.target.value)}
                    placeholder="Ej: 2"
                    min="1"
                    max="10"
                    style={inputStyle}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                  />
                </div>
                <div>
                  <label htmlFor="baths-input" style={labelStyle}>
                    Baños (mín.)
                  </label>
                  <input
                    id="baths-input"
                    type="number"
                    value={baths}
                    onChange={(e) => setBaths(e.target.value)}
                    placeholder="Ej: 1"
                    min="1"
                    max="5"
                    style={inputStyle}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                  />
                </div>
              </div>

            </div>
          </fieldset>

          {/* Submit */}
          <button
            type="submit"
            disabled={isLoading || !budget}
            className="btn-primary"
            style={{
              width: "100%",
              padding: "14px 24px",
              fontSize: "15px",
              borderRadius: "9px",
              justifyContent: "center",
            }}
            aria-busy={isLoading}
          >
            {isLoading ? "Buscando…" : "Ver propiedades disponibles →"}
          </button>

          <p style={{ textAlign: "center", fontSize: "13px", color: "var(--text-muted)" }}>
            Los campos con{" "}
            <span aria-hidden="true">*</span>
            <span className="sr-only">asterisco</span>
            {" "}son obligatorios. Búsqueda 100% gratuita y anónima.
          </p>

        </form>
      </div>
    </div>
  );
}
