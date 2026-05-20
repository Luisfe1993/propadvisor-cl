import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { getDb, initDb } from "@/lib/db";

let dbInit = false;
async function ensureDb() { if (!dbInit) { await initDb(); dbInit = true; } }

/**
 * GET /api/broker/leads — list leads for the authenticated broker
 * Query params: tier, city, limit, offset
 *
 * PATCH /api/broker/leads — update lead status
 * Body: { id, status, notes? }
 */
export async function GET(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: "No autenticado" }, { status: 401 });

    await ensureDb();
    const sql = getDb();

    // Check if user is a broker partner
    const partners = await sql`SELECT * FROM broker_partners WHERE user_id = ${userId} AND is_active = TRUE`;
    if (partners.length === 0) {
      return NextResponse.json({ error: "No eres un corredor registrado" }, { status: 403 });
    }

    const partner = partners[0];
    const sp = req.nextUrl.searchParams;
    const tier = sp.get("tier") || undefined;
    const city = sp.get("city") || undefined;
    const limit = Math.min(parseInt(sp.get("limit") || "50"), 100);
    const offset = parseInt(sp.get("offset") || "0");

    // Build query — broker sees leads matching their cities, or all if no city restriction
    const partnerCities = (partner.cities as string[]) || [];
    let rows;

    if (tier && city) {
      rows = await sql`
        SELECT * FROM broker_leads
        WHERE tier = ${tier} AND city = ${city}
        ORDER BY created_at DESC LIMIT ${limit} OFFSET ${offset}
      `;
    } else if (tier) {
      rows = await sql`
        SELECT * FROM broker_leads
        WHERE tier = ${tier}
        ORDER BY created_at DESC LIMIT ${limit} OFFSET ${offset}
      `;
    } else if (city) {
      rows = await sql`
        SELECT * FROM broker_leads
        WHERE city = ${city}
        ORDER BY created_at DESC LIMIT ${limit} OFFSET ${offset}
      `;
    } else if (partnerCities.length > 0) {
      rows = await sql`
        SELECT * FROM broker_leads
        WHERE city = ANY(${partnerCities})
        ORDER BY created_at DESC LIMIT ${limit} OFFSET ${offset}
      `;
    } else {
      rows = await sql`
        SELECT * FROM broker_leads
        ORDER BY created_at DESC LIMIT ${limit} OFFSET ${offset}
      `;
    }

    // Count totals
    const countResult = await sql`SELECT COUNT(*) as total FROM broker_leads`;
    const hotCount = await sql`SELECT COUNT(*) as total FROM broker_leads WHERE tier = 'hot'`;

    return NextResponse.json({
      leads: rows,
      total: Number(countResult[0].total),
      hotCount: Number(hotCount[0].total),
    });
  } catch (err) {
    console.error("Broker leads error:", err);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: "No autenticado" }, { status: 401 });

    await ensureDb();
    const sql = getDb();

    // Verify broker role
    const partners = await sql`SELECT * FROM broker_partners WHERE user_id = ${userId} AND is_active = TRUE`;
    if (partners.length === 0) {
      return NextResponse.json({ error: "No eres un corredor registrado" }, { status: 403 });
    }

    const { id, status, notes } = await req.json();
    if (!id || !status) return NextResponse.json({ error: "id y status requeridos" }, { status: 400 });

    const validStatuses = ["new", "viewed", "contacted", "converted", "rejected"];
    if (!validStatuses.includes(status)) {
      return NextResponse.json({ error: "Status inválido" }, { status: 400 });
    }

    await sql`
      UPDATE broker_leads 
      SET status = ${status}, 
          contacted_at = ${status === "contacted" || status === "converted" ? new Date().toISOString() : null},
          notes = COALESCE(${notes || null}, notes)
      WHERE id = ${id}
    `;

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Broker lead update error:", err);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}
