/*
 * Program model helpers. Mirrors the real cost display
 * (tuition_breakdown_calculator-Original): Program + Discount inputs, Corporate
 * Partner reimbursement with a Global-Default fallback, a Program-Pace table,
 * and the discount priority order. The value-card resolver and badge normalizer
 * are the only place cost/benefit precedence lives.
 *
 * Field names map to the developer's content types (Program, Discount,
 * Corporate Partner, Program-Pace). Values are MOCK / FPO.
 */

import programsRaw from './programs.json'
import { getSchool, isDirectHandoff } from './schools.js'
import {
  CURRENT_USER,
  getCorporatePartner,
  GLOBAL_DEFAULT_CORPORATE_PARTNER_ID,
  reimbursementForDegree,
} from './corporatePartners.js'

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

/* ------------------------------------------------------------------ */
/* Cost + discount + reimbursement model                              */
/* ------------------------------------------------------------------ */

/** Standard (pre-discount) total tuition. */
function standardTotal(p) {
  if (p.standardTuitionPerCredit != null && p.requiredCredits != null)
    return p.standardTuitionPerCredit * p.requiredCredits
  return p.totalTuitionCost ?? null
}

/** Total after the AllCampus discount, before any employer benefit. The cap
 *  ($X) is carried by the badge, not folded into this total (per design). */
function discountedTotal(p) {
  if (p.tuitionPerCredit != null && p.requiredCredits != null)
    return p.tuitionPerCredit * p.requiredCredits
  return p.totalTuitionCost ?? null
}

/** AllCampus discount amount (standard total minus discounted total). */
function allCampusDiscount(p) {
  const s = standardTotal(p)
  const d = discountedTotal(p)
  if (s == null || d == null) return 0
  return Math.max(0, s - d)
}

/*
 * Employer reimbursement from the Corporate Partner. Priority: the user's CP,
 * then the program's CP, then the App's Global Default. Degree-level aware and
 * capped at the discounted total (can't reimburse more than the cost).
 */
function employerReimbursement(p, user = CURRENT_USER) {
  const partner =
    getCorporatePartner(user?.corporatePartnerId) ||
    getCorporatePartner(p.corporatePartnerId) ||
    getCorporatePartner(GLOBAL_DEFAULT_CORPORATE_PARTNER_ID)
  const raw = reimbursementForDegree(partner, p.degreeLevel)
  const d = discountedTotal(p)
  return d != null ? Math.min(raw, d) : raw
}

function outOfPocket(p, user = CURRENT_USER) {
  const d = discountedTotal(p)
  if (d == null) return null
  return Math.max(0, d - employerReimbursement(p, user))
}

/*
 * Discount priority order (per the calculator): fully covered -> Corporate
 * Partner / Program-level -> Program-level -> School-level. The seed carries
 * one discount per program; "fully covered" is derived when employer
 * reimbursement covers the discounted total.
 */
function resolveBadgeType(p) {
  if (employerReimbursement(p) > 0 && outOfPocket(p) === 0) return 'fullyCovered'
  const t = p.discount?.type
  if (t === 'flatCap') return 'discountCap'
  if (t === 'percent') return 'discountPercent'
  if (t === 'lowTuition') return 'lowTuition'
  if (p.deferredPaymentAvailable) return 'deferred'
  return 'none'
}

/* ------------------------------------------------------------------ */
/* Program-Pace (Casual / Part-time / Busy / Full-time).               */
/* Derived here; the real calculator reads Program-Pace records.       */
/* ------------------------------------------------------------------ */

const PACE_DEFS = [
  { name: 'Casual', coursesPerTerm: 1 },
  { name: 'Part-time', coursesPerTerm: 2 },
  { name: 'Busy', coursesPerTerm: 3 },
  { name: 'Full-time', coursesPerTerm: 4 },
]
const CREDITS_PER_COURSE = 3
const TERMS_PER_YEAR = 3

export function paceOptions(p) {
  if (p.tuitionPerCredit == null || p.requiredCredits == null) return []
  return PACE_DEFS.map((def) => {
    const creditsPerYear = def.coursesPerTerm * CREDITS_PER_COURSE * TERMS_PER_YEAR
    const years = p.requiredCredits / creditsPerYear
    const billedCredits = Math.min(creditsPerYear, p.requiredCredits)
    return {
      name: def.name,
      coursesPerTerm: def.coursesPerTerm,
      annualCost: Math.round(billedCredits * p.tuitionPerCredit),
      completionTime:
        years >= 1 ? `${Math.round(years * 10) / 10} yrs` : `${Math.max(1, Math.round(years * 12))} mos`,
    }
  })
}

/* ------------------------------------------------------------------ */
/* Enriched programs                                                   */
/* ------------------------------------------------------------------ */

export const PROGRAMS = programsRaw.map((p) => ({
  ...p,
  school: getSchool(p.schoolId),
  routingType: getSchool(p.schoolId)?.routingType || 'standard',
  isDirectHandoff: isDirectHandoff(p.schoolId),
  programImageUrl: imageForId(p.id),
  terms: p.discount?.terms ?? null,
  badgeType: resolveBadgeType(p),
}))

export function getProgram(id) {
  return PROGRAMS.find((p) => p.id === id) || null
}

/* ------------------------------------------------------------------ */
/* Formatting                                                          */
/* ------------------------------------------------------------------ */

export function money(n) {
  if (n == null) return null
  return n.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 })
}

/* ------------------------------------------------------------------ */
/* Badge normalization. One typed value -> school-agnostic label.      */
/* ------------------------------------------------------------------ */

export function badgeLabel(p) {
  switch (p.badgeType) {
    case 'fullyCovered':
      return '$0 out of pocket'
    case 'deferred':
      return 'Deferred payment available'
    case 'discountCap':
      return p.discount?.dollarAmount != null
        ? `Capped at ${money(p.discount.dollarAmount)}`
        : 'Tuition capped'
    case 'discountPercent':
      return p.discount?.percentUsed != null ? `${p.discount.percentUsed}% off` : 'Discounted tuition'
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
/* Start date display: real cohort date -> Rolling -> hide.            */
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
/* Value-card resolver.                                                */
/*                                                                     */
/* Headline tier, first available:                                     */
/*   1. out-of-pocket after employer benefit (struck discounted price) */
/*   2. discounted per-credit vs standard per-credit                   */
/*   3. per-credit only                                                */
/* Plus a line-item breakdown and the pace table (the calculator's     */
/* detailed view), and a deferred-payment secondary line.              */
/* ------------------------------------------------------------------ */

export function resolveValueCard(p, user = CURRENT_USER) {
  const deferred = !!p.deferredPaymentAvailable
  const sTotal = standardTotal(p)
  const dTotal = discountedTotal(p)
  const reimb = employerReimbursement(p, user)
  const oop = outOfPocket(p, user)
  const acDiscount = allCampusDiscount(p)
  const pace = paceOptions(p)
  const maxAnnual = pace.length ? Math.max(...pace.map((x) => x.annualCost)) : null

  // Line-item breakdown (the calculator's detailed view).
  const lineItems = [
    sTotal != null && { label: 'Tuition cost', value: money(sTotal) },
    acDiscount > 0 && { label: 'AllCampus discount', value: `-${money(acDiscount)}` },
    reimb > 0 && { label: 'Employer reimbursement', value: `-${money(reimb)}` },
    oop != null && { label: 'Estimated out of pocket', value: money(oop), strong: true },
    maxAnnual != null && { label: 'Max annual tuition', value: money(maxAnnual) },
  ].filter(Boolean)

  const base = { deferred, pace, lineItems }

  // Tier 1: employer benefit produces an out-of-pocket figure.
  if (reimb > 0) {
    return {
      ...base,
      tier: 'outOfPocket',
      label: 'Estimated out of pocket',
      value: money(oop),
      struck: dTotal != null ? money(dTotal) : null,
      benefitLabel: 'after employer benefit',
      breakdown: [
        { label: 'Employer covers', value: money(reimb) },
        { label: 'You pay', value: money(oop) },
      ],
    }
  }

  // Tier 2: discounted per credit vs standard (percent-off and capped).
  if (
    p.tuitionPerCredit != null &&
    p.standardTuitionPerCredit != null &&
    p.tuitionPerCredit < p.standardTuitionPerCredit
  ) {
    const pct =
      p.discount?.percentUsed != null
        ? p.discount.percentUsed
        : Math.round((1 - p.tuitionPerCredit / p.standardTuitionPerCredit) * 100)
    return {
      ...base,
      tier: 'discountedPerCredit',
      label: 'Discounted tuition per credit',
      value: money(p.tuitionPerCredit),
      struck: money(p.standardTuitionPerCredit),
      benefitLabel: pct > 0 ? `${pct}% off` : 'discounted rate',
    }
  }

  // Tier 3: per-credit only.
  return {
    ...base,
    tier: 'perCredit',
    label: p.badgeType === 'lowTuition' ? 'Low tuition per credit' : 'Tuition per credit',
    value: money(p.tuitionPerCredit),
    struck: null,
    benefitLabel: null,
  }
}

/* ------------------------------------------------------------------ */
/* List sorting + quick-filter chips.                                  */
/* ------------------------------------------------------------------ */

/** Lower is more affordable. fullyCovered sorts to the very top. */
export function affordabilityScore(p) {
  if (p.badgeType === 'fullyCovered') return -1
  const oop = outOfPocket(p)
  if (oop != null) return oop
  if (p.annualEstimatedCost != null) return p.annualEstimatedCost
  return p.totalTuitionCost ?? Number.MAX_SAFE_INTEGER
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
