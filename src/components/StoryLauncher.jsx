import { USE_CASES } from '../data/useCases.js'
import { ArrowRightIcon } from './icons.jsx'
import { personaImage } from '../data/images.js'
import Img from './Img.jsx'

/*
 * Story launcher (#/stories): the review entry point. Four walkthroughs,
 * anchored on Brigid's partner-type SCENARIOS (2026-08-20 direction: the
 * scenario name is the prominent anchor; the persona is supporting cast).
 * Picking one sets the employer and entry door; the StoryCoach guides the
 * walk. Internal review surface, styled with the marketing (mk-) tokens.
 */
export default function StoryLauncher({ onStart, onFreeExplore }) {
  return (
    <div className="min-h-screen bg-mk-band pb-20">
      <div className="mx-auto max-w-6xl px-5 pt-14 sm:px-8">
        <p className="text-[12px] font-bold uppercase tracking-[0.18em] text-mk-teal-text">
          AllCampus × 8th Light · internal review
        </p>
        <h1 className="mt-2 font-display text-4xl font-black leading-tight text-mk-slate sm:text-5xl">
          Four partner scenarios,
          <br className="hidden sm:block" /> one experience.
        </h1>
        <p className="mt-4 max-w-2xl text-lg leading-relaxed text-mk-body">
          Each walkthrough is one of the partner types, seen through a realistic learner. Pick a
          scenario; a coach bar guides the steps and shows which moves pay off. Or explore freely.
        </p>

        <div className="mt-10 grid grid-cols-1 gap-5 md:grid-cols-2">
          {USE_CASES.map((u) => (
            <button
              key={u.id}
              onClick={() => onStart(u)}
              className="group flex flex-col rounded-2xl border border-mk-line bg-white p-6 text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
            >
              {/* Scenario first (Brigid's type title is the anchor); the
                  persona rides along as supporting context. */}
              <div className="text-[11.5px] font-bold uppercase tracking-[0.14em] text-mk-teal-text">
                Scenario
              </div>
              <div className="mt-1 font-display text-[22px] font-black leading-snug text-mk-slate">
                {u.archetype}
              </div>
              <div className="mt-3 flex items-center gap-2.5 border-t border-mk-line pt-3">
                <Img
                  src={personaImage(u.id)}
                  alt={u.name}
                  hue={u.color}
                  rounded="rounded-full"
                  className="h-10 w-10 shrink-0"
                />
                <div className="min-w-0">
                  <div className="truncate font-display text-[14.5px] font-bold text-mk-slate">
                    {u.name} · {u.title}
                  </div>
                  <div className="truncate text-[12.5px] font-semibold text-mk-body">{u.who}</div>
                </div>
              </div>
              <p className="mt-4 flex-1 text-[15px] leading-relaxed text-mk-body">{u.blurb}</p>
              <div className="mt-4 flex items-center justify-between">
                <span className="text-[12px] font-bold uppercase tracking-wide text-mk-body/70">
                  {u.personas}
                  {u.mobile && (
                    <span className="ml-2 rounded-full bg-mk-slate/10 px-2 py-0.5 text-[10.5px] text-mk-slate">
                      opens in phone view
                    </span>
                  )}
                </span>
                <span className="inline-flex items-center gap-1.5 text-sm font-bold text-mk-teal-text group-hover:text-mk-teal-700">
                  Start the walk
                  <ArrowRightIcon className="text-base transition-transform group-hover:translate-x-0.5" />
                </span>
              </div>
            </button>
          ))}
        </div>

        <div className="mt-8 flex flex-wrap items-center gap-4">
          <button
            onClick={onFreeExplore}
            className="rounded-lg border border-mk-teal-600 px-5 py-2.5 text-[15px] font-bold text-mk-teal-700 transition hover:bg-white"
          >
            Free explore, no coach
          </button>
          <p className="text-[13px] text-mk-body/80">
            Employer benefits shown are estimates from the research record — verify before anything
            client-facing ships.
          </p>
        </div>
      </div>
    </div>
  )
}
