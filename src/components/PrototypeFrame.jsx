import { useEffect, useRef, useState } from 'react'
import App from '../App.jsx'
import LandingPage from '../pages/LandingPage.jsx'
import SchoolPage from '../pages/SchoolPage.jsx'
import ConceptNotes from './ConceptNotes.jsx'
import CtaCompare from './CtaCompare.jsx'
import StoryLauncher from './StoryLauncher.jsx'
import StoryCoach from './StoryCoach.jsx'
import GateModal from './GateModal.jsx'
import DeviceFrame from './DeviceFrame.jsx'
import IntentStep from './IntentStep.jsx'
import { CORPORATE_PARTNERS, EMPLOYER_STATES } from '../data/corporatePartners.js'
import { getUseCase } from '../data/useCases.js'

/*
 * Prototype review frame. This is NOT part of the AllCampus product UI, it is
 * the harness reviewers use to switch concepts and read the design rationale.
 * It owns the active variant, the demo employer state, the hash router, and
 * (2026-08-12) the story machinery: the use-case launcher, the story coach,
 * the account gate, and the joined/intent session state.
 *
 * Routes (hash-based so GitHub Pages needs no redirect rules):
 *   #/stories              use-case launcher (DEFAULT on first load)
 *   #/                     redesigned landing page (2026-08-11 direction)
 *   #/browse?...           the program search/browse surface (original App)
 *   #/school/<id>          school page scoped to one partner school
 *
 * Employer demo states (?employer= override): sheetz, texas-roadhouse,
 * boeing, lowes, global-default. REAL partner names by decision (2026-08-12,
 * internal-only; the deployed build sits behind AccessGate + noindex). In
 * production the employer comes from the learner record or partner URL.
 */
const VARIANTS = [
  { code: '1A', name: 'Phase 1', tagline: 'Ships first: cost-first program detail and an advisor. No Ally.' },
  { code: '2B', name: 'Phase 2', tagline: 'Adds Ally, “who it’s for”, and school highlights. The fuller experience.' },
]

function initialVariant() {
  const v = new URLSearchParams(window.location.search).get('variant')
  return VARIANTS.some((x) => x.code === v) ? v : '2B'
}

function initialEmployer() {
  const e = new URLSearchParams(window.location.search).get('employer')
  return CORPORATE_PARTNERS[e] ? e : 'sheetz'
}

function initialStory() {
  return getUseCase(new URLSearchParams(window.location.search).get('story'))
}

function parseHash() {
  const raw = window.location.hash.replace(/^#/, '') || '/stories'
  const [path, qs] = raw.split('?')
  return { path: path || '/stories', params: new URLSearchParams(qs || ''), raw }
}

export default function PrototypeFrame() {
  const [variant, setVariant] = useState(initialVariant)
  const [employerId, setEmployerId] = useState(initialEmployer)
  const [route, setRoute] = useState(parseHash)
  const [story, setStory] = useState(initialStory)
  // Session state for the gate + intent branching (move 2 + move 3).
  const [joined, setJoined] = useState(false)
  const [intent, setIntent] = useState(null)
  const [gate, setGate] = useState(null) // { trigger } | null
  // Phone view (E3): auto-enabled for mobile-first stories like Tina's.
  const [phone, setPhone] = useState(false)
  const [intentOpen, setIntentOpen] = useState(false)
  const [notesOpen, setNotesOpen] = useState(
    () => new URLSearchParams(window.location.search).get('notes') === '1',
  )
  const [compareOpen, setCompareOpen] = useState(
    () => new URLSearchParams(window.location.search).get('compare') === '1',
  )
  const active = VARIANTS.find((v) => v.code === variant)
  const partner = CORPORATE_PARTNERS[employerId]
  // The DeviceFrame iframe loads this same app with ?chrome=0: render the
  // product alone — no review bar, no coach, no nested device frame.
  const bare = new URLSearchParams(window.location.search).get('chrome') === '0'

  useEffect(() => {
    const onHash = () => setRoute(parseHash())
    window.addEventListener('hashchange', onHash)
    return () => window.removeEventListener('hashchange', onHash)
  }, [])

  const navigate = (path) => {
    window.location.hash = `#${path}`
  }

  const startStory = (u) => {
    setStory(u)
    setEmployerId(u.employerId)
    setJoined(false)
    setIntent(null)
    setPhone(!!u.mobile)
    navigate(u.entry)
  }

  const exitStory = () => {
    setStory(null)
    setPhone(false)
    navigate('/stories')
  }

  // Gate → join → intent → branch (moves 2 and 3).
  const requestGate = (trigger = 'save') => {
    if (joined) return
    setGate({ trigger })
  }
  const join = () => {
    setJoined(true)
    setGate(null)
    setIntentOpen(true)
  }
  const applyIntent = (id) => {
    setIntent(id)
    setIntentOpen(false)
    if (id === 'soon') navigate('/browse?filter=mostAffordable')
    else if (id === 'benefits') navigate('/')
    else navigate('/browse')
  }

  // Concepts only differ inside the program drawer, so a switch is invisible on
  // the list. A brief toast confirms the change took. Keyed so re-selecting the
  // same concept still re-triggers it; skipped on initial load.
  const [toast, setToast] = useState(null)
  const firstRun = useRef(true)
  useEffect(() => {
    if (firstRun.current) {
      firstRun.current = false
      return
    }
    setToast({ ...active, k: Date.now() })
    const t = setTimeout(() => setToast(null), 1800)
    return () => clearTimeout(t)
  }, [variant])

  let page
  if (route.path === '/stories') {
    page = <StoryLauncher onStart={startStory} onFreeExplore={() => { setStory(null); navigate('/') }} />
  } else if (route.path.startsWith('/school/')) {
    const schoolId = route.path.split('/')[2]
    page = <SchoolPage schoolId={schoolId} partner={partner} onNavigate={navigate} />
  } else if (route.path === '/browse') {
    // Keyed by the raw hash so a new search from the landing page re-seeds filters.
    page = (
      <App
        key={route.raw}
        variant={variant}
        partner={partner}
        initialParams={route.params}
        joined={joined}
        intent={intent}
        onGate={requestGate}
      />
    )
  } else {
    page = <LandingPage partner={partner} onNavigate={navigate} />
  }

  if (bare) return page

  return (
    <>
      {/* Review bar (meta chrome, sits above the product) */}
      <div className="fixed inset-x-0 top-0 z-[60] flex h-12 items-center gap-3 bg-ink-900 px-3 text-white sm:px-4">
        <button
          onClick={exitStory}
          className="rounded-full bg-white/10 px-3 py-1 text-[13px] font-bold text-white/85 transition hover:bg-white/20"
          title="Use-case launcher"
        >
          Stories
        </button>

        <div className="flex items-center gap-1 rounded-full bg-white/10 p-0.5">
          {VARIANTS.map((v) => (
            <button
              key={v.code}
              onClick={() => setVariant(v.code)}
              title={v.tagline}
              className={`rounded-full px-3 py-1 text-[13px] font-bold transition ${
                variant === v.code ? 'bg-white text-ink-900' : 'text-white/70 hover:text-white'
              }`}
            >
              {v.name}
            </button>
          ))}
        </div>

        {/* Employer demo state (review-only; production reads the learner record) */}
        <div className="hidden items-center gap-1 rounded-full bg-white/10 p-0.5 md:flex">
          {EMPLOYER_STATES.map((e) => (
            <button
              key={e.id}
              onClick={() => setEmployerId(e.id)}
              title={e.tagline}
              className={`rounded-full px-2.5 py-1 text-[12px] font-bold transition ${
                employerId === e.id ? 'bg-white text-ink-900' : 'text-white/70 hover:text-white'
              }`}
            >
              {e.label}
            </button>
          ))}
        </div>

        <span className="hidden flex-1 truncate text-[12px] text-white/55 xl:block">
          {story ? `Story: ${story.name} — ${story.title}` : active?.tagline}
        </span>

        <div className="ml-auto flex items-center gap-2">
          {joined && (
            <span className="hidden rounded-full bg-good-700/30 px-2.5 py-1 text-[11px] font-bold text-white/85 lg:block">
              Joined{intent ? ` · ${intent}` : ''}
            </span>
          )}
          <button
            onClick={() => setPhone((v) => !v)}
            title="Preview at a 390px phone viewport"
            className={`hidden rounded-lg border px-3 py-1.5 text-[13px] font-bold transition md:block ${
              phone ? 'border-brand-400 bg-brand-400/20 text-white' : 'border-white/25 text-white hover:bg-white/10'
            }`}
          >
            Phone view
          </button>
          <button
            onClick={() => setCompareOpen(true)}
            className="hidden rounded-lg border border-white/25 px-3 py-1.5 text-[13px] font-bold text-white transition hover:bg-white/10 lg:block"
          >
            Compare next step
          </button>
          <button
            onClick={() => setNotesOpen(true)}
            className="rounded-lg border border-white/25 px-3 py-1.5 text-[13px] font-bold text-white transition hover:bg-white/10"
          >
            Phase notes
          </button>
        </div>
      </div>

      {/* The real product, offset below the bar (and above the coach) */}
      <div className={`pt-12 ${story && route.path !== '/stories' ? 'pb-20' : ''}`}>
        <DeviceFrame
          enabled={phone && route.path !== '/stories'}
          onToggle={() => setPhone(false)}
          params={{ employer: employerId, variant }}
        >
          {page}
        </DeviceFrame>
      </div>

      {/* Story coach (review chrome) */}
      {story && route.path !== '/stories' && (
        <StoryCoach key={story.id} story={story} routePath={route.path} onExit={exitStory} />
      )}

      {/* The account gate + intent question (product surfaces, moves 2–3) */}
      <GateModal
        open={!!gate}
        trigger={gate?.trigger}
        partner={partner}
        onJoin={join}
        onDismiss={() => setGate(null)}
      />
      <IntentStep open={intentOpen} suggestion={story?.intentSuggestion} onPick={applyIntent} />

      {notesOpen && (
        <ConceptNotes
          activeCode={variant}
          onSelect={setVariant}
          onClose={() => setNotesOpen(false)}
        />
      )}

      {compareOpen && <CtaCompare onClose={() => setCompareOpen(false)} />}

      {/* Concept-switch confirmation toast (auto-clears). */}
      {toast && (
        <div
          key={toast.k}
          role="status"
          className="toast pointer-events-none fixed left-3 top-14 z-[80] sm:left-4"
        >
          <div className="flex items-center gap-2 rounded-full bg-ink-900 px-4 py-2 text-[13px] font-bold text-white shadow-lg">
            <span className="h-2 w-2 rounded-full bg-brand-400" />
            Showing: {toast.name}
            <span className="font-normal text-white/60">, open a program to see it</span>
          </div>
        </div>
      )}
    </>
  )
}
