"use client";

import { BillForm, Cadence, type BillFormValues } from "@/components/BillForm/BillForm";
import { BillsTable } from "@/components/BillsTable/BillsTable";
import { PageHeader } from "@/components/PageHeader/PageHeader";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
    createBill,
    deleteBill,
    listBills,
    updateBill,
    type BillRow,
} from "@/data/bills";
import { supabase } from "@/lib/supabase";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

export default function BillsContainer() {
  const [bills, setBills] = useState<BillRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [q, setQ] = useState("");
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editingBill, setEditingBill] = useState<BillRow | null>(null);

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setIsLoading(false);
        return;
      }
      try {
        const rows = await listBills();
        setBills(rows);
      } catch  {
        toast.error("Failed to load bills");
      } finally {
        setIsLoading(false);
      }
    }
    load();
  }, []);

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    if (!needle) return bills;
    return bills.filter((b) =>
      [b.name, b.merchant ?? "", b.category ?? ""]
        .join(" ")
        .toLowerCase()
        .includes(needle)
    );
  }, [bills, q]);

  const total30 = useMemo(() => {
    const now = Date.now();
    const cutoff = now + 30 * 86400000;
    return bills
      .filter((b) => {
        const t = new Date(b.next_due_at).getTime();
        return t >= now && t <= cutoff;
      })
      .reduce((s, b) => s + (b.amount ?? 0), 0);
  }, [bills]);

  async function handleCreate(values: BillFormValues) {
    try {
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
      setBills((prev) => [created, ...prev]);
      setIsCreateOpen(false);
      toast.success("Bill created", { description: created.name });
    } catch {
      toast.error("Failed to create bill");
    }
  }

  async function handleEdit(values: BillFormValues) {
    if (!editingBill) return;
    try {
      const updated = await updateBill(editingBill.id, {
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
      setBills((prev) => prev.map((b) => (b.id === updated.id ? updated : b)));
      setIsEditOpen(false);
      setEditingBill(null);
      toast.success("Bill updated", { description: updated.name });
    } catch  {
      toast.error("Failed to update bill");
    }
  }

  async function handleDelete(id: string) {
    try {
      await deleteBill(id);
      setBills((prev) => prev.filter((b) => b.id !== id));
      toast.success("Bill deleted");
    } catch  {
      toast.error("Failed to delete bill");
    }
  }

  function handleSortChange(key: "name" | "amount" | "nextDueAt") {
    setBills((prev) => {
      const copy = [...prev];
      copy.sort((a, b) => {
        if (key === "amount") return (a.amount ?? 0) - (b.amount ?? 0);
        if (key === "name") return a.name.localeCompare(b.name);
        return (
          new Date(a.next_due_at).getTime() -
          new Date(b.next_due_at).getTime()
        );
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
                <DialogTitle className="mb-4">New bill</DialogTitle>
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
            onEditBill={(bill) => {
              setEditingBill(bill);
              setIsEditOpen(true);
            }}
            onDeleteBill={handleDelete}
            onSortChange={handleSortChange}
          />
        </div>
      )}

      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Edit bill</DialogTitle>
          </DialogHeader>
          {editingBill && (
            <BillForm
              initialValues={{
                name: editingBill.name,
                merchant: editingBill.merchant ?? "",
                amount: editingBill.amount ?? 0,
                currency: editingBill.currency ?? "EUR",
                cadence: (editingBill.cadence as Cadence) ?? "monthly",
                intervalMonths: editingBill.interval_months ?? 1,
                nextDueAt: editingBill.next_due_at.slice(0, 10),
                category: editingBill.category ?? "",
                tags: editingBill.tags ?? [],
              }}
              submitLabel="Save changes"
              isSubmitting={false}
              onSubmit={handleEdit}
              onCancel={() => setIsEditOpen(false)}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
