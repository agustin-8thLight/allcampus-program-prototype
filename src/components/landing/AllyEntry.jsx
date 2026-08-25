import { useState } from 'react'
import { Eyebrow, Heading, Body } from './Section.jsx'
import AllyOverlay from '../AllyOverlay.jsx'

/*
 * Ally on the landing page. REPOSITIONED 2026-08-14.
 *
 * Two things changed at that meeting, and they compound:
 *
 * 1. Ally moves DOWN the page. It was the second section, directly under
 *    search. It is now below the benefit block and the stories, because it is a
 *    copilot rather than the anchor feature. On 2026-08-11 it had already been
 *    demoted once, from front door to search's companion; this is the second
 *    step of the same move.
 *
 * 2. Ally stops claiming to answer benefits questions. Its knowledge base is
 *    not strong enough yet, and the team was explicit about not over-promising
 *    until it is. The framing is career guidance: help me work out what to
 *    study, not tell me what my employer covers.
 *
 * Where the benefits capability went: into the page. The "how this works"
 * section and the benefit block now carry the employer/AllCampus/school
 * explanation as deterministic content. That matters because PROJECT-PLAN.md
 * flagged the risk that demoting Ally would bury the only surface answering the
 * Benefit Maximizer's cost question. A static, verified explanation is a better
 * home for that than a chatbot whose knowledge base is admittedly thin.
 *
 * The card is an INVITATION, not the conversation: any interaction launches the
 * full agent as a right-side overlay (AllyOverlay). Self-contained, so the
 * school page gets the overlay for free too.
 *
 * Layout note: this is now a single narrower band rather than the previous
 * half-page two-column block. A demoted feature that keeps its old visual
 * weight has not actually been demoted.
 */
const PREVIEW_QUESTIONS = [
  { id: 'narrow', q: 'I’m not sure what to study' },
  { id: 'fit', q: 'Will this fit around a full-time job?' },
  { id: 'outcomes', q: 'Where could a program like this lead?' },
]

export default function AllyEntry({ partner }) {
  const [overlay, setOverlay] = useState(null) // null | { seed: string|null }

  const open = (seed = null) => setOverlay({ seed })

  return (
    <section className="border-y border-mk-line bg-mk-band/50 py-14">
      <div className="mx-auto max-w-6xl px-5">
        {/* 2026-08-25 polish: the card used to float alone on white, so a
            demoted feature read as an orphan. It is now a banded two-column
            block: copy left, an illustrated panel right. */}
        <div className="grid grid-cols-1 items-stretch overflow-hidden rounded-2xl border border-mk-line bg-white shadow-[0_2px_12px_rgba(51,71,91,0.06)] lg:grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)]">
          <div className="p-6 sm:p-8">
            <Eyebrow tone="purple">&#10022; AI copilot</Eyebrow>
            <Heading size="sm" className="mt-2">
              Not sure where to start? Talk it through with Ally.
            </Heading>
            {/* 2026-08-25 copy pass: the dek used to list what to study /
                which credential / around a job — the exact three things the
                chips below already ask. The chips are the better version. */}
            <Body className="mt-2 max-w-md">Ask it anything. Start with one of these.</Body>

            {/* Question chips ARE the entry — no fake chat transcript above
                them. The previous version mocked up a conversation, which
                oversells how much Ally currently knows. */}
            <div className="mt-5 flex flex-wrap gap-2">
              {PREVIEW_QUESTIONS.map((x) => (
                <button
                  key={x.id}
                  type="button"
                  onClick={() => open(x.id)}
                  className="rounded-full border border-mk-line bg-white px-3.5 py-2 font-display text-[13px] font-bold text-mk-slate transition hover:border-mk-purple hover:text-mk-purple"
                >
                  {x.q}
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={() => open()}
              className="mt-5 inline-flex items-center gap-2 rounded-lg bg-mk-purple px-5 py-2.5 font-display text-[14px] font-bold text-white shadow-[0_8px_20px_rgba(123,97,196,0.28)] transition hover:opacity-90"
            >
              Open Ally
              <span aria-hidden>&#10022;</span>
            </button>

            {/* The honest part stays. The sentence naming who DOES approve
                funding went: the journey strip above says it twice. */}
            <p className="mt-4 font-display text-[11.5px] leading-relaxed text-mk-body/70">
              Ally can make mistakes, and it can&rsquo;t confirm eligibility or approve funding.
            </p>
          </div>

          {/* Illustrated panel: a conversation shape, drawn rather than faked
              with sample answers. */}
          <div className="relative hidden overflow-hidden bg-gradient-to-br from-mk-purple to-[#4a3a86] lg:block">
            <AllyArt />
          </div>
        </div>
      </div>

      <AllyOverlay
        open={!!overlay}
        partner={partner}
        seedQuestionId={overlay?.seed || null}
        onClose={() => setOverlay(null)}
      />
    </section>
  )
}

/* Line illustration: stacked speech shapes and a spark. Decorative only. */
function AllyArt() {
  return (
    <svg
      viewBox="0 0 320 300"
      aria-hidden
      className="absolute inset-0 h-full w-full"
      preserveAspectRatio="xMidYMid slice"
    >
      <g fill="none" stroke="#ffffff" strokeLinecap="round" strokeLinejoin="round">
        <g opacity="0.16" strokeWidth="1.2">
          <circle cx="160" cy="150" r="118" />
          <circle cx="160" cy="150" r="86" />
        </g>
        <g opacity="0.9" strokeWidth="2">
          <path d="M62 92h132a12 12 0 0 1 12 12v46a12 12 0 0 1-12 12h-84l-26 22v-22H62a12 12 0 0 1-12-12v-46a12 12 0 0 1 12-12z" />
          <path d="M78 116h84M78 134h56" opacity="0.6" />
        </g>
        <g opacity="0.75" strokeWidth="2">
          <path d="M152 176h96a10 10 0 0 1 10 10v34a10 10 0 0 1-10 10h-18l-20 18v-18h-58a10 10 0 0 1-10-10v-34a10 10 0 0 1 10-10z" />
          <path d="M170 196h60M170 212h38" opacity="0.6" />
        </g>
        <g opacity="0.95" strokeWidth="2.4">
          <path d="M246 54l6 18 18 6-18 6-6 18-6-18-18-6 18-6 6-18z" />
          <path d="M58 216l4 11 11 4-11 4-4 11-4-11-11-4 11-4 4-11z" opacity="0.7" />
        </g>
      </g>
    </svg>
  )
}
