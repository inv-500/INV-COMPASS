import "server-only";
import { createClient } from "@supabase/supabase-js";
import { serviceRoleKey } from "@/lib/env.server";
import { publicEnv } from "@/lib/env";

/**
 * Supabase client that BYPASSES row-level security. Server-only.
 * Import it only from src/server (inviting users, admin maintenance), never from a component,
 * and never use it for search, exports or notifications.
 */
export function createAdminClient() {
  return createClient(publicEnv().NEXT_PUBLIC_SUPABASE_URL, serviceRoleKey(), {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
