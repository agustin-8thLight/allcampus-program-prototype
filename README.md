# AllCampus Program Experience, Prototype

A throwaway design prototype for iterating on the AllCampus program-browsing and
program-detail UX. **Not production code.** The real implementation target is a no-code
(Bubble) app, so this exists to get to high-fidelity, iterable screens fast and to double as
a precise spec for the developer. Reusability is intentionally low priority.

> **Heads-up for reviewers:** the data here is placeholder. Program costs, school stats
> (accreditation, completion rates), and all program images are **mock / FPO** and must not be
> read as real numbers. They need sourcing and verification before any external use.

## Concepts

Switch between them in the dark **prototype review bar** at the top (or `?variant=`). The bar is
review chrome and is not part of the AllCampus product UI. Open **Concept notes** in the bar for
the full design rationale, differences, and technical dependencies.

- **Baseline (1A)** — today's content, reordered cost-first, one CTA, cost rebuilt as a value
  card. Lowest effort; ships on existing data.
- **Guided (2B)** — the full structured page: normalized school trust panel (accreditation,
  completion rate) plus Ally as an optional helper, ordered around the decision.
- **Ask-First (2C)** — a departure: the questions people actually ask, answered up front, with
  Ally as the spine. No persona model required.

## Shared foundations (all concepts)

- **One CTA opens a chooser** (request info / talk to a specialist / contact the school). A
  confirmation gate guards **only** the contact-school path, so a lead never reaches the school
  until the user confirms. Direct-handoff schools skip the chooser and link straight out.
- **Value card** states one "what this costs you" line from the three levers (discount, deferred
  payment, employer benefit) with a fallback hierarchy, plus an always-visible estimate caveat.
- **Ally** is a program-scoped assistant that lives as a view inside the same drawer (no stacked
  modals), never contacts the school on its own, and admits when it lacks verified data instead
  of inventing it.

## Stack

Vite + React + Tailwind v4, no TypeScript. Static build, no backend.

```bash
npm install
npm run dev      # local dev server
npm run build    # static output in dist/
npm run preview  # preview the production build
```

Deploy: `npm run build` and serve `dist/` on any static host. There is no path-based routing,
so no SPA redirect rules are needed. Assets (including images) are bundled, so it works at any
base path.

## Review / dev URL params

- `?variant=1A|2B|2C` — open a concept directly
- `?notes=1` — open the concept-notes panel
- `?program=<id>` — deep-open a program drawer (ids in `src/data/programs.json`)
- `&ally=1` — open the Ally view; `&allyq=fit|cost|employer|admission|outcomes` pre-asks a question
- `&flow=choose|gate` — open the request-information flow at a step

## Structure

- `src/data/` — `programs.json`, `schools.js`, and `model.js` (value-card resolver, badge
  normalizer, sorting). Field names are best-guess and must be reconciled 1:1 with the
  developer's content-types doc at handoff.
- `src/components/` — `PrototypeFrame` (review chrome) wraps `App` (the product). The drawer
  hosts three swappable views: `ProgramDrawerView`, `AllyChat`, `CtaFlow`.
- `src/assets/programs/` — program images, named by program id (FPO).
- `docs/` — the build plan, current-UX reference, and reference screenshots.
