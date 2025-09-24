'use client';

import { BillsTable } from '@/components/BillsTable/BillsTable';
import type { Bill } from '@/shared/types/billing';
import { useEffect, useState } from 'react';

export default function BillsContainer() {
  const [bills, setBills] = useState<Bill[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch('/api/bills').then(r => r.json()).then(setBills).finally(() => setIsLoading(false));
  }, []);

  function handleEditBill(id: string) {
    // open your dialog with <BillForm />
    console.log('edit', id);
  }
  function handleDeleteBill(id: string) {
    // call DELETE when you implement it; for mock, filter locally
    setBills(prev => prev.filter(b => b.id !== id));
  }
  function handleSortChange(key: 'nextDueAt' | 'amount' | 'name') {
    setBills(prev => [...prev].sort((a, b) => String(a[key]).localeCompare(String(b[key]))));
  }

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold">Bills</h1>
      <BillsTable
        bills={bills}
        isLoading={isLoading}
        onEditBill={handleEditBill}
        onDeleteBill={handleDeleteBill}
        onSortChange={handleSortChange}
      />
    </div>
  );
}
