import ProgramDetail, { DrawerIdentity, PrimaryCta } from './ProgramDetail.jsx'
import { CloseIcon } from './icons.jsx'

/*
 * The program-detail VIEW inside the drawer: top bar (school + badge + close),
 * scrolling detail, and the pinned CTA footer. Rendered by the Drawer shell;
 * swaps with the Ally view.
 */
export default function ProgramDrawerView({ program, variant, onClose, onAdvisor, onPrimaryCta }) {
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
        <ProgramDetail program={program} onAdvisor={onAdvisor} variant={variant} />
      </div>

      <div className="border-t border-surface-100 bg-surface-0 px-5 py-3.5 sm:px-9">
        <PrimaryCta program={program} onPrimaryCta={onPrimaryCta} />
      </div>
    </div>
  )
}
