/*
 * StepsStrip v2 (2026-08-20 review): "much better looking — use shadows and
 * gradients; the arrows look weird, remove the numbers."
 *
 * Four elevated cards, order carried by reading direction alone. The light
 * cards run a soft white-to-band gradient with a deep diffuse shadow; the
 * account step is the dark gradient card with a REAL signup button — it is
 * the action the page exists to produce, and now it looks like it.
 *
 * Presentational: pages pass steps [{icon, title, body, note?, highlight?,
 * cta?: {label, onClick}}]. Gradients stay inside the sampled mk palette.
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
      className={`grid grid-cols-1 gap-4 sm:grid-cols-2 ${
        steps.length === 4 ? 'lg:grid-cols-4' : 'lg:grid-cols-3'
      }`}
    >
      {steps.map((s) => {
        const Art = ART[s.icon] || ART.find
        return (
          <li key={s.title} className="h-full">
            {s.highlight ? (
              /* The account card: dark gradient, white type, the button. */
              <div className="flex h-full flex-col rounded-[var(--radius-card)] bg-gradient-to-br from-mk-teal-600 to-mk-slate p-6 text-white shadow-[0_18px_40px_rgba(51,71,91,0.35)]">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/15 text-white shadow-inner backdrop-blur-sm">
                  <Art className="h-9 w-9" />
                </div>
                <p className="mt-4 font-display text-[19px] font-extrabold leading-snug">
                  {s.title}
                </p>
                <p className="mt-2 font-display text-[13.5px] leading-relaxed text-white/85">
                  {s.body}
                </p>
                {s.cta && (
                  <button
                    type="button"
                    onClick={s.cta.onClick}
                    className="mt-auto w-full rounded-lg bg-white px-4 py-2.5 pt-2.5 font-display text-[14px] font-bold text-mk-teal-700 shadow-sm transition hover:bg-mk-band"
                  >
                    {s.cta.label}
                  </button>
                )}
              </div>
            ) : (
              <div className="flex h-full flex-col rounded-[var(--radius-card)] border border-mk-line bg-gradient-to-b from-white to-mk-band/50 p-6 shadow-[0_14px_32px_rgba(51,71,91,0.12)] transition hover:-translate-y-0.5 hover:shadow-[0_20px_44px_rgba(51,71,91,0.16)]">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-mk-blue-50 to-mk-band text-mk-teal-700 shadow-[inset_0_1px_2px_rgba(255,255,255,0.9),0_2px_6px_rgba(51,71,91,0.10)]">
                  <Art className="h-9 w-9" />
                </div>
                <p className="mt-4 font-display text-[19px] font-extrabold leading-snug text-mk-slate">
                  {s.title}
                </p>
                <p className="mt-2 font-display text-[13.5px] leading-relaxed text-mk-body">
                  {s.body}
                </p>
                {s.note && (
                  <p className="mt-auto pt-3 font-display text-[12.5px] leading-snug text-mk-teal-text">
                    {s.note}
                  </p>
                )}
              </div>
            )}
          </li>
        )
      })}
    </ol>
  )
}
