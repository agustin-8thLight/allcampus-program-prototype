import { useState } from 'react'
import MkHeader from '../components/landing/MkHeader.jsx'
import EcosystemStrip from '../components/landing/EcosystemStrip.jsx'
import StepsStrip from '../components/landing/StepsStrip.jsx'
import AllyEntry from '../components/landing/AllyEntry.jsx'
import SubjectIcon from '../components/landing/SubjectIcon.jsx'
import { Heading, Body, MkButton } from '../components/landing/Section.jsx'
import { PROGRAMS, money, resolveCost, startDateDisplay } from '../data/model.js'
import { estimatedOutOfPocket, bestDiscountPercent, discountLabel } from '../data/benefit.js'
import { getArea, getSkill } from '../data/taxonomy.js'
import { policyOwner } from '../data/corporatePartners.js'
import { getSchool } from '../data/schools.js'
import { schoolImage } from '../data/images.js'
import Img from '../components/Img.jsx'
import AllyOverlay from '../components/AllyOverlay.jsx'

/*
 * School page (2026-08-11 meeting): same structural logic as the homepage,
 * scoped to a single school. The key gap it fixes: the AllCampus value
 * proposition was unclear at this level: users bounced to the school's own
 * site (e.g. SNHU) without understanding the discount AllCampus provides.
 * So the "why stay on this platform" block (EcosystemStrip, school variant)
 * sits BEFORE any outbound school link.
 */

// `gated`: with the catalog behind login (Aug 14 decision), school pages must
// not leak the prices browse withholds. The school's own identity stays: the
// employer link that brought the visitor here already revealed it.
export default function SchoolPage({ schoolId, partner, joined = false, gated = false, onGate, onNavigate }) {
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

  // 2026-08-19 session: lead with the discount. The best percent across this
  // school's catalog is the headline, not a footnote.
  const bestPct = bestDiscountPercent(programs)

  // 2026-08-19 session: subjects replace the program grid as the logged-out
  // browse surface. Derive the areas this school actually covers, and within
  // each, the skills it covers with a program count per skill.
  const areaMenu = (() => {
    const byArea = new Map()
    for (const p of programs) {
      if (!p.areaId) continue
      if (!byArea.has(p.areaId)) byArea.set(p.areaId, new Map())
      const skills = byArea.get(p.areaId)
      for (const sid of p.skillIds || []) skills.set(sid, (skills.get(sid) || 0) + 1)
    }
    return [...byArea.entries()]
      .map(([areaId, skills]) => ({
        area: getArea(areaId),
        skills: [...skills.entries()]
          .map(([skillId, count]) => ({ skill: getSkill(skillId), count }))
          .filter((s) => s.skill),
      }))
      .filter((e) => e.area)
  })()

  // 2026-08-19 session: partner-aware "how it works for you" steps.
  // Draft copy; Brigid's content doc pending.
  const owner = policyOwner(partner) || 'Your employer'
  // Logged out: the journey to signup (illustrated strip). Logged in: the
  // account step is stale, so the same slot explains the machine instead
  // (the four-party strip, school variant) — 2026-08-20 direction.
  const howSteps = [
    {
      icon: 'find',
      title: 'Select a school and a program',
      body: `Browse ${firstWord}\u2019s subjects below. Nothing needs approving yet.`,
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
      body: `${owner} approves the funding, not AllCampus. A free specialist call helps.`,
    },
    {
      icon: 'apply',
      title: 'Connect through AllCampus',
      body: `${firstWord} then handles admissions, enrollment, billing, and your discounted tuition.`,
    },
  ]

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

      {/* HOW IT WORKS FOR YOU — moved up (8/25: school pages mirror the
          landing's order: hero -> How -> Ally -> programs on grey). */}
      <section className="bg-white py-16">
        <div className="mx-auto max-w-6xl px-5">
        {/* 2026-08-25 copy pass: the eyebrow and the dek both restated the
            heading. One heading is enough to open a section. */}
        <Heading>How it works for you</Heading>
        <div className="mt-8">
          {/* 2026-08-21 reset: the journey map AND the who-does-what boxes,
              both always visible. The big picture is the confidence builder. */}
          <StepsStrip steps={howSteps} />
          <div className="mt-8">
            <h3 className="font-display text-[15px] font-extrabold text-mk-slate">
              Who does what along the way
            </h3>
            <div className="mt-3">
              <EcosystemStrip variant="school" schoolName={school.name} partner={partner} />
            </div>
          </div>
        </div>
        </div>
      </section>

      <AllyEntry partner={partner} />

      {/* Programs region opens the grey ground, like the landing. */}
      <div className="border-t border-mk-line bg-mk-surface pb-10">
      {/* SUBJECTS MENU (2026-08-19 session): the visual browse surface that
          replaces the program grid for logged-out visitors. Areas the school
          covers, with skill chips that carry program counts and route into
          filtered browse. */}
      {areaMenu.length > 0 && (
        <section className="mx-auto max-w-6xl px-5 pt-14">
          <Heading size="sm">Programs by subject</Heading>
          {/* 2026-08-25 polish: at one or two skills per area these cards
              stretched to a shared row height and read as mostly empty. Three
              compact self-sizing columns instead, icon inline with the label. */}
          <div className="mt-5 grid grid-cols-1 items-start gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {areaMenu.map(({ area, skills }) => (
              <div
                key={area.id}
                className="rounded-[var(--radius-card)] border border-mk-line bg-white p-4 transition hover:border-mk-teal-600/50 hover:shadow-[0_4px_16px_rgba(69,120,140,0.10)]"
              >
                <div className="flex items-center gap-2.5">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-mk-band text-mk-teal-700">
                    <SubjectIcon id={area.id} className="h-5 w-5" />
                  </span>
                  <span className="font-display text-[15px] font-extrabold text-mk-slate">
                    {area.label}
                  </span>
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  {skills.map(({ skill, count }) => (
                    <button
                      key={skill.id}
                      type="button"
                      onClick={() => onNavigate(`/browse?school=${school.id}&skill=${skill.id}`)}
                      className="inline-flex items-center gap-1.5 rounded-full border border-mk-line bg-mk-surface px-3 py-1.5 font-display text-[13px] font-semibold text-mk-slate transition hover:border-mk-teal-600 hover:bg-white hover:text-mk-teal-700"
                    >
                      {skill.label}
                      <span className="font-bold text-mk-teal-700">{count}</span>
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 2026-08-19 session: logged out, NO program grid. The grid is where
          leakage happens; the subjects menu above is the browse surface, and
          this compact tease routes to the gated browse teaser instead. */}
      {gated ? (
        <section className="mx-auto max-w-6xl px-5 pt-16">
          <div className="rounded-[var(--radius-card)] border border-mk-line bg-white p-6 font-display shadow-[0_2px_10px_rgba(51,71,91,0.05)]">
            <p className="text-[18px] font-extrabold text-mk-slate">
              {programs.length} program{programs.length === 1 ? '' : 's'} at {firstWord}
              {bestPct != null && (
                <span className="text-mk-green-700"> · {discountLabel(programs)}</span>
              )}
            </p>
            <p className="mt-1.5 text-[14.5px] text-mk-body">
              Save your profile with a free account to see every program and your price.
            </p>
            <MkButton
              tone="teal"
              className="mt-4"
              onClick={() => goBrowse({ school: school.id })}
            >
              See all {programs.length} programs
            </MkButton>
          </div>
        </section>
      ) : (
      /* School-scoped catalog preview (logged in only) */
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
                  {gated ? (
                    <span className="mt-1.5 block font-display text-[13px] font-semibold text-mk-body/70">
                      Log in to see your price
                    </span>
                  ) : (
                    <>
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
                    </>
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
      )}
      </div>

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
