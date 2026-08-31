import { useEffect } from 'react'
import { emitStoryEvent } from '../data/useCases.js'

/*
 * The account gate.
 *
 * 2026-08-31 review moved this in front of the program-card click, upstream of
 * the card opening. Terrence: "it would be easier to do it at the upstream
 * because as soon as you open the card, now you've got a few" — Ally, the fork,
 * the cost math. James: "it teases the person into wanting to sign up."
 *
 * That change makes the old copy false. It used to say nothing was withheld
 * from someone who said Not now, which was true when the gate only fired on
 * Save. Now the card stays shut, so the modal has to say what it is asking for
 * and what declining costs.
 *
 * It also has to carry the activation message. Brigid's complaint about the
 * program card was that it "doesn't tell you that you have to take this step to
 * get the discount" — and if the gate now stands where that click was, the gate
 * is the thing that has to say so.
 *
 * `trigger` was previously set at four call sites and read by none of them.
 * Reading it is what lets one modal answer the question the person actually
 * asked, instead of a generic ask that fits none of them.
 */
const COPY = {
  // They clicked a program card and want the program. One line on the reason.
  program: {
    title: 'Create a free account to open this program',
    body: () => 'See your real price. Discounts only apply when you go through AllCampus.',
    dismiss: 'Back to results',
  },
  save: {
    title: 'Create a free account to save this',
    body: () => 'Your saved programs will be here next visit.',
    dismiss: 'Not now',
  },
  compare: {
    title: 'Create a free account to compare',
    body: () => 'Your comparison stays put between visits.',
    dismiss: 'Not now',
  },
  specialist: {
    title: 'Create a free account to book a call',
    body: () => 'Your specialist sees your benefit before the call starts.',
    dismiss: 'Not now',
  },
  catalog: {
    title: 'Create your free account',
    body: (who) =>
      who ? `Save programs and keep your ${who} pricing.` : 'Save programs and keep your pricing.',
    dismiss: 'Not now',
  },
}

export default function GateModal({ open, partner, onJoin, onDismiss, trigger }) {
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
  const copy = COPY[trigger] || COPY.catalog
  // "your employer" reads wrong twice over when the partner is already called
  // "Your employer" — that is the generic EdAssist record.
  const who = benefit ? (/^your /i.test(partner.name) ? 'employer' : partner.name) : null
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
        {/* One action, one name, so this reads the same as the header's Create
            account and the journey card (2026-08-25). What varies is the reason,
            because the reason is what the person is owed. */}
        <h2 className="text-xl font-black text-ink-900">{copy.title}</h2>
        <p className="mt-2 text-[15px] leading-relaxed text-ink-600">{copy.body(who)}</p>
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
            {copy.dismiss}
          </button>
        </div>
      </div>
    </div>
  )
}
