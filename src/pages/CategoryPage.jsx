import MkHeader from '../components/landing/MkHeader.jsx'
import { Eyebrow, Heading, Body, MkButton } from '../components/landing/Section.jsx'
import { SubjectIconTile } from '../components/landing/SubjectIcon.jsx'
import { PROGRAMS } from '../data/model.js'
import { bestDiscountPercent, fullyCoveredPrograms } from '../data/benefit.js'
import {
  getCategory,
  areasForCategory,
  skillsForArea,
  goalsForCategory,
  programMatchesCategory,
  programMatchesGoal,
} from '../data/taxonomy.js'

/*
 * Category landing page (#/category/:id) — the page the Aug 14 meeting asked
 * for: "clicking a category goes to a landing page where users can drill down
 * by skill" (Terrence confirmed it builds quickly as a dynamic page).
 *
 * Value messaging about the subject, then the two requested ways in:
 * outcomes ("pick an outcome" tiles, scoped) and skills (the drill-down).
 * NO program cards here — the catalog sits behind login (the meeting's
 * leakage decision), and the header carries the requested tease instead:
 * program count and a discount hint, no school names, no amounts.
 *
 * Pitch copy is DRAFT for Brigid, same as the category labels.
 */
export default function CategoryPage({ categoryId, partner, onNavigate }) {
  const category = getCategory(categoryId)

  if (!category) {
    return (
      <div className="min-h-screen bg-white">
        <MkHeader partner={partner} onNavigate={onNavigate} />
        <div className="mx-auto max-w-3xl px-5 py-20">
          <Heading>We don&rsquo;t have that category</Heading>
          <Body className="mt-3">
            The link may be out of date. Start from the four subject areas instead.
          </Body>
          <div className="mt-6">
            <MkButton tone="teal" onClick={() => onNavigate('/')}>
              Back to all subjects
            </MkButton>
          </div>
        </div>
      </div>
    )
  }

  const inCategory = PROGRAMS.filter((p) => programMatchesCategory(p, category))
  const areas = areasForCategory(category)
  const goals = goalsForCategory(category)
  const schoolCount = new Set(inCategory.map((p) => p.schoolId)).size
  const maxPct = bestDiscountPercent(inCategory)
  const covered = partner?.benefitKnown ? fullyCoveredPrograms(inCategory, partner).length : 0
  const emphasized = (partner?.emphasizedAreaIds || []).some((a) => category.areaIds.includes(a))
  const countForSkill = (id) => inCategory.filter((p) => p.skillIds?.includes(id)).length

  return (
    <div className="min-h-screen bg-white">
      <MkHeader partner={partner} onNavigate={onNavigate} />

      {/* Value header: why THIS subject, with the count + discount tease. */}
      <section className="border-b border-mk-line bg-mk-band py-12">
        <div className="mx-auto max-w-6xl px-5">
          <button
            onClick={() => onNavigate('/')}
            className="font-display text-[13.5px] font-bold text-mk-teal-700 underline-offset-2 hover:underline"
          >
            ← All subjects
          </button>

          <div className="mt-5 max-w-2xl">
            <SubjectIconTile id={category.id} size="lg" className="bg-white" />
            <div className="mt-4">
              <Eyebrow>Subject</Eyebrow>
              <Heading size="lg" className="mt-1">
                {category.label}
              </Heading>
              <Body className="mt-3 text-[16px]">{category.pitch}</Body>

              {emphasized && (
                <p className="mt-3 inline-flex items-center gap-2 rounded-full bg-white px-3.5 py-1.5 font-display text-[13px] font-bold text-mk-teal-700">
                  ★ Where {partner.name} employees use their benefit most
                </p>
              )}

              <div className="mt-5 flex flex-wrap items-center gap-x-6 gap-y-2 font-display text-[14px] font-bold text-mk-slate">
                <span>{inCategory.length} {inCategory.length === 1 ? 'program' : 'programs'}</span>
                <span className="text-mk-line" aria-hidden>|</span>
                <span>{schoolCount} in-network {schoolCount === 1 ? 'university' : 'universities'}</span>
                {maxPct != null && (
                  <>
                    <span className="text-mk-line" aria-hidden>|</span>
                    <span className="text-mk-green-700">Up to {maxPct}% off</span>
                  </>
                )}
                {covered > 0 && (
                  <>
                    <span className="text-mk-line" aria-hidden>|</span>
                    <span className="text-mk-green-700">
                      {covered} fully covered by {partner.name} (est.)
                    </span>
                  </>
                )}
              </div>

              <div className="mt-6">
                <MkButton tone="teal" onClick={() => onNavigate('/browse')}>
                  Browse programs
                </MkButton>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Outcomes, scoped to this subject. */}
      {goals.length > 0 && (
        <section className="mx-auto max-w-6xl px-5 pt-12">
          <Eyebrow>Where it can take you</Eyebrow>
          <Heading size="sm" className="mt-1.5">
            Start from the outcome
          </Heading>
          <div className="mt-5 flex flex-wrap gap-2">
            {goals.map((g) => {
              const n = PROGRAMS.filter((p) => programMatchesGoal(p, g)).length
              return (
                <button
                  key={g.id}
                  type="button"
                  onClick={() => onNavigate(`/browse?goal=${g.id}`)}
                  className="rounded-full border border-mk-line bg-white px-4 py-2 font-display text-[13.5px] font-bold text-mk-slate transition hover:border-mk-teal-600 hover:text-mk-teal-700"
                >
                  {g.label}
                  <span className="ml-1.5 text-[12px] font-semibold text-mk-body/70">{n}</span>
                </button>
              )
            })}
          </div>
        </section>
      )}

      {/* The drill-down the meeting described. */}
      <section className="mx-auto max-w-6xl px-5 py-12">
        <Eyebrow>Narrow by skill</Eyebrow>
        <Heading size="sm" className="mt-1.5">
          Know what you want to work on?
        </Heading>
        <div className="mt-5 space-y-5">
          {areas.map((area) => {
            const skills = skillsForArea(area.id)
            return (
              <div key={area.id}>
                {areas.length > 1 && (
                  <h3 className="mb-2 font-display text-[14px] font-extrabold text-mk-slate">
                    {area.label}
                  </h3>
                )}
                <div className="flex flex-wrap gap-2">
                  {skills.map((s) => {
                    const n = countForSkill(s.id)
                    return (
                      <button
                        key={s.id}
                        onClick={() => onNavigate(`/browse?skill=${s.id}`)}
                        className="inline-flex items-center gap-1.5 rounded-full border border-mk-line bg-white px-3.5 py-1.5 font-display text-[13px] font-bold text-mk-slate transition hover:border-mk-teal-600 hover:text-mk-teal-700"
                      >
                        {s.label}
                        {n > 0 && (
                          <span className="text-[11.5px] font-semibold text-mk-body/70">{n}</span>
                        )}
                      </button>
                    )
                  })}
                </div>
              </div>
            )
          })}
        </div>
      </section>

      <footer className="bg-mk-slate py-8 text-center font-display text-xs text-white/60">
        AllCampus category page prototype, throwaway spec with mock data. Not production.
      </footer>
    </div>
  )
}
