import { useState } from 'react'
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
    <section className="bg-mk-surface pb-16">
      <div className="mx-auto max-w-4xl px-5">
        {/* 2026-08-25: Ally sits at SECONDARY weight. It has been demoted three
            times now (front door, then search's companion, then a full-width
            band), and each time it kept enough real estate to still read as a
            headline feature. So this is small on purpose: half the page width,
            one row, a thumbnail rather than a photo panel, and no section
            heading of its own. It is an outlet, not a destination. */}
        <div className="flex flex-col gap-5 overflow-hidden rounded-xl border border-mk-line bg-white p-5 sm:flex-row sm:items-center">
          <Img
            src={ALLY_IMAGE}
            alt=""
            hue={268}
            rounded="rounded-lg"
            className="h-28 w-full shrink-0 sm:h-24 sm:w-32"
          />

          <div className="min-w-0 flex-1">
            <p className="font-display text-[16px] font-extrabold leading-snug text-mk-slate">
              Still deciding? Talk it through with Ally.
            </p>
            <p className="mt-1 font-display text-[13.5px] leading-relaxed text-mk-body">
              What to study, which credential fits, how it works around a full-time job.
            </p>
            <div className="mt-3 flex flex-wrap items-center gap-2">
              {PREVIEW_QUESTIONS.map((x) => (
                <button
                  key={x.id}
                  type="button"
                  onClick={() => open(x.id)}
                  className="rounded-full border border-mk-line bg-white px-3 py-1.5 font-display text-[12.5px] font-bold text-mk-slate transition hover:border-mk-purple hover:text-mk-purple"
                >
                  {x.q}
                </button>
              ))}
              <button
                type="button"
                onClick={() => open()}
                className="font-display text-[12.5px] font-bold text-mk-purple underline-offset-2 hover:underline"
              >
                Open Ally &#10022;
              </button>
            </div>
            <p className="mt-3 font-display text-[11px] leading-relaxed text-mk-body/70">
              Ally can make mistakes, and it can&rsquo;t confirm eligibility or approve funding.
            </p>
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
