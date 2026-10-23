import { describe, expect, it } from "vitest";
import { isForbiddenEnvFile, scanText } from "../../scripts/check-secrets.mjs";

// Fake secrets are assembled from pieces so this file never contains a real-looking secret itself.
const b64url = (value: object) =>
  Buffer.from(JSON.stringify(value)).toString("base64url");
const jwt = (role: string) =>
  [
    "eyJhbGciOiJIUzI1NiJ9",
    b64url({ iss: "supabase", role }),
    "signaturepart123",
  ].join(".");

// Variable names are assembled from pieces so the scanner does not flag this test file itself.
const DB_PASSWORD_NAME = ["SUPABASE", "DB", "PASSWORD"].join("_");
const SERVICE_ROLE_NAME = ["SUPABASE", "SERVICE", "ROLE", "KEY"].join("_");

describe("secret scanner", () => {
  it("blocks Supabase secret keys", () => {
    const line = `key = ${"sb_" + "secret_"}abcdefghijklmnop`;
    expect(scanText(line)).toEqual([{ rule: "Supabase secret key", line: 1 }]);
  });

  it("blocks service-role JWTs but allows public anon JWTs", () => {
    expect(scanText(`token=${jwt("service_role")}`)).toHaveLength(1);
    expect(scanText(`token=${jwt("anon")}`)).toHaveLength(0);
  });

  it("blocks database passwords and connection strings with passwords", () => {
    expect(scanText(`${DB_PASSWORD_NAME}=hunter2hunter2`)).toHaveLength(1);
    expect(
      scanText(
        `url = ${"postgresql"}://postgres:realpassword@db.example.com/postgres`,
      ),
    ).toHaveLength(1);
  });

  it("allows placeholders and empty values", () => {
    expect(scanText(`${SERVICE_ROLE_NAME}=`)).toHaveLength(0);
    expect(scanText(`${DB_PASSWORD_NAME}=`)).toHaveLength(0);
    expect(
      scanText("postgresql://postgres:[YOUR-PASSWORD]@db.example.com/postgres"),
    ).toHaveLength(0);
  });

  it("blocks every env file except .env.example", () => {
    expect(isForbiddenEnvFile(".env.local")).toBe(true);
    expect(isForbiddenEnvFile("apps/web/.env.production")).toBe(true);
    expect(isForbiddenEnvFile(".env.example")).toBe(false);
    expect(isForbiddenEnvFile("src/lib/env.ts")).toBe(false);
  });
});
