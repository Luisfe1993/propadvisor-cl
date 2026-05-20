export const runtime = "nodejs";

import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

// Bank rates — kept in sync with toolCalculations.ts
const bankRates = [
  { name: "Santander", rate: 3.43 },
  { name: "Banco de Chile", rate: 3.75 },
  { name: "Scotiabank", rate: 3.65 },
  { name: "BCI", rate: 3.96 },
  { name: "Itaú", rate: 3.55 },
  { name: "BancoEstado", rate: 4.19 },
  { name: "Security", rate: 3.80 },
  { name: "BICE", rate: 3.70 },
];

function rateRow(bank: { name: string; rate: number }, best: boolean): string {
  return `
    <tr style="border-bottom:1px solid #e5e7eb">
      <td style="padding:10px 16px;font-size:14px;font-weight:${best ? "700" : "400"};color:${best ? "#0d9488" : "#374151"}">${bank.name}${best ? " ⭐" : ""}</td>
      <td style="padding:10px 16px;font-size:14px;font-weight:700;text-align:right;color:${best ? "#0d9488" : "#374151"}">${bank.rate.toFixed(2)}%</td>
    </tr>`;
}

function buildEmailHTML(): string {
  const sorted = [...bankRates].sort((a, b) => a.rate - b.rate);
  const bestRate = sorted[0];
  const month = new Date().toLocaleDateString("es-CL", { month: "long", year: "numeric" });

  return `
<!DOCTYPE html>
<html lang="es">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"></head>
<body style="margin:0;padding:0;background:#f3f4f6;font-family:Arial,sans-serif">
<div style="max-width:600px;margin:0 auto;background:white">

  <!-- Header -->
  <div style="background:linear-gradient(135deg,#0f766e 0%,#1e3a5f 100%);padding:32px 24px;text-align:center">
    <h1 style="color:white;font-size:22px;font-weight:800;margin:0 0 8px;letter-spacing:-0.02em">
      📊 Tasas Hipotecarias — ${month.charAt(0).toUpperCase() + month.slice(1)}
    </h1>
    <p style="color:#93c5fd;font-size:14px;margin:0">PropAdvisor CL — Tu asesor inmobiliario inteligente</p>
  </div>

  <!-- Intro -->
  <div style="padding:24px 24px 16px">
    <p style="font-size:15px;color:#374151;line-height:1.6;margin:0 0 16px">
      Hola 👋
    </p>
    <p style="font-size:15px;color:#374151;line-height:1.6;margin:0 0 16px">
      Estas son las <strong>tasas hipotecarias vigentes</strong> en los principales bancos de Chile.
      La mejor tasa este mes es <strong>${bestRate.name} con ${bestRate.rate.toFixed(2)}%</strong>.
    </p>
  </div>

  <!-- Rate table -->
  <div style="padding:0 24px 24px">
    <table style="width:100%;border-collapse:collapse;border:1px solid #e5e7eb;border-radius:8px;overflow:hidden">
      <thead>
        <tr style="background:#1e3a5f">
          <th style="padding:10px 16px;font-size:12px;color:white;text-align:left;text-transform:uppercase;letter-spacing:0.04em">Banco</th>
          <th style="padding:10px 16px;font-size:12px;color:white;text-align:right;text-transform:uppercase;letter-spacing:0.04em">Tasa anual</th>
        </tr>
      </thead>
      <tbody>
        ${sorted.map((b) => rateRow(b, b.name === bestRate.name)).join("")}
      </tbody>
    </table>
    <p style="font-size:11px;color:#9ca3af;margin:8px 0 0">
      Tasas referenciales para créditos hipotecarios a 20 años, pie 20%. Pueden variar según perfil crediticio.
    </p>
  </div>

  <!-- Insight -->
  <div style="padding:0 24px 24px">
    <div style="background:#f0fdfa;border:1px solid #99f6e4;border-radius:10px;padding:16px">
      <p style="font-size:13px;font-weight:700;color:#0d9488;margin:0 0 6px">💡 ¿Qué significa esto?</p>
      <p style="font-size:13px;color:#374151;line-height:1.6;margin:0">
        Una diferencia de <strong>0.5% en la tasa</strong> puede significar más de <strong>$5 millones</strong> de diferencia
        en el total que pagas por tu crédito a 20 años. Siempre cotiza en al menos 3 bancos antes de decidir.
      </p>
    </div>
  </div>

  <!-- CTA -->
  <div style="padding:0 24px 32px;text-align:center">
    <p style="font-size:15px;color:#374151;margin:0 0 16px;line-height:1.6">
      ¿Quieres saber exactamente cuánto pagarías con cada banco?
    </p>
    <a href="https://www.propadvisor.site/calcular?utm_source=email&utm_medium=campaign&utm_campaign=tasas-${new Date().toISOString().slice(0, 7)}"
       style="display:inline-block;background:#0d9488;color:white;padding:14px 32px;border-radius:10px;font-size:15px;font-weight:700;text-decoration:none">
      Analizar una propiedad gratis →
    </a>
    <p style="font-size:12px;color:#9ca3af;margin:12px 0 0">
      100% gratis · Sin registro · Resultado en 2 minutos
    </p>
  </div>

  <!-- Tools teaser -->
  <div style="padding:0 24px 24px">
    <div style="border-top:1px solid #e5e7eb;padding-top:20px">
      <p style="font-size:13px;font-weight:700;color:#6b7280;text-transform:uppercase;letter-spacing:0.04em;margin:0 0 12px">
        Herramientas gratuitas
      </p>
      <table style="width:100%" cellpadding="0" cellspacing="0">
        <tr>
          <td style="padding:6px 0"><a href="https://www.propadvisor.site/herramientas/me-alcanza?utm_source=email&utm_medium=campaign" style="color:#0d9488;font-size:13px;text-decoration:none;font-weight:600">💰 ¿Me alcanza para comprar?</a></td>
        </tr>
        <tr>
          <td style="padding:6px 0"><a href="https://www.propadvisor.site/herramientas/dividendo?utm_source=email&utm_medium=campaign" style="color:#0d9488;font-size:13px;text-decoration:none;font-weight:600">🏠 ¿Cuánto sería mi dividendo?</a></td>
        </tr>
        <tr>
          <td style="padding:6px 0"><a href="https://www.propadvisor.site/herramientas/comprar-o-arrendar?utm_source=email&utm_medium=campaign" style="color:#0d9488;font-size:13px;text-decoration:none;font-weight:600">⚖️ ¿Conviene comprar o arrendar?</a></td>
        </tr>
      </table>
    </div>
  </div>

  <!-- Footer -->
  <div style="background:#f9fafb;padding:20px 24px;border-top:1px solid #e5e7eb;text-align:center">
    <p style="font-size:12px;color:#9ca3af;margin:0 0 8px">
      <a href="https://www.propadvisor.site" style="color:#0d9488;text-decoration:none;font-weight:600">PropAdvisor CL</a> — Tu asesor inmobiliario inteligente
    </p>
    <p style="font-size:11px;color:#9ca3af;margin:0">
      Recibes este email porque usaste nuestras herramientas. 
      <a href="{{{RESEND_UNSUBSCRIBE_URL}}}" style="color:#9ca3af;text-decoration:underline">Desuscribirse</a>
    </p>
  </div>

</div>
</body>
</html>`;
}

/**
 * POST /api/email-campaign — Send a rate update campaign to the Resend audience
 * Protected by a secret key to prevent unauthorized sends
 */
export async function POST(req: NextRequest) {
  try {
    // Verify campaign secret (prevent unauthorized sends)
    const body = await req.json();
    if (body.secret !== process.env.CAMPAIGN_SECRET) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    if (!process.env.RESEND_API_KEY || !process.env.RESEND_AUDIENCE_ID) {
      return NextResponse.json({ error: "Resend no configurado" }, { status: 500 });
    }

    const resend = new Resend(process.env.RESEND_API_KEY);
    const month = new Date().toLocaleDateString("es-CL", { month: "long", year: "numeric" });
    const subject = `📊 Tasas hipotecarias ${month.charAt(0).toUpperCase() + month.slice(1)} — ¿Cuál banco te conviene?`;

    const { data, error } = await resend.broadcasts.create({
      audienceId: process.env.RESEND_AUDIENCE_ID,
      from: "PropAdvisor CL <info@propadvisor.site>",
      subject,
      html: buildEmailHTML(),
    });

    if (error) {
      console.error("Campaign send error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      broadcastId: data?.id,
      subject,
    });
  } catch (err) {
    console.error("Campaign error:", err);
    return NextResponse.json({ error: "Error al enviar campaña" }, { status: 500 });
  }
}
