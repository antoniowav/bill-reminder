import type { Bill } from "@/shared/types/billing";

export const mockBills: Bill[] = [
  {
    id: "b1",
    name: "Figma",
    merchant: "Figma",
    amount: 12.0,
    currency: "EUR",
    cadence: "monthly",
    intervalMonths: 1,
    nextDueAt: new Date(Date.now() + 3 * 86400000).toISOString(),
    category: "SaaS",
    source: "manual",
  },
  {
    id: "b2",
    name: "Netlify",
    merchant: "Netlify",
    amount: 19.0,
    currency: "EUR",
    cadence: "monthly",
    intervalMonths: 1,
    nextDueAt: new Date(Date.now() + 10 * 86400000).toISOString(),
    category: "SaaS",
    source: "manual",
  },
];
