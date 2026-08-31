/*
 * Marketing header: AllCampus logo, cobranded with the employer when the
 * benefit partner is known (mirrors the live partner templates' cobrand
 * lockup: "allcampus + {partner}").
 */

import { MkButton } from './Section.jsx'

export default function MkHeader({ partner, onNavigate, joined = false, onGate }) {
  const cobrand = partner?.benefitKnown ? partner.name : null
  const mark = partner?.name?.trim()?.[0] || ''
  /*
   * 2026-08-28 client review: create-account is demoted to a secondary text
   * link. Brigid's reason was that account creation is not the failure point
   * ("so many people create accounts, that's not our problem") — what breaks
   * is the step after, so the header should stop spending its loudest slot
   * pushing signup. Same focus treatment as the secondary text links in
   * SchoolPicker so the link is still keyboard-visible without a button box.
   */
  const secondaryLink =
    'rounded-sm outline-offset-2 transition hover:text-mk-slate focus-visible:outline-2 focus-visible:outline-mk-teal-600'
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
        <nav className="flex items-center gap-4 font-display text-[13px] font-bold text-mk-body">
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
          {/* 2026-08-28 client review: browse is the header's primary action
              now, in the treatment signup used to hold. Agustin: "I would
              actually probably have browse programs or put the search back
              in"; Brigid and James both agreed. -my-0.5 absorbs MkButton's
              2px border so the header keeps the height it had when signup
              was the filled element. */}
          <MkButton tone="teal" size="sm" onClick={() => onNavigate('/browse')} className="-my-0.5">
            Browse programs
          </MkButton>
          {/* 2026-08-25 direction: the account lives up here, so the page body
              can drive one action (the survey) without competing with it. */}
          {joined ? (
            <div className="h-8 w-8 rounded-full bg-mk-band" aria-hidden />
          ) : (
            <div className="flex items-center gap-3">
              <button type="button" onClick={() => onGate?.('catalog')} className={secondaryLink}>
                Log in
              </button>
              {/* 2026-08-28 client review: was a filled teal button labelled
                  "Sign up". Now an underlined text link, and named for what it
                  does. The gate behaviour is untouched. */}
              <button
                type="button"
                onClick={() => onGate?.('catalog')}
                className={`underline decoration-1 underline-offset-4 ${secondaryLink}`}
              >
                Create account
              </button>
            </div>
          )}
        </nav>
      </div>
    </header>
  )
}
