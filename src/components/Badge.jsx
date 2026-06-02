import { badgeLabel, badgeTone } from '../data/model.js'

const TONE = {
  good: 'bg-good-50 text-good-700',
  info: 'bg-info-50 text-info-700',
  brand: 'bg-brand-50 text-brand-700',
}

/* Normalized value badge (§7). One shape, school-agnostic wording. */
export default function Badge({ program, className = '' }) {
  const label = badgeLabel(program)
  if (!label) return null
  const tone = TONE[badgeTone(program)] || TONE.brand
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-bold uppercase tracking-wide ${tone} ${className}`}
    >
      {label}
    </span>
  )
}
