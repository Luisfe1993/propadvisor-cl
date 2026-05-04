/**
 * Advanced investor calculations for PropAdvisor Pro.
 * All amounts in CLP unless specified.
 */

export interface InvestorInputs {
  priceCLP: number;
  monthlyRent: number;
  downPaymentPct: number;
  interestRate: number;    // annual %
  loanTermYears: number;
  monthlyPayment: number;  // mortgage payment only

  // Advanced (Pro)
  vacancyRate: number;     // 0-0.20 (e.g. 0.05 = 5%)
  monthlyGGCC: number;    // gastos comunes
  monthlyInsurance: number;
  adminFeePct: number;    // property mgmt fee as % of rent (e.g. 0.08 = 8%)
  annualMaintenance: number; // annual repair reserve
  annualContribuciones: number; // property tax (SII)
  isDFL2: boolean;         // DFL2 tax exemption (first 20 years)
  appreciationRate: number; // annual (e.g. 0.07)
  rentInflation: number;   // annual (e.g. 0.03)
}

export interface InvestorResults {
  // Net Operating Income
  grossRentalIncome: number;    // annual
  effectiveRentalIncome: number; // after vacancy
  totalExpenses: number;         // annual
  noi: number;                   // annual NOI

  // Rates
  capRate: number;               // NOI / price
  cashOnCash: number;            // (NOI - debt service) / cash invested
  dscr: number;                  // NOI / debt service

  // Tax
  annualTaxableIncome: number;
  estimatedTax: number;          // annual
  afterTaxCashFlow: number;      // annual

  // IRR
  irr: number;                   // 20-year IRR

  // Year-by-year projections
  yearlyProjection: YearProjection[];

  // Sensitivity
  irrScenarios: { label: string; irr: number }[];
}

export interface YearProjection {
  year: number;
  rent: number;              // monthly rent at that year
  grossIncome: number;       // annual
  vacancy: number;           // annual loss
  expenses: number;          // annual
  noi: number;               // annual
  debtService: number;       // annual mortgage
  cashFlow: number;          // annual (before tax)
  cumulativeCashFlow: number;
  propertyValue: number;
  equity: number;            // property value - remaining loan
}

/**
 * Calculate monthly mortgage payment (French amortization)
 */
function calcPayment(principal: number, annualRate: number, years: number): number {
  const r = annualRate / 100 / 12;
  const n = years * 12;
  if (r === 0) return principal / n;
  return (principal * (r * Math.pow(1 + r, n))) / (Math.pow(1 + r, n) - 1);
}

/**
 * Calculate remaining loan balance after X years
 */
function remainingBalance(principal: number, annualRate: number, totalYears: number, yearsElapsed: number): number {
  const r = annualRate / 100 / 12;
  const n = totalYears * 12;
  const p = yearsElapsed * 12;
  if (r === 0) return principal * (1 - p / n);
  const pmt = calcPayment(principal, annualRate, totalYears);
  return principal * Math.pow(1 + r, p) - pmt * ((Math.pow(1 + r, p) - 1) / r);
}

/**
 * Calculate IRR using Newton's method
 */
function calcIRR(cashFlows: number[], maxIterations: number = 100): number {
  let rate = 0.1; // initial guess 10%
  for (let i = 0; i < maxIterations; i++) {
    let npv = 0;
    let dnpv = 0;
    for (let t = 0; t < cashFlows.length; t++) {
      npv += cashFlows[t] / Math.pow(1 + rate, t);
      dnpv -= t * cashFlows[t] / Math.pow(1 + rate, t + 1);
    }
    if (Math.abs(npv) < 1) return rate;
    const newRate = rate - npv / dnpv;
    if (isNaN(newRate) || !isFinite(newRate)) return rate;
    rate = newRate;
  }
  return rate;
}

/**
 * Full investor analysis
 */
export function calcInvestorMetrics(inputs: InvestorInputs): InvestorResults {
  const {
    priceCLP, monthlyRent, downPaymentPct, interestRate, loanTermYears, monthlyPayment,
    vacancyRate, monthlyGGCC, monthlyInsurance, adminFeePct,
    annualMaintenance, annualContribuciones, isDFL2,
    appreciationRate, rentInflation,
  } = inputs;

  const downPayment = priceCLP * downPaymentPct / 100;
  const loanAmount = priceCLP - downPayment;
  const annualDebtService = monthlyPayment * 12;

  // ── YEAR 1 SNAPSHOT ─────────────────────────────────
  const grossRentalIncome = monthlyRent * 12;
  const effectiveRentalIncome = grossRentalIncome * (1 - vacancyRate);
  const adminFee = effectiveRentalIncome * adminFeePct;
  const totalExpenses = (monthlyGGCC + monthlyInsurance) * 12 + adminFee + annualMaintenance + annualContribuciones;
  const noi = effectiveRentalIncome - totalExpenses;

  // Rates
  const capRate = priceCLP > 0 ? noi / priceCLP : 0;
  const cashInvested = downPayment; // + closing costs if we model those
  const cashOnCash = cashInvested > 0 ? (noi - annualDebtService) / cashInvested : 0;
  const dscr = annualDebtService > 0 ? noi / annualDebtService : 0;

  // ── TAX ──────────────────────────────────────────────
  // Simplified Chilean rental income tax
  // If DFL2: exempt from rental income tax for first 20 years
  // Otherwise: rental income taxed at marginal rate (~15-25% for typical investors)
  const annualTaxableIncome = isDFL2 ? 0 : Math.max(0, noi - annualDebtService * 0.3); // rough deduction
  const taxRate = isDFL2 ? 0 : 0.15; // simplified marginal rate
  const estimatedTax = annualTaxableIncome * taxRate;
  const afterTaxCashFlow = noi - annualDebtService - estimatedTax;

  // ── YEAR-BY-YEAR PROJECTION ─────────────────────────
  const yearlyProjection: YearProjection[] = [];
  let cumulativeCF = 0;

  for (let year = 1; year <= loanTermYears; year++) {
    const rentAtYear = monthlyRent * Math.pow(1 + rentInflation, year - 1);
    const grossInc = rentAtYear * 12;
    const vacancyLoss = grossInc * vacancyRate;
    const effectiveInc = grossInc - vacancyLoss;
    const adminAtYear = effectiveInc * adminFeePct;
    const expAtYear = (monthlyGGCC + monthlyInsurance) * 12 + adminAtYear +
      annualMaintenance * Math.pow(1.02, year - 1) + // maintenance grows 2%/yr
      annualContribuciones * Math.pow(1.03, year - 1); // contribuciones grow 3%/yr
    const noiAtYear = effectiveInc - expAtYear;
    const dsAtYear = year <= loanTermYears ? annualDebtService : 0;
    const cfAtYear = noiAtYear - dsAtYear;
    cumulativeCF += cfAtYear;

    const propValue = priceCLP * Math.pow(1 + appreciationRate, year);
    const remainingLoan = year <= loanTermYears
      ? remainingBalance(loanAmount, interestRate, loanTermYears, year)
      : 0;
    const equity = propValue - Math.max(0, remainingLoan);

    yearlyProjection.push({
      year,
      rent: Math.round(rentAtYear),
      grossIncome: Math.round(grossInc),
      vacancy: Math.round(vacancyLoss),
      expenses: Math.round(expAtYear),
      noi: Math.round(noiAtYear),
      debtService: Math.round(dsAtYear),
      cashFlow: Math.round(cfAtYear),
      cumulativeCashFlow: Math.round(cumulativeCF),
      propertyValue: Math.round(propValue),
      equity: Math.round(equity),
    });
  }

  // ── IRR ──────────────────────────────────────────────
  // Cash flows: Year 0 = -downPayment, Year 1..N = cash flow, Year N += sale proceeds (property value - remaining loan)
  const irrFlows: number[] = [-downPayment];
  for (let y = 0; y < yearlyProjection.length; y++) {
    let cf = yearlyProjection[y].cashFlow;
    if (y === yearlyProjection.length - 1) {
      // Add sale proceeds at end (property value - remaining loan - 2% selling cost)
      const saleProceeds = yearlyProjection[y].propertyValue * 0.98 -
        Math.max(0, remainingBalance(loanAmount, interestRate, loanTermYears, loanTermYears));
      cf += saleProceeds;
    }
    irrFlows.push(cf);
  }
  const irr = calcIRR(irrFlows);

  // ── IRR SENSITIVITY ─────────────────────────────────
  const irrScenarios = [
    { label: `Plusvalía ${((appreciationRate - 0.02) * 100).toFixed(0)}%`, irr: 0 },
    { label: `Plusvalía ${(appreciationRate * 100).toFixed(0)}% (base)`, irr },
    { label: `Plusvalía ${((appreciationRate + 0.02) * 100).toFixed(0)}%`, irr: 0 },
  ];

  // Recalculate IRR for low/high appreciation
  for (const scenario of irrScenarios) {
    if (scenario.irr !== 0) continue; // skip base (already calculated)
    const adjRate = scenario.label.includes("-") || scenario.label.includes(`${((appreciationRate - 0.02) * 100).toFixed(0)}`)
      ? appreciationRate - 0.02 : appreciationRate + 0.02;
    const adjFlows: number[] = [-downPayment];
    for (let y = 1; y <= loanTermYears; y++) {
      const rentY = monthlyRent * Math.pow(1 + rentInflation, y - 1) * 12 * (1 - vacancyRate);
      const expY = totalExpenses * Math.pow(1.02, y - 1);
      const noiY = rentY - expY;
      let cf = noiY - annualDebtService;
      if (y === loanTermYears) {
        const propVal = priceCLP * Math.pow(1 + adjRate, y);
        cf += propVal * 0.98 - Math.max(0, remainingBalance(loanAmount, interestRate, loanTermYears, loanTermYears));
      }
      adjFlows.push(cf);
    }
    scenario.irr = calcIRR(adjFlows);
  }

  return {
    grossRentalIncome: Math.round(grossRentalIncome),
    effectiveRentalIncome: Math.round(effectiveRentalIncome),
    totalExpenses: Math.round(totalExpenses),
    noi: Math.round(noi),
    capRate,
    cashOnCash,
    dscr,
    annualTaxableIncome: Math.round(annualTaxableIncome),
    estimatedTax: Math.round(estimatedTax),
    afterTaxCashFlow: Math.round(afterTaxCashFlow),
    irr,
    yearlyProjection,
    irrScenarios,
  };
}
