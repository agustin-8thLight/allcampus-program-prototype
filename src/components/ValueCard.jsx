import { resolveCost } from '../data/model.js'

/*
 * Cost card (Brigid's spec). A light card with pills (discount / per-credit /
 * credits), a single primary number ("Estimated cost per term" for degrees,
 * "Total program cost" for certs), the original struck through when discounted,
 * plain-language benefit handling, and a "Talk to an advisor" link for anyone
 * who needs help estimating out-of-pocket. No calculator, no TR math.
 */
export default function ValueCard({ program, onAdvisor }) {
  const c = resolveCost(program)
  if (!c.primaryValue) return null

  return (
    <section
      className="rounded-[var(--radius-card)] border border-surface-200 bg-surface-0 p-5 text-center sm:p-6"
      aria-label="Cost"
    >
      {/* Pills */}
      {c.pills.length > 0 && (
        <div className="flex flex-wrap justify-center gap-2.5">
          {c.pills.map((pill, i) => (
            <div key={i} className="rounded-full border border-surface-200 px-4 py-1.5 leading-tight">
              <div className="text-[15px] font-black text-ink-900">{pill.big}</div>
              {pill.small && (
                <div className="text-[10px] font-semibold uppercase tracking-wide text-ink-400">{pill.small}</div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Primary number */}
      <div className="mt-5">
        <div className="text-[12px] font-bold uppercase tracking-wide text-ink-500">{c.primaryLabel}</div>
        <div className="mt-1 flex flex-wrap items-end justify-center gap-3">
          <span className="text-4xl font-black leading-none text-ink-900">{c.primaryValue}</span>
          {c.struck && (
            <span className="pb-1 text-xl font-semibold text-ink-400 line-through">{c.struck}</span>
          )}
        </div>
        {c.capLine && <p className="mt-1.5 text-[15px] font-bold text-ink-900">{c.capLine}</p>}
      </div>

      {/* Per-credit line */}
      {c.perCreditLine && (
        <p className="mt-3 text-[14px] font-bold text-ink-900">
          {c.perCreditLine}
          {c.standardRateLine && <span className="ml-1.5 font-normal text-ink-400">/ {c.standardRateLine}</span>}
        </p>
      )}

      {/* Plain-language benefit handling */}
      {c.benefitsLine && (
        <p className="mx-auto mt-3 max-w-md text-[13px] italic leading-relaxed text-ink-500">{c.benefitsLine}</p>
      )}

      {/* Deferred secondary line */}
      {c.deferred && (
        <p className="mx-auto mt-3 inline-flex items-center gap-2 rounded-lg bg-surface-100 px-3 py-1.5 text-[13px] font-semibold text-ink-700">
          <span aria-hidden>↻</span> Deferred payment available, start now and pay over time
        </p>
      )}

      {/* Advisor route for complex cases */}
      <div className="mt-4 border-t border-surface-100 pt-3 text-[14px] text-ink-700">
        Want help estimating your out-of-pocket cost?{' '}
        <button
          type="button"
          onClick={onAdvisor}
          className="font-bold text-accent-600 underline-offset-2 hover:text-accent-500 hover:underline"
        >
          Talk to an advisor
        </button>
      </div>

      {c.perTerm && (
        <p className="mt-2 text-[11px] text-ink-400">Estimates are based on a typical course load and may vary.</p>
      )}
    </section>
  )
}
