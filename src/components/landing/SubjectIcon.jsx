/*
 * SubjectIcon — one line-drawn mark per subject category and per area of study.
 *
 * Why these exist: the discovery blocks were reading as wireframes because every
 * tile was a bordered rectangle of text. Coursera's category row is the
 * reference the team pointed at, and the thing carrying it is not density — it
 * is that every entry has a mark and a colour, so the eye can tell the tiles
 * apart before reading any of them.
 *
 * Drawn on currentColor at 1.75 stroke so they read at 20px as well as at 40px,
 * matching the illustration style already used in EcosystemStrip rather than
 * introducing a second visual language.
 *
 * ACCENTS: each category carries a hue used for its icon tile and rules. Pulled
 * from the same hue values already on CATEGORIES and GOALS in taxonomy.js so
 * the colour of a subject is consistent wherever it appears.
 */

const wrap = (children) => (props) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.75"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden
    {...props}
  >
    {children}
  </svg>
)

const ICONS = {
  // Categories
  'business-leadership': wrap(
    <>
      <rect x="3" y="7" width="18" height="13" rx="2" />
      <path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M3 12h18M10 12v2h4v-2" />
    </>,
  ),
  'tech-engineering': wrap(
    <>
      <path d="M9 8l-4 4 4 4M15 8l4 4-4 4" />
      <path d="M13 5l-2 14" />
    </>,
  ),
  healthcare: wrap(
    <>
      <path d="M3 12h4l2-4 3 8 2-4h7" />
      <path d="M12 3v2M20 5l-1.5 1.5" />
    </>,
  ),
  'people-public': wrap(
    <>
      <circle cx="9" cy="8" r="3" />
      <path d="M3 20c0-3.3 2.7-6 6-6s6 2.7 6 6" />
      <path d="M16 5.5a3 3 0 0 1 0 5.5M18 14.2A6 6 0 0 1 21 20" />
    </>,
  ),

  // Areas of study, for the category page's sub-groups
  business: wrap(
    <>
      <path d="M3 20h18M6 20V10M11 20V4M16 20v-7M21 20v-4" />
    </>,
  ),
  it: wrap(
    <>
      <rect x="2.5" y="5" width="19" height="12" rx="2" />
      <path d="M8 21h8M12 17v4" />
    </>,
  ),
  engineering: wrap(
    <>
      <circle cx="12" cy="12" r="3" />
      <path d="M12 3v3M12 18v3M3 12h3M18 12h3M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M18.4 5.6l-2.1 2.1M7.7 16.3l-2.1 2.1" />
    </>,
  ),
  education: wrap(
    <>
      <path d="M3 8l9-4 9 4-9 4-9-4z" />
      <path d="M7 10.5V16c0 1.7 2.2 3 5 3s5-1.3 5-3v-5.5" />
    </>,
  ),
  'justice-legal': wrap(
    <>
      <path d="M12 4v16M6 20h12M4 9h16" />
      <path d="M4 9l-1.5 4.5a3.5 3.5 0 0 0 7 0L8 9M20 9l-1.5 4.5a3.5 3.5 0 0 0 7 0" />
    </>,
  ),
  'liberal-arts': wrap(
    <>
      <path d="M4 5h7v15H4zM13 5h7v15h-7z" />
      <path d="M6.5 9h2M15.5 9h2" />
    </>,
  ),
  'social-work': wrap(
    <>
      <path d="M20.4 6.6a4.2 4.2 0 0 0-6 0L12 9l-2.4-2.4a4.2 4.2 0 1 0-6 6L12 21l8.4-8.4a4.2 4.2 0 0 0 0-6z" />
    </>,
  ),
}

const Fallback = wrap(<circle cx="12" cy="12" r="8" />)

export default function SubjectIcon({ id, className = 'h-5 w-5' }) {
  const Icon = ICONS[id] || Fallback
  return <Icon className={className} />
}

/*
 * Icon tile. v4 (2026-08-18): the per-subject HSL hue system is GONE — it was
 * an invented palette (purple/green/orange accents) that exists nowhere in
 * AllCampus's sampled brand. One treatment from the mk tokens instead: the
 * pale-blue band with the teal the live templates use for every accent.
 * `hue` is still accepted and ignored so parked components don't break.
 */
export function SubjectIconTile({ id, hue, size = 'md', className = '' }) {
  const sizes = {
    sm: { box: 'h-9 w-9 rounded-lg', icon: 'h-[18px] w-[18px]' },
    md: { box: 'h-12 w-12 rounded-lg', icon: 'h-6 w-6' },
    lg: { box: 'h-16 w-16 rounded-[var(--radius-card)]', icon: 'h-8 w-8' },
  }
  const s = sizes[size] || sizes.md
  return (
    <span
      className={`inline-flex shrink-0 items-center justify-center bg-mk-band text-mk-teal-700 ring-1 ring-inset ring-mk-line ${s.box} ${className}`}
    >
      <SubjectIcon id={id} className={s.icon} />
    </span>
  )
}
