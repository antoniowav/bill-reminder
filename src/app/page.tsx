
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function HomePage() {
  return (
    <main className="mx-auto max-w-5xl px-6 py-20 space-y-12">
      <section className="text-center space-y-6">
        <h1 className="text-4xl md:text-5xl font-semibold tracking-tight">
          Never get blindsided by renewals.
        </h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          See the next 30 days at a glance. Get nudges before it hurts your cashflow.
        </p>
        <div className="flex justify-center gap-3">
          <Button asChild><Link href="/bills">Open dashboard</Link></Button>
          <Button asChild variant="outline"><Link href="/settings">Settings</Link></Button>
        </div>
      </section>

      <section className="grid gap-6 sm:grid-cols-2">
        <div className="card p-4">
          <h3 className="font-medium">30-day calendar</h3>
          <p className="text-sm text-muted-foreground">Upcoming bills grouped by day with quick totals.</p>
        </div>
        <div className="card p-4">
          <h3 className="font-medium">Smart reminders</h3>
          <p className="text-sm text-muted-foreground">Choose 3/7/14-day nudges; no more surprise charges.</p>
        </div>
      </section>
    </main>
  );
}
