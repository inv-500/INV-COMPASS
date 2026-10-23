/**
 * The only Supabase project this app may talk to. See "Supabase — strict rules" in CLAUDE.md.
 * Any other address is refused at startup, so a wrong setting can never reach another product's data.
 */
export const INV_COMPASS_PROJECT_REF = "qiitpirpnqaonnzmdmhc";

/** Projects that must never be used, with the reason shown in the error message. */
export const BLOCKED_PROJECT_REFS: Record<string, string> = {
  cblcahodlnreqgpasczp:
    "it is the live database of a different product (the Room Visualizer)",
  iecgesgytjnajutbbcjc: "it is an old project that no longer exists",
};

export const INV_COMPASS_URL = `https://${INV_COMPASS_PROJECT_REF}.supabase.co`;

/** Returns the project ref from a Supabase URL such as https://abc123.supabase.co, or null if it is not one. */
export function projectRefFromUrl(url: string): string | null {
  let parsed: URL;
  try {
    parsed = new URL(url);
  } catch {
    return null;
  }
  const match = /^([a-z0-9]+)\.supabase\.co$/.exec(parsed.hostname);
  return match ? match[1] : null;
}

/** Throws a plain-language error unless the URL is the INV Compass project. */
export function assertInvCompassUrl(url: string): void {
  const ref = projectRefFromUrl(url);
  if (ref && BLOCKED_PROJECT_REFS[ref]) {
    throw new Error(
      `NEXT_PUBLIC_SUPABASE_URL points at project ${ref}, which INV Compass must never use: ${BLOCKED_PROJECT_REFS[ref]}. ` +
        `Use ${INV_COMPASS_URL} instead.`,
    );
  }
  if (ref !== INV_COMPASS_PROJECT_REF || new URL(url).protocol !== "https:") {
    throw new Error(
      `NEXT_PUBLIC_SUPABASE_URL must be ${INV_COMPASS_URL} (the INV Compass project).`,
    );
  }
}
