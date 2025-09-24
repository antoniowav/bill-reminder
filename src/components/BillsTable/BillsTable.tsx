'use client';

import { Button } from "@/components/ui/button";
import type { BillRow } from "@/data/bills";

export interface BillsTableProps {
  bills: BillRow[];
  isLoading: boolean;
  onEditBill: (bill: BillRow) => void;
  onDeleteBill: (id: string) => void;
  onSortChange: (key: "name" | "amount" | "nextDueAt") => void;
}

const dateFmt = new Intl.DateTimeFormat(undefined, {
  year: "numeric",
  month: "short",
  day: "2-digit",
});

function formatAmount(amount: number | null | undefined, currency: string | null | undefined) {
  if (amount == null) return "—";
  const cur = currency || "EUR";
  try {
    return new Intl.NumberFormat(undefined, {
      style: "currency",
      currency: cur,
      maximumFractionDigits: 2,
    }).format(amount);
  } catch {
    return `${amount.toFixed(2)} ${cur}`;
  }
}

function renderCadence(cadence: string | null | undefined, interval_months: number | null | undefined) {
  if (!cadence) return "—";
  if (cadence === "custom") return `custom / ${interval_months ?? "?"}m`;
  return cadence; // "monthly" | "yearly"
}

export function BillsTable({
  bills,
  isLoading,
  onEditBill,
  onDeleteBill,
  onSortChange,
}: BillsTableProps) {
  function handleSort(key: "name" | "amount" | "nextDueAt") {
    onSortChange(key);
  }

  if (isLoading) {
    return <div className="p-4 text-sm text-neutral-500">Loading…</div>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="table">
        <thead>
          <tr>
            <th
              className="p-3 text-left cursor-pointer select-none"
              onClick={() => handleSort("name")}
              title="Sort by name"
            >
              Name
            </th>
            <th className="p-3 text-left">Merchant</th>
            <th
              className="p-3 text-left cursor-pointer select-none"
              onClick={() => handleSort("amount")}
              title="Sort by amount"
            >
              Amount
            </th>
            <th className="p-3 text-left">Cadence</th>
            <th
              className="p-3 text-left cursor-pointer select-none"
              onClick={() => handleSort("nextDueAt")}
              title="Sort by next due"
            >
              Next due
            </th>
            <th className="p-3 text-left">Category</th>
            <th className="p-3 text-right">Actions</th>
          </tr>
        </thead>

        <tbody>
          {bills.map((b) => {
            const nextDate = b.next_due_at ? new Date(b.next_due_at) : null;
            return (
              <tr key={b.id} className="border-t hover:bg-neutral-50 transition">
                <td className="p-3 font-medium">{b.name}</td>
                <td className="p-3">{b.merchant ?? "—"}</td>
                <td className="p-3">{formatAmount(b.amount ?? null, b.currency ?? null)}</td>
                <td className="p-3">{renderCadence(b.cadence, b.interval_months)}</td>
                <td className="p-3">
                  {nextDate ? dateFmt.format(nextDate) : "—"}
                </td>
                <td className="p-3">{b.category ?? "—"}</td>
                <td className="p-3 text-right">
                  <div className="inline-flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onEditBill(b)}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => onDeleteBill(b.id)}
                    >
                      Delete
                    </Button>
                  </div>
                </td>
              </tr>
            );
          })}

          {bills.length === 0 && (
            <tr>
              <td className="p-4 text-neutral-500" colSpan={7}>
                No bills.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
