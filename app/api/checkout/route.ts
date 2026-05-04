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
 * POST /api/checkout — create a Stripe Checkout session for Pro subscription
 */
export async function POST() {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: "No autenticado" }, { status: 401 });

    if (!process.env.STRIPE_SECRET_KEY || !process.env.STRIPE_PRICE_ID) {
      return NextResponse.json({ error: "Stripe no configurado" }, { status: 500 });
    }

    await ensureDb();
    const sql = getDb();

    // Check if user already has a Stripe customer
    const existing = await sql`SELECT stripe_customer_id FROM subscriptions WHERE user_id = ${userId}`;
    let customerId = existing[0]?.stripe_customer_id as string | undefined;

    if (!customerId) {
      // Create Stripe customer
      const customer = await getStripe().customers.create({
        metadata: { userId },
      });
      customerId = customer.id;

      // Create subscription record
      await sql`
        INSERT INTO subscriptions (user_id, stripe_customer_id, plan, status)
        VALUES (${userId}, ${customerId}, 'free', 'inactive')
        ON CONFLICT (user_id) DO UPDATE SET stripe_customer_id = ${customerId}
      `;
    }

    // Create checkout session
    const session = await getStripe().checkout.sessions.create({
      customer: customerId,
      mode: "subscription",
      line_items: [{ price: process.env.STRIPE_PRICE_ID, quantity: 1 }],
      success_url: `${process.env.NEXT_PUBLIC_APP_URL || "https://www.propadvisor.site"}/dashboard?upgraded=true`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL || "https://www.propadvisor.site"}/pricing`,
      subscription_data: {
        trial_period_days: 7,
        metadata: { userId },
      },
      metadata: { userId },
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error("Checkout error:", err);
    return NextResponse.json({ error: "Error al crear checkout" }, { status: 500 });
  }
}
