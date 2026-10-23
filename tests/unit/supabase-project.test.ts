import { describe, expect, it } from "vitest";
import { parsePublicEnv } from "@/lib/env";
import {
  assertInvCompassUrl,
  BLOCKED_PROJECT_REFS,
  INV_COMPASS_PROJECT_REF,
  INV_COMPASS_URL,
  projectRefFromUrl,
} from "@/lib/supabase/project";

describe("project guard", () => {
  it("accepts the INV Compass project", () => {
    expect(() => assertInvCompassUrl(INV_COMPASS_URL)).not.toThrow();
    expect(projectRefFromUrl(INV_COMPASS_URL)).toBe(INV_COMPASS_PROJECT_REF);
  });

  it("refuses the Room Visualizer live database and says why", () => {
    expect(() =>
      assertInvCompassUrl("https://cblcahodlnreqgpasczp.supabase.co"),
    ).toThrow(/different product/);
  });

  it("refuses the old project that no longer exists", () => {
    expect(() =>
      assertInvCompassUrl("https://iecgesgytjnajutbbcjc.supabase.co"),
    ).toThrow(/no longer exists/);
  });

  it("refuses any other project, plain http, and look-alike addresses", () => {
    expect(() =>
      assertInvCompassUrl("https://someotherproject.supabase.co"),
    ).toThrow(/must be/);
    expect(() =>
      assertInvCompassUrl(INV_COMPASS_URL.replace("https", "http")),
    ).toThrow(/must be/);
    expect(() =>
      assertInvCompassUrl(
        `https://${INV_COMPASS_PROJECT_REF}.supabase.co.evil.com`,
      ),
    ).toThrow(/must be/);
    expect(() =>
      assertInvCompassUrl(
        `https://evil.com/${INV_COMPASS_PROJECT_REF}.supabase.co`,
      ),
    ).toThrow(/must be/);
    expect(() => assertInvCompassUrl("not a url")).toThrow(/must be/);
  });

  it("keeps the blocked list free of the allowed project", () => {
    expect(Object.keys(BLOCKED_PROJECT_REFS)).not.toContain(
      INV_COMPASS_PROJECT_REF,
    );
  });
});

describe("public env", () => {
  const good = {
    NEXT_PUBLIC_SUPABASE_URL: INV_COMPASS_URL,
    NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: "sb_publishable_example",
  };

  it("accepts correct settings", () => {
    expect(parsePublicEnv(good).NEXT_PUBLIC_SUPABASE_URL).toBe(INV_COMPASS_URL);
  });

  it("names missing settings in plain words", () => {
    expect(() => parsePublicEnv({})).toThrow(/NEXT_PUBLIC_SUPABASE_URL/);
    expect(() =>
      parsePublicEnv({ ...good, NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: "" }),
    ).toThrow(/NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY/);
  });

  it("never prints the key in an error", () => {
    const key = "sb_publishable_do_not_print_me";
    try {
      parsePublicEnv({
        NEXT_PUBLIC_SUPABASE_URL: "https://cblcahodlnreqgpasczp.supabase.co",
        NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: key,
      });
      expect.unreachable();
    } catch (error) {
      expect(String(error)).not.toContain(key);
    }
  });

  it("refuses the wrong project even when the key looks fine", () => {
    expect(() =>
      parsePublicEnv({
        ...good,
        NEXT_PUBLIC_SUPABASE_URL: "https://cblcahodlnreqgpasczp.supabase.co",
      }),
    ).toThrow(/never use/);
  });
});
