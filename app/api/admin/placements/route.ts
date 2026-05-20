import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { getDb, initDb } from "@/lib/db";

let dbInit = false;
async function ensureDb() { if (!dbInit) { await initDb(); dbInit = true; } }

const ADMIN_IDS = new Set([
  process.env.ADMIN_USER_ID || "",
]);

async function requireAdmin() {
  const { userId } = await auth();
  if (!userId || !ADMIN_IDS.has(userId)) return null;
  return userId;
}

/**
 * GET /api/admin/placements — list all placements
 */
export async function GET() {
  const userId = await requireAdmin();
  if (!userId) return NextResponse.json({ error: "No autorizado" }, { status: 403 });

  await ensureDb();
  const sql = getDb();
  const rows = await sql`SELECT * FROM featured_placements ORDER BY created_at DESC`;
  return NextResponse.json({ placements: rows });
}

/**
 * POST /api/admin/placements — create new placement
 */
export async function POST(req: NextRequest) {
  const userId = await requireAdmin();
  if (!userId) return NextResponse.json({ error: "No autorizado" }, { status: 403 });

  await ensureDb();
  const sql = getDb();
  const body = await req.json();

  const { developer_name, project_name, city, comuna, price_uf_from, price_uf_to, property_type, description, image_url, cta_url } = body;
  if (!developer_name || !project_name || !city) {
    return NextResponse.json({ error: "Campos requeridos: developer_name, project_name, city" }, { status: 400 });
  }

  await sql`
    INSERT INTO featured_placements (developer_name, project_name, city, comuna, price_uf_from, price_uf_to, property_type, description, image_url, cta_url)
    VALUES (${developer_name}, ${project_name}, ${city}, ${comuna || ""}, ${price_uf_from || 0}, ${price_uf_to || 0}, ${property_type || "departamento"}, ${description || ""}, ${image_url || ""}, ${cta_url || ""})
  `;

  return NextResponse.json({ success: true });
}

/**
 * PATCH /api/admin/placements — toggle active status
 */
export async function PATCH(req: NextRequest) {
  const userId = await requireAdmin();
  if (!userId) return NextResponse.json({ error: "No autorizado" }, { status: 403 });

  await ensureDb();
  const sql = getDb();
  const { id, is_active } = await req.json();
  if (!id) return NextResponse.json({ error: "id requerido" }, { status: 400 });

  await sql`UPDATE featured_placements SET is_active = ${is_active} WHERE id = ${id}`;
  return NextResponse.json({ success: true });
}
