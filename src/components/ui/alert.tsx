import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

// Inline banners for page-level messages. Colour is always paired with text (never colour alone).
const alertVariants = cva(
  "flex gap-3 rounded-lg border p-3 text-sm [&>svg]:mt-0.5 [&>svg]:size-4 [&>svg]:shrink-0",
  {
    variants: {
      variant: {
        neutral: "border-border bg-neutral-subtle text-neutral",
        info: "border-info/30 bg-info-subtle text-info",
        success: "border-success/30 bg-success-subtle text-success",
        warning: "border-warning/30 bg-warning-subtle text-warning",
        danger: "border-danger/30 bg-danger-subtle text-danger",
      },
    },
    defaultVariants: { variant: "neutral" },
  },
);

function Alert({
  className,
  variant,
  ...props
}: React.ComponentProps<"div"> & VariantProps<typeof alertVariants>) {
  return (
    <div
      data-slot="alert"
      role="alert"
      className={cn(alertVariants({ variant }), className)}
      {...props}
    />
  );
}

function AlertTitle({ className, ...props }: React.ComponentProps<"p">) {
  return (
    <p
      data-slot="alert-title"
      className={cn("font-medium", className)}
      {...props}
    />
  );
}

function AlertDescription({ className, ...props }: React.ComponentProps<"p">) {
  return (
    <p
      data-slot="alert-description"
      className={cn("text-sm", className)}
      {...props}
    />
  );
}

export { Alert, AlertTitle, AlertDescription };
