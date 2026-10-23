# INV Compass — Roles, Features and Screens

What each of the seven roles needs, screen by screen, mapped to the pipeline in `/docs/process-flow.md`. How statuses, tracks and "waiting on" work is in `/docs/workflow-model.md`. Who can see and change what is defined in `/docs/permissions.md` (section 2, access matrix). UX patterns referenced here (DataTable, RecordPanel, StageTracker, Approvals) are defined in `/docs/design-system.md`.

## How an item moves between teams

The **Designer** freezes the design and, once milestone 1 is received, releases the project to its tracks. Each item is routed by its classification:

- **Millwork and Loose furniture** (Track B) → GFC prepares drawings, BOM and engineering sheet → the Designer approves the drawings and releases to Procurement and Factory → Procurement buys materials while Factory builds → items become ready.
- **Bought-in** (Track B, to confirm) → skips GFC and Factory production → Procurement orders, goods are received and inspected → ready.
- **Onsite service** (Track A) → Procurement and Vendor team choose vendors → Procurement raises the PO in the ERP (finance approval recorded) → Vendor team runs the work → On-site checks quality.

Per room, as soon as its Track A work is done and its Track B items are ready, the room is site-ready: dispatch batch, Designer go-ahead, receipt and installation by On-site. Then Snagging, Deep cleaning and Handover. **Admin mostly monitors** and can act "on behalf of" a team.

## Shared across every role

- **Home** — "what needs me now" for that role (see design-system.md §5).
- **Projects** — only projects the user is a member of. The project page shows:
  - one row per open track: current stage, progress (for example 14 of 31 items ready), health, who it is *waiting on*, expected finish. There is no combined percentage. Tracks not in scope never appear.
  - a **waiting on** panel by role, and **per-room readiness**.
  - the StageTracker, items, files, approvals, Activity. Detail follows permissions: a role sees tasks, files, drawings and threads only if it has access to those records.
- **Items** — one record per docket line, same record for every team.
- **My tasks** — tasks assigned to me, by me, and that I follow; each shows who it is waiting on. Anyone can create and assign tasks on their projects.
- **Discussions** — a thread on every project, item, task and other record, with @mentions, photos, files and voice notes; any message can become a task.
- **Inbox** — mentions, replies, assignments, approvals and followed activity, grouped by project, with "waiting on".

Full spec in `/docs/collaboration.md`. Internal users only.
- **Command palette** (⌘K) and **saved views** on every table.
- **Profile** — name, photo, password, two-factor, notification preferences, deputy for a date range, sign out everywhere.
- **Team leads** (a flag on a user) can reassign and reschedule work within their team.

Nobody outside Admin sees payment amounts, cost sheets or PO rates. Everyone on a project sees only the milestone flag *received / pending*.

---

## Admin

Sets the business up, monitors, and acts on behalf of a team only when needed. Owns project creation, payments, close-out (9.5), users and settings.

**Key features**
- Create projects, tag scope, assign the Designer (project manager) and set payment milestones (default two)
- Invite users, assign role and projects, set team lead, deactivate; edit role permissions
- Configure the process as lists: stages, sub-tasks, gates and their strictness, transition mode, status labels (each mapped to one of four buckets), health thresholds, approval SLAs, item categories and codes
- Record payments against milestones and set the milestone flag; the next stage can be gated on the flag
- Record finance approvals of POs (with proof) when Procurement does not
- Approve variations above a threshold (to confirm); override *require approval* and *block* gates with a reason
- Exceptions dashboard and financial reports; masters (vendors, materials, finishes, rates)

| Screen | Shows | Actions |
| --- | --- | --- |
| Home (exceptions only) | Projects with blocked or delayed tracks and who holds them; items waiting more than N days; finance approvals waiting to be recorded; gate overrides this week; workload by team | Open, reassign, nudge |
| Project setup | Client, site, scope tags, architect involved, phases, Designer, team, milestones | Create, edit, assign, archive |
| Project overview | StageTracker 1–9, one row per track, waiting on, open gates, approvals, snags, milestone flags | Override gate (with reason), reassign, put on hold or cancel (with reason) |
| Users | People, role, team lead flag, projects, status, last seen | Invite, resend invite, change role, deactivate |
| Permissions | Role × module grid (view / edit / approve) | Edit; every change in Activity |
| Payments | Milestones per project with amounts, due, received | Record payment, set flag, remind |
| Finance approvals | POs awaiting finance approval, requested by, age | Record approval with proof, return with reason |
| Variations (to confirm) | Changes after design freeze with cost and time impact | Approve, reject, comment |
| Process settings | Stages, sub-tasks, gates, strictness, transition mode, status labels, thresholds, SLAs | Edit lists (no visual builder) |
| Masters | Categories and codes, materials, finishes, vendors, rates | Add, edit, retire |
| Reports | Delay by stage, approval turnaround, cost vs BOQ, margin, vendor ratings | Export |
| Activity | System Activity: every sensitive change, who did it and how | Search, export |

---

## Designer (project manager)

Owns the client relationship and the project from requirement to handover: Stages 2–4, design approval of GFC drawings (B2), dispatch go-ahead (6.3), snagging (7) and handover (9). Views every operational module on their own projects.

**Key features**
- Client brief, site documents, site visit; architect involved, phases
- Concept: layouts, mood boards, presentation, client concept approval with proof
- Design development: detailed design per room, samples, docket (items coded `PROJECT-ROOM-CATEGORY-NN` and classified), BOQ costing
- Send the BOQ to Procurement for verification; after Procurement approves, get the client's approval with proof
- Freeze the design; release to tracks once milestone 1 is received
- Review GFC drawings against the approved design, approve or return, then release to Procurement and Factory
- Approve the dispatch go-ahead; raise and re-inspect snags; run the final walkthrough, handover pack and client sign-off
- Add team members to their own projects; pass *warn* gates on their own projects with a reason

| Screen | Shows | Actions |
| --- | --- | --- |
| Home | Approvals waiting, items blocked on me, drawings to approve, meetings | Open, chase |
| My projects | Assigned projects, stage, tracks, next action | Open, filter |
| Requirement | Budget range, timeline, rooms, services, style, architect involved, phases | Fill (autosave), confirm with proof |
| Site visit | Measurements, photos, service notes | Log, approve, send back |
| Design files | Plans, concept, renders, mood board by version | Upload, share, record feedback |
| Samples | Approved materials and finishes, master-sample location | Add, approve, link to items |
| Docket | Items with code, room, category, classification, drawing link | Add, bulk import, classify, freeze design |
| BOQ builder | Room-wise lines, qty, rates, totals; verification status | Edit, send to Procurement, PDF, record client approval |
| Client approvals | Every approval: what, version, sent, due, status | Send, remind, record with proof |
| GFC drawing approval | Drawings awaiting Designer review, waiting on | Approve, return with comments, release to Procurement and Factory |
| Release to tracks | Design frozen, milestone 1 flag, items by classification | Release (override only with Admin) |
| Variations (to confirm) | Changes after freeze, cost and time impact | Raise, send to client, track |
| Project tracker | Every item's status across GFC, procurement, factory, vendors, site | Filter by room or status, chase owner |
| Dispatch go-ahead | Batches awaiting go-ahead | Approve, hold |
| Snags and walkthrough | Snags by room with photos, owner, due | Raise, re-inspect, close |
| Handover | Checklist, pack, client sign-off | Generate pack, record sign-off |

---

## GFC team

Turns released Track B items (millwork and loose furniture) into buildable drawings, BOMs and engineering sheets. The Designer approves; GFC does not release.

**Key features**
- Queue created when a project is released to tracks (one task per item)
- Final site measurements (with On-site)
- Versioned GFC drawings with revision reasons
- BOM and engineering sheet per item linked to the material master; cutting-list export
- Technical check by a different GFC user (the team lead if there is only one GFC user)
- Pull back released items affected by a variation (to confirm)

| Screen | Shows | Actions |
| --- | --- | --- |
| Home / GFC queue | Items awaiting drawings by project and due date | Pick up, assign |
| Final measurements | Room-wise final dimensions and reference lines | Review, request re-measure |
| Item workspace | Item details, references, samples, drawing versions, BOM | Upload drawing, build BOM, notes |
| BOM editor | Material and hardware lines per item | Add, copy from similar item, export |
| Technical check | Drawings awaiting an internal check | Pass, return with comments |
| Revisions and variations | Items affected after release | Revise, resubmit |

---

## Procurement team

Verifies the BOQ, prepares cost sheets, tracks POs raised in the ERP, and handles materials and bought-in goods. **Compass never creates POs**: the ERP does, and Compass stores the ERP PO number, the PO file, the status and who holds it.

**Key features**
- BOQ verification and approval before the BOQ goes to the client
- Track A: choose vendors with the Vendor team, prepare the cost sheet from the approved BOQ and upload it to the ERP
- Track B: receive the BOM and engineering sheet, stock check per line (in stock / to buy), cost sheet, PO
- Record the ERP PO number and file; request finance approval, record it with proof (or Admin does); release the PO
- Material mobilisation: expediting, delivery tracking, inward inspection, goods receipt; imports tracking
- Bought-in items: order, receive and inspect, hand over for dispatch
- Inventory and warehouse, including client items held until site is ready
- Sees work-order rates; sees PO rates and cost sheets; does not see payments

| Screen | Shows | Actions |
| --- | --- | --- |
| Home | BOQs to verify, POs awaiting finance approval, late deliveries, deliveries today | Act |
| BOQ verification | BOQs waiting on Procurement, with costing | Verify, approve, return with reason |
| Cost sheets | Cost sheet per project and track | Prepare, upload, mark uploaded to ERP |
| Stock check | BOM lines: in stock / to buy | Mark, convert to PO in the ERP |
| PO register | ERP PO number, file, status, who holds it | Add number and file, update status |
| Finance approvals | POs awaiting finance approval | Request, record with proof |
| Material mobilisation | Expediting, delivery tracking, delays | Update dates, log follow-up, escalate |
| Imports | Shipments, ETA, customs status, documents | Update, attach |
| Goods receipt | Deliveries due, inspection results | Receive, inspect, accept or reject |
| Inventory and warehouse | Stock by material and location; client items held | Issue to factory, reserve, move to dispatch |
| Vendor directory (shared) | Suppliers, categories, ratings, history | Add, rate, deactivate |

---

## Vendor team

An internal team managing outsourced services — civil, electrical, plumbing, false ceiling, painting, flooring, stone and glass fitting, wallpaper, curtains — and the deep-cleaning vendor (Stage 8). Vendors never log in; INV Compass is internal only. Owns Track A execution (A3), mobilisation and site schedule.

**Key features**
- Work packages from released service items
- Vendor selection with Procurement; work orders linked to the ERP PO number
- Vendor scheduling in step with dispatch and site readiness
- Progress reported vs verified on site, with photos
- Deep cleaning: book the vendor, track cleaning per room
- Vendor performance ratings
- Sees work-order rates; does not see payments

| Screen | Shows | Actions |
| --- | --- | --- |
| Home | Vendor work this week, work to verify, cleaning bookings | Act |
| Work packages | Service items by project and room | Create, assign vendor |
| Work orders | Vendor, scope, linked PO number, milestones, dates | Issue, amend, close |
| Vendor schedule | Calendar by site and room | Book, reschedule, notify on-site |
| Progress and measurement | Reported vs verified work, photos | Query, approve milestone |
| Deep cleaning | Booking and status per room | Book, update |
| Vendor performance | On-time %, snags, rework, rating | Rate, note |

---

## Factory team

Works downstream: receives items released by the Designer (with approved GFC drawings, BOM and engineering sheet) and materials from Procurement, then makes millwork and loose furniture in installation order (B4). Used on tablets and phones on the shop floor. Bought-in items do not pass through the Factory.

**Key features**
- Incoming queue: items released by the Designer, check the drawing and BOM are complete, accept or send back with a reason
- Receive raw materials issued by Procurement against each production order
- Production orders from received items, grouped by project and room
- Material check against BOM; shortfalls go to Procurement
- Planning by site-ready date and work-centre load
- Job cards per item, updated step by step from a phone or tablet
- QC at each step against the master sample, with photos; rework log
- Packing with QR labels (project, room, item code, install sequence)
- Plan dispatch batches with On-site and dispatch with a packing list
- Raise and fix snags that come from the Factory

| Screen | Shows | Actions |
| --- | --- | --- |
| Home | Items newly received, today's plan, QC waiting, items ready to pack | Act |
| Incoming | Items released with drawing, BOM and need-by date; materials issued by Procurement | Accept, send back with reason, confirm material receipt |
| Production orders | Received items, need-by date, material status | Plan, flag missing material |
| Production plan | Calendar and load by work centre | Schedule, reprioritise |
| Job card (mobile) | Drawing, BOM, current step, instructions | Start step, complete step, log issue |
| Item tracker | Each item's current step | Filter by project or room |
| QC checks | Items awaiting QC, checklist, master sample | Pass, fail with photos, send to rework |
| Rework log | Failed items, reason, time lost | Close |
| Packing and labels | Items ready to pack, label preview | Print QR labels, mark packed |
| Dispatch | Ready items for ready rooms, packing list | Plan batch, dispatch |
| Snags | Snags assigned to Factory | Fix, upload proof |

---

## On-site team

Measures, checks vendor work, marks rooms ready, receives and installs, supports snagging and cleaning inspection: 2.3, B1.1, A3.3, Stage 6, 7.1–7.2, 8.3. **Mobile-first, works offline.**

**Key features**
- Offline-capable app; queued actions sync automatically
- Room-wise measurement capture with photos and sketches
- Daily site report (manpower, work, photos, issues, vendors present)
- Quality check of vendor work (Track A) and verified quantities
- Room site-ready check (site work done, clean, dry, access, power) that unlocks dispatch
- Dispatch batches: plan with Factory, scan QR at loading and at receipt; log damage
- Installation checklist per item with photo proof
- Snag fixing with proof photos; cleaning inspection

| Screen | Shows | Actions |
| --- | --- | --- |
| Today | Sites, tasks, vendors expected, deliveries due | Check in, open site |
| Site survey | Rooms, dimensions, photos, service points, access | Capture, submit for approval |
| Final measurement | Room-wise final dimensions | Capture, submit to GFC |
| Daily report | Manpower, work done, photos, issues | Submit |
| Site works | Civil, MEP, ceiling, paint tasks by room | Update, verify vendor work, quality check |
| Room site-ready | Checklist per room | Tick, photo, mark ready |
| Dispatch batch | Batch items, vehicle, slot | Plan with Factory, scan at loading, confirm |
| Receive at site | Expected vs scanned items, damage | Scan, accept, report damage |
| Installation | Items per room, drawing, sequence | Mark installed with photo, raise issue |
| Snags | Assigned snags, due, photos | Fix, upload proof |
| Cleaning inspection | Cleaned rooms | Pass, return |

---

## Notifications

- **Gate reached** → next owner (design frozen and released → GFC, Procurement, Vendor team; drawings approved → Factory / Procurement; room ready → dispatch)
- **Approval waiting** → Designer, as the due date nears; BOQ waiting → Procurement
- **Finance approval waiting to be recorded** → Admin and the task owner
- **Late** → assignee first, then the team lead, then the Designer; Admin only when blocked or delayed beyond the configured limit
- **Milestone flag changed** → Admin and Designer (flag only, never the amount)
- **Variation raised** (to confirm) → GFC, Factory, Procurement if a released item is affected

## Open questions

- Separate factory planner role vs shop-floor staff?
- Which scope tag opens Track B for a project with only bought-in items?
- Warranty and service requests after handover are not in v1 (see `/docs/mvp-scope.md`, Later).
