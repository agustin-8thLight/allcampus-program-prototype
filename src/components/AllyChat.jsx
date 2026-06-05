import { useEffect, useRef, useState } from 'react'
import { resolveCost, money } from '../data/model.js'
import {
  SparkleIcon,
  SendIcon,
  ArrowLeftIcon,
  ArrowRightIcon,
  ExternalIcon,
  ChevronDownIcon,
  ShieldIcon,
} from './icons.jsx'

/*
 * Ally, the in-page assistant (build plan §11, Phase 2 scaffolded here for the
 * 2A iteration). Scoped to the current program. Lower-friction alternative to
 * booking a benefits specialist: the user can ask questions first.
 *
 * Guardrails (org AI policy + §11):
 *  - Stays inside AllCampus. Never contacts the school on its own.
 *  - "Contact the school" routes through the SAME confirmation gate.
 *  - Cost/eligibility answers carry a "verified by a specialist" note.
 *  - For outcome/ROI questions with no real data, Ally says so instead of
 *    inventing numbers (Career Changer is unserved until normalized data).
 *
 * Answers are canned/mocked for the prototype; a real build wires the model.
 */

export const SUGGESTED = [
  { key: 'fit', q: 'Will this fit around a full-time job?' },
  { key: 'cost', q: 'How much will I actually pay?' },
  { key: 'employer', q: 'How does the employer benefit work?' },
  { key: 'admission', q: 'Will I get in?' },
  { key: 'outcomes', q: 'What jobs can this lead to?' },
]

export function allyAnswer(p, key) {
  const v = resolveCost(p)
  switch (key) {
    case 'fit': {
      const start = p.rollingEnrollment ? 'You can start on a rolling basis' : 'New cohorts start on a set date'
      return {
        text: `${p.name} runs about ${p.duration}, with roughly ${p.timeCommitment} of coursework, delivered ${(p.courseModality || 'online').toLowerCase()}. ${start}, and the schedule is built so you can study around a full-time job.`,
      }
    }
    case 'cost':
      return {
        text: `The ${v.primaryLabel.toLowerCase()} is ${v.primaryValue}${v.struck ? `, down from ${v.struck}` : ''}.${
          v.deferred ? ' You can also defer payment and pay over time.' : ''
        } Your actual cost depends on transfer credits and any employer benefit.`,
        needsReview: true,
      }
    case 'employer':
      return p.employerReimbursementEstimate != null
        ? {
            text: `If your employer offers an education benefit, it could cover up to ${money(
              p.employerReimbursementEstimate,
            )} of this program${
              p.outOfPocketEstimate === 0
                ? ', leaving $0 out of pocket'
                : p.outOfPocketEstimate != null
                  ? `, leaving about ${money(p.outOfPocketEstimate)} out of pocket`
                  : ''
            }. A benefits specialist can confirm what your specific employer covers.`,
            needsReview: true,
          }
        : {
            text: `${p.name} doesn't list a built-in employer benefit, but many employers reimburse tuition. A benefits specialist can check whether yours applies, without contacting your school.`,
            needsReview: true,
          }
    case 'admission':
      return p.admissionRequirements?.length
        ? {
            text: `To be considered, ${p.school?.name} looks for: ${p.admissionRequirements
              .map((r) => r.replace(/\.$/, '').toLowerCase())
              .join('; ')}. No test scores are required unless noted.`,
          }
        : {
            text: `Admission details for ${p.name} aren't listed yet. A benefits specialist can walk you through what's needed, with no obligation.`,
          }
    case 'outcomes':
      return {
        text: `I don't have verified job-placement or salary data for ${p.name} yet, so I won't guess at numbers. What I can share: the coursework covers ${(
          p.curriculumHighlights || []
        )
          .slice(0, 3)
          .join(', ') || 'the program’s core areas'}. For verified outcomes, a benefits specialist is your best source.`,
        needsReview: true,
      }
    default:
      return {
        text: 'Good question. I can help with how the program is structured, what it costs, and how employer benefits work. For specifics like that, a benefits specialist can give you a verified answer, no commitment.',
      }
  }
}

export default function AllyChat({ program, initialAsk, onBack, onRequestInfo }) {
  const [messages, setMessages] = useState([
    {
      from: 'ally',
      text: `Hi, I'm Ally. Ask me anything about ${program.name} at ${program.school?.name}. I'll only share what I can back up, and I'll never contact the school for you.`,
    },
  ])
  const [input, setInput] = useState('')
  const [asked, setAsked] = useState([])
  const [costOpen, setCostOpen] = useState(false)
  const scrollRef = useRef(null)
  const v = resolveCost(program)

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' })
  }, [messages])

  // Dev affordance: pre-ask a suggested question for review/screenshots.
  // Ref-guarded so StrictMode's double-invoke doesn't duplicate the exchange.
  const didPreAsk = useRef(false)
  useEffect(() => {
    if (didPreAsk.current) return
    const s = SUGGESTED.find((x) => x.key === initialAsk)
    if (s) {
      didPreAsk.current = true
      ask(s.key, s.q)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const ask = (key, q) => {
    const a = allyAnswer(program, key)
    setAsked((prev) => [...prev, key])
    setMessages((prev) => [...prev, { from: 'user', text: q }, { from: 'ally', ...a }])
  }

  const send = (e) => {
    e.preventDefault()
    const text = input.trim()
    if (!text) return
    setInput('')
    const a = allyAnswer(program, 'free')
    setMessages((prev) => [...prev, { from: 'user', text }, { from: 'ally', ...a }])
  }

  const remaining = SUGGESTED.filter((s) => !asked.includes(s.key))

  return (
    <div className="flex h-full flex-col bg-surface-0">
      {/* Header: back to program + Ally identity */}
      <div className="flex items-center gap-2 border-b border-surface-100 px-3 py-3 sm:px-4">
        <button
          onClick={onBack}
          className="flex shrink-0 items-center gap-1 rounded-full px-2.5 py-1.5 text-[13px] font-bold text-ink-600 transition hover:bg-surface-100 hover:text-ink-900"
        >
          <ArrowLeftIcon className="text-base" /> Program
        </button>
        <div className="flex min-w-0 flex-1 items-center justify-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-600 text-base text-white">
            <SparkleIcon />
          </span>
          <span className="flex items-center gap-1.5 text-sm font-black text-ink-900">
            Ally
            <span className="rounded bg-brand-50 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide text-brand-700">
              AI
            </span>
          </span>
        </div>
        {/* spacer to balance the back button so Ally stays centered */}
        <span className="w-[84px] shrink-0" aria-hidden />
      </div>

      {/* Sticky program context: title, short description, and a collapsed cost,
          so the user always knows what they're asking Ally about. */}
      <div className="border-b border-surface-100 bg-surface-50 px-4 py-3 sm:px-6">
        <div className="mx-auto w-full max-w-2xl">
          <div className="flex items-start gap-3">
            {program.programImageUrl ? (
              <img
                src={program.programImageUrl}
                alt=""
                className="h-10 w-14 shrink-0 rounded-md object-cover"
              />
            ) : (
              <span
                className="h-10 w-14 shrink-0 rounded-md"
                style={{ background: `linear-gradient(135deg, hsl(${program.programImageHue} 55% 48%), hsl(${(program.programImageHue + 28) % 360} 60% 32%))` }}
                aria-hidden
              />
            )}
            <div className="min-w-0 flex-1">
              <div className="truncate text-[15px] font-bold text-ink-900">{program.name}</div>
              <div className="truncate text-[12px] text-ink-500">{program.school?.name}</div>
            </div>
            <button
              onClick={onBack}
              className="shrink-0 text-[12px] font-semibold text-brand-600 hover:text-brand-700"
            >
              View details
            </button>
          </div>

          {program.headline && (
            <p className="mt-1.5 line-clamp-2 text-[13px] leading-snug text-ink-600">{program.headline}</p>
          )}

          {/* Collapsed cost */}
          {v.primaryValue && (
            <div className="mt-2">
              <button
                onClick={() => setCostOpen((o) => !o)}
                aria-expanded={costOpen}
                className="flex w-full items-center justify-between gap-2 rounded-lg border border-surface-200 bg-surface-0 px-3 py-2 text-left"
              >
                <span className="flex min-w-0 items-baseline gap-2">
                  <span className="shrink-0 text-[11px] font-semibold uppercase tracking-wide text-ink-400">
                    {v.primaryLabel}
                  </span>
                  <span className="text-[15px] font-black text-ink-900">{v.primaryValue}</span>
                  {v.struck && <span className="text-[12px] text-ink-400 line-through">{v.struck}</span>}
                </span>
                <ChevronDownIcon
                  className={`shrink-0 text-base text-ink-400 transition-transform ${costOpen ? 'rotate-180' : ''}`}
                />
              </button>
              {costOpen && (
                <div className="mt-1.5 space-y-1 px-1 text-[12px] leading-relaxed text-ink-600">
                  {v.benefitLabel && <p className="capitalize">{v.benefitLabel}</p>}
                  {v.perCreditNote && <p>{v.perCreditNote}</p>}
                  {v.deferred && <p>Deferred payment available, start now and pay over time.</p>}
                  <p className="text-ink-400">Estimate. Confirm your full cost with a specialist.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="no-scrollbar flex-1 overflow-y-auto px-4 py-4 sm:px-6">
        <div className="mx-auto w-full max-w-2xl space-y-3">
          {messages.map((m, i) => (
            <div key={i} className={m.from === 'user' ? 'flex justify-end' : 'flex justify-start'}>
              <div className="max-w-[85%]">
                <div
                  className={`rounded-2xl px-3.5 py-2.5 text-[14px] leading-relaxed ${
                    m.from === 'user'
                      ? 'rounded-br-sm bg-brand-600 text-white'
                      : 'rounded-bl-sm bg-surface-100 text-ink-800'
                  }`}
                >
                  {m.text}
                </div>
                {m.needsReview && (
                  <p className="mt-1 flex items-center gap-1 px-1 text-[11px] text-ink-400">
                    <ShieldIcon className="text-xs text-brand-500" />
                    A specialist verifies cost &amp; eligibility before you rely on it.
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Suggested questions */}
      {remaining.length > 0 && (
        <div className="mx-auto flex w-full max-w-2xl flex-wrap gap-2 px-4 pb-2 sm:px-6">
          {remaining.map((s) => (
            <button
              key={s.key}
              onClick={() => ask(s.key, s.q)}
              className="rounded-full border border-surface-200 px-3 py-1.5 text-[12px] font-semibold text-ink-700 transition hover:border-brand-300 hover:bg-brand-50/50"
            >
              {s.q}
            </button>
          ))}
        </div>
      )}

      {/* Input */}
      <form onSubmit={send} className="border-t border-surface-100 px-4 py-3 sm:px-6">
        <div className="mx-auto flex w-full max-w-2xl items-center gap-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask Ally about this program"
            className="min-w-0 flex-1 rounded-full border border-surface-200 px-4 py-2.5 text-[14px] outline-none focus:border-brand-400"
          />
          <button
            type="submit"
            aria-label="Send"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-600 text-lg text-white hover:bg-brand-700"
          >
            <SendIcon />
          </button>
        </div>
      </form>

      {/* Next step + disclaimer. For AllCampus-managed schools this opens the
          same CTA options as the program view. Direct-handoff schools link
          straight out instead (consistent with their program CTA, no gate). */}
      <div className="border-t border-surface-100 px-4 py-3 sm:px-6">
        <div className="mx-auto w-full max-w-2xl">
          {program.isDirectHandoff ? (
            <a
              href={program.applicationUrl}
              target="_blank"
              rel="noreferrer"
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-brand-600 px-5 py-3 text-[15px] font-bold text-white transition hover:bg-brand-700"
            >
              Continue on {program.school?.name?.split(' ')[0]} site
              <ExternalIcon className="text-lg" />
            </a>
          ) : (
            <button
              onClick={() => onRequestInfo?.(program)}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-brand-600 px-5 py-3 text-[15px] font-bold text-white transition hover:bg-brand-700"
            >
              Request information
              <ArrowRightIcon className="text-lg" />
            </button>
          )}
          <p className="mt-2.5 text-[11px] leading-relaxed text-ink-400">
            {program.isDirectHandoff
              ? `Ally is an AI assistant and can make mistakes. Continuing takes you to ${program.school?.name}'s own application.`
              : 'Ally is an AI assistant and can make mistakes. It stays on AllCampus and never shares your details with the school until you confirm in the contact step.'}
          </p>
        </div>
      </div>
    </div>
  )
}
