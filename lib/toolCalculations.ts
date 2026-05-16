/**
 * Pure calculation functions for the 8 mini-tools.
 * All amounts in CLP unless otherwise specified.
 */

import { calcMonthlyPayment } from "./calculations";

// ─── Tool #1: ¿Me alcanza para comprar? ──────────────────

export interface AffordabilityInput {
  monthlyIncome: number;       // CLP
  monthlyDebts: number;        // CLP (existing debts)
  downPaymentAvailable: number; // CLP
  annualRate: number;          // e.g. 3.7
  loanTermYears: number;       // e.g. 20
}

export interface AffordabilityResult {
  maxPropertyCLP: number;
  maxPropertyUF: number;
  maxDividendo: number;
  maxLoan: number;
  debtToIncomeRatio: number;   // 0-1
  bankResults: { bank: string; rate: number; maxPropertyUF: number; maxPropertyCLP: number }[];
}

export function calcAffordability(
  input: AffordabilityInput,
  ufValue: number,
  banks: { shortName: string; rate: number }[]
): AffordabilityResult {
  const maxDividendo = Math.floor((input.monthlyIncome - input.monthlyDebts) * 0.25);
  const monthlyRate = input.annualRate / 100 / 12;
  const n = input.loanTermYears * 12;

  let maxLoan: number;
  if (monthlyRate === 0) {
    maxLoan = maxDividendo * n;
  } else {
    maxLoan = maxDividendo * (Math.pow(1 + monthlyRate, n) - 1) / (monthlyRate * Math.pow(1 + monthlyRate, n));
  }
  const maxPropertyCLP = maxLoan + input.downPaymentAvailable;
  const maxPropertyUF = Math.round(maxPropertyCLP / ufValue);

  const bankResults = banks.map(b => {
    const mr = b.rate / 100 / 12;
    let ml: number;
    if (mr === 0) {
      ml = maxDividendo * n;
    } else {
      ml = maxDividendo * (Math.pow(1 + mr, n) - 1) / (mr * Math.pow(1 + mr, n));
    }
    const mp = ml + input.downPaymentAvailable;
    return {
      bank: b.shortName,
      rate: b.rate,
      maxPropertyUF: Math.round(mp / ufValue),
      maxPropertyCLP: Math.round(mp),
    };
  }).sort((a, b) => b.maxPropertyUF - a.maxPropertyUF);

  return {
    maxPropertyCLP: Math.round(maxPropertyCLP),
    maxPropertyUF,
    maxDividendo,
    maxLoan: Math.round(maxLoan),
    debtToIncomeRatio: maxDividendo / input.monthlyIncome,
    bankResults,
  };
}

// ─── Tool #2: ¿Cuánto sería mi dividendo? ────────────────

export interface DividendoInput {
  propertyPriceCLP: number;
  downPaymentPct: number;
  loanTermYears: number;
  annualRate: number;
}

export interface DividendoResult {
  dividendo: number;
  totalPaid: number;
  totalInterest: number;
  loanAmount: number;
  downPaymentCLP: number;
}

export function calcDividendo(input: DividendoInput): DividendoResult {
  const downPaymentCLP = Math.round(input.propertyPriceCLP * input.downPaymentPct / 100);
  const loanAmount = input.propertyPriceCLP - downPaymentCLP;
  const dividendo = Math.round(calcMonthlyPayment(loanAmount, input.annualRate, input.loanTermYears));
  const totalPaid = downPaymentCLP + dividendo * input.loanTermYears * 12;
  const totalInterest = totalPaid - input.propertyPriceCLP;

  return { dividendo, totalPaid, totalInterest, loanAmount, downPaymentCLP };
}

// ─── Tool #3: ¿Conviene comprar o arrendar? (simplified) ─

export interface BuyVsRentInput {
  propertyPriceCLP: number;
  monthlyRentCLP: number;
  annualRate: number;
  downPaymentPct: number;
  loanTermYears: number;
  annualAppreciation: number; // e.g. 0.06
  annualRentInflation: number; // e.g. 0.03
}

export interface BuyVsRentResult {
  winner: "comprar" | "arrendar";
  buyTotal20: number;
  rentTotal20: number;
  savings: number;
  propertyValueYear20: number;
  dividendo: number;
  equityAtYear20: number;
}

export function calcBuyVsRent(input: BuyVsRentInput): BuyVsRentResult {
  const downPayment = input.propertyPriceCLP * input.downPaymentPct / 100;
  const loan = input.propertyPriceCLP - downPayment;
  const dividendo = Math.round(calcMonthlyPayment(loan, input.annualRate, input.loanTermYears));
  const years = input.loanTermYears;

  // Buy total: down payment + all dividendos
  const buyTotal20 = downPayment + dividendo * 12 * years;

  // Property value at year 20
  const propertyValueYear20 = Math.round(input.propertyPriceCLP * Math.pow(1 + input.annualAppreciation, years));

  // Equity = property value (fully paid off after loan term)
  const equityAtYear20 = propertyValueYear20;

  // Rent total: sum of escalating rents
  let rentTotal20 = 0;
  for (let y = 0; y < years; y++) {
    const rentThisYear = input.monthlyRentCLP * Math.pow(1 + input.annualRentInflation, y);
    rentTotal20 += rentThisYear * 12;
  }
  rentTotal20 = Math.round(rentTotal20);

  // Net comparison: buying cost minus equity gained vs renting cost
  const netBuyCost = buyTotal20 - equityAtYear20;
  const winner = netBuyCost < rentTotal20 ? "comprar" : "arrendar";
  const savings = Math.abs(netBuyCost - rentTotal20);

  return { winner, buyTotal20, rentTotal20, savings, propertyValueYear20, dividendo, equityAtYear20 };
}

// ─── Shared: format helpers ──────────────────────────────

export function formatCLP(v: number): string {
  return new Intl.NumberFormat("es-CL", {
    style: "currency", currency: "CLP", minimumFractionDigits: 0,
  }).format(v);
}

export function formatUF(v: number): string {
  return `UF ${new Intl.NumberFormat("es-CL", { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(v)}`;
}

export function formatPct(v: number, decimals = 1): string {
  return `${(v * 100).toFixed(decimals)}%`;
}

// ─── Default bank rates for tools (subset of /calcular) ──

export const toolBanks = [
  { shortName: "Santander", rate: 3.43 },
  { shortName: "BdChile",   rate: 3.75 },
  { shortName: "Scotia",    rate: 3.65 },
  { shortName: "BCI",       rate: 3.96 },
  { shortName: "Itaú",      rate: 3.55 },
  { shortName: "BancoEstado", rate: 4.19 },
  { shortName: "Security",  rate: 3.80 },
  { shortName: "BICE",      rate: 3.70 },
];

// ─── Tool #4: ¿Cuánto necesito ahorrar para el pie? ─────

export interface PieAhorroInput {
  propertyPriceCLP: number;
  downPaymentPct: number;      // e.g. 20
  currentSavings: number;      // CLP
  monthlySavings: number;      // CLP
  annualSavingsReturn: number; // e.g. 0.04 (4% annual return on savings)
}

export interface PieAhorroResult {
  pieNeeded: number;
  remaining: number;
  monthsToGoal: number;
  yearsToGoal: number;
  totalSaved: number;
  interestEarned: number;
}

export function calcPieAhorro(input: PieAhorroInput): PieAhorroResult {
  const pieNeeded = Math.round(input.propertyPriceCLP * input.downPaymentPct / 100);
  const remaining = Math.max(0, pieNeeded - input.currentSavings);

  if (remaining <= 0) {
    return { pieNeeded, remaining: 0, monthsToGoal: 0, yearsToGoal: 0, totalSaved: input.currentSavings, interestEarned: 0 };
  }

  if (input.monthlySavings <= 0) {
    return { pieNeeded, remaining, monthsToGoal: Infinity, yearsToGoal: Infinity, totalSaved: input.currentSavings, interestEarned: 0 };
  }

  // Simulate month by month with compound interest
  const monthlyRate = input.annualSavingsReturn / 12;
  let balance = input.currentSavings;
  let months = 0;
  const maxMonths = 600; // 50 year cap

  while (balance < pieNeeded && months < maxMonths) {
    balance = balance * (1 + monthlyRate) + input.monthlySavings;
    months++;
  }

  const totalSaved = balance;
  const totalDeposited = input.currentSavings + input.monthlySavings * months;
  const interestEarned = Math.round(totalSaved - totalDeposited);

  return {
    pieNeeded,
    remaining,
    monthsToGoal: months,
    yearsToGoal: Math.round(months / 12 * 10) / 10,
    totalSaved: Math.round(totalSaved),
    interestEarned,
  };
}

// ─── Tool #5: ¿Me conviene prepagar mi crédito? ─────────

export interface PrepagoInput {
  outstandingBalance: number;  // CLP
  remainingMonths: number;
  annualRate: number;
  prepaymentAmount: number;    // CLP
}

export interface PrepagoResult {
  currentMonthlyPayment: number;
  newMonthlyPayment: number;
  monthsSaved: number;
  interestSaved: number;
  totalWithoutPrepay: number;
  totalWithPrepay: number;
  newBalance: number;
  newRemainingMonths: number;
}

export function calcPrepago(input: PrepagoInput): PrepagoResult {
  const mr = input.annualRate / 100 / 12;
  const n = input.remainingMonths;

  // Current payment
  let currentMonthlyPayment: number;
  if (mr === 0) {
    currentMonthlyPayment = input.outstandingBalance / n;
  } else {
    currentMonthlyPayment = input.outstandingBalance * (mr * Math.pow(1 + mr, n)) / (Math.pow(1 + mr, n) - 1);
  }

  const totalWithoutPrepay = Math.round(currentMonthlyPayment * n);

  // After prepayment: reduce balance, keep same payment, shorter term
  const newBalance = Math.max(0, input.outstandingBalance - input.prepaymentAmount);

  if (newBalance <= 0) {
    return {
      currentMonthlyPayment: Math.round(currentMonthlyPayment),
      newMonthlyPayment: 0,
      monthsSaved: n,
      interestSaved: Math.round(totalWithoutPrepay - input.outstandingBalance),
      totalWithoutPrepay,
      totalWithPrepay: input.prepaymentAmount,
      newBalance: 0,
      newRemainingMonths: 0,
    };
  }

  // Keep same payment, calculate new term
  let newRemainingMonths: number;
  if (mr === 0) {
    newRemainingMonths = Math.ceil(newBalance / currentMonthlyPayment);
  } else {
    // n = -log(1 - B*r/P) / log(1+r)
    const x = 1 - (newBalance * mr) / currentMonthlyPayment;
    if (x <= 0) {
      newRemainingMonths = n; // payment doesn't cover interest
    } else {
      newRemainingMonths = Math.ceil(-Math.log(x) / Math.log(1 + mr));
    }
  }

  const totalWithPrepay = input.prepaymentAmount + Math.round(currentMonthlyPayment * newRemainingMonths);
  const interestSaved = totalWithoutPrepay - totalWithPrepay;
  const monthsSaved = n - newRemainingMonths;

  return {
    currentMonthlyPayment: Math.round(currentMonthlyPayment),
    newMonthlyPayment: Math.round(currentMonthlyPayment), // same payment, shorter term
    monthsSaved,
    interestSaved: Math.round(interestSaved),
    totalWithoutPrepay,
    totalWithPrepay: Math.round(totalWithPrepay),
    newBalance: Math.round(newBalance),
    newRemainingMonths,
  };
}

// ─── Tool #6: Presupuesto de vivienda ───────────────────

export interface PresupuestoInput {
  monthlyIncome: number;
  housingCost: number;      // dividendo or rent
  otherFixedCosts: number;  // gastos comunes, seguros, etc.
}

export interface PresupuestoResult {
  housingPct: number;       // 0-1
  totalHousingPct: number;  // including other costs
  status: "saludable" | "ajustado" | "riesgoso";
  recommendation: string;
  maxRecommendedHousing: number;
}

export function calcPresupuesto(input: PresupuestoInput): PresupuestoResult {
  const housingPct = input.housingCost / input.monthlyIncome;
  const totalHousingPct = (input.housingCost + input.otherFixedCosts) / input.monthlyIncome;
  const maxRecommendedHousing = Math.round(input.monthlyIncome * 0.3);

  let status: PresupuestoResult["status"];
  let recommendation: string;

  if (totalHousingPct <= 0.30) {
    status = "saludable";
    recommendation = "Tu gasto en vivienda está dentro del rango recomendado. Tienes margen para ahorrar o invertir.";
  } else if (totalHousingPct <= 0.40) {
    status = "ajustado";
    recommendation = "Estás en el límite. Cualquier imprevisto podría complicar tus finanzas. Considera reducir gastos o buscar una alternativa más económica.";
  } else {
    status = "riesgoso";
    recommendation = "Tu gasto en vivienda supera el 40% de tu ingreso. Esto te deja muy expuesto. Evalúa opciones más económicas o busca aumentar tus ingresos.";
  }

  return { housingPct, totalHousingPct, status, recommendation, maxRecommendedHousing };
}
