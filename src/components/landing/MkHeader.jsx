/*
 * Marketing header: AllCampus logo, cobranded with the employer when the
 * benefit partner is known (mirrors the live partner templates' cobrand
 * lockup: "allcampus + {partner}").
 */

export default function MkHeader({ partner, onNavigate }) {
  const cobrand = partner?.benefitKnown ? partner.name : null
  const mark = partner?.name?.trim()?.[0] || ''
  return (
    <header className="sticky top-12 z-40 border-b border-mk-line bg-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-3">
        <button
          type="button"
          onClick={() => onNavigate('/')}
          className="flex items-center gap-2 font-display"
        >
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-mk-teal-600 text-sm font-black text-white">
            ac
          </span>
          <span className="text-[17px] font-extrabold text-mk-slate">allcampus</span>
          {cobrand && (
            <>
              <span className="text-mk-body/60">+</span>
              <span className="flex items-center gap-1.5 border-l border-mk-line pl-2">
                <span
                  className="flex h-7 w-7 items-center justify-center rounded-md text-[13px] font-black text-white"
                  style={{ background: partner.brandColor || '#33475b' }}
                  aria-hidden
                >
                  {mark}
                </span>
                <span className="text-[15px] font-bold text-mk-slate">{cobrand}</span>
              </span>
            </>
          )}
        </button>
        <nav className="flex items-center gap-4 font-display text-[13.5px] font-bold text-mk-body">
          {/* 2026-08-19 session: search belongs in the nav, not the hero —
              logged out, recognition beats searching. Routes to the gated
              results, which prompt the account. */}
          <button
            type="button"
            onClick={() => onNavigate('/browse')}
            className="flex items-center gap-1.5 hover:text-mk-slate"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" className="h-4 w-4" aria-hidden>
              <circle cx="11" cy="11" r="7" />
              <path d="M20 20l-4-4" />
            </svg>
            Search
          </button>
          <button type="button" onClick={() => onNavigate('/browse')} className="hover:text-mk-slate">
            Browse programs
          </button>
          <div className="h-8 w-8 rounded-full bg-mk-band" aria-hidden />
        </nav>
      </div>
    </header>
  )
}
