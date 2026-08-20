import { Eyebrow, Heading, Body } from './Section.jsx'
import StepsStrip from './StepsStrip.jsx'
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
export default function BenefitsAndHow({ partner, joined = false }) {
  const maxPct = bestDiscountPercent(PROGRAMS)
  const reimburses = partner?.benefitKnown && (partner?.employerReimbursement ?? 0) > 0
  const trPossible = !reimburses && (partner?.partnerType === 'perks' || !partner?.benefitKnown)
  const owner = policyOwner(partner)

  // The who-does-what facts now live INSIDE the step copy — the four-party
  // strip is retired (2026-08-20: one diagram, not two) and the journey
  // carries its content.
  const steps = [
    {
      icon: 'find',
      title: 'Find a qualifying program',
      body: 'Search or browse by subject or outcome. Nothing needs approving at this stage, and you are not committing to anything.',
    },
    {
      icon: 'account',
      title: 'Create a free account',
      highlight: true,
      body: 'It attaches your employer pricing, so you see school names and your real cost instead of list prices.',
    },
    {
      icon: 'confirm',
      title: 'Confirm your benefit',
      body: reimburses
        ? `${owner || 'Your employer'} decides eligibility and approves funding, not AllCampus. A free specialist call walks you through it first.`
        : trPossible
          ? 'If your employer offers tuition reimbursement, they decide eligibility and approvals. A free specialist call helps you check.'
          : 'A free specialist call confirms your pricing and next steps, with no obligation.',
      note: reimburses || trPossible ? PREAPPROVAL_RULE : null,
    },
    {
      icon: 'apply',
      title: 'Apply through AllCampus',
      body: 'The schools deliver your program; applying through AllCampus is what keeps your discount attached. Going straight to the school means standard tuition.',
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

        {/* Logged out: the journey to signup. Logged in: the account step is
            stale, so the slot explains the machine instead (the four-party
            strip, speaking to the specific partner situation). */}
        <h3 className="mt-10 font-display text-[16px] font-extrabold text-mk-slate">
          {joined ? 'How it works' : 'What you do, in order'}
        </h3>
        <div className="mt-4">
          {joined ? (
            <EcosystemStrip variant="landing" partner={partner} />
          ) : (
            <StepsStrip steps={steps} />
          )}
        </div>

        <p className="mt-4 font-display text-[12px] text-mk-body/70">
          Draft copy. Brigid&rsquo;s content doc is pending; the structure and steps follow her
          Quick Guide.
        </p>
      </div>
    </section>
  )
}
