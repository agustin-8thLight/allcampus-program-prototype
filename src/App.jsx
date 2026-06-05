import { useEffect, useMemo, useState } from 'react'
import { PROGRAMS, QUICK_FILTERS, applyQuickFilter } from './data/model.js'
import ProgramCard from './components/ProgramCard.jsx'
import Drawer from './components/Drawer.jsx'
import ProgramDrawerView from './components/ProgramDrawerView.jsx'
import CtaFlow from './components/CtaFlow.jsx'
import AllyChat from './components/AllyChat.jsx'
import {
  SearchIcon,
  ChevronDownIcon,
  CapIcon,
  MonitorIcon,
  BookIcon,
  BuildingIcon,
} from './components/icons.jsx'

const FILTER_DROPDOWNS = [
  { label: 'Degree Level', icon: CapIcon },
  { label: 'Course Modality', icon: MonitorIcon },
  { label: 'Areas of Study', icon: BookIcon },
  { label: 'Universities', icon: BuildingIcon },
]

// `variant` is supplied by the prototype review frame (PrototypeFrame), which
// owns the concept switcher. App is the real product UI; it just reads it.
export default function App({ variant = '1A' }) {
  const [query, setQuery] = useState('')
  const [activeFilter, setActiveFilter] = useState('mostAffordable')
  const [selected, setSelected] = useState(null)
  // The drawer hosts three swappable views, never stacked overlays.
  const [drawerView, setDrawerView] = useState('detail') // 'detail' | 'ally' | 'flow'
  const [flowReturnView, setFlowReturnView] = useState('detail') // where the flow's back goes
  const [flowStep, setFlowStep] = useState('choose')
  const [requested, setRequested] = useState(() => new Set()) // program ids the user has acted on

  const markRequested = (p) => setRequested((s) => new Set(s).add(p.id))
  const applyToSchool = (p) => {
    markRequested(p)
    window.open(p.applicationUrl, '_blank', 'noopener')
  }

  // "Get Program Details" opens the chooser; the advisor links open it at the
  // advisor step. (On click, the real build also creates the HubSpot deal.)
  const openFlow = (from, step = 'choose') => {
    setFlowReturnView(from)
    setFlowStep(step)
    setDrawerView('flow')
  }

  // Dev affordance: ?program=<id> deep-opens the drawer; &flow=<step> opens the
  // CTA flow view at a given step; &ally=1 opens Ally (useful for review).
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const id = params.get('program')
    if (id) {
      const p = PROGRAMS.find((x) => x.id === id)
      if (p) {
        setSelected(p)
        const flow = params.get('flow')
        if (flow) {
          setFlowStep(flow)
          setFlowReturnView('detail')
          setDrawerView('flow')
        }
        if (params.get('ally')) setDrawerView('ally')
        if (params.get('requested')) setRequested(new Set([p.id]))
      }
    }
  }, [])

  const results = useMemo(() => {
    const q = query.trim().toLowerCase()
    const matched = q
      ? PROGRAMS.filter(
          (p) =>
            p.name.toLowerCase().includes(q) || p.school?.name.toLowerCase().includes(q),
        )
      : PROGRAMS
    return applyQuickFilter(matched, activeFilter)
  }, [query, activeFilter])

  return (
    <div className="min-h-screen bg-surface-50">
      {/* Global header */}
      <header className="border-b border-surface-200 bg-surface-0">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-3.5">
          <div className="flex items-center gap-2 font-black text-brand-700">
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-brand-600 text-sm text-white">
              ac
            </span>
            allcampus
          </div>
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
                onClick={() => setQuery('')}
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
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-lg">
            We found{' '}
            <span className="font-black text-brand-600">{results.length} programs</span> for you
          </p>

          {/* Quick-filter chips (§7) */}
          <div className="flex flex-wrap gap-2">
            {QUICK_FILTERS.map((f) => {
              const active = activeFilter === f.id
              return (
                <button
                  key={f.id}
                  onClick={() => setActiveFilter(f.id)}
                  className={`rounded-full px-3.5 py-1.5 text-[13px] font-bold transition ${
                    active
                      ? 'bg-brand-600 text-white'
                      : 'border border-surface-200 bg-surface-0 text-ink-700 hover:border-brand-300'
                  }`}
                >
                  {f.label}
                </button>
              )
            })}
          </div>
        </div>

        {results.length === 0 ? (
          <p className="mt-10 text-center text-ink-400">No programs match your search.</p>
        ) : (
          <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {results.map((p) => (
              <ProgramCard key={p.id} program={p} onExplore={setSelected} />
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
            onRequestInfo={() => openFlow('detail')}
          />
        ) : selected && drawerView === 'flow' ? (
          <CtaFlow
            program={selected}
            initialStep={flowStep}
            backLabel="Program"
            onRequested={markRequested}
            onClose={() => setDrawerView(flowReturnView)}
          />
        ) : selected ? (
          <ProgramDrawerView
            program={selected}
            variant={variant}
            requested={requested.has(selected.id)}
            onClose={() => {
              setSelected(null)
              setDrawerView('detail')
            }}
            onAdvisor={() => openFlow('detail', 'advisor')}
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
