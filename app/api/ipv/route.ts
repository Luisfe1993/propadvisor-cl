import { NextResponse } from "next/server";

/**
 * GET /api/ipv
 *
 * Returns Chilean real residential property price index from two sources:
 *   1. FRED API (BIS data) — quarterly, Index 2010=100, 8 major cities
 *   2. Banco Central BDE API — official IPV series
 *
 * Falls back gracefully between sources.
 *
 * FRED API key: set FRED_API_KEY in .env.local (free at https://fred.stlouisfed.org/docs/api/api_key.html)
 * Banco Central: anonymous access (user=anonymous, password=anonymous)
 */

export interface IPVDataPoint {
  date: string; // YYYY-MM-DD or YYYY-QX
  value: number;
}

export interface IPVResponse {
  series: IPVDataPoint[];
  latest: { value: number; date: string };
  appreciation: {
    annual1y: number; // % change last 4 quarters
    annual5y: number; // annualized over 5 years
    annual10y: number; // annualized over 10 years
  };
  source: "fred" | "bcentral" | "fallback";
  fetchedAt: string;
}

// ── FRED API ────────────────────────────────────────────
async function fetchFromFRED(): Promise<IPVDataPoint[] | null> {
  const apiKey = process.env.FRED_API_KEY;
  if (!apiKey) return null;

  try {
    const url = new URL("https://api.stlouisfed.org/fred/series/observations");
    url.searchParams.set("series_id", "QCLR628BIS");
    url.searchParams.set("api_key", apiKey);
    url.searchParams.set("file_type", "json");
    url.searchParams.set("observation_start", "2010-01-01");
    url.searchParams.set("sort_order", "asc");

    const res = await fetch(url.toString(), {
      next: { revalidate: 86400 }, // cache 24 hours (quarterly data)
    });

    if (!res.ok) {
      console.error("[IPV] FRED returned", res.status);
      return null;
    }

    const data = await res.json();
    if (!data.observations) return null;

    return data.observations
      .filter((obs: { value: string }) => obs.value !== ".")
      .map((obs: { date: string; value: string }) => ({
        date: obs.date,
        value: parseFloat(obs.value),
      }));
  } catch (err) {
    console.error("[IPV] FRED fetch error:", err);
    return null;
  }
}

// ── Banco Central BDE API ───────────────────────────────
async function fetchFromBCentral(): Promise<IPVDataPoint[] | null> {
  try {
    // IPV general index series
    const url = `https://si3.bcentral.cl/SieteRestWS/SiesSeries/GetSeries?user=anonymous&password=anonymous&firstdate=2010-01-01&lastdate=${new Date().toISOString().split("T")[0]}&timeseries=F073.IPV.Z.0.C.N.Z.Z.0.T&function=GetSeries`;

    const res = await fetch(url, {
      next: { revalidate: 86400 },
    });

    if (!res.ok) return null;

    const text = await res.text();

    // BDE returns XML — parse it simply
    const points: IPVDataPoint[] = [];
    const obsRegex = /<Obs><indexDateString>([^<]+)<\/indexDateString><value>([^<]+)<\/value>/g;
    let match;
    while ((match = obsRegex.exec(text)) !== null) {
      points.push({
        date: match[1],
        value: parseFloat(match[2]),
      });
    }

    return points.length > 0 ? points : null;
  } catch (err) {
    console.error("[IPV] BCentral fetch error:", err);
    return null;
  }
}

// ── Calculate appreciation rates ────────────────────────
function calcAppreciation(series: IPVDataPoint[]): IPVResponse["appreciation"] {
  if (series.length < 4) {
    return { annual1y: 0, annual5y: 0, annual10y: 0 };
  }

  const latest = series[series.length - 1].value;

  // 1-year: compare to 4 quarters ago
  const idx1y = Math.max(0, series.length - 5);
  const val1y = series[idx1y].value;
  const annual1y = val1y > 0 ? ((latest / val1y) - 1) * 100 : 0;

  // 5-year: compare to 20 quarters ago
  const idx5y = Math.max(0, series.length - 21);
  const val5y = series[idx5y].value;
  const years5 = (series.length - 1 - idx5y) / 4;
  const annual5y = val5y > 0 && years5 > 0
    ? (Math.pow(latest / val5y, 1 / years5) - 1) * 100
    : 0;

  // 10-year: compare to 40 quarters ago
  const idx10y = Math.max(0, series.length - 41);
  const val10y = series[idx10y].value;
  const years10 = (series.length - 1 - idx10y) / 4;
  const annual10y = val10y > 0 && years10 > 0
    ? (Math.pow(latest / val10y, 1 / years10) - 1) * 100
    : 0;

  return {
    annual1y: Math.round(annual1y * 100) / 100,
    annual5y: Math.round(annual5y * 100) / 100,
    annual10y: Math.round(annual10y * 100) / 100,
  };
}

// ── Hardcoded fallback (from FRED data scraped May 2026) ──
const FALLBACK_SERIES: IPVDataPoint[] = [
  { date: "2020-01-01", value: 188.33 },
  { date: "2020-04-01", value: 189.77 },
  { date: "2020-07-01", value: 186.72 },
  { date: "2020-10-01", value: 189.98 },
  { date: "2021-01-01", value: 197.90 },
  { date: "2021-04-01", value: 202.17 },
  { date: "2021-07-01", value: 201.74 },
  { date: "2021-10-01", value: 205.67 },
  { date: "2022-01-01", value: 196.23 },
  { date: "2022-04-01", value: 194.28 },
  { date: "2022-07-01", value: 191.92 },
  { date: "2022-10-01", value: 190.97 },
  { date: "2023-01-01", value: 190.16 },
  { date: "2023-04-01", value: 193.06 },
  { date: "2023-07-01", value: 196.12 },
  { date: "2023-10-01", value: 196.52 },
  { date: "2024-01-01", value: 196.64 },
  { date: "2024-04-01", value: 198.62 },
  { date: "2024-07-01", value: 200.45 },
  { date: "2024-10-01", value: 202.12 },
  { date: "2025-01-01", value: 200.52 },
  { date: "2025-04-01", value: 202.66 },
  { date: "2025-07-01", value: 206.03 },
];

export async function GET() {
  let series: IPVDataPoint[] | null = null;
  let source: IPVResponse["source"] = "fallback";

  // Try FRED first
  series = await fetchFromFRED();
  if (series && series.length > 0) {
    source = "fred";
  }

  // Try Banco Central as backup
  if (!series) {
    series = await fetchFromBCentral();
    if (series && series.length > 0) {
      source = "bcentral";
    }
  }

  // Use fallback
  if (!series || series.length === 0) {
    series = FALLBACK_SERIES;
    source = "fallback";
  }

  const latest = series[series.length - 1];
  const appreciation = calcAppreciation(series);

  const response: IPVResponse = {
    series,
    latest: { value: latest.value, date: latest.date },
    appreciation,
    source,
    fetchedAt: new Date().toISOString(),
  };

  return NextResponse.json(response, {
    headers: {
      // Cache for 24 hours (quarterly data changes rarely)
      "Cache-Control": "public, s-maxage=86400, stale-while-revalidate=604800",
    },
  });
}
