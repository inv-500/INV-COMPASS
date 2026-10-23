// The colour tokens shown on /design. The values must match src/app/globals.css (a unit test checks this)
// and docs/design-system.md section 2.2.

export type ColourToken = {
  name: string;
  usage: string;
  light: string;
  dark: string;
};

export const NEUTRAL_TOKENS: ColourToken[] = [
  { name: "bg", usage: "App background", light: "#fafaf9", dark: "#111110" },
  {
    name: "surface",
    usage: "Cards, tables, panels",
    light: "#ffffff",
    dark: "#191918",
  },
  {
    name: "surface-muted",
    usage: "Sidebar, table header, hover",
    light: "#f4f3f1",
    dark: "#21201e",
  },
  {
    name: "border",
    usage: "Hairlines and dividers",
    light: "#e7e5e1",
    dark: "#2c2b28",
  },
  {
    name: "border-strong",
    usage: "Stronger hairlines (decorative only)",
    light: "#d6d3cd",
    dark: "#3a3935",
  },
  {
    name: "border-input",
    usage: "Input borders (addition: 3:1 against a card)",
    light: "#8f8b84",
    dark: "#77736c",
  },
  { name: "text", usage: "Primary text", light: "#1c1b19", dark: "#edebe7" },
  {
    name: "text-secondary",
    usage: "Secondary text and labels",
    light: "#64615b",
    dark: "#a6a29a",
  },
  {
    name: "text-tertiary",
    usage: "Placeholders and disabled, never essential info",
    light: "#8f8b84",
    dark: "#77736c",
  },
];

export const ACCENT_TOKENS: ColourToken[] = [
  {
    name: "accent",
    usage: "Primary buttons, links, focus, selection",
    light: "#2f5d50",
    dark: "#7db5a3",
  },
  {
    name: "accent-hover",
    usage: "Hover on the accent",
    light: "#264c42",
    dark: "#93c4b4",
  },
  {
    name: "accent-subtle",
    usage: "Selected rows, active menu item",
    light: "#e8f0ed",
    dark: "#1f2e29",
  },
  {
    name: "on-accent",
    usage: "Text on the accent",
    light: "#ffffff",
    dark: "#111110",
  },
];

export const STATUS_TOKENS: ColourToken[] = [
  {
    name: "success",
    usage: "Approved, done, on track",
    light: "#2e7d4f",
    dark: "#5dbb85",
  },
  {
    name: "success-subtle",
    usage: "Success pill background",
    light: "#eef7f1",
    dark: "#1b2b22",
  },
  {
    name: "warning",
    usage: "Waiting, at risk, due soon",
    light: "#a86200",
    dark: "#e0a050",
  },
  {
    name: "warning-subtle",
    usage: "Warning pill background",
    light: "#fff9f0",
    dark: "#2e2414",
  },
  {
    name: "danger",
    usage: "Late, rejected, blocked, failed QC",
    light: "#b93a2e",
    dark: "#e8776b",
  },
  {
    name: "danger-subtle",
    usage: "Danger pill background",
    light: "#fbe7e4",
    dark: "#33201d",
  },
  {
    name: "info",
    usage: "In progress, informational",
    light: "#2b62a8",
    dark: "#6fa0e0",
  },
  {
    name: "info-subtle",
    usage: "Info pill background",
    light: "#e4edf8",
    dark: "#1b2738",
  },
  {
    name: "neutral",
    usage: "Not started, draft, archived",
    light: "#64615b",
    dark: "#a6a29a",
  },
  {
    name: "neutral-subtle",
    usage: "Neutral pill background",
    light: "#f4f3f1",
    dark: "#21201e",
  },
];

export const ALL_TOKENS = [
  ...NEUTRAL_TOKENS,
  ...ACCENT_TOKENS,
  ...STATUS_TOKENS,
];

/** Text and background pairs shown with their contrast ratio. The minimum is 4.5, or 3 for non-text. */
export const CONTRAST_PAIRS: {
  label: string;
  fg: string;
  bg: string;
  min: number;
}[] = [
  { label: "Text on bg", fg: "text", bg: "bg", min: 4.5 },
  { label: "Text on surface", fg: "text", bg: "surface", min: 4.5 },
  {
    label: "Secondary text on surface",
    fg: "text-secondary",
    bg: "surface",
    min: 4.5,
  },
  { label: "Accent link on surface", fg: "accent", bg: "surface", min: 4.5 },
  {
    label: "On-accent on accent (buttons)",
    fg: "on-accent",
    bg: "accent",
    min: 4.5,
  },
  {
    label: "Success on its tint",
    fg: "success",
    bg: "success-subtle",
    min: 4.5,
  },
  {
    label: "Warning on its tint",
    fg: "warning",
    bg: "warning-subtle",
    min: 4.5,
  },
  { label: "Danger on its tint", fg: "danger", bg: "danger-subtle", min: 4.5 },
  { label: "Info on its tint", fg: "info", bg: "info-subtle", min: 4.5 },
  {
    label: "Input border on surface",
    fg: "border-input",
    bg: "surface",
    min: 3,
  },
];
