"use client";

import Link from "next/link";

/*
 * Minimal guide — plain semantic HTML, no JS, no floating UI.
 * All layout via a single wrapper style. Content is just headings,
 * paragraphs, lists, and two tables.
 */

const W: React.CSSProperties = {
  maxWidth: 660,
  margin: "0 auto",
  padding: "0 24px",
};

const sectionGap: React.CSSProperties = {
  marginTop: 80,
};

const sectionGapLg: React.CSSProperties = {
  marginTop: 96,
};

/* ── Reusable small pieces ─────────────────────────────── */
function SectionTitle({ id, children }: { id: string; children: React.ReactNode }) {
  return (
    <h2
      id={id}
      style={{
        fontSize: 22,
        fontWeight: 700,
        color: "var(--text-primary)",
        lineHeight: 1.3,
        marginBottom: 20,
        scrollMarginTop: 80,
      }}
    >
      {children}
    </h2>
  );
}

function Text({ children }: { children: React.ReactNode }) {
  return (
    <p
      style={{
        fontSize: 16,
        lineHeight: 1.85,
        color: "var(--text-secondary)",
        marginBottom: 20,
      }}
    >
      {children}
    </p>
  );
}

function Strong({ children }: { children: React.ReactNode }) {
  return <strong style={{ color: "var(--text-primary)", fontWeight: 600 }}>{children}</strong>;
}

function Divider() {
  return <hr style={{ border: "none", borderTop: "1px solid var(--border)", margin: "56px 0" }} />;
}

function ActionLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <p style={{ marginTop: 28 }}>
      <Link
        href={href}
        style={{
          color: "var(--accent)",
          fontWeight: 600,
          fontSize: 15,
          textDecoration: "none",
        }}
      >
        {children} →
      </Link>
    </p>
  );
}

function Note({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        background: "var(--bg-secondary)",
        border: "1px solid var(--border)",
        borderRadius: 10,
        padding: "16px 20px",
        fontSize: 14,
        lineHeight: 1.7,
        color: "var(--text-secondary)",
        margin: "28px 0",
      }}
    >
      {children}
    </div>
  );
}

/* ── Table of contents ─────────────────────────────────── */
function TOC() {
  const items = [
    { id: "credito-hipotecario", label: "Crédito hipotecario" },
    { id: "que-es-uf", label: "Qué es la UF" },
    { id: "pie", label: "El pie" },
    { id: "comparar-bancos", label: "Comparar bancos" },
    { id: "comprar-vs-arrendar", label: "Comprar vs arrendar" },
    { id: "inversion", label: "Inversión" },
    { id: "comunas", label: "Comunas" },
    { id: "proceso", label: "Proceso de compra" },
  ];

  return (
    <nav style={{ margin: "40px 0 64px" }}>
      <p style={{ fontSize: 13, fontWeight: 600, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 12 }}>
        Contenido
      </p>
      <ol style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 8 }}>
        {items.map((item, i) => (
          <li key={item.id}>
            <a
              href={`#${item.id}`}
              style={{
                color: "var(--text-secondary)",
                textDecoration: "none",
                fontSize: 15,
                lineHeight: 1.5,
              }}
            >
              <span style={{ color: "var(--text-muted)", marginRight: 8, fontVariantNumeric: "tabular-nums" }}>{i + 1}.</span>
              {item.label}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}

/* ── Simple table component ────────────────────────────── */
function SimpleTable({ headers, rows, highlight }: {
  headers: string[];
  rows: string[][];
  highlight?: number;
}) {
  return (
    <div style={{ margin: "28px 0", overflowX: "auto", WebkitOverflowScrolling: "touch" }}>
      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          fontSize: 14,
          lineHeight: 1.6,
          minWidth: 440,
        }}
      >
        <thead>
          <tr>
            {headers.map((h, i) => (
              <th
                key={i}
                style={{
                  textAlign: i === 0 ? "left" : "right",
                  padding: "10px 12px",
                  borderBottom: "2px solid var(--border)",
                  fontSize: 12,
                  fontWeight: 600,
                  color: "var(--text-muted)",
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                }}
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, ri) => (
            <tr
              key={ri}
              style={{
                background: ri === highlight ? "var(--bg-secondary)" : undefined,
              }}
            >
              {row.map((cell, ci) => (
                <td
                  key={ci}
                  style={{
                    textAlign: ci === 0 ? "left" : "right",
                    padding: "10px 12px",
                    borderBottom: "1px solid var(--border)",
                    color: ci === 0 ? "var(--text-primary)" : "var(--text-secondary)",
                    fontWeight: ci === 0 ? 500 : 400,
                  }}
                >
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   MAIN CONTENT
   ═══════════════════════════════════════════════════════════ */
export function GuiaSections() {
  return (
    <div style={W}>

      <TOC />

      {/* ────────────────────────────────────────────── */}
      <section style={sectionGap}>
        <SectionTitle id="credito-hipotecario">1. ¿Cómo funciona el crédito hipotecario?</SectionTitle>

        <Text>
          Un crédito hipotecario es un préstamo a <Strong>15 a 30 años</Strong> donde la propiedad queda como garantía. El banco financia entre el 70% y el 90% del valor. Tú pones el resto como &quot;pie&quot;.
        </Text>

        <Text>
          Los créditos se expresan en <Strong>UF</Strong> (Unidad de Fomento), así que tu deuda está indexada a la inflación. Si la inflación es 4%, tu deuda en pesos sube 4% aunque estés al día con los pagos.
        </Text>

        <Text>
          El dividendo mensual se compone de cuatro partes:
        </Text>

        <ul style={{ margin: "0 0 20px", padding: "0 0 0 20px", color: "var(--text-secondary)", fontSize: 15, lineHeight: 2 }}>
          <li><Strong>Capital:</Strong> lo que reduces de la deuda (~$192K/mes)</li>
          <li><Strong>Intereses:</Strong> el costo del préstamo (~$168K/mes)</li>
          <li><Strong>Seguro de desgravamen:</Strong> te cubre si no puedes pagar (~$48K/mes)</li>
          <li><Strong>Seguro de incendio:</Strong> obligatorio (~$32K/mes)</li>
        </ul>

        <Note>
          <Strong>Ejemplo:</Strong> Depto en Ñuñoa, UF 2.600 (~$95M CLP). Pie 20% = $19M. Crédito: $76M. Tasa 4.5% a 20 años → dividendo ~$480K/mes + seguros = <Strong>~$540K–$560K/mes total</Strong>.
        </Note>

        <ActionLink href="/calcular">Calcula tu dividendo real</ActionLink>
      </section>

      <Divider />

      {/* ────────────────────────────────────────────── */}
      <section style={sectionGap}>
        <SectionTitle id="que-es-uf">2. ¿Qué es la UF y cómo afecta tu dividendo?</SectionTitle>

        <Text>
          La <Strong>Unidad de Fomento</Strong> se actualiza diariamente según el IPC. En 2026 vale ~$37.000 CLP. Ha subido consistentemente: $15K en 2000, $21K en 2010, $29K en 2020, $37K hoy.
        </Text>

        <Text>
          Si pides 2.000 UF hoy, el año siguiente serán ~$76–78M CLP dependiendo de la inflación. Tu deuda en pesos <em style={{ color: "var(--text-primary)", fontStyle: "italic" }}>nunca baja</em> mientras haya inflación.
        </Text>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, margin: "28px 0" }}>
          <div style={{ padding: "16px 20px", borderRadius: 10, border: "1px solid #a7f3d0", background: "#ecfdf5" }}>
            <p style={{ fontSize: 14, fontWeight: 600, color: "#047857", marginBottom: 6 }}>✓ Ventaja</p>
            <p style={{ fontSize: 14, color: "var(--text-secondary)", lineHeight: 1.6, margin: 0 }}>
              El dividendo en UF es fijo. Como los arriendos también suben con la inflación, la carga relativa se mantiene.
            </p>
          </div>
          <div style={{ padding: "16px 20px", borderRadius: 10, border: "1px solid #fde68a", background: "#fffbeb" }}>
            <p style={{ fontSize: 14, fontWeight: 600, color: "#b45309", marginBottom: 6 }}>⚠ Riesgo</p>
            <p style={{ fontSize: 14, color: "var(--text-secondary)", lineHeight: 1.6, margin: 0 }}>
              Si hay inflación alta (como 2022 con 12.8%), tu deuda en CLP sube fuerte aunque pagues al día.
            </p>
          </div>
        </div>
      </section>

      <Divider />

      {/* ────────────────────────────────────────────── */}
      <section style={sectionGap}>
        <SectionTitle id="pie">3. El pie: cuánto necesitas y de dónde sacarlo</SectionTitle>

        <Text>
          El banco financia hasta el 90% de una primera vivienda. El pie óptimo es <Strong>20%–25%</Strong>: reduce tu dividendo y te da mejores condiciones de crédito.
        </Text>

        <SimpleTable
          headers={["Pie", "Monto", "Dividendo aprox.", "Nota"]}
          rows={[
            ["10%", "$9.5M", "$540K/mes", "Solo 1ra vivienda"],
            ["20%", "$19M", "$480K/mes", "Mejores tasas"],
            ["30%", "$28.5M", "$420K/mes", "Obligatorio para 2da"],
          ]}
          highlight={1}
        />

        <p style={{ fontSize: 13, color: "var(--text-muted)", marginBottom: 20, textAlign: "center" }}>
          Basado en propiedad de UF 2.600 (~$95M) · Tasa 4.5% · 20 años
        </p>

        <Note>
          <Strong>¿De dónde sacar el pie?</Strong> Ahorros propios, bono MINVU/DS1 (hasta 3.600 UF de subsidio), Cuenta 2 de AFP, o apoyo familiar. No puedes usar el crédito hipotecario para financiar el pie.
        </Note>

        <ActionLink href="/calcular">Simula con tu pie</ActionLink>
      </section>

      <Divider />

      {/* ────────────────────────────────────────────── */}
      <section style={sectionGap}>
        <SectionTitle id="comparar-bancos">4. Cómo comparar bancos</SectionTitle>

        <Text>
          Los 8 bancos principales tienen diferencias de tasa de 0.3%–0.5%, que representan <Strong>más de $10 millones CLP</Strong> en intereses totales a 20 años. No existe un &quot;mejor banco&quot; universal — depende de tu perfil.
        </Text>

        <SimpleTable
          headers={["Banco", "Tasa 20 años", "Destaca en"]}
          rows={[
            ["BancoEstado", "4.2–4.8%", "Primera vivienda"],
            ["Santander", "4.3–5.0%", "Promociones"],
            ["BCI", "4.5–5.2%", "Flexibilidad"],
            ["Banco de Chile", "4.4–5.1%", "Pre-aprobación rápida"],
            ["Scotiabank", "4.3–5.0%", "Pie alto"],
            ["Itaú", "4.5–5.3%", "Renta alta"],
            ["Security", "4.6–5.4%", "Nicho premium"],
            ["BICE", "4.5–5.2%", "Competitivo en UF"],
          ]}
        />

        <Note>
          <Strong>Impacto real:</Strong> La diferencia entre 4.5% y 5.0% en un crédito de $80M a 20 años es ~$5.000/mes en el dividendo y más de <Strong>$10 millones CLP</Strong> en intereses totales.
        </Note>

        <Text>
          Además de la tasa, compara el CAE (Costo Anual Equivalente), los seguros asociados, el costo de tasación, y los cargos por prepago anticipado.
        </Text>

        <ActionLink href="/calcular">Compara tasas de 8 bancos</ActionLink>
      </section>

      <Divider />

      {/* ────────────────────────────────────────────── */}
      <section style={sectionGap}>
        <SectionTitle id="comprar-vs-arrendar">5. ¿Comprar o arrendar?</SectionTitle>

        <Text>
          No hay respuesta universal. Depende de tu horizonte de tiempo, situación financiera, y condiciones del mercado local.
        </Text>

        <Text>
          <Strong>Comprar conviene cuando:</Strong>
        </Text>
        <ul style={{ margin: "0 0 24px", padding: "0 0 0 20px", color: "var(--text-secondary)", fontSize: 15, lineHeight: 2.1 }}>
          <li>Planeas vivir 8–10+ años en el mismo lugar</li>
          <li>Tienes pie de 20%+ sin comprometer tu liquidez</li>
          <li>El dividendo es ≤ 30% de tus ingresos</li>
          <li>Quieres acumular patrimonio a largo plazo</li>
          <li>Tu ingreso es estable y predecible</li>
        </ul>

        <Text>
          <Strong>Arrendar conviene cuando:</Strong>
        </Text>
        <ul style={{ margin: "0 0 24px", padding: "0 0 0 20px", color: "var(--text-secondary)", fontSize: 15, lineHeight: 2.1 }}>
          <li>Puedes mudarte en los próximos 3–5 años</li>
          <li>No tienes pie o necesitas mantener liquidez</li>
          <li>El dividendo superaría el 35% de tus ingresos</li>
          <li>El mercado tiene alta volatilidad</li>
          <li>Prefieres flexibilidad sobre patrimonio</li>
        </ul>

        <Note>
          <Strong>Regla del precio/arriendo:</Strong> Si el precio es más de 200× el arriendo mensual (más de 16.7 años de arriendo), arrendar e invertir el pie puede ser más conveniente. PropAdvisor calcula esto automáticamente.
        </Note>

        <ActionLink href="/calcular">¿Qué te conviene más? Calcula aquí</ActionLink>
      </section>

      <Divider />

      {/* ────────────────────────────────────────────── */}
      <section style={sectionGap}>
        <SectionTitle id="inversion">6. Comprar para arrendar: rentabilidad real</SectionTitle>

        <Text>
          La <Strong>rentabilidad bruta</Strong> en Santiago oscila entre 4% y 6.5%. La <Strong>rentabilidad neta</Strong> es menor: hay que descontar contribuciones, gastos comunes, administración, vacancia (~8%) y mantenciones.
        </Text>

        <ul style={{ margin: "0 0 24px", padding: "0 0 0 20px", color: "var(--text-secondary)", fontSize: 15, lineHeight: 2.1 }}>
          <li>Rentabilidad bruta: <Strong>4–6.5%</Strong></li>
          <li>Rentabilidad neta: <Strong>2.5–4.5%</Strong></li>
          <li>Vacancia promedio: <Strong>~8%</Strong></li>
          <li>Plusvalía histórica: <Strong>4–9% anual</Strong></li>
        </ul>

        <Note>
          <Strong>Ejemplo:</Strong> Depto en Ñuñoa, UF 2.600 ($95M CLP). Arriendo: $365K/mes. Rent. bruta: <Strong>4.6%</Strong>. Rent. neta: 3.0–3.5%. Compara con depósitos a plazo (4–5% sin riesgo en 2025-2026).
        </Note>

        <ActionLink href="/calcular">Analiza tu inversión</ActionLink>
      </section>

      <Divider />

      {/* ────────────────────────────────────────────── */}
      <section style={sectionGap}>
        <SectionTitle id="comunas">7. Mejores comunas para invertir en Santiago</SectionTitle>

        <Text>
          No existe una &quot;mejor comuna&quot; universal. Depende de si buscas rentabilidad, plusvalía, o equilibrio entre ambas.
        </Text>

        <SimpleTable
          headers={["Comuna", "Cap rate", "Plusvalía", "Precio"]}
          rows={[
            ["Providencia / Las Condes", "3.5–4.5%", "Alta", "3K–6K UF"],
            ["Ñuñoa / Macul", "4–5.5%", "Media-Alta", "2K–3.5K UF"],
            ["Santiago Centro", "5–6.5%", "Media", "1.2K–2.5K UF"],
            ["Vitacura", "3–3.5%", "Muy alta", "5K–12K UF"],
            ["Peñalolén / La Reina", "4–5.5%", "Media-Alta", "2K–3.2K UF"],
          ]}
          highlight={1}
        />
      </section>

      <Divider />

      {/* ────────────────────────────────────────────── */}
      <section style={sectionGap}>
        <SectionTitle id="proceso">8. Proceso de compra paso a paso</SectionTitle>

        <Text>
          De la simulación a las llaves en <Strong>2 a 4 meses</Strong>. Estos son los pasos clave:
        </Text>

        <ol style={{ margin: "0 0 24px", padding: "0 0 0 20px", color: "var(--text-secondary)", fontSize: 15, lineHeight: 1.8, listStyleType: "none", counterReset: "steps" }}>
          {[
            { title: "Simula tu presupuesto", time: "1–2 semanas", desc: "Calcula cuánto puedes pagar. Dividendo máximo = 30% de tu ingreso neto." },
            { title: "Pre-aprobación del crédito", time: "2–4 semanas", desc: "Solicita pre-aprobación a 2–3 bancos. Así conoces tu capacidad real." },
            { title: "Busca y elige propiedad", time: "2–8 semanas", desc: "Portal Inmobiliario, Yapo, Toctoc. Visita al menos 5–8 propiedades." },
            { title: "Promesa de compraventa", time: "~1 semana", desc: "Firma ante notario. Pagas 1–5% del precio como garantía." },
            { title: "Tasación y estudio de títulos", time: "2–3 semanas", desc: "El banco tasa la propiedad y revisa que no tenga problemas legales." },
            { title: "Escritura e inscripción", time: "4–8 semanas", desc: "Firma ante notario, inscripción en el Conservador. Eres dueño." },
          ].map((step, i) => (
            <li key={i} style={{ marginBottom: 24, paddingLeft: 4 }}>
              <p style={{ margin: "0 0 4px", fontSize: 16, fontWeight: 600, color: "var(--text-primary)" }}>
                <span style={{ color: "var(--accent)", marginRight: 8 }}>{i + 1}.</span>
                {step.title}
                <span style={{ fontSize: 13, fontWeight: 400, color: "var(--text-muted)", marginLeft: 10 }}>
                  {step.time}
                </span>
              </p>
              <p style={{ margin: 0, fontSize: 15, lineHeight: 1.7, color: "var(--text-secondary)" }}>
                {step.desc}
              </p>
            </li>
          ))}
        </ol>

        <ActionLink href="/calcular">Empieza: simula tu crédito</ActionLink>
      </section>

      {/* Bottom space */}
      <div style={{ height: 80 }} />
    </div>
  );
}

