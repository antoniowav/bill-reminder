"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

export default function SignInPage() {
  const [email, setEmail] = useState("");
  const [pwd, setPwd] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();
  const redirect = useSearchParams().get("redirect") || "/bills";

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error } = await supabase.auth.signInWithPassword({ email, password: pwd });
    setLoading(false);

    if (error) return setError(error.message);

    router.replace(redirect);
  }

  return (
    <main className="container-page py-12 space-y-6">
      <h1 className="text-3xl font-semibold tracking-tight">Sign in</h1>

      <form onSubmit={onSubmit} className="panel space-y-4 max-w-md">
        <div className="space-y-1.5">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="pwd">Password</Label>
          <Input id="pwd" type="password" required value={pwd} onChange={(e) => setPwd(e.target.value)} />
        </div>

        {error && <p className="text-sm text-red-600">{error}</p>}

        <Button type="submit" disabled={loading}>
          {loading ? "Signing in…" : "Sign in"}
        </Button>

        <p className="text-sm text-neutral-500">
          No account?{" "}
          <Link href={`/sign-up?redirect=${encodeURIComponent(redirect)}`} className="underline">Create one</Link>
        </p>
      </form>
    </main>
  );
}
