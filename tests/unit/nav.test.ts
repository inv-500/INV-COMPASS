import { describe, expect, it } from "vitest";
import { filterSections, resolveMobileTabs, roleNav } from "@/lib/nav/nav";
import {
  permissionsFor,
  ROLES,
  type PermissionKey,
  type Role,
} from "@/lib/permissions/matrix";

function menuFor(role: Role) {
  const granted = permissionsFor(role);
  const can = (key: PermissionKey) => granted.has(key);
  const nav = roleNav(role);
  return {
    can,
    nav,
    sections: filterSections(nav.sections, can),
    tabs: resolveMobileTabs(nav, can),
  };
}

describe.each(ROLES)("menu for %s", (role) => {
  const { can, sections, tabs, nav } = menuFor(role);
  const items = sections.flatMap((s) => s.items);

  it("only shows items the role has permission for", () => {
    for (const item of items) {
      expect(!item.requires || can(item.requires), item.label).toBe(true);
    }
  });

  it("starts with home, projects and my tasks", () => {
    expect(items.slice(0, 3).map((i) => i.id)).toEqual([
      "home",
      "projects",
      "tasks",
    ]);
  });

  it("has unique ids and a one-line purpose for every item", () => {
    const ids = items.map((i) => i.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const item of items)
      expect(item.purpose.length, item.id).toBeGreaterThan(10);
  });

  it("has a phone bar of at most four tabs plus More, all usable by the role", () => {
    expect(tabs.length).toBeGreaterThan(0);
    expect(tabs.length).toBeLessThanOrEqual(4);
    for (const tab of tabs)
      expect(!tab.requires || can(tab.requires), tab.id).toBe(true);
    expect(nav.mobileTabs.length).toBeLessThanOrEqual(4);
  });
});

describe("what each role does and does not see", () => {
  const ids = (role: Role) =>
    menuFor(role).sections.flatMap((s) => s.items.map((i) => i.id));

  it("keeps finance out of every menu except Admin and Procurement", () => {
    expect(ids("admin")).toContain("payments");
    expect(ids("procurement")).toContain("cost-sheets");
    for (const role of ROLES.filter((r) => r !== "admin")) {
      expect(ids(role), role).not.toContain("payments");
    }
    for (const role of ROLES.filter((r) => r !== "procurement")) {
      expect(ids(role), role).not.toContain("cost-sheets");
    }
  });

  it("gives the Designer the approvals and drawings, and GFC no release", () => {
    expect(ids("designer")).toEqual(
      expect.arrayContaining(["client-approvals", "drawings", "go-ahead"]),
    );
    expect(ids("gfc")).not.toContain("drawings");
  });

  it("matches the approved phone tabs for On-site and Factory", () => {
    expect(menuFor("onsite").tabs.map((t) => t.label)).toEqual([
      "Today",
      "Sites",
      "Scan",
      "Snags",
    ]);
    expect(menuFor("factory").tabs.map((t) => t.label)).toEqual([
      "Home",
      "Incoming",
      "Job cards",
      "QC checks",
    ]);
    expect(menuFor("designer").tabs.map((t) => t.label)).toEqual([
      "Home",
      "Projects",
      "My tasks",
      "Inbox",
    ]);
  });

  it("hides items when a permission is taken away (menu follows permissions, not the role name)", () => {
    const nav = roleNav("procurement");
    const without = filterSections(
      nav.sections,
      (key) => key !== "boq.approve",
    );
    expect(without.flatMap((s) => s.items).map((i) => i.id)).not.toContain(
      "boq-verification",
    );
  });
});
