import { parsePublicEnv } from "@/lib/env";

export type HealthResult = { ok: true } | { ok: false; reason: string };

/**
 * Asks the INV Compass project whether it is up. Calls the auth service's public health
 * endpoint, so it needs no tables and reads no data.
 */
export async function checkSupabaseHealth(
  raw: Record<string, string | undefined> = {
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY:
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
  },
  fetchImpl: typeof fetch = fetch,
): Promise<HealthResult> {
  let env;
  try {
    env = parsePublicEnv(raw);
  } catch (error) {
    return {
      ok: false,
      reason:
        error instanceof Error ? error.message : "The settings are not valid.",
    };
  }

  try {
    const response = await fetchImpl(
      `${env.NEXT_PUBLIC_SUPABASE_URL}/auth/v1/health`,
      {
        headers: { apikey: env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY },
        cache: "no-store",
        signal: AbortSignal.timeout(5000),
      },
    );
    if (response.ok) return { ok: true };
    if (response.status === 401 || response.status === 403) {
      return {
        ok: false,
        reason:
          "The database rejected the publishable key. Check NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY.",
      };
    }
    return {
      ok: false,
      reason: `The database answered with an error (${response.status}).`,
    };
  } catch {
    return { ok: false, reason: "We couldn't reach the database." };
  }
}
