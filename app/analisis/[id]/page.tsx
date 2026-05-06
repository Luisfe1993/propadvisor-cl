"use client";

import { useState, useEffect, use } from "react";
import Link from "next/link";
import { track } from "@vercel/analytics";
import { calcMonthlyPayment, calc20YearComparison } from "@/lib/calculations";
import type { Property, BankRate } from "@/lib/types";
import EmailGateModal from "@/components/EmailGateModal";
import type { AnalysisPayload } from "@/components/EmailGateModal";

export default function AnalisisPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [property, setProperty] = useState<Property | null>(null);
  const [banks, setBanks] = useState<BankRate[]>([]);
  const [ufValue, setUFValue] = useState<number>(36520);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showEmailModal, setShowEmailModal] = useState(false);

  const [mortgageData, setMortgageData] = useState({
    downPayment: 30,
    loanTerm: 20,
    selectedBankId: "bancoestado",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [propRes, ratesRes] = await Promise.all([
          fetch(`/api/propiedades?id=${id}`),
          fetch("/api/tasas"),
        ]);
        if (!propRes.ok) throw new Error("Propiedad no encontrada");
        const propData = await propRes.json();
        if (!propData.properties || propData.properties.length === 0) throw new Error("Propiedad no encontrada");
        setProperty(propData.properties[0]);
        setUFValue(propData.ufValue);
        if (ratesRes.ok) {
          const ratesData = await ratesRes.json();
          setBanks(ratesData.banks);
          if (ratesData.banks.length > 0) setMortgageData((prev) => ({ ...prev, selectedBankId: ratesData.banks[0].id }));
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error desconocido");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const selectedBank = banks.find((b) => b.id === mortgageData.selectedBankId) || banks[0];
  const interestRate = selectedBank?.rate || 4.19;
  const monthlyPayment = property ? calcMonthlyPayment(property.priceCLP * (1 - mortgageData.downPayment / 100), interestRate, mortgageData.loanTerm) : 0;
  const downPaymentAmount = property ? (property.priceCLP * mortgageData.downPayment) / 100 : 0;
  const comparison = property ? calc20YearComparison(monthlyPayment + 500000, property.estimatedMonthlyRentCLP, downPaymentAmount, property.priceCLP, mortgageData.loanTerm) : null;
  const netMonthlyFlow = property ? property.estimatedMonthlyRentCLP - monthlyPayment - 500000 : 0;

  const formatCLP = (v: number) => new Intl.NumberFormat("es-CL", { style: "currency", currency: "CLP", minimumFractionDigits: 0 }).format(v);
  const getCityLabel = (city: string) => ({ santiago: "Santiago", valparaiso: "Valparaíso", concepcion: "Concepción" }[city] || city);

  const buildPayload = (): AnalysisPayload | null => {
    if (!property || !comparison) return null;
    return {
      address: property.address,
      comuna: property.neighborhood || "",
      propertyType: property.type === "departamento" ? "Departamento" : "Casa",
      city: getCityLabel(property.city),
      rooms: property.rooms,
      baths: property.baths,
      priceCLP: property.priceCLP,
      priceUF: property.priceUF,
      ufValue,
      bankName: selectedBank?.bank || "",
      interestRate,
      downPaymentPct: mortgageData.downPayment,
      downPaymentCLP: downPaymentAmount,
      loanTermYears: mortgageData.loanTerm,
      monthlyPayment,
      buyTotal: comparison.buyTotal,
      rentTotal: comparison.rentTotal,
      rentMonthlyCLP: property.estimatedMonthlyRentCLP,
      netMonthlyFlow,
      rentalYield: property.estimatedMonthlyRentCLP > 0 ? (property.estimatedMonthlyRentCLP * 12) / property.priceCLP * 100 : 0,
      propertyValueAfter20Years: comparison.propertyValueAfter20Years,
      savings: comparison.savings,
      generatedAt: new Date().toLocaleDateString("es-CL", { day: "numeric", month: "long", year: "numeric" }),
    };
  };

  const propertyJsonLd = property ? JSON.stringify({
    "@context": "https://schema.org",
    "@type": "RealEstateListing",
    name: property.address,
    url: `https://www.propadvisor.site/analisis/${property.id}`,
    price: property.priceCLP,
    priceCurrency: "CLP",
    address: { "@type": "PostalAddress", streetAddress: property.address, addressLocality: property.neighborhood, addressRegion: getCityLabel(property.city), addressCountry: "CL" },
    numberOfRooms: property.rooms,
    numberOfBathroomsTotal: property.baths,
  }) : null;

  const inputSx: React.CSSProperties = {
    width: "100%", padding: "10px 14px", fontSize: "15px",
    border: "1px solid var(--border)", borderRadius: "8px",
    background: "white", color: "var(--text-primary)",
    outline: "none", transition: "border-color 0.15s, box-shadow 0.15s",
    appearance: "none", WebkitAppearance: "none",
  };
  const onFocus = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) => {
    e.currentTarget.style.borderColor = "var(--accent)";
    e.currentTarget.style.boxShadow = "0 0 0 3px rgba(13,148,136,0.1)";
  };
  const onBlur = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) => {
    e.currentTarget.style.borderColor = "var(--border)";
    e.currentTarget.style.boxShadow = "none";
  };

  // ── Loading ─────────────────────────────────────────────
  if (loading) {
    return (
      <div style={{ minHeight: "60vh", display: "flex", alignItems: "center", justifyContent: "center" }} role="status" aria-live="polite">
        <div style={{ textAlign: "center" }}>
          <div style={{ width: "36px", height: "36px", border: "3px solid var(--accent-light)", borderTop: "3px solid var(--accent)", borderRadius: "50%", animation: "spin 0.8s linear infinite", margin: "0 auto 12px" }} aria-hidden="true" />
          <p style={{ fontSize: "14px", color: "var(--text-secondary)" }}>Cargando análisis…</p>
        </div>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  // ── Error ────────────────────────────────────────────────
  if (error || !property) {
    return (
      <div style={{ minHeight: "60vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "24px" }}>
        <div style={{ textAlign: "center" }}>
          <p style={{ color: "#dc2626", marginBottom: "16px" }} role="alert">{error || "Propiedad no encontrada"}</p>
          <Link href="/calcular" style={{ color: "var(--accent)", fontWeight: 600, fontSize: "14px" }}>← Volver a análisis</Link>
        </div>
      </div>
    );
  }

  return (
    <>
      {propertyJsonLd && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: propertyJsonLd }} />}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org", "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Inicio", item: "https://www.propadvisor.site" },
          { "@type": "ListItem", position: 2, name: "Analizar", item: "https://www.propadvisor.site/calcular" },
          { "@type": "ListItem", position: 3, name: property.address, item: `https://www.propadvisor.site/analisis/${property.id}` },
        ],
      }) }} />

      {/* Breadcrumb */}
      <nav aria-label="Ruta de navegación" style={{ borderBottom: "1px solid var(--border)", background: "var(--bg-secondary)" }}>
        <div style={{ maxWidth: "960px", margin: "0 auto", padding: "10px 24px" }}>
          <ol style={{ display: "flex", gap: "8px", listStyle: "none", fontSize: "13px", color: "var(--text-muted)", flexWrap: "wrap", alignItems: "center" }}>
            {[{ href: "/", label: "Inicio" }, { href: "/calcular", label: "Analizar" }].map((item) => (
              <li key={item.href} style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <Link href={item.href} style={{ color: "var(--text-secondary)", transition: "color 0.15s" }}>{item.label}</Link>
                <span aria-hidden="true" style={{ color: "var(--border)" }}>/</span>
              </li>
            ))}
            <li aria-current="page" style={{ color: "var(--text-primary)", fontWeight: 500, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: "240px" }}>{property.address}</li>
          </ol>
        </div>
      </nav>

      <article
        aria-labelledby="property-heading"
        style={{ background: "var(--bg-primary)", minHeight: "100vh" }}
        itemScope itemType="https://schema.org/RealEstateListing"
      >
        <div style={{ maxWidth: "960px", margin: "0 auto", padding: "48px 24px" }}>

          {/* ── Property Header ─────────────────────────────── */}
          <header style={{ marginBottom: "40px", paddingBottom: "32px", borderBottom: "1px solid var(--border)" }}>
            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "16px", flexWrap: "wrap" }}>
              <div>
                <p style={{ fontSize: "12px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--accent)", marginBottom: "8px" }}>
                  {property.type === "departamento" ? "Departamento" : "Casa"} en {getCityLabel(property.city)}
                </p>
                <h1 id="property-heading" style={{ fontSize: "clamp(22px, 3vw, 30px)", fontWeight: 800, letterSpacing: "-0.03em", color: "var(--text-primary)", marginBottom: "6px" }} itemProp="name">
                  {property.address}
                </h1>
                <p style={{ fontSize: "15px", color: "var(--text-secondary)" }} itemProp="address">
                  {property.neighborhood} · {property.rooms} dormitorios · {property.baths} baños
                  {property.m2 && <> · {property.m2} m²</>}
                </p>
                {property.sourceUrl && (
                  <a
                    href={property.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ display: "inline-flex", alignItems: "center", gap: "4px", marginTop: "10px", fontSize: "13px", color: "var(--accent)", fontWeight: 600, textDecoration: "none" }}
                  >
                    Ver publicación original en Portal Inmobiliario ↗
                  </a>
                )}
              </div>
              <div style={{ textAlign: "right", flexShrink: 0 }}>
                <p style={{ fontSize: "26px", fontWeight: 800, color: "var(--text-primary)", letterSpacing: "-0.03em", lineHeight: 1.1 }} itemProp="price">
                  {formatCLP(property.priceCLP)}
                </p>
                <p style={{ fontSize: "14px", color: "var(--text-secondary)", marginTop: "4px" }}>
                  UF {property.priceUF.toLocaleString("es-CL")}
                </p>
              </div>
            </div>
          </header>

          {/* ── Calculator ──────────────────────────────────── */}
          <section aria-labelledby="calculator-heading" style={{ marginBottom: "32px" }}>
            <div style={{ background: "var(--bg-secondary)", border: "1px solid var(--border)", borderRadius: "12px", padding: "28px" }}>
              <h2 id="calculator-heading" style={{ fontSize: "18px", fontWeight: 700, letterSpacing: "-0.02em", color: "var(--text-primary)", marginBottom: "24px" }}>
                Calculadora de dividendo
              </h2>

              <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                {/* Bank selector */}
                <div>
                  <label htmlFor="bank-select" style={{ display: "block", fontSize: "12px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--text-secondary)", marginBottom: "6px" }}>
                    Banco (tasa anual fija)
                  </label>
                  <select id="bank-select" value={mortgageData.selectedBankId} onChange={(e) => setMortgageData({ ...mortgageData, selectedBankId: e.target.value })} style={inputSx} onFocus={onFocus} onBlur={onBlur} aria-describedby="bank-note">
                    {banks.map((bank) => (<option key={bank.id} value={bank.id}>{bank.bank} — {bank.rate.toFixed(2)}% anual</option>))}
                  </select>
                  <div style={{ marginTop: "5px" }}>
                    <p id="bank-note" style={{ fontSize: "12px", color: "var(--text-muted)" }}>Tasas referenciales; el banco puede variar según tu perfil crediticio.</p>
                  </div>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "16px" }}>
                  {/* Down payment slider */}
                  <div>
                    <label htmlFor="down-payment" style={{ display: "block", fontSize: "12px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--text-secondary)", marginBottom: "8px" }}>
                      Pie (% del precio)
                    </label>
                    <input id="down-payment" type="range" min="10" max="50" step="5" value={mortgageData.downPayment} onChange={(e) => setMortgageData({ ...mortgageData, downPayment: parseInt(e.target.value) })} style={{ width: "100%", accentColor: "var(--accent)" }} aria-valuemin={10} aria-valuemax={50} aria-valuenow={mortgageData.downPayment} />
                    <p style={{ fontSize: "14px", color: "var(--text-primary)", marginTop: "6px" }}>
                      <strong>{mortgageData.downPayment}%</strong> = {formatCLP(downPaymentAmount)}
                    </p>
                  </div>

                  {/* Loan term */}
                  <div>
                    <label htmlFor="loan-term" style={{ display: "block", fontSize: "12px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--text-secondary)", marginBottom: "6px" }}>
                      Plazo del crédito
                    </label>
                    <select id="loan-term" value={mortgageData.loanTerm} onChange={(e) => setMortgageData({ ...mortgageData, loanTerm: parseInt(e.target.value) })} style={inputSx} onFocus={onFocus} onBlur={onBlur}>
                      <option value="15">15 años</option>
                      <option value="20">20 años</option>
                      <option value="25">25 años</option>
                    </select>
                  </div>
                </div>

                {/* Result */}
                <div role="region" aria-label="Dividendo mensual estimado" style={{ background: "white", border: "1px solid var(--border)", borderRadius: "10px", padding: "20px" }}>
                  <p style={{ fontSize: "12px", color: "var(--text-secondary)", marginBottom: "4px", textTransform: "uppercase", letterSpacing: "0.05em", fontWeight: 600 }}>
                    Dividendo mensual estimado
                  </p>
                  <p style={{ fontSize: "32px", fontWeight: 800, color: "var(--accent)", letterSpacing: "-0.04em", lineHeight: 1.1 }}>
                    {formatCLP(monthlyPayment)}
                  </p>
                  <p style={{ fontSize: "12px", color: "var(--text-muted)", marginTop: "6px" }}>
                    Capital + intereses · {selectedBank?.bank} · {interestRate.toFixed(2)}% · {mortgageData.loanTerm} años
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* ── 3 Scenarios ─────────────────────────────────── */}
          <section aria-labelledby="comparison-heading" style={{ marginBottom: "32px" }}>
            <div style={{ marginBottom: "20px" }}>
              <h2 id="comparison-heading" style={{ fontSize: "18px", fontWeight: 700, letterSpacing: "-0.02em", color: "var(--text-primary)" }}>
                Comparación a {mortgageData.loanTerm} años — 3 escenarios
              </h2>
              <p style={{ fontSize: "14px", color: "var(--text-secondary)", marginTop: "4px" }}>Todos los valores en pesos chilenos.</p>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "16px" }}>

              {/* Buy to live */}
              <article aria-label="Escenario: Comprar para vivir" style={{ background: "white", border: "2px solid var(--accent)", borderRadius: "12px", padding: "24px" }}>
                <div style={{ display: "inline-block", padding: "3px 8px", background: "var(--accent-light)", borderRadius: "4px", fontSize: "11px", fontWeight: 700, color: "var(--accent-dark)", textTransform: "uppercase", letterSpacing: "0.04em", marginBottom: "10px" }}>
                  Recomendado
                </div>
                <h3 style={{ fontSize: "16px", fontWeight: 700, color: "var(--text-primary)", marginBottom: "4px" }}>Comprar para vivir</h3>
                <p style={{ fontSize: "13px", color: "var(--text-muted)", marginBottom: "20px" }}>Pagas dividendo, acumulas patrimonio</p>
                <dl style={{ display: "flex", flexDirection: "column", gap: "12px", fontSize: "14px" }}>
                  <div>
                    <dt style={{ color: "var(--text-secondary)", marginBottom: "2px" }}>Pie inicial</dt>
                    <dd style={{ fontWeight: 600, color: "var(--text-primary)" }}>{formatCLP(downPaymentAmount)}</dd>
                  </div>
                  <div>
                    <dt style={{ color: "var(--text-secondary)", marginBottom: "2px" }}>Dividendo + gastos/mes</dt>
                    <dd style={{ fontWeight: 600, color: "var(--text-primary)" }}>{formatCLP(monthlyPayment + 500000)}</dd>
                  </div>
                  <div style={{ paddingTop: "12px", borderTop: "1px solid var(--border)" }}>
                    <dt style={{ color: "var(--text-secondary)", marginBottom: "2px" }}>Costo total {mortgageData.loanTerm} años</dt>
                    <dd style={{ fontSize: "20px", fontWeight: 800, color: "var(--accent)", letterSpacing: "-0.03em" }}>{formatCLP(comparison?.buyTotal || 0)}</dd>
                  </div>
                </dl>
              </article>

              {/* Keep renting */}
              <article aria-label="Escenario: Seguir arrendando" style={{ background: "var(--bg-secondary)", border: "1px solid var(--border)", borderRadius: "12px", padding: "24px" }}>
                <div style={{ height: "26px", marginBottom: "10px" }} />
                <h3 style={{ fontSize: "16px", fontWeight: 700, color: "var(--text-primary)", marginBottom: "4px" }}>Seguir arrendando</h3>
                <p style={{ fontSize: "13px", color: "var(--text-muted)", marginBottom: "20px" }}>Sin inversión inicial, máxima flexibilidad</p>
                <dl style={{ display: "flex", flexDirection: "column", gap: "12px", fontSize: "14px" }}>
                  <div>
                    <dt style={{ color: "var(--text-secondary)", marginBottom: "2px" }}>Inversión inicial</dt>
                    <dd style={{ fontWeight: 600, color: "var(--text-primary)" }}>$0</dd>
                  </div>
                  <div>
                    <dt style={{ color: "var(--text-secondary)", marginBottom: "2px" }}>Arriendo mensual</dt>
                    <dd style={{ fontWeight: 600, color: "var(--text-primary)" }}>{formatCLP(property.estimatedMonthlyRentCLP)}</dd>
                  </div>
                  <div style={{ paddingTop: "12px", borderTop: "1px solid var(--border)" }}>
                    <dt style={{ color: "var(--text-secondary)", marginBottom: "2px" }}>Costo total {mortgageData.loanTerm} años</dt>
                    <dd style={{ fontSize: "20px", fontWeight: 800, color: "var(--text-primary)", letterSpacing: "-0.03em" }}>{formatCLP(comparison?.rentTotal || 0)}</dd>
                  </div>
                </dl>
              </article>

              {/* Buy to rent */}
              <article aria-label="Escenario: Comprar para arrendar" style={{ background: "var(--bg-secondary)", border: "1px solid var(--border)", borderRadius: "12px", padding: "24px" }}>
                <div style={{ height: "26px", marginBottom: "10px" }} />
                <h3 style={{ fontSize: "16px", fontWeight: 700, color: "var(--text-primary)", marginBottom: "4px" }}>Comprar para arrendar</h3>
                <p style={{ fontSize: "13px", color: "var(--text-muted)", marginBottom: "20px" }}>Generas ingreso, propiedad como inversión</p>
                <dl style={{ display: "flex", flexDirection: "column", gap: "12px", fontSize: "14px" }}>
                  <div>
                    <dt style={{ color: "var(--text-secondary)", marginBottom: "2px" }}>Pie inicial</dt>
                    <dd style={{ fontWeight: 600, color: "var(--text-primary)" }}>{formatCLP(downPaymentAmount)}</dd>
                  </div>
                  <div>
                    <dt style={{ color: "var(--text-secondary)", marginBottom: "2px" }}>Dividendo/mes</dt>
                    <dd style={{ fontWeight: 600, color: "var(--text-primary)" }}>{formatCLP(monthlyPayment)}</dd>
                  </div>
                  <div>
                    <dt style={{ color: "var(--text-secondary)", marginBottom: "2px" }}>Ingreso arriendo/mes</dt>
                    <dd style={{ fontWeight: 600, color: "var(--accent)" }}>+{formatCLP(property.estimatedMonthlyRentCLP)}</dd>
                  </div>
                  <div style={{ paddingTop: "12px", borderTop: "1px solid var(--border)" }}>
                    <dt style={{ color: "var(--text-secondary)", marginBottom: "2px" }}>Flujo neto/mes</dt>
                    <dd style={{ fontSize: "20px", fontWeight: 800, color: netMonthlyFlow >= 0 ? "#16a34a" : "#dc2626", letterSpacing: "-0.03em" }}>
                      {netMonthlyFlow >= 0 ? "+" : ""}{formatCLP(netMonthlyFlow)}
                    </dd>
                  </div>
                </dl>
              </article>

            </div>
          </section>

          {/* ── Recommendation ─────────────────────────────── */}
          {comparison && (
            <section aria-labelledby="recommendation-heading" style={{ marginBottom: "24px" }}>
              <div style={{ background: "var(--bg-secondary)", border: "1px solid var(--border)", borderRadius: "12px", padding: "24px" }}>
                <h2 id="recommendation-heading" style={{ fontSize: "15px", fontWeight: 700, color: "var(--text-primary)", marginBottom: "10px" }}>
                  Análisis de PropAdvisor
                </h2>
                <p style={{ fontSize: "15px", color: "var(--text-secondary)", lineHeight: 1.7 }}>
                  {comparison.savings > 0
                    ? `Comprar para vivir es la opción más conveniente a largo plazo. En ${mortgageData.loanTerm} años ahorrarías aproximadamente ${formatCLP(Math.abs(comparison.savings))} versus seguir arrendando, además de acumular el valor de la propiedad como patrimonio.`
                    : `Seguir arrendando tiene menor costo directo a ${mortgageData.loanTerm} años. Sin embargo, al comprar acumulas patrimonio y te proteges de futuros aumentos de arriendo. Ajusta el pie y el plazo para explorar otros escenarios.`}
                </p>
                <p style={{ fontSize: "12px", color: "var(--text-muted)", marginTop: "12px" }}>
                  Proyección: plusvalía 7%/año · arriendo sube 3%/año · no incluye impuestos ni escritura.
                  {comparison.breakEvenYear > 0 && comparison.breakEvenYear <= mortgageData.loanTerm
                    ? ` Comprar se vuelve más rentable a partir del año ${comparison.breakEvenYear}.`
                    : ""}
                </p>
              </div>
            </section>
          )}

          {/* ── Lead Capture CTA ─────────────────────── */}
          <section aria-label="Recibir análisis y contacto" style={{ marginBottom: "16px" }}>
            <div style={{
              background: "linear-gradient(135deg, #0f766e 0%, #1e3a5f 100%)",
              borderRadius: "12px",
              padding: "24px",
              color: "white",
            }}>
              {/* User's personalized numbers */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "12px", marginBottom: "16px" }}>
                {[
                  { label: "Tu dividendo", value: formatCLP(monthlyPayment) },
                  { label: comparison && comparison.savings > 0 ? "Ahorras comprando" : "Costo extra compra", value: formatCLP(Math.abs(comparison?.savings ?? 0)) },
                  { label: `Propiedad en ${mortgageData.loanTerm} años`, value: formatCLP(comparison?.propertyValueAfter20Years ?? 0) },
                ].map((m) => (
                  <div key={m.label}>
                    <p style={{ fontSize: "10px", opacity: 0.7, marginBottom: "2px", textTransform: "uppercase", letterSpacing: "0.04em" }}>{m.label}</p>
                    <p style={{ fontSize: "14px", fontWeight: 800, letterSpacing: "-0.02em" }}>{m.value}</p>
                  </div>
                ))}
              </div>

              <div style={{ borderTop: "1px solid rgba(255,255,255,0.2)", paddingTop: "16px" }}>
                <p style={{ fontSize: "17px", fontWeight: 800, marginBottom: "4px", letterSpacing: "-0.02em" }}>
                  Recibe estos números en un informe profesional
                </p>
                <p style={{ fontSize: "13px", opacity: 0.85, lineHeight: 1.5, marginBottom: "16px" }}>
                  PDF listo para tu banco + Excel interactivo con amortización, comparación año a año y análisis de sensibilidad. <strong>100% gratis.</strong>
                </p>
                <button
                  onClick={() => { setShowEmailModal(true); track("lead_cta_clicked", { page: "analisis", property: property?.address || "" }); }}
                  disabled={!comparison}
                  style={{
                    width: "100%", padding: "14px 24px",
                    background: "white", color: "#0f766e",
                    border: "none", borderRadius: "10px",
                    fontSize: "15px", fontWeight: 800,
                    cursor: "pointer", letterSpacing: "-0.01em",
                    transition: "transform 0.1s, box-shadow 0.1s",
                  }}
                  onMouseOver={(e) => { e.currentTarget.style.transform = "translateY(-1px)"; e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.2)"; }}
                  onMouseOut={(e) => { e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = ""; }}
                >
                  Enviar informe gratis a mi email →
                </button>
                <p style={{ fontSize: "11px", opacity: 0.6, marginTop: "8px", textAlign: "center" }}>
                  Sin registro · Sin tarjeta · Llega en 30 segundos
                </p>
              </div>
            </div>
          </section>

          {/* Email gate modal */}
          <section aria-label="Modal de análisis" style={{ marginBottom: "40px" }}>
            {showEmailModal && (() => {
              const p = buildPayload();
              return p ? <EmailGateModal payload={p} onClose={() => setShowEmailModal(false)} /> : null;
            })()}
          </section>

          {/* ── Footer ──────────────────────────────────────── */}
          <footer style={{ display: "flex", flexWrap: "wrap", gap: "16px", alignItems: "center", justifyContent: "space-between", paddingTop: "24px", borderTop: "1px solid var(--border)" }}>
            <Link href="/calcular" style={{ fontSize: "14px", color: "var(--text-secondary)", fontWeight: 500 }}>
              ← Analizar otra propiedad
            </Link>
            <Link href="/guia" style={{ fontSize: "14px", color: "var(--accent)", fontWeight: 600 }}>
              Guía de compra en Chile →
            </Link>
          </footer>

        </div>
      </article>
    </>
  );
}
