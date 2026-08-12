import MkHeader from '../components/landing/MkHeader.jsx'
import EcosystemStrip from '../components/landing/EcosystemStrip.jsx'
import BenefitBlock from '../components/landing/BenefitBlock.jsx'
import AllyEntry from '../components/landing/AllyEntry.jsx'
import { Eyebrow, Heading, Body, MkButton } from '../components/landing/Section.jsx'
import { PROGRAMS, money } from '../data/model.js'
import { estimatedOutOfPocket } from '../data/benefit.js'
import { getSchool } from '../data/schools.js'

/*
 * School page (2026-08-11 meeting): same structural logic as the homepage,
 * scoped to a single school. The key gap it fixes: the AllCampus value
 * proposition was unclear at this level — users bounced to the school's own
 * site (e.g. SNHU) without understanding the discount AllCampus provides.
 * So the "why stay on this platform" block (EcosystemStrip, school variant)
 * sits BEFORE any outbound school link.
 */

export default function SchoolPage({ schoolId, partner, onNavigate }) {
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

  const programs = PROGRAMS.filter((p) => p.schoolId === school.id)
  const goBrowse = (params = {}) => {
    const qs = new URLSearchParams(params).toString()
    onNavigate(`/browse${qs ? `?${qs}` : ''}`)
  }

  return (
    <div className="min-h-screen bg-white">
      <MkHeader partner={partner} onNavigate={onNavigate} />

      {/* School hero, mirrors the live school-page pattern: slate band,
          white logo circle, heading, highlights, actions. */}
      <section className="bg-[linear-gradient(112deg,#26394a_0%,#33475b_60%,#3b5a70_100%)] py-14 text-white">
        <div className="mx-auto max-w-6xl px-5 font-display">
          <span
            className="flex h-16 w-16 items-center justify-center rounded-full bg-white text-[20px] font-black"
            style={{ color: school.logoColor }}
          >
            {school.logoMonogram}
          </span>
          <h1 className="mt-5 text-[34px] font-extrabold leading-tight sm:text-[42px]">
            {school.name}
          </h1>
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
        </div>
      </section>

      {/* WHY STAY: the value-prop moment, before any outbound school link */}
      <section className="mx-auto max-w-6xl px-5 pt-14">
        <Eyebrow>Before you head to {school.name.split(' ')[0]}&rsquo;s site</Eyebrow>
        <Heading size="sm" className="mb-5 mt-2">
          Your {school.name.split(' ')[0]} discount comes through AllCampus
        </Heading>
        <EcosystemStrip variant="school" schoolName={school.name} />
      </section>

      <BenefitBlock
        partner={partner}
        programs={programs.length ? programs : undefined}
        onSeeFullyCovered={() => goBrowse({ school: school.id, covered: 1 })}
        onCheckEmployer={() => goBrowse({ school: school.id })}
      />

      {/* School-scoped catalog preview */}
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
            placeholder={`Search ${school.name.split(' ')[0]} programs — e.g. nursing, welding…`}
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
                className="group rounded-xl border border-mk-line bg-white p-5 text-left transition hover:border-mk-teal-600 hover:shadow-[0_4px_16px_rgba(69,120,140,0.12)]"
              >
                <div className="font-display text-[12.5px] font-bold text-mk-teal-text">
                  {p.degreeLevel}
                </div>
                <div className="mt-1 font-display text-[16px] font-extrabold text-mk-slate">
                  {p.name}
                </div>
                {oop != null && (
                  <div className="mt-2 font-display text-[13px] text-mk-body">
                    Est. {oop === 0 ? 'fully covered by your benefit' : `${money(oop)} out of pocket/yr`}{' '}
                    <span className="text-mk-body/60">(estimate)</span>
                  </div>
                )}
                <div className="mt-2 font-display text-[13px] font-bold text-mk-teal-700">
                  See details →
                </div>
              </button>
            )
          })}
          {programs.length === 0 && (
            <Body>Catalog for this school is loading into the prototype.</Body>
          )}
        </div>
      </section>

      <AllyEntry partner={partner} />

      <footer className="bg-mk-slate py-8 text-center font-display text-xs text-white/60">
        AllCampus school-page prototype, throwaway spec with mock data. Not production.
      </footer>
    </div>
  )
}
