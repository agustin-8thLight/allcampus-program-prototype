import Badge from './Badge.jsx'
import Img from './Img.jsx'
import { badgeLabel } from '../data/model.js'
import { getArea } from '../data/taxonomy.js'

/*
 * ObfuscatedCard (2026-08-19 session): the logged-out program card. "A
 * simpler card… on the card it says 'Up to 25% off' or '25% off of this
 * one.' But it doesn't say the actual program name, and it doesn't say the
 * school." Shows the discount (production's own badge, overlaid), the
 * credential level, and the subject; withholds name, school, and price.
 * Any click opens the account flow.
 */
export default function ObfuscatedCard({ program, onGate }) {
  const p = program
  const area = getArea(p.areaId)
  return (
    <button
      type="button"
      onClick={() => onGate?.('catalog')}
      className="group flex h-full flex-col rounded-[var(--radius-card)] border border-surface-200 bg-surface-0 text-left shadow-[0_1px_2px_rgba(26,29,33,0.05)] transition hover:border-brand-300 hover:shadow-md"
    >
      <div className="relative p-3 pb-0">
        <Img src={p.programImageUrl} alt="" hue={p.programImageHue} className="h-28 w-full" />
        {badgeLabel(p) && (
          <span className="absolute left-5 top-5">
            <Badge program={p} variant="overlay" />
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col px-4 pb-3 pt-3">
        <span className="flex flex-wrap items-center gap-x-2 gap-y-1">
          <span className="rounded-full bg-brand-50 px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wide text-brand-700">
            {p.degreeLevel}
          </span>
          {area && <span className="text-[12.5px] font-semibold text-ink-500">{area.label}</span>}
        </span>
        <span className="mt-auto flex items-center gap-1.5 pt-3 text-[12.5px] font-bold text-brand-600 group-hover:text-brand-700">
          Program details with your free account →
        </span>
      </div>
    </button>
  )
}
