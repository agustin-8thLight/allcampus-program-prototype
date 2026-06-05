import { useEffect, useRef } from 'react'
import { CloseIcon, ArrowRightIcon } from './icons.jsx'

/*
 * Concept notes for the review frame (not part of the product UI). Documents
 * the shared foundations and what makes each concept distinct, so reviewers
 * can read the design rationale alongside the live prototype.
 */

const SHARED = [
  'One primary CTA, "Get Program Details", opens a three-way choice: talk to the school, compare your options with an AllCampus advisor, or apply now. Talking to the school is gated, nothing is shared until the user confirms.',
  'Cost is shown simply: an estimated cost per term (total cost for certificates), the discount with the original struck through, and plain-language benefit handling. No calculator and no out-of-pocket math; anyone who needs help estimating is routed to an advisor.',
  'Affordability-first search: visible quick filters (most affordable, lowest cost per credit, deferred tuition, fastest). Deferred is also a card tag with an info tooltip.',
]

// Prerequisites to confirm together before a concept ships. Phrased as neutral
// starting points to align on, not assumptions about what exists today.
const SHARED_DEPS = [
  'Structured program content. These screens populate from program-level data (descriptions, costs, dates, requirements, and so on) held in a structured, queryable form. A useful first step is confirming together what content exists today, where it lives, and how it stays current, rather than assuming any given field is in place.',
  'Field names aligned with the build’s content types. The names in this prototype are a best guess and should be matched up before build.',
  'On "Get Program Details", create the deal/record in HubSpot, and route logged-out users to sign up / log in, then resume.',
  'Routing + contact config: each program’s application URL, the advisor scheduling link, and AllCampus contact details.',
  'Final copy for CTAs and flow steps (placeholders today).',
]

const CONCEPTS = [
  {
    code: '2B',
    name: 'Guided',
    tagline: 'Cost clarity, who-it’s-for, school highlights, and an advisor route. Favored direction.',
    idea: 'The fuller program page: the simplified cost card, a "Who this program is for" section so users self-select early, School Highlights, and a "Talk to an advisor" prompt for anyone who needs guidance.',
    decisions: [
      'Cost card is the primary affordability story (per-term / total, discount, simple language).',
      'Adds "Who this program is for" and up to three School Highlights.',
      'v1 routes "have questions" to an advisor; an in-page assistant (Ally) is a later phase.',
    ],
    bestFor: 'Users who want enough context to feel confident, then a clear next step.',
    tradeoff: 'A bit more to build and maintain than Baseline.',
    deps: [
      'Up to three school highlights per school (the fields AllCampus can populate). The ones shown here are placeholder.',
      '"Who this program is for" content per program.',
      'Advisor scheduling link + AllCampus contact details.',
    ],
  },
  {
    code: '1A',
    name: 'Baseline',
    tagline: "Today's content, reordered cost-first. The lighter, no-Ally fallback.",
    idea: 'The smallest meaningful change: reorder existing content cost-first, collapse the competing CTAs into "Get Program Details", and use the same simplified cost card. No advisor section, no school highlights, no Ally, so it can ship without any of that work.',
    decisions: [
      'Cost leads, directly under the title.',
      'Traditional sections (About, Benefits, Admission, Curriculum).',
      'No dependency on Ally or new school content.',
    ],
    bestFor: 'Fastest to ship and maintain; a safe next step that needs no Ally work.',
    tradeoff: 'Does less to build confidence than Guided (no who-it’s-for or school highlights).',
    deps: ['Works with the program content already shown today; nothing beyond the shared prerequisites above.'],
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
