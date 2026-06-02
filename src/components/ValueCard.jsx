import { useState } from 'react'
import { resolveValueCard } from '../data/model.js'
import { ChevronDownIcon, InfoIcon } from './icons.jsx'

/* Always-visible estimate caveat, car-payment-estimator pattern. The detailed
   assumptions live in the "See full terms" expander below. */
const ESTIMATE_NOTE = {
  outOfPocket: 'Estimated. Your actual out-of-pocket depends on your employer’s benefit and any transfer credits.',
  totalCost: 'Estimated total. Final cost depends on transfer credits and fees.',
  discountedPerCredit: 'Per-credit rate. Your total depends on the credits you take, plus any fees.',
  perCredit: 'Per-credit rate. Your total depends on the credits you take, plus any fees.',
}

/*
 * Value card (§4, §6). Composes whichever of the three levers are present
 * into one "what this costs you" story. Dark surface mirrors the current
 * app's cost card so the redesign reads as a promotion, not a new element.
 */
export default function ValueCard({ program }) {
  const [showTerms, setShowTerms] = useState(false)
  const v = resolveValueCard(program)
  if (!v.value) return null

  return (
    <section
      className="overflow-hidden rounded-[var(--radius-card)] text-white"
      style={{ background: 'var(--color-value-bg)' }}
      aria-label="Cost and value"
    >
      <div className="p-5 sm:p-6">
        {/* Top line: label + benefit qualifier */}
        <div className="flex flex-wrap items-baseline gap-2 text-[15px] text-white/70">
          <span className="font-bold uppercase tracking-wide text-white/85">{v.label}</span>
          {v.benefitLabel && (
            <span className="rounded-full bg-white/12 px-2.5 py-0.5 text-[12px] font-semibold lowercase tracking-normal">
              {v.benefitLabel}
            </span>
          )}
        </div>

        {/* The number, with struck standard price when present */}
        <div className="mt-1.5 flex flex-wrap items-end gap-3">
          <span className="text-5xl font-black leading-none">{v.value}</span>
          {v.struck && (
            <span className="pb-1 text-xl font-semibold text-white/45 line-through">{v.struck}</span>
          )}
        </div>

        {v.perCreditNote && (
          <p className="mt-1.5 text-[15px] text-white/65">{v.perCreditNote}</p>
        )}

        {/* Employer-vs-personal breakdown (tier 1) */}
        {v.breakdown && (
          <dl className="mt-4 grid grid-cols-2 gap-px overflow-hidden rounded-lg bg-white/10">
            {v.breakdown.map((row) => (
              <div key={row.label} className="bg-[var(--color-value-bg-strong)] px-4 py-3">
                <dt className="text-[13px] text-white/55">{row.label}</dt>
                <dd className="mt-0.5 text-xl font-bold">{row.value}</dd>
              </div>
            ))}
          </dl>
        )}

        {/* Deferred-payment secondary line (§6) */}
        {v.deferred && (
          <p className="mt-4 flex items-start gap-2 rounded-lg bg-white/10 px-3.5 py-2.5 text-[15px] font-semibold">
            <span aria-hidden>↻</span>
            <span>Deferred payment available, start now and pay over time</span>
          </p>
        )}

        {/* Always-visible estimate caveat (car-estimator pattern) */}
        {ESTIMATE_NOTE[v.tier] && (
          <p className="mt-4 flex items-start gap-1.5 text-[12px] leading-snug text-white/70">
            <InfoIcon className="mt-px shrink-0 text-sm text-white/70" />
            <span>{ESTIMATE_NOTE[v.tier]}</span>
          </p>
        )}
      </div>

      {/* Legal/eligibility text, always collapsed behind an expander (§6) */}
      {program.terms && (
        <div className="border-t border-white/10">
          <button
            type="button"
            onClick={() => setShowTerms((s) => !s)}
            className="flex w-full items-center justify-between px-5 py-3.5 text-left text-[13px] font-semibold text-white/70 hover:text-white sm:px-6"
            aria-expanded={showTerms}
          >
            See full terms
            <ChevronDownIcon
              className={`text-base transition-transform ${showTerms ? 'rotate-180' : ''}`}
            />
          </button>
          {showTerms && (
            <p className="px-5 pb-4 text-[13px] leading-relaxed text-white/55 sm:px-6">{program.terms}</p>
          )}
        </div>
      )}
    </section>
  )
}
