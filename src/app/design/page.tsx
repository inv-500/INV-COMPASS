import { CircleCheck, Info, Plus, TriangleAlert, CircleX } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { ColourTables, ContrastTable } from "@/components/design/colour-tables";
import { FormsDemo } from "@/components/design/forms-demo";
import { InteractiveDemos } from "@/components/design/interactive-demos";
import { ThemePair } from "@/components/design/theme-pair";
import { ThemeToggle } from "@/components/design/theme-toggle";
import {
  EmptyState,
  ErrorState,
  LoadingRows,
  NoAccessState,
} from "@/components/patterns/states";
import { StatTile } from "@/components/patterns/stat-tile";
import { StatusPill } from "@/components/patterns/status-pill";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Kbd } from "@/components/ui/kbd";
import { SAMPLE_ITEMS, STATUS_EXAMPLES } from "@/lib/design/sample-data";
import { formatDate, formatInr, formatRelative } from "@/lib/format";
import { ROLE_LABELS, ROLES } from "@/lib/permissions/matrix";

export const metadata: Metadata = { title: "Design system" };

function Section({
  id,
  title,
  intro,
  children,
}: {
  id: string;
  title: string;
  intro?: string;
  children: React.ReactNode;
}) {
  return (
    <section
      id={id}
      aria-labelledby={`${id}-heading`}
      className="flex scroll-mt-6 flex-col gap-4"
    >
      <div className="flex flex-col gap-1">
        <h2 id={`${id}-heading`} className="text-lg font-semibold">
          {title}
        </h2>
        {intro ? (
          <p className="max-w-3xl text-base text-muted-foreground">{intro}</p>
        ) : null}
      </div>
      {children}
    </section>
  );
}

const SECTIONS = [
  ["check", "What to check"],
  ["colour", "Colour"],
  ["type", "Type"],
  ["shape", "Spacing and shape"],
  ["buttons", "Buttons"],
  ["forms", "Forms"],
  ["status", "Status"],
  ["feedback", "Feedback"],
  ["states", "States"],
  ["numbers", "Numbers and dates"],
  ["people", "People and numbers"],
  ["interactive", "Interactive"],
  ["shell", "App shell"],
] as const;

const TYPE_SCALE = [
  {
    cls: "text-2xl font-semibold",
    name: "text-2xl",
    spec: "32 / 40 · 600",
    use: "Dashboard numbers",
    sample: "₹12,34,567",
  },
  {
    cls: "text-xl font-semibold",
    name: "text-xl",
    spec: "24 / 32 · 600",
    use: "Record titles",
    sample: "Rao villa, Whitefield",
  },
  {
    cls: "text-lg font-semibold",
    name: "text-lg",
    spec: "20 / 28 · 600",
    use: "Page titles",
    sample: "Projects",
  },
  {
    cls: "text-md font-semibold",
    name: "text-md",
    spec: "16 / 24 · 600",
    use: "Section titles",
    sample: "Waiting on you",
  },
  {
    cls: "text-base",
    name: "text-base",
    spec: "14 / 22 · 400",
    use: "Body copy",
    sample: "Waiting on client approval since 3 days.",
  },
  {
    cls: "text-sm",
    name: "text-sm",
    spec: "13 / 20 · 400",
    use: "Default UI text",
    sample: "Master bedroom wardrobe",
  },
  {
    cls: "text-xs",
    name: "text-xs",
    spec: "12 / 16 · 400",
    use: "Meta and timestamps",
    sample: "Updated 2 h ago",
  },
];

// Fixed "now" so the examples read the same every time the page loads.
const NOW = new Date("2026-10-23T10:00:00+05:30");
const at = (ms: number) => new Date(NOW.getTime() + ms);
const HOUR = 3_600_000;
const DAY = 86_400_000;

export default function DesignPage() {
  return (
    <main
      id="main"
      className="mx-auto flex max-w-6xl flex-col gap-12 p-4 pb-24 md:p-6"
    >
      <header className="flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <p className="text-xs text-muted-foreground">
            INV Compass · internal
          </p>
          <h1 className="text-xl font-semibold">Design system</h1>
          <p className="max-w-3xl text-base text-muted-foreground">
            Every colour, text style and component, in light and dark, with
            invented INV Home content. This page is the visual contract: you
            approve it before feature work starts, and every later change to the
            system is made here first. Nothing on it is real data.
          </p>
        </div>
        <ThemeToggle />
        <nav aria-label="On this page">
          <ul className="flex flex-wrap gap-x-4 gap-y-1 text-sm">
            {SECTIONS.map(([id, label]) => (
              <li key={id}>
                <a
                  href={`#${id}`}
                  className="text-primary underline-offset-4 hover:underline"
                >
                  {label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </header>

      <Section id="check" title="What to check">
        <ol className="flex max-w-3xl list-decimal flex-col gap-2 pl-5 text-base">
          <li>
            <strong className="font-semibold">The accent colour.</strong> The
            deep green is a starting point. Confirm it or replace it with INV
            Home&apos;s brand colour; it is a one-line change.
          </li>
          <li>
            <strong className="font-semibold">The status tints.</strong> The
            pale backgrounds behind status pills were not in the spec, so they
            were chosen to pass the accessibility minimum.
          </li>
          <li>
            <strong className="font-semibold">Input borders.</strong> The spec
            colour was too faint to see (1.5 to 1), so a darker input border was
            added.
          </li>
          <li>
            <strong className="font-semibold">Sizes on touch screens.</strong>{" "}
            Buttons and fields are 32 px high with a mouse, 36 px on tablets and
            44 px on phones.
          </li>
          <li>
            <strong className="font-semibold">The shell for each role.</strong>{" "}
            Open it as every role (last section) on a desktop and on a phone.
          </li>
        </ol>
      </Section>

      <Section
        id="colour"
        title="Colour"
        intro="Neutrals do the work. The accent marks the primary action and the current selection. Status colours mark state, always with text next to them."
      >
        <ColourTables />
        <ContrastTable />
      </Section>

      <Section
        id="type"
        title="Type"
        intro="Inter for text. JetBrains Mono only for codes and IDs. Three weights: 400, 500 and 600."
      >
        <ThemePair>
          <div className="flex flex-col gap-4">
            {TYPE_SCALE.map((row) => (
              <div
                key={row.name}
                className="flex flex-col gap-0.5 border-b pb-3 last:border-b-0"
              >
                <p className={row.cls}>{row.sample}</p>
                <p className="text-xs text-muted-foreground">
                  <code>{row.name}</code> · {row.spec} · {row.use}
                </p>
              </div>
            ))}
            <p>
              Item code: <code className="text-sm">VLA01-MBR-WD-01</code>
            </p>
          </div>
        </ThemePair>
      </Section>

      <Section
        id="shape"
        title="Spacing and shape"
        intro="4 px base. Radius 6 on inputs and buttons, 8 on cards, 12 on dialogs, round on pills and avatars. Flat by default; shadows only on floating layers."
      >
        <ThemePair>
          <div className="flex flex-col gap-4">
            <div className="flex flex-wrap items-end gap-4">
              {[
                ["rounded-md", "6 px"],
                ["rounded-lg", "8 px"],
                ["rounded-xl", "12 px"],
                ["rounded-full", "Full"],
              ].map(([cls, label]) => (
                <div key={cls} className="flex flex-col items-center gap-1">
                  <div className={`size-14 border bg-surface-muted ${cls}`} />
                  <span className="text-xs text-muted-foreground">{label}</span>
                </div>
              ))}
            </div>
            <div className="flex flex-wrap gap-4">
              <div className="flex h-14 w-32 items-center justify-center rounded-lg bg-popover text-xs shadow-sm">
                shadow-sm: menus
              </div>
              <div className="flex h-14 w-32 items-center justify-center rounded-lg bg-popover text-xs shadow-lg">
                shadow-lg: dialogs
              </div>
            </div>
            <div className="flex flex-col gap-1">
              {[
                ["w-1", "4"],
                ["w-2", "8"],
                ["w-3", "12"],
                ["w-4", "16"],
                ["w-6", "24"],
                ["w-8", "32"],
                ["w-12", "48"],
                ["w-16", "64"],
              ].map(([cls, px]) => (
                <div key={cls} className="flex items-center gap-2">
                  <div className={`h-2 rounded-full bg-primary ${cls}`} />
                  <span className="tnum text-xs text-muted-foreground">
                    {px} px
                  </span>
                </div>
              ))}
            </div>
          </div>
        </ThemePair>
      </Section>

      <Section
        id="buttons"
        title="Buttons"
        intro="One primary button per page. Verbs on buttons. Icon-only buttons carry a label and a tooltip."
      >
        <ThemePair>
          <div className="flex flex-wrap gap-2">
            <Button>
              <Plus className="size-4" aria-hidden="true" />
              Create project
            </Button>
            <Button variant="secondary">Send for approval</Button>
            <Button variant="outline">Save draft</Button>
            <Button variant="ghost">Cancel</Button>
            <Button variant="destructive">Delete 3 drafts</Button>
            <Button variant="link">View history</Button>
            <Button size="lg">Large</Button>
            <Button disabled>Release to factory</Button>
          </div>
        </ThemePair>
      </Section>

      <Section
        id="forms"
        title="Forms"
        intro="Single column, label above, helper text below. Errors appear inline and are linked to the field. Required is marked only when most fields are optional."
      >
        <ThemePair>
          <FormsDemo />
        </ThemePair>
      </Section>

      <Section
        id="status"
        title="Status"
        intro="Status is a pill with text, so colour is never the only signal. Labels can be renamed by Admin, but each maps to one of four buckets."
      >
        <ThemePair>
          <div className="flex flex-col gap-3">
            <div className="flex flex-wrap gap-2">
              {STATUS_EXAMPLES.map((status) => (
                <StatusPill key={status.label} tone={status.tone}>
                  {status.label}
                </StatusPill>
              ))}
            </div>
            <ul className="flex flex-col gap-2">
              {SAMPLE_ITEMS.map((item) => (
                <li
                  key={item.code}
                  className="flex items-center justify-between gap-3 rounded-lg border bg-card p-3"
                >
                  <span className="flex min-w-0 flex-col">
                    <span className="truncate text-sm font-medium">
                      {item.name}
                    </span>
                    <code className="text-xs text-muted-foreground">
                      {item.code}
                    </code>
                  </span>
                  <StatusPill
                    tone={
                      item.status === "Done"
                        ? "success"
                        : item.status === "Blocked"
                          ? "danger"
                          : "info"
                    }
                  >
                    {item.status}
                  </StatusPill>
                </li>
              ))}
            </ul>
          </div>
        </ThemePair>
      </Section>

      <Section
        id="feedback"
        title="Feedback"
        intro="Inline banners for page-level messages. Toasts and dialogs are in Interactive below."
      >
        <ThemePair>
          <div className="flex flex-col gap-2">
            <Alert variant="info">
              <Info aria-hidden="true" />
              <div>
                <AlertTitle>This item changed after release</AlertTitle>
                <AlertDescription>
                  Re-approval is needed before Factory can start.
                </AlertDescription>
              </div>
            </Alert>
            <Alert variant="success" role="status">
              <CircleCheck aria-hidden="true" />
              <AlertTitle>Drawings approved and released</AlertTitle>
            </Alert>
            <Alert variant="warning" role="status">
              <TriangleAlert aria-hidden="true" />
              <AlertTitle>Waiting on client approval since 3 days</AlertTitle>
            </Alert>
            <Alert variant="danger">
              <CircleX aria-hidden="true" />
              <AlertTitle>We couldn&apos;t save this</AlertTitle>
            </Alert>
          </div>
        </ThemePair>
      </Section>

      <Section
        id="states"
        title="States"
        intro="Every list and page has all four, designed rather than left to the default."
      >
        <ThemePair>
          <div className="flex flex-col gap-4">
            <EmptyState
              title="No snags yet"
              description="Snags raised during QC will appear here."
              action={<Button>Raise a snag</Button>}
            />
            <LoadingRows rows={3} />
            <ErrorState
              description="Something went wrong on our side. Try again, and share the reference if it keeps happening."
              reference="7F3A-91C2"
              action={<Button variant="outline">Try again</Button>}
            />
            <NoAccessState />
          </div>
        </ThemePair>
      </Section>

      <Section
        id="numbers"
        title="Numbers and dates"
        intro="Rupees with Indian grouping, dates in Indian time, relative times for anything recent. Numbers in tables line up."
      >
        <ThemePair>
          <dl className="tnum grid grid-cols-[auto_1fr] gap-x-6 gap-y-2 text-sm">
            <dt className="text-muted-foreground">Amount</dt>
            <dd>{formatInr(BigInt(123456700))}</dd>
            <dt className="text-muted-foreground">With paise</dt>
            <dd>{formatInr(BigInt(4250075))}</dd>
            <dt className="text-muted-foreground">Date</dt>
            <dd>{formatDate("2026-10-22T10:00:00+05:30")}</dd>
            <dt className="text-muted-foreground">Soon</dt>
            <dd>{formatRelative(at(3 * DAY), NOW)}</dd>
            <dt className="text-muted-foreground">Recent</dt>
            <dd>{formatRelative(at(-2 * HOUR), NOW)}</dd>
            <dt className="text-muted-foreground">Further away</dt>
            <dd>{formatRelative(at(30 * DAY), NOW)}</dd>
          </dl>
        </ThemePair>
      </Section>

      <Section
        id="people"
        title="People and numbers"
        intro="People are avatars. Dashboards lead with three to five numbers that drive a decision."
      >
        <ThemePair>
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2">
              {["AM", "RI", "KN", "IS"].map((initials) => (
                <Avatar key={initials}>
                  <AvatarFallback>{initials}</AvatarFallback>
                </Avatar>
              ))}
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <StatTile
                label="Approvals waiting"
                value="5"
                hint="2 due this week"
              />
              <StatTile label="Late POs" value="3" hint="Longest: 9 days" />
            </div>
            <p className="text-sm text-muted-foreground">
              Search will open with <Kbd>⌘</Kbd> <Kbd>K</Kbd> in the next
              release.
            </p>
          </div>
        </ThemePair>
      </Section>

      <Section
        id="interactive"
        title="Interactive"
        intro="Toast with Undo, a confirm dialog, a menu and a tooltip. These open over the page, so they follow the page theme. Use the switch at the top to try both."
      >
        <InteractiveDemos />
      </Section>

      <Section
        id="shell"
        title="App shell"
        intro="The real shell with sample content. The menu is built from each role's permissions in the access matrix. On phones it becomes a bottom bar with at most five items. Resize the window, or open this on a phone."
      >
        <ul className="flex flex-wrap gap-2">
          {ROLES.map((role) => (
            <li key={role}>
              <Button asChild variant="outline">
                <Link href={`/design/shell/${role}`}>
                  Open as {ROLE_LABELS[role]}
                </Link>
              </Button>
            </li>
          ))}
        </ul>
      </Section>
    </main>
  );
}
