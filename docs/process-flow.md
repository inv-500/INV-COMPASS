# INV Compass — Interior Project Process Flow

Nine stages from discovery to post-handover. Each sub-task has an owner, a start condition, a done condition and a gate. The app models these as `stage_templates` and `task_templates` (see `/docs/data-model.md`), so Admin can adjust them in Settings.

Lead qualification sits outside this flow; a project starts when Admin creates it.

Codes B1–B10 refer to business rules captured in the data model:
B1 architect yes/no · B2 phases · B3 item classification (route and type) · B7 room site-ready · B8 dispatch batch · B10 handover sign-off.

Items marked [OPEN] or [ASSUMPTION] still need a founder decision.

## Overview

1. Discovery and brief
2. Concept and commercials
3. Design development
4. Docket and technical design
5. Procurement and production (parallel with 6)
6. Site works (parallel with 5)
7. Dispatch and installation
8. Quality check and handover
9. Post-handover

Stages 1–4 run in order. Stage 6 starts once the contract is signed and runs alongside Stages 3–5; both tracks meet at dispatch, which needs items packed (5.5) **and** the room site-ready (B7).

---

## Stage 1 — Discovery and brief
Exit gate: **client signs off the brief.**

| # | Sub-task | Owner | Starts when | Done when | Gate |
| --- | --- | --- | --- | --- | --- |
| 1.1 | Discovery questionnaire | Designer | Project created | Budget, timeline, room-wise needs, services, style captured; architect yes/no (B1); item types in scope; phases (B2) | None |
| 1.2 | Site survey and measurement | On-site; designer checks | 1.1 started (parallel) | Measurements, photos, service points and logistics notes logged | Designer approval |
| 1.3 | Floor plan | Architect, or designer if no architect (B1) | 1.2 done, or architect's plan received | Base floor plan uploaded | Designer approval |
| 1.4 | Brief sign-off | Designer, client | 1.1–1.3 done | Written brief confirmed by client | Client sign-off |

## Stage 2 — Concept and commercials
Exit gate: **contract signed and advance received.**

| # | Sub-task | Owner | Starts when | Done when | Gate |
| --- | --- | --- | --- | --- | --- |
| 2.1 | Concept deck | Designer | Brief signed off | Concept direction and space-planning options shared | None |
| 2.2 | First-cut BOQ | Designer; estimator [ASSUMPTION] | 2.1 in progress | Room-wise budget estimate shared | None |
| 2.3 | Concept and BOQ acceptance | Client | 2.1 and 2.2 shared | Client confirms direction and budget band in writing | Client acceptance |
| 2.4 | Contract and advance payment | Founder / sales [OPEN] | 2.3 done | Scope, specification, milestones, approval turnaround and variation terms signed; advance received | Payment received |

## Stage 3 — Design development
Exit gate: **final BOQ approved by client.**

| # | Sub-task | Owner | Starts when | Done when | Gate |
| --- | --- | --- | --- | --- | --- |
| 3.1 | Design presentation | Designer | Contract signed | Layouts and 3D renders presented; feedback closed | Client acceptance |
| 3.2 | Mood board and samples | Designer, client | 3.1 accepted | Materials and finishes approved; signed master samples kept | Client sign-off |
| 3.3 | Final BOQ | Designer; estimator [ASSUMPTION] | 3.2 signed off | BOQ updated to approved materials | Client approval |
| 3.4 | Design-stage payment | Admin (accounts) | 3.3 approved | Milestone payment received | Payment received [ASSUMPTION] |

## Stage 4 — Docket and technical design
Exit gate: **production release — client-approved GFC drawings.**

| # | Sub-task | Owner | Starts when | Done when | Gate |
| --- | --- | --- | --- | --- | --- |
| 4.1 | Docket | Design team | Final BOQ approved | Every item coded, tagged and classified (B3); docket submitted and locked | Docket submitted |
| 4.2 | Final site measurement | On-site; designer checks | Site wet work done | Final dimensions and reference lines recorded | Designer approval |
| 4.3 | Engineering design and BOM | GFC | 4.1 locked and 4.2 done | GFC drawings and BOM ready per item | Internal technical check [OPEN] |
| 4.4 | GFC drawing approval | Designer, client | 4.3 done | Client has signed GFC drawings per item or room | Client sign-off |
| 4.5 | Mock-ups and prototypes | Factory, designer | 4.4 signed (hero or repeated items only) | Prototype approved before batch production | Client sign-off |

## Stage 5 — Procurement and production (parallel with Stage 6)
Exit gate: **items pass QC and are ready to dispatch.**

| # | Sub-task | Owner | Starts when | Done when | Gate |
| --- | --- | --- | --- | --- | --- |
| 5.1 | Procurement of bought-in items | Procurement | Each item's approval (long-lead first) | POs placed; items delivered and inspected against PO and sample | Inward inspection |
| 5.2 | Factory raw materials | Procurement / Factory [OPEN] | GFC drawings approved | Materials in stock for the production order | None |
| 5.3 | Production — millwork | Factory | 5.2 done | Made and matched to master sample | Stage checks [OPEN] |
| 5.4 | Production — loose furniture | Factory | 5.2 done; prototype approved if needed | Frames, finish and upholstery complete | Stage checks [OPEN] |
| 5.5 | Factory QC and pre-dispatch check | QC lead [OPEN]; optional client/designer visit | 5.3 / 5.4 done | Checked, packed and labelled by room | QC pass |
| 5.6 | Pre-dispatch payment | Admin (accounts) | 5.5 passed | Milestone payment received | Payment received [ASSUMPTION] |

## Stage 6 — Site works (parallel with Stage 5)
Exit gate: **room site-ready for millwork (B7).**

| # | Sub-task | Owner | Starts when | Done when | Gate |
| --- | --- | --- | --- | --- | --- |
| 6.1 | Site handover and protection | On-site | Contract signed, site available | Condition report and photos; floors, lifts, windows protected | None |
| 6.2 | Civil, MEP and false ceiling | On-site / Vendor team | 6.1 done; points marked from approved drawings | Works done and tested | Designer check |
| 6.3 | Flooring, plaster, first paint coats | On-site / Vendor team | 6.2 done | Wet work complete; room lockable | None |
| 6.4 | Site readiness check | On-site; designer checks | 6.3 done | Readiness checklist passed (B7) | Site ready (B7) |

## Stage 7 — Dispatch and installation
Exit gate: **all items installed or placed.**

| # | Sub-task | Owner | Starts when | Done when | Gate |
| --- | --- | --- | --- | --- | --- |
| 7.1 | Dispatch planning and storage | On-site [ASSUMPTION] | Items packed (5.5) and room ready (B7) | Items in a dispatched batch (B8), or held in storage | Designer go-ahead [OPEN] |
| 7.2 | Receipt inspection at site | On-site | Items received | Checked against packing list; damage logged with photos | None |
| 7.3 | Millwork installation | On-site | 7.2 done | Fixed, levelled, scribed, hardware adjusted | None |
| 7.4 | Follow-on vendor items | Vendor team; on-site coordinates | 7.3 done for that room | Stone, glass, mirrors, metal trims fitted | None |
| 7.5 | After-millwork services and final paint | On-site / Vendor team | 7.3 / 7.4 done | Electrical fit-off, fixtures, final paint done | None |
| 7.6 | Loose furniture placement | On-site | Room cleaned after 7.5 | Furniture, rugs, curtains placed | None |
| 7.7 | Protection of installed work | On-site | Each item installed | Installed items covered until handover | None |

## Stage 8 — Quality check and handover
Exit gate: **handover sign-off (B10).**

| # | Sub-task | Owner | Starts when | Done when | Gate |
| --- | --- | --- | --- | --- | --- |
| 8.1 | Testing and commissioning | On-site | Stage 7 done | Lights, automation, appliances, every door, drawer and lock tested | None |
| 8.2 | Internal QC and snag list | Designer, On-site | 8.1 done | Snags raised and closed | Designer check [OPEN] |
| 8.3 | Deep cleaning and styling | On-site, Designer | 8.2 closed | Cleaned; accessories, art, soft furnishings placed | None |
| 8.4 | Client walk-through | Designer, client | 8.3 done | Client snags logged and closed | Client acceptance |
| 8.5 | Handover pack | Designer | 8.4 done | Warranties, care guide, finish register, spares and keys handed over | None |
| 8.6 | Final sign-off and payment | Designer, client, Admin | 8.5 done | Sign-off recorded (B10); final payment received | Handover sign-off |

## Stage 9 — Post-handover
Exit gate: **warranty period ends and project closed.**

| # | Sub-task | Owner | Starts when | Done when | Gate |
| --- | --- | --- | --- | --- | --- |
| 9.1 | Defects and warranty support | On-site [OPEN] | Handover sign-off | Service requests closed within warranty [OPEN: length] | None |
| 9.2 | Internal close-out | Admin | Handover sign-off | Cost vs BOQ, margin, vendor ratings, lessons recorded | None |
| 9.3 | Feedback, photos, referral | Designer | Client moved in | Feedback, photos (with consent), referral requested | None |
| 9.4 | Retention release | Admin (accounts) | Warranty ends | Retention settled; project closed | None |

---

## Rules across stages

- **Variations after docket lock (4.1):** priced, time impact shown, client approves in writing, docket/drawings/BOQ updated, then released. Released items affected by a variation return to GFC.
- **Approval turnaround:** the contract sets working days per approval; overdue approvals are flagged and shift dates.
- **Revision limits:** concept and design presentation include a set number of revision rounds.
- **Payment milestones gate work:** 2.4, 3.4, 5.6, 8.6, 9.4. Percentages [OPEN].
- **Gate overrides:** only Admin, with a written reason, logged.
