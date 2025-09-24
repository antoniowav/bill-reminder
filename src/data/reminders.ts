import { supabase } from "@/lib/supabase";

export type ReminderSettingsRow = {
  user_id: string;
  offsets: number[];
  digest_dow: number;
  updated_at: string;
};

export async function getReminderSettings(): Promise<ReminderSettingsRow | null> {
  const { data: userRes } = await supabase.auth.getUser();
  const userId = userRes.user?.id;
  if (!userId) return null;

  const { data, error } = await supabase
    .from("reminder_settings")
    .select("*")
    .eq("user_id", userId)
    .single();

  if (error && error.code !== "PGRST116") throw error; // not found
  return data ?? null;
}

export async function upsertReminderSettings(offsets: number[], digestDow = 1) {
  const { data: userRes, error: uErr } = await supabase.auth.getUser();
  if (uErr || !userRes.user) throw uErr ?? new Error("Not signed in");
  const userId = userRes.user.id;

  const clean = Array.from(new Set(offsets.map(Number)))
    .filter((n) => n >= 1 && n <= 30)
    .sort((a, b) => a - b);

  const { data, error } = await supabase
    .from("reminder_settings")
    .upsert({ user_id: userId, offsets: clean, digest_dow: digestDow })
    .select()
    .single();

  if (error) throw error;
  return data!;
}
