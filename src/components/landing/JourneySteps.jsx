import { Eyebrow, Heading } from './Section.jsx'
import { partnerState } from './BenefitsAndHow.jsx'
import { hasBenefitAdmin } from '../../data/corporatePartners.js'
import {
  ALLCAMPUS_BASE,
  ALLCAMPUS_SEQUENCING,
  SCHOOLS_BOX,
  employerBox,
} from '../../data/landingCopy.js'

/*
 * JourneySteps (2026-08-27) — James Guajardo's design notes, "Journey &
 * Confidence Redesign".
 *
 * WHAT THIS REPLACES. The landing page ran "One path, start to finish" and
 * "Who does what" back to back, which explained the same journey twice: once
 * as a process, once as a cast of characters. His note: that split "was
 * confusing more than it was clarifying," and it left the page without a
 * point of view on the question a first-time visitor actually has — who is
 * AllCampus, and can I trust them with my tuition benefit?
 *
 * So the two sections are one 5-step journey. The who-does-what information
 * is not lost, it is inside the sentences: "through AllCampus", "with your
 * employer". That is how the merge keeps the cast without a second diagram.
 *
 * Step 3 states plainly that requesting information through AllCampus is what
 * unlocks the discount, rather than implying it is one option among several.
 *
 * Copy is one sentence per step, per his note on scannability: someone
 * skimming should get all five in a few seconds.
 *
 * NUMERALS. Big ghosted numbers were removed from the old 4-card strip on
 * 2026-08-25 for being decorative noise. These are different: small, inline,
 * part of the step label, and load-bearing in a five-step sequence.
 *
 * COPY IS JAMES'S, VERBATIM (2026-08-27), em dashes and ampersands included.
 * BODIES ARE BRIGID'S (2026-08-28). James's merge deleted the section that
 * carried her box model, so her boxes rendered nowhere and her verbatim
 * In-Network Schools string sat in dead code. His titles and his 01-05
 * numbering stay; the bodies now carry her language from
 * src/data/landingCopy.js:
 *
 *   03  ALLCAMPUS_BASE (+ ALLCAMPUS_SEQUENCING for TR types)
 *   04  employerBox(partner) — her per-type employer copy
 *   05  SCHOOLS_BOX, the box her doc says is "reused verbatim everywhere"
 *
 * Steps 01 and 02 keep James's sentences: her model has no "You" box, so
 * there is nothing of hers to use there.
 *
 * HER 4-BOX RULE survives as a sixth step. Her doc: 3 boxes for all direct
 * types and Benefit Partner No TR, 4 when an administrator runs the benefit,
 * because "the administrator becomes its own box." For benefit-admin partners
 * the administrator gets its own step between 04 and 05. Numbering follows the
 * array, so it renumbers itself.
 * His mockup carries no driver pills and no per-step buttons: the driver is
 * inside the sentence ("with your employer", "through AllCampus"), which is a
 * lighter way to do it than the chips I had. Client language of record, not
 * ours to restyle.
 */

const ART = {
  account: (props) => (
    <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <circle cx="19" cy="17" r="7" />
      <path d="M7 40c0-7 5.4-11 12-11s12 4 12 11" />
      <path d="M36 15v11M30.5 20.5h11" />
    </svg>
  ),
  shop: (props) => (
    <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <circle cx="21" cy="21" r="11" />
      <path d="M29 29l11 11" />
      <path d="M15 18h11M15 24h7" />
    </svg>
  ),
  connect: (props) => (
    <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M24 8l16 7-16 7-16-7 16-7z" />
      <path d="M13 20v8c0 3.6 4.9 6 11 6s11-2.4 11-6v-8" />
      <path d="M40 16v10" />
    </svg>
  ),
  confirm: (props) => (
    <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <rect x="11" y="8" width="26" height="32" rx="3" />
      <path d="M19 8V5h10v3" />
      <path d="M18 25l5 5 9-10" />
    </svg>
  ),
  start: (props) => (
    <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M8 22h32M8 22l7-7M8 22l7 7" />
      <path d="M28 10h12v24H28" />
    </svg>
  ),
}

/*
 * `bare` drops the section wrapper and the header, for the school page, which
 * supplies its own school-scoped heading and the discount-lives-here banner
 * above the strip. Without it the header rendered twice.
 */
export default function JourneySteps({ partner, bare = false }) {
  const { reimburses, noTr } = partnerState(partner)
  const admin = hasBenefitAdmin(partner) ? partner.benefitAdmin?.name : null
  // The mock admin name is lowercase ("your benefit administrator"), which
  // reads as a typo when it opens a sentence. Real names are unaffected.
  const Admin = admin ? admin.charAt(0).toUpperCase() + admin.slice(1) : null
  const steps = [
    {
      icon: 'account',
      title: 'Create an AllCampus account',
      body: 'Create your free profile to search programs, save favorites, and get guided support.',
    },
    {
      icon: 'shop',
      title: 'Shop for schools & programs',
      body: 'Compare accredited schools and programs matched to your goals, funding, and schedule.',
    },
    {
      icon: 'connect',
      title: 'Connect to schools through AllCampus',
      // Her AllCampus box. The sequencing clause is appended only when there
      // is a reimbursement process to sequence against, which is her rule.
      body: ALLCAMPUS_BASE + (reimburses ? ALLCAMPUS_SEQUENCING : ''),
      highlight: true,
    },
    {
      icon: 'confirm',
      title: noTr
        ? 'Confirm your price'
        : reimburses
          ? 'Confirm your employer tuition benefit'
          : 'Check your employer tuition benefit',
      // Her employer box, per partner type.
      body: employerBox(partner),
    },
    // Her 4-box case: the administrator is its own box, so its own step.
    ...(admin
      ? [
          {
            icon: 'confirm',
            title: `Work with ${admin}`,
            body: `${Admin} manages your reimbursement, including eligibility, filings, and funds. Their pre-approval process requires a school and a program already be selected.`,
          },
        ]
      : []),
    {
      icon: 'start',
      title: 'Start your program & earn new skills',
      // Her In-Network Schools box, verbatim.
      body: SCHOOLS_BOX,
    },
  ]

  const strip = (
    <ol className="grid grid-cols-1 items-stretch gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {steps.map((s, i) => {
            const Art = ART[s.icon]
            const on = !!s.highlight
            return (
              <li key={s.title} className="h-full">
                <div
                  className={`flex h-full flex-col rounded-[var(--radius-card)] p-6 transition ${
                    on
                      ? 'bg-gradient-to-br from-mk-teal-600 to-mk-slate text-white shadow-[0_18px_40px_rgba(51,71,91,0.35)]'
                      : 'border border-mk-line bg-gradient-to-b from-white to-mk-band/50'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span
                      className={`flex h-11 w-11 items-center justify-center rounded-xl ${
                        on
                          ? 'bg-white/15 text-white'
                          : 'bg-gradient-to-br from-mk-blue-50 to-mk-band text-mk-teal-700'
                      }`}
                    >
                      <Art className="h-6 w-6" />
                    </span>
                    <span
                      className={`font-display text-[12px] font-black tracking-wider ${
                        on ? 'text-white/45' : 'text-mk-body/35'
                      }`}
                    >
                      {String(i + 1).padStart(2, '0')}
                    </span>
                  </div>

                  <p
                    className={`mt-4 font-display text-[16.5px] font-extrabold leading-snug ${
                      on ? '' : 'text-mk-slate'
                    }`}
                  >
                    {s.title}
                  </p>
                  <p
                    className={`mt-1.5 font-display text-[13px] leading-relaxed ${
                      on ? 'text-white/85' : 'text-mk-body'
                    }`}
                  >
                    {s.body}
                  </p>

                </div>
              </li>
            )
          })}
    </ol>
  )

  if (bare) return strip

  return (
    <section className="bg-white py-20">
      <div className="mx-auto max-w-6xl px-5">
        <Eyebrow>How AllCampus works</Eyebrow>
        <Heading className="mt-2 max-w-2xl">Your path, guided support, start to finish</Heading>
        <div className="mt-9">{strip}</div>
      </div>
    </section>
  )
}
