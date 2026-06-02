import { useEffect, useRef, useState } from 'react'
import { PROGRAMS } from '../data/model.js'
import { Choose, Gate } from './CtaFlow.jsx'
import {
  CloseIcon,
  CheckCircleIcon,
  ShieldIcon,
  ArrowLeftIcon,
  ArrowRightIcon,
} from './icons.jsx'

/*
 * Before / after comparison of the "next step" experience, for showing impact.
 * Left models the CURRENT AllCampus flow (multiple CTAs + an Apply Now modal
 * that can leave straight to the school). Right is the PROPOSED single-CTA
 * chooser (reusing the real Choose/Gate), with the internal/external split.
 *
 * Both sides are lightly interactive. The "today" model is built from the
 * current-UX reference, not the live code.
 */

const SAMPLE = PROGRAMS.find((p) => !p.isDirectHandoff) || PROGRAMS[0]
const SCHOOL = SAMPLE.school?.name || 'the school'

const TODAY_ISSUES = [
  'Up to five competing actions across the drawer (two CTAs up top, two cards at the bottom, plus the Apply modal).',
  'Apply Now can hand the user to the school’s site right away.',
  'The advisor (Education Benefits Specialist) is tucked inside the Apply modal, easy to miss.',
  'No clear line between staying on AllCampus and contacting the school.',
]

const PROPOSED_WINS = [
  'One primary action: Take the next step.',
  'Internal options (info, Ally, AllCampus specialist) are clearly separated from contacting the school.',
  'Contacting the school is gated, nothing is shared until the user confirms.',
  'Protects lead quality: schools hear from students who are ready.',
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
            <p className="text-[13px] text-ink-500">Same goal, fewer actions and a clear internal/external line. Example program: {SAMPLE.name}.</p>
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
          <Column label="Proposed" sub="One CTA, clear internal vs external" tone="brand">
            <ProposedFlow />
            <Notes title="What changes" items={PROPOSED_WINS} tone="brand" />
          </Column>
        </div>

        <div className="border-t border-surface-200 px-6 py-4">
          <p className="text-[13px] leading-relaxed text-ink-600">
            <span className="font-bold text-ink-900">Net impact: </span>
            from up to five scattered actions, one of which can leave to the school immediately, to a
            single guided choice with a clear AllCampus-vs-school line and a confirmation gate before
            anything reaches the school.
          </p>
        </div>
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ */

function Column({ label, sub, tone, children }) {
  const ring = tone === 'brand' ? 'border-brand-200' : 'border-surface-200'
  return (
    <section className={`flex flex-col gap-4 rounded-xl border ${ring} p-4`}>
      <div>
        <span className={`text-[11px] font-bold uppercase tracking-wide ${tone === 'brand' ? 'text-brand-600' : 'text-ink-400'}`}>
          {label}
        </span>
        <p className="text-[13px] text-ink-500">{sub}</p>
      </div>
      {children}
    </section>
  )
}

function Notes({ title, items, tone }) {
  const dot = tone === 'brand' ? 'bg-brand-400' : 'bg-ink-300'
  return (
    <div className="mt-auto border-t border-surface-100 pt-3">
      <div className="text-[12px] font-bold uppercase tracking-wide text-ink-500">{title}</div>
      <ul className="mt-1.5 space-y-1.5">
        {items.map((t, i) => (
          <li key={i} className="flex gap-2 text-[13px] leading-relaxed text-ink-700">
            <span className={`mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full ${dot}`} />
            <span>{t}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

/* ----- Today: current next-step experience ----- */

function TodayFlow() {
  const [step, setStep] = useState('cards')

  if (step === 'applyModal') {
    return (
      <div className="rounded-xl border border-surface-200 bg-surface-0 p-4 text-center">
        <h3 className="text-[15px] font-black text-ink-900">Apply Now</h3>
        <p className="mt-2 text-[13px] leading-relaxed text-ink-600">
          You’re about to leave the website and continue on {SCHOOL}’s application. Are you ready to
          proceed?
        </p>
        <a className="mt-3 inline-block text-[13px] font-semibold text-accent-600 underline" href="#" onClick={(e) => e.preventDefault()}>
          Schedule Call with Education Benefits Specialist
        </a>
        <div className="mt-4 flex justify-center gap-2">
          <button onClick={() => setStep('cards')} className="rounded-lg px-4 py-2 text-[13px] font-bold text-ink-500 hover:bg-surface-100">
            Cancel
          </button>
          <button onClick={() => setStep('left')} className="rounded-lg bg-brand-600 px-4 py-2 text-[13px] font-bold text-white hover:bg-brand-700">
            Apply Now
          </button>
        </div>
      </div>
    )
  }

  if (step === 'left') {
    return (
      <div className="rounded-xl border border-surface-200 bg-surface-0 p-5 text-center">
        <p className="text-[14px] font-bold text-ink-900">Sent to {SCHOOL}</p>
        <p className="mt-1 text-[13px] text-ink-500">The user left to the school’s site, before any AllCampus guidance or gate.</p>
        <button onClick={() => setStep('cards')} className="mt-3 text-[13px] font-bold text-brand-600">Reset</button>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      <div className="rounded-lg bg-surface-100 px-3 py-2 text-[12px] text-ink-500">
        Also at the top of the drawer: <span className="font-semibold text-ink-700">Apply Now</span> and{' '}
        <span className="font-semibold text-ink-700">Request Information</span> buttons.
      </div>
      <div className="text-[12px] font-bold uppercase tracking-wide text-ink-500">Take the Next Step</div>
      <div className="rounded-xl border border-surface-200 bg-surface-0 p-4">
        <div className="text-[14px] font-bold text-ink-900">Fast Track Your Application</div>
        <p className="mt-0.5 text-[13px] text-ink-500">Ready to move forward? Start your application today.</p>
        <button onClick={() => setStep('applyModal')} className="mt-2.5 rounded-lg bg-brand-600 px-4 py-2 text-[13px] font-bold text-white hover:bg-brand-700">
          Apply Now
        </button>
      </div>
      <div className="rounded-xl border border-surface-200 bg-surface-0 p-4">
        <div className="text-[14px] font-bold text-ink-900">Book a Call with an Advisor</div>
        <p className="mt-0.5 text-[13px] text-ink-500">Schedule a 20-30 minute call for personalized guidance.</p>
        <button className="mt-2.5 rounded-lg border border-surface-200 px-4 py-2 text-[13px] font-bold text-ink-700 hover:border-brand-300">
          Schedule a Time
        </button>
      </div>
    </div>
  )
}

/* ----- Proposed: single CTA -> chooser -> gate ----- */

function ProposedFlow() {
  const [step, setStep] = useState('cta')
  const noop = () => setStep('internal')

  if (step === 'cta') {
    return (
      <div className="rounded-xl border border-surface-200 bg-surface-0 p-4">
        <p className="text-[13px] text-ink-500">A single action, the same in every concept:</p>
        <button onClick={() => setStep('choose')} className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl bg-brand-600 px-5 py-3 text-[15px] font-bold text-white hover:bg-brand-700">
          Take the next step <ArrowRightIcon className="text-lg" />
        </button>
      </div>
    )
  }
  if (step === 'choose') {
    return (
      <div className="rounded-xl border border-surface-200 bg-surface-0 p-4">
        <Choose school={SCHOOL} allyEnabled onInfo={noop} onAlly={noop} onAdvisor={noop} onSchool={() => setStep('gate')} />
        <BackLink onClick={() => setStep('cta')} />
      </div>
    )
  }
  if (step === 'internal') {
    return (
      <div className="rounded-xl border border-surface-200 bg-surface-0 p-5 text-center">
        <span className="mx-auto mb-2 flex h-11 w-11 items-center justify-center rounded-full bg-good-50 text-2xl text-good-600">
          <CheckCircleIcon />
        </span>
        <p className="text-[14px] font-bold text-ink-900">Stays on AllCampus</p>
        <p className="mt-1 text-[13px] text-ink-500">{SCHOOL} is not contacted. The user keeps control of that step.</p>
        <BackLink onClick={() => setStep('choose')} centered />
      </div>
    )
  }
  if (step === 'gate') {
    return (
      <div className="rounded-xl border border-surface-200 bg-surface-0 p-2">
        <Gate school={SCHOOL} onBack={() => setStep('choose')} onConfirm={() => setStep('sent')} />
      </div>
    )
  }
  return (
    <div className="rounded-xl border border-surface-200 bg-surface-0 p-5 text-center">
      <span className="mx-auto mb-2 flex h-11 w-11 items-center justify-center rounded-full bg-info-50 text-2xl text-info-700">
        <ShieldIcon />
      </span>
      <p className="text-[14px] font-bold text-ink-900">Shared with {SCHOOL}, after confirmation</p>
      <p className="mt-1 text-[13px] text-ink-500">Only now, and only because the user confirmed in the gate.</p>
      <BackLink onClick={() => setStep('cta')} centered />
    </div>
  )
}

function BackLink({ onClick, centered }) {
  return (
    <button
      onClick={onClick}
      className={`mt-3 inline-flex items-center gap-1 text-[12px] font-bold text-ink-500 hover:text-ink-900 ${centered ? 'mx-auto' : ''}`}
    >
      <ArrowLeftIcon className="text-sm" /> Back
    </button>
  )
}
