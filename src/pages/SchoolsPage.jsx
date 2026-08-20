import MkHeader from '../components/landing/MkHeader.jsx'
import { Eyebrow, Heading, Body } from '../components/landing/Section.jsx'
import { SCHOOLS } from '../data/schools.js'
import { PROGRAMS } from '../data/model.js'
import { bestDiscountPercent } from '../data/benefit.js'

/*
 * Schools directory (#/schools, 2026-08-20): every in-network university,
 * with program count and the discount as tags. Per the Aug 14 notes, school
 * NAMES on a browseable page are fine and the AllCampus-exclusive discount
 * shown on a school tile is "a differentiator, not a giveaway" ("AllCampus
 * discount available through partnership with Clemson"). Program names and
 * prices stay behind the login, as everywhere.
 *
 * Linked from the homepage schools block.
 */
export default function SchoolsPage({ partner, onNavigate }) {
  const schools = Object.values(SCHOOLS).map((s) => {
    const programs = PROGRAMS.filter((p) => p.schoolId === s.id)
    return { ...s, programCount: programs.length, bestPct: bestDiscountPercent(programs) }
  })

  return (
    <div className="min-h-screen bg-white">
      <MkHeader partner={partner} onNavigate={onNavigate} />

      <section className="border-b border-mk-line bg-mk-surface py-12">
        <div className="mx-auto max-w-6xl px-5">
          <button
            onClick={() => onNavigate('/')}
            className="font-display text-[13.5px] font-bold text-mk-teal-700 underline-offset-2 hover:underline"
          >
            ← Home
          </button>
          <div className="mt-4">
            <Eyebrow>The network</Eyebrow>
            <Heading size="lg" className="mt-1">
              {schools.length} partner universities, one application path
            </Heading>
            <Body className="mt-3 max-w-2xl">
              Every school here has agreed to AllCampus partner pricing. Enrolling through
              AllCampus is what applies it.
            </Body>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-12">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {schools.map((s) => (
            <button
              key={s.id}
              type="button"
              onClick={() => onNavigate(`/school/${s.id}`)}
              className="group flex flex-col rounded-[var(--radius-card)] border border-mk-line bg-white p-5 text-left shadow-[0_1px_2px_rgba(51,71,91,0.06)] transition hover:-translate-y-0.5 hover:border-mk-teal-600 hover:shadow-[0_8px_24px_rgba(69,120,140,0.16)]"
            >
              <div className="flex items-center gap-3">
                <span
                  className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg text-[15px] font-black text-white shadow-sm"
                  style={{ background: s.logoColor }}
                >
                  {s.logoMonogram}
                </span>
                <span className="min-w-0">
                  <span className="block font-display text-[15.5px] font-extrabold leading-snug text-mk-slate group-hover:text-mk-teal-700">
                    {s.name}
                  </span>
                  <span className="block truncate font-display text-[12px] font-semibold text-mk-body">
                    {s.location}
                  </span>
                </span>
              </div>
              {/* The tags: count + couponing, the sanctioned differentiator. */}
              <div className="mt-3.5 flex flex-wrap gap-1.5">
                <span className="rounded-full bg-mk-band px-2.5 py-1 font-display text-[12px] font-bold text-mk-teal-text">
                  {s.programCount} {s.programCount === 1 ? 'program' : 'programs'}
                </span>
                {s.bestPct != null && (
                  <span className="rounded-full bg-good-50 px-2.5 py-1 font-display text-[12px] font-bold text-good-700">
                    Up to {s.bestPct}% off
                  </span>
                )}
                <span className="rounded-full border border-mk-line px-2.5 py-1 font-display text-[12px] font-semibold text-mk-body">
                  {s.accreditation}
                </span>
              </div>
            </button>
          ))}
        </div>
        <p className="mt-6 font-display text-[12px] text-mk-body/70">
          Discounts shown are AllCampus partnership pricing; program details and your exact price
          appear after you create a free account. All data is mock.
        </p>
      </section>

      <footer className="bg-mk-slate py-8 text-center font-display text-xs text-white/60">
        AllCampus schools directory prototype, throwaway spec with mock data. Not production.
      </footer>
    </div>
  )
}
