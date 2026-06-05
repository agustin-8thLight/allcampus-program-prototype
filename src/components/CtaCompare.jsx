import { useEffect, useRef, useState } from 'react'
import { PROGRAMS } from '../data/model.js'
import { CloseIcon, ShieldIcon, BuildingIcon, HeadsetIcon, ExternalIcon } from './icons.jsx'

/*
 * Before / after of the "next step" experience, for showing impact. Left models
 * the CURRENT AllCampus flow (multiple CTAs + an Apply modal that can leave
 * straight to the school). Right is the PROPOSED "Get Program Details" chooser.
 * The "today" model is built from the current-UX reference, not live code.
 */
const SAMPLE = PROGRAMS.find((p) => !p.isDirectHandoff) || PROGRAMS[0]
const SCHOOL = SAMPLE.school?.name || 'the school'

const TODAY_ISSUES = [
  'Up to five competing actions across the drawer (two CTAs up top, two cards at the bottom, plus the Apply modal).',
  'Apply Now can hand the user to the school’s site right away.',
  'No clear line between what stays on AllCampus and what reaches the school.',
]

const PROPOSED_WINS = [
  'One primary action: Get Program Details (creates the lead record on click).',
  'A single, clear choice of how to move forward.',
  'Talking to the school is gated, nothing is shared until the user confirms.',
  'Anyone unsure is routed to an AllCampus advisor, the high-converting path.',
]

export default function CtaCompare({ onClose }) {
  const panelRef = useRef(null)
  useEffect(() => {
    const prev = document.activeElement
    const focusables = () =>
      Array.from(panelRef.current?.querySelectorAll('button, a[href], [tabindex]:not([tabindex="-1"])') || [])
    focusables()[0]?.focus()
    const onKey = (e) => {
      if (e.key === 'Escape') return onClose?.()
      if (e.key !== 'Tab') return
      const f = focusables()
      if (!f.length) return
      const [first, last] = [f[0], f[f.length - 1]]
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault()
        last.focus()
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault()
        first.focus()
      }
    }
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('keydown', onKey)
      prev?.focus?.()
    }
  }, [onClose])

  return (
    <div className="fixed inset-0 z-[70] flex justify-center overflow-y-auto bg-ink-900/60 p-4 sm:p-8">
      <div ref={panelRef} role="dialog" aria-modal="true" aria-label="Next step, today vs proposed" className="my-auto w-full max-w-5xl rounded-2xl bg-surface-0 shadow-2xl">
        <div className="flex items-center justify-between border-b border-surface-200 px-6 py-4">
          <div>
            <h2 className="text-lg font-black text-ink-900">The next step: today vs proposed</h2>
            <p className="text-[13px] text-ink-500">Same goal, fewer actions and a clear next step. Example program: {SAMPLE.name}.</p>
          </div>
          <button onClick={onClose} aria-label="Close" className="flex h-9 w-9 items-center justify-center rounded-full text-ink-500 hover:bg-surface-100">
            <CloseIcon className="text-xl" />
          </button>
        </div>

        <div className="grid gap-5 px-6 py-5 md:grid-cols-2">
          <Column label="Today" sub="Current AllCampus experience" tone="neutral">
            <TodayFlow />
            <Notes title="Where it gets muddy" items={TODAY_ISSUES} tone="neutral" />
          </Column>
          <Column label="Proposed" sub="One CTA: Get Program Details" tone="brand">
            <ProposedFlow />
            <Notes title="What changes" items={PROPOSED_WINS} tone="brand" />
          </Column>
        </div>

        <div className="border-t border-surface-200 px-6 py-4">
          <p className="text-[13px] leading-relaxed text-ink-600">
            <span className="font-bold text-ink-900">Net impact: </span>
            from several scattered actions, one of which can leave to the school immediately, to a single
            "Get Program Details" with a clear three-way choice and a confirmation step before anything
            reaches the school.
          </p>
        </div>
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ */

function Column({ label, sub, tone, children }) {
  return (
    <section className={`flex flex-col gap-4 rounded-xl border ${tone === 'brand' ? 'border-brand-200' : 'border-surface-200'} p-4`}>
      <div>
        <span className={`text-[11px] font-bold uppercase tracking-wide ${tone === 'brand' ? 'text-brand-600' : 'text-ink-400'}`}>{label}</span>
        <p className="text-[13px] text-ink-500">{sub}</p>
      </div>
      {children}
    </section>
  )
}

function Notes({ title, items, tone }) {
  return (
    <div className="mt-auto border-t border-surface-100 pt-3">
      <div className="text-[12px] font-bold uppercase tracking-wide text-ink-500">{title}</div>
      <ul className="mt-1.5 space-y-1.5">
        {items.map((t, i) => (
          <li key={i} className="flex gap-2 text-[13px] leading-relaxed text-ink-700">
            <span className={`mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full ${tone === 'brand' ? 'bg-brand-400' : 'bg-ink-300'}`} />
            <span>{t}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

/* ----- Today: current next-step experience (interactive) ----- */

function TodayFlow() {
  const [step, setStep] = useState('cards')

  if (step === 'applyModal') {
    return (
      <div className="rounded-xl border border-surface-200 bg-surface-0 p-4 text-center">
        <h3 className="text-[15px] font-black text-ink-900">Apply Now</h3>
        <p className="mt-2 text-[13px] leading-relaxed text-ink-600">
          You’re about to leave the website and continue on {SCHOOL}’s application. Are you ready to proceed?
        </p>
        <a className="mt-3 inline-block text-[13px] font-semibold text-accent-600 underline" href="#" onClick={(e) => e.preventDefault()}>
          Schedule Call with Education Benefits Specialist
        </a>
        <div className="mt-4 flex justify-center gap-2">
          <button onClick={() => setStep('cards')} className="rounded-lg px-4 py-2 text-[13px] font-bold text-ink-500 hover:bg-surface-100">Cancel</button>
          <button onClick={() => setStep('left')} className="rounded-lg bg-brand-600 px-4 py-2 text-[13px] font-bold text-white hover:bg-brand-700">Apply Now</button>
        </div>
      </div>
    )
  }
  if (step === 'left') {
    return (
      <div className="rounded-xl border border-surface-200 bg-surface-0 p-5 text-center">
        <p className="text-[14px] font-bold text-ink-900">Sent to {SCHOOL}</p>
        <p className="mt-1 text-[13px] text-ink-500">The user left to the school’s site, before any AllCampus guidance or confirmation.</p>
        <button onClick={() => setStep('cards')} className="mt-3 text-[13px] font-bold text-brand-600">Reset</button>
      </div>
    )
  }
  return (
    <div className="space-y-3">
      <div className="rounded-lg bg-surface-100 px-3 py-2 text-[12px] text-ink-500">
        Also at the top of the drawer: <span className="font-semibold text-ink-700">Apply Now</span> and <span className="font-semibold text-ink-700">Request Information</span> buttons.
      </div>
      <div className="text-[12px] font-bold uppercase tracking-wide text-ink-500">Take the Next Step</div>
      <div className="rounded-xl border border-surface-200 bg-surface-0 p-4">
        <div className="text-[14px] font-bold text-ink-900">Fast Track Your Application</div>
        <p className="mt-0.5 text-[13px] text-ink-500">Ready to move forward? Start your application today.</p>
        <button onClick={() => setStep('applyModal')} className="mt-2.5 rounded-lg bg-brand-600 px-4 py-2 text-[13px] font-bold text-white hover:bg-brand-700">Apply Now</button>
      </div>
      <div className="rounded-xl border border-surface-200 bg-surface-0 p-4">
        <div className="text-[14px] font-bold text-ink-900">Book a Call with an Advisor</div>
        <p className="mt-0.5 text-[13px] text-ink-500">Schedule a 20-30 minute call for personalized guidance.</p>
        <button className="mt-2.5 rounded-lg border border-surface-200 px-4 py-2 text-[13px] font-bold text-ink-700 hover:border-brand-300">Schedule a Time</button>
      </div>
    </div>
  )
}

/* ----- Proposed: Get Program Details -> three options ----- */

function ProposedFlow() {
  const opts = [
    { icon: BuildingIcon, school: true, title: `Talk to ${SCHOOL}`, sub: 'Gated, we confirm before sharing your details.' },
    { icon: HeadsetIcon, school: false, title: 'Compare your options', sub: 'Personalized guidance from an AllCampus advisor.' },
    { icon: ExternalIcon, school: true, title: 'Apply now', sub: 'Submit your application directly to the school.' },
  ]
  return (
    <div className="rounded-xl border border-surface-200 bg-surface-0 p-4">
      <button className="flex w-full items-center justify-center gap-2 rounded-xl bg-brand-600 px-5 py-3 text-[15px] font-bold text-white">
        Get Program Details
      </button>
      <p className="mt-3 text-[12px] text-ink-500">Opens: “How would you like to gather more information?”</p>
      <div className="mt-2 space-y-2">
        {opts.map((o) => {
          const Icon = o.icon
          return (
            <div key={o.title} className={`flex items-center gap-2.5 rounded-lg border px-3 py-2.5 ${o.school ? 'border-blue-200 bg-blue-50/50' : 'border-surface-200'}`}>
              <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-base ${o.school ? 'bg-blue-100 text-blue-700' : 'bg-brand-50 text-brand-600'}`}>
                <Icon />
              </span>
              <span className="min-w-0">
                <span className="block text-[13px] font-bold text-ink-900">{o.title}</span>
                <span className="block text-[12px] leading-snug text-ink-500">{o.sub}</span>
              </span>
            </div>
          )
        })}
      </div>
      <p className="mt-2.5 flex items-center gap-1.5 text-[12px] text-ink-400">
        <ShieldIcon className="text-sm text-brand-500" /> Nothing reaches the school until the user confirms.
      </p>
    </div>
  )
}
