/**
 * Detailed capacidad-de-compra / rentabilidad engine for Chilean real estate.
 * All amounts are in UF unless the field name says otherwise — CLP conversion
 * is the caller's responsibility (matching lib/calculations.ts's convention).
 *
 * Ported faithfully from a reference HTML calculator supplied for this issue
 * (its inline <script>: iMes, factorCuota, gastos, precioPorRenta,
 * precioPorAhorro, amortizar, rentabilidad, and the three renderEscenarios
 * tables). All function/type names here are English, per this repo's
 * lib/ convention — except `calcularAnalisisCompleto` and its top-level
 * return field names, which are pinned in Spanish by this issue's spec
 * (the future page-shell issue consumes that exact contract).
 */

import { getComunaInfo } from "@/lib/comunaData";

// ─── Types ────────────────────────────────────────────────

export type RateConvention = "compuesta" | "lineal";
export type PropertyPurpose = "vivienda" | "inversion";

export interface CalcAvanzadoInput {
  /** Valor de la UF, en CLP */
  ufValue: number;
  /** Tasa anual, como fracción (0.04 = 4%) */
  annualRate: number;
  /** Plazo del crédito, en años */
  termYears: number;
  /** Convención de tasa mensual */
  rateConvention: RateConvention;
  /** Renta líquida mensual, en CLP */
  monthlyIncomeCLP: number;
  /** Otros dividendos/cuotas mensuales, en CLP */
  otherMonthlyDebtsCLP: number;
  /** Ahorro disponible, en CLP */
  availableSavingsCLP: number;
  /** Máxima fracción de la renta destinada al dividendo (0.25 = 25%) */
  maxIncomeRatio: number;
  /** Propósito de la compra — determina el LTV por defecto (AC-3) */
  purpose: PropertyPurpose;
  /** LTV explícito (fracción). Si se omite, usa el default por `purpose`. */
  ltv?: number;
  /** Fecha de la primera cuota */
  firstPaymentDate: Date;
  /** Seguro desgravamen, % mensual sobre saldo insoluto (fracción) */
  desgravamenRate: number;
  /** Seguro incendio, % mensual sobre valor propiedad (fracción) */
  fireInsuranceRate: number;
  /** Impuesto al mutuo, sobre el monto del crédito (fracción) */
  mortgageTaxRate: number;
  /** Conservador de Bienes Raíces, % del precio (fracción) */
  cbrRate: number;
  /** Tope del CBR, en UF */
  cbrCapUF: number;
  /** Gastos fijos — tasación, notaría, estudio de títulos —, en UF */
  fixedCostsUF: number;
  /** Corretaje a cargo del comprador, % del precio (fracción) */
  brokerageRate: number;
  /** Arriendo mensual esperado, en UF */
  monthlyRentUF: number;
  /** Vacancia (fracción) */
  vacancyRate: number;
  /** Administración, % del arriendo efectivo (fracción) */
  managementRate: number;
  /** Mantención, % del arriendo efectivo (fracción) */
  maintenanceRate: number;
  /** Contribuciones anuales, en UF */
  propertyTaxAnnualUF: number;
  /** Gastos comunes a cargo del comprador, en UF/mes */
  hoaMonthlyUF: number;
  /** Ciudad — junto a `comunaId`, deriva la plusvalía vía getComunaInfo (AC-2) */
  cityId: string;
  /** Comuna — junto a `cityId`, deriva la plusvalía vía getComunaInfo (AC-2) */
  comunaId: string;
  /** Precio a evaluar, en UF. Si se omite, se usa el precio máximo calculado. */
  evaluatedPriceUF?: number;
}

export interface PurchaseCosts {
  mortgageTaxUF: number;
  cbrUF: number;
  fixedCostsUF: number;
  brokerageUF: number;
  totalUF: number;
}

export interface MaxPriceByIncomeResult {
  priceUF: number;
  creditUF: number;
  /** Dividendo máximo que la renta permite (fracción de renta disponible, en UF) */
  maxDividendUF: number;
}

export interface AmortizationRow {
  installmentNumber: number;
  paymentDate: Date;
  startingBalanceUF: number;
  interestUF: number;
  principalUF: number;
  /** Cuota pura: capital + interés (sin seguros) */
  paymentUF: number;
  desgravamenUF: number;
  fireInsuranceUF: number;
  /** Dividendo total: cuota + seguros */
  dividendUF: number;
  endingBalanceUF: number;
}

export interface AmortizationSchedule {
  creditUF: number;
  /** Cuota pura, constante (capital + interés) */
  installmentUF: number;
  rows: AmortizationRow[];
  totalInterestUF: number;
  totalPrincipalUF: number;
  totalInsuranceUF: number;
  totalPaidUF: number;
  firstDividendUF: number;
}

export interface Rentability {
  purchaseCosts: PurchaseCosts;
  downPaymentUF: number;
  initialInvestmentUF: number;
  totalInvestmentUF: number;
  grossAnnualRentUF: number;
  effectiveAnnualRentUF: number;
  managementCostUF: number;
  maintenanceCostUF: number;
  hoaAnnualUF: number;
  fireInsuranceAnnualUF: number;
  operatingExpensesUF: number;
  /** Resultado operativo neto (antes del crédito) */
  noiUF: number;
  dividendYear1UF: number;
  interestYear1UF: number;
  principalYear1UF: number;
  debtServiceUF: number;
  annualCashFlowUF: number;
  /** Cap rate neto: NOI / inversión total */
  netCapRate: number;
  /** Cap rate bruto: arriendo bruto anual / inversión total */
  grossCapRate: number;
  /** Cash-on-cash, año 1 */
  cashOnCash: number;
  appreciationUF: number;
  /** Retorno total = (flujo + amortización + plusvalía) / inversión inicial */
  totalReturn: number;
  breakEvenRentUF: number;
}

export interface ScenarioPriceByTermRow {
  termYears: number;
  cells: { annualRatePct: number; priceUF: number }[];
}

export interface ScenarioSameCreditByTermRow {
  termYears: number;
  firstDividendUF: number;
  /** Dividendo / renta, como fracción */
  incomeRatio: number;
  totalInterestUF: number;
  totalPaidUF: number;
}

export interface ScenarioRateSensitivityRow {
  annualRatePct: number;
  firstDividendUF: number;
  deltaVsBaseUF: number;
  maxPriceUF: number;
  totalInterestUF: number;
}

export interface AnalisisCompleto {
  precioMaximoUF: number;
  limitante: "renta" | "ahorro";
  precioEvaluadoUF: number;
  amortizacion: AmortizationSchedule;
  gastosCompra: PurchaseCosts;
  rentabilidad: Rentability;
  escenarios: {
    precioPorPlazoYTasa: ScenarioPriceByTermRow[];
    mismoCreditoPorPlazo: ScenarioSameCreditByTermRow[];
    sensibilidadTasa: ScenarioRateSensitivityRow[];
  };
}

// ─── Scenario axes (match the reference's renderEscenarios exactly) ──

const SCENARIO_TERMS_YEARS = [10, 15, 20, 25, 30];
const SCENARIO_RATE_DELTAS_PCT = [-1, -0.5, 0, 0.5, 1];
const SENSITIVITY_RATE_DELTAS_PCT = [-1, -0.75, -0.5, -0.25, 0, 0.25, 0.5, 0.75, 1];

// ─── Core building blocks ───────────────────────────────────

/**
 * Monthly rate from an annual rate, per convention.
 * Ports the reference's `iMes`.
 */
export function calcMonthlyRate(annualRate: number, convention: RateConvention): number {
  return convention === "lineal" ? annualRate / 12 : Math.pow(1 + annualRate, 1 / 12) - 1;
}

/**
 * Payment (annuity) factor: installment per unit of principal.
 * Ports the reference's `factorCuota`.
 */
export function calcPaymentFactor(monthlyRate: number, numPayments: number): number {
  if (numPayments <= 0) return 0;
  if (monthlyRate === 0) return 1 / numPayments;
  return monthlyRate / (1 - Math.pow(1 + monthlyRate, -numPayments));
}

/**
 * One-time purchase costs (impuesto al mutuo, CBR with cap, fixed costs, corretaje).
 * Ports the reference's `gastos`.
 */
export function calcPurchaseCosts(
  input: CalcAvanzadoInput,
  ltv: number,
  priceUF: number
): PurchaseCosts {
  const creditUF = priceUF * ltv;
  const mortgageTaxUF = creditUF * input.mortgageTaxRate;
  const cbrUF = Math.min(priceUF * input.cbrRate, input.cbrCapUF);
  const brokerageUF = priceUF * input.brokerageRate;
  return {
    mortgageTaxUF,
    cbrUF,
    fixedCostsUF: input.fixedCostsUF,
    brokerageUF,
    totalUF: mortgageTaxUF + cbrUF + input.fixedCostsUF + brokerageUF,
  };
}

/**
 * Max property price the buyer's income supports (dividendo ≤ maxIncomeRatio · renta).
 * Ports the reference's `precioPorRenta`.
 */
export function calcMaxPriceByIncome(
  input: CalcAvanzadoInput,
  paymentFactor: number,
  ltv: number
): MaxPriceByIncomeResult {
  const incomeUF = input.ufValue > 0 ? input.monthlyIncomeCLP / input.ufValue : 0;
  const debtsUF = input.ufValue > 0 ? input.otherMonthlyDebtsCLP / input.ufValue : 0;
  const availableUF = incomeUF * input.maxIncomeRatio - debtsUF;

  if (availableUF <= 0 || ltv <= 0) {
    return { priceUF: 0, creditUF: 0, maxDividendUF: Math.max(0, availableUF) };
  }

  // dividendo = credito*(paymentFactor + desgravamen) + incendio*(credito/ltv)
  const denominator = paymentFactor + input.desgravamenRate + input.fireInsuranceRate / ltv;
  const creditUF = denominator > 0 ? availableUF / denominator : 0;
  return { priceUF: creditUF / ltv, creditUF, maxDividendUF: availableUF };
}

/**
 * Max property price the buyer's available savings supports (covers down
 * payment + purchase costs). Ports the reference's `precioPorAhorro`.
 */
export function calcMaxPriceBySavings(input: CalcAvanzadoInput, ltv: number): number {
  const savingsUF = input.ufValue > 0 ? input.availableSavingsCLP / input.ufValue : 0;
  const availableForCosts = savingsUF - input.fixedCostsUF;
  if (availableForCosts <= 0) return 0;

  // availableForCosts = (1-ltv)*P + mortgageTax*ltv*P + min(cbrRate*P, cap) + brokerage*P
  const baseCoef = (1 - ltv) + input.mortgageTaxRate * ltv + input.brokerageRate;
  let priceUF = availableForCosts / (baseCoef + input.cbrRate); // sin tope CBR
  if (priceUF * input.cbrRate > input.cbrCapUF) {
    priceUF = (availableForCosts - input.cbrCapUF) / baseCoef; // CBR topado
  }
  return Math.max(0, priceUF);
}

/** Adds `months` calendar months to `base`, clamping the day to the target month's length. */
function addMonths(base: Date, months: number): Date {
  const year = base.getFullYear();
  const month = base.getMonth() + months;
  const day = base.getDate();
  const lastDayOfTargetMonth = new Date(year, month + 1, 0).getDate();
  return new Date(year, month, Math.min(day, lastDayOfTargetMonth));
}

/**
 * Full month-by-month amortization schedule with real calendar dates.
 * Ports the reference's `amortizar`.
 */
export function calcAmortizationSchedule(
  input: CalcAvanzadoInput,
  ltv: number,
  monthlyRate: number,
  paymentFactor: number,
  numPayments: number,
  priceUF: number
): AmortizationSchedule {
  const creditUF = priceUF * ltv;
  const installmentUF = creditUF * paymentFactor;
  const fireInsuranceMonthlyUF = priceUF * input.fireInsuranceRate;

  let balanceUF = creditUF;
  const rows: AmortizationRow[] = [];
  let totalInterestUF = 0;
  let totalPrincipalUF = 0;
  let totalInsuranceUF = 0;

  for (let k = 1; k <= numPayments; k++) {
    const interestUF = balanceUF * monthlyRate;
    const desgravamenUF = balanceUF * input.desgravamenRate;
    let principalUF = installmentUF - interestUF;
    if (k === numPayments || principalUF > balanceUF) principalUF = balanceUF; // ajuste última cuota
    const paymentUF = interestUF + principalUF;
    const dividendUF = paymentUF + desgravamenUF + fireInsuranceMonthlyUF;
    const startingBalanceUF = balanceUF;
    balanceUF = Math.max(0, balanceUF - principalUF);

    totalInterestUF += interestUF;
    totalPrincipalUF += principalUF;
    totalInsuranceUF += desgravamenUF + fireInsuranceMonthlyUF;

    rows.push({
      installmentNumber: k,
      paymentDate: addMonths(input.firstPaymentDate, k - 1),
      startingBalanceUF,
      interestUF,
      principalUF,
      paymentUF,
      desgravamenUF,
      fireInsuranceUF: fireInsuranceMonthlyUF,
      dividendUF,
      endingBalanceUF: balanceUF,
    });
  }

  return {
    creditUF,
    installmentUF,
    rows,
    totalInterestUF,
    totalPrincipalUF,
    totalInsuranceUF,
    totalPaidUF: totalInterestUF + totalPrincipalUF + totalInsuranceUF,
    firstDividendUF: rows.length ? rows[0].dividendUF : 0,
  };
}

/**
 * Rentability of the evaluated property as a rental: bruto/neto cap rate,
 * cash-on-cash, break-even rent, and total return (flujo + amortización + plusvalía).
 * Ports the reference's `rentabilidad`.
 */
export function calcRentability(
  input: CalcAvanzadoInput,
  ltv: number,
  priceUF: number,
  purchaseCosts: PurchaseCosts,
  amortization: AmortizationSchedule,
  appreciationRate: number
): Rentability {
  const downPaymentUF = priceUF * (1 - ltv);
  const initialInvestmentUF = downPaymentUF + purchaseCosts.totalUF;
  const totalInvestmentUF = priceUF + purchaseCosts.totalUF;

  const grossAnnualRentUF = input.monthlyRentUF * 12;
  const effectiveAnnualRentUF = grossAnnualRentUF * (1 - input.vacancyRate);
  const managementCostUF = effectiveAnnualRentUF * input.managementRate;
  const maintenanceCostUF = effectiveAnnualRentUF * input.maintenanceRate;
  const hoaAnnualUF = input.hoaMonthlyUF * 12;
  const fireInsuranceAnnualUF = priceUF * input.fireInsuranceRate * 12;
  const operatingExpensesUF =
    managementCostUF + maintenanceCostUF + hoaAnnualUF + input.propertyTaxAnnualUF + fireInsuranceAnnualUF;
  const noiUF = effectiveAnnualRentUF - operatingExpensesUF;

  const year1Rows = amortization.rows.slice(0, 12);
  const dividendYear1UF = year1Rows.reduce((sum, r) => sum + r.dividendUF, 0);
  const interestYear1UF = year1Rows.reduce((sum, r) => sum + r.interestUF, 0);
  const principalYear1UF = year1Rows.reduce((sum, r) => sum + r.principalUF, 0);
  // El seguro de incendio ya está en operatingExpenses: se descuenta del
  // servicio de deuda para no duplicarlo (igual que la referencia).
  const debtServiceUF = dividendYear1UF - fireInsuranceAnnualUF;
  const annualCashFlowUF = noiUF - debtServiceUF;

  const netCapRate = totalInvestmentUF > 0 ? noiUF / totalInvestmentUF : 0;
  const grossCapRate = totalInvestmentUF > 0 ? grossAnnualRentUF / totalInvestmentUF : 0;
  const cashOnCash = initialInvestmentUF > 0 ? annualCashFlowUF / initialInvestmentUF : 0;
  const appreciationUF = priceUF * appreciationRate;
  const totalReturn =
    initialInvestmentUF > 0
      ? (annualCashFlowUF + principalYear1UF + appreciationUF) / initialInvestmentUF
      : 0;

  const incomeCoefficient = 12 * (1 - input.vacancyRate) * (1 - input.managementRate - input.maintenanceRate);
  const annualFixedCostsUF = hoaAnnualUF + input.propertyTaxAnnualUF + fireInsuranceAnnualUF + debtServiceUF;
  const breakEvenRentUF = incomeCoefficient > 0 ? annualFixedCostsUF / incomeCoefficient : 0;

  return {
    purchaseCosts,
    downPaymentUF,
    initialInvestmentUF,
    totalInvestmentUF,
    grossAnnualRentUF,
    effectiveAnnualRentUF,
    managementCostUF,
    maintenanceCostUF,
    hoaAnnualUF,
    fireInsuranceAnnualUF,
    operatingExpensesUF,
    noiUF,
    dividendYear1UF,
    interestYear1UF,
    principalYear1UF,
    debtServiceUF,
    annualCashFlowUF,
    netCapRate,
    grossCapRate,
    cashOnCash,
    appreciationUF,
    totalReturn,
    breakEvenRentUF,
  };
}

// ─── Scenario tables (structured data, no HTML) ─────────────

/**
 * Max price by plazo × tasa (5 plazos × 5 tasa deltas).
 * Ports the reference's first `renderEscenarios` table.
 */
export function calcScenarioPriceByTermAndRate(
  input: CalcAvanzadoInput,
  ltv: number,
  maxPriceBySavingsUF: number
): ScenarioPriceByTermRow[] {
  const baseRate = input.annualRate;
  return SCENARIO_TERMS_YEARS.map((termYears) => {
    const numPayments = termYears * 12;
    const cells = SCENARIO_RATE_DELTAS_PCT.map((deltaPct) => {
      const annualRate = baseRate + deltaPct / 100;
      const monthlyRate = calcMonthlyRate(annualRate, input.rateConvention);
      const paymentFactor = calcPaymentFactor(monthlyRate, numPayments);
      const byIncomeUF = calcMaxPriceByIncome(input, paymentFactor, ltv).priceUF;
      return { annualRatePct: annualRate * 100, priceUF: Math.min(byIncomeUF, maxPriceBySavingsUF) };
    });
    return { termYears, cells };
  });
}

/**
 * Same credit (base rate, evaluated price) at different plazos (5 plazos).
 * Ports the reference's second `renderEscenarios` table.
 */
export function calcScenarioSameCreditByTerm(
  input: CalcAvanzadoInput,
  ltv: number,
  baseMonthlyRate: number,
  priceUF: number
): ScenarioSameCreditByTermRow[] {
  const incomeUF = input.ufValue > 0 ? input.monthlyIncomeCLP / input.ufValue : 0;
  return SCENARIO_TERMS_YEARS.map((termYears) => {
    const numPayments = termYears * 12;
    const paymentFactor = calcPaymentFactor(baseMonthlyRate, numPayments);
    const schedule = calcAmortizationSchedule(input, ltv, baseMonthlyRate, paymentFactor, numPayments, priceUF);
    return {
      termYears,
      firstDividendUF: schedule.firstDividendUF,
      incomeRatio: incomeUF > 0 ? schedule.firstDividendUF / incomeUF : 0,
      totalInterestUF: schedule.totalInterestUF,
      totalPaidUF: schedule.totalPaidUF,
    };
  });
}

/**
 * Dividendo sensitivity to tasa, at the evaluated term/price (9 tasa deltas).
 * Ports the reference's third `renderEscenarios` table.
 */
export function calcScenarioRateSensitivity(
  input: CalcAvanzadoInput,
  ltv: number,
  numPayments: number,
  priceUF: number,
  maxPriceBySavingsUF: number
): ScenarioRateSensitivityRow[] {
  const baseRate = input.annualRate;
  const baseMonthlyRate = calcMonthlyRate(baseRate, input.rateConvention);
  const basePaymentFactor = calcPaymentFactor(baseMonthlyRate, numPayments);
  const baseSchedule = calcAmortizationSchedule(input, ltv, baseMonthlyRate, basePaymentFactor, numPayments, priceUF);

  return SENSITIVITY_RATE_DELTAS_PCT.map((deltaPct) => {
    const annualRate = baseRate + deltaPct / 100;
    const monthlyRate = calcMonthlyRate(annualRate, input.rateConvention);
    const paymentFactor = calcPaymentFactor(monthlyRate, numPayments);
    const schedule = calcAmortizationSchedule(input, ltv, monthlyRate, paymentFactor, numPayments, priceUF);
    const maxPriceUF = Math.min(calcMaxPriceByIncome(input, paymentFactor, ltv).priceUF, maxPriceBySavingsUF);
    return {
      annualRatePct: annualRate * 100,
      firstDividendUF: schedule.firstDividendUF,
      deltaVsBaseUF: schedule.firstDividendUF - baseSchedule.firstDividendUF,
      maxPriceUF,
      totalInterestUF: schedule.totalInterestUF,
    };
  });
}

// ─── Orchestrator ────────────────────────────────────────────

/**
 * Runs the full analysis in one call — everything the future result tabs need.
 * Function name and top-level return field names are pinned in Spanish by
 * this issue's spec (AC-5); everything else in this module is English.
 */
export function calcularAnalisisCompleto(input: CalcAvanzadoInput): AnalisisCompleto {
  const ltv = input.ltv ?? (input.purpose === "vivienda" ? 0.9 : 0.8);
  const numPayments = Math.max(1, Math.round(input.termYears)) * 12;
  const monthlyRate = calcMonthlyRate(input.annualRate, input.rateConvention);
  const paymentFactor = calcPaymentFactor(monthlyRate, numPayments);

  const byIncome = calcMaxPriceByIncome(input, paymentFactor, ltv);
  const bySavingsUF = calcMaxPriceBySavings(input, ltv);
  const precioMaximoUF = Math.max(0, Math.min(byIncome.priceUF, bySavingsUF));
  const limitante: "renta" | "ahorro" = byIncome.priceUF <= bySavingsUF ? "renta" : "ahorro";

  const precioEvaluadoUF = input.evaluatedPriceUF ?? precioMaximoUF;

  const amortizacion = calcAmortizationSchedule(input, ltv, monthlyRate, paymentFactor, numPayments, precioEvaluadoUF);
  const gastosCompra = calcPurchaseCosts(input, ltv, precioEvaluadoUF);

  // AC-2: plusvalía is derived, never a manual input.
  const comunaInfo = getComunaInfo(input.cityId, input.comunaId);
  const appreciationRate = comunaInfo?.appreciation ?? 0.05;

  const rentabilidad = calcRentability(input, ltv, precioEvaluadoUF, gastosCompra, amortizacion, appreciationRate);

  const escenarios = {
    precioPorPlazoYTasa: calcScenarioPriceByTermAndRate(input, ltv, bySavingsUF),
    mismoCreditoPorPlazo: calcScenarioSameCreditByTerm(input, ltv, monthlyRate, precioEvaluadoUF),
    sensibilidadTasa: calcScenarioRateSensitivity(input, ltv, numPayments, precioEvaluadoUF, bySavingsUF),
  };

  return { precioMaximoUF, limitante, precioEvaluadoUF, amortizacion, gastosCompra, rentabilidad, escenarios };
}
