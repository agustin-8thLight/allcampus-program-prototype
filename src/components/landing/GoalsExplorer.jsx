import { useState } from 'react'
import { Eyebrow, Heading, Body } from './Section.jsx'
import { goalsForEmployer, areasForEmployer, getArea, programMatchesGoal } from '../../data/taxonomy.js'
import { PROGRAMS } from '../../data/model.js'
import { goalImage } from '../../data/images.js'
import Img from '../Img.jsx'
import { fullyCoveredPrograms } from '../../data/benefit.js'

/*
 * Goals block (2026-08-12 direction, replaces the SkillsExplorer card grid).
 * The pattern: outcome-shaped, relatable labels — the end result a person
 * wants — not catalog categories. Each card shows its program count and,
 * when the employer benefit is known, how many of those are fully covered.
 * Selecting a goal seeds browse with the goal mapping; the friendly label
 * carries through as the applied chip. Area-of-study chips are demoted to a
 * secondary "browse the catalog instead" row beneath the cards.
 *
 * Goal LABELS are draft — validate wording with Brigid.
 */
export default function GoalsExplorer({ partner, onSelectGoal, onSelectArea }) {
  const goals = goalsForEmployer(partner)
  const areas = areasForEmployer(partner)
  const covered = fullyCoveredPrograms(PROGRAMS, partner)
  const emphasized = (partner?.emphasizedAreaIds?.length || 0) > 0
  const [showAllAreas, setShowAllAreas] = useState(false)

  const countFor = (goal) => PROGRAMS.filter((p) => programMatchesGoal(p, goal)).length
  const coveredFor = (goal) => covered.filter((p) => programMatchesGoal(p, goal)).length

  return (
    <section className="bg-mk-band py-16">
      <div className="mx-auto max-w-6xl px-5">
        <Eyebrow>Where do you want to end up?</Eyebrow>
        <Heading className="mt-2">Pick the outcome, we’ll map the programs</Heading>
        <Body className="mt-2 max-w-2xl">
          {emphasized
            ? `Ordered for ${partner.name} employees — the outcomes your benefit is most used for.`
            : 'Real destinations people search for, matched to programs in the catalog.'}
        </Body>

        {/* Outcome cards */}
        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {goals.map((g) => {
            const n = countFor(g)
            const c = coveredFor(g)
            return (
              <button
                key={g.id}
                type="button"
                onClick={() => onSelectGoal(g)}
                className="group overflow-hidden rounded-2xl border border-mk-line bg-white text-left shadow-sm transition hover:-translate-y-0.5 hover:border-mk-teal-600 hover:shadow-[0_8px_24px_rgba(69,120,140,0.16)]"
              >
                {/* Visual band (imagery lands in the images pass; hue holds the slot) */}
                <Img
                  src={goalImage(g.id)}
                  alt=""
                  hue={g.hue}
                  rounded=""
                  className="h-32 w-full"
                  overlay="bg-gradient-to-t from-mk-slate/45 to-transparent"
                />
                <div className="px-5 py-4">
                  <span className="block font-display text-[17px] font-extrabold leading-snug text-mk-slate">
                    {g.label}
                  </span>
                  <span className="mt-1 block font-display text-[13px] text-mk-body">{g.sub}</span>
                  <span className="mt-3 flex items-center justify-between">
                    <span className="font-display text-[12.5px] font-bold text-mk-body">
                      {n > 0 ? `${n} program${n > 1 ? 's' : ''}` : 'Programs coming to catalog'}
                      {c > 0 && (
                        <span className="text-mk-green-700"> · {c} fully covered for you</span>
                      )}
                    </span>
                    <span className="text-mk-teal-600 transition group-hover:translate-x-0.5">→</span>
                  </span>
                </div>
              </button>
            )
          })}
        </div>

        {/* Secondary: catalog-language browsing for people who think in fields */}
        <div className="mt-8 border-t border-mk-line pt-5">
          <button
            type="button"
            onClick={() => setShowAllAreas((v) => !v)}
            className="font-display text-[13.5px] font-bold text-mk-teal-700 underline-offset-2 hover:underline"
          >
            {showAllAreas ? 'Hide areas of study' : 'Prefer to browse by area of study?'}
          </button>
          {showAllAreas && (
            <div className="mt-3 flex flex-wrap gap-2">
              {areas.map((a) => (
                <button
                  key={a.id}
                  type="button"
                  onClick={() => onSelectArea(a)}
                  className="rounded-full border border-mk-line bg-white px-4 py-2 font-display text-[13.5px] font-bold text-mk-slate transition hover:border-mk-teal-600"
                >
                  {a.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
