import { cn } from "@/lib/utils";

// Loading states use skeletons shaped like the content, never full-page spinners.
function Skeleton({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="skeleton"
      aria-hidden="true"
      className={cn("animate-pulse rounded-md bg-surface-muted", className)}
      {...props}
    />
  );
}

export { Skeleton };
