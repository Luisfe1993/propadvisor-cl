export const runtime = "nodejs";

import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { renderToBuffer } from "@react-pdf/renderer";
import { createElement } from "react";
import { AnalysisPDF, type AnalysisPDFProps } from "@/components/AnalysisPDF";
import { generateExcel, type ExcelReportData } from "@/lib/generateExcel";
import { routeLead } from "@/lib/brokerRouting";

// Basic disposable email domain blocklist
const DISPOSABLE_DOMAINS = new Set([
  "mailinator.com", "guerrillamail.com", "temp-mail.org", "throwaway.email",
  "yopmail.com", "trashmail.com", "sharklasers.com", "guerrillamailblock.com",
  "grr.la", "guerrillamail.info", "spam4.me", "dispostable.com",
]);

// Simple in-memory deduplication (resets on cold start, good enough for MVP)
const recentLeads = new Map<string, number>();
const DEDUP_WINDOW_MS = 30 * 60 * 1000; // 30 minutes

function isValidEmail(email: string): boolean {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!re.test(email)) return false;
  const domain = email.split("@")[1]?.toLowerCase();
  if (!domain) return false;
  if (DISPOSABLE_DOMAINS.has(domain)) return false;
  return true;
}

function isDuplicateLead(email: string): boolean {
  const lastSeen = recentLeads.get(email);
  const now = Date.now();
  if (lastSeen && now - lastSeen < DEDUP_WINDOW_MS) return true;
  recentLeads.set(email, now);
  // Clean old entries periodically
  if (recentLeads.size > 1000) {
    for (const [key, time] of recentLeads) {
      if (now - time > DEDUP_WINDOW_MS) recentLeads.delete(key);
    }
  }
  return false;
}

/**
 * Lead quality score (0-10)
 * Higher = more valuable to broker
 */
function calcLeadScore(data: {
  phone?: string;
  hasPreApproval?: boolean;
  hasPieAvailable?: boolean;
  incomeRange?: string;
  name?: string;
  wantsBrokerContact?: boolean;
}): { score: number; tier: "hot" | "warm" | "cold" } {
  let score = 0;
  if (data.wantsBrokerContact) score += 1;
  if (data.name) score += 1;
  if (data.phone) score += 2; // Phone = most valuable signal
  if (data.hasPreApproval) score += 3; // Pre-approved = ready to close
  if (data.hasPieAvailable) score += 1;
  if (data.incomeRange === "3M-5M" || data.incomeRange === "5M+") score += 2;
  else if (data.incomeRange === "2M-3M") score += 1;

  const tier = score >= 6 ? "hot" : score >= 3 ? "warm" : "cold";
  return { score, tier };
}

function formatCLP(v: number): string {
  return new Intl.NumberFormat("es-CL", {
    style: "currency",
    currency: "CLP",
    minimumFractionDigits: 0,
  }).format(v);
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      email, wantsBrokerContact, utmSource,
      name, phone, incomeRange, hasPieAvailable, hasPreApproval,
      ...analysisData
    } = body as {
      email: string;
      wantsBrokerContact?: boolean;
      utmSource?: string;
      name?: string;
      phone?: string;
      incomeRange?: string;
      hasPieAvailable?: boolean;
      hasPreApproval?: boolean;
    } & AnalysisPDFProps & ExcelReportData;

    // Validate email
    if (!email || !isValidEmail(email)) {
      return NextResponse.json({ error: "Email inválido" }, { status: 400 });
    }

    // Check API key
    if (!process.env.RESEND_API_KEY) {
      console.error("RESEND_API_KEY not set");
      return NextResponse.json({ error: "Servicio de email no configurado" }, { status: 500 });
    }

    const resend = new Resend(process.env.RESEND_API_KEY);

    // Save contact to Resend audience with lead data
    if (process.env.RESEND_AUDIENCE_ID) {
      resend.contacts.create({
        email,
        audienceId: process.env.RESEND_AUDIENCE_ID,
        firstName: name || (wantsBrokerContact ? "BROKER_LEAD" : ""),
        lastName: [
          wantsBrokerContact ? "BROKER" : "",
          analysisData.address || "",
          analysisData.bankName || "",
          analysisData.interestRate ? `${analysisData.interestRate}%` : "",
          analysisData.monthlyPayment ? `div${Math.round(analysisData.monthlyPayment)}` : "",
          analysisData.city || "",
          incomeRange || "",
        ].filter(Boolean).join(" | "),
      }).catch(() => {}); // fire-and-forget
    }

    // ── BROKER LEAD PROCESSING ────────────────────────────
    if (wantsBrokerContact && !isDuplicateLead(email)) {
      // Calculate lead quality score
      const { score, tier } = calcLeadScore({
        phone, hasPreApproval, hasPieAvailable, incomeRange, name, wantsBrokerContact,
      });

      const leadData = {
        type: "BROKER_LEAD",
        timestamp: new Date().toISOString(),
        score,
        tier,
        email,
        name: name || null,
        phone: phone || null,
        incomeRange: incomeRange || null,
        hasPieAvailable: hasPieAvailable ?? null,
        hasPreApproval: hasPreApproval ?? null,
        utmSource: utmSource || "direct",
        property: analysisData.address,
        propertyType: analysisData.propertyType,
        city: analysisData.city,
        priceCLP: analysisData.priceCLP,
        priceUF: analysisData.priceUF,
        bankName: analysisData.bankName,
        interestRate: analysisData.interestRate,
        downPaymentPct: analysisData.downPaymentPct,
        monthlyPayment: analysisData.monthlyPayment,
        loanTermYears: analysisData.loanTermYears,
      };

      // Log for server-side export
      console.log(JSON.stringify(leadData));

      // Route lead to matching brokers
      const brokerTargets = routeLead(
        {
          city: analysisData.city?.toLowerCase().replace(/\s+/g, "_") || "",
          comuna: analysisData.address?.toLowerCase().replace(/\s+/g, "_") || "",
          score,
          purpose: analysisData.propertyType || "",
          priceUF: analysisData.priceUF || 0,
          hasPreApproval: hasPreApproval,
          phone: phone,
        },
        process.env.BROKER_NOTIFY_EMAIL // fallback if no routes match
      );

      // Send notification to each matched broker
      const tierEmoji = tier === "hot" ? "🔥" : tier === "warm" ? "🟡" : "🔵";
      const tierLabel = tier === "hot" ? "CALIENTE" : tier === "warm" ? "TIBIO" : "FRÍO";

      const brokerHtml = `
<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:20px;">
  <div style="background:#1E3A5F;color:white;padding:16px 24px;border-radius:8px 8px 0 0;">
    <h2 style="margin:0;font-size:18px;">PropAdvisor — Nuevo Lead ${tierEmoji}</h2>
    <p style="margin:4px 0 0;font-size:13px;opacity:0.8;">Score: ${score}/10 · ${tierLabel}</p>
  </div>

  <div style="border:1px solid #e5e7eb;border-top:none;padding:20px 24px;border-radius:0 0 8px 8px;">
    <h3 style="margin:0 0 16px;font-size:15px;color:#374151;">Datos del contacto</h3>
    <table style="width:100%;font-size:14px;border-collapse:collapse;">
      <tr><td style="padding:6px 0;color:#6b7280;width:140px;">Email</td><td style="padding:6px 0;font-weight:700;">${email}</td></tr>
      ${name ? `<tr><td style="padding:6px 0;color:#6b7280;">Nombre</td><td style="padding:6px 0;font-weight:700;">${name}</td></tr>` : ""}
      ${phone ? `<tr><td style="padding:6px 0;color:#6b7280;">Teléfono</td><td style="padding:6px 0;font-weight:700;">${phone}</td></tr>` : ""}
      ${incomeRange ? `<tr><td style="padding:6px 0;color:#6b7280;">Ingreso mensual</td><td style="padding:6px 0;">${incomeRange}</td></tr>` : ""}
      ${hasPieAvailable !== undefined ? `<tr><td style="padding:6px 0;color:#6b7280;">Pie disponible</td><td style="padding:6px 0;">${hasPieAvailable ? "✅ Sí" : "⏳ Juntando"}</td></tr>` : ""}
      ${hasPreApproval ? `<tr><td style="padding:6px 0;color:#6b7280;">Pre-aprobación</td><td style="padding:6px 0;color:#16a34a;font-weight:700;">✅ Tiene pre-aprobación</td></tr>` : ""}
    </table>

    <hr style="border:none;border-top:1px solid #e5e7eb;margin:16px 0;">

    <h3 style="margin:0 0 16px;font-size:15px;color:#374151;">Propiedad analizada</h3>
    <table style="width:100%;font-size:14px;border-collapse:collapse;">
      <tr><td style="padding:6px 0;color:#6b7280;width:140px;">Ubicación</td><td style="padding:6px 0;">${analysisData.address || ""}, ${analysisData.city}</td></tr>
      <tr><td style="padding:6px 0;color:#6b7280;">Tipo</td><td style="padding:6px 0;">${analysisData.propertyType}</td></tr>
      <tr><td style="padding:6px 0;color:#6b7280;">Precio</td><td style="padding:6px 0;font-weight:700;">${formatCLP(analysisData.priceCLP)} (UF ${Math.round(analysisData.priceUF).toLocaleString("es-CL")})</td></tr>
      <tr><td style="padding:6px 0;color:#6b7280;">Banco preferido</td><td style="padding:6px 0;">${analysisData.bankName} — ${analysisData.interestRate?.toFixed(2)}%</td></tr>
      <tr><td style="padding:6px 0;color:#6b7280;">Pie</td><td style="padding:6px 0;">${analysisData.downPaymentPct}% (${formatCLP(analysisData.priceCLP * analysisData.downPaymentPct / 100)})</td></tr>
      <tr><td style="padding:6px 0;color:#6b7280;">Dividendo</td><td style="padding:6px 0;font-weight:700;color:#0d9488;">${formatCLP(analysisData.monthlyPayment)}/mes</td></tr>
      <tr><td style="padding:6px 0;color:#6b7280;">Plazo</td><td style="padding:6px 0;">${analysisData.loanTermYears} años</td></tr>
    </table>

    <div style="margin-top:20px;padding:12px 16px;background:#f0fdf4;border-radius:6px;border-left:4px solid #16a34a;">
      <p style="margin:0;font-size:12px;font-weight:700;color:#16a34a;text-transform:uppercase;">Acción recomendada</p>
      <p style="margin:4px 0 0;font-size:14px;color:#374151;">
        ${tier === "hot" ? "Contactar INMEDIATAMENTE. Lead con pre-aprobación o teléfono + pie disponible." : tier === "warm" ? "Contactar en las próximas 24 horas. Lead con datos parciales pero interés real." : "Lead de exploración. Contactar por email primero."}
      </p>
    </div>

    <p style="margin:16px 0 0;font-size:11px;color:#9ca3af;">
      Fuente: ${utmSource || "directo"} · ${new Date().toLocaleDateString("es-CL", { day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit" })}
    </p>
  </div>
</div>`;

      for (const target of brokerTargets) {
        resend.emails.send({
          from: "PropAdvisor Leads <noreply@propadvisor.site>",
          to: target.email,
          subject: `${tierEmoji} Lead ${tierLabel} (${score}/10) — ${analysisData.address || analysisData.city} — ${formatCLP(analysisData.priceCLP)}`,
          html: brokerHtml,
        }).catch((err) => console.error(`Broker notification error (${target.name}):`, err));
      }

      if (brokerTargets.length > 0) {
        console.log(`Lead routed to: ${brokerTargets.map(t => `${t.name} (${t.email})`).join(", ")}`);
      }
    }

    // Generate PDF and Excel in parallel
    const [pdfBuffer, excelBuffer] = await Promise.all([
      renderToBuffer(
        createElement(AnalysisPDF, analysisData as AnalysisPDFProps) as Parameters<typeof renderToBuffer>[0]
      ),
      generateExcel(analysisData as ExcelReportData),
    ]);

    const propertyLabel = analysisData.address || `${analysisData.propertyType} en ${analysisData.city}`;
    const savings = analysisData.savings ?? 0;
    const savingsText = savings > 0
      ? `Comprar conviene: ahorrarías <strong>${formatCLP(Math.abs(savings))}</strong> en ${analysisData.loanTermYears} años.`
      : `Arrendar tiene menor costo directo. Ajusta el pie o el plazo en el modelo Excel para explorar alternativas.`;

    // Send email with both attachments
    const { data: sendData, error: sendError } = await resend.emails.send({
      from: "PropAdvisor <noreply@propadvisor.site>",
      to: email,
      subject: `Tu análisis PropAdvisor — ${propertyLabel}`,
      html: `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin:0;padding:0;background:#f5f5f5;font-family:Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f5f5f5;padding:32px 16px;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.08);">

        <!-- Header -->
        <tr>
          <td style="background:#1E3A5F;padding:28px 36px;">
            <p style="margin:0;font-size:22px;font-weight:800;color:#ffffff;letter-spacing:-0.03em;">PropAdvisor CL</p>
            <p style="margin:4px 0 0;font-size:13px;color:#93C5FD;">Tu análisis financiero inmobiliario</p>
          </td>
        </tr>

        <!-- Body -->
        <tr>
          <td style="padding:32px 36px;">
            <p style="margin:0 0 16px;font-size:15px;color:#374151;">Hola,</p>
            <p style="margin:0 0 24px;font-size:15px;color:#374151;line-height:1.6;">
              Adjunto encontrarás tu análisis completo para <strong>${propertyLabel}</strong>. Incluye dos archivos:
            </p>

            <!-- Files list -->
            <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
              <tr>
                <td style="background:#F0FDF4;border:1px solid #BBF7D0;border-radius:8px;padding:14px 18px;margin-bottom:12px;">
                  <p style="margin:0;font-size:14px;font-weight:700;color:#15803D;">📄 Informe PDF</p>
                  <p style="margin:4px 0 0;font-size:13px;color:#374151;">Resumen profesional listo para compartir con tu banco o corredor.</p>
                </td>
              </tr>
              <tr><td style="height:8px;"></td></tr>
              <tr>
                <td style="background:#EFF6FF;border:1px solid #BFDBFE;border-radius:8px;padding:14px 18px;">
                  <p style="margin:0;font-size:14px;font-weight:700;color:#1D4ED8;">📊 Modelo Excel (4 hojas)</p>
                  <p style="margin:4px 0 0;font-size:13px;color:#374151;">
                    <strong>Resumen</strong> · <strong>Amortización mes a mes</strong> · <strong>Comparación 20 años</strong> · <strong>Análisis de sensibilidad</strong><br>
                    Modifica las celdas azules para explorar distintos escenarios.
                  </p>
                </td>
              </tr>
            </table>

            <!-- Key result highlight -->
            <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:28px;">
              <tr>
                <td style="background:#F0FDFA;border-left:4px solid #0D9488;border-radius:0 8px 8px 0;padding:16px 20px;">
                  <p style="margin:0;font-size:13px;font-weight:700;color:#0F766E;text-transform:uppercase;letter-spacing:0.05em;">Resultado principal</p>
                  <p style="margin:6px 0 0;font-size:14px;color:#374151;line-height:1.6;">${savingsText}</p>
                  <p style="margin:8px 0 0;font-size:12px;color:#6B7280;">Dividendo mensual: <strong>${formatCLP(analysisData.monthlyPayment)}</strong> · Banco: ${analysisData.bankName} · Tasa: ${analysisData.interestRate?.toFixed(2) ?? "—"}% · Plazo: ${analysisData.loanTermYears} años</p>
                </td>
              </tr>
            </table>

            <p style="margin:0 0 8px;font-size:14px;color:#374151;line-height:1.6;">
              Si decides seguir adelante, te conectamos directamente con el banco — sin intermediarios y sin costo.
            </p>
            <p style="margin:0 0 28px;font-size:13px;color:#6B7280;">Cualquier duda, responde este email.</p>

            <table cellpadding="0" cellspacing="0">
              <tr>
                <td style="background:#0D9488;border-radius:8px;padding:12px 24px;">
                  <a href="https://www.propadvisor.site/calcular" style="font-size:14px;font-weight:700;color:#ffffff;text-decoration:none;">
                    Analizar otra propiedad →
                  </a>
                </td>
              </tr>
            </table>
          </td>
        </tr>

        <!-- Footer -->
        <tr>
          <td style="background:#F9FAFB;padding:20px 36px;border-top:1px solid #E5E7EB;">
            <p style="margin:0;font-size:11px;color:#9CA3AF;line-height:1.6;">
              PropAdvisor CL · La primera plataforma chilena que calcula si conviene comprar o arrendar.<br>
              Este análisis es educativo. No incluye impuestos, gastos de escritura ni seguros. Apreciación estimada al 7% anual.
            </p>
          </td>
        </tr>

      </table>
    </td></tr>
  </table>
</body>
</html>
      `,
      attachments: [
        {
          filename: `analisis-propadvisor.pdf`,
          content: Buffer.from(pdfBuffer).toString("base64"),
          contentType: "application/pdf",
        },
        {
          filename: `modelo-propadvisor.xlsx`,
          content: excelBuffer.toString("base64"),
          contentType: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        },
      ],
    });

    if (sendError) {
      console.error("Resend error:", sendError);
      return NextResponse.json({ error: "Error al enviar el email" }, { status: 500 });
    }

    return NextResponse.json({ success: true, id: sendData?.id });
  } catch (err) {
    console.error("send-analysis error:", err);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}
