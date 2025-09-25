// src/app/auth/google/route.ts
import { NextResponse, type NextRequest } from "next/server";
import { cookies } from "next/headers";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";

export async function GET(req: NextRequest) {
  const prompt = req.nextUrl.searchParams.get("prompt") ?? "select_account";
  const redirect = req.nextUrl.searchParams.get("redirect") || "/bills";

  const cb = new URL("/auth/callback", req.url);
  cb.searchParams.set("redirect", redirect);

  const supabase = createRouteHandlerClient({ cookies });

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: cb.toString(),
      skipBrowserRedirect: true, // we perform the redirect
      queryParams: { prompt }, // forward prompt=select_account|consent
    },
  });

  if (error || !data?.url) {
    const url = new URL("/sign-in", req.url);
    if (error) url.searchParams.set("error", error.message);
    return NextResponse.redirect(url);
  }

  return NextResponse.redirect(data.url);
}
