import MkHeader from '../components/landing/MkHeader.jsx'
import SearchHero from '../components/landing/SearchHero.jsx'
import AllyEntry from '../components/landing/AllyEntry.jsx'
import BenefitsAndHow from '../components/landing/BenefitsAndHow.jsx'
import GoalsExplorer from '../components/landing/GoalsExplorer.jsx'
import StoryCards from '../components/landing/StoryCards.jsx'
import LogoStrip from '../components/landing/LogoStrip.jsx'
import LandingFaq from '../components/landing/LandingFaq.jsx'
import { Heading, MkButton } from '../components/landing/Section.jsx'

/*
 * Landing page (2026-08-19 Brigid session structure):
 *  1. Hero: search card (Current) or the always-open skills navigator
 *     (Navigator variant; search moves to the nav)
 *  2. BenefitsAndHow: the education benefit + how-this-works, combined into
 *     one band ("the two big benefits, here's how this works")
 *  3. Discovery band: outcome image cards + compact subject-tile strip
 *  4. Learner stories
 *  5. Partner school logos (kept, capped)
 *  6. FAQ
 *  7. Ally: tertiary at the very bottom, generic copy, no promises
 */

export default function LandingPage({ partner, homeVariant = 'current', joined = false, onGate, onNavigate }) {
  const goBrowse = (params = {}) => {
    const qs = new URLSearchParams(
      Object.fromEntries(Object.entries(params).filter(([, v]) => v != null && v !== '')),
    ).toString()
    onNavigate(`/browse${qs ? `?${qs}` : ''}`)
  }

  return (
    <div className="min-h-screen bg-white">
      <MkHeader partner={partner} onNavigate={onNavigate} />

      <SearchHero
        partner={partner}
        navigator={homeVariant === 'navigator'}
        onNavigate={onNavigate}
        onSearch={({ q, area, skill, goal, degree }) => goBrowse({ q, area, skill, goal, degree })}
      />

      {/* 2026-08-19 session: the education-benefit block and the
          how-this-works section combine into one idea. "Here are the two big
          benefits for you, here's how this works." */}
      <BenefitsAndHow partner={partner} joined={joined} onGate={onGate} />

      {/* One discovery band (2026-08-19): outcomes lead as the emotive image
          cards, the four subject tiles ride along as a compact strip inside —
          two entries, one block, no lookalike sections. Tiles open the
          category landing pages (Aug 14 ask). */}
      <div className="pt-16">
        <GoalsExplorer
          partner={partner}
          onSelectGoal={(goal) => goBrowse({ goal: goal.id })}
          onSelectCategory={(c) => onNavigate(`/category/${c.id}`)}
        />
      </div>

      <StoryCards partner={partner} />

      <LogoStrip
        onSelectSchool={(s) => onNavigate(`/school/${s.id}`)}
        onSeeAll={() => onNavigate('/schools')}
      />

      <LandingFaq />

      {/* Ally, tertiary at the very bottom (2026-08-19: "this Alley block is
          the right one to put at the bottom of the page"). Generic copilot
          framing, no out-of-pocket promises. */}
      <AllyEntry partner={partner} />

      {/* Closing CTA band, mirrors the live template's "Unlock your potential" */}
      <section className="bg-mk-band py-14 text-center">
        <Heading size="sm">Unlock your potential</Heading>
        <div className="mt-4">
          <MkButton tone="teal" onClick={() => goBrowse({})}>
            Explore programs
          </MkButton>
        </div>
      </section>

      <footer className="bg-mk-slate py-8 text-center font-display text-xs text-white/60">
        AllCampus landing-page prototype, throwaway spec with mock data. Not production.
      </footer>
    </div>
  )
}
