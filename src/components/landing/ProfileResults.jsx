import { useMemo, useState } from 'react'
import { Eyebrow, Heading, Body } from './Section.jsx'
import ProgramCard from '../ProgramCard.jsx'
import { PROGRAMS, applyQuickFilter } from '../../data/model.js'
import { matchPrograms } from '../../data/pathfinder.js'
import { isFullyCoveredEstimate } from '../../data/benefit.js'

/*
 * ProfileResults (2026-08-21): the recommendations band that appears once the
 * pathfinder builds a profile. Outcome-based lenses, not search filters —
 * "what do I want out of this" (value, speed, cost), per the Aug 20 session.
 */
const LENSES = [
  { id: 'match', label: 'Best match' },
  { id: 'highestValue', label: 'Highest value' },
  { id: 'fastest', label: 'Quickest' },
  { id: 'mostAffordable', label: 'Lowest out-of-pocket' },
]

export default function ProfileResults({ profile, partner, onGate, onNavigate }) {
  const [lens, setLens] = useState('match')
  const matches = useMemo(() => matchPrograms(profile, PROGRAMS), [profile])
  // Joe's ask: fully-covered visibility, dynamic — only when the benefit can
  // actually zero programs out (same condition as browse).
  const reimburses = partner?.benefitKnown && (partner?.employerReimbursement ?? 0) > 0
  const lenses = [...LENSES, ...(reimburses ? [{ id: 'fullyCovered', label: 'Fully covered for you' }] : [])]
  const shown = useMemo(() => {
    if (lens === 'fullyCovered') {
      return applyQuickFilter(matches.filter((p) => isFullyCoveredEstimate(p, partner)), 'mostAffordable').slice(0, 6)
    }
    return (lens === 'match' ? matches : applyQuickFilter(matches, lens)).slice(0, 6)
  }, [matches, lens, partner])

  // The profile itself travels to browse as a prop (PrototypeFrame owns it),
  // so links stay clean: no params to fall out of sync with the answers.
  const openProgram = (prog) => onNavigate(`/browse?program=${prog.id}`)

  if (!matches.length) return null

  return (
    <section id="profile-results" className="mx-auto max-w-6xl px-5 pt-12">
      <Eyebrow>Matched to your profile</Eyebrow>
      <Heading size="sm" className="mt-1.5">
        Programs that fit what you told us
      </Heading>
      <Body className="mt-2 max-w-2xl">
        Every one works with your answers, discount included. Pick a lens for what matters most.
      </Body>

      <div className="mt-5 flex flex-wrap gap-2">
        {lenses.map((l) => (
          <button
            key={l.id}
            type="button"
            onClick={() => setLens(l.id)}
            className={`rounded-full border px-4 py-2 font-display text-[13px] font-bold transition ${
              lens === l.id
                ? 'border-mk-teal-600 bg-mk-teal-600 text-white'
                : 'border-mk-line bg-white text-mk-slate hover:border-mk-teal-600 hover:text-mk-teal-700'
            }`}
          >
            {l.label}
          </button>
        ))}
      </div>

      <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {shown.map((p) => (
          <ProgramCard
            key={p.id}
            program={p}
            partner={partner}
            joined
            benefitUnsure={profile?.benefit === 'unsure'}
            onExplore={openProgram}
            onSave={openProgram}
            onCompare={openProgram}
          />
        ))}
      </div>

      {matches.length > shown.length && (
        <div className="mt-6">
          <button
            type="button"
            onClick={() => onNavigate('/browse')}
            className="font-display text-[14px] font-bold text-mk-teal-700 underline-offset-2 hover:underline"
          >
            See all {matches.length} matching programs →
          </button>
        </div>
      )}
    </section>
  )
}
