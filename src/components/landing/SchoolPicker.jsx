import { useEffect, useId, useMemo, useRef, useState } from 'react'
import { SCHOOLS } from '../../data/schools.js'
import { PROGRAMS } from '../../data/model.js'

/*
 * School picker for the hero (2026-08-28 review: "we have a dropdown that
 * shows the schools if you're interested in a specific school").
 *
 * A type-ahead combobox, not a <select>. Brigid's read of the majority case is
 * that "most people probably already have a school in mind and are looking for
 * a discount" — so the job is find mine and confirm the discount, not browse.
 * A 24-row native select (50+ in production) gives no room for the discount,
 * which is the only reason the school is being chosen here.
 *
 * Each row carries the school's best discount because that is the answer the
 * person came for. Figures come from the mock catalog and are representative.
 *
 * The no-match state follows the same three jobs as EmptyStateAlly (§8, and
 * pain point P5): tell the truth, offer a way forward, never dead-end.
 */

// Best percentage off across a school's catalog. Representative mock data.
function bestDiscount(schoolId) {
  let pct = 0
  for (const p of PROGRAMS) {
    if (p.schoolId !== schoolId) continue
    pct = Math.max(pct, p.discount?.percentUsed || 0)
  }
  return pct
}

const ALL = Object.values(SCHOOLS)
  .map((s) => ({ ...s, off: bestDiscount(s.id) }))
  .sort((a, b) => a.name.localeCompare(b.name))

export default function SchoolPicker({ value, onChange, onRequestSchool }) {
  const [open, setOpen] = useState(false)
  const [q, setQ] = useState('')
  const [active, setActive] = useState(0)
  const rootRef = useRef(null)
  const inputRef = useRef(null)
  const listRef = useRef(null)
  const uid = useId()

  const selected = value ? SCHOOLS[value] : null

  // Filter on name and monogram so "TW" finds Texas Wesleyan.
  const results = useMemo(() => {
    const t = q.trim().toLowerCase()
    if (!t) return ALL
    return ALL.filter(
      (s) => s.name.toLowerCase().includes(t) || s.logoMonogram.toLowerCase().startsWith(t),
    )
  }, [q])

  useEffect(() => setActive(0), [q])

  useEffect(() => {
    if (!open) return
    const onDoc = (e) => { if (!rootRef.current?.contains(e.target)) setOpen(false) }
    document.addEventListener('mousedown', onDoc)
    return () => document.removeEventListener('mousedown', onDoc)
  }, [open])

  // Keep the active row in view without moving focus off the input.
  useEffect(() => {
    if (!open) return
    listRef.current?.querySelector(`#${CSS.escape(`${uid}-opt-${active}`)}`)
      ?.scrollIntoView({ block: 'nearest' })
  }, [active, open, uid])

  const choose = (s) => {
    onChange(s.id)
    setQ('')
    setOpen(false)
    inputRef.current?.focus()
  }

  const clear = () => {
    onChange(null)
    setQ('')
    setOpen(true)
    inputRef.current?.focus()
  }

  const onKeyDown = (e) => {
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault()
      if (!open) { setOpen(true); return }
      const d = e.key === 'ArrowDown' ? 1 : -1
      setActive((i) => Math.min(results.length - 1, Math.max(0, i + d)))
      return
    }
    if (e.key === 'Home' && open) { e.preventDefault(); setActive(0); return }
    if (e.key === 'End' && open) { e.preventDefault(); setActive(results.length - 1); return }
    if (e.key === 'Enter' && open && results[active]) { e.preventDefault(); choose(results[active]); return }
    if (e.key === 'Escape' && open) { e.preventDefault(); setOpen(false) }
  }

  const listboxId = `${uid}-listbox`

  return (
    <div ref={rootRef} className="contents">
      <div className="block">
        <span id={`${uid}-label`} className="mb-1.5 block text-[13px] font-bold text-mk-slate">
          School
        </span>

        <div
          className={`flex w-full items-center gap-2 rounded-md border bg-white px-3 py-2.5 transition ${
            open ? 'border-mk-teal-600' : 'border-mk-line hover:border-mk-teal-600'
          }`}
        >
          {selected && (
            <span
              className="grid h-6 w-6 shrink-0 place-items-center rounded font-display text-[11px] font-bold text-white"
              style={{ background: selected.logoColor }}
              aria-hidden
            >
              {selected.logoMonogram}
            </span>
          )}
          <input
            ref={inputRef}
            id={`${uid}-input`}
            type="text"
            role="combobox"
            aria-expanded={open}
            aria-controls={listboxId}
            aria-autocomplete="list"
            aria-labelledby={`${uid}-label`}
            aria-activedescendant={open && results[active] ? `${uid}-opt-${active}` : undefined}
            autoComplete="off"
            value={open ? q : selected ? selected.name : q}
            placeholder={selected ? '' : 'Any school'}
            onFocus={() => setOpen(true)}
            onChange={(e) => { setQ(e.target.value); setOpen(true) }}
            onKeyDown={onKeyDown}
            className="w-full min-w-0 bg-transparent font-display text-[15px] text-mk-slate outline-none placeholder:text-mk-body/60"
          />
          {selected ? (
            <button
              type="button"
              onClick={clear}
              aria-label={`Clear ${selected.name}`}
              className="shrink-0 rounded px-1 text-mk-body/60 outline-offset-2 transition hover:text-mk-slate focus-visible:outline-2 focus-visible:outline-mk-teal-600"
            >
              ✕
            </button>
          ) : (
            <span className={`shrink-0 text-mk-body/60 transition ${open ? 'rotate-180' : ''}`} aria-hidden>⌄</span>
          )}
        </div>
      </div>

      {open && (
        <div className="absolute inset-x-3 top-full z-30 mt-2 overflow-hidden rounded-[var(--radius-card)] border border-mk-line bg-white shadow-[0_16px_40px_rgba(51,71,91,0.18)] sm:inset-x-5">
          {results.length > 0 ? (
            <ul
              ref={listRef}
              id={listboxId}
              role="listbox"
              aria-labelledby={`${uid}-label`}
              className="max-h-[min(56vh,360px)] overflow-y-auto py-1"
            >
              {results.map((s, i) => (
                <li
                  key={s.id}
                  id={`${uid}-opt-${i}`}
                  role="option"
                  aria-selected={value === s.id}
                  onMouseEnter={() => setActive(i)}
                  onMouseDown={(e) => { e.preventDefault(); choose(s) }}
                  className={`flex cursor-pointer items-center gap-3 px-4 py-2.5 ${
                    i === active ? 'bg-mk-band' : ''
                  }`}
                >
                  <span
                    className="grid h-8 w-8 shrink-0 place-items-center rounded font-display text-[12px] font-bold text-white"
                    style={{ background: s.logoColor }}
                    aria-hidden
                  >
                    {s.logoMonogram}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate font-display text-[15px] font-bold text-mk-slate">{s.name}</span>
                    <span className="block truncate text-[13px] text-mk-body">{s.location}</span>
                  </span>
                  {s.off > 0 && (
                    <span className="shrink-0 rounded-full bg-mk-blue-50 px-2.5 py-1 font-display text-[12px] font-bold text-mk-teal-700">
                      Up to {s.off}% off
                    </span>
                  )}
                </li>
              ))}
            </ul>
          ) : (
            /* Tell the truth, then offer a way forward. Never a dead end. */
            <div className="px-4 py-5">
              <p className="font-display text-[15px] font-bold text-mk-slate">
                No partner school matches “{q.trim()}”.
              </p>
              <p className="mt-1 text-[13px] text-mk-body">
                That school isn’t in the AllCampus network yet, so there’s no discount to activate there.
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                <button
                  type="button"
                  onMouseDown={(e) => { e.preventDefault(); setQ(''); inputRef.current?.focus() }}
                  className="rounded-lg border-2 border-mk-teal-600 bg-white px-4 py-2 font-display text-[13px] font-bold text-mk-teal-700 outline-offset-2 transition hover:bg-mk-band focus-visible:outline-2 focus-visible:outline-mk-teal-600"
                >
                  See all schools
                </button>
                {onRequestSchool && (
                  <button
                    type="button"
                    onMouseDown={(e) => { e.preventDefault(); onRequestSchool(q.trim()); setOpen(false) }}
                    className="rounded-lg border-2 border-transparent bg-mk-teal-600 px-4 py-2 font-display text-[13px] font-bold text-white outline-offset-2 transition hover:bg-mk-teal-700 focus-visible:outline-2 focus-visible:outline-mk-teal-600"
                  >
                    Ask about this school
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
