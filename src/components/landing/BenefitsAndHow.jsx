import { Eyebrow, Heading, Body } from './Section.jsx'
import EcosystemStrip from './EcosystemStrip.jsx'
import { PROGRAMS, money } from '../../data/model.js'
import { bestDiscountPercent } from '../../data/benefit.js'
import { hasBenefitAdmin, policyOwner, PREAPPROVAL_RULE } from '../../data/corporatePartners.js'

/*
 * BenefitsAndHow (2026-08-19 session): "the education benefit and how this
 * works, maybe we could combine them somehow into one idea. Here are the two
 * big benefits for you, here's how this works." One band replaces the two
 * separate ones (BenefitBlock + the how-this-works strip section).
 *
 * Narrative rule from the session: logged out, speak generically; the bucket
 * decides how concrete the TR half gets. Discounts are the benefit for
 * everyone; TR is concrete for TR buckets, a possibility for
 * unknown-eligibility buckets, honestly absent for no-TR.
 *
 * ALL COPY IS DRAFT. Brigid's content doc is pending; the skeleton borrows
 * her Quick Guide's language (its own Step 1 is "find a qualifying program").
 */
export default function BenefitsAndHow({ partner }) {
  const maxPct = bestDiscountPercent(PROGRAMS)
  const reimburses = partner?.benefitKnown && (partner?.employerReimbursement ?? 0) > 0
  const trPossible = !reimburses && (partner?.partnerType === 'perks' || !partner?.benefitKnown)
  const owner = policyOwner(partner)

  const steps = [
    {
      t: 'Find a qualifying program',
      b: 'Search or browse by subject or outcome. Nothing needs approving at this stage.',
    },
    {
      t: 'Create a free account',
      b: 'It attaches your employer pricing, so you see your real cost instead of list prices.',
    },
    {
      t: 'Confirm your benefit',
      b: reimburses
        ? `${owner || 'Your employer'} decides eligibility and approves funding. A free specialist call walks you through it first. ${PREAPPROVAL_RULE}`
        : trPossible
          ? `If your employer offers tuition reimbursement, they decide eligibility and approvals. A free specialist call helps you check. ${PREAPPROVAL_RULE}`
          : 'A free specialist call confirms your pricing and next steps, with no obligation.',
    },
    {
      t: 'Apply through AllCampus',
      b: 'Applying through AllCampus keeps your discount attached; going straight to the school means standard tuition.',
    },
  ]

  return (
    <section className="bg-mk-band py-16">
      <div className="mx-auto max-w-6xl px-5">
        <Eyebrow>Your benefits</Eyebrow>
        <Heading className="mt-2">Two ways to pay less, and how this works</Heading>
        <Body className="mt-2 max-w-2xl">
          One is guaranteed. The other depends on your employer. They stack.
        </Body>

        {/* The two big benefits */}
        <div className="mt-7 grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="rounded-[var(--radius-card)] bg-white p-6 shadow-[0_1px_2px_rgba(51,71,91,0.06)]">
            <p className="font-display text-[11.5px] font-bold uppercase tracking-[0.14em] text-mk-teal-text">
              For everyone
            </p>
            <p className="mt-2 font-display text-[21px] font-extrabold leading-snug text-mk-slate">
              {maxPct != null ? `Up to ${maxPct}% off tuition` : 'Exclusive tuition discounts'}
            </p>
            <p className="mt-2 font-display text-[14px] leading-relaxed text-mk-body">
              Partner pricing the schools reserve for AllCampus. It applies automatically when you
              enroll through us. Nothing to apply for, no approval to wait on.
            </p>
          </div>
          <div className="rounded-[var(--radius-card)] bg-white p-6 shadow-[0_1px_2px_rgba(51,71,91,0.06)]">
            <p className="font-display text-[11.5px] font-bold uppercase tracking-[0.14em] text-mk-teal-text">
              {reimburses ? 'From your employer' : trPossible ? 'Worth checking' : 'Your employer'}
            </p>
            <p className="mt-2 font-display text-[21px] font-extrabold leading-snug text-mk-slate">
              {reimburses
                ? `${money(partner.employerReimbursement)}/yr toward tuition`
                : trPossible
                  ? 'Tuition reimbursement may be available'
                  : 'The discount is yours regardless'}
            </p>
            <p className="mt-2 font-display text-[14px] leading-relaxed text-mk-body">
              {reimburses
                ? `Tuition reimbursement${hasBenefitAdmin(partner) ? ', administered through your benefit portal,' : ''} stacks on top of the discount. Eligibility, approval, and filing are owned by your employer, not AllCampus.`
                : trPossible
                  ? 'Many employers put money toward tuition. Check your benefits portal, or a free specialist call can help you find out. Either way, the discount above applies.'
                  : 'Your employer does not currently offer tuition reimbursement, and that is worth being straight about. Every program here still carries the AllCampus discount.'}
            </p>
          </div>
        </div>

        {/* How this works: who does what, then what you do */}
        <h3 className="mt-10 font-display text-[16px] font-extrabold text-mk-slate">Who does what</h3>
        <div className="mt-4">
          <EcosystemStrip variant="landing" partner={partner} />
        </div>

        <h3 className="mt-8 font-display text-[16px] font-extrabold text-mk-slate">
          What you do, in order
        </h3>
        <ol className="mt-4 grid grid-cols-1 gap-4 rounded-[var(--radius-card)] border border-mk-line bg-white p-5 sm:grid-cols-2 sm:p-6 lg:grid-cols-4">
          {steps.map((s, i) => (
            <li key={s.t} className="flex gap-3">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-mk-blue-50 font-display text-[13px] font-black text-mk-teal-700 ring-1 ring-mk-blue-200">
                {i + 1}
              </span>
              <span>
                <span className="block font-display text-[14px] font-extrabold text-mk-slate">
                  {s.t}
                </span>
                <span className="mt-1 block font-display text-[13px] leading-relaxed text-mk-body">
                  {s.b}
                </span>
              </span>
            </li>
          ))}
        </ol>

        <p className="mt-4 font-display text-[12px] text-mk-body/70">
          Draft copy. Brigid&rsquo;s content doc is pending; the structure and steps follow her
          Quick Guide.
        </p>
      </div>
    </section>
  )
}
