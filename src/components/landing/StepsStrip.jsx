/*
 * StepsStrip (2026-08-20): "What you do, in order" upgraded to the visual
 * language the four-party "Who does what" strip used — one rounded container,
 * large line illustrations, numbered columns, connector arrows — and that
 * strip is retired in its favor. One diagram on the page instead of two: the
 * journey itself carries the who-does-what facts inside its step copy.
 *
 * The account step gets the highlight treatment (the strip's old "hinge"
 * pattern): it is the action the page exists to produce.
 *
 * Illustrations are inline SVG on currentColor, 2.5 stroke, matching the
 * retired strip's style. Presentational: both landing pages (homepage band,
 * school page "How it works for you") pass their own step copy.
 */

const ART = {
  find: (props) => (
    <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <circle cx="27" cy="27" r="15" />
      <path d="M38 38l16 16" />
      <path d="M20 24h14M20 31h9" />
    </svg>
  ),
  account: (props) => (
    <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <circle cx="26" cy="23" r="9" />
      <path d="M10 54c0-9 7-15 16-15s16 6 16 15" />
      <path d="M49 20v14M42 27h14" />
    </svg>
  ),
  confirm: (props) => (
    <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <rect x="17" y="12" width="30" height="42" rx="4" />
      <path d="M26 12v-4h12v4" />
      <path d="M25 35l6 6 11-12" />
    </svg>
  ),
  apply: (props) => (
    <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M30 12l20 9-20 9-20-9 20-9z" />
      <path d="M18 27v9c0 4.5 5.4 7.5 12 7.5s12-3 12-7.5v-9" />
      <path d="M40 52h14m0 0l-5-5m5 5l-5 5" />
    </svg>
  ),
}

export default function StepsStrip({ steps }) {
  return (
    <ol
      className={`grid grid-cols-1 gap-2 rounded-[var(--radius-card)] border border-mk-line bg-white p-4 sm:grid-cols-2 sm:p-5 ${
        steps.length === 4 ? 'lg:grid-cols-4' : 'lg:grid-cols-3'
      }`}
    >
      {steps.map((s, i) => {
        const Art = ART[s.icon] || ART.find
        return (
          <li key={s.title} className="relative">
            <div
              className={`flex h-full flex-col rounded-[var(--radius-card)] px-5 py-6 ${
                s.highlight ? 'bg-mk-blue-50 ring-1 ring-mk-blue-200' : ''
              }`}
            >
              <div
                className={`mx-auto flex h-24 w-24 items-center justify-center rounded-[var(--radius-card)] ${
                  s.highlight ? 'bg-white text-mk-teal-700 shadow-sm' : 'bg-mk-band text-mk-teal-700'
                }`}
              >
                <Art className="h-14 w-14" />
              </div>
              <div className="mt-5 flex items-baseline gap-2">
                <span
                  className={`font-display text-[13px] font-extrabold ${
                    s.highlight ? 'text-mk-teal-700' : 'text-mk-body/60'
                  }`}
                >
                  {i + 1}
                </span>
                <span className="font-display text-[19px] font-extrabold leading-snug text-mk-slate">
                  {s.title}
                </span>
              </div>
              <p className="mt-2 font-display text-[14px] leading-relaxed text-mk-body">{s.body}</p>
              {s.note && (
                <p className="mt-auto pt-3 font-display text-[12.5px] leading-snug text-mk-teal-text">
                  {s.note}
                </p>
              )}
            </div>
            {i < steps.length - 1 && (
              <span
                aria-hidden
                className="absolute -right-[9px] top-[74px] z-10 hidden text-[17px] text-mk-teal-600/60 lg:block"
              >
                →
              </span>
            )}
          </li>
        )
      })}
    </ol>
  )
}
