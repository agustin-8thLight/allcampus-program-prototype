import { resolveCost } from '../data/model.js'
import { InfoIcon } from './icons.jsx'

/*
 * Cost card. Hierarchy (James 06.13, refined 06.17 review):
 *   - degrees + credit-bearing certs lead with the PER-CREDIT rate (hero),
 *     with the standard rate struck through. The per-class estimate rides up top
 *     as an estimate pill (above the hero), not a small line below.
 *   - flat-upfront certs lead with the TOTAL program price + a one-time
 *     payment indicator.
 *   - capped programs lead with the per-credit rate + a cap pill + caption, and
 *     keep the per-class estimate pill (so "3 classes ≈ the cap" reads clearly).
 * Pills carry: per-class estimate, savings (cap/discount), credit count (with a
 * transfer-credit tooltip on Associate / Bachelor's), and deferred tuition.
 * No calculator, no TR math.
 */
export default function ValueCard({ program }) {
  const c = resolveCost(program)
  if (!c.primaryValue) return null

  return (
    <section
      className="rounded-[var(--radius-card)] border border-surface-200 bg-surface-0 p-5 sm:p-6"
      aria-label="Cost"
    >
      {/* Pills: single-line labels for consistent chip height. Tones: bordered
          (attributes), filled-muted (estimate, e.g. per-class), filled-info
          (deferred tuition). */}
      {c.pills.length > 0 && (
        <div className="flex flex-wrap gap-2.5">
          {c.pills.map((pill, i) => (
            <div
              key={i}
              className={`inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-[14px] font-bold leading-none ${
                pill.tone === 'estimate'
                  ? 'bg-surface-100 text-ink-700'
                  : pill.tone === 'info'
                    ? 'bg-info-50 text-info-700'
                    : 'border border-surface-200 text-ink-900'
              }`}
            >
              {pill.label}
              {pill.tooltip && (
                <span className="group relative inline-flex">
                  <button
                    type="button"
                    aria-label={pill.tooltip}
                    className="inline-flex cursor-help text-ink-400 outline-none hover:text-ink-600 focus-visible:text-ink-600"
                  >
                    <InfoIcon className="h-3.5 w-3.5" />
                  </button>
                  <span
                    aria-hidden="true"
                    className="pointer-events-none absolute left-1/2 top-[calc(100%+8px)] z-20 w-56 -translate-x-1/2 rounded-lg bg-ink-900 px-3 py-2 text-[12px] font-medium normal-case leading-snug text-white opacity-0 shadow-lg transition-opacity duration-150 group-hover:opacity-100 group-focus-within:opacity-100"
                  >
                    {pill.tooltip}
                  </span>
                </span>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Hero number: per-credit (degrees / credit-bearing certs), total (flat certs), or cap. */}
      <div className="mt-5">
        <div className="text-[12px] font-bold uppercase tracking-wide text-ink-500">{c.primaryLabel}</div>
        <div className="mt-1 flex flex-wrap items-end gap-3">
          <span className="text-4xl font-black leading-none text-ink-900">{c.primaryValue}</span>
          {c.struck && (
            <span className="pb-1 text-xl font-semibold text-ink-400 line-through">{c.struck}</span>
          )}
        </div>
        {c.capLine && <p className="mt-1.5 text-[15px] font-bold text-ink-900">{c.capLine}</p>}
      </div>

      {/* Payment-structure indicator (flat-fee certs) */}
      {c.paymentNote && (
        <p className="mt-3 inline-flex items-center gap-2 rounded-lg bg-surface-100 px-3 py-1.5 text-[13px] font-semibold text-ink-700">
          {c.paymentNote}
        </p>
      )}

      {/* Plain-language benefit handling (employer note) */}
      {c.benefitsLine && (
        <p className="mt-3 max-w-prose text-[13px] italic leading-relaxed text-ink-500">{c.benefitsLine}</p>
      )}
    </section>
  )
}
