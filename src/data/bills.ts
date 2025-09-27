import { supabase } from "@/lib/supabase";

export type BillRow = {
  id: string;
  user_id: string;
  name: string;
  merchant: string | null;
  amount: number | null;
  currency: string | null;
  cadence: string | null;
  interval_months: number | null;
  next_due_at: string; // date (YYYY-MM-DD)
  category: string | null;
  tags: string[] | null;
  source: string | null;
  created_at: string;
};

export async function requireUserId(): Promise<string> {
  const { data, error } = await supabase.auth.getUser();
  if (error || !data.user) throw new Error("Not signed in");
  return data.user.id;
}

export async function listBills(): Promise<BillRow[]> {
  const userId = await requireUserId();
  const { data, error } = await supabase
    .from("bills")
    .select("*")
    .eq("user_id", userId)
    .order("next_due_at", { ascending: true });
  if (error) throw error;
  return data ?? [];
}

export async function createBill(input: {
  name: string;
  merchant?: string;
  amount: number;
  currency: string;
  cadence: "monthly" | "yearly" | "custom";
  interval_months: number;
  next_due_at: string; // "YYYY-MM-DD"
  category?: string;
  tags?: string[];
  source?: string;
}): Promise<BillRow> {
  const userId = await requireUserId();
  const { data, error } = await supabase
    .from("bills")
    .insert({
      user_id: userId,
      name: input.name,
      merchant: input.merchant ?? null,
      amount: input.amount,
      currency: input.currency,
      cadence: input.cadence,
      interval_months: input.interval_months,
      next_due_at: input.next_due_at,
      category: input.category ?? null,
      tags: input.tags ?? [],
      source: input.source ?? "manual",
    })
    .select()
    .single();

  if (error) throw error;
  return data!;
}

export async function deleteBill(id: string): Promise<void> {
  await requireUserId(); // ensures session
  const { error } = await supabase.from("bills").delete().eq("id", id);
  if (error) throw error;
}

export async function updateBill(id: string, updates: Partial<BillRow>): Promise<BillRow> {
  await requireUserId(); // ensures session
  const { data, error } = await supabase
    .from("bills")
    .update({
      name: updates.name,
      merchant: updates.merchant ?? null,
      amount: updates.amount,
      currency: updates.currency,
      cadence: updates.cadence,
      interval_months: updates.interval_months,
      next_due_at: updates.next_due_at,
      category: updates.category ?? null,
      tags: updates.tags ?? [],
      source: updates.source,
    })
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data!;
}
