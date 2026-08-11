import { useEffect, useRef, useState } from 'react'
import App from '../App.jsx'
import LandingPage from '../pages/LandingPage.jsx'
import SchoolPage from '../pages/SchoolPage.jsx'
import ConceptNotes from './ConceptNotes.jsx'
import CtaCompare from './CtaCompare.jsx'
import { CORPORATE_PARTNERS, EMPLOYER_STATES } from '../data/corporatePartners.js'

/*
 * Prototype review frame. This is NOT part of the AllCampus product UI, it is
 * the harness reviewers use to switch concepts and read the design rationale.
 * It owns the active variant, the demo employer state, and the hash router,
 * and renders the real pages beneath a slim dark bar.
 *
 * Routes (hash-based so GitHub Pages needs no redirect rules):
 *   #/                     redesigned landing page (2026-08-11 direction)
 *   #/browse?...           the program search/browse surface (original App)
 *   #/school/<id>          school page scoped to one partner school
 *
 * Employer demo states (?employer= override): duncan-avn (known benefit,
 * engineering-skewed), acme-edu (known benefit, default mix), global-default
 * (unknown benefit fallback). In production this comes from the learner
 * record or partner-branded URL, never a switcher.
 */
const VARIANTS = [
  { code: '1A', name: 'Phase 1', tagline: 'Ships first: cost-first program detail and an advisor. No Ally.' },
  { code: '2B', name: 'Phase 2', tagline: 'Adds Ally, “who it’s for”, and school highlights. The fuller experience.' },
]

function initialVariant() {
  const v = new URLSearchParams(window.location.search).get('variant')
  return VARIANTS.some((x) => x.code === v) ? v : '2B'
}

function initialEmployer() {
  const e = new URLSearchParams(window.location.search).get('employer')
  return CORPORATE_PARTNERS[e] ? e : 'duncan-avn'
}

function parseHash() {
  const raw = window.location.hash.replace(/^#/, '') || '/'
  const [path, qs] = raw.split('?')
  return { path: path || '/', params: new URLSearchParams(qs || ''), raw }
}

export default function PrototypeFrame() {
  const [variant, setVariant] = useState(initialVariant)
  const [employerId, setEmployerId] = useState(initialEmployer)
  const [route, setRoute] = useState(parseHash)
  const [notesOpen, setNotesOpen] = useState(
    () => new URLSearchParams(window.location.search).get('notes') === '1',
  )
  const [compareOpen, setCompareOpen] = useState(
    () => new URLSearchParams(window.location.search).get('compare') === '1',
  )
  const active = VARIANTS.find((v) => v.code === variant)
  const partner = CORPORATE_PARTNERS[employerId]

  useEffect(() => {
    const onHash = () => setRoute(parseHash())
    window.addEventListener('hashchange', onHash)
    return () => window.removeEventListener('hashchange', onHash)
  }, [])

  const navigate = (path) => {
    window.location.hash = `#${path}`
  }

  // Concepts only differ inside the program drawer, so a switch is invisible on
  // the list. A brief toast confirms the change took. Keyed so re-selecting the
  // same concept still re-triggers it; skipped on initial load.
  const [toast, setToast] = useState(null)
  const firstRun = useRef(true)
  useEffect(() => {
    if (firstRun.current) {
      firstRun.current = false
      return
    }
    setToast({ ...active, k: Date.now() })
    const t = setTimeout(() => setToast(null), 1800)
    return () => clearTimeout(t)
  }, [variant])

  let page
  if (route.path.startsWith('/school/')) {
    const schoolId = route.path.split('/')[2]
    page = <SchoolPage schoolId={schoolId} partner={partner} onNavigate={navigate} />
  } else if (route.path === '/browse') {
    // Keyed by the raw hash so a new search from the landing page re-seeds filters.
    page = <App key={route.raw} variant={variant} partner={partner} initialParams={route.params} />
  } else {
    page = <LandingPage partner={partner} onNavigate={navigate} />
  }

  return (
    <>
      {/* Review bar (meta chrome, sits above the product) */}
      <div className="fixed inset-x-0 top-0 z-[60] flex h-12 items-center gap-3 bg-ink-900 px-3 text-white sm:px-4">
        <span className="hidden text-[10px] font-bold uppercase tracking-[0.2em] text-white/45 sm:block">
          Prototype
        </span>

        <div className="flex items-center gap-1 rounded-full bg-white/10 p-0.5">
          {VARIANTS.map((v) => (
            <button
              key={v.code}
              onClick={() => setVariant(v.code)}
              title={v.tagline}
              className={`rounded-full px-3 py-1 text-[13px] font-bold transition ${
                variant === v.code ? 'bg-white text-ink-900' : 'text-white/70 hover:text-white'
              }`}
            >
              {v.name}
            </button>
          ))}
        </div>

        {/* Employer demo state (review-only; production reads the learner record) */}
        <div className="flex items-center gap-1 rounded-full bg-white/10 p-0.5">
          {EMPLOYER_STATES.map((e) => (
            <button
              key={e.id}
              onClick={() => setEmployerId(e.id)}
              title={e.tagline}
              className={`rounded-full px-3 py-1 text-[12px] font-bold transition ${
                employerId === e.id ? 'bg-white text-ink-900' : 'text-white/70 hover:text-white'
              }`}
            >
              {e.label}
            </button>
          ))}
        </div>

        <span className="hidden flex-1 truncate text-[12px] text-white/55 xl:block">
          {active?.tagline}
        </span>

        <div className="ml-auto flex items-center gap-2">
          <button
            onClick={() => setCompareOpen(true)}
            className="hidden rounded-lg border border-white/25 px-3 py-1.5 text-[13px] font-bold text-white transition hover:bg-white/10 md:block"
          >
            Compare next step
          </button>
          <button
            onClick={() => setNotesOpen(true)}
            className="rounded-lg border border-white/25 px-3 py-1.5 text-[13px] font-bold text-white transition hover:bg-white/10"
          >
            Phase notes
          </button>
        </div>
      </div>

      {/* The real product, offset below the bar */}
      <div className="pt-12">{page}</div>

      {notesOpen && (
        <ConceptNotes
          activeCode={variant}
          onSelect={setVariant}
          onClose={() => setNotesOpen(false)}
        />
      )}

      {compareOpen && <CtaCompare onClose={() => setCompareOpen(false)} />}

      {/* Concept-switch confirmation toast (auto-clears). */}
      {toast && (
        <div
          key={toast.k}
          role="status"
          className="toast pointer-events-none fixed left-3 top-14 z-[80] sm:left-4"
        >
          <div className="flex items-center gap-2 rounded-full bg-ink-900 px-4 py-2 text-[13px] font-bold text-white shadow-lg">
            <span className="h-2 w-2 rounded-full bg-brand-400" />
            Showing: {toast.name}
            <span className="font-normal text-white/60">, open a program to see it</span>
          </div>
        </div>
      )}
    </>
  )
}
