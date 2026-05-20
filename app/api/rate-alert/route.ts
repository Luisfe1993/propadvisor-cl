export const runtime = "nodejs";

import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

/**
 * POST /api/rate-alert — Add email to Resend audience for rate drop alerts
 */
export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: "Email inválido" }, { status: 400 });
    }

    if (!process.env.RESEND_API_KEY || !process.env.RESEND_AUDIENCE_ID) {
      return NextResponse.json({ error: "Resend no configurado" }, { status: 500 });
    }

    const resend = new Resend(process.env.RESEND_API_KEY);

    await resend.contacts.create({
      email,
      firstName: "Alerta tasas",
      lastName: `tool=rate-alert | tier=visitor | date=${new Date().toISOString().split("T")[0]} | broker=no`,
      audienceId: process.env.RESEND_AUDIENCE_ID,
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Rate alert signup error:", err);
    return NextResponse.json({ error: "Error al registrar" }, { status: 500 });
  }
}
