"use client";

import { Button } from "@/components/ui/button";

// Error state: what happened in plain words, a Retry action, and a reference ID.
export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main
      id="main"
      className="mx-auto flex min-h-dvh w-full max-w-md flex-col justify-center gap-4 p-4 md:p-6"
    >
      <h1 className="text-lg font-semibold">We couldn&apos;t load this page</h1>
      <p className="text-base text-muted-foreground">
        Something went wrong on our side. Try again. If it keeps happening, tell
        your Admin and share the reference below.
      </p>
      {error.digest ? (
        <p className="text-xs text-muted-foreground">
          Reference: <code>{error.digest}</code>
        </p>
      ) : null}
      <div>
        <Button onClick={reset}>Try again</Button>
      </div>
    </main>
  );
}
