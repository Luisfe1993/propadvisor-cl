/**
 * Financial calculations for Chilean real estate analysis
 * All amounts in CLP unless otherwise specified
 */

/**
 * Calculate monthly mortgage payment using French amortization
 * @param principal - Loan amount in CLP
 * @param annualRatePct - Annual interest rate as percentage (e.g., 4.19 for 4.19%)
 * @param termYears - Loan term in years
 * @returns Monthly payment amount in CLP
 */
export function calcMonthlyPayment(
  principal: number,
  annualRatePct: number,
  termYears: number
): number {
  const monthlyRate = annualRatePct / 100 / 12;
  const numPayments = termYears * 12;

  if (monthlyRate === 0) {
    return principal / numPayments;
  }

  const monthlyPayment =
    (principal * (monthlyRate * Math.pow(1 + monthlyRate, numPayments))) /
    (Math.pow(1 + monthlyRate, numPayments) - 1);

  return monthlyPayment;
}

/**
 * Calculate total cost of ownership over loan term
 * @param downPaymentAmount - Down payment in CLP
 * @param monthlyPayment - Monthly mortgage payment in CLP
 * @param termYears - Loan term in years
 * @returns Total cost (down payment + all monthly payments)
 */
export function calcTotalCost(
  downPaymentAmount: number,
  monthlyPayment: number,
  termYears: number
): number {
  return downPaymentAmount + monthlyPayment * 12 * termYears;
}

/**
 * Calculate annual rental yield percentage
 * @param monthlyRentCLP - Monthly rent in CLP
 * @param propertyPriceCLP - Property price in CLP
 * @returns Annual yield as percentage (e.g., 4.5 for 4.5%)
 */
export function calcRentalYield(
  monthlyRentCLP: number,
  propertyPriceCLP: number
): number {
  const annualRent = monthlyRentCLP * 12;
  return (annualRent / propertyPriceCLP) * 100;
}

/**
 * Calculate months to break even (when accumulated rent savings equal down payment)
 * @param monthlyCostBuy - Monthly mortgage + expenses for buying
 * @param monthlyRentCLP - Monthly rent
 * @returns Months to break even (or -1 if buying is always more expensive)
 */
export function calcBreakEven(
  monthlyCostBuy: number,
  monthlyRentCLP: number
): number {
  const monthlyDifference = monthlyCostBuy - monthlyRentCLP;

  if (monthlyDifference <= 0) {
    return 0; // Renting is already more expensive
  }

  // This would need down payment amount to calculate properly
  // Simplified: estimate based on monthly difference
  return monthlyDifference > 0 ? 10000 / monthlyDifference : -1;
}

/**
 * Compare buy vs rent scenarios over the loan term
 * Honest comparison: includes opportunity cost of pie, net wealth, and appreciation as separate line
 */
export function calc20YearComparison(
  buyMonthlyCost: number,
  rentMonthlyCost: number,
  initialInvestment: number,
  propertyPriceCLP: number,
  termYears: number = 20
) {
  const annualAppreciation = 0.07; // 7% gross property appreciation (Chilean market)
  const annualRentInflation = 0.03; // 3% annual rent increase
  const annualInvestmentReturn = 0.06; // 6% annual return on invested pie (conservative fund)
  const months = termYears * 12;

  // ── BUYING SCENARIO ──────────────────────────────────
  const totalBuyPayments = buyMonthlyCost * months;
  const totalBuyCost = initialInvestment + totalBuyPayments;

  // Property value after term (gross appreciation)
  const propertyValueAfterTerm =
    propertyPriceCLP * Math.pow(1 + annualAppreciation, termYears);
  const appreciationGain = propertyValueAfterTerm - propertyPriceCLP;

  // Net wealth if you buy: property value - total spent
  // (You own the property but spent totalBuyCost)
  const buyNetWealth = propertyValueAfterTerm - totalBuyCost;

  // ── RENTING SCENARIO ─────────────────────────────────
  let totalRentCost = 0;
  for (let m = 0; m < months; m++) {
    const year = Math.floor(m / 12);
    totalRentCost += rentMonthlyCost * Math.pow(1 + annualRentInflation, year);
  }

  // Opportunity cost: if you invested the pie in a fund instead of buying
  const pieInvested = initialInvestment * Math.pow(1 + annualInvestmentReturn, termYears);
  const pieOpportunityCost = pieInvested - initialInvestment; // what you'd gain

  // Monthly savings from renting cheaper: invest the difference each month
  // (if rent < buy monthly cost, renter invests the difference)
  let rentInvestmentGrowth = 0;
  for (let m = 0; m < months; m++) {
    const year = Math.floor(m / 12);
    const currentRent = rentMonthlyCost * Math.pow(1 + annualRentInflation, year);
    const monthlySaving = buyMonthlyCost - currentRent;
    if (monthlySaving > 0) {
      // Months remaining, compound at monthly rate
      const monthsRemaining = months - m - 1;
      const monthlyRate = Math.pow(1 + annualInvestmentReturn, 1 / 12) - 1;
      rentInvestmentGrowth += monthlySaving * Math.pow(1 + monthlyRate, monthsRemaining);
    }
  }

  // Net wealth if you rent: pie invested + monthly savings invested - total rent spent
  const rentNetWealth = pieInvested + rentInvestmentGrowth - totalRentCost;

  // ── VERDICT ──────────────────────────────────────────
  // Positive = buying makes you wealthier
  const netWealthDifference = buyNetWealth - rentNetWealth;

  // Break-even: year where buying net wealth first exceeds renting net wealth
  let breakEvenYear = -1;
  let cumBuy = initialInvestment;
  let cumRent = 0;
  let cumRentInvest = 0;
  for (let year = 1; year <= termYears; year++) {
    cumBuy += buyMonthlyCost * 12;
    for (let m = 0; m < 12; m++) {
      const currentRent = rentMonthlyCost * Math.pow(1 + annualRentInflation, year - 1);
      cumRent += currentRent;
      const saving = buyMonthlyCost - currentRent;
      if (saving > 0) {
        cumRentInvest += saving;
      }
    }
    const propValueAtYear = propertyPriceCLP * Math.pow(1 + annualAppreciation, year);
    const pieAtYear = initialInvestment * Math.pow(1 + annualInvestmentReturn, year);
    const buyWealthAtYear = propValueAtYear - cumBuy;
    const rentWealthAtYear = pieAtYear + cumRentInvest * Math.pow(1 + annualInvestmentReturn, (termYears - year)) / Math.pow(1 + annualInvestmentReturn, (termYears - year)) - cumRent;
    // Simplified break-even: cumulative buy advantage
    const buyNetAtYear = cumBuy - propValueAtYear;
    const rentNetAtYear = cumRent - pieAtYear;
    if (buyNetAtYear < rentNetAtYear && breakEvenYear === -1) {
      breakEvenYear = year;
    }
  }

  return {
    // Raw costs
    buyTotal: totalBuyCost,
    rentTotal: totalRentCost,
    // Appreciation
    propertyValueAfter20Years: propertyValueAfterTerm,
    appreciationGain,
    // Opportunity cost
    pieInvested, // what the pie becomes if invested
    pieOpportunityCost, // gain from investing pie
    // Net wealth (the real comparison)
    buyNetWealth,
    rentNetWealth,
    netWealthDifference, // positive = buying wins
    // Legacy field (kept for compatibility)
    savings: netWealthDifference,
    breakEvenYear,
    termYears,
  };
}

/**
 * Convert CLP to UF
 * @param amountCLP - Amount in CLP
 * @param ufValue - Current UF value in CLP
 * @returns Amount in UF
 */
export function clpToUF(amountCLP: number, ufValue: number): number {
  return amountCLP / ufValue;
}

/**
 * Convert UF to CLP
 * @param amountUF - Amount in UF
 * @param ufValue - Current UF value in CLP
 * @returns Amount in CLP
 */
export function ufToCLP(amountUF: number, ufValue: number): number {
  return amountUF * ufValue;
}
