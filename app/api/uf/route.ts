import { NextResponse } from "next/server";

export async function GET() {
  try {
    // Fetch ALL indicators from mindicador.cl in one call (free, no API key)
    const response = await fetch("https://mindicador.cl/api", {
      next: { revalidate: 3600 },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch from mindicador.cl");
    }

    const data = await response.json();

    const ufValue = data.uf?.valor;
    const ufDate = data.uf?.fecha;

    if (!ufValue) {
      throw new Error("No UF value found in response");
    }

    return NextResponse.json(
      {
        value: ufValue,
        date: ufDate || new Date().toISOString().split("T")[0],
        source: "mindicador",
        // Extra indicators for context (used by analysis engine + UI)
        dolar: data.dolar?.valor ?? null,
        ipc: data.ipc?.valor ?? null,     // monthly IPC % change
        tpm: data.tpm?.valor ?? null,     // Tasa Política Monetaria %
      },
      {
        // Cache for 1 hour (UF only updates daily)
        headers: {
          "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
        },
      }
    );
  } catch (error) {
    // Fallback to a reasonable default if API fails
    const fallbackUF = 40290;
    return NextResponse.json(
      {
        value: fallbackUF,
        date: new Date().toISOString().split("T")[0],
        source: "fallback",
        dolar: 894,
        ipc: 0.3,
        tpm: 4.5,
        error: "Failed to fetch from mindicador, using fallback value",
      },
      { status: 200 }
    );
  }
}
