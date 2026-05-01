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
      rate: 4.19,
      rateLowPie: 4.69,
      rateHighPie: 3.89,
      minDownPayment: 10,
      logoColor: "#1B5E20",
    },
    {
      id: "santander",
      bank: "Banco Santander",
      shortName: "Santander",
      rate: 3.43,
      rateLowPie: 3.93,
      rateHighPie: 3.19,
      minDownPayment: 15,
      logoColor: "#C41E3A",
    },
    {
      id: "bci",
      bank: "Banco BCI",
      shortName: "BCI",
      rate: 3.96,
      rateLowPie: 4.46,
      rateHighPie: 3.65,
      minDownPayment: 20,
      logoColor: "#003DA5",
    },
    {
      id: "bdechile",
      bank: "Banco de Chile",
      shortName: "BdChile",
      rate: 3.75,
      rateLowPie: 4.25,
      rateHighPie: 3.45,
      minDownPayment: 15,
      logoColor: "#0066B2",
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
