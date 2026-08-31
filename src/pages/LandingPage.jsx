import { useState } from 'react'
import MkHeader from '../components/landing/MkHeader.jsx'
import SearchHero from '../components/landing/SearchHero.jsx'
import DiscoveryBand from '../components/landing/DiscoveryBand.jsx'
import ProfileResults from '../components/landing/ProfileResults.jsx'
import Pathfinder from '../components/Pathfinder.jsx'
import AllyOverlay from '../components/AllyOverlay.jsx'
import { WhyAllCampus } from '../components/landing/BenefitsAndHow.jsx'
import JourneySteps from '../components/landing/JourneySteps.jsx'
import HelpPair from '../components/landing/HelpPair.jsx'
import StoryCards from '../components/landing/StoryCards.jsx'
import LogoStrip from '../components/landing/LogoStrip.jsx'
import LandingFaq from '../components/landing/LandingFaq.jsx'
import { Heading, MkButton } from '../components/landing/Section.jsx'

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
 *  4. Ally (grey opens here, secondary weight)
 *  5. Why AllCampus (grey): the value card + who-does-what
 *  6. Learner stories (grey)
 *  7. Discovery band (grey, no profile only): breadth of the network, not an
 *     argument. Proof, sitting with the other proof.
 *  8. Partner school logos + See all schools (grey)
 *  9. FAQ (grey), then the dark CTA bookend -> the three questions, footer
 *
 * The outcome-cards + browse-by-subject band was retired here on 2026-08-21
 * ("supported decision-making beats the browse-by-subject block") and is BACK
 * as of 2026-08-26, rebuilt as DiscoveryBand. Both things are true: it shows
 * breadth, and both of its exits are narrowed. See that file's header.
 * Still retired (parked): the search-card hero, the skills-navigator variant.
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

  // 2026-08-27: the three questions are TABLED, so nothing on this page opens
  // the pathfinder any more. It stays mounted and reachable by prop so the
  // profile path can come back without a rebuild.
  const [askedSchool, setAskedSchool] = useState(null)

  const scrollToHelp = () =>
    document.getElementById('get-help')?.scrollIntoView({ behavior: 'smooth', block: 'start' })

  return (
    <div className="min-h-screen bg-white">
      <MkHeader partner={partner} onNavigate={onNavigate} joined={joined} onGate={onGate} />

      {/* 2026-08-28 review: profile capture is cut from v1 ("it introduces a
          little bit more complexity in this first version… revisit and come
          back later") and the search returns to the hero. PathfinderHero and
          ProfileResults stay in the tree, unmounted, so the profile path can
          come back without a rebuild. */}
      <SearchHero
        partner={partner}
        onSearch={(params) => goBrowse(params)}
        onNavigate={onNavigate}
        // onAskSchool carries the school they typed. Discarding it meant someone
        // searched "Metro State", got scrolled to a help block, and had to type
        // it again — the abandonment Brigid described on 2026-08-31. Caught in
        // the handoff inventory.
        onAskSchool={(name) => { setAskedSchool(name || null); scrollToHelp() }}
      />

      {profile && <ProfileResults profile={profile} partner={partner} onGate={onGate} onNavigate={onNavigate} />}

      {/* 2026-08-27, James's note 2: the money explanation runs BEFORE the
          process. The headline promises that using your benefit shouldn't be
          confusing, so the financial confusion it names gets answered before
          anyone is asked to follow five steps. */}
      <WhyAllCampus partner={partner} onNavigate={onNavigate} onSpecialist={scrollToHelp} />

      <JourneySteps partner={partner} />

      <HelpPair partner={partner} askedSchool={askedSchool} joined={joined} onGate={onGate} />

      <StoryCards partner={partner} />

      {/* Breadth, sitting with the other proof rather than competing with the
          pitch (2026-08-27). */}
      {!profile && <DiscoveryBand partner={partner} onNavigate={onNavigate} />}

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
          {joined ? 'Your matches are saved' : 'Ready when you are'}
        </Heading>
        <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
          <MkButton
            tone="light"
            size="lg"
            onClick={() => (joined ? goBrowse({}) : onGate?.('catalog'))}
          >
            {joined ? 'Browse all programs' : 'Get started'}
            <span aria-hidden>&rarr;</span>
          </MkButton>
          {!joined && (
            <MkButton tone="ghostLight" size="lg" onClick={() => goBrowse({})}>
              Browse programs
            </MkButton>
          )}
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

      {/* Persistent launcher (James's note 4), so help isn't limited to the
          one section. He flags the treatment as a rough placeholder: wants a
          read on styling, mobile placement, and whether it rides every page
          or only this one. */}
      <button
        type="button"
        onClick={() => setAllyOpen({})}
        className="fixed bottom-5 right-5 z-40 inline-flex items-center gap-2 rounded-full bg-mk-purple px-5 py-3 font-display text-[15px] font-bold text-white shadow-[0_10px_30px_rgba(123,97,196,0.45)] transition hover:opacity-95"
      >
        <span aria-hidden>&#10022;</span>
        Ask Ally
      </button>

      <AllyOverlay open={!!allyOpen} partner={partner} seedContext={allyOpen} onClose={() => setAllyOpen(null)} />
    </div>
  )
}
