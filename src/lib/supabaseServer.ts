// server helper (no "use client")
import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { cookies } from "next/headers";

/**
 * Create a Supabase server client that reads/writes auth cookies using Next's
 * server `cookies()` API.
 *
 * This must be called from a server context (server component, route handler)
 * because it awaits `cookies()` and accesses request-scoped cookie storage.
 *
 * @returns A Supabase client instance configured to persist auth cookies via Next's cookie store.
 */
export async function getServerSupabase(): Promise<ReturnType<typeof createServerClient>> {
  const cookieStore = await cookies();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      // Use base64url to match the browser client helper and avoid cookie parsing issues.
      cookieEncoding: "base64url",
      cookies: {
        // Return an array of { name, value } as expected by the SSR helper.
        getAll() {
          return cookieStore.getAll().map((c) => ({ name: c.name, value: c.value }));
        },
        // Accept an array of cookies to set and persist them into Next's cookie store.
        setAll(cookiesToSet: Array<{ name: string; value: string; options: CookieOptions }>) {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set({ name, value, ...options });
          });
        },
      },
    },
  );

  return supabase;
}
