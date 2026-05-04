import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import Stripe from "stripe";
import { getDb, initDb } from "@/lib/db";

let dbInit = false;
async function ensureDb() { if (!dbInit) { await initDb(); dbInit = true; } }

function getStripe() {
  return new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: "2026-04-22.dahlia",
  });
}

/**
 * POST /api/billing — create a Stripe Billing Portal session
 * Allows users to manage/cancel their subscription
 */
export async function POST() {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: "No autenticado" }, { status: 401 });

    if (!process.env.STRIPE_SECRET_KEY) {
      return NextResponse.json({ error: "Stripe no configurado" }, { status: 500 });
    }

    await ensureDb();
    const sql = getDb();

    const rows = await sql`SELECT stripe_customer_id FROM subscriptions WHERE user_id = ${userId}`;
    const customerId = rows[0]?.stripe_customer_id as string | undefined;

    if (!customerId) {
      return NextResponse.json({ error: "No tienes una suscripción activa" }, { status: 400 });
    }

    const session = await getStripe().billingPortal.sessions.create({
      customer: customerId,
      return_url: `${process.env.NEXT_PUBLIC_APP_URL || "https://www.propadvisor.site"}/dashboard`,
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error("Billing portal error:", err);
    return NextResponse.json({ error: "Error al abrir portal de facturación" }, { status: 500 });
  }
}
