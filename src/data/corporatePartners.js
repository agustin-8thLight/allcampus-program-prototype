/*
 * Corporate Partner model, mirroring the real tuition calculator
 * (tuition_breakdown_calculator-Original). The calculator uses the user's /
 * learner's Corporate Partner, and falls back to the App's Global Default
 * Corporate Partner when the user doesn't have one.
 *
 * Reimbursement is degree-level aware (Bachelor's/Associate's vs other), and
 * the user's employer reimbursement is what can make a discount "fully covered".
 *
 * PARTNER ARCHETYPES (Brigid's "Rough draft Journey Map for Tuition benefits
 * and AllCampus", shared 2026-08-13). The employer→AllCampus→school chain is
 * NOT fixed: it varies by how the employer relates to AllCampus, and when a
 * benefit administrator is involved there is a fifth party in the middle.
 *   'direct-tr'      Partners directly for the discount AND offers annual
 *                    tuition reimbursement. Qualification, approval and
 *                    filing happen with the employer.
 *   'direct-no-tr'   Partners directly for the discount only. No reimbursement.
 *   'direct-mixed'   Partners directly for the discount and administers its
 *                    own reimbursement program.
 *   'benefit-admin'  Employer → BENEFIT PARTNER → AllCampus → schools. The
 *                    administrator determines who qualifies, runs pre-approval,
 *                    processes filings and issues funds; policy lives in their
 *                    portal.
 *   'perks'          Partners for network discounts; reimbursement unknown.
 * Reimbursement pre-approval requires a school and program to be selected
 * FIRST — which is why search leads (see PREAPPROVAL_RULE below).
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
    partnerType: null,
    benefitAdmin: null,
    policyLocation: null,
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
    partnerType: 'direct-tr',
    benefitAdmin: null,
    policyLocation: 'your Sheetz HR or benefits portal',
    brandColor: '#c8102e', // approximate, for the co-brand mark only
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
    partnerType: 'direct-no-tr',
    benefitAdmin: null,
    policyLocation: 'your Texas Roadhouse benefits team',
    brandColor: '#a6192e', // approximate, for the co-brand mark only
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
    // ARCHETYPE ASSUMPTION — open question for Brigid/Terrence: is BenefitHub
    // the administrator of Boeing's reimbursement (archetype 4, modeled here),
    // or only the portal listing the AllCampus perk (archetype 5)?
    partnerType: 'benefit-admin',
    benefitAdmin: { name: 'BenefitHub', portalLabel: 'the BenefitHub portal' },
    policyLocation: 'the BenefitHub portal',
    brandColor: '#0033a1', // approximate, for the co-brand mark only
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
  // Mixed archetype (Brigid's #3): direct AllCampus partner that also runs its
  // own reimbursement program in-house.
  'giant-eagle': {
    id: 'giant-eagle',
    brandColor: '#00693c', // approximate, for the co-brand mark only
    name: 'Giant Eagle',
    partnerType: 'direct-mixed',
    benefitAdmin: null,
    policyLocation: 'your Giant Eagle HR portal',
    benefitKnown: true,
    employerReimbursement: 3500,
    bachelorsReimbursement: 3500,
    associatesReimbursement: 3500,
    minBenefit: 0,
    policy:
      'Giant Eagle partners with AllCampus for discounted tuition and administers its own reimbursement (estimate: $3,500/yr). Qualification, approval and filing happen with Giant Eagle.',
    emphasizedAreaIds: ['business', 'healthcare'],
    hiddenAreaIds: [],
  },
  lowes: {
    id: 'lowes',
    partnerType: 'perks',
    benefitAdmin: null,
    policyLocation: "your Lowe's benefits portal",
    brandColor: '#004990', // approximate, for the co-brand mark only
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
  { id: 'sheetz', label: 'Sheetz', tagline: 'Direct partner with tuition reimbursement (~$5,250/yr est.)' },
  { id: 'texas-roadhouse', label: 'Texas Roadhouse', tagline: 'Direct partner, no reimbursement' },
  { id: 'boeing', label: 'Boeing', tagline: 'Benefit administrator (BenefitHub), ~$10,000/yr est.' },
  { id: 'giant-eagle', label: 'Giant Eagle', tagline: 'Direct partner, mixed: discount + in-house reimbursement' },
  { id: 'lowes', label: "Lowe's", tagline: 'Benefit perks, reimbursement unknown' },
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

/*
 * Sequencing rule from the journey map: reimbursement pre-approval cannot
 * start until a school and program are chosen, so program selection is step
 * one. Surfaced wherever we explain the benefit.
 */
export const PREAPPROVAL_RULE =
  'Pre-approval needs a school and program picked first — so choosing a program is step one.'

/** Archetype labels (Brigid's taxonomy), for review chrome and story cards. */
export const PARTNER_TYPE_LABELS = {
  'direct-tr': 'Direct partner with tuition reimbursement',
  'direct-no-tr': 'Direct partner, no reimbursement',
  'direct-mixed': 'Direct partner, mixed',
  'benefit-admin': 'Benefit administrator',
  perks: 'Benefit perks',
}

/** True when a benefit administrator sits between employer and AllCampus. */
export const hasBenefitAdmin = (partner) =>
  partner?.partnerType === 'benefit-admin' && !!partner?.benefitAdmin

/** Who a learner should ask about policy, qualification and filing. */
export function policyOwner(partner) {
  if (!partner) return null
  if (hasBenefitAdmin(partner)) return partner.benefitAdmin.name
  if (partner.partnerType === 'direct-no-tr' || partner.partnerType === 'perks')
    return partner.name
  return partner.name
}
