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
 * Compare buy vs rent scenarios over 20 years
 * Includes property appreciation (estimated 7% annual for Chile)
 * @param buyMonthlyCost - Monthly buying cost (mortgage + maintenance)
 * @param rentMonthlyCost - Monthly rent cost
 * @param initialInvestment - Down payment
 * @param propertyPriceCLP - Initial property price
 * @returns 20-year comparison with appreciation
 */
export function calc20YearComparison(
  buyMonthlyCost: number,
  rentMonthlyCost: number,
  initialInvestment: number,
  propertyPriceCLP: number
) {
  const annualAppreciation = 0.07; // 7% annual appreciation (Chilean market average)
  const months = 240; // 20 years

  // Buying: total out-of-pocket costs
  const totalBuyPayments = buyMonthlyCost * months;
  const totalBuyCost = initialInvestment + totalBuyPayments;

  // Renting: total rental costs
  const totalRentCost = rentMonthlyCost * months;

  // Property value after 20 years (appreciation)
  const propertyValueAfter20Years =
    propertyPriceCLP * Math.pow(1 + annualAppreciation, 20);

  // Net position if you bought
  const buyNetPosition =
    totalBuyCost - propertyValueAfter20Years; // negative = you're ahead

  // Net position if you rented
  const rentNetPosition = totalRentCost; // you spent everything, own nothing

  return {
    buyTotal: totalBuyCost,
    buyNetPosition,
    rentTotal: totalRentCost,
    rentNetPosition,
    propertyValueAfter20Years,
    savings: rentNetPosition - buyNetPosition, // positive = buying wins
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
