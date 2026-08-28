import { useState } from 'react'
import { Eyebrow, Heading, Body } from './Section.jsx'
import SubjectIcon from './SubjectIcon.jsx'
import Img from '../Img.jsx'
import { PROGRAMS } from '../../data/model.js'
import { goalImage } from '../../data/images.js'
import {
  goalsForEmployer,
  categoriesForEmployer,
  programMatchesGoal,
  programMatchesCategory,
  getSkill,
  getArea,
} from '../../data/taxonomy.js'

/*
 * DiscoveryBand (2026-08-26): the homepage's visual breadth surface, restored.
 *
 * WHY IT'S BACK. The Aug 20 copy doc of record specifies "explore (what's
 * inside? four subjects + four real programs)" as band two of five, and the
 * traceability log carries the four category tiles as preserved. The Aug 21
 * pathfinder reset dropped the whole discovery line on the premise that
 * "supported decision-making beats the browse-by-subject block," which went
 * further than the documented decision and left a visitor with no profile
 * looking at a homepage containing zero programs and zero subjects.
 *
 * WHY IT ISN'T A CONTRADICTION. Neither tier dumps a catalog. Outcome cards
 * open /browse?goal=<id>, which arrives pre-narrowed with the intention named
 * on screen; subject tiles open #/category/<id>, a real landing page rather
 * than filtered search. Breadth is what's shown, a narrowed set is what's
 * clicked. That is the decision aid, not a wall of 135 programs.
 *
 * WHY TWO TIERS IN ONE SECTION. The team's own reaction to these as separate
 * bands was that "browse by subject and where do you want to end up feel too
 * similar," and the resolution was to merge them, differentiated by SCALE and
 * JOB: outcomes are the emotive photo cards, subjects ride along beneath as a
 * compact utility strip. Splitting them again reintroduces the complaint.
 *
 * DRAFT COPY. Goal labels and subs, and all four category labels, are drafts
 * pending Brigid — the category set is explicitly a strawman (taxonomy.js).
 * Photography is hotlinked Unsplash, internal review only.
 */

// Six of nine. Two clean rows of three; nine made the band taller than Why
// AllCampus and turned a decision aid back into a wall.
const GOALS_SHOWN = 6

export default function DiscoveryBand({ partner, onNavigate }) {
  const [expanded, setExpanded] = useState(false)
  const allGoals = goalsForEmployer(partner)
  const goals = expanded ? allGoals : allGoals.slice(0, GOALS_SHOWN)
  const categories = categoriesForEmployer(partner)

  // D: an employer could prune areas down to almost nothing (no partner does
  // today, but the helpers support it). A two-way "where do you want to end
  // up" is not a decision aid, so the band steps aside entirely.
  if (allGoals.length < 3) return null

  return (
    <section className="bg-mk-surface pb-20">
      <div className="mx-auto max-w-6xl px-5">
        <Eyebrow>What&rsquo;s inside</Eyebrow>
        <Heading className="mt-2 max-w-2xl">Where do you want to end up?</Heading>
        <Body className="mt-3 max-w-xl">
          Start from the outcome. Every path here carries partner pricing.
        </Body>

        {/* TIER 1: outcomes, the emotive cards. */}
        <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {goals.map((g) => {
            const matches = PROGRAMS.filter((p) => programMatchesGoal(p, g))
            // Chips answer "what's actually inside this outcome", by frequency
            // across the matching programs. A goal that maps by DEGREE LEVEL
            // rather than skills (finish-bachelors: 51 programs spread over 31
            // skill buckets) has no meaningful top three — the frequency winners
            // there are noise like "History". Those goals get AREA labels
            // instead, which is the honest grain for "any subject".
            const bySkill = !!g.skillIds?.length
            const freq = new Map()
            for (const p of matches) {
              if (bySkill) {
                for (const sid of p.skillIds || []) {
                  if (!g.skillIds.includes(sid)) continue
                  freq.set(sid, (freq.get(sid) || 0) + 1)
                }
              } else if (p.areaId) {
                freq.set(p.areaId, (freq.get(p.areaId) || 0) + 1)
              }
            }
            const chips = [...freq.entries()]
              .sort((a, b) => b[1] - a[1])
              .slice(0, 3)
              .map(([id]) => (bySkill ? getSkill(id) : getArea(id)))
              .filter(Boolean)

            return (
              <button
                key={g.id}
                type="button"
                onClick={() => onNavigate?.(`/browse?goal=${g.id}`)}
                className="group flex h-full flex-col overflow-hidden rounded-[var(--radius-card)] border border-mk-line bg-white text-left transition hover:-translate-y-0.5 hover:border-mk-teal-600 hover:shadow-[var(--shadow-card-hover)]"
              >
                <span className="relative block h-40 shrink-0">
                  <Img
                    src={goalImage(g.id)}
                    alt=""
                    hue={206}
                    rounded=""
                    focus="top"
                    className="h-40 w-full"
                    overlay="bg-gradient-to-t from-mk-slate/85 via-mk-slate/25 to-transparent"
                  />
                  <span className="absolute inset-x-0 bottom-0 p-4">
                    <span className="block font-display text-[17px] font-extrabold leading-snug text-white">
                      {g.label}
                    </span>
                  </span>
                </span>
                <span className="flex flex-1 flex-col p-5">
                  <span className="block font-display text-[13px] leading-relaxed text-mk-body">
                    {g.sub}
                  </span>
                  {chips.length > 0 && (
                    <span className="mt-3 flex flex-wrap gap-1.5">
                      {chips.map((s) => (
                        <span
                          key={s.id}
                          className="rounded-full border border-mk-line bg-mk-surface px-2.5 py-1 font-display text-[12px] font-semibold text-mk-slate"
                        >
                          {s.label}
                        </span>
                      ))}
                    </span>
                  )}
                  {/* Pinned to the bottom so the count sits on one line
                      across the row, whatever the chips did above it. */}
                  <span className="mt-auto flex items-center gap-1.5 pt-3 font-display text-[13px] font-bold text-mk-teal-700">
                    {matches.length} program{matches.length === 1 ? '' : 's'}
                    <span aria-hidden className="transition group-hover:translate-x-0.5">
                      &rarr;
                    </span>
                  </span>
                </span>
              </button>
            )
          })}
        </div>

        {allGoals.length > GOALS_SHOWN && !expanded && (
          <div className="mt-6">
            <button
              type="button"
              onClick={() => setExpanded(true)}
              className="font-display text-[15px] font-bold text-mk-teal-700 underline-offset-2 hover:underline"
            >
              Show {allGoals.length - GOALS_SHOWN} more &rarr;
            </button>
          </div>
        )}

        {/* TIER 2: subjects, the utility strip. Smaller on purpose — scale is
            what keeps this from reading as a second copy of the cards above. */}
        {categories.length > 1 && (
        <div className="mt-10 border-t border-mk-line pt-7">
          <h3 className="font-display text-[15px] font-extrabold text-mk-slate">
            Or browse by subject
          </h3>
          <div className="mt-4 grid grid-cols-1 items-start gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {categories.map((c) => {
              const count = PROGRAMS.filter((p) => programMatchesCategory(p, c)).length
              return (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => onNavigate?.(`/category/${c.id}`)}
                  className="group flex items-center gap-3 rounded-[var(--radius-card)] border border-mk-line bg-white px-4 py-3.5 text-left transition hover:border-mk-teal-600 hover:shadow-[var(--shadow-card-hover)]"
                >
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-mk-band text-mk-teal-700">
                    <SubjectIcon id={c.id} className="h-5 w-5" />
                  </span>
                  <span className="min-w-0">
                    <span className="block font-display text-[15px] font-extrabold leading-snug text-mk-slate">
                      {c.label}
                    </span>
                    <span className="mt-0.5 block font-display text-[13px] font-semibold text-mk-body">
                      {count} programs
                    </span>
                  </span>
                </button>
              )
            })}
          </div>
        </div>
        )}
      </div>
    </section>
  )
}
