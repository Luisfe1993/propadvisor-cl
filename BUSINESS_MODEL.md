# PropAdvisor CL — Business Model

_Last updated: May 20, 2026 — Revenue streams revised with PM Monetization Strategy, Pricing Strategy, and Growth Loops frameworks_

---

## One-Line Pitch

PropAdvisor is the first platform in Chile that calculates whether buying or renting is the better financial decision — for free, in under 5 minutes. Revenue comes from what happens with the high-intent buyer data afterward.

---

## Who Uses It

| Segment | Trigger | Annual TAM |
|---|---|---|
| First-time buyers (28–40 yrs) | Thinking about buying their first home | ~400K/year |
| Investors | Evaluating whether a property generates positive cash flow | ~80K/year |
| Renters | Wondering if now is the right time to buy | ~1.2M in major cities |

**Primary user:** Middle-class Chilean, 28–45 years old, household income CLP $2M–$6M/month, considering their first property purchase in Santiago, Valparaíso, or Concepción.

---

## The Real Asset

PropAdvisor's value is not the calculator — it's the **email + full financial profile of high-intent buyers**. Every person who uses the tool has: identified a specific property, defined their budget, chosen a down payment %, selected a bank, and expressed intent to buy. That is the highest-quality lead in Chilean real estate.

The tool is free because giving away the analysis builds trust and captures the lead.

---

## What's Built (as of May 2026)

| Asset | Status | Revenue Potential |
|---|---|---|
| 3-scenario 20-year calculator (8 banks, 60+ comunas, live UF) | ✅ Live | Funnel — drives everything |
| Lead scoring (0-10) + broker routing by city/score/intent | ✅ Live | Lead sales revenue |
| Santiago + nationwide investment lead routing | ✅ Live | Captures 60%+ of market |
| Email gate with broker opt-in + qualification fields | ✅ Live | Lead capture |
| Insurance CTA ("Cotiza tu seguro hipotecario") | ✅ Live | Insurance affiliate |
| After-click opportunities view (matching properties) | ✅ Live | Developer placements |
| Standalone broker CTA on free results page | ✅ Live | Increases opt-in rate |
| Pro SaaS ($15K CLP/mo): portfolio, IRR, DSCR, comparison | ✅ Live | SaaS MRR |
| Profesional tier ($75K CLP/mo) for corredores | ✅ Live | Enterprise SaaS |
| World-class educational guide (8 sections, scrollspy) | ✅ Live | SEO + LLM traffic |
| Stripe billing + Clerk auth + Neon DB | ✅ Live | Infrastructure |
| Resend email audience (growing) | ✅ Live | Email monetization |

---

## Path to Revenue — 5 Streams

_Applying Monetization Strategy, Pricing Strategy, and Growth Loops frameworks (PM Skills)._

### Revenue Architecture Overview

PropAdvisor's monetization follows a **hybrid model**: a free high-value tool generates qualified leads (marketplace-style revenue), while premium features drive SaaS recurring revenue. The key insight: the free tool is not the product — it's the distribution engine.

```
┌─────────────────────────────────────────────────────────────────────┐
│                     REVENUE ARCHITECTURE                            │
│                                                                     │
│  FREE TOOL (distribution engine)                                    │
│  ┌────────────┐    ┌────────────┐    ┌────────────┐                │
│  │ Calculator  │───▶│ Email Gate  │───▶│ Lead Score  │               │
│  │ (8 banks)   │    │ (profile)   │    │ (0-10)      │               │
│  └────────────┘    └────────────┘    └─────┬──────┘               │
│                                            │                        │
│          ┌─────────────────────────────────┼────────────────┐       │
│          │                                 │                │       │
│          ▼                                 ▼                ▼       │
│  ┌──────────────┐  ┌──────────────────┐  ┌──────────────┐          │
│  │ STREAM 1     │  │ STREAM 2         │  │ STREAM 3     │          │
│  │ Broker Leads │  │ Insurance Affl.  │  │ Dev. Placements│         │
│  │ (per-lead)   │  │ (per-conversion) │  │ (per-month)  │          │
│  │ CLP $20K ea  │  │ CLP $80K comm.   │  │ CLP $500K/mo │          │
│  └──────────────┘  └──────────────────┘  └──────────────┘          │
│                                                                     │
│  SAAS ENGINE (recurring revenue)                                    │
│  ┌──────────────┐  ┌──────────────┐                                │
│  │ STREAM 4     │  │ STREAM 5     │                                │
│  │ Pro SaaS     │  │ Email Nurture│                                │
│  │ $15K-$75K/mo │  │ Sponsored    │                                │
│  └──────────────┘  └──────────────┘                                │
└─────────────────────────────────────────────────────────────────────┘
```

---

### Stream 1: Broker Lead Sales — FIRST REVENUE

> **Model type:** Marketplace / Lead Generation (transaction fee per qualified lead)

**What:** Sell qualified buyer leads to mortgage brokers. Each lead includes: email, property details, budget, down payment %, bank preference, income range, pre-approval status, and explicit opt-in consent.

**Why it works:** Brokers already pay CLP $10K–$50K per lead from Facebook/Google. Our leads are higher quality — the user has identified a specific property, defined their budget, and explicitly asked to be contacted. This is bottom-of-funnel intent, not top-of-funnel awareness.

**What's built:**
- ✅ Lead scoring (0-10): phone (+2), pre-approval (+3), high income (+2), pie available (+1), premium comuna (+1)
- ✅ Broker routing by city, comuna, score, property type, price range
- ✅ Santiago + investment leads active (routes to BROKER_NOTIFY_EMAIL)
- ✅ HTML email notifications with lead tier (🔥 HOT ≥6 / 🟡 WARM 3-5 / 🔵 COLD <3)
- ✅ 30-min dedup window, disposable email blocking
- ✅ WhatsApp link pre-populated in broker notification
- ✅ Debt-to-income ratio color-coded risk assessment

**Reality check (code audit May 2026):**
- ⚠️ Leads currently route to dev email (luisfsande@hotmail.com) — no real broker signed yet
- ⚠️ South/North region routing commented out (Santiago + Valparaíso only)
- ⚠️ Dedup is in-memory (resets on cold start — needs Redis or DB-backed dedup)

**Unit Economics:**

| Metric | Estimate | Assumption |
|--------|----------|------------|
| CAC per lead | CLP $0 | Organic traffic, no paid ads |
| Revenue per HOT lead (≥6) | CLP $25K–$35K | Benchmarked vs. Facebook lead cost for brokers |
| Revenue per WARM lead (3-5) | CLP $10K–$15K | Lower conversion probability |
| COLD leads | CLP $0 (not sold) | Quality floor — protects broker trust |
| Lead opt-in rate | 15-25% | Based on email gate with pre-checked broker checkbox |
| Broker close rate on hot leads | 8-15% | Industry avg for pre-qualified mortgage leads |

**Pricing Strategy:**

| Tier | Lead Score | Price/Lead | What Broker Gets |
|------|-----------|------------|-----------------|
| 🔥 Premium | ≥7 (phone + pre-approved + high income) | CLP $35K | Exclusive lead, WhatsApp-ready, pre-approved buyer |
| 🔥 Hot | 6 | CLP $20K | High-intent lead, contact info, property details |
| 🟡 Warm | 3-5 | CLP $10K | Interested buyer, email only, needs nurturing |
| 🔵 Cold | <3 | Not sold | Added to email nurture → re-scored later |

**Validation Experiment:**
1. Sign 1 Santiago broker — offer **30 free leads** over 2 weeks as quality proof
2. Track: response time, contact rate, conversion to meeting, conversion to deal
3. **Success criteria:** Broker agrees to pay after trial; ≥2 leads convert to meetings within 30 days
4. **Kill criteria:** <50% contact rate on HOT leads, or broker says quality is worse than Facebook

**Growth Loop (Referral):** Happy brokers refer other brokers → more broker demand → can increase lead prices or sell to multiple brokers per region.

**Projection (conservative):**

| Volume | Leads/mo | Revenue/mo |
|--------|---------|------------|
| 300 analyses/mo (Month 2-3) | 45-75 leads × 60% sellable | CLP $600K–$1.2M |
| 700 analyses/mo (Month 4-6) | 105-175 × 60% sellable | CLP $1.4M–$2.8M |
| 2,000 analyses/mo (Month 8+) | 300-500 × 60% sellable | CLP $3.6M–$8M |

**Next actions:**
1. → **NOW:** Identify 3 Santiago mortgage brokers (LinkedIn, Findex, BrokerHipotecario.cl)
2. → **NOW:** Pitch free trial: "30 leads, 2 weeks, zero risk. You only pay if they convert."
3. → **WEEK 2:** Add WhatsApp Business API delivery (brokers respond 10x faster than email)
4. → **MONTH 2:** Move dedup from in-memory to Neon DB to survive cold starts

---

### Stream 2: Insurance Affiliate — LOW-HANGING FRUIT

> **Model type:** Affiliate / Revenue share (commission per conversion)

**What:** Every mortgage buyer in Chile must legally purchase seguro de desgravamen (life) + seguro de incendio (fire). Chilean insurers (Consorcio, BCI Seguros, Sura, MetLife) run affiliate/referral programs with tracking infrastructure.

**Why it works:** 100% of mortgage buyers need insurance. The purchase decision happens *during* the mortgage process — exactly when they're using PropAdvisor. Unlike banks, insurers have affiliate programs with UTM tracking, referral codes, and conversion attribution.

**What's built:**
- ✅ Insurance CTA on results page: "¿Sabías que necesitas seguro para tu crédito hipotecario?"
- ✅ Links to Consorcio with UTM parameters (`utm_source=propadvisor`)
- ✅ Analytics tracking (`insurance_cta_clicked` with page, price, city, comuna)

**Reality check (code audit May 2026):**
- ⚠️ Current link is a **generic Consorcio referral** — no affiliate agreement or commission tracking
- ⚠️ No A/B testing of CTA placement, copy, or design
- ⚠️ No tracking of downstream conversion (click → quote → purchase)

**Unit Economics:**

| Metric | Estimate | Assumption |
|--------|----------|------------|
| Insurance CTA CTR | 5-12% | Contextual CTA on results page |
| Quote-to-purchase rate | 15-25% | Comparison shopping; 1 of 3-4 quotes wins |
| Avg. annual premium (desgravamen + incendio) | CLP $400K–$800K | Based on UF 3,000 property |
| Commission rate | 15-25% of first year premium | Standard insurance affiliate in Chile |
| Commission per conversion | CLP $60K–$200K | Wide range depending on property value |

**Pricing Strategy:** Not our pricing — insurer sets commission. Negotiate:
- **Floor:** 15% first-year premium (standard affiliate)
- **Target:** 20% + CLP $10K signup bonus per referred policy
- **Stretch:** Revenue share on renewal years (recurring commission)

**Validation Experiment:**
1. Email Consorcio & BCI Seguros partnership teams with traffic/click data from analytics
2. Offer: "We send X clicks/month of qualified mortgage buyers to your quote page"
3. **Success criteria:** Signed affiliate agreement with ≥15% commission, tracked referral URL
4. **Kill criteria:** No insurer responds after 10 outreach attempts across 4 companies

**Projection:**

| Volume | Clicks/mo | Revenue/mo |
|--------|----------|------------|
| 300 analyses (Month 3) | 15-36 clicks → 3-9 policies | CLP $180K–$1.8M |
| 700 analyses (Month 5) | 35-84 clicks → 7-21 policies | CLP $420K–$4.2M |
| 2,000 analyses (Month 8+) | 100-240 clicks → 20-60 policies | CLP $1.2M–$12M |

**Next actions:**
1. → **NOW:** Pull `insurance_cta_clicked` analytics data to build pitch deck
2. → **WEEK 2:** Contact Consorcio, BCI Seguros, Sura, MetLife affiliate/partnership teams
3. → **MONTH 2:** Replace generic link with tracked affiliate URL + implement conversion pixel
4. → **MONTH 3:** A/B test CTA copy: "Cotiza tu seguro" vs "Ahorra hasta 30% en tu seguro hipotecario"

---

### Stream 3: Developer Featured Properties — NATIVE MONETIZATION

> **Model type:** Advertising / Sponsored placement (monthly fee per project)

**What:** After completing their analysis and submitting their email, users see "Propiedades que podrían interesarte" — matching properties in their price range and city. Developers pay for their projects to appear in this high-intent placement.

**Why it works:** Developers spend CLP $5M–$50M/month on marketing per project. PropAdvisor offers their project to a user who just analyzed a property in the same neighborhood at the same price point. It doesn't feel like an ad — it feels like a personalized recommendation. The audience is the most qualified possible: a buyer who has defined their budget, chosen a bank, and calculated their mortgage.

**What's built:**
- ✅ OpportunitiesView component: horizontal scrollable cards with image, price, location, rent estimate
- ✅ Matching algorithm: ±40% price range, same city, shuffled for variety
- ✅ Analytics tracking (`opportunities_shown`, `opportunity_clicked`, `opportunities_view_more`)
- ✅ Links to full analysis page (`/analisis/{id}`) for each property

**Reality check (code audit May 2026):**
- ⚠️ **All properties are mock data** — zero real developer listings
- ⚠️ No admin panel for developers to manage listings
- ⚠️ No impression/click reporting for developers
- ⚠️ Requires significant traffic volume to be sellable (≥1,000 analyses/mo)

**Unit Economics:**

| Metric | Estimate | Assumption |
|--------|----------|------------|
| Minimum traffic to sell | 1,000 analyses/month | Developer needs ≥200 impressions/mo to justify spend |
| Price per featured project | CLP $200K–$1M/month | Based on developer digital ad spend benchmarks |
| Developer close rate | 10-20% of pitched | Inmobiliarias are used to paying for digital leads |
| Avg. developer contract | 3-6 months | Aligned with project sales timeline |
| CAC per developer | CLP $0 (direct sales) | Founder-led outreach to inmobiliarias |

**Pricing Strategy (tiered by traffic):**

| Tier | Monthly Impressions | Price/Month | Includes |
|------|-------------------|-------------|----------|
| Starter | Up to 500 impressions | CLP $200K | 1 project, basic placement |
| Growth | Up to 2,000 impressions | CLP $500K | 2 projects, priority matching |
| Premium | Unlimited + homepage feature | CLP $1M | 3 projects, homepage card, monthly report |

**Validation Experiment:**
1. Identify 5 inmobiliarias with active projects in Santiago (Providencia, Ñuñoa, Las Condes)
2. Pitch: "Your project shown to qualified buyers who just analyzed a similar property in your area — free 30-day trial"
3. **Success criteria:** 1 developer signs paid contract after trial
4. **Kill criteria:** 5 developers decline citing insufficient traffic volume

**When to activate:** Month 6-9 (needs ≥1,000 analyses/month; premature sales pitch damages credibility)

**Projection:**

| Volume | Developers | Revenue/mo |
|--------|-----------|------------|
| 1,000 analyses (Month 6) | 1-2 developers | CLP $200K–$1M |
| 3,000 analyses (Month 9) | 3-5 developers | CLP $1M–$3.5M |
| 5,000+ analyses (Year 2) | 5-10 developers | CLP $3.5M–$8M |

**Next actions:**
1. → **MONTH 3:** Replace mock data with real Mercado Libre API listings (see REAL_DATA_PLAN.md)
2. → **MONTH 6:** Build simple developer dashboard (upload project, view impressions/clicks)
3. → **MONTH 6:** Begin outreach to 5 Santiago inmobiliarias with traffic data

---

### Stream 4: Pro SaaS Subscription — RECURRING REVENUE

> **Model type:** Freemium + Tiered Subscription (monthly recurring revenue)

**What:** Premium investor tools: portfolio dashboard, IRR, DSCR, vacancy modeling, tax calculator, property comparison, investor memo PDF export. The free tier is generous enough to drive adoption; the paid tier converts serious investors.

**Current pricing:**

| Feature | Free (CLP $0) | Pro (CLP $15K/mo) | Profesional (CLP $75K/mo) |
|---------|-------------|-------------------|--------------------------|
| Analyses | Unlimited | Unlimited | Unlimited client analyses |
| PDF + Excel export | ✅ | ✅ | ✅ |
| 8 bank rates | ✅ | ✅ | ✅ |
| Comuna data | ✅ | ✅ | ✅ |
| Broker contact | ✅ | ✅ | ✅ |
| Portfolio (saved properties) | 1 property | Unlimited | Unlimited |
| Compare side-by-side | ❌ | Up to 10 | Up to 10 |
| Vacancy modeling | ❌ | ✅ (0-20%) | ✅ |
| Expense breakdown | ❌ | ✅ (GGCC, insurance, admin) | ✅ |
| Tax calculator | ❌ | ✅ (contribuciones, DFL2) | ✅ |
| IRR / DSCR / Cash-on-cash | ❌ | ✅ | ✅ |
| Investor memo PDF | ❌ | ✅ | ✅ White-label (branded) |
| Priority support | ❌ | ❌ | ✅ |

**What's built:**
- ✅ Stripe checkout with 7-day free trial (no card required)
- ✅ Webhook lifecycle: checkout.session.completed → subscription.updated → subscription.deleted
- ✅ Feature gating: portfolio limited to 1 for free users, memo requires Pro
- ✅ Billing portal for subscription management
- ✅ Database: subscriptions table with plan/status/trial tracking

**Reality check (code audit May 2026):**
- ⚠️ Profesional tier has **no Stripe product** — email-only signup (contacto@propadvisor.site)
- ⚠️ No in-app upgrade prompts when free users hit limits (just 403 response)
- ⚠️ No tracking of trial → paid conversion rate
- ⚠️ No pay-per-analysis option for users who won't subscribe
- ⚠️ Zero current subscribers (no user acquisition funnel active)

**Unit Economics:**

| Metric | Pro (CLP $15K/mo) | Profesional (CLP $75K/mo) |
|--------|-------------------|--------------------------|
| Target segment | Individual investors (1-5 properties) | Corredores / small inmobiliarias |
| Expected conversion rate | 2-5% of active free users | 0.5-1% of corredor segment |
| Trial-to-paid conversion | 30-50% (industry avg for 7-day trial) | 40-60% (higher intent) |
| Expected monthly churn | 5-8% | 3-5% |
| LTV | CLP $187K–$300K (12-20 months) | CLP $1.5M–$2.5M (20-33 months) |
| Gross margin | ~95% (Stripe fees only) | ~95% |

**Pricing Assessment (Van Westendorp framework):**
- CLP $15K/mo (~$15 USD) is positioned as "cheap/good value" for investors analyzing properties worth UF 2,000+ ($80M+ CLP)
- Risk: may be **too cheap** — investors who save CLP $2M+ per decision would pay CLP $30K-$50K
- **Recommendation:** Test CLP $25K/mo for Pro on new cohorts (keep $15K for existing)

**Validation Experiment:**
1. Add in-app upgrade modal when free users try to save 2nd property or access memo
2. Track: modal shown → pricing page visit → trial start → paid conversion
3. **Success criteria:** ≥3% free-to-trial conversion, ≥35% trial-to-paid conversion
4. **Kill criteria:** <1% free-to-trial after 500 gated interactions

**Growth Loop (Usage → Viral):** Pro users generate investor memos → share with partners/investors → partners discover PropAdvisor → create free accounts → some convert to Pro.

**Projection:**

| Volume | Free Users | Pro Subs | Prof. Subs | MRR |
|--------|-----------|---------|-----------|-----|
| Month 3-4 | 200-500 | 5-15 | 0 | CLP $75K–$225K |
| Month 6-8 | 1,000-3,000 | 30-90 | 1-3 | CLP $525K–$1.6M |
| Year 2 | 5,000-15,000 | 150-450 | 5-15 | CLP $2.6M–$7.9M |

**Next actions:**
1. → **NOW:** Add in-app upgrade modal when free users hit portfolio limit (show value, not just 403)
2. → **WEEK 2:** Create Stripe product for Profesional tier (currently email-only)
3. → **MONTH 2:** Add "Share Memo" feature with PropAdvisor branding (viral loop)
4. → **MONTH 3:** A/B test Pro at CLP $25K vs $15K on new signups

---

### Stream 5: Email Nurture + Sponsored Sends — PASSIVE REVENUE

> **Model type:** Advertising / Sponsored content (per-send fee)

**What:** Monthly emails to a growing audience of high-intent buyers. Rate updates, market insights, property recommendations — with sponsored sections from brokers/insurers.

**Why it works:** Every email in the audience belongs to someone who: (a) identified a specific property, (b) defined their budget, (c) chose a bank, (d) completed a financial analysis. This is the highest-quality real estate email list in Chile. No other platform captures this depth of financial intent data.

**What's built:**
- ✅ Resend infrastructure (API key, audience ID configured)
- ✅ Contacts accumulating with every email submission
- ✅ Contact metadata: name, property analyzed, bank, rate, city, income bracket

**Reality check (code audit May 2026):**
- ⚠️ **Zero email campaigns sent** — audience is growing but completely un-engaged
- ⚠️ No email templates created
- ⚠️ No unsubscribe management or email preferences
- ⚠️ No open/click tracking setup
- ⚠️ Contact metadata stored as first_name field hack (not proper audience segmentation)

**Unit Economics:**

| Metric | Estimate | Assumption |
|--------|----------|------------|
| Cost per send | CLP $1-$2 per contact | Resend pricing at scale |
| Sponsored section price | CLP $50K–$200K per send | Based on audience size + quality |
| Open rate (expected) | 25-40% | High-intent, permission-based list |
| Click rate (expected) | 5-10% | Relevant content (rate updates, market data) |
| Unsubscribe rate | <1% per send | Monthly frequency, high relevance |

**Pricing Strategy (audience-size based):**

| Audience Size | Price per Sponsored Send | Frequency |
|--------------|------------------------|-----------|
| 500-2,000 | CLP $50K | Monthly |
| 2,000-5,000 | CLP $100K–$150K | Monthly |
| 5,000-10,000 | CLP $200K–$400K | Monthly |
| 10,000+ | CLP $500K+ | Monthly or bi-weekly |

**Validation Experiment:**
1. Create first email: "Actualización tasas hipotecarias — Junio 2026" (rate comparison table + market insight)
2. Send to full audience. Measure: open rate, click rate, unsubscribe rate, replies
3. **Success criteria:** ≥25% open rate, <1% unsubscribe, ≥3 user replies
4. **Kill criteria:** <15% open rate or >3% unsubscribe (list quality issue)

**Growth Loop (Content → SEO):** Email content repurposed as blog posts → blog ranks on Google → new users find PropAdvisor → complete analysis → join email list.

**Projection:**

| Audience Size | Sends/mo | Revenue/mo |
|--------------|---------|------------|
| 500 contacts (Month 3) | 1 send, no sponsor | CLP $0 (building engagement) |
| 2,000 contacts (Month 6) | 1 sponsored send | CLP $100K |
| 5,000 contacts (Month 9) | 1 sponsored send | CLP $200K–$400K |
| 10,000+ (Year 2) | 2 sponsored sends | CLP $500K–$1M |

**Next actions:**
1. → **NOW:** Design first email template (rate update + 1 featured tool)
2. → **WEEK 2:** Send first campaign — establish baseline open/click rates
3. → **MONTH 3:** Offer first broker partner a free sponsored section to prove format
4. → **MONTH 6:** Proper audience segmentation (by city, budget, intent stage)

---

## Revenue Projections (Revised with Unit Economics)

_Conservative estimates. Assumes zero paid marketing, organic only, single founder._

| Stage | Monthly Analyses | Stream 1 (Leads) | Stream 2 (Insurance) | Stream 3 (Developers) | Stream 4 (SaaS) | Stream 5 (Email) | **Total CLP** | **Total USD** |
|---|---|---|---|---|---|---|---|---|
| Month 1-2 | 100-200 | Broker trial (free) | Building pitch | — | — | First email sent | **$0** | **$0** |
| Month 3-4 | 200-500 | $600K–$1.2M | $180K–$500K | — | $75K–$225K | $0 (building) | **$855K–$1.9M** | **$900–$2K** |
| Month 5-8 | 500-1,500 | $1.4M–$3.5M | $420K–$2M | — | $525K–$1.6M | $100K | **$2.4M–$7.2M** | **$2.5K–$7.5K** |
| Month 9-12 | 1,500-4,000 | $3.6M–$8M | $1.2M–$6M | $200K–$1.5M | $1.5M–$4.5M | $200K–$400K | **$6.7M–$20.4M** | **$7K–$21K** |
| Year 2 | 4,000-12,000 | $8M–$15M | $3M–$12M | $3.5M–$8M | $2.6M–$7.9M | $500K–$1M | **$17.6M–$43.9M** | **$18K–$45K** |

**Key assumptions to validate:**
- 15-25% broker opt-in rate (currently untested at scale)
- 5-12% insurance CTA click-through rate (currently untested)
- 2-5% free-to-Pro conversion (industry benchmark, untested)
- Organic traffic growth of 30-50% month-over-month via SEO/LLM

---

## Risk Matrix

| Risk | Probability | Impact | Mitigation |
|------|------------|--------|------------|
| No broker signs after trial | Medium | High — delays Stream 1 entirely | Offer 50 free leads instead of 30; pitch 5 brokers simultaneously |
| Insurance companies won't affiliate | Low | Medium — CTA still drives goodwill | Pivot to insurance comparison tool (multiple quotes) |
| Traffic stays below 300/month | Medium | High — all streams depend on volume | Invest in SEO content (herramientas pages), social media, Reddit/Twitter CL |
| Pro conversion <1% | Medium | Low — SaaS is not primary revenue | Adjust pricing, add pay-per-analysis, or bundle with lead priority |
| Chilean regulation changes | Low | Medium — mortgage market shifts | Diversify to rental analysis, property valuation tools |
| Portal Inmobiliario builds a calculator | Low | High — 90% market share in listings | Move fast, build brand loyalty, partner before they build |

---

## The First CLP $1M — Exact Steps

1. ✅ Ship the MVP — tool works end-to-end with 8 banks, 60+ comunas, 3 scenarios
2. ✅ Add lead capture — email gate + broker opt-in + qualification fields + lead scoring
3. ✅ Activate broker routing — Santiago + nationwide investment leads flowing
4. ✅ Add insurance CTA — "Cotiza tu seguro hipotecario" on results page
5. ✅ Add after-click opportunities — matching properties shown after email submission
6. **→ NOW: Sign 1 Santiago mortgage broker** — offer 30 free leads as quality proof
7. **→ NOW: Send first email campaign** — rate update to full audience (establish baseline)
8. **→ NOW: Add in-app upgrade modal** — don't just 403 when free users hit limits
9. **→ WEEK 2: Drive 500 analyses/month** — publish herramientas pages, SEO content, social
10. **→ MONTH 2: Sign 1 insurer affiliate** — replace generic Consorcio link with tracked referral
11. **→ MONTH 2: Create Stripe product for Profesional tier** — currently email-only dead end

**Conservative path to CLP $1M/month:**
- 500 analyses/mo × 20% opt-in × 60% sellable = 60 leads × CLP $20K = CLP $1.2M from leads alone
- Add insurance ($200K) + early SaaS ($100K) = **CLP $1.5M/month at 500 analyses**

---

## Revenue Streams Explicitly Rejected (with reasoning)

**Bank mortgage affiliates:** Chilean banks (Santander, BCI, BancoEstado, BdChile) don't run open affiliate programs. No tracking infrastructure. At realistic CTR (<1%) and close rates (5%), 500 analyses = 0.25 deals/month = $0. **Validated: dead end.**

**Paid PDFs/reports:** The free analysis already shows everything. Industry freemium conversion is 2-5%. At 500 analyses × 3% × CLP $4,900 = CLP $73,500/month. Not worth the trust damage of paywalling core functionality. **Validated: dead end.**

**Property listing marketplace:** Attribution is impossible (buyers negotiate offline). Creates chicken-and-egg inventory problem. Competes with Portal Inmobiliario ($30B parent company). **Strategic rejection: not our fight.**

**Mortgage origination (become a broker):** Requires CMF registration, compliance overhead, capital requirements. Single founder cannot manage regulatory burden. **Deferred: possible Year 3+ if team grows.**

**White-label API for portals:** High-value but requires significant traffic proof and enterprise sales capability. **Deferred: Year 2+ opportunity (see REAL_DATA_PLAN.md).**

---

## Competitive Moat

No Chilean platform offers a free, real-data, 20-year comparison across three scenarios (buy to live, buy to rent, keep renting). Portals show listings but no financial analysis. Banks show only their own calculator. PropAdvisor is the only neutral, multi-scenario tool.

**Defensibility:** Data quality (real UF + 8 bank rates), SEO depth (LLM-optimized guide + FAQ), brand trust from free analysis, growing email list of high-intent buyers, and the after-click property recommendation engine that can be monetized with developer placements.

---

## What This Business IS and IS NOT

**IS:**
- A lead generation engine disguised as a free financial tool
- An insurance referral channel (legally required products, affiliate-friendly)
- A native advertising platform for developers (post-analysis property recommendations)
- A SaaS tool for professional investors and corredores

**IS NOT:**
- A real estate portal (we don't list properties for sale)
- A bank or lender (we don't originate credit)
- A marketplace (we don't connect buyers and sellers directly)
- Dependent on affiliate tracking that doesn't exist in Chile
- Dependent on display advertising

---

## Future Streams (Year 2+)

| Stream | What | Revenue Potential |
|---|---|---|
| Bank sponsorship | "Banco recomendado" badge on results | CLP $500K-$2M/mo per bank |
| Rent estimation API (B2B) | Per-query pricing for brokers/banks | CLP $5M/mo from 5 clients |
| AI chat bot | Conversational lead qualification + referrals | Higher-quality leads, premium pricing |
| WhatsApp lead delivery | Real-time leads to broker WhatsApp | Faster conversion, premium pricing |
| Short-term rental analytics | Airbnb market data per zone | CLP $10M/mo from hosts |
| Landlord dashboard SaaS | Track rental income, expenses, taxes | CLP $60M/mo from 6K subscribers |
| B2B white-label API | Portal Inmobiliario embeds our calculator | CLP $500K-$2M/mo per integration |

See CRITICAL_EVALUATION.md for detailed analysis of each stream.
