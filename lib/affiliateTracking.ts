/**
 * Insurance affiliate tracking configuration.
 *
 * When the affiliate agreement is signed, update:
 *   1. AFFILIATE_BASE_URL — the partner's tracked URL
 *   2. AFFILIATE_ID — your referral code
 *
 * Until then, this sends to Consorcio's generic page with UTM params.
 */

export interface AffiliateClickData {
  source: string;  // page identifier (e.g. "calcular", "tool_dividendo")
  city?: string;
  comuna?: string;
  priceCLP?: number;
}

/**
 * Build the affiliate URL with tracking parameters.
 */
export function getAffiliateUrl(source: string): string {
  const baseUrl = process.env.NEXT_PUBLIC_AFFILIATE_URL
    || "https://www.consorcio.cl/seguros/seguro-de-desgravamen";
  const affiliateId = process.env.NEXT_PUBLIC_AFFILIATE_ID || "propadvisor";

  const url = new URL(baseUrl);
  url.searchParams.set("utm_source", "propadvisor");
  url.searchParams.set("utm_medium", "referral");
  url.searchParams.set("utm_campaign", source);
  url.searchParams.set("ref", affiliateId);
  return url.toString();
}
