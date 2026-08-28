/*
 * Shared marketing-section primitives, matching the live partner templates:
 * uppercase teal eyebrow, slate display heading (Nunito Sans), body gray.
 */

export function Eyebrow({ children, tone = 'teal' }) {
  return (
    <p
      className={`font-display text-[12px] font-bold uppercase tracking-[0.14em] ${
        tone === 'purple' ? 'text-mk-purple' : 'text-mk-teal-text'
      }`}
    >
      {children}
    </p>
  )
}

export function Heading({ children, size = 'md', className = '' }) {
  const sizes = { lg: 'text-[34px] sm:text-[40px]', md: 'text-[28px] sm:text-[32px]', sm: 'text-[22px]' }
  return (
    <h2
      className={`font-display font-extrabold leading-tight text-mk-slate ${sizes[size]} ${className}`}
    >
      {children}
    </h2>
  )
}

export function Body({ children, className = '' }) {
  return (
    <p className={`font-display text-[15px] leading-relaxed text-mk-body ${className}`}>{children}</p>
  )
}

/*
 * MkButton (2026-08-28 polish pass).
 *
 * It existed with four tones and was used ZERO times on the landing page,
 * which had grown eight ad-hoc button treatments across three radii, six
 * padding pairs and four sizes. This is now the only button on the marketing
 * surface.
 *
 * Two things borrowed from hubspot.com: an 8px radius, and a 2px border on
 * EVERY tone including the filled ones (transparent where it isn't visible).
 * That is what makes a filled and an outlined button render at identical
 * heights when they sit side by side, which they now do in the hero and the
 * closing bookend.
 *
 * focus-visible lives here too. There were no focus styles anywhere on the
 * landing page, so several buttons on colored grounds fell back to a UA ring
 * with almost no contrast. Fixing the primitive fixes every call site.
 */
const TONES = {
  teal: 'border-transparent bg-mk-teal-600 text-white hover:bg-mk-teal-700 focus-visible:outline-mk-teal-700',
  green: 'border-transparent bg-mk-green-600 text-white hover:bg-mk-green-700 focus-visible:outline-mk-green-700',
  purple: 'border-transparent bg-mk-purple text-white hover:opacity-90 focus-visible:outline-mk-purple',
  outline: 'border-mk-teal-600 bg-white text-mk-teal-700 hover:bg-mk-band focus-visible:outline-mk-teal-700',
  // On dark or photographic grounds.
  light: 'border-transparent bg-white text-mk-teal-700 hover:bg-mk-band focus-visible:outline-white',
  ghostLight: 'border-white/60 bg-transparent text-white hover:bg-white/10 focus-visible:outline-white',
}

const SIZES = {
  sm: 'px-4 py-2 text-[13px]',
  md: 'px-5 py-2.5 text-[15px]',
  lg: 'px-8 py-3.5 text-[16.5px]',
}

export function MkButton({
  children,
  tone = 'teal',
  size = 'md',
  onClick,
  href,
  className = '',
  type = 'button',
}) {
  const cls = [
    'inline-flex items-center justify-center gap-2 rounded-lg border-2 font-display font-bold transition',
    'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2',
    TONES[tone] || TONES.teal,
    SIZES[size] || SIZES.md,
    className,
  ].join(' ')
  if (href)
    return (
      <a href={href} className={cls}>
        {children}
      </a>
    )
  return (
    <button type={type} onClick={onClick} className={cls}>
      {children}
    </button>
  )
}
