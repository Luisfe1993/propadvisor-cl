# PropAdvisor CL — Business Model

_Last updated: May 6, 2026_

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

## Path to Revenue — 5 Streams, Ordered by Speed to First Dollar

### Stream 1: Broker Lead Sales — FIRST REVENUE

**What:** Sell qualified buyer leads to mortgage brokers. We already capture: email, property details, budget, down payment %, bank preference, income range, pre-approval status, and explicit opt-in consent.

**Why it works:** Brokers already pay CLP $10K–$50K per lead from Facebook/Google. Ours are higher quality — the user has identified a specific property, defined their budget, and explicitly asked to be contacted.

**What's built:**
- ✅ Lead scoring (0-10): phone (+2), pre-approval (+3), high income (+2), pie available (+1)
- ✅ Broker routing by city, comuna, score, property type, price range
- ✅ Santiago + investment leads active (routes to BROKER_NOTIFY_EMAIL)
- ✅ HTML email notifications with lead tier (🔥 HOT / 🟡 WARM / 🔵 COLD)
- ✅ 30-min dedup window, disposable email blocking

**What's needed:**
- Sign 1 Santiago mortgage broker — offer 30 free leads as quality proof
- After trial: charge CLP $20K–$30K per hot lead (score ≥6), CLP $10K for warm (3-5)
- Add WhatsApp delivery for leads (Chilean brokers respond 10x faster)

**Projection:** 500 analyses/mo × 20% opt-in = 100 leads × CLP $20K avg = **CLP $2M/month**

**Timeline:** Month 1-2 after first broker agreement

---

### Stream 2: Insurance Affiliate — LOW-HANGING FRUIT

**What:** Every mortgage buyer in Chile must purchase seguro de desgravamen (life) + incendio (fire). Legally required. Chilean insurers (Consorcio, BCI Seguros, Sura, MetLife) DO run affiliate/referral programs — unlike banks.

**Why it works:** Insurers have tracking infrastructure (UTM parameters, referral codes). Insurance purchase happens online. Multiple insurers compete for the same buyer. No attribution ambiguity.

**What's built:**
- ✅ Insurance CTA on analysis results page with estimated premium range
- ✅ Analytics tracking (`insurance_cta_clicked`)

**What's needed:**
- Sign 1 insurer affiliate agreement (Consorcio or BCI Seguros)
- Replace generic link with tracked referral URL

**Projection:** 500 analyses/mo × 10% CTR × 20% conversion × CLP $80K commission = **CLP $800K/month**

**Timeline:** Month 2-3 after partner signed

---

### Stream 3: Developer Featured Properties — NATIVE MONETIZATION

**What:** After a user completes their analysis and submits their email, we show "Propiedades que podrían interesarte" — matching properties in their price range and city. Currently uses mock data. When real developers pay for placement, their projects appear here.

**Why it works:** Developers spend CLP $5M–$50M/month on marketing per project. We offer their project to a user who just analyzed a property in the same neighborhood at the same price point — the most qualified audience possible. It doesn't feel like an ad — it feels like a personalized recommendation.

**What's built:**
- ✅ OpportunitiesView component: horizontal scrollable cards with image, price, location, rent estimate
- ✅ Matching algorithm: ±40% price range, same city, shuffled for variety
- ✅ Analytics tracking (`opportunities_shown`, `opportunity_clicked`, `opportunities_view_more`)
- ✅ Links to full analysis page (`/analisis/{id}`) for each property

**What's needed:**
- Replace mock properties with real developer listings in target neighborhoods
- Sell placement: CLP $200K–$1M/month per featured project
- Pitch: "Your project appears to qualified buyers who just analyzed a similar property in your area"

**Projection:** 3 developers × CLP $500K/mo = **CLP $1.5M/month**

**Timeline:** Month 6-12 (needs 1,000+ analyses/month to sell)

---

### Stream 4: Pro SaaS Subscription — RECURRING REVENUE

**What:** Premium investor tools: portfolio dashboard, IRR, DSCR, vacancy modeling, tax calculator, property comparison, investor memo PDF export.

**Current pricing:**
- Free: unlimited analyses, PDF/Excel, 8 bank rates, broker contact
- Pro ($15K CLP/mo): portfolio, advanced metrics, comparison, memo
- Profesional ($75K CLP/mo): for corredores — unlimited client analyses, white-label memo, priority support

**What's built:** ✅ Everything. Stripe checkout, 7-day trial, billing portal, webhook lifecycle, all Pro features gated.

**What's needed:**
- Consider adding pay-per-analysis ($3K-$5K CLP) for users who won't subscribe monthly
- Drive traffic to pricing page from analysis results
- Use Pro subscription as lead quality signal (Pro users = serious investors = premium broker leads)

**Projection:** 50-200 Pro subscribers × $15K = **CLP $750K–$3M/month**

**Timeline:** Ongoing, grows with traffic

---

### Stream 5: Email Nurture + Sponsored Sends — PASSIVE REVENUE

**What:** Monthly emails to the growing audience of high-intent buyers. Rate updates, market insights, property recommendations — with sponsored sections from brokers/insurers.

**What's built:**
- ✅ Resend infrastructure ready (API key, audience ID configured)
- ✅ Contacts accumulating with every email submission

**What's needed:**
- Create first email template: "Actualización tasas hipotecarias — [Month] 2026"
- Send monthly to full audience
- Include sponsored section after first broker/insurer partner is signed
- CLP $50K–$200K per sponsored send

**Projection:** 5,000 contacts × CLP $100K per send = **CLP $100K–$500K/month**

**Timeline:** Month 2+ (near-zero cost, just needs content)

---

## Revenue Projections

| Stage | Monthly Analyses | Active Streams | Monthly CLP | Monthly USD |
|---|---|---|---|---|
| Month 1-2 | 100-300 | Building traffic, signing 1 broker | $0 | $0 |
| Month 3-4 | 300-700 | Broker leads + insurance affiliate | $1M-$3M | $1K-$3K |
| Month 5-8 | 700-2,000 | Leads + insurance + SaaS + email | $3M-$8M | $3K-$8K |
| Month 9-12 | 2,000-5,000 | All streams + 1-2 developers | $8M-$20M | $8K-$20K |
| Year 2 | 5,000-15,000 | All streams at scale | $20M-$50M | $20K-$50K |

Assumes zero paid marketing. Organic SEO, LLM search visibility, and word-of-mouth only. Single founder.

---

## The First CLP $1M — Exact Steps

1. ✅ Ship the MVP — tool works end-to-end with 8 banks, 60+ comunas, 3 scenarios
2. ✅ Add lead capture — email gate + broker opt-in + qualification fields + lead scoring
3. ✅ Activate broker routing — Santiago + nationwide investment leads flowing
4. ✅ Add insurance CTA — "Cotiza tu seguro hipotecario" on results page
5. ✅ Add after-click opportunities — matching properties shown after email submission
6. **→ NOW: Sign 1 Santiago mortgage broker** — offer 30 free leads as trial
7. **→ NOW: Drive 500 analyses/month** — SEO content, social, LLM optimization
8. **Month 3: Sign 1 insurer** — replace generic insurance CTA with tracked referral
9. **Month 3: Send first email campaign** — rate update to full audience

**At 500 analyses/month × 20% broker opt-in × CLP $20K/lead = CLP $2M/month**

---

## Why Not Affiliates, Paid PDFs, or Property Listings

**Affiliates:** Chilean banks don't run open affiliate programs. No tracking infrastructure exists. At realistic CTR (<1%) and close rates (5%), 500 analyses = 0.25 deals/month = $0.

**Paid PDFs:** The free analysis shows everything. Industry freemium conversion is 2-5%. 500 × 3% × $4,900 = CLP $73,500/month. Dead on arrival.

**Property listings:** Attribution is impossible (buyers negotiate offline). Creates chicken-and-egg problem. Competes with Portal Inmobiliario ($30B parent company). Not our fight.

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
