import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { getDb, initDb, getUserPlan } from "@/lib/db";

// Initialize DB on first request
let dbInitialized = false;

async function ensureDb() {
  if (!dbInitialized) {
    await initDb();
    dbInitialized = true;
  }
}

/**
 * GET /api/portfolio — list all saved properties for the current user
 */
export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "No autenticado" }, { status: 401 });
    }

    await ensureDb();
    const sql = getDb();
    const rows = await sql`
      SELECT * FROM saved_properties
      WHERE user_id = ${userId}
      ORDER BY created_at DESC
    `;

    return NextResponse.json({ properties: rows });
  } catch (err) {
    console.error("Portfolio GET error:", err);
    return NextResponse.json({ error: "Error al cargar portfolio" }, { status: 500 });
  }
}

/**
 * POST /api/portfolio — save a new property to portfolio
 */
export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "No autenticado" }, { status: 401 });
    }

    await ensureDb();
    const body = await req.json();
    const sql = getDb();

    // Check plan limits: free = 1 property, pro = unlimited
    const plan = await getUserPlan(userId);
    if (!plan.isActive) {
      const existing = await sql`SELECT COUNT(*) as count FROM saved_properties WHERE user_id = ${userId}`;
      const count = Number(existing[0]?.count || 0);
      if (count >= 1) {
        return NextResponse.json({
          error: "Límite alcanzado. Actualiza a Pro para guardar propiedades ilimitadas.",
          upgrade: true,
        }, { status: 403 });
      }
    }

    const rows = await sql`
      INSERT INTO saved_properties (
        user_id, label, city, comuna, price_uf, price_clp, monthly_rent,
        property_type, bank_name, interest_rate, down_payment_pct,
        loan_term_years, monthly_payment, monthly_costs,
        buy_net_wealth, rent_net_wealth, invest_net_wealth,
        net_monthly_flow, cap_rate, winner, notes
      ) VALUES (
        ${userId},
        ${body.label || ""},
        ${body.city || ""},
        ${body.comuna || ""},
        ${body.priceUF || 0},
        ${body.priceCLP || 0},
        ${body.monthlyRent || 0},
        ${body.propertyType || ""},
        ${body.bankName || ""},
        ${body.interestRate || 0},
        ${body.downPaymentPct || 20},
        ${body.loanTermYears || 20},
        ${body.monthlyPayment || 0},
        ${body.monthlyCosts || 200000},
        ${body.buyNetWealth || 0},
        ${body.rentNetWealth || 0},
        ${body.investNetWealth || 0},
        ${body.netMonthlyFlow || 0},
        ${body.capRate || 0},
        ${body.winner || "buy"},
        ${body.notes || ""}
      )
      RETURNING *
    `;

    return NextResponse.json({ property: rows[0] }, { status: 201 });
  } catch (err) {
    console.error("Portfolio POST error:", err);
    return NextResponse.json({ error: "Error al guardar propiedad" }, { status: 500 });
  }
}

/**
 * DELETE /api/portfolio?id=xxx — delete a saved property
 */
export async function DELETE(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "No autenticado" }, { status: 401 });
    }

    const id = req.nextUrl.searchParams.get("id");
    if (!id) {
      return NextResponse.json({ error: "ID requerido" }, { status: 400 });
    }

    await ensureDb();
    const sql = getDb();

    await sql`
      DELETE FROM saved_properties
      WHERE id = ${id} AND user_id = ${userId}
    `;

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Portfolio DELETE error:", err);
    return NextResponse.json({ error: "Error al eliminar" }, { status: 500 });
  }
}
