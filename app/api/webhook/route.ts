import { NextRequest, NextResponse } from "next/server";
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
 * POST /api/webhook — Stripe webhook handler
 * Handles: checkout.session.completed, customer.subscription.updated/deleted
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.text();
    const sig = req.headers.get("stripe-signature");

    if (!sig || !process.env.STRIPE_WEBHOOK_SECRET) {
      return NextResponse.json({ error: "No webhook secret" }, { status: 400 });
    }

    let event: Stripe.Event;
    try {
      event = getStripe().webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET);
    } catch {
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
    }

    await ensureDb();
    const sql = getDb();

    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        const userId = session.metadata?.userId;
        const subscriptionId = session.subscription as string;
        if (userId && subscriptionId) {
          const sub = await getStripe().subscriptions.retrieve(subscriptionId);
          const trialEnd = (sub as unknown as Record<string, unknown>).trial_end as number | null;
          const periodEnd = (sub as unknown as Record<string, unknown>).current_period_end as number | null;
          await sql`
            INSERT INTO subscriptions (user_id, stripe_customer_id, stripe_subscription_id, plan, status, trial_ends_at, current_period_end)
            VALUES (${userId}, ${session.customer as string}, ${subscriptionId}, 'pro', ${sub.status}, ${trialEnd ? new Date(trialEnd * 1000).toISOString() : null}, ${periodEnd ? new Date(periodEnd * 1000).toISOString() : null})
            ON CONFLICT (user_id) DO UPDATE SET
              stripe_subscription_id = ${subscriptionId},
              plan = 'pro',
              status = ${sub.status},
              trial_ends_at = ${trialEnd ? new Date(trialEnd * 1000).toISOString() : null},
              current_period_end = ${periodEnd ? new Date(periodEnd * 1000).toISOString() : null},
              updated_at = NOW()
          `;
          console.log(`Subscription activated for user ${userId}: ${sub.status}`);
        }
        break;
      }

      case "customer.subscription.updated": {
        const sub = event.data.object as Stripe.Subscription;
        const customerId = sub.customer as string;
        const trialEnd = (sub as unknown as Record<string, unknown>).trial_end as number | null;
        const periodEnd = (sub as unknown as Record<string, unknown>).current_period_end as number | null;
        await sql`
          UPDATE subscriptions SET
            status = ${sub.status},
            plan = ${sub.status === "active" || sub.status === "trialing" ? "pro" : "free"},
            current_period_end = ${periodEnd ? new Date(periodEnd * 1000).toISOString() : null},
            trial_ends_at = ${trialEnd ? new Date(trialEnd * 1000).toISOString() : null},
            updated_at = NOW()
          WHERE stripe_customer_id = ${customerId}
        `;
        console.log(`Subscription updated for customer ${customerId}: ${sub.status}`);
        break;
      }

      case "customer.subscription.deleted": {
        const sub = event.data.object as Stripe.Subscription;
        const customerId = sub.customer as string;
        await sql`
          UPDATE subscriptions SET
            status = 'canceled',
            plan = 'free',
            updated_at = NOW()
          WHERE stripe_customer_id = ${customerId}
        `;
        console.log(`Subscription canceled for customer ${customerId}`);
        break;
      }
    }

    return NextResponse.json({ received: true });
  } catch (err) {
    console.error("Webhook error:", err);
    return NextResponse.json({ error: "Webhook error" }, { status: 500 });
  }
}
