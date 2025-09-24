export type Cadence = "monthly" | "yearly" | "custom";

export interface Bill {
  id: string;
  name: string;
  merchant?: string;
  amount: number;
  currency: string;
  cadence: Cadence;
  intervalMonths: number;
  nextDueAt: string; // ISO date
  category?: string;
  tags?: string[];
  source: "manual" | "email" | "bank";
  confidence?: number;
}
