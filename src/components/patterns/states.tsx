import { CircleAlert, Inbox, Lock } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

// The four states every list and page has (design-system.md section 4.9): empty, loading, error, no access.
// Each is designed, not a default.

function StateShell({
  icon,
  title,
  children,
  action,
  className,
}: {
  icon: React.ReactNode;
  title: string;
  children?: React.ReactNode;
  action?: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col items-center gap-3 rounded-lg border border-dashed px-6 py-10 text-center",
        className,
      )}
    >
      <div className="flex size-10 items-center justify-center rounded-full bg-surface-muted text-muted-foreground">
        {icon}
      </div>
      <div className="flex max-w-sm flex-col gap-1">
        <h2 className="text-md font-semibold">{title}</h2>
        {children ? (
          <p className="text-base text-muted-foreground">{children}</p>
        ) : null}
      </div>
      {action}
    </div>
  );
}

/** One line on what this place is for, and one primary action. */
export function EmptyState({
  title,
  description,
  action,
  className,
}: {
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}) {
  return (
    <StateShell
      icon={<Inbox className="size-5" aria-hidden="true" />}
      title={title}
      action={action}
      className={className}
    >
      {description}
    </StateShell>
  );
}

/** What happened in plain words, a Retry action, and a reference ID. */
export function ErrorState({
  title = "We couldn't load this",
  description,
  reference,
  action,
  className,
}: {
  title?: string;
  description: string;
  reference?: string;
  action?: React.ReactNode;
  className?: string;
}) {
  return (
    <StateShell
      icon={<CircleAlert className="size-5 text-danger" aria-hidden="true" />}
      title={title}
      action={action}
      className={className}
    >
      {description}
      {reference ? (
        <span className="mt-2 block text-xs">
          Reference: <code>{reference}</code>
        </span>
      ) : null}
    </StateShell>
  );
}

/** Never reveals whether the record exists. */
export function NoAccessState({ className }: { className?: string }) {
  return (
    <StateShell
      icon={<Lock className="size-5" aria-hidden="true" />}
      title="You don't have access to this page"
      className={className}
    >
      Ask an Admin if you need it.
    </StateShell>
  );
}

/** Skeleton rows shaped like a table or list. No full-page spinners. */
export function LoadingRows({
  rows = 5,
  className,
}: {
  rows?: number;
  className?: string;
}) {
  return (
    <div
      role="status"
      aria-label="Loading"
      className={cn("flex flex-col gap-2", className)}
    >
      {Array.from({ length: rows }, (_, i) => (
        <Skeleton key={i} className="h-10 w-full" />
      ))}
    </div>
  );
}
