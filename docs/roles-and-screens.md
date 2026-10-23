# INV Compass — Roles, Features and Screens

What each of the seven roles needs, screen by screen, mapped to the stages in `/docs/process-flow.md`. Who can see and change what is defined in `/docs/permissions.md` (section 2, access matrix). UX patterns referenced here (DataTable, RecordPanel, StageTracker, Approvals) are defined in `/docs/design-system.md`.

## How an item moves between teams

Designer locks the docket → GFC releases each item → routed by classification (B3): **factory** items to Factory, **bought_in** items to Procurement, **service** items to the Vendor team → all arrive at site → On-site installs → Designer runs QC and handover. Admin oversees everything.

## Shared across every role

- **Home** — "what needs me now" for that role (see design-system.md §5).
- **Projects** — only projects the user is a member of; project record with StageTracker, items, files, approvals, activity.
- **Items** — one record per docket line, same record for every team.
- **My tasks** — tasks assigned to me, by me, and that I follow; anyone can create and assign tasks on their projects.
- **Discussions** — a thread on every project, item, task and other record, with @mentions, photos, files and voice notes; any message can become a task.
- **Inbox** — mentions, replies, assignments, approvals and followed activity, grouped by project.

Full spec in `/docs/collaboration.md`. Internal users only.
- **Command palette** (⌘K) and **saved views** on every table.
- **Profile** — name, photo, password, two-factor, notification preferences, sign out everywhere.

---

## Admin

Sets the business up and sees across every project. Owns contract and payments (2.4, 3.4, 5.6, 8.6, 9.4) and close-out (9.2).

**Key features**
- Create projects and assign the team
- Invite users, assign role and projects, deactivate; edit role permissions
- Configure the process: stages, sub-tasks, gates, checklists, item categories and codes (B3), approval SLAs
- Payment milestones tied to gates; block the next stage when a payment gate is unmet
- Approve variations above a threshold; override gates with a reason
- Portfolio dashboards and reports; masters (vendors, materials, finishes, rates)

| Screen | Shows | Actions |
| --- | --- | --- |
| Home / Portfolio | All projects: stage, health, next gate, payments due | Filter, open project |
| Project setup | Client, site, scope, B1, B2, team | Create, edit, assign, archive |
| Project overview | StageTracker 1–9, open gates, approvals, issues, payments | Override gate (with reason), reassign |
| Users | People, role, projects, status, last seen | Invite, resend invite, change role, deactivate |
| Permissions | Role × module grid (view / edit / approve) | Edit; every change audited |
| Payments | Milestones per project, due, received, overdue | Record payment, remind, mark gate met |
| Variations | Changes after docket lock with cost and time impact | Approve, reject, comment |
| Process settings | Stages, sub-tasks, gates, checklists, SLAs | Edit templates |
| Masters | Categories and codes, materials, finishes, vendors, rates | Add, edit, retire |
| Reports | Delay by stage, approval turnaround, budget vs actual, margin, vendor ratings | Export |
| Audit log | Every sensitive change | Search, export |

---

## Designer

Owns the client relationship and the design from discovery to handover: stages 1–3, docket (4.1), GFC drawing client approval (4.4), dispatch go-ahead (7.1), QC, styling and handover (8).

**Key features**
- Discovery questionnaire with structured room-wise needs, B1, B2
- Upload floor plans, concept decks, renders, mood boards (versioned)
- First-cut and final BOQ from the item master and rates
- Record client approvals with version and proof
- Docket builder: add items, auto-generate codes, classify (B3), submit and lock
- Raise and track variations; approve site surveys, readiness, dispatch go-ahead, QC and snags
- Generate the handover pack

| Screen | Shows | Actions |
| --- | --- | --- |
| Home | Approvals waiting, items blocked on me, meetings | Open, chase |
| My projects | Assigned projects, stage, next action | Open, filter |
| Discovery | Budget, timeline, rooms, services, style, B1, item types, B2 | Fill (autosave), mark complete |
| Site survey review | Measurements, photos, service notes | Approve, send back |
| Design files | Floor plan, concept, renders, mood board by version | Upload, share, record feedback |
| BOQ builder | Room-wise lines, qty, rates, totals; first-cut vs final | Edit, PDF, record approval |
| Client approvals | Every approval: what, version, sent, due, status | Send, remind, record with proof |
| Samples | Approved materials and finishes, master-sample location | Add, approve, link to items |
| Docket | Items with code, room, category, route, drawing link | Add, bulk import, submit and lock |
| Variations | Changes after lock, cost and time impact | Raise, send to client, track |
| Project tracker | Every item's status across GFC, procurement, factory, vendors, site | Filter by room or status, chase owner |
| QC and snags | Snags by room with photos, owner, due | Raise, verify, close |
| Handover | Checklist, pack, client sign-off (B10) | Generate pack, record sign-off |

---

## GFC team

Turns the locked docket into buildable drawings and BOMs, and releases each item: 4.2 review, 4.3, 4.4 submission, 4.5 specs.

**Key features**
- Queue created automatically when a docket locks (one task per item)
- Versioned GFC drawings with revision reasons
- BOM per item linked to the material master; cutting-list export
- Internal technical check before client submission
- Submittal register with due dates and outcomes
- Release to production — only client-approved items; routed by B3
- Variation impact: pull back released items affected by a change

| Screen | Shows | Actions |
| --- | --- | --- |
| Home / GFC queue | Items awaiting drawings by project and due date | Pick up, assign |
| Final measurements | Room-wise final dimensions and reference lines | Review, request re-measure |
| Item workspace | Docket details, references, samples, drawing versions, BOM | Upload drawing, build BOM, notes |
| BOM editor | Material and hardware lines per item | Add, copy from similar item, export |
| Technical check | Drawings awaiting internal check | Approve, return with comments |
| Submittal register | Packages sent for client approval, days pending | Submit, chase, record outcome |
| Release to production | Approved items and their route | Release one or in bulk |
| Revisions and variations | Items affected after release | Revise, resubmit, re-release |

---

## Procurement team

Buys goods: bought-in items for clients and raw materials for the factory (5.1, 5.2).

**Key features**
- Purchase requests auto-created from released bought-in items and factory BOM shortfalls
- Lead-time planner: long-lead and imported items first
- Quote comparison → purchase order with drawing, sample reference, spec, date, terms
- Expediting tracker with delay flags; import tracking (shipment, customs)
- Inward inspection with photos; accept, partial, reject
- Inventory and warehouse, including client items held until site is ready

| Screen | Shows | Actions |
| --- | --- | --- |
| Home | Items to order by lead time, late POs, deliveries today | Act |
| Purchase requests | Items to buy, need-by date, lead time | Group, quote, convert to PO |
| Quote comparison | Vendor quotes side by side | Select vendor with reason |
| Purchase orders | All POs, vendor, value, promised date, status | Create, send, amend, cancel |
| Expediting board | POs by status, late flags | Update dates, log follow-up, escalate |
| Imports | Shipments, ETA, customs status, documents | Update, attach |
| Goods receipt | Deliveries due, inspection results | Receive, inspect, accept or reject |
| Inventory and warehouse | Stock by material and location; client items held | Issue to factory, reserve, move to dispatch |
| Vendor directory (shared) | Suppliers, categories, ratings, history | Add, rate, deactivate |

---

## Vendor team

An internal team managing outsourced services — civil, MEP, ceiling, painting, stone and glass fitting, wallpaper, curtains and blinds. Vendors never log in; INV Compass is internal only. Owns vendor work in 6.2, 6.3, 7.4, 7.5.

**Key features**
- Work packages from released service items (B3)
- Vendor selection and work orders with rates, milestones, retention
- Vendor scheduling in step with dispatch and site readiness
- Progress reported vs verified on site, with photos
- Vendor bills matched to verified work
- Vendor performance ratings

| Screen | Shows | Actions |
| --- | --- | --- |
| Home | Vendor work this week, work to verify, bills to check | Act |
| Work packages | Service items by project and room | Create, assign vendor |
| Work orders | Vendor, scope, value, milestones, dates | Issue, amend, close |
| Vendor schedule | Calendar by site and room | Book, reschedule, notify on-site |
| Progress and measurement | Reported vs verified work, photos | Verify, query, approve milestone |
| Vendor bills | Bills, matched work, payment status | Check, approve, hold |
| Vendor performance | On-time %, snags, rework, rating | Rate, note |

---

## Factory team

Works downstream: receives items released by GFC (with approved GFC drawings and BOM) and raw materials from Procurement, then makes millwork and loose furniture in installation order: 4.5 mock-ups, 5.3, 5.4, 5.5. Used on tablets and phones on the shop floor.

**Key features**
- Incoming queue: receive items released by GFC, check the GFC drawing and BOM are complete, accept or send back with a reason
- Receive raw materials issued by Procurement against each production order
- Production orders from received factory items, grouped by project and room
- Material check against BOM; shortfalls raise purchase requests
- Planning by site-ready date and work-centre load
- Job cards per item, updated step by step from a phone or tablet
- QC at each step against the master sample, with photos; rework log
- Packing with QR labels (project, room, item code, install sequence)

| Screen | Shows | Actions |
| --- | --- | --- |
| Home | Items newly received, today's plan, QC waiting, items ready to pack | Act |
| Incoming | Items released by GFC with drawing, BOM and need-by date; materials issued by Procurement | Accept, send back to GFC with reason, confirm material receipt |
| Production orders | Received items, need-by date, material status | Plan, flag missing material |
| Production plan | Calendar and load by work centre | Schedule, reprioritise |
| Job card (mobile) | Drawing, BOM, current step, instructions | Start step, complete step, log issue |
| Item tracker | Each item's current step | Filter by project or room |
| QC checks | Items awaiting QC, checklist, master sample | Pass, fail with photos, send to rework |
| Rework log | Failed items, reason, time lost | Close |
| Packing and labels | Items ready to pack, label preview | Print QR labels, mark packed |
| Material requests | Shortfalls raised to Procurement | Raise, track |

---

## On-site team

Measures, runs site works, receives and installs, supports QC and handover: 1.2, 4.2, Stage 6, Stage 7, 8.1, 8.3, 9.1. **Mobile-first, works offline.**

**Key features**
- Offline-capable app; queued actions sync automatically
- Room-wise measurement capture with photos and sketches
- Daily site report (manpower, work, photos, issues, vendors present)
- Readiness checklist per room (B7) that unlocks dispatch
- Dispatch batches (B8): scan QR at loading and at receipt; log damage
- Installation checklist per item with photo proof
- Snag fixing with proof photos; warranty visits

| Screen | Shows | Actions |
| --- | --- | --- |
| Today | Sites, tasks, vendors expected, deliveries due | Check in, open site |
| Site survey | Rooms, dimensions, photos, service points, access | Capture, submit for approval |
| Final measurement | Room-wise final dimensions | Capture, submit to GFC |
| Daily report | Manpower, work done, photos, issues | Submit |
| Site works | Civil, MEP, ceiling, paint tasks by room | Update, verify vendor work |
| Room readiness (B7) | Checklist per room | Tick, photo, mark ready |
| Dispatch batch (B8) | Batch items, vehicle, slot | Scan at loading, confirm |
| Receive at site | Expected vs scanned items, damage | Scan, accept, report damage |
| Installation | Items per room, drawing, sequence | Mark installed with photo, raise issue |
| Snags | Assigned snags, due, photos | Fix, upload proof |
| Service requests | Warranty issues after handover | Schedule visit, close with photo |

---

## Notifications

- **Gate reached** → next owner (docket locked → GFC; drawing approved → Factory / Procurement / Vendor team; room ready → dispatch)
- **Approval waiting** → designer, as due date nears
- **Late** → owner and Admin (PO, production step, vendor work, snag)
- **Payment due or overdue** → Admin and designer
- **Variation raised** → GFC, Factory, Procurement if a released item is affected

## Open questions

- Separate Project Manager role?
- Separate factory planner role vs shop-floor staff?
- Separate accounts role, or within Admin?
