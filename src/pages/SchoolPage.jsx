import { useState } from 'react'
import MkHeader from '../components/landing/MkHeader.jsx'
import JourneySteps from '../components/landing/JourneySteps.jsx'
import AllyEntry from '../components/landing/AllyEntry.jsx'
import { Eyebrow, Heading, Body, MkButton } from '../components/landing/Section.jsx'
import { PROGRAMS, money, resolveCost, startDateDisplay } from '../data/model.js'
import { estimatedOutOfPocket, bestDiscountPercent, discountLabel } from '../data/benefit.js'
import { partnerState } from '../components/landing/BenefitsAndHow.jsx'
import { hasBenefitAdmin } from '../data/corporatePartners.js'
import { ALLCAMPUS_BASE, ALLCAMPUS_SEQUENCING, SCHOOLS_BOX } from '../data/landingCopy.js'
import { getSchool } from '../data/schools.js'
import { schoolImage } from '../data/images.js'
import Img from '../components/Img.jsx'
import AllyOverlay from '../components/AllyOverlay.jsx'

/*
 * School page (2026-08-11 meeting): same structural logic as the homepage,
 * scoped to a single school. The key gap it fixes: the AllCampus value
 * proposition was unclear at this level: users bounced to the school's own
 * site (e.g. SNHU) without understanding the discount AllCampus provides.
 * So the "why stay on this platform" banner sits BEFORE any outbound school
 * link. (2026-08-27: EcosystemStrip retired here with James's merge; the
 * banner's copy moved inline.)
 */

export default function SchoolPage({ schoolId, partner, joined = false, onGate, onNavigate }) {
  const school = getSchool(schoolId)
  if (!school) {
    return (
      <div className="p-10 font-display text-mk-body">
        Unknown school.{' '}
        <button className="font-bold text-mk-teal-700 underline" onClick={() => onNavigate('/')}>
          Back to home
        </button>
      </div>
    )
  }

  const [allyOpen, setAllyOpen] = useState(false)
  const benefitKnown = partner?.benefitKnown && (partner?.employerReimbursement ?? 0) > 0
  const programs = PROGRAMS.filter((p) => p.schoolId === school.id)
  const firstWord = school.name.split(' ')[0]

  /*
   * CHANNEL ARRIVAL (2026-08-28 client review: Brigid, James, Terrence).
   *
   * James asked Brigid outright whether benefit-partner traffic always lands
   * on a school page — "Brigid, is EdAssist, are they always landing on a
   * school page? Is that right?" — and her answer was yes. That makes THIS
   * page the first screen for the 70-80% of traffic that arrives via a work
   * intranet, then a benefit administrator (EdAssist, Tuition.io,
   * BenefitHub), then us. The page was written for someone who came from the
   * landing page and already knew what AllCampus is. Those users didn't.
   *
   * Brigid on why they are the hard case: "they've already been through their
   * work portal to a benefit partner, to us, and they've lost connection
   * along the way about who does what or what does what or what qualifies for
   * what... although they're the highest intent... they're the most confused."
   *
   * Two failures this fixes.
   *
   * IDENTITY. James: "I used to talk to people when I was on the phones that
   * always thought I was EdAssist and didn't realize that I wasn't EdAssist.
   * They thought the platform was still EdAssist's website because we
   * co-brand with them." MkHeader's co-brand lockup makes that worse, not
   * better, so the administrator is named in words and separated from us in
   * the same sentence.
   *
   * LEAKAGE. Brigid's worked example: "I see that there's a 25% discount at
   * [X] University — I could Google search them, get more information about
   * the school and the program, and request information from them," and the
   * lead never reaches AllCampus. James: "that's all lost revenue." The
   * agreed counter-message is "Activate your discount through AllCampus" —
   * his gloss: "it's just telling them, 'You got to go through us to get this
   * going.'"
   *
   * SHORT ON PURPOSE. A confused arrival gets three rows and one sentence,
   * not a second copy of the journey. The full per-type boxes stay in
   * JourneySteps below; this only has to answer "who are you and why am I
   * here" before the reader scrolls.
   *
   * CONDITIONAL. Only partners with a benefit administrator (Brigid's
   * "Benefit Partner with TR" type, her 4-box case) see it. Direct partners
   * have no fourth party to disambiguate and keep the page they had.
   */
  const admin = hasBenefitAdmin(partner) ? partner.benefitAdmin : null
  const { reimburses, noTr } = partnerState(partner)
  // Mock admin records use a generic lowercase name ("your benefit
  // administrator") because the review dropdown shows Brigid's type titles,
  // not companies. Fine mid-sentence, reads as a typo as a card label.
  const adminLabel = admin ? admin.name.charAt(0).toUpperCase() + admin.name.slice(1) : null

  /*
   * What kind of company AllCampus is, in one sentence — James's note 3 from
   * 2026-08-27, reused verbatim from WhyAllCampus so the two surfaces cannot
   * drift. It renders exactly once per page: inside the arrival card when
   * there is an administrator to be told apart from, under "How AllCampus
   * works" otherwise. Every visitor to this page gets it either way, which
   * was not true before 2026-08-28.
   *
   * The noTr / reimburses branches are the honesty guard: said to a partner
   * with no reimbursement program, the "tuition benefit partner" wording
   * promises money that does not exist.
   */
  const possessive =
    partner?.benefitKnown && !/^your /i.test(partner.name || '')
      ? `${partner.name}’s`
      : 'your employer’s'
  const identityLine = (
    <>
      <strong className="font-extrabold text-mk-slate">
        AllCampus is {possessive} {noTr ? 'discount network partner' : 'tuition benefit partner'}
      </strong>{' '}
      &mdash;{' '}
      {noTr
        ? 'built to reduce the cost of tuition for you.'
        : reimburses
          ? 'built to help you use your discount and your reimbursement without the runaround.'
          : 'built to help you use your discount, guaranteed for everyone, and your reimbursement if your role qualifies.'}
    </>
  )

  // Three parties, three jobs. The administrator row never mentions money
  // unless `reimburses` is true — see the partnerState note in
  // BenefitsAndHow.jsx for why 'perks' and 'direct-no-tr' are the only
  // definitely-no types.
  const parties = admin
    ? [
        {
          role: 'Your benefit',
          name: adminLabel,
          does: reimburses
            ? 'Decides who qualifies, runs pre-approval, and pays the reimbursement.'
            : 'Decides who qualifies and runs pre-approval.',
        },
        {
          role: 'Your discount',
          name: 'AllCampus',
          does: 'Holds the negotiated discount and connects you to the school.',
          on: true,
        },
        {
          role: 'Your degree',
          name: school.name,
          // Brigid's In-Network Schools box, verbatim. Her doc: reused
          // verbatim everywhere.
          does: SCHOOLS_BOX,
        },
      ]
    : []

  // 2026-08-19 session: lead with the discount. The best percent across this
  // school's catalog is the headline, not a footnote.
  const bestPct = bestDiscountPercent(programs)

  const goBrowse = (params = {}) => {
    const qs = new URLSearchParams(params).toString()
    onNavigate(`/browse${qs ? `?${qs}` : ''}`)
  }

  return (
    <div className="min-h-screen bg-white">
      <MkHeader partner={partner} onNavigate={onNavigate} joined={joined} onGate={onGate} />

      {/* School hero (2026-08-25 polish): was eight stacked text blocks in a
          single column. Now two columns — the discount claim and the actions
          on the left, the school's own identity as a facts card on the right,
          so the photograph has room to read as a photograph. */}
      <section className="relative py-16 text-white">
        <Img
          src={schoolImage(school.id)}
          alt=""
          hue={206}
          rounded=""
          eager
          position="absolute"
          className="inset-0 h-full w-full"
          overlay="bg-[linear-gradient(104deg,rgba(26,40,52,0.94)_0%,rgba(33,52,68,0.86)_40%,rgba(51,71,91,0.55)_72%,rgba(69,120,140,0.32)_100%)]"
        />
        <div className="relative mx-auto max-w-6xl px-5 font-display">
          <div className="grid grid-cols-1 items-start gap-10 lg:grid-cols-[minmax(0,1.25fr)_minmax(0,1fr)]">
            {/* LEFT: why this page exists. */}
            <div>
              {/* 2026-08-19 session: the page led with the school and buried the
                  discount. Client direction was the opposite: "20% off at
                  Franklin" is the reason this page exists, so it goes first. */}
              {bestPct != null ? (
                <>
                  <p className="text-[12.5px] font-bold uppercase tracking-[0.14em] text-white/70">
                    AllCampus partner pricing
                  </p>
                  <h1 className="mt-2 text-[34px] font-black leading-tight sm:text-[46px]">
                    {discountLabel(programs)} tuition at {school.name}
                  </h1>
                  {/* 8/21 meeting: "connect through AllCampus to activate your
                      discount" as the bolded next step, everywhere. */}
                  <p className="mt-3 max-w-lg text-[15.5px] font-extrabold leading-relaxed text-white">
                    The discount already exists. Connect through AllCampus to activate it.
                  </p>
                </>
              ) : (
                <h1 className="text-[34px] font-extrabold leading-tight sm:text-[42px]">
                  {school.name}
                </h1>
              )}
              <div className="mt-7 flex flex-wrap gap-3">
                <MkButton tone="green" onClick={() => goBrowse({ school: school.id })}>
                  View {firstWord} programs
                </MkButton>
                <MkButton tone="ghostLight" onClick={() => goBrowse({})}>
                  Explore all programs
                </MkButton>
              </div>
            </div>

            {/* RIGHT: the school's own identity, as a card rather than four
                more lines of white text on a photo. */}
            <div className="rounded-2xl bg-white/95 p-6 text-mk-slate shadow-[0_14px_40px_rgba(0,0,0,0.28)] backdrop-blur-sm">
              <div className="flex items-center gap-3.5">
                <span
                  className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full text-[18px] font-black text-white"
                  style={{ background: school.logoColor }}
                >
                  {school.logoMonogram}
                </span>
                <span className="min-w-0">
                  <span className="block text-[11px] font-bold uppercase tracking-[0.14em] text-mk-body/60">
                    About the school
                  </span>
                  <span className="mt-0.5 block text-[19px] font-extrabold leading-snug">
                    {school.name}
                  </span>
                </span>
              </div>
              <p className="mt-4 text-[14px] leading-relaxed text-mk-body">{school.about}</p>
              <ul className="mt-4 flex flex-wrap gap-2">
                {school.highlights.map((h) => (
                  <li
                    key={h}
                    className="rounded-full border border-mk-line bg-mk-band px-3 py-1.5 text-[12.5px] font-semibold text-mk-slate"
                  >
                    {h}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Compact benefit banner: the landing module's promise, in one line,
              at the moment a channel visitor arrives. */}
          <div className="mt-8 flex flex-col gap-3 rounded-xl border border-white/25 bg-white/10 p-4 backdrop-blur-sm sm:flex-row sm:items-center sm:justify-between">
            <p className="text-[14.5px] leading-relaxed text-white/95">
              {benefitKnown ? (
                <>
                  Your <strong>{/^your /i.test(partner.name) ? 'employer' : partner.name}</strong> benefit, up to{' '}
                  <strong>{money(partner.employerReimbursement)}/year</strong>, applies at{' '}
                  {firstWord}.{' '}
                  <span className="text-white/70">Estimate; confirm with your benefits administrator.</span>
                </>
              ) : (
                <>
                  Every {firstWord} program here carries AllCampus partner pricing.{' '}
                  <span className="text-white/70">No employer benefit required.</span>
                </>
              )}
            </p>
            <button
              type="button"
              onClick={() => setAllyOpen(true)}
              className="shrink-0 rounded-lg bg-mk-purple px-4 py-2.5 text-[14px] font-bold text-white transition hover:opacity-90"
            >
              {benefitKnown ? 'See what you\u2019d pay \u2726' : 'Ask Ally about costs \u2726'}
            </button>
          </div>
        </div>
      </section>

      {/* Channel-arrival card — see the CHANNEL ARRIVAL note above for the
          review record behind it. It sits directly under the hero because it
          is orientation, not explanation: it has to land before the reader
          decides whether this page is their benefit portal, their school, or
          neither. */}
      {admin && (
        <section className="border-b border-mk-line bg-mk-surface py-10">
          <div className="mx-auto max-w-6xl px-5">
            <div className="rounded-[var(--radius-card)] border border-mk-line bg-white p-6 font-display sm:p-8">
              <Eyebrow>Who does what</Eyebrow>
              <Heading size="sm" className="mt-2 max-w-3xl">
                Your tuition benefit is administered by {admin.name}, not by AllCampus.
              </Heading>
              <Body className="mt-2 max-w-3xl">{identityLine}</Body>

              {/* Three rows on mobile, three columns from 640px. The rule
                  above each name is the only weight change: teal on the
                  AllCampus row, hairline on the other two, so the party the
                  reader has to act with reads first without a second card
                  treatment. */}
              <div className="mt-7 grid grid-cols-1 items-start gap-5 sm:grid-cols-3 sm:gap-6">
                {parties.map((p) => (
                  <div
                    key={p.name}
                    className={`border-t-2 pt-3 ${p.on ? 'border-mk-teal-600' : 'border-mk-line'}`}
                  >
                    <p
                      className={`text-mk-caption font-bold uppercase tracking-[0.14em] ${
                        p.on ? 'text-mk-teal-text' : 'text-mk-body/70'
                      }`}
                    >
                      {p.role}
                    </p>
                    <p className="mt-1 text-mk-cardtitle font-extrabold leading-snug text-mk-slate">
                      {p.name}
                    </p>
                    <p className="mt-1.5 text-mk-meta leading-relaxed text-mk-body">{p.does}</p>
                  </div>
                ))}
              </div>

              {/* The activation line, James's words as the label.
                  ALLCAMPUS_BASE is deliberately NOT repeated here: the journey
                  strip one screen down already carries it (JourneySteps step
                  02), and saying "AllCampus already secured your discount"
                  twice on the same page blunts the one sentence the
                  2026-08-28 review wants to land. What a channel arrival does
                  not already know is the ORDER, so the sequencing clause
                  carries this block on its own. Her rule still holds: the
                  clause appears only when there is a reimbursement process to
                  sequence against, so a no-reimbursement learner is never told
                  to start here for a pre-approval they will never file. */}
              <div className="mt-7 flex flex-col gap-4 border-t border-mk-line pt-6 sm:flex-row sm:items-center sm:justify-between">
                <div className="min-w-0">
                  <Eyebrow>Activate your discount through AllCampus</Eyebrow>
                  <Body className="mt-1.5 max-w-2xl">
                    {reimburses
                      ? `Connecting through AllCampus is what activates it.${ALLCAMPUS_SEQUENCING}`
                      : 'Connecting through AllCampus is what activates it.'}
                  </Body>
                </div>
                <MkButton
                  tone="teal"
                  className="shrink-0"
                  onClick={() => goBrowse({ school: school.id })}
                >
                  View {firstWord} programs
                </MkButton>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 2026-08-27, James's merge applied here too: this page ran the same
          two redundant explainers (a step strip AND the who-does-what rail).
          Now one journey, with the driver inside each sentence. The
          discount-lives-here banner stays, and stays BEFORE any outbound
          school link — that placement is the anti-bounce fix. */}
      <section className="bg-white py-16">
        <div className="mx-auto max-w-6xl px-5">
          <Eyebrow>How AllCampus works</Eyebrow>
          <Heading className="mt-2 max-w-2xl">
            Your path at {firstWord}, guided support, start to finish
          </Heading>

          {/* 2026-08-28 review: nothing on this page said what kind of
              company AllCampus is. The landing page carries that sentence and
              this page assumed the reader had already read it, which is wrong
              for the majority of traffic — most of it arrives here first, not
              there. Rendered here only when the arrival card above is absent,
              so it appears exactly once. */}
          {!admin && <Body className="mt-3 max-w-2xl">{identityLine}</Body>}

          <div className="mt-6 rounded-xl border border-mk-teal-600/30 bg-mk-band px-5 py-4 font-display">
            <p className="text-[15px] font-bold text-mk-slate">
              Your discount lives here, not on {school.name}&rsquo;s site.
            </p>
            <p className="mt-1 text-[14px] leading-relaxed text-mk-body">
              Going directly to {school.name} means paying their standard tuition.
            </p>
          </div>

          <div className="mt-8">
            <JourneySteps partner={partner} bare />
          </div>
        </div>
      </section>

      {/* Programs region opens the grey ground, like the landing. */}
      <div className="border-t border-mk-line bg-mk-surface pb-10">
      {/* Every program, with its price. Nothing is held back for an
          account (2026-08-25: one prototype, no gates). */}

      <section className="mx-auto max-w-6xl px-5 pt-16">
        {/* Search-within-school (recommendation: the school page is browsable;
            a miss routes to the honest empty state + Ally handoff). */}
        <form
          className="mt-4 flex max-w-xl items-center gap-2"
          onSubmit={(e) => {
            e.preventDefault()
            const q = new FormData(e.currentTarget).get('q')?.toString().trim()
            if (q) onNavigate(`/browse?school=${school.id}&q=${encodeURIComponent(q)}`)
          }}
        >
          <input
            name="q"
            placeholder={`Search ${school.name.split(' ')[0]} programs, e.g. nursing, welding…`}
            className="min-w-0 flex-1 rounded-lg border border-mk-line bg-white px-4 py-2.5 text-[15px] text-mk-slate outline-none placeholder:text-mk-body/60 focus:border-mk-teal-600"
          />
          <button
            type="submit"
            className="rounded-lg bg-mk-green-600 px-5 py-2.5 text-[15px] font-bold text-white transition hover:bg-mk-green-700"
          >
            Search
          </button>
        </form>
        <Heading size="sm" className="mt-2">
          {programs.length} program{programs.length === 1 ? '' : 's'} in the AllCampus network
        </Heading>
        <div className="mt-5 grid grid-cols-1 items-start gap-4 sm:grid-cols-2">
          {programs.map((p) => {
            const oop = partner?.benefitKnown ? estimatedOutOfPocket(p, partner) : null
            return (
              <button
                key={p.id}
                type="button"
                onClick={() => goBrowse({ school: school.id, program: p.id })}
                className="group flex gap-4 overflow-hidden rounded-xl border border-mk-line bg-white p-4 text-left transition hover:border-mk-teal-600 hover:shadow-[0_4px_16px_rgba(69,120,140,0.12)]"
              >
                <Img
                  src={p.programImageUrl}
                  alt=""
                  hue={p.programImageHue}
                  className="h-28 w-32 shrink-0 sm:w-40"
                />
                <span className="min-w-0 flex-1">
                  <span className="block font-display text-[12.5px] font-bold text-mk-teal-text">
                    {p.degreeLevel} · {p.duration}
                  </span>
                  <span className="mt-1 block font-display text-[16px] font-extrabold leading-snug text-mk-slate">
                    {p.name}
                  </span>
                  <span className="mt-1.5 block font-display text-[13.5px] font-bold text-mk-slate">
                        {resolveCost(p).primaryValue}{' '}
                        <span className="font-semibold text-mk-body">
                          {resolveCost(p).primaryLabel === 'Per credit' ? 'per credit' : 'total'}
                        </span>
                      </span>
                      {oop != null && (
                        <span className="mt-0.5 block font-display text-[13px] font-bold text-mk-green-700">
                          {oop === 0
                            ? 'Fully covered by your benefit (est.)'
                            : `Est. ${money(oop)} out of pocket/yr`}
                        </span>
                      )}
                  <span className="mt-1.5 block font-display text-[12.5px] text-mk-body">
                    Starts {startDateDisplay(p) || 'soon'}
                  </span>
                </span>
              </button>
            )
          })}
          {programs.length === 0 && (
            <Body>Catalog for this school is loading into the prototype.</Body>
          )}
        </div>
      </section>
      </div>

      <AllyEntry partner={partner} />

      {/* Dark CTA bookend, mirroring the landing close. */}
      <section className="bg-gradient-to-br from-mk-teal-600 to-mk-slate py-14 text-center">
        <Heading size="sm" className="text-white">
          Your {firstWord} discount is already yours
        </Heading>
        <p className="mx-auto mt-2 max-w-md px-5 font-display text-[14px] text-white/80">
          Connect through AllCampus to activate it.
        </p>
        <div className="mt-5">
          <button
            type="button"
            onClick={() => goBrowse({ school: school.id })}
            className="inline-flex items-center justify-center rounded-md bg-white px-6 py-2.5 font-display text-[14px] font-bold text-mk-teal-700 shadow-[0_8px_20px_rgba(0,0,0,0.18)] transition hover:bg-mk-band"
          >
            See all {programs.length} programs
          </button>
        </div>
      </section>

      <AllyOverlay
        open={allyOpen}
        partner={partner}
        seedQuestionId="oop"
        onClose={() => setAllyOpen(false)}
      />

      <footer className="bg-mk-slate py-8 text-center font-display text-xs text-white/60">
        AllCampus school-page prototype, throwaway spec with mock data. Not production.
      </footer>
    </div>
  )
}
