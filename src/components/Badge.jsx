import { badgeLabel, badgeTone } from '../data/model.js'

const TONE = {
  good: 'bg-good-50 text-good-700',
  info: 'bg-info-50 text-info-700',
  brand: 'bg-brand-50 text-brand-700',
}

/* Solid tones for the image-overlay variant: the badge is the promotion, so
   on a photograph it needs weight the pale pill doesn't have. */
const TONE_OVERLAY = {
  good: 'bg-good-600 text-white',
  info: 'bg-info-700 text-white',
  brand: 'bg-brand-600 text-white',
}

/* Normalized value badge (§7). One shape, school-agnostic wording. */
export default function Badge({ program, variant = 'inline', className = '' }) {
  const label = badgeLabel(program)
  if (!label) return null
  const tones = variant === 'overlay' ? TONE_OVERLAY : TONE
  const tone = tones[badgeTone(program)] || tones.brand
  const extra = variant === 'overlay' ? 'shadow-[0_1px_4px_rgba(26,29,33,0.35)]' : ''
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-bold uppercase tracking-wide ${tone} ${extra} ${className}`}
    >
      {label}
    </span>
  )
}
