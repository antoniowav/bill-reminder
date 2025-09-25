"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/lib/supabase";
import { AnimatePresence, motion, useReducedMotion, type Transition } from "framer-motion";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

type Mode = "signin" | "signup";

export default function SignInPage() {
  const sp = useSearchParams();
  const router = useRouter();
  const prefersReducedMotion = useReducedMotion();

  const initialMode = (sp.get("mode") as Mode) === "signup" ? "signup" : "signin";
  const [mode, setMode] = useState<Mode>(initialMode);

  const [email, setEmail] = useState("");
  const [pwd, setPwd] = useState("");
  const [loading, setLoading] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const redirect = useMemo(() => sp.get("redirect") || "/bills", [sp]);

  useEffect(() => {
    const params = new URLSearchParams(sp.toString());
    params.set("mode", mode);
    router.replace(`/sign-in?${params.toString()}`);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode]);

  // swipe-up/down animation presets
  const dir = mode === "signup" ? 1 : -1;
  const baseTrans: Transition = prefersReducedMotion
    ? ({ duration: 0 } as unknown as Transition)
    : ({ type: "spring", stiffness: 260, damping: 30 } as unknown as Transition);

  const cardVariants = {
    initial: { opacity: 0, y: 12 * dir },
    animate: { opacity: 1, y: 0, transition: baseTrans },
    exit: { opacity: 0, y: -12 * dir, transition: { duration: 0.18 } },
  };
  const itemVariants = {
    initial: { opacity: 0, y: 12 * dir },
    animate: { opacity: 1, y: 0, transition: { ...baseTrans, delay: 0.02 } },
    exit: { opacity: 0, y: -12 * dir, transition: { duration: 0.14 } },
  };

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setNotice(null);

    if (mode === "signin") {
      const { error: err } = await supabase.auth.signInWithPassword({ email, password: pwd });
      setLoading(false);
      if (err) return setError(err.message);
      router.replace(redirect);
      return;
    }

    // --- SIGN UP FLOW ---
    // 1) Server-side existence check (service role)
    const existsResp = await fetch("/api/auth/does-user-exist", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    }).catch(() => null);

    let exists = false;
    if (existsResp?.ok) {
      const json = (await existsResp.json()) as { exists?: boolean };
      exists = Boolean(json.exists);
    }

    if (exists) {
      setLoading(false);
      setMode("signin");
      setNotice("An account with this email already exists. Please sign in instead.");
      return;
    }

    const { data, error: err } = await supabase.auth.signUp({
      email,
      password: pwd,
      options: { emailRedirectTo: `${location.origin}/auth/callback?redirect=/bills` }
    });
    setLoading(false);
    if (err) return setError(err.message);

    if (data.user && !data.session) {
      // Instead of only showing a notice, also navigate to the poller:
      router.replace(`/auth/wait?redirect=${encodeURIComponent(redirect)}`);
      return;
    }
    router.replace(redirect);
  }

  function continueWithGoogle(prompt: "select_account" | "consent") {
    const redirectParam = new URLSearchParams(window.location.search).get("redirect") || "/bills";
    window.location.assign(
      `/auth/google?redirect=${encodeURIComponent(redirectParam)}&prompt=${prompt}`
    );
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-neutral-50 px-4 overflow-hidden">
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={mode}
          className="w-full max-w-md rounded-lg bg-white p-8 shadow"
          variants={cardVariants}
          initial="initial"
          animate="animate"
          exit="exit"
        >
          <motion.div className="text-center mb-8" variants={itemVariants} initial="initial" animate="animate" exit="exit">
            {mode === "signin" ? (
              <>
                <h1 className="text-3xl font-semibold tracking-tight">Welcome back</h1>
                <p className="mt-2 text-sm text-neutral-500">Sign in to continue</p>
              </>
            ) : (
              <>
                <h1 className="text-3xl font-semibold tracking-tight">Create your account</h1>
                <p className="mt-2 text-sm text-neutral-500">Start tracking your bills in minutes</p>
              </>
            )}
          </motion.div>

          <motion.form
            onSubmit={onSubmit}
            className="space-y-4"
            variants={itemVariants}
            initial="initial"
            animate="animate"
            exit="exit"
          >
            <div className="space-y-1.5">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="pwd">Password</Label>
              <Input
                id="pwd"
                type="password"
                autoComplete={mode === "signin" ? "current-password" : "new-password"}
                required
                value={pwd}
                onChange={(e) => setPwd(e.target.value)}
              />
            </div>

            <AnimatePresence initial={false} mode="popLayout">
              {error && (
                <motion.p
                  key="error"
                  className="text-sm text-red-600"
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                >
                  {error}
                </motion.p>
              )}
              {notice && (
                <motion.p
                  key="notice"
                  className="text-sm text-neutral-600"
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                >
                  {notice}
                </motion.p>
              )}
            </AnimatePresence>

            <motion.div
              key={mode === "signin" ? "btn-submit-signin" : "btn-submit-signup"}
              variants={itemVariants}
              initial="initial"
              animate="animate"
              exit="exit"
            >
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? (mode === "signin" ? "Signing in…" : "Creating…") : mode === "signin" ? "Sign in with email" : "Create account"}
              </Button>
            </motion.div>
          </motion.form>

          <motion.div className="relative py-4" variants={itemVariants} initial="initial" animate="animate" exit="exit">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-2 text-neutral-500">or</span>
            </div>
          </motion.div>

          <motion.div variants={itemVariants} initial="initial" animate="animate" exit="exit">
            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={() => continueWithGoogle(mode === "signin" ? "select_account" : "consent")}
            >
              {mode === "signin" ? "Sign in with Google" : "Create account with Google"}
            </Button>
          </motion.div>

          <motion.div
            className="mt-6 text-center text-sm text-neutral-500"
            variants={itemVariants}
            initial="initial"
            animate="animate"
            exit="exit"
          >
            {mode === "signin" ? (
              <>
                No account?{" "}
                <button type="button" className="underline" onClick={() => setMode("signup")}>
                  Create one
                </button>
              </>
            ) : (
              <>
                Already have an account?{" "}
                <button type="button" className="underline" onClick={() => setMode("signin")}>
                  Sign in
                </button>
              </>
            )}
          </motion.div>

          <p className="sr-only">
            <Link href={`/sign-up?redirect=${encodeURIComponent(redirect)}`}>Sign up</Link>
          </p>
        </motion.div>
      </AnimatePresence>
    </main>
  );
}
