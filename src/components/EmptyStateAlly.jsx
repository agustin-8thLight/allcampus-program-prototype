import { useEffect, useState } from 'react'
import { AREAS, getArea } from '../data/taxonomy.js'
import { emitStoryEvent } from '../data/useCases.js'
import { useToast } from './Toast.jsx'
import { SparkleIcon } from './icons.jsx'
import AllyOverlay from './AllyOverlay.jsx'

/*
 * The empty-results state (move 4). Replaces the old dead end. Three jobs:
 *  1. Tell the truth: the query found nothing — never blame unset filters.
 *  2. Offer real ways forward: related areas, request-the-program.
 *  3. Hand off to Ally, carrying the person's exact words. Every miss is
 *     "logged" (toast stands in for the real search-miss capture that feeds
 *     the 70%-who-don't-convert question).
 * Ally's replies are canned; a real build wires the model + shared cost engine.
 */
export default function EmptyStateAlly({ query, partner, hasFilters, onPickArea, onCoveredOnly }) {
  const { showToast } = useToast()
  const [allyOpen, setAllyOpen] = useState(false)
  useEffect(() => {
    emitStoryEvent('empty-state', { query })
  }, [query])

  const q = query?.trim()
  const related = AREAS.filter((a) => !(partner?.hiddenAreaIds || []).includes(a.id)).slice(0, 3)
  const suggested = partner?.emphasizedAreaIds?.length
    ? partner.emphasizedAreaIds.map(getArea).filter(Boolean).slice(0, 3)
    : related

  const benefitLine = partner?.benefitKnown && partner.employerReimbursement > 0
    ? `Want me to check what the ${partner.name} benefit covers in nearby fields?`
    : 'Want me to look at low-cost options in nearby fields?'

  return (
    <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
      {/* Honest empty state */}
      <div>
        <h2 className="text-2xl font-black text-ink-900">
          {q ? <>No programs match “{q}” yet</> : 'No programs match these filters'}
        </h2>
        <p className="mt-2 text-[15px] text-ink-600">
          {q
            ? `We checked the full catalog. ${hasFilters ? 'Your filters are still applied — clearing them may widen results.' : 'No filters are limiting this search.'}`
            : 'Try removing a filter or two.'}
        </p>
        {q && (
          <>
            <p className="mt-5 text-[13px] font-bold uppercase tracking-wide text-ink-500">
              Close areas of study
            </p>
            <div className="mt-2 flex flex-wrap gap-2">
              {suggested.map((a) => (
                <button
                  key={a.id}
                  onClick={() => onPickArea?.(a.id)}
                  className="rounded-full border border-surface-200 bg-surface-0 px-4 py-2 text-[14px] font-semibold text-ink-700 transition hover:border-brand-300"
                >
                  {a.label}
                </button>
              ))}
            </div>
            <button
              onClick={() =>
                showToast({
                  tone: 'good',
                  title: 'Request logged',
                  body: `We saved “${q}” so the team can see what people search for and don’t find. You’ll hear back if it’s added.`,
                })
              }
              className="mt-4 rounded-lg bg-brand-600 px-4 py-2.5 text-[14px] font-bold text-white transition hover:bg-brand-700"
            >
              Request this program
            </button>
          </>
        )}
      </div>

      {/* Ally, auto-opened with the query as context */}
      {q && (
        <div className="rounded-2xl border border-mk-purple/40 bg-mk-purple/5 p-5">
          <div className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-mk-purple text-white">
              <SparkleIcon className="text-base" />
            </span>
            <span className="font-black text-ink-900">Ally</span>
          </div>
          <p className="mt-3 text-[15px] leading-relaxed text-ink-800">
            “Nothing matched <span className="font-bold">{q}</span> — I can help.{' '}
            {q.toLowerCase().includes('weld')
              ? 'Welding itself isn’t in the catalog, but Industrial & Systems Engineering programs give credit for trade experience like yours.'
              : benefitLine}
            ”
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            <button
              onClick={() => {
                emitStoryEvent('ally-related')
                onPickArea?.('engineering')
              }}
              className="rounded-full border border-mk-purple/50 bg-white px-4 py-2 text-[14px] font-bold text-mk-purple transition hover:bg-mk-purple/10"
            >
              {q.toLowerCase().includes('weld') ? 'Show Industrial & Systems' : 'Check related fields'}
            </button>
            <button
              onClick={() => {
                emitStoryEvent('ally-related')
                onCoveredOnly?.()
              }}
              className="rounded-full border border-mk-purple/50 bg-white px-4 py-2 text-[14px] font-bold text-mk-purple transition hover:bg-mk-purple/10"
            >
              What does my benefit cover?
            </button>
          </div>
          <button
            onClick={() => setAllyOpen(true)}
            className="mt-4 w-full rounded-lg bg-mk-purple px-4 py-2.5 text-[14px] font-bold text-white transition hover:opacity-90"
          >
            Keep talking to Ally →
          </button>
          <p className="mt-3 text-[12px] text-ink-400">
            Same assistant, before and after joining. Cost answers use the shared, verified estimate
            — Ally never improvises a number.
          </p>
        </div>
      )}

      <AllyOverlay
        open={allyOpen}
        partner={partner}
        seedQuestionId="oop"
        onClose={() => setAllyOpen(false)}
      />
    </div>
  )
}
