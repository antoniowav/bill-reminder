"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Cadence } from "@/shared/types/billing";

export interface BillFormValues {
  name: string;
  merchant?: string;
  amount: number;
  currency: string;
  cadence: Cadence;
  intervalMonths: number;
  nextDueAt: string; // yyyy-mm-dd or ISO
  category?: string;
  tags?: string[];
}

export interface BillFormProps {
  initial?: BillFormValues;
  isSubmitting: boolean;
  onSubmit: (values: BillFormValues) => void;
  onCancel: () => void;
}

export function BillForm({ initial, isSubmitting, onSubmit, onCancel }: BillFormProps) {
  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);

    const values: BillFormValues = {
      name: String(form.get("name") ?? ""),
      merchant: String(form.get("merchant") ?? ""),
      amount: Number(form.get("amount") ?? 0),
      currency: String(form.get("currency") ?? "EUR"),
      cadence: (form.get("cadence") ?? "monthly") as Cadence,
      intervalMonths: Number(form.get("intervalMonths") ?? 1),
      nextDueAt: String(form.get("nextDueAt") ?? ""),
      category: String(form.get("category") ?? ""),
      tags: String(form.get("tags") ?? "")
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
    };

    onSubmit(values);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <Label htmlFor="name">Name</Label>
          <Input id="name" name="name" defaultValue={initial?.name} placeholder="Name" required />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="merchant">Merchant</Label>
          <Input id="merchant" name="merchant" defaultValue={initial?.merchant} placeholder="Merchant" />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="amount">Amount</Label>
          <Input id="amount" name="amount" type="number" step="0.01" defaultValue={initial?.amount} placeholder="Amount" required />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="currency">Currency</Label>
          <Input id="currency" name="currency" defaultValue={initial?.currency ?? "EUR"} placeholder="EUR" required />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="cadence">Cadence</Label>
          <select
            id="cadence"
            name="cadence"
            defaultValue={initial?.cadence ?? "monthly"}
            className="input select w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm focus:border-neutral-400 focus:ring-2 focus:ring-neutral-200"
          >
            <option value="monthly">Monthly</option>
            <option value="yearly">Yearly</option>
            <option value="custom">Custom</option>
          </select>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="intervalMonths">Interval (months)</Label>
          <Input id="intervalMonths" name="intervalMonths" type="number" min={1} defaultValue={initial?.intervalMonths ?? 1} />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="nextDueAt">Next due</Label>
          <Input id="nextDueAt" name="nextDueAt" type="date" defaultValue={initial?.nextDueAt?.slice(0, 10)} required />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="category">Category</Label>
          <Input id="category" name="category" defaultValue={initial?.category} placeholder="SaaS" />
        </div>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="tags">Tags</Label>
        <Input id="tags" name="tags" defaultValue={initial?.tags?.join(", ")} placeholder="comma, separated" />
      </div>

      <div className="flex justify-end gap-3 pt-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Saving…" : "Save"}
        </Button>
      </div>
    </form>
  );
}
