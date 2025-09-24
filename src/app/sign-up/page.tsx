"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

export default function SignUpPage() {
  const [email, setEmail] = useState("");
  const [pwd, setPwd] = useState("");
  const [loading, setLoading] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();
  const redirect = useSearchParams().get("redirect") || "/bills";

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setNotice(null);

    const { data, error } = await supabase.auth.signUp({
      email,
      password: pwd,
      options: { emailRedirectTo: `${location.origin}/auth/callback` },
    });

    setLoading(false);

    if (error) return setError(error.message);

    // If email confirmations are ON, user must click email link.
    if (data.user && !data.session) {
      setNotice("Check your inbox to confirm your email, then come back.");
      return;
    }

    // If confirmations are OFF, we’re already signed in.
    router.replace(redirect);
  }

  return (
    <main className="container-page py-12 space-y-6">
      <h1 className="text-3xl font-semibold tracking-tight">Create your account</h1>

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
        {notice && <p className="text-sm text-neutral-600">{notice}</p>}

        <Button type="submit" disabled={loading}>
          {loading ? "Creating…" : "Create account"}
        </Button>

        <p className="text-sm text-neutral-500">
          Already have an account?{" "}
          <Link href={`/sign-in?redirect=${encodeURIComponent(redirect)}`} className="underline">Sign in</Link>
        </p>
      </form>
    </main>
  );
}
