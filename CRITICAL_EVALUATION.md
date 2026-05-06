# PropAdvisor CL — Critical Revenue Evaluation

_Last updated: May 6, 2026_

## Executive Summary

PropAdvisor has strong infrastructure — 8 bank rates, 60+ comunas, 3-scenario analysis engine, lead scoring, broker routing, Stripe billing, Clerk auth, portfolio dashboard — but **$0 actual revenue**. The SaaS subscription (CLP $15K/mo) is unlikely to drive meaningful Year 1 revenue due to Chile's small investor market and low SaaS adoption for intermittent-use tools. Broker lead sales are the fastest path to first revenue but remain completely unactivated despite the code being 100% ready.

This document re-evaluates every revenue stream with a critical Chilean RE market lens, identifies a missing revenue stream (insurance affiliates), and reorders execution priorities.

---

## Stream-by-Stream Critical Analysis

### Stream 1: Pro SaaS Subscription (CLP $15K/mo) — KEEP BUT DEPRIORITIZE

**Current status:** Fully built. Stripe checkout, 7-day trial, webhook lifecycle, billing portal, Pro gating on /dashboard/[id] and /dashboard/compare.

**Problems:**

1. **Dead-zone pricing.** CLP $15K/mo ($15 USD) is too cheap for serious investors evaluating UF 3,000+ properties (they'd pay $50-$100/mo for real value) and too expensive for casual browsers who already got the core 3-scenario comparison for free.

2. **Chile resists monthly subscriptions for intermittent tools.** Property investors analyze properties for 2-3 months, then stop. They won't maintain a CLP $15K/mo subscription for a tool they use 6 times. Chilean professionals prefer *boleta por uso* (pay-per-use).

3. **Free tier gives away 80% of the value.** The 3-scenario 20-year comparison, 8 bank rates, real UF data, dividendo calculation, cap rate, and cash-on-cash are all free. IRR/DSCR are "nice to have" — any serious investor can calculate these in Excel or ask their bank.

4. **Tiny TAM.** ~80K property investors/year in Chile. Realistic tool adoption: 5-10K. At 5% paid conversion = 250-500 subs max = CLP $3.75M-$7.5M/mo ceiling. The original projection of 1,000 subs at month 12 (needing 15,000 free users at 6.6% conversion) is very aggressive for niche Chilean financial SaaS.

5. **No Chilean competitor validates demand.** DealCheck and Mashvisor exist in the US, but Chilean investors have never paid for a similar tool. Market education cost is unknown.

**What to change:**
- Add **pay-per-analysis**: CLP $3,000-$5,000 for a single advanced analysis (IRR, DSCR, year-by-year table) without requiring monthly commitment
- Raise Pro to **CLP $25K-$30K/mo** and add a **"Profesional" tier at CLP $75K/mo** for corredores/brokers who analyze multiple properties for clients
- Add **annual pricing**: CLP $200K/year (save 33%) for Pro
- Use Pro subscription primarily as a **lead quality signal** (Pro users = serious investors = premium leads for brokers)

**Revised revenue expectation:** CLP $750K-$2M/mo at month 6. Secondary revenue stream.

---

### Stream 2: Broker Lead Sales — #1 REVENUE PRIORITY. ACTIVATE IMMEDIATELY.

**Current status:** Infrastructure 100% built — lead scoring (0-10), dedup (30-min window), broker routing by city/comuna/score/purpose/price, HTML email notifications via Resend. Revenue = $0.

**Why $0:**
- Only 1 hardcoded broker (Valparaíso → luisfsande@hotmail.com). Santiago — 60% of Chilean mortgage originations — has zero active routes.
- No broker agreements signed.
- No payment mechanism for brokers (no invoice, no billing, no tracking of lead outcomes).
- The highest-quality leads (Pro users clicking "Conectar con ejecutivo" on /dashboard/[id]) are gated behind a paywall with ~0 paying users right now.

**Why this is the best stream:**
- Chilean mortgage brokers already buy leads from Facebook Ads, Google Ads, and cold-call centers for CLP $10K-$50K per lead.
- PropAdvisor leads are **higher quality**: the user has identified a specific property, defined their budget, chosen a down payment %, and expressed explicit intent. No cold-call center delivers this.
- One broker agreement is enough to start. No bank partnership needed.
- The code is ready. The bottleneck is 100% business development, not engineering.

**What to change:**
- Move "¿Quieres que un ejecutivo te contacte?" CTA to the **FREE analysis results page** — not just Pro dashboard. Every user who completes an analysis should see this prominently.
- Activate Santiago broker routing immediately.
- Add **WhatsApp delivery** for leads — Chilean brokers respond 10x faster on WhatsApp than email.
- Sign 1 Santiago mortgage broker within 30 days — offer first 30 leads free as quality proof.
- Charge CLP $20K-$30K per qualified lead (score ≥6), CLP $10K for warm leads (score 3-5).

**Revenue projection:** 500 analyses/mo × 20% opt-in = 100 leads × CLP $20K avg = **CLP $2M/mo**

---

### Stream 3: Insurance Affiliate — MISSING. ADD THIS.

**Current status:** Not mentioned in BUSINESS_MODEL.md. Zero implementation.

**Why this is low-hanging fruit:**

1. Every mortgage buyer in Chile **must** purchase *seguro de desgravamen* (life insurance) + *seguro de incendio* (fire insurance). It's legally required for mortgage approval.

2. Chilean insurance companies (Consorcio, BCI Seguros, Sura, MetLife) **DO run affiliate/referral programs** — unlike banks, which don't have tracking infrastructure for affiliates.

3. Average annual premium: CLP $300K-$800K/year. Affiliate commission: 10-20% = **CLP $30K-$160K per referral**.

4. PropAdvisor already collects every input an insurer needs for a quote: property value, loan amount, buyer age range (from income bracket), city, property type.

5. Implementation is trivial: a "Cotiza tu seguro hipotecario" button on the analysis results page that links to an insurer's landing page with UTM parameters.

**Why this works when bank affiliates don't:**
- Insurers have tracking infrastructure (cookie-based attribution, UTM parameters, referral codes)
- Insurance purchase happens online (unlike mortgage origination which is branch-based)
- Multiple insurers compete for the same buyer — they're motivated to pay for leads
- No attribution ambiguity: user clicks → quotes → buys. Clear funnel.

**Revenue projection:** 500 analyses/mo × 10% click-through × 20% conversion × CLP $80K avg commission = **CLP $800K/mo**

---

### Stream 4: Sponsored Bank Placement (CLP $500K-$2M/mo) — HOLD. NEEDS TRAFFIC.

**Current status:** Zero implementation. No bank relationships.

**Assessment:** Good concept — banks spend millions on "crédito hipotecario" Google Ads, and PropAdvisor users are mid-decision. But banks won't pay for visibility unless you can prove >1,000 analyses/month with analytics. This is a Month 6-12 play.

**What to prepare now:**
- Track and display analysis volume in Vercel Analytics
- Prepare a media kit (traffic data, user demographics, lead quality metrics)
- When ready: "Banco recomendado" badge next to rate comparison is natural and non-intrusive

---

### Stream 5: Developer Featured Projects — TOO EARLY

**Current status:** Zero implementation. Search/listing functionality barely exists (only /buscar with basic property search).

**Assessment:** Inmobiliarias want guaranteed eyeballs (1,000+/mo minimum). The search product needs significant work before developers would pay for placement. Year 2 play. Skip for now.

---

### Stream 6: Email Nurture + Sponsored Sends — LOW EFFORT, HIGH IMPACT

**Current status:** Resend infrastructure ready. Contacts accumulating in RESEND_AUDIENCE_ID. Zero campaigns sent.

**Assessment:** Even 1 monthly email keeps users engaged and drives return visits. A curated "Tasas hipotecarias — Mayo 2026" email with a sponsored section from a broker or insurer is worth CLP $50K-$200K per send. At 5,000 contacts: CLP $200K-$500K/mo.

**What to do:**
- Create first email template: "Actualización tasas hipotecarias — [Month] 2026"
- Send monthly to full audience
- Include sponsored section for broker/insurer partner after first agreement is signed

---

### Stream 7: B2B White-Label API — YEAR 2+

**Assessment:** Requires proven traffic (>10K monthly analyses), legal entity, and API documentation. Not relevant for first 12 months. Keep in long-term roadmap.

---

## Revised Revenue Priority Matrix

| Priority | Stream | First Revenue | Month 6 Target (CLP) | Effort | Status |
|----------|--------|---------------|----------------------|--------|--------|
| **1** | Broker lead sales | Month 1-2 | $2M-$4M | LOW (code ready, need agreements) | Infra built, $0 revenue |
| **2** | Insurance affiliate | Month 2-3 | $500K-$1.5M | MEDIUM (new CTA + partner) | Not started |
| **3** | Pro SaaS (repriced) | Month 3-6 | $750K-$2M | LOW (already built, tweak pricing) | Live but $0 revenue |
| **4** | Email nurture + sponsored | Month 3-4 | $200K-$500K | LOW (Resend ready) | Infra ready, $0 revenue |
| **5** | Bank sponsorship | Month 6-12 | $500K-$2M | MEDIUM (needs traffic proof) | Not started |

**Conservative Month 6 total: CLP $4M-$10M/mo ($4K-$10K USD)**
**Conservative Month 12 total: CLP $10M-$25M/mo ($10K-$25K USD)**

---

## What's Blocking Revenue Right Now

| Blocker | Type | Fix |
|---------|------|-----|
| No Santiago broker route active | Code | Uncomment/configure in brokerRouting.ts |
| Broker CTA only in Pro dashboard | Code | Add to free analysis results page |
| No broker agreement signed | Business | Sign 1 broker, offer 30 free leads |
| No insurance affiliate | Code + Business | Add CTA + sign 1 insurer |
| No email campaigns | Content | Create 1 template, send monthly |
| No WhatsApp lead delivery | Code | Add WhatsApp notification to send-analysis API |
| Unknown traffic volume | Analytics | Check Vercel Analytics for current numbers |
| SaaS pricing in dead zone | Code | Add pay-per-use + raise Pro pricing |

---

## Key Strategic Decisions

1. **Pro subscription is SECONDARY to lead sales.** Don't over-invest in Pro features until lead revenue is proven. The free tool is the funnel — make it generous.

2. **Free tier should gate LESS, not more.** Every gate reduces the number of completed analyses, which reduces the number of leads. The real money is in the leads, not the subscription.

3. **Pay-per-use is critical for Chile.** Monthly subscriptions face resistance for tools used intermittently during a 2-3 month property search.

4. **WhatsApp > Email for broker delivery.** Chilean brokers live on WhatsApp. A lead delivered by WhatsApp gets contacted in 5 minutes. An email lead gets contacted in 24 hours (maybe).

5. **Insurance is the overlooked stream.** Every other Chilean RE tool ignores insurance. But it's legally required, affiliate-friendly, and the user data is already captured.

---

## Planned Features — Next Phases

### WhatsApp Lead Delivery (Phase 2 — High Priority)

Chilean brokers respond 10x faster on WhatsApp than email. Two implementation levels:

**Level 1 — WhatsApp link in broker email (30 min):**
- Add a `wa.me/{phone}?text=...` link in the broker notification email HTML
- When a lead includes a phone number, the broker sees a "Contactar por WhatsApp" button
- Pre-fills message: "Hola {name}, soy ejecutivo hipotecario. Vi que estás evaluando una propiedad en {city} por UF {price}..."
- Zero API cost, uses existing Resend email infrastructure
- Change file: `app/api/send-analysis/route.ts` — add WhatsApp button to `brokerHtml` template

**Level 2 — Direct WhatsApp notification (Month 3+):**
- WhatsApp Business API via Twilio or Meta Cloud API
- Send lead notification directly to broker's WhatsApp (not email)
- ~$0.05/message, requires Meta Business verification
- Needs: Twilio account + `TWILIO_WHATSAPP_SID` env var

### AI Chat Bot for Questions + Referrals (Phase 2-3)

Floating chat widget that answers real estate questions and qualifies leads conversationally.

**Level 1 — FAQ Chatbot (1-2 days to build):**
- Stack: OpenAI API (GPT-4o-mini, ~$0.01-$0.03/conversation) + `<ChatWidget />` component + `/api/chat` route
- System prompt contains: FAQ, bank rates, comuna data, insurance info, PropAdvisor features
- Answers: "¿Cuánto pie necesito?", "¿Qué banco tiene mejor tasa?", "¿Conviene DFL2?"
- Every answer ends with contextual CTA → "¿Quieres que un ejecutivo te ayude?" → triggers broker lead flow
- Place on: `/calcular`, `/analisis/[id]`, `/pricing`
- Env var needed: `OPENAI_API_KEY`

**Level 2 — Referral/Qualification Bot (Month 3+):**
- After answering questions, bot qualifies the user conversationally
- "¿Ya tienes una propiedad en mente? ¿Cuánto es tu presupuesto? ¿Tienes pie disponible?"
- Based on answers, routes to: broker CTA, insurance CTA, or calculator
- Uses OpenAI function calling to trigger lead submission to `/api/send-analysis`
- Essentially a conversational lead qualification funnel — higher conversion than form-based

**Revenue angle:** Bot-qualified leads are worth MORE to brokers (pre-qualified with budget, intent, timeline). Could charge CLP $30K-$50K per bot-qualified lead vs $20K for form-based.

### Insurance Module (Phase 2-3)

| Phase | What | Status | Effort |
|-------|------|--------|--------|
| 1 | CTA button with estimated premium, links to insurer externally | ✅ Built | Done |
| 2 | Quote comparison — user enters age, loan amount → sees 3-4 insurer quotes side by side | Not started | 1 week (needs insurer API or manual rate tables) |
| 3 | In-app application — user applies directly, affiliate commission tracked automatically | Not started | Needs formal insurer partnership + API |

Phase 2 is the sweet spot: adds real value (compare insurance prices, nobody does this in Chile) + gives leverage to negotiate affiliate deals.

---

## Open Questions

1. **Current monthly analysis volume?** All projections depend on this. If <100/month, traffic growth must be Phase 1.
2. **Existing broker relationships?** Warm introductions to Santiago brokers accelerate everything.
3. **Legal entity status?** Formal agreements need a Chilean RUT/empresa.
4. **Insurance partner availability?** Which insurers have active affiliate programs?
