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
    employerReimbursement: 0,
    bachelorsReimbursement: 0,
    associatesReimbursement: 0,
    minBenefit: 0,
    reimbursementProvider: null,
    policy: null,
  },
  'acme-edu': {
    id: 'acme-edu',
    name: 'Employer education benefit',
    employerReimbursement: 25000,
    bachelorsReimbursement: 25000,
    associatesReimbursement: 12000,
    minBenefit: 0,
    reimbursementProvider: 'Tuition reimbursement provider',
    policy:
      'Covered through your employer’s education benefit. Confirm eligibility and the current amount with your benefits administrator.',
  },
}

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
