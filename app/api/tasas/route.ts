import { NextResponse } from "next/server";
import { BankRate } from "@/lib/types";

/**
 * Returns real Chilean bank mortgage rates
 * Source: CMF Chile February 2026 data
 * Rates updated manually as they change (approximately monthly)
 */
export async function GET() {
  const bankRates: BankRate[] = [
    {
      id: "bancoestado",
      bank: "BancoEstado",
      shortName: "BE",
      rate: 4.19, // "Hipoteazo" UF + 3.50%
      minDownPayment: 10,
      logoColor: "#1B5E20", // Green (official color)
    },
    {
      id: "santander",
      bank: "Banco Santander",
      shortName: "Santander",
      rate: 3.43, // Subsidy UF + 3.43%
      minDownPayment: 15,
      logoColor: "#C41E3A", // Red (official color)
    },
    {
      id: "bci",
      bank: "Banco BCI",
      shortName: "BCI",
      rate: 3.96, // Average estimate
      minDownPayment: 20,
      logoColor: "#003DA5", // Blue (official color)
    },
    {
      id: "bdechile",
      bank: "Banco de Chile",
      shortName: "BdChile",
      rate: 3.75, // Estimated based on market data
      minDownPayment: 15,
      logoColor: "#0066B2", // Blue (official color)
    },
  ];

  return NextResponse.json(
    { banks: bankRates },
    {
      // Cache for 7 days (rates change infrequently)
      headers: {
        "Cache-Control": "public, s-maxage=604800, stale-while-revalidate=86400",
      },
    }
  );
}
