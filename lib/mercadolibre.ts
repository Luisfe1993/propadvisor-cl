/**
 * Portal Inmobiliario / Mercado Libre search client.
 *
 * Uses a user-level OAuth token (APP_USR-...) which has VIS scope —
 * required to search Portal Inmobiliario listings (category MLC1459).
 *
 * Token setup (one-time):
 *   1. Open in browser:
 *      https://auth.mercadolibre.cl/authorization?response_type=code&client_id=ML_APP_ID&redirect_uri=https://propadvisor.site
 *   2. Log in with your ML account → copy ?code= from the redirect URL
 *   3. Exchange: curl.exe -X POST https://api.mercadolibre.com/oauth/token
 *        -d "grant_type=authorization_code&client_id=...&client_secret=...&code=...&redirect_uri=https://propadvisor.site"
 *   4. Paste access_token into ML_ACCESS_TOKEN in .env.local
 *
 * Token refresh:
 *   The token expires in 6 hours. Enable "Refresh Token" in the ML developer app,
 *   repeat the flow once to get a refresh_token, then add ML_REFRESH_TOKEN to .env.local.
 */

import type { Property } from "./types";

const ML_BASE = "https://api.mercadolibre.com";

// ─────────────────────────────────────────────
// Token management
// Prefer the user-level access token from env. Falls back to client_credentials.
// ─────────────────────────────────────────────
let tokenCache: { token: string; expiresAt: number } | null = null;

async function getAccessToken(): Promise<string | null> {
  // 1. Use static user token if set (user-level, has VIS scope)
  const staticToken = process.env.ML_ACCESS_TOKEN;
  if (staticToken) return staticToken;

  // 2. Fall back to client_credentials (app-level, limited scope)
  const appId = process.env.ML_APP_ID;
  const appSecret = process.env.ML_APP_SECRET;
  if (!appId || !appSecret) return null;

  if (tokenCache && Date.now() < tokenCache.expiresAt - 300_000) {
    return tokenCache.token;
  }

  try {
    const res = await fetch(`${ML_BASE}/oauth/token`, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        grant_type: "client_credentials",
        client_id: appId,
        client_secret: appSecret,
      }),
      cache: "no-store",
    });
    if (!res.ok) return null;
    const data = await res.json();
    if (!data.access_token) return null;
    tokenCache = {
      token: data.access_token,
      expiresAt: Date.now() + data.expires_in * 1000,
    };
    return tokenCache.token;
  } catch {
    return null;
  }
}

// ─────────────────────────────────────────────
// ML response types
// ─────────────────────────────────────────────
interface MLAttribute {
  id: string;
  name: string;
  value_id: string | null;
  value_name: string | null;
}

interface MLLocation {
  city?: { name: string };
  neighborhood?: { name: string };
  address_line?: string;
}

interface MLItem {
  id: string;
  title: string;
  price: number;
  currency_id: string;
  thumbnail: string;
  permalink: string;
  attributes: MLAttribute[];
  location?: MLLocation;
}

interface MLSearchResponse {
  results: MLItem[];
  paging: { total: number; offset: number; limit: number };
}

// ─────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────
function getAttribute(attrs: MLAttribute[], id: string): string | null {
  return attrs.find((a) => a.id === id)?.value_name ?? null;
}

function mapCityToEnum(cityName: string): Property["city"] {
  const lower = (cityName || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
  if (lower.includes("valparaiso") || lower.includes("vina"))
    return "valparaiso";
  if (lower.includes("concepcion") || lower.includes("biobio"))
    return "concepcion";
  return "santiago";
}

function betterThumbnail(url: string): string {
  return url
    .replace(/-I\.(jpg|jpeg|png|webp)/i, "-O.$1")
    .replace(/_I\.(jpg|jpeg|png|webp)/i, "_O.$1");
}

function mapMLItemToProperty(item: MLItem, ufValue: number): Property | null {
  const attrs = item.attributes || [];
  const rooms = parseInt(getAttribute(attrs, "BEDROOMS") ?? "0");
  const baths = parseInt(getAttribute(attrs, "BATHROOMS") ?? "0");
  const coveredArea = parseFloat(getAttribute(attrs, "COVERED_AREA") ?? "0");
  const totalArea = parseFloat(getAttribute(attrs, "TOTAL_AREA") ?? "0");
  const m2 = coveredArea || totalArea || undefined;
  const propTypeRaw = (getAttribute(attrs, "PROPERTY_TYPE") ?? "").toLowerCase();

  if (rooms === 0 || !item.price || item.price <= 0) return null;

  let priceUF: number;
  let priceCLP: number;
  if (item.currency_id === "UF") {
    priceUF = item.price;
    priceCLP = Math.round(item.price * ufValue);
  } else if (item.currency_id === "CLP") {
    priceCLP = item.price;
    priceUF = Math.round((item.price / ufValue) * 10) / 10;
  } else {
    return null;
  }
  if (priceUF < 300 || priceUF > 80_000) return null;

  const cityName = item.location?.city?.name ?? "Santiago";
  const neighborhood = item.location?.neighborhood?.name ?? cityName;
  const addressLine = item.location?.address_line
    ? `${item.location.address_line}, ${neighborhood}`
    : item.title;

  const rentRate = propTypeRaw.includes("casa") ? 0.0035 : 0.004;
  const estimatedMonthlyRentUF = Math.round(priceUF * rentRate * 10) / 10;
  const estimatedMonthlyRentCLP = Math.round(estimatedMonthlyRentUF * ufValue);
  const type: Property["type"] = propTypeRaw.includes("casa") ? "casa" : "departamento";

  return {
    id: item.id,
    address: addressLine,
    neighborhood,
    city: mapCityToEnum(cityName),
    priceUF,
    priceCLP,
    rooms,
    baths,
    type,
    estimatedMonthlyRentUF,
    estimatedMonthlyRentCLP,
    image: betterThumbnail(item.thumbnail),
    sourceUrl: item.permalink,
    m2,
    source: "mercadolibre",
  };
}

// ─────────────────────────────────────────────
// Public API
// ─────────────────────────────────────────────
export interface MLSearchParams {
  city?: string;
  propertyType?: string;
  rooms?: number;
  budget?: number;
  currency?: "CLP" | "UF";
  ufValue?: number;
  limit?: number;
  offset?: number;
}

export async function searchMLProperties(
  params: MLSearchParams
): Promise<{ properties: Property[]; total: number } | null> {
  const token = await getAccessToken();
  if (!token) {
    console.warn("[ML] No token — set ML_ACCESS_TOKEN in .env.local");
    return null;
  }
  const tokenSource = process.env.ML_ACCESS_TOKEN ? "user (APP_USR)" : "app (client_credentials)";
  console.log("[ML] Using token type:", tokenSource, "— first 20 chars:", token.slice(0, 20));

  const ufValue = params.ufValue ?? 36520;
  const limit = Math.min(params.limit ?? 48, 48);

  const cityLabels: Record<string, string> = {
    santiago: "Santiago",
    valparaiso: "Valparaíso",
    concepcion: "Concepción",
  };

  // Build keyword — include type + city so results are real estate specific.
  // We avoid the category=MLC1459 filter which is locked down by ML.
  const typeLabel = params.propertyType === "casa" ? "casa" : "departamento";
  const cityLabel = params.city ? (cityLabels[params.city] ?? params.city) : "Santiago";
  const keyword = `${typeLabel} en venta ${cityLabel}`;

  const qs = new URLSearchParams({
    q: keyword,
    limit: limit.toString(),
    offset: ((params.offset ?? 0)).toString(),
  });

  const url = `${ML_BASE}/sites/MLC/search?${qs}`;
  console.log("[ML] Searching:", url);

  try {
    const res = await fetch(url, {
      headers: { Authorization: `Bearer ${token}` },
      next: { revalidate: 3600 },
    });

    if (!res.ok) {
      const body = await res.text();
      console.error("[ML] Search failed:", res.status, body);
      return null;
    }

    const data: MLSearchResponse = await res.json();
    const items = data.results ?? [];
    console.log("[ML] Raw results:", items.length, "/ total:", data.paging?.total);

    let properties = items
      .map((item) => mapMLItemToProperty(item, ufValue))
      .filter((p): p is Property => p !== null);

    // Client-side filters
    if (params.propertyType) {
      properties = properties.filter((p) => p.type === params.propertyType);
    }
    if (params.rooms && params.rooms > 0) {
      properties = properties.filter((p) => p.rooms >= params.rooms!);
    }
    if (params.budget && params.budget > 0) {
      const budgetUF =
        params.currency === "UF" ? params.budget : params.budget / ufValue;
      properties = properties.filter((p) => p.priceUF <= budgetUF);
    }

    return { properties, total: data.paging?.total ?? properties.length };
  } catch (err) {
    console.error("[ML] Search error:", err);
    return null;
  }
}

export async function getMLPropertyById(
  id: string,
  ufValue: number = 36520
): Promise<Property | null> {
  const token = await getAccessToken();
  if (!token) return null;

  try {
    const res = await fetch(`${ML_BASE}/items/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
      next: { revalidate: 3600 },
    });
    if (!res.ok) return null;
    const item: MLItem = await res.json();
    return mapMLItemToProperty(item, ufValue);
  } catch {
    return null;
  }
}

export function isMLConfigured(): boolean {
  return !!(
    process.env.ML_ACCESS_TOKEN ||
    (process.env.ML_APP_ID && process.env.ML_APP_SECRET)
  );
}
