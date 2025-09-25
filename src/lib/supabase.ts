"use client";
import { createBrowserClient } from "@supabase/ssr";

export const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  {
    // Match what the server helpers write. Prevents "Failed to parse cookie string".
    // Supabase expects either "raw" or "base64url" — use "base64url" to match server helpers.
    cookieEncoding: "base64url",
  },
);
