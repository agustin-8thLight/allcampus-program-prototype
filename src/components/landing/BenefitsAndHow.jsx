import { Eyebrow, Heading, Body, MkButton } from './Section.jsx'
import StepsStrip from './StepsStrip.jsx'
import EcosystemStrip from './EcosystemStrip.jsx'
import { PROGRAMS, money } from '../../data/model.js'
import { SCHOOLS, getSchool } from '../../data/schools.js'
import { bestDiscountPercent } from '../../data/benefit.js'
import { hasBenefitAdmin, policyOwner } from '../../data/corporatePartners.js'
import { WHY_IMAGE } from '../../data/images.js'
import { ALLCAMPUS_BASE } from '../../data/landingCopy.js'
import Img from '../Img.jsx'

/*
 * The How band and the Why AllCampus band (2026-08-21 review: split into two
 * components so Ally can sit between them; How stays on white, Why AllCampus
 * opens the grey region that runs through stories, schools, and FAQ).
 *
 * Narrative rule (Brigid's Aug 20 session + follow-up): the big picture is
 * the confidence builder, so HOW leads the page; WHAT (value tiles + the
 * $5,250 cap callout) and WHY-through-AllCampus (the leakage line) follow.
 *
 * COPY OF RECORD: Brigid's landing-page content doc (2026-08-20) supplies the
 * WHY ALLCAMPUS headline (Version A for TR audiences, Version B general), the
 * AllCampus activation line, and the connect/select verbs. Her strings are
 * quoted verbatim, em dashes included. Counts and dollars are mock.
 */

export function partnerState(partner) {
  const reimburses = partner?.benefitKnown && (partner?.employerReimbursement ?? 0) > 0
  // 'perks' = Brigid's Benefit Partner No TR: definitely no reimbursement.
  //
  // 2026-08-28: 'direct-mixed' was falling into noTr, because it carries
  // benefitKnown with employerReimbursement 0. That is wrong. Per Brigid
  // (2026-08-19, quoted in the Texas Roadhouse record) mixed means SOME
  // employees have reimbursement and some don't — so it belongs in the
  // "possible, go check" bucket, which is what EcosystemStrip's own
  // direct-mixed copy has always said. Only 'perks' and 'direct-no-tr' are
  // definitely-no.
  const noTr =
    !reimburses &&
    (partner?.partnerType === 'perks' || partner?.partnerType === 'direct-no-tr')
  return { reimburses, noTr, trPossible: !reimburses && !noTr }
}

/* HowItWorks was removed 2026-08-27: James's merge replaced it with
 * JourneySteps. StepsStrip and EcosystemStrip stay in the tree, unused. */

export function WhyAllCampus({ partner, onNavigate, onSpecialist }) {
  const { reimburses, noTr, trPossible } = partnerState(partner)
  const possessive =
    partner?.benefitKnown && !/^your /i.test(partner.name || '')
      ? `${partner.name}’s`
      : 'your employer’s'
  const maxPct = bestDiscountPercent(PROGRAMS)
  const cappedSchools = Object.values(SCHOOLS).filter((s) => s.tuitionCap)
  /*
   * The cap number, the program count, and the CTA all come off the catalog,
   * never typed in. cappedProgramCount uses the SAME predicate as App.jsx:215
   * behind ?capped=1, so the number in the button label cannot disagree with
   * the number of results that load (14 for every partner).
   */
  const tuitionCap = cappedSchools.length
    ? Math.min(...cappedSchools.map((s) => s.tuitionCap))
    : null
  const cappedProgramCount = PROGRAMS.filter((p) => getSchool(p.schoolId)?.tuitionCap).length
  const reimbursement = partner?.employerReimbursement ?? 0
  /*
   * 2026-08-31: $0 is only true when the reimbursement actually REACHES the
   * cap. Brigid's Version A sentence was rendering for every reimbursing
   * partner, including Giant Eagle at $3,500 against a $5,250 cap, which
   * promised a zero that partner's employees will not see. Same honesty rule
   * as the noTr branch, applied to a case nobody had checked.
   */
  const coversCap = reimburses && tuitionCap != null && reimbursement >= tuitionCap
  const employerLabel = /^your /i.test(partner?.name || '')
    ? 'your employer'
    : `your ${partner?.name}`

  return (
    <section className="bg-white py-20">
      <div className="mx-auto max-w-6xl px-5">
        {/*
          2026-08-31 review, CHANGE 1: header cut to an eyebrow, one heading,
          one line. Agustin: "I was trying to play with there's so much text on
          the screen, that I was trying to see what we could cut out."

          What left, and why it is not a loss:
            - "50+ schools. 1,200+ programs. Up to 25% off" is now the hero's
              four fact boxes (SearchHero, same review). Its own header note
              sets the division of labor: the hero carries the factoids, this
              block carries the argument. Two places saying the same numbers
              was the duplication being cut.
            - Brigid's cap dek moved DOWN into the capped block, where it is
              now the headline over the primary action instead of a sentence
              that repeated it three inches later.
            - James's 2026-08-27 note 3 ("say what kind of company AllCampus
              is, and that the employer chose it") was a third paragraph. It is
              the one thing on this page nothing else says, so it became the
              heading itself and its "built to" clause became the only dek.
              His wording is unchanged; the honest variants for no-TR and
              unknown-TR employers survive the move.
        */}
        <Eyebrow>Why AllCampus</Eyebrow>
        <Heading className="mt-2 max-w-3xl">
          AllCampus is {possessive}{' '}
          {noTr ? 'discount network partner' : 'tuition benefit partner'}
        </Heading>
        <Body className="mt-3 max-w-2xl">
          {noTr
            ? 'Built to reduce the cost of tuition for you.'
            : reimburses
              ? 'Built to help you use your discount and your reimbursement without the runaround.'
              : 'Built to help you use your discount, guaranteed for everyone, and your reimbursement if your role qualifies.'}
        </Body>

        {/* One card, read top to bottom (2026-08-25). The ORDER inside it
            changed on 2026-08-31: cap first, discount second. */}
        <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)]">
          <Img
            src={WHY_IMAGE}
            alt=""
            hue={206}
            className="h-64 w-full lg:h-full lg:min-h-[400px]"
          />

          <div className="rounded-[var(--radius-card)] border border-mk-line bg-white p-8">
            {/*
              2026-08-31 review, CHANGE 2: the capped schools are the section's
              primary action, ranked above the discount.

              Brigid: "I think the fully covered schools or whatever we're
              calling it... that, to me, it feels like we're burying the lead
              with that on this visually." James: "Joe's first question on
              these is going to be like, 'Well, how do I easily find the fully
              covered schools?' He's really been pushing," and "whether that
              sits below the tuition or it sits higher, somewhere where that is
              more prominent."

              It was last in the card, in 13px grey, behind a link to an
              UNFILTERED /browse. Now it leads, on the tinted ground, at the
              largest step in the card, with the only button in the section.

              SAME IN ALL THREE PARTNER STATES, deliberately. Brigid: "the
              language will be different, but it still is the most affordable
              thing is the tuition cap. Never pay more than $5,250 a year." A
              capped school is the best value whether or not we can see the
              person's reimbursement, so the label, the headline, and the CTA
              do not branch. Only the one support line does.

              Destination is /browse?capped=1, NOT ?covered=1. Covered runs
              isFullyCoveredEstimate and needs a known employer benefit, so it
              returns 0 programs for a visitor with no employer on file.
              ?capped=1 filters on the school's own tuitionCap and returns the
              same 14 programs for every partner, which is the only thing that
              can sit behind a CTA shown to everyone.
            */}
            {cappedSchools.length > 0 && (
              <div className="rounded-xl bg-mk-band p-6">
                <p className="font-display text-mk-caption font-bold uppercase tracking-[0.14em] text-mk-teal-text">
                  Most affordable
                </p>
                {/* Brigid's Version B dek, verbatim, promoted from under the
                    section heading to the top of the action. */}
                <p className="mt-1.5 font-display text-mk-subhead font-black leading-snug text-mk-slate">
                  At select schools, you&rsquo;ll never pay more than {money(tuitionCap)} a year.
                </p>
                {/*
                  CHANGE 3: the honesty branches are kept. Never imply
                  reimbursement money to someone we know does not have it, and
                  never promise $0 we cannot compute. The cap is a ceiling on
                  what they pay, not a guarantee of zero. James on the unknown
                  case: "it might be fully covered, right? It might be fully
                  covered," which is why the cap still leads there.
                */}
                <Body className="mt-2">
                  {coversCap
                    ? `Your out-of-pocket cost is $0 — tuition capped to match ${employerLabel} benefit.`
                    : reimburses
                      ? `${money(reimbursement)} a year from ${employerLabel} benefit comes off that capped amount, so you would cover the difference at most.`
                      : noTr
                        ? 'That cap holds before any discount math even starts.'
                        : 'If your employer reimburses tuition, that cap can mean $0 out of pocket.'}
                </Body>
                <MkButton
                  className="mt-4"
                  onClick={() => onNavigate?.('/browse?capped=1')}
                >
                  See the {cappedProgramCount} programs capped at {money(tuitionCap)}/yr
                  <span aria-hidden>&rarr;</span>
                </MkButton>
                {/* The two schools stay reachable, but as one sentence under
                    the action instead of a row of pills competing with it
                    (2026-08-31: "make this more of the action right here"). */}
                <p className="mt-3 font-display text-mk-meta leading-relaxed text-mk-body">
                  Currently{' '}
                  {cappedSchools.map((s, i) => (
                    <span key={s.id}>
                      {i > 0 && (i === cappedSchools.length - 1 ? ' and ' : ', ')}
                      <button
                        type="button"
                        onClick={() => onNavigate?.(`/school/${s.id}`)}
                        className="font-bold text-mk-teal-700 underline-offset-2 hover:underline"
                      >
                        {s.name}
                      </button>
                    </span>
                  ))}
                  .
                </p>
              </div>
            )}

            {/* Discount: second now, and sized like it. The cap headline above
                is the only mk-subhead step in the card. */}
            <div className={cappedSchools.length > 0 ? 'mt-6 border-t border-mk-line pt-5' : ''}>
              <p className="font-display text-mk-caption font-bold uppercase tracking-[0.14em] text-mk-teal-text">
                For everyone
              </p>
              <p className="mt-1.5 font-display text-mk-cardtitle font-extrabold leading-snug text-mk-slate">
                {maxPct != null ? `Up to ${maxPct}% off tuition` : 'Exclusive tuition discounts'}
              </p>
              {/* 2026-08-31: this sentence was hand-retyped here while the
                  same string sat in landingCopy.js as ALLCAMPUS_BASE, which is
                  the file that exists so her verbatim copy cannot drift
                  between surfaces. Reading it from there instead. */}
              <Body className="mt-2">{ALLCAMPUS_BASE}</Body>
            </div>

            <div className="mt-6 border-t border-mk-line pt-5">
              <p className="font-display text-mk-caption font-bold uppercase tracking-[0.14em] text-mk-teal-text">
                {reimburses ? 'From your employer' : trPossible ? 'Worth checking' : 'The certain part'}
              </p>
              <p className="mt-1.5 font-display text-mk-cardtitle font-extrabold leading-snug text-mk-slate">
                {reimburses
                  ? `${money(partner.employerReimbursement)}/yr toward tuition`
                  : trPossible
                    ? 'Tuition reimbursement may be available'
                    : 'The discount network is yours regardless'}
              </p>
              <Body className="mt-2">
                {reimburses
                  ? `Tuition reimbursement${hasBenefitAdmin(partner) ? ', administered through your benefit portal,' : ''} stacks on top of the discount. Eligibility, approval, and filing are owned by your employer, not AllCampus.`
                  : trPossible
                    ? 'Many employers put money toward tuition. Check your benefits portal, or a free specialist call can help you find out. Either way, the discount above applies.'
                    : 'No reimbursement program is attached here, and that is worth being straight about. Access to the AllCampus discount network is guaranteed regardless: every program carries partner pricing.'}
              </Body>
            </div>
          </div>
        </div>

        {/* 2026-08-27: "Who does what" is GONE from this page. Its content
            did not disappear: each of the five journey steps now names its
            own driver inline, which is what James's merge was for. The
            EcosystemStrip component stays in the tree for the school page. */}
        <div className="mt-8 flex flex-wrap items-center gap-x-3 gap-y-2">
          <Body className="font-semibold">Not sure what your own numbers look like?</Body>
          {/* text-mk-body is a COLOR utility, not a size one (index.css defines
              both --color-mk-body and --text-mk-body, and color wins the name),
              so the 15px step is referenced by variable here. */}
          <button
            type="button"
            onClick={() => onSpecialist?.()}
            className="font-display text-[length:var(--text-mk-body)] font-bold text-mk-teal-700 underline-offset-2 hover:underline"
          >
            Talk to an Education Benefits specialist &rarr;
          </button>
        </div>
      </div>
    </section>
  )
}
