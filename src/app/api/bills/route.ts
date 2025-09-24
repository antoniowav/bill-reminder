import { mockBills } from "@/data/mock";
import type { Bill } from "@/shared/types/billing";

export async function GET() {
  return Response.json(mockBills);
}

export async function POST(req: Request) {
  const body = (await req.json()) as Partial<Bill>;
  const created: Bill = {
    id: `b${Math.random().toString(36).slice(2, 8)}`,
    name: body.name ?? "Untitled",
    merchant: body.merchant,
    amount: Number(body.amount ?? 0),
    currency: body.currency ?? "EUR",
    cadence: (body.cadence as Bill["cadence"]) ?? "monthly",
    intervalMonths: Number(body.intervalMonths ?? 1),
    nextDueAt: body.nextDueAt ?? new Date().toISOString(),
    category: body.category,
    tags: body.tags ?? [],
    source: "manual",
    confidence: body.confidence,
  };
  // Note: mock only—no persistence between requests
  mockBills.push(created);
  return Response.json(created, { status: 201 });
}
