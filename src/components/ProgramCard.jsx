import Badge from './Badge.jsx'
import { ProgramImage, SchoolMark } from './ProgramDetail.jsx'
import { startDateDisplay, resolveCost, badgeLabel, money } from '../data/model.js'
import { estimatedOutOfPocket } from '../data/benefit.js'
import { CalendarIcon, ArrowRightIcon, InfoIcon } from './icons.jsx'

/*
 * Program list card. Save/Compare are the value moments that trigger the
 * account gate (move 2); after joining, the card answers "what would I pay"
 * inline with the employer benefit applied (move 5) — estimate-labeled.
 * Root is a div (not a button) so the Save/Compare buttons nest legally.
 */
export default function ProgramCard({
  program,
  partner = null,
  joined = false,
  saved = false,
  benefitUnsure = false,
  onSave,
  onCompare,
  onExplore,
}) {
  const p = program
  const start = startDateDisplay(p)
  const tags = [p.degreeLevel, p.duration, p.courseModality].filter(Boolean)
  const cost = resolveCost(p)
  const priceUnit =
    cost.primaryLabel === 'Per credit' ? 'per credit' : cost.primaryLabel === 'Total program cost' ? 'total' : null

  const benefitKnown = partner?.benefitKnown && partner.employerReimbursement > 0
  // 8/21 meeting decision: compare is OFF for now, not deleted — revisit
  // after the overhaul. Flip this to bring the button back.
  const COMPARE_ENABLED = false
  const oop = benefitKnown ? estimatedOutOfPocket(p, partner) : null

  const explore = () => onExplore?.(p)

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={explore}
      onKeyDown={(e) => e.key === 'Enter' && explore()}
      className="group flex h-full cursor-pointer flex-col overflow-hidden rounded-[var(--radius-card)] border border-surface-200 bg-surface-0 text-left transition hover:border-brand-300 hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-400"
    >
      {/* Title + school */}
      <div className="px-4 pt-4">
        <h3 className="text-[21px] font-bold leading-snug text-ink-900 line-clamp-2">{p.name}</h3>
        <div className="mt-2 flex items-center gap-2 text-[13px] font-semibold text-ink-500">
          <SchoolMark school={p.school} />
          <span className="truncate">{p.school?.name}</span>
        </div>
      </div>

      {/* Image, with the discount badge OVERLAID on its corner (2026-08-18
          review: as an in-flow row the badge broke card heights whenever a
          program had no discount, and the pale pill undersold the offer —
          same corner on every card, zero height impact, solid for punch). */}
      <div className="relative px-4 pt-3">
        <ProgramImage src={p.programImageUrl} alt={p.name} hue={p.programImageHue} className="h-32 w-full" />
        {badgeLabel(p) && (
          <span className="absolute left-6 top-5">
            <Badge program={p} variant="overlay" />
          </span>
        )}
      </div>

      {/* Price + facts */}
      <div className="px-4 pt-3">
        {cost.primaryValue && (
          <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
            <span className="text-[22px] font-black leading-none text-ink-900">{cost.primaryValue}</span>
            {cost.struck && (
              <span className="text-[14px] font-semibold text-ink-400 line-through">{cost.struck}</span>
            )}
            {priceUnit && (
              <span className="text-[12px] font-semibold uppercase tracking-wide text-ink-400">{priceUnit}</span>
            )}
          </div>
        )}
        {/* Benefit-unsure profiles (2026-08-21): floor-led dual pricing.
            The discounted price is guaranteed; the reimbursement delta wears
            its condition. $5,250 = the federal tax-free norm, estimate only. */}
        {benefitUnsure && p.annualEstimatedCost != null && (
          <p className="mt-1 text-[13px] font-bold text-good-700">
            Yours regardless: this discounted price. With reimbursement, if you have it: as low as{' '}
            {money(Math.max(0, p.annualEstimatedCost - 5250))}/yr (est.)
          </p>
        )}
        {/* Move 5 on the list: the benefit answer, inline. Open catalog
            (8/21): the price is visible without an account. */}
        {!benefitUnsure && benefitKnown && oop != null && (
          <p className="mt-1 text-[13px] font-bold text-good-700">
            Your est. out-of-pocket: {money(oop)}/yr with {/^your /i.test(partner.name) ? 'your employer benefit' : `the ${partner.name} benefit`}
          </p>
        )}
        {start && (
          <div className="mt-2 flex items-center gap-2 text-[13px] text-ink-500">
            <CalendarIcon className="text-sm text-brand-500" />
            <span>Start date: {start}</span>
          </div>
        )}
      </div>

      {/* Tags */}
      <div className="mt-auto flex flex-wrap items-center gap-1.5 px-4 pb-3 pt-3">
        {tags.map((t) => (
          <span key={t} className="rounded bg-surface-100 px-2 py-0.5 text-[11px] font-medium text-ink-500">
            {t}
          </span>
        ))}
        {p.deferredPaymentAvailable && (
          <span
            title="Eligible students can delay paying tuition until after employer tuition benefits are processed, reducing upfront costs."
            className="inline-flex items-center gap-1 rounded bg-info-50 px-2 py-0.5 text-[11px] font-bold uppercase tracking-wide text-info-700"
          >
            Deferred tuition
            <InfoIcon className="text-[12px]" />
          </span>
        )}
      </div>

      {/* Actions: explore + the gate-triggering value moments */}
      <div className="flex items-center justify-between border-t border-surface-100 px-4 py-3">
        <span className="inline-flex items-center gap-1.5 text-sm font-bold text-brand-600 group-hover:text-brand-700">
          Explore program
          <ArrowRightIcon className="text-base transition-transform group-hover:translate-x-0.5" />
        </span>
        <span className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              onSave?.(p)
            }}
            className={`rounded-full border px-2.5 py-1 text-[12px] font-bold transition ${
              saved
                ? 'border-good-700 bg-good-700/10 text-good-700'
                : 'border-surface-200 text-ink-500 hover:border-brand-300 hover:text-ink-900'
            }`}
          >
            {saved ? '♥ Saved' : '♡ Save'}
          </button>
          {COMPARE_ENABLED && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                onCompare?.(p)
              }}
              className="rounded-full border border-surface-200 px-2.5 py-1 text-[12px] font-bold text-ink-500 transition hover:border-brand-300 hover:text-ink-900"
            >
              ⇄ Compare
            </button>
          )}
        </span>
      </div>
    </div>
  )
}
