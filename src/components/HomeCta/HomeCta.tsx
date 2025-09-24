"use client";

import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export interface HomeCtaProps {
  label: string;
}

export function HomeCta({ label }: HomeCtaProps) {
  function handleClick() {
    toast.success("Hello from Sonner!");
  }
  return <Button onClick={handleClick}>{label}</Button>;
}
