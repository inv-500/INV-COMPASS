import { Suspense } from "react";
import {
  ConnectionStatus,
  ConnectionStatusSkeleton,
} from "@/components/patterns/connection-status";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function HomePage() {
  return (
    <main
      id="main"
      className="mx-auto flex min-h-dvh w-full max-w-3xl flex-col justify-center gap-6 p-4 md:p-6"
    >
      <header className="flex flex-col gap-1">
        <p className="text-xs text-muted-foreground">INV Home</p>
        <h1 className="text-lg font-semibold">INV Compass</h1>
        <p className="text-base text-muted-foreground">
          The internal operating system for INV Home. The foundation is in
          place; features arrive release by release.
        </p>
      </header>

      <Card>
        <CardHeader>
          <CardTitle>Foundation status</CardTitle>
          <CardDescription>
            Whether this app can reach its own database.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Suspense fallback={<ConnectionStatusSkeleton />}>
            <ConnectionStatus />
          </Suspense>
        </CardContent>
      </Card>
    </main>
  );
}
