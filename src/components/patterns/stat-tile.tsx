import { cn } from "@/lib/utils";

// A dashboard number that drives a decision. Lead with three to five of these, then a list of what needs action.
export function StatTile({
  label,
  value,
  hint,
  className,
}: {
  label: string;
  value: string;
  hint?: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col gap-1 rounded-lg border bg-card p-4",
        className,
      )}
    >
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="tnum text-2xl font-semibold">{value}</p>
      {hint ? <p className="text-xs text-muted-foreground">{hint}</p> : null}
    </div>
  );
}
