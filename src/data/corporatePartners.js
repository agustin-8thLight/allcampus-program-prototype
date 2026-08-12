/*
 * Corporate Partner model, mirroring the real tuition calculator
 * (tuition_breakdown_calculator-Original). The calculator uses the user's /
 * learner's Corporate Partner, and falls back to the App's Global Default
 * Corporate Partner when the user doesn't have one.
 *
 * Reimbursement is degree-level aware (Bachelor's/Associate's vs other), and
 * the user's employer reimbursement is what can make a discount "fully covered".
 *
 * REAL partner names (2026-08-12 decision: internal-only prototype, do not
 * anonymize; access is gated + noindexed instead). Benefit FIGURES are
 * estimates assembled from the research record — Boeing's $10,000/yr from the
 * journey research; the IRS §127 $5,250 norm as the default cap — and every
 * surface labels its output as an estimate. Verify against real Corporate
 * Partner records before anything client-facing ships.
 */

export const CORPORATE_PARTNERS = {
  'global-default': {
    id: 'global-default',
    name: 'Standard, no employer benefit',
    benefitKnown: false,
    employerReimbursement: 0,
    bachelorsReimbursement: 0,
    associatesReimbursement: 0,
    minBenefit: 0,
    reimbursementProvider: null,
    policy: null,
    emphasizedAreaIds: [],
    hiddenAreaIds: [],
  },
  sheetz: {
    id: 'sheetz',
    name: 'Sheetz',
    benefitKnown: true,
    employerReimbursement: 5250,
    bachelorsReimbursement: 5250,
    associatesReimbursement: 5250,
    minBenefit: 0,
    reimbursementProvider: 'Tuition reimbursement provider',
    policy:
      'Covered through the Sheetz education benefit (estimate: $5,250/yr, the federal tax-free norm). Confirm eligibility and the current amount with your benefits administrator.',
    emphasizedAreaIds: ['business', 'it'],
    hiddenAreaIds: [],
  },
  'texas-roadhouse': {
    id: 'texas-roadhouse',
    name: 'Texas Roadhouse',
    benefitKnown: true,
    employerReimbursement: 0,
    bachelorsReimbursement: 0,
    associatesReimbursement: 0,
    minBenefit: 0,
    reimbursementProvider: null,
    policy:
      'Texas Roadhouse does not currently offer tuition reimbursement. AllCampus partner discounts still apply to every program.',
    emphasizedAreaIds: ['healthcare', 'business'],
    hiddenAreaIds: [],
  },
  boeing: {
    id: 'boeing',
    name: 'Boeing',
    benefitKnown: true,
    employerReimbursement: 10000,
    bachelorsReimbursement: 10000,
    associatesReimbursement: 10000,
    minBenefit: 0,
    reimbursementProvider: 'BenefitHub',
    policy:
      'Covered through Boeing’s Learning Together Program (estimate: $10,000/yr from the research record). Confirm eligibility and the current amount with your benefits administrator.',
    emphasizedAreaIds: ['engineering', 'it', 'business'],
    hiddenAreaIds: [],
  },
  lowes: {
    id: 'lowes',
    name: "Lowe's",
    benefitKnown: true,
    employerReimbursement: 0,
    bachelorsReimbursement: 0,
    associatesReimbursement: 0,
    minBenefit: 0,
    reimbursementProvider: 'Benefits portal',
    policy:
      "Lowe's does not currently offer tuition reimbursement for this catalog. AllCampus partner discounts still apply, and low-cost self-paced options are highlighted.",
    emphasizedAreaIds: ['business', 'it'],
    hiddenAreaIds: [],
  },
}

/*
 * Review-harness employer states (the demo switcher in PrototypeFrame).
 * Not product UI: in production the employer comes from the learner record
 * or the partner-branded URL. Order mirrors the four use-case stories.
 */
export const EMPLOYER_STATES = [
  { id: 'sheetz', label: 'Sheetz', tagline: 'Direct partner, known benefit (~$5,250/yr est.)' },
  { id: 'texas-roadhouse', label: 'Texas Roadhouse', tagline: 'Direct partner, no reimbursement' },
  { id: 'boeing', label: 'Boeing', tagline: 'Channel partner via BenefitHub, ~$10,000/yr est.' },
  { id: 'lowes', label: "Lowe's", tagline: 'Channel partner, no reimbursement' },
  { id: 'global-default', label: 'Unknown', tagline: 'No employer on file: fallback benefit block' },
]

export const GLOBAL_DEFAULT_CORPORATE_PARTNER_ID = 'global-default'

/*
 * Mock signed-in learner. In production this is the current User / Learner
 * record; their Corporate Partner takes priority over the program's.
 */
export const CURRENT_USER = {
  name: 'You',
  corporatePartnerId: null, // no employer benefit on file by default
}

export function getCorporatePartner(id) {
  return CORPORATE_PARTNERS[id] || null
}

/** Reimbursement amount for a given degree level. */
export function reimbursementForDegree(partner, degreeLevel) {
  if (!partner) return 0
  if (degreeLevel === 'Associate') return partner.associatesReimbursement ?? partner.employerReimbursement ?? 0
  if (degreeLevel === "Bachelor's" || degreeLevel === "Master's" || degreeLevel === 'Doctorate')
    return partner.bachelorsReimbursement ?? partner.employerReimbursement ?? 0
  return partner.employerReimbursement ?? 0
}
