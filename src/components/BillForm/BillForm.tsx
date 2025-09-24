'use client';

import { Cadence } from '@/shared/types/billing';

export interface BillFormValues {
  name: string;
  merchant?: string;
  amount: number;
  currency: string;
  cadence: Cadence;
  intervalMonths: number;
  nextDueAt: string;   // ISO or yyyy-mm-dd
  category?: string;
  tags?: string[];
}

export interface BillFormProps {
  initial?: BillFormValues;
  isSubmitting: boolean;
  onSubmit: (values: BillFormValues) => void; // <-- no undefined
  onCancel: () => void;
}

export function BillForm({ initial, isSubmitting, onSubmit, onCancel }: BillFormProps) {
  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);

    const values: BillFormValues = {
      name: String(form.get('name') ?? ''),
      merchant: String(form.get('merchant') ?? ''),
      amount: Number(form.get('amount') ?? 0),
      currency: String(form.get('currency') ?? 'EUR'),
      cadence: (form.get('cadence') ?? 'monthly') as Cadence,
      intervalMonths: Number(form.get('intervalMonths') ?? 1),
      nextDueAt: String(form.get('nextDueAt') ?? ''),
      category: String(form.get('category') ?? ''),
      tags: String(form.get('tags') ?? '')
        .split(',')
        .map(s => s.trim())
        .filter(Boolean),
    };

    onSubmit(values);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <input name="name" defaultValue={initial?.name} placeholder="Name" className="border rounded-md p-2" required />
        <input name="merchant" defaultValue={initial?.merchant} placeholder="Merchant" className="border rounded-md p-2" />
        <input name="amount" type="number" step="0.01" defaultValue={initial?.amount} placeholder="Amount" className="border rounded-md p-2" required />
        <input name="currency" defaultValue={initial?.currency ?? 'EUR'} placeholder="Currency" className="border rounded-md p-2" required />
        <select name="cadence" defaultValue={initial?.cadence ?? 'monthly'} className="border rounded-md p-2">
          <option value="monthly">Monthly</option>
          <option value="yearly">Yearly</option>
          <option value="custom">Custom</option>
        </select>
        <input name="intervalMonths" type="number" min={1} defaultValue={initial?.intervalMonths ?? 1} className="border rounded-md p-2" />
        <input name="nextDueAt" type="date" defaultValue={initial?.nextDueAt?.slice(0,10)} className="border rounded-md p-2" required />
        <input name="category" defaultValue={initial?.category} placeholder="Category" className="border rounded-md p-2" />
      </div>

      <input name="tags" defaultValue={initial?.tags?.join(', ')} placeholder="Tags (comma-separated)" className="border rounded-md p-2 w-full" />

      <div className="flex justify-end gap-3">
        <button type="button" onClick={onCancel} className="border rounded-md px-3 py-2">Cancel</button>
        <button type="submit" disabled={isSubmitting} className="rounded-md px-3 py-2 bg-black text-white">
          {isSubmitting ? 'Saving…' : 'Save'}
        </button>
      </div>
    </form>
  );
}
