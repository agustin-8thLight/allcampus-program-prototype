import { Eyebrow, Heading, Body } from './Section.jsx'
import { SubjectIconTile } from './SubjectIcon.jsx'
import { goalsForEmployer, categoriesForEmployer, programMatchesCategory, programMatchesGoal, getSkill } from '../../data/taxonomy.js'
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
export default function GoalsExplorer({ partner, onSelectGoal, onSelectCategory }) {
  const goals = goalsForEmployer(partner)
  const categories = categoriesForEmployer(partner)
  const covered = fullyCoveredPrograms(PROGRAMS, partner)
  const emphasized = (partner?.emphasizedAreaIds?.length || 0) > 0

  const countFor = (goal) => PROGRAMS.filter((p) => programMatchesGoal(p, goal)).length
  const coveredFor = (goal) => covered.filter((p) => programMatchesGoal(p, goal)).length

  return (
    <section className="border-y border-mk-line bg-mk-surface py-16">
      <div className="mx-auto max-w-6xl px-5">
        <Eyebrow>Where do you want to end up?</Eyebrow>
        <Heading className="mt-2">Pick the outcome, we’ll map the programs</Heading>
        <Body className="mt-2 max-w-2xl">
          {emphasized
            ? `${/^your /i.test(partner.name) ? 'Ordered for you' : `Ordered for ${partner.name} employees`}: the outcomes your benefit is most used for.`
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
                  <span className="block font-display text-[22px] font-extrabold leading-snug text-mk-slate">
                    {g.label}
                  </span>
                  <span className="mt-1 block font-display text-[13px] text-mk-body">{g.sub}</span>

                  {/* What lives inside this outcome (2026-08-20 review,
                      second pass: program titles read too granular — show the
                      SKILL labels instead, in the retired Browse-by-subject
                      block's pill treatment, most-common first). */}
                  <span className="mt-3 flex flex-wrap gap-1.5 border-t border-mk-line pt-3">
                    {(() => {
                      const freq = new Map()
                      PROGRAMS.filter((p) => programMatchesGoal(p, g)).forEach((p) =>
                        (p.skillIds || []).forEach((id) => freq.set(id, (freq.get(id) || 0) + 1)),
                      )
                      const skills = [...freq.entries()]
                        .sort((a, b) => b[1] - a[1])
                        .map(([id]) => getSkill(id))
                        .filter(Boolean)
                      const preview = skills.slice(0, 4)
                      return (
                        <>
                          {preview.map((s) => (
                            <span
                              key={s.id}
                              className="rounded-full border border-mk-line bg-white px-2.5 py-1 font-display text-[13px] font-bold text-mk-body"
                            >
                              {s.label}
                            </span>
                          ))}
                          {skills.length > preview.length && (
                            <span className="rounded-full px-2 py-1 font-display text-[13px] font-bold text-mk-body/70">
                              +{skills.length - preview.length} more
                            </span>
                          )}
                        </>
                      )
                    })()}
                  </span>

                  <span className="mt-3 flex items-center justify-between">
                    <span className="font-display text-[13px] font-bold text-mk-body">
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

        {/* Subjects as a compact wayfinding strip (2026-08-19: as a second
            band of big tiles this read as a copy of the outcome cards — the
            differentiation is scale and job: outcomes are the emotive image
            cards above, subjects are small utility tiles into their landing
            pages). Labels are drafts for Brigid. */}
        <div className="mt-8 border-t border-mk-line pt-5">
          <p className="font-display text-[12px] font-bold uppercase tracking-[0.14em] text-mk-teal-text">
            Or browse by subject
          </p>
          <div className="mt-3 grid grid-cols-2 gap-2.5 lg:grid-cols-4">
            {categories.map((c) => {
              const n = PROGRAMS.filter((p) => programMatchesCategory(p, c)).length
              return (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => onSelectCategory(c)}
                  className="group flex items-center gap-3 rounded-[var(--radius-card)] border border-mk-line bg-white px-3.5 py-3 text-left transition hover:-translate-y-0.5 hover:border-mk-teal-600 hover:shadow-[0_6px_18px_rgba(69,120,140,0.14)]"
                >
                  <SubjectIconTile id={c.id} size="sm" />
                  <span className="min-w-0">
                    <span className="block font-display text-[13px] font-extrabold leading-snug text-mk-slate">
                      {c.label}
                    </span>
                    <span className="block font-display text-[12px] font-semibold text-mk-body">
                      {n} {n === 1 ? 'program' : 'programs'}
                    </span>
                  </span>
                  <span
                    aria-hidden
                    className="ml-auto font-display text-[15px] text-mk-teal-600 transition group-hover:translate-x-0.5"
                  >
                    →
                  </span>
                </button>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
