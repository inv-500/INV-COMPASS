# INV Compass — Auth, Roles and Permissions

Goal: every person sees and changes only what their role and their projects allow, and this holds even if someone types a URL, calls the API directly or opens a file link.

How work moves, who acts and who approves is defined in `/docs/workflow-model.md` and `/docs/process-flow.md`. This file defines who may see and change what.

---

## 1. Access model

Access = **role permission** AND **project membership** (except Admin).

1. **Role** — each user has exactly one role: `admin`, `designer`, `gfc`, `procurement`, `vendor_team`, `factory`, `onsite`.
2. **Permissions** — a role holds a set of permission keys in the form `module.action`, for example `docket.edit`, `gfc_drawings.approve`. Admin edits the role → permission mapping from the Permissions screen.
3. **Project membership** — a user sees a project and its records only if they are in `project_members` for that project. Admin bypasses membership.
4. **The Designer is the project manager.** Admin assigns one Designer to each project. That Designer can view every operational module on their own projects (not finance modules, see section 2) and manages the project team. There is no separate Project Manager role.
5. **Team lead** is a flag on a user (`profiles.is_team_lead`), not a role. A team lead can reassign and reschedule work within their team (the users who share their role, on projects they are both members of).
6. **Deputies.** A user can name a deputy for a date range (`delegations`). The user's tasks and "waiting on" items move to the deputy. A deputy gets no extra permissions: the deputy must already be a member of the project and have the role permission, otherwise the hand-over is blocked with a message (same pattern as a blocked @mention).
7. **Per-user overrides** (optional, v2) — grant or revoke a single permission for one user; recorded in Activity.

Default is **deny**. Anything not granted is not visible.

### Actions

| Action | Meaning |
| --- | --- |
| `view` | See records of this module |
| `edit` | Create and change records |
| `approve` | Pass a gate, approve a version or a variation |
| `delete` | Archive records (Admin only by default) |
| `override_warn` | Pass a *warn* gate with a written reason (module `gates` only) |
| `override_require` | Pass a *require* or *require approval* gate with a written reason (module `gates` only) |

---

## 2. Modules and default access matrix

Edit includes view. Approve is listed separately. "—" means hidden. "own projects" means projects the user is a member of (Designer: projects where they are the assigned Designer or a member).

| Module key | Admin | Designer | GFC | Procurement | Vendor team | Factory | On-site |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `projects` | edit | view | view | view | view | view | view |
| `project_team` (members) | edit | edit (own projects) | view | view | view | view | view |
| `requirement` (brief, site documents, design files) | view | edit | view | — | — | — | view |
| `measurements` (site visit, final measurements) | view | edit | edit | — | view | view | edit |
| `boq` (what the client pays) | edit | edit | — | view + approve | — | — | — |
| `cost_sheets` (what INV Home pays, including PO rates and totals) | view | — | — | edit | — | — | — |
| `approvals` (client approvals with proof) | view | edit | view | — | — | — | — |
| `external_approvals` (finance and others without a login; amounts hidden from non-finance roles) | edit | view | view | edit | view | view | view |
| `docket` (items) | view | edit | view | view | view | view | view |
| `variations` (to confirm) | edit + approve | edit | view | view | view | view | view |
| `gfc_drawings` (drawings, BOM, engineering sheet) | view | view + approve | edit | view | view | view | view |
| `procurement` (PO register with ERP number and file, material mobilisation, goods receipt, inventory, imports) | view | view | — | edit | view | view | view |
| `vendor_work` (work packages, work orders, schedule, progress) | view | view | — | view | edit | — | view |
| `work_order_rates` | view | — | — | view | edit | — | — |
| `production` (orders, job cards, QC) | view | view | view | view | — | edit | view |
| `site` (reports, readiness, quality check of vendor work) | view | view | view | — | view | view | edit |
| `dispatch` (batches, receipt, installation) | view | view + approve (go-ahead) | — | view | view | edit | edit |
| `snags_handover` | edit | edit + approve | — | — | edit | edit | edit |
| `payments` (amounts and records) | edit | — | — | — | — | — | — |
| `payment_milestones` (the received / pending flag only) | edit | view | view | view | view | view | view |
| `tasks` (create, assign, comment) | edit | edit | edit | edit | edit | edit | edit |
| `discussions` (threads, messages) | edit | edit | edit | edit | edit | edit | edit |
| `masters` (categories, materials, vendors; rates need `cost_sheets.view`) | edit | view | view | view | view | view | — |
| `reports` (operational) | edit | view | view | view | view | view | — |
| `financial_reports` (cost vs BOQ, margin, vendor spend) | view | — | — | — | — | — | — |
| `users_roles` | edit | — | — | — | — | — | — |
| `settings` (stages, sub-tasks, gates, status labels, thresholds, SLAs) | edit | — | — | — | — | — | — |
| `activity` (project Activity) | view | view | view | view | view | view | view |
| `system_activity` (Activity across the whole system) | view | — | — | — | — | — | — |
| `gates` | override_warn + override_require | override_warn (own projects) | — | — | — | — | — |

**Notes**

- **Designer sees every operational module** on their own projects, so they can follow any item across GFC, procurement, factory, vendors and site. "Every module" does **not** include finance: `payments`, `cost_sheets`, `work_order_rates`, `financial_reports` and the system-wide pages (`users_roles`, `settings`, `system_activity`).
- **Tasks and discussions:** every role can create and assign tasks and post in discussions, but only on projects they are members of and only on records they can view. A thread inherits access from its record (`can_view_entity(entity_type, entity_id)`), so `discussions.edit` never widens access. Personal tasks are visible only to creator and assignee. Users can edit or delete only their own messages (delete within 15 minutes); Admin can remove any message, logged. See `/docs/collaboration.md` §5.
- **Doing and approving are separate.** GFC prepares drawings, the BOM and the engineering sheet, and passes them straight to the Designer, who approves (step B2). There is no check inside GFC. The Designer prepares the BOQ, Procurement verifies and approves it. Procurement prepares the cost sheet and PO, finance approval is recorded as an external approval. Nobody approves their own work: gate functions reject an approver who is the preparer.
- **Release to Procurement and Factory is done by the Designer** (after approving the GFC drawings). GFC does not release.
- **External approvals** (finance approval of POs, and anything given by a person without a login): Admin or Procurement records it with proof. Project members see that it exists and its status, never the amount.
- **Gate overrides:** the Designer can pass *warn* gates on their own projects, with a reason. Admin handles *require approval* and *block* gates. Every override is shown on the project and in Activity.
- Seed `role_permissions` from this table. Changes to the matrix are made in the app by Admin and logged.

### Field-level rule (money)

Money is split by audience. Postgres RLS is row-level, so cost columns live in separate tables or secured views.

| Money | Who can see |
| --- | --- |
| BOQ prices (what the client pays) | `boq.view`: Admin, Designer, Procurement |
| Cost sheets, PO rates and totals | `cost_sheets.view`: Admin, Procurement |
| Work-order rates | `work_order_rates.view`: Admin, Procurement, Vendor team |
| Payment amounts and records | `payments.view`: Admin only |
| Amounts on external approvals | Admin and Procurement only |

Everyone else sees items, POs and approvals without amounts. Payment milestones show everyone on the project only *received / pending*. Gates read the flag, not the money.

---

## 3. Database enforcement (Supabase RLS)

### Helper functions (SQL, `security definer`, `stable`, `search_path` pinned)

- `auth_role()` → the current user's role from `profiles`.
- `is_admin()` → `auth_role() = 'admin'`.
- `has_permission(module text, action text)` → true if the user's role holds `module.action` (edit implies view).
- `is_project_member(p_project_id uuid)` → true if admin or a row exists in `project_members`.
- `is_team_lead()` → the `profiles.is_team_lead` flag of the current user.
- `can_view_entity(entity_type text, entity_id uuid)` → used by threads, messages, Activity and notifications.

### Policy pattern for project-scoped tables

```sql
alter table items enable row level security;

create policy items_select on items for select
  using (is_project_member(project_id) and has_permission('docket','view'));

create policy items_insert on items for insert
  with check (is_project_member(project_id) and has_permission('docket','edit'));

create policy items_update on items for update
  using (is_project_member(project_id) and has_permission('docket','edit'))
  with check (is_project_member(project_id) and has_permission('docket','edit'));

-- no delete policy: archiving is an update; hard delete only via admin server action
```

Rules:

- Every table: RLS enabled, explicit `select / insert / update` policies, explicit `grant` to `authenticated` only. Nothing granted to `anon` except what the auth flow needs.
- Tables without `project_id` (masters, users) use `has_permission` only.
- Money columns live in separate restricted tables (for example `payment_milestone_amounts`, `external_approval_amounts`, PO rates) protected by the matching permission in the money table above.
- Gate transitions (for example release to Procurement and Factory, design frozen) happen in `security definer` functions that check the gate conditions, the caller's permission, that the approver is not the preparer, and the gate's strictness (warn, require, require approval, block), and write to `activity_log`.
- Status changes record how they happened (`system`, `manual`, `admin_on_behalf`) in `item_status_events`.
- Storage buckets mirror the same rules: object paths start with `project_id/`, policies call `is_project_member` and the module permission. Files are served through short-lived signed URLs.
- Realtime subscriptions rely on the same RLS; never broadcast on public channels.
- Index every column used in policies (`project_id`, `user_id`).

---

## 4. Server and UI enforcement

- Every server action and route handler starts with `requirePermission(module, action, projectId?)`, which reads the session server-side and throws a 403 on failure.
- The service-role client is used only in a small, reviewed set of server functions (inviting users, admin maintenance). Never in components.
- Navigation, routes and command-palette entries are generated from the user's permissions. Route groups have a layout guard that redirects to the no-access page.
- Search, exports and notifications query through the user's RLS session, never the service role.

---

## 5. Authentication flows

| Flow | Behaviour |
| --- | --- |
| **Invite** | Admin enters name, email, role, projects → user created in Supabase Auth with role in `profiles` → branded email from `invhome.in` with a one-time link valid 72 h |
| **Accept invite** | Link opens Set password (strength meter, min 12 characters) → signed in → lands on role home |
| **Sign in** | Email + password. Generic error "Email or password is incorrect" (never reveal which). Rate limited. |
| **Two-factor** | TOTP authenticator app. **Required for Admin**, optional for others (can be made required per role in Settings). |
| **Forgot / reset password** | Email link valid 1 h; always show "If this email exists, we've sent a link". |
| **Expired invite** | Friendly page with "Ask your Admin to resend the invite"; Admin can resend from Users. |
| **Session** | Sign out after 12 h of inactivity (configurable); "Sign out of all devices" in the user menu; Admin can force sign-out. |
| **Deactivate** | Admin deactivates → sessions revoked immediately, user cannot sign in, history kept. Users are never hard-deleted. |
| **Role change** | Takes effect on the next request; logged. |

There is no public sign-up page. The sign-up endpoint is disabled in Supabase Auth settings.

---

## 6. Activity (audit trail)

Activity is the single record of who changed what. Table `activity_log` records: actor, action, entity type and id, project id, before/after (JSON diff), how it happened (`system`, `manual`, `admin_on_behalf`), IP, user agent, `created_by`, timestamp. Written by triggers or by the gate functions; insert-only (no update or delete policy for anyone).

- **Project Activity** — visible to the project's members, filtered by record permissions (a member sees an entry only if they can view the record it is about).
- **System Activity** — Admin only: sign-ins, invites, role and permission changes, deactivations, exports. Admin can search and export.
- **No amounts in project Activity.** Money changes (payments, cost sheets, rates, external approval amounts) are recorded only in System Activity; the project feed shows that something changed, not the figure.

Logged events at minimum: sign-in failures (aggregated), invites, role and permission changes, project membership changes, approvals, external approvals, gate passes and overrides (with reason), status changes done by hand or on behalf, variations, payments, deactivations, exports.

---

## 7. Access tests (the referee)

Playwright tests in `tests/e2e/access/` plus SQL tests for policies:

1. Seed one test user per role, two projects (A and B), with each user a member of A only.
2. For every module × role: assert allowed actions succeed and forbidden ones fail — through the UI, the server actions, and direct Supabase API calls with that user's token.
3. Assert no user except Admin can read anything in project B.
4. Assert money is hidden correctly: payment amounts visible to Admin only; cost sheets and PO rates to Admin and Procurement only; work-order rates to Admin, Procurement and Vendor team only; BOQ prices to Admin, Designer and Procurement only. Everyone else sees milestone flags and POs without amounts.
5. Assert forbidden URLs show the no-access page and do not reveal whether the record exists.
6. Assert search, notifications, inbox, threads, @mentions, Activity, email digests, Slack posts and file URLs never return out-of-scope data; @mentioning someone without access is blocked; project Activity never contains amounts.
7. Assert nobody can approve their own work (BOQ, GFC drawings) and that gate overrides follow the rules (Designer: *warn* on own projects only; Admin: all).
8. Output a role × module table (allowed / blocked) in the test report; it must match section 2.

Any new table, module or screen adds its cases here. A failing access test blocks the merge.
