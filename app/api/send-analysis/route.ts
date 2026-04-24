export const runtime = "nodejs";

import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { renderToBuffer } from "@react-pdf/renderer";
import { createElement } from "react";
import { AnalysisPDF, type AnalysisPDFProps } from "@/components/AnalysisPDF";
import { generateExcel, type ExcelReportData } from "@/lib/generateExcel";

const resend = new Resend(process.env.RESEND_API_KEY);

// Basic disposable email domain blocklist
const DISPOSABLE_DOMAINS = new Set([
  "mailinator.com", "guerrillamail.com", "temp-mail.org", "throwaway.email",
  "yopmail.com", "trashmail.com", "sharklasers.com", "guerrillamailblock.com",
  "grr.la", "guerrillamail.info", "spam4.me", "dispostable.com",
]);

function isValidEmail(email: string): boolean {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!re.test(email)) return false;
  const domain = email.split("@")[1]?.toLowerCase();
  if (!domain) return false;
  if (DISPOSABLE_DOMAINS.has(domain)) return false;
  return true;
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
    const { email, ...analysisData } = body as { email: string } & AnalysisPDFProps & ExcelReportData;

    // Validate email
    if (!email || !isValidEmail(email)) {
      return NextResponse.json({ error: "Email inválido" }, { status: 400 });
    }

    // Check API key
    if (!process.env.RESEND_API_KEY) {
      console.error("RESEND_API_KEY not set");
      return NextResponse.json({ error: "Servicio de email no configurado" }, { status: 500 });
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
      from: "PropAdvisor <onboarding@resend.dev>",
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
                  <a href="https://www.propadvisor.cl/calcular" style="font-size:14px;font-weight:700;color:#ffffff;text-decoration:none;">
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
