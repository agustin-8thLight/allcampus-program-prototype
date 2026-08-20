import { useState } from 'react'
import MkHeader from '../components/landing/MkHeader.jsx'
import EcosystemStrip from '../components/landing/EcosystemStrip.jsx'
import AllyEntry from '../components/landing/AllyEntry.jsx'
import SubjectIcon from '../components/landing/SubjectIcon.jsx'
import { Eyebrow, Heading, Body, MkButton } from '../components/landing/Section.jsx'
import { PROGRAMS, money, resolveCost, startDateDisplay } from '../data/model.js'
import { estimatedOutOfPocket, bestDiscountPercent } from '../data/benefit.js'
import { getArea, getSkill } from '../data/taxonomy.js'
import { policyOwner, PREAPPROVAL_RULE } from '../data/corporatePartners.js'
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
export default function SchoolPage({ schoolId, partner, gated = false, onNavigate }) {
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
  const howSteps = [
    {
      title: 'Find a qualifying program',
      body: `Browse ${firstWord}'s subjects above. Nothing needs approving at this stage.`,
    },
    {
      title: 'Create a free account',
      body: 'It attaches your employer pricing, so you see your real cost instead of list prices.',
    },
    {
      title: 'Confirm your benefit',
      body: `${owner} decides eligibility and approves funding. ${PREAPPROVAL_RULE}`,
    },
    {
      title: 'Apply through AllCampus',
      body: `Applying through AllCampus keeps your discount attached; going straight to ${firstWord} means standard tuition.`,
    },
  ]

  const goBrowse = (params = {}) => {
    const qs = new URLSearchParams(params).toString()
    onNavigate(`/browse${qs ? `?${qs}` : ''}`)
  }

  return (
    <div className="min-h-screen bg-white">
      <MkHeader partner={partner} onNavigate={onNavigate} />

      {/* School hero, mirrors the live school-page pattern: slate band,
          white logo circle, heading, highlights, actions. */}
      <section className="relative py-14 text-white">
        <Img
          src={schoolImage(school.id)}
          alt=""
          hue={206}
          rounded=""
          eager
          position="absolute"
          className="inset-0 h-full w-full"
          overlay="bg-[linear-gradient(112deg,rgba(38,57,74,0.93)_0%,rgba(51,71,91,0.85)_60%,rgba(59,90,112,0.70)_100%)]"
        />
        <div className="relative mx-auto max-w-6xl px-5 font-display">
          <span
            className="flex h-16 w-16 items-center justify-center rounded-full bg-white text-[20px] font-black"
            style={{ color: school.logoColor }}
          >
            {school.logoMonogram}
          </span>
          {/* 2026-08-19 session: the page led with the school and buried the
              discount. Client direction was the opposite: "20% off at
              Franklin" is the reason this page exists, so it goes first. */}
          {bestPct != null && (
            <div className="mt-6">
              <p className="text-[12.5px] font-bold uppercase tracking-[0.14em] text-white/70">
                AllCampus partner pricing
              </p>
              <h1 className="mt-1.5 text-[34px] font-black leading-tight sm:text-[44px]">
                Up to {bestPct}% off tuition at {school.name}
              </h1>
            </div>
          )}
          {bestPct != null ? (
            <p className="mt-4 text-[20px] font-extrabold leading-tight sm:text-[24px]">
              {school.name}
            </p>
          ) : (
            <h1 className="mt-5 text-[34px] font-extrabold leading-tight sm:text-[42px]">
              {school.name}
            </h1>
          )}
          <p className="mt-2 max-w-2xl text-[15.5px] leading-relaxed text-white/85">
            {school.about}
          </p>
          <ul className="mt-4 space-y-1 text-[14.5px] text-white/90">
            {school.highlights.map((h) => (
              <li key={h}>• {h}</li>
            ))}
          </ul>
          <div className="mt-6 flex flex-wrap gap-3">
            <MkButton tone="green" onClick={() => goBrowse({ school: school.id })}>
              View {school.name.split(' ')[0]} programs
            </MkButton>
            <MkButton tone="ghostLight" onClick={() => goBrowse({})}>
              Explore all programs
            </MkButton>
          </div>

          {/* Compact benefit banner: the landing module's promise, in one line,
              at the moment a channel visitor arrives. */}
          <div className="mt-7 flex flex-col gap-3 rounded-xl border border-white/25 bg-white/10 p-4 backdrop-blur-sm sm:flex-row sm:items-center sm:justify-between">
            <p className="text-[14.5px] leading-relaxed text-white/95">
              {benefitKnown ? (
                <>
                  Your <strong>{partner.name}</strong> benefit, up to{' '}
                  <strong>{money(partner.employerReimbursement)}/year</strong>, applies at{' '}
                  {school.name.split(' ')[0]}.{' '}
                  <span className="text-white/70">Estimate; confirm with your benefits administrator.</span>
                </>
              ) : (
                <>
                  Every {school.name.split(' ')[0]} program here carries AllCampus partner pricing.{' '}
                  <span className="text-white/70">No employer benefit required.</span>
                </>
              )}
            </p>
            <button
              type="button"
              onClick={() => setAllyOpen(true)}
              className="shrink-0 rounded-lg bg-mk-purple px-4 py-2.5 text-[14px] font-bold text-white transition hover:opacity-90"
            >
              {benefitKnown ? 'See what you’d pay ✦' : 'Ask Ally about costs ✦'}
            </button>
          </div>
        </div>
      </section>

      {/* SUBJECTS MENU (2026-08-19 session): the visual browse surface that
          replaces the program grid for logged-out visitors. Areas the school
          covers, with skill chips that carry program counts and route into
          filtered browse. */}
      {areaMenu.length > 0 && (
        <section className="mx-auto max-w-6xl px-5 pt-14">
          <Eyebrow>What you can study here</Eyebrow>
          <Heading size="sm" className="mt-2">
            Programs by subject
          </Heading>
          <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
            {areaMenu.map(({ area, skills }) => (
              <div
                key={area.id}
                className="rounded-[var(--radius-card)] border border-mk-line bg-white p-5"
              >
                <div className="flex items-center gap-3">
                  <SubjectIcon id={area.id} className="h-7 w-7 shrink-0 text-mk-teal-700" />
                  <span className="font-display text-[16px] font-extrabold text-mk-slate">
                    {area.label}
                  </span>
                </div>
                <div className="mt-3.5 flex flex-wrap gap-2">
                  {skills.map(({ skill, count }) => (
                    <button
                      key={skill.id}
                      type="button"
                      onClick={() => onNavigate(`/browse?school=${school.id}&skill=${skill.id}`)}
                      className="inline-flex items-center gap-1.5 rounded-full border border-mk-line bg-mk-band px-3.5 py-1.5 font-display text-[13.5px] font-semibold text-mk-slate transition hover:border-mk-teal-600 hover:text-mk-teal-700"
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

      {/* HOW IT WORKS FOR YOU (2026-08-19 session): the benefit mechanics as
          four partner-aware steps, replacing the BenefitBlock module. */}
      <section className="mx-auto max-w-6xl px-5 pt-16">
        <Eyebrow>Your path from here</Eyebrow>
        <Heading size="sm" className="mt-2">
          How it works for you
        </Heading>
        <ol className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {howSteps.map((step, i) => (
            <li key={step.title} className="flex gap-3.5">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-mk-blue-50 font-display text-[14px] font-black text-mk-teal-700 ring-1 ring-mk-blue-200">
                {i + 1}
              </span>
              <span>
                <span className="block font-display text-[15px] font-extrabold text-mk-slate">
                  {step.title}
                </span>
                <span className="mt-1 block font-display text-[13.5px] leading-relaxed text-mk-body">
                  {step.body}
                </span>
              </span>
            </li>
          ))}
        </ol>
        <p className="mt-5 font-display text-[12px] text-mk-body/60">
          Draft copy. Brigid's content doc pending.
        </p>
      </section>

      {/* WHY STAY: the value-prop moment, before any outbound school link */}
      <section className="mx-auto max-w-6xl px-5 pt-14">
        <Eyebrow>Before you head to {school.name.split(' ')[0]}&rsquo;s site</Eyebrow>
        <Heading size="sm" className="mb-5 mt-2">
          Your {school.name.split(' ')[0]} discount comes through AllCampus
        </Heading>
        <EcosystemStrip variant="school" schoolName={school.name} partner={partner} />
      </section>

      {/* 2026-08-19 session: logged out, NO program grid. The grid is where
          leakage happens; the subjects menu above is the browse surface, and
          this compact tease routes to the gated browse teaser instead. */}
      {gated ? (
        <section className="mx-auto max-w-6xl px-5 pt-16">
          <div className="rounded-[var(--radius-card)] border border-mk-line bg-mk-band p-6 font-display">
            <p className="text-[18px] font-extrabold text-mk-slate">
              {programs.length} program{programs.length === 1 ? '' : 's'} at {firstWord}
              {bestPct != null && (
                <span className="text-mk-green-700"> · up to {bestPct}% off</span>
              )}
            </p>
            <p className="mt-1.5 text-[14.5px] text-mk-body">
              Create a free account to see every program and your price.
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
        <Eyebrow>Programs at {school.name.split(' ')[0]}</Eyebrow>
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
        <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
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

      <AllyEntry partner={partner} />

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
