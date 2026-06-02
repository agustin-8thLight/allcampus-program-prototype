import { useState } from 'react'
import {
  DocIcon,
  HeadsetIcon,
  BuildingIcon,
  ShieldIcon,
  SparkleIcon,
  CheckCircleIcon,
  ArrowRightIcon,
  ArrowLeftIcon,
  ExternalIcon,
} from './icons.jsx'

/*
 * Single-CTA flow (build plan §10.5, refined by stakeholder). Rendered as a
 * VIEW inside the program drawer (not a stacked modal): the chooser with three
 * paths:
 *   1. Request program information  -> stays in AllCampus (RFI), school NOT contacted
 *   2. Talk to a benefits specialist -> schedule a call, school NOT contacted
 *   3. Contact the school directly   -> CONFIRMATION GATE, then leaves to the
 *                                       school. This is the only path that
 *                                       sends the requester's info to the school.
 *
 * onClose returns to wherever the flow was launched from (program or Ally);
 * backLabel names that destination. directHandoff schools never reach this
 * (their single CTA links straight out, §8).
 */
export default function CtaFlow({
  program,
  origin = 'Search',
  initialStep = 'choose',
  allyEnabled = false,
  backLabel = 'Program',
  onOpenAlly,
  onClose,
}) {
  const [step, setStep] = useState(initialStep)
  const school = program.school?.name || 'the school'

  const confirmSchoolContact = () => {
    // The only path that shares info with the school + leaves the site.
    window.open(program.applicationUrl, '_blank', 'noopener')
    setStep('sent')
  }

  return (
    <div className="flex h-full flex-col bg-surface-0">
      {/* Header: back to origin + context */}
      <div className="flex items-center gap-2 border-b border-surface-100 px-3 py-3 sm:px-4">
        <button
          onClick={onClose}
          className="flex shrink-0 items-center gap-1 rounded-full px-2.5 py-1.5 text-[13px] font-bold text-ink-600 transition hover:bg-surface-100 hover:text-ink-900"
        >
          <ArrowLeftIcon className="text-base" /> {backLabel}
        </button>
        <div className="min-w-0 flex-1 text-center">
          <div className="text-[11px] font-bold uppercase tracking-wide text-ink-400">
            Take the next step
          </div>
          <div className="truncate text-sm font-bold text-ink-900">{program.name}</div>
        </div>
        <span className="w-[84px] shrink-0" aria-hidden />
      </div>

      <div className="no-scrollbar flex-1 overflow-y-auto px-5 py-8 sm:px-6">
        <div className="mx-auto w-full max-w-md">
          {step === 'choose' && (
            <Choose
              school={school}
              allyEnabled={allyEnabled}
              onInfo={() => setStep('info')}
              onAlly={() => onOpenAlly?.(program)}
              onAdvisor={() => setStep('advisor')}
              onSchool={() => setStep('gate')}
            />
          )}

          {step === 'info' && (
            <Success
              title="Request received"
              body={`We'll send program details for ${program.name} your way. ${school} has not been contacted, you stay in control of that step.`}
              origin={origin}
              onClose={onClose}
              onBack={() => setStep('choose')}
            />
          )}

          {step === 'advisor' && (
            <Advisor school={school} onBack={() => setStep('choose')} onBooked={() => setStep('booked')} />
          )}

          {step === 'booked' && (
            <Success
              title="You're booked"
              body={`A benefits specialist will call to talk through tuition savings and next steps. ${school} has not been contacted.`}
              origin={origin}
              onClose={onClose}
              onBack={() => setStep('choose')}
            />
          )}

          {step === 'gate' && (
            <Gate
              school={school}
              onBack={() => setStep('choose')}
              onConfirm={confirmSchoolContact}
            />
          )}

          {step === 'sent' && (
            <Success
              title={`Connected with ${school}`}
              body={`Your information has been shared with ${school} and their application opened in a new tab.`}
              origin={origin}
              onClose={onClose}
              shared
            />
          )}
        </div>
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ */

function Choose({ school, allyEnabled, onInfo, onAlly, onAdvisor, onSchool }) {
  return (
    <div>
      <p className="mb-4 text-[15px] text-ink-700">How would you like to move forward?</p>

      {/* Internal: stays with AllCampus, the school is not contacted. */}
      <GroupLabel icon={ShieldIcon} tone="brand">On AllCampus, the school isn’t contacted</GroupLabel>
      <div className="space-y-2.5">
        <OptionRow
          icon={DocIcon}
          title="Request program information"
          sub="Get details and answers sent to you. Your info stays with AllCampus."
          onClick={onInfo}
        />
        {allyEnabled && (
          <OptionRow
            icon={SparkleIcon}
            title="Chat with Ally, the AllCampus assistant"
            sub="Ask questions and get instant answers. Nothing leaves AllCampus."
            onClick={onAlly}
          />
        )}
        <OptionRow
          icon={HeadsetIcon}
          title="Talk to an AllCampus benefits specialist"
          sub="Book a 20-30 minute call with an AllCampus specialist on tuition savings and next steps."
          onClick={onAdvisor}
        />
      </div>

      {/* External: the only path that reaches the school. */}
      <GroupLabel icon={ExternalIcon} tone="amber" className="mt-5">
        With the school, this leaves AllCampus
      </GroupLabel>
      <div className="space-y-2.5">
        <OptionRow
          icon={BuildingIcon}
          title="Contact the school directly"
          sub={`Connect with ${school} about applying. This is the only step that shares your details with them, and we'll confirm first.`}
          channel="external"
          onClick={onSchool}
        />
      </div>

      <p className="mt-4 flex items-start gap-1.5 text-xs text-ink-400">
        <ShieldIcon className="mt-0.5 shrink-0 text-sm text-brand-500" />
        Nothing reaches the school until you confirm in the last step.
      </p>
    </div>
  )
}

function GroupLabel({ icon: Icon, tone = 'brand', className = '', children }) {
  const color = tone === 'amber' ? 'text-amber-700' : 'text-ink-500'
  return (
    <div className={`mb-2 flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wide ${color} ${className}`}>
      <Icon className="text-sm" />
      {children}
    </div>
  )
}

function OptionRow({ icon: Icon, title, sub, channel = 'internal', onClick }) {
  const external = channel === 'external'
  return (
    <button
      onClick={onClick}
      className={`flex w-full items-center gap-3.5 rounded-xl border px-4 py-3.5 text-left transition ${
        external
          ? 'border-amber-200 bg-amber-50/40 hover:border-amber-300'
          : 'border-surface-200 bg-surface-0 hover:border-brand-300 hover:bg-brand-50/40'
      }`}
    >
      <span
        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-xl ${
          external ? 'bg-amber-100 text-amber-700' : 'bg-brand-50 text-brand-600'
        }`}
      >
        <Icon />
      </span>
      <span className="min-w-0 flex-1">
        <span className="flex flex-wrap items-center gap-x-2 gap-y-1">
          <span className="text-[15px] font-bold text-ink-900">{title}</span>
          {external && (
            <span className="shrink-0 rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-amber-700">
              Leaves AllCampus
            </span>
          )}
        </span>
        <span className="mt-0.5 block text-[13px] leading-snug text-ink-500">{sub}</span>
      </span>
      <ArrowRightIcon className="shrink-0 text-base text-ink-400" />
    </button>
  )
}

function Gate({ school, onBack, onConfirm }) {
  return (
    <div className="text-center">
      <span className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-brand-50 text-2xl text-brand-600">
        <ShieldIcon />
      </span>
      <h3 className="text-lg font-black text-ink-900">Share your details with {school}?</h3>
      <p className="mx-auto mt-2 max-w-sm text-[14px] leading-relaxed text-ink-600">
        Continuing sends your contact information to {school} and opens their application in a new
        tab. You can keep exploring on AllCampus instead.
      </p>
      <p className="mt-3 text-sm font-bold text-ink-900">Are you ready to proceed?</p>
      <div className="mt-5 flex flex-col gap-2">
        <button
          onClick={onConfirm}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-brand-600 px-5 py-3 text-sm font-bold text-white hover:bg-brand-700"
        >
          Yes, contact {school.split(' ')[0]}
          <ExternalIcon className="text-base" />
        </button>
        <button
          onClick={onBack}
          className="w-full rounded-xl px-5 py-2.5 text-sm font-bold text-ink-500 hover:bg-surface-100"
        >
          Not yet, go back
        </button>
      </div>
    </div>
  )
}

function Advisor({ school, onBack, onBooked }) {
  // Placeholder scheduling step. Real calendar is out of scope for the spec.
  const slots = ['Tomorrow, 10:00 AM', 'Tomorrow, 2:30 PM', 'Thu, 11:00 AM', 'Fri, 4:00 PM']
  return (
    <div>
      <BackLink onBack={onBack} />
      <h3 className="text-lg font-black text-ink-900">Schedule a call</h3>
      <p className="mt-1 text-[14px] text-ink-600">
        Pick a time to talk with an Education Benefits Specialist. {school} is not contacted.
      </p>
      <div className="mt-4 grid grid-cols-2 gap-2">
        {slots.map((s) => (
          <button
            key={s}
            onClick={onBooked}
            className="rounded-xl border border-surface-200 px-3 py-3 text-sm font-semibold text-ink-700 transition hover:border-brand-300 hover:bg-brand-50/40"
          >
            {s}
          </button>
        ))}
      </div>
    </div>
  )
}

function Success({ title, body, origin, onClose, onBack, shared }) {
  return (
    <div className="text-center">
      <span
        className={`mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full text-2xl ${
          shared ? 'bg-info-50 text-info-700' : 'bg-good-50 text-good-600'
        }`}
      >
        <CheckCircleIcon />
      </span>
      <h3 className="text-lg font-black text-ink-900">{title}</h3>
      <p className="mx-auto mt-2 max-w-sm text-[14px] leading-relaxed text-ink-600">{body}</p>
      <p className="mt-3 text-[11px] uppercase tracking-wide text-ink-400">Request origin: {origin}</p>
      <div className="mt-5 flex flex-col gap-2">
        <button
          onClick={onClose}
          className="w-full rounded-xl bg-brand-600 px-5 py-3 text-sm font-bold text-white hover:bg-brand-700"
        >
          Done
        </button>
        {onBack && (
          <button
            onClick={onBack}
            className="w-full rounded-xl px-5 py-2.5 text-sm font-bold text-ink-500 hover:bg-surface-100"
          >
            Back to options
          </button>
        )}
      </div>
    </div>
  )
}

function BackLink({ onBack }) {
  return (
    <button
      onClick={onBack}
      className="mb-3 inline-flex items-center gap-1.5 text-[13px] font-bold text-ink-500 hover:text-ink-900"
    >
      <ArrowLeftIcon className="text-base" /> Back
    </button>
  )
}
