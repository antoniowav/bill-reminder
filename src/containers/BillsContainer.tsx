"use client";

import { BillForm, type BillFormValues } from "@/components/BillForm/BillForm";
import { BillsTable } from "@/components/BillsTable/BillsTable";
import { KpiCard } from "@/components/KpiCard/KpiCard";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import type { Bill, Cadence } from "@/shared/types/billing";
import { useEffect, useMemo, useState } from "react";

export default function BillsContainer() {
  const [bills, setBills] = useState<Bill[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [sortKey, setSortKey] = useState<"name" | "amount" | "nextDueAt">("nextDueAt");
  const [q, setQ] = useState("");

  useEffect(() => {
    fetch("/api/bills").then((r) => r.json()).then(setBills).finally(() => setIsLoading(false));
  }, []);

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    if (!needle) return bills;
    return bills.filter(b =>
      [b.name, b.merchant, b.category].join(" ").toLowerCase().includes(needle)
    );
  }, [bills, q]);

  const sorted = useMemo(() => {
    return [...filtered].sort((a, b) => {
      if (sortKey === "amount") return a.amount - b.amount;
      if (sortKey === "name") return a.name.localeCompare(b.name);
      return new Date(a.nextDueAt).getTime() - new Date(b.nextDueAt).getTime();
    });
  }, [filtered, sortKey]);

  const total30 = useMemo(() => {
    const now = Date.now();
    const cutoff = now + 30 * 86400000;
    return bills
      .filter(b => {
        const t = new Date(b.nextDueAt).getTime();
        return t >= now && t <= cutoff;
      })
      .reduce((s, b) => s + b.amount, 0);
  }, [bills]);

  function handleSortChange(key: "name" | "amount" | "nextDueAt") {
    setSortKey(key);
  }

  function handleEditBill(id: string) { console.log("edit", id); }
  function handleDeleteBill(id: string) { setBills(prev => prev.filter(b => b.id !== id)); }

  function handleCreate(values: BillFormValues) {
    const created: Bill = {
      id: `b_${Math.random().toString(36).slice(2, 8)}`,
      name: values.name,
      merchant: values.merchant,
      amount: values.amount,
      currency: values.currency,
      cadence: values.cadence as Cadence,
      intervalMonths: values.intervalMonths,
      nextDueAt: values.nextDueAt,
      category: values.category,
      tags: values.tags,
      source: "manual",
    };
    setBills(prev => [created, ...prev]);
    setIsCreateOpen(false);
  }

  return (
    <div className="space-y-6">
      {/* KPIs */}
      <div className="grid gap-4 sm:grid-cols-3">
        <KpiCard label="Upcoming (30d)" value={`${total30.toFixed(2)} ${bills[0]?.currency ?? "EUR"}`} />
        <KpiCard label="Active bills" value={`${bills.length}`} />
        <KpiCard label="Next due" value={bills.length ? new Date([...bills].sort((a,b)=>new Date(a.nextDueAt).getTime()-new Date(b.nextDueAt).getTime())[0].nextDueAt).toLocaleDateString() : "—"} />
      </div>

      {/* Actions row */}
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
        <Input
          placeholder="Search by name, merchant, category…"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          className="max-w-md"
        />

        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setIsCreateOpen(true)}>New bill</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>New bill</DialogTitle>
            </DialogHeader>
            <BillForm isSubmitting={false} onSubmit={handleCreate} onCancel={() => setIsCreateOpen(false)} />
          </DialogContent>
        </Dialog>
      </div>

      {/* Table / Empty */}
      {sorted.length === 0 ? (
        <div className="empty">
          <h3>No bills match your search</h3>
          <p>Try clearing the search or add a new bill.</p>
          <div className="mt-4">
            <Button onClick={() => setIsCreateOpen(true)}>New bill</Button>
          </div>
        </div>
      ) : (
        <div className="panel">
          <BillsTable
            bills={sorted}
            isLoading={isLoading}
            onEditBill={handleEditBill}
            onDeleteBill={handleDeleteBill}
            onSortChange={handleSortChange}
          />
        </div>
      )}
    </div>
  );
}
