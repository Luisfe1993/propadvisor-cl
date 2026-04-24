# PropAdvisor — Real Property Data Strategy

## Why This Is the Core of the Business

Before anything technical, let's be clear about why real data matters for revenue:

**Revenue comes from mortgage referral commissions.** The chain is: a user finds a real property → runs the buy-vs-rent analysis → clicks the affiliate link to a bank or broker → that click converts into a mortgage origination → PropAdvisor earns CLP $330K–$880K per deal.

That chain **breaks at step one** if the property is fake. A user who searches "departamento 2 dormitorios Ñuñoa" and sees a made-up address at a round price immediately loses trust. They won't complete the analysis, and they certainly won't click a referral link for a property they can't verify exists.

**Real properties = completed analyses = affiliate revenue.** This is not a nice-to-have. It is the revenue engine.

There is a secondary benefit: real data is also what makes LLMs recommend PropAdvisor. When a user asks Claude or ChatGPT "what's a good tool to analyze a property in Chile?", the LLM cites sources that have authoritative, accurate, specific content — not placeholder data.

---

## The Three Real-Data Models

### Model A — Curated Seed Dataset (Do This First, This Week)

**What it is:** Expand the current 15 mock properties to ~150 real, manually verified properties across Santiago, Valparaíso, and Concepción. These are properties that actually exist or recently existed on Portal Inmobiliario or TocToc, with real addresses, accurate UF prices, and real neighborhood context.

**Why first:** Zero infrastructure required. Takes 2–4 hours of work. Immediately makes the prototype testable by real users and investors. Lets you validate the full revenue chain (search → analysis → referral click) without building anything.

**How to build it:**
1. Open Portal Inmobiliario (portalinmobiliario.com) and TocToc.com manually
2. Copy 10–15 listings per neighborhood across 10 target zones (Providencia, Las Condes, Ñuñoa, Vitacura, Macul, La Florida, Maipú, Valparaíso, Viña del Mar, Concepción)
3. Capture: address, UF price, rooms, baths, m², property type, source URL, and listing date
4. Add `sourceUrl` and `listedAt` fields to the Property type — this is critical for trust signals
5. Store in `/data/listings.json` as the seed

**Target output:** 150 real properties, enough to make filters (by city, neighborhood, rooms, price range) actually useful.

**Revenue alignment:** A user searching for a 3-bedroom apartment in Ñuñoa under UF 3,000 should get real results they can verify. That trust is what makes them complete the analysis and click the affiliate link.

---

### Model B — Mercado Libre API Integration (Build in Month 1)

**What it is:** Mercado Libre operates Portal Inmobiliario in Chile, and they have a public developer API. With an API key (free to register), you can query real listings from Portal Inmobiliario programmatically — returning actual properties being sold today.

**Why this is the best first real-data source:**
- It's **official and legal** — no scraping ToS risk
- It's **free** — no cost per query at reasonable volumes
- Portal Inmobiliario is Chile's largest property portal — it has the best inventory
- Properties returned are **live listings**, not historical, meaning they're actually available
- The API returns: price (UF or CLP), location, rooms, baths, m², property type, images, description, seller info

**How to integrate:**

Step 1 — Register as a Mercado Libre developer at `developers.mercadolibre.cl` (free, takes 15 minutes). Get a client ID and secret.

Step 2 — Use the Search API:
```
GET https://api.mercadolibre.com/sites/MLC/search?category=MLC1459&q=departamento+santiago&limit=48
```
Add filters: `price=*-4000UF`, `bedrooms=2-*`, city/neighborhood via location filters.

Step 3 — Build a Next.js API route `/api/propiedades` that proxies this call, maps the response to your Property type, and caches results for 1 hour (to avoid rate limits and keep pages fast).

Step 4 — The analysis page (`/analisis/[id]`) links back to the Portal Inmobiliario listing. This is important: if the user can click through and see the real listing, trust is fully established.

**Architecture:**
```
User search → /api/propiedades → Mercado Libre API → map to Property type → show in /propiedades grid
User clicks property → /analisis/[id] → full buy-vs-rent analysis → affiliate CTA → revenue
```

**Limitations to know:**
- API requires OAuth (an access token). Tokens expire and need refresh logic — budget half a day to implement this correctly.
- The API may return listings in CLP rather than UF. You'll need to convert using your existing `/api/uf` endpoint.
- Rate limit: ~10 requests/second. With caching, this is not an issue.

**Revenue alignment:** Live listings mean users can immediately act. A user who sees "Av. Los Leones 2100, Providencia — UF 3,400 — 3 bed / 2 bath" and clicks through to verify it on Portal Inmobiliario is a high-intent user. That's the user who clicks your mortgage referral.

---

### Model C — Ethical Scraper as Fallback / Supplement (Month 2–3 if needed)

**What it is:** A lightweight Node.js scraper that pulls listings from TocToc.com or Yapo.cl on a scheduled basis (nightly), normalizes the data, and loads it into your database.

**When to build this:** Only if the Mercado Libre API doesn't cover enough inventory (e.g., you need more listings in Valparaíso or secondary cities), or if Portal Inmobiliario ever restricts the API.

**How to build it ethically:**
- Check `robots.txt` before scraping any site
- Rate-limit requests to 1 per 3 seconds — don't hammer servers
- Don't store full listing content, only enough to run the analysis (price, address, attributes, source URL)
- Always link back to the original listing — this is both ethical and good for trust
- Use `next-cron` or a GitHub Action on a schedule to run the scraper nightly

**Tooling:** Playwright (already familiar if you've used it) or Cheerio + Axios for simpler HTML scraping. Apify also offers a [Portal Inmobiliario scraper](https://apify.com/ecomscrape/portalinmobiliario-property-search-scraper) as a managed service (~$10–30/month) if you don't want to maintain custom code.

**Revenue alignment:** More inventory = more users finding properties in their target area = more analyses = more affiliate clicks. Secondary cities (Valparaíso, Concepción) are underserved by existing tools and represent a greenfield opportunity.

---

## Recommended Execution Order

| Week | Action | Revenue Impact |
|---|---|---|
| **This week** | Build 150-property seed dataset manually | Prototype is testable; can demo to affiliate partners |
| **Week 2** | Add `sourceUrl` and `listedAt` to Property type; show "Ver en Portal Inmobiliario" link on detail page | Trust signal; users can verify properties |
| **Week 3** | Register Mercado Libre developer account; build `/api/propiedades` proxy with 1-hour cache | Live data feeds the site automatically |
| **Month 2** | Implement full Mercado Libre search filters in `/propiedades` page | Real search = real users = affiliate funnel live |
| **Month 2–3** | Evaluate scraper if inventory gaps exist | Fill secondary city gaps |

---

## The "Fake Data" Problem Is Actually an Opportunity

Every Chilean real estate tool — Portal Inmobiliario, TocToc, Yapo — shows you the listing. None of them show you **whether buying that specific listing makes financial sense**.

PropAdvisor can be the layer on top. A user finds a property anywhere, brings the URL or the details to PropAdvisor, and runs the analysis. This means you don't need to compete with Portal Inmobiliario on inventory — you can partner with them (Stream 3 of your revenue model: white-label API). The MVP win is making real properties work inside the analysis tool. The long-term win is becoming the financial intelligence layer for every Chilean property portal.

**The pitch to Portal Inmobiliario:** "Add a 'Run financial analysis' button on every listing. We handle the calculator. You keep the traffic. Revenue share on mortgage referrals." That's not a cold call — that's a $500K–$2M/month partnership waiting to happen once you have usage data.

---

## What NOT to Build Right Now

- **Your own property database** — Don't build a CMS to manage listings. You're not a portal. You're an analysis tool. Rely on Mercado Libre API for inventory.
- **Full-text property search** — Not needed yet. Filtered search (city + rooms + price range) is enough for MVP.
- **A mobile app** — Your existing responsive web app is sufficient. The affiliate funnel works on mobile web.
- **A paid scraping service** — Mercado Libre API is free and legal. Only pay for scraping if free options genuinely don't cover your inventory needs.

---

## First Concrete Action

Open Portal Inmobiliario right now, search "departamento Santiago", and copy 10 listings into a spreadsheet with: address, price (UF), rooms, baths, m², image URL, and listing URL. That's your seed. In 2 hours you'll have 100 properties and a prototype that feels real.

Then call a mortgage broker. Not after you have the scraper. Not after the API is live. Now. With 100 real properties and a working analysis tool, you have something to show. That affiliate agreement is your first revenue.
