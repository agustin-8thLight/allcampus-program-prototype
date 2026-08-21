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
 *  4. Ally (white)
 *  5. Why AllCampus (grey opens here): value tiles + $5,250 cap callout +
 *     the through-AllCampus leakage line
 *  6. Learner stories (grey)
 *  7. Partner school logos + See all schools (grey)
 *  8. FAQ (grey), then the dark CTA bookend -> pathfinder, footer
 *
 * Retired from this page (v2 candidates, components parked): the search-card
 * hero, the skills-navigator variant, the outcome-cards + browse-by-subject
 * band ("supported decision-making beats the browse-by-subject block").
 */
export default function LandingPage({ partner, profile, onProfile, onGate, onNavigate }) {
  const [pathfinder, setPathfinder] = useState(null) // null | { step }
  const [allyOpen, setAllyOpen] = useState(false)

  const goBrowse = (params = {}) => {
    const qs = new URLSearchParams(
      Object.fromEntries(Object.entries(params).filter(([, v]) => v != null && v !== '')),
    ).toString()
    onNavigate(`/browse${qs ? `?${qs}` : ''}`)
  }

  const openPathfinder = (step = 'start') => setPathfinder({ step })

  return (
    <div className="min-h-screen bg-white">
      <MkHeader partner={partner} onNavigate={onNavigate} />

      <PathfinderHero
        partner={partner}
        profile={profile}
        onStart={() => openPathfinder('start')}
        onEdit={(step) => openPathfinder(step)}
        onBrowse={() => goBrowse({})}
      />

      {profile && <ProfileResults profile={profile} partner={partner} onNavigate={onNavigate} />}

      <HowItWorks partner={partner} onGate={onGate} />

      {/* Ally between How and Why (2026-08-21 order): once you've seen the
          path, the talk-it-through outlet is the natural next question. */}
      <AllyEntry partner={partner} />

      <WhyAllCampus partner={partner} />

      <StoryCards partner={partner} />

      <LogoStrip
        onSelectSchool={(s) => onNavigate(`/school/${s.id}`)}
        onSeeAll={() => onNavigate('/schools')}
      />

      <LandingFaq />

      {/* Closing CTA: the dark bookend, now pointing at the pathfinder. */}
      <section className="bg-gradient-to-br from-mk-teal-600 to-mk-slate py-14 text-center">
        <Heading size="sm" className="text-white">Start your profile</Heading>
        <p className="mx-auto mt-2 max-w-md px-5 font-display text-[14px] text-white/80">
          Three questions. We map the rest, and nothing is locked in.
        </p>
        <div className="mt-5">
          <button
            type="button"
            onClick={() => openPathfinder('start')}
            className="inline-flex items-center justify-center rounded-md bg-white px-6 py-2.5 font-display text-[14px] font-bold text-mk-teal-700 shadow-[0_8px_20px_rgba(0,0,0,0.18)] transition hover:bg-mk-band"
          >
            Start your profile
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
        onAlly={() => setAllyOpen(true)}
        onComplete={(p) => {
          onProfile?.(p)
          setPathfinder(null)
          setTimeout(
            () => document.getElementById('profile-results')?.scrollIntoView({ behavior: 'smooth' }),
            80,
          )
        }}
        onClose={() => setPathfinder(null)}
      />

      <AllyOverlay open={allyOpen} partner={partner} onClose={() => setAllyOpen(false)} />
    </div>
  )
}
