/*
 * Brigid O'Connor's landing-page copy of record.
 *
 * Source: her Google Doc "Allcampus 'how' for landing pages", shared
 * 2026-08-20 and transcribed in AllCampus/Brigid-Landing-Copy-2026-08-20.md.
 * CLIENT LANGUAGE OF RECORD. Quote verbatim, em dashes and curly apostrophes
 * included. Paraphrasing these is the bug, not the fix.
 *
 * WHY THIS FILE EXISTS (2026-08-28). These lived as private constants inside
 * EcosystemStrip.jsx, which James's 2026-08-27 merge left mounted on zero
 * pages. Her box model rendered nowhere and her verbatim In-Network Schools
 * string was stranded in dead code. JourneySteps reads from here now, and
 * EcosystemStrip imports from here too, so the live surface and the parked
 * component cannot drift apart.
 */

import { money } from './model.js'

/*
 * Her WHY ALLCAMPUS headline counts. Her doc's own parenthetical says
 * "(prototype uses computed mock counts)", so swapping these for the catalog's
 * 24/135 is a one-line change if internal consistency is ever preferred over
 * her literals. 2026-08-28 direction: use her figures.
 */
export const WHY_COUNTS = { schools: '50+', programs: '1,200+' }

// Brigid's stable boxes (verbatim).
export const ALLCAMPUS_BASE =
  'AllCampus already secured your discount — it’s just waiting to be activated. Connect with a school through AllCampus to make that happen.'
export const ALLCAMPUS_SEQUENCING =
  ' Your employer’s reimbursement process requires a school and a program already be selected — so this is where you start.'
export const SCHOOLS_BOX =
  'Once you’ve connected through AllCampus, the school handles admissions, enrollment, billing, and your discounted tuition.'

export function employerBox(partner) {
  const name = partner?.name || 'Your employer'
  const amount = partner?.employerReimbursement ? money(partner.employerReimbursement) : null
  switch (partner?.partnerType) {
    case 'direct-tr':
      return `${name} offers a Tuition Reimbursement Benefit${amount ? ` (${amount})` : ''} and access to AllCampus’s discount network. They manage your tuition reimbursement directly. The first step is to select a school and a program.`
    case 'direct-mixed':
      return `${name} offers a Tuition Reimbursement Benefit${amount ? ` (${amount})` : ''}, managed directly by ${name} — eligibility depends on your role, so check with HR to confirm yours. Access to AllCampus’s discount network is guaranteed for everyone, regardless of reimbursement eligibility.`
    case 'direct-no-tr':
      return `${name} partners with AllCampus to give you access to our discount network. This is to reduce the cost of tuition for you.`
    case 'benefit-admin':
      return `${name} offers a Tuition Reimbursement Benefit, administered by ${partner.benefitAdmin?.name || 'your benefit partner'}. You also get access to AllCampus’s discount network — lowering the price before reimbursement is even applied.`
    case 'perks':
      return `${name} partners with AllCampus to give you access to our discount network.`
    default:
      return 'Your employer may connect you to the AllCampus discount network and, in many cases, a tuition benefit. Tell us who you work for and we’ll check.'
  }
}
