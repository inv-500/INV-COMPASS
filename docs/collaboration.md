# INV Compass — Tasks and Collaboration

INV Compass is where the team coordinates, not just where it records. Every team can create and assign tasks (like Asana) and talk in detail about any project, item or task, with the conversation kept on the record it is about.

**Internal use only.** Only INV Home staff with an INV Compass login take part. Clients and vendors never see tasks or conversations; anything from them (a WhatsApp message, an email, a call) is captured by a team member, with proof attached where it matters.

General team chat stays in Slack. INV Compass holds conversations about specific work and sends key updates to Slack (see section 6).

**Build phasing** (see `/docs/mvp-scope.md`): R1 — tasks, subtasks, My tasks, list and board views, threads with @mentions, photos and files, message-to-task, inbox and following. R5 — voice notes and photo-to-snag for site and factory. R6 — email digests, Slack integration, team workload view. Later — transcripts, calendar and timeline views, recurring tasks.

---

## 1. Tasks

Two kinds of task share one model and one set of views:

| Kind | Created by | Example |
| --- | --- | --- |
| **Process task** | The app, from the stage templates in `/docs/process-flow.md` | "4.4 GFC drawing approval — MBR wardrobe" |
| **Ad-hoc task** | Any user | "Re-measure the master bedroom wall before Friday" |

**Every task has:** title, description (rich text), assignee (one owner), collaborators, due date (and optional start date), priority (`urgent` · `high` · `normal` · `low`), status (`to_do` · `in_progress` · `blocked` · `done`), linked project and optionally a room, item or other record, subtasks (one level), attachments, a discussion thread, and followers.

**Rules**
- Anyone can create a task on a project they are a member of and assign it to any member of that project.
- Personal tasks (no project) are visible only to their creator and assignee.
- Process tasks keep their gate rules; ad-hoc tasks never pass a gate.
- Blocked tasks need a reason; the reason shows on the task and in the assignee's manager view.
- Completing a task with open subtasks asks for confirmation.
- Recurring tasks (daily site report, weekly vendor review) with a simple repeat rule — later release.

**Views**
- **My tasks** — everything assigned to me, grouped Overdue · Today · This week · Later, plus "Assigned by me" and "Following".
- **Project tasks** — list (default) and board (by status) in v1; calendar and timeline later; filtered by room, item, assignee or kind.
- **Team tasks** — for a role lead: everything assigned to their team, with workload per person.
- Every task view supports saved views, bulk edit and keyboard shortcuts (see `/docs/design-system.md`).

**Quick capture**
- `C` creates a task in the current context (project, item, room).
- ⌘K → "Create task".
- Natural-language due dates ("fri", "next mon", "in 3 days").
- From any message: **Create task from message** (section 3).

---

## 2. Discussions on every record

Every project, room, item, task, approval, GFC drawing, PO, work order, production order, dispatch batch and snag has a **discussion thread** in its Activity tab. The thread shows comments and system events (status changes, approvals, uploads) together in time order, with a filter to show comments only.

**Messages support**
- Rich text (bold, lists, links), @mentions of people, and #references to records (#VLA01-MBR-WD-01 links to the item)
- Photos and files (drag-and-drop, paste from clipboard, camera on mobile), shown inline with preview
- **Voice notes** (up to 3 minutes) for site and factory teams; automatic transcript later
- Replies in a sub-thread, emoji reactions, edit (marked "edited") and delete (own messages, within 15 minutes; Admin any time, logged)
- **Mark as decision** — pins the message to the record's Decisions list (for example "Client approved walnut veneer over oak")
- **Resolve** a reply thread when the question is answered

**Project discussion space**
Each project has a general discussion space for talk that is not about one record, with optional topics (for example "Site access", "Client preferences"). Members of the project can read and post.

**Presence and live updates**
New messages, reactions and typing indicators appear live. Record pages show who else is viewing.

---

## 3. From conversation to action

- **Create task from message** — any message can become a task. The task links back to the message, and the message shows the task's status.
- **Request approval from message** — opens the approval pattern pre-filled with the attached file.
- **Raise snag from photo** — on-site and factory users can turn a photo in a thread into a snag.
- **Ask for an update** — one click on any task sends a nudge to the assignee.

---

## 4. Inbox and notifications

One inbox per user collects:
- @mentions and replies to my messages
- Tasks assigned to me, due soon or overdue, and changes to them
- Approvals waiting for me
- Activity on records I follow
- Gate reached for my role (see `/docs/roles-and-screens.md`)

Inbox actions: open, mark done, snooze (later today · tomorrow · next week · pick a date), mute a record. Grouped by project; keyboard navigable.

**Following:** creators, assignees, collaborators and mentioned people follow a record automatically. Anyone can follow or unfollow.

**Delivery preferences** per user and per type: in-app (always), email digest (instant · hourly · daily · off), mobile push (when the app is installed as a PWA). Quiet hours respected for non-urgent items.

---

## 5. Access rules

Conversations and tasks follow exactly the same permissions as the record they belong to (see `/docs/permissions.md`):

- A user sees a thread only if they can view its record.
- @mentioning someone who cannot see the record is blocked, with the message "Ravi can't see this item. Ask an Admin to add them to the project."
- Search, inbox, notifications, email digests and Slack messages never include content the recipient cannot view.
- Files in threads use the same storage rules and signed URLs as other project files.
- Cost information posted in a thread is the poster's responsibility; threads on cost-restricted records (BOQ, payments) are visible only to roles with access to those records.
- Edits and deletions keep a history visible to Admin; nothing is silently lost.

---

## 6. Slack integration (R6, simple)

- An Admin connects a Slack workspace and maps projects or roles to Slack channels.
- Chosen events are posted to Slack with a link back: approval waiting, item late, gate reached, snag raised, variation raised.
- Posts contain only the title and status, never cost data or private details. Opening the link requires an INV Compass login.
- No two-way sync: replies happen in INV Compass so the record keeps the history.

---

## 7. Screens

| Screen | Shows | Actions |
| --- | --- | --- |
| My tasks | My tasks grouped by due; assigned by me; following | Create, complete, reschedule, reassign |
| Project tasks | List and board views (calendar and timeline later) | Create, filter, bulk edit, save view |
| Task detail (panel) | Title, assignee, dates, priority, status, subtasks, linked record, files, thread | Edit inline, comment, create subtask, follow |
| Record Activity tab | Comments and system events for that record | Post, reply, react, mark decision, create task |
| Project discussion | General project conversation by topic | Post, start topic, pin |
| Decisions | All messages marked as decisions in a project | Filter by room or item, export |
| Inbox | Everything that needs me | Open, done, snooze, mute |
| Team workload (leads) | Tasks per person, overdue, this week | Reassign, filter |

On mobile, Inbox, My tasks and threads are first-class tabs; posting a photo or voice note takes one tap.

---

## 8. Data model additions

See `/docs/data-model.md` section 13.

---

## 9. Acceptance criteria

- A designer can create a task on an item, assign it to a GFC user, and both discuss it with photos and @mentions; the GFC user sees it in My tasks and Inbox within 2 seconds.
- A site user can record a voice note on a snag from a phone with a weak connection; it uploads when the network returns.
- A message becomes a task in one click and both stay linked.
- A Factory user cannot read, search or be @mentioned into a procurement-pricing thread (covered by access tests).
- Slack posts never contain cost data and always link back to INV Compass.
