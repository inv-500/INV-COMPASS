import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

// Guards docs/design-system.md section 2.2: "All text/background pairs must pass WCAG AA".
const css = readFileSync(
  path.resolve(import.meta.dirname, "../../src/app/globals.css"),
  "utf8",
);

function readTheme(selector: ":root" | ".dark") {
  const start = css.indexOf(`${selector} {`);
  const block = css.slice(start, css.indexOf("}", start));
  return Object.fromEntries(
    [...block.matchAll(/--([\w-]+):\s*(#[0-9a-f]{6})/gi)].map((m) => [
      m[1],
      m[2],
    ]),
  );
}

function luminance(hex: string) {
  const [r, g, b] = [1, 3, 5].map(
    (i) => parseInt(hex.slice(i, i + 2), 16) / 255,
  );
  const lin = (v: number) =>
    v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
  return 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
}

function contrast(a: string, b: string) {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
}

const statuses = ["success", "warning", "danger", "info", "neutral"] as const;

describe.each([":root", ".dark"] as const)(
  "%s theme meets WCAG AA",
  (selector) => {
    const t = readTheme(selector);

    it("has every token", () => {
      for (const name of [
        "bg",
        "surface",
        "surface-muted",
        "border",
        "border-strong",
        "border-input",
        "text",
        "accent",
        "on-accent",
      ]) {
        expect(t[name], name).toBeDefined();
      }
    });

    it("body and secondary text read on every surface (4.5:1)", () => {
      for (const bg of ["bg", "surface", "surface-muted", "accent-subtle"]) {
        expect(contrast(t.text, t[bg]), `text on ${bg}`).toBeGreaterThanOrEqual(
          4.5,
        );
      }
      for (const bg of ["bg", "surface", "surface-muted"]) {
        expect(
          contrast(t["text-secondary"], t[bg]),
          `text-secondary on ${bg}`,
        ).toBeGreaterThanOrEqual(4.5);
      }
    });

    it("accent works as link text and as button background (4.5:1)", () => {
      expect(contrast(t.accent, t.bg)).toBeGreaterThanOrEqual(4.5);
      expect(contrast(t.accent, t.surface)).toBeGreaterThanOrEqual(4.5);
      expect(contrast(t["on-accent"], t.accent)).toBeGreaterThanOrEqual(4.5);
      expect(
        contrast(t["on-accent"], t["accent-hover"]),
      ).toBeGreaterThanOrEqual(4.5);
    });

    it("status colours read on cards and on their own tint (4.5:1)", () => {
      for (const status of statuses) {
        expect(
          contrast(t[status], t.surface),
          `${status} on surface`,
        ).toBeGreaterThanOrEqual(4.5);
        expect(
          contrast(t[status], t[`${status}-subtle`]),
          `${status} on its tint`,
        ).toBeGreaterThanOrEqual(4.5);
      }
    });

    it("input borders are visible against the card (3:1 for UI boundaries)", () => {
      expect(contrast(t["border-input"], t.surface)).toBeGreaterThanOrEqual(3);
    });

    it("placeholder text is at least 3:1 (never used for essential information)", () => {
      expect(contrast(t["text-tertiary"], t.surface)).toBeGreaterThanOrEqual(3);
    });
  },
);
