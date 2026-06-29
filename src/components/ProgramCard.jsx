import Badge from './Badge.jsx'
import { ProgramImage, SchoolMark } from './ProgramDetail.jsx'
import { startDateDisplay, resolveCost, badgeLabel } from '../data/model.js'
import { CalendarIcon, ArrowRightIcon, InfoIcon } from './icons.jsx'

/*
 * Program list card. Compare removed. Deferred tuition is a card tag with an
 * info tooltip (not the discount badge, not a sort-only feature).
 */
export default function ProgramCard({ program, onExplore }) {
  const p = program
  const start = startDateDisplay(p)
  const tags = [p.degreeLevel, p.duration, p.courseModality].filter(Boolean)
  // Mirror the drawer's hero on the list card: per-credit (degrees + credit
  // certs), total (flat certs). Same source of truth as ValueCard.
  const cost = resolveCost(p)
  const priceUnit =
    cost.primaryLabel === 'Per credit' ? 'per credit' : cost.primaryLabel === 'Total program cost' ? 'total' : null

  return (
    <button
      type="button"
      onClick={() => onExplore?.(p)}
      className="group flex h-full flex-col overflow-hidden rounded-[var(--radius-card)] border border-surface-200 bg-surface-0 text-left transition hover:border-brand-300 hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-400"
    >
      {/* Badge rail: discount badge only. Deferred moved to the bottom tag row
          (06-29 review). Rail is hidden entirely when there's no badge. */}
      {badgeLabel(p) && (
        <div className="flex flex-wrap items-center gap-2 px-4 pt-4">
          <Badge program={p} />
        </div>
      )}

      {/* Title + school */}
      <div className="px-4 pt-4">
        <h3 className="text-[21px] font-bold leading-snug text-ink-900 line-clamp-2">{p.name}</h3>
        <div className="mt-2 flex items-center gap-2 text-[13px] font-semibold text-ink-500">
          <SchoolMark school={p.school} />
          <span className="truncate">{p.school?.name}</span>
        </div>
      </div>

      {/* Image */}
      <div className="px-4 pt-3">
        <ProgramImage src={p.programImageUrl} alt={p.name} hue={p.programImageHue} className="h-32 w-full" />
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
        {start && (
          <div className="mt-2 flex items-center gap-2 text-[13px] text-ink-500">
            <CalendarIcon className="text-sm text-brand-500" />
            <span>Start date: {start}</span>
          </div>
        )}
      </div>

      {/* Tags: program facts plus the deferred-tuition tag (moved here from the
          top rail, 06-29 review). Deferred keeps its info color + tooltip. */}
      <div className="mt-auto flex flex-wrap items-center gap-1.5 px-4 pb-4 pt-3">
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

      {/* Action */}
      <div className="border-t border-surface-100 px-4 py-3">
        <span className="inline-flex items-center gap-1.5 text-sm font-bold text-brand-600 group-hover:text-brand-700">
          Explore program
          <ArrowRightIcon className="text-base transition-transform group-hover:translate-x-0.5" />
        </span>
      </div>
    </button>
  )
}
