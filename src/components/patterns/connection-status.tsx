import { CircleCheck, TriangleAlert } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { checkSupabaseHealth } from "@/lib/supabase/health";

/** Tells the team whether the app can reach its INV Compass database. */
export async function ConnectionStatus() {
  const result = await checkSupabaseHealth();

  if (result.ok) {
    return (
      <Alert variant="success" role="status">
        <CircleCheck aria-hidden="true" />
        <AlertTitle>Connected to the INV Compass database</AlertTitle>
      </Alert>
    );
  }

  return (
    <Alert variant="danger">
      <TriangleAlert aria-hidden="true" />
      <div className="flex flex-col gap-1">
        <AlertTitle>
          We couldn&apos;t confirm the database connection
        </AlertTitle>
        <AlertDescription>{result.reason}</AlertDescription>
      </div>
    </Alert>
  );
}

export function ConnectionStatusSkeleton() {
  return (
    <div role="status" aria-label="Checking the database connection">
      <Skeleton className="h-11 w-full" />
    </div>
  );
}
