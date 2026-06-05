import { useEffect, useRef, useState } from 'react'
import App from '../App.jsx'
import ConceptNotes from './ConceptNotes.jsx'
import CtaCompare from './CtaCompare.jsx'

/*
 * Prototype review frame. This is NOT part of the AllCampus product UI, it is
 * the harness reviewers use to switch concepts and read the design rationale.
 * It owns the active variant and renders the real App beneath a slim dark bar
 * so the product chrome stays clean.
 */
const VARIANTS = [
  { code: '1A', name: 'Baseline', tagline: "Today's content, reordered cost-first. The lighter, no-Ally fallback." },
  { code: '2B', name: 'Guided', tagline: 'Cost clarity, who-it’s-for, school highlights, advisor. Favored direction.' },
]

function initialVariant() {
  const v = new URLSearchParams(window.location.search).get('variant')
  return VARIANTS.some((x) => x.code === v) ? v : '2B'
}

export default function PrototypeFrame() {
  const [variant, setVariant] = useState(initialVariant)
  const [notesOpen, setNotesOpen] = useState(
    () => new URLSearchParams(window.location.search).get('notes') === '1',
  )
  const [compareOpen, setCompareOpen] = useState(
    () => new URLSearchParams(window.location.search).get('compare') === '1',
  )
  const active = VARIANTS.find((v) => v.code === variant)

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
              <span className={`ml-1 text-[10px] ${variant === v.code ? 'text-ink-400' : 'text-white/40'}`}>
                {v.code}
              </span>
            </button>
          ))}
        </div>

        <span className="hidden flex-1 truncate text-[12px] text-white/55 lg:block">{active?.tagline}</span>

        <div className="ml-auto flex items-center gap-2">
          <button
            onClick={() => setCompareOpen(true)}
            className="rounded-lg border border-white/25 px-3 py-1.5 text-[13px] font-bold text-white transition hover:bg-white/10"
          >
            Compare next step
          </button>
          <button
            onClick={() => setNotesOpen(true)}
            className="rounded-lg border border-white/25 px-3 py-1.5 text-[13px] font-bold text-white transition hover:bg-white/10"
          >
            Concept notes
          </button>
        </div>
      </div>

      {/* The real product, offset below the bar */}
      <div className="pt-12">
        <App variant={variant} />
      </div>

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
            <span className="text-white/50">{toast.code}</span>
            <span className="font-normal text-white/60">, open a program to see it</span>
          </div>
        </div>
      )}
    </>
  )
}
