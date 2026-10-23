import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

// Status is always shown as text in a pill, so colour is never the only signal (design-system.md section 2.2).
// The tones follow the status colour table: success, warning, danger, info, neutral.
const pillVariants = cva(
  "inline-flex h-5 items-center gap-1 rounded-full px-2 text-xs font-medium whitespace-nowrap",
  {
    variants: {
      tone: {
        success: "bg-success-subtle text-success",
        warning: "bg-warning-subtle text-warning",
        danger: "bg-danger-subtle text-danger",
        info: "bg-info-subtle text-info",
        neutral: "bg-neutral-subtle text-neutral",
      },
    },
    defaultVariants: { tone: "neutral" },
  },
);

export type StatusTone = NonNullable<VariantProps<typeof pillVariants>["tone"]>;

export function StatusPill({
  tone,
  className,
  children,
  ...props
}: React.ComponentProps<"span"> & VariantProps<typeof pillVariants>) {
  return (
    <span
      data-slot="status-pill"
      className={cn(pillVariants({ tone }), className)}
      {...props}
    >
      <span aria-hidden="true" className="size-1.5 rounded-full bg-current" />
      {children}
    </span>
  );
}
