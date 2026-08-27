import { Eyebrow, Heading, Body } from './Section.jsx'
import StepsStrip from './StepsStrip.jsx'
import EcosystemStrip from './EcosystemStrip.jsx'
import { PROGRAMS, money } from '../../data/model.js'
import { SCHOOLS } from '../../data/schools.js'
import { bestDiscountPercent } from '../../data/benefit.js'
import { hasBenefitAdmin, policyOwner } from '../../data/corporatePartners.js'
import { WHY_IMAGE } from '../../data/images.js'
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

function partnerState(partner) {
  const reimburses = partner?.benefitKnown && (partner?.employerReimbursement ?? 0) > 0
  // 'perks' = Brigid's Benefit Partner No TR: definitely no reimbursement.
  // Only a truly unknown employer gets the "may be available" framing.
  const noTr =
    !reimburses &&
    (partner?.partnerType === 'perks' ||
      partner?.partnerType === 'direct-no-tr' ||
      (partner?.benefitKnown && !reimburses))
  return { reimburses, noTr, trPossible: !reimburses && !noTr }
}

export function HowItWorks({ partner, onGate }) {
  const { reimburses, trPossible } = partnerState(partner)
  const owner = policyOwner(partner)

  const steps = [
    {
      icon: 'find',
      title: 'Select a school and a program',
      body: 'Answer 3 questions, or browse the catalog. Nothing needs approving yet.',
    },
    {
      icon: 'account',
      title: 'Save your profile',
      body: 'Keeps your matches and your pricing with you. Nothing goes to your employer.',
      cta: { label: 'Create your free account', onClick: () => onGate?.('catalog') },
    },
    {
      icon: 'confirm',
      title: 'Confirm your benefit',
      body: reimburses
        ? `${owner || 'Your employer'} approves the funding, not AllCampus. A free specialist call walks you through it.`
        : trPossible
          ? 'If your employer reimburses tuition, they own eligibility. A free call helps you check.'
          : 'A free specialist call confirms your pricing and next steps. No obligation.',
    },
    {
      icon: 'apply',
      title: 'Connect with a school through AllCampus',
      // 2026-08-27: the emphasis sits here, on the goal. Connecting through
      // AllCampus is what activates the discount, so it is the thing the whole
      // path exists to reach — not the account step, which is a means.
      highlight: true,
      body: 'The school then handles admissions, enrollment, billing, and your discounted tuition.',
    },
  ]

  return (
    <section className="bg-white pb-12 pt-20">
      <div className="mx-auto max-w-6xl px-5">
        {/* No eyebrow: "HOW IT WORKS" over "One path, start to finish" was a
            label restating the heading under it. "Clear" also went — a page
            that claims to be clear is not the same as one that is. */}
        <Heading>One path, start to finish</Heading>

        {/* 2026-08-25: "Who does what along the way" moved out of this
            section and into Why AllCampus. This section answers what YOU do;
            the cast of parties is an argument for the platform, not a step
            in the journey, and having both here made one long explainer. */}
        <div className="mt-8">
          <StepsStrip steps={steps} />
        </div>
      </div>
    </section>
  )
}

export function WhyAllCampus({ partner, onNavigate, onSpecialist }) {
  const { reimburses, noTr, trPossible } = partnerState(partner)
  const maxPct = bestDiscountPercent(PROGRAMS)
  const schoolCount = Object.keys(SCHOOLS).length
  const cappedSchools = Object.values(SCHOOLS).filter((s) => s.tuitionCap)

  return (
    <section className="bg-white py-20">
      <div className="mx-auto max-w-6xl px-5">
        {/* Brigid's WHY ALLCAMPUS headline (content doc, 2026-08-20), Version
            A for TR audiences / Version B general. */}
        <Eyebrow>Why AllCampus</Eyebrow>
        <Heading className="mt-2 max-w-3xl">
          {schoolCount} schools. {PROGRAMS.length} programs.{' '}
          {reimburses ? 'Discounts already negotiated.' : `Up to ${maxPct}% off tuition.`}
        </Heading>

        {/* 2026-08-27, James's note 3: nothing on the page said outright what
            kind of company AllCampus is, or that the employer chose it. That
            matters to anyone wary of a third party touching their benefit. */}
        <p className="mt-3 max-w-2xl font-display text-[15px] leading-relaxed text-mk-body">
          <strong className="font-extrabold text-mk-slate">
            AllCampus is {partner?.benefitKnown && !/^your /i.test(partner.name) ? `${partner.name}\u2019s` : 'your employer\u2019s'}{' '}
            tuition benefit partner
          </strong>
          , built to help you use your discount and your reimbursement without the runaround.
        </p>

        {/* 2026-08-25: the stat tiles came out (the headline already carries
            those figures), and the three stacked cards became ONE card. Three
            bordered boxes of equal weight gave the reader no order to read in;
            now the discount leads, the employer money sits under it, and the
            cap is the closing note. Brigid's wording is unchanged. */}
        <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)]">
          <Img
            src={WHY_IMAGE}
            alt=""
            hue={206}
            className="h-64 w-full lg:h-full lg:min-h-[400px]"
          />

          <div className="rounded-[var(--radius-card)] border border-mk-line bg-white p-7 shadow-[0_2px_10px_rgba(51,71,91,0.05)]">
            <p className="font-display text-[11.5px] font-bold uppercase tracking-[0.14em] text-mk-teal-text">
              For everyone
            </p>
            <p className="mt-1.5 font-display text-[27px] font-black leading-tight text-mk-slate">
              {maxPct != null ? `Up to ${maxPct}% off tuition` : 'Exclusive tuition discounts'}
            </p>
            <p className="mt-2 font-display text-[14.5px] leading-relaxed text-mk-body">
              AllCampus already secured your discount &mdash; it&rsquo;s just waiting to be
              activated. Connect with a school through AllCampus to make that happen.
            </p>

            <div className="mt-6 border-t border-mk-line pt-5">
              <p className="font-display text-[11.5px] font-bold uppercase tracking-[0.14em] text-mk-teal-text">
                {reimburses ? 'From your employer' : trPossible ? 'Worth checking' : 'The certain part'}
              </p>
              <p className="mt-1.5 font-display text-[20px] font-extrabold leading-snug text-mk-slate">
                {reimburses
                  ? `${money(partner.employerReimbursement)}/yr toward tuition`
                  : trPossible
                    ? 'Tuition reimbursement may be available'
                    : 'The discount network is yours regardless'}
              </p>
              <p className="mt-2 font-display text-[14px] leading-relaxed text-mk-body">
                {reimburses
                  ? `Tuition reimbursement${hasBenefitAdmin(partner) ? ', administered through your benefit portal,' : ''} stacks on top of the discount. Eligibility, approval, and filing are owned by your employer, not AllCampus.`
                  : trPossible
                    ? 'Many employers put money toward tuition. Check your benefits portal, or a free specialist call can help you find out. Either way, the discount above applies.'
                    : 'No reimbursement program is attached here, and that is worth being straight about. Access to the AllCampus discount network is guaranteed regardless: every program carries partner pricing.'}
              </p>
            </div>

            {cappedSchools.length > 0 && (
              <div className="mt-5 rounded-xl bg-mk-band/70 p-5">
                <p className="font-display text-[16px] font-extrabold leading-snug text-mk-slate">
                  {reimburses
                    ? `Your out-of-pocket at ${cappedSchools.length} schools: $0.`
                    : noTr
                      ? `Never pay more than ${money(5250)} a year at ${cappedSchools.length} schools.`
                      : `${cappedSchools.length} schools cap tuition at ${money(5250)} a year.`}
                </p>
                <p className="mt-1.5 font-display text-[13.5px] leading-relaxed text-mk-body">
                  {reimburses
                    ? 'The cap matches your reimbursement, so your benefit covers it entirely.'
                    : noTr
                      ? 'That cap holds before any discount math even starts.'
                      : 'If your employer reimburses tuition, that cap can mean $0 out of pocket.'}
                </p>
                {/* 2026-08-26: these were dead text. They name the two
                    schools where the number above is literally $0, which makes
                    them the most earned link on the page. */}
                <span className="mt-3 flex flex-wrap items-center gap-2">
                  {cappedSchools.map((s) => (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => onNavigate?.(`/school/${s.id}`)}
                      className="rounded-full border border-mk-line bg-white px-3 py-1 font-display text-[12.5px] font-bold text-mk-slate transition hover:border-mk-teal-600 hover:text-mk-teal-700"
                    >
                      {s.name} &rarr;
                    </button>
                  ))}
                  {/* 2026-08-26: was "See all programs". The profile is the
                      thing we drive to, because it is what carries a price
                      like this one from visit to visit — and it only persists
                      once there's an account behind it. */}
                  <button
                    type="button"
                    onClick={() => onNavigate?.('/browse')}
                    className="font-display text-[12.5px] font-bold text-mk-teal-700 underline-offset-2 hover:underline"
                  >
                    See all programs &rarr;
                  </button>
                </span>
              </div>
            )}
          </div>
        </div>

        {/* 2026-08-27: "Who does what" is GONE from this page. Its content
            did not disappear — each of the five journey steps now names its
            own driver inline, which is what James's merge was for. The
            EcosystemStrip component stays in the tree for the school page. */}
        <div className="mt-8 flex flex-wrap items-center gap-x-3 gap-y-2">
          <p className="font-display text-[14.5px] font-semibold text-mk-body">
            Not sure what your own numbers look like?
          </p>
          <button
            type="button"
            onClick={() => onSpecialist?.()}
            className="font-display text-[14.5px] font-bold text-mk-teal-700 underline-offset-2 hover:underline"
          >
            Talk to an Education Benefits specialist &rarr;
          </button>
        </div>

        {/* 2026-08-25: the standalone activation banner is gone. The same
            message is already in the value card above, in Brigid's own
            wording ("AllCampus already secured your discount — it's just
            waiting to be activated"), so this was the third time the page
            said it. */}
      </div>
    </section>
  )
}
