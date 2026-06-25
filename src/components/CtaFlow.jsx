import { useState } from 'react'
import {
  BuildingIcon,
  HeadsetIcon,
  ShieldIcon,
  SparkleIcon,
  CheckCircleIcon,
  ArrowRightIcon,
  ArrowLeftIcon,
  ExternalIcon,
  CalendarIcon,
} from './icons.jsx'

/*
 * "Get Program Details" flow (stakeholder spec). Rendered as a VIEW inside the
 * program drawer, not a stacked modal. Opening it creates the HubSpot deal
 * (backend, noted in the spec). The chooser, "How would you like to gather
 * more information?", has three options:
 *   1. Talk to [School]        -> confirmation gate, the school then reaches out.
 *   2. Need more information first? -> schedule with an Education Specialist (+ contact).
 *   3. Apply now               -> opens the school's application.
 *
 * Can also open directly at the advisor step (from "Talk to an advisor" links).
 */
const ALLCAMPUS_EMAIL = 'hello@allcampus.com'
const ALLCAMPUS_PHONE = '312.237.2051'

export default function CtaFlow({
  program,
  initialStep = 'choose',
  backLabel = 'Program',
  allyEnabled = false,
  onOpenAlly,
  onRequested,
  onClose,
}) {
  const [step, setStep] = useState(initialStep)
  const school = program.school?.name || 'the school'
  const schoolShort = school.split(' ')[0]

  const applyNow = () => {
    onRequested?.(program)
    window.open(program.applicationUrl, '_blank', 'noopener')
    setStep('applied')
  }

  return (
    <div className="flex h-full flex-col bg-surface-0">
      {/* Header */}
      <div className="flex items-center gap-2 border-b border-surface-100 px-3 py-3 sm:px-4">
        <button
          onClick={onClose}
          className="flex shrink-0 items-center gap-1 rounded-full px-2.5 py-1.5 text-[13px] font-bold text-ink-600 transition hover:bg-surface-100 hover:text-ink-900"
        >
          <ArrowLeftIcon className="text-base" /> {backLabel}
        </button>
        <div className="min-w-0 flex-1 text-center">
          <div className="text-[11px] font-bold uppercase tracking-wide text-ink-400">Get program details</div>
          <div className="truncate text-sm font-bold text-ink-900">{program.name}</div>
        </div>
        <span className="w-[84px] shrink-0" aria-hidden />
      </div>

      <div className="no-scrollbar flex-1 overflow-y-auto px-5 py-8 sm:px-6">
        <div className="mx-auto w-full max-w-md">
          {step === 'choose' && (
            <div>
              <p className="mb-4 text-[15px] text-ink-700">How would you like to gather more information?</p>
              <div className="space-y-2.5">
                {allyEnabled && (
                  <OptionRow
                    icon={SparkleIcon}
                    title="Ask Ally"
                    sub="Get instant answers about this program. No call to book, nothing leaves AllCampus."
                    onClick={() => onOpenAlly?.(program)}
                  />
                )}
                <OptionRow
                  icon={BuildingIcon}
                  channel="school"
                  title={`Talk to ${school}`}
                  sub="Learn more about the program, admissions requirements, costs, and next steps directly from the school."
                  onClick={() => setStep('gate')}
                />
                <OptionRow
                  icon={HeadsetIcon}
                  title="Need more information first?"
                  sub="Talk with an Education Specialist about costs, benefits, school options, and next steps. We won't share your information with the school unless you decide to move forward."
                  onClick={() => setStep('advisor')}
                />
                <OptionRow
                  icon={ExternalIcon}
                  channel="school"
                  title="Apply now"
                  sub="Ready to get started? Secure your tuition discount and submit your application directly to the school. You'll hear from the school's admissions team about next steps."
                  onClick={applyNow}
                />
              </div>
            </div>
          )}

          {step === 'gate' && (
            <div className="text-center">
              <span className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 text-2xl text-blue-700">
                <ShieldIcon />
              </span>
              <h3 className="text-lg font-black text-ink-900">Share your details with {school}?</h3>
              <p className="mx-auto mt-2 max-w-sm text-[14px] leading-relaxed text-ink-600">
                Continuing sends your contact information to {school}. They will be reaching out to help
                you gather information about the program.
              </p>
              <div className="mt-5 flex flex-col gap-2">
                <button
                  onClick={() => {
                    onRequested?.(program)
                    setStep('sentSchool')
                  }}
                  className="w-full rounded-xl bg-brand-600 px-5 py-3 text-sm font-bold text-white hover:bg-brand-700"
                >
                  Yes
                </button>
                <button
                  onClick={() => setStep('choose')}
                  className="w-full rounded-xl px-5 py-2.5 text-sm font-bold text-ink-500 hover:bg-surface-100"
                >
                  Not yet, go back
                </button>
              </div>
            </div>
          )}

          {step === 'advisor' && (
            <div>
              {initialStep !== 'advisor' && <BackLink onClick={() => setStep('choose')} />}
              <div className="text-center">
                <span className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-brand-50 text-2xl text-brand-600">
                  <HeadsetIcon />
                </span>
                <h3 className="text-lg font-black text-ink-900">Talk with an Education Specialist</h3>
              </div>
              <button
                onClick={() => {
                  onRequested?.(program)
                  setStep('booked')
                }}
                className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-brand-600 px-5 py-3 text-sm font-bold text-white hover:bg-brand-700"
              >
                <CalendarIcon className="text-base" /> Choose a time that works for you
                <ArrowRightIcon className="text-base" />
              </button>
              <p className="mt-4 text-center text-[13px] text-ink-500">
                Not ready for a call? Send us a question by text or email.
              </p>
              <div className="mt-2 flex flex-col items-center gap-1 text-[14px] font-semibold text-ink-800">
                <span>📧 {ALLCAMPUS_EMAIL}</span>
                <span>📞 {ALLCAMPUS_PHONE}</span>
              </div>
            </div>
          )}

          {step === 'sentSchool' && (
            <Success
              tone="blue"
              title={`Connected with ${school}`}
              body={`${school} will reach out to help you gather information about the program.`}
              onClose={onClose}
            />
          )}

          {step === 'applied' && (
            <Success
              tone="blue"
              title={`${schoolShort} application opened`}
              body={`${school}'s application opened in a new tab. You'll hear from their admissions team about next steps.`}
              onClose={onClose}
            />
          )}

          {step === 'booked' && (
            <Success
              title="Request received"
              body="An AllCampus advisor will reach out to schedule your call and help with programs, tuition savings, and next steps."
              onClose={onClose}
            />
          )}
        </div>
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ */

function OptionRow({ icon: Icon, title, sub, channel = 'internal', onClick }) {
  const school = channel === 'school'
  return (
    <button
      onClick={onClick}
      className={`flex w-full items-center gap-3.5 rounded-xl border px-4 py-3.5 text-left transition ${
        school ? 'border-blue-200 bg-blue-50/50 hover:border-blue-300' : 'border-surface-200 bg-surface-0 hover:border-brand-300 hover:bg-brand-50/40'
      }`}
    >
      <span
        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-xl ${
          school ? 'bg-blue-100 text-blue-700' : 'bg-brand-50 text-brand-600'
        }`}
      >
        <Icon />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-[15px] font-bold text-ink-900">{title}</span>
        <span className="block text-[13px] leading-snug text-ink-500">{sub}</span>
      </span>
      <ArrowRightIcon className="shrink-0 text-base text-ink-400" />
    </button>
  )
}

function Success({ title, body, tone, onClose }) {
  return (
    <div className="text-center">
      <span
        className={`mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full text-2xl ${
          tone === 'blue' ? 'bg-blue-100 text-blue-700' : 'bg-good-50 text-good-600'
        }`}
      >
        <CheckCircleIcon />
      </span>
      <h3 className="text-lg font-black text-ink-900">{title}</h3>
      <p className="mx-auto mt-2 max-w-sm text-[14px] leading-relaxed text-ink-600">{body}</p>
      <button
        onClick={onClose}
        className="mt-5 w-full rounded-xl bg-brand-600 px-5 py-3 text-sm font-bold text-white hover:bg-brand-700"
      >
        Done
      </button>
    </div>
  )
}

function BackLink({ onClick }) {
  return (
    <button onClick={onClick} className="mb-3 inline-flex items-center gap-1 text-[13px] font-bold text-ink-500 hover:text-ink-900">
      <ArrowLeftIcon className="text-base" /> Back
    </button>
  )
}
