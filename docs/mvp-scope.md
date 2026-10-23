# INV Compass — MVP Scope and Build Order (proposal)

Status: **proposal for founder approval.** Version 1 aims to run one live pilot project end to end, from docket to handover, with every team working in INV Compass. Anything that does not serve that pilot waits.

## Build order

Each release ships, is tested by real team members, and then the next one starts.

| Release | Contents | Done when |
| --- | --- | --- |
| R0 Foundation | Project setup, CLAUDE.md, design system and `/design` page, app shell, ⌘K, invite-only auth, roles and permissions with RLS, audit log, role-access tests | Founder approves `/design`; all access tests pass; independent security review clean |
| R1 Admin + collaboration | Users, permission grid, projects and team, masters (categories, materials, vendors), project overview with StageTracker, activity log. **Tasks** (create, assign, subtasks, My tasks, list and board views), **discussion threads** on projects, items and tasks (@mentions, photos, files), **inbox** | Admin sets up a real project and its team without help; the team coordinates one week of work through tasks and threads |
| R2 Designer | Discovery, design files, BOQ (first-cut and final), client approvals with proof, samples, docket builder and lock, project tracker | A designer takes a project from brief to locked docket |
| R3 GFC | Queue, final measurements, item workspace, drawings and BOM, technical check, submittals, release to production | Items released with approved drawings and routed by B3 |
| R4 Factory + Procurement | Production orders, job cards (mobile), QC, packing with QR; purchase requests, POs, expediting, goods receipt | Released items reach "ready" through both routes |
| R5 On-site + Vendor team | Mobile shell (offline), daily report, readiness (B7), dispatch batches (B8), receipt, installation, snags; voice notes and photo-to-snag in threads; work orders, schedule, progress verification | Items installed and snags closed on the pilot |
| R6 Handover + go-live | Handover pack and sign-off (B10), email digests, Slack integration, team workload view, Admin reports, production hardening (backups, monitoring, domain), data import | Pilot project reaches handover in INV Compass |

## In v1

- All seven roles and their core screens listed above
- Invite-only auth, two-factor for Admin, role and project-scoped permissions, audit log
- Items as the shared record across teams, with the full status lifecycle
- Approvals with versioning and proof
- Files and drawings with versions and in-app preview
- Tasks (process and ad-hoc), discussion threads on every record, @mentions, message-to-task, inbox and following
- Saved views, command palette, keyboard shortcuts
- Mobile-first, offline-capable On-site and Factory screens
- In-app and email notifications for gates, approvals, lateness
- Light and dark mode

## Later (v2+)

- Voice-note transcripts, calendar and timeline task views, recurring tasks
- Per-user permission overrides
- Payments and vendor bills integrated with accounting software (Tally / Zoho)
- Production capacity planning by work centre
- Imports and customs tracking beyond basic status
- WhatsApp notifications
- Advanced reports, margin analytics, forecasting
- AI assists: draft BOQ from drawings, summarise site reports, flag at-risk projects

## Not building

- Client portal and vendor portal — INV Compass is internal only
- General team chat channels (Slack covers this)
- Lead management and sales pipeline (outside this flow)
- Full accounting, payroll, HR
- CAD or 3D design tools (files are uploaded, not created here)

## Decisions needed before R1

- [ ] Brand accent colour (confirm or replace on `/design`)
- [ ] Separate Project Manager role? (assumed no)
- [ ] Payment milestone percentages and warranty period
- [ ] Item code format
- [ ] Which live project will be the pilot
