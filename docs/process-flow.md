# INV Compass — Project Pipeline

This is the agreed INV Home flow. It replaces the earlier nine-stage draft.

Rules about statuses, health, rollups, who can act and who sees what live in `/docs/workflow-model.md`. This file holds the stages and sub-tasks.

Everything here is **configurable data** (stage templates, sub-task templates, gates) that Admin edits in Settings. See `/docs/configurability.md`. Lead qualification and sales sit outside this flow; a project starts when Admin creates it.

Codes B1–B10 in older notes (architect yes/no, phases, item classification, room site-ready, dispatch batch, handover sign-off) still apply.

---

## 1. The pipeline at a glance

Nine stages in the Stage Tracker:

| # | Stage | Owner | Phase |
| --- | --- | --- | --- |
| 1 | New | Admin | Shared |
| 2 | Requirement | Designer | Shared |
| 3 | Concept design | Designer | Shared |
| 4 | Design development | Designer | Shared |
| 5 | Execution | Track owners | Parallel tracks A and B |
| 6 | Installation | On-site | Closing |
| 7 | Snagging | On-site, Designer | Closing |
| 8 | Deep cleaning | Vendor team | Closing |
| 9 | Handover | Designer | Closing |

```
SHARED (in order)      1 New → 2 Requirement → 3 Concept → 4 Design development
                                                     │ release (scope decides the tracks)
EXECUTION (parallel)   Track A  Onsite services ─────┤
                       Track B  Millwork & loose furniture
                                                     │ per-room "site ready"
CLOSING (in order)     6 Installation → 7 Snagging → 8 Deep cleaning → 9 Handover → Closed
```

- Scope is a multi-select tag on the project: **Onsite services**, **Millwork**, **Loose furniture**. Millwork and Loose furniture both use Track B.
- A project can have **A only, B only, or both**. "Both" is not a third track. A and B simply run side by side.
- If a track is not in scope it never appears.
- Adding a scope later opens that track from that point.

---

## 2. Money in the flow (the team never sees finance)

Two separate documents, two separate audiences:

| Document | What it is | Prepared by | Seen by |
| --- | --- | --- | --- |
| **BOQ** | What the client pays | Designer | Admin, Designer, Procurement |
| **Cost sheet** | What INV Home pays (internal cost) | Procurement | Admin, Procurement |

**Client payments** happen at several milestones, set per project by Admin. The default is two:
1. **Milestone 1:** when the design is frozen (end of Stage 4).
2. **Final milestone:** after the entire work is complete (before the project is closed).

Payment amounts and records are visible to **Admin only**. Everyone else on the project sees only a flag: *Milestone 1: received / pending*, with no amounts. Gates use the flag, not the money.

The **ERP** creates the PO number. INV Compass never creates POs. For every PO, Compass stores the **ERP PO number, the PO file, the status and who holds it**.

---

## 3. Stages 1–4 (shared)

### Stage 1 · New — Admin
| # | Sub-task | Owner | Done when |
| --- | --- | --- | --- |
| 1.1 | Create project: code, client, site address, type | Admin | Saved |
| 1.2 | Tag scope | Admin | At least one scope |
| 1.3 | Assign Designer (project manager) | Admin | Named |
| 1.4 | Set payment milestones (default two) | Admin | Milestones set |
| 1.5 | Add team members | Admin / Designer | Members added |
| 1.6 | Folders, kickoff thread and default tasks | System | Created |

Gate → Requirement: scope tagged, Designer assigned. *Default: require.*

### Stage 2 · Requirement — Designer
| # | Sub-task | Owner | Done when |
| --- | --- | --- | --- |
| 2.1 | Client brief: needs, style, budget range, timeline | Designer | Saved |
| 2.2 | Site documents: plans, architect drawings, photos | Designer | Uploaded |
| 2.3 | Site visit and measurements | Designer / On-site | Logged |
| 2.4 | Architect involved? Phases (B1, B2) | Designer | Set |
| 2.5 | Brief confirmed with client | Designer | Proof attached |

Gate → Concept: brief confirmed. *Default: warn.*

### Stage 3 · Concept design — Designer
| # | Sub-task | Owner | Done when |
| --- | --- | --- | --- |
| 3.1 | Space planning and layouts | Designer | Uploaded |
| 3.2 | Mood boards, material and finish direction | Designer | Uploaded |
| 3.3 | Concept presentation | Designer | Held |
| 3.4 | Client concept approval (proof) | Designer | Recorded |

Gate → Design development: concept approval. *Default: warn.*

### Stage 4 · Design development — Designer
| # | Sub-task | Owner | Done when |
| --- | --- | --- | --- |
| 4.1 | Detailed design per room | Designer | Uploaded |
| 4.2 | Final material, finish and sample selection | Designer | Locked |
| 4.3 | Build the docket: every item per room (PROJECT-ROOM-CATEGORY-NN) | Designer | Items created |
| 4.4 | Classify each item: Millwork · Loose furniture · Onsite service | Designer | All classified |
| 4.5 | Prepare BOQ costing | Designer | BOQ drafted |
| 4.6 | **BOQ verification and approval** | **Procurement** | Costing verified and final BOQ approved |
| 4.7 | Client approval of design and BOQ (proof) | Designer | Recorded |
| 4.8 | **Design frozen** | Designer | Frozen |
| 4.9 | **Milestone 1 payment recorded as received** | Admin | Flag set |
| 4.10 | Release to tracks | Designer | Released |

Gates:
- BOQ cannot go to the client until Procurement has approved it. *Default: require.*
- Release to tracks needs design frozen and milestone 1 received. *Default: require; Admin may override with a reason.*

On release the app opens Track A and/or B from the scope, creates their tasks, and routes each item by its classification.

---

## 4. Stage 5 · Execution (parallel tracks)

### Track A · Onsite services
For service items: civil, electrical, plumbing, false ceiling, painting, flooring and similar, done by vendors.

| # | Sub-task | Owner | Done when |
| --- | --- | --- | --- |
| A1.1 | Service scope and vendor quotes; vendors chosen | Procurement + Vendor team | Vendor per service |
| A1.2 | Cost sheet prepared from the approved BOQ and uploaded to the ERP | Procurement | Uploaded |
| A1.3 | PO prepared in the ERP; **ERP PO number and file stored in Compass** | Procurement | Stored |
| A2.1 | **Finance approval** recorded (external approval, `workflow-model.md` §6) | Procurement or Admin | Recorded with proof |
| A2.2 | PO released to vendor | Procurement | Released |
| A3.1 | Mobilisation and site schedule | Vendor team | Schedule set |
| A3.2 | Vendor execution with progress updates and photos | Vendor team | Logged |
| A3.3 | Quality check of vendor work | On-site | Passed |
| A4.1 | **Site work complete** | Vendor team / On-site | Marked |

Gates: finance approval before PO release (*require*); quality check before site work complete (*warn*).

### Track B · Millwork and loose furniture

**B1 · GFC**
| # | Sub-task | Owner | Done when |
| --- | --- | --- | --- |
| B1.1 | Final site measurements | GFC / On-site | Confirmed |
| B1.2 | GFC drawings per item | GFC | Uploaded |
| B1.3 | BOM and engineering sheet per item | GFC | Complete |
| B1.4 | Technical check | GFC | Passed |

**B2 · Design approval**
| # | Sub-task | Owner | Done when |
| --- | --- | --- | --- |
| B2.1 | Designer reviews GFC drawings against the approved design | Designer | Approved or returned |
| B2.2 | Release to Procurement and Factory | Designer | Released |

Gate: Designer approval of GFC drawings. *Default: require approval; Admin may override.*

**B3 · Procurement** (starts when the BOM and engineering sheet arrive; runs alongside B4)
| # | Sub-task | Owner | Done when |
| --- | --- | --- | --- |
| B3.1 | Receive BOM and engineering sheet | Procurement | Received |
| B3.2 | Stock check against the BOM | Procurement | Each line: in stock / to buy |
| B3.3 | **Cost sheet** prepared and uploaded to the ERP | Procurement | Uploaded |
| B3.4 | PO prepared in the ERP; **ERP PO number and file stored in Compass** | Procurement | Stored |
| B3.5 | **Finance approval** recorded | Procurement or Admin | Recorded with proof |
| B3.6 | PO released to supplier | Procurement | Released |
| B3.7 | **Material mobilisation**: expediting, delivery tracking, inward inspection, goods receipt | Procurement / Factory | Receipts recorded |

If everything is in stock, B3.3 to B3.6 are skipped for those lines.

**B4 · Production — Factory**
| # | Sub-task | Owner | Done when |
| --- | --- | --- | --- |
| B4.1 | Production order and job cards per item | Factory | Created |
| B4.2 | Cutting, machining, assembly, finishing | Factory | Logged |
| B4.3 | In-factory quality check | Factory | Passed |
| B4.4 | Packing and labelling (QR) | Factory | Packed |

**B5 · Ready for dispatch.** Items become `ready`, one by one.

Gates: material available before production starts (*warn*); quality check before packing (*require*).

---

## 5. Closing stages

### Stage 6 · Installation — On-site
Starts per room as soon as that room is ready. It does not wait for the whole project.

| # | Sub-task | Owner | Done when |
| --- | --- | --- | --- |
| 6.1 | **Room site-ready check** (site work done, clean, dry, access, power; B7) | On-site | Room marked ready |
| 6.2 | Dispatch batch planned from ready items for ready rooms (B8) | Factory + On-site | Batch created |
| 6.3 | Designer go-ahead for the batch | Designer | Recorded |
| 6.4 | Dispatch with packing list | Factory | Dispatched |
| 6.5 | Receipt at site and check against the list | On-site | Recorded |
| 6.6 | Installation | On-site | Installed |

A room needs its Track A work done (if any) and its Track B items ready. Gates: room readiness and Designer go-ahead (*warn*).

### Stage 7 · Snagging — On-site, Designer
| # | Sub-task | Owner | Done when |
| --- | --- | --- | --- |
| 7.1 | Snag walkthrough per room | Designer / On-site | Snags raised |
| 7.2 | Fix snags | Factory / Vendor team / On-site | Snags closed |
| 7.3 | Re-inspection | Designer | Passed |

Snags are separate records (`workflow-model.md` §5). Gate → Deep cleaning: no open snags, or accepted by the client in writing. *Default: warn.*

### Stage 8 · Deep cleaning — Vendor team
| # | Sub-task | Owner | Done when |
| --- | --- | --- | --- |
| 8.1 | Book the cleaning vendor | Vendor team | Booked |
| 8.2 | Deep clean per room | Vendor team | Done |
| 8.3 | Cleaning inspection | On-site / Designer | Passed |

### Stage 9 · Handover — Designer
| # | Sub-task | Owner | Done when |
| --- | --- | --- | --- |
| 9.1 | Final walkthrough | Designer | Held |
| 9.2 | Handover pack: as-built, care guide, warranties | Designer | Uploaded |
| 9.3 | Client sign-off (B10) | Designer | Attached |
| 9.4 | **Final payment recorded as received** | Admin | Flag set |
| 9.5 | Close the project and archive | Admin | Closed |

Gate → Closed: sign-off, zero open snags and final milestone received. *Default: require approval.*

---

## 6. Open items

1. Which ERP, and whether an integration is wanted later. v1 stores the PO number and file by hand.
2. Who runs deep cleaning (assumed: Vendor team books it, On-site inspects).
3. Whether every PO needs finance approval or only those above an amount (assumed: always).
4. Warranty and post-handover issues are not in the pipeline yet.
5. Whether work-order rates (Track A) may be seen by Procurement as well as the Vendor team.
