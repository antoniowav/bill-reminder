// src/app/(dashboard)/layout.tsx
import { DashboardNav } from "@/components/DashboardNav/DashboardNav";
import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      // Ensure the same encoding as the server helper/browser client to avoid
      // cookie parsing issues.
      cookieEncoding: "base64url",
      cookies: {
        getAll() {
          return cookieStore.getAll().map((c) => ({ name: c.name, value: c.value }));
        },
        setAll(
          cookiesToSet: Array<{ name: string; value: string; options: CookieOptions }>
        ) {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set({ name, value, ...options });
          });
        },
      },
    }
  );

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    redirect(`/sign-in?redirect=${encodeURIComponent("/bills")}`);
  }

  return (
    <div className="min-h-screen">
      <DashboardNav
        items={[
          { href: "/bills", label: "Bills" },
          { href: "/settings", label: "Settings" },
        ]}
      />
      <main className="container-page py-8 space-y-8">{children}</main>
    </div>
  );
}
