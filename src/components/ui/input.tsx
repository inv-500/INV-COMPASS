import * as React from "react";
import { cn } from "@/lib/utils";

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "h-8 w-full min-w-0 rounded-md border border-input bg-card px-3 text-sm text-foreground transition-colors outline-none placeholder:text-subtle-foreground disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-danger pointer-coarse:h-11",
        className,
      )}
      {...props}
    />
  );
}

export { Input };
