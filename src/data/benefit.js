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
