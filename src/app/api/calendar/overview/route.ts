import { mockBills } from "@/data/mock";

export async function GET() {
  const now = new Date();
  const cutoff = new Date(now.getTime() + 30 * 86400000);
  const upcoming = mockBills.filter(
    (b) => new Date(b.nextDueAt) >= now && new Date(b.nextDueAt) <= cutoff,
  );
  const grouped = upcoming.reduce<Record<string, typeof upcoming>>((acc, b) => {
    const k = b.nextDueAt.slice(0, 10);
    (acc[k] ??= []).push(b);
    return acc;
  }, {});
  return Response.json({ grouped });
}
