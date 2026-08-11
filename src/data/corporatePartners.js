/*
 * Corporate Partner model, mirroring the real tuition calculator
 * (tuition_breakdown_calculator-Original). The calculator uses the user's /
 * learner's Corporate Partner, and falls back to the App's Global Default
 * Corporate Partner when the user doesn't have one.
 *
 * Reimbursement is degree-level aware (Bachelor's/Associate's vs other), and
 * the user's employer reimbursement is what can make a discount "fully covered".
 *
 * MOCK values, replace with real Corporate Partner records before any external
 * use. The Global Default is intentionally $0 here so the prototype's variants
 * stay legible; a real default may differ.
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
    // Taxonomy emphasis (see taxonomy.js): none for the unknown state.
    emphasizedAreaIds: [],
    hiddenAreaIds: [],
  },
  'acme-edu': {
    id: 'acme-edu',
    name: 'Acme Manufacturing',
    benefitKnown: true,
    employerReimbursement: 5250,
    bachelorsReimbursement: 5250,
    associatesReimbursement: 5250,
    minBenefit: 0,
    reimbursementProvider: 'Tuition reimbursement provider',
    policy:
      'Covered through your employer’s education benefit. Confirm eligibility and the current amount with your benefits administrator.',
    emphasizedAreaIds: [],
    hiddenAreaIds: [],
  },
  // Aviation-style employer (2026-08-11 meeting example: "Duncan Aviation
  // shows engineering, not nursing"). MOCK record for the demo switcher.
  'duncan-avn': {
    id: 'duncan-avn',
    name: 'Duncan Aviation',
    benefitKnown: true,
    employerReimbursement: 12000,
    bachelorsReimbursement: 12000,
    associatesReimbursement: 8000,
    minBenefit: 0,
    reimbursementProvider: 'Tuition reimbursement provider',
    policy:
      'Covered through your employer’s education benefit. Confirm eligibility and the current amount with your benefits administrator.',
    emphasizedAreaIds: ['engineering', 'it', 'business'],
    hiddenAreaIds: ['healthcare'],
  },
}

/*
 * Review-harness employer states (the demo switcher in PrototypeFrame).
 * Not product UI: in production the employer comes from the learner record
 * or the partner-branded URL.
 */
export const EMPLOYER_STATES = [
  { id: 'duncan-avn', label: 'Duncan Aviation', tagline: 'Known benefit, engineering-skewed skills' },
  { id: 'acme-edu', label: 'Acme Mfg', tagline: 'Known benefit, default skill mix' },
  { id: 'global-default', label: 'Unknown benefit', tagline: 'No employer on file: fallback benefit block' },
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
