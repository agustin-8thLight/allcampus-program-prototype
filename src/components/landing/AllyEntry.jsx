import { useState } from 'react'
import { Eyebrow, Heading, Body } from './Section.jsx'
import AllyOverlay from '../AllyOverlay.jsx'

/*
 * Ally on the landing page (2026-08-11 meeting, reworked A3 2026-08-13):
 * positioned BELOW search as a complementary entry point — benefits,
 * out-of-pocket costs, getting started; not program search.
 *
 * The card is an INVITATION, not the conversation: any interaction — a
 * question chip, the input, the card itself — launches the full agent as a
 * right-side overlay (AllyOverlay). Same identity as the drawer agent.
 * Self-contained, so every surface that renders AllyEntry (landing, school
 * page) gets the overlay for free.
 */
const PREVIEW_QUESTIONS = [
  { id: 'benefit', q: 'How does my tuition benefit work?' },
  { id: 'oop', q: 'What will I pay out of pocket?' },
  { id: 'start', q: 'How do I get started?' },
]

export default function AllyEntry({ partner }) {
  const [overlay, setOverlay] = useState(null) // null | { seed: string|null }

  const open = (seed = null) => setOverlay({ seed })

  return (
    <section className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-10 px-5 py-16 lg:grid-cols-2">
      <div>
        <Eyebrow tone="purple">✦ AI-powered assistant</Eyebrow>
        <Heading className="mt-2">Questions about your benefits? Ask Ally.</Heading>
        <Body className="mt-3 max-w-md">
          Ally is your education benefits assistant: how your employer&rsquo;s benefit works, what
          you&rsquo;d pay out of pocket, and how to get started. When you&rsquo;re ready to look at
          programs, the search above is the fastest way in.
        </Body>
        <button
          type="button"
          onClick={() => open()}
          className="mt-5 rounded-lg bg-mk-purple px-5 py-2.5 font-display text-[15px] font-bold text-white transition hover:opacity-90"
        >
          Open Ally
        </button>
      </div>

      {/* Invitation card — every interaction launches the full agent overlay */}
      <button
        type="button"
        onClick={() => open()}
        className="rounded-xl border border-mk-line bg-white p-4 text-left shadow-[0_6px_24px_rgba(51,71,91,0.10)] transition hover:-translate-y-0.5 hover:border-mk-purple/50 hover:shadow-[0_10px_32px_rgba(123,97,196,0.18)]"
      >
        <div className="flex items-center gap-2 border-b border-mk-line pb-3 font-display">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-mk-purple text-sm text-white">
            ✦
          </span>
          <div>
            <div className="text-[14px] font-extrabold text-mk-slate">
              Ally <span className="ml-1 rounded border border-mk-line px-1 text-[10px] font-bold text-mk-body">AI</span>
            </div>
            <div className="text-[11.5px] text-mk-body">Education Benefits Assistant</div>
          </div>
          <span className="ml-auto flex items-center gap-1 text-[11.5px] text-mk-green-700">
            <span className="h-1.5 w-1.5 rounded-full bg-mk-green-600" /> Online
          </span>
        </div>

        <div className="space-y-2 py-3 font-display">
          <div className="max-w-[85%] rounded-lg bg-mk-band px-3 py-2 text-[13px] leading-relaxed text-mk-slate">
            Hi, I&rsquo;m Ally. I help with benefits, costs, and getting started — pick a question
            and we&rsquo;ll talk it through.
          </div>
        </div>

        <div className="flex flex-wrap gap-2 border-t border-mk-line pt-3">
          {PREVIEW_QUESTIONS.map((x) => (
            <span
              key={x.id}
              role="button"
              tabIndex={0}
              onClick={(e) => {
                e.stopPropagation()
                open(x.id)
              }}
              onKeyDown={(e) => e.key === 'Enter' && open(x.id)}
              className="rounded-full border border-mk-line bg-white px-3 py-1.5 font-display text-[12.5px] font-bold text-mk-slate transition hover:border-mk-purple hover:text-mk-purple"
            >
              {x.q}
            </span>
          ))}
        </div>
        <div className="mt-3 flex items-center gap-2 border-t border-mk-line pt-3">
          <span className="min-w-0 flex-1 rounded-xl border border-mk-line px-3 py-2 font-display text-[12.5px] text-mk-body/60">
            Ask Ally anything about your benefit…
          </span>
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-mk-purple text-white">→</span>
        </div>
        <p className="mt-2 font-display text-[11px] text-mk-body/70">
          Opens the full assistant. Scripted preview — Ally is an AI assistant and can make mistakes.
        </p>
      </button>

      <AllyOverlay
        open={!!overlay}
        partner={partner}
        seedQuestionId={overlay?.seed || null}
        onClose={() => setOverlay(null)}
      />
    </section>
  )
}
