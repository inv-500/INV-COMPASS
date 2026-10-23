import "server-only";

/**
 * The service-role key bypasses row-level security. It is read only here, only on the server,
 * and only for the small reviewed set of admin functions in src/server. Never import this file
 * from a component.
 */
export function serviceRoleKey(): string {
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!key) {
    throw new Error(
      "SUPABASE_SERVICE_ROLE_KEY is not set. Add it yourself in Vercel (Settings > Environment Variables) " +
        "or the cloud environment settings. Never paste it into chat.",
    );
  }
  return key;
}
