import { neon } from "@neondatabase/serverless";

/**
 * Get a SQL query function connected to the Neon database.
 * Requires DATABASE_URL env var.
 */
export function getDb() {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL is not set");
  }
  return neon(process.env.DATABASE_URL);
}

/**
 * Initialize the database schema (creates tables if they don't exist).
 * Safe to call multiple times.
 */
export async function initDb() {
  const sql = getDb();
  await sql`
    CREATE TABLE IF NOT EXISTS saved_properties (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id TEXT NOT NULL,
      created_at TIMESTAMPTZ DEFAULT NOW(),
      updated_at TIMESTAMPTZ DEFAULT NOW(),

      -- Property label
      label TEXT NOT NULL DEFAULT '',

      -- Property basics
      city TEXT NOT NULL DEFAULT '',
      comuna TEXT NOT NULL DEFAULT '',
      price_uf NUMERIC NOT NULL DEFAULT 0,
      price_clp NUMERIC NOT NULL DEFAULT 0,
      monthly_rent NUMERIC NOT NULL DEFAULT 0,
      property_type TEXT NOT NULL DEFAULT '',

      -- Mortgage
      bank_name TEXT NOT NULL DEFAULT '',
      interest_rate NUMERIC NOT NULL DEFAULT 0,
      down_payment_pct NUMERIC NOT NULL DEFAULT 20,
      loan_term_years INTEGER NOT NULL DEFAULT 20,
      monthly_payment NUMERIC NOT NULL DEFAULT 0,
      monthly_costs NUMERIC NOT NULL DEFAULT 200000,

      -- Computed results (stored for dashboard speed)
      buy_net_wealth NUMERIC DEFAULT 0,
      rent_net_wealth NUMERIC DEFAULT 0,
      invest_net_wealth NUMERIC DEFAULT 0,
      net_monthly_flow NUMERIC DEFAULT 0,
      cap_rate NUMERIC DEFAULT 0,
      winner TEXT DEFAULT 'buy',

      -- Notes
      notes TEXT DEFAULT ''
    )
  `;

  await sql`
    CREATE INDEX IF NOT EXISTS idx_saved_properties_user
    ON saved_properties (user_id, created_at DESC)
  `;
}

/**
 * Saved property data shape
 */
export interface SavedProperty {
  id: string;
  user_id: string;
  created_at: string;
  updated_at: string;
  label: string;
  city: string;
  comuna: string;
  price_uf: number;
  price_clp: number;
  monthly_rent: number;
  property_type: string;
  bank_name: string;
  interest_rate: number;
  down_payment_pct: number;
  loan_term_years: number;
  monthly_payment: number;
  monthly_costs: number;
  buy_net_wealth: number;
  rent_net_wealth: number;
  invest_net_wealth: number;
  net_monthly_flow: number;
  cap_rate: number;
  winner: string;
  notes: string;
}
