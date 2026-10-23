import Link from "next/link";
import { Button } from "@/components/ui/button";

// Says the same thing whether the page is missing or off limits, so it never reveals whether a record exists.
export default function NotFound() {
  return (
    <main
      id="main"
      className="mx-auto flex min-h-dvh w-full max-w-md flex-col justify-center gap-4 p-4 md:p-6"
    >
      <h1 className="text-lg font-semibold">We can&apos;t show this page</h1>
      <p className="text-base text-muted-foreground">
        It may not exist, or you may not have access. Ask an Admin if you think
        you should.
      </p>
      <div>
        <Button asChild>
          <Link href="/">Go to home</Link>
        </Button>
      </div>
    </main>
  );
}
