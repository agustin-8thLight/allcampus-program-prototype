import { Eyebrow, Heading, Body } from './Section.jsx'
import StepsStrip from './StepsStrip.jsx'
import EcosystemStrip from './EcosystemStrip.jsx'
import { PROGRAMS, money } from '../../data/model.js'
import { SCHOOLS } from '../../data/schools.js'
import { bestDiscountPercent } from '../../data/benefit.js'
import { hasBenefitAdmin, policyOwner, PREAPPROVAL_RULE } from '../../data/corporatePartners.js'
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
      highlight: true,
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
      note: reimburses || trPossible ? PREAPPROVAL_RULE : null,
    },
    {
      icon: 'apply',
      title: 'Connect with a school through AllCampus',
      body: 'The school then handles admissions, enrollment, billing, and your discounted tuition.',
      // Brigid, 8/21: activation bolded as the next step inside the journey.
      note: 'This is the step that activates your discount. It’s already yours.',
    },
  ]

  return (
    <section className="bg-white py-20">
      <div className="mx-auto max-w-6xl px-5">
        <Eyebrow>How it works</Eyebrow>
        <Heading className="mt-2">One clear path, start to finish</Heading>

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

export function WhyAllCampus({ partner }) {
  const { reimburses, noTr, trPossible } = partnerState(partner)
  const maxPct = bestDiscountPercent(PROGRAMS)
  const schoolCount = Object.keys(SCHOOLS).length
  const cappedSchools = Object.values(SCHOOLS).filter((s) => s.tuitionCap)

  // 2026-08-25 polish: the numbers that carried this section were buried in
  // body copy, so they lead now as a stat row. Copy pass, same day: the
  // school and program counts came straight back out — Brigid's headline
  // already says "24 schools. 135 programs." two lines above. What's left
  // is the two figures the headline doesn't carry.
  const stats = [
    { value: maxPct != null ? `${maxPct}%` : 'Yes', label: 'off tuition, already negotiated' },
    ...(cappedSchools.length > 0
      ? [{ value: money(5250), label: `a year, capped at ${cappedSchools.length} schools` }]
      : []),
  ]

  return (
    <section className="border-t border-mk-line bg-mk-surface py-20">
      <div className="mx-auto max-w-6xl px-5">
        {/* Brigid's WHY ALLCAMPUS headline (content doc, 2026-08-20), Version
            A for TR audiences / Version B general — her structure, our mock
            counts (her doc's 50+/1,200+ are production figures). */}
        <Eyebrow>Why AllCampus</Eyebrow>
        <Heading className="mt-2 max-w-3xl">
          {schoolCount} schools. {PROGRAMS.length} programs.{' '}
          {reimburses ? 'Discounts already negotiated.' : `Up to ${maxPct}% off tuition.`}
        </Heading>

        {/* Stat row: the scannable version of the section. */}
        <dl className="mt-7 grid grid-cols-1 gap-px overflow-hidden rounded-[var(--radius-card)] border border-mk-line bg-mk-line sm:max-w-2xl sm:grid-cols-2">
          {stats.map((st) => (
            <div key={st.label} className="bg-white px-5 py-6">
              <dt className="font-display text-[32px] font-black leading-none text-mk-teal-700">
                {st.value}
              </dt>
              <dd className="mt-2 font-display text-[13px] font-semibold leading-snug text-mk-body">
                {st.label}
              </dd>
            </div>
          ))}
        </dl>

        {/* Editorial pair: photo carries the section, the two benefit cards
            stack beside it. Brigid's strings are unchanged. */}
        <div className="mt-8 grid grid-cols-1 gap-5 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
          <Img
            src={WHY_IMAGE}
            alt=""
            hue={206}
            className="h-64 w-full lg:h-full lg:min-h-[420px]"
          />
          <div className="grid grid-cols-1 gap-4">
            <div className="rounded-[var(--radius-card)] border border-mk-line bg-white p-6 shadow-[0_2px_10px_rgba(51,71,91,0.05)]">
              <p className="font-display text-[11.5px] font-bold uppercase tracking-[0.14em] text-mk-teal-text">
                For everyone
              </p>
              <p className="mt-2 font-display text-[21px] font-extrabold leading-snug text-mk-slate">
                {maxPct != null ? `Up to ${maxPct}% off tuition` : 'Exclusive tuition discounts'}
              </p>
              <p className="mt-2 font-display text-[14px] leading-relaxed text-mk-body">
                AllCampus already secured your discount &mdash; it&rsquo;s just waiting to be
                activated. Connect with a school through AllCampus to make that happen.
              </p>
            </div>
            <div className="rounded-[var(--radius-card)] border border-mk-line bg-white p-6 shadow-[0_2px_10px_rgba(51,71,91,0.05)]">
              <p className="font-display text-[11.5px] font-bold uppercase tracking-[0.14em] text-mk-teal-text">
                {reimburses ? 'From your employer' : trPossible ? 'Worth checking' : 'The certain part'}
              </p>
              <p className="mt-2 font-display text-[21px] font-extrabold leading-snug text-mk-slate">
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

            {/* The $5,250 cap callout (Brigid 8/20: "that is so key"). Verbiage
                varies by scenario: $0 for TR, never-more-than for no-TR, both
                cases for unknown. */}
            {cappedSchools.length > 0 && (
              <div className="rounded-[var(--radius-card)] border border-mk-teal-600/40 bg-gradient-to-b from-white to-mk-band/40 p-6 shadow-[0_2px_10px_rgba(51,71,91,0.05)]">
                <p className="font-display text-[11.5px] font-bold uppercase tracking-[0.14em] text-mk-teal-text">
                  Worth knowing
                </p>
                <p className="mt-2 font-display text-[21px] font-extrabold leading-snug text-mk-slate">
                  {reimburses
                    ? `Your out-of-pocket at ${cappedSchools.length} schools: $0.`
                    : noTr
                      ? `Never pay more than ${money(5250)} a year at ${cappedSchools.length} schools.`
                      : `${cappedSchools.length} schools cap tuition at ${money(5250)} a year.`}
                </p>
                <p className="mt-2 font-display text-[14px] leading-relaxed text-mk-body">
                  {reimburses
                    ? `These schools cap what you pay at ${money(5250)} a year, the same amount as your reimbursement. Your benefit covers it entirely.`
                    : noTr
                      ? 'These schools cap what you pay out of pocket, before any discount math even starts.'
                      : `If your employer reimburses tuition, that cap can mean $0 out of pocket. If not, the cap still holds. Either way you are covered here.`}
                </p>
                <span className="mt-3 flex flex-wrap gap-2">
                  {cappedSchools.map((s) => (
                    <span
                      key={s.id}
                      className="rounded-full border border-mk-line bg-white px-3 py-1 font-display text-[12.5px] font-bold text-mk-slate"
                    >
                      {s.name}
                    </span>
                  ))}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Who does what: moved here from How it works (2026-08-25). The four
            parties are the reason the platform exists, so they belong in the
            argument for it, landing directly on the activation line below. */}
        <h3 className="mt-12 font-display text-[16px] font-extrabold text-mk-slate">
          Who does what along the way
        </h3>
        <div className="mt-4">
          <EcosystemStrip variant="landing" partner={partner} />
        </div>

        {/* WHY through AllCampus: the leakage line, stated plainly. The second
            sentence used to repeat step 4 of the journey almost word for word
            (2026-08-25 polish: deduped, the sentence of record stays). */}
        <div className="mt-8 rounded-[var(--radius-card)] border-l-4 border-mk-teal-600 bg-white px-6 py-4 shadow-[0_2px_10px_rgba(51,71,91,0.05)]">
          <p className="font-display text-[15px] font-extrabold text-mk-slate">
            Your discount already exists. Connect through AllCampus to activate it.
          </p>
        </div>
      </div>
    </section>
  )
}
