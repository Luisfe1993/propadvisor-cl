import { NextRequest, NextResponse } from "next/server";
import { filterProperties } from "@/lib/properties";
import {
  searchMLProperties,
  getMLPropertyById,
  isMLConfigured,
} from "@/lib/mercadolibre";
import type { PropertySearchResponse } from "@/lib/types";

/**
 * GET /api/propiedades
 *
 * Query params:
 *   budget       — required for search (number)
 *   currency     — "CLP" | "UF" (default "CLP")
 *   city         — "santiago" | "valparaiso" | "concepcion"
 *   propertyType — "departamento" | "casa"
 *   rooms        — minimum bedrooms
 *   baths        — minimum bathrooms
 *   id           — fetch a single property by ID
 *
 * Data source priority:
 *   1. Mercado Libre API (if ML_APP_ID + ML_APP_SECRET are set in .env.local)
 *   2. Mock dataset (fallback — always available)
 */
export async function GET(request: NextRequest) {
  try {
    const sp = request.nextUrl.searchParams;

    const budget = sp.get("budget");
    const currency = (sp.get("currency") || "CLP") as "CLP" | "UF";
    const city = sp.get("city") || undefined;
    const propertyType = sp.get("propertyType") || undefined;
    const rooms = sp.get("rooms") ? parseInt(sp.get("rooms")!) : undefined;
    const baths = sp.get("baths") ? parseInt(sp.get("baths")!) : undefined;
    const id = sp.get("id") || undefined;

    // ── Fetch live UF value ──────────────────────────────────────────────
    let ufValue = 36520;
    try {
      const ufRes = await fetch("https://mindicador.cl/api/uf", {
        next: { revalidate: 43200 }, // cache UF for 12 h
      });
      if (ufRes.ok) {
        const ufData = await ufRes.json();
        if (ufData.serie?.[0]) ufValue = ufData.serie[0].valor;
      }
    } catch {
      // Fallback UF value is acceptable for minor drift
    }

    let properties;

    // ── Single property lookup ───────────────────────────────────────────
    if (id) {
      if (isMLConfigured() && id.startsWith("MLC")) {
        // Fetch live from Mercado Libre
        const mlProp = await getMLPropertyById(id, ufValue);
        properties = mlProp ? [mlProp] : [];
      } else {
        // Fetch from mock dataset
        const { mockProperties } = await import("@/lib/properties");
        properties = mockProperties.filter((p) => p.id === id);
      }
    } else {
      // ── Search ────────────────────────────────────────────────────────
      if (!budget) {
        return NextResponse.json(
          { error: "Budget parameter is required for search" },
          { status: 400 }
        );
      }

      const budgetNum = parseFloat(budget);

      if (isMLConfigured()) {
        // ── Try Mercado Libre first ────────────────────────────────────
        const mlResult = await searchMLProperties({
          city,
          propertyType,
          rooms,
          budget: budgetNum,
          currency,
          ufValue,
        });

        if (mlResult && mlResult.properties.length > 0) {
          properties = mlResult.properties;
        } else {
          // ML returned nothing (no results or API error) → fall back
          console.warn("[propiedades] ML returned no results, using mock data");
          properties = filterProperties(
            budgetNum,
            currency,
            city,
            propertyType,
            rooms,
            baths,
            ufValue
          );
        }
      } else {
        // ── No ML credentials — use mock data ─────────────────────────
        properties = filterProperties(
          budgetNum,
          currency,
          city,
          propertyType,
          rooms,
          baths,
          ufValue
        );
      }
    }

    const response: PropertySearchResponse = {
      properties,
      total: properties.length,
      ufValue,
    };

    return NextResponse.json(response, {
      headers: {
        // Public CDN cache for 1 h, stale-while-revalidate for 24 h
        "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
      },
    });
  } catch (error) {
    console.error("[propiedades] Unhandled error:", error);
    return NextResponse.json(
      { error: "Failed to search properties" },
      { status: 500 }
    );
  }
}
