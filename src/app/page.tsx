import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function HomePage() {
  return (
    <main className="mx-auto max-w-5xl px-6 py-16">
      <section className="text-center space-y-6">
        <h1 className="text-4xl font-semibold tracking-tight">
          Never get blindsided by renewals.
        </h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Track subscriptions and bills, see the next 30 days at a glance, and get
          nudges before it hurts your cashflow.
        </p>
        <div className="flex justify-center gap-3">
          <Button asChild>
            <Link href="/bills">Open dashboard</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/settings">Settings</Link>
          </Button>
        </div>
      </section>

      <section className="mt-16 grid gap-6 sm:grid-cols-2">
        <Feature
          title="30-day calendar"
          description="Upcoming bills grouped by day with quick totals."
        />
        <Feature
          title="Smart reminders"
          description="Choose 3/7/14-day nudges; no more surprise charges."
        />
        <Feature
          title="Inbox assist (opt-in)"
          description="Scan receipts to prefill new bills. You confirm every item."
        />
        <Feature
          title="EU-friendly"
          description="Data minimised, export/delete controls, regional hosting."
        />
      </section>

      <footer className="mt-16 text-center text-sm text-muted-foreground">
        <span>DueNorth — © {new Date().getFullYear()}</span>
      </footer>
    </main>
  );
}

interface FeatureProps {
  title: string;
  description: string;
}

function Feature({ title, description }: FeatureProps) {
  return (
    <div className="rounded-xl border p-4">
      <h3 className="font-medium">{title}</h3>
      <p className="text-sm text-muted-foreground">{description}</p>
    </div>
  );
}
