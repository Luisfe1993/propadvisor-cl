import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { getDb, initDb } from "@/lib/db";

let dbInit = false;
async function ensureDb() { if (!dbInit) { await initDb(); dbInit = true; } }

/**
 * GET /api/portfolio/[id] — get a single saved property
 */
export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: "No autenticado" }, { status: 401 });

    const { id } = await params;
    await ensureDb();
    const sql = getDb();
    const rows = await sql`
      SELECT * FROM saved_properties WHERE id = ${id} AND user_id = ${userId}
    `;
    if (rows.length === 0) return NextResponse.json({ error: "No encontrada" }, { status: 404 });

    return NextResponse.json({ property: rows[0] });
  } catch (err) {
    console.error("Portfolio [id] GET error:", err);
    return NextResponse.json({ error: "Error" }, { status: 500 });
  }
}

/**
 * PATCH /api/portfolio/[id] — update advanced fields
 */
export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: "No autenticado" }, { status: 401 });

    const { id } = await params;
    const body = await req.json();
    await ensureDb();
    const sql = getDb();

    // Only update allowed fields
    await sql`
      UPDATE saved_properties SET
        monthly_costs = COALESCE(${body.monthlyCosts ?? null}, monthly_costs),
        notes = COALESCE(${body.notes ?? null}, notes),
        updated_at = NOW()
      WHERE id = ${id} AND user_id = ${userId}
    `;

    const rows = await sql`SELECT * FROM saved_properties WHERE id = ${id} AND user_id = ${userId}`;
    return NextResponse.json({ property: rows[0] });
  } catch (err) {
    console.error("Portfolio [id] PATCH error:", err);
    return NextResponse.json({ error: "Error" }, { status: 500 });
  }
}
