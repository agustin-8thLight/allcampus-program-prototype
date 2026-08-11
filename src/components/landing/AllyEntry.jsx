import { useState } from 'react'
import { Eyebrow, Heading, Body } from './Section.jsx'
import { money } from '../../data/model.js'

/*
 * Ally on the landing page (2026-08-11 meeting): positioned BELOW search as a
 * complementary entry point. Explicitly NOT for finding programs — for
 * questions about benefits, out-of-pocket costs, and getting started.
 *
 * The chat panel here is a scripted preview (three canned, employer-aware
 * Q&As) that demonstrates the positioning; the real conversational Ally
 * stays inside the program drawer. Mirrors the live "Meet Ally" block
 * (purple accent, chat card right).
 */

function cannedAnswers(partner) {
  const known = partner?.benefitKnown
  return [
    {
      id: 'benefit',
      q: 'How does my tuition benefit work?',
      a: known
        ? `${partner.name} offers up to ${money(partner.employerReimbursement)}/year in tuition support. Through its partnership with AllCampus, that benefit applies to discounted partner programs automatically when you enroll here.`
        : 'If your employer offers a tuition benefit, it usually covers part of your yearly tuition. Tell me who you work for and I can check whether they partner with AllCampus.',
    },
    {
      id: 'oop',
      q: 'What will I pay out of pocket?',
      a: known
        ? 'It depends on the program. Discounted tuition minus your benefit is your estimated out-of-pocket — some certificates are fully covered. Every program page shows its estimate.'
        : 'Once I know your employer and program, I can estimate it: discounted tuition minus any benefit you have. Without a benefit, you still get AllCampus partner pricing.',
    },
    {
      id: 'start',
      q: 'How do I get started?',
      a: 'Pick a program that fits, then request details — nothing goes to the school until you say so. An Education Benefits Specialist can also walk you through it, free.',
    },
  ]
}

export default function AllyEntry({ partner }) {
  const answers = cannedAnswers(partner)
  const [activeId, setActiveId] = useState(null)
  const active = answers.find((x) => x.id === activeId)

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
      </div>

      {/* Chat preview card */}
      <div className="rounded-xl border border-mk-line bg-white p-4 shadow-[0_6px_24px_rgba(51,71,91,0.10)]">
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
            below.
          </div>
          {active && (
            <>
              <div className="ml-auto max-w-[85%] rounded-lg bg-mk-teal-600 px-3 py-2 text-[13px] text-white">
                {active.q}
              </div>
              <div className="max-w-[90%] rounded-lg bg-mk-band px-3 py-2 text-[13px] leading-relaxed text-mk-slate">
                {active.a}
              </div>
            </>
          )}
        </div>

        <div className="flex flex-wrap gap-2 border-t border-mk-line pt-3">
          {answers.map((x) => (
            <button
              key={x.id}
              type="button"
              onClick={() => setActiveId(x.id)}
              className={`rounded-full border px-3 py-1.5 font-display text-[12.5px] font-bold transition ${
                activeId === x.id
                  ? 'border-mk-purple bg-mk-purple text-white'
                  : 'border-mk-line bg-white text-mk-slate hover:border-mk-purple'
              }`}
            >
              {x.q}
            </button>
          ))}
        </div>
        <p className="mt-2 font-display text-[11px] text-mk-body/70">
          Preview with scripted answers. Ally is an AI assistant and can make mistakes.
        </p>
      </div>
    </section>
  )
}
