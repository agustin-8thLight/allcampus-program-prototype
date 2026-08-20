import { useMemo, useState } from 'react'
import SubjectIcon from './SubjectIcon.jsx'
import { AREAS, GOALS, skillsForArea, programMatchesGoal } from '../../data/taxonomy.js'
import { PROGRAMS } from '../../data/model.js'

/*
 * SkillsNavigator (2026-08-19 session, the diverged homepage variant):
 * "imagine that if a dropdown kind of replaced that box above, and it
 * literally was just telling you, hey, here's popular things people are
 * looking at… we're not really trying to get them to search too much. We
 * just want to get them to find something that's close enough to something
 * they're interested in to sign up."
 *
 * The picker's panel, inline and always open, replacing the search box:
 * Popular outcomes preselected, area tabs beside it, every pill navigating
 * straight to the (gated) results. Search itself moves to the nav.
 */
export default function SkillsNavigator({ onNavigate }) {
  const [tab, setTab] = useState('popular')

  const counts = useMemo(() => {
    const area = {}
    const skill = {}
    for (const p of PROGRAMS) {
      area[p.areaId] = (area[p.areaId] || 0) + 1
      for (const s of p.skillIds || []) skill[s] = (skill[s] || 0) + 1
    }
    const goal = {}
    for (const g of GOALS) goal[g.id] = PROGRAMS.filter((p) => programMatchesGoal(p, g)).length
    return { area, skill, goal }
  }, [])

  const pill =
    'rounded-full border border-mk-line bg-white px-3 py-1.5 text-left font-display text-[13px] font-semibold text-mk-slate transition hover:border-mk-teal-600 hover:text-mk-teal-700'
  const activeArea = tab !== 'popular' ? AREAS.find((a) => a.id === tab) : null

  return (
    <div className="rounded-xl bg-white shadow-[0_10px_30px_rgba(51,71,91,0.14)]">
      <div className="flex gap-1 overflow-x-auto border-b border-mk-line px-2 pt-2">
        {[{ id: 'popular', label: 'Popular' }, ...AREAS].map((t) => {
          const active = tab === t.id
          return (
            <button
              key={t.id}
              type="button"
              onClick={() => setTab(t.id)}
              className={`flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-t-lg border-b-2 px-3 py-2 font-display text-[13px] font-bold transition ${
                active
                  ? 'border-mk-teal-600 text-mk-teal-700'
                  : 'border-transparent text-mk-body hover:text-mk-slate'
              }`}
            >
              {t.id !== 'popular' && <SubjectIcon id={t.id} className="h-[15px] w-[15px]" />}
              {t.label}
            </button>
          )
        })}
      </div>
      <div className="flex flex-wrap gap-2 p-4">
        {!activeArea ? (
          GOALS.map((g) => (
            <button
              key={g.id}
              type="button"
              onClick={() => onNavigate(`/browse?goal=${g.id}`)}
              className={pill}
            >
              {g.label}
              <span className="ml-1.5 text-[11.5px] font-semibold text-mk-body/70">
                {counts.goal[g.id] || 0}
              </span>
            </button>
          ))
        ) : (
          <>
            <button
              type="button"
              onClick={() => onNavigate(`/browse?area=${activeArea.id}`)}
              className={pill}
            >
              All of {activeArea.label}
              <span className="ml-1.5 text-[11.5px] font-semibold text-mk-body/70">
                {counts.area[activeArea.id] || 0}
              </span>
            </button>
            {skillsForArea(activeArea.id).map((s) => (
              <button
                key={s.id}
                type="button"
                onClick={() => onNavigate(`/browse?skill=${s.id}`)}
                className={pill}
              >
                {s.label}
                <span className="ml-1.5 text-[11.5px] font-semibold text-mk-body/70">
                  {counts.skill[s.id] || 0}
                </span>
              </button>
            ))}
          </>
        )}
      </div>
    </div>
  )
}
