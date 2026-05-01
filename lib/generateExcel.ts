/**
 * PropAdvisor CL — Excel Report Generator
 * Generates a 4-sheet financial model for Chilean real estate analysis
 * Uses exceljs. Color conventions: blue = hardcoded input, black = formula, green = cross-sheet link
 */

import ExcelJS from "exceljs";

export interface ExcelReportData {
  // Property
  address: string;
  city: string;
  propertyType: string;
  priceCLP: number;
  priceUF: number;
  ufValue: number;
  // Mortgage
  bankName: string;
  interestRate: number; // annual %
  downPaymentPct: number; // e.g. 20
  downPaymentCLP: number;
  loanTermYears: number;
  monthlyPayment: number;
  // Rental
  rentMonthlyCLP: number;
  rentalYield: number; // annual %
  // Comparison results
  buyTotal: number;
  rentTotal: number;
  savings: number;
  propertyValueAfter20Years: number;
  netMonthlyFlow: number;
  generatedAt: string;
}

// ── Style helpers ─────────────────────────────────────────────────────────────

const COLORS = {
  inputBlue: "FF0000FF",     // blue text for hardcoded inputs
  formulaBlack: "FF000000",  // black text for formulas
  greenLink: "FF008000",     // green for cross-sheet links
  yellowBg: "FFFFFF00",      // yellow bg for key input cells
  accentTeal: "FF0D9488",    // PropAdvisor brand teal
  accentLight: "FFE6F7F6",   // light teal bg
  headerBg: "FF1E3A5F",      // dark blue header bg
  white: "FFFFFFFF",
  lightGray: "FFF5F5F5",
  midGray: "FFE0E0E0",
  darkGray: "FF666666",
  positive: "FF16A34A",
  negative: "FFDC2626",
};

function applyFont(
  cell: ExcelJS.Cell,
  opts: { bold?: boolean; size?: number; color?: string; italic?: boolean }
) {
  cell.font = {
    name: "Arial",
    bold: opts.bold ?? false,
    size: opts.size ?? 10,
    color: { argb: opts.color ?? COLORS.formulaBlack },
    italic: opts.italic ?? false,
  };
}

function applyFill(cell: ExcelJS.Cell, argb: string) {
  cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb } };
}

function applyBorder(cell: ExcelJS.Cell, style: "thin" | "medium" = "thin") {
  const s = { style };
  cell.border = { top: s, left: s, bottom: s, right: s };
}

function applyBorderBottom(cell: ExcelJS.Cell, style: "thin" | "medium" = "thin") {
  cell.border = { bottom: { style } };
}

function currencyFmt(cell: ExcelJS.Cell) {
  cell.numFmt = '$#,##0;($#,##0);"-"';
}

function pctFmt(cell: ExcelJS.Cell) {
  cell.numFmt = "0.0%;(0.0%);-";
}

function headerRow(
  sheet: ExcelJS.Worksheet,
  row: number,
  cols: string[],
  startCol: number = 1
) {
  cols.forEach((text, i) => {
    const cell = sheet.getCell(row, startCol + i);
    cell.value = text;
    applyFont(cell, { bold: true, size: 9, color: COLORS.white });
    applyFill(cell, COLORS.headerBg);
    cell.alignment = { horizontal: "center", vertical: "middle" };
    applyBorder(cell);
  });
}

function sectionTitle(sheet: ExcelJS.Worksheet, row: number, col: number, text: string, span: number) {
  const cell = sheet.getCell(row, col);
  cell.value = text;
  applyFont(cell, { bold: true, size: 10, color: COLORS.white });
  applyFill(cell, COLORS.accentTeal);
  cell.alignment = { horizontal: "left", vertical: "middle", indent: 1 };
  if (span > 1) {
    sheet.mergeCells(row, col, row, col + span - 1);
  }
  cell.height = 22;
}

// ─────────────────────────────────────────────────────────────────────────────
// SHEET 1: Dashboard / Resumen
// ─────────────────────────────────────────────────────────────────────────────

function buildDashboard(wb: ExcelJS.Workbook, data: ExcelReportData): ExcelJS.Worksheet {
  const ws = wb.addWorksheet("📊 Resumen", {
    views: [{ showGridLines: false }],
    properties: { tabColor: { argb: COLORS.accentTeal } },
  });

  // Column widths
  ws.getColumn(1).width = 2;    // margin
  ws.getColumn(2).width = 32;   // labels
  ws.getColumn(3).width = 20;   // values / inputs
  ws.getColumn(4).width = 5;    // spacer
  ws.getColumn(5).width = 32;   // results labels
  ws.getColumn(6).width = 22;   // results values

  // ── Title banner ────────────────────────────────────────────────────────────
  ws.mergeCells("B1:F1");
  const titleCell = ws.getCell("B1");
  titleCell.value = "PropAdvisor CL — Modelo de Análisis Inmobiliario";
  applyFont(titleCell, { bold: true, size: 14, color: COLORS.white });
  applyFill(titleCell, COLORS.headerBg);
  titleCell.alignment = { horizontal: "left", vertical: "middle", indent: 2 };
  ws.getRow(1).height = 32;

  ws.mergeCells("B2:F2");
  const subtitleCell = ws.getCell("B2");
  subtitleCell.value = `Generado el ${data.generatedAt}   ·   ${data.address}   ·   ${data.city}`;
  applyFont(subtitleCell, { size: 9, color: COLORS.darkGray, italic: true });
  applyFill(subtitleCell, COLORS.lightGray);
  subtitleCell.alignment = { horizontal: "left", vertical: "middle", indent: 2 };
  ws.getRow(2).height = 18;

  ws.getRow(3).height = 10; // spacer

  // ── Instructions ────────────────────────────────────────────────────────────
  ws.mergeCells("B4:F4");
  const instrCell = ws.getCell("B4");
  instrCell.value = "🔵 Celdas azules = modifica estos valores para explorar escenarios   |   ⚫ Celdas negras = calculadas automáticamente";
  applyFont(instrCell, { size: 9, color: COLORS.darkGray, italic: true });
  applyFill(instrCell, COLORS.accentLight);
  instrCell.alignment = { horizontal: "left", vertical: "middle", indent: 2 };
  ws.getRow(4).height = 18;

  ws.getRow(5).height = 8; // spacer

  // ── LEFT COLUMN: Inputs ──────────────────────────────────────────────────────
  // Section: Propiedad
  sectionTitle(ws, 6, 2, "DATOS DE LA PROPIEDAD", 2);

  const inputRows: [string, number | string, string, boolean][] = [
    ["Precio de venta (CLP)", data.priceCLP, '$#,##0;($#,##0);"-"', true],
    ["Precio de venta (UF)", data.priceUF, "#,##0.0", true],
    ["Valor UF actual (CLP)", data.ufValue, '$#,##0;($#,##0);"-"', true],
    ["Arriendo mensual estimado (CLP)", data.rentMonthlyCLP, '$#,##0;($#,##0);"-"', true],
    ["Ciudad", data.city, "@", false],
    ["Tipo de propiedad", data.propertyType, "@", false],
  ];

  let r = 7;
  for (const [label, val, fmt, isInput] of inputRows) {
    const lCell = ws.getCell(r, 2);
    const vCell = ws.getCell(r, 3);
    lCell.value = label;
    applyFont(lCell, { size: 10 });
    applyFill(lCell, r % 2 === 0 ? COLORS.lightGray : COLORS.white);
    lCell.alignment = { vertical: "middle", indent: 1 };

    vCell.value = val;
    vCell.numFmt = fmt as string;
    if (isInput) {
      applyFill(vCell, COLORS.yellowBg);
      applyFont(vCell, { bold: true, size: 10, color: COLORS.inputBlue });
    } else {
      applyFont(vCell, { size: 10 });
      applyFill(vCell, COLORS.lightGray);
    }
    vCell.alignment = { horizontal: "right", vertical: "middle" };
    applyBorderBottom(vCell);
    ws.getRow(r).height = 20;
    r++;
  }

  r++; // spacer

  // Section: Crédito hipotecario
  sectionTitle(ws, r, 2, "PARÁMETROS DEL CRÉDITO", 2);
  r++;

  const mortgageRows: [string, number | string, string, boolean][] = [
    ["Banco", data.bankName, "@", false],
    ["Tasa de interés anual (%)", data.interestRate / 100, "0.00%", true],
    ["Pie (%)", data.downPaymentPct / 100, "0%", true],
    ["Pie (CLP)", data.downPaymentCLP, '$#,##0;($#,##0);"-"', false],
    ["Plazo (años)", data.loanTermYears, "0", true],
    ["Monto del crédito (CLP)", data.priceCLP - data.downPaymentCLP, '$#,##0;($#,##0);"-"', false],
  ];

  for (const [label, val, fmt, isInput] of mortgageRows) {
    const lCell = ws.getCell(r, 2);
    const vCell = ws.getCell(r, 3);
    lCell.value = label;
    applyFont(lCell, { size: 10 });
    applyFill(lCell, r % 2 === 0 ? COLORS.lightGray : COLORS.white);
    lCell.alignment = { vertical: "middle", indent: 1 };
    vCell.value = val;
    vCell.numFmt = fmt as string;
    if (isInput) {
      applyFill(vCell, COLORS.yellowBg);
      applyFont(vCell, { bold: true, size: 10, color: COLORS.inputBlue });
    } else {
      applyFont(vCell, { size: 10 });
      applyFill(vCell, COLORS.lightGray);
    }
    vCell.alignment = { horizontal: "right", vertical: "middle" };
    applyBorderBottom(vCell);
    ws.getRow(r).height = 20;
    r++;
  }

  // ── RIGHT COLUMN: Results ────────────────────────────────────────────────────
  sectionTitle(ws, 6, 5, "RESULTADOS DEL ANÁLISIS", 2);

  const resultRows: [string, number, string, string?][] = [
    ["Dividendo mensual (CLP)", data.monthlyPayment, '$#,##0;($#,##0);"-"'],
    ["Dividendo + gastos/mes (CLP)", data.monthlyPayment + 500000, '$#,##0;($#,##0);"-"'],
    ["Rentabilidad bruta anual (%)", data.rentalYield / 100, "0.00%"],
    ["Flujo neto mensual como inversor (CLP)", data.netMonthlyFlow, '+$#,##0;-$#,##0;"-"'],
  ];

  let rr = 7;
  for (const [label, val, fmt] of resultRows) {
    const lCell = ws.getCell(rr, 5);
    const vCell = ws.getCell(rr, 6);
    lCell.value = label;
    applyFont(lCell, { size: 10 });
    applyFill(lCell, rr % 2 === 0 ? COLORS.lightGray : COLORS.white);
    lCell.alignment = { vertical: "middle", indent: 1 };
    vCell.value = val;
    vCell.numFmt = fmt;
    applyFont(vCell, { bold: true, size: 10 });
    applyFill(vCell, rr % 2 === 0 ? COLORS.lightGray : COLORS.white);
    vCell.alignment = { horizontal: "right", vertical: "middle" };
    applyBorderBottom(vCell);
    ws.getRow(rr).height = 20;
    rr++;
  }

  rr++; // spacer

  // ── 3-Scenario Net Wealth Comparison ──────────────────────────────────────
  sectionTitle(ws, rr, 5, `PATRIMONIO NETO A ${data.loanTermYears} AÑOS`, 2);
  rr++;

  const totalRentalInc = data.rentMonthlyCLP * data.loanTermYears * 12 * 1.16;
  const pieAt6 = data.downPaymentCLP * Math.pow(1.06, data.loanTermYears);
  const buyNW = data.propertyValueAfter20Years - data.buyTotal;
  const rentNW = pieAt6 - data.rentTotal;
  const investNW = data.propertyValueAfter20Years + totalRentalInc - data.buyTotal;

  const scenarios: [string, number, string][] = [
    ["🏠 Comprar para vivir — Patrimonio", buyNW, '+$#,##0;-$#,##0;"-"'],
    ["📈 Arrendar + invertir pie — Patrimonio", rentNW, '+$#,##0;-$#,##0;"-"'],
    ["🏢 Comprar para arrendar — Patrimonio", investNW, '+$#,##0;-$#,##0;"-"'],
    ["", 0, ""],
    ["Propiedad vale en " + data.loanTermYears + " años", data.propertyValueAfter20Years, '$#,##0;($#,##0);"-"'],
    ["Pie invertido al 6% crece a", pieAt6, '$#,##0;($#,##0);"-"'],
    ["Flujo neto mensual (inversión)", data.netMonthlyFlow, '+$#,##0;-$#,##0;"-"'],
    ["Cap rate (rentabilidad bruta)", data.rentalYield / 100, "0.0%"],
  ];

  for (const [label, val, fmt] of scenarios) {
    const lCell = ws.getCell(rr, 5);
    const vCell = ws.getCell(rr, 6);
    lCell.value = label;
    applyFont(lCell, { size: 10 });
    applyFill(lCell, rr % 2 === 0 ? COLORS.lightGray : COLORS.white);
    lCell.alignment = { vertical: "middle", indent: 1 };
    vCell.value = val;
    vCell.numFmt = fmt;
    const isGood = label.includes("Ahorro");
    const color = isGood ? (val >= 0 ? COLORS.positive : COLORS.negative) : COLORS.formulaBlack;
    applyFont(vCell, { bold: true, size: 10, color });
    applyFill(vCell, isGood ? COLORS.accentLight : (rr % 2 === 0 ? COLORS.lightGray : COLORS.white));
    vCell.alignment = { horizontal: "right", vertical: "middle" };
    applyBorderBottom(vCell);
    ws.getRow(rr).height = 22;
    rr++;
  }

  // ── Recommendation box ───────────────────────────────────────────────────────
  rr += 2;
  ws.mergeCells(rr, 2, rr, 6);
  const recCell = ws.getCell(rr, 2);
  recCell.value = data.savings > 0
    ? `✅  COMPRAR CONVIENE: En ${data.loanTermYears} años ahorrarías ${new Intl.NumberFormat("es-CL", { style: "currency", currency: "CLP", minimumFractionDigits: 0 }).format(Math.abs(data.savings))} vs seguir arrendando, además de acumular el valor de la propiedad.`
    : `⚠️  ARRENDAR TIENE MENOR COSTO DIRECTO a ${data.loanTermYears} años. Considera ajustar el pie o el plazo para mejorar el escenario de compra.`;
  applyFont(recCell, { bold: true, size: 10, color: data.savings > 0 ? COLORS.positive : COLORS.negative });
  applyFill(recCell, data.savings > 0 ? "FFD1FAE5" : "FFFEE2E2");
  recCell.alignment = { horizontal: "left", vertical: "middle", wrapText: true, indent: 2 };
  applyBorder(recCell, "medium");
  ws.getRow(rr).height = 36;

  rr += 2;
  ws.mergeCells(rr, 2, rr, 6);
  const disclaimerCell = ws.getCell(rr, 2);
  disclaimerCell.value = "Nota: Proyección educativa. Incluye 7% de apreciación anual estimada. No incluye plusvalía real, impuestos, gastos de escritura ni seguros. Modifica las celdas azules para explorar escenarios alternativos.";
  applyFont(disclaimerCell, { size: 8, color: COLORS.darkGray, italic: true });
  disclaimerCell.alignment = { horizontal: "left", vertical: "middle", wrapText: true, indent: 2 };
  ws.getRow(rr).height = 30;

  return ws;
}

// ─────────────────────────────────────────────────────────────────────────────
// SHEET 2: Amortization Table
// ─────────────────────────────────────────────────────────────────────────────

function buildAmortization(wb: ExcelJS.Workbook, data: ExcelReportData): ExcelJS.Worksheet {
  const ws = wb.addWorksheet("📋 Amortización", {
    views: [{ showGridLines: false }],
    properties: { tabColor: { argb: "FF1E3A5F" } },
  });

  ws.getColumn(1).width = 2;
  ws.getColumn(2).width = 8;   // Mes
  ws.getColumn(3).width = 12;  // Año
  ws.getColumn(4).width = 20;  // Cuota mensual
  ws.getColumn(5).width = 20;  // Interés
  ws.getColumn(6).width = 20;  // Capital
  ws.getColumn(7).width = 22;  // Saldo pendiente
  ws.getColumn(8).width = 20;  // Patrimonio acumulado

  // Title
  ws.mergeCells("B1:H1");
  const titleCell = ws.getCell("B1");
  titleCell.value = "Tabla de Amortización — Crédito Hipotecario";
  applyFont(titleCell, { bold: true, size: 13, color: COLORS.white });
  applyFill(titleCell, COLORS.headerBg);
  titleCell.alignment = { horizontal: "left", vertical: "middle", indent: 2 };
  ws.getRow(1).height = 30;

  // Subtitle with loan params
  ws.mergeCells("B2:H2");
  const subCell = ws.getCell("B2");
  subCell.value = `${data.bankName}  ·  Tasa ${data.interestRate.toFixed(2)}% anual  ·  ${data.loanTermYears} años  ·  Monto: $${new Intl.NumberFormat("es-CL").format(Math.round(data.priceCLP - data.downPaymentCLP))}`;
  applyFont(subCell, { size: 9, color: COLORS.darkGray, italic: true });
  applyFill(subCell, COLORS.lightGray);
  subCell.alignment = { horizontal: "left", vertical: "middle", indent: 2 };
  ws.getRow(2).height = 18;

  ws.getRow(3).height = 8;

  // Headers
  headerRow(ws, 4, ["Mes", "Año", "Cuota Mensual ($)", "Interés ($)", "Capital ($)", "Saldo Pendiente ($)", "Patrimonio ($)"], 2);
  ws.getRow(4).height = 22;

  // Build amortization data
  const principal = data.priceCLP - data.downPaymentCLP;
  const monthlyRate = data.interestRate / 100 / 12;
  const numPayments = data.loanTermYears * 12;
  const cuota = data.monthlyPayment;

  let balance = principal;
  let equity = data.downPaymentCLP;

  for (let m = 1; m <= numPayments; m++) {
    const interest = balance * monthlyRate;
    const capital = cuota - interest;
    balance = Math.max(0, balance - capital);
    equity = data.priceCLP - balance; // simplified: price minus outstanding balance

    const rowIdx = 4 + m;
    const isAlt = m % 2 === 0;

    const cells = [m, Math.ceil(m / 12), cuota, interest, capital, balance, equity];
    const fmts = ["0", "0", '$#,##0;($#,##0);"-"', '$#,##0;($#,##0);"-"', '$#,##0;($#,##0);"-"', '$#,##0;($#,##0);"-"', '$#,##0;($#,##0);"-"'];

    cells.forEach((val, i) => {
      const cell = ws.getCell(rowIdx, 2 + i);
      cell.value = val;
      cell.numFmt = fmts[i];
      applyFont(cell, { size: 9 });
      applyFill(cell, isAlt ? COLORS.lightGray : COLORS.white);
      cell.alignment = { horizontal: "right", vertical: "middle" };
      if (i === 0) cell.alignment = { horizontal: "center", vertical: "middle" };
    });

    ws.getRow(rowIdx).height = 16;
  }

  // Summary row
  const sumRow = 4 + numPayments + 2;
  ws.mergeCells(sumRow, 2, sumRow, 3);
  const sumLabelCell = ws.getCell(sumRow, 2);
  sumLabelCell.value = "TOTAL PAGADO";
  applyFont(sumLabelCell, { bold: true, size: 10, color: COLORS.white });
  applyFill(sumLabelCell, COLORS.accentTeal);
  sumLabelCell.alignment = { horizontal: "center", vertical: "middle" };

  const totalCuota = ws.getCell(sumRow, 4);
  totalCuota.value = cuota * numPayments;
  totalCuota.numFmt = '$#,##0;($#,##0);"-"';
  applyFont(totalCuota, { bold: true, size: 10, color: COLORS.white });
  applyFill(totalCuota, COLORS.accentTeal);
  totalCuota.alignment = { horizontal: "right", vertical: "middle" };

  const totalInterest = ws.getCell(sumRow, 5);
  totalInterest.value = cuota * numPayments - principal;
  totalInterest.numFmt = '$#,##0;($#,##0);"-"';
  applyFont(totalInterest, { bold: true, size: 10, color: COLORS.white });
  applyFill(totalInterest, COLORS.accentTeal);
  totalInterest.alignment = { horizontal: "right", vertical: "middle" };

  const totalCapital = ws.getCell(sumRow, 6);
  totalCapital.value = principal;
  totalCapital.numFmt = '$#,##0;($#,##0);"-"';
  applyFont(totalCapital, { bold: true, size: 10, color: COLORS.white });
  applyFill(totalCapital, COLORS.accentTeal);
  totalCapital.alignment = { horizontal: "right", vertical: "middle" };

  // Freeze header
  ws.views = [{ state: "frozen", ySplit: 4, showGridLines: false }];

  return ws;
}

// ─────────────────────────────────────────────────────────────────────────────
// SHEET 3: 20-Year Comparison
// ─────────────────────────────────────────────────────────────────────────────

function buildComparison(wb: ExcelJS.Workbook, data: ExcelReportData): ExcelJS.Worksheet {
  const ws = wb.addWorksheet("📈 Comparación 20 Años", {
    views: [{ showGridLines: false }],
    properties: { tabColor: { argb: COLORS.accentTeal } },
  });

  ws.getColumn(1).width = 2;
  ws.getColumn(2).width = 8;   // Año
  ws.getColumn(3).width = 22;  // Costo compra acum
  ws.getColumn(4).width = 22;  // Valor propiedad
  ws.getColumn(5).width = 22;  // Patrimonio neto
  ws.getColumn(6).width = 22;  // Costo arriendo acum
  ws.getColumn(7).width = 22;  // Saldo neto (compra vs arriendo)

  ws.mergeCells("B1:G1");
  const titleCell = ws.getCell("B1");
  titleCell.value = "Comparación de Escenarios — Horizonte a 20 Años";
  applyFont(titleCell, { bold: true, size: 13, color: COLORS.white });
  applyFill(titleCell, COLORS.headerBg);
  titleCell.alignment = { horizontal: "left", vertical: "middle", indent: 2 };
  ws.getRow(1).height = 30;

  ws.mergeCells("B2:G2");
  const subCell = ws.getCell("B2");
  subCell.value = "Apreciación anual: 7%   ·   Gastos mensuales propiedad: $500.000   ·   Arriendo sin crecimiento anual";
  applyFont(subCell, { size: 9, color: COLORS.darkGray, italic: true });
  applyFill(subCell, COLORS.lightGray);
  subCell.alignment = { horizontal: "left", vertical: "middle", indent: 2 };
  ws.getRow(2).height = 18;

  ws.getRow(3).height = 8;

  headerRow(ws, 4, ["Año", "Costo Compra Acum. ($)", "Valor Propiedad ($)", "Patrimonio Neto ($)", "Costo Arriendo Acum. ($)", "Ventaja Comprar ($)"], 2);
  ws.getRow(4).height = 22;

  const monthlyBuyCost = data.monthlyPayment + 500000;
  const appreciation = 0.07;

  for (let yr = 1; yr <= 20; yr++) {
    const cumulativeBuy = data.downPaymentCLP + monthlyBuyCost * 12 * yr;
    const propertyValue = data.priceCLP * Math.pow(1 + appreciation, yr);
    const outstanding = (() => {
      if (yr >= data.loanTermYears) return 0;
      const principal = data.priceCLP - data.downPaymentCLP;
      const mr = data.interestRate / 100 / 12;
      const n = data.loanTermYears * 12;
      const m = yr * 12;
      return principal * (Math.pow(1 + mr, n) - Math.pow(1 + mr, m)) / (Math.pow(1 + mr, n) - 1);
    })();
    const equity = propertyValue - outstanding;
    const cumulativeRent = data.rentMonthlyCLP * 12 * yr;
    const advantage = cumulativeRent - cumulativeBuy + equity - data.downPaymentCLP;

    const rowIdx = 4 + yr;
    const isAlt = yr % 2 === 0;
    const isLast = yr === 20;

    const vals = [yr, cumulativeBuy, propertyValue, equity, cumulativeRent, advantage];
    const fmts = ["0", '$#,##0;($#,##0);"-"', '$#,##0;($#,##0);"-"', '$#,##0;($#,##0);"-"', '$#,##0;($#,##0);"-"', '+$#,##0;-$#,##0;"-"'];

    vals.forEach((val, i) => {
      const cell = ws.getCell(rowIdx, 2 + i);
      cell.value = val;
      cell.numFmt = fmts[i];

      if (isLast) {
        applyFill(cell, COLORS.accentLight);
        applyFont(cell, { bold: true, size: 9 });
        applyBorder(cell, "medium");
      } else {
        applyFill(cell, isAlt ? COLORS.lightGray : COLORS.white);
        applyFont(cell, { size: 9 });
      }

      if (i === 5) { // advantage column gets color
        const color = (val as number) >= 0 ? COLORS.positive : COLORS.negative;
        applyFont(cell, { bold: isLast, size: 9, color });
      }

      cell.alignment = { horizontal: i === 0 ? "center" : "right", vertical: "middle" };
    });

    ws.getRow(rowIdx).height = 17;
  }

  ws.views = [{ state: "frozen", ySplit: 4, showGridLines: false }];
  return ws;
}

// ─────────────────────────────────────────────────────────────────────────────
// SHEET 4: Sensitivity Analysis
// ─────────────────────────────────────────────────────────────────────────────

function buildSensitivity(wb: ExcelJS.Workbook, data: ExcelReportData): ExcelJS.Worksheet {
  const ws = wb.addWorksheet("🔍 Sensibilidad", {
    views: [{ showGridLines: false }],
    properties: { tabColor: { argb: "FF1E3A5F" } },
  });

  ws.getColumn(1).width = 2;
  ws.getColumn(2).width = 30;  // scenario label

  // Title
  ws.mergeCells("B1:J1");
  const titleCell = ws.getCell("B1");
  titleCell.value = "Análisis de Sensibilidad — ¿Cómo cambia la decisión con distintos supuestos?";
  applyFont(titleCell, { bold: true, size: 13, color: COLORS.white });
  applyFill(titleCell, COLORS.headerBg);
  titleCell.alignment = { horizontal: "left", vertical: "middle", indent: 2 };
  ws.getRow(1).height = 30;

  ws.getRow(2).height = 8;

  // ── Table 1: Apreciación vs Pie ──────────────────────────────────────────────
  sectionTitle(ws, 3, 2, "TABLA 1: Ahorro de comprar vs arrendar según apreciación y % de pie (horizonte 20 años)", 8);
  ws.getRow(3).height = 22;

  const appreciationRates = [0.03, 0.05, 0.07, 0.09, 0.11];
  const downPaymentPcts   = [0.10, 0.15, 0.20, 0.30, 0.40];

  // Row 4: column headers (appreciation rates)
  ws.getCell(4, 2).value = "Pie \\ Apreciación →";
  applyFont(ws.getCell(4, 2), { bold: true, size: 9, color: COLORS.white });
  applyFill(ws.getCell(4, 2), COLORS.headerBg);
  ws.getCell(4, 2).alignment = { horizontal: "center", vertical: "middle" };

  appreciationRates.forEach((rate, i) => {
    const cell = ws.getCell(4, 3 + i);
    cell.value = `Aprec. ${(rate * 100).toFixed(0)}%`;
    applyFont(cell, { bold: true, size: 9, color: COLORS.white });
    applyFill(cell, COLORS.headerBg);
    cell.alignment = { horizontal: "center", vertical: "middle" };
    ws.getColumn(3 + i).width = 18;
  });
  ws.getRow(4).height = 22;

  downPaymentPcts.forEach((dp, rowI) => {
    const rowIdx = 5 + rowI;
    const dpCell = ws.getCell(rowIdx, 2);
    dpCell.value = `Pie ${(dp * 100).toFixed(0)}% = ${new Intl.NumberFormat("es-CL", { style: "currency", currency: "CLP", minimumFractionDigits: 0 }).format(data.priceCLP * dp)}`;
    applyFont(dpCell, { bold: true, size: 9, color: COLORS.inputBlue });
    applyFill(dpCell, COLORS.yellowBg);
    dpCell.alignment = { horizontal: "left", vertical: "middle", indent: 1 };

    appreciationRates.forEach((appr, colI) => {
      const cell = ws.getCell(rowIdx, 3 + colI);
      const downAmt = data.priceCLP * dp;
      const loanAmt = data.priceCLP - downAmt;
      const mr = data.interestRate / 100 / 12;
      const n = data.loanTermYears * 12;
      const pmt = loanAmt * (mr * Math.pow(1 + mr, n)) / (Math.pow(1 + mr, n) - 1);
      const buyTotal = downAmt + (pmt + 500000) * 12 * 20;
      const propVal20 = data.priceCLP * Math.pow(1 + appr, 20);
      const rentTotal = data.rentMonthlyCLP * 12 * 20;
      const savings = rentTotal - buyTotal + propVal20 - downAmt;

      cell.value = savings;
      cell.numFmt = '+$#,##0;-$#,##0;"-"';
      const isGood = savings >= 0;
      applyFill(cell, isGood ? "FFD1FAE5" : "FFFEE2E2");
      applyFont(cell, { bold: true, size: 9, color: isGood ? COLORS.positive : COLORS.negative });
      cell.alignment = { horizontal: "right", vertical: "middle" };
      applyBorder(cell);
    });
    ws.getRow(rowIdx).height = 20;
  });

  // ── Table 2: Rentabilidad según arriendo y apreciación ───────────────────────
  const t2start = 12;
  ws.getRow(t2start - 1).height = 12;
  sectionTitle(ws, t2start, 2, "TABLA 2: Rentabilidad bruta anual según precio y arriendo mensual", 8);
  ws.getRow(t2start).height = 22;

  const rentLevels = [
    Math.round(data.rentMonthlyCLP * 0.7 / 10000) * 10000,
    Math.round(data.rentMonthlyCLP * 0.85 / 10000) * 10000,
    data.rentMonthlyCLP,
    Math.round(data.rentMonthlyCLP * 1.15 / 10000) * 10000,
    Math.round(data.rentMonthlyCLP * 1.30 / 10000) * 10000,
  ];

  const priceLevels = [
    Math.round(data.priceCLP * 0.8 / 1000000) * 1000000,
    Math.round(data.priceCLP * 0.9 / 1000000) * 1000000,
    data.priceCLP,
    Math.round(data.priceCLP * 1.1 / 1000000) * 1000000,
    Math.round(data.priceCLP * 1.2 / 1000000) * 1000000,
  ];

  // Headers
  ws.getCell(t2start + 1, 2).value = "Arriendo \\ Precio →";
  applyFont(ws.getCell(t2start + 1, 2), { bold: true, size: 9, color: COLORS.white });
  applyFill(ws.getCell(t2start + 1, 2), COLORS.headerBg);
  ws.getCell(t2start + 1, 2).alignment = { horizontal: "center", vertical: "middle" };

  priceLevels.forEach((price, i) => {
    const cell = ws.getCell(t2start + 1, 3 + i);
    cell.value = `$${new Intl.NumberFormat("es-CL").format(Math.round(price / 1000000))}M`;
    applyFont(cell, { bold: true, size: 9, color: COLORS.white });
    applyFill(cell, COLORS.headerBg);
    cell.alignment = { horizontal: "center", vertical: "middle" };
  });
  ws.getRow(t2start + 1).height = 22;

  rentLevels.forEach((rent, rowI) => {
    const rowIdx = t2start + 2 + rowI;
    const rentCell = ws.getCell(rowIdx, 2);
    rentCell.value = `Arriendo ${new Intl.NumberFormat("es-CL", { style: "currency", currency: "CLP", minimumFractionDigits: 0 }).format(rent)}/mes`;
    applyFont(rentCell, { bold: true, size: 9, color: COLORS.inputBlue });
    applyFill(rentCell, COLORS.yellowBg);
    rentCell.alignment = { horizontal: "left", vertical: "middle", indent: 1 };

    priceLevels.forEach((price, colI) => {
      const cell = ws.getCell(rowIdx, 3 + colI);
      const yield_ = (rent * 12) / price;
      cell.value = yield_;
      cell.numFmt = "0.00%";
      const isGood = yield_ >= 0.05; // 5% threshold
      applyFill(cell, isGood ? "FFD1FAE5" : "FFFEE2E2");
      applyFont(cell, { bold: true, size: 9, color: isGood ? COLORS.positive : COLORS.negative });
      cell.alignment = { horizontal: "center", vertical: "middle" };
      applyBorder(cell);
    });
    ws.getRow(rowIdx).height = 20;
  });

  // Legend
  const legendRow = t2start + 8;
  ws.getRow(legendRow).height = 10;
  ws.mergeCells(legendRow + 1, 2, legendRow + 1, 7);
  const legendCell = ws.getCell(legendRow + 1, 2);
  legendCell.value = "🟢 Verde = rentabilidad ≥ 5% (buena inversión)   ·   🔴 Rojo = rentabilidad < 5% (retorno bajo)   ·   Tasa referencial Santander 3.43% anual";
  applyFont(legendCell, { size: 8, color: COLORS.darkGray, italic: true });
  applyFill(legendCell, COLORS.accentLight);
  legendCell.alignment = { horizontal: "left", vertical: "middle", indent: 2 };
  ws.getRow(legendRow + 1).height = 20;

  return ws;
}

// ─────────────────────────────────────────────────────────────────────────────
// Main export
// ─────────────────────────────────────────────────────────────────────────────

export async function generateExcel(data: ExcelReportData): Promise<Buffer> {
  const wb = new ExcelJS.Workbook();
  wb.creator = "PropAdvisor CL";
  wb.created = new Date();
  wb.properties.date1904 = false;

  buildDashboard(wb, data);
  buildAmortization(wb, data);
  buildComparison(wb, data);
  buildSensitivity(wb, data);

  const buf = await wb.xlsx.writeBuffer();
  return Buffer.from(buf);
}
