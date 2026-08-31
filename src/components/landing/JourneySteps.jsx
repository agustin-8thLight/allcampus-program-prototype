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
 *
 * CLIENT REVIEW 2026-08-28 (Brigid, James, Terrence, Agustin). Two changes,
 * and they renumber everything described above. This is a 4-to-6 step
 * journey now, not a fixed five, so the "01/02" references in these notes
 * mean the old positions, not the current ones.
 *
 * FIRST TWO STEPS MERGED. Brigid, on the account step: "I think we just nix
 * create an account. Again, so many people create accounts. That's not our
 * problem." James, on his own titles: "if we can combine those, create an
 * account, then shop for schools and programs in the one card, great." So the
 * merged title is still his and the body is still hers, and the account is a
 * clause inside a sentence instead of a step of its own. Connect to schools
 * through AllCampus moves up a slot and keeps its highlight. It is the
 * anti-leakage step and the reason the section exists.
 *
 * REIMBURSEMENT STEP ADDED, CONDITIONAL. Brigid: "what they want to know is
 * when do I file for reimbursement... that's way more customer-centered than
 * create an account, which is AllCampus-centered," and on fitting it in, "if
 * we could fit it all, then I would say, 'Complete your class and file for
 * reimbursement.'" It is gated on `reimburses`, the same flag that decides
 * whether ALLCAMPUS_SEQUENCING is appended to the Connect step. If that card
 * promises the learner a reimbursement process, the journey has to say when
 * it happens. No reimbursement, no card, which is why noTr and perks partners
 * never see it. Benefit-admin partners file with the administrator rather
 * than the employer, so the body names whoever actually pays.
 *
 * CLIENT REVIEW 2026-08-31 (Brigid, James, Terrence, Agustin). Layout only.
 * No copy, no conditional logic, no ordering, and no change to the
 * highlighted Connect step. Agustin, on this section: "How AllCampus works —
 * this looks great when there are 6, but looks bad when 4 or 5. Please update
 * layout depending on what the scenario is that we're highlighting."
 *
 * He is right, and the justify-center fix described further down was the wrong
 * answer. Centering the leftovers does not stop them reading as leftovers, it
 * only moves the orphan from the left edge to the middle where it is more
 * conspicuous. The step count is known at render time, so the column count
 * should be a function of it rather than one rule the browser has to make the
 * best of. The per-count rule is in the STRIP LAYOUT note below.
 */

/*
 * The person-plus "account" glyph went out with the 2026-08-28 merge. The
 * merged card carries both actions and Brigid's whole point is that the
 * account is not the interesting half, so the search glyph leads it. Left as
 * dead code the glyph would be one more stranded string like the ones
 * landingCopy.js was written to clear out.
 */
const ART = {
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
  // A receipt, for the filing step. The clipboard-check already belongs to
  // the two employer steps, and three identical glyphs in one strip would
  // read as a rendering bug rather than a sequence.
  reimburse: (props) => (
    <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M12 7h24v34l-6-4-6 4-6-4-6 4z" />
      <path d="M19 18h10M19 26h6" />
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
  // Who the learner actually files with. Both halves are already capitalized
  // for the sentence-initial position they land in: Admin above, and partner
  // names that read as names ("Sheetz", "Your employer").
  const filer = Admin || partner?.name || 'Your employer'
  const steps = [
    {
      icon: 'shop',
      // James's merged title (2026-08-28), Brigid's body. Her register, so
      // the account is the short half of the sentence and the shopping is
      // the rest of it.
      title: 'Create your account and shop programs',
      body: 'Set up an account, then search schools and programs, save the ones you are considering, and compare them on price and schedule.',
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
    // Brigid's filing step (2026-08-28). Reimbursement partners only:
    // `reimburses` is the same test that appends her sequencing clause to
    // the AllCampus step, so the two cards can never disagree about whether
    // there is a reimbursement process at all.
    ...(reimburses
      ? [
          {
            icon: 'reimburse',
            title: 'Finish your class and file for reimbursement',
            body: `Reimbursement comes after the class, not before. ${filer} needs your final grade and what you paid, so file as soon as the term closes.`,
          },
        ]
      : []),
  ]

  /*
   * STRIP LAYOUT (2026-08-31, per Agustin's review note in the header).
   *
   * Flex, not the 3-up grid it was until 2026-08-28. The merge took one step
   * out and the filing step puts one back only for reimbursement partners, so
   * the count is 4 (no reimbursement), 5, or 6 (reimbursement plus an
   * administrator). One column at 390px and two from sm, same as the grid did.
   * What changed today is the third stage: the column count at lg is now
   * chosen per step count, so every row fills its line in all three cases.
   *
   *   4 steps   lowes, perks, no admin              one row of four
   *   5 steps   sheetz, direct-tr, no admin         three, then two widened
   *   6 steps   boeing, benefit-admin plus TR       two rows of three
   *
   * SIX IS UNTOUCHED. It is the case the client called out as working, so the
   * third-width it already had is the width it still gets.
   *
   * FOUR GOES ON ONE LINE, not 2x2. Two reasons. House precedent: StepsStrip
   * and EcosystemStrip, the sibling strips on this same page, both already
   * branch to lg:grid-cols-4 at exactly four items, and StepsStrip is this
   * component's predecessor. And proportion: in this 1112px container a 2x2
   * card is about 548px wide, which turns the approved card into a 2.9:1
   * banner with a two-line body and stops looking like the same component.
   * Four across is about 266px, far closer to the ~360px of the six-step
   * layout the client likes, and a four-step journey read straight across is
   * one sequence rather than one the reader has to wrap through for no reason.
   *
   * FIVE IS 3 + 2, second row widened to half each so it fills its line. Five
   * across is about 206px, too narrow for bodies this long. 2 + 3 would open
   * the section on two wide banners and leave the second row looking like the
   * remainder. 3 + 2 sets the rhythm at the same third-width as the six-step
   * layout and then closes on a wider pair, which reads as an ending.
   *
   * TWO-UP AT sm HAS THE SAME PROBLEM AT FIVE: 2 + 2 + 1 strands the last
   * card at tablet. There it goes full width instead, so that row fills too.
   *
   * justify-center is now a no-op, every row fills exactly. It stays as the
   * fallback if a seventh step ever appears before this rule is extended.
   *
   * TAILWIND v4 WIDTHS. Every width below is the pre-divided, no-space form,
   * and every one is a whole literal in the source so the class scanner can
   * see it. Do not refactor these into string concatenation, and do not divide
   * inside the calc: the standing note on this project is that an arbitrary
   * value carrying a forward slash can be dropped from the bundle silently,
   * with no build error, because Tailwind also uses the slash as its modifier
   * separator. Pre-computing the subtraction sidesteps the question entirely.
   *
   * Write no example of the slash form here. On 2026-08-31 an earlier draft of
   * this note quoted one, and the class scanner read it out of the comment and
   * emitted a real, unreferenced width utility into the bundle. Tailwind scans
   * comments too, so any class-shaped string in prose becomes dead CSS.
   *
   * The gap is 1rem, so each card gives back gap * (cols - 1) / cols:
   * 0.5rem at two-up, 0.667rem at three-up, 0.75rem at four-up.
   */
  const count = steps.length
  const smWidth = (i) =>
    count === 5 && i === 4 ? 'sm:w-full' : 'sm:w-[calc(50%-0.5rem)]'
  const lgWidth = (i) => {
    if (count === 4) return 'lg:w-[calc(25%-0.75rem)]'
    if (count === 5)
      return i < 3
        ? 'lg:w-[calc(33.333%-0.667rem)]'
        : 'lg:w-[calc(50%-0.5rem)]'
    return 'lg:w-[calc(33.333%-0.667rem)]'
  }
  const strip = (
    <ol className="flex flex-wrap justify-center gap-4">
      {steps.map((s, i) => {
            const Art = ART[s.icon]
            const on = !!s.highlight
            return (
              <li
                key={s.title}
                className={`flex w-full ${smWidth(i)} ${lgWidth(i)}`}
              >
                <div
                  className={`flex w-full flex-col rounded-[var(--radius-card)] p-6 transition ${
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
