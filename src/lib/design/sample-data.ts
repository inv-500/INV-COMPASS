// Invented content for /design and the shell preview. None of it is real: the names, codes and amounts
// only look like INV Home work so the founder can judge the design with realistic text.

import type { Role } from "@/lib/permissions/matrix";

export const PREVIEW_USERS: Record<Role, string> = {
  admin: "Arjun Mehta",
  designer: "Asha Menon",
  gfc: "Rohan Iyer",
  procurement: "Kavya Nair",
  vendor_team: "Sanjay Kulkarni",
  factory: "Imran Sheikh",
  onsite: "Devika Rao",
};

export const SAMPLE_ITEMS = [
  {
    code: "VLA01-MBR-WD-01",
    name: "Master bedroom wardrobe",
    status: "In progress",
  },
  {
    code: "VLA01-LIV-PN-02",
    name: "Living room wall panelling",
    status: "Blocked",
  },
  { code: "VLA01-KIT-KT-01", name: "Kitchen cabinets", status: "Done" },
] as const;

// Home tiles follow design-system.md section 5 ("what needs me now") for each role.
export const ROLE_HOME_STATS: Record<
  Role,
  { label: string; value: string; hint?: string }[]
> = {
  admin: [
    {
      label: "Blocked or delayed tracks",
      value: "3",
      hint: "2 waiting on Procurement",
    },
    { label: "Items waiting over 5 days", value: "12" },
    { label: "Finance approvals to record", value: "4" },
    { label: "Gate overrides this week", value: "1" },
  ],
  designer: [
    { label: "Approvals waiting", value: "5", hint: "2 due this week" },
    { label: "GFC drawings to approve", value: "7" },
    { label: "Items blocked on me", value: "3" },
    { label: "Client meetings this week", value: "2" },
  ],
  gfc: [
    { label: "Items awaiting drawings", value: "18", hint: "6 due this week" },
    { label: "Returned by the Designer", value: "2" },
    { label: "Ready to send to the Designer", value: "4" },
  ],
  procurement: [
    { label: "BOQs to verify", value: "2" },
    { label: "Late POs", value: "3", hint: "Longest: 9 days" },
    { label: "Finance approvals pending", value: "5" },
    { label: "Deliveries due today", value: "6" },
  ],
  vendor_team: [
    { label: "Vendor work this week", value: "9" },
    { label: "Work to verify", value: "4" },
    { label: "Cleaning bookings", value: "2" },
  ],
  factory: [
    { label: "Newly received items", value: "11" },
    { label: "In today's plan", value: "24" },
    { label: "QC waiting", value: "7" },
    { label: "Ready to pack", value: "9" },
  ],
  onsite: [
    { label: "Sites today", value: "3" },
    { label: "Deliveries due", value: "2" },
    { label: "Snags assigned", value: "8", hint: "3 due today" },
    { label: "Readiness checks", value: "4" },
  ],
};

export const STATUS_EXAMPLES = [
  { label: "Not started", tone: "neutral" },
  { label: "In progress", tone: "info" },
  { label: "On hold", tone: "neutral" },
  { label: "Blocked", tone: "danger" },
  { label: "At risk", tone: "warning" },
  { label: "Done", tone: "success" },
] as const;
