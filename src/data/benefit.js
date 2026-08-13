/*
 * Landing/school-page benefit estimates (2026-08-11 meeting: the education
 * benefit block shows the known benefit with an estimated out-of-pocket and a
 * CTA to fully covered programs; unknown-benefit gets a fallback).
 *
 * ALL FIGURES ARE MOCK ESTIMATES for prototype review. The June decision to
 * keep calculator math off the program COST CARD still stands; this module
 * powers the new landing benefit block only, and every surface labels its
 * output as an estimate. Verify real benefit math before anything
 * client-facing ships.
 */

import { reimbursementForDegree } from './corporatePartners.js'

/** Annual benefit dollars for this program's degree level. */
export function annualBenefit(partner, program) {
  return reimbursementForDegree(partner, program?.degreeLevel)
}

/**
 * Estimated first-year out-of-pocket: annual estimated cost minus the annual
 * benefit, floored at zero. Certificates use total cost (single-year).
 */
export function estimatedOutOfPocket(program, partner) {
  const annualCost = program.annualEstimatedCost ?? program.totalTuitionCost ?? null
  if (annualCost == null) return null
  return Math.max(0, annualCost - annualBenefit(partner, program))
}

/** Estimate: does the benefit fully cover the program's annual cost? */
export function isFullyCoveredEstimate(program, partner) {
  const oop = estimatedOutOfPocket(program, partner)
  return oop != null && oop === 0
}

/** Programs estimated fully covered under this employer's benefit. */
export function fullyCoveredPrograms(programs, partner) {
  if (!partner?.benefitKnown) return []
  return programs.filter((p) => isFullyCoveredEstimate(p, partner))
}

/*
 * Savings helpers (2026-08-13). When nothing is fully covered, "0 fully
 * covered" is a discouraging non-answer — so these power the positive
 * alternative: what the AllCampus partner discount is actually worth, and the
 * cheapest real out-of-pocket. Discount and reimbursement are separate levers
 * (Brigid's journey map), and for no-reimbursement employers the discount is
 * the ONLY lever, so it deserves the headline.
 */

/** Undiscounted program total, from the standard per-credit rate. */
export function standardTotalCost(program) {
  if (program?.standardTotalTuitionCost != null) return program.standardTotalTuitionCost
  if (program?.standardTuitionPerCredit != null && program?.requiredCredits != null)
    return program.standardTuitionPerCredit * program.requiredCredits
  return null
}

/** Dollars the partner discount takes off this program's full price. */
export function discountSavings(program) {
  const std = standardTotalCost(program)
  const now = program?.totalTuitionCost
  if (std == null || now == null) return null
  return Math.max(0, std - now)
}

/** The program whose discount saves the most (for the savings headline). */
export function bestSavingsProgram(programs) {
  return programs.reduce((best, p) => {
    const s = discountSavings(p)
    if (s == null) return best
    return !best || s > (discountSavings(best) ?? 0) ? p : best
  }, null)
}

/** Largest discount percentage across the catalog. */
export function bestDiscountPercent(programs) {
  const pcts = programs
    .map((p) => p.discount?.percentUsed)
    .filter((v) => typeof v === 'number')
  return pcts.length ? Math.max(...pcts) : null
}

/** Cheapest estimated first-year out-of-pocket, with the benefit applied. */
export function lowestOutOfPocket(programs, partner) {
  const vals = programs.map((p) => estimatedOutOfPocket(p, partner)).filter((v) => v != null)
  return vals.length ? Math.min(...vals) : null
}
