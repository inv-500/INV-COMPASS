// The default access matrix from docs/permissions.md section 2, as data.
// tests/unit/permissions-matrix.test.ts compares this file with the table in the doc and fails if they differ.
// Qualifiers in the doc ("own projects", "go-ahead") are not modelled here; they are enforced where the action runs.

export const ROLES = [
  "admin",
  "designer",
  "gfc",
  "procurement",
  "vendor_team",
  "factory",
  "onsite",
] as const;
export type Role = (typeof ROLES)[number];

export const ROLE_LABELS: Record<Role, string> = {
  admin: "Admin",
  designer: "Designer",
  gfc: "GFC",
  procurement: "Procurement",
  vendor_team: "Vendor team",
  factory: "Factory",
  onsite: "On-site",
};

export type Action =
  "view" | "edit" | "approve" | "delete" | "override_warn" | "override_require";

type Cell = readonly Action[];
const none: Cell = [];
const view: Cell = ["view"];
const edit: Cell = ["edit"];
const editApprove: Cell = ["edit", "approve"];
const viewApprove: Cell = ["view", "approve"];

// Column order: admin, designer, gfc, procurement, vendor_team, factory, onsite.
type Row = readonly [Cell, Cell, Cell, Cell, Cell, Cell, Cell];

const ROWS = {
  projects: [edit, view, view, view, view, view, view],
  project_team: [edit, edit, view, view, view, view, view],
  requirement: [view, edit, view, none, none, none, view],
  measurements: [view, edit, edit, none, view, view, edit],
  boq: [edit, edit, none, viewApprove, none, none, none],
  cost_sheets: [view, none, none, edit, none, none, none],
  approvals: [view, edit, view, none, none, none, none],
  external_approvals: [edit, view, view, edit, view, view, view],
  docket: [view, edit, view, view, view, view, view],
  variations: [editApprove, edit, view, view, view, view, view],
  gfc_drawings: [view, viewApprove, edit, view, view, view, view],
  procurement: [view, view, none, edit, view, view, view],
  vendor_work: [view, view, none, view, edit, none, view],
  work_order_rates: [view, none, none, view, edit, none, none],
  production: [view, view, view, view, none, edit, view],
  site: [view, view, view, none, view, view, edit],
  dispatch: [view, viewApprove, none, view, view, edit, edit],
  snags_handover: [edit, editApprove, none, none, edit, edit, edit],
  payments: [edit, none, none, none, none, none, none],
  payment_milestones: [edit, view, view, view, view, view, view],
  tasks: [edit, edit, edit, edit, edit, edit, edit],
  discussions: [edit, edit, edit, edit, edit, edit, edit],
  masters: [edit, view, view, view, view, view, none],
  reports: [edit, view, view, view, view, view, none],
  financial_reports: [view, none, none, none, none, none, none],
  users_roles: [edit, none, none, none, none, none, none],
  settings: [edit, none, none, none, none, none, none],
  activity: [view, view, view, view, view, view, view],
  system_activity: [view, none, none, none, none, none, none],
  gates: [
    ["override_warn", "override_require"],
    ["override_warn"],
    none,
    none,
    none,
    none,
    none,
  ],
} as const satisfies Record<string, Row>;

export type ModuleKey = keyof typeof ROWS;
export const MODULES = Object.keys(ROWS) as ModuleKey[];
export type PermissionKey = `${ModuleKey}.${Action}`;

/** Every permission a role holds. Edit includes view, as in the doc. */
export function permissionsFor(role: Role): Set<PermissionKey> {
  const index = ROLES.indexOf(role);
  const granted = new Set<PermissionKey>();
  for (const moduleKey of MODULES) {
    for (const action of (ROWS[moduleKey] as Row)[index]) {
      granted.add(`${moduleKey}.${action}` as PermissionKey);
      if (action === "edit") granted.add(`${moduleKey}.view` as PermissionKey);
    }
  }
  return granted;
}

/** The raw matrix cell, before edit is expanded to include view. Used by the doc-matching test. */
export function matrixCell(moduleKey: ModuleKey, role: Role): Cell {
  return (ROWS[moduleKey] as Row)[ROLES.indexOf(role)];
}
