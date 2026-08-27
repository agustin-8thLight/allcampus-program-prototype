import { useState } from 'react'
import AllyOverlay from '../AllyOverlay.jsx'

/*
 * HelpPair (2026-08-27) — "two ways to get help", from James's design notes.
 *
 * WHY THEY SIT SIDE BY SIDE. Ally's own disclaimer says it cannot confirm
 * eligibility or approve funding. Left alone, that raises a question it then
 * refuses to answer: then who can? The specialist card is the answer, so it
 * belongs in the same breath rather than somewhere further down the page.
 *
 * The split is a scope split, and the copy holds the line:
 *   Ally        -> self-serve. Finding programs, comparing options, career
 *                  paths, affordability.
 *   Specialist  -> anything touching eligibility, funding, or paperwork.
 *
 * PLACEMENT. Directly after the five steps, which is where someone is most
 * likely to have a question about the process they just read.
 *
 * OPEN (James, 2026-08-27): whether the specialist's book-a-call stays in this
 * form, and whether both cards should carry a face rather than an icon, to
 * match the learner-story treatment lower down. Icons for now.
 *
 * COPY IS JAMES'S, VERBATIM. His mockup also gives this pair NO section
 * heading and NO question chips on the Ally card: the two cards sit directly
 * under step 05 as part of the same moment. I had added an eyebrow, a heading,
 * and three chips; all three are gone.
 */

export default function HelpPair({ partner, onSpecialistRef }) {
  const [overlay, setOverlay] = useState(null)
  const open = (seed = null) => setOverlay({ seed })

  return (
    <section id="get-help" className="bg-white pb-20 pt-2">
      <div className="mx-auto max-w-6xl px-5">
        <div className="grid grid-cols-1 items-stretch gap-5 lg:grid-cols-2">
          {/* ALLY: self-serve scope */}
          <div className="flex flex-col rounded-[var(--radius-card)] border border-mk-line bg-white p-6 shadow-[0_2px_10px_rgba(51,71,91,0.05)]">
            <div className="flex items-center gap-3">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-mk-purple text-[17px] text-white">
                &#10022;
              </span>
              <span>
                <span className="block font-display text-[11.5px] font-bold uppercase tracking-[0.14em] text-mk-purple">
                  AI support
                </span>
                <span className="block font-display text-[18px] font-extrabold leading-snug text-mk-slate">
                  Ask Ally
                </span>
              </span>
            </div>
            <p className="mt-3.5 font-display text-[14px] leading-relaxed text-mk-body">
              Ally is an AI support tool that helps you find programs, compare options, explore
              career paths, and locate affordable programs &mdash; available any time, right in your
              account.
            </p>
            <div className="mt-auto pt-5">
              <button
                type="button"
                onClick={() => open()}
                className="inline-flex items-center gap-2 rounded-lg bg-mk-purple px-5 py-2.5 font-display text-[14px] font-bold text-white shadow-[0_8px_20px_rgba(123,97,196,0.28)] transition hover:opacity-90"
              >
                Open Ally
                <span aria-hidden>&#10022;</span>
              </button>
              <p className="mt-3 font-display text-[11.5px] leading-relaxed text-mk-body/70">
                Ally is AI and can make mistakes &mdash; please confirm benefit eligibility and
                tuition costs with a specialist or your employer.
              </p>
            </div>
          </div>

          {/* SPECIALIST: the human, scoped to eligibility and funding */}
          <div
            ref={onSpecialistRef}
            className="flex flex-col rounded-[var(--radius-card)] border border-mk-teal-600/30 bg-gradient-to-b from-white to-mk-band/50 p-6 shadow-[0_2px_10px_rgba(51,71,91,0.05)]"
          >
            <div className="flex items-center gap-3">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-mk-teal-600 text-white">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="h-5 w-5" aria-hidden>
                  <path d="M4 18v-1a5 5 0 0 1 5-5h2a5 5 0 0 1 5 5v1" />
                  <circle cx="10" cy="7" r="3.2" />
                  <path d="M17 9.5a2.6 2.6 0 1 0 0-5.2" />
                  <path d="M20 18v-.8a3.8 3.8 0 0 0-2.6-3.6" />
                </svg>
              </span>
              <span>
                <span className="block font-display text-[11.5px] font-bold uppercase tracking-[0.14em] text-mk-teal-text">
                  A person
                </span>
                <span className="block font-display text-[18px] font-extrabold leading-snug text-mk-slate">
                  Education Benefits Specialist
                </span>
              </span>
            </div>
            <p className="mt-3.5 font-display text-[14px] leading-relaxed text-mk-body">
              Get support from an AllCampus Education Benefits Specialist. If you have questions, or
              need guidance on education or tuition benefits, please book a call.
            </p>
            <div className="mt-auto pt-5">
              <button
                type="button"
                className="inline-flex items-center gap-2 rounded-lg bg-mk-teal-600 px-5 py-2.5 font-display text-[14px] font-bold text-white transition hover:bg-mk-teal-700"
              >
                Book a call
                <span aria-hidden>&rarr;</span>
              </button>
            </div>
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
