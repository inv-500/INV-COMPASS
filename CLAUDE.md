# INV Compass — CLAUDE.md

Read this file at the start of every session. It is the rulebook for this repository. When a decision changes, update this file and the relevant doc in `/docs` in the same change.

## What we are building

INV Compass is the internal operating system for **INV Home**, a luxury interior design-and-build company that designs homes, manufactures millwork and loose furniture in its own factory, buys from vendors, and installs on site.

It replaces spreadsheets, WhatsApp threads and email with one place where every project, every item and every approval lives — and where the team coordinates: anyone can create and assign tasks (like Asana) and discuss any project, item or task in detail, with the conversation kept on the record it is about. Each team works in its own workspace and sees only what it is allowed to see.

**Internal use only.** Only INV Home staff log in. There is no client portal and no vendor portal; the team records anything from clients and vendors, with proof where it matters.

The owner is a non-technical founder. Explain plans, trade-offs and results in plain language. Avoid jargon; when a technical term is unavoidable, define it in one line.

## The seven roles

| Role | Owns |
| --- | --- |
| Admin | Monitors everything and acts "on behalf of" a team when needed. Users, roles, permissions, projects, payments (only role that sees amounts), finance approvals, masters, reports, close-out |
| Designer | **The project manager.** Client brief, concept, docket, BOQ and client approvals, design freeze and release to tracks, approval of GFC drawings and release to Procurement and Factory, dispatch go-ahead, snagging, handover. Can **view every operational module** on their own projects (not finance: payments, cost sheets, PO and work-order rates), edit only where listed in `/docs/permissions.md` |
| GFC | Final measurements, GFC drawings, BOM and engineering sheet, passed straight to the Designer for review (no check inside GFC). Does not release; the Designer does |
| Procurement | BOQ verification and approval, cost sheets, PO register (the ERP creates POs; Compass stores the number and file), finance approval requests, material mobilisation, goods receipt, bought-in items, inventory |
| Vendor team | Outsourced services (Track A): vendor selection with Procurement, work orders, scheduling, progress verification, deep cleaning. Sees work-order rates |
| Factory | Downstream of the Designer's release and Procurement: receives released items (with GFC drawings and BOM) and raw materials, then production orders, planning, job cards, QC, packing, dispatch with packing list |
| On-site | Site visit and measurements, quality check of vendor work, room site-ready check, dispatch receipt, installation, snags, cleaning inspection |

Every role sees only the projects it is a member of. Admin sees everything. A **team lead** is a flag on a user, not a role. Warranty and service requests after handover are not in version 1 (see `/docs/mvp-scope.md`).

## Source documents (read the one relevant to your task)

- `/docs/design-system.md` — the UX standard. **Read before building any screen.**
- `/docs/permissions.md` — auth, roles, permissions, row-level security, access tests. **Read before touching auth, data access or any table.**
- `/docs/data-model.md` — tables, fields, relationships, statuses.
- `/docs/process-flow.md` — the nine-stage pipeline with two parallel tracks (A onsite services, B millwork, loose furniture and bought-in), sub-tasks, owners and gates.
- `/docs/workflow-model.md` — statuses, health, rollups, tracks, ownership, approvals, delegation, and what the founder decided. **Read before touching statuses, gates or ownership.**
- `/docs/configurability.md` — what Admin can change in Settings and what is fixed. (Draft, to confirm.)
- `/docs/roles-and-screens.md` — features and screens per role.
- `/docs/collaboration.md` — tasks, discussion threads, inbox, notifications, Slack integration.
- `/docs/mvp-scope.md` — what is in version 1 and in which order it is built.

If the docs conflict, stop and ask. Do not guess.

## Stack

- Next.js (App Router) + TypeScript (strict) + React Server Components where sensible
- Tailwind CSS + shadcn/ui (Radix primitives) + lucide-react icons
- Supabase: Postgres, Auth, Storage, Realtime
- Zod for validation (shared between forms and server actions)
- TanStack Table for data tables; TanStack Query only where client caching is needed
- Vitest (unit), Playwright (end-to-end, including role-access tests)
- pnpm; hosting on Vercel

Do not add a new dependency without saying why and what it replaces.

## Supabase — strict rules

- Use **only** the project "INV Compass", ref `qiitpirpnqaonnzmdmhc` (region ap-southeast-1, Singapore).
- **Never** read or change "inv-500's Project" (ref `cblcahodlnreqgpasczp`). It is the live database of a different product.
- Change the database **only** through migration files in `supabase/migrations`. Never edit production directly.
- Every table has row-level security (RLS) enabled **and** explicit policies. New tables are not exposed automatically; grant access explicitly in the migration.
- The service-role key is server-only. It never appears in client code, in the browser, or in a commit.
- After any migration, run the Supabase security and performance advisors and fix every warning.
- Never ask the founder to paste the secret key or database password into chat; tell them where to add it (Vercel / Supabase settings).

## Folder structure

```
src/
  app/
    (auth)/            sign-in, set-password, forgot, reset, invite-expired
    (app)/
      layout.tsx       app shell: sidebar by role, top bar, command palette
      admin/           Admin workspace
      designer/        Designer workspace (not design/, which is the /design showcase route)
      gfc/             GFC workspace
      procurement/     Procurement workspace
      vendor-team/     Vendor team workspace (not vendors/, which could be confused with the vendors master)
      factory/         Factory workspace
      site/            On-site workspace (mobile-first)
      projects/[id]/   shared project record pages
    design/            the /design system showcase page (internal)
  components/
    ui/                shadcn/ui primitives, themed with our tokens
    patterns/          composed patterns: DataTable, RecordPanel, StageTracker, EmptyState ...
  lib/
    supabase/          server and browser clients
    auth/              session helpers, requirePermission()
    permissions/       permission keys, role maps
    validation/        zod schemas
  server/              server actions, one folder per module
supabase/
  migrations/
  seed.sql
tests/
  e2e/                 Playwright, including tests/e2e/access/*
  unit/
docs/
```

## Security rules (non-negotiable)

1. **Invite-only.** There is no public sign-up. Admin invites users and assigns role and projects.
2. **Defence in depth.** Access is enforced in three layers: RLS in the database, a permission check in every server action and route handler (`requirePermission(module, action, projectId?)`), and role-based navigation in the UI. The UI layer is never the only check.
3. **Least privilege.** Default deny. A role gets a permission only if the access matrix in `/docs/permissions.md` grants it.
4. **Activity.** Changes to users, roles, permissions, project membership, approvals, gates, payments and variations are written to `activity_log` (shown in the app as Activity). Each entry records how it happened: by the system, by hand, or by Admin on behalf of a team. Project Activity never contains money amounts.
5. **Money is split by audience.** BOQ prices: Admin, Designer, Procurement. Cost sheets and PO rates: Admin, Procurement. Work-order rates: Admin, Procurement, Vendor team. Payment amounts: Admin only. Everyone else sees only the milestone flag *received / pending*. Nobody approves their own work.
6. **No data leaks through side doors.** Search, notifications, discussion threads, @mentions, Activity, email digests, Slack posts, exports, file URLs and realtime channels respect the same permissions. Storage files use signed URLs scoped to permitted users.
7. **Access tests are the referee.** Every new table or screen extends the role-access tests. A task is not done if any access test fails.

## UX rules (summary — full standard in `/docs/design-system.md`)

- Build only from design-system tokens and components. No one-off colours, font sizes or spacing.
- Every list and page has loading (skeleton), empty, error and no-permission states.
- Interactions feel instant: optimistic updates with rollback, toasts with Undo for reversible actions.
- Keyboard-first: Cmd/Ctrl+K command palette, shortcuts for primary actions, visible focus.
- Accessible: WCAG 2.2 AA contrast, labels on every control, full keyboard operation, respects reduced motion.
- On-site and Factory screens are mobile-first: 44px touch targets, works on a weak network.
- Plain, specific copy. Sentence case. No jargon, no exclamation marks.

## Working rules

1. **Plan first.** For every task, read the relevant docs, then propose a plan (screens, tables, migrations, tests) and wait for approval. Anything touching permissions, payments or deletion always gets a plan.
2. **Small steps.** One feature per branch. Small commits with clear messages. Open a pull request with a plain-language summary and screenshots.
3. **Definition of done** — all must be true before you say "done":
   - `pnpm typecheck`, `pnpm lint`, `pnpm test` and `pnpm test:e2e` pass
   - role-access tests pass for all seven roles
   - Supabase advisors show no new warnings
   - each new screen screenshotted at 1440px and 390px, light and dark, and checked against the UI quality checklist in `/docs/design-system.md`
   - docs updated if behaviour or data changed
4. **Review.** For auth, permissions, money or deletion, start a separate review agent that has not seen the work to look for security and correctness issues; fix what it finds before reporting.
5. **When stuck,** stop after two failed attempts, list likely causes, add logging to find the real one, and fix only that.
6. **Never** disable RLS, weaken a policy, skip a test or hard-code a role check in the UI to make something work.

## Conventions

- Names: tables `snake_case` plural; columns `snake_case`; React components `PascalCase`; files `kebab-case`.
- Money in INR stored as integer paise (`bigint`); display with Indian grouping (₹12,34,567).
- Dates stored as `timestamptz` in UTC; displayed in Asia/Kolkata, format `22 Oct 2026`.
- Item codes follow `PROJECT-ROOM-CATEGORY-NN` (for example `VLA01-MBR-WD-01`); see `/docs/data-model.md`.
- Every business table has `id uuid`, `created_at`, `updated_at`, `created_by`. Join tables and insert-only logs (`activity_log`, `item_status_events`) skip `updated_at`.
- Use plain names, not the old rule codes: *architect involved*, *phases*, *item classification*, *room site-ready*, *dispatch batch*, *handover sign-off*. "B1–B5" only means the Track B steps in `/docs/process-flow.md`.
- Statuses, health and the stage are rolled up from items and tasks; never type them on a track, stage or project (see `/docs/workflow-model.md`).
- Soft delete (`archived_at`) for business records; hard delete only for drafts.

## Open decisions (ask before assuming)

Decided:
- Internal use only — no vendor or client portal. The Vendor team acts for vendors; designers record client approvals with proof.
- **The Designer is the project manager.** There is no separate Project Manager role.
- Payment milestones are set per project by Admin (default two); amounts are visible to Admin only.
- Item classification has four values: Millwork, Loose furniture, Onsite service, Bought-in. "Design frozen" is the moment the docket locks.
- The scope tags are Onsite services (Track A), Millwork, and "Loose furniture and bought-in" (both open Track B).
- There is no technical check inside GFC. GFC prepares and the Designer approves. Admin can add an optional GFC check back as a sub-task in Settings.
- Warranty and service requests, vendor bills, and client sign-off of GFC drawings (submittal register) are Later (not v1).

To confirm with the founder:
- Bought-in classification (Track B, skips GFC and Factory production) and Variations after design freeze.
- Which ERP, and whether every PO needs finance approval or only those above an amount (assumed: always).
