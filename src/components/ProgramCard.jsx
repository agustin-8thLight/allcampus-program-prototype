import Badge from './Badge.jsx'
import { ProgramImage, SchoolMark } from './ProgramDetail.jsx'
import { startDateDisplay, deadlineDisplay } from '../data/model.js'
import { CalendarIcon, LayersIcon, ArrowRightIcon } from './icons.jsx'

/*
 * Program list card (§10.7). Compare removed. Main action "Explore program"
 * opens the detail drawer.
 */
export default function ProgramCard({ program, onExplore }) {
  const p = program
  const start = startDateDisplay(p)
  const deadline = deadlineDisplay(p)
  const tags = [p.degreeLevel, p.duration, p.courseModality].filter(Boolean)

  return (
    <button
      type="button"
      onClick={() => onExplore?.(p)}
      className="group flex h-full flex-col overflow-hidden rounded-[var(--radius-card)] border border-surface-200 bg-surface-0 text-left transition hover:border-brand-300 hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-400"
    >
      {/* Badge rail */}
      <div className="px-4 pt-4">
        <Badge program={p} />
      </div>

      {/* Title + school */}
      <div className="px-4 pt-3">
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

      {/* Facts */}
      <div className="space-y-1.5 px-4 pt-3 text-[13px] text-ink-500">
        {start && (
          <div className="flex items-center gap-2">
            <CalendarIcon className="text-sm text-brand-500" />
            <span>Start date: {start}</span>
          </div>
        )}
        {deadline && (
          <div className="flex items-center gap-2">
            <LayersIcon className="text-sm text-brand-500" />
            <span>Apply by: {deadline}</span>
          </div>
        )}
      </div>

      {/* Tags */}
      <div className="mt-auto flex flex-wrap gap-1.5 px-4 pb-4 pt-3">
        {tags.map((t) => (
          <span key={t} className="rounded bg-surface-100 px-2 py-0.5 text-[11px] font-medium text-ink-500">
            {t}
          </span>
        ))}
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
