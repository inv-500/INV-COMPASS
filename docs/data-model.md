# INV Compass — Data Model (draft v0.2)

A starting model for review. Claude Code should refine it in the data-model step, list open questions, and get founder approval before writing migrations.

Conventions for every business table: `id uuid pk default gen_random_uuid()`, `created_at timestamptz`, `updated_at timestamptz`, `created_by uuid → profiles`, `archived_at timestamptz null`. Join tables and insert-only logs (`activity_log`, `item_status_events`, `message_edits`) skip `updated_at` and `archived_at`. Money in integer paise (`bigint`). RLS on every table (see `/docs/permissions.md`).

How statuses, health and tracks behave is in `/docs/workflow-model.md`. The stages and sub-tasks are in `/docs/process-flow.md`.

Plain names replace the old rule codes: **architect involved** (`has_architect`), **phases**, **item classification**, **room site-ready**, **dispatch batch**, **handover sign-off**. The codes B1–B5 now only mean the Track B steps.

---

## 1. The spine

```
projects ─┬─ project_members ── profiles (role)
          ├─ workstreams (Track A / Track B)
          ├─ rooms
          ├─ items (the docket) ─┬─ documents, approvals, external_approvals
          │                      ├─ gfc_drawings ── bom_lines            (Track B: millwork, loose furniture)
          │                      ├─ purchase_order_lines                 (Track B; bought-in)
          │                      ├─ production_orders                    (Track B: millwork, loose furniture)
          │                      ├─ work_order_lines                     (Track A: onsite service)
          │                      ├─ dispatch_batch_items
          │                      └─ item_status_events
          ├─ snags (own records, linked to project, room, item)
          ├─ tasks (process + ad-hoc) and threads → messages
          ├─ boq_versions, cost_sheets, purchase_orders (ERP number + file)
          ├─ variations (to confirm)
          ├─ payment_milestones (flag) → payment_milestone_amounts (Admin only)
          └─ site_reports, room_readiness_checks
```

The **item** is the unit that travels from design to handover. Every team updates the same item; its `classification` decides which track and queue it appears in.

---

## 2. People and access

**profiles** — one per auth user
- `user_id` (→ auth.users), `full_name`, `email`, `phone`, `role` (enum below), `is_team_lead` (bool), `avatar_url`, `status` (`invited` · `active` · `deactivated`), `last_seen_at`

**roles** — enum `app_role`: `admin`, `designer`, `gfc`, `procurement`, `vendor_team`, `factory`, `onsite`

**permissions** — `key` (`module.action`), `module`, `action`, `description`

**role_permissions** — `role`, `permission_key`

**user_permission_overrides** (v2) — `user_id`, `permission_key`, `effect` (`grant` · `revoke`), `reason`

**delegations** — `user_id`, `deputy_id`, `from_date`, `to_date`. The deputy takes over the user's tasks and "waiting on" items for the period. No extra permissions (deputy must already be a project member).

**invites** — `email`, `role`, `project_ids uuid[]`, `token_hash`, `expires_at`, `accepted_at`, `invited_by`

**activity_log** (formerly audit_log; the "Activity" in the app) — `actor_id`, `action`, `entity_type`, `entity_id`, `project_id`, `diff jsonb` (never contains amounts for project-visible rows), `source` (`system` · `manual` · `admin_on_behalf`), `scope` (`project` · `system`), `ip`, `user_agent`, `created_by`, `created_at` (insert-only)

---

## 3. Projects

**projects**
- `code` (short, unique, e.g. `VLA01`), `name`, `client_name`, `client_email`, `client_phone`
- `site_address`, `city`, `carpet_area_sqft`
- `project_type` (`villa` · `apartment` · `penthouse` · `office` · `hospitality` · `other`)
- `scope` — array of `millwork`, `loose_furniture_bought_in` (label "Loose furniture and bought-in"), `onsite_services` (at least one). `onsite_services` opens Track A; the other two open Track B. Decides which tracks open at release. Adding a scope later opens that track from then on.
- `has_architect` (bool) — architect involved; `architect_name`, `architect_contact`
- `phases jsonb` — phase name, rooms, target dates
- `project_manager_id` (→ profiles) — the assigned Designer
- `current_stage` (1–9) and `health` (`on_track` · `at_risk` · `delayed`) — **calculated, never typed**; `on_hold_at`, `on_hold_reason`, `cancelled_at`, `cancelled_reason` are the only manual project-level actions
- `budget_paise`, `contract_value_paise` *(finance, Admin only; split into a restricted table in the migration)*
- `start_date`, `target_handover_date`, `actual_handover_date`

**project_members** — `project_id`, `user_id`, `added_by`

**workstreams** — one per open track on a project: `project_id`, `track` (`A` onsite services · `B` millwork, loose furniture and bought-in), `owner_id`, `status` (calculated), `health` (calculated), `now_with_role`, `now_with_user_id`, `opened_at`. Created when the design is released to tracks.

**rooms** — `project_id`, `code` (e.g. `MBR`, `LIV`, `KIT`), `name`, `floor`, `phase`, `site_ready_at` (set when the room site-ready check passes)

---

## 4. Requirement, design and approvals

**briefs** — one per project (Stage 2): `budget_range`, `timeline_notes`, `style_notes`, `services jsonb`, `rooms_brief jsonb` (room-wise needs), `confirmed_at`, `confirmation_document_id` (proof)

**site_surveys** — `project_id`, `kind` (`initial` · `final`), `room_id`, `measurements jsonb`, `service_points jsonb`, `access_notes`, `photos` (documents), `submitted_by`, `confirmed_by`, `confirmed_at`

**documents** — generic files: `project_id`, `entity_type`, `entity_id`, `kind` (`floor_plan` · `concept` · `render` · `mood_board` · `gfc_drawing` · `engineering_sheet` · `photo` · `po_file` · `proof` · `handover` · `other`), `storage_path`, `version`, `file_name`, `mime_type`, `size_bytes`

**boq_versions** — what the client pays. `project_id`, `version`, `status`, `total_paise`, `prepared_by` (Designer), `verified_by`, `verified_at`, `approved_by`, `approved_at` (Procurement; cannot be the preparer), `client_approval_id`. Replaces the first-cut / final split: there is one BOQ, built in Stage 4.
**boq_lines** — `boq_version_id`, `room_id`, `item_id`, `description`, `qty`, `unit`, `rate_paise`, `amount_paise` *(visible to `boq.view`)*

**samples** — `project_id`, `material_id`, `finish`, `photo_document_id`, `approved_at`, `master_sample_location`

**approvals** — client and internal approvals: `project_id`, `entity_type` (`brief` · `concept` · `boq` · `design` · `gfc_drawing` · `handover` …), `entity_id`, `version`, `requested_by`, `approver_type` (`client` · `internal`), `approver_id` (internal), `status` (`pending` · `approved` · `approved_with_notes` · `changes_requested` · `rejected`), `due_at`, `decided_at`, `notes`, `proof_document_id` (required when recorded on behalf of the client), `now_with_role`, `now_with_user_id`

**external_approvals** — approvals from people without a login, mainly finance approval of POs: `project_id`, `entity_type`, `entity_id`, `status` (`requested` · `approved` · `rejected`), `approver_name`, `channel` (`whatsapp` · `email` · `signed_po` · `verbal`), `decided_on`, `proof_file_id`, `recorded_by`, `reason`, `now_with_role`
**external_approval_amounts** — `external_approval_id`, `amount_paise` *(restricted: Admin and Procurement)*

---

## 5. Docket and items

**items** — one per docket line
- `project_id`, `room_id`, `code` (`PROJECT-ROOM-CATEGORY-NN`, unique, e.g. `VLA01-MBR-WD-01`), `name`, `description`
- `category_id` (→ item_categories, e.g. `WD` wardrobe, `KT` kitchen, `PN` panelling, `SF` sofa)
- `classification` — `millwork` · `loose_furniture` · `onsite_service` · `bought_in` *(bought-in is to confirm: lighting, rugs, curtains, appliances, stone, glass; it uses Track B but skips GFC and Factory production)*; `item_type` optional detail (e.g. `lighting`, `stone`)
- `qty`, `unit`, `dimensions jsonb`, `material_spec jsonb`, `finish_spec jsonb`, `hardware_spec jsonb`
- `status` — one of the configurable status labels, each mapped to a bucket (see section 13); `blocked_reason`
- `lifecycle_step` (below), `now_with_role`, `now_with_user_id`
- `need_by_date`, `lead_time_days`
- `design_frozen_at` (copied from the docket), `released_at`, `installed_at`

**Lifecycle steps** (where the item is; the generic `status` says how it is going)

| Classification | Steps |
| --- | --- |
| Millwork, Loose furniture | `draft` → `in_docket` → `in_gfc` → `awaiting_drawing_approval` → `released` (Designer approved the GFC drawings and released to Procurement and Factory) → `in_production` → `ready` → `dispatched` → `received_at_site` → `installed` → `handed_over` |
| Bought-in (to confirm) | `draft` → `in_docket` → `released` → `ordered` → `ready` (goods received and inspected) → `dispatched` → `received_at_site` → `installed` → `handed_over` |
| Onsite service | `draft` → `in_docket` → `released` → `work_ordered` → `ready` (vendor work passed quality check) → `installed` (site work complete) → `handed_over` |

Side states: `on_hold`, `cancelled` (via variation). An item keeps its step while its snags are open; there is no "snag open" step.

**item_status_events** (insert-only) — `item_id`, `from_status`, `to_status`, `from_step`, `to_step`, `source` (`system` · `manual` · `admin_on_behalf`), `actor_id`, `reason`, `proof_file_id`, `created_at`

**dockets** — `project_id`, `version`, `status` (`draft` · `frozen`), `frozen_by`, `frozen_at`. "Design frozen" is the moment the docket locks; releasing to tracks needs design frozen and milestone 1 received.

**item_categories** (master) — `code`, `name`, `default_classification`, `default_lead_time_days`

---

## 6. GFC

**gfc_drawings** — `item_id`, `version`, `document_id`, `engineering_sheet_document_id`, `status` (`draft` · `awaiting_designer_approval` · `approved` · `returned` · `superseded`), `prepared_by`, `approved_by` (Designer, never the preparer), `approved_at`, `revision_reason`, `now_with_role`, `now_with_user_id`

**bom_lines** — `item_id`, `gfc_drawing_id`, `material_id`, `description`, `qty`, `unit`, `stock_status` (`in_stock` · `to_buy`, set by Procurement), `notes`

Later: the old submittal register for client sign-off of GFC drawings (`submittals`) is not in v1. The Designer approves GFC drawings against the approved design; client sign-off of GFC drawings may return later. GFC completes the drawing, BOM and engineering sheet and passes them straight to the Designer; there is no check inside GFC.

---

## 7. Procurement (Compass tracks the PO; the ERP creates it)

**vendors** (master, shared with Vendor team) — `name`, `type` (`supplier` · `service` · `both`), `categories text[]`, `gstin`, `contact`, `payment_terms`, `rating`, `status`

**materials** (master) — `code`, `name`, `category`, `unit`, `default_vendor_id`, `lead_time_days`

**cost_sheets** *(Admin view, Procurement edit)* — `project_id`, `track` (`A`/`B`), `version`, `file_id`, `total_paise`, `prepared_by`, `erp_uploaded_at`

**purchase_orders** — **Compass never creates POs.** `project_id`, `vendor_id`, `erp_po_number` (unique), `po_file_id`, `status` (`draft` · `awaiting_finance` · `approved` · `released` · `received`), `external_approval_id`, `promised_date`, `expected_date`, `is_import`, `now_with_role`, `now_with_user_id`
**purchase_order_lines** — `po_id`, `item_id` or `material_id`, `qty`, `spec_reference`, `sample_id`
**purchase_order_rates** *(restricted to `cost_sheets.view`)* — `po_line_id`, `rate_paise`; `total_paise` on `purchase_order_totals`

**purchase_requests** — lines to buy from the BOM stock check or a bought-in item: `project_id` (nullable for factory stock), `item_id` or `material_id`, `qty`, `need_by_date`, `source` (`docket` · `bom` · `manual`), `status`
**quotes** — for Track A vendor selection: `purchase_request_id` or `work_order_id`, `vendor_id`, `lead_time_days`, `valid_until`, `selected`, `reason`; amounts in `quote_amounts` *(restricted)*

**shipments** (imports) — `po_id`, `carrier`, `tracking`, `eta`, `customs_status`, `documents`

**goods_receipts** — `po_id`, `received_at`, `received_by`, `inspection_result` (`accepted` · `partial` · `rejected`), `notes`, `photos`

**inventory** — `material_id` or `item_id`, `location` (`factory_store` · `warehouse` · `site`), `qty`, `reserved_for_project_id`

---

## 8. Vendor team (Track A and deep cleaning)

**work_orders** — the Vendor team's scope and schedule record for a vendor, linked to the ERP PO: `wo_number`, `vendor_id`, `project_id`, `purchase_order_id`, `scope`, `status`, `start_date`, `end_date`, `now_with_role`, `now_with_user_id`
**work_order_rates** *(Admin, Procurement, Vendor team)* — `work_order_id`, `value_paise`, `retention_pct`
**work_order_lines** — `work_order_id`, `item_id`, `room_id`, `description`, `qty`, `unit`; line rates in `work_order_line_rates` *(same audience)*

**vendor_schedule** — `work_order_id`, `room_id`, `date`, `slot`, `status`

**work_progress** — `work_order_line_id`, `reported_qty`, `verified_qty`, `verified_by` (on-site), `photos`, `date`

Deep cleaning (Stage 8) uses tasks and a vendor booking on `vendor_schedule`.

Later: `vendor_bills` (bills matched to verified work) are not in v1.

---

## 9. Factory

**production_orders** — `order_no`, `project_id`, `room_id`, `item_ids uuid[]`, `need_by_date`, `status` (`planned` · `material_check` · `in_progress` · `qc` · `packed` · `dispatched`), `material_ready` (bool). Only millwork and loose-furniture items made in the factory.

**work_centres** (master) — `code` (`CNC`, `SAW`, `EDGE`, `PRESS`, `JOIN`, `SPRAY`, `UPH`), `name`, `capacity_hours_per_day`

**job_steps** — `item_id`, `production_order_id`, `step` (`cutting` · `pressing` · `edge_banding` · `joinery` · `assembly` · `finishing` · `upholstery` · `qc` · `packing`), `work_centre_id`, `planned_date`, `started_at`, `completed_at`, `operator_id`

**qc_checks** — `item_id`, `stage` (`machining` · `finishing` · `pre_dispatch` · `site`), `checklist jsonb`, `result` (`pass` · `fail`), `photos`, `checked_by`, `master_sample_id`

**rework** — `qc_check_id`, `reason`, `hours_lost`, `closed_at`

**packages** — `item_id`, `label_code` (QR), `package_no`, `of_packages`, `install_sequence`

---

## 10. Site, dispatch and installation

**site_reports** — `project_id`, `date`, `manpower jsonb`, `work_done`, `issues`, `photos`, `vendors_present uuid[]`, `submitted_by`

**site_tasks** — `project_id`, `room_id`, `type` (`civil` · `mep` · `ceiling` · `flooring` · `paint` · `other`), `vendor_id`, `status`, `due_date`

**vendor_quality_checks** — On-site's check of vendor work (Track A): `work_order_id`, `room_id`, `result`, `photos`, `checked_by`

**room_readiness_checks** — the room site-ready check (site work done, clean, dry, access, power): `room_id`, `checklist jsonb`, `photos`, `passed`, `checked_by`. A room is site-ready when its Track A work is done (if any) and its Track B items are ready.

**dispatch_batches** — `batch_no`, `project_id`, `room_ids uuid[]`, `vehicle`, `slot_at`, `status` (`planned` · `go_ahead` · `loaded` · `in_transit` · `delivered`), `designer_go_ahead_by`, `now_with_role`, `now_with_user_id`
**dispatch_batch_items** — `batch_id`, `package_id` or `item_id` (bought-in items have no factory package), `scanned_loaded_at`, `scanned_received_at`, `damage_notes`, `damage_photos`

**installations** — `item_id`, `installed_at`, `installed_by`, `photos`, `notes`

---

## 11. Snags and handover

**snags** — an independent record: `project_id`, `room_id`, `item_id` (nullable), `title`, `description`, `photos`, `raised_by`, `assigned_to`, `due_date`, `status` (configurable, mapped to the four buckets), `source` (`factory_qc` · `receipt` · `installation` · `walkthrough` · `client`), `now_with_role`, `now_with_user_id`. An item keeps its status while its snags are open.

**handovers** — handover sign-off: `project_id`, `checklist jsonb`, `pack_document_id`, `client_signoff_document_id`, `signed_at`. Handover needs zero open snags or written client acceptance.

Later: `service_requests` (warranty issues), `handovers.warranty_ends_at` and retention release are not in v1.

---

## 12. Commercial (variations are to confirm)

**variations** *(to confirm)* — `project_id`, `number`, `description`, `item_ids uuid[]`, `cost_impact_paise`, `time_impact_days`, `status` (`raised` · `sent_to_client` · `approved` · `rejected` · `implemented`), `client_approval_id`, `admin_approved_by` (above threshold)

**payment_milestones** *(flag, visible to project members)* — `project_id`, `name`, `order`, `gate_stage`, `status` (`pending` · `received`). Default two milestones: design frozen (end of Stage 4) and final (after the work, before close). Admin sets them per project.
**payment_milestone_amounts** *(Admin only)* — `milestone_id`, `amount_paise`, `received_on`, `mode`, `reference`, `recorded_by`. Several rows allowed for part payments.

---

## 13. Workflow, tasks, collaboration

Full behaviour in `/docs/workflow-model.md` and `/docs/collaboration.md`. Internal users only.

**status_labels** — `label`, `bucket` (`not_started` · `in_progress` · `blocked` · `done`), `requires_reason`, `is_default`, `sort`. Defaults: Not started, In progress, On hold (blocked, reason), Blocked (blocked, reason), Done, Cancelled (done, reason). Admin can rename and add labels, each mapped to a bucket.

**stage_templates** — `stage_no`, `code`, `name`, `phase` (`shared` · `execution` · `closing`), `track` (`A` · `B` · null), `sort_order`, `opens_when_scope text[]`, `acting_role`, `sla_days`, `archived_at`
**task_templates** — `stage_template_id`, `code` (e.g. `4.6`, `B3.4`), `name`, `acting_role`, `approver_role`, `start_condition`, `done_condition`, `gate_type` (`none` · `internal_approval` · `client_approval` · `payment_flag` · `checklist`), `gate_strictness` (`warn` · `require` · `require_approval` · `block`), `depends_on text[]`, `transition_mode` (`automatic` · `manual` · `both`, default `both`), `sla_days`, `archived_at`. Templates and stages in use are archived, never deleted.

**tasks** — process and ad-hoc tasks in one table
- `kind` (`process` · `adhoc`), `template_id` (process only), `parent_task_id` (subtasks, one level)
- `project_id` (null = personal task), `workstream_id`, `room_id`, `entity_type`, `entity_id` (linked record)
- `title`, `description` (rich text JSON), `assignee_id`, `created_by`, `priority` (`urgent` · `high` · `normal` · `low`)
- `status` (a `status_labels` label), `blocked_reason`, `health` (calculated)
- `now_with_role`, `now_with_user_id`
- `start_date`, `due_date`, `completed_at`, `recurrence_rule` (nullable)
- `source_message_id` (when created from a message)
- process only: `gate_passed_at`, `gate_passed_by`, `override_reason`

**task_collaborators** — `task_id`, `user_id`

**threads** — one per record, plus project discussion topics: `project_id`, `entity_type` (`project` · `room` · `item` · `task` · `approval` · `gfc_drawing` · `purchase_order` · `work_order` · `production_order` · `dispatch_batch` · `snag` · `topic`), `entity_id`, `title` (topics only), `is_pinned`

**messages** — `thread_id`, `project_id`, `author_id`, `parent_message_id` (replies), `body` (rich text JSON), `body_text` (for search), `kind` (`comment` · `system_event` · `voice_note`), `is_decision`, `resolved_at`, `edited_at`, `deleted_at`

**message_mentions** — `message_id`, `mentioned_user_id`, or `referenced_entity_type` + `referenced_entity_id` (#references)

**message_attachments** — `message_id`, `document_id`, `kind` (`image` · `file` · `audio`), `duration_seconds`, `transcript`

**message_reactions** — `message_id`, `user_id`, `emoji`

**message_edits** — `message_id`, `previous_body`, `edited_by`, `edited_at` (visible to Admin)

**followers** — `user_id`, `entity_type`, `entity_id`, `muted`

**notifications** — the inbox: `user_id`, `type` (`mention` · `reply` · `assigned` · `due_soon` · `overdue` · `approval_waiting` · `finance_approval_waiting` · `gate_reached` · `followed_activity`), `entity_type`, `entity_id`, `project_id`, `message_id`, `title`, `now_with_role`, `read_at`, `done_at`, `snoozed_until`

**notification_preferences** — `user_id`, `type`, `in_app`, `email` (`instant` · `hourly` · `daily` · `off`), `push`, `quiet_hours jsonb`

**slack_channel_mappings** — `project_id` or `role`, `slack_channel_id`, `event_types text[]`

**saved_views** — `user_id` or `team_role`, `module`, `name`, `filters jsonb`, `sort jsonb`, `columns jsonb`, `layout` (`list` · `board` · `calendar` · `timeline`), `is_shared`

**Access:** `threads`, `messages` and their child tables inherit access from the linked record (a security definer function `can_view_entity(entity_type, entity_id)` used in RLS). Personal tasks are visible only to creator and assignee. Status and health of workstreams, stages and projects are calculated from items and tasks (workflow-model section 2); nobody types them.

---

## 14. Open questions

1. Can one user hold more than one role (for example a designer who also handles procurement)? Current model: one role per user, overrides in v2.
2. Are items ever split across rooms or phases after design freeze?
3. Does the factory make items for stock (not tied to a project)?
4. ~~Which scope tag opens Track B for bought-in items?~~ Decided: the scope tag is "Loose furniture and bought-in".
5. Should `approvals` (client, with proof) and `external_approvals` (no login, with proof) become one table?
6. Lists of ids stored in one column (`item_ids`, `room_ids`, `project_ids`) cannot carry foreign keys; turn them into join tables during the data-model review.
7. Variations and bought-in classification are marked *to confirm* by the founder.
