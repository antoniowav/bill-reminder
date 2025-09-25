// src/app/auth/wait/page.tsx
"use client";

import { supabase } from "@/lib/supabase";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";

export default function AuthWait() {
  const sp = useSearchParams();
  const router = useRouter();

  const redirect = sp.get("redirect") || "/bills";
  const [status, setStatus] = useState("Waiting for confirmation…");
  const tries = useRef(0);

  useEffect(() => {
    let done = false;

    const check = async () => {
      tries.current += 1;
      const { data } = await supabase.auth.getSession();

      if (data.session) {
        if (!done) setStatus("Signed in — redirecting…");
        done = true;
        router.replace(redirect);
        return;
      }

      if (tries.current >= 60 && !done) {
        setStatus("Still not signed in. Open the email on this device, or refresh after confirming.");
        done = true;
      }
    };

    // run immediately, then every second until done
    check();
    const id = window.setInterval(() => {
      if (!done) void check();
      else window.clearInterval(id);
    }, 1000);

    return () => {
      done = true;
      window.clearInterval(id);
    };
  }, [redirect, router]);

  return (
    <main className="flex min-h-screen items-center justify-center bg-neutral-50 px-4">
      <div className="w-full max-w-md rounded-lg bg-white p-8 shadow">
        <h1 className="text-2xl font-semibold tracking-tight">Check your email</h1>
        <p className="mt-2 text-sm text-neutral-600">{status}</p>
        <p className="mt-4 text-sm text-neutral-500">
          Tip: To auto-redirect here, open the confirmation link in <b>this same browser</b> and device.
        </p>
      </div>
    </main>
  );
}
