# INV Compass — Data Model (draft v0.1)

A starting model for review. Claude Code should refine it in Step 2, list open questions, and get founder approval before writing migrations.

Conventions for every table: `id uuid pk default gen_random_uuid()`, `created_at timestamptz`, `updated_at timestamptz`, `created_by uuid → profiles`, `archived_at timestamptz null` (business records). Money in integer paise (`bigint`). RLS on every table (see `/docs/permissions.md`).

---

## 1. The spine

```
projects ─┬─ project_members ── profiles (role)
          ├─ rooms
          ├─ items (the docket) ─┬─ item_versions / documents
          │                      ├─ approvals
          │                      ├─ gfc_drawings ── bom_lines
          │                      ├─ purchase_order_lines   (route = bought_in)
          │                      ├─ production_orders      (route = factory)
          │                      ├─ work_order_lines       (route = service)
          │                      ├─ dispatch_batch_items
          │                      └─ snags
          ├─ tasks (process + ad-hoc) and threads → messages
          ├─ variations
          ├─ payments (milestones)
          └─ site_reports, readiness_checks
```

The **item** is the unit that travels from design to handover. Every team updates the same item; its `status` and `route` decide whose queue it appears in.

---

## 2. People and access

**profiles** — one per auth user
- `user_id` (→ auth.users), `full_name`, `email`, `phone`, `role` (enum below), `avatar_url`, `status` (`invited` · `active` · `deactivated`), `last_seen_at`

**roles** — enum `app_role`: `admin`, `designer`, `gfc`, `procurement`, `vendor_team`, `factory`, `onsite`

**permissions** — `key` (`module.action`), `module`, `action`, `description`

**role_permissions** — `role`, `permission_key`

**user_permission_overrides** (v2) — `user_id`, `permission_key`, `effect` (`grant` · `revoke`), `reason`

**invites** — `email`, `role`, `project_ids uuid[]`, `token_hash`, `expires_at`, `accepted_at`, `invited_by`

**audit_log** — `actor_id`, `action`, `entity_type`, `entity_id`, `project_id`, `diff jsonb`, `ip`, `user_agent`, `created_at` (insert-only)

---

## 3. Projects

**projects**
- `code` (short, unique, e.g. `VLA01`), `name`, `client_name`, `client_email`, `client_phone`
- `site_address`, `city`, `carpet_area_sqft`
- `project_type` (`villa` · `apartment` · `penthouse` · `office` · `hospitality` · `other`)
- `scope` (`turnkey` · `millwork_furniture` · `furniture_only` · `custom`)
- `has_architect` (bool) — **B1**; `architect_name`, `architect_contact`
- `phases jsonb` — **B2** (phase name, rooms, target dates)
- `current_stage` (1–9), `health` (`on_track` · `at_risk` · `late` · `on_hold`)
- `budget_paise`, `contract_value_paise`
- `start_date`, `target_handover_date`, `actual_handover_date`
- `designer_lead_id` (→ profiles)

**project_members** — `project_id`, `user_id`, `role_on_project` (defaults to user's role), `added_by`

**rooms** — `project_id`, `code` (e.g. `MBR`, `LIV`, `KIT`), `name`, `floor`, `phase`, `site_ready_at` (**B7**)

---

## 4. Discovery and design

**discovery** — one per project: `budget_band`, `timeline_notes`, `style_notes`, `services jsonb`, `item_types_in_scope text[]`, `rooms_brief jsonb` (room-wise needs), `completed_at`

**site_surveys** — `project_id`, `kind` (`initial` · `final`), `room_id`, `measurements jsonb`, `service_points jsonb`, `access_notes`, `photos` (documents), `submitted_by`, `approved_by`, `approved_at`

**documents** — generic files: `project_id`, `entity_type`, `entity_id`, `kind` (`floor_plan` · `concept_deck` · `render` · `mood_board` · `gfc_drawing` · `photo` · `po_pdf` · `proof` · `handover` · `other`), `storage_path`, `version`, `file_name`, `mime_type`, `size_bytes`

**boqs** — `project_id`, `kind` (`first_cut` · `final`), `version`, `status`, `total_paise`
**boq_lines** — `boq_id`, `room_id`, `item_id` (nullable before docket), `description`, `qty`, `unit`, `rate_paise`, `amount_paise` *(cost data — restricted, see permissions)*

**samples** — `project_id`, `material_id`, `finish`, `photo_document_id`, `approved_at`, `master_sample_location`

**approvals** — `project_id`, `entity_type` (`brief` · `concept` · `boq` · `mood_board` · `gfc_drawing` · `prototype` · `variation` · `handover` …), `entity_id`, `version`, `requested_by`, `approver_type` (`client` · `internal`), `approver_id` (internal), `status` (`pending` · `approved` · `approved_with_notes` · `changes_requested` · `rejected`), `due_at`, `decided_at`, `notes`, `proof_document_id` (required when recorded on behalf of client)

---

## 5. Docket and items

**items** — one per docket line
- `project_id`, `room_id`, `code` (`PROJECT-ROOM-CATEGORY-NN`, unique), `name`, `description`
- `category_id` (→ item_categories, e.g. `WD` wardrobe, `KT` kitchen, `PN` panelling, `SF` sofa)
- `classification` — **B3**: `route` (`factory` · `bought_in` · `service`), `item_type` (`millwork` · `loose_furniture` · `soft_furnishing` · `lighting` · `stone` · `glass` · `metal` · `civil` · `mep` · …)
- `qty`, `unit`, `dimensions jsonb`, `material_spec jsonb`, `finish_spec jsonb`, `hardware_spec jsonb`
- `status` (lifecycle below), `blocked_reason`
- `need_by_date`, `lead_time_days`
- `docket_locked_at` (copied from docket), `released_at`, `installed_at`

**Item status lifecycle**

`draft` → `in_docket` → `in_gfc` → `awaiting_drawing_approval` → `released` → (`ordered` | `in_production` | `work_ordered`) → `ready` (QC passed or delivered and inspected) → `dispatched` → `received_at_site` → `installed` → `snag_open` ↔ `installed` → `handed_over`

Side states: `on_hold`, `cancelled` (via variation).

**dockets** — `project_id`, `version`, `status` (`draft` · `submitted` · `locked`), `submitted_by`, `locked_at`

**item_categories** (master) — `code`, `name`, `default_route`, `default_lead_time_days`

---

## 6. GFC

**gfc_drawings** — `item_id`, `version`, `document_id`, `status` (`draft` · `internal_check` · `sent_for_approval` · `approved` · `approved_as_noted` · `revise` · `superseded`), `checked_by`, `revision_reason`

**bom_lines** — `item_id`, `gfc_drawing_id`, `material_id`, `description`, `qty`, `unit`, `notes`

**submittals** — `project_id`, `package_name`, `item_ids uuid[]`, `sent_at`, `due_at`, `status`, `approval_id`

---

## 7. Procurement

**vendors** (master, shared with Vendor team) — `name`, `type` (`supplier` · `service` · `both`), `categories text[]`, `gstin`, `contact`, `payment_terms`, `rating`, `status`

**materials** (master) — `code`, `name`, `category`, `unit`, `default_vendor_id`, `lead_time_days`

**purchase_requests** — `project_id` (nullable for factory stock), `item_id` or `material_id`, `qty`, `need_by_date`, `source` (`docket` · `bom` · `manual`), `status`

**quotes** — `purchase_request_id`, `vendor_id`, `amount_paise`, `lead_time_days`, `valid_until`, `selected`, `reason`

**purchase_orders** — `po_number`, `vendor_id`, `project_id`, `status` (`draft` · `sent` · `acknowledged` · `in_production` · `shipped` · `delivered` · `closed` · `cancelled`), `promised_date`, `expected_date`, `total_paise`, `payment_terms`, `is_import`
**purchase_order_lines** — `po_id`, `item_id` or `material_id`, `qty`, `rate_paise`, `spec_reference`, `sample_id`

**shipments** (imports) — `po_id`, `carrier`, `tracking`, `eta`, `customs_status`, `documents`

**goods_receipts** — `po_id`, `received_at`, `received_by`, `inspection_result` (`accepted` · `partial` · `rejected`), `notes`, `photos`

**inventory** — `material_id` or `item_id`, `location` (`factory_store` · `warehouse` · `site`), `qty`, `reserved_for_project_id`

---

## 8. Vendor team (services)

**work_orders** — `wo_number`, `vendor_id`, `project_id`, `scope`, `status` (`draft` · `issued` · `in_progress` · `completed` · `closed`), `value_paise`, `retention_pct`, `start_date`, `end_date`
**work_order_lines** — `work_order_id`, `item_id`, `room_id`, `description`, `qty`, `unit`, `rate_paise`

**vendor_schedule** — `work_order_id`, `room_id`, `date`, `slot`, `status`

**work_progress** — `work_order_line_id`, `reported_qty`, `verified_qty`, `verified_by` (on-site), `photos`, `date`

**vendor_bills** — `work_order_id` or `po_id`, `bill_number`, `amount_paise`, `status` (`received` · `matched` · `approved` · `on_hold` · `paid`), `approved_by`

---

## 9. Factory

**production_orders** — `po_number`, `project_id`, `room_id`, `item_ids uuid[]`, `need_by_date`, `status` (`planned` · `material_check` · `in_progress` · `qc` · `packed` · `dispatched`), `material_ready` (bool)

**work_centres** (master) — `code` (`CNC`, `SAW`, `EDGE`, `PRESS`, `JOIN`, `SPRAY`, `UPH`), `name`, `capacity_hours_per_day`

**job_steps** — `item_id`, `production_order_id`, `step` (`cutting` · `pressing` · `edge_banding` · `joinery` · `assembly` · `finishing` · `upholstery` · `qc` · `packing`), `work_centre_id`, `planned_date`, `started_at`, `completed_at`, `operator_id`

**qc_checks** — `item_id`, `stage` (`machining` · `finishing` · `pre_dispatch` · `site`), `checklist jsonb`, `result` (`pass` · `fail`), `photos`, `checked_by`, `master_sample_id`

**rework** — `qc_check_id`, `reason`, `hours_lost`, `closed_at`

**packages** — `item_id`, `label_code` (QR), `package_no`, `of_packages`, `install_sequence`

---

## 10. Site, dispatch and installation

**site_reports** — `project_id`, `date`, `manpower jsonb`, `work_done`, `issues`, `photos`, `vendors_present uuid[]`, `submitted_by`

**site_tasks** — `project_id`, `room_id`, `type` (`civil` · `mep` · `ceiling` · `flooring` · `paint` · `other`), `vendor_id`, `status`, `due_date`

**readiness_checks** — **B7** — `room_id`, `checklist jsonb` (wet work done, points final, humidity, protection), `photos`, `passed`, `checked_by`, `approved_by` (designer)

**dispatch_batches** — **B8** — `batch_no`, `project_id`, `room_ids uuid[]`, `vehicle`, `slot_at`, `status` (`planned` · `go_ahead` · `loaded` · `in_transit` · `delivered`), `designer_go_ahead_by`
**dispatch_batch_items** — `batch_id`, `package_id`, `scanned_loaded_at`, `scanned_received_at`, `damage_notes`, `damage_photos`

**installations** — `item_id`, `installed_at`, `installed_by`, `photos`, `notes`

---

## 11. QC, handover, after-sales

**snags** — `project_id`, `room_id`, `item_id` (nullable), `description`, `photos`, `raised_by`, `assigned_to`, `due_date`, `status` (`open` · `fixed` · `verified` · `closed`), `source` (`internal` · `client` · `warranty`)

**handovers** — **B10** — `project_id`, `checklist jsonb`, `pack_document_id`, `client_signoff_document_id`, `signed_at`, `warranty_ends_at`

**service_requests** — `project_id`, `item_id`, `description`, `photos`, `status`, `visit_at`, `closed_at`

---

## 12. Commercial

**variations** — `project_id`, `number`, `description`, `item_ids uuid[]`, `cost_impact_paise`, `time_impact_days`, `status` (`raised` · `sent_to_client` · `approved` · `rejected` · `implemented`), `client_approval_id`, `admin_approved_by` (above threshold)

**payment_milestones** — `project_id`, `name` (`advance` · `design` · `pre_dispatch` · `handover` · `retention`), `pct`, `amount_paise`, `due_on_gate` (task id), `due_date`, `status` (`not_due` · `due` · `partially_paid` · `paid` · `overdue`)
**payments** — `milestone_id`, `amount_paise`, `received_on`, `mode`, `reference`, `recorded_by`

---

## 13. Tasks, collaboration and work management

Full behaviour in `/docs/collaboration.md`. Internal users only; no client or vendor access.

**stage_templates** / **task_templates** (settings) — the 9 stages and their sub-tasks from `/docs/process-flow.md`: `stage_no`, `code` (e.g. `4.4`), `name`, `owner_role`, `start_condition`, `done_condition`, `gate_type` (`none` · `internal_approval` · `client_approval` · `payment` · `checklist`), `sla_days`

**tasks** — process and ad-hoc tasks in one table
- `kind` (`process` · `adhoc`), `template_id` (process only), `parent_task_id` (subtasks, one level)
- `project_id` (null = personal task), `room_id`, `entity_type`, `entity_id` (linked record, e.g. an item or PO)
- `title`, `description` (rich text JSON), `assignee_id`, `created_by`, `priority` (`urgent` · `high` · `normal` · `low`)
- `status` (`to_do` · `in_progress` · `blocked` · `done`), `blocked_reason`
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

**notifications** — the inbox: `user_id`, `type` (`mention` · `reply` · `assigned` · `due_soon` · `overdue` · `approval_waiting` · `gate_reached` · `followed_activity`), `entity_type`, `entity_id`, `project_id`, `message_id`, `title`, `read_at`, `done_at`, `snoozed_until`

**notification_preferences** — `user_id`, `type`, `in_app`, `email` (`instant` · `hourly` · `daily` · `off`), `push`, `quiet_hours jsonb`

**slack_channel_mappings** — `project_id` or `role`, `slack_channel_id`, `event_types text[]`

**saved_views** — `user_id` or `team_role`, `module`, `name`, `filters jsonb`, `sort jsonb`, `columns jsonb`, `layout` (`list` · `board` · `calendar` · `timeline`), `is_shared`

**Access:** `threads`, `messages` and their child tables inherit access from the linked record (a security definer function `can_view_entity(entity_type, entity_id)` used in RLS). Personal tasks are visible only to creator and assignee.

---

## 14. Open questions

1. Can one user hold more than one role (for example a designer who also handles procurement)? Current model: one role per user, overrides in v2.
2. Are items ever split across rooms or phases after docket lock?
3. Does the factory make items for stock (not tied to a project)?
4. Who owns the item code format, and must it match existing paper records?
5. Are vendor bills and client payments in scope for v1 or tracked in accounting software?
