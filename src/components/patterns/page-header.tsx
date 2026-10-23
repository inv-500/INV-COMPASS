import { cn } from "@/lib/utils";

// Page header: title, one line of key facts (stage, owner, due), and at most one primary action on the right.
export function PageHeader({
  title,
  meta,
  action,
  className,
}: {
  title: string;
  meta?: React.ReactNode;
  action?: React.ReactNode;
  className?: string;
}) {
  return (
    <header
      className={cn(
        "flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between",
        className,
      )}
    >
      <div className="flex min-w-0 flex-col gap-1">
        <h1 className="truncate text-lg font-semibold">{title}</h1>
        {meta ? (
          <p className="text-base text-muted-foreground">{meta}</p>
        ) : null}
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </header>
  );
}
