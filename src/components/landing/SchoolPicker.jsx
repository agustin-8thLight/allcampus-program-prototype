import { useEffect, useId, useMemo, useRef, useState } from 'react'
import { SCHOOLS } from '../../data/schools.js'
import { PROGRAMS } from '../../data/model.js'
import { Eyebrow, MkButton } from './Section.jsx'

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
 *
 * 2026-08-31 client review — Brigid's find, and the highest-value change on the
 * page. The old no-match state told the truth and then sat there. Brigid: "I
 * don't want them to come in here and type in, you know, Metro State
 * University and have it not be here, and then they just leave. I want them to
 * be curious about what we could offer, even if their one school isn't here."
 * Two answers, because there are two ways to arrive at nothing:
 *   1. The typist gets a no-match state that sells (suggestions + a push).
 *   2. The scroller gets a line item at the end of the list, because Brigid's
 *      follow-up was "the only way that my fear might happen is if they don't
 *      type in it, but they just scroll the schools from there."
 * Neither one opens Ally. See the exploreValue comment below.
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

/*
 * "High value" is read off the catalog, not hand-picked (2026-08-31 review).
 * Agustin asked for "some of the high-performing schools that we know have a
 * lot of value for people in this spot"; James offered "or trending schools or
 * something like that". Trending is a claim nothing in the data can support.
 * An annual out-of-pocket tuition cap can be: it is the strongest value claim
 * in the product, and unlike a discount percentage it holds whatever we do or
 * don't know about the person's employer benefit. So the suggestions are
 * simply the schools carrying a cap, lowest cap first. Today that is exactly
 * two — Franklin ($5,250) and SNHU ($5,250), schools.js :59 and :118. Give a
 * third school a tuitionCap and it competes here on its own; nothing in this
 * component needs to change.
 */
const SUGGESTED = ALL.filter((s) => s.tuitionCap)
  .sort((a, b) => a.tuitionCap - b.tuitionCap)
  .slice(0, 2)

const usd = (n) => `$${n.toLocaleString('en-US')}`

// Why this school is here, in three words. The cap is the whole reason; the
// accreditation line that used to ride along was noise at this moment.
function whyValuable(s) {
  return `${usd(s.tuitionCap)}/yr cap`
}

export default function SchoolPicker({ value, onChange, onRequestSchool, onExploreValue }) {
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

  /*
   * Every "explore" affordance in here routes to the caller, never to Ally
   * (2026-08-31 review). James: "right now, we have Ally behind the login...
   * we don't want to be burning tokens for people who will never create an
   * account." Brigid on what the affordance is actually selling: "I think it's
   * a content thing... the chat with Ally to see if we have something of
   * better value or that's equal but more affordable." So the copy does the
   * persuading and the click goes to the account gate; Ally comes after it.
   * Nothing Ally-shaped is imported or rendered here. The caller wires
   * onExploreValue to the gate; leaving it undefined removes both affordances.
   * source tells the caller which one fired, query carries what was typed
   * (empty when they scrolled instead of typing).
   */
  const exploreValue = (source) => {
    if (!onExploreValue) return
    setOpen(false)
    onExploreValue({ source, query: q.trim() })
  }

  /*
   * Keyboard model for the new "Don't see your school?" row: it is a real
   * listbox option, parked one index past the last school.
   *
   * The row exists for the person who scrolls instead of typing, and a
   * keyboard user scrolls this list with ArrowDown. A row sitting outside the
   * listbox would be unreachable that way — findable only by Tab, which leaves
   * the combobox entirely — which is exactly the audience the row was added
   * for. As an option it inherits the whole existing model: ArrowDown and End
   * reach it, aria-activedescendant can point at it, Enter activates it, and
   * the scroll-into-view effect already handles it by id.
   *
   * -1 means there is no such row: either no onExploreValue, or the no-match
   * state, which renders a panel instead of a listbox and so has zero options.
   */
  const exploreIndex = onExploreValue && results.length > 0 ? results.length : -1
  const lastIndex = exploreIndex >= 0 ? exploreIndex : results.length - 1
  // lastIndex is -1 with zero options, so this pins active at 0 there.
  const clamp = (i) => Math.max(0, Math.min(lastIndex, i))

  const onKeyDown = (e) => {
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault()
      if (!open) { setOpen(true); return }
      const d = e.key === 'ArrowDown' ? 1 : -1
      setActive((i) => clamp(i + d))
      return
    }
    if (e.key === 'Home' && open) { e.preventDefault(); setActive(0); return }
    if (e.key === 'End' && open) { e.preventDefault(); setActive(clamp(lastIndex)); return }
    if (e.key === 'Enter' && open) {
      if (active === exploreIndex) { e.preventDefault(); exploreValue('list-row'); return }
      if (results[active]) { e.preventDefault(); choose(results[active]); return }
      // No-match state: no options, so Enter stays inert (and keeps its old
      // behaviour of not swallowing the event); the buttons in the panel are
      // reached by Tab.
      return
    }
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
            aria-activedescendant={
              open && (results[active] || active === exploreIndex) ? `${uid}-opt-${active}` : undefined
            }
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
                  /* scroll-mb keeps the sticky last row from parking on top of
                     the row the keyboard just moved to. */
                  className={`flex cursor-pointer scroll-mb-16 items-center gap-3 px-4 py-2.5 ${
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

              {/*
                CHANGE 2 (2026-08-31): the line item for the scroller. Agustin:
                "it just becomes a line item. Like, looking for something else?
                And then it has like a little AI badge, and then Ally prompts
                you." James's phrasing was "Looking for a different school or
                school not listed?"

                It is sticky rather than merely last, because a row 24 schools
                down that you only meet if you scroll all the way is no answer
                to "they just scroll the schools from there". The white li is
                the opaque layer the rows slide under; the tint lives on the
                inner div so nothing shows through it.
              */}
              {exploreIndex >= 0 && (
                <li
                  id={`${uid}-opt-${exploreIndex}`}
                  role="option"
                  aria-selected={false}
                  onMouseEnter={() => setActive(exploreIndex)}
                  onMouseDown={(e) => { e.preventDefault(); exploreValue('list-row') }}
                  className="sticky bottom-0 cursor-pointer bg-white"
                >
                  <span
                    className={`flex items-center gap-3 border-t border-mk-line px-4 py-2.5 transition ${
                      active === exploreIndex ? 'bg-mk-purple/10' : 'bg-mk-purple/5'
                    }`}
                  >
                    <span
                      className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-mk-purple text-[12px] text-white"
                      aria-hidden
                    >
                      ✦
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block font-display text-[13px] font-bold text-mk-purple">
                        Don’t see your school?
                      </span>
                      <span className="block text-[12px] text-mk-body">
                        Ally can search all {ALL.length}.
                      </span>
                    </span>
                    <span className="shrink-0 font-display text-[13px] font-bold text-mk-purple" aria-hidden>→</span>
                  </span>
                </li>
              )}
            </ul>
          ) : (
            /*
              CHANGE 1 (2026-08-31): tell the truth, then sell the value. The
              truth lines are unchanged; what follows them is new. Order is
              deliberate — two named schools with the reason they are worth a
              look, then the push to explore, then the two escapes. A person
              who came for Metro State should be able to leave this panel
              having selected Franklin, so the suggestion rows select the
              school outright rather than routing anywhere.
              max-h because the panel itself never scrolled and this state is
              now taller than a phone in landscape.
            */
            <div className="max-h-[min(70vh,460px)] overflow-y-auto px-4 py-5">
              <p className="font-display text-[15px] font-bold text-mk-slate">
                No partner school matches “{q.trim()}”.
              </p>
              {/* 2026-08-31: cut from two sentences to one. The suggestion rows
                  below say what the value is; the body only has to say the
                  school is not here. "Clarify, not confuse." */}
              <p className="mt-1 text-[13px] text-mk-body">
                Not in the network yet. These two cap what you pay.
              </p>

              {/* Guarded: if no school in the catalog carries a tuitionCap the
                  block has nothing defensible to claim, so it disappears
                  rather than inventing a reason. */}
              {SUGGESTED.length > 0 && (
                <div className="mt-4">
                  <Eyebrow>Where the money goes furthest</Eyebrow>
                  <ul className="-mx-2 mt-2">
                    {SUGGESTED.map((s) => (
                      <li key={s.id}>
                        <button
                          type="button"
                          onClick={() => choose(s)}
                          className="flex w-full items-center gap-3 rounded-lg px-2 py-2 text-left outline-offset-2 transition hover:bg-mk-band focus-visible:outline-2 focus-visible:outline-mk-teal-600"
                        >
                          <span
                            className="grid h-8 w-8 shrink-0 place-items-center rounded font-display text-[12px] font-bold text-white"
                            style={{ background: s.logoColor }}
                            aria-hidden
                          >
                            {s.logoMonogram}
                          </span>
                          <span className="min-w-0 flex-1">
                            <span className="block truncate font-display text-[13px] font-bold text-mk-slate">
                              {s.name}
                            </span>
                            <span className="block truncate text-[12px] text-mk-body">{whyValuable(s)}</span>
                          </span>
                          {s.off > 0 && (
                            <span className="shrink-0 rounded-full bg-mk-blue-50 px-2.5 py-1 font-display text-[12px] font-bold text-mk-teal-700">
                              Up to {s.off}% off
                            </span>
                          )}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {onExploreValue && (
                <div className="mt-4 flex items-start gap-3 rounded-lg border border-mk-purple/40 bg-mk-purple/5 p-3">
                  <span
                    className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-mk-purple text-[12px] text-white"
                    aria-hidden
                  >
                    ✦
                  </span>
                  <div className="min-w-0 flex-1">
                    {/* 2026-08-31: was a heading plus a 24-word explainer. One
                        line and a button. The button says what it does. */}
                    <p className="font-display text-[13px] font-bold text-mk-slate">
                      Ally can search all {ALL.length} schools for a closer match.
                    </p>
                    <MkButton tone="purple" size="sm" className="mt-2.5" onClick={() => exploreValue('no-match')}>
                      Explore with Ally
                    </MkButton>
                  </div>
                </div>
              )}

              <div className="mt-4 flex flex-wrap gap-2">
                {/* Was labelled "See all schools", which promised navigation it
                    never did — it only cleared the query. Clearing IS the right
                    behaviour here (it keeps the person in the picker rather than
                    throwing them onto another page), so the label now says what
                    happens. Caught in the 2026-08-31 handoff inventory. */}
                <button
                  type="button"
                  onMouseDown={(e) => { e.preventDefault(); setQ(''); inputRef.current?.focus() }}
                  className="rounded-lg border-2 border-mk-teal-600 bg-white px-4 py-2 font-display text-[13px] font-bold text-mk-teal-700 outline-offset-2 transition hover:bg-mk-band focus-visible:outline-2 focus-visible:outline-mk-teal-600"
                >
                  Show all {ALL.length} partner schools
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
