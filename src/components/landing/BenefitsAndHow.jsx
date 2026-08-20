import { Eyebrow, Heading, Body } from './Section.jsx'
import StepsStrip from './StepsStrip.jsx'
import EcosystemStrip from './EcosystemStrip.jsx'
import { PROGRAMS, money } from '../../data/model.js'
import { SCHOOLS } from '../../data/schools.js'
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
 * COPY OF RECORD: Brigid's landing-page content doc (2026-08-20) supplies the
 * WHY ALLCAMPUS headline (Version A for TR audiences, Version B general), the
 * AllCampus activation line, and the connect/select verbs. Her strings are
 * quoted verbatim, em dashes included. Counts and dollars are mock.
 */
export default function BenefitsAndHow({ partner, joined = false, onGate }) {
  const maxPct = bestDiscountPercent(PROGRAMS)
  const schoolCount = Object.keys(SCHOOLS).length
  const reimburses = partner?.benefitKnown && (partner?.employerReimbursement ?? 0) > 0
  // 'perks' = Brigid's Benefit Partner No TR: definitely no reimbursement.
  // Only a truly unknown employer gets the "may be available" framing.
  const noTr = !reimburses && (partner?.partnerType === 'perks' || partner?.partnerType === 'direct-no-tr' || (partner?.benefitKnown && !reimburses))
  const trPossible = !reimburses && !noTr
  const owner = policyOwner(partner)

  // The who-does-what facts now live INSIDE the step copy — the four-party
  // strip is retired (2026-08-20: one diagram, not two) and the journey
  // carries its content.
  const steps = [
    {
      icon: 'find',
      title: 'Select a school and a program',
      body: 'Search or browse by subject or outcome. Nothing needs approving at this stage, and you are not committing to anything.',
    },
    {
      icon: 'account',
      title: 'Create a free account',
      highlight: true,
      body: 'It attaches your employer pricing, so you see school names and your real cost instead of list prices.',
      cta: { label: 'Create a free account', onClick: () => onGate?.('catalog') },
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
      title: 'Connect with a school through AllCampus',
      body: 'Once you’ve connected through AllCampus, the school handles admissions, enrollment, billing, and your discounted tuition. Going straight to the school means standard tuition.',
    },
  ]

  return (
    <section className="bg-white py-16">
      <div className="mx-auto max-w-6xl px-5">
        {/* Brigid's WHY ALLCAMPUS headline (content doc, 2026-08-20), Version
            A for TR audiences / Version B general — her structure, our mock
            counts (her doc's 50+/1,200+ are production figures). */}
        <Eyebrow>Why AllCampus</Eyebrow>
        <Heading className="mt-2">
          {schoolCount} schools. {PROGRAMS.length} programs.{' '}
          {reimburses ? 'Discounts already negotiated.' : `Up to ${maxPct}% off tuition.`}
        </Heading>
        <Body className="mt-2 max-w-2xl">
          {reimburses
            ? `And at select schools, your out-of-pocket cost is $0 — tuition capped to match ${/^your /i.test(partner.name) ? 'your employer benefit' : `your ${partner.name} benefit`}.`
            : 'At select schools, you’ll never pay more than $5,250 a year.'}
        </Body>

        {/* The two big benefits */}
        <div className="mt-7 grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="rounded-[var(--radius-card)] border border-mk-line bg-white p-6 shadow-[0_2px_10px_rgba(51,71,91,0.05)]">
            <p className="font-display text-[11.5px] font-bold uppercase tracking-[0.14em] text-mk-teal-text">
              For everyone
            </p>
            <p className="mt-2 font-display text-[21px] font-extrabold leading-snug text-mk-slate">
              {maxPct != null ? `Up to ${maxPct}% off tuition` : 'Exclusive tuition discounts'}
            </p>
            <p className="mt-2 font-display text-[14px] leading-relaxed text-mk-body">
              AllCampus already secured your discount — it&rsquo;s just waiting to be activated.
              Connect with a school through AllCampus to make that happen.
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
          Headline, boxes, and key lines are from Brigid&rsquo;s content doc (2026-08-20). Counts
          and dollar figures are mock.
        </p>
      </div>
    </section>
  )
}
