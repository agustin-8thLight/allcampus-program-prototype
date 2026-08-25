import MkHeader from '../components/landing/MkHeader.jsx'
import { Eyebrow, Heading, Body, MkButton } from '../components/landing/Section.jsx'
import SubjectIcon from '../components/landing/SubjectIcon.jsx'
import ProgramCard from '../components/ProgramCard.jsx'
import ObfuscatedCard from '../components/ObfuscatedCard.jsx'
import Img from '../components/Img.jsx'
import { PROGRAMS } from '../data/model.js'
import { bestDiscountPercent, fullyCoveredPrograms, discountLabel } from '../data/benefit.js'
import { categoryImage } from '../data/images.js'
import {
  getCategory,
  areasForCategory,
  skillsForArea,
  goalsForCategory,
  programMatchesCategory,
  programMatchesGoal,
} from '../data/taxonomy.js'

/*
 * Category landing page (#/category/:id), rebuilt 2026-08-20: "Category
 * landings need to be real landing pages and not filtered search results."
 *
 * The previous version was a utility page — icon header, chips, drill-down —
 * because the gating era stripped its featured programs. With the catalog
 * open again this is a full landing: photo hero with the value pitch and
 * scoped numbers, real program cards ON the page, then the two ways deeper
 * (outcomes and the skill drill-down the Aug 14 meeting asked for), closed
 * by the dark CTA bookend the homepage established.
 *
 * Pitch copy is DRAFT for Brigid, same as the category labels.
 */
export default function CategoryPage({ categoryId, partner, joined = true, gated = false, onGate, onNavigate }) {
  const category = getCategory(categoryId)

  if (!category) {
    return (
      <div className="min-h-screen bg-white">
        <MkHeader partner={partner} onNavigate={onNavigate} joined={joined} onGate={onGate} />
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

  // Featured: best discounts first — the differentiator leads on a landing.
  const featured = [...inCategory]
    .sort((a, b) => (b.discount?.percentUsed || 0) - (a.discount?.percentUsed || 0))
    .slice(0, 6)

  const goBrowse = (extra = '') => onNavigate(`/browse?category=${category.id}${extra}`)

  return (
    <div className="min-h-screen bg-white">
      <MkHeader partner={partner} onNavigate={onNavigate} joined={joined} onGate={onGate} />

      {/* Photo hero, same treatment as the homepage hero: the page opens as a
          destination, not a filter view. */}
      <section className="relative overflow-hidden py-16 text-white">
        <Img
          src={categoryImage(category.id)}
          alt=""
          hue={category.hue || 206}
          rounded=""
          position="absolute"
          className="inset-0 h-full w-full"
          overlay="bg-[linear-gradient(112deg,rgba(30,45,58,0.92)_0%,rgba(51,71,91,0.84)_45%,rgba(69,120,140,0.62)_100%)]"
        />
        <div className="relative mx-auto max-w-6xl px-5">
          <button
            onClick={() => onNavigate('/')}
            className="font-display text-[13.5px] font-bold text-white/80 underline-offset-2 hover:text-white hover:underline"
          >
            ← All subjects
          </button>

          <div className="mt-6 max-w-2xl">
            <p className="font-display text-[12px] font-bold uppercase tracking-[0.16em] text-white/70">
              Subject
            </p>
            <h1 className="mt-2 text-[34px] font-extrabold leading-tight sm:text-[42px]">
              {category.label}
            </h1>
            <p className="mt-3 font-display text-[16px] leading-relaxed text-white/85">
              {category.pitch}
            </p>

            {emphasized && (
              <p className="mt-4 inline-flex items-center gap-2 rounded-full bg-white/15 px-3.5 py-1.5 font-display text-[13px] font-bold text-white backdrop-blur-sm">
                ★ Where {partner.name} employees use their benefit most
              </p>
            )}

            <div className="mt-5 flex flex-wrap items-center gap-x-6 gap-y-2 font-display text-[14px] font-bold">
              <span>{inCategory.length} {inCategory.length === 1 ? 'program' : 'programs'}</span>
              <span className="text-white/40" aria-hidden>|</span>
              <span>{schoolCount} in-network {schoolCount === 1 ? 'university' : 'universities'}</span>
              {maxPct != null && (
                <>
                  <span className="text-white/40" aria-hidden>|</span>
                  <span>{discountLabel(inCategory)}</span>
                </>
              )}
              {covered > 0 && (
                <>
                  <span className="text-white/40" aria-hidden>|</span>
                  <span>{covered} fully covered by {partner.name} (est.)</span>
                </>
              )}
            </div>

            <div className="mt-7">
              <button
                type="button"
                onClick={() => goBrowse()}
                className="inline-flex items-center justify-center rounded-md bg-white px-6 py-2.5 font-display text-[14px] font-bold text-mk-teal-700 shadow-[0_8px_20px_rgba(0,0,0,0.18)] transition hover:bg-mk-band"
              >
                Browse all {inCategory.length} programs
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 8/21 (Brigid): this section needs the connect-to-qualify reminder. */}
      <section className="mx-auto max-w-6xl px-5 pt-10">
        <div className="rounded-[var(--radius-card)] border-l-4 border-mk-teal-600 bg-mk-surface px-6 py-4">
          <p className="font-display text-[14.5px] font-extrabold text-mk-slate">
            The discount is already in place. You already qualify. Connect through AllCampus to
            activate it.
          </p>
        </div>
      </section>

      {/* Real programs ON the page — a landing sells with the goods. */}
      {featured.length > 0 && (
        <section className="mx-auto max-w-6xl px-5 pt-12">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <Eyebrow>Popular in this subject</Eyebrow>
              <Heading size="sm" className="mt-1.5">
                Start with these programs
              </Heading>
            </div>
            <button
              type="button"
              onClick={() => goBrowse()}
              className="font-display text-[13.5px] font-bold text-mk-teal-700 underline-offset-2 hover:underline"
            >
              See all {inCategory.length} →
            </button>
          </div>
          <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((p) =>
              gated ? (
                <ObfuscatedCard key={p.id} program={p} onGate={onGate} />
              ) : (
                <ProgramCard
                  key={p.id}
                  program={p}
                  partner={partner}
                  joined={joined}
                  onExplore={(prog) => goBrowse(`&program=${prog.id}`)}
                  onSave={(prog) => goBrowse(`&program=${prog.id}`)}
                  onCompare={(prog) => goBrowse(`&program=${prog.id}`)}
                />
              ),
            )}
          </div>
        </section>
      )}

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
        {/* Visual area cards: the Aug 19 session asked for a happy medium
            between the visual tile layout and the info-dense chip list, so
            each area gets a card that is more visual (icon tile, label,
            program count) while keeping the skill chips inside it. */}
        <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {areas.map((area) => {
            const skills = skillsForArea(area.id)
            const areaCount = inCategory.filter((p) => p.areaId === area.id).length
            return (
              <div
                key={area.id}
                className="rounded-[var(--radius-card)] border border-mk-line bg-white p-5 shadow-[0_1px_2px_rgba(51,71,91,0.06)] transition hover:border-mk-teal-600"
              >
                <div className="flex items-center gap-3">
                  <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-mk-band text-mk-teal-700 ring-1 ring-inset ring-mk-line">
                    <SubjectIcon id={area.id} className="h-5 w-5" />
                  </span>
                  <h3 className="font-display text-[14px] font-extrabold text-mk-slate">
                    {area.label}
                  </h3>
                  <span className="ml-auto font-display text-[13px] font-bold text-mk-body/70">
                    {areaCount} {areaCount === 1 ? 'program' : 'programs'}
                  </span>
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
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

      {/* Dark CTA bookend, mirroring the homepage close. */}
      <section className="bg-gradient-to-br from-mk-teal-600 to-mk-slate py-14 text-center">
        <Heading size="sm" className="text-white">
          {inCategory.length} {category.label} programs, discounts included
        </Heading>
        <div className="mt-5">
          <button
            type="button"
            onClick={() => goBrowse()}
            className="inline-flex items-center justify-center rounded-md bg-white px-6 py-2.5 font-display text-[14px] font-bold text-mk-teal-700 shadow-[0_8px_20px_rgba(0,0,0,0.18)] transition hover:bg-mk-band"
          >
            Browse all programs
          </button>
        </div>
      </section>

      <footer className="bg-mk-slate py-8 text-center font-display text-xs text-white/60">
        AllCampus category page prototype, throwaway spec with mock data. Not production.
      </footer>
    </div>
  )
}
