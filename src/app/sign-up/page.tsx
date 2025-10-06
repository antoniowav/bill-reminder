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
      options: {
        emailRedirectTo: `${location.origin}/auth/callback?redirect=${encodeURIComponent(redirect)}`,
      },
    });

    setLoading(false);

    if (error) return setError(error.message);

    if (data.user && !data.session) {
      setNotice("Check your inbox to confirm your email, then return here to continue.");
      return;
    }

    router.replace(redirect);
  }

  function continueWithGoogle(prompt: "select_account" | "consent") {
    const redirectParam = new URLSearchParams(window.location.search).get("redirect") || "/bills";
    window.location.assign(
      `/auth/google?redirect=${encodeURIComponent(redirectParam)}&prompt=${prompt}`,
    );
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-neutral-50 px-4">
      <div className="w-full max-w-md space-y-8 rounded-lg bg-white p-8 shadow">
        <div className="text-center">
          <h1 className="text-3xl font-semibold tracking-tight">Create your account</h1>
          <p className="mt-2 text-sm text-neutral-500">Start tracking your bills in minutes</p>
        </div>

        <form onSubmit={onSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="pwd">Password</Label>
            <Input
              id="pwd"
              type="password"
              required
              value={pwd}
              onChange={(e) => setPwd(e.target.value)}
              autoComplete="new-password"
            />
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}
          {notice && <p className="text-sm text-neutral-600">{notice}</p>}

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Creating…" : "Create account"}
          </Button>
        </form>

        {/* Divider */}
        <div className="relative py-2">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-white px-2 text-neutral-500">or</span>
          </div>
        </div>

        {/* Google actions */}
        <div className="space-y-3">
          <Button
            type="button"
            variant="outline"
            className="w-full"
            onClick={() => continueWithGoogle("select_account")}
          >
            Continue with Google
          </Button>
        </div>

        <p className="text-center text-sm text-neutral-500">
          Already have an account?{" "}
          <Link href={`/sign-in?redirect=${encodeURIComponent(redirect)}`} className="underline">
            Sign in
          </Link>
        </p>
      </div>
    </main>
  );
}
