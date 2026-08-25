import { useState } from 'react'
import { Eyebrow, Heading, Body } from './Section.jsx'
import AllyOverlay from '../AllyOverlay.jsx'
import Img from '../Img.jsx'
import { ALLY_IMAGE } from '../../data/images.js'

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
    <section className="bg-white pb-16 pt-4">
      <div className="mx-auto max-w-6xl px-5">
        {/* 2026-08-25: a two-column card, copy left and a photograph right.
            Earlier passes gave this its own tinted band and a drawn panel;
            both were removed — the band added a stripe the page didn't need,
            and a photo of someone thinking it through beats a diagram. */}
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

          <div className="relative hidden lg:block">
            <Img
              src={ALLY_IMAGE}
              alt=""
              hue={268}
              rounded=""
              className="h-full w-full"
            />
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
