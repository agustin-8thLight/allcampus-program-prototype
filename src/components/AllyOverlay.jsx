import { useEffect, useMemo, useRef, useState } from 'react'
import { PROGRAMS, money } from '../data/model.js'
import { estimatedOutOfPocket, fullyCoveredPrograms } from '../data/benefit.js'
import { emitStoryEvent } from '../data/useCases.js'
import { SparkleIcon, SendIcon, CloseIcon, ShieldIcon } from './icons.jsx'

/*
 * AllyOverlay (punch list A3): the FULL agent, launched as a right-side sheet
 * from any Ally entry point — landing block, school benefit banner, browse
 * empty state. General-purpose (not program-scoped like the drawer's
 * AllyChat): benefits, out-of-pocket estimates, getting started.
 *
 * One identity everywhere: same name, avatar, manner as the drawer agent.
 * Answers are scripted and partner-aware; cost figures come from the same
 * benefit.js estimate engine the cards use — Ally never improvises a number.
 * A real build wires the model behind this exact surface.
 */

function buildScript(partner) {
  const known = partner?.benefitKnown && partner.employerReimbursement > 0
  const covered = fullyCoveredPrograms(PROGRAMS, partner)
  const oops = PROGRAMS.map((p) => estimatedOutOfPocket(p, partner)).filter((v) => v != null)
  const minOop = oops.length ? Math.min(...oops) : null
  const maxOop = oops.length ? Math.max(...oops) : null

  return [
    {
      id: 'benefit',
      q: 'How does my tuition benefit work?',
      a: known
        ? `${partner.name} offers up to ${money(partner.employerReimbursement)} per year in tuition support${partner.reimbursementProvider ? `, administered through ${partner.reimbursementProvider}` : ''}. Because ${partner.name} partners with AllCampus, that benefit stacks on top of partner-discounted tuition — you pay the discounted rate, your employer covers up to the cap, and what's left is your out-of-pocket. Always confirm the current policy with your benefits administrator.`
        : partner?.policy
          ? `${partner.policy} That means the partner discount is your lever here — every program in this catalog is already discounted for ${partner?.name} employees.`
          : 'If your employer offers a tuition benefit, it usually covers part of each year’s tuition. Tell me who you work for and I can check whether they partner with AllCampus.',
      followups: ['oop', 'covered'],
    },
    {
      id: 'oop',
      q: 'What will I pay out of pocket?',
      a: known
        ? `With the ${partner.name} benefit applied, first-year estimates across this catalog run from ${money(minOop ?? 0)} to ${money(maxOop ?? 0)}${covered.length ? `, and ${covered.length} program${covered.length > 1 ? 's are' : ' is'} fully covered` : ''}. Every price card shows the exact estimate for that program — same math, program by program.`
        : `Without an employer contribution, your out-of-pocket is the discounted tuition itself — certificates here start around ${money(minOop ?? 3600)}. Sorting by “Most affordable” puts the cheapest real options first.`,
      followups: known ? ['covered', 'start'] : ['start'],
      cta: known && covered.length ? { label: `See ${covered.length} fully covered program${covered.length > 1 ? 's' : ''}`, to: '/browse?covered=1' } : { label: 'Browse most affordable first', to: '/browse?filter=mostAffordable' },
    },
    {
      id: 'covered',
      q: 'Which programs are fully covered?',
      a: known
        ? covered.length
          ? `Right now, ${covered.length}: ${covered.slice(0, 3).map((p) => p.name).join('; ')}${covered.length > 3 ? '…' : ''}. “Fully covered” means the yearly cost fits inside your ${money(partner.employerReimbursement)} benefit — verified per program on its price card.`
          : `None fully covered at the moment — but several come close. Sort by “Most affordable” and look for the lowest out-of-pocket lines.`
        : `That takes a known employer benefit. ${partner?.name || 'Your employer'} doesn’t have tuition reimbursement on file, so the partner discount is doing the work here.`,
      followups: ['start'],
      cta: known && covered.length ? { label: 'Show them in search', to: '/browse?covered=1' } : null,
    },
    {
      id: 'start',
      q: 'How do I get started?',
      a: 'Search first — pick anything that looks close and open it; every program page shows real costs and next steps. When one feels right, request details (nothing goes to the school until you say so), or book a free call with an Education Benefits Specialist who can confirm your benefit before you commit to anything.',
      followups: ['benefit'],
      cta: { label: 'Start searching', to: '/browse' },
    },
  ]
}

export default function AllyOverlay({ open, partner, seedQuestionId = null, onClose }) {
  const script = useMemo(() => buildScript(partner), [partner])
  const [messages, setMessages] = useState([])
  const [typing, setTyping] = useState(false)
  const [input, setInput] = useState('')
  const scrollRef = useRef(null)
  const seeded = useRef(false)

  const ask = (id) => {
    const item = script.find((s) => s.id === id)
    if (!item) return
    setMessages((m) => [...m, { role: 'user', text: item.q }])
    setTyping(true)
    setTimeout(() => {
      setTyping(false)
      setMessages((m) => [...m, { role: 'ally', text: item.a, followups: item.followups, cta: item.cta }])
    }, 750)
  }

  const askFree = (text) => {
    if (!text.trim()) return
    setMessages((m) => [...m, { role: 'user', text }])
    setInput('')
    setTyping(true)
    setTimeout(() => {
      setTyping(false)
      setMessages((m) => [
        ...m,
        {
          role: 'ally',
          text: 'In the real product I’d answer that directly — this preview runs on scripted answers. The questions below cover what I can do here:',
          followups: ['benefit', 'oop', 'start'],
        },
      ])
    }, 750)
  }

  // Reset + optional seed each time the overlay opens.
  useEffect(() => {
    if (!open) {
      seeded.current = false
      return
    }
    emitStoryEvent('ally-entry')
    setMessages([
      {
        role: 'ally',
        text: `Hi, I’m Ally. I help with benefits, costs, and getting started${partner?.benefitKnown && partner.employerReimbursement > 0 ? ` — and I already know the ${partner.name} benefit` : ''}. What can I check for you?`,
        followups: ['benefit', 'oop', 'start'],
      },
    ])
    if (seedQuestionId && !seeded.current) {
      seeded.current = true
      setTimeout(() => ask(seedQuestionId), 450)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open])

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' })
  }, [messages, typing])

  if (!open) return null

  const go = (to) => {
    onClose?.()
    window.location.hash = `#${to}`
  }

  return (
    <div className="fixed inset-0 z-[75] flex justify-end bg-mk-slate/40" onClick={onClose}>
      <div
        className="flex h-full w-full max-w-[540px] flex-col bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-label="Ally, education benefits assistant"
      >
        {/* Identity header — matches the drawer agent */}
        <div className="flex items-center gap-3 border-b border-mk-line px-5 py-4">
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-mk-purple text-white">
            <SparkleIcon className="text-lg" />
          </span>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <span className="font-display text-[17px] font-black text-mk-slate">Ally</span>
              <span className="rounded border border-mk-line px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-mk-body">AI</span>
              <span className="flex items-center gap-1 text-[12px] font-bold text-mk-green-700">
                <span className="h-1.5 w-1.5 rounded-full bg-mk-green-600" /> Online
              </span>
            </div>
            <div className="text-[12.5px] text-mk-body">Education Benefits Assistant · same Ally, everywhere</div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close Ally"
            className="flex h-9 w-9 items-center justify-center rounded-full text-mk-body transition hover:bg-mk-band hover:text-mk-slate"
          >
            <CloseIcon className="text-xl" />
          </button>
        </div>

        {/* Conversation */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto px-5 py-5">
          <div className="space-y-4">
            {messages.map((m, i) => (
              <div key={i}>
                {m.role === 'user' ? (
                  <div className="ml-auto max-w-[85%] rounded-2xl rounded-br-md bg-mk-teal-600 px-4 py-2.5 text-[14.5px] leading-relaxed text-white">
                    {m.text}
                  </div>
                ) : (
                  <div className="max-w-[92%] rounded-2xl rounded-bl-md bg-mk-band px-4 py-3 text-[14.5px] leading-relaxed text-mk-slate">
                    {m.text}
                    {m.cta && (
                      <button
                        onClick={() => go(m.cta.to)}
                        className="mt-3 block rounded-lg bg-mk-purple px-4 py-2 text-[13.5px] font-bold text-white transition hover:opacity-90"
                      >
                        {m.cta.label} →
                      </button>
                    )}
                    {m.followups && (
                      <div className="mt-3 flex flex-wrap gap-2">
                        {m.followups.map((f) => {
                          const item = script.find((s) => s.id === f)
                          return item ? (
                            <button
                              key={f}
                              onClick={() => ask(f)}
                              className="rounded-full border border-mk-purple/40 bg-white px-3 py-1.5 text-[12.5px] font-bold text-mk-purple transition hover:bg-mk-purple/10"
                            >
                              {item.q}
                            </button>
                          ) : null
                        })}
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
            {typing && (
              <div className="inline-flex items-center gap-1.5 rounded-2xl rounded-bl-md bg-mk-band px-4 py-3">
                <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-mk-body/50 [animation-delay:-0.2s]" />
                <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-mk-body/50 [animation-delay:-0.1s]" />
                <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-mk-body/50" />
              </div>
            )}
          </div>
        </div>

        {/* Composer + guardrail note */}
        <div className="border-t border-mk-line px-5 py-3">
          <form
            className="flex items-center gap-2"
            onSubmit={(e) => {
              e.preventDefault()
              askFree(input)
            }}
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about your benefit, costs, getting started…"
              className="min-w-0 flex-1 rounded-xl border border-mk-line px-4 py-2.5 text-[14px] outline-none placeholder:text-mk-body/60 focus:border-mk-purple"
            />
            <button
              type="submit"
              aria-label="Send"
              className="flex h-10 w-10 items-center justify-center rounded-xl bg-mk-purple text-white transition hover:opacity-90"
            >
              <SendIcon className="text-lg" />
            </button>
          </form>
          <p className="mt-2 flex items-center gap-1.5 text-[11.5px] text-mk-body/80">
            <ShieldIcon className="text-[13px]" />
            Scripted preview. Cost answers use the shared, verified estimate — nothing goes to a school without your say-so.
          </p>
        </div>
      </div>
    </div>
  )
}
