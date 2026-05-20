import { NextRequest, NextResponse } from "next/server";

/**
 * POST /api/affiliate/click — track affiliate click events
 * Body: { source, city?, comuna?, priceCLP? }
 *
 * For now: logs to stdout for analytics. When affiliate agreement is signed,
 * this can persist to DB or send to the affiliate's postback URL.
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { source, city, comuna, priceCLP } = body as {
      source?: string;
      city?: string;
      comuna?: string;
      priceCLP?: number;
    };

    const clickData = {
      type: "AFFILIATE_CLICK",
      timestamp: new Date().toISOString(),
      source: source || "unknown",
      city: city || "",
      comuna: comuna || "",
      priceCLP: priceCLP || 0,
    };

    console.log(JSON.stringify(clickData));

    // When DB tracking is needed, persist here:
    // const sql = getDb(); await sql`INSERT INTO affiliate_clicks ...`;

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Error" }, { status: 500 });
  }
}
