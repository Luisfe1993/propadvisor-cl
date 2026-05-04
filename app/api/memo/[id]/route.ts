import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { getDb, initDb, getUserPlan } from "@/lib/db";
import { calcMonthlyPayment } from "@/lib/calculations";
import { calcInvestorMetrics, type InvestorInputs } from "@/lib/investorCalcs";

let dbInit = false;
async function ensureDb() { if (!dbInit) { await initDb(); dbInit = true; } }

function fmt(n: number): string {
  return new Intl.NumberFormat("es-CL", { style: "currency", currency: "CLP", minimumFractionDigits: 0 }).format(n);
}
function pct(n: number): string {
  return (n * 100).toFixed(1) + "%";
}

/**
 * GET /api/memo/[id] — generate investor memo as HTML (can be printed to PDF)
 */
export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: "No autenticado" }, { status: 401 });

    await ensureDb();
    const plan = await getUserPlan(userId);
    if (!plan.isActive) return NextResponse.json({ error: "Pro requerido" }, { status: 403 });

    const sql = getDb();
    const { id } = await params;
    const rows = await sql`SELECT * FROM saved_properties WHERE id = ${id} AND user_id = ${userId}`;
    if (rows.length === 0) return NextResponse.json({ error: "No encontrada" }, { status: 404 });

    const p = rows[0];
    const priceCLP = Number(p.price_clp);
    const monthlyRent = Number(p.monthly_rent);
    const rate = Number(p.interest_rate);
    const dpPct = Number(p.down_payment_pct);
    const term = Number(p.loan_term_years);
    const loan = priceCLP * (1 - dpPct / 100);
    const pmt = calcMonthlyPayment(loan, rate, term);
    const downPayment = priceCLP * dpPct / 100;

    const results = calcInvestorMetrics({
      priceCLP, monthlyRent, downPaymentPct: dpPct, interestRate: rate,
      loanTermYears: term, monthlyPayment: pmt,
      vacancyRate: 0.05, monthlyGGCC: 100000, monthlyInsurance: 30000,
      adminFeePct: 0.08, annualMaintenance: 300000, annualContribuciones: 400000,
      isDFL2: false, appreciationRate: 0.07, rentInflation: 0.03,
    } as InvestorInputs);

    const html = `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <title>Memorándum de Inversión — ${p.label}</title>
  <style>
    @media print { body { margin: 0; } .no-print { display: none; } }
    body { font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 40px 32px; color: #374151; font-size: 14px; line-height: 1.6; }
    h1 { font-size: 24px; color: #1E3A5F; margin-bottom: 4px; }
    h2 { font-size: 16px; color: #0d9488; text-transform: uppercase; letter-spacing: 0.05em; border-bottom: 2px solid #0d9488; padding-bottom: 4px; margin-top: 32px; }
    .header { background: #1E3A5F; color: white; padding: 24px 32px; margin: -40px -32px 32px; }
    .header h1 { color: white; }
    .header p { color: #93C5FD; font-size: 13px; margin: 4px 0 0; }
    .grid { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 16px; margin: 16px 0; }
    .grid-2 { grid-template-columns: 1fr 1fr; }
    .card { background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 8px; padding: 12px 16px; }
    .card .label { font-size: 11px; color: #6b7280; text-transform: uppercase; letter-spacing: 0.04em; margin-bottom: 4px; }
    .card .value { font-size: 18px; font-weight: 800; color: #374151; }
    .card .value.green { color: #16a34a; }
    .card .value.red { color: #dc2626; }
    .card .value.teal { color: #0d9488; }
    table { width: 100%; border-collapse: collapse; font-size: 12px; margin: 16px 0; }
    th { background: #1E3A5F; color: white; padding: 8px 12px; text-align: right; font-size: 10px; text-transform: uppercase; }
    th:first-child { text-align: left; }
    td { padding: 6px 12px; border-bottom: 1px solid #e5e7eb; text-align: right; }
    td:first-child { text-align: left; font-weight: 600; }
    tr:nth-child(even) { background: #f9fafb; }
    .disclaimer { font-size: 11px; color: #9ca3af; margin-top: 32px; padding-top: 16px; border-top: 1px solid #e5e7eb; }
    .print-btn { display: block; margin: 0 auto 32px; padding: 12px 32px; background: #0d9488; color: white; border: none; border-radius: 8px; font-size: 15px; font-weight: 700; cursor: pointer; }
  </style>
</head>
<body>
  <button class="print-btn no-print" onclick="window.print()">🖨️ Imprimir / Guardar como PDF</button>

  <div class="header">
    <h1>PropAdvisor CL — Memorándum de Inversión</h1>
    <p>${new Date().toLocaleDateString("es-CL", { day: "numeric", month: "long", year: "numeric" })}</p>
  </div>

  <h2>Propiedad</h2>
  <div class="grid grid-2">
    <div class="card"><div class="label">Ubicación</div><div class="value" style="font-size:16px">${p.city}${p.comuna ? ` · ${p.comuna}` : ""}</div></div>
    <div class="card"><div class="label">Tipo</div><div class="value" style="font-size:16px">${p.property_type}</div></div>
    <div class="card"><div class="label">Precio</div><div class="value">${fmt(priceCLP)}</div><div style="font-size:12px;color:#6b7280">UF ${Math.round(Number(p.price_uf)).toLocaleString("es-CL")}</div></div>
    <div class="card"><div class="label">Arriendo mensual</div><div class="value">${fmt(monthlyRent)}</div></div>
  </div>

  <h2>Financiamiento</h2>
  <div class="grid">
    <div class="card"><div class="label">Banco</div><div class="value" style="font-size:16px">${p.bank_name}</div></div>
    <div class="card"><div class="label">Tasa</div><div class="value">${Number(p.interest_rate).toFixed(2)}%</div></div>
    <div class="card"><div class="label">Pie (${dpPct}%)</div><div class="value">${fmt(downPayment)}</div></div>
    <div class="card"><div class="label">Plazo</div><div class="value" style="font-size:16px">${term} años</div></div>
    <div class="card"><div class="label">Dividendo</div><div class="value teal">${fmt(pmt)}/mes</div></div>
    <div class="card"><div class="label">Crédito</div><div class="value" style="font-size:16px">${fmt(loan)}</div></div>
  </div>

  <h2>Métricas de Inversión</h2>
  <div class="grid">
    <div class="card"><div class="label">NOI Anual</div><div class="value ${results.noi >= 0 ? "green" : "red"}">${fmt(results.noi)}</div></div>
    <div class="card"><div class="label">Cap Rate</div><div class="value">${pct(results.capRate)}</div></div>
    <div class="card"><div class="label">Cash-on-Cash</div><div class="value ${results.cashOnCash >= 0 ? "green" : "red"}">${pct(results.cashOnCash)}</div></div>
    <div class="card"><div class="label">DSCR</div><div class="value ${results.dscr >= 1.2 ? "green" : "red"}">${results.dscr.toFixed(2)}</div><div style="font-size:11px;color:${results.dscr >= 1.2 ? "#16a34a" : "#dc2626"}">${results.dscr >= 1.2 ? "Aprobable ✅" : results.dscr >= 1.0 ? "Límite ⚠️" : "Riesgoso ❌"}</div></div>
    <div class="card"><div class="label">IRR (${term} años)</div><div class="value teal">${pct(results.irr)}</div></div>
    <div class="card"><div class="label">After-Tax CF</div><div class="value ${results.afterTaxCashFlow >= 0 ? "green" : "red"}">${fmt(results.afterTaxCashFlow)}/año</div></div>
  </div>

  <h2>Proyección Año a Año</h2>
  <table>
    <thead><tr><th>Año</th><th>Arriendo</th><th>NOI</th><th>Dividendo</th><th>Cash Flow</th><th>Acumulado</th><th>Propiedad</th><th>Equity</th></tr></thead>
    <tbody>
      ${results.yearlyProjection.map(yr => `
        <tr>
          <td>${yr.year}</td><td>${fmt(yr.rent)}</td>
          <td style="color:${yr.noi >= 0 ? "#16a34a" : "#dc2626"}">${fmt(yr.noi)}</td>
          <td>${fmt(yr.debtService)}</td>
          <td style="font-weight:600;color:${yr.cashFlow >= 0 ? "#16a34a" : "#dc2626"}">${fmt(yr.cashFlow)}</td>
          <td style="color:${yr.cumulativeCashFlow >= 0 ? "#16a34a" : "#dc2626"}">${fmt(yr.cumulativeCashFlow)}</td>
          <td>${fmt(yr.propertyValue)}</td>
          <td style="font-weight:600;color:#16a34a">${fmt(yr.equity)}</td>
        </tr>
      `).join("")}
    </tbody>
  </table>

  <h2>Sensibilidad IRR</h2>
  <div class="grid">
    ${results.irrScenarios.map(s => `
      <div class="card"><div class="label">${s.label}</div><div class="value teal">${pct(s.irr)}</div></div>
    `).join("")}
  </div>

  <div class="disclaimer">
    <strong>PropAdvisor CL</strong> — propadvisor.site<br>
    Memorándum generado automáticamente. Supuestos: plusvalía 7%/año, arriendo sube 3%/año, vacancia 5%, gastos estándar.<br>
    Este documento es educativo y no constituye asesoría financiera. Consulte un profesional antes de invertir.
  </div>
</body>
</html>`;

    return new NextResponse(html, {
      headers: { "Content-Type": "text/html; charset=utf-8" },
    });
  } catch (err) {
    console.error("Memo error:", err);
    return NextResponse.json({ error: "Error al generar memorándum" }, { status: 500 });
  }
}
