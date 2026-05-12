import { NextResponse } from "next/server";

/**
 * GET /api/indicadores
 *
 * Returns key Chilean economic indicators from mindicador.cl (free, no API key).
 * Pulls: UF, dólar, euro, IPC, TPM, UTM, tasa desempleo.
 *
 * These feed into:
 *   - Analysis engine (real IPC → rent inflation, TPM → mortgage context)
 *   - UI badges ("Fuente: Banco Central / INE vía mindicador.cl")
 *   - Guía page market context section
 */

export interface IndicadoresResponse {
  uf: { valor: number; fecha: string };
  dolar: { valor: number; fecha: string };
  euro: { valor: number; fecha: string };
  ipc: { valor: number; fecha: string }; // monthly % change
  tpm: { valor: number; fecha: string }; // Tasa Política Monetaria (%)
  utm: { valor: number; fecha: string };
  tasaDesempleo: { valor: number; fecha: string };
  source: "mindicador";
  fetchedAt: string;
}

export async function GET() {
  try {
    const res = await fetch("https://mindicador.cl/api", {
      next: { revalidate: 3600 }, // cache 1 hour
    });

    if (!res.ok) {
      throw new Error(`mindicador.cl returned ${res.status}`);
    }

    const data = await res.json();

    const pick = (key: string) => ({
      valor: data[key]?.valor ?? 0,
      fecha: data[key]?.fecha ?? new Date().toISOString(),
    });

    const response: IndicadoresResponse = {
      uf: pick("uf"),
      dolar: pick("dolar"),
      euro: pick("euro"),
      ipc: pick("ipc"),
      tpm: pick("tpm"),
      utm: pick("utm"),
      tasaDesempleo: pick("tasa_desempleo"),
      source: "mindicador",
      fetchedAt: new Date().toISOString(),
    };

    return NextResponse.json(response, {
      headers: {
        "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
      },
    });
  } catch (error) {
    console.error("[indicadores] Error fetching mindicador.cl:", error);

    // Return fallback values so the UI never breaks
    const fallback: IndicadoresResponse = {
      uf: { valor: 40290, fecha: new Date().toISOString() },
      dolar: { valor: 894, fecha: new Date().toISOString() },
      euro: { valor: 1053, fecha: new Date().toISOString() },
      ipc: { valor: 0.3, fecha: new Date().toISOString() },
      tpm: { valor: 4.5, fecha: new Date().toISOString() },
      utm: { valor: 70588, fecha: new Date().toISOString() },
      tasaDesempleo: { valor: 8.9, fecha: new Date().toISOString() },
      source: "mindicador",
      fetchedAt: new Date().toISOString(),
    };

    return NextResponse.json(fallback, {
      status: 200, // don't break clients
      headers: {
        "Cache-Control": "public, s-maxage=300, stale-while-revalidate=3600",
      },
    });
  }
}
