import { Eyebrow, Heading, Body } from './Section.jsx'
import { SubjectIconTile } from './SubjectIcon.jsx'
import {
  categoriesForEmployer,
  skillsForCategory,
  programMatchesCategory,
} from '../../data/taxonomy.js'
import { PROGRAMS } from '../../data/model.js'
import { fullyCoveredPrograms } from '../../data/benefit.js'

/*
 * CategoriesExplorer — landing option A (2026-08-14 meeting).
 *
 * The problem being solved: the area-of-study dropdown is "directionally right
 * but too overwhelming." Eight areas and roughly forty skills in one flat
 * select asks people to recognise the catalog's vocabulary before they can move.
 * The meeting's reference was Coursera: a handful of high-level tiles that
 * expand into the skills underneath.
 *
 * Four tiles, each naming a few of its skills so the tile is legible without
 * being clicked, then a category landing page for the real drill-down. Clicking
 * goes to #/category/:id, NOT straight to filtered results — the middle page is
 * the point, because it is what lets someone look at a field before committing
 * to it.
 *
 * Compare with GoalsExplorer (option B), which leads with outcomes instead. The
 * two are genuine alternatives for the same slot, which is why this week's
 * review switches between them rather than stacking both.
 */
export default function CategoriesExplorer({ partner, onSelectCategory }) {
  const categories = categoriesForEmployer(partner)
  const covered = fullyCoveredPrograms(PROGRAMS, partner)
  const emphasized = (partner?.emphasizedAreaIds?.length || 0) > 0

  return (
    <section className="bg-mk-band py-16">
      <div className="mx-auto max-w-6xl px-5">
        <Eyebrow>Browse by subject</Eyebrow>
        <Heading className="mt-2">Start with the field, narrow to the skill</Heading>
        <Body className="mt-2 max-w-2xl">
          {emphasized
            ? `Ordered for ${partner.name} employees. These are the subjects your benefit is most used for.`
            : 'Four subject areas, each opening onto the specific skills and credentials underneath.'}
        </Body>

        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {categories.map((c) => {
            const programs = PROGRAMS.filter((p) => programMatchesCategory(p, c))
            const coveredN = covered.filter((p) => programMatchesCategory(p, c)).length
            const skills = skillsForCategory(c)
            // Four named skills is enough to make the tile concrete without
            // reproducing the flat list this block exists to replace.
            const preview = skills.slice(0, 4)
            return (
              <button
                key={c.id}
                type="button"
                onClick={() => onSelectCategory(c)}
                className="group relative flex flex-col overflow-hidden rounded-2xl border border-mk-line bg-white p-6 text-left shadow-[0_1px_2px_rgba(51,71,91,0.06)] transition hover:-translate-y-0.5 hover:border-transparent hover:shadow-[0_10px_28px_rgba(51,71,91,0.14)]"
              >
                <div className="flex items-start gap-4">
                  <SubjectIconTile id={c.id} hue={c.hue} size="md" />
                  <span className="min-w-0 flex-1">
                    <span className="block font-display text-[22px] font-extrabold leading-snug text-mk-slate">
                      {c.label}
                    </span>
                    <span className="mt-1.5 block font-display text-[15px] leading-relaxed text-mk-body">
                      {c.blurb}
                    </span>
                  </span>
                  <span
                    aria-hidden
                    className="mt-1 shrink-0 font-display text-[22px] text-mk-teal-600 transition group-hover:translate-x-1"
                  >
                    →
                  </span>
                </div>

                <span className="mt-4 flex flex-wrap gap-1.5">
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
                </span>

                {/* Meta foot, mirroring the "Application due …" line Coursera
                    puts at the bottom of every degree card: one factual line,
                    same place on every tile, so the grid has a baseline. */}
                <span className="mt-auto flex flex-wrap items-center gap-x-2 gap-y-1 border-t border-mk-line pt-3.5 font-display text-[13px] font-bold text-mk-body">
                  {programs.length} {programs.length === 1 ? 'program' : 'programs'}
                  {coveredN > 0 && (
                    <>
                      <span className="text-mk-line" aria-hidden>
                        |
                      </span>
                      <span className="text-mk-green-700">{coveredN} fully covered for you</span>
                    </>
                  )}
                </span>
              </button>
            )
          })}
        </div>

        <p className="mt-6 font-display text-[13px] text-mk-body/70">
          Subject-area labels are a draft. Brigid owns the student-facing vocabulary and should
          replace these four with hers.
        </p>
      </div>
    </section>
  )
}
