import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import type { Bill } from "@/shared/types/billing";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
);

export async function GET() {
  const { data, error } = await supabase.from("bills").select("*");
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data, { status: 200 });
}

export async function POST(req: Request) {
  const body = (await req.json()) as Partial<Bill>;

  const toInsert = {
    name: body.name ?? "Untitled",
    merchant: body.merchant ?? null,
    amount: body.amount ?? 0,
    currency: body.currency ?? "EUR",
    cadence: body.cadence ?? "monthly",
    intervalMonths: body.intervalMonths ?? 1,
    nextDueAt: body.nextDueAt ?? new Date().toISOString(),
    category: body.category ?? null,
    tags: body.tags ?? [],
    source: "manual",
    confidence: body.confidence ?? null,
    userId: body.id!,
  };

  const { data, error } = await supabase.from("bills").insert(toInsert).select().single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json(data, { status: 201 });
}
