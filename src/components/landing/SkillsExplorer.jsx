import { useState } from 'react'
import { Eyebrow, Heading, Body } from './Section.jsx'
import { areasForEmployer, skillsForEmployer, getArea } from '../../data/taxonomy.js'
import { PROGRAMS } from '../../data/model.js'

/*
 * Skills section (2026-08-11 meeting): replaces the random program carousel.
 * Broad, high-value skill buckets by default; area-of-study chips shorten
 * the list to one area; employer emphasis reorders and prunes (aviation
 * shows engineering, not nursing). Selecting a skill routes to the browse
 * surface filtered by that skill.
 *
 * Chip + card language mirrors the live template's area pill row.
 */

export default function SkillsExplorer({ partner, onSelectSkill }) {
  const [areaId, setAreaId] = useState(null)
  const areas = areasForEmployer(partner)
  const skills = skillsForEmployer(partner, areaId)
  const emphasized = !areaId && (partner?.emphasizedAreaIds?.length || 0) > 0

  const countFor = (skill) =>
    PROGRAMS.filter((p) => p.skillIds?.includes(skill.id)).length

  return (
    <section className="bg-mk-band py-16">
      <div className="mx-auto max-w-6xl px-5">
        <Eyebrow>Programs in your field</Eyebrow>
        <Heading className="mt-2">What skill do you want to build?</Heading>
        {emphasized && (
          <Body className="mt-2">
            Curated for {partner.name} employees — the fields your benefit is most used for.
          </Body>
        )}

        {/* Area chips: All + areas (hidden areas pruned per employer) */}
        <div className="mt-6 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setAreaId(null)}
            className={`rounded-full px-4 py-2 font-display text-[13px] font-bold transition ${
              areaId === null
                ? 'bg-mk-teal-600 text-white'
                : 'border border-mk-line bg-white text-mk-slate hover:border-mk-teal-600'
            }`}
          >
            All
          </button>
          {areas.map((a) => (
            <button
              key={a.id}
              type="button"
              onClick={() => setAreaId(a.id === areaId ? null : a.id)}
              className={`rounded-full px-4 py-2 font-display text-[13px] font-bold transition ${
                areaId === a.id
                  ? 'bg-mk-teal-600 text-white'
                  : 'border border-mk-line bg-white text-mk-slate hover:border-mk-teal-600'
              }`}
            >
              {a.label}
            </button>
          ))}
        </div>

        {/* Skill bucket cards */}
        <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {skills.map((s) => {
            const n = countFor(s)
            return (
              <button
                key={s.id}
                type="button"
                onClick={() => onSelectSkill(s)}
                className="group flex items-center justify-between gap-3 rounded-[var(--radius-card)] border border-mk-line bg-white px-5 py-4 text-left transition hover:border-mk-teal-600 hover:shadow-[0_4px_16px_rgba(69,120,140,0.12)]"
              >
                <span>
                  <span className="block font-display text-[15px] font-extrabold text-mk-slate">
                    {s.label}
                  </span>
                  <span className="mt-0.5 block font-display text-[13px] text-mk-body">
                    {getArea(s.areaId)?.label}
                    {n > 0 ? ` · ${n} program${n > 1 ? 's' : ''}` : ' · programs coming to catalog'}
                  </span>
                </span>
                <span className="text-mk-teal-600 transition group-hover:translate-x-0.5">→</span>
              </button>
            )
          })}
        </div>

        {areaId && (
          <p className="mt-4 font-display text-[13px] text-mk-body">
            Showing {skills.length} skills in {getArea(areaId)?.label}.{' '}
            <button
              type="button"
              onClick={() => setAreaId(null)}
              className="font-bold text-mk-teal-700 underline-offset-2 hover:underline"
            >
              Show all fields
            </button>
          </p>
        )}
      </div>
    </section>
  )
}
