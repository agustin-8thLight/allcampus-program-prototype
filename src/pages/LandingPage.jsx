import { useState } from 'react'
import MkHeader from '../components/landing/MkHeader.jsx'
import PathfinderHero from '../components/landing/PathfinderHero.jsx'
import ProfileResults from '../components/landing/ProfileResults.jsx'
import Pathfinder from '../components/Pathfinder.jsx'
import AllyEntry from '../components/landing/AllyEntry.jsx'
import AllyOverlay from '../components/AllyOverlay.jsx'
import { HowItWorks, WhyAllCampus } from '../components/landing/BenefitsAndHow.jsx'
import StoryCards from '../components/landing/StoryCards.jsx'
import LogoStrip from '../components/landing/LogoStrip.jsx'
import LandingFaq from '../components/landing/LandingFaq.jsx'
import { Heading } from '../components/landing/Section.jsx'

/*
 * Landing page (2026-08-21 reset, Brigid's Aug 20 session + follow-up):
 * each partner has its own landing page, so identity comes from arrival and
 * nothing is gated. ~80% of enrollees need hand-holding, so the page leads
 * with ONE action: the pathfinder, which builds an education profile and
 * personalizes this page in place.
 *
 *  1. Hero: value statement + "Let's get started" (pathfinder) + a quiet
 *     self-serve outlet. With a profile: the profile card floats here.
 *  2. Profile results (only with a profile): matched programs, outcome lenses
 *  3. How it works (white)
 *  4. Ally (secondary weight, directly under the path)
 *  5. Why AllCampus (grey opens here): the value card + who-does-what
 *  6. Learner stories (grey)
 *  7. Partner school logos + See all schools (grey)
 *  8. FAQ (grey), then the dark CTA bookend -> the three questions, footer
 *
 * Retired from this page (v2 candidates, components parked): the search-card
 * hero, the skills-navigator variant, the outcome-cards + browse-by-subject
 * band ("supported decision-making beats the browse-by-subject block").
 */
export default function LandingPage({ partner, profile, onProfile, joined = false, onGate, onNavigate }) {
  const [pathfinder, setPathfinder] = useState(null) // null | { step }
  const [allyOpen, setAllyOpen] = useState(null) // null | { school?: string }

  const goBrowse = (params = {}) => {
    const qs = new URLSearchParams(
      Object.fromEntries(Object.entries(params).filter(([, v]) => v != null && v !== '')),
    ).toString()
    onNavigate(`/browse${qs ? `?${qs}` : ''}`)
  }

  const openPathfinder = (step = 'start') => setPathfinder({ step })

  return (
    <div className="min-h-screen bg-white">
      <MkHeader partner={partner} onNavigate={onNavigate} joined={joined} onGate={onGate} />

      <PathfinderHero
        partner={partner}
        profile={profile}
        joined={joined}
        onSignup={() => onGate?.('catalog')}
        onStart={() => openPathfinder('start')}
        onEdit={(step) => openPathfinder(step)}
      />

      {profile && <ProfileResults profile={profile} partner={partner} onGate={onGate} onNavigate={onNavigate} />}

      <HowItWorks partner={partner} onGate={onGate} />

      {/* Ally sits directly under the path (2026-08-26): secondary WEIGHT,
          but back up here where the question lands. Someone who has just read
          the four steps and isn't sure which one they're on is exactly who it
          is for. Small on purpose, not buried. */}
      <AllyEntry partner={partner} />

      <WhyAllCampus partner={partner} />

      <StoryCards partner={partner} />

      <LogoStrip
        onSelectSchool={(s) => onNavigate(`/school/${s.id}`)}
        onSeeAll={() => onNavigate('/schools')}
      />

      <LandingFaq />

      {/* Closing CTA: the dark bookend. 2026-08-25 direction — the action
          this page pushes is the account, so the bookend asks for it and the
          pathfinder sits underneath as the way in for anyone not ready. */}
      <section className="bg-gradient-to-br from-mk-teal-600 to-mk-slate py-14 text-center">
        <Heading size="sm" className="text-white">
          {joined ? 'Your matches are saved' : 'Three questions, and you\u2019ll see what fits'}
        </Heading>
        <div className="mt-5">
          <button
            type="button"
            onClick={() => (joined ? goBrowse({}) : openPathfinder('start'))}
            className="inline-flex items-center justify-center gap-2 rounded-md bg-white px-6 py-2.5 font-display text-[14px] font-bold text-mk-teal-700 shadow-[0_8px_20px_rgba(0,0,0,0.18)] transition hover:bg-mk-band"
          >
            {joined ? 'Browse all programs' : 'Answer 3 questions'}
            <span aria-hidden>&rarr;</span>
          </button>
        </div>
      </section>

      <footer className="bg-mk-slate py-8 text-center font-display text-xs text-white/60">
        AllCampus landing-page prototype, throwaway spec with mock data. Not production.
      </footer>

      <Pathfinder
        open={!!pathfinder}
        initialStep={pathfinder?.step || 'start'}
        partner={partner}
        onNavigate={onNavigate}
        onAlly={(school) => setAllyOpen({ school })}
        onComplete={(p, opts) => {
          onProfile?.(p)
          setPathfinder(null)
          // 8/21 decision: sign-up gate at profile completion (attaches the
          // profile to a user), skippable — matches show either way.
          if (opts?.save) onGate?.('catalog')
          setTimeout(
            () => document.getElementById('profile-results')?.scrollIntoView({ behavior: 'smooth' }),
            80,
          )
        }}
        onClose={() => setPathfinder(null)}
      />

      <AllyOverlay open={!!allyOpen} partner={partner} seedContext={allyOpen} onClose={() => setAllyOpen(null)} />
    </div>
  )
}
