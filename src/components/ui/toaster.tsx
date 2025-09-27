"use client";

import { Toaster as SonnerToaster } from "sonner";

/**
 * shadcn-style Toaster that uses Sonner under the hood.
 * Add once in root layout and call `toast(...)` anywhere.
 */
export function Toaster() {
  return (
    <SonnerToaster
      position="top-right"
      richColors
      closeButton
      duration={3200}
    />
  );
}
