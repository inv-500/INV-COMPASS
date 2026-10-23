import { describe, expect, it, vi } from "vitest";
import { checkSupabaseHealth } from "@/lib/supabase/health";
import { INV_COMPASS_URL } from "@/lib/supabase/project";

const env = {
  NEXT_PUBLIC_SUPABASE_URL: INV_COMPASS_URL,
  NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: "sb_publishable_example",
};

const respond = (status: number) =>
  vi.fn().mockResolvedValue(new Response("{}", { status }));

describe("checkSupabaseHealth", () => {
  it("reports ok when the project answers", async () => {
    const fetchMock = respond(200);
    expect(await checkSupabaseHealth(env, fetchMock)).toEqual({ ok: true });
    expect(fetchMock.mock.calls[0][0]).toBe(
      `${INV_COMPASS_URL}/auth/v1/health`,
    );
  });

  it("explains a rejected key", async () => {
    const result = await checkSupabaseHealth(env, respond(401));
    expect(result).toMatchObject({ ok: false });
    expect(result.ok === false && result.reason).toMatch(/publishable key/);
  });

  it("explains an unreachable project in plain words", async () => {
    const result = await checkSupabaseHealth(
      env,
      vi.fn().mockRejectedValue(new Error("network down")),
    );
    expect(result.ok === false && result.reason).toBe(
      "We couldn't reach the database.",
    );
  });

  it("does not call the network when the settings point at another project", async () => {
    const fetchMock = respond(200);
    const result = await checkSupabaseHealth(
      {
        ...env,
        NEXT_PUBLIC_SUPABASE_URL: "https://cblcahodlnreqgpasczp.supabase.co",
      },
      fetchMock,
    );
    expect(result.ok).toBe(false);
    expect(fetchMock).not.toHaveBeenCalled();
  });
});
