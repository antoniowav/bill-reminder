"use client";

import { supabase } from "@/lib/supabase";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function AuthCallbackPage() {
  const router = useRouter();
  const sp = useSearchParams();
  const redirect = sp.get("redirect") || "/bills";
  const [msg, setMsg] = useState("Finishing sign-in…");

  useEffect(() => {
    (async () => {
      const { error } = await supabase.auth.exchangeCodeForSession(window.location.href);
      if (error) {
        setMsg(`Sign-in failed: ${error.message}`);
        return;
      }
      setMsg("Signed in! Redirecting…");
      router.replace(redirect);
    })();
  }, [router, redirect]);

  return <main className="container-page py-12">{msg}</main>;
}
