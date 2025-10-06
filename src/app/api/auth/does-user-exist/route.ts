// Force Node runtime so server secrets are available
export const runtime = "nodejs";

import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@supabase/supabase-js";

// tiny in-memory throttle
const hits = new Map<string, { count: number; ts: number }>();
function rateLimit(key: string, limit = 20, windowMs = 60_000) {
  const now = Date.now();
  const rec = hits.get(key);
  if (!rec || now - rec.ts > windowMs) {
    hits.set(key, { count: 1, ts: now });
    return false;
  }
  rec.count += 1;
  return rec.count > limit;
}

export async function POST(req: NextRequest) {
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip") ||
    "unknown";
  if (rateLimit(ip)) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  const { email } = await req.json().catch(() => ({ email: "" }));
  if (typeof email !== "string" || !email.includes("@")) {
    return NextResponse.json({ error: "Invalid email" }, { status: 400 });
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRole = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceRole) {
    return NextResponse.json(
      { error: "Missing SUPABASE env (URL or SERVICE_ROLE)", exists: false },
      { status: 500 },
    );
  }

  const admin = createClient(url, serviceRole, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  const emailLower = email.toLowerCase().trim();

  const { data: uData, error: uErr } = await admin
    .schema("auth")
    .from("users")
    .select("id")
    .eq("email", emailLower)
    .maybeSingle();

  if (uData?.id) {
    return NextResponse.json({ exists: true }, { status: 200 });
  }

  const { data: iData, error: iErr } = await admin
    .schema("auth")
    .from("identities")
    .select("id")
    .or(`identity_data->>email.eq.${emailLower}`)
    .limit(1);

  if (iData && iData.length > 0) {
    return NextResponse.json({ exists: true }, { status: 200 });
  }

  if (uErr || iErr) {
  }

  return NextResponse.json({ exists: false }, { status: 200 });
}
