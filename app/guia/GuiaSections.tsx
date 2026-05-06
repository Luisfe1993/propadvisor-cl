"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

/* ═══════════════════════════════════════════════════════════
   SCROLLSPY HOOK — tracks which section is in view
   ═══════════════════════════════════════════════════════════ */
const sectionIds = [
  "credito-hipotecario",
  "que-es-uf",
  "pie",
  "comparar-bancos",
  "comprar-vs-arrendar",
  "inversion",
  "comunas",
  "proceso",
];

export function useScrollspy() {
  const [active, setActive] = useState(sectionIds[0]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActive(entry.target.id);
          }
        }
      },
      { rootMargin: "-20% 0px -60% 0px" }
    );

    for (const id of sectionIds) {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    }

    return () => observer.disconnect();
  }, []);

  return active;
}

/* ═══════════════════════════════════════════════════════════
   SCROLLSPY SIDEBAR (desktop) + PILL BAR (mobile)
   ═══════════════════════════════════════════════════════════ */
const tocItems = [
  { id: "credito-hipotecario", label: "Crédito hipotecario" },
  { id: "que-es-uf", label: "La UF" },
  { id: "pie", label: "El pie" },
  { id: "comparar-bancos", label: "Comparar bancos" },
  { id: "comprar-vs-arrendar", label: "Comprar vs arrendar" },
  { id: "inversion", label: "Inversión" },
  { id: "comunas", label: "Comunas" },
  { id: "proceso", label: "Proceso" },
];

export function ScrollspyNav({ active }: { active: string }) {
  return (
    <>
      {/* Desktop — sticky sidebar */}
      <nav aria-label="Tabla de contenidos" className="hidden lg:block w-56 flex-shrink-0">
        <div className="sticky top-24">
          <p className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)] mb-4">En esta guía</p>
          <ul className="space-y-1">
            {tocItems.map((item, i) => (
              <li key={item.id}>
                <a
                  href={`#${item.id}`}
                  className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all duration-200 ${
                    active === item.id
                      ? "bg-[var(--accent-light)] text-[var(--accent)] font-semibold"
                      : "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-secondary)]"
                  }`}
                >
                  <span className={`w-5 h-5 rounded-full text-xs flex items-center justify-center flex-shrink-0 font-bold ${
                    active === item.id
                      ? "bg-[var(--accent)] text-white"
                      : "bg-[var(--bg-tertiary)] text-[var(--text-muted)]"
                  }`}>
                    {i + 1}
                  </span>
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </nav>

      {/* Mobile — horizontal pill bar */}
      <nav aria-label="Secciones" className="lg:hidden sticky top-16 z-30 bg-white/90 backdrop-blur-md border-b border-[var(--border)] -mx-6 px-6 py-3 mb-8">
        <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
          {tocItems.map((item, i) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-all whitespace-nowrap ${
                active === item.id
                  ? "bg-[var(--accent)] text-white"
                  : "bg-[var(--bg-secondary)] text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)]"
              }`}
            >
              {i + 1}. {item.label}
            </a>
          ))}
        </div>
      </nav>
    </>
  );
}

/* ═══════════════════════════════════════════════════════════
   READING PROGRESS BAR
   ═══════════════════════════════════════════════════════════ */
export function ReadingProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(docHeight > 0 ? Math.min((scrollTop / docHeight) * 100, 100) : 0);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="fixed top-0 left-0 right-0 z-50 h-1 bg-transparent">
      <div
        className="h-full bg-[var(--accent)] transition-[width] duration-150 ease-out"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   SECTION WRAPPER — consistent spacing + scroll offset
   ═══════════════════════════════════════════════════════════ */
function Section({ id, number, title, children }: {
  id: string;
  number: number;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="scroll-mt-24 mb-20">
      {/* Section header */}
      <div className="flex items-center gap-4 mb-8">
        <span className="flex-shrink-0 w-10 h-10 bg-[var(--accent)] text-white rounded-xl flex items-center justify-center text-sm font-bold shadow-sm">
          {number}
        </span>
        <div className="flex-1">
          <h2 className="text-2xl sm:text-3xl font-bold text-[var(--text-primary)] tracking-tight">
            {title}
          </h2>
        </div>
      </div>
      {children}
    </section>
  );
}

/* ─── Inline CTA ───────────────────────────────────────── */
function InlineCTA({ text, href }: { text: string; href: string }) {
  return (
    <div className="mt-8">
      <Link
        href={href}
        className="inline-flex items-center gap-2 px-5 py-2.5 bg-[var(--accent-light)] text-[var(--accent)] rounded-lg text-sm font-semibold hover:bg-[var(--accent)] hover:text-white transition-colors"
      >
        {text}
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
        </svg>
      </Link>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   ALL 8 SECTIONS — each with unique visual elements
   ═══════════════════════════════════════════════════════════ */
export function GuiaSections() {
  return (
    <div>
      {/* ── 1. CRÉDITO HIPOTECARIO ─────────────────────── */}
      <Section id="credito-hipotecario" number={1} title="¿Cómo funciona el crédito hipotecario en Chile?">
        <p className="text-[var(--text-secondary)] leading-relaxed mb-4 text-lg">
          Un crédito hipotecario en Chile es un préstamo a largo plazo (15 a 30 años) que el banco otorga para comprar una propiedad, usando la misma propiedad como garantía. El banco financia entre el 70% y el 90% del valor de la propiedad — el resto lo pagas tú como &quot;pie&quot;.
        </p>
        <p className="text-[var(--text-secondary)] leading-relaxed mb-4">
          Los créditos hipotecarios en Chile se expresan en <strong className="text-[var(--text-primary)]">UF (Unidad de Fomento)</strong>, lo que significa que el capital de tu deuda está indexado a la inflación. Si la inflación es del 4% anual, tu deuda en CLP sube un 4% aunque no hayas atrasado ninguna cuota.
        </p>
        <p className="text-[var(--text-secondary)] leading-relaxed mb-8">
          El dividendo mensual (cuota) incluye: amortización del capital + intereses + seguro de desgravamen + seguro de incendio y sismo. PropAdvisor calcula solo capital e intereses — los seguros agregan entre $30.000 y $80.000 CLP por mes según el banco y el valor de la propiedad.
        </p>

        {/* Visual: Anatomy of a dividend — stacked bar */}
        <div className="p-6 bg-white rounded-2xl border border-[var(--border)] shadow-sm mb-6">
          <p className="font-bold text-[var(--text-primary)] mb-4 text-sm uppercase tracking-wider">Anatomía de un dividendo mensual</p>
          <div className="space-y-3">
            {[
              { label: "Capital", pct: 40, color: "bg-[var(--accent)]", amount: "$192.000" },
              { label: "Intereses", pct: 35, color: "bg-teal-300", amount: "$168.000" },
              { label: "Seguro desgravamen", pct: 15, color: "bg-amber-400", amount: "$48.000" },
              { label: "Seguro incendio", pct: 10, color: "bg-orange-300", amount: "$32.000" },
            ].map((bar) => (
              <div key={bar.label} className="flex items-center gap-3">
                <span className="w-36 text-sm text-[var(--text-secondary)]">{bar.label}</span>
                <div className="flex-1 bg-[var(--bg-secondary)] rounded-full h-7 overflow-hidden">
                  <div
                    className={`${bar.color} h-full rounded-full flex items-center justify-end pr-3 transition-all duration-700`}
                    style={{ width: `${bar.pct}%` }}
                  >
                    <span className="text-white text-xs font-bold">{bar.amount}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <p className="text-xs text-[var(--text-muted)] mt-3">
            Ejemplo: Depto en Ñuñoa, UF 2.600, pie 20%, tasa 4.5%, 20 años → dividendo total ~$540.000/mes
          </p>
        </div>

        {/* Example card */}
        <div className="p-5 bg-gradient-to-br from-[var(--accent)]/5 to-[var(--accent)]/10 rounded-xl border border-[var(--accent)]/20">
          <p className="font-semibold text-[var(--text-primary)] mb-2 flex items-center gap-2">
            <span className="text-lg">📍</span> Ejemplo real
          </p>
          <p className="text-[var(--text-secondary)] text-sm leading-relaxed">
            Departamento en Ñuñoa, UF 2.600 (~$95 millones CLP). Pie del 20% = $19 millones. Capital a financiar: $76 millones. A 20 años con tasa del 4.5%: dividendo ~$480.000 CLP/mes (solo capital + intereses). Con seguros: ~$540.000 a $560.000 CLP/mes.
          </p>
        </div>

        <InlineCTA text="Calcula tu dividendo real" href="/calcular" />
      </Section>

      {/* ── 2. UF ────────────────────────────────────────── */}
      <Section id="que-es-uf" number={2} title="¿Qué es la UF y cómo afecta tu dividendo?">
        <p className="text-[var(--text-secondary)] leading-relaxed mb-4 text-lg">
          La <strong className="text-[var(--text-primary)]">Unidad de Fomento (UF)</strong> es una unidad de cuenta chilena creada en 1967 para mantener el poder adquisitivo de los contratos financieros frente a la inflación. Su valor se actualiza diariamente según el IPC.
        </p>
        <p className="text-[var(--text-secondary)] leading-relaxed mb-8">
          Implicación práctica: si pides un crédito de 2.000 UF hoy (equivalentes a $74 millones CLP), el año siguiente esas 2.000 UF equivaldrán a ~$76-78 millones CLP. Tu deuda en pesos <em>nunca baja</em> en términos nominales mientras haya inflación, aunque vayas pagando cuotas.
        </p>

        {/* Visual: UF timeline */}
        <div className="p-6 bg-white rounded-2xl border border-[var(--border)] shadow-sm mb-6">
          <p className="font-bold text-[var(--text-primary)] mb-5 text-sm uppercase tracking-wider">Evolución de la UF en Chile</p>
          <div className="flex items-end gap-2 sm:gap-4 h-48">
            {[
              { year: "2000", value: "$15K", height: "25%" },
              { year: "2005", value: "$18K", height: "32%" },
              { year: "2010", value: "$21K", height: "40%" },
              { year: "2015", value: "$25K", height: "52%" },
              { year: "2018", value: "$27K", height: "58%" },
              { year: "2020", value: "$29K", height: "64%" },
              { year: "2022", value: "$35K", height: "82%" },
              { year: "2026", value: "$37K", height: "100%" },
            ].map((bar) => (
              <div key={bar.year} className="flex-1 flex flex-col items-center justify-end h-full gap-1">
                <span className="text-xs font-bold text-[var(--accent)]">{bar.value}</span>
                <div
                  className="w-full bg-gradient-to-t from-[var(--accent)] to-teal-300 rounded-t-lg transition-all duration-700"
                  style={{ height: bar.height }}
                />
                <span className="text-xs text-[var(--text-muted)]">{bar.year}</span>
              </div>
            ))}
          </div>
          <p className="text-xs text-[var(--text-muted)] mt-3">1 UF en CLP · Fuente: Banco Central de Chile</p>
        </div>

        {/* Advantage / Risk cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-5 rounded-xl border-2 border-emerald-200 bg-emerald-50/50">
            <p className="font-bold text-emerald-700 mb-2 flex items-center gap-2">
              <span className="w-6 h-6 bg-emerald-500 text-white rounded-full flex items-center justify-center text-xs">✓</span>
              Ventaja de la UF
            </p>
            <p className="text-[var(--text-secondary)] text-sm leading-relaxed">
              El dividendo en UF es fijo. Como los arriendos también suben con la inflación, la carga relativa de tu cuota no aumenta.
            </p>
          </div>
          <div className="p-5 rounded-xl border-2 border-amber-200 bg-amber-50/50">
            <p className="font-bold text-amber-700 mb-2 flex items-center gap-2">
              <span className="w-6 h-6 bg-amber-500 text-white rounded-full flex items-center justify-center text-xs">⚠</span>
              Riesgo de la UF
            </p>
            <p className="text-[var(--text-secondary)] text-sm leading-relaxed">
              Si hay inflación alta (como 2022), tu deuda en CLP sube aunque pagues todo al día. Planifica con un colchón.
            </p>
          </div>
        </div>
      </Section>

      {/* ── 3. EL PIE ──────────────────────────────────── */}
      <Section id="pie" number={3} title="El pie: cuánto necesitas y de dónde sacarlo">
        <p className="text-[var(--text-secondary)] leading-relaxed mb-8 text-lg">
          El &quot;pie&quot; es el pago inicial que haces al comprar. En Chile, el banco financia hasta el 90% del valor de tasación de una primera vivienda. Sin embargo, el pie óptimo es entre el 20% y el 25%.
        </p>

        {/* Visual: 3 pie comparison cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          {[
            {
              pct: "10%",
              label: "Mínimo legal",
              pie: "$9.5M",
              dividendo: "$540K/mes",
              tag: "Solo 1ra vivienda",
              color: "border-amber-300 bg-amber-50/50",
              tagColor: "bg-amber-100 text-amber-700",
            },
            {
              pct: "20%",
              label: "Estándar",
              pie: "$19M",
              dividendo: "$480K/mes",
              tag: "Mejores tasas",
              color: "border-[var(--accent)] bg-[var(--accent-light)]/50",
              tagColor: "bg-[var(--accent-light)] text-[var(--accent)]",
              featured: true,
            },
            {
              pct: "30%",
              label: "Inversión",
              pie: "$28.5M",
              dividendo: "$420K/mes",
              tag: "Obligatorio 2da vivienda",
              color: "border-violet-300 bg-violet-50/50",
              tagColor: "bg-violet-100 text-violet-700",
            },
          ].map((card) => (
            <div
              key={card.pct}
              className={`p-5 rounded-xl border-2 ${card.color} ${card.featured ? "ring-2 ring-[var(--accent)]/20 shadow-md" : ""} text-center`}
            >
              <p className="text-4xl font-black text-[var(--text-primary)] mb-1">{card.pct}</p>
              <p className="text-sm font-semibold text-[var(--text-secondary)] mb-4">{card.label}</p>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between px-2">
                  <span className="text-[var(--text-muted)]">Pie</span>
                  <span className="font-bold text-[var(--text-primary)]">{card.pie}</span>
                </div>
                <div className="flex justify-between px-2">
                  <span className="text-[var(--text-muted)]">Dividendo</span>
                  <span className="font-bold text-[var(--text-primary)]">{card.dividendo}</span>
                </div>
              </div>
              <span className={`inline-block mt-4 px-3 py-1 rounded-full text-xs font-semibold ${card.tagColor}`}>
                {card.tag}
              </span>
            </div>
          ))}
        </div>
        <p className="text-xs text-[var(--text-muted)] mb-6 text-center">Basado en propiedad de UF 2.600 (~$95M CLP), tasa 4.5%, 20 años</p>

        <p className="text-[var(--text-secondary)] leading-relaxed">
          <strong className="text-[var(--text-primary)]">¿De dónde sacar el pie?</strong> Las fuentes más comunes en Chile son: ahorros propios, bono MINVU/DS1 para primera vivienda (hasta $3.600 UF de subsidio según tramo), retiro parcial de Cuenta 2 de AFP, o apoyo familiar. No puedes usar el crédito hipotecario para financiar el pie.
        </p>

        <InlineCTA text="Simula con tu pie" href="/calcular" />
      </Section>

      {/* ── 4. COMPARAR BANCOS ─────────────────────────── */}
      <Section id="comparar-bancos" number={4} title="Cómo comparar los bancos en Chile">
        <p className="text-[var(--text-secondary)] leading-relaxed mb-4 text-lg">
          Los 8 bancos principales que ofrecen créditos hipotecarios en Chile tienen diferencias de tasa de 0.3% a 0.5% que, en un crédito a 20 años, representan <strong className="text-[var(--text-primary)]">millones de pesos</strong> en intereses totales.
        </p>
        <p className="text-[var(--text-secondary)] leading-relaxed mb-8">
          No existe un &quot;mejor banco&quot; universal — depende de tu perfil crediticio, si es primera o segunda vivienda, y las promociones vigentes.
        </p>

        {/* Visual: Bank comparison table */}
        <div className="rounded-2xl border border-[var(--border)] overflow-hidden shadow-sm mb-6">
          <div className="bg-[var(--bg-secondary)] px-6 py-3 border-b border-[var(--border)]">
            <p className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)]">Tasas referenciales 2025-2026 · Crédito a 20 años</p>
          </div>
          <div className="divide-y divide-[var(--border)]">
            {[
              { bank: "BancoEstado", rate: "4.2% - 4.8%", highlight: "Mejor para primera vivienda" },
              { bank: "Santander", rate: "4.3% - 5.0%", highlight: "Promociones para clientes" },
              { bank: "BCI", rate: "4.5% - 5.2%", highlight: "Flexibilidad en condiciones" },
              { bank: "Banco de Chile", rate: "4.4% - 5.1%", highlight: "Rápido en pre-aprobación" },
              { bank: "Scotiabank", rate: "4.3% - 5.0%", highlight: "Buenas tasas con pie alto" },
              { bank: "Itaú", rate: "4.5% - 5.3%", highlight: "Atractivo para rentas altas" },
              { bank: "Security", rate: "4.6% - 5.4%", highlight: "Nicho de alta renta" },
              { bank: "BICE", rate: "4.5% - 5.2%", highlight: "Competitivo en UF" },
            ].map((row, i) => (
              <div key={row.bank} className={`flex items-center px-6 py-4 ${i % 2 === 0 ? "bg-white" : "bg-[var(--bg-secondary)]/50"}`}>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-[var(--text-primary)] text-sm">{row.bank}</p>
                  <p className="text-xs text-[var(--text-muted)]">{row.highlight}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="font-bold text-[var(--accent)]">{row.rate}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Impact callout */}
        <div className="p-5 bg-gradient-to-r from-red-50 to-amber-50 rounded-xl border border-red-200/50">
          <p className="font-bold text-[var(--text-primary)] mb-2 flex items-center gap-2">
            <span className="text-lg">💰</span> Impacto de 0.5% de diferencia en tasa
          </p>
          <p className="text-[var(--text-secondary)] text-sm leading-relaxed">
            En un crédito de $80 millones CLP a 20 años, la diferencia entre 4.5% y 5.0% anual es ~<strong className="text-[var(--text-primary)]">$5.000 CLP/mes</strong> en el dividendo — y más de <strong className="text-red-600">$10 millones CLP</strong> en intereses totales durante la vida del crédito.
          </p>
        </div>
        <p className="text-[var(--text-secondary)] leading-relaxed mt-6">
          Además de la tasa, compara: CAE (Costo Anual Equivalente, incluye todos los costos), seguros asociados, costo de tasación, y si cobra por prepago anticipado.
        </p>

        <InlineCTA text="Compara tasas de 8 bancos" href="/calcular" />
      </Section>

      {/* ── 5. COMPRAR VS ARRENDAR ─────────────────────── */}
      <Section id="comprar-vs-arrendar" number={5} title="¿Comprar o arrendar? Cómo decidir">
        <p className="text-[var(--text-secondary)] leading-relaxed mb-8 text-lg">
          La pregunta más frecuente en el mercado inmobiliario chileno no tiene una respuesta universal. Depende de tres factores: tu horizonte de tiempo, tu situación financiera, y las condiciones del mercado local.
        </p>

        {/* Visual: Pricing-table-style comparison */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-0 md:gap-0 rounded-2xl overflow-hidden border border-[var(--border)] shadow-sm mb-8">
          {/* Buy column */}
          <div className="p-6 sm:p-8 bg-white border-b md:border-b-0 md:border-r border-[var(--border)]">
            <div className="flex items-center gap-3 mb-6">
              <span className="w-10 h-10 bg-[var(--accent)] rounded-xl flex items-center justify-center text-white text-lg">🏠</span>
              <h3 className="text-xl font-bold text-[var(--text-primary)]">Comprar conviene si…</h3>
            </div>
            <ul className="space-y-3">
              {[
                "Planeas vivir más de 8-10 años en el mismo lugar",
                "Tienes el pie disponible (20%+) sin endeudar tu liquidez",
                "El dividendo no supera el 30% de tus ingresos",
                "Quieres acumular patrimonio y protegerte de alzas de arriendo",
                "Tienes trabajo estable o ingresos predecibles",
              ].map((item) => (
                <li key={item} className="flex items-start gap-3 text-sm text-[var(--text-secondary)]">
                  <span className="w-5 h-5 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center flex-shrink-0 text-xs mt-0.5">✓</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
          {/* Rent column */}
          <div className="p-6 sm:p-8 bg-[var(--bg-secondary)]">
            <div className="flex items-center gap-3 mb-6">
              <span className="w-10 h-10 bg-[var(--text-secondary)] rounded-xl flex items-center justify-center text-white text-lg">🏢</span>
              <h3 className="text-xl font-bold text-[var(--text-primary)]">Arrendar conviene si…</h3>
            </div>
            <ul className="space-y-3">
              {[
                "Puedes mudarte en los próximos 3-5 años (trabajo, familia)",
                "No tienes el pie o necesitas esa liquidez para otra inversión",
                "El dividendo superaría el 35-40% de tus ingresos",
                "El mercado local tiene alta volatilidad de precios",
                "Prefieres flexibilidad sobre acumulación de patrimonio",
              ].map((item) => (
                <li key={item} className="flex items-start gap-3 text-sm text-[var(--text-secondary)]">
                  <span className="w-5 h-5 bg-slate-200 text-slate-500 rounded-full flex items-center justify-center flex-shrink-0 text-xs mt-0.5">→</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="p-5 bg-gradient-to-br from-[var(--accent)]/5 to-[var(--accent)]/10 rounded-xl border border-[var(--accent)]/20">
          <p className="font-semibold text-[var(--text-primary)] mb-2 flex items-center gap-2">
            <span className="text-lg">📐</span> La regla del precio/arriendo
          </p>
          <p className="text-[var(--text-secondary)] text-sm leading-relaxed">
            Si el precio de compra es más de 200 veces el arriendo mensual (equivalente a más de 16.7 años de arriendo), arrendar e invertir el pie puede ser más conveniente financieramente. PropAdvisor calcula esta relación automáticamente.
          </p>
        </div>

        <InlineCTA text="¿Qué te conviene más? Calcula aquí" href="/calcular" />
      </Section>

      {/* ── 6. INVERSIÓN ──────────────────────────────── */}
      <Section id="inversion" number={6} title="Comprar para arrendar: rentabilidad real en Chile">
        <p className="text-[var(--text-secondary)] leading-relaxed mb-4 text-lg">
          La <strong className="text-[var(--text-primary)]">rentabilidad bruta por arriendo</strong> en Chile es el ingreso anual de arriendo dividido por el precio de compra. En Santiago, oscila entre el 4% y el 6.5% según la comuna y el tipo de propiedad.
        </p>
        <p className="text-[var(--text-secondary)] leading-relaxed mb-8">
          La <strong className="text-[var(--text-primary)]">rentabilidad neta</strong> — lo que realmente importa — es menor. Hay que descontar: contribuciones (~0.5-1% anual del valor), gastos comunes, administración (5-8% del arriendo), vacancia (estimada en 1 mes/año = -8.3%), y mantenciones.
        </p>

        {/* Visual: Stat cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Rentabilidad bruta", value: "4-6.5%", color: "text-[var(--accent)]", bg: "bg-[var(--accent-light)]" },
            { label: "Rentabilidad neta", value: "2.5-4.5%", color: "text-amber-600", bg: "bg-amber-50" },
            { label: "Vacancia promedio", value: "~8%", color: "text-red-500", bg: "bg-red-50" },
            { label: "Plusvalía anual", value: "4-9%", color: "text-violet-600", bg: "bg-violet-50" },
          ].map((stat) => (
            <div key={stat.label} className={`${stat.bg} rounded-xl p-4 text-center`}>
              <p className={`text-2xl sm:text-3xl font-black ${stat.color}`}>{stat.value}</p>
              <p className="text-xs text-[var(--text-muted)] mt-1 font-medium">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Example */}
        <div className="p-6 bg-white rounded-2xl border border-[var(--border)] shadow-sm mb-6">
          <p className="font-bold text-[var(--text-primary)] mb-4 text-sm uppercase tracking-wider">
            Ejemplo: Departamento en Ñuñoa, UF 2.600
          </p>
          <div className="grid grid-cols-2 gap-4">
            {[
              { label: "Precio compra", value: "$95M CLP" },
              { label: "Arriendo estimado", value: "$365.000/mes" },
              { label: "Rent. bruta", value: "4.6% anual", accent: true },
              { label: "Rent. neta", value: "3.0-3.5%", accent: false },
            ].map((item) => (
              <div key={item.label} className="flex flex-col">
                <span className="text-xs text-[var(--text-muted)] uppercase tracking-wider">{item.label}</span>
                <span className={`text-lg font-bold ${item.accent ? "text-[var(--accent)]" : "text-[var(--text-primary)]"}`}>{item.value}</span>
              </div>
            ))}
          </div>
        </div>

        <p className="text-[var(--text-secondary)] leading-relaxed">
          Para decidir si conviene, compara la rentabilidad neta con otras alternativas: fondos mutuos, ETFs, depósitos a plazo. En 2025-2026 los depósitos a plazo ofrecían 4-5% anual sin riesgo. La propiedad agrega plusvalía y es un activo tangible, pero tiene iliquidez y costos de transacción altos (~3-5%).
        </p>

        <InlineCTA text="Analiza tu inversión" href="/calcular" />
      </Section>

      {/* ── 7. COMUNAS ──────────────────────────────────── */}
      <Section id="comunas" number={7} title="Las mejores comunas para invertir en Santiago">
        <p className="text-[var(--text-secondary)] leading-relaxed mb-8 text-lg">
          No existe una &quot;mejor comuna&quot; universal — depende de tu objetivo: máxima rentabilidad por arriendo, mayor plusvalía, o equilibrio entre ambas.
        </p>

        {/* Visual: Comuna cards grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          {[
            {
              name: "Providencia / Las Condes",
              capRate: "3.5-4.5%",
              appreciation: "Alta",
              priceRange: "3.000-6.000 UF",
              badge: "Plusvalía",
              badgeColor: "bg-violet-100 text-violet-700",
              desc: "Arriendo estable, ejecutivos y familias.",
            },
            {
              name: "Ñuñoa / Macul",
              capRate: "4-5.5%",
              appreciation: "Media-Alta",
              priceRange: "2.000-3.500 UF",
              badge: "Punto dulce",
              badgeColor: "bg-[var(--accent-light)] text-[var(--accent)]",
              featured: true,
              desc: "Demanda estudiantil y familiar fuerte.",
            },
            {
              name: "Santiago Centro",
              capRate: "5-6.5%",
              appreciation: "Media",
              priceRange: "1.200-2.500 UF",
              badge: "Rentabilidad",
              badgeColor: "bg-emerald-100 text-emerald-700",
              desc: "Alta rotación, mayor vacancia y mantención.",
            },
            {
              name: "Vitacura",
              capRate: "3-3.5%",
              appreciation: "Muy alta",
              priceRange: "5.000-12.000 UF",
              badge: "Premium",
              badgeColor: "bg-amber-100 text-amber-700",
              desc: "Alta gama, menor liquidez.",
            },
            {
              name: "Peñalolén / La Reina",
              capRate: "4-5.5%",
              appreciation: "Media-Alta",
              priceRange: "2.000-3.200 UF",
              badge: "Crecimiento",
              badgeColor: "bg-sky-100 text-sky-700",
              desc: "Buenos proyectos nuevos, demanda familiar.",
            },
          ].map((comuna) => (
            <div
              key={comuna.name}
              className={`p-5 rounded-xl border bg-white ${
                comuna.featured ? "border-[var(--accent)] ring-2 ring-[var(--accent)]/10 shadow-md" : "border-[var(--border)] shadow-sm hover:shadow-md"
              } transition-shadow`}
            >
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-bold text-[var(--text-primary)] text-sm">{comuna.name}</h3>
                <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${comuna.badgeColor}`}>{comuna.badge}</span>
              </div>
              <p className="text-xs text-[var(--text-secondary)] mb-4 leading-relaxed">{comuna.desc}</p>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-[var(--text-muted)]">Cap rate</span>
                  <span className="font-bold text-[var(--accent)]">{comuna.capRate}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[var(--text-muted)]">Plusvalía</span>
                  <span className="font-semibold text-[var(--text-primary)]">{comuna.appreciation}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[var(--text-muted)]">Precio</span>
                  <span className="font-semibold text-[var(--text-primary)]">{comuna.priceRange}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* ── 8. PROCESO ───────────────────────────────────── */}
      <Section id="proceso" number={8} title="Proceso de compra paso a paso en Chile">
        <p className="text-[var(--text-secondary)] leading-relaxed mb-8 text-lg">
          El proceso completo de compra de una propiedad en Chile demora entre 2 y 4 meses. Estos son los 6 pasos clave:
        </p>

        {/* Visual: Timeline stepper */}
        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-5 top-6 bottom-6 w-0.5 bg-gradient-to-b from-[var(--accent)] to-[var(--accent)]/20 hidden sm:block" />

          <div className="space-y-6">
            {[
              { n: 1, title: "Simula y decide tu presupuesto", duration: "1-2 semanas", desc: "Usa PropAdvisor para calcular cuánto puedes pagar de dividendo y qué tipo de propiedad alcanzas. Regla: dividendo máximo = 30% de tu ingreso mensual neto.", icon: "🧮" },
              { n: 2, title: "Pre-aprobación del crédito", duration: "2-4 semanas", desc: "Solicita una pre-aprobación a 2-3 bancos antes de buscar propiedad. Así sabes tu capacidad real y negocias con más fuerza. Dura 60-90 días generalmente.", icon: "🏦" },
              { n: 3, title: "Busca y elige la propiedad", duration: "2-8 semanas", desc: "Portal Inmobiliario, Yapo, Toctoc, corredores de propiedades. Visita al menos 5-8 propiedades antes de decidir.", icon: "🔍" },
              { n: 4, title: "Promesa de compraventa", duration: "1 semana", desc: "Documento legal previo a la escritura. Se firma ante notario y se paga un porcentaje del precio (1-5%) como garantía. Contiene condiciones y plazo.", icon: "📝" },
              { n: 5, title: "Tasación y estudio de títulos", duration: "2-3 semanas", desc: "El banco tasa la propiedad para confirmar que vale lo que pagas. Se revisa el historial de títulos para confirmar que no tiene hipotecas, embargos ni problemas legales.", icon: "🔎" },
              { n: 6, title: "Escritura pública e inscripción", duration: "4-8 semanas", desc: "Firma ante notario, luego se inscribe en el Conservador de Bienes Raíces. Solo después de la inscripción eres dueño legal.", icon: "🏡" },
            ].map((step, i) => (
              <div key={step.n} className="flex gap-4 sm:gap-6 items-start relative">
                {/* Step circle */}
                <div className="flex-shrink-0 w-10 h-10 bg-[var(--accent)] text-white rounded-xl flex items-center justify-center text-lg z-10 shadow-sm">
                  {step.icon}
                </div>
                {/* Content */}
                <div className={`flex-1 p-5 rounded-xl border border-[var(--border)] bg-white shadow-sm ${i === 0 ? "ring-2 ring-[var(--accent)]/10" : ""}`}>
                  <div className="flex items-center justify-between mb-2 flex-wrap gap-2">
                    <h3 className="font-bold text-[var(--text-primary)]">
                      <span className="text-[var(--accent)] mr-1">Paso {step.n}.</span> {step.title}
                    </h3>
                    <span className="px-2.5 py-0.5 bg-[var(--bg-secondary)] rounded-full text-xs font-medium text-[var(--text-muted)]">
                      ⏱ {step.duration}
                    </span>
                  </div>
                  <p className="text-[var(--text-secondary)] text-sm leading-relaxed">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <InlineCTA text="Empieza con el paso 1: simula tu crédito" href="/calcular" />
      </Section>
    </div>
  );
}
