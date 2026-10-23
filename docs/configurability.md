# INV Compass — Configurability

> **Draft – confirm.** This file was not supplied. It was written by collecting what `/docs/workflow-model.md` and `/docs/process-flow.md` already say about what Admin can change and what is fixed. Nothing here is new policy. Anything marked *(assumed)* is a gap the founder should confirm or correct.

Principle: INV Home's way of working lives in **data that Admin edits in Settings**, not in code. The product ships with sensible defaults taken from `/docs/process-flow.md`. Admin edits lists, not diagrams (there is no visual workflow builder in v1).

---

## 1. What Admin can configure

| Area | What Admin can change | Where it is stored | Notes |
| --- | --- | --- | --- |
| Stages | Name, order, phase (shared, execution, closing), which track, when it opens (from project scope), acting role, SLA days | `stage_templates` | Stages in use are archived, never deleted |
| Sub-tasks | Code, name, acting role, approver role, start and done conditions, dependencies, SLA days | `task_templates` | Same archive rule. New projects use the current templates; running projects keep what they have *(assumed)*. **Admin can add an optional GFC check back as a sub-task** (for example after B1) if INV Home wants one; it is not in the default pipeline |
| Gates | What must be true (none, internal approval, client approval, payment flag, checklist) and how strict it is (**warn**, **require**, **require approval**, **block**) | `task_templates.gate_type`, `gate_strictness` | Defaults are written beside each gate in the process flow |
| Transition mode | For each status change: **Automatic only**, **Manual only**, or **Both** (default Both) | `task_templates.transition_mode` | Judgment steps such as client approval default to Manual with proof |
| Status labels | Rename labels and add new ones | `status_labels` | Every label must map to one of the four buckets (see section 2) |
| Health thresholds | When work becomes *At risk* (default: due within 2 days or a dependency is late) and *Delayed* (past due, not done) | Settings | Health itself is calculated, never typed |
| Payment milestones | Names, order and the stage each one gates, per project (default two: design frozen, final) | `payment_milestones` | Amounts are Admin-only |
| Escalation | How long before a late task goes from assignee to team lead to Designer, and the limit before it reaches Admin | Settings | Default order: assignee, team lead, Designer, Admin (only when blocked or delayed beyond the limit) |
| Admin exceptions | The "N days" for items waiting too long on the Admin home | Settings | |
| Item categories and codes | Category codes and names, default classification, default lead time | `item_categories` | Item code format is `PROJECT-ROOM-CATEGORY-NN` |
| Approval turnaround (SLAs) | Working days allowed per approval | `stage_templates`, `task_templates` | Overdue approvals are flagged |
| Roles and permissions | The role × module grid (view, edit, approve, gate overrides) | `role_permissions` | Every change is recorded in Activity |
| Required two-factor | Which roles must use two-factor sign-in | Settings | Admin is always required |
| Notification defaults | Which events notify whom, quiet hours | Settings | Users set their own delivery preferences within these |
| Masters | Vendors, materials, finishes, rates | Masters screens | Rates are visible to Admin and Procurement only |

## 2. What is fixed (not configurable)

- **Four status buckets**: not started, in progress, blocked, done. Labels can change; the buckets cannot, so rollups always work.
- **Calculated, never typed**: the status of a track, stage and project, and all health. The only manual action at those levels is **On hold** or **Cancel**, with a reason.
- **Rollup rules** (a track is done only when every item is Done or Cancelled; any blocked item blocks the track; track health is the worst health of its items; On hold items do not count as late).
- **Reasons are required** for On hold, Blocked and Cancelled.
- **Nobody approves their own work.**
- **Every status change records how it happened**: by system, by hand, or by Admin on behalf of a team.
- **Access rules**: default deny, project membership, row-level security, invite-only sign-in, money split by audience (see `/docs/permissions.md`). Admin cannot turn these off.
- **Activity is insert-only**: nothing in it can be edited or deleted.
- **Stages and templates in use are archived, never deleted.**
- **Internal use only**: no client or vendor portal.

## 3. What is not built in v1

- A visual workflow builder (Admin edits templates as lists)
- Manual dragging of project or track status
- Nested tracks inside a track
- ERP integration (the PO number and file are stored by hand)
- A Finance login (finance approval is recorded by Admin or Procurement as an external approval)

## 4. Who may change settings

- **Admin** edits Settings (`settings.edit`). Designers and other roles cannot see or change them.
- Overriding a gate on a running project is a separate permission: the Designer for *warn* gates on their own projects, Admin for *require approval* and *block* gates, always with a written reason.

## 5. Questions for the founder

1. When Admin edits a template, does it change projects already running, or only new projects? *(assumed: only new projects)*
2. Is "block" a fourth strictness beyond "require approval", or are they the same thing? `process-flow.md` uses "warn", "require" and "require approval"; `workflow-model.md` mentions "block" gates.
3. May Procurement or a team lead edit the templates for their own team, or is it Admin only? *(assumed: Admin only)*
