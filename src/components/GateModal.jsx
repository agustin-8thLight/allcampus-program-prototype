import { useEffect } from 'react'
import { emitStoryEvent } from '../data/useCases.js'

/*
 * The account gate. Since the Aug 14 decision (login before catalog access)
 * it fires from the catalog prompt as well as Save/Compare. The old footnote
 * promising "browsing never requires an account" is gone — that promise is no
 * longer true and a broken promise is worse than none.
 */
export default function GateModal({ open, partner, onJoin, onDismiss }) {
  /*
   * Escape closes it, and the backdrop does too (2026-08-31). Neither worked
   * before, which mattered less when the gate only fired on Save; the
   * 2026-08-31 decision moves it in front of Book a call and, next, the
   * program-card click, so a modal with no way out becomes a trap. Same
   * pattern as Drawer.jsx:15-24 so there is one way to dismiss a modal here.
   */
  useEffect(() => {
    if (!open) return
    const onKey = (e) => e.key === 'Escape' && onDismiss?.()
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [open, onDismiss])

  if (!open) return null
  const benefit = partner?.benefitKnown && partner.employerReimbursement > 0
  return (
    <div
      className="fixed inset-0 z-[65] flex items-end justify-center bg-ink-900/40 p-4 sm:items-center"
      onClick={onDismiss}
      role="presentation"
    >
      <div onClick={(e) => e.stopPropagation()} className="w-full max-w-md rounded-2xl bg-surface-0 p-6 shadow-xl">
        {benefit && (
          <div className="mb-3 flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-brand-600 text-[11px] font-black text-white">
              ac
            </span>
            <span className="text-[13px] font-bold text-ink-500">
              + {partner.name} benefit
            </span>
          </div>
        )}
        {/* 2026-08-25: one action, one name, so this reads the same as the
            header's Sign up and the journey card. It also isn't a gate any
            more: nothing is withheld from someone who says Not now.
            2026-08-26: the body names the PROFILE, because that is what the
            account is for. Setting a profile is the thing we drive to; the
            account is what makes it survive past this visit. */}
        <h2 className="text-xl font-black text-ink-900">Create your free account</h2>
        <p className="mt-2 text-[15px] leading-relaxed text-ink-600">
          {/* 2026-08-27: "your matches" was survey language, and the survey is
              tabled. Matches step 1 of the journey instead. */}
          {benefit
            ? `Search programs, save favorites, and keep your ${/^your /i.test(partner.name) ? 'employer' : partner.name} pricing on every visit.`
            : 'Search programs, save favorites, and keep your pricing on every visit.'}
        </p>
        <div className="mt-5 flex items-center gap-2">
          <button
            onClick={() => {
              emitStoryEvent('gate-join')
              onJoin?.()
            }}
            className="rounded-lg bg-brand-600 px-4 py-2.5 text-[15px] font-bold text-white transition hover:bg-brand-700"
          >
            Create your free account
          </button>
          <button
            onClick={onDismiss}
            className="rounded-lg px-4 py-2.5 text-[15px] font-bold text-ink-500 transition hover:bg-surface-100"
          >
            Not now
          </button>
        </div>
      </div>
    </div>
  )
}
