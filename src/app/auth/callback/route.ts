// src/app/auth/callback/route.ts
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { NextResponse, type NextRequest } from "next/server";
import { cookies } from "next/headers";
import { createServerClient, type CookieOptions } from "@supabase/ssr";

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const code = url.searchParams.get("code");
  let next = url.searchParams.get("redirect") ?? "/bills";
  if (!next.startsWith("/")) next = "/bills";

  const cookieStore = await cookies();
  const cookieJar: { name: string; value: string; options: CookieOptions }[] = [];

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      // use the deprecated get/set/remove bridge (stable across runtimes)
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          cookieJar.push({ name, value, options });
        },
        remove(name: string, options: CookieOptions) {
          cookieJar.push({
            name,
            value: "",
            options: { ...options, maxAge: 0 },
          });
        },
      },
    },
  );

  const redirectTo = (pathname: string) => {
    const res = NextResponse.redirect(new URL(pathname, url.origin), {
      status: 302,
    });
    for (const { name, value, options } of cookieJar) {
      res.cookies.set({ name, value, ...options });
    }
    return res;
  };

  if (!code) return redirectTo(`/sign-in?error=${encodeURIComponent("Missing code")}`);

  const { error } = await supabase.auth.exchangeCodeForSession(code);
  if (error) return redirectTo(`/sign-in?error=${encodeURIComponent(error.message)}`);

  return redirectTo(next);
}
