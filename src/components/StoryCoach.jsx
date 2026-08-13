import { useEffect, useState } from 'react'
import { personaImage } from '../data/images.js'
import Img from './Img.jsx'

/*
 * Story coach: slim bottom bar that narrates the active use case. Advances
 * when the app fires a matching story-event (see useCases.emitStoryEvent) or
 * when the route matches the step's route prefix. Reviewers can also advance
 * manually or exit to the launcher. Review chrome — not product UI.
 */
export default function StoryCoach({ story, routePath, onExit }) {
  const [i, setI] = useState(0)
  const step = story.steps[Math.min(i, story.steps.length - 1)]
  const done = i >= story.steps.length - 1

  // Route-based advancement
  useEffect(() => {
    if (step?.advanceOn?.route && routePath.startsWith(step.advanceOn.route)) {
      // Route steps advance once satisfied; slight delay so the hint is readable.
      const t = setTimeout(() => setI((x) => Math.min(x + 1, story.steps.length - 1)), 1600)
      return () => clearTimeout(t)
    }
  }, [routePath, step, story.steps.length])

  // Event-based advancement
  useEffect(() => {
    const onEvent = (e) => {
      const type = e.detail?.type
      setI((x) => {
        const s = story.steps[Math.min(x, story.steps.length - 1)]
        return s?.advanceOn?.event === type ? Math.min(x + 1, story.steps.length - 1) : x
      })
    }
    window.addEventListener('story-event', onEvent)
    return () => window.removeEventListener('story-event', onEvent)
  }, [story])

  return (
    <div className="fixed inset-x-0 bottom-0 z-[70] border-t border-white/10 bg-ink-900/95 px-4 py-3 text-white backdrop-blur">
      <div className="mx-auto flex max-w-5xl items-center gap-4">
        <Img
          src={personaImage(story.id)}
          alt={story.name}
          hue={story.color}
          rounded="rounded-full"
          className="h-9 w-9 shrink-0"
        />
        <div className="min-w-0 flex-1">
          <div className="text-[11px] font-bold uppercase tracking-wide text-white/50">
            {story.name}’s walk · step {Math.min(i + 1, story.steps.length)} of {story.steps.length}
          </div>
          <p className="truncate-2 text-[14px] leading-snug text-white/90 sm:text-[15px]">{step.hint}</p>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          {!done && (
            <button
              onClick={() => setI((x) => Math.min(x + 1, story.steps.length - 1))}
              className="rounded-lg border border-white/25 px-3 py-1.5 text-[13px] font-bold transition hover:bg-white/10"
            >
              Next
            </button>
          )}
          <button
            onClick={onExit}
            className="rounded-lg px-3 py-1.5 text-[13px] font-bold text-white/60 transition hover:bg-white/10 hover:text-white"
          >
            {done ? 'Back to stories' : 'Exit'}
          </button>
        </div>
      </div>
    </div>
  )
}
