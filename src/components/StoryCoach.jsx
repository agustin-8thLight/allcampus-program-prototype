import { useEffect, useRef, useState } from 'react'
import { personaImage } from '../data/images.js'
import Img from './Img.jsx'

/*
 * Story coach: slim bottom bar that narrates the active use case. Advances
 * when the app fires a matching story-event (see useCases.emitStoryEvent) or
 * when the route matches the step's route prefix. Reviewers can also advance
 * manually or exit to the launcher. Review chrome — not product UI.
 */
export default function StoryCoach({ story, routePath, onExit, onDrive }) {
  const [i, setI] = useState(0)
  const barRef = useRef(null)
  // Discoverability: the bar pulses once on first render so reviewers notice it.
  const [fresh, setFresh] = useState(true)
  const step = story.steps[Math.min(i, story.steps.length - 1)]
  const done = i >= story.steps.length - 1

  useEffect(() => {
    const t = setTimeout(() => setFresh(false), 2600)
    return () => clearTimeout(t)
  }, [])

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

  /*
   * Publish this bar's height as --coach-inset so anything anchored to the
   * bottom of the viewport can sit above it.
   *
   * A reviewer reported the Ally launcher missing and then found it hidden
   * behind this bar. Raising the launcher's z-index would have been the wrong
   * fix: this bar deliberately outranks product UI (see below), so the launcher
   * has to move, not stack. Measured rather than hardcoded, because the bar
   * wraps to two lines on narrow viewports.
   */
  useEffect(() => {
    const el = barRef.current
    if (!el) return
    const root = document.documentElement
    const publish = () => root.style.setProperty('--coach-inset', `${el.offsetHeight}px`)
    publish()
    const ro = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(publish) : null
    if (ro) ro.observe(el)
    window.addEventListener('resize', publish)
    return () => {
      if (ro) ro.disconnect()
      window.removeEventListener('resize', publish)
      root.style.removeProperty('--coach-inset')
    }
  }, [])

  return (
    <div
      ref={barRef}
      /* z-[80]: review chrome outranks every product overlay (GateModal z-65,
         IntentStep z-66, AllyOverlay z-75) — "Show me" must stay clickable
         while a product modal is open, or the story stalls on it. */
      className={`fixed inset-x-0 bottom-0 z-[80] border-t bg-ink-900/95 px-4 py-3 text-white backdrop-blur transition-shadow ${
        fresh ? 'border-brand-400 shadow-[0_-8px_32px_rgba(80,190,190,0.35)]' : 'border-white/10'
      }`}
    >
      <div className="mx-auto flex max-w-5xl items-center gap-4">
        <Img
          src={personaImage(story.id)}
          alt={story.name}
          hue={story.color}
          rounded="rounded-full"
          className="h-9 w-9 shrink-0"
        />
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2.5">
            <span className="text-[11px] font-bold uppercase tracking-wide text-white/50">
              {story.name}’s walk · step {Math.min(i + 1, story.steps.length)} of {story.steps.length}
            </span>
            {/* Progress dots: filled = done, ringed = current */}
            <span className="hidden items-center gap-1 sm:flex" aria-hidden>
              {story.steps.map((_, n) => (
                <span
                  key={n}
                  className={`h-1.5 rounded-full transition-all ${
                    n === i
                      ? 'w-4 bg-brand-400'
                      : n < i
                        ? 'w-1.5 bg-white/60'
                        : 'w-1.5 bg-white/20'
                  }`}
                />
              ))}
            </span>
          </div>
          <p className="truncate-2 text-[14px] leading-snug text-white/90 sm:text-[15px]">{step.hint}</p>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          {!done && (
            <button
              onClick={() => {
                // Next performs the step, then advances the narration — a
                // reviewer can drive themselves or be walked through.
                if (step.drive) onDrive?.(step.drive)
                setI((x) => Math.min(x + 1, story.steps.length - 1))
              }}
              title={step.drive ? 'Do this step for me' : 'Next hint'}
              className="rounded-lg bg-white px-3.5 py-1.5 text-[13px] font-bold text-ink-900 transition hover:bg-white/90"
            >
              {step.drive ? 'Show me →' : 'Next'}
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
