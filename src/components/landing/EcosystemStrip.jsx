import { useState } from 'react'
import { money } from '../../data/model.js'
import { hasBenefitAdmin } from '../../data/corporatePartners.js'

/*
 * The how-it-works boxes — CONTENT NOW VERBATIM from Brigid's landing-page
 * content doc (2026-08-20, "Allcampus 'how' for landing pages"). Her model:
 *
 *   3 boxes (Employer / AllCampus / In-Network Schools) for every direct type
 *   and Benefit Partner No TR; 4 boxes (Employer / Benefit Partner /
 *   AllCampus / In-Network Schools) when an administrator runs the benefit.
 *   No "You" box. The In-Network Schools box is reused verbatim everywhere;
 *   the AllCampus box is stable with one sequencing clause present for TR
 *   types.
 *
 * Her strings are quoted exactly, em dashes included: this is client
 * language of record, not ours to restyle. [$Amount] slots fill from the
 * partner record (MOCK figures).
 *
 * Two variants: 'landing' (the logged-in how-it-works) and 'school' (adds
 * the pre-bounce discount-lives-here banner).
 */

const Art = {
  employer: (props) => (
    <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" {...props}>
      <path d="M12 54V20l14-8 14 8v34" />
      <path d="M40 54V30h12v24" />
      <path d="M8 54h48M20 28h6M20 38h6M32 28h.01M32 38h.01" />
    </svg>
  ),
  benefitAdmin: (props) => (
    <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" {...props}>
      <rect x="10" y="16" width="44" height="32" rx="4" />
      <path d="M10 26h44M22 36h12M22 42h20" />
      <path d="M24 16v-4h16v4" />
    </svg>
  ),
  allcampus: (props) => (
    <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" {...props}>
      <path d="M32 12l22 10-22 10-22-10 22-10z" />
      <path d="M18 27v11c0 5 6.3 8.5 14 8.5S46 43 46 38V27" />
      <path d="M54 22v13" />
    </svg>
  ),
  school: (props) => (
    <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" {...props}>
      <path d="M10 26h44M14 26v26M50 26v26M8 52h48" />
      <path d="M32 10l20 12H12l20-12z" />
      <path d="M24 52V36h16v16" />
    </svg>
  ),
}

// Brigid's stable boxes (verbatim).
const ALLCAMPUS_BASE =
  'AllCampus already secured your discount — it’s just waiting to be activated. Connect with a school through AllCampus to make that happen.'
const ALLCAMPUS_SEQUENCING =
  ' Your employer’s reimbursement process requires a school and a program already be selected — so this is where you start.'
const SCHOOLS_BOX =
  'Once you’ve connected through AllCampus, the school handles admissions, enrollment, billing, and your discounted tuition.'

function employerBox(partner) {
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

const NODES = (schoolName, partner) => {
  const admin = hasBenefitAdmin(partner)
  const hasTR =
    partner?.partnerType === 'direct-tr' ||
    partner?.partnerType === 'direct-mixed' ||
    partner?.partnerType === 'benefit-admin'
  const nodes = [
    {
      key: 'employer',
      art: 'employer',
      label: partner?.name || 'Your Employer',
      role: hasTR ? 'Funds your tuition benefit' : 'Opens the discount network to you',
      does: employerBox(partner),
    },
  ]
  if (admin) {
    nodes.push({
      key: 'admin',
      art: 'benefitAdmin',
      label: partner.benefitAdmin?.name || 'Benefit Partner',
      role: 'Approves and pays the reimbursement',
      does: `${partner.benefitAdmin?.name || 'Your benefit partner'} manages your reimbursement — eligibility, filings, and funds. Their pre-approval process requires a school and a program already be selected.`,
    })
  }
  nodes.push(
    {
      key: 'allcampus',
      art: 'allcampus',
      label: 'AllCampus',
      role: 'Holds your discount, and activates it',
      does: ALLCAMPUS_BASE + (hasTR ? ALLCAMPUS_SEQUENCING : ''),
      highlight: true,
    },
    {
      key: 'school',
      art: 'school',
      label: schoolName || 'In-Network Schools',
      role: 'Teaches the program, bills the tuition',
      does: SCHOOLS_BOX,
    },
  )
  return nodes
}

export default function EcosystemStrip({ variant = 'landing', schoolName = null, partner = null }) {
  const nodes = NODES(schoolName, partner)
  // 2026-08-25 polish: the four verbatim paragraphs were the densest text on
  // both pages, and they repeat between them. Brigid's strings are copy of
  // record, so nothing is cut: at rest each node shows an illustration, a
  // name, and a short role line, and one control reveals the full wording.
  const [detail, setDetail] = useState(false)

  return (
    <div className="font-display">
      {variant === 'school' && (
        <div className="mb-5 rounded-xl border border-mk-teal-600/30 bg-mk-band px-5 py-4">
          <p className="text-[15px] font-bold text-mk-slate">
            Your discount lives here, not on {schoolName || 'the school'}&rsquo;s site.
          </p>
          {/* 2026-08-25 copy pass: the follow-on sentence restated journey
              step 4 almost word for word. The claim is the whole point. */}
          <p className="mt-1 text-[14px] leading-relaxed text-mk-body">
            Going directly to {schoolName || 'the school'} means paying their standard tuition.
          </p>
        </div>
      )}

      <ol
        className={`grid grid-cols-1 items-start gap-3 sm:grid-cols-2 ${
          nodes.length === 4 ? 'lg:grid-cols-4' : 'lg:grid-cols-3'
        }`}
      >
        {nodes.map((n, i) => (
          <li key={n.key} className="relative">
            {/* 2026-08-25: the step labels and the boxed highlight both went.
                A single tinted card floating among borderless ones read as a
                glitch, and the arrows already carry the sequence. AllCampus
                keeps emphasis through its icon and its line, not a box. */}
            <div className="flex h-full flex-col items-center px-4 py-5 text-center">
              <div
                className={`flex h-16 w-16 items-center justify-center rounded-full border ${
                  n.highlight
                    ? 'border-mk-blue-200 bg-mk-blue-50 text-mk-teal-700'
                    : 'border-mk-line bg-white text-mk-teal-600'
                }`}
              >
                {Art[n.art] ? Art[n.art]({ className: 'h-8 w-8' }) : null}
              </div>
              <p className="mt-3.5 text-[16px] font-extrabold leading-snug text-mk-slate">
                {n.label}
              </p>
              <p
                className={`mt-1 text-[13px] font-semibold leading-snug ${
                  n.highlight ? 'text-mk-teal-700' : 'text-mk-body'
                }`}
              >
                {n.role}
              </p>
              {detail && (
                <p className="mt-3 border-t border-mk-line pt-3 text-left text-[13px] leading-relaxed text-mk-body">
                  {n.does}
                </p>
              )}
            </div>
            {i < nodes.length - 1 && (
              <span
                aria-hidden
                className="absolute -right-[7px] top-[52px] z-10 hidden text-[17px] text-mk-teal-600/45 lg:block"
              >
                &rarr;
              </span>
            )}
          </li>
        ))}
      </ol>

      {/* Centered under the rail it opens (2026-08-26). */}
      <div className="mt-3 text-center">
      <button
        type="button"
        onClick={() => setDetail((v) => !v)}
        aria-expanded={detail}
        className="inline-flex items-center gap-1.5 text-[13px] font-bold text-mk-teal-700 underline-offset-2 hover:underline"
      >
        {detail ? 'Hide the detail' : 'Read what each one does'}
        <span aria-hidden className={`text-[15px] leading-none transition ${detail ? 'rotate-180' : ''}`}>
          &#8964;
        </span>
      </button>
      </div>
    </div>
  )
}
