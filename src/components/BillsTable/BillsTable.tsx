'use client';

import { Bill } from '@/shared/types/billing';

export interface BillsTableProps {
  bills: Bill[];
  isLoading: boolean;
  onEditBill: (billId: string) => void;
  onDeleteBill: (billId: string) => void;
  onSortChange: (key: 'name' | 'amount' | 'nextDueAt') => void;
  onRowClick?: (billId: string) => void;
}

export function BillsTable({
  bills,
  isLoading,
  onEditBill,
  onDeleteBill,
  onSortChange,
  onRowClick,
}: BillsTableProps) {
  function handleSort(key: 'name' | 'amount' | 'nextDueAt') {
    onSortChange(key);
  }

  function handleRowClick(id: string) {
    onRowClick?.(id);
  }

  if (isLoading) {
    return <div className="p-4 text-sm text-muted-foreground">Loading…</div>;
  }

  return (
    <div className="panel">
      <table className="table">
        <thead className="bg-muted/50">
          <tr>
            <th className="p-3 text-left cursor-pointer" onClick={() => handleSort('name')}>Name</th>
            <th className="p-3 text-left">Merchant</th>
            <th className="p-3 text-left cursor-pointer" onClick={() => handleSort('amount')}>Amount</th>
            <th className="p-3 text-left">Cadence</th>
            <th className="p-3 text-left cursor-pointer" onClick={() => handleSort('nextDueAt')}>Next due</th>
            <th className="p-3 text-left">Category</th>
            <th className="p-3 text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
              {bills.map(b => (
                <tr key={b.id} className="border-t hover:bg-muted/40 transition">
              <td className="p-3 cursor-pointer" onClick={() => handleRowClick(b.id)}>{b.name}</td>
              <td className="p-3">{b.merchant ?? '—'}</td>
              <td className="p-3">{b.amount} {b.currency}</td>
              <td className="p-3">
                {b.cadence}{b.cadence === 'custom' ? ` / ${b.intervalMonths}m` : ''}
              </td>
              <td className="p-3">{new Date(b.nextDueAt).toLocaleDateString()}</td>
              <td className="p-3">{b.category ?? '—'}</td>
              <td className="p-3 text-right">
                <button className="underline mr-3" onClick={() => onEditBill(b.id)}>Edit</button>
                <button className="text-red-600 underline" onClick={() => onDeleteBill(b.id)}>Delete</button>
              </td>
            </tr>
          ))}
          {bills.length === 0 && (
            <tr>
              <td className="p-4 text-muted-foreground" colSpan={7}>No bills.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
