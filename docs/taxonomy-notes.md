# Areas of study ↔ skills ↔ employers — data model notes

Added 2026-08-11 from the client meeting direction ("skill categories replace
the random program carousel") and the "Programs Options in the network (list
for new landing page)" PDF. Interim model: **swap in Brigid's keyword/skill
data from the affordability-filter project when she shares it.**

## The tree

```
Area of study (8)  ──<  Skill (~40)  ──<  Program (tagged)
Business, IT, Engineering, Healthcare, Education,
Criminal Justice & Legal, Liberal Arts, Social Work
```

- `src/data/taxonomy.js` — `AREAS`, `SKILLS` (each skill has exactly ONE
  `areaId`; the source PDF is a strict tree — revisit if Brigid's data is
  many-to-many), `FEATURED_SKILL_IDS` (the broad high-value buckets the
  landing shows by default: AI/data, nursing, leadership, software, supply
  chain, …).
- `src/data/programs.json` — every program now carries `areaId` + `skillIds`.
  Hand-tagged for the 8 mock programs; production tagging comes from the
  catalog keywords.

## Interaction rules (landing skills section)

1. Default: show `FEATURED_SKILL_IDS` (broad buckets across areas).
2. Selecting an **area chip shortens the list** to that area's full skill set.
3. Selecting a **skill routes to `#/browse?skill=<id>`** — the browse surface
   filters programs by tag and shows a clearable "Filtered by" chip.
4. The browse surface's "Areas of Study" dropdown drives the same `areaId`
   filter (it was a UI stub before).

## Employer emphasis (dynamic by employer)

`src/data/corporatePartners.js` records now carry:

- `emphasizedAreaIds` — these areas' skills sort first in the default view
  (e.g. Duncan Aviation: engineering, IT, business).
- `hiddenAreaIds` — pruned from the default skill list AND the area chip row
  (Duncan shows engineering, not nursing).
- `benefitKnown` — drives the benefit block's known vs fallback state.

Demo states (review-bar switcher, `?employer=` override): `duncan-avn`,
`acme-edu`, `global-default` (unknown benefit).

## Benefit estimates

`src/data/benefit.js` — `estimatedOutOfPocket(program, partner)` =
annual estimated cost − annual benefit (degree-level aware), floored at 0;
`fullyCoveredPrograms()` powers the benefit block's CTA and the browse
`covered=1` filter. **Mock figures, labeled estimates in the UI.** The June
"no calculator math on the cost card" decision still stands; this powers the
new landing benefit block only.

## Open items

- [ ] Replace taxonomy with Brigid's keyword/skill data when shared
  (watch for many-to-many skills).
- [ ] Align EcosystemStrip copy with Brigid's journey map draft.
- [ ] Real employer records + verified benefit math before client-facing use.
