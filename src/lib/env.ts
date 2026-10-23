import { z } from "zod";
import { assertInvCompassUrl } from "@/lib/supabase/project";

const publicSchema = z.object({
  NEXT_PUBLIC_SUPABASE_URL: z.url({
    error: "is missing or is not a web address",
  }),
  NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: z
    .string()
    .min(1, { error: "is missing" }),
});

export type PublicEnv = z.infer<typeof publicSchema>;

/**
 * Checks the settings that are safe for the browser. Fails with a plain message that names
 * the setting but never prints the key.
 */
export function parsePublicEnv(
  raw: Record<string, string | undefined>,
): PublicEnv {
  const result = publicSchema.safeParse(raw);
  if (!result.success) {
    const problems = result.error.issues.map(
      (issue) => `${issue.path.join(".")} ${issue.message}`,
    );
    throw new Error(
      `INV Compass is missing settings: ${problems.join("; ")}. Copy .env.example to .env.local and fill it in.`,
    );
  }
  assertInvCompassUrl(result.data.NEXT_PUBLIC_SUPABASE_URL);
  return result.data;
}

/**
 * Next.js only inlines NEXT_PUBLIC_ values when they are written out in full like this,
 * so do not replace these lines with a loop.
 */
export function publicEnv(): PublicEnv {
  return parsePublicEnv({
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY:
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
  });
}
