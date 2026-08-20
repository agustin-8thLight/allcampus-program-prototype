import { useEffect, useRef, useState } from 'react'
import App from '../App.jsx'
import LandingPage from '../pages/LandingPage.jsx'
import SchoolPage from '../pages/SchoolPage.jsx'
import CategoryPage from '../pages/CategoryPage.jsx'
import SchoolsPage from '../pages/SchoolsPage.jsx'
import StoryLauncher from './StoryLauncher.jsx'
import StoryCoach from './StoryCoach.jsx'
import GateModal from './GateModal.jsx'
import DeviceFrame from './DeviceFrame.jsx'
import AllyOverlay from './AllyOverlay.jsx'
import IntentStep from './IntentStep.jsx'
import { CORPORATE_PARTNERS, PARTNER_BUCKETS } from '../data/corporatePartners.js'
import { getUseCase } from '../data/useCases.js'

/*
 * Prototype review frame. This is NOT part of the AllCampus product UI, it is
 * the harness reviewers use to switch concepts and read the design rationale.
 * It owns the scenario (partner bucket), the hash router, and
 * (2026-08-12) the story machinery: the use-case launcher, the story coach,
 * the account gate, and the joined/intent session state.
 *
 * Routes (hash-based so GitHub Pages needs no redirect rules):
 *   #/stories              use-case launcher (DEFAULT on first load)
 *   #/                     redesigned landing page (2026-08-11 direction)
 *   #/browse?...           the program search/browse surface (original App)
 *   #/school/<id>          school page scoped to one partner school
 *   #/category/<id>        category landing page (skill drill-down)
 *
 * Employer demo states (?employer= override): sheetz, texas-roadhouse,
 * boeing, lowes, global-default. REAL partner names by decision (2026-08-12,
 * internal-only; the deployed build sits behind AccessGate + noindex). In
 * production the employer comes from the learner record or partner URL.
 */
function initialEmployer() {
  const e = new URLSearchParams(window.location.search).get('employer')
  // Default scenario = Brigid's bucket 1 (benefit partner with TR), the
  // highest-converting group.
  return CORPORATE_PARTNERS[e] ? e : 'atassist'
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
  const [employerId, setEmployerId] = useState(initialEmployer)
  const [route, setRoute] = useState(parseHash)
  const [story, setStory] = useState(initialStory)
  // Session state for the gate + intent branching (move 2 + move 3).
  const [joined, setJoined] = useState(false)
  const [intent, setIntent] = useState(null)
  const [gate, setGate] = useState(null) // { trigger } | null
  // Gated always (Brigid, Aug 19: drop the gated-vs-open toggle). A running
  // story flips this internally so the walkthroughs keep working; no UI.
  const [catalogMode, setCatalogMode] = useState('gated')
  const [homeVariant, setHomeVariant] = useState('current') // 'current' | 'navigator'
  // Phone view (E3): auto-enabled for mobile-first stories like Tina's.
  const [phone, setPhone] = useState(false)
  const [intentOpen, setIntentOpen] = useState(false)
  const [frameAlly, setFrameAlly] = useState(false)
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
    // The stories were authored against anonymous browse; keep them working.
    setCatalogMode('open')
    setPhone(!!u.mobile)
    navigate(u.entry)
  }

  const exitStory = () => {
    setStory(null)
    setPhone(false)
    setCatalogMode('gated')
    navigate('/stories')
  }

  /*
   * Story driver: the coach's "Show me" button executes the current step so a
   * reviewer can be walked through the UI instead of hunting for each control.
   * Shapes are documented in data/useCases.js.
   */
  const driveStep = (drive) => {
    if (!drive) return
    if (drive.nav) {
      navigate(drive.nav)
      return
    }
    switch (drive.do) {
      case 'gate':
        if (!joined) setGate({ trigger: 'save' })
        break
      case 'join':
        join()
        break
      case 'intent':
        if (!joined) setJoined(true)
        setGate(null) // a story may reach intent with the gate still open
        applyIntent(drive.intent)
        break
      case 'ally':
        setFrameAlly(true)
        break
      case 'phone':
        setPhone(true)
        break
      default:
        break
    }
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
    // Joining from the catalog returns you to the results you just unlocked —
    // navigating away here discarded the search that motivated the signup.
    // Intent-driven routing applies only when joining from a non-browse surface.
    if (route.path === '/browse') return
    if (id === 'soon') navigate('/browse?filter=mostAffordable')
    else if (id === 'benefits') navigate('/')
    else navigate('/browse')
  }


  let page
  if (route.path === '/stories') {
    page = <StoryLauncher onStart={startStory} onFreeExplore={() => { setStory(null); navigate('/') }} />
  } else if (route.path.startsWith('/school/')) {
    const schoolId = route.path.split('/')[2]
    page = (
      <SchoolPage
        schoolId={schoolId}
        partner={partner}
        gated={catalogMode === 'gated' && !joined}
        onNavigate={navigate}
      />
    )
  } else if (route.path === '/schools') {
    page = <SchoolsPage partner={partner} onNavigate={navigate} />
  } else if (route.path.startsWith('/category/')) {
    // Aug 14 meeting: category tiles open a landing page with skill drill-down.
    page = (
      <CategoryPage
        key={route.raw}
        categoryId={route.path.split('/')[2]}
        partner={partner}
        onNavigate={navigate}
      />
    )
  } else if (route.path === '/browse') {
    // Keyed by the raw hash so a new search from the landing page re-seeds filters.
    page = (
      <App
        key={route.raw}
        partner={partner}
        initialParams={route.params}
        joined={joined}
        intent={intent}
        onGate={requestGate}
        catalogMode={catalogMode}
      />
    )
  } else {
    page = (
      <LandingPage partner={partner} homeVariant={homeVariant} joined={joined} onNavigate={navigate} />
    )
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

        {/* Brigid's five partner buckets as a dropdown, not company names
            (2026-08-19 session). The scenario drives every partner-aware
            surface; a running story overrides with its own employer record. */}
        <label className="flex items-center gap-2 text-[12px] font-bold text-white/60">
          <span className="hidden uppercase tracking-wide sm:block">Scenario</span>
          <select
            value={PARTNER_BUCKETS.find((b) => b.partnerId === employerId)?.id || ''}
            onChange={(e) => {
              const bucket = PARTNER_BUCKETS.find((b) => b.id === e.target.value)
              if (bucket) setEmployerId(bucket.partnerId)
            }}
            className="max-w-[240px] rounded-lg border border-white/25 bg-ink-900 px-2 py-1.5 text-[13px] font-bold text-white outline-none"
          >
            {!PARTNER_BUCKETS.some((b) => b.partnerId === employerId) && (
              <option value="">Story scenario</option>
            )}
            {PARTNER_BUCKETS.map((b) => (
              <option key={b.id} value={b.id} title={b.tagline}>
                {b.label}
              </option>
            ))}
          </select>
        </label>

        {/* The two homepage versions for Brigid's review (keep-current vs the
            diverged skills-navigator hero). */}
        <div className="hidden items-center gap-1 rounded-full bg-white/10 p-0.5 lg:flex">
          <span className="pl-2 pr-1 text-[11px] font-bold uppercase tracking-wide text-white/45">
            Homepage
          </span>
          {[
            { id: 'current', label: 'Current' },
            { id: 'navigator', label: 'Navigator' },
          ].map((v) => (
            <button
              key={v.id}
              onClick={() => setHomeVariant(v.id)}
              className={`rounded-full px-2.5 py-1 text-[12px] font-bold transition ${
                homeVariant === v.id ? 'bg-white text-ink-900' : 'text-white/70 hover:text-white'
              }`}
            >
              {v.label}
            </button>
          ))}
        </div>

        <span className="hidden flex-1 truncate text-[12px] text-white/55 xl:block">
          {story ? `Story: ${story.name} — ${story.title}` : ''}
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
        </div>
      </div>

      {/* The real product, offset below the bar (and above the coach) */}
      <div className={`pt-12 ${story && route.path !== '/stories' ? 'pb-20' : ''}`}>
        <DeviceFrame
          enabled={phone && route.path !== '/stories'}
          onToggle={() => setPhone(false)}
          params={{ employer: employerId }}
        >
          {page}
        </DeviceFrame>
      </div>

      {/* Story coach (review chrome) */}
      {story && route.path !== '/stories' && (
        <StoryCoach
          key={story.id}
          story={story}
          routePath={route.path}
          onExit={exitStory}
          onDrive={driveStep}
        />
      )}

      {/* The account gate + intent question (product surfaces) */}
      <GateModal
        open={!!gate && !joined}
        trigger={gate?.trigger}
        partner={partner}
        onJoin={join}
        onDismiss={() => setGate(null)}
      />
      <IntentStep open={intentOpen} suggestion={story?.intentSuggestion} onPick={applyIntent} />

      {/* Ally opened by the story driver (the page-level entry points own their
          own overlays; this one exists so "Show me" can open Ally anywhere). */}
      <AllyOverlay open={frameAlly} partner={partner} onClose={() => setFrameAlly(false)} />
    </>
  )
}