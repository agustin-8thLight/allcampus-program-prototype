import ProgramDetail, { DrawerIdentity, PrimaryCta } from './ProgramDetail.jsx'
import { CloseIcon, CheckCircleIcon } from './icons.jsx'

/*
 * The program-detail VIEW inside the drawer: top bar, scrolling detail, and the
 * pinned footer. The footer changes once the user has requested details: it
 * confirms the request (and offers Apply now) rather than repeating
 * "Get Program Details".
 */
export default function ProgramDrawerView({
  program,
  variant,
  requested,
  onClose,
  onAdvisor,
  onOpenAlly,
  onApply,
  onPrimaryCta,
}) {
  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between gap-3 border-b border-surface-100 px-4 py-3 sm:px-6">
        <div className="min-w-0 flex-1">
          <DrawerIdentity program={program} variant={variant} />
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-ink-500 transition hover:bg-surface-100 hover:text-ink-900"
        >
          <CloseIcon className="text-xl" />
        </button>
      </div>

      <div className="no-scrollbar flex-1 overflow-y-auto px-5 py-7 sm:px-9">
        <ProgramDetail program={program} onAdvisor={onAdvisor} onOpenAlly={onOpenAlly} variant={variant} />
      </div>

      <div className="border-t border-surface-100 bg-surface-0 px-5 py-3.5 sm:px-9">
        {requested ? (
          // Once details are requested, the footer just confirms the handoff.
          // "Talk to an advisor" was removed here (06-29 review): it read as
          // scheduling directly with the school, which we can't yet deliver.
          <div>
            <div className="mb-2.5 flex items-center justify-center gap-1.5 text-center text-[15px] font-bold text-good-700">
              <CheckCircleIcon className="shrink-0 text-base" />
              You've requested details from {program.school?.name}
            </div>
            <button
              onClick={() => onApply?.(program)}
              className="flex w-full items-center justify-center rounded-xl border border-surface-200 px-4 py-3.5 text-[15px] font-bold text-ink-700 transition hover:border-brand-300"
            >
              Apply now
            </button>
          </div>
        ) : (
          <PrimaryCta program={program} onPrimaryCta={onPrimaryCta} />
        )}
      </div>
    </div>
  )
}
