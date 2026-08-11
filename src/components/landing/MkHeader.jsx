/*
 * Marketing header: AllCampus logo, cobranded with the employer when the
 * benefit partner is known (mirrors the live partner templates' cobrand
 * lockup: "allcampus + {partner}").
 */

export default function MkHeader({ partner, onNavigate }) {
  const cobrand = partner?.benefitKnown ? partner.name : null
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
              <span className="border-l border-mk-line pl-2 text-[15px] font-bold text-mk-slate">
                {cobrand}
              </span>
            </>
          )}
        </button>
        <nav className="flex items-center gap-4 font-display text-[13.5px] font-bold text-mk-body">
          <button type="button" onClick={() => onNavigate('/browse')} className="hover:text-mk-slate">
            Browse programs
          </button>
          <div className="h-8 w-8 rounded-full bg-mk-band" aria-hidden />
        </nav>
      </div>
    </header>
  )
}
