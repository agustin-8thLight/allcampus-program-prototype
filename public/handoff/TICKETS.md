# Handoff to Terrence — conditions, blockers, and open questions

From the 2026-08-31 review: "a lot of my first day with this prototype will be identifying
all the different things that need to click… all the buttons that need to do X, all the
buttons that need to do Y, and all the conditions associated with them."

This is that list. Every row carries a `file:line` so nothing has to be taken on trust.
The visual route map is `index.html` beside this file.

**Internal.** Real client and employer names throughout.

---

## Read these five first — they will bite

### 1. The gate does not fire on "Apply now", but the docs say it should

Both HubSpot sources say the confirmation gate covers **both** school-channel actions:
`Change-and-Dependency-Map.md:31`, `:62-63` and `Handoff-Updates-2026-06-24.md:65-66` —
info is not sent "until they pick 'Talk to school' **or** 'Apply now'."

In code, only one is gated:
- "Talk to {school}" → `setStep('gate')` — `CtaFlow.jsx:109` ✅
- "Apply now" → `applyNow()` → `window.open()` then `complete()` immediately, **no gate** —
  `CtaFlow.jsx:116`, `:54-61` ❌

Defensible (the user leaves to the school's own form, which collects the data itself), but
it means `Apply now → Sent to school (high intent) / New / SQL` fires with no confirmation.
**Settle this before wiring D8.**

### 2. `applyNow` never checks the URL exists

`Program Experience Current UX Reference.md:290` requires two conditions: an application URL
"available **and** configured."

`CtaFlow.jsx:55` calls `window.open(program.applicationUrl, ...)` unconditionally. A missing
URL opens a blank tab **and still fires the success toast and `onRequested`**
(`CtaFlow.jsx:56-60`, `:49`). Same gap at `AllyChat.jsx:304`.

### 3. The HubSpot table is `standard`-schools only, and nothing says so

`snhu` and `metro-tech` are `routingType: 'directHandoff'` (`schools.js:119`, `:135`), which
"hands the user entirely to the school's own funnel… no gate, no specialist step"
(`schools.js:9`).

So for those two schools, at least two of the five documented transitions are **unreachable**
— including the whole `EBA Scheduled` branch. No source anywhere states what deal stage,
lead status, or lifecycle a `directHandoff` outbound click should write. **That is a decision
someone owes you, not a bug.**

### 4. `benefitKnown` is re-derived in ten places, and two of them disagree

`partnerState()` at `BenefitsAndHow.jsx:27-42` is the intended predicate. But the same logic
is re-implemented inline at `App.jsx:425`, `ProgramCard.jsx:30`, `AllyOverlay.jsx:27`,
`ValueCard.jsx:26`, `Pathfinder.jsx:53`, `ProfileResults.jsx:25`, `GateModal.jsx:11`,
`SchoolPage.jsx:41`, `BenefitBlock.jsx:63`.

`BenefitBlock.jsx:63` uses a **different partition**: it sends `texas-roadhouse` to `'none'`
where `partnerState` sends it to `trPossible`. A 2026-08-28 comment at
`BenefitsAndHow.jsx:31-37` records fixing exactly this bug in one place; this one was missed.
**One consolidation ticket: export a single predicate, delete the nine copies.**

### 5. `global-default` gets the wrong copy

The partner literally named "Standard, no employer benefit" (`corporatePartners.js:42`) with
`benefitKnown: false` classifies as **`trPossible`** — "reimbursement possible, go check" —
because `partnerType` is `null` and `noTr` requires `perks` or `direct-no-tr`
(`BenefitsAndHow.jsx:27-42`).

That is the default for every visitor with no employer on file. Probably a bug, undocumented
either way.

---

## Ship-blockers — three, from `Change-and-Dependency-Map.md:83-95`

"Ship-blocking" is defined there as: cannot go in front of students until resolved.

| Change | Blocked on | Owner | Why it blocks |
|---|---|---|---|
| **C4** capped caption | **K1** — the $5,250 figure verified | AC + 8L | It is the IRS §127 tax-free limit; needs a tax or benefits source, not an engineer |
| **C5** cap vs discount | **D7** known-TR flag + a per-partner switch | AC + DEV | "shows wrong price otherwise" |
| **C10/C11** chooser + gate | **D8** HubSpot deal + stage wiring | DEV | "deal creation is the point" |

Plus one partial: **C3** deferred pill is "wrong without D7."

## Two new columns the client must supply

Everything else in the data model already exists.

| ID | Field | Why | Source |
|---|---|---|---|
| **D5** | `certLevel` — Undergraduate \| Master's-level | "A master's-level certificate requires a bachelor's first" (`Handoff-Updates-2026-06-24.md:83-86`) | **New Bubble column.** Brigid has levels in a spreadsheet |
| **D7** | partner-level "known TR" flag | "deferment requires TR at every school that offers it" (`Handoff-Updates:80-82`) | **New.** Needs AC to classify each partner |

`D3 creditsPerClass` is not new but is a **placeholder** today (`Change-and-Dependency-Map.md:49`).

## The HubSpot state machine

Identical across three sources, which makes it the most stable contract in the corpus:
`Change-and-Dependency-Map.md:65-71`, `Handoff-Updates-2026-06-24.md:57-63`, and Brigid's
original at `Program Page Feedback (last updates!) .md:29-49`.

| User action | Deal stage | Lead status | Lifecycle |
|---|---|---|---|
| Get program details (opens chooser) | Deal created | — | — |
| Talk to school | Sent to school | New | SQL |
| Apply now | Sent to school (high intent) | New | SQL |
| Connect with an EBA (advisor) | Information requested | EBA Scheduled | MQL |
| No action taken | Information requested | New | MQL |

**The rule:** opening the chooser is a CRM write with **no PII egress**. Only the two
school-channel branches release contact info, and only after an explicit yes (C11).

`EBA Scheduled` is an existing CRM value that maps to the UI term **Education Benefits
Specialist** (`Change-and-Dependency-Map.md:73-74`). Do not rename the CRM field.

**Not settled by any doc:** whether "Sent to school (high intent)" is a distinct pipeline
stage or a property on "Sent to school." Confirm against the live pipeline.

## Request Information — the seven steps

Verbatim, `Program Experience Current UX Reference.md:270-281`:

1. Show a loading state
2. Create a selected-program item for the user
3. Create or schedule a program-interest process
4. Set the program-interest status to **Information Requested**
5. Save the request origin as **Search** or **Ally**
6. Send related information to HubSpot
7. Set a success state for requested information

Steps 2 and 3 are stateful writes to model. Step 5 is the only place in the corpus that names
the attribution enum. **Logged-out:** the flow routes to signup, and "after login or signup,
the request can continue" (`:283-286`) — so the intent must survive the auth round-trip.

Six entry points, not one (`:257-268`): drawer top CTA and bottom card × Search and Chatbot
contexts, the Program Page, and the Apply Now modal.

## Partner conditions — what drives conditional UI

`hasBenefitAdmin(partner)` — `corporatePartners.js:317-319` — is a **conjunction**:
`partnerType === 'benefit-admin' && !!benefitAdmin`. Setting `benefitAdmin` without also
setting `partnerType` silently does nothing. Real footgun.

`partnerState(partner)` — `BenefitsAndHow.jsx:27-42` — returns
`{ reimburses, noTr, trPossible }`, exactly one true, exhaustive even for null input.

**Only `perks` and `direct-no-tr` are definitely-no-reimbursement.** Everything else with a
zero amount is "possible, go check."

| Partner | Type | Reimburses | Admin | State |
|---|---|---|---|---|
| `sheetz` | direct-tr | $5,250 | — | reimburses |
| `boeing` | benefit-admin | $10,000 | **BenefitHub** | reimburses |
| `giant-eagle` | direct-mixed | $3,500 | — | reimburses |
| `edassist` | benefit-admin | $5,250 | **your benefit administrator** | reimburses |
| `texas-roadhouse` | direct-mixed | **0, on purpose** | — | trPossible |
| `lowes`, `benefit-no-tr` | perks | 0 | — | noTr |
| `direct-no-tr` | direct-no-tr | 0 | — | noTr |
| `global-default` | null | 0 | — | trPossible ← see #5 above |

**Do not "fix" the Texas Roadhouse zero.** `corporatePartners.js:84-89`: it is a sentinel, not
missing data. Zero drives `trPossible`, so the page asks someone to check rather than
promising an amount. Populating a placeholder changes the page's promise.

**Open archetype question** (`corporatePartners.js:108-110`): is BenefitHub the administrator
of Boeing's reimbursement, or only a portal listing the perk? It flips `hasBenefitAdmin` and
several copy branches. Unresolved.

## The cost-card rule contradicts itself

Five sources say no calculator math on the cost card — `model.js:5-6`,
`program-experience-build-plan.md:20-22`, `ValueCard.jsx:16`, `benefit.js:6-8`,
`taxonomy-notes.md:52-54`. Two of them assert `benefit.js` powers "the landing benefit block
only."

**It does not.** `estimatedOutOfPocket` is rendered by the cost card (`ValueCard.jsx:93`) and
the list card (`ProgramCard.jsx:92`). The reversal is documented at `ValueCard.jsx:21-24`
(2026-08-12 direction). So `ValueCard.jsx:16` is stale within the same file whose body does TR
math five lines later.

**One human decides which rule governs, then four locations get corrected.** The June decision
came from James directly; the reversal is attributed only to an undated "direction."

## From this morning, not yet in the code

| Decision | Current state |
|---|---|
| Account creation on program-card **click**, upstream of the card opening | Not built. Gate currently fires on Save/Compare and the catalog prompt (`GateModal.jsx:3-8`) |
| Catalog and school lists browsable pre-login; only actions require signup | `GateModal.jsx:3-8` still documents the superseded Aug 14 lock-down |
| One school page for all; TR/benefit elements dynamic when logged in, hidden when not | Today it branches on partner archetype, not on login state |
| Post-signup redirect to Brigid's HubSpot calendar via a temporary DB flag | Terrence's, not built |
| "Request information through AllCampus to secure your discount" throughout | Partially present |
| Program filters ship with static or "20+" counts; filters accurate, counts need not be | Filters in the prototype are **visual only** (`Change-and-Dependency-Map.md:97`) |

## Standing caveats

- **Real client names in the source tree** — Sheetz, Texas Roadhouse, Boeing, Giant Eagle,
  Lowe's (`corporatePartners.js:28-33`). Scrub or get clearance before any external use.
- **Every dollar figure is mock.** `benefit.js:9-10`, `corporatePartners.js:32-33`,
  `schools.js:19-21` each say so independently. K1's $5,250 needs a tax source.
- **`schools.js:14-15`** — field names are best-guess and must be reconciled one-to-one with
  your content-types doc before the Bubble build.
- Filters are visual only; sort chips are functional. Both need real wiring.

## Suggested build order

From `Change-and-Dependency-Map.md:123-130`:

1. **Phase 1, no Ally:** cost-card states (C1, C2, C4, C6), specialist-under-cost (C8),
   chooser + gate + HubSpot deal (C10, C11), filter and sort wiring (C14, C15),
   returning-user (C12)
2. **Resolve blockers in parallel:** K1 ($5,250), D7 (known-TR flag) → unlocks C5 and fixes C3
3. **Populate data:** D3 real credits-per-class, D5 cert levels
4. **Phase 2:** Ask Ally (C16) once K3 is answered

Note step 1 builds C4 while step 2 unblocks it — build it, hold it from students until K1
clears.

## QA deep links

`Change-and-Dependency-Map.md:136-145`. Append to the prototype URL:

| Scenario | Param |
|---|---|
| Discounted degree | `?program=nursing-u-healthcare-admin` |
| No-discount degree + deferred | `?program=state-online-supply-chain` |
| Master's | `?program=txwes-mba-corporate` |
| Capped certificate | `?program=abilene-prehealth-cert` |
| Flat-upfront cert, Master's-level | `?program=state-online-pm-cert` |
| Credit-bearing certificate | `?program=metro-tech-data-cert` |
| Chooser flow | `&flow=choose` |
| Employer switch | `?employer=boeing` (also sheetz, lowes, texas-roadhouse, edassist, giant-eagle) |
