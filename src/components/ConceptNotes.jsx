import { useEffect, useRef } from 'react'
import { CloseIcon, ArrowRightIcon } from './icons.jsx'

/*
 * Concept notes for the review frame (not part of the product UI). Documents
 * the shared foundations and what makes each concept distinct, so reviewers
 * can read the design rationale alongside the live prototype.
 */

const SHARED = [
  'Single CTA opens a chooser (request info / talk to a specialist / contact the school). A confirmation gate guards ONLY the contact-school path, so a lead never reaches the school until the user confirms. Direct-handoff schools skip the chooser and link straight out.',
  'Value card states one "what this costs you" line from the three levers (discount, deferred payment, employer benefit) with a fallback hierarchy. An always-visible estimate caveat (AAA contrast) sits on it; detailed assumptions live behind "See full terms".',
  'Normalized data: one value model, standardized start dates, and a school entity (accreditation, completion rate, location) surfaced consistently. No off-site links, the page is meant to convert.',
  'Ally is a program-scoped AI that lives as a view inside the same drawer (with a back control and program context), never contacts the school on its own, and routes its "Request information" into the same chooser. Cost/eligibility answers carry a verify note; outcome questions admit missing data rather than invent it.',
]

// Prerequisites to confirm together before a concept ships. Phrased as neutral
// starting points to align on, not assumptions about what exists today.
const SHARED_DEPS = [
  'Structured program content. These screens populate from program-level data (descriptions, costs, dates, requirements, and so on) held in a structured, queryable form. A useful first step is confirming together what content exists today, where it lives, and how it stays current, rather than assuming any given field is in place.',
  'Field names aligned with the build’s content types. The names in this prototype are a best guess and should be matched up before build.',
  'Request-information backend: create the program interest, mark it Information Requested, track origin (Search / Ally), send to HubSpot, and route logged-out users to sign up / log in, then resume.',
  'Routing config: which schools hand off directly to their own funnel, and each program’s application URL.',
  'Benefits-specialist scheduling integration (the booking calendar).',
  'Final copy for CTAs and flow steps (placeholders today).',
]

const CONCEPTS = [
  {
    code: '1A',
    name: 'Baseline',
    tagline: "Today's content, reordered cost-first. Lowest effort.",
    idea: 'The smallest meaningful change from the current app: reorder existing content cost-first, collapse the competing CTAs into one, and rebuild the cost display as the value card.',
    decisions: [
      'Keeps the discount badge in the drawer bar.',
      'Cost leads, directly under the title.',
      'Traditional sections (About, Benefits, Admission, Curriculum). No Ally.',
    ],
    bestFor: 'Fastest to ship and maintain; the safe default.',
    tradeoff: 'Beyond reordering, it does not address the under-served questions (outcomes, fit, trust).',
    deps: ['Works with the program content already shown today; nothing beyond the shared prerequisites above.'],
  },
  {
    code: '2B',
    name: 'Guided',
    tagline: 'Structured page with school trust signals and Ally as a helper.',
    idea: 'The full structured page, done completely. Adds the normalized school trust panel and an inline "Ask Ally" prompt, ordered around the decision the user is making.',
    decisions: [
      'Drops the badge; the value card carries the affordability story.',
      'School panel surfaces accreditation + completion rate to answer "is this legit and worth it".',
      'Ally is present but optional, a helper alongside the content.',
    ],
    bestFor: 'Users who want to read and verify. Serves the New Learner and Career Changer trust needs.',
    tradeoff: 'More to build and maintain, and it is still fundamentally a reading task.',
    deps: [
      'A normalized cost model so out-of-pocket, discount, and deferred figures resolve the same way across schools.',
      'School-level details (accreditation, completion rate, location) sourced and confirmed with each school. The values shown here are placeholder.',
      'Answering questions about a single program is a new capability to build (scoped retrieval, supporting tools, and guardrails). It can only draw on program content that is available in a structured form, and where something isn’t available it should say so plainly rather than infer.',
      'Cost and eligibility answers need a human-review step, and Ally’s next step routes into the same chooser and gate.',
    ],
  },
  {
    code: '2C',
    name: 'Ask-First',
    tagline: 'The questions people ask, answered up front, with Ally as the spine.',
    idea: 'A departure. Instead of sections to read and interpret, the page leads with the questions people actually ask, answered up front from program data, with Ally as the primary way to go deeper.',
    decisions: [
      'Replaces sectioned reading with a question accordion (fit, employer benefit, admission, outcomes).',
      'Ally is the spine, not a side prompt.',
      'No persona model required, it just answers the common questions for everyone.',
    ],
    bestFor: 'The Explorer and anyone who would rather ask than read. Tests the "ask vs read" hypothesis.',
    tradeoff: 'The biggest departure; leans hardest on Ally answer quality and the human-review guardrail for cost, eligibility, and outcomes.',
    deps: [
      'Everything Guided needs, with a higher bar on answer quality since the assistant carries the page rather than assisting it.',
      'Up-front answers about outcomes (like where a program can lead) depend on that information being available and agreed accurate. Where it isn’t, the answer should say so plainly rather than estimate.',
      'The up-front Q&A is drawn from available program content and human-reviewed before it goes live.',
    ],
  },
]

export default function ConceptNotes({ activeCode, onSelect, onClose }) {
  const panelRef = useRef(null)

  // Focus trap: focus into the dialog on open, keep Tab inside, Escape closes,
  // and restore focus to the trigger on close.
  useEffect(() => {
    const previouslyFocused = document.activeElement
    const panel = panelRef.current
    const focusables = () =>
      Array.from(
        panel?.querySelectorAll(
          'button, a[href], input, [tabindex]:not([tabindex="-1"])',
        ) || [],
      )
    focusables()[0]?.focus()

    const onKey = (e) => {
      if (e.key === 'Escape') {
        onClose?.()
        return
      }
      if (e.key !== 'Tab') return
      const f = focusables()
      if (!f.length) return
      const first = f[0]
      const last = f[f.length - 1]
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault()
        last.focus()
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault()
        first.focus()
      }
    }
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('keydown', onKey)
      previouslyFocused?.focus?.()
    }
  }, [onClose])

  return (
    <div className="fixed inset-0 z-[70] flex justify-center overflow-y-auto bg-ink-900/60 p-4 sm:p-8">
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label="Concept notes"
        className="my-auto w-full max-w-3xl rounded-2xl bg-surface-0 shadow-2xl"
      >
        <div className="flex items-center justify-between border-b border-surface-200 px-6 py-4">
          <div>
            <h2 className="text-lg font-black text-ink-900">Concept notes</h2>
            <p className="text-[13px] text-ink-500">Design rationale and what makes each concept different.</p>
          </div>
          <button
            onClick={onClose}
            aria-label="Close notes"
            className="flex h-9 w-9 items-center justify-center rounded-full text-ink-500 hover:bg-surface-100"
          >
            <CloseIcon className="text-xl" />
          </button>
        </div>

        <div className="px-6 py-5">
          {/* Shared foundations */}
          <section className="mb-6">
            <h3 className="mb-2 text-[13px] font-bold uppercase tracking-wide text-ink-500">
              Shared across all concepts
            </h3>
            <ul className="space-y-2">
              {SHARED.map((s, i) => (
                <li key={i} className="flex gap-2 text-[14px] leading-relaxed text-ink-700">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-400" />
                  <span>{s}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* Technical dependencies common to all concepts */}
          <section className="mb-6 rounded-xl border border-amber-200 bg-amber-50/50 p-4">
            <h3 className="mb-2 text-[13px] font-bold uppercase tracking-wide text-amber-700">
              Dependencies to confirm together, every concept
            </h3>
            <p className="mb-2 text-[13px] text-ink-500">
              Starting points to align on before a concept ships, not assumptions about the current
              state of any system or content. Worth confirming with the build team first.
            </p>
            <ul className="space-y-2">
              {SHARED_DEPS.map((d, i) => (
                <li key={i} className="flex gap-2 text-[14px] leading-relaxed text-ink-700">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-400" />
                  <span>{d}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* Per-concept */}
          <div className="space-y-4">
            {CONCEPTS.map((c) => {
              const active = c.code === activeCode
              return (
                <section
                  key={c.code}
                  className={`rounded-xl border p-4 ${active ? 'border-brand-300 bg-brand-50/40' : 'border-surface-200'}`}
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-baseline gap-2">
                      <h3 className="text-[17px] font-black text-ink-900">{c.name}</h3>
                      <span className="text-[12px] font-semibold text-ink-400">{c.code}</span>
                      {active && (
                        <span className="rounded-full bg-brand-600 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white">
                          Viewing
                        </span>
                      )}
                    </div>
                    {!active && (
                      <button
                        onClick={() => {
                          onSelect?.(c.code)
                          onClose?.()
                        }}
                        className="inline-flex items-center gap-1 text-[13px] font-bold text-brand-600 hover:text-brand-700"
                      >
                        View this <ArrowRightIcon className="text-sm" />
                      </button>
                    )}
                  </div>
                  <p className="mt-1 text-[14px] italic text-ink-500">{c.tagline}</p>
                  <p className="mt-3 text-[14px] leading-relaxed text-ink-700">{c.idea}</p>

                  <div className="mt-3 text-[13px] font-bold uppercase tracking-wide text-ink-500">Key decisions</div>
                  <ul className="mt-1.5 space-y-1.5">
                    {c.decisions.map((d, i) => (
                      <li key={i} className="flex gap-2 text-[14px] text-ink-700">
                        <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-ink-300" />
                        <span>{d}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="mt-3 grid gap-2 sm:grid-cols-2">
                    <p className="text-[13px] leading-relaxed text-ink-700">
                      <span className="font-bold text-ink-900">Best for: </span>
                      {c.bestFor}
                    </p>
                    <p className="text-[13px] leading-relaxed text-ink-700">
                      <span className="font-bold text-ink-900">Tradeoff: </span>
                      {c.tradeoff}
                    </p>
                  </div>

                  <div className="mt-3 border-t border-surface-200 pt-3">
                    <div className="text-[13px] font-bold uppercase tracking-wide text-ink-500">
                      Also needs to work
                    </div>
                    <ul className="mt-1.5 space-y-1.5">
                      {c.deps.map((d, i) => (
                        <li key={i} className="flex gap-2 text-[13px] leading-relaxed text-ink-700">
                          <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-400" />
                          <span>{d}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </section>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
