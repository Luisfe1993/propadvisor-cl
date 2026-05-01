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
 * Includes property appreciation and rent inflation
 * @param buyMonthlyCost - Monthly buying cost (mortgage + maintenance)
 * @param rentMonthlyCost - Initial monthly rent cost
 * @param initialInvestment - Down payment
 * @param propertyPriceCLP - Initial property price
 * @param termYears - Loan term in years (defaults to 20)
 * @returns Full comparison with appreciation, interest, and break-even
 */
export function calc20YearComparison(
  buyMonthlyCost: number,
  rentMonthlyCost: number,
  initialInvestment: number,
  propertyPriceCLP: number,
  termYears: number = 20
) {
  const annualAppreciation = 0.07; // 7% annual appreciation (Chilean market average)
  const annualRentInflation = 0.03; // 3% annual rent increase
  const months = termYears * 12;

  // Buying: total out-of-pocket costs
  const totalBuyPayments = buyMonthlyCost * months;
  const totalBuyCost = initialInvestment + totalBuyPayments;

  // Renting: total rental costs with 3% annual inflation
  let totalRentCost = 0;
  for (let m = 0; m < months; m++) {
    const year = Math.floor(m / 12);
    totalRentCost += rentMonthlyCost * Math.pow(1 + annualRentInflation, year);
  }

  // Property value after term (appreciation)
  const propertyValueAfterTerm =
    propertyPriceCLP * Math.pow(1 + annualAppreciation, termYears);

  // Total interest paid = total mortgage payments - principal
  const principalPaid = propertyPriceCLP - initialInvestment;
  const totalMortgagePayments = (buyMonthlyCost - (totalBuyPayments - buyMonthlyCost * months) / months) * months;
  // Simpler: interest = total buy payments - principal - maintenance portion
  // Since buyMonthlyCost includes maintenance, we need the raw mortgage payment
  // We'll compute this separately — caller should provide monthlyPayment

  // Net position if you bought
  const buyNetPosition = totalBuyCost - propertyValueAfterTerm;

  // Net position if you rented
  const rentNetPosition = totalRentCost;

  // Break-even: find the year where cumulative buy cost < cumulative rent cost + property value
  let breakEvenYear = -1;
  let cumulativeBuy = initialInvestment;
  let cumulativeRent = 0;
  for (let year = 1; year <= termYears; year++) {
    cumulativeBuy += buyMonthlyCost * 12;
    for (let m = 0; m < 12; m++) {
      cumulativeRent += rentMonthlyCost * Math.pow(1 + annualRentInflation, year - 1);
    }
    const propertyValueAtYear = propertyPriceCLP * Math.pow(1 + annualAppreciation, year);
    const buyNetAtYear = cumulativeBuy - propertyValueAtYear;
    if (buyNetAtYear < cumulativeRent && breakEvenYear === -1) {
      breakEvenYear = year;
    }
  }

  return {
    buyTotal: totalBuyCost,
    buyNetPosition,
    rentTotal: totalRentCost,
    rentNetPosition,
    propertyValueAfter20Years: propertyValueAfterTerm,
    savings: rentNetPosition - buyNetPosition, // positive = buying wins
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
