import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import {
  matrixCell,
  MODULES,
  permissionsFor,
  ROLES,
  type Action,
  type ModuleKey,
} from "@/lib/permissions/matrix";

// The referee for docs/permissions.md section 2: the matrix in code must be the matrix in the doc.
const doc = readFileSync(
  path.resolve(import.meta.dirname, "../../docs/permissions.md"),
  "utf8",
);

const ACTIONS: Action[] = [
  "view",
  "edit",
  "approve",
  "delete",
  "override_warn",
  "override_require",
];

function parseCell(cell: string): Action[] {
  const text = cell.replace(/\([^)]*\)/g, "").trim();
  if (text === "—") return [];
  return ACTIONS.filter((action) => new RegExp(`\\b${action}\\b`).test(text));
}

function parseDocMatrix() {
  const rows = new Map<string, Action[][]>();
  for (const line of doc.split("\n")) {
    const cells = line
      .split("|")
      .slice(1, -1)
      .map((c) => c.trim());
    const name = /^`([a-z_]+)`/.exec(cells[0] ?? "")?.[1];
    if (!name || cells.length !== 8) continue;
    rows.set(name, cells.slice(1).map(parseCell));
  }
  return rows;
}

describe("permission matrix matches docs/permissions.md", () => {
  const docRows = parseDocMatrix();

  it("has the same modules as the doc", () => {
    expect([...docRows.keys()].sort()).toEqual([...MODULES].sort());
  });

  it.each(MODULES)("%s", (moduleKey: ModuleKey) => {
    const expected = docRows.get(moduleKey)!;
    ROLES.forEach((role, index) => {
      const actual = [...matrixCell(moduleKey, role)].sort();
      expect(actual, `${moduleKey} / ${role}`).toEqual(
        [...expected[index]].sort(),
      );
    });
  });
});

describe("permissionsFor", () => {
  it("expands edit to include view", () => {
    const designer = permissionsFor("designer");
    expect(designer.has("docket.edit")).toBe(true);
    expect(designer.has("docket.view")).toBe(true);
  });

  it("keeps money away from everyone but the right roles", () => {
    expect(permissionsFor("admin").has("payments.view")).toBe(true);
    for (const role of ROLES.filter((r) => r !== "admin")) {
      expect(permissionsFor(role).has("payments.view"), role).toBe(false);
    }
    expect(permissionsFor("designer").has("cost_sheets.view")).toBe(false);
    expect(permissionsFor("procurement").has("cost_sheets.view")).toBe(true);
    expect(permissionsFor("factory").has("cost_sheets.view")).toBe(false);
    expect(permissionsFor("vendor_team").has("work_order_rates.view")).toBe(
      true,
    );
    expect(permissionsFor("procurement").has("work_order_rates.view")).toBe(
      true,
    );
  });

  it("lets only the Designer approve GFC drawings and only Procurement approve the BOQ", () => {
    for (const role of ROLES) {
      expect(permissionsFor(role).has("gfc_drawings.approve"), role).toBe(
        role === "designer",
      );
      expect(permissionsFor(role).has("boq.approve"), role).toBe(
        role === "procurement",
      );
    }
  });
});
