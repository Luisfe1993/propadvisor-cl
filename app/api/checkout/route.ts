import { NextRequest, NextResponse } from "next/server";
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
 * POST /api/checkout — create a Stripe Checkout session for Pro or Profesional subscription
 */
export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: "No autenticado" }, { status: 401 });

    if (!process.env.STRIPE_SECRET_KEY || !process.env.STRIPE_PRICE_ID) {
      return NextResponse.json({ error: "Stripe no configurado" }, { status: 500 });
    }

    // Determine which plan to checkout
    let priceId = process.env.STRIPE_PRICE_ID;
    let planName = "pro";
    let isSingleAnalysis = false;
    try {
      const body = await req.json();
      if (body.plan === "profesional" && process.env.STRIPE_PROFESIONAL_PRICE_ID) {
        priceId = process.env.STRIPE_PROFESIONAL_PRICE_ID;
        planName = "profesional";
      } else if (body.plan === "single" && process.env.STRIPE_SINGLE_ANALYSIS_PRICE_ID) {
        priceId = process.env.STRIPE_SINGLE_ANALYSIS_PRICE_ID;
        planName = "single";
        isSingleAnalysis = true;
      }
    } catch {
      // No body or invalid JSON — default to Pro
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
    const sessionParams: Stripe.Checkout.SessionCreateParams = {
      customer: customerId,
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${process.env.NEXT_PUBLIC_APP_URL || "https://www.propadvisor.site"}/dashboard?upgraded=true`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL || "https://www.propadvisor.site"}/pricing`,
      metadata: { userId, plan: planName },
    };

    if (isSingleAnalysis) {
      // One-time payment — grants 24h Pro access
      sessionParams.mode = "payment";
    } else {
      // Subscription with 7-day trial
      sessionParams.mode = "subscription";
      sessionParams.subscription_data = {
        trial_period_days: 7,
        metadata: { userId, plan: planName },
      };
    }

    const session = await getStripe().checkout.sessions.create(sessionParams);

    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error("Checkout error:", err);
    const message = err instanceof Error ? err.message : "Error desconocido";
    return NextResponse.json({ error: `Error al crear checkout: ${message}` }, { status: 500 });
  }
}
