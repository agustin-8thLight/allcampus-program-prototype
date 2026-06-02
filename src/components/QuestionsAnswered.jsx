import { useState } from 'react'
import { SUGGESTED, allyAnswer } from './AllyChat.jsx'
import { SparkleIcon, ChevronDownIcon, ShieldIcon, ArrowRightIcon } from './icons.jsx'

/*
 * Questions-first block (2C). A bigger departure: instead of sections the user
 * has to read and interpret, the program leads with the questions people
 * actually ask, answered up front from program data (Ally's same grounded
 * answers). No persona model required, we just answer the common questions.
 * Anything deeper opens the full Ally chat. Cost is intentionally excluded
 * here because the value card already owns it.
 */
const QUESTION_KEYS = ['fit', 'employer', 'admission', 'outcomes']

export default function QuestionsAnswered({ program, onOpenAlly }) {
  const [open, setOpen] = useState(QUESTION_KEYS[0])
  const items = QUESTION_KEYS.map((key) => ({
    key,
    q: SUGGESTED.find((s) => s.key === key)?.q || key,
    a: allyAnswer(program, key),
  }))

  return (
    <section className="overflow-hidden rounded-[var(--radius-card)] border border-brand-200 bg-brand-50/40">
      <div className="flex items-center gap-2.5 border-b border-brand-100 px-5 py-3.5">
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-600 text-base text-white">
          <SparkleIcon />
        </span>
        <div>
          <h2 className="text-[16px] font-black leading-tight text-ink-900">Your questions, answered</h2>
          <p className="text-[12px] text-ink-500">Straight answers from this program’s details, by Ally.</p>
        </div>
      </div>

      <div className="divide-y divide-brand-100">
        {items.map(({ key, q, a }) => {
          const isOpen = open === key
          return (
            <div key={key}>
              <button
                type="button"
                onClick={() => setOpen(isOpen ? null : key)}
                className="flex w-full items-center justify-between gap-3 px-5 py-3.5 text-left"
                aria-expanded={isOpen}
              >
                <span className="text-[16px] font-bold text-ink-900">{q}</span>
                <ChevronDownIcon
                  className={`shrink-0 text-lg text-ink-400 transition-transform ${isOpen ? 'rotate-180' : ''}`}
                />
              </button>
              {isOpen && (
                <div className="px-5 pb-4">
                  <p className="text-[15px] leading-relaxed text-ink-700">{a.text}</p>
                  {a.needsReview && (
                    <p className="mt-2 flex items-center gap-1.5 text-[12px] text-ink-400">
                      <ShieldIcon className="text-sm text-brand-500" />
                      A specialist verifies cost &amp; eligibility before you rely on it.
                    </p>
                  )}
                </div>
              )}
            </div>
          )
        })}
      </div>

      <button
        type="button"
        onClick={() => onOpenAlly?.(program)}
        className="flex w-full items-center justify-between gap-2 bg-brand-600 px-5 py-3.5 text-left text-[15px] font-bold text-white transition hover:bg-brand-700"
      >
        Ask Ally anything else about this program
        <ArrowRightIcon className="shrink-0 text-lg" />
      </button>
    </section>
  )
}
