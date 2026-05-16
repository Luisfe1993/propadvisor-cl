# PropAdvisor CL — Revolution Plan: Question-First Architecture

## The Problem

Users land on PropAdvisor and see a calculator with 15+ technical fields (UF, pie %, tasa hipotecaria, cap rate, DSCR). **They don't know what question they're trying to answer.** The tool assumes financial literacy that most Chilean home buyers don't have.

CMF Educa solves this with **question-first tools** — each tool answers ONE simple question with minimal inputs and educational explanations. Benchmark competitors (DealCheck, Mashvisor, Propital) do the same: start simple, funnel to depth.

## The Revolution: From "Calculator" to "Question Hub"

### Before (Current)
```
Homepage → /calcular (15+ fields, 3 scenarios, overwhelming)
```

### After (New)
```
Homepage → "¿Qué quieres saber?" → Pick a question → 2-3 inputs → Clear answer
                                                                    ↓
                                                        "¿Quieres un análisis completo?"
                                                                    ↓
                                                              /calcular (full analysis)
                                                                    ↓
                                                              /dashboard (Pro)
```

---

## The 8 Tools (Tier 1 + Tier 2)

### Tier 1 — Core Real Estate Questions

| # | Question (H1) | What It Does | Inputs | Output | CMF Inspiration |
|---|---|---|---|---|---|
| 1 | **¿Me alcanza para comprar?** | Affordability calculator — tells you the max property price you can afford | Ingreso mensual, deudas actuales, pie disponible | "Puedes comprar hasta UF X,XXX" + max dividendo | Calcula cuánto puedes pedir en un crédito |
| 2 | **¿Cuánto sería mi dividendo?** | Quick mortgage payment calc (simplified /calcular) | Precio propiedad, pie %, plazo, banco | Dividendo mensual en CLP + comparison strip | Calcula el Valor de la Cuota |
| 3 | **¿Conviene comprar o arrendar?** | Simplified entry to the existing 3-way analysis | Precio propiedad, arriendo mensual, comuna | Winner badge + "Análisis completo →" | Simula un Crédito Hipotecario |
| 4 | **¿Cuánto necesito ahorrar para el pie?** | Down payment savings planner | Precio propiedad, ahorro mensual actual, ahorros actuales | "En X meses tendrás el pie" + timeline | ¿Cuánto debo ahorrar para reunir un monto? |
| 5 | **¿Me conviene prepagar mi crédito?** | Prepayment calculator | Saldo deuda, cuotas restantes, tasa, monto a prepagar | Ahorro total en intereses + nuevo plazo | Calcula el prepago de un crédito |

### Tier 2 — Financial Planning

| # | Question (H1) | What It Does | Inputs | Output | CMF Inspiration |
|---|---|---|---|---|---|
| 6 | **¿Cuánto de mi sueldo se va en vivienda?** | Housing budget calculator | Ingresos, gastos fijos, dividendo/arriendo actual | % del sueldo en vivienda + recomendación | Calcula tu presupuesto mensual |
| 7 | **Mi plan para comprar** | Step-by-step savings + purchase timeline | Meta (precio propiedad), ahorro mensual, plazo deseado | Plan visual mes a mes + milestones | Prepara tu plan de ahorro |
| 8 | **¿Estás listo para comprar?** | Interactive readiness quiz (8-10 questions) | Multiple choice questions about finances, stability, knowledge | Score + personalized recommendation | Test: Actitudes frente al gasto |

---

## Architecture & URLs

```
/herramientas                         — Tools hub page (grid of 8 question cards)
/herramientas/me-alcanza              — Tool #1: Affordability
/herramientas/dividendo               — Tool #2: Quick Mortgage
/herramientas/comprar-o-arrendar      — Tool #3: Buy vs Rent (simplified)
/herramientas/ahorrar-pie             — Tool #4: Down Payment Savings
/herramientas/prepago                 — Tool #5: Prepayment Calculator
/herramientas/presupuesto-vivienda    — Tool #6: Housing Budget
/herramientas/plan-compra             — Tool #7: Purchase Plan
/herramientas/test-comprador          — Tool #8: Buyer Readiness Quiz
```

### Existing pages remain:
```
/calcular     — Full analysis (unchanged, but now linked FROM tools)
/buscar       — Property search
/guia         — Educational guide
/dashboard    — Pro portfolio
/pricing      — Plans
```

---

## Each Tool Page — Standard Layout

Inspired by DealCheck's wizard + CMF's educational approach + Propital's premium feel.

```
┌─────────────────────────────────────────────────────┐
│  ← Volver a Herramientas         [Nav]              │
│                                                     │
│  HERRAMIENTA GRATUITA                               │
│                                                     │
│  ¿Me alcanza para comprar?                    [H1]  │
│  Descubre el precio máximo de propiedad       [sub] │
│  que puedes financiar con tu sueldo actual.         │
│                                                     │
│  ┌─────────────────────────────────────────────┐    │
│  │                                             │    │
│  │   Ingreso líquido mensual                   │    │
│  │   [$  2,500,000                         ]   │    │
│  │                                             │    │
│  │   Deudas mensuales actuales                 │    │
│  │   [$    150,000                         ]   │    │
│  │                                             │    │
│  │   Pie disponible                            │    │
│  │   [$  25,000,000                        ]   │    │
│  │                                             │    │
│  │         [ Calcular ]                        │    │
│  │                                             │    │
│  └─────────────────────────────────────────────┘    │
│                                                     │
│  ── RESULTADO ──────────────────────────────────    │
│                                                     │
│  ┌─────────────────────────────────────────────┐    │
│  │                                             │    │
│  │   Puedes comprar una propiedad de hasta     │    │
│  │                                             │    │
│  │          UF 4,200                           │    │
│  │          (~$155.400.000 CLP)                │    │
│  │                                             │    │
│  │   Dividendo máximo: $625.000/mes            │    │
│  │   (25% de tu ingreso)                       │    │
│  │                                             │    │
│  │   ┌───────────┬───────────┬──────────┐      │    │
│  │   │ Santander │ BCI       │ BdChile  │      │    │
│  │   │ 3.43%     │ 3.96%     │ 3.75%    │      │    │
│  │   │ UF 4,400  │ UF 4,050  │ UF 4,200 │      │    │
│  │   └───────────┴───────────┴──────────┘      │    │
│  │                                             │    │
│  └─────────────────────────────────────────────┘    │
│                                                     │
│  ── ¿QUÉ SIGNIFICA ESTO? ──────────────────────    │
│                                                     │
│  💡 Los bancos chilenos exigen que tu dividendo     │
│     no supere el 25-30% de tu ingreso líquido.     │
│     Con un pie de $25M y tasa de ~3.7%, el banco   │
│     te prestaría hasta UF 3,360 (el 80% de la     │
│     propiedad).                                     │
│                                                     │
│  ── SIGUIENTE PASO ────────────────────────────    │
│                                                     │
│  ┌─────────────────────────────────────────────┐    │
│  │  ¿Ya tienes una propiedad en mente?         │    │
│  │  Haz un análisis completo gratuito:         │    │
│  │  dividendo por banco, comparación           │    │
│  │  comprar vs. arrendar, y PDF profesional.   │    │
│  │                                             │    │
│  │       [ Analizar una propiedad → ]          │    │
│  └─────────────────────────────────────────────┘    │
│                                                     │
│  ── PREGUNTAS RELACIONADAS ────────────────────    │
│                                                     │
│  → ¿Cuánto sería mi dividendo?                     │
│  → ¿Cuánto necesito ahorrar para el pie?            │
│  → ¿Estás listo para comprar?                       │
│                                                     │
└─────────────────────────────────────────────────────┘
```

---

## Homepage Redesign

### Current
Big hero with "¿Conviene Comprar o Arrendar?" → Single CTA to /calcular → FAQ

### New
```
┌─────────────────────────────────────────────────────┐
│                                                     │
│  HERO SECTION                                       │
│  "Tu asesor inmobiliario inteligente"               │
│  "Herramientas gratuitas para tomar la mejor        │
│   decisión inmobiliaria de tu vida."                │
│                                                     │
│  [ Explorar herramientas ]   [ Analizar propiedad ] │
│                                                     │
├─────────────────────────────────────────────────────┤
│                                                     │
│  ¿QUÉ QUIERES SABER?                               │
│                                                     │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐          │
│  │ 💰       │  │ 🏠       │  │ ⚖️       │          │
│  │ ¿Me      │  │ ¿Cuánto  │  │ ¿Comprar │          │
│  │ alcanza  │  │ sería mi │  │ o        │          │
│  │ para     │  │ dividendo│  │ arrendar?│          │
│  │ comprar? │  │ ?        │  │          │          │
│  │ →        │  │ →        │  │ →        │          │
│  └──────────┘  └──────────┘  └──────────┘          │
│                                                     │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐          │
│  │ 🐷       │  │ 📊       │  │ 📋       │          │
│  │ ¿Cuánto  │  │ ¿Me      │  │ ¿Cuánto  │          │
│  │ necesito │  │ conviene │  │ de mi    │          │
│  │ ahorrar  │  │ prepagar │  │ sueldo   │          │
│  │ para el  │  │ mi       │  │ se va en │          │
│  │ pie?     │  │ crédito? │  │ vivienda?│          │
│  │ →        │  │ →        │  │ →        │          │
│  └──────────┘  └──────────┘  └──────────┘          │
│                                                     │
│  ┌──────────┐  ┌──────────┐                         │
│  │ 🗓️       │  │ ✅       │                         │
│  │ Mi plan  │  │ ¿Estás   │                         │
│  │ para     │  │ listo    │                         │
│  │ comprar  │  │ para     │                         │
│  │          │  │ comprar? │                         │
│  │ →        │  │ →        │                         │
│  └──────────┘  └──────────┘                         │
│                                                     │
├─────────────────────────────────────────────────────┤
│                                                     │
│  ANÁLISIS COMPLETO (existing hero, moved down)      │
│  "¿Ya tienes una propiedad en mente?"               │
│  3 escenarios, 8 bancos, PDF gratis                 │
│  [ Analizar ahora → ]                               │
│                                                     │
├─────────────────────────────────────────────────────┤
│                                                     │
│  INDICADORES EN VIVO (existing MarketIndicators)    │
│  UF | TPM | IPC | Dólar | IPV                       │
│                                                     │
├─────────────────────────────────────────────────────┤
│                                                     │
│  FEATURES (existing, restyled)                      │
│  • Datos reales  • Proyección 20 años               │
│  • 3 escenarios  • PDF + Excel gratis               │
│                                                     │
├─────────────────────────────────────────────────────┤
│                                                     │
│  PRO SECTION (mini pricing teaser)                  │
│  "¿Eres inversionista? Compara propiedades,         │
│   calcula IRR y DSCR con PropAdvisor Pro."          │
│  [ Ver planes → ]                                   │
│                                                     │
├─────────────────────────────────────────────────────┤
│                                                     │
│  FAQ (existing)                                     │
│                                                     │
└─────────────────────────────────────────────────────┘
```

---

## Navigation Update

### Current nav:
```
Calcular | Buscar | Guía | Dashboard | Precios
```

### New nav:
```
Herramientas ▾ | Analizar | Buscar | Guía | Pro ▾
```

**Herramientas dropdown:**
- ¿Me alcanza para comprar?
- ¿Cuánto sería mi dividendo?
- ¿Conviene comprar o arrendar?
- ¿Cuánto necesito para el pie?
- ¿Me conviene prepagar?
- Presupuesto de vivienda
- Plan de compra
- Test: ¿Estás listo?

**Pro dropdown:**
- Dashboard
- Precios
- Comparar propiedades

---

## SEO Strategy

Each tool page = a new long-tail keyword target:

| Tool | Target Keywords |
|---|---|
| /herramientas/me-alcanza | "cuánto puedo pedir de crédito hipotecario Chile", "simulador crédito hipotecario Chile" |
| /herramientas/dividendo | "calcular dividendo hipotecario Chile", "simulador dividendo Chile" |
| /herramientas/comprar-o-arrendar | "conviene comprar o arrendar Chile 2026", "comprar vs arrendar" |
| /herramientas/ahorrar-pie | "cuánto ahorrar para el pie Chile", "pie departamento Chile" |
| /herramientas/prepago | "prepago crédito hipotecario Chile", "conviene prepagar hipoteca" |
| /herramientas/presupuesto-vivienda | "presupuesto vivienda Chile", "cuánto gastar en arriendo" |
| /herramientas/plan-compra | "plan compra departamento Chile", "plan ahorro vivienda" |
| /herramientas/test-comprador | "estoy listo para comprar casa Chile", "test comprador vivienda" |

Each page will have:
- JSON-LD (WebApplication + FAQPage schema)
- generateMetadata with target keywords
- Canonical URL
- Internal links to /calcular and /guia

---

## Design Principles (from Benchmarks)

### From DealCheck:
- **Step-by-step wizard** — not all fields at once
- **One clear output** — not a wall of numbers
- **Professional reports** — exportable, shareable

### From Mashvisor:
- **Tool ecosystem** — multiple entry points, all interconnected
- **Data-driven trust** — "150M+ properties analyzed"
- **Market context** — always show market data alongside personal calcs

### From Propital:
- **Premium visual design** — gradients, cards, whitespace
- **Social proof** — testimonials, investor count, ROI numbers
- **Strong CTAs** — every section drives to action

### From BuyDepa:
- **Simple entry** — "Evalúa tu crédito en 5 minutos"
- **Credit simulation** — the gateway drug to engagement
- **Media mentions** — trust badges

### Our unique advantages:
- **Educational explanations** (CMF-inspired) — explain WHY, not just WHAT
- **Neutral, unbiased** — we're not selling properties, we analyze them
- **Chilean-specific data** — UF, comunas, 8 banks, real rates

---

## Revenue Integration — Every Tool Is a Revenue Point

### The Problem With "Educate Then Funnel"
If tools only educate and funnel to /calcular, each extra click = 40-60% drop-off.
A user who gets "Puedes comprar hasta UF 4,200" and leaves = wasted traffic.
**Every tool must capture value directly, not just drive to /calcular.**

### Revenue Layer Per Tool

| Tool | Lead Signal | Email Capture Trigger | Insurance CTA | Developer Properties | Pro Upsell |
|---|---|---|---|---|---|
| 1. ¿Me alcanza? | Income + debt + pie = GOLD intent data | "Enviar resultado a mi correo" (PDF-style) | ✅ "Tu hipoteca requiere seguro — cotiza aquí" | ✅ Show properties in their max price range | "Compara con IRR y DSCR →" |
| 2. ¿Cuánto sería mi dividendo? | Property price + bank = active buyer | "Guardar cálculo" (email required) | ✅ "El seguro cuesta ~$X/mes adicional" | ✅ "Propiedades similares en tu rango" | "Guarda en tu portfolio Pro →" |
| 3. ¿Comprar o arrendar? | Direct buyer intent | Simplified email gate (same as /calcular but lighter) | ✅ After "Comprar gana" result | ✅ "Ya que conviene comprar, mira estas opciones" | "Análisis completo con 20 métricas →" |
| 4. Ahorrar pie | Timeline = future buyer (nurture lead) | "Te avisamos cuando llegues a tu meta" (email) | ❌ Too early | ❌ Too early | ❌ Too early |
| 5. Prepago | Has existing mortgage = asset owner | "Enviar plan de prepago" (email) | ✅ "¿Tu seguro actual es competitivo?" | ❌ Already owns | "Analiza tu inversión actual →" |
| 6. Presupuesto vivienda | Income + housing spend = readiness signal | "Guardar presupuesto" (email) | ❌ Not yet buying | ❌ Not yet | "Plan de compra personalizado →" |
| 7. Plan compra | Property target + timeline = warm lead | "Recibir recordatorio mensual" (email) | ❌ Not yet | ✅ "Propiedades en tu rango meta" | "Portfolio de seguimiento →" |
| 8. Test comprador | Readiness score = lead quality score | "Ver mi resultado completo" (email) | ✅ If score ≥7: "Listo — cotiza tu seguro" | ✅ If score ≥7: property cards | If score ≥7: "Analiza tu primera propiedad →" |

### Lead Capture Strategy (Non-Blocking)

**Rule: Show the result FIRST, then capture email with a value-add.**

Current /calcular approach = email gate BLOCKS the result → friction, bad UX.
New tool approach = show the answer immediately, then offer something extra:

| Tool | What they get free | What requires email |
|---|---|---|
| 1. ¿Me alcanza? | "Puedes comprar hasta UF 4,200" | "Enviar resultado con desglose por banco (PDF)" |
| 2. Dividendo | "Tu dividendo sería $485,000/mes" | "Guardar cálculo y comparar después" |
| 3. Comprar/Arrendar | "Comprar gana por $18M en 20 años" | "Ver gráfico de proyección completa" |
| 4. Ahorrar pie | "En 18 meses tendrás tu pie" | "Recibir recordatorio mensual de progreso" |
| 5. Prepago | "Ahorrarías $12M en intereses" | "Enviar plan detallado a mi correo" |
| 6. Presupuesto | "34% de tu sueldo va a vivienda" | "Guardar y comparar con promedios" |
| 7. Plan compra | "Tu plan: 24 meses para comprar" | "Recibir hitos mensuales por email" |
| 8. Test | "Puntaje: 7/10 — Casi listo" | "Ver recomendaciones personalizadas" |

This approach:
- Gives immediate value → builds trust (CMF-style education)
- Offers EXTRA value behind email → natural opt-in (not forced gate)
- Each email captured includes tool context → richer lead scoring
- Expected opt-in rate: 30-40% (vs. 20% with forced gate)

### Broker Lead Scoring Enhancement

Each tool adds intent signals to the lead score:

| Signal | Points | Meaning |
|---|---|---|
| Used ¿Me alcanza? | +1 | Knows their budget |
| Used Dividendo | +1 | Evaluating specific property |
| Used Comprar/Arrendar | +2 | Active decision-making |
| Used Test + scored ≥7 | +2 | Ready to buy |
| Used Plan Compra (≤6 months) | +1 | Near-term buyer |
| Used Prepago | +0 | Already owns (different lead type) |
| Used 3+ tools in one session | +2 | Highly engaged |
| Completed /calcular full analysis | +3 | Serious buyer (existing) |
| Provided phone number | +2 | Existing |
| Has pre-approval | +3 | Existing |

**Max score: 10+ → HOT lead. These are worth CLP $30K-$50K to brokers.**

A user who uses 3 tools + completes full analysis + provides phone = score 10+ =
the most qualified lead in Chilean real estate. No competitor offers this.

### Revenue Projection (Revised with Tools)

**Before (single /calcular funnel):**
- 500 analyses/mo × 20% opt-in = 100 leads × $20K = CLP $2M/mo

**After (8 tools + /calcular):**
- 500 /calcular analyses/mo (unchanged)
- + 2,000 tool uses/mo (8 tools × 250 avg uses each)
- Total email captures: (500 × 20%) + (2,000 × 35%) = 100 + 700 = 800 contacts/mo
- Qualified leads (score ≥3): ~400/mo × $15K avg = **CLP $6M/mo**
- Hot leads (score ≥6): ~120/mo × $30K = **CLP $3.6M/mo** (subset)
- Insurance CTAs: 1,500 eligible × 10% CTR × 20% conv × $80K = **CLP $2.4M/mo**
- Developer property clicks: 1,000 eligible × 15% CTR = 150 clicks × $5K/click = **CLP $750K/mo**
- Pro upsell: 800 contacts × 3% → 24 Pro subs × $25K = **CLP $600K/mo**
- Email nurture: 800 new/mo → 4,800 at M6 × $100K/send = **CLP $480K/mo**

**Total projected at M6: CLP $10M-$14M/mo** (vs. $3M-$8M without tools)

---

## Implementation Phases (Revenue-Aligned)

### Phase 1: Foundation + Revenue Wiring (Week 1-2)
- [ ] Create `/herramientas` hub page with 8 tool cards
- [ ] Build shared ToolLayout with integrated: email capture, insurance CTA, property cards, Pro upsell
- [ ] Build Tool #1: ¿Me alcanza para comprar? (affordability) — with all revenue layers
- [ ] Build Tool #2: ¿Cuánto sería mi dividendo? (quick mortgage) — with all revenue layers
- [ ] Build Tool #3: ¿Conviene comprar o arrendar? (simplified) — with all revenue layers
- [ ] Update homepage with question grid + new hero
- [ ] Update navigation (Herramientas dropdown)
- [ ] Add tool usage to lead scoring system (lib/brokerRouting.ts)
- [ ] Analytics events: tool_started, tool_completed, tool_email_captured, tool_cta_clicked

### Phase 2: Financial Planning Tools (Week 3-4)
- [ ] Build Tool #4: ¿Cuánto necesito ahorrar para el pie?
- [ ] Build Tool #5: ¿Me conviene prepagar mi crédito?
- [ ] Build Tool #6: Presupuesto de vivienda
- [ ] Build Tool #7: Plan de compra
- [ ] Build Tool #8: Test ¿Estás listo para comprar?
- [ ] Wire email nurture triggers (Resend) for tools #4 and #7 (monthly reminders)

### Phase 3: Polish & SEO (Week 5)
- [ ] JSON-LD schemas for all 8 tool pages
- [ ] generateMetadata for SEO on all pages
- [ ] Cross-linking between tools (related questions)
- [ ] sitemap.ts update with new URLs
- [ ] Internal links from /guia to relevant tools
- [ ] Per-tool analytics dashboard

### Phase 4: Revenue Optimization (Week 6)
- [ ] A/B test email capture: "Enviar PDF" vs. "Guardar resultado" vs. "Recibir actualización"
- [ ] Multi-tool session tracking → enriched lead profiles for brokers
- [ ] Contextual insurance CTA copy testing per tool
- [ ] Developer property card click-through tracking + attribution
- [ ] Social share buttons on results → organic growth loop

---

## Revenue Impact Summary

### Lead Generation (8x multiplier)
Each tool creates a NEW micro-funnel with its own email capture + broker lead + insurance CTA.
**8 tools = 8x entry points, each with revenue-generating touchpoints.**
Tools capture email with value-add (not gate) → expected 35% opt-in vs. 20% forced gate.

### SEO Multiplication
- Current: ~3 indexable pages (home, /calcular, /guia)
- After: 11+ indexable pages, each targeting different long-tail keywords
- Expected organic traffic increase: **3-5x within 3 months**

### User Understanding + Trust
- Users START with a question they understand → immediate value → trust
- Trust → higher email opt-in rate → more leads → more revenue
- Educational explanations build authority → LLM citations → more organic traffic

### Pro Conversion (2x expected)
- Tools create "aha moments" that make Pro features obvious
- "You calculated your dividendo — now compare 10 properties side by side with Pro"
- Multi-tool users are 3x more likely to convert to Pro (they're engaged)

### Compound Effect
- More tools → more SEO pages → more traffic → more tool uses → more leads → more revenue
- Each tool use enriches lead profiles → higher lead quality → higher prices per lead
- Email list grows 8x faster → email monetization viable sooner

---

## Technical Notes

### Shared Components
```
components/
  ToolLayout.tsx        — Standard layout for all tool pages
  ToolResult.tsx        — Result card with gradient/animation
  ToolExplanation.tsx   — Educational "¿Qué significa esto?" section  
  ToolCTA.tsx           — CTA block to /calcular or /pricing
  RelatedTools.tsx      — "Preguntas relacionadas" grid
  QuizEngine.tsx        — Reusable quiz component for Tool #8
```

### Shared Logic
```
lib/
  toolCalculations.ts   — Pure functions for all 8 tools
  toolData.ts           — Questions, explanations, quiz data
```

### Data Flow
- Tools use the SAME bank rates, UF value, and comuna data as /calcular
- No new API endpoints needed — all calculations are client-side
- Tool results can pre-fill /calcular inputs (via URL params)

---

## Key Differentiator vs. CMF

CMF's tools are **generic financial education** (fondos mutuos, tarjetas, vacaciones).

PropAdvisor's tools are **laser-focused on the home buying journey**, using:
- Real Chilean bank rates (8 banks, updated)
- UF in real-time
- Per-comuna appreciation data
- The same engine that powers the full analysis

We're not competing with CMF — we're **filling the gap** between generic financial education and actual home buying decisions.

---

## Summary

| Metric | Before | After |
|---|---|---|
| Entry points | 1 (/calcular) | 9 (8 tools + /calcular) |
| Minimum inputs to get value | 8+ fields | 2-3 fields |
| User understanding required | High (UF, tasa, cap rate) | Low (sueldo, precio) |
| SEO-targetable pages | ~3 | 11+ |
| Lead capture opportunities | 1 | 9 |
| Educational content | Guide only | Inline in every tool |
| Mobile experience | Heavy calculator | Quick, focused tools |

**This is the DealCheck + CMF Educa hybrid for Chile.** No one else is doing this.
