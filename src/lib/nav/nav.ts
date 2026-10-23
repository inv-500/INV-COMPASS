import type { PermissionKey, Role } from "@/lib/permissions/matrix";

// Workspace-level menu items for each role (docs/design-system.md sections 3.1, 3.2 and 5; docs/roles-and-screens.md).
// Project-specific screens (Requirement, BOQ builder, Docket and so on) live in tabs on the project page, not here.
// Every item names the permission it needs. The menu is built from permissions, never from the role name,
// so "nothing visible that the role cannot use" holds even when an Admin edits the permission grid.

export type IconName =
  | "home"
  | "folder"
  | "list-checks"
  | "inbox"
  | "users"
  | "shield"
  | "settings"
  | "database"
  | "wallet"
  | "file-check"
  | "bar-chart"
  | "git-pull-request"
  | "activity"
  | "ruler"
  | "pencil-ruler"
  | "package"
  | "clipboard-list"
  | "receipt"
  | "boxes"
  | "truck"
  | "hammer"
  | "calendar"
  | "check-circle"
  | "sparkles"
  | "factory"
  | "scan"
  | "bug"
  | "wrench"
  | "map-pin"
  | "book-user";

export type NavItem = {
  id: string;
  label: string;
  /** The real route. Routes for most items are built in later releases. */
  href: string;
  icon: IconName;
  /** One line on what the place is for. Shown on the empty state while the screen is not built. */
  purpose: string;
  /** Permission needed to see the item. Must be set on every item: null means every signed-in person (only Home). */
  requires: PermissionKey | null;
};

export type NavSection = { label?: string; items: NavItem[] };

export type RoleNav = {
  sections: NavSection[];
  /** Ids shown in the phone bottom bar (up to 4). "More" is added after them. */
  mobileTabs: string[];
  /** Items that only appear in the phone bottom bar. */
  extras: NavItem[];
};

const BASE: Record<Role, string> = {
  admin: "/admin",
  designer: "/designer",
  gfc: "/gfc",
  procurement: "/procurement",
  vendor_team: "/vendor-team",
  factory: "/factory",
  onsite: "/site",
};

function common(role: Role, homeLabel = "Home", homePurpose?: string) {
  const home: NavItem = {
    id: "home",
    label: homeLabel,
    href: BASE[role],
    icon: "home",
    purpose: homePurpose ?? "What needs you now, in one place.",
    requires: null,
  };
  const projects: NavItem = {
    id: "projects",
    label: "Projects",
    href: "/projects",
    icon: "folder",
    purpose:
      "The projects you are a member of, with stage, tracks and next action.",
    requires: "projects.view",
  };
  const tasks: NavItem = {
    id: "tasks",
    label: "My tasks",
    href: "/tasks",
    icon: "list-checks",
    purpose: "Tasks assigned to you, assigned by you, and that you follow.",
    requires: "tasks.view",
  };
  return { home, projects, tasks };
}

export const INBOX: NavItem = {
  id: "inbox",
  label: "Inbox",
  href: "/inbox",
  icon: "inbox",
  purpose: "Mentions, replies, assignments and approvals waiting for you.",
  requires: "discussions.view",
};

function build(role: Role): RoleNav {
  const { home, projects, tasks } = common(role);
  const work: NavSection = { label: "Work", items: [home, projects, tasks] };
  const defaultTabs = ["home", "projects", "tasks", "inbox"];

  switch (role) {
    case "admin":
      return {
        sections: [
          {
            label: "Work",
            items: [
              {
                ...home,
                purpose:
                  "Blocked or delayed tracks, finance approvals to record, overrides this week.",
              },
              projects,
              tasks,
            ],
          },
          {
            label: "People and rules",
            items: [
              {
                id: "users",
                label: "Users",
                href: "/admin/users",
                icon: "users",
                purpose:
                  "People, roles, team leads and status. Invite, change role, deactivate.",
                requires: "users_roles.edit",
              },
              {
                id: "permissions",
                label: "Permissions",
                href: "/admin/permissions",
                icon: "shield",
                purpose:
                  "The role by module grid: view, edit, approve. Every change is recorded.",
                requires: "users_roles.edit",
              },
              {
                id: "settings",
                label: "Process settings",
                href: "/admin/settings",
                icon: "settings",
                purpose:
                  "Stages, sub-tasks, gates, status labels and thresholds.",
                requires: "settings.edit",
              },
              {
                id: "masters",
                label: "Masters",
                href: "/admin/masters",
                icon: "database",
                purpose: "Categories, materials, finishes, vendors and rates.",
                requires: "masters.edit",
              },
            ],
          },
          {
            label: "Money",
            items: [
              {
                id: "payments",
                label: "Payments",
                href: "/admin/payments",
                icon: "wallet",
                purpose:
                  "Milestones per project with amounts, due and received.",
                requires: "payments.view",
              },
              {
                id: "finance-approvals",
                label: "Finance approvals",
                href: "/admin/finance-approvals",
                icon: "file-check",
                purpose:
                  "Purchase orders waiting for a recorded finance approval.",
                requires: "external_approvals.edit",
              },
              {
                id: "reports",
                label: "Reports",
                href: "/admin/reports",
                icon: "bar-chart",
                purpose:
                  "Delay by stage, approval turnaround, cost against BOQ, margin.",
                requires: "financial_reports.view",
              },
            ],
          },
          {
            label: "Oversight",
            items: [
              {
                id: "variations",
                label: "Variations (to confirm)",
                href: "/admin/variations",
                icon: "git-pull-request",
                purpose:
                  "Changes after design freeze with cost and time impact.",
                requires: "variations.approve",
              },
              {
                id: "activity",
                label: "Activity",
                href: "/admin/activity",
                icon: "activity",
                purpose:
                  "Every sensitive change across the system, who did it and how.",
                requires: "system_activity.view",
              },
            ],
          },
        ],
        mobileTabs: defaultTabs,
        extras: [INBOX],
      };

    case "designer":
      return {
        sections: [
          work,
          {
            label: "My approvals",
            items: [
              {
                id: "client-approvals",
                label: "Client approvals",
                href: "/designer/approvals",
                icon: "file-check",
                purpose: "Every approval: what, version, sent, due and status.",
                requires: "approvals.edit",
              },
              {
                id: "drawings",
                label: "Drawings to approve",
                href: "/designer/drawings",
                icon: "pencil-ruler",
                purpose:
                  "GFC drawings waiting for your review. Approve, return, or release.",
                requires: "gfc_drawings.approve",
              },
              {
                id: "go-ahead",
                label: "Dispatch go-ahead",
                href: "/designer/dispatch",
                icon: "truck",
                purpose: "Dispatch batches waiting for your go-ahead.",
                requires: "dispatch.approve",
              },
              {
                id: "snags",
                label: "Snags and handover",
                href: "/designer/snags",
                icon: "bug",
                purpose: "Snags by room, re-inspection and handover.",
                requires: "snags_handover.approve",
              },
              {
                id: "variations",
                label: "Variations (to confirm)",
                href: "/designer/variations",
                icon: "git-pull-request",
                purpose:
                  "Changes after design freeze with cost and time impact.",
                requires: "variations.edit",
              },
            ],
          },
        ],
        mobileTabs: defaultTabs,
        extras: [INBOX],
      };

    case "gfc":
      return {
        sections: [
          {
            label: "Work",
            items: [
              {
                ...home,
                label: "GFC queue",
                purpose: "Items awaiting drawings, by project and due date.",
              },
              projects,
              tasks,
            ],
          },
          {
            label: "Drawings",
            items: [
              {
                id: "drawing-queue",
                label: "Drawing queue",
                href: "/gfc/queue",
                icon: "pencil-ruler",
                purpose:
                  "Drawings, BOM and engineering sheets in progress, passed to the Designer when complete.",
                requires: "gfc_drawings.edit",
              },
              {
                id: "measurements",
                label: "Final measurements",
                href: "/gfc/measurements",
                icon: "ruler",
                purpose: "Room-wise final dimensions and reference lines.",
                requires: "measurements.edit",
              },
            ],
          },
        ],
        mobileTabs: defaultTabs,
        extras: [INBOX],
      };

    case "procurement":
      return {
        sections: [
          work,
          {
            label: "Buying",
            items: [
              {
                id: "boq-verification",
                label: "BOQ to verify",
                href: "/procurement/boq-verification",
                icon: "clipboard-list",
                purpose:
                  "BOQs waiting on Procurement, with costing. Verify, approve or return.",
                requires: "boq.approve",
              },
              {
                id: "cost-sheets",
                label: "Cost sheets",
                href: "/procurement/cost-sheets",
                icon: "receipt",
                purpose:
                  "Cost sheet per project and track, uploaded to the ERP.",
                requires: "cost_sheets.edit",
              },
              {
                id: "po-register",
                label: "PO register",
                href: "/procurement/pos",
                icon: "file-check",
                purpose: "ERP PO number, file, status and who holds it.",
                requires: "procurement.edit",
              },
              {
                id: "finance-approvals",
                label: "Finance approvals",
                href: "/procurement/finance-approvals",
                icon: "wallet",
                purpose:
                  "POs awaiting finance approval. Request and record with proof.",
                requires: "external_approvals.edit",
              },
              {
                id: "goods-receipt",
                label: "Goods receipt",
                href: "/procurement/receipts",
                icon: "package",
                purpose: "Deliveries due and inspection results.",
                requires: "procurement.edit",
              },
              {
                id: "inventory",
                label: "Inventory",
                href: "/procurement/inventory",
                icon: "boxes",
                purpose:
                  "Stock by material and location, including client items held.",
                requires: "procurement.edit",
              },
              {
                id: "vendors",
                label: "Vendors",
                href: "/procurement/vendors",
                icon: "book-user",
                purpose: "Suppliers, categories, ratings and history.",
                requires: "masters.view",
              },
            ],
          },
        ],
        mobileTabs: defaultTabs,
        extras: [INBOX],
      };

    case "vendor_team":
      return {
        sections: [
          work,
          {
            label: "Vendor work",
            items: [
              {
                id: "work-packages",
                label: "Work packages",
                href: "/vendor-team/packages",
                icon: "package",
                purpose:
                  "Service items by project and room. Create and assign a vendor.",
                requires: "vendor_work.edit",
              },
              {
                id: "work-orders",
                label: "Work orders",
                href: "/vendor-team/work-orders",
                icon: "clipboard-list",
                purpose:
                  "Vendor, scope, linked PO number, milestones and dates.",
                requires: "vendor_work.edit",
              },
              {
                id: "schedule",
                label: "Vendor schedule",
                href: "/vendor-team/schedule",
                icon: "calendar",
                purpose: "Calendar by site and room. Book and reschedule.",
                requires: "vendor_work.edit",
              },
              {
                id: "progress",
                label: "Progress to verify",
                href: "/vendor-team/progress",
                icon: "check-circle",
                purpose: "Reported against verified work, with photos.",
                requires: "vendor_work.edit",
              },
              {
                id: "cleaning",
                label: "Deep cleaning",
                href: "/vendor-team/cleaning",
                icon: "sparkles",
                purpose: "Cleaning bookings and status per room.",
                requires: "vendor_work.edit",
              },
            ],
          },
        ],
        mobileTabs: defaultTabs,
        extras: [INBOX],
      };

    case "factory":
      return {
        sections: [
          work,
          {
            label: "Production",
            items: [
              {
                id: "incoming",
                label: "Incoming",
                href: "/factory/incoming",
                icon: "package",
                purpose:
                  "Items released by the Designer with drawing and BOM, and materials from Procurement.",
                requires: "production.edit",
              },
              {
                id: "production-orders",
                label: "Production orders",
                href: "/factory/orders",
                icon: "factory",
                purpose: "Received items, need-by date and material status.",
                requires: "production.edit",
              },
              {
                id: "job-cards",
                label: "Job cards",
                href: "/factory/job-cards",
                icon: "wrench",
                purpose: "Drawing, BOM and the current step for each item.",
                requires: "production.edit",
              },
              {
                id: "qc",
                label: "QC checks",
                href: "/factory/qc",
                icon: "check-circle",
                purpose: "Items awaiting QC against the master sample.",
                requires: "production.edit",
              },
              {
                id: "packing",
                label: "Packing",
                href: "/factory/packing",
                icon: "boxes",
                purpose: "Items ready to pack and QR labels.",
                requires: "production.edit",
              },
              {
                id: "dispatch",
                label: "Dispatch",
                href: "/factory/dispatch",
                icon: "truck",
                purpose:
                  "Ready items for ready rooms, packing list and batches.",
                requires: "dispatch.edit",
              },
            ],
          },
        ],
        mobileTabs: ["home", "incoming", "job-cards", "qc"],
        extras: [INBOX],
      };

    case "onsite":
      return {
        sections: [
          {
            label: "Work",
            items: [
              {
                ...home,
                label: "Today",
                purpose:
                  "Today's sites, tasks, vendors expected and deliveries due.",
              },
              {
                ...projects,
                label: "Sites",
                purpose: "Sites you work on, with rooms and readiness.",
              },
              tasks,
            ],
          },
          {
            label: "On site",
            items: [
              {
                id: "snags",
                label: "Snags",
                href: "/site/snags",
                icon: "bug",
                purpose:
                  "Snags assigned to you with due dates and proof photos.",
                requires: "snags_handover.edit",
              },
              {
                id: "receive-install",
                label: "Receive and install",
                href: "/site/dispatch",
                icon: "truck",
                purpose:
                  "Expected against scanned items, damage, and installation with photos.",
                requires: "dispatch.edit",
              },
              {
                id: "daily-report",
                label: "Daily report",
                href: "/site/report",
                icon: "clipboard-list",
                purpose: "Manpower, work done, photos and issues.",
                requires: "site.edit",
              },
              {
                id: "measurements",
                label: "Measurements",
                href: "/site/measurements",
                icon: "ruler",
                purpose: "Room-wise dimensions with photos and sketches.",
                requires: "measurements.edit",
              },
              {
                id: "readiness",
                label: "Room readiness",
                href: "/site/readiness",
                icon: "map-pin",
                purpose: "The site-ready checklist for each room.",
                requires: "site.edit",
              },
            ],
          },
        ],
        mobileTabs: ["home", "projects", "scan", "snags"],
        extras: [
          {
            id: "scan",
            label: "Scan",
            href: "/site/scan",
            icon: "scan",
            purpose: "Scan QR labels at loading and at receipt.",
            requires: "dispatch.edit",
          },
        ],
      };
  }
}

export function roleNav(role: Role): RoleNav {
  return build(role);
}

/** Keeps only the items the person has permission for, and drops sections that end up empty. */
export function filterSections(
  sections: NavSection[],
  can: (key: PermissionKey) => boolean,
): NavSection[] {
  return sections
    .map((section) => ({
      ...section,
      items: section.items.filter(
        (item) => item.requires === null || can(item.requires),
      ),
    }))
    .filter((section) => section.items.length > 0);
}

/** The phone bottom bar: up to four tabs the person may use. "More" is added by the shell. */
export function resolveMobileTabs(
  nav: RoleNav,
  can: (key: PermissionKey) => boolean,
): NavItem[] {
  const all = [...nav.sections.flatMap((s) => s.items), ...nav.extras];
  return nav.mobileTabs
    .map((id) => all.find((item) => item.id === id))
    .filter(
      (item): item is NavItem =>
        !!item && (item.requires === null || can(item.requires)),
    )
    .slice(0, 4);
}
