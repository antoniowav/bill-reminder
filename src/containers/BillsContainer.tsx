'use client';

import { BillForm } from '@/components/BillForm/BillForm';
import { BillsTable } from '@/components/BillsTable/BillsTable';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import type { Bill, Cadence } from '@/shared/types/billing';
import { useEffect, useMemo, useState } from 'react';

export default function BillsContainer() {
  const [bills, setBills] = useState<Bill[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [sortKey, setSortKey] = useState<'name' | 'amount' | 'nextDueAt'>('nextDueAt');

  useEffect(() => {
    fetch('/api/bills')
      .then(r => r.json())
      .then(setBills)
      .finally(() => setIsLoading(false));
  }, []);

  const sorted = useMemo(() => {
    return [...bills].sort((a, b) => {
      if (sortKey === 'amount') return a.amount - b.amount;
      if (sortKey === 'name') return a.name.localeCompare(b.name);
      return new Date(a.nextDueAt).getTime() - new Date(b.nextDueAt).getTime();
    });
  }, [bills, sortKey]);

  function handleSortChange(key: 'name' | 'amount' | 'nextDueAt') {
    setSortKey(key);
  }

  function handleEditBill(id: string) {
    // you can open another dialog with BillForm prefilled
    console.log('edit', id);
  }

  function handleDeleteBill(id: string) {
    // replace with DELETE /api/bills later
    setBills(prev => prev.filter(b => b.id !== id));
  }

  function handleCreate(values: {
    name: string;
    merchant?: string;
    amount: number;
    currency: string;
    cadence: Cadence;
    intervalMonths: number;
    nextDueAt: string;
    category?: string;
    tags?: string[];
  }) {
    // replace with POST /api/bills later; optimistic add here
    const created: Bill = {
      id: `b_${Math.random().toString(36).slice(2, 8)}`,
      name: values.name,
      merchant: values.merchant,
      amount: values.amount,
      currency: values.currency,
      cadence: values.cadence,
      intervalMonths: values.intervalMonths,
      nextDueAt: values.nextDueAt,
      category: values.category,
      tags: values.tags,
      source: 'manual',
    };
    setBills(prev => [created, ...prev]);
    setIsCreateOpen(false);
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Bills</h1>
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setIsCreateOpen(true)}>New bill</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>New bill</DialogTitle>
            </DialogHeader>
            <BillForm
              isSubmitting={false}
              onSubmit={handleCreate}
              onCancel={() => setIsCreateOpen(false)}
            />
          </DialogContent>
        </Dialog>
      </div>

      <BillsTable
        bills={sorted}
        isLoading={isLoading}
        onEditBill={handleEditBill}
        onDeleteBill={handleDeleteBill}
        onSortChange={handleSortChange}
      />
    </div>
  );
}
