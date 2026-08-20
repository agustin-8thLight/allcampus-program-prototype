import { useEffect, useMemo, useState } from 'react'
import { PROGRAMS, QUICK_FILTERS, applyQuickFilter } from './data/model.js'
import { AREAS, getArea, getSkill, getGoal, getCategory, programMatchesGoal, programMatchesCategory } from './data/taxonomy.js'
import { isFullyCoveredEstimate, bestDiscountPercent } from './data/benefit.js'
import { getSchool } from './data/schools.js'
import ProgramCard from './components/ProgramCard.jsx'
import EmptyStateAlly from './components/EmptyStateAlly.jsx'
import ObfuscatedCard from './components/ObfuscatedCard.jsx'
import { emitStoryEvent } from './data/useCases.js'
import Drawer from './components/Drawer.jsx'
import ProgramDrawerView from './components/ProgramDrawerView.jsx'
import CtaFlow from './components/CtaFlow.jsx'
import AllyChat from './components/AllyChat.jsx'
import { useToast } from './components/Toast.jsx'
import {
  SearchIcon,
  ChevronDownIcon,
  CapIcon,
  BookIcon,
  BuildingIcon,
} from './components/icons.jsx'

// Order = usefulness for narrowing (06-17 review): area of study, degree, and
// university first; course modality last (least useful — nearly all online).
// Areas of Study is functional (taxonomy.js); the others remain UI stubs.
// Course Modality removed (Aug 14: all programs online, badge not filter).
const FILTER_DROPDOWNS = [
  { label: 'Degree Level', icon: CapIcon },
  { label: 'Universities', icon: BuildingIcon },
]

// `variant` is supplied by the prototype review frame (PrototypeFrame), which
// owns the concept switcher and the hash router. `partner` is the demo
// employer state; `initialParams` seeds filters when arriving from the
// landing/school pages (q, area, skill, school, degree, modality, covered).
export default function App({
  partner = null,
  initialParams = null,
  joined = false,
  intent = null,
  onGate = null,
  // Aug 14 decision: login before catalog access. 'gated' (default) shows an
  // unauthenticated visitor the match count and a discount hint, then the
  // account prompt — the notes' exact sequence ("prompts login before showing
  // catalog. Show program count and hint at discounts without revealing
  // school names or amounts"). 'open' preserves the anonymous browse the four
  // story walkthroughs were authored against.
  catalogMode = 'gated',
}) {
  const [query, setQuery] = useState(() => initialParams?.get('q') || '')
  const [activeFilter, setActiveFilter] = useState(
    () => initialParams?.get('filter') || 'mostAffordable',
  )
  const [areaId, setAreaId] = useState(() => {
    const fromSkill = initialParams?.get('skill') ? getSkill(initialParams.get('skill'))?.areaId : null
    return initialParams?.get('area') || fromSkill || null
  })
  const [skillId, setSkillId] = useState(() => initialParams?.get('skill') || null)
  // Goal handoff from the landing Goals block: the relatable outcome label
  // filters via its taxonomy mapping and appears as the applied chip.
  const [goalId, setGoalId] = useState(() => initialParams?.get('goal') || null)
  // Category scope from the category landing page's CTA (kept as plain scope
  // text in the count line, deliberately not a dismissible chip).
  const [categoryId] = useState(() => initialParams?.get('category') || null)
  const [schoolId] = useState(() => initialParams?.get('school') || null)
  const [degreeLevel, setDegreeLevel] = useState(() => initialParams?.get('degree') || null)
  const [coveredOnly, setCoveredOnly] = useState(() => initialParams?.get('covered') === '1')
  const [areaMenuOpen, setAreaMenuOpen] = useState(false)
  const [selected, setSelected] = useState(null)
  // The drawer hosts three swappable views, never stacked overlays.
  const [drawerView, setDrawerView] = useState('detail') // 'detail' | 'ally' | 'flow'
  const [flowReturnView, setFlowReturnView] = useState('detail') // where the flow's back goes
  const [flowStep, setFlowStep] = useState('choose')
  const [requested, setRequested] = useState(() => new Set()) // program ids the user has acted on
  const teasing = catalogMode === 'gated' && !joined
  const [saved, setSaved] = useState(() => new Set()) // saved program ids (post-join)
  const { showToast } = useToast()

  // Save/Compare are the value moments that justify the account gate (move 2).
  const onSave = (p) => {
    emitStoryEvent('save', { id: p.id })
    if (!joined) {
      onGate?.('save')
      return
    }
    setSaved((s) => {
      const n = new Set(s)
      if (n.has(p.id)) {
        n.delete(p.id)
        showToast({ tone: 'info', title: 'Removed from saved', body: `${p.name} is off your list.` })
      } else {
        n.add(p.id)
        showToast({
          tone: 'good',
          title: 'Saved',
          body: `${p.name} is on your list — your price is shown with the ${partner?.name || 'partner'} benefit applied.`,
        })
      }
      return n
    })
  }
  const onCompare = () => {
    emitStoryEvent('save')
    if (!joined) onGate?.('compare')
    else showToast({ tone: 'info', title: 'Added to compare', body: 'Comparison is stubbed in this prototype.' })
  }

  // Story signal: a non-empty query counts as "searched" (typed or seeded
  // from the landing/school pages).
  useEffect(() => {
    if (!query.trim()) return
    const t = setTimeout(() => emitStoryEvent('search', { query }), 700)
    return () => clearTimeout(t)
  }, [query])

  const markRequested = (p) => setRequested((s) => new Set(s).add(p.id))
  const applyToSchool = (p) => {
    markRequested(p)
    window.open(p.applicationUrl, '_blank', 'noopener')
    showToast({
      tone: 'info',
      title: `${p.school?.name || 'The school'}'s application opened`,
      body: "It opened in a new tab. You'll hear from their admissions team about next steps.",
    })
  }

  // "Get Program Details" opens the chooser; the advisor links open it at the
  // advisor step. (On click, the real build also creates the HubSpot deal.)
  const openFlow = (from, step = 'choose') => {
    emitStoryEvent('fork')
    setFlowReturnView(from)
    setFlowStep(step)
    setDrawerView('flow')
  }

  // Dev affordance: ?program=<id> deep-opens the drawer; &flow=<step> opens the
  // CTA flow view at a given step; &ally=1 opens Ally (useful for review).
  // Hash params (from school-page cards) can also deep-open a program.
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const id = params.get('program') || initialParams?.get('program')
    if (id && !teasing) {
      const p = PROGRAMS.find((x) => x.id === id)
      if (p) {
        setSelected(p)
        // Read deep-link params from BOTH the query string and the hash: the
        // story driver navigates via the hash (#/browse?program=…&flow=choose).
        const flow = params.get('flow') || initialParams?.get('flow')
        if (flow) {
          setFlowStep(flow)
          setFlowReturnView('detail')
          setDrawerView('flow')
        }
        if (params.get('ally') || initialParams?.get('ally')) setDrawerView('ally')
        if (params.get('requested') || initialParams?.get('requested')) setRequested(new Set([p.id]))
      }
    }
  }, [])

  const results = useMemo(() => {
    const q = query.trim().toLowerCase()
    // Free-text search matches more than the program title: subject area and
    // skill labels count too, so "business" or "nursing" return the field's
    // programs instead of a false empty state (loose-relevance finding).
    let matched = q
      ? PROGRAMS.filter((p) => {
          const haystack = [
            p.name,
            p.school?.name,
            p.degreeLevel,
            getArea(p.areaId)?.label,
            ...(p.skillIds || []).map((id) => getSkill(id)?.label),
          ]
            .filter(Boolean)
            .join(' ')
            .toLowerCase()
          return haystack.includes(q)
        })
      : PROGRAMS
    if (goalId) {
      const g = getGoal(goalId)
      if (g) matched = matched.filter((p) => programMatchesGoal(p, g))
    }
    if (categoryId) {
      const c = getCategory(categoryId)
      if (c) matched = matched.filter((p) => programMatchesCategory(p, c))
    }
    if (areaId) matched = matched.filter((p) => p.areaId === areaId)
    if (skillId) matched = matched.filter((p) => p.skillIds?.includes(skillId))
    if (schoolId) matched = matched.filter((p) => p.schoolId === schoolId)
    if (degreeLevel) matched = matched.filter((p) => p.degreeLevel === degreeLevel)
    if (coveredOnly && partner) matched = matched.filter((p) => isFullyCoveredEstimate(p, partner))
    return applyQuickFilter(matched, activeFilter)
  }, [query, activeFilter, areaId, skillId, goalId, categoryId, schoolId, degreeLevel, coveredOnly, partner])

  // Applied-filter chips (taxonomy + landing handoffs), each clearable.
  const appliedFilters = [
    goalId && { key: 'goal', label: `Goal: ${getGoal(goalId)?.label}`, clear: () => setGoalId(null) },
    skillId && { key: 'skill', label: getSkill(skillId)?.label, clear: () => { setSkillId(null); setAreaId(null) } },
    !skillId && areaId && { key: 'area', label: getArea(areaId)?.label, clear: () => setAreaId(null) },
    schoolId && { key: 'school', label: getSchool(schoolId)?.name, clear: null }, // school scope comes from the school page
    degreeLevel && { key: 'degree', label: degreeLevel, clear: () => setDegreeLevel(null) },
    coveredOnly && { key: 'covered', label: 'Fully covered (est.)', clear: () => setCoveredOnly(false) },
  ].filter(Boolean)

  return (
    <div className="min-h-screen bg-surface-50">
      {/* Global header */}
      <header className="border-b border-surface-200 bg-surface-0">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-3.5">
          <a href="#/" className="flex items-center gap-2 font-black text-brand-700">
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-brand-600 text-sm text-white">
              ac
            </span>
            allcampus
          </a>
          <div className="h-8 w-8 rounded-full bg-surface-200" aria-hidden />
        </div>
      </header>

      {/* Hero + search */}
      <div className="bg-gradient-to-b from-brand-50/60 to-surface-50">
        <div className="mx-auto max-w-6xl px-5 pb-6 pt-10 text-center">
          <h1 className="text-[36px] font-semibold leading-tight text-ink-900">
            Find the right program for your future
          </h1>
          <p className="mx-auto mt-2 max-w-2xl text-base font-light text-ink-500">
            Search thousands of programs from top universities and find the perfect fit
          </p>

          {/* Search input, no inline button (button lives in the filter row) */}
          <div className="mx-auto mt-6 flex max-w-4xl items-center gap-2 rounded-full border border-surface-200 bg-surface-0 px-5 py-3 shadow-sm focus-within:border-brand-400">
            <SearchIcon className="text-xl text-ink-400" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="E.g. Management Policy"
              className="min-w-0 flex-1 bg-transparent text-[15px] outline-none placeholder:text-ink-400"
            />
          </div>

          {/* Filters row: filters left, Clear filters + Search right (compare removed) */}
          <div className="mx-auto mt-3 flex max-w-4xl flex-wrap items-center gap-2">
            {/* Areas of Study: functional, driven by taxonomy.js */}
            <div className="relative">
              <button
                onClick={() => setAreaMenuOpen((o) => !o)}
                className={`inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-[13px] font-semibold hover:border-brand-300 ${
                  areaId
                    ? 'border-brand-400 bg-brand-50 text-brand-700'
                    : 'border-surface-200 bg-surface-0 text-ink-700'
                }`}
              >
                <BookIcon className="text-base text-ink-400" />
                {areaId ? getArea(areaId)?.label : 'Areas of Study'}
                <ChevronDownIcon className="text-base text-ink-400" />
              </button>
              {areaMenuOpen && (
                <div className="absolute left-0 top-full z-30 mt-1 w-60 rounded-lg border border-surface-200 bg-surface-0 py-1 text-left shadow-lg">
                  <button
                    onClick={() => { setAreaId(null); setSkillId(null); setAreaMenuOpen(false) }}
                    className="block w-full px-3 py-2 text-left text-[13px] font-semibold text-ink-700 hover:bg-surface-50"
                  >
                    All areas
                  </button>
                  {AREAS.map((a) => (
                    <button
                      key={a.id}
                      onClick={() => { setAreaId(a.id); setSkillId(null); setAreaMenuOpen(false) }}
                      className={`block w-full px-3 py-2 text-left text-[13px] hover:bg-surface-50 ${
                        areaId === a.id ? 'font-bold text-brand-700' : 'font-semibold text-ink-700'
                      }`}
                    >
                      {a.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
            {FILTER_DROPDOWNS.map((f) => {
              const Icon = f.icon
              return (
                <button
                  key={f.label}
                  className="inline-flex items-center gap-2 rounded-lg border border-surface-200 bg-surface-0 px-3 py-2 text-[13px] font-semibold text-ink-700 hover:border-brand-300"
                >
                  <Icon className="text-base text-ink-400" />
                  {f.label}
                  <ChevronDownIcon className="text-base text-ink-400" />
                </button>
              )
            })}
            <div className="ml-auto flex items-center gap-3">
              <button
                onClick={() => {
                  setQuery('')
                  setAreaId(null)
                  setSkillId(null)
                  setDegreeLevel(null)
                  setCoveredOnly(false)
                }}
                className="text-[13px] font-semibold text-ink-500 hover:text-ink-900"
              >
                Clear filters
              </button>
              <button className="rounded-lg bg-brand-600 px-6 py-2 text-[14px] font-bold text-white transition hover:bg-brand-700">
                Search
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Results */}
      <main className="mx-auto max-w-6xl px-5 py-7">
        {/* Applied filters from the landing/school handoff + taxonomy */}
        {appliedFilters.length > 0 && (
          <div className="mb-3 flex flex-wrap items-center gap-2">
            <span className="text-[12px] font-bold uppercase tracking-wide text-ink-400">
              Filtered by
            </span>
            {appliedFilters.map((f) => (
              <span
                key={f.key}
                className="inline-flex items-center gap-1.5 rounded-full bg-brand-50 px-3 py-1 text-[13px] font-bold text-brand-700"
              >
                {f.label}
                {f.clear && (
                  <button
                    onClick={f.clear}
                    aria-label={`Clear ${f.label} filter`}
                    className="text-brand-400 hover:text-brand-700"
                  >
                    ✕
                  </button>
                )}
              </span>
            ))}
          </div>
        )}

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-lg">
              We found{' '}
              <span className="font-black text-brand-600">{results.length} programs</span> for you
              {(() => {
                const ctx = query.trim()
                  ? `“${query.trim()}”`
                  : goalId
                    ? getGoal(goalId)?.label
                    : skillId
                      ? getSkill(skillId)?.label
                      : categoryId
                        ? getCategory(categoryId)?.label
                        : areaId
                          ? getArea(areaId)?.label
                          : null
                return ctx ? <span className="font-semibold text-ink-500"> in {ctx}</span> : null
              })()}
            </p>
            {teasing && (
              <p className="mt-1 text-[14px] font-semibold text-ink-600">
                {new Set(results.map((r) => r.schoolId)).size} in-network schools
                {bestDiscountPercent(results) != null && (
                  <span className="font-bold text-good-700"> · up to {bestDiscountPercent(results)}% off</span>
                )}
              </p>
            )}
          </div>

          {/* Sort as a labeled dropdown — production's own "Sort by:" pattern;
              chips here read as filters. Hidden while gated: sorting a list
              the visitor can't see yet is noise. */}
          {teasing && (
            <a href="#/" className="text-[13.5px] font-bold text-brand-600 underline-offset-2 hover:underline">
              ← Keep exploring subjects
            </a>
          )}
          <label className={`flex items-center gap-2 text-[13px] font-semibold text-ink-500 ${teasing ? 'hidden' : ''}`}>
            Sort by:
            <select
              value={activeFilter}
              onChange={(e) => {
                emitStoryEvent('quick-filter', { id: e.target.value })
                setActiveFilter(e.target.value)
              }}
              className="rounded-lg border border-surface-200 bg-surface-0 px-2.5 py-1.5 text-[13px] font-bold text-ink-900 outline-none focus:border-brand-400"
            >
              {QUICK_FILTERS.map((f) => (
                <option key={f.id} value={f.id}>
                  {f.label}
                </option>
              ))}
            </select>
          </label>
        </div>

        {teasing ? (
          /*
           * The logged-out grid (2026-08-19 session, replacing the single
           * teaser panel): obfuscated program cards
           * (discount badge, level, subject; NO name, school, or price), a
           * create-account cell in the row, and any click opens the account
           * flow. Value is teased card by card, per the transcript.
           */
          <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {results.slice(0, 3).map((p) => (
              <ObfuscatedCard key={p.id} program={p} onGate={onGate} />
            ))}

            {/* The account ask, in the flow of the grid. */}
            <div className="flex flex-col justify-center rounded-[var(--radius-card)] bg-brand-700 p-6 text-white">
              <h2 className="text-[18px] font-black leading-tight">
                Create a free account to see all details
              </h2>
              <p className="mt-1.5 text-[13px] leading-relaxed text-white/85">
                School names, your discounted price
                {partner?.benefitKnown ? ' with your employer benefit applied' : ''}, and full
                program pages.
              </p>
              <button
                onClick={() => onGate?.('catalog')}
                className="mt-3 rounded-lg bg-white px-4 py-2 text-[13.5px] font-bold text-brand-700 transition hover:bg-brand-50"
              >
                Create a free account
              </button>
            </div>

            {results.slice(3, 8).map((p) => (
              <ObfuscatedCard key={p.id} program={p} onGate={onGate} />
            ))}

            {results.length > 8 && (
              <div className="flex items-center justify-center rounded-[var(--radius-card)] border border-dashed border-surface-200 p-6 text-center text-[14px] font-bold text-ink-500">
                and {results.length - 8} more with your free account
              </div>
            )}
          </div>
        ) : results.length === 0 ? (
          // Move 4: the honest empty state + the Ally handoff, never a dead end.
          <EmptyStateAlly
            query={query}
            partner={partner}
            hasFilters={appliedFilters.length > 0}
            onPickArea={(id) => {
              setQuery('')
              setSkillId(null)
              setAreaId(id)
            }}
            onCoveredOnly={() => {
              setQuery('')
              setCoveredOnly(true)
              setActiveFilter('mostAffordable')
            }}
          />
        ) : (
          <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {results.map((p) => (
              <ProgramCard
                key={p.id}
                program={p}
                partner={partner}
                joined={joined}
                saved={saved.has(p.id)}
                onSave={onSave}
                onCompare={onCompare}
                onExplore={(prog) => {
                  emitStoryEvent('drawer', { id: prog.id })
                  setSelected(prog)
                }}
              />
            ))}
          </div>
        )}
      </main>

      {/* One Side Drawer hosting swappable views: program detail, the
          Get-Program-Details flow, and (phase 2) Ally. No stacked modals. */}
      <Drawer
        open={!!selected}
        onClose={() => {
          setSelected(null)
          setDrawerView('detail')
        }}
        label={selected ? `${selected.name} details` : 'Program details'}
        viewKey={drawerView}
      >
        {selected && drawerView === 'ally' ? (
          <AllyChat
            program={selected}
            initialAsk={new URLSearchParams(window.location.search).get('allyq')}
            onBack={() => setDrawerView('detail')}
            onRequestInfo={() => openFlow('ally')}
          />
        ) : selected && drawerView === 'flow' ? (
          <CtaFlow
            program={selected}
            initialStep={flowStep}
            backLabel={flowReturnView === 'ally' ? 'Ally' : 'Program'}
            allyEnabled={flowReturnView !== 'ally'}
            onOpenAlly={() => setDrawerView('ally')}
            onRequested={markRequested}
            onClose={() => setDrawerView(flowReturnView)}
          />
        ) : selected ? (
          <ProgramDrawerView
            program={selected}
            variant="2B"
            partner={partner}
            joined={joined}
            requested={requested.has(selected.id)}
            onClose={() => {
              setSelected(null)
              setDrawerView('detail')
            }}
            onAdvisor={() => openFlow('detail', 'advisor')}
            onOpenAlly={() => setDrawerView('ally')}
            onApply={() => applyToSchool(selected)}
            onPrimaryCta={() => openFlow('detail')}
          />
        ) : null}
      </Drawer>

      <footer className="mt-6 bg-brand-900 py-8 text-center text-xs text-white/60">
        AllCampus program-experience prototype, throwaway spec. Not production.
      </footer>
    </div>
  )
}
