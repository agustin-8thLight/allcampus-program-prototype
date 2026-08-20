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
    <section className="mx-auto max-w-4xl px-5 py-14">
      <div className="rounded-2xl border border-mk-line bg-white p-6 shadow-sm sm:p-8">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="min-w-0">
            <Eyebrow tone="purple">✦ AI copilot</Eyebrow>
            <Heading size="sm" className="mt-2">
              Not sure where to start? Talk it through with Ally.
            </Heading>
            <Body className="mt-2 max-w-xl">
              Ally helps you narrow things down: what to study, which credential fits, and how a
              program works around a full-time job. For the specifics of your employer&rsquo;s
              benefit, the section above lays it out, and a specialist can confirm your numbers.
            </Body>
          </div>
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-mk-purple text-lg text-white">
            ✦
          </span>
        </div>

        {/* Question chips ARE the entry — no fake chat transcript above them.
            The previous version mocked up a conversation, which oversells how
            much Ally currently knows. */}
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
          <button
            type="button"
            onClick={() => open()}
            className="rounded-full bg-mk-purple px-4 py-2 font-display text-[13px] font-bold text-white transition hover:opacity-90"
          >
            Open Ally
          </button>
        </div>

        <p className="mt-4 font-display text-[11.5px] text-mk-body/70">
          Ally is an AI assistant and can make mistakes. It doesn&rsquo;t confirm eligibility or
          approve funding. Your employer or benefits administrator does that.
        </p>
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
