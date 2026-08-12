import { emitStoryEvent } from '../data/useCases.js'

/*
 * The intent question (move 3): the product already asks this at signup —
 * here the answer finally DOES something. Each intent branches the first run
 * and personalizes Ally's greeting (see PrototypeFrame.applyIntent).
 */
export const INTENTS = [
  { id: 'soon', label: 'I’m looking to start a program soon (within 6 months)' },
  { id: 'exploring', label: 'I’m exploring options for down the road (7+ months out)' },
  { id: 'benefits', label: 'I want to understand my education benefits' },
  { id: 'enrolled', label: 'I’m already enrolled — checking discount eligibility' },
  { id: 'else', label: 'I’m here for something else' },
]

export default function IntentStep({ open, suggestion, onPick }) {
  if (!open) return null
  return (
    <div className="fixed inset-0 z-[66] flex items-end justify-center bg-ink-900/40 p-4 sm:items-center">
      <div className="w-full max-w-lg rounded-2xl bg-surface-0 p-6 shadow-xl">
        <p className="text-[11px] font-bold uppercase tracking-wide text-brand-600">You’re in — one question</p>
        <h2 className="mt-1 text-xl font-black text-ink-900">What brings you here today?</h2>
        <p className="mt-1 text-[13px] text-ink-500">
          Your answer shapes your first visit — it’s never wasted on a form.
        </p>
        <div className="mt-4 space-y-2">
          {INTENTS.map((it) => (
            <button
              key={it.id}
              onClick={() => {
                emitStoryEvent('intent', { intent: it.id })
                onPick?.(it.id)
              }}
              className={`block w-full rounded-lg border px-4 py-3 text-left text-[15px] font-semibold transition ${
                suggestion === it.id
                  ? 'border-brand-400 bg-brand-50 text-ink-900 ring-1 ring-brand-300'
                  : 'border-surface-200 bg-surface-0 text-ink-700 hover:border-brand-300'
              }`}
            >
              {it.label}
              {suggestion === it.id && (
                <span className="ml-2 text-[11px] font-bold uppercase tracking-wide text-brand-600">
                  this story
                </span>
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
