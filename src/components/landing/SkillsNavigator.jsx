import { useMemo } from 'react'
import SubjectIcon from './SubjectIcon.jsx'
import { AREAS, skillsForArea } from '../../data/taxonomy.js'
import { PROGRAMS } from '../../data/model.js'

/*
 * SkillsNavigator (2026-08-20 revision): the alternate homepage exposes the
 * skills BY AREA OF STUDY in place of the search box — no tabs, no clicks
 * needed to see what's inside. Every area card shows its top skills as live
 * count pills; everything routes straight to the (gated) results. Search
 * itself lives in the nav on this variant ("if they're not logged in, we
 * don't really want them searching").
 */
const SKILLS_SHOWN = 4

export default function SkillsNavigator({ onNavigate }) {
  const counts = useMemo(() => {
    const area = {}
    const skill = {}
    for (const p of PROGRAMS) {
      area[p.areaId] = (area[p.areaId] || 0) + 1
      for (const s of p.skillIds || []) skill[s] = (skill[s] || 0) + 1
    }
    return { area, skill }
  }, [])

  return (
    <div className="rounded-xl bg-white p-4 shadow-[0_10px_30px_rgba(51,71,91,0.14)] sm:p-5">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {AREAS.map((a) => {
          // Top skills by catalog coverage, so the card leads with substance.
          const skills = [...skillsForArea(a.id)].sort(
            (x, y) => (counts.skill[y.id] || 0) - (counts.skill[x.id] || 0),
          )
          const shown = skills.slice(0, SKILLS_SHOWN)
          const more = skills.length - shown.length
          return (
            <div
              key={a.id}
              className="rounded-[var(--radius-card)] border border-mk-line p-3.5 transition hover:border-mk-teal-600"
            >
              <button
                type="button"
                onClick={() => onNavigate(`/browse?area=${a.id}`)}
                className="group flex w-full items-center gap-2.5 text-left"
              >
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-mk-band text-mk-teal-700 ring-1 ring-inset ring-mk-line">
                  <SubjectIcon id={a.id} className="h-[18px] w-[18px]" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate font-display text-[15px] font-extrabold text-mk-slate group-hover:text-mk-teal-700">
                    {a.label}
                  </span>
                  <span className="block font-display text-[12px] font-semibold text-mk-body">
                    {counts.area[a.id] || 0} programs
                  </span>
                </span>
                <span aria-hidden className="text-mk-teal-600 transition group-hover:translate-x-0.5">
                  →
                </span>
              </button>
              <div className="mt-2.5 flex flex-wrap gap-1.5">
                {shown.map((s) => (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => onNavigate(`/browse?skill=${s.id}`)}
                    className="rounded-full border border-mk-line bg-white px-2.5 py-1 font-display text-[12px] font-semibold text-mk-slate transition hover:border-mk-teal-600 hover:text-mk-teal-700"
                  >
                    {s.label}
                    <span className="ml-1 text-[12px] font-semibold text-mk-body/70">
                      {counts.skill[s.id] || 0}
                    </span>
                  </button>
                ))}
                {more > 0 && (
                  <button
                    type="button"
                    onClick={() => onNavigate(`/browse?area=${a.id}`)}
                    className="rounded-full px-2 py-1 font-display text-[12px] font-bold text-mk-teal-700 underline-offset-2 hover:underline"
                  >
                    +{more} more
                  </button>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
