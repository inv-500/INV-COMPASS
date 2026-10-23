# INV Compass — Design System and UX Standard

The bar: INV Compass should feel as calm, fast and considered as Linear, Attio and the Stripe Dashboard, and as refined as the homes INV Home builds. It is enterprise software that people *choose* to open.

Every screen is built from this document. If something you need is not here, propose an addition here first, then build it.

---

## 1. Principles

1. **Calm over busy.** Neutral surfaces, one accent colour, colour reserved for meaning. A screen should look quiet until something needs attention.
2. **Fast is a feature.** Every interaction responds within 100 ms. Use optimistic updates, prefetching and skeletons; never block the page with a spinner.
3. **The record is the centre.** Projects and items are first-class records with their own pages. Everything about a thing — status, files, approvals, history, comments — lives on its record.
4. **Show the next action.** Every workspace opens on "what needs me now", not a menu. Every record shows its current stage, its gate, and who it is waiting on.
5. **Keyboard-first, touch-friendly.** Office roles live on the keyboard (Cmd+K, shortcuts). Site and factory roles live on phones (large targets, camera, scan).
6. **Never lose work.** Autosave drafts, Undo on destructive actions, confirm only when an action is irreversible.
7. **Permission-aware, not permission-noisy.** People never see things they cannot use. No greyed-out menus for forbidden features; just a clean workspace for their role.
8. **Plain language.** Specific words, sentence case, no jargon. "Waiting on client approval since 3 days" beats "Status: Pending-CA".

---

## 2. Visual language

### 2.1 Typography

- **Font:** Inter (variable), with `font-feature-settings: "cv11", "ss01", "tnum"` for numbers in tables. Monospace: JetBrains Mono, used only for codes and IDs.
- **Scale** (size / line height / weight):

| Token | Size | Line height | Use |
| --- | --- | --- | --- |
| `text-xs` | 12 | 16 | Meta, table captions, timestamps |
| `text-sm` | 13 | 20 | **Default UI text**, table cells, inputs |
| `text-base` | 14 | 22 | Body copy, descriptions |
| `text-md` | 16 | 24 | Section titles (600) |
| `text-lg` | 20 | 28 | Page titles (600) |
| `text-xl` | 24 | 32 | Record titles (600) |
| `text-2xl` | 32 | 40 | Dashboard numbers (600, tabular) |

- Weights: 400 regular, 500 medium (labels, buttons), 600 semibold (titles). Never 700+.
- Letter spacing: −0.01em on 20 px and above.

### 2.2 Colour

Colour carries meaning. Neutrals do the work; the accent marks the primary action and current selection; status colours mark state. Never use colour alone to carry meaning — pair it with text or an icon.

**Light theme**

| Token | Value | Use |
| --- | --- | --- |
| `bg` | `#FAFAF9` | App background |
| `surface` | `#FFFFFF` | Cards, tables, panels |
| `surface-muted` | `#F4F3F1` | Sidebar, table header, hover |
| `border` | `#E7E5E1` | Hairlines, dividers |
| `border-strong` | `#D6D3CD` | Input borders |
| `text` | `#1C1B19` | Primary text |
| `text-secondary` | `#64615B` | Secondary text, labels |
| `text-tertiary` | `#8F8B84` | Placeholders, disabled (never for essential info) |
| `accent` | `#2F5D50` | Primary buttons, links, focus, selection |
| `accent-hover` | `#264C42` | |
| `accent-subtle` | `#E8F0ED` | Selected rows, active nav |

**Dark theme**

| Token | Value |
| --- | --- |
| `bg` | `#111110` |
| `surface` | `#191918` |
| `surface-muted` | `#21201E` |
| `border` | `#2C2B28` |
| `border-strong` | `#3A3935` |
| `text` | `#EDEBE7` |
| `text-secondary` | `#A6A29A` |
| `text-tertiary` | `#77736C` |
| `accent` | `#7DB5A3` |
| `accent-hover` | `#93C4B4` |
| `accent-subtle` | `#1F2E29` |

**Status colours** (each with a `-subtle` background tint for pills)

| Token | Light | Dark | Meaning |
| --- | --- | --- | --- |
| `success` | `#2E7D4F` | `#5DBB85` | Approved, done, on track |
| `warning` | `#A86200` | `#E0A050` | Waiting, at risk, due soon |
| `danger` | `#B93A2E` | `#E8776B` | Late, rejected, blocked, failed QC |
| `info` | `#2B62A8` | `#6FA0E0` | In progress, informational |
| `neutral` | `#64615B` | `#A6A29A` | Not started, draft, archived |

The accent green is a starting point. Confirm it (or replace it with INV Home's brand colour) on the `/design` page before feature work begins. All text/background pairs must pass WCAG AA (4.5:1 for text, 3:1 for large text and UI boundaries).

### 2.3 Spacing, radius, elevation

- **Spacing:** 4 px base. Use 4, 8, 12, 16, 20, 24, 32, 40, 48, 64. Default gap inside components 8; between groups 16–24; page padding 24 (desktop), 16 (mobile).
- **Radius:** 6 inputs and buttons; 8 cards and panels; 12 dialogs; full for pills and avatars.
- **Elevation:** flat by default, separated by 1 px borders. Shadows only for floating layers: `shadow-sm` popovers and menus, `shadow-lg` dialogs and command palette. No gradients.
- **Density:** table rows 40 px (comfortable) or 32 px (compact, user toggle). Inputs and buttons 32 px (36 px on touch, 44 px minimum target on mobile).

### 2.4 Iconography and imagery

- lucide-react, 16 px in UI text, 20 px in navigation, stroke 1.5.
- Icons support labels; icon-only buttons need a tooltip and an `aria-label`.
- Project imagery (renders, site photos, drawings) is shown generously — this is a design business. Thumbnails 4:3, rounded 6, lazy loaded, open in a full-screen viewer.

### 2.5 Motion

- 120–200 ms, `ease-out` entering, `ease-in` leaving. Panels slide 8–16 px; dialogs scale from 0.98.
- Motion explains change (a row moving to "Done", a panel opening). Never decorative.
- Respect `prefers-reduced-motion`: replace movement with opacity.

---

## 3. Layout

### 3.1 App shell (desktop)

```
┌──────────────┬──────────────────────────────────────────────┐
│ Sidebar 240  │ Top bar 52: breadcrumb · search (⌘K) · inbox │
│ (collapsible │──────────────────────────────────────────────│
│  to 56)      │ Page header: title · key meta · actions      │
│              │──────────────────────────────────────────────│
│ Workspace    │ Content                     │ Record panel   │
│ nav by role  │ (tables, boards, forms)     │ 480–640, opens │
│              │                             │ over content   │
│ Projects     │                             │                │
│ (pinned)     │                             │                │
│ ─────        │                             │                │
│ Settings     │                             │                │
│ User menu    │                             │                │
└──────────────┴─────────────────────────────┴────────────────┘
```

- **Sidebar** shows only the current role's workspace items, then pinned projects. Never show modules the user cannot access.
- **Top bar**: breadcrumb, global search / command palette trigger, notifications inbox with unread count, help.
- **Page header**: title, one line of key facts (stage, owner, due), primary action on the right (max one primary button per page).
- **Record panel**: opening a row opens a side panel without losing the list. "Open full page" for deep work. The URL updates so panels are shareable.

### 3.2 Mobile shell (On-site, Factory)

- Bottom navigation, max 5 items (for On-site: Today, Sites, Scan, Snags, More).
- Large page title; primary action as a full-width button at the bottom, above the nav.
- Camera and QR scan one tap away. Works offline: queue actions, show a clear "Saved offline — will sync" banner, sync automatically.

### 3.3 Breakpoints

`sm` 640 · `md` 768 · `lg` 1024 · `xl` 1280 · `2xl` 1536. Desktop layouts are designed at 1440; mobile at 390. Content max-width 1280 for forms and settings; tables use full width.

---

## 4. Core patterns

Build these once in `components/patterns` and reuse everywhere.

### 4.1 Data table (the workhorse)

Modelled on Attio and Linear list views.

- Sticky header, column resize and reorder, sort, multi-filter (chips above the table), group by (status, room, owner, stage), search within view.
- **Saved views** per user and shared views per team ("My overdue POs", "Waiting client approval").
- Inline edit for simple fields (status, owner, date); complex edits in the record panel.
- Row selection with a floating bulk-action bar (assign, change status, export).
- Status shown as pills; people as avatars; dates relative when recent ("in 3 days", "2 h ago") with exact date on hover.
- Numbers right-aligned, tabular. Currency in ₹ with Indian grouping.
- Virtualised for 1,000+ rows. Keyboard: ↑/↓ to move, Enter to open, X to select, E to edit.
- States: skeleton rows while loading; helpful empty state; filtered-to-nothing state with "Clear filters".

### 4.2 Record page and panel

- Header: title, code (mono), status pill, stage tracker, owner, key dates, primary action.
- Tabs: **Overview · Files · Approvals · Activity**, plus module tabs (Drawings, BOM, POs, Production, Installation).
- Right column (full page): properties list (label / value, editable inline), linked records.
- **Activity timeline**: every change, comment, approval and file in one chronological feed. Comments support @mentions and attachments.

### 4.3 Stage tracker

- Horizontal stepper of the 9 project stages (or an item's lifecycle), each step: done (check), current (accent), blocked (danger), upcoming (neutral). Stage status is calculated, never typed (see `/docs/workflow-model.md`).
- Stage 5 (Execution) expands into one row per open track (A and B), each with its own progress bar (for example "14 of 31 items ready"), health and "waiting on". There is no combined percentage. Tracks not in scope never appear.
- The current step shows its gate and who it waits on: "Gate: client sign-off · waiting on client · 3 days".

### 4.3a Tasks and discussions

Full behaviour in `/docs/collaboration.md`.

- **Task row:** checkbox · title · linked record chip · assignee avatar · due date (danger when overdue) · priority icon. Click opens the task in the record panel.
- **Board:** columns by status, cards show title, record chip, assignee, due; drag to change status.
- **Thread:** messages grouped by author within 5 minutes; avatar, name, relative time; system events as quiet single lines with an icon; composer pinned at the bottom with @mention, #reference, attach, photo, voice (mobile) and Send (Enter; Shift+Enter for a new line).
- **Message actions on hover** (long-press on mobile): reply, react, create task, mark decision, copy link, edit, delete.
- **Decisions** show a small pin and appear in the record's Decisions list.
- **Inbox:** one row per notification, unread dot, grouped by project; E marks done, H snoozes.
- Optimistic posting with a "Sending…" state; failed sends stay in the composer with Retry, never lost.

### 4.4 Command palette (⌘K / Ctrl+K)

- Jump to any project, item, PO, person or screen the user can access.
- Run actions: "Create project", "Raise snag", "Invite user", "Go to my approvals".
- Recent items first; fuzzy search; results grouped by type; keyboard only.

### 4.5 Keyboard shortcuts

| Keys | Action |
| --- | --- |
| ⌘K / Ctrl+K | Command palette |
| / | Focus search in the current view |
| C | Create a task in the current context |
| Shift+C | Create other record (item, snag, PO …) |
| M | Comment on the open record |
| G then T | Go to My tasks |
| G then H | Go to home |
| G then P | Go to projects |
| G then I | Go to inbox |
| Esc | Close panel or dialog |
| ? | Show all shortcuts |

### 4.6 Forms

- Single column, labels above fields, helper text below, errors inline on blur and on submit.
- Zod validation shared with the server. Required fields marked only when most are optional.
- Long forms (discovery questionnaire) split into sections with a progress rail and **autosave** ("Saved · 2 s ago").
- Primary action bottom-right (desktop) / full-width bottom (mobile). Disable only while submitting; never hide why something is disabled.

### 4.7 Approvals

Approvals are the heartbeat of the business, so they get a consistent pattern everywhere:

- Approval card: what is being approved, version, sent to, sent date, due date, status.
- Actions: Approve, Approve with notes, Request changes, Reject — each with an optional comment.
- When the designer records a client approval on the client's behalf, proof is mandatory (signed PDF, email or message screenshot).
- An approved version is locked; changes create a new version.

### 4.8 Feedback

- **Toasts** (bottom-right, 4 s) for completed actions, with **Undo** where reversible.
- **Inline banners** for page-level warnings ("This item changed after release — re-approval needed").
- **Dialogs** only for irreversible or high-impact actions; the confirm button states the action ("Delete 3 drafts"), never "OK".
- **Inbox** for notifications: grouped by project, mark done, snooze.

### 4.9 Empty, loading, error and no-access states

Every view has all four, designed, not default:

- **Empty:** one line on what this place is for, one primary action. ("No snags yet. Snags raised during QC will appear here.")
- **Loading:** skeletons shaped like the content. No full-page spinners.
- **Error:** what happened in plain words, a Retry action, and a reference ID.
- **No access:** "You don't have access to this page. Ask an Admin if you need it." Never reveal whether the record exists.

### 4.10 Files and drawings

- Drag-and-drop upload with progress; version history per file; preview PDFs and images in place; full-screen viewer with zoom.
- Drawings show their approval status and version on the thumbnail.

### 4.11 Dashboards

- Lead with 3–5 numbers that drive a decision, then a list of what needs action. Avoid decorative charts.
- Charts follow the dataviz rules: one accent series, neutral context, labelled directly, no 3D, no pies with more than 3 parts.

---

## 5. Role workspaces at a glance

Each role lands on a **Home** that answers "what needs me now". Every Home also shows the user's **My tasks** due today and unread **Inbox** items.

| Role | Home shows | Device |
| --- | --- | --- |
| Admin | Exceptions only: blocked or delayed tracks and who holds them, items waiting too long, finance approvals to record, gate overrides this week, workload by team | Desktop |
| Designer | My approvals waiting, GFC drawings to approve, items blocked on me, upcoming client meetings | Desktop + tablet |
| GFC | Drawing queue by due date, revisions requested, ready to release | Desktop |
| Procurement | Items to order by lead time, late POs, deliveries due today | Desktop |
| Vendor team | Vendor work this week, work to verify, cleaning bookings | Desktop + mobile |
| Factory | Today's production plan, QC waiting, items ready to pack | Tablet + mobile |
| On-site | Today's sites, deliveries due, snags assigned, readiness checks | Mobile |

---

## 6. Writing style

- Sentence case everywhere ("Create project", not "Create Project").
- Verbs on buttons: "Send for approval", "Release to factory", "Mark installed".
- Specific over generic: "Waiting on client since 12 Oct" over "Pending".
- Numbers: "3 items", "₹4,25,000", "22 Oct 2026", "in 3 days".
- No exclamation marks, no blame ("We couldn't save this" not "You entered an invalid value").
- Use the business's own words consistently: docket, BOQ, BOM, GFC, snag, gate, variation, handover.

---

## 7. Accessibility

- WCAG 2.2 AA minimum.
- Visible focus ring on every interactive element: 2 px `accent` outline, 2 px offset.
- Every input has a label; errors linked with `aria-describedby`.
- Full keyboard operation, logical tab order, focus trapped in dialogs and returned on close.
- Touch targets ≥ 44 × 44 px on mobile.
- Do not rely on colour alone; status pills include text.
- Test with axe in Playwright on every screen.

---

## 8. Performance budgets

- Interaction response < 100 ms (optimistic UI).
- Largest contentful paint < 2.0 s on a mid-range phone over 4G.
- Route JavaScript < 200 KB gzipped per page.
- Tables over 200 rows virtualised; images lazy loaded and resized.

---

## 9. UI quality checklist (run on every new screen)

- [ ] Built only from tokens and design-system components
- [ ] Clear page title and one primary action
- [ ] Loading, empty, error and no-access states designed
- [ ] Works at 1440 px and 390 px, light and dark
- [ ] Keyboard: reachable, operable, visible focus, Esc closes layers
- [ ] axe reports no violations
- [ ] Copy is plain, specific, sentence case
- [ ] Numbers, dates and currency formatted per conventions
- [ ] Optimistic update and Undo where an action is reversible
- [ ] Nothing visible that the role cannot use

---

## 10. The `/design` page

An internal page showing every token and component in both themes, with realistic INV Home content (projects, items, codes, rupee amounts). It is the visual contract: the founder approves it before feature work starts, and every later change to the system is made here first.
