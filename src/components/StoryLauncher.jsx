import { USE_CASES } from '../data/useCases.js'
import { ArrowRightIcon } from './icons.jsx'
import { personaImage } from '../data/images.js'
import Img from './Img.jsx'

/*
 * Story launcher (#/stories): the review entry point. Four realistic
 * walkthroughs — pick a learner, the frame sets their employer and entry
 * door, and the StoryCoach guides the walk. Internal review surface, styled
 * with the marketing (mk-) tokens so it reads as part of the deliverable.
 */
export default function StoryLauncher({ onStart, onFreeExplore }) {
  return (
    <div className="min-h-screen bg-mk-band pb-20">
      <div className="mx-auto max-w-6xl px-5 pt-14 sm:px-8">
        <p className="text-[12px] font-bold uppercase tracking-[0.18em] text-mk-teal-text">
          AllCampus × 8th Light · internal review
        </p>
        <h1 className="mt-2 font-display text-4xl font-black leading-tight text-mk-slate sm:text-5xl">
          Four people, four doors,
          <br className="hidden sm:block" /> one experience.
        </h1>
        <p className="mt-4 max-w-2xl text-lg leading-relaxed text-mk-body">
          Each story walks a real learner situation through the recommended experience — realistic
          employer, realistic goal, realistic constraints. Pick one; a coach bar guides the steps
          and shows which moves pay off. Or explore freely.
        </p>

        <div className="mt-10 grid grid-cols-1 gap-5 md:grid-cols-2">
          {USE_CASES.map((u) => (
            <button
              key={u.id}
              onClick={() => onStart(u)}
              className="group flex flex-col rounded-2xl border border-mk-line bg-white p-6 text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
            >
              <div className="flex items-center gap-3">
                <Img
                  src={personaImage(u.id)}
                  alt={u.name}
                  hue={u.color}
                  rounded="rounded-full"
                  className="h-14 w-14 shrink-0"
                />
                <div className="min-w-0">
                  <div className="font-display text-xl font-black text-mk-slate">
                    {u.name} — {u.title}
                  </div>
                  <div className="truncate text-[13px] font-semibold text-mk-body">{u.who}</div>
                </div>
              </div>
              <p className="mt-4 flex-1 text-[15px] leading-relaxed text-mk-body">{u.blurb}</p>
              <div className="mt-4 flex items-center justify-between">
                <span className="text-[12px] font-bold uppercase tracking-wide text-mk-body/70">
                  {u.personas}
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
