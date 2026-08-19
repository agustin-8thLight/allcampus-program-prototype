import { useEffect, useMemo, useRef, useState } from 'react'
import SubjectIcon from './SubjectIcon.jsx'
import { AREAS, GOALS, getArea, getSkill, getGoal, skillsForArea, programMatchesGoal } from '../../data/taxonomy.js'
import { PROGRAMS } from '../../data/model.js'

/*
 * AreaSkillSelect v2 (2026-08-18 review: the two-pane mega-menu felt "too
 * substantial and formal," and it opened on nothing — you had to click an
 * area before anything was pickable).
 *
 * Now a light tabbed dropdown that is USEFUL at zero clicks: a "Popular" tab
 * is selected by default and shows the nine outcome-shaped labels people
 * actually recognize ("Move into management", "Become a nurse practitioner"
 * — the goals data from the 2026-08-13 work, back in service exactly where
 * recognition language belongs). Area tabs sit beside it for people who
 * think in fields; each shows "All of X" plus its skills as pills with live
 * counts. Everything visible is immediately pickable.
 *
 * Value contract grows one kind: '' | 'goal:<id>' | 'area:<id>' |
 * 'skill:<id>'. Browse already supports ?goal= with a friendly applied chip,
 * so the goal path costs nothing downstream.
 *
 * Outcome labels remain DRAFT — Brigid owns the student-facing vocabulary.
 */
export default function AreaSkillSelect({ value, onChange }) {
  const [open, setOpen] = useState(false)
  const [tab, setTab] = useState('popular')
  const rootRef = useRef(null)

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

  useEffect(() => {
    if (!open) return
    const onDown = (e) => {
      if (!rootRef.current?.contains(e.target)) setOpen(false)
    }
    const onKey = (e) => e.key === 'Escape' && setOpen(false)
    document.addEventListener('mousedown', onDown)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onDown)
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  const [kind, id] = value ? value.split(':') : []
  const selectedLabel =
    kind === 'goal'
      ? getGoal(id)?.label
      : kind === 'skill'
        ? getSkill(id)?.label
        : kind === 'area'
          ? `All of ${getArea(id)?.label}`
          : 'Any area or skill'

  const openPanel = () => {
    // Resume on the tab that matches the current selection; default Popular.
    setTab(kind === 'goal' || !kind ? 'popular' : kind === 'skill' ? getSkill(id)?.areaId : id)
    setOpen((v) => !v)
  }

  const commit = (v) => {
    onChange(v)
    setOpen(false)
  }

  const pill = (active) =>
    `rounded-full border px-3 py-1.5 text-left font-display text-[13px] font-semibold transition ${
      active
        ? 'border-mk-teal-600 bg-mk-band text-mk-teal-700'
        : 'border-mk-line bg-white text-mk-slate hover:border-mk-teal-600 hover:text-mk-teal-700'
    }`

  const activeArea = tab !== 'popular' ? getArea(tab) : null

  return (
    <div ref={rootRef} className="contents">
      {/* A div, not a <label>: a label wrapping a button hijacks the button's
          accessible name. */}
      <div className="block">
        <span id="area-skill-label" className="mb-1.5 block text-[13px] font-bold text-mk-slate">
          Area of study or skill
        </span>
        <button
          type="button"
          onClick={openPanel}
          aria-haspopup="true"
          aria-expanded={open}
          aria-describedby="area-skill-label"
          className={`flex w-full items-center justify-between gap-2 rounded-md border bg-white px-3 py-2.5 text-left font-display text-[14px] transition ${
            open ? 'border-mk-teal-600' : 'border-mk-line hover:border-mk-teal-600'
          } ${value ? 'text-mk-slate' : 'text-mk-body/60'}`}
        >
          <span className="truncate">{selectedLabel}</span>
          <span className={`shrink-0 text-mk-body/60 transition ${open ? 'rotate-180' : ''}`} aria-hidden>
            ⌄
          </span>
        </button>
      </div>

      {open && (
        <div
          role="group"
          aria-label="Area of study or skill options"
          className="absolute inset-x-3 top-full z-30 mt-2 rounded-[var(--radius-card)] border border-mk-line bg-white shadow-[0_16px_40px_rgba(51,71,91,0.18)] sm:inset-x-5"
        >
          {/* Tab strip: Popular first and preselected, then the areas. */}
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

          {/* Content: everything shown is immediately pickable. */}
          <div className="max-h-[300px] overflow-y-auto p-3">
            {!activeArea ? (
              <div className="flex flex-wrap gap-2">
                {GOALS.map((g) => (
                  <button
                    key={g.id}
                    type="button"
                    onClick={() => commit(`goal:${g.id}`)}
                    className={pill(value === `goal:${g.id}`)}
                  >
                    {g.label}
                    <span className="ml-1.5 text-[11.5px] font-semibold text-mk-body/70">
                      {counts.goal[g.id] || 0}
                    </span>
                  </button>
                ))}
              </div>
            ) : (
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => commit(`area:${activeArea.id}`)}
                  className={pill(value === `area:${activeArea.id}`)}
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
                    onClick={() => commit(`skill:${s.id}`)}
                    className={pill(value === `skill:${s.id}`)}
                  >
                    {s.label}
                    <span className="ml-1.5 text-[11.5px] font-semibold text-mk-body/70">
                      {counts.skill[s.id] || 0}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
