"use client";

import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export interface DashboardNavProps {
  items: Array<{ href: string; label: string }>;
}

export function DashboardNav({ items }: DashboardNavProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [email, setEmail] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setEmail(data.user?.email ?? null));
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) =>
      setEmail(session?.user?.email ?? null)
    );
    return () => sub.subscription.unsubscribe();
  }, []);

  return (
    <nav className="sticky top-0 z-40 border-b bg-white/80 backdrop-blur">
      <div className="container-page flex items-center gap-4 py-3">
        <Link href="/" className="font-semibold tracking-tight">
          <span className="inline-flex items-center gap-2">
            <span className="size-2.5 rounded-full bg-primary shadow-[0_0_0_3px_rgba(79,70,229,.15)]" />
            DueNorth
          </span>
        </Link>

        <div className="flex items-center gap-1 text-sm">
          {items.map((i) => {
            const isActive = pathname === i.href;
            return (
              <Link
                key={i.href}
                href={i.href}
                className={`px-2.5 py-1.5 rounded-lg transition ${
                  isActive ? "bg-accent text-foreground shadow-sm" : "hover:bg-muted"
                }`}
              >
                {i.label}
              </Link>
            );
          })}
        </div>

        <div className="ml-auto flex items-center gap-3">
          {email ? (
            <>
              <span className="text-xs text-neutral-500 hidden sm:inline">{email}</span>
              <Button
                variant="outline"
                onClick={async () => {
                  await supabase.auth.signOut();
                  router.replace("/sign-in");
                }}
              >
                Sign out
              </Button>
            </>
          ) : (
            <Link href="/sign-in">
              <Button>Sign in</Button>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
