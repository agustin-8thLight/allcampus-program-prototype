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

export function MkButton({ children, tone = 'teal', onClick, href, className = '' }) {
  const tones = {
    teal: 'bg-mk-teal-600 text-white hover:bg-mk-teal-700',
    green: 'bg-mk-green-600 text-white hover:bg-mk-green-700',
    outline: 'border border-mk-teal-600 bg-white text-mk-teal-700 hover:bg-mk-band',
    // For dark hero bands: transparent with white text.
    ghostLight: 'border border-white/60 bg-transparent text-white hover:bg-white/10',
  }
  const cls = `inline-flex items-center justify-center gap-2 rounded-md px-5 py-2.5 font-display text-[14px] font-bold transition ${tones[tone]} ${className}`
  if (href)
    return (
      <a href={href} className={cls}>
        {children}
      </a>
    )
  return (
    <button type="button" onClick={onClick} className={cls}>
      {children}
    </button>
  )
}
