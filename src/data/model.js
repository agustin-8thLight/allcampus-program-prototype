/*
 * Program model helpers. Cost clarity follows Brigid's spec: a simple
 * "estimated cost per term" (degrees) or "total program cost" (certs), with a
 * discount shown and the original struck through, plain-language benefit
 * handling, and no calculator / no tuition-reimbursement math (that routes to
 * an advisor instead). Values are MOCK / FPO.
 */

import programsRaw from './programs.json'
import { getSchool, isDirectHandoff } from './schools.js'
import { WHO_FOR } from './programContent.js'

/* Program images (FPO), bundled via Vite; matched by basename = program id. */
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

export function money(n) {
  if (n == null) return null
  return n.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 })
}

/* ------------------------------------------------------------------ */
/* Badge: discount type + deferred. (No "fully covered" / TR badge.)   */
/* ------------------------------------------------------------------ */

// Deferred is shown as its own card tag (with tooltip), not the discount badge.
function resolveBadgeType(p) {
  const t = p.discount?.type
  if (t === 'flatCap') return 'discountCap'
  if (t === 'percent') return 'discountPercent'
  if (t === 'lowTuition') return 'lowTuition'
  return 'none'
}

export function badgeLabel(p) {
  switch (p.badgeType) {
    case 'discountCap':
      return p.discount?.dollarAmount != null
        ? `Capped at ${money(p.discount.dollarAmount)}`
        : 'Tuition capped'
    case 'discountPercent':
      return p.discount?.percentUsed != null ? `${p.discount.percentUsed}% off` : 'Discounted tuition'
    case 'lowTuition':
      return 'Low tuition'
    default:
      return null
  }
}

export function badgeTone(p) {
  switch (p.badgeType) {
    case 'discountCap':
    case 'discountPercent':
    case 'lowTuition':
      return 'brand'
    default:
      return null
  }
}

export const isCertificate = (p) => p.degreeLevel === 'Certificate' || p.programType === 'Certificate'

/* ------------------------------------------------------------------ */
/* Enriched programs                                                   */
/* ------------------------------------------------------------------ */

export const PROGRAMS = programsRaw.map((p) => ({
  ...p,
  ...(WHO_FOR[p.id] || {}),
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
/* Dates + duration display                                            */
/* ------------------------------------------------------------------ */

export function startDateDisplay(p) {
  if (p.startDate) {
    const d = new Date(p.startDate + 'T00:00:00')
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  }
  if (p.rollingEnrollment) return 'Rolling enrollment'
  return null
}

/** Duration, softened for bachelor's where length depends on transfer credits. */
export function durationDisplay(p) {
  if (p.degreeLevel === "Bachelor's") return { value: p.duration, note: 'varies with transfer credits' }
  return { value: p.duration, note: null }
}

/** Coarse program type for the highlights row. */
export function programTypeLabel(p) {
  return isCertificate(p) ? 'Certificate' : 'Degree'
}

/* ------------------------------------------------------------------ */
/* Cost card (Brigid's spec): per-term primary, simple language.       */
/* ------------------------------------------------------------------ */

export function resolveCost(p) {
  const credits = p.requiredCredits
  const perCredit = p.tuitionPerCredit
  const stdPerCredit = p.standardTuitionPerCredit
  const termCredits = p.creditsPerSession || 6
  const cert = isCertificate(p)
  const hasDiscount = stdPerCredit != null && perCredit != null && perCredit < stdPerCredit
  const capped = p.discount?.type === 'flatCap'
  const cap = p.discount?.dollarAmount ?? null
  const pct =
    p.discount?.percentUsed ?? (hasDiscount ? Math.round((1 - perCredit / stdPerCredit) * 100) : null)

  const termCost = perCredit != null ? perCredit * termCredits : null
  const stdTermCost = stdPerCredit != null ? stdPerCredit * termCredits : null
  const programCost = perCredit != null && credits != null ? perCredit * credits : p.totalTuitionCost ?? null
  const stdProgramCost = stdPerCredit != null && credits != null ? stdPerCredit * credits : null

  // Pills across the top.
  const pills = []
  if (capped && cap != null) pills.push({ big: money(cap), small: 'Tuition cap' })
  else if (pct) pills.push({ big: `${pct}% off` })
  if (perCredit != null) pills.push({ big: money(perCredit), small: 'Per credit' })
  if (credits != null) pills.push({ big: `${credits}`, small: 'Credits' })

  // Primary number.
  let primaryLabel, primaryValue, struck
  if (capped) {
    if (cert) {
      primaryLabel = 'Total program cost'
      primaryValue = money(cap)
      struck = null
    } else {
      primaryLabel = 'Estimated cost per term'
      primaryValue = money(termCost)
      struck = null
    }
  } else if (cert) {
    primaryLabel = 'Total program cost'
    primaryValue = money(programCost)
    struck = hasDiscount ? money(stdProgramCost) : null
  } else {
    primaryLabel = 'Estimated cost per term'
    primaryValue = money(termCost)
    struck = hasDiscount ? money(stdTermCost) : null
  }

  // State + benefit language.
  let state, capLine, benefitsLine
  if (capped) {
    state = 'capped'
    capLine = cert
      ? `Your tuition is capped at ${money(cap)} for the full certificate.`
      : `Never pay more than ${money(cap)} per year.`
    benefitsLine =
      'You pay the discounted rate shown above. Costs may be lower with transfer credits or employer benefits.'
  } else if (hasDiscount) {
    state = 'discount'
    benefitsLine =
      'Most students pay the discounted rate shown above. Costs may be lower with transfer credits or employer benefits.'
  } else {
    state = 'none'
    benefitsLine =
      'This is the standard tuition rate for this program. Costs may be lower with transfer credits or employer benefits.'
  }

  return {
    state,
    cert,
    pills,
    primaryLabel,
    primaryValue,
    struck,
    perCreditLine: perCredit != null ? `${money(perCredit)} per credit` : null,
    standardRateLine: hasDiscount && stdPerCredit != null ? `${money(stdPerCredit)} standard rate` : null,
    capLine: capped ? capLine : null,
    benefitsLine,
    perTerm: !cert,
    deferred: !!p.deferredPaymentAvailable,
  }
}

/* ------------------------------------------------------------------ */
/* List sorting + quick-filter chips                                   */
/* ------------------------------------------------------------------ */

/** Lower is more affordable. Ranked by post-discount total tuition. */
export function affordabilityScore(p) {
  if (p.tuitionPerCredit != null && p.requiredCredits != null) return p.tuitionPerCredit * p.requiredCredits
  return p.totalTuitionCost ?? Number.MAX_SAFE_INTEGER
}

export function durationYears(p) {
  const m = /([\d.]+)/.exec(p.duration || '')
  return m ? parseFloat(m[1]) : Number.MAX_SAFE_INTEGER
}

export const QUICK_FILTERS = [
  { id: 'mostAffordable', label: 'Most affordable' },
  { id: 'lowestPerCredit', label: 'Lowest cost per credit' },
  { id: 'deferred', label: 'Deferred tuition' },
  { id: 'fastest', label: 'Fastest' },
]

export function applyQuickFilter(programs, activeId) {
  let out = [...programs]
  switch (activeId) {
    case 'lowestPerCredit':
      out.sort((a, b) => (a.tuitionPerCredit ?? Infinity) - (b.tuitionPerCredit ?? Infinity))
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
