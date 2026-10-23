"use client";

import * as React from "react";
import { Dialog as DialogPrimitive } from "radix-ui";
import { cva, type VariantProps } from "class-variance-authority";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

// A panel that slides in from an edge: the phone menu ("More") and, later, the record panel.
const Sheet = DialogPrimitive.Root;
const SheetTrigger = DialogPrimitive.Trigger;
const SheetClose = DialogPrimitive.Close;
const SheetTitle = DialogPrimitive.Title;
const SheetDescription = DialogPrimitive.Description;

const sheetVariants = cva(
  "fixed z-50 flex flex-col gap-3 border bg-card text-card-foreground shadow-lg data-[state=closed]:animate-out data-[state=open]:animate-in",
  {
    variants: {
      side: {
        left: "inset-y-0 left-0 w-72 max-w-[85vw] border-r data-[state=closed]:slide-out-to-left-4 data-[state=open]:slide-in-from-left-4",
        right:
          "inset-y-0 right-0 w-full max-w-xl border-l data-[state=closed]:slide-out-to-right-4 data-[state=open]:slide-in-from-right-4",
        bottom:
          "inset-x-0 bottom-0 max-h-[85dvh] rounded-t-xl border-t data-[state=closed]:slide-out-to-bottom-4 data-[state=open]:slide-in-from-bottom-4",
      },
    },
    defaultVariants: { side: "left" },
  },
);

function SheetContent({
  className,
  children,
  side,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Content> &
  VariantProps<typeof sheetVariants>) {
  return (
    <DialogPrimitive.Portal>
      <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-black/40 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:animate-in data-[state=open]:fade-in-0" />
      <DialogPrimitive.Content
        data-slot="sheet-content"
        className={cn(sheetVariants({ side }), className)}
        {...props}
      >
        {children}
        <DialogPrimitive.Close
          className="absolute top-3 right-3 inline-flex size-8 items-center justify-center rounded-md text-muted-foreground hover:bg-accent pointer-coarse:size-11"
          aria-label="Close"
        >
          <X className="size-4" aria-hidden="true" />
        </DialogPrimitive.Close>
      </DialogPrimitive.Content>
    </DialogPrimitive.Portal>
  );
}

export {
  Sheet,
  SheetTrigger,
  SheetClose,
  SheetContent,
  SheetTitle,
  SheetDescription,
};
