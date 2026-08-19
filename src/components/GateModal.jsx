import { emitStoryEvent } from '../data/useCases.js'

/*
 * The account gate. Since the Aug 14 decision (login before catalog access)
 * it fires from the catalog prompt as well as Save/Compare. The old footnote
 * promising "browsing never requires an account" is gone — that promise is no
 * longer true and a broken promise is worse than none.
 */
export default function GateModal({ open, partner, trigger = 'save', onJoin, onDismiss }) {
  if (!open) return null
  const benefit = partner?.benefitKnown && partner.employerReimbursement > 0
  return (
    <div className="fixed inset-0 z-[65] flex items-end justify-center bg-ink-900/40 p-4 sm:items-center">
      <div className="w-full max-w-md rounded-2xl bg-surface-0 p-6 shadow-xl">
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
        <h2 className="text-xl font-black text-ink-900">
          {trigger === 'catalog'
            ? 'See the schools and YOUR price'
            : trigger === 'compare'
              ? 'Compare programs and see YOUR price'
              : 'Save programs and see YOUR price'}
        </h2>
        <p className="mt-2 text-[15px] leading-relaxed text-ink-600">
          Create a free account to save and compare programs
          {benefit
            ? `, and see exact costs with the ${partner.name} benefit applied.`
            : ', and keep your shortlist across visits.'}
        </p>
        <div className="mt-5 flex items-center gap-2">
          <button
            onClick={() => {
              emitStoryEvent('gate-join')
              onJoin?.()
            }}
            className="rounded-lg bg-brand-600 px-4 py-2.5 text-[15px] font-bold text-white transition hover:bg-brand-700"
          >
            Create free account
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
