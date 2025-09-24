"use client";

import * as DialogPrimitive from "@radix-ui/react-dialog";
import * as React from "react";

// tiny helper so we don't rely on a shared cn()
function cx(...c: Array<string | undefined>) {
  return c.filter(Boolean).join(" ");
}

export const Dialog = DialogPrimitive.Root;
export const DialogTrigger = DialogPrimitive.Trigger;
export const DialogClose = DialogPrimitive.Close;

export function DialogOverlay(
  props: React.ComponentProps<typeof DialogPrimitive.Overlay>
) {
  const { className, ...rest } = props;
  return (
    <DialogPrimitive.Overlay
      className={cx(
        "fixed inset-0 z-50 bg-black/40 backdrop-blur-[2px]",
        "data-[state=open]:animate-in data-[state=closed]:animate-out",
        "data-[state=open]:fade-in-0 data-[state=closed]:fade-out-0",
        className
      )}
      {...rest}
    />
  );
}

export function DialogContent(
  props: React.ComponentProps<typeof DialogPrimitive.Content>
) {
  const { className, children, ...rest } = props;
  return (
    <DialogPrimitive.Portal>
      <DialogOverlay />
      <DialogPrimitive.Content
        className={cx(
          "fixed left-1/2 top-1/2 z-50 grid w-full max-w-lg",
          "-translate-x-1/2 -translate-y-1/2 rounded-2xl border bg-white p-6 shadow-xl",
          "duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out",
          "data-[state=open]:zoom-in-95 data-[state=closed]:zoom-out-95",
          className
        )}
        {...rest}
      >
        {children}
      </DialogPrimitive.Content>
    </DialogPrimitive.Portal>
  );
}

export function DialogHeader(
  props: React.HTMLAttributes<HTMLDivElement>
) {
  const { className, ...rest } = props;
  return <div className={cx("flex flex-col space-y-1.5 text-left", className)} {...rest} />;
}

export function DialogTitle(
  props: React.ComponentProps<typeof DialogPrimitive.Title>
) {
  const { className, ...rest } = props;
  return (
    <DialogPrimitive.Title
      className={cx("text-base font-medium leading-none tracking-tight", className)}
      {...rest}
    />
  );
}

export const DialogDescription = DialogPrimitive.Description;
