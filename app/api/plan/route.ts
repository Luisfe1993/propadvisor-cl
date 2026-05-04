import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { initDb, getUserPlan } from "@/lib/db";

let dbInit = false;
async function ensureDb() { if (!dbInit) { await initDb(); dbInit = true; } }

/**
 * GET /api/plan — get current user's subscription plan
 */
export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ plan: "free", isActive: false });

    await ensureDb();
    const plan = await getUserPlan(userId);
    return NextResponse.json(plan);
  } catch {
    return NextResponse.json({ plan: "free", isActive: false });
  }
}
