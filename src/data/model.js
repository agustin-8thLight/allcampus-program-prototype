/*
 * Program model helpers (build plan §4, §6, §7, §8).
 *
 * Pure functions over the seed data. The value-card resolver and badge
 * normalizer are the heart of the Phase 1 redesign and are deliberately the
 * only place cost/benefit precedence lives.
 */

import programsRaw from './programs.json'
import { getSchool, isDirectHandoff } from './schools.js'

/*
 * Program images (FPO). Bundled via Vite so they work at any host path. Files
 * are named after the program id; matched by basename. Missing files fall back
 * to the gradient placeholder in <ProgramImage>.
 */
const PROGRAM_IMAGES = import.meta.glob('../assets/programs/*.{jpg,jpeg,png,webp}', {
  eager: true,
  query: '?url',
  import: 'default',
})

function imageForId(id) {
  const hit = Object.entries(PROGRAM_IMAGES).find(
    ([path]) => path.split('/').pop().replace(/\.[^.]+$/, '') === id,
  )
  return hit ? hit[1] : null
}

/** Join each program to its school so components get one object. */
export const PROGRAMS = programsRaw.map((p) => ({
  ...p,
  school: getSchool(p.schoolId),
  routingType: getSchool(p.schoolId)?.routingType || 'standard',
  isDirectHandoff: isDirectHandoff(p.schoolId),
  programImageUrl: imageForId(p.id),
}))

export function getProgram(id) {
  return PROGRAMS.find((p) => p.id === id) || null
}

/* ------------------------------------------------------------------ */
/* Formatting                                                          */
/* ------------------------------------------------------------------ */

export function money(n) {
  if (n == null) return null
  return n.toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  })
}

/* ------------------------------------------------------------------ */
/* Badge normalization (§7). One typed value -> school-agnostic label. */
/* ------------------------------------------------------------------ */

export function badgeLabel(p) {
  switch (p.badgeType) {
    case 'fullyCovered':
      return '$0 out of pocket'
    case 'deferred':
      return 'Deferred payment available'
    case 'discountCap':
      return p.discountAmount != null ? `Capped at ${money(p.discountAmount)}` : 'Tuition capped'
    case 'discountPercent':
      return p.discountPercent != null ? `${p.discountPercent}% off` : 'Discounted tuition'
    case 'lowTuition':
      return 'Low tuition'
    case 'none':
    default:
      return null
  }
}

/** Visual tone for the badge, kept consistent regardless of school. */
export function badgeTone(p) {
  switch (p.badgeType) {
    case 'fullyCovered':
      return 'good'
    case 'deferred':
      return 'info'
    case 'discountCap':
    case 'discountPercent':
    case 'lowTuition':
      return 'brand'
    default:
      return null
  }
}

/* ------------------------------------------------------------------ */
/* Start date display (§D8): real cohort date -> Rolling -> hide.      */
/* ------------------------------------------------------------------ */

export function startDateDisplay(p) {
  if (p.startDate) {
    const d = new Date(p.startDate + 'T00:00:00')
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  }
  if (p.rollingEnrollment) return 'Rolling enrollment'
  return null
}

export function deadlineDisplay(p) {
  if (!p.applicationDeadline) return null
  const d = new Date(p.applicationDeadline + 'T00:00:00')
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

/* ------------------------------------------------------------------ */
/* Value-card resolver (§6 fallback hierarchy).                        */
/*                                                                     */
/* Render the first available top line:                                */
/*   1. out-of-pocket after employer benefit (struck standard price)   */
/*   2. estimated total cost (employer benefit, no clean OOP figure)   */
/*   3. discounted per-credit vs standard per-credit                   */
/*   4. per-credit only                                                */
/* Deferred-payment availability rides as a secondary line.            */
/*                                                                     */
/* DECISION (resolved): capped programs lead with discounted           */
/* per-credit (tier 3); the cap is carried by the badge. Tier 2 is     */
/* reserved for employer-benefit-without-clean-out-of-pocket.          */
/* ------------------------------------------------------------------ */

export function resolveValueCard(p) {
  const deferred = !!p.deferredPaymentAvailable
  const standardTotal =
    p.standardTuitionPerCredit != null && p.requiredCredits != null
      ? p.standardTuitionPerCredit * p.requiredCredits
      : p.totalTuitionCost

  // Tier 1: employer benefit produces an out-of-pocket figure.
  if (p.outOfPocketEstimate != null && p.employerReimbursementEstimate != null) {
    return {
      tier: 'outOfPocket',
      label: 'Estimated out of pocket',
      value: money(p.outOfPocketEstimate),
      struck: standardTotal != null ? money(standardTotal) : null,
      benefitLabel: 'after employer benefit',
      breakdown: [
        { label: 'Employer covers', value: money(p.employerReimbursementEstimate) },
        { label: 'You pay', value: money(p.outOfPocketEstimate) },
      ],
      deferred,
    }
  }

  // Tier 2: employer benefit present but no clean out-of-pocket figure,
  // so lead with estimated total cost. Dormant in current seed data.
  if (p.employerReimbursementEstimate != null && p.totalTuitionCost != null) {
    return {
      tier: 'totalCost',
      label: 'Estimated total cost',
      value: money(p.totalTuitionCost),
      struck: standardTotal != null && standardTotal > p.totalTuitionCost ? money(standardTotal) : null,
      benefitLabel: 'after employer benefit',
      perCreditNote: p.tuitionPerCredit != null ? `${money(p.tuitionPerCredit)} per credit` : null,
      deferred,
    }
  }

  // Tier 3: discounted per credit vs standard. Used by both percent-off
  // and capped programs (the cap shows in the badge).
  if (
    p.tuitionPerCredit != null &&
    p.standardTuitionPerCredit != null &&
    p.tuitionPerCredit < p.standardTuitionPerCredit
  ) {
    const pct =
      p.discountPercent != null
        ? p.discountPercent
        : Math.round((1 - p.tuitionPerCredit / p.standardTuitionPerCredit) * 100)
    return {
      tier: 'discountedPerCredit',
      label: 'Discounted tuition per credit',
      value: money(p.tuitionPerCredit),
      struck: money(p.standardTuitionPerCredit),
      benefitLabel: pct > 0 ? `${pct}% off` : 'discounted rate',
      deferred,
    }
  }

  // Tier 4: per-credit only.
  return {
    tier: 'perCredit',
    label: p.badgeType === 'lowTuition' ? 'Low tuition per credit' : 'Tuition per credit',
    value: money(p.tuitionPerCredit),
    struck: null,
    benefitLabel: null,
    deferred,
  }
}

/* ------------------------------------------------------------------ */
/* List sorting + quick-filter chips (§7, §10.7).                      */
/* ------------------------------------------------------------------ */

/** Lower is more affordable. fullyCovered sorts to the very top. */
export function affordabilityScore(p) {
  if (p.badgeType === 'fullyCovered') return -1
  if (p.outOfPocketEstimate != null) return p.outOfPocketEstimate
  if (p.annualEstimatedCost != null) return p.annualEstimatedCost
  if (p.totalTuitionCost != null) return p.totalTuitionCost
  return Number.MAX_SAFE_INTEGER
}

/** Parse "2 years" / "3.3 years" / "1 year" to a comparable number. */
export function durationYears(p) {
  const m = /([\d.]+)/.exec(p.duration || '')
  return m ? parseFloat(m[1]) : Number.MAX_SAFE_INTEGER
}

export const QUICK_FILTERS = [
  { id: 'mostAffordable', label: 'Most affordable', kind: 'sort' },
  { id: 'fullyCovered', label: 'Fully covered', kind: 'filter' },
  { id: 'deferred', label: 'Deferred tuition', kind: 'filter' },
  { id: 'fastest', label: 'Fastest', kind: 'sort' },
]

export function applyQuickFilter(programs, activeId) {
  let out = [...programs]
  switch (activeId) {
    case 'fullyCovered':
      out = out.filter((p) => p.badgeType === 'fullyCovered')
      break
    case 'deferred':
      out = out.filter((p) => p.deferredPaymentAvailable)
      break
    case 'fastest':
      out.sort((a, b) => durationYears(a) - durationYears(b))
      break
    case 'mostAffordable':
    default:
      out.sort((a, b) => affordabilityScore(a) - affordabilityScore(b))
      break
  }
  return out
}
