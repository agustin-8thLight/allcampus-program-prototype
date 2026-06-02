# Program Experience Redesign, Build Plan (v2, decisions resolved)

Throwaway design prototype for iterating on the AllCampus program-browsing and
program-detail UX. Not production code and not the implementation target (that is a
no-code/Bubble app). Goal: fastest path to high-fidelity, iterable screens that double
as a precise spec for the developer. Reusability is explicitly low priority since
everything gets rebuilt in Bubble.

## 1. Goal

Help a user make an informed choice, step through the experience correctly, and not
degrade lead quality for schools. Two phases:

- Phase 1: reorder existing content, collapse to a single CTA, rebuild the cost display
  as a value card. Existing data fields only.
- Phase 2: normalize program data across schools (content translation layer) and add an
  in-page AI assistant (Ally) scoped to the current program.

## 2. Surfaces in scope

Program List (search/browse), Search Program Side Drawer, Chatbot (Ally) Program Side
Drawer, Program Page (standalone, reuses drawer content), Request Information / Apply
flow. The drawer, chatbot drawer, and program page share one program-detail content
block. Build it once and render it in all three contexts.

## 3. Resolved decisions

- D1 cost-field reliability: treat all cost fields as nullable; the value card uses a
  fallback hierarchy (section 6).
- D2 CTA + step copy: placeholders with TODO(copy). Intention is fixed, words iterate.
- D3 school routing: two types only (section 8).
- D4 badge normalization: in scope for Phase 1, light (section 7).
- D5 stack: Vite + React + Tailwind, no TypeScript (section 12).
- D6 personas: confirmed, the six on the board (section 9).
- D7 mobile: build responsive scaffolding, design desktop first. (default held)
- D8 "Coming Soon" start date: show real cohort date if present, else "Rolling
  enrollment", else hide. (default held)
- D9 empty sections: hide rather than render placeholder gaps. (default held)

## 4. The value model (drives the whole Phase 1 redesign)

AllCampus brings value through three levers. The value card composes whichever are
present into one readable "what this costs you" story:

1. Discount: percent off, flat cap (e.g. capped at $5,250), or low-tuition flag.
2. Deferred payment: option to defer, varies by school.
3. Employer education benefit: tuition reimbursement / employer-paid, which produces the
   out-of-pocket figure.

Emphasis order, strongest first: fully covered (zero out-of-pocket) > capped >
discounted > low tuition > standard. Always resolve to an estimated out-of-pocket line
when the data allows it, because that is the single highest-value line for the
cost-driven personas.

## 5. Content model (the contract)

Mirror the developer's field names exactly so handoff has no translation loss. Model a
`Program` type and a `School` type. `School` carries `routingType` (section 8) and a
separate `partnerHighlight` boolean for merchandising (corporate-partner programs
surfaced or sorted up regardless of the affordability default; not a routing concern).

Always-show fields (Phase 1): program name, school name, school logo, program image,
program headline, program description, start date, application deadline, duration, time
commitment, degree level, program type, course modality, discount label/amount/percent,
tuition per credit, admission requirements, benefits, curriculum highlights, terms,
optional concentrations, application URL.

Value-relevant optional fields: total tuition cost, required credits, annual estimated
cost, out-of-pocket estimate, employer reimbursement estimate, deferred-payment
availability, corporate partner benefits/policy, reimbursement provider URL.

Seed `/data/programs.json` with about six mock programs spanning the badge variety from
the product screens (percent off, flat cap, low tuition, fully covered, none) and
include at least one program missing each optional section to force correct empty
states. Real content from the captured screens is fine to use as seed copy.

## 6. Value card fallback hierarchy (Phase 1)

Render the first available, top line:
1. Estimated out-of-pocket after employer benefit (with benefit label and struck
   standard price).
2. Estimated total cost (with benefit label).
3. Discounted per-credit vs standard per-credit.
4. Per-credit only.

Show deferred-payment availability as a secondary line when present. Legal/eligibility
text always collapses behind a "See full terms" expander; never lead with it.

## 7. Badge normalization (Phase 1, light)

One typed badge value, consistent shape and placement, school-agnostic wording:
`fullyCovered` -> "$0 out of pocket"; `deferred` -> "Deferred payment available";
`discountCap` -> "Capped at $X"; `discountPercent` -> "X% off"; `lowTuition` ->
"Low tuition"; `none`. Quick-filter chips map directly: most affordable (sort),
deferred tuition (`deferred`), fastest (duration), fully covered (`fullyCovered`).

## 8. School routing (two types)

- `standard` (most schools): click-through creates a flag in that school's sales
  funnel. User stays inside the AllCampus-managed RFI flow, including the guided step
  and the school-contact confirmation gate. Nothing reaches the school until the user
  confirms.
- `directHandoff` (two schools, configured by id): hands the user entirely to the
  school's own funnel. Simpler single CTA that links straight out, no AllCampus
  confirmation gate or specialist step.

Keep the two handoff schools in a config lookup keyed by id, not hardcoded in
components, so it matches the Bubble data shape.

## 9. Personas and Phase 1 coverage

Confirmed set: Career Advancer, Career Changer, Upskiller, New Learner, Benefits
Maximizer, The Explorer.

Well served by Phase 1 (value card + single CTA + at-a-glance):
- Benefits Maximizer: the spine. Out-of-pocket line, employer-vs-personal breakdown,
  fully-covered badge and chip.
- New Learner: clear employer-vs-out-of-pocket, at-a-glance orientation, single next
  step.
- The Explorer: benefit/eligibility surfaced early, low commitment fear via duration and
  time-per-week up top.
- Career Advancer: tuition coverage clarity (out-of-pocket vs employer).

Partially served:
- Upskiller: duration, time-per-week, modality in the at-a-glance strip address the
  intensity question; employer-relevant signal is weak until Phase 2.

Not served by Phase 1, be upfront with the client:
- Career Changer: needs ROI, job placement/salary, employer recognition. None of this
  exists in current content. Closes only when Phase 2 normalizes outcome data.

## 10. Phase 1 build order

1. Scaffold (Vite + React + Tailwind, no TS). Tokens isolated and forkable; Lato
   baseline, neutral palette to match current app.
2. `Program` / `School` shapes + mock `programs.json` (badge variety + missing-section
   cases).
3. Shared `ProgramDetail` in affordability-first order (1A): badge -> school/name/
   headline -> value card -> single CTA -> at-a-glance -> About -> Benefits -> Admission
   -> Curriculum -> Terms (de-emphasized footer).
4. Value card with three-lever composition + fallback hierarchy + empty states.
5. Single CTA -> guided step -> confirmation gate flow (logic real, copy TODO). Branch
   on `routingType`: `directHandoff` skips the gate and links out.
6. Drawer wrapper (overlay + dimmed background) rendering `ProgramDetail`.
7. Program List: cards, affordability default sort, quick-filter chips, compare removed.
8. Variant 1B (decision-path) behind a toggle for side-by-side review.
9. Responsive pass.

## 11. Phase 2 (scaffold only, do not build yet)

Normalization layer (one value model, standardized start dates, consistent section
presence). Ally in-page assistant scoped to the current program, inheriting the same
confirmation gate. Persona-adaptive block ranking as the north star (needs profile +
normalized data). Any AI-generated cost or eligibility content is human-reviewed before
going live.

## 12. Stack and running it in Claude Code

Vite + React + Tailwind, no TypeScript. Rationale: the stateful pieces (guided step,
confirmation gate, filter chips, drawer open/close, 1A/1B toggle) iterate fastest in
React, Tailwind gets to high visual fidelity quickly, and dropping TS removes friction
that only pays off in reused code, which this is not. If you want zero build step
instead, a single HTML file with React + Tailwind via CDN works but gets unwieldy once
there are multiple screens and flows.

Suggested first Claude Code prompt: point it at this file and ask it to scaffold the
Vite app, create the `Program`/`School` shapes and a seeded `programs.json` (badge
variety + missing-section cases), then build `ProgramDetail` in the 1A order with the
three-lever value card and its fallback hierarchy. Get that on screen before wiring the
CTA flow.

## 13. Bubble handoff notes

Lists/grids -> repeating groups. Shared header/footer -> reusable elements. Show/hide ->
conditional states. Stay inside these so the build translates. Field names here match
the developer's content-types doc one to one. This prototype is a spec, not source to
import.
