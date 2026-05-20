import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Para Brokers — PropAdvisor CL",
  robots: { index: false, follow: false }, // Unlisted page
};

export default function BrokerInfoPage() {
  return (
    <div style={{ minHeight: "100vh", background: "var(--bg-primary)" }}>
      <div style={{ maxWidth: "800px", margin: "0 auto", padding: "64px 24px" }}>

        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "48px" }}>
          <p style={{
            fontSize: "12px", fontWeight: 700, textTransform: "uppercase",
            letterSpacing: "0.08em", color: "var(--accent)", marginBottom: "12px",
          }}>
            Oportunidad para corredores hipotecarios
          </p>
          <h1 style={{
            fontSize: "clamp(28px, 5vw, 42px)", fontWeight: 800,
            letterSpacing: "-0.04em", color: "var(--text-primary)",
            marginBottom: "16px", lineHeight: 1.1,
          }}>
            Leads pre-calificados de compradores reales
          </h1>
          <p style={{
            fontSize: "18px", color: "var(--text-secondary)",
            maxWidth: "560px", margin: "0 auto", lineHeight: 1.6,
          }}>
            PropAdvisor captura compradores que ya analizaron una propiedad específica, definieron su presupuesto y pidieron ser contactados. Los leads más calificados del mercado inmobiliario chileno.
          </p>
        </div>

        {/* Value proposition */}
        <div style={{
          display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: "16px", marginBottom: "48px",
        }}>
          {[
            { icon: "🎯", title: "Alta intención", desc: "El usuario ya eligió propiedad, banco y pie. No es un lead frío — está listo para cotizar." },
            { icon: "📊", title: "Pre-calificados", desc: "Cada lead incluye: ingreso, pre-aprobación, pie disponible y score de calidad (0-10)." },
            { icon: "📱", title: "Contacto directo", desc: "Teléfono + email + WhatsApp link. El lead pidió explícitamente ser contactado." },
            { icon: "🔥", title: "Entrega inmediata", desc: "Leads HOT (score ≥6) entregados por email en tiempo real con toda la información." },
          ].map((v) => (
            <div key={v.title} style={{
              background: "white", border: "1px solid var(--border)",
              borderRadius: "12px", padding: "20px",
            }}>
              <p style={{ fontSize: "28px", marginBottom: "12px" }}>{v.icon}</p>
              <p style={{ fontSize: "15px", fontWeight: 700, color: "var(--text-primary)", marginBottom: "6px" }}>{v.title}</p>
              <p style={{ fontSize: "13px", color: "var(--text-secondary)", lineHeight: 1.6 }}>{v.desc}</p>
            </div>
          ))}
        </div>

        {/* Sample lead */}
        <div style={{ marginBottom: "48px" }}>
          <h2 style={{
            fontSize: "20px", fontWeight: 800, color: "var(--text-primary)",
            marginBottom: "16px", letterSpacing: "-0.02em",
          }}>
            Ejemplo de lead que recibirías
          </h2>
          <div style={{
            background: "white", border: "1px solid var(--border)",
            borderRadius: "12px", overflow: "hidden",
          }}>
            {/* Lead header */}
            <div style={{
              background: "linear-gradient(135deg, #0f766e 0%, #1e3a5f 100%)",
              padding: "16px 20px", color: "white",
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <span style={{ fontSize: "20px" }}>🔥</span>
                <div>
                  <p style={{ fontSize: "14px", fontWeight: 700, margin: 0 }}>Lead HOT — Score 8/10</p>
                  <p style={{ fontSize: "12px", opacity: 0.8, margin: "2px 0 0" }}>Recibido hace 3 minutos</p>
                </div>
              </div>
            </div>

            {/* Lead details */}
            <div style={{ padding: "20px" }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "16px" }}>
                {[
                  { label: "Nombre", value: "María González" },
                  { label: "Email", value: "maria.g****@gmail.com" },
                  { label: "Teléfono", value: "+56 9 **** 4521" },
                  { label: "Ingreso mensual", value: "$3M — $5M" },
                  { label: "Pre-aprobación", value: "✅ Sí" },
                  { label: "Pie disponible", value: "✅ Sí" },
                ].map((f) => (
                  <div key={f.label}>
                    <p style={{ fontSize: "11px", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.04em", marginBottom: "2px" }}>{f.label}</p>
                    <p style={{ fontSize: "14px", fontWeight: 600, color: "var(--text-primary)" }}>{f.value}</p>
                  </div>
                ))}
              </div>

              <div style={{ borderTop: "1px solid var(--border)", paddingTop: "12px" }}>
                <p style={{ fontSize: "11px", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.04em", marginBottom: "8px" }}>Propiedad analizada</p>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "8px" }}>
                  {[
                    { label: "Ubicación", value: "Ñuñoa, Santiago" },
                    { label: "Precio", value: "UF 3,200 ($118M)" },
                    { label: "Tipo", value: "Departamento" },
                    { label: "Banco elegido", value: "Santander" },
                    { label: "Tasa", value: "3.43%" },
                    { label: "Pie", value: "20% ($23.6M)" },
                    { label: "Dividendo", value: "$548.000/mes" },
                    { label: "Plazo", value: "20 años" },
                    { label: "Deuda/Ingreso", value: "18.2% 🟢" },
                  ].map((f) => (
                    <div key={f.label}>
                      <p style={{ fontSize: "10px", color: "var(--text-muted)", marginBottom: "1px" }}>{f.label}</p>
                      <p style={{ fontSize: "12px", fontWeight: 600, color: "var(--text-primary)" }}>{f.value}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* WhatsApp link preview */}
            <div style={{
              background: "#dcfce7", padding: "12px 20px",
              borderTop: "1px solid #bbf7d0",
              display: "flex", alignItems: "center", gap: "10px",
            }}>
              <span style={{ fontSize: "20px" }}>📱</span>
              <div>
                <p style={{ fontSize: "13px", fontWeight: 700, color: "#15803d", margin: 0 }}>WhatsApp directo incluido</p>
                <p style={{ fontSize: "12px", color: "#166534", margin: "2px 0 0" }}>Link listo para contactar al lead con un clic</p>
              </div>
            </div>
          </div>
        </div>

        {/* Lead scoring explanation */}
        <div style={{ marginBottom: "48px" }}>
          <h2 style={{
            fontSize: "20px", fontWeight: 800, color: "var(--text-primary)",
            marginBottom: "16px", letterSpacing: "-0.02em",
          }}>
            Cómo calificamos cada lead
          </h2>
          <div style={{
            background: "white", border: "1px solid var(--border)",
            borderRadius: "12px", padding: "20px",
          }}>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              {[
                { points: "+3", criteria: "Tiene pre-aprobación bancaria", color: "#16a34a" },
                { points: "+2", criteria: "Proporcionó teléfono", color: "#16a34a" },
                { points: "+2", criteria: "Ingreso $3M-$5M+ mensual", color: "#16a34a" },
                { points: "+1", criteria: "Pidió contacto con ejecutivo", color: "#0d9488" },
                { points: "+1", criteria: "Tiene pie disponible", color: "#0d9488" },
                { points: "+1", criteria: "Comuna premium (Providencia, Las Condes, etc.)", color: "#0d9488" },
              ].map((s) => (
                <div key={s.criteria} style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                  <span style={{
                    fontSize: "13px", fontWeight: 800, color: s.color,
                    minWidth: "32px", textAlign: "right",
                  }}>{s.points}</span>
                  <span style={{ fontSize: "14px", color: "var(--text-primary)" }}>{s.criteria}</span>
                </div>
              ))}
            </div>
            <div style={{
              marginTop: "16px", paddingTop: "16px",
              borderTop: "1px solid var(--border)",
              display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "12px",
            }}>
              {[
                { tier: "🔥 HOT", score: "Score ≥ 6", desc: "Listo para cotizar" },
                { tier: "🟡 WARM", score: "Score 3-5", desc: "Interesado, necesita nurturing" },
                { tier: "🔵 COLD", score: "Score < 3", desc: "Explorando opciones" },
              ].map((t) => (
                <div key={t.tier} style={{ textAlign: "center" }}>
                  <p style={{ fontSize: "16px", fontWeight: 700, margin: "0 0 4px" }}>{t.tier}</p>
                  <p style={{ fontSize: "12px", color: "var(--text-muted)", margin: "0 0 2px" }}>{t.score}</p>
                  <p style={{ fontSize: "11px", color: "var(--text-secondary)" }}>{t.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Pricing */}
        <div style={{ marginBottom: "48px" }}>
          <h2 style={{
            fontSize: "20px", fontWeight: 800, color: "var(--text-primary)",
            marginBottom: "16px", letterSpacing: "-0.02em",
          }}>
            Prueba sin riesgo
          </h2>
          <div style={{
            background: "linear-gradient(135deg, #0f766e 0%, #1e3a5f 100%)",
            borderRadius: "12px", padding: "24px", color: "white",
          }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px" }}>
              <div>
                <p style={{ fontSize: "14px", fontWeight: 700, opacity: 0.9, marginBottom: "8px" }}>Oferta de lanzamiento</p>
                <p style={{ fontSize: "28px", fontWeight: 800, marginBottom: "4px" }}>30 leads gratis</p>
                <p style={{ fontSize: "14px", opacity: 0.8, lineHeight: 1.5 }}>
                  Prueba la calidad de los leads durante 2 semanas. Sin costo, sin compromiso.
                </p>
              </div>
              <div>
                <p style={{ fontSize: "14px", fontWeight: 700, opacity: 0.9, marginBottom: "8px" }}>Después del trial</p>
                <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span style={{ fontSize: "13px" }}>🔥 Lead HOT (score ≥ 6)</span>
                    <span style={{ fontSize: "13px", fontWeight: 700 }}>$25.000–$35.000</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span style={{ fontSize: "13px" }}>🟡 Lead WARM (score 3-5)</span>
                    <span style={{ fontSize: "13px", fontWeight: 700 }}>$10.000–$15.000</span>
                  </div>
                  <p style={{ fontSize: "11px", opacity: 0.7, marginTop: "4px" }}>
                    Solo pagas por leads que cumplan tu criterio mínimo
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div style={{
          textAlign: "center", padding: "32px",
          background: "white", border: "1px solid var(--border)",
          borderRadius: "12px",
        }}>
          <h2 style={{
            fontSize: "22px", fontWeight: 800, color: "var(--text-primary)",
            marginBottom: "12px", letterSpacing: "-0.02em",
          }}>
            ¿Quieres probar?
          </h2>
          <p style={{
            fontSize: "15px", color: "var(--text-secondary)",
            lineHeight: 1.6, marginBottom: "20px", maxWidth: "400px", margin: "0 auto 20px",
          }}>
            Envíanos un email con tu zona de cobertura y te activamos los 30 leads gratis esta semana.
          </p>
          <a
            href="mailto:contacto@propadvisor.site?subject=Quiero%20probar%20leads%20PropAdvisor&body=Hola%2C%20me%20interesa%20recibir%20leads%20pre-calificados.%0A%0AMi%20zona%20de%20cobertura%3A%20%0AMi%20nombre%3A%20%0AMi%20teléfono%3A%20"
            style={{
              display: "inline-block", background: "var(--accent)", color: "white",
              padding: "14px 32px", borderRadius: "10px",
              fontSize: "15px", fontWeight: 700, textDecoration: "none",
            }}
          >
            Solicitar 30 leads gratis →
          </a>
          <p style={{
            fontSize: "12px", color: "var(--text-muted)", marginTop: "12px",
          }}>
            Sin contrato · Sin costo · Cancela cuando quieras
          </p>
        </div>

      </div>
    </div>
  );
}
