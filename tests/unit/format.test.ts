import { describe, expect, it } from "vitest";
import { formatDate, formatInr, formatRelative } from "@/lib/format";

describe("formatInr", () => {
  it("uses Indian grouping", () => {
    expect(formatInr(BigInt(123456700))).toBe("₹12,34,567");
    expect(formatInr(0)).toBe("₹0");
    expect(formatInr(BigInt(10000000))).toBe("₹1,00,000");
    expect(formatInr(BigInt(100000000000))).toBe("₹1,00,00,00,000");
  });

  it("shows paise only when there are some", () => {
    expect(formatInr(BigInt(4250075))).toBe("₹42,500.75");
    expect(formatInr(5)).toBe("₹0.05");
  });

  it("handles negative amounts and plain numbers", () => {
    expect(formatInr(-123456700)).toBe("−₹12,34,567");
    expect(formatInr(12345600)).toBe("₹1,23,456");
  });
});

describe("formatDate", () => {
  it("formats as 22 Oct 2026", () => {
    expect(formatDate("2026-10-22T10:00:00+05:30")).toBe("22 Oct 2026");
    expect(formatDate("2026-09-05T10:00:00+05:30")).toBe("5 Sep 2026");
  });

  it("uses Indian time, not UTC, for the calendar day", () => {
    // 20:00 UTC on 21 Oct is already 22 Oct, 01:30 in India.
    expect(formatDate("2026-10-21T20:00:00Z")).toBe("22 Oct 2026");
  });
});

describe("formatRelative", () => {
  const now = new Date("2026-10-23T10:00:00+05:30");
  const at = (ms: number) => new Date(now.getTime() + ms);
  const HOUR = 3_600_000;
  const DAY = 86_400_000;

  it("describes the last and next few hours", () => {
    expect(formatRelative(at(-10_000), now)).toBe("just now");
    expect(formatRelative(at(-5 * 60_000), now)).toBe("5 min ago");
    expect(formatRelative(at(-2 * HOUR), now)).toBe("2 h ago");
    expect(formatRelative(at(3 * HOUR), now)).toBe("in 3 h");
  });

  it("describes days", () => {
    expect(formatRelative(at(DAY), now)).toBe("tomorrow");
    expect(formatRelative(at(-DAY), now)).toBe("yesterday");
    expect(formatRelative(at(3 * DAY), now)).toBe("in 3 days");
    expect(formatRelative(at(-4 * DAY), now)).toBe("4 days ago");
  });

  it("falls back to the exact date after a week", () => {
    expect(formatRelative(at(30 * DAY), now)).toBe("22 Nov 2026");
  });
});
