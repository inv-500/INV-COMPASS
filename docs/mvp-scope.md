# INV Compass — MVP Scope and Build Order (proposal)

Status: **proposal for founder approval.** Version 1 aims to run one live pilot project end to end, from project creation to handover, with every team working in INV Compass. Anything that does not serve that pilot waits.

Stages, tracks and sub-tasks are in `/docs/process-flow.md`; the rules behind statuses, health and ownership are in `/docs/workflow-model.md`.

## Build order

Each release ships, is tested by real team members, and then the next one starts.

| Release | Contents | Done when |
| --- | --- | --- |
| R0 Foundation | Project setup, CLAUDE.md, design system and `/design` page, app shell, ⌘K, invite-only auth, roles and permissions with RLS, Activity (audit trail), role-access tests | Founder approves `/design`; all access tests pass; independent security review clean |
| R1 Admin + collaboration | Users (with team lead flag), permission grid, projects (scope tags, Designer as project manager, team, payment milestones set per project), masters (categories, materials, vendors), process settings (stages, sub-tasks, gates, status labels), project overview with StageTracker and track rows, Activity. **Tasks** (create, assign, subtasks, My tasks, list and board views, "waiting on"), **discussion threads** on projects and tasks (@mentions, photos, files), **inbox** | Admin sets up a real project and its team without help; the team coordinates one week of work through tasks and threads |
| R2 Designer | Requirement (brief), site visit, design files, concept, samples, docket builder and design freeze, BOQ and **Procurement BOQ verification queue**, client approvals with proof, payment milestone flag (milestone 1) recorded by Admin, release to tracks, project tracker, discussion threads on items | A designer takes a project from brief to design frozen and released to tracks, with the BOQ verified by Procurement |
| R3 GFC | Queue, final measurements, item workspace, drawings, BOM and engineering sheet passed straight to the Designer, Designer approval of GFC drawings and release to Procurement and Factory | Items released with approved drawings and routed by classification |
| R4 Factory + Procurement | Production orders, job cards (mobile), QC, packing with QR; cost sheets, PO register (**ERP PO number and file stored by hand**), finance approvals recorded as external approvals, stock check, expediting, goods receipt; bought-in route (to confirm) | Released Track B items reach "ready" |
| R5 On-site + Vendor team | Track A: work packages, vendor selection with Procurement, work orders linked to the ERP PO number, schedule, progress verification, quality check; mobile shell (offline), daily report, room site-ready check, dispatch batches, receipt, installation, snags; voice notes and photo-to-snag in threads; deep cleaning booking | Items installed and snags closed on the pilot |
| R6 Handover + go-live | Handover pack and sign-off, final payment flag, close project, email digests, Slack integration, team workload view, deputies and escalation, Admin exceptions home and financial reports, production hardening (backups, monitoring, domain), data import | Pilot project reaches handover in INV Compass |

## In v1

- All seven roles and their core screens listed above. **The Designer is the project manager** (no separate role)
- Invite-only auth, two-factor for Admin, role and project-scoped permissions, Activity (project and system)
- Items as the shared record across teams, with the full lifecycle and configurable statuses mapped to four buckets
- Two parallel tracks (onsite services; millwork, loose furniture and bought-in) with one progress bar per track
- Approvals with versioning and proof; external approvals for people without a login (finance approval of POs)
- Money split by audience: BOQ (client price) for Admin, Designer, Procurement; cost sheets and PO rates for Admin and Procurement; payments for Admin only; everyone else sees milestone flags
- PO number and file stored from the ERP (no PO creation in Compass)
- Files and drawings with versions and in-app preview
- Tasks (process and ad-hoc), discussion threads on every record, @mentions, message-to-task, inbox and following
- Saved views, command palette, keyboard shortcuts
- Mobile-first, offline-capable On-site and Factory screens
- In-app and email notifications for gates, approvals, lateness
- Light and dark mode

## Later (v2+)

- ERP integration (v1 stores the PO number and file by hand)
- Warranty and service requests after handover (service requests, warranty period, retention release)
- Client sign-off of GFC drawings (the submittal register); the Designer's approval is enough for now and client sign-off may return
- Vendor bills and payments to vendors; integration with accounting software (Tally / Zoho)
- Voice-note transcripts, calendar and timeline task views, recurring tasks
- Per-user permission overrides
- Production capacity planning by work centre
- Imports and customs tracking beyond basic status
- WhatsApp notifications
- Advanced reports, margin analytics, forecasting
- AI assists: draft BOQ from drawings, summarise site reports, flag at-risk projects

## Not building

- Client portal and vendor portal — INV Compass is internal only
- General team chat channels (Slack covers this)
- Lead management and sales pipeline (outside this flow)
- Full accounting, payroll, HR; a Finance login
- CAD or 3D design tools (files are uploaded, not created here)
- A visual workflow builder (Admin edits templates as lists), manual dragging of project or track status, nested tracks

## Decided

- The Designer is the project manager; there is no separate Project Manager role.
- Payment milestones are set per project by Admin (default two: design frozen, final). No fixed percentages are needed in the product.
- Item codes follow `PROJECT-ROOM-CATEGORY-NN`.
- "Design frozen" is the moment the docket locks.
- The scope tag "Loose furniture and bought-in" opens Track B. There is no technical check inside GFC.
- Warranty length is not needed in v1 (warranty is Later).

## Decisions needed before R1

- [ ] Brand accent colour (confirm or replace on `/design`)
- [ ] Which live project will be the pilot
- [ ] Confirm the two items marked *to confirm*: the Bought-in classification and Variations
