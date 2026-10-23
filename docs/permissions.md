# INV Compass — Auth, Roles and Permissions

Goal: every person sees and changes only what their role and their projects allow, and this holds even if someone types a URL, calls the API directly or opens a file link.

---

## 1. Access model

Access = **role permission** AND **project membership** (except Admin).

1. **Role** — each user has exactly one role: `admin`, `designer`, `gfc`, `procurement`, `vendor_team`, `factory`, `onsite`.
2. **Permissions** — a role holds a set of permission keys in the form `module.action`, for example `docket.edit`, `gfc_drawings.approve`. Admin edits the role → permission mapping from the Permissions screen.
3. **Project membership** — a user sees a project and its records only if they are in `project_members` for that project. Admin bypasses membership.
4. **Per-user overrides** (optional, v2) — grant or revoke a single permission for one user; recorded in the audit log.

Default is **deny**. Anything not granted is not visible.

### Actions

| Action | Meaning |
| --- | --- |
| `view` | See records of this module |
| `edit` | Create and change records |
| `approve` | Pass a gate, approve a version or a variation |
| `delete` | Archive records (Admin only by default) |

---

## 2. Modules and default access matrix

Edit includes view. Approve is listed separately. "—" means hidden.

| Module key | Admin | Designer | GFC | Procurement | Vendor team | Factory | On-site |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `projects` | edit | view | view | view | view | view | view |
| `discovery` (brief, design files) | view | edit | view | — | — | — | view |
| `boq` (pricing) | edit | edit | — | view | view | — | — |
| `approvals` (client approvals) | view | edit | view | — | — | — | — |
| `docket` (items) | view | edit | view | view | view | view | view |
| `variations` | edit + approve | edit | view | view | view | view | view |
| `gfc_drawings` (and BOM) | view | view + approve | edit | view | view | view | view |
| `procurement` (POs, inventory, imports) | view | view | — | edit | view | view | view |
| `vendor_work` (work orders, vendor bills) | view | view | — | view | edit | — | view |
| `production` (orders, job cards, QC) | view | view | view | view | — | edit | view |
| `site` (reports, measurements, readiness) | view | view | view | — | view | view | edit |
| `dispatch` (batches, receipt, installation) | view | edit (go-ahead) | — | view | view | view | edit |
| `snags_handover` | view | edit + approve | — | — | view | view | edit |
| `payments` | edit | view | — | — | view (vendor bills only) | — | — |
| `tasks` (create, assign, comment) | edit | edit | edit | edit | edit | edit | edit |
| `discussions` (threads, messages) | edit | edit | edit | edit | edit | edit | edit |
| `masters` (categories, materials, vendors, rates) | edit | view | view | view | view | view | — |
| `reports` | edit | view | view | view | view | view | — |
| `users_roles` | edit | view | — | — | — | — | — |
| `settings` (process, gates, SLAs) | edit | view | — | — | — | — | — |
| `audit_log` | view | view | — | — | — | — | — |

**Tasks and discussions:** every role can create and assign tasks and post in discussions, but only on projects they are members of and only on records they can view. A thread inherits access from its record (`can_view_entity(entity_type, entity_id)`), so `discussions.edit` never widens access. Personal tasks are visible only to creator and assignee. Users can edit or delete only their own messages (delete within 15 minutes); Admin can remove any message, logged. See `/docs/collaboration.md` §5.

**Designer default:** Designers have at least `view` on every module, so they can follow any item across GFC, procurement, factory, vendors and site. They still see only the projects they are members of.

Seed `role_permissions` from this table. Changes to the matrix are made in the app by Admin and logged.

**Field-level rule:** prices, margins and client payment data are visible only to roles with `boq.view` or `payments.view`. Other roles see items without cost columns.

---

## 3. Database enforcement (Supabase RLS)

### Helper functions (SQL, `security definer`, `stable`, `search_path` pinned)

- `auth_role()` → the current user's role from `profiles`.
- `is_admin()` → `auth_role() = 'admin'`.
- `has_permission(module text, action text)` → true if the user's role holds `module.action` (edit implies view).
- `is_project_member(p_project_id uuid)` → true if admin or a row exists in `project_members`.

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
- Cost columns live in separate tables or views protected by `boq.view` (Postgres RLS is row-level, so hide columns by splitting tables or using secured views).
- Gate transitions (for example release to production) happen in `security definer` functions that check the gate conditions and the caller's `approve` permission, and write to `audit_log`.
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

## 6. Audit log

`audit_log` records: actor, action, entity type and id, project id, before/after (JSON diff), IP, user agent, timestamp. Written by triggers or by the gate functions; insert-only (no update or delete policy for anyone). Admin can view and export.

Logged events at minimum: sign-in failures (aggregated), invites, role and permission changes, project membership changes, approvals, gate passes and overrides, variations, payments, deactivations, exports.

---

## 7. Access tests (the referee)

Playwright tests in `tests/e2e/access/` plus SQL tests for policies:

1. Seed one test user per role, two projects (A and B), with each user a member of A only.
2. For every module × role: assert allowed actions succeed and forbidden ones fail — through the UI, the server actions, and direct Supabase API calls with that user's token.
3. Assert no user except Admin can read anything in project B.
4. Assert cost fields are absent for roles without `boq.view`.
5. Assert forbidden URLs show the no-access page and do not reveal whether the record exists.
6. Assert search, notifications, inbox, threads, @mentions, email digests, Slack posts and file URLs never return out-of-scope data; @mentioning someone without access is blocked.
7. Output a role × module table (allowed / blocked) in the test report; it must match section 2.

Any new table, module or screen adds its cases here. A failing access test blocks the merge.
