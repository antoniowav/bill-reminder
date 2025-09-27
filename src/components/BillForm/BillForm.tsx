"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";

export type Cadence = "monthly" | "yearly" | "custom";

export type BillFormValues = {
  name: string;
  merchant?: string;
  amount: number;
  currency: string;
  cadence: Cadence;
  intervalMonths: number;
  nextDueAt: string; // ISO or YYYY-MM-DD
  category?: string;
  tags?: string[];
};

export interface BillFormProps {
  /** Preferred prop for editing/seed values */
  initialValues?: BillFormValues;
  /** Back-compat alias: lets callers pass defaultValues too */
  defaultValues?: BillFormValues;
  isSubmitting?: boolean;
  submitLabel?: string;
  onSubmit: (values: BillFormValues) => void | Promise<void>;
  onCancel: () => void;
}

export function BillForm({
  initialValues,
  defaultValues,
  isSubmitting = false,
  submitLabel,
  onSubmit,
  onCancel,
}: BillFormProps) {
  const seed: BillFormValues =
    initialValues ??
    defaultValues ?? {
      name: "",
      merchant: "",
      amount: 0,
      currency: "EUR",
      cadence: "monthly",
      intervalMonths: 1,
      nextDueAt: new Date().toISOString().slice(0, 10),
      category: "",
      tags: [],
    };

  const { register, handleSubmit, formState } = useForm<BillFormValues>({
    defaultValues: seed,
  });

  return (
    <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
      <div className="space-y-1.5">
        <Label htmlFor="name">Name</Label>
        <Input id="name" {...register("name", { required: true })} />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="merchant">Merchant</Label>
        <Input id="merchant" {...register("merchant")} />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <Label htmlFor="amount">Amount</Label>
          <Input id="amount" type="number" step="0.01" {...register("amount", { valueAsNumber: true })} />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="currency">Currency</Label>
          <Input id="currency" {...register("currency")} />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <div className="space-y-1.5">
          <Label htmlFor="cadence">Cadence</Label>
          <Input id="cadence" {...register("cadence")} />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="intervalMonths">Interval (months)</Label>
          <Input
            id="intervalMonths"
            type="number"
            {...register("intervalMonths", { valueAsNumber: true })}
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="nextDueAt">Next due</Label>
          <Input id="nextDueAt" type="date" {...register("nextDueAt")} />
        </div>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="category">Category</Label>
        <Input id="category" {...register("category")} />
      </div>

      {/* tags input could be a chips control; keep simple text for now */}
      <div className="flex gap-3 justify-end pt-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting || formState.isSubmitting}>
          {submitLabel ?? "Save"}
        </Button>
      </div>
    </form>
  );
}
