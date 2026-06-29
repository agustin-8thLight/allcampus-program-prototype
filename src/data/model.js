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
        ? `${money(p.discount.dollarAmount)}/yr cap`
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
/* Cost card. James's 06.13 feedback: lead with the most motivating,    */
/* controllable, comparable number.                                     */
/*   - degrees + credit-bearing certs -> PER-CREDIT hero, with a small   */
/*     "per class" estimate lower down (NOT "per term": term means       */
/*     different things across the catalog).                            */
/*   - flat-upfront certs -> TOTAL program price hero + a one-time       */
/*     payment indicator.                                                */
/*   - capped programs keep the cap hero with a value-forward caption.   */
/* Per-class basis (creditsPerClass) varies by program and must come     */
/* from each school's real course structure; when absent we omit the     */
/* per-class line rather than invent one. Values are MOCK / FPO.         */
/* ------------------------------------------------------------------ */

const CREDIT_TOOLTIP =
  'Total credits needed to complete the program. Your actual requirement may be lower depending on transfer credits accepted.'

export function resolveCost(p) {
  const credits = p.requiredCredits
  const perCredit = p.tuitionPerCredit
  const stdPerCredit = p.standardTuitionPerCredit
  const cert = isCertificate(p)
  const capped = p.discount?.type === 'flatCap'
  const cap = p.discount?.dollarAmount ?? null
  // Flat-upfront certs bill a single program fee (no per-credit rate).
  const flatCert = cert && p.certBilling === 'upfront'

  // Discount: per-credit programs compare per-credit rates; flat certs
  // compare total fees.
  const hasDiscount = flatCert
    ? p.standardTotalTuitionCost != null && p.totalTuitionCost < p.standardTotalTuitionCost
    : stdPerCredit != null && perCredit != null && perCredit < stdPerCredit
  const pct =
    p.discount?.percentUsed ??
    (!flatCert && hasDiscount ? Math.round((1 - perCredit / stdPerCredit) * 100) : null)

  // Per-class estimate (one ~3-credit course), when we know credits-per-class.
  // Shown on capped programs too (06-17 review): students read it as "3 classes
  // ≈ the cap", so the per-class figure stays up top even when capped.
  const perClassCost =
    perCredit != null && p.creditsPerClass != null ? perCredit * p.creditsPerClass : null

  // Pills across the top, each a single-line label for consistent chip height.
  // Per-credit is the hero for non-flat programs, so it's dropped here. Order:
  // per-class estimate, savings (cap/discount), credit count, deferred.
  const pills = []
  // Estimated per-class cost, framed as an estimate (tone) above the hero.
  if (perClassCost != null)
    pills.push({
      label: `≈ ${money(perClassCost)}/class`,
      tooltip: 'Estimated for a typical 3-credit course; credits per class vary by program.',
      tone: 'estimate',
    })
  if (capped && cap != null)
    pills.push({
      label: `${money(cap)}/yr cap`,
      tooltip:
        "You'll pay tuition until you reach the annual cap. After that, additional courses (up to 12 per year) are covered at no additional tuition cost.",
    })
  else if (pct) pills.push({ label: `${pct}% off` })
  if (credits != null)
    pills.push({
      label: `${credits} credits`,
      tooltip: p.degreeLevel === 'Associate' || p.degreeLevel === "Bachelor's" ? CREDIT_TOOLTIP : null,
    })
  // Deferred tuition: present but not prominent — a pill + tooltip. Only renders
  // where deferment is available (and the student has tuition reimbursement);
  // the partner-level "known TR" rule is documented for Terrence, not modeled here.
  if (p.deferredPaymentAvailable)
    pills.push({
      label: 'Deferred tuition',
      tooltip:
        'Eligible students can delay paying tuition until after employer tuition benefits are processed, reducing upfront costs.',
      tone: 'info',
    })

  // Hero number. Flat certs lead with the total fee; everything else
  // (degrees, credit-bearing certs, AND capped credit programs) leads with the
  // per-credit rate so the comparable unit stays the hero. For capped programs
  // the cap is carried by the pill + caption, not the hero, so "$5,250" isn't
  // repeated three times and the per-credit lead is preserved.
  let primaryLabel, primaryValue, struck
  if (flatCert) {
    primaryLabel = 'Total program cost'
    primaryValue = money(p.totalTuitionCost)
    struck = hasDiscount ? money(p.standardTotalTuitionCost) : null
  } else {
    primaryLabel = 'Per credit'
    primaryValue = money(perCredit)
    // Capped programs show the listed per-credit rate plainly; the savings
    // story is the cap (pill + caption), not a per-credit strikethrough.
    struck = !capped && hasDiscount ? money(stdPerCredit) : null
  }

  // Supporting copy.
  let capLine, benefitsLine
  if (capped) {
    // Capped caption (reworked 06-29 review). Dropped the "maximum most employers
    // can reimburse tax-free" framing — only ACU carries this and they don't use
    // tuition reimbursement. VERIFY the cap figure with a benefits source before
    // any student-facing use; the value is MOCK / FPO.
    capLine = `Never pay more than ${money(cap)} per year in tuition.`
    benefitsLine =
      "If you're eligible for employer education benefits, they may help cover some or all of this amount."
  } else if (hasDiscount) {
    // Certificates rarely accept transfer credits, so don't imply transfer savings.
    benefitsLine = cert
      ? 'Most students pay the discounted rate shown above. Your employer benefit may lower it further.'
      : 'Most students pay the discounted rate shown above. Total costs may be lower with transfer credits or employer benefits.'
  } else {
    benefitsLine = cert
      ? 'This is the standard rate for this program. Your employer benefit may lower it.'
      : 'This is the standard tuition rate for this program. Total costs may be lower with transfer credits or employer benefits.'
  }

  return {
    pills,
    primaryLabel,
    primaryValue,
    struck,
    // One-time payment indicator for flat-fee certs.
    paymentNote: flatCert ? 'One-time payment at enrollment' : null,
    capLine: capped ? capLine : null,
    benefitsLine,
  }
}

/* ------------------------------------------------------------------ */
/* List sorting + quick-filter chips                                   */
/* ------------------------------------------------------------------ */

/** Lower is more affordable. Ranked by post-discount total tuition. */
export function affordabilityScore(p) {
  // Capped programs: the capped total is what students actually pay, so use it
  // rather than per-credit × credits (which ignores the ceiling and overstates).
  if (p.discount?.type === 'flatCap')
    return p.totalTuitionCost ?? p.discount?.dollarAmount ?? Number.MAX_SAFE_INTEGER
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
