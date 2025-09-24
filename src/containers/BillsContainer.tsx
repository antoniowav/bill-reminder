"use client";

import { BillForm, type BillFormValues } from "@/components/BillForm/BillForm";
import { BillsTable } from "@/components/BillsTable/BillsTable";
import { PageHeader } from "@/components/PageHeader/PageHeader";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { createBill, deleteBill, listBills, type BillRow } from "@/data/bills";
import { supabase } from "@/lib/supabase";
import { useEffect, useMemo, useState } from "react";

export default function BillsContainer() {
  const [bills, setBills] = useState<BillRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [q, setQ] = useState("");
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { setIsLoading(false); return; }
      const rows = await listBills();
      setBills(rows);
      setIsLoading(false);
    }
    load();
  }, []);

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    if (!needle) return bills;
    return bills.filter(b =>
      [b.name, b.merchant ?? "", b.category ?? ""].join(" ").toLowerCase().includes(needle)
    );
  }, [bills, q]);

  const total30 = useMemo(() => {
    const now = Date.now(), cutoff = now + 30 * 86400000;
    return bills
      .filter(b => {
        const t = new Date(b.next_due_at).getTime();
        return t >= now && t <= cutoff;
      })
      .reduce((s, b) => s + (b.amount ?? 0), 0);
  }, [bills]);

  async function handleCreate(values: BillFormValues) {
    const created = await createBill({
      name: values.name,
      merchant: values.merchant,
      amount: values.amount,
      currency: values.currency,
      cadence: values.cadence,
      interval_months: values.intervalMonths,
      next_due_at: values.nextDueAt.slice(0, 10),
      category: values.category,
      tags: values.tags,
    });
    setBills(prev => [created, ...prev]);
    setIsCreateOpen(false);
  }

  async function handleDelete(id: string) {
    await deleteBill(id);
    setBills(prev => prev.filter(b => b.id !== id));
  }

  function handleSortChange(key: "name" | "amount" | "nextDueAt") {
    setBills(prev => {
      const copy = [...prev];
      copy.sort((a, b) => {
        if (key === "amount") return (a.amount ?? 0) - (b.amount ?? 0);
        if (key === "name") return a.name.localeCompare(b.name);
        return new Date(a.next_due_at).getTime() - new Date(b.next_due_at).getTime();
      });
      return copy;
    });
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Bills"
        subtitle="Track subscriptions and invoices. We’ll nudge you before renewals."
        right={
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
        }
      />

      <div className="flex gap-3 items-center justify-between">
        <Input
          placeholder="Search by name, merchant, category…"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          className="max-w-md"
        />
        <div className="text-sm text-neutral-500">
          30-day total: <span className="font-medium">{total30.toFixed(2)}</span>
        </div>
      </div>

      {isLoading ? (
        <div className="panel">Loading…</div>
      ) : bills.length === 0 ? (
        <div className="empty">
          <h3>No bills yet</h3>
          <p>Add your first subscription to get started.</p>
          <div className="mt-4">
            <Button onClick={() => setIsCreateOpen(true)}>New bill</Button>
          </div>
        </div>
      ) : (
        <div className="panel">
          <BillsTable
            bills={filtered}
            isLoading={false}
            onEditBill={() => {}}
            onDeleteBill={handleDelete}
            onSortChange={handleSortChange}
          />
        </div>
      )}
    </div>
  );
}
