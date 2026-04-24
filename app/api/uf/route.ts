import { NextResponse } from "next/server";

export async function GET() {
  try {
    // Fetch real UF value from mindicador.cl (free, no API key required)
    const response = await fetch("https://mindicador.cl/api/uf");

    if (!response.ok) {
      throw new Error("Failed to fetch from mindicador.cl");
    }

    const data = await response.json();

    // Extract today's UF value from the response
    const ufValue = data.serie && data.serie[0] ? data.serie[0].valor : null;
    const ufDate = data.serie && data.serie[0] ? data.serie[0].fecha : null;

    if (!ufValue) {
      throw new Error("No UF value found in response");
    }

    return NextResponse.json(
      {
        value: ufValue,
        date: ufDate || new Date().toISOString().split("T")[0],
        source: "mindicador",
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
    const fallbackUF = 36520;
    return NextResponse.json(
      {
        value: fallbackUF,
        date: new Date().toISOString().split("T")[0],
        source: "fallback",
        error: "Failed to fetch from mindicador, using fallback value",
      },
      { status: 200 }
    );
  }
}
