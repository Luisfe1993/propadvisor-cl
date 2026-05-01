/**
 * Broker lead routing configuration.
 *
 * Rules are checked in order. ALL matching rules fire (a lead can go to multiple brokers).
 * If no rule matches, the lead goes to BROKER_NOTIFY_EMAIL env var (fallback).
 *
 * To add a broker:
 *   1. Add a new rule object below
 *   2. Push to production — no env var changes needed
 *
 * Match conditions (all optional, combined with AND):
 *   - city: city ID (e.g. "santiago", "concepcion", "valparaiso")
 *   - comuna: comuna ID (e.g. "nunoa", "las_condes")
 *   - minScore: minimum lead score (0-10)
 *   - maxScore: maximum lead score
 *   - purpose: "vivienda" | "inversion" (from propertyType field)
 *   - minPriceUF: minimum property price in UF
 *   - maxPriceUF: maximum property price in UF
 *   - hasPreApproval: true = only pre-approved leads
 *   - hasPhone: true = only leads with phone number
 */

export interface BrokerRoute {
  /** Broker name (for logging) */
  name: string;
  /** Email to send leads to */
  email: string;
  /** Match conditions (all must be true). Empty = matches everything. */
  match: {
    city?: string | string[];
    comuna?: string | string[];
    minScore?: number;
    maxScore?: number;
    purpose?: string;
    minPriceUF?: number;
    maxPriceUF?: number;
    hasPreApproval?: boolean;
    hasPhone?: boolean;
  };
  /** If true, this broker is currently inactive (won't receive leads) */
  disabled?: boolean;
}

/**
 * ═══════════════════════════════════════════════════════════
 * BROKER ROUTING TABLE
 * Add your broker agreements below. Push to deploy.
 * ═══════════════════════════════════════════════════════════
 */
export const brokerRoutes: BrokerRoute[] = [
  // ── Active brokers ──────────────────────────────────────

  {
    name: "Valpo",
    email: "luisfsande@hotmail.com",
    match: {
      city: "valparaiso",
    },
  },

  // ── Example routes (uncomment when signed) ──────────────

  // {
  //   name: "Broker Premium Santiago",
  //   email: "premium@broker.cl",
  //   match: {
  //     city: "santiago",
  //     minScore: 6,
  //     minPriceUF: 3000,
  //   },
  // },

  // {
  //   name: "Broker Inversiones",
  //   email: "inversiones@broker.cl",
  //   match: {
  //     purpose: "inversion",
  //   },
  // },

  // {
  //   name: "Broker Sur",
  //   email: "sur@broker.cl",
  //   match: {
  //     city: ["concepcion", "temuco", "valdivia", "puerto_montt"],
  //   },
  // },

  // {
  //   name: "Broker Costa",
  //   email: "costa@broker.cl",
  //   match: {
  //     city: ["valparaiso", "la_serena"],
  //   },
  // },

  // {
  //   name: "Broker Norte",
  //   email: "norte@broker.cl",
  //   match: {
  //     city: ["antofagasta", "iquique", "arica", "copiapo"],
  //   },
  // },
];

/**
 * Strip accents and normalize for matching
 */
function normalize(s: string): string {
  return s.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/\s+/g, "_");
}

/**
 * Match a lead against the routing table.
 * Returns all matching broker emails. If none match, returns the fallback.
 */
export function routeLead(lead: {
  city: string;
  comuna?: string;
  score: number;
  purpose?: string;
  priceUF: number;
  hasPreApproval?: boolean;
  phone?: string;
}, fallbackEmail?: string): { name: string; email: string }[] {
  const matches: { name: string; email: string }[] = [];

  for (const route of brokerRoutes) {
    if (route.disabled) continue;

    const m = route.match;
    let matched = true;

    // City match (accent-insensitive)
    if (m.city) {
      const cities = (Array.isArray(m.city) ? m.city : [m.city]).map(normalize);
      if (!cities.includes(normalize(lead.city))) matched = false;
    }

    // Comuna match (accent-insensitive)
    if (m.comuna && matched) {
      const comunas = (Array.isArray(m.comuna) ? m.comuna : [m.comuna]).map(normalize);
      if (!lead.comuna || !comunas.includes(normalize(lead.comuna))) matched = false;
    }

    // Score range
    if (m.minScore !== undefined && matched) {
      if (lead.score < m.minScore) matched = false;
    }
    if (m.maxScore !== undefined && matched) {
      if (lead.score > m.maxScore) matched = false;
    }

    // Purpose
    if (m.purpose && matched) {
      const purposeMatch = lead.purpose?.toLowerCase().includes(m.purpose.toLowerCase());
      if (!purposeMatch) matched = false;
    }

    // Price range
    if (m.minPriceUF !== undefined && matched) {
      if (lead.priceUF < m.minPriceUF) matched = false;
    }
    if (m.maxPriceUF !== undefined && matched) {
      if (lead.priceUF > m.maxPriceUF) matched = false;
    }

    // Pre-approval
    if (m.hasPreApproval && matched) {
      if (!lead.hasPreApproval) matched = false;
    }

    // Phone
    if (m.hasPhone && matched) {
      if (!lead.phone) matched = false;
    }

    if (matched) {
      matches.push({ name: route.name, email: route.email });
    }
  }

  // Fallback: if no routes matched, use env var
  if (matches.length === 0 && fallbackEmail) {
    matches.push({ name: "Default", email: fallbackEmail });
  }

  return matches;
}
