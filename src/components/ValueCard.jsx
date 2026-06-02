import { useState } from 'react'
import { resolveValueCard, money } from '../data/model.js'
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
 * Value card. Composes the cost story like the real calculator: a headline
 * (out-of-pocket / discounted per-credit / per-credit), a cost breakdown, the
 * pace table, and terms, the latter three behind expanders to keep it compact.
 */
export default function ValueCard({ program }) {
  const [open, setOpen] = useState(null) // 'breakdown' | 'pace' | 'terms'
  const v = resolveValueCard(program)
  if (!v.value) return null

  const toggle = (k) => setOpen((cur) => (cur === k ? null : k))

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

        {/* Deferred-payment secondary line */}
        {v.deferred && (
          <p className="mt-4 flex items-start gap-2 rounded-lg bg-white/10 px-3.5 py-2.5 text-[15px] font-semibold">
            <span aria-hidden>↻</span>
            <span>Deferred payment available, start now and pay over time</span>
          </p>
        )}

        {/* Always-visible estimate caveat */}
        {ESTIMATE_NOTE[v.tier] && (
          <p className="mt-4 flex items-start gap-1.5 text-[12px] leading-snug text-white/70">
            <InfoIcon className="mt-px shrink-0 text-sm text-white/70" />
            <span>{ESTIMATE_NOTE[v.tier]}</span>
          </p>
        )}
      </div>

      {/* Expanders: cost breakdown, pace options, full terms */}
      <div className="border-t border-white/10">
        {v.lineItems?.length > 0 && (
          <Expander label="Cost breakdown" open={open === 'breakdown'} onToggle={() => toggle('breakdown')}>
            <dl className="space-y-1.5">
              {v.lineItems.map((row) => (
                <div key={row.label} className="flex items-center justify-between gap-3">
                  <dt className={`text-[13px] ${row.strong ? 'font-bold text-white/90' : 'text-white/60'}`}>
                    {row.label}
                  </dt>
                  <dd className={`text-[13px] ${row.strong ? 'font-bold text-white' : 'font-semibold text-white/80'}`}>
                    {row.value}
                  </dd>
                </div>
              ))}
            </dl>
          </Expander>
        )}

        {v.pace?.length > 0 && (
          <Expander label="Pace options" open={open === 'pace'} onToggle={() => toggle('pace')}>
            <div className="overflow-hidden rounded-lg">
              <div className="grid grid-cols-[1fr_auto_auto] gap-x-4 gap-y-1.5 text-[13px]">
                <div className="text-[11px] font-bold uppercase tracking-wide text-white/45">Pace</div>
                <div className="text-right text-[11px] font-bold uppercase tracking-wide text-white/45">Per year</div>
                <div className="text-right text-[11px] font-bold uppercase tracking-wide text-white/45">Finish</div>
                {v.pace.map((row) => (
                  <PaceRow key={row.name} row={row} />
                ))}
              </div>
              <p className="mt-2 text-[11px] text-white/45">Annual cost shown before any employer benefit.</p>
            </div>
          </Expander>
        )}

        {program.terms && (
          <Expander label="See full terms" open={open === 'terms'} onToggle={() => toggle('terms')}>
            <p className="text-[13px] leading-relaxed text-white/55">{program.terms}</p>
          </Expander>
        )}
      </div>
    </section>
  )
}

function PaceRow({ row }) {
  return (
    <>
      <div className="font-semibold text-white/85">
        {row.name}
        <span className="ml-1.5 text-[11px] font-normal text-white/45">
          {row.coursesPerTerm} {row.coursesPerTerm === 1 ? 'course' : 'courses'}/term
        </span>
      </div>
      <div className="text-right font-semibold text-white/80">{money(row.annualCost)}</div>
      <div className="text-right text-white/60">{row.completionTime}</div>
    </>
  )
}

function Expander({ label, open, onToggle, children }) {
  return (
    <div className="border-t border-white/10 first:border-t-0">
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        className="flex w-full items-center justify-between px-5 py-3.5 text-left text-[13px] font-semibold text-white/70 hover:text-white sm:px-6"
      >
        {label}
        <ChevronDownIcon className={`text-base transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && <div className="px-5 pb-4 sm:px-6">{children}</div>}
    </div>
  )
}
