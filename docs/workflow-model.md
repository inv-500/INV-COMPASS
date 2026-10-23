# INV Compass — Workflow Model

The rules behind the pipeline in `/docs/process-flow.md`: how stages, statuses, tracks, ownership and visibility work. These were decided in conversation with the founder and are the source of truth until changed here.

Everything below is configurable data except what is marked **fixed**.

---

## 1. Levels of progress

| Level | What it is | How its status is set |
| --- | --- | --- |
| **Item** | One docket line. The real unit of work | Moved by actions; correctable by hand (section 3) |
| **Task** | A step in a stage, assigned to a person or role | Same as items |
| **Track (workstream)** | Track A or Track B on one project. A real record with its own owner and health | **Calculated** from its items and tasks |
| **Stage** | A step in the pipeline | **Calculated**; a stage has no status of its own |
| **Project phase** | The Stage Tracker position | **Calculated** |

Nobody types a status on a track, stage or project. The only manual action at those levels is **On hold** or **Cancel**, with a reason.

---

## 2. Statuses and health

### Status (tasks, tracks, items)

| Status | Meaning | Reason required | Bucket |
| --- | --- | --- | --- |
| Not started | Nothing begun. Shows "Unassigned" if there is no owner | No | not started |
| In progress | Being worked on | No | in progress |
| On hold | Paused on purpose. Clock stops, no lateness alerts, shown grey | Yes | blocked |
| Blocked | Waiting on something. Shows who must act, shown red | Yes | blocked |
| Done | Finished | No | done |
| Cancelled | No longer needed | Yes | done |

**Fixed:** every status label maps to one of four buckets (not started, in progress, blocked, done). Admin can rename labels and add new ones, but each must map to a bucket, so rollups always work.

### Health (calculated, never typed)

| Health | Rule (thresholds configurable) |
| --- | --- |
| On track | Inside the planned dates |
| At risk | Due within 2 days, or something it depends on is late |
| Delayed | Past due and not done |

Health sits beside status. Work can be "In progress" and "Delayed" at once.

### Rollup rules
- A track is *In progress* when any of its items is in progress. It is *Done* only when every item is Done or Cancelled.
- Any blocked item makes the track blocked and shows the reason on the track and project.
- Health of a track is the worst health of its items.
- On hold items do not count as late.

---

## 3. How a status changes

**Action first, manual allowed, override logged.**

1. **By an action (default).** Most moves follow a real event. GFC drawing approved → item *Released*. Job card started → *In production*. QC passed → *Ready*. Batch dispatched → *Dispatched*. Receipt recorded → *Received*.
2. **Manually, with guardrails.** The acting role can move a status by hand when something happened outside the app.
   - Only the acting role for that step, or Admin "on behalf of", can do it.
   - Required fields or proof (for example a photo for installation).
   - Moving backwards needs a reason. Passing a gate follows the gate's strictness.
   - Undo is available for a short window.
3. **Override.** A role with override rights can force a change with a reason.

Every change records **how** it happened: *by system*, *by Ravi (manual)*, or *by Admin on behalf of GFC*. This shows in Activity.

Admin can set each transition to **Automatic only**, **Manual only** or **Both** (default: Both). Judgment steps such as client approval default to Manual with proof.

---

## 4. Tracks and visibility

- A project has one or two tracks, from its scope (A, B or both). Track records are created when the design is released.
- **Every open track always shows on the project page** for every project member: name, current stage, progress (for example 14 of 31 items ready), health, "waiting on", and expected finish.
- **Detail follows permissions.** Tasks, files, drawings, rates and discussion threads show only to roles with access to those records.
- Factory lands on Track B expanded and Track A as a summary line. Vendor team the reverse. Designer and Admin see all tracks expanded.
- There is **no single combined progress percentage**. Show one bar per track.
- Tracks not in scope are never shown.
- **Per-room readiness:** a room is *site-ready* when its Track A work is done (if any) and its Track B items are ready. Installation runs room by room.
- Dependencies between tracks (for example final measurements waiting on civil work) show on both sides.

---

## 5. Snags

A snag is its own record (title, photo, room, item, owner, due date, status). It can be raised at the Factory QC, receipt at site, installation, or the final walkthrough. An item keeps its status while its snags are open. Snags are tracked in Stage 7, and handover needs zero open snags or written client acceptance.

---

## 6. Ownership, approvals and delegation

### Who acts
- **Every step names an acting role** (Settings). The acting role can start, block or complete it without Admin.
- **Admin mostly monitors.** Admin can act, and the log reads "on behalf of".
- **Separate doing from approving.**
  - GFC prepares drawings, the Designer approves.
  - Designer prepares the BOQ, **Procurement** verifies and approves it.
  - Procurement prepares the cost sheet and PO, and finance approval is recorded.
  - Nobody approves their own work.

### Ball in court ("waiting on")
Every approval, handoff, PO, drawing, dispatch batch and snag has a **waiting on** field: a role first, then the person once someone picks it up. The project page lists "waiting on" by role. Every change is logged.

### External approvals (people without a login)
Used for finance approval of POs and for anyone outside the app.

- Fields: what is approved, amount, approver name, channel (WhatsApp, email, signed PO, verbal), date, proof file, who recorded it.
- Flow: Procurement requests approval → Admin and the task owner see it in their Inbox → the decision is obtained outside the app → Admin or Procurement records it with proof → the PO moves on, or returns with a reason if rejected.
- Default strictness: **require** (a PO cannot be released without a recorded approval, except by Admin override with a reason).
- If Finance gets a login later, this becomes a normal `approve` permission.

### Payment milestone flags
- Milestones are set per project by Admin (default two: design frozen, final after completion).
- Amounts and payment records are visible to **Admin only**. Everyone else sees only the flag *received / pending*.
- Gates read the flag. Defaults: Milestone 1 before release to tracks (*require*), final before project close (*require*).

### Team leads and delegation
- **Team lead** is a flag on a user, not a new role. Team leads reassign and reschedule work within their team.
- Anyone can name a **deputy** for a date range. Their tasks and "waiting on" items move across.
- **Escalation:** a late task nudges the assignee, then the team lead, then the Designer. It reaches Admin only when blocked or delayed beyond a configured limit.

### Overrides
- Designer can override *warn* gates on their own projects, with a reason.
- Admin handles *require approval* and *block* gates.
- Overrides are shown on the project and in Activity.

### Admin home (exceptions only)
Projects with blocked or delayed tracks and who holds them; items waiting more than N days; finance approvals waiting to be recorded; gate overrides this week; workload by team.

---

## 7. Required changes to other documents

Apply these when updating the repo docs. Each is a decision from the founder or a proposal he approved.

**`/docs/permissions.md`**
- Rename `audit_log` to **Activity** (table `activity_log`). Project Activity visible to project members, filtered by record permissions. System Activity Admin-only.
- `payments`: **Admin only**. Remove Designer and Vendor-team view. Everyone else sees only the milestone flag.
- `boq`: Admin edit; Designer edit; **Procurement view + approve** (verification). Remove Vendor team.
- New module `cost_sheets`: Admin view, Procurement edit. No other role.
- `purchase_orders`: Procurement edit (stores ERP PO number and file); Admin view. PO rates visible to Admin and Procurement only. Factory sees POs without rates.
- Work-order rates: Admin and Vendor team (open: Procurement as well).
- Add `external_approvals` (record: Admin, Procurement; view: project members without amounts).
- Designer is the project manager; can view every module but only on own projects.
- Add `team_lead` flag and delegation (section 6).

**`/docs/data-model.md`**
- `projects.scope` array: `millwork`, `loose_furniture_bought_in` ("Loose furniture and bought-in"), `onsite_services`.
- `workstreams`: project_id, track (`A`/`B`), owner_id, status, health, now_with_role, now_with_user (status and health calculated).
- `stage_templates` (phase, track, order, opens_when_scope, acting_role, archived_at) and `task_templates` (stage, code, acting_role, approver_role, gate_strictness, depends_on, transition_mode).
- `item_status_events`: item_id, from, to, source (`system`/`manual`/`admin_on_behalf`), actor, reason, proof_file_id.
- `payment_milestones` (project_id, name, order, gate_stage, status) visible to members; `payment_milestone_amounts` (amount_paise, received_on, recorded_by) **Admin only**.
- `boq_versions`: add `verified_by`, `approved_by` (Procurement), timestamps.
- `cost_sheets`: project_id, track, version, file_id, total_paise (restricted), prepared_by, erp_uploaded_at.
- `purchase_orders`: **no PO creation in Compass.** Fields: `erp_po_number` (unique), `po_file_id`, status (`draft`, `awaiting_finance`, `approved`, `released`, `received`), external_approval_id, now_with_role.
- `external_approvals`: entity, status, amount_paise (restricted), approver_name, channel, decided_on, proof_file_id, recorded_by, reason.
- `snags`: independent record linked to project, room, item.
- `profiles.is_team_lead`; `delegations` (user_id, deputy_id, from, to).
- Statuses: enum plus `status_labels` mapping to the four buckets. Archive, never delete, stages and templates in use.
- Item code `PROJECT-ROOM-CATEGORY-NN`. `created_by` on `activity_log`.

**`/docs/roles-and-screens.md`**
- Project page: one row per open track; "waiting on" panel; per-room readiness.
- Procurement workspace: BOQ verification queue; cost sheet; PO register (ERP number and file); finance approval requests and recording; material mobilisation.
- Admin home: exceptions view (section 6). Admin payments screen with milestone amounts.
- Designer: BOQ preparation and client approval; design freeze; GFC approval.
- Remove finance, payment and rate views from the other roles.

**`/docs/mvp-scope.md`**
- Replace "Separate Project Manager role? (assumed no)" with the decision: **Designer is the project manager.**
- Rename audit log to Activity.
- Add ERP number-and-file storage in R4a (Procurement); ERP integration is later.
- Move external approvals and payment milestone flags into R2/R4a as needed.

**`/docs/collaboration.md`**
- Process tasks come from the new stage templates; reference `workflow-model.md` for statuses.
- Add "waiting on" to Inbox and task views.

**`/docs/process-flow.md`** — already rewritten.

**`CLAUDE.md`**
- Source documents: process-flow is the nine-stage pipeline with tracks; add `workflow-model.md` and `configurability.md`.
- Open decisions: Designer is the project manager (decided).
- Folder names: `designer/` and `vendor-team/`, not `design/` and `vendors/`.
- Security rule 4: "audit_log" becomes Activity.

---

## 8. Not building in v1
- A visual workflow builder. Admin edits templates as lists.
- Manual dragging of project or track status.
- Nested tracks inside a track.
- ERP integration (PO number and file are stored by hand).
- A Finance login.
