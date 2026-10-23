#!/usr/bin/env node
// Blocks commits that contain secrets. lint-staged passes the staged file paths as arguments.
// Rules: Supabase secret keys, service-role JWTs, database passwords, and any .env file except .env.example.
import { existsSync, readFileSync } from "node:fs";
import { basename } from "node:path";
import { pathToFileURL } from "node:url";

const BINARY_EXTENSIONS =
  /\.(png|jpe?g|gif|webp|avif|ico|pdf|woff2?|ttf|otf|zip|mp4|mov)$/i;

/** @param {string} segment */
function decodeJwtPayload(segment) {
  try {
    const json = Buffer.from(
      segment.replace(/-/g, "+").replace(/_/g, "/"),
      "base64",
    ).toString("utf8");
    return JSON.parse(json);
  } catch {
    return null;
  }
}

/**
 * @param {string} text
 * @returns {{ rule: string, line: number }[]}
 */
export function scanText(text) {
  const findings = [];
  const lines = text.split("\n");
  lines.forEach((line, index) => {
    const lineNo = index + 1;
    if (/sb_secret_[A-Za-z0-9_-]{8,}/.test(line)) {
      findings.push({ rule: "Supabase secret key", line: lineNo });
    }
    for (const match of line.matchAll(
      /eyJ[\w-]{8,}\.([\w-]{8,})\.[\w-]{8,}/g,
    )) {
      const payload = decodeJwtPayload(match[1]);
      if (payload && payload.role === "service_role") {
        findings.push({ rule: "Supabase service-role key", line: lineNo });
      }
    }
    if (/postgres(?:ql)?:\/\/[^\s:@/]+:[^\s@/[<][^\s@/]*@/.test(line)) {
      findings.push({
        rule: "Database connection string with a password",
        line: lineNo,
      });
    }
    if (/SUPABASE_DB_PASSWORD\s*[=:]\s*['"]?[^\s'"]/.test(line)) {
      findings.push({ rule: "Database password", line: lineNo });
    }
    if (/SUPABASE_SERVICE_ROLE_KEY\s*[=:]\s*['"]?[^\s'"]/.test(line)) {
      findings.push({ rule: "Service-role key value", line: lineNo });
    }
  });
  return findings;
}

/** @param {string} path */
export function isForbiddenEnvFile(path) {
  const name = basename(path);
  return name.startsWith(".env") && name !== ".env.example";
}

function main() {
  const paths = process.argv.slice(2);
  let failed = false;
  for (const path of paths) {
    if (isForbiddenEnvFile(path)) {
      console.error(
        `Blocked: ${path} is an environment file. Only .env.example may be committed.`,
      );
      failed = true;
      continue;
    }
    if (!existsSync(path) || BINARY_EXTENSIONS.test(path)) continue;
    const buffer = readFileSync(path);
    if (buffer.includes(0)) continue;
    for (const finding of scanText(buffer.toString("utf8"))) {
      console.error(
        `Blocked: ${finding.rule} found in ${path}:${finding.line}. Remove it and add it in Vercel or Supabase settings instead.`,
      );
      failed = true;
    }
  }
  if (failed) process.exit(1);
}

if (
  process.argv[1] &&
  import.meta.url === pathToFileURL(process.argv[1]).href
) {
  main();
}
