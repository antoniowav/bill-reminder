import { getServerSupabase } from "@/lib/supabaseServer";
import { redirect } from "next/navigation";

export default async function Home() {
  const supabase = await getServerSupabase();

  const {
    data: { session },
  } = await supabase.auth.getSession();

  redirect(session ? "/bills" : "/sign-in");
}
