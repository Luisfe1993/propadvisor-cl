// Financial calculations input
export interface MortgageCalcInput {
  propertyPriceCLP: number;
  downPaymentPct: number;
  loanTermYears: number;
  annualRatePct: number;
}

// Financial calculations output
export interface MortgageResults {
  downPaymentAmount: number;
  monthlyPayment: number;
  totalPayments: number;
  totalInterest: number;
  totalCost: number;
}

// Property data
export interface Property {
  id: string;
  address: string;
  neighborhood: string;
  city: "santiago" | "valparaiso" | "concepcion";
  priceUF: number;
  priceCLP: number;
  rooms: number;
  baths: number;
  type: "departamento" | "casa";
  estimatedMonthlyRentUF: number;
  estimatedMonthlyRentCLP: number;
  image: string;
  // Real-data enrichment fields (optional — not present on mock data)
  sourceUrl?: string;   // Link back to Portal Inmobiliario or original source
  m2?: number;          // Total covered area in square meters
  source?: "mock" | "mercadolibre"; // Where this listing came from
}

// Bank mortgage data
export interface BankRate {
  id: string;
  bank: string;
  shortName: string;
  rate: number; // base annual percentage (20% pie)
  rateLowPie: number; // rate for 10-19% pie (higher risk)
  rateHighPie: number; // rate for 30%+ pie (lower risk)
  minDownPayment: number; // percentage
  logoColor: string; // hex color for design
}

// UF API response
export interface UFResponse {
  value: number;
  date: string;
  source: "mindicador";
}

// Property search response
export interface PropertySearchResponse {
  properties: Property[];
  total: number;
  ufValue: number;
}

// Analysis scenarios
export interface ScenarioResult {
  name: string;
  initialInvestment: number;
  monthlyPayment: number;
  totalCost20Years: number;
  notes: string;
}
